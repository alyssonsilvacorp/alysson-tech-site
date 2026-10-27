"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {supabaseBrowser} from "../../lib/supabase-browser";

type Membership={business_id:string;member_role:string;can_edit_profile:boolean;can_edit_catalog:boolean;can_edit_payment:boolean};
type Business={id:string;name:string;short_description:string|null;whatsapp_number:string|null;instagram_url:string|null;slug:string;is_published:boolean};
type Item={id:string;business_id:string;name:string;description:string|null;price:number|null;image_url:string|null;sku:string|null;audience:string|null;frame_type:string|null;availability:string;is_active:boolean;sort_order:number};
const panel:React.CSSProperties={background:"#111914",border:"1px solid #25402d",borderRadius:16,padding:20,marginBottom:20};
const field:React.CSSProperties={width:"100%",padding:13,border:"1px solid #39503c",borderRadius:10,color:"#f2fff2",background:"#0b100d",fontSize:14};
const button:React.CSSProperties={padding:"12px 18px",background:"#71ff41",color:"#092006",border:0,borderRadius:10,fontWeight:700,cursor:"pointer"};
const button2:React.CSSProperties={...button,background:"#1e3023",color:"#ecf6ee",border:"1px solid #3c5942"};
const mini:React.CSSProperties={display:"block",color:"#a8b6a9",fontSize:12,marginBottom:5};

