"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {supabaseBrowser} from "../../../lib/supabase-browser";

export default function PortalLogin(){
 const router=useRouter();
 const [email,setEmail]=useState(""),[password,setPassword]=useState("");
 const [error,setError]=useState(""),[info,setInfo]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{void supabaseBrowser.auth.getUser().then(({data})=>{if(data.user)router.replace("/portal");});},[router]);
 async function signIn(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const r=await supabaseBrowser.auth.signInWithPassword({email:email.trim(),password});setBusy(false);if(r.error)setError(r.error.message);else router.replace("/portal");}
 async function recover(){if(!email.trim()){setError("Informe seu e-mail primeiro.");return;}setBusy(true);setError("");const r=await supabaseBrowser.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+"/portal/update-password"});setBusy(false);if(r.error)setError(r.error.message);else setInfo("Se o e-mail estiver cadastrado, você receberá as instruções para redefinir a senha.");}
 const inp:React.CSSProperties={width:"100%",padding:14,background:"#101611",color:"white",border:"1px solid #345039",borderRadius:12,marginBottom:14};
 return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#050805",color:"#f4faf4",padding:20}}>
   <section style={{width:"100%",maxWidth:440,padding:35,border:"1px solid #254328",borderRadius:24,background:"#0b110d"}}>
    <p style={{color:"#71ff41",fontSize:12,letterSpacing:2}}>ALYSSON TECH / PORTAL</p>
    <h1>Área do cliente</h1><p style={{color:"#adb9ae",lineHeight:1.6}}>Gerencie informações, catálogos e canais do seu estabelecimento com segurança.</p>
    <form onSubmit={signIn}><label>E-mail<input style={inp} required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
    <label>Senha<input style={inp} required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <button disabled={busy} style={{width:"100%",padding:14,background:"#71ff41",color:"#071807",border:0,borderRadius:12,fontWeight:700}}>{busy?"Entrando...":"Acessar minha empresa"}</button></form>
    <button disabled={busy} onClick={()=>void recover()} style={{width:"100%",marginTop:18,padding:12,border:0,background:"none",color:"#b6d5b6"}}>Esqueci minha senha</button>
    {error&&<p role="alert" style={{color:"#ff9999"}}>{error}</p>}{info&&<p role="status" style={{color:"#abf5a3"}}>{info}</p>}
    <a href="/" style={{color:"#bac4b9",fontSize:12}}>Voltar ao site Alysson Tech</a>
   </section>
 </main>;
}
