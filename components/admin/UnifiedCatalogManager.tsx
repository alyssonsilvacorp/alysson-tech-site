"use client";

import {useCallback,useEffect,useMemo,useState,type FormEvent} from "react";
import Link from "next/link";
import CatalogStorefront,{type CatalogProduct,type DeliveryZone,type CatalogBrand} from "../catalog/CatalogStorefront";
import {supabaseBrowser} from "../../lib/supabase-browser";

type Company={id:string;slug:string;name:string;category:string|null;whatsapp_number:string|null;logo_url:string|null;logo_initials:string|null;accent_color:string|null;brand_support_color:string|null;brand_background_color:string|null;brand_highlight_color:string|null;has_catalog:boolean};
type Settings={status:"draft"|"published"|"paused";headline:string;subheadline:string;announcement:string;delivery_enabled:boolean;pickup_enabled:boolean;accept_inquiries:boolean};
type ProductRow=CatalogProduct & {business_id:string;is_active:boolean;audience:string|null;frame_type:string|null};
type ZoneRow=DeliveryZone & {is_active:boolean};
const defaultSettings:Settings={status:"draft",headline:"Encontre o que procura.",subheadline:"Escolha os produtos e consulte diretamente pelo WhatsApp.",announcement:"",delivery_enabled:false,pickup_enabled:true,accept_inquiries:true};
const panel:React.CSSProperties={border:"1px solid #304638",background:"#101a13",padding:20,borderRadius:16};
const field:React.CSSProperties={padding:12,border:"1px solid #3c5542",background:"#0b150f",color:"#f2f9f1",borderRadius:10,width:"100%",fontSize:13};
const primary:React.CSSProperties={background:"#9bea83",color:"#12230c",padding:"11px 15px",fontWeight:750,border:0,borderRadius:10,cursor:"pointer"};
const secondary:React.CSSProperties={...primary,background:"#1b2b1e",color:"#dfecdf",border:"1px solid #45614a"};
const muted:React.CSSProperties={color:"#a8b9a9",fontSize:12,lineHeight:1.65};
function parseVariants(text:string):{name:string;options:string[]}[]{
 return text.split("\n").map(s=>{const [key,...opts]=s.split(":");return {name:key?.trim()??"",options:opts.join(":").split(",").map(x=>x.trim()).filter(Boolean)};}).filter(x=>x.name&&x.options.length);
}
function variantsToText(source:unknown){return Array.isArray(source)?source.filter(x=>x&&typeof x.name==="string"&&Array.isArray(x.options)).map(x=>x.name+": "+x.options.join(", ")).join("\n"):"";}
function currency(value:number|null){return value==null?"Sob consulta":Number(value).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
type ProductForm={name:string;sku:string;description:string;price:string;catalog_category:string;catalog_badge:string;variants:string;availability:string;image_url:string};
const blank:ProductForm={name:"",sku:"",description:"",price:"",catalog_category:"",catalog_badge:"",variants:"",availability:"disponivel",image_url:""};
async function prepareImage(file:File):Promise<File>{
 if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>15*1024*1024)throw Error("Envie JPG, PNG ou WebP de até 15 MB.");
 const bitmap=await createImageBitmap(file);const scale=Math.min(1,1280/Math.max(bitmap.width,bitmap.height));
 const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 const context=canvas.getContext("2d");if(!context)throw Error("Processamento de imagem indisponível");
 context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error("Falha ao converter foto")),"image/jpeg",.79));
 if(blob.size>3*1024*1024)throw Error("Imagem comprimida ainda maior que 3 MB");
 return new File([blob],file.name.replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"});
}
export default function UnifiedCatalogManager(){
 const [companies,setCompanies]=useState<Company[]>([]);
 const [businessId,setBusinessId]=useState("");
 const [settings,setSettings]=useState<Settings>(defaultSettings);
 const [items,setItems]=useState<ProductRow[]>([]);
 const [zones,setZones]=useState<ZoneRow[]>([]);
 const [alias,setAlias]=useState("");
 const [loading,setLoading]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const [activeTab,setActiveTab]=useState<"products"|"delivery"|"settings">("products");
 const [showForm,setShowForm]=useState(false);
 const [editing,setEditing]=useState<string|null>(null);
 const [form,setForm]=useState<ProductForm>(blank);
 const [photo,setPhoto]=useState<File|null>(null);
 const [batchFiles,setBatchFiles]=useState<File[]>([]);
 const [bulk,setBulk]=useState("");
 const [showBulk,setShowBulk]=useState(false);
 const [zoneName,setZoneName]=useState("");
 const [zoneFee,setZoneFee]=useState("");
 const [preview,setPreview]=useState(false);
 const [search,setSearch]=useState("");
 const [uploading,setUploading]=useState(false);
 const [verifiedPublication,setVerifiedPublication]=useState(false);
 const company=companies.find(c=>c.id===businessId);
 const loadCompanies=useCallback(async()=>{
  const r=await supabaseBrowser.from("smart_businesses").select("id,slug,name,category,whatsapp_number,logo_url,logo_initials,accent_color,brand_support_color,brand_background_color,brand_highlight_color,has_catalog").order("name");
  if(r.error){setError(r.error.message);return;}
  const list=(r.data??[]) as Company[];setCompanies(list);const intended=new URLSearchParams(window.location.search).get("business");
  const available=list.filter(c=>c.has_catalog);setBusinessId(x=>x||available.find(c=>c.id===intended)?.id||available[0]?.id||"");
 },[]);
 const load=useCallback(async(id:string)=>{
  if(!id)return;setLoading(true);setError("");
  const [s,p,z,a]=await Promise.all([
   supabaseBrowser.from("smart_catalog_settings").select("status,headline,subheadline,announcement,delivery_enabled,pickup_enabled,accept_inquiries").eq("business_id",id).maybeSingle(),
   supabaseBrowser.from("smart_business_services").select("id,business_id,name,description,price,price_label,image_url,sku,audience,frame_type,availability,is_active,sort_order,catalog_category,catalog_badge,catalog_variants").eq("business_id",id).order("sort_order"),
   supabaseBrowser.from("smart_catalog_delivery_zones").select("id,label,delivery_fee,is_active").eq("business_id",id).order("sort_order"),
   supabaseBrowser.from("smart_catalog_routes").select("code").eq("business_id",id).maybeSingle(),
  ]);
  setLoading(false);
  const err=[s,p,z,a].map(x=>x.error?.message).filter(Boolean);if(err.length){setError(err.join(" · "));return;}
  const data=s.data;
  setSettings(data?{status:data.status,headline:data.headline??"",subheadline:data.subheadline??"",announcement:data.announcement??"",delivery_enabled:data.delivery_enabled,pickup_enabled:data.pickup_enabled,accept_inquiries:data.accept_inquiries}:defaultSettings);
  setItems((p.data??[]) as ProductRow[]);setZones((z.data??[]) as ZoneRow[]);setAlias(a.data?.code??"");
 },[]);
 useEffect(()=>{void Promise.resolve().then(loadCompanies);},[loadCompanies]);
 useEffect(()=>{if(!businessId)return;void Promise.resolve().then(()=>load(businessId));},[businessId,load]);
 const filtered=useMemo(()=>items.filter(p=>(p.name+" "+(p.sku??"")+" "+(p.catalog_category??"")).toLowerCase().includes(search.toLowerCase())),[items,search]);
 const brand:CatalogBrand|undefined=company?{name:company.name,slug:company.slug,initials:company.logo_initials||company.name.slice(0,2).toUpperCase(),category:company.category,logo:company.logo_url,whatsapp:company.whatsapp_number,primary:company.accent_color||"#6d293e",support:company.brand_support_color||"#8d3b50",background:company.brand_background_color||"#faf8f9",highlight:company.brand_highlight_color||"#f1e5e7",headline:settings.headline,subheadline:settings.subheadline,announcement:settings.announcement,deliveryEnabled:settings.delivery_enabled,pickupEnabled:settings.pickup_enabled,acceptInquiries:settings.accept_inquiries}:undefined;
 function begin(p?:ProductRow){setEditing(p?.id??null);setForm(p?{name:p.name,sku:p.sku??"",description:p.description??"",price:p.price===null?"":String(p.price),catalog_category:p.catalog_category??p.audience??"",catalog_badge:p.catalog_badge??"",variants:variantsToText(p.catalog_variants),availability:p.is_active?"disponivel":p.availability==="vendido"?"vendido":"oculto",image_url:p.image_url??""}:blank);setPhoto(null);setShowForm(true);setError("");}
 async function addPhoto(file:File,identifier:string){
  const prepared=await prepareImage(file);
  const path=businessId+"/catalog/"+identifier+"-"+crypto.randomUUID()+".jpg";
  const u=await supabaseBrowser.storage.from("business-media").upload(path,prepared,{upsert:false,contentType:"image/jpeg"});if(u.error)throw Error(u.error.message);
  return supabaseBrowser.storage.from("business-media").getPublicUrl(path).data.publicUrl;
 }
 async function saveProduct(e:FormEvent){e.preventDefault();if(!businessId||busy)return;
  if(!form.name.trim()){setError("Nome obrigatório");return;}
  const amount=form.price.trim()?Number(form.price.trim().replace(",",".")):null;
  if(amount!==null&&(!Number.isFinite(amount)||amount<0)){setError("Preço inválido");return;}
  setBusy(true);setError("");setMessage("");
  let image=form.image_url||null;
  try{if(photo)image=await addPhoto(photo,form.sku||"item");}catch(e){setError("Upload não concluído: "+String(e));setBusy(false);return;}
  const payload={name:form.name.trim(),sku:form.sku.trim()||null,description:form.description.trim()||null,price:amount,
   price_label:amount===null?"Sob consulta":null,image_url:image,catalog_category:form.catalog_category.trim()||null,
   catalog_badge:form.catalog_badge.trim()||null,catalog_variants:parseVariants(form.variants),
   availability:form.availability,is_active:form.availability==="disponivel",audience:form.catalog_category.trim()||null};
  const r=editing?await supabaseBrowser.from("smart_business_services").update(payload).eq("business_id",businessId).eq("id",editing)
    :await supabaseBrowser.from("smart_business_services").insert({...payload,business_id:businessId,sort_order:items.length});
  setBusy(false);if(r.error){setError(r.error.message);return;}setShowForm(false);setMessage("Produto salvo na fonte única. Multilink e catálogo usam o mesmo registro.");await load(businessId);
 }
 async function importList(){if(!businessId||busy)return;const lines=bulk.split("\n").map(x=>x.trim()).filter(Boolean);
  const records=lines.map((l,i)=>{const [name,category,price,sku]=l.split(";").map(x=>x?.trim()??"");const amount=price?Number(price.replace(",",".")):null;
  return {business_id:businessId,name,catalog_category:category||null,audience:category||null,price:Number.isFinite(amount)?amount:null,price_label:amount===null?"Sob consulta":null,sku:sku||null,sort_order:items.length+i,is_active:true,availability:"disponivel"};});
  if(!records.length||records.some(x=>!x.name||x.price!==null&&x.price<0)){setError("Lista inválida. Use Nome; Categoria; Preço; Código");return;}
  if(!window.confirm("Importar "+records.length+" produtos para "+company?.name+"? Revise para evitar duplicatas."))return;
  setBusy(true);setError("");const r=await supabaseBrowser.from("smart_business_services").insert(records);setBusy(false);
  if(r.error){setError(r.error.message);return;}setBulk("");setShowBulk(false);setMessage(records.length+" produtos cadastrados.");await load(businessId);
 }
 async function uploadBatch(){if(!businessId||busy||!batchFiles.length)return;
  setUploading(true);setError("");let count=0;const failures:string[]=[];
  for(const file of batchFiles.slice(0,30)){
   const base=file.name.replace(/\.[^.]+$/,"").toLowerCase().replace(/[^a-z0-9]+/g,"");
   const product=items.find(p=>(p.sku??"").toLowerCase().replace(/[^a-z0-9]+/g,"")===base)||items.find(p=>p.name.toLowerCase().replace(/[^a-z0-9]+/g,"")===base);
   if(!product){failures.push(file.name+" (sem SKU ou nome correspondente)");continue;}
   try{const url=await addPhoto(file,product.sku||"item");const res=await supabaseBrowser.from("smart_business_services").update({image_url:url}).eq("business_id",businessId).eq("id",product.id);if(res.error)throw Error(res.error.message);count++;}catch(e){failures.push(file.name+" ("+String(e)+")");}
  }
  setUploading(false);setBatchFiles([]);setMessage(count+" fotos associadas.");if(failures.length)setError("Não vinculadas: "+failures.slice(0,8).join("; "));await load(businessId);
 }
 async function saveSettings(status:Settings["status"]){
  if(!company?.has_catalog){setError("Habilite esta empresa para ter catálogo antes de editar ou publicar.");return;}
  if(!businessId||busy)return;
  if(status==="published"){
   if(!verifiedPublication){setError("Confira os produtos, imagens, preços e WhatsApp e marque a confirmação antes de publicar.");return;}
   const digits=(company?.whatsapp_number??"").replace(/\D/g,"");
   if(!/^\d{12,13}$/.test(digits)){setError("Cadastre o WhatsApp real na área Empresas antes de publicar.");return;}
   if(!items.some(p=>p.is_active&&p.image_url)){setError("Antes de publicar, inclua pelo menos uma foto real em um produto ativo. Evite catálogos de demonstração.");return;}
   if(settings.delivery_enabled&&zones.filter(z=>z.is_active).length===0){setError("Cadastre pelo menos um bairro de entrega ou desative a entrega.");return;}
   if(!settings.delivery_enabled&&!settings.pickup_enabled){setError("Ative entrega ou retirada.");return;}
  }
  if(status==="draft"&&settings.status==="published"&&!window.confirm("Retirar o catálogo publicado do ar e salvar como rascunho?"))return;
  setBusy(true);setError("");setMessage("");
  const r=await supabaseBrowser.from("smart_catalog_settings").upsert({business_id:businessId,...settings,status,updated_at:new Date().toISOString(),...(status==="published"?{published_at:new Date().toISOString()}:{})},{onConflict:"business_id"});
  if(r.error){setError(r.error.message);setBusy(false);return;}
  if(status==="published"&&!alias){const a=await supabaseBrowser.rpc("allocate_smart_catalog_code",{p_business_id:businessId});if(a.error)setError("Catálogo publicado na rota canônica, mas sem código curto: "+a.error.message);else setAlias(a.data??"");}
  setBusy(false);setSettings(v=>({...v,status}));setMessage(status==="published"?"Catálogo publicado. Atualizações dos produtos aparecem sem novo deploy.":"Configurações salvas como "+status+".");await load(businessId);
 }
 async function deleteCatalog(){
  if(!businessId||busy)return;
  if(!window.confirm("Excluir a CONFIGURAÇÃO do catálogo de "+company?.name+"? O link ficará indisponível, mas produtos, fotos, Multilink, empresa e placa serão preservados."))return;
  setBusy(true);setError("");setMessage("");
  const disabled=await supabaseBrowser.rpc("disable_smart_catalog",{p_business_id:businessId});
  if(disabled.error){setBusy(false);setError(disabled.error.message);return;}
  const response=await supabaseBrowser.from("smart_catalog_settings").delete().eq("business_id",businessId);
  setBusy(false);
  if(response.error){setError("Catálogo pausado, mas não foi possível remover configurações: "+response.error.message);return;}
  setSettings(defaultSettings);setVerifiedPublication(false);
  setMessage("Configuração excluída e link suspenso. Empresa, Multilink, fotos e produtos mantidos para evitar perda de dados.");
  await load(businessId);
 }
 async function addZone(e:FormEvent){e.preventDefault();if(!businessId||!zoneName.trim())return;const fee=Number(zoneFee.replace(",","."));if(!Number.isFinite(fee)||fee<0){setError("Taxa de entrega inválida");return;}
  setBusy(true);const r=await supabaseBrowser.from("smart_catalog_delivery_zones").insert({business_id:businessId,label:zoneName.trim(),delivery_fee:fee,sort_order:zones.length,is_active:true});
  setBusy(false);if(r.error){setError(r.error.message);return;}setZoneFee("");setZoneName("");await load(businessId);
 }
 async function removeZone(id:string){if(!window.confirm("Remover esta área de entrega?"))return;setBusy(true);const r=await supabaseBrowser.from("smart_catalog_delivery_zones").delete().eq("id",id).eq("business_id",businessId);setBusy(false);if(r.error)setError(r.error.message);else await load(businessId);}
 async function removeProduct(p:ProductRow){if(!window.confirm("Excluir "+p.name+" permanentemente?"))return;setBusy(true);const r=await supabaseBrowser.from("smart_business_services").delete().eq("id",p.id).eq("business_id",businessId);setBusy(false);if(r.error)setError(r.error.message);else await load(businessId);}
 const published=settings.status==="published";
 return <div style={{display:"grid",gap:16}}>
  <div style={panel}>
   <h2 style={{fontSize:19,margin:"0 0 7px"}}>Catálogos integrados</h2><p style={muted}>A mesma empresa, identidade e produtos alimentam o catálogo e o Multilink. Não há HTML individual para publicar.</p>
   <label style={{display:"grid",gap:7,fontSize:12,maxWidth:550}}>Empresa selecionada<select style={field} value={businessId} onChange={e=>{setBusinessId(e.target.value);setShowForm(false);setSearch("");setVerifiedPublication(false);}}><option value="">Selecione uma empresa</option>{companies.filter(c=>c.has_catalog).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
   {!companies.some(c=>c.has_catalog)&&<p style={muted}>Nenhuma empresa está habilitada para catálogo. Acesse <Link href="/admin/empresas" style={{color:"#b0ff94"}}>Empresas</Link>, marque "Sim, criar catálogo" e salve para continuar.</p>}
   {company&&<div style={{display:"flex",gap:9,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",marginTop:15}}>
    <span style={{fontSize:12,color:published?"#a5f49a":"#cfcb9a"}}>Situação: {published?"PUBLICADO":settings.status==="paused"?"PAUSADO":"RASCUNHO"} · {items.length} produtos</span>
    <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
    <button type="button" onClick={()=>setPreview(true)} style={secondary}>Testar catálogo</button>
    {published&&<a target="_blank" rel="noreferrer" href={"/p/"+company.slug+"/catalogo"} style={{...secondary,textDecoration:"none",display:"inline-flex"}}>Visualizar link publicado ↗</a>}
    </div>
   </div>}
   {company&&<p style={muted}>Rota permanente: <strong>/p/{company.slug}/catalogo</strong>{alias?" · Código curto: /c/"+alias:" · Código curto reservado somente ao publicar"}</p>}
  </div>
  {error&&<div style={{...panel,borderColor:"#864f4f",color:"#ffadad"}} role="alert">{error}</div>}
  {message&&<div style={{...panel,color:"#b2fa9c"}} role="status">{message}</div>}
  {company&&<><div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
   {([["products","Produtos e categorias"],["delivery","Entrega e retirada"],["settings","Visual e publicação"]] as const).map(([tab,name])=><button key={tab} type="button" style={activeTab===tab?primary:secondary} onClick={()=>setActiveTab(tab)}>{name}</button>)}
  </div>
  {activeTab==="products"&&<section style={panel}>
    <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}><h2 style={{fontSize:18,margin:0}}>Produtos</h2><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
     <button style={secondary} onClick={()=>setShowBulk(v=>!v)}>Cadastro rápido por lista</button><button style={primary} onClick={()=>begin()}>+ Adicionar produto</button>
    </div></div>
    {showBulk&&<div style={{marginTop:14,padding:15,border:"1px solid #48634c",borderRadius:12}}><h3>Adicionar vários produtos</h3><p style={muted}>Uma linha por produto: Nome; Categoria; Preço; SKU. Preço vazio = sob consulta.</p><textarea rows={7} style={field} placeholder={"Armação modelo 01; Feminino; ; FEN-001\nArmação modelo 02; Masculino; 129,90; FEN-002"} value={bulk} onChange={e=>setBulk(e.target.value)}/><button style={primary} type="button" onClick={()=>void importList()} disabled={busy}>Importar produtos da lista</button></div>}
    {showForm&&<form onSubmit={saveProduct} style={{marginTop:15,padding:18,border:"1px solid #547253",borderRadius:12}}>
      <h3>{editing?"Editar produto":"Novo produto"}</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:13}}>
       {([["name","Nome *"],["sku","Código SKU"],["catalog_category","Categoria"],["price","Preço (R$), opcional"],["catalog_badge","Selo opcional"]] as const).map(([key,title])=><label style={{display:"grid",gap:6,fontSize:12}} key={key}>{title}<input style={field} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} required={key==="name"}/></label>)}
       <label style={{display:"grid",gap:6,fontSize:12}}>Disponibilidade<select style={field} value={form.availability} onChange={e=>setForm({...form,availability:e.target.value})}><option value="disponivel">Disponível</option><option value="vendido">Vendido</option><option value="oculto">Oculto</option></select></label>
      </div>
      <label style={{display:"grid",gap:7,marginTop:13,fontSize:12}}>Descrição<textarea rows={2} style={field} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
      <label style={{display:"grid",gap:7,marginTop:13,fontSize:12}}>Variações (uma por linha; exemplo: Tamanho: P,M,G)<textarea rows={2} style={field} value={form.variants} onChange={e=>setForm({...form,variants:e.target.value})}/></label>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(225px,1fr))",gap:12,marginTop:13}}>
       <label style={{display:"grid",gap:7,fontSize:12}}>Foto JPG, PNG ou WebP (compressão automática)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPhoto(e.target.files?.[0]??null)}/></label>
       <label style={{display:"grid",gap:7,fontSize:12}}>Ou URL da imagem existente<input style={field} value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})}/></label>
      </div>
      <div style={{display:"flex",gap:8,marginTop:17}}><button disabled={busy} style={primary}>{busy?"Salvando...":"Salvar produto"}</button><button type="button" style={secondary} onClick={()=>setShowForm(false)}>Cancelar</button></div>
    </form>}
    <div style={{marginTop:17,padding:14,border:"1px solid #395442",borderRadius:12}}>
      <strong style={{fontSize:13}}>Fotografias em lote</strong><p style={muted}>Associe automaticamente por nome do arquivo igual ao SKU ou nome do produto. Até 30 fotos por lote; imagens grandes são compactadas antes do upload.</p>
      <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>setBatchFiles(Array.from(e.target.files??[]))}/>
      <button type="button" style={{...secondary,marginLeft:12}} disabled={uploading||!batchFiles.length} onClick={()=>void uploadBatch()}>{uploading?"Vinculando fotos...":"Aplicar fotos ("+batchFiles.length+")"}</button>
    </div>
    <input style={{...field,margin:"16px 0"}} placeholder="Buscar produto, SKU ou categoria" aria-label="Buscar produtos" value={search} onChange={e=>setSearch(e.target.value)}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:9}}>{filtered.map(p=><article key={p.id} style={{padding:13,border:"1px solid #354c3a",borderRadius:11,display:"flex",alignItems:"center",gap:10}}>
     {p.image_url?<img src={p.image_url} alt="" style={{width:52,height:52,objectFit:"cover",borderRadius:9}}/>:<div style={{width:52,height:52,background:"#243c30",borderRadius:9,display:"grid",placeItems:"center"}}>◇</div>}
     <div style={{flex:1,minWidth:0}}><strong style={{fontSize:12}}>{p.name}</strong><div style={muted}>{p.catalog_category||p.audience||"Geral"} · {currency(p.price)} · {p.is_active?"Visível":"Oculto"}</div></div>
     <button type="button" style={{...secondary,padding:8}} onClick={()=>begin(p)}>Editar</button><button type="button" style={{...secondary,padding:8}} onClick={()=>void removeProduct(p)}>×</button>
    </article>)}</div>{loading&&<p style={muted}>Carregando...</p>}
  </section>}
  {activeTab==="delivery"&&<section style={panel}>
   <h2>Entrega e retirada</h2>
   <p style={muted}>As taxas são cadastradas por bairro. O catálogo não executa pagamento nem valida cobertura por endereço automaticamente.</p>
   <label style={{display:"block",marginBottom:13}}><input type="checkbox" checked={settings.delivery_enabled} onChange={e=>setSettings({...settings,delivery_enabled:e.target.checked})}/> Oferecer entrega</label>
   <label style={{display:"block",marginBottom:13}}><input type="checkbox" checked={settings.pickup_enabled} onChange={e=>setSettings({...settings,pickup_enabled:e.target.checked})}/> Oferecer retirada</label>
   <form onSubmit={addZone} style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"end"}}><label style={{flex:"2 1 220px",fontSize:12}}>Bairro<input style={field} required value={zoneName} onChange={e=>setZoneName(e.target.value)}/></label><label style={{flex:"1 1 130px",fontSize:12}}>Taxa R$<input style={field} inputMode="decimal" value={zoneFee} required onChange={e=>setZoneFee(e.target.value)} placeholder="0,00"/></label><button disabled={busy} style={primary}>Adicionar bairro</button></form>
   {zones.map(z=><div key={z.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #334638",padding:"11px 0",gap:12}}><span>{z.label} · {currency(Number(z.delivery_fee))}</span><button style={secondary} onClick={()=>void removeZone(z.id)}>Remover</button></div>)}
   <button style={{...primary,marginTop:15}} onClick={()=>void saveSettings(settings.status)} disabled={busy}>Salvar entrega e retirada</button>
  </section>}
  {activeTab==="settings"&&<section style={panel}>
   <h2>Identidade e publicação</h2><p style={muted}>As cores e a logo vêm do cadastro único da empresa. Para alterá-las, abra <Link href="/admin/empresas" style={{color:"#a9ff98"}}>Empresas</Link>.</p>
   {([["headline","Título de destaque"],["subheadline","Descrição de destaque"],["announcement","Mensagem na faixa superior"]] as const).map(([key,label])=><label key={key} style={{display:"grid",gap:7,marginBottom:14,fontSize:12}}>{label}<textarea rows={2} style={field} value={settings[key]} onChange={e=>setSettings({...settings,[key]:e.target.value})}/></label>)}
   <label style={{display:"block",marginBottom:15}}><input type="checkbox" checked={settings.accept_inquiries} onChange={e=>setSettings({...settings,accept_inquiries:e.target.checked})}/> Permitir consultas individuais sobre produtos no WhatsApp</label>
   <label style={{display:"block",marginBottom:15,fontSize:12,lineHeight:1.6,color:"#c8e0c8"}}><input type="checkbox" checked={verifiedPublication} onChange={e=>setVerifiedPublication(e.target.checked)}/> Conferi os produtos, fotos, informações e WhatsApp reais desta empresa antes de publicar.</label>
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={secondary} disabled={busy} onClick={()=>void saveSettings("draft")}>Salvar rascunho</button><button style={primary} disabled={busy} onClick={()=>void saveSettings("published")}>Publicar catálogo</button>{published&&<button style={secondary} disabled={busy} onClick={()=>void saveSettings("paused")}>Pausar catálogo</button>}<button style={{...secondary,color:"#ffc2be",borderColor:"#6f4544"}} disabled={busy} onClick={()=>void deleteCatalog()}>Excluir catálogo</button></div>
   <p style={muted}>Publicar não cria deploy da Vercel. Fotos e produtos são lidos do Supabase, e a rota da empresa permanece estável.</p>
  </section>}
  {preview&&brand&&<div role="dialog" aria-modal="true" aria-label="Pré-visualização do catálogo" style={{position:"fixed",inset:0,zIndex:999,background:"#050906",overflow:"auto"}}>
    <button type="button" style={{...primary,position:"fixed",zIndex:1001,top:12,right:15,boxShadow:"0 5px 25px #0009"}} onClick={()=>setPreview(false)}>← Voltar ao Control Center</button>
    <CatalogStorefront brand={brand} products={items.filter(p=>p.is_active).map(p=>({...p,catalog_category:p.catalog_category||p.audience}))} zones={zones.filter(z=>z.is_active)} adminPreview/>
   </div>}
  </>}
 </div>;
}
