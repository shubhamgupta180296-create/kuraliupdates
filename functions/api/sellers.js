import {json,readJson,clean,currentUser,requireRole} from "../_utils.js";
export async function onRequestPost({request,env}){
 const u=await currentUser(request,env);if(!u)return json({error:"Login required"},401);
 const b=await readJson(request),owner=clean(b?.owner,100),business=clean(b?.business,150),phone=clean(b?.phone,20),category=clean(b?.category,60),address=clean(b?.address,500);
 if(!owner||!business||!phone||!category||!address)return json({error:"All fields are required"},400);
 const existing=await env.DB.prepare("SELECT id FROM sellers WHERE user_id=?").bind(u.id).first();if(existing)return json({error:"Seller profile already exists"},409);
 const r=await env.DB.prepare("INSERT INTO sellers(user_id,owner_name,business_name,phone,category,address) VALUES(?,?,?,?,?,?)").bind(u.id,owner,business,phone,category,address).run();
 await env.DB.prepare("UPDATE users SET role='seller' WHERE id=? AND role='customer'").bind(u.id).run();
 return json({success:true,id:r.meta.last_row_id,status:"pending"});
}
export async function onRequestGet({request,env}){const u=await currentUser(request,env);if(!u)return json({error:"Login required"},401);const s=await env.DB.prepare("SELECT * FROM sellers WHERE user_id=?").bind(u.id).first();return json(s||null)}
