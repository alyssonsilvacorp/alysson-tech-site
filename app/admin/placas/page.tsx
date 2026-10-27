"use client";
import { type CSSProperties, type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "../../../components/admin/AdminShell";
import { supabaseBrowser } from "../../../lib/supabase-browser";

type Plate = {
 code:string; business_name:string|null; destination_url:string|null;
 status:"available"|"active"|"disabled"; plate_type:"smart"|"google_review";
 smart_business_id:string|null; activated_at:string|null;
 created_at:string;updated_at:string;
};
type Business = {id:string;name:string;slug:string;is_published:boolean};
const panel:CSSProperties={background:"#0c140f",border:"1px solid #2b4030",borderRadius:16,padding:18};
const field:CSSProperties={padding:12,border:"1px solid #435547",borderRadius:10,color:"#f3fff3",background:"#090e0b",width:"100%",fontSize:14};
const action:CSSProperties={background:"#77fa57",border:0,borderRadius:10,color:"#102008",padding:"10px 14px",fontWeight:750,cursor:"pointer"};
const secondary:CSSProperties={...action,background:"#1b2920",color:"#e0f1e3",border:"1px solid #35503a"};
const muted:CSSProperties={color:"#afbeaf",fontSize:13};
const label:CSSProperties={display:"block",fontSize:12,color:"#b7cbb9",marginBottom:6};
export default function PlatesPage(){
 const router=useRouter();
 const [gate,setGate]=useState<"checking"|"ok"|"denied">("checking");
 const [plates,setPlates]=useState<Plate[]>([]);
 const [businesses,setBusinesses]=useState<Business[]>([]);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [search,setSearch]=useState("");
 const [filter,setFilter]=useState("all");
 const [page,setPage]=useState(0);
 const [selected,setSelected]=useState<Plate|null>(null);
 const [type,setType]=useState<"smart"|"google_review">("google_review");
 const [businessId,setBusinessId]=useState("");
 const [businessName,setBusinessName]=useState("");
 const [destination,setDestination]=useState("");
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const [reloadId,setReloadId]=useState(0);
 useEffect(()=>{
  let alive=true;
  void (async()=>{
   const {data:{user},error:authError}=await supabaseBrowser.auth.getUser();
   if(!alive)return;
   if(authError||!user){router.replace("/admin/login");return;}
   const member=await supabaseBrowser.from("portal_members").select("role,is_active").eq("user_id",user.id).maybeSingle();
   if(!alive)return;
   if(member.error||member.data?.role!=="admin"||!member.data.is_active){setGate("denied");setLoading(false);return;}
   setGate("ok");
   const [list,companies]=await Promise.all([
    supabaseBrowser.rpc("list_review_plates_extended"),
    supabaseBrowser.from("smart_businesses").select("id,name,slug,is_published").order("name")
   ]);
   if(!alive)return;
   if(list.error)setError("Inventário indisponível: "+list.error.message);
   else setPlates((list.data??[]) as Plate[]);
   if(companies.error)setError("Empresas indisponíveis: "+companies.error.message);
   else setBusinesses((companies.data??[]) as Business[]);
   setLoading(false);
  })();
  return ()=>{alive=false;};
 },[router,reloadId]);
 const stats=useMemo(()=>({total:plates.length,active:plates.filter(p=>p.status==="active").length,available:plates.filter(p=>p.status==="available").length,disabled:plates.filter(p=>p.status==="disabled").length}),[plates]);
 const filtered=useMemo(()=>plates.filter(p=>{
  if(filter!=="all"&&p.status!==filter)return false;
  const needle=search.trim().toLowerCase();
  return !needle||[p.code,p.business_name??"",p.destination_url??""].some(s=>s.toLowerCase().includes(needle));
 }),[plates,filter,search]);
 const visible=filtered.slice(page*12,page*12+12);
 const totalPages=Math.max(1,Math.ceil(filtered.length/12));
 function open(plate:Plate){
  setError("");setMessage("");setSelected(plate);setType(plate.plate_type);setBusinessId(plate.smart_business_id??"");
  setBusinessName(plate.business_name??"");setDestination(plate.destination_url??"");
 }
 async function refresh(){setReloadId(v=>v+1);}
 async function save(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!selected||busy)return;
  setBusy(true);setError("");
  const params={p_code:selected.code,p_action:selected.status==="available"?"activate":"update",p_plate_type:type,p_business_id:type==="smart"?businessId||null:null,p_destination_url:type==="google_review"?destination.trim():null,p_business_name:type==="google_review"?businessName.trim():null};
  const {error:saveError}=await supabaseBrowser.rpc("manage_review_plate",params);
  setBusy(false);
  if(saveError){setError(saveError.message);return;}
  setSelected(null);setMessage("Placa "+selected.code+" configurada. O QR e o NFC mantêm a mesma rota.");await refresh();
 }
 async function setStatus(plate:Plate,newAction:"disable"|"reactivate"){
  if(busy)return;
  if(!window.confirm(newAction==="disable"?"Desativar temporariamente "+plate.code+"? O QR/NFC deixará de redirecionar.":"Reativar "+plate.code+" com a configuração anterior?"))return;
  setBusy(true);setError("");setMessage("");
  const {error:statusError}=await supabaseBrowser.rpc("manage_review_plate",{p_code:plate.code,p_action:newAction});
  setBusy(false);
  if(statusError){setError(statusError.message);return;}
  setMessage("Estado de "+plate.code+" atualizado.");await refresh();
 }
 async function signOut(){await supabaseBrowser.auth.signOut();router.replace("/admin/login");}
 if(gate==="checking")return <main style={{minHeight:"100vh",background:"#070d08",color:"#fff",padding:32}}>Verificando acesso administrativo...</main>;
 if(gate==="denied")return <main style={{minHeight:"100vh",background:"#070d08",color:"#fff",padding:32}}><h1>Acesso restrito</h1><Link href="/admin/login">Entrar como administrador</Link></main>;
 return <AdminShell current="plates" onSignOut={signOut}>
  <header style={{marginBottom:22}}>
   <div style={{fontSize:11,color:"#77fa57",letterSpacing:2}}>ALYSSON TECH / INVENTÁRIO QR + NFC</div>
   <h1 style={{fontSize:"clamp(30px,4vw,44px)",margin:"9px 0"}}>Placas inteligentes.</h1>
   <p style={muted}>Reserve códigos permanentes, escolha o tipo de placa e vincule clientes conforme a venda. O painel do cliente é opcional e configurado na área Usuários.</p>
  </header>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
   {([["TOTAL",stats.total],["DISPONÍVEIS",stats.available],["ATIVAS",stats.active],["DESATIVADAS",stats.disabled]] as const).map(([key,val])=>
    <div key={key} style={panel}><div style={{...muted,fontSize:11,letterSpacing:1}}>{key}</div><strong style={{fontSize:28}}>{loading?"—":val}</strong></div>)}
  </div>
  {message&&<p role="status" style={{...panel,color:"#8cf78c"}}>{message}</p>}
  {error&&<p role="alert" style={{...panel,color:"#ffa5a5"}}>{error}</p>}
  <div style={{display:"flex",gap:12,flexWrap:"wrap",margin:"18px 0"}}>
   <input aria-label="Buscar placa" placeholder="Buscar código, empresa ou destino" style={{...field,flex:"2 1 230px"}} value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}/>
   <select aria-label="Filtrar por situação" style={{...field,flex:"1 1 150px"}} value={filter} onChange={e=>{setFilter(e.target.value);setPage(0);}}>
    <option value="all">Todas as situações</option><option value="available">Disponíveis</option><option value="active">Ativas</option><option value="disabled">Desativadas</option>
   </select>
  </div>
  <p style={{...muted,marginBottom:12}}>{filtered.length} placa(s) encontrada(s). Novas unidades permanecem inativas até você configurá-las.</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
   {visible.map(p=><article key={p.code} style={panel}>
     <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
      <strong style={{fontSize:18}}>{p.code}</strong>
      <span style={{fontSize:11,color:p.status==="active"?"#91f48d":p.status==="disabled"?"#ffadad":"#d4dbd0"}}>{p.status==="active"?"ATIVA":p.status==="disabled"?"DESATIVADA":"DISPONÍVEL"}</span>
     </div>
     <div style={{...muted,marginTop:8,minHeight:44}}>{p.business_name??"Aguardando estabelecimento"}<div>{p.plate_type==="smart"?"Multilink personalizado":"Redirecionamento externo"}</div></div>
     <p title={p.destination_url??""} style={{color:"#a9c8ad",fontSize:11,overflowWrap:"anywhere",minHeight:38}}>{p.destination_url??"Sem destino cadastrado"}</p>
     <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
      {p.status!=="disabled"&&<button type="button" disabled={busy} style={action} onClick={()=>open(p)}>{p.status==="available"?"Ativar":"Editar"}</button>}
      {p.status==="active"&&<button type="button" disabled={busy} style={secondary} onClick={()=>void setStatus(p,"disable")}>Desativar</button>}
      {p.status==="disabled"&&<button type="button" disabled={busy} style={action} onClick={()=>void setStatus(p,"reactivate")}>Reativar</button>}
      <a href={"/r/"+p.code} target="_blank" rel="noreferrer" style={{...secondary,textDecoration:"none",fontSize:12}}>Testar link</a>
     </div>
    </article>)}
  </div>
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:20,gap:14}}>
   <button type="button" style={secondary} disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>Anterior</button>
   <span style={muted}>Página {page+1} de {totalPages}</span>
   <button type="button" style={secondary} disabled={page+1>=totalPages} onClick={()=>setPage(p=>p+1)}>Próxima</button>
  </div>
  {selected&&<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",padding:12}}>
   <div role="dialog" aria-modal="true" aria-label={"Gerenciar "+selected.code} style={{...panel,width:"100%",maxWidth:550,maxHeight:"92vh",overflowY:"auto",padding:24,boxShadow:"0 12px 50px #000"}}>
    <h2 style={{marginTop:0}}>{selected.status==="available"?"Ativar":"Editar"} {selected.code}</h2>
    <p style={muted}>O código permanente /r/{selected.code} nunca será alterado. Escolha o tipo correto antes de imprimir a placa.</p>
    <form onSubmit={save}>
     <label style={{display:"block",marginBottom:15}}><span style={label}>Destino da placa *</span>
      <select style={field} value={type} onChange={e=>setType(e.target.value as "smart"|"google_review")}>
       <option value="google_review">Link externo / Google Review (sem painel obrigatório)</option>
       <option value="smart">Multilink da Alysson Tech (empresa cadastrada)</option>
      </select>
     </label>
     {type==="smart"?<label style={{display:"block",marginBottom:15}}><span style={label}>Multilink da empresa *</span>
      <select required style={field} value={businessId} onChange={e=>setBusinessId(e.target.value)}>
       <option value="">Selecione uma empresa publicada</option>
       {businesses.filter(b=>b.is_published).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <small style={muted}>A empresa poderá receber login posteriormente, se você contratar essa modalidade.</small>
     </label>:<>
      <label style={{display:"block",marginBottom:15}}><span style={label}>Nome do estabelecimento *</span><input required style={field} value={businessName} onChange={e=>setBusinessName(e.target.value)}/></label>
      <label style={{display:"block",marginBottom:15}}><span style={label}>URL HTTPS de destino *</span><input type="url" pattern="https://.*" required style={field} placeholder="https://..." value={destination} onChange={e=>setDestination(e.target.value)}/></label>
     </>}
     <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
      <button disabled={busy} style={action}>{busy?"Salvando...":"Confirmar configuração"}</button>
      <button type="button" disabled={busy} style={secondary} onClick={()=>{setSelected(null);setError("");}}>Cancelar</button>
     </div>
    </form>
    {error&&<p role="alert" style={{color:"#ffaaaa",marginTop:12}}>{error}</p>}
   </div>
  </div>}
 </AdminShell>;
}
