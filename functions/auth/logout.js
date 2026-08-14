import {json,clearCookie,currentUser,sha256} from "../_utils.js";
export async function onRequestPost({request,env}){
 const raw=(request.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith("ku_session="))?.split("=")[1];
 if(raw)await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await sha256(raw)).run();
 return json({success:true},200,{"Set-Cookie":clearCookie("ku_session")});
}
