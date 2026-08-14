export function json(data,status=200,headers={}) {
 return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8",...headers}});
}
export async function readJson(req){try{return await req.json()}catch{return null}}
export function clean(v,max=5000){return typeof v==="string"?v.trim().slice(0,max):""}
export function randomToken(){const a=new Uint8Array(32);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,"0")).join("")}
export async function sha256(s){const b=new TextEncoder().encode(s);const h=await crypto.subtle.digest("SHA-256",b);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join("")}
export async function passwordHash(password,salt){
 const material=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
 const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode(salt),iterations:100000,hash:"SHA-256"},material,256);
 return [...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
export function cookie(name,value,maxAge){return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}
export function clearCookie(name){return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`}
export async function currentUser(req,env){
 const raw=(req.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith("ku_session="))?.split("=")[1];
 if(!raw)return null;
 const hash=await sha256(raw);
 return await env.DB.prepare("SELECT u.id,u.name,u.email,u.phone,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?").bind(hash,Math.floor(Date.now()/1000)).first();
}
export function requireRole(user,roles=[]){return user&&roles.includes(user.role)}
export function rid(prefix){return prefix+"-"+new Date().getFullYear()+"-"+randomToken().slice(0,12).toUpperCase()}
