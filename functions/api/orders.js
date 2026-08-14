import {json,readJson,clean,currentUser,rid} from "../_utils.js";
export async function onRequestPost({request,env}){
 const u=await currentUser(request,env);if(!u)return json({error:"Please login before ordering"},401);
 const b=await readJson(request),items=Array.isArray(b?.items)?b.items:[],name=clean(b?.name,100),phone=clean(b?.phone,20),address=clean(b?.address,500);
 if(!name||!phone||!address||!items.length)return json({error:"Customer details and cart are required"},400);
 let total=0,rows=[];
 for(const i of items){const pid=Number(i.product_id),qty=Number(i.quantity);if(!pid||qty<1||qty>99)return json({error:"Invalid cart item"},400);const p=await env.DB.prepare("SELECT * FROM products WHERE id=? AND status='approved'").bind(pid).first();if(!p||p.stock<qty)return json({error:"A product is unavailable or out of stock"},409);total+=p.price_paise*qty;rows.push({p,qty})}
 const no=rid("KORD"),o=await env.DB.prepare("INSERT INTO orders(order_no,user_id,customer_name,phone,address,total_paise) VALUES(?,?,?,?,?,?)").bind(no,u.id,name,phone,address,total).run();
 for(const x of rows){await env.DB.prepare("INSERT INTO order_items(order_id,product_id,seller_id,quantity,unit_price_paise) VALUES(?,?,?,?,?)").bind(o.meta.last_row_id,x.p.id,x.p.seller_id,x.qty,x.p.price_paise).run();await env.DB.prepare("UPDATE products SET stock=stock-? WHERE id=?").bind(x.qty,x.p.id).run()}
 return json({success:true,order_no:no,total_paise:total,status:"placed"});
}
export async function onRequestGet({request,env}){const u=await currentUser(request,env);if(!u)return json({error:"Login required"},401);const {results}=await env.DB.prepare("SELECT order_no,total_paise,status,created_at FROM orders WHERE user_id=? ORDER BY id DESC").bind(u.id).all();return json(results)}
