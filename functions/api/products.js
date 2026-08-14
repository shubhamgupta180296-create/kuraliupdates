import {json,readJson,clean,currentUser,requireRole} from "../_utils.js";
export async function onRequestGet({env}) {
 const {results}=await env.DB.prepare("SELECT p.id,p.name,p.description,p.price_paise,p.category,p.image_url,p.stock,s.business_name seller,s.id seller_id FROM products p JOIN sellers s ON s.id=p.seller_id WHERE p.status='approved' AND s.status='approved' ORDER BY p.id DESC").all();
 return json(results);
}
export async function onRequestPost({request,env}) {
 const u=await currentUser(request,env);if(!requireRole(u,["seller","admin"]))return json({error:"Seller login required"},401);
 const s=await env.DB.prepare("SELECT * FROM sellers WHERE user_id=? AND status='approved'").bind(u.id).first();if(!s)return json({error:"Seller approval required"},403);
 const b=await readJson(request),name=clean(b?.name,150),description=clean(b?.description,1500),category=clean(b?.category,60),image=clean(b?.image_url,500),price=Number(b?.price_paise),stock=Number(b?.stock);
 if(!name||!category||!Number.isInteger(price)||price<0||!Number.isInteger(stock)||stock<0)return json({error:"Invalid product data"},400);
 const r=await env.DB.prepare("INSERT INTO products(seller_id,name,description,price_paise,category,image_url,stock) VALUES(?,?,?,?,?,?,?)").bind(s.id,name,description,price,category,image,stock).run();
 return json({success:true,id:r.meta.last_row_id,status:"pending"});
}
