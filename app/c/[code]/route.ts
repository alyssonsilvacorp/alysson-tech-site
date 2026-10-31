import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:Promise<{code:string}>}){
 const {code}=await params;
 if(!/^AT-C\d{3}$/.test(code))return new Response("Código inválido",{status:404});
 const r=await supabase.from("smart_catalog_routes").select("status,business_id").eq("code",code).eq("status","active").maybeSingle();
 if(r.error)return new Response("Falha temporária",{status:503});
 if(!r.data?.business_id)return new Response("Catálogo não configurado",{status:404});
 const b=await supabase.from("smart_businesses").select("slug").eq("id",r.data.business_id).maybeSingle();
 if(b.error||!b.data)return new Response("Catálogo indisponível",{status:404});
 const url=new URL("/p/"+encodeURIComponent(b.data.slug)+"/catalogo",request.url);
 const response=NextResponse.redirect(url,307);
 response.headers.set("Cache-Control","no-store, max-age=0");
 return response;
}
