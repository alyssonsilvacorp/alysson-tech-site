"use client";

import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import AdminShell from "./AdminShell";
import CompanyBrandEditor from "./CompanyBrandEditor";
import UnifiedCatalogManager from "./UnifiedCatalogManager";
import {supabaseBrowser} from "../../lib/supabase-browser";

export default function UnifiedCatalogAdminPage({section}:{section:"empresas"|"catalogos"}){
 const router=useRouter();
 const [gate,setGate]=useState<"checking"|"ok"|"denied">("checking");
 useEffect(()=>{let live=true;void(async()=>{
  const r=await supabaseBrowser.auth.getUser();if(!live)return;
  if(r.error||!r.data.user){router.replace("/admin/login");return;}
  const m=await supabaseBrowser.from("portal_members").select("role,is_active").eq("user_id",r.data.user.id).maybeSingle();
  if(!live)return;
  setGate(!m.error&&m.data?.role==="admin"&&m.data.is_active?"ok":"denied");
 })();return()=>{live=false};},[router]);
 async function signOut(){await supabaseBrowser.auth.signOut();router.replace("/admin/login");}
 if(gate==="checking")return <main style={{background:"#080e0b",color:"white",padding:35,minHeight:"100vh"}}>Verificando acesso ao Control Center...</main>;
 if(gate==="denied")return <main style={{background:"#080e0b",color:"white",padding:35,minHeight:"100vh"}}><h1>Acesso restrito</h1><Link href="/admin/login">Entrar como administrador</Link></main>;
 return <AdminShell current={section==="empresas"?"companies":"catalogs"} onSignOut={signOut}>
  <header style={{margin:"0 0 23px"}}>
   <p style={{color:"#98e988",fontSize:11,letterSpacing:2,marginBottom:10}}>ALYSSON TECH / OPERAÇÃO</p>
   <h1 style={{fontSize:"clamp(30px,4vw,44px)",margin:"0 0 7px",letterSpacing:"-.035em"}}>{section==="empresas"?"Empresas e identidade visual":"Catálogos digitais"}</h1>
   <p style={{color:"#a5baa8",fontSize:13,maxWidth:690,lineHeight:1.65,margin:0}}>{section==="empresas"?"Cadastre uma vez. A logo, as cores e o WhatsApp serão usados pelo Multilink e pelo catálogo.":"Monte, pré-visualize e publique um catálogo com link permanente. O mesmo cadastro alimenta o Multilink e a loja digital."}</p>
  </header>
  {section==="empresas"?<CompanyBrandEditor/>:<UnifiedCatalogManager/>}
 </AdminShell>;
}
