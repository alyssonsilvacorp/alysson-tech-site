"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "../../../components/admin/AdminShell";
import UnifiedCatalogManager from "../../../components/admin/UnifiedCatalogManager";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function IzalyTechAdminPage(){
 const router=useRouter();
 const [gate,setGate]=useState<"checking"|"ok"|"denied">("checking");
 useEffect(()=>{
  let active=true;
  void (async()=>{
   const result=await supabaseBrowser.auth.getUser();
   if(!active)return;
   if(result.error||!result.data.user){router.replace("/admin/login");return;}
   const membership=await supabaseBrowser.from("portal_members").select("role,is_active").eq("user_id",result.data.user.id).maybeSingle();
   if(!active)return;
   setGate(!membership.error&&membership.data?.role==="admin"&&membership.data.is_active?"ok":"denied");
  })();
  return()=>{active=false};
 },[router]);
 async function signOut(){await supabaseBrowser.auth.signOut();router.replace("/admin/login");}
 if(gate==="checking")return <main style={{background:"#050a13",color:"#e7f1ff",padding:36,minHeight:"100vh"}}>Verificando acesso administrativo...</main>;
 if(gate==="denied")return <main style={{background:"#050a13",color:"#e7f1ff",padding:36,minHeight:"100vh"}}><h1>Acesso restrito</h1><p>Somente o administrador autorizado pode gerenciar produtos da IZALY Tech.</p><Link href="/admin/login" style={{color:"#75b8ff"}}>Entrar com conta administrativa</Link></main>;
 return <AdminShell current="catalogs" onSignOut={signOut}>
  <header style={{background:"linear-gradient(120deg,#102b54,#07101d)",border:"1px solid #28538b",padding:"26px",borderRadius:20,marginBottom:24,color:"#f2f7ff"}}>
   <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:"#76baff"}}>IZALY TECH PREMIUM · CONTROL CENTER</div>
   <h1 style={{fontSize:"clamp(28px,4vw,43px)",letterSpacing:"-.035em",margin:"12px 0 8px"}}>Administração da loja.</h1>
   <p style={{fontSize:14,lineHeight:1.7,maxWidth:740,color:"#b8cde8"}}>Cadastre produtos reais com fotos, SKU, categorias e valores. A publicação é independente do multilink. O carrinho envia solicitações para Maceió pelo WhatsApp; não há cobranças automáticas nesta fase.</p>
   <nav style={{display:"flex",gap:15,flexWrap:"wrap",fontSize:13,marginTop:16}}>
    <Link href="/p/izaly-tech/catalogo" style={{color:"#92c5ff"}}>Prévia pública ↗</Link>
    <Link href="/p/izaly-tech/carrinho" style={{color:"#92c5ff"}}>Fluxo de carrinho ↗</Link>
    <Link href="/p/izaly-tech" style={{color:"#92c5ff"}}>Multilink ↗</Link>
   </nav>
  </header>
  <UnifiedCatalogManager fixedSlug="izaly-tech"/>
 </AdminShell>;
}
