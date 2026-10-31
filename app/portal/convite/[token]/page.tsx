"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../../lib/supabase-browser";

const card:React.CSSProperties={background:"#0d1711",border:"1px solid #31513b",borderRadius:18,padding:"28px",width:"100%",maxWidth:480,boxShadow:"0 12px 40px #0008"};
const field:React.CSSProperties={width:"100%",background:"#0a100c",border:"1px solid #506550",color:"#fff",borderRadius:10,padding:12,marginTop:5,marginBottom:16,fontSize:15};
const green:React.CSSProperties={background:"#77fa57",color:"#102210",border:0,borderRadius:10,padding:"12px 18px",cursor:"pointer",fontWeight:700};
export default function ClaimInvitePage(){
 const {token}=useParams<{token:string}>();
 const router=useRouter();
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [repeatPassword,setRepeatPassword]=useState("");
 const [mode,setMode]=useState<"login"|"register">("register");
 const [busy,setBusy]=useState(false);
 const [currentUser,setCurrentUser]=useState(false);
 const [note,setNote]=useState("");
 const [error,setError]=useState("");
 async function claim(){
  if(!/^[0-9a-f-]{36}$/i.test(token)){setError("Este convite é inválido.");return;}
  setBusy(true);setError("");
  const {error:claimError}=await supabaseBrowser.rpc("claim_smart_business_invite",{p_token:token});
  setBusy(false);
  if(claimError){setError(claimError.message);return;}
  router.replace("/portal");
 }
 useEffect(()=>{
  let live=true;
  void (async()=>{
   const {data:{user}}=await supabaseBrowser.auth.getUser();
   if(!live)return;
   setCurrentUser(!!user);
  })();
  return()=>{live=false;};
 },[]);
 async function onSubmit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(busy)return;
  setBusy(true);setError("");setNote("");
  if(mode==="register"){
   if(password.length<10||password!==repeatPassword){setBusy(false);setError("Crie uma senha com pelo menos 10 caracteres e confirme-a corretamente.");return;}
   const result=await supabaseBrowser.auth.signUp({email:email.trim().toLowerCase(),password,options:{emailRedirectTo:window.location.origin+"/portal/convite/"+token}});
   setBusy(false);
   if(result.error){setError(result.error.message);return;}
   if(result.data.session){setCurrentUser(true);setNote("Conta criada. Aceite o convite para entrar no seu painel.");}
   else {setNote("Confira a caixa de entrada e confirme seu e-mail. Depois volte a este mesmo link e entre com a sua conta.");setMode("login");}
  } else {
   const result=await supabaseBrowser.auth.signInWithPassword({email:email.trim(),password});
   setBusy(false);
   if(result.error){setError(result.error.message);return;}
   setCurrentUser(true);setNote("Conta autenticada. Agora aceite o convite da empresa.");
  }
 }
 return <main style={{minHeight:"100vh",background:"radial-gradient(ellipse at top,#16331d,#060d08 65%)",color:"#f2fff2",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui,sans-serif"}}>
  <section style={card}>
   <div style={{color:"#80fc59",fontSize:12,letterSpacing:2}}>ALYSSON TECH / PORTAL DO CLIENTE</div>
   <h1 style={{fontSize:29,marginBottom:8}}>Acesso à sua empresa</h1>
   <p style={{color:"#c0cfc2",fontSize:14,lineHeight:1.6}}>Este convite dá acesso somente aos recursos liberados para você. Use o mesmo e-mail informado pelo responsável da Alysson Tech.</p>
   {error&&<p role="alert" style={{padding:12,border:"1px solid #784343",borderRadius:8,color:"#ffb7b7"}}>{error}</p>}
   {note&&<p role="status" style={{padding:12,border:"1px solid #365d42",borderRadius:8,color:"#bafeb7"}}>{note}</p>}
   {currentUser?<div>
    <p style={{color:"#c0cfc2"}}>Sua conta está conectada. Para confirmar o vínculo com a empresa, aceite o convite.</p>
    <button style={green} type="button" onClick={()=>void claim()} disabled={busy}>{busy?"Verificando...":"Aceitar convite e abrir painel"}</button>
    <button type="button" onClick={()=>void(async()=>{await supabaseBrowser.auth.signOut();setCurrentUser(false);setError("");setNote("");})()} style={{...green,background:"#233b2a",color:"#fff",marginLeft:8,marginTop:8}}>Trocar de conta</button>
   </div>:<>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
     <button type="button" style={{...green,background:mode==="register"?"#77fa57":"#223829",color:mode==="register"?"#102210":"#fff"}} onClick={()=>setMode("register")}>Criar conta</button>
     <button type="button" style={{...green,background:mode==="login"?"#77fa57":"#223829",color:mode==="login"?"#102210":"#fff"}} onClick={()=>setMode("login")}>Já tenho conta</button>
    </div>
    <form onSubmit={onSubmit}>
     <label>E-mail convidado<input autoComplete="email" type="email" required style={field} value={email} onChange={e=>setEmail(e.target.value)}/></label>
     <label>Senha<input autoComplete={mode==="register"?"new-password":"current-password"} type="password" required minLength={mode==="register"?10:1} style={field} value={password} onChange={e=>setPassword(e.target.value)}/></label>
     {mode==="register"&&<label>Confirme sua senha<input autoComplete="new-password" type="password" required minLength={10} style={field} value={repeatPassword} onChange={e=>setRepeatPassword(e.target.value)}/></label>}
     {mode==="register"&&<p style={{fontSize:12,color:"#b6cab8",lineHeight:1.55,margin:"-4px 0 16px"}}>Use uma senha pessoal com pelo menos 10 caracteres. O e-mail de confirmação deverá trazer você de volta a esta página de convite.</p>}
     <button style={green} disabled={busy}>{busy?"Aguarde...":mode==="register"?"Criar minha conta":"Entrar e continuar"}</button>
    </form>
   </>}
   <p style={{fontSize:12,marginTop:22,color:"#afc0b0"}}>O convite é individual, expira em 14 dias e só pode ser utilizado com o e-mail indicado.</p>
   <Link href="https://alyssontech.com.br" style={{color:"#a5ff92"}}>Voltar ao site Alysson Tech</Link>
  </section>
 </main>;
}
