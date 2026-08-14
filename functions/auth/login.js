import {json,readJson,clean,passwordHash,randomToken,sha256,cookie} from "../_utils.js";
export async function onRequestPost({request,env}){
 const b=await readJson(request),email=clean(b?.email,150).toLowerCase(),password=String(b?.password||"");
 const u=await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(email).first();
 if(!u||await passwordHash(password,u.password_salt)!==u.password_hash)return json({error:"Invalid email or password"},401);
 const token=randomToken();await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(await sha256(token),u.id,Math.floor(Date.now()/1000)+60*60*24*30).run();
 return json({success:true,user:{id:u.id,name:u.name,email:u.email,role:u.role}},200,{"Set-Cookie":cookie("ku_session",token,60*60*24*30)});
}
