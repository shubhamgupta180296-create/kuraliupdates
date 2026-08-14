import {json,readJson,clean,currentUser,rid} from "../_utils.js";
export async function onRequestPost({request,env}){
 const u=await currentUser(request,env),b=await readJson(request),name=clean(b?.name,100),phone=clean(b?.phone,20),issue=clean(b?.issue,100),details=clean(b?.details,3000),ward=Number(b?.ward);
 if(!name||!phone||!issue||!details||!ward)return json({error:"All fields are required"},400);
 const no=rid("KU");const r=await env.DB.prepare("INSERT INTO complaints(complaint_no,user_id,name,phone,ward_id,issue_type,details) VALUES(?,?,?,?,?,?,?)").bind(no,u?.id||null,name,phone,ward,issue,details).run();
 await env.DB.prepare("INSERT INTO complaint_updates(complaint_id,status,note) VALUES(?,?,?)").bind(r.meta.last_row_id,"submitted","Complaint received").run();
 return json({success:true,complaint_no:no,status:"submitted"});
}
export async function onRequestGet({request,env}){
 const u=new URL(request.url),no=u.searchParams.get("complaint_no");if(!no)return json({error:"Complaint number required"},400);
 const c=await env.DB.prepare("SELECT c.*,w.ward_number,w.mc_name,w.mc_phone,w.mc_email FROM complaints c JOIN wards w ON w.id=c.ward_id WHERE c.complaint_no=?").bind(no).first();
 if(!c)return json({error:"Complaint not found"},404);
 const {results}=await env.DB.prepare("SELECT status,note,created_at FROM complaint_updates WHERE complaint_id=? ORDER BY id").bind(c.id).all();
 return json({...c,updates:results});
}
