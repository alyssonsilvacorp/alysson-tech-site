"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {supabaseBrowser} from "../../../lib/supabase-browser";

export default function PortalUpdatePassword(){
 const router=useRouter();
 const [password,setPassword]=useState(""),[repeat,setRepeat]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function update(e:React.FormEvent){e.preventDefault();setError("");if(password.length<10||password!==repeat){setError("A senha deve ter pelo menos 10 caracteres e coincidir com a confirmação.");return;}setBusy(true);const r=await supabaseBrowser.auth.updateUser({password});setBusy(false);if(r.error){setError(r.error.message);return;}router.replace("/portal");}
 return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"#050805",color:"white"}}><form onSubmit={update} style={{width:"100%",maxWidth:440,padding:32,border:"1px solid #29412f",borderRadius:22,background:"#0c120e"}}>
 <p style={{color:"#71ff41"}}>ALYSSON TECH</p><h1>Definir minha senha</h1><p>Escolha uma senha pessoal para o portal do seu estabelecimento.</p>
 <label>Nova senha<input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:"block",width:"100%",padding:13,margin:"12px 0",background:"#141e16",color:"white",border:"1px solid #3b533f",borderRadius:9}}/></label>
 <label>Confirmar senha<input type="password" required minLength={10} autoComplete="new-password" value={repeat} onChange={e=>setRepeat(e.target.value)} style={{display:"block",width:"100%",padding:13,margin:"12px 0",background:"#141e16",color:"white",border:"1px solid #3b533f",borderRadius:9}}/></label>
 {error&&<p role="alert" style={{color:"#ff9999"}}>{error}</p>}
 <button disabled={busy} style={{padding:14,background:"#71ff41",color:"#071807",border:0,borderRadius:10,width:"100%"}}>Salvar senha</button>
 </form></main>;
}
