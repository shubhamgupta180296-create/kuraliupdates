import {json,currentUser} from "../_utils.js";
export async function onRequestGet({request,env}){const u=await currentUser(request,env);return json({user:u||null})}
