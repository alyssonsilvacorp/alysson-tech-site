import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request:Request){
 try {
  const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")??"";
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!publicKey||!secret) return NextResponse.json({error:"Convites não configurados no servidor."},{status:503});
  if(!token)return NextResponse.json({error:"Sessão obrigatória."},{status:401});
  const client=createClient(url,publicKey,{global:{headers:{Authorization:"Bearer "+token}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:authError}=await client.auth.getUser(token);
  if(authError||!user)return NextResponse.json({error:"Sessão inválida."},{status:401});
  const member=await client.from("portal_members").select("role,is_active").eq("user_id",user.id).maybeSingle();
  if(member.error||!member.data?.is_active||member.data.role!=="admin")return NextResponse.json({error:"Acesso restrito ao administrador."},{status:403});
  const body=await request.json();
  const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
  const businessId=typeof body.business_id==="string"?body.business_id:"";
  const role=body.member_role;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(businessId)||!["owner","editor","viewer"].includes(role)){
   return NextResponse.json({error:"E-mail, empresa ou papel inválido."},{status:400});
  }
  const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const found=await admin.from("smart_businesses").select("id").eq("id",businessId).maybeSingle();
  if(found.error||!found.data)return NextResponse.json({error:"Empresa não encontrada."},{status:404});
  const redirectTo=(process.env.NEXT_PUBLIC_SITE_URL||"https://alyssontech.com.br").replace(/\/$/,"")+"/portal/update-password";
  const invited=await admin.auth.admin.inviteUserByEmail(email,{redirectTo});
  if(invited.error||!invited.data.user)return NextResponse.json({error:"Não foi possível enviar convite: "+(invited.error?.message??"erro desconhecido")},{status:400});
  const permissions={
   business_id:businessId,user_id:invited.data.user.id,member_role:role,
   can_edit_profile:role==="viewer"?false:body.can_edit_profile===true,
   can_edit_catalog:role==="viewer"?false:body.can_edit_catalog===true,
   can_edit_payment:role==="viewer"?false:body.can_edit_payment===true,
   is_active:true
  };
  const assigned=await admin.from("smart_business_members").upsert(permissions,{onConflict:"business_id,user_id"});
  if(assigned.error)return NextResponse.json({error:"Convite emitido, mas vínculo não foi salvo. Requer correção do administrador."},{status:500});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Não foi possível processar o convite."},{status:500});}
}