export default function PortalHome(){
 const router=useRouter();
 const [checking,setChecking]=useState(true);
 const [userId,setUserId]=useState("");
 const [memberships,setMemberships]=useState<Membership[]>([]);
 const [businessId,setBusinessId]=useState("");
 const [business,setBusiness]=useState<Business|null>(null);
 const [items,setItems]=useState<Item[]>([]);
 const [pix,setPix]=useState("");
 const [draftPix,setDraftPix]=useState("");
 const [contact,setContact]=useState({whatsapp:"",instagram:"",description:""});
 const [name,setName]=useState(""),[description,setDescription]=useState(""),[price,setPrice]=useState(""),[imageUrl,setImageUrl]=useState("");
 const [audience,setAudience]=useState(""),[frameType,setFrameType]=useState(""),[sku,setSku]=useState("");
 const [availability,setAvailability]=useState("disponivel");
 const [photo,setPhoto]=useState<File|null>(null);
 const [editId,setEditId]=useState<string|null>(null);
 const [showForm,setShowForm]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const access=useMemo(()=>memberships.find(m=>m.business_id===businessId),[memberships,businessId]);
 const canProfile=!!access&&access.member_role!=="viewer"&&access.can_edit_profile;
 const canCatalog=!!access&&access.member_role!=="viewer"&&access.can_edit_catalog;
 const canPayment=!!access&&access.member_role!=="viewer"&&access.can_edit_payment;

 useEffect(()=>{
  let alive=true;
  async function init(){
   const r=await supabaseBrowser.auth.getUser();
   if(!alive)return;
   if(r.error||!r.data.user){router.replace("/portal/login");return;}
   setUserId(r.data.user.id);
   const q=await supabaseBrowser.from("smart_business_members").select("business_id,member_role,can_edit_profile,can_edit_catalog,can_edit_payment").eq("user_id",r.data.user.id).eq("is_active",true);
   if(!alive)return;
   if(q.error)setError("Acesso à empresa indisponível: "+q.error.message);
   setMemberships((q.data??[]) as Membership[]);
   setBusinessId(q.data?.[0]?.business_id??"");
   setChecking(false);
  }
  void init();return()=>{alive=false;};
 },[router]);
 const reload=useCallback(async(id:string)=>{
  const [b,p,a]=await Promise.all([
   supabaseBrowser.from("smart_businesses").select("id,name,slug,short_description,whatsapp_number,instagram_url,is_published").eq("id",id).maybeSingle(),
   supabaseBrowser.from("smart_business_services").select("id,business_id,name,description,price,image_url,sku,audience,frame_type,availability,is_active,sort_order").eq("business_id",id).order("sort_order"),
   supabaseBrowser.from("smart_business_actions").select("config").eq("business_id",id).eq("action_type","pix").maybeSingle()
  ]);
  if(b.error){setError(b.error.message);return;}
  setBusiness(b.data as Business);
  setItems((p.data??[]) as Item[]);
  setContact({whatsapp:b.data?.whatsapp_number??"",instagram:b.data?.instagram_url??"",description:b.data?.short_description??""});
  const config=a.data?.config as Record<string,unknown>|undefined;
  const key=typeof config?.pix_key==="string"?config.pix_key:typeof config?.pix_copia_e_cola==="string"?config.pix_copia_e_cola:"";
  setPix(key);setDraftPix(key);
 },[]);
 useEffect(()=>{if(businessId)void reload(businessId);},[businessId,reload]);

 function success(msg:string){setError("");setMessage(msg);}
 async function saveContact(e:React.FormEvent){e.preventDefault();if(!canProfile||!businessId)return;setBusy(true);setError("");const r=await supabaseBrowser.rpc("update_smart_business_contact",{p_business_id:businessId,p_whatsapp:contact.whatsapp,p_instagram:contact.instagram,p_description:contact.description});setBusy(false);if(r.error)setError(r.error.message);else{success("Informações atualizadas.");await reload(businessId);}}
 async function savePix(e:React.FormEvent){e.preventDefault();if(!canPayment||!businessId)return;setBusy(true);setError("");const r=await supabaseBrowser.rpc("update_smart_business_pix",{p_business_id:businessId,p_pix_key:draftPix.trim()});setBusy(false);if(r.error)setError(r.error.message);else{success("Chave Pix atualizada.");await reload(businessId);}}
 function begin(item?:Item){setEditId(item?.id??null);setName(item?.name??"");setDescription(item?.description??"");setPrice(item?.price==null?"":String(item.price));setImageUrl(item?.image_url??"");setAudience(item?.audience??"");setFrameType(item?.frame_type??"");setSku(item?.sku??"");setAvailability(item?.is_active?"disponivel":item?.availability==="vendido"?"vendido":"oculto");setPhoto(null);setShowForm(true);}
 async function saveItem(e:React.FormEvent){e.preventDefault();if(!canCatalog||!businessId)return;setError("");setBusy(true);
  if(!editId&&!photo&&!imageUrl.trim()){setBusy(false);setError("Para cadastrar um item, anexe uma foto.");return;}
  let publicUrl=imageUrl.trim()||null;
  if(photo){
   if(!["image/jpeg","image/png","image/webp"].includes(photo.type)||photo.size>3*1024*1024){setBusy(false);setError("A imagem precisa ser JPEG, PNG ou WebP, até 3 MB.");return;}
   const ext=photo.type==="image/png"?"png":photo.type==="image/webp"?"webp":"jpg";
   const path=businessId+"/"+crypto.randomUUID()+"."+ext;
   const up=await supabaseBrowser.storage.from("business-media").upload(path,photo,{contentType:photo.type,upsert:false});
   if(up.error){setBusy(false);setError("Falha no envio da imagem: "+up.error.message);return;}
   publicUrl=supabaseBrowser.storage.from("business-media").getPublicUrl(path).data.publicUrl;
  }
  const amount=price.trim()===""?null:Number(price.trim().replace(",","."));
  if(amount!==null&&(!Number.isFinite(amount)||amount<0)){setBusy(false);setError("Preço inválido.");return;}
  const record={name:name.trim(),description:description.trim()||null,price:amount,image_url:publicUrl,sku:sku.trim()||null,audience:audience.trim()||null,frame_type:frameType.trim()||null,is_active:availability==="disponivel",availability};
  const result=editId?await supabaseBrowser.from("smart_business_services").update(record).eq("id",editId).eq("business_id",businessId)
   :await supabaseBrowser.from("smart_business_services").insert({...record,business_id:businessId,sort_order:items.length});
  setBusy(false);if(result.error){setError(result.error.message);return;}
  setShowForm(false);success("Catálogo salvo. Atualize o multilink para conferir.");await reload(businessId);
 }
 async function changeAvailability(item:Item,available:boolean){if(!canCatalog)return;setError("");const r=await supabaseBrowser.from("smart_business_services").update({is_active:available,availability:available?"disponivel":"vendido"}).eq("id",item.id).eq("business_id",businessId);if(r.error)setError(r.error.message);else{success("Disponibilidade atualizada.");await reload(businessId);}}
 async function logOut(){await supabaseBrowser.auth.signOut();router.replace("/portal/login");}
 if(checking)return <main style={{minHeight:"100vh",background:"#050805",color:"white",padding:32}}>Carregando seu acesso...</main>;
 return <main style={{background:"#050805",color:"#f2f7f2",minHeight:"100vh",padding:"24px 16px"}}>
  <div style={{maxWidth:1040,margin:"0 auto"}}>
   <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:25}}><div><p style={{fontSize:12,letterSpacing:2,color:"#71ff41"}}>ALYSSON TECH / PORTAL</p><h1 style={{margin:"5px 0"}}>Minha empresa</h1><p style={{fontSize:12,color:"#a3b0a5"}}>Seu ambiente de edição, sem mexer no código do site.</p></div><button onClick={()=>void logOut()} style={button2}>Sair</button></header>
   {error&&<p role="alert" style={{...panel,color:"#ffb2b2"}}>{error}</p>}{message&&<p role="status" style={{...panel,color:"#b0ffa1"}}>{message}</p>}
   {memberships.length===0?<section style={panel}><h2>Sem empresa vinculada</h2><p>Peça ao administrador da Alysson Tech para vincular este e-mail ao seu estabelecimento.</p></section>:<>
    {memberships.length>1&&<label style={{display:"block",marginBottom:20}}><span style={mini}>Empresa</span><select style={field} value={businessId} onChange={e=>setBusinessId(e.target.value)}>{memberships.map(m=><option key={m.business_id} value={m.business_id}>{m.business_id}</option>)}</select></label>}
    {business&&<section style={panel}><h2>{business.name}</h2><p style={{color:"#a1ae9f"}}>{business.is_published?"Multilink publicado":"Rascunho"} · /p/{business.slug}</p><a href={"/p/"+business.slug} target="_blank" rel="noreferrer" style={{color:"#71ff41"}}>Visualizar meu multilink</a></section>}
    {canProfile&&<section style={panel}><h2>Informações comerciais</h2><form onSubmit={saveContact}>
      <label style={{display:"block",marginBottom:12}}><span style={mini}>WhatsApp</span><input style={field} value={contact.whatsapp} onChange={e=>setContact({...contact,whatsapp:e.target.value})}/></label>
      <label style={{display:"block",marginBottom:12}}><span style={mini}>Link do Instagram</span><input style={field} value={contact.instagram} onChange={e=>setContact({...contact,instagram:e.target.value})} placeholder="https://instagram.com/..."/></label>
      <label style={{display:"block",marginBottom:14}}><span style={mini}>Descrição</span><textarea style={{...field,minHeight:80}} value={contact.description} onChange={e=>setContact({...contact,description:e.target.value})}/></label>
      <button disabled={busy} style={button}>Salvar informações</button>
    </form></section>}
    {canPayment&&<section style={panel}><h2>Chave Pix</h2><form onSubmit={savePix}><label style={{display:"block",marginBottom:12}}><span style={mini}>Chave atual: {pix?"Configurada":"Ainda não configurada"}</span><input style={field} value={draftPix} onChange={e=>setDraftPix(e.target.value)} placeholder="Digite sua chave Pix"/></label><button disabled={busy} style={button}>Atualizar Pix</button></form></section>}
    <section style={panel}><header style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}><div><h2>Meu catálogo</h2><p style={{color:"#a2b0a4",fontSize:12}}>Produtos, preços e disponibilidade.</p></div>{canCatalog&&<button style={button} onClick={()=>begin()}>+ Novo item</button>}</header>
     {canCatalog&&showForm&&<form onSubmit={saveItem} style={{...panel,background:"#0b120e",marginTop:12}}>
      <h3>{editId?"Editar item":"Cadastrar item"}</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:13}}>
       <label><span style={mini}>Nome *</span><input style={field} required value={name} onChange={e=>setName(e.target.value)}/></label>
       <label><span style={mini}>Preço (R$)</span><input style={field} inputMode="decimal" value={price} onChange={e=>setPrice(e.target.value)}/></label>
       <label><span style={mini}>Categoria / público</span><input style={field} value={audience} onChange={e=>setAudience(e.target.value)}/></label>
       <label><span style={mini}>Tipo</span><input style={field} value={frameType} onChange={e=>setFrameType(e.target.value)}/></label>
       <label><span style={mini}>Código do item</span><input style={field} value={sku} onChange={e=>setSku(e.target.value)}/></label>
       <label><span style={mini}>Disponibilidade</span><select style={field} value={availability} onChange={e=>setAvailability(e.target.value)}><option value="disponivel">Disponível</option><option value="vendido">Vendido</option><option value="oculto">Oculto</option></select></label>
      </div>
      <label style={{display:"block",marginTop:15}}><span style={mini}>Descrição</span><textarea style={{...field,minHeight:65}} value={description} onChange={e=>setDescription(e.target.value)}/></label>
      <label style={{display:"block",marginTop:14}}><span style={mini}>Foto do produto *</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPhoto(e.target.files?.[0]??null)}/></label>
      {editId&&<label style={{display:"block",marginTop:12}}><span style={mini}>URL da imagem atual</span><input style={field} value={imageUrl} onChange={e=>setImageUrl(e.target.value)}/></label>}
      <div style={{display:"flex",gap:10,marginTop:18}}><button disabled={busy} style={button}>Salvar item</button><button type="button" style={button2} onClick={()=>setShowForm(false)}>Cancelar</button></div>
     </form>}
     {items.map(p=><article key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,borderTop:"1px solid #2e4232",padding:"16px 0",flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>{p.image_url&&<img src={p.image_url} alt="" width={60} height={60} style={{objectFit:"cover",borderRadius:9}}/>}<div><strong>{p.name}</strong><p style={{fontSize:12,color:"#aeb7ad"}}>{p.price==null?"Sob consulta":Number(p.price).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})} · {p.is_active?"Disponível":p.availability==="vendido"?"Vendido":"Oculto"}</p></div></div>
      {canCatalog&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button style={button2} onClick={()=>begin(p)}>Editar</button><button style={button2} onClick={()=>void changeAvailability(p,!p.is_active)}>{p.is_active?"Marcar vendido":"Reativar"}</button></div>}
     </article>)}
     {items.length===0&&<p style={{color:"#a2b0a4"}}>Nenhum item cadastrado.</p>}
    </section>
    <p style={{color:"#7f9583",fontSize:12}}>Você não pode alterar a identidade visual, o código da placa, os usuários administrativos ou os dados de outras empresas.</p>
   </>}
  </div>
 </main>;
}
