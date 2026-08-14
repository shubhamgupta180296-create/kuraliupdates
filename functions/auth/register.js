import {json,readJson,clean,passwordHash,randomToken,sha256,cookie} from "../_utils.js";
export async function onRequestPost({request,env}){
 const b=await readJson(request), name=clean(b?.name,100), email=clean(b?.email,150).toLowerCase(), phone=clean(b?.phone,20), password=String(b?.password||"");
 if(!name||!email||!password||password.length<8)return json({error:"Name, valid email and password of at least 8 characters are required"},400);
 if(await env.DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first())return json({error:"Email already registered"},409);
 const salt=randomToken(), hash=await passwordHash(password,salt);
 const r=await env.DB.prepare("INSERT INTO users(name,email,phone,password_hash,password_salt) VALUES(?,?,?,?,?)").bind(name,email,phone,hash,salt).run();
 const token=randomToken();await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(await sha256(token),r.meta.last_row_id,Math.floor(Date.now()/1000)+60*60*24*30).run();
 return json({success:true,user:{name,email,role:"customer"}},200,{"Set-Cookie":cookie("ku_session",token,60*60*24*30)});
}
