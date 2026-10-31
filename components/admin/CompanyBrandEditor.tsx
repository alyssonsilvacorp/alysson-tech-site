"use client";

import {useCallback,useEffect,useState,type FormEvent} from "react";
import Link from "next/link";
import {supabaseBrowser} from "../../lib/supabase-browser";

type Company={id:string;slug:string;name:string;category:string|null;whatsapp_number:string|null;logo_url:string|null;logo_initials:string|null;accent_color:string|null;brand_support_color:string|null;brand_background_color:string|null;brand_highlight_color:string|null;short_description:string|null;instagram_url:string|null;is_published:boolean};
type Fields={name:string;category:string;whatsapp_number:string;logo_initials:string;accent_color:string;brand_support_color:string;brand_background_color:string;brand_highlight_color:string;short_description:string;instagram_url:string};
const empty:Fields={name:"",category:"",whatsapp_number:"",logo_initials:"",accent_color:"#6d293e",brand_support_color:"#8d3b50",brand_background_color:"#faf8f9",brand_highlight_color:"#f1e5e7",short_description:"",instagram_url:""};
const panel:React.CSSProperties={padding:22,background:"#101a13",border:"1px solid #334739",borderRadius:16};
const field:React.CSSProperties={width:"100%",border:"1px solid #415846",background:"#09130d",padding:12,borderRadius:10,color:"#eff8ee",fontSize:14};
const btn:React.CSSProperties={background:"#9ef08a",color:"#11220e",border:"none",borderRadius:10,padding:"12px 16px",fontWeight:750,cursor:"pointer"};
const muted:React.CSSProperties={fontSize:12,color:"#a8b9aa",lineHeight:1.6};
const slugify=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const hex=(a:number[])=>"#"+a.map(x=>Math.min(255,Math.max(0,Math.round(x))).toString(16).padStart(2,"0")).join("");
const mix=(a:number[],b:number[],pct:number)=>a.map((x,i)=>x*(1-pct)+b[i]*pct);

async function logoPalette(file:File):Promise<{primary:string;support:string;background:string;highlight:string}>{
 const url=URL.createObjectURL(file);
 try{
  const img=new Image();
  await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(Error("Imagem inválida"));img.src=url;});
  const canvas=document.createElement("canvas");canvas.width=110;canvas.height=110;
  const ctx=canvas.getContext("2d",{willReadFrequently:true});
  if(!ctx)throw Error("Canvas indisponível");
  const scale=Math.min(110/img.naturalWidth,110/img.naturalHeight);const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  ctx.clearRect(0,0,110,110);ctx.drawImage(img,(110-w)/2,(110-h)/2,w,h);
  const pixels=ctx.getImageData(0,0,110,110).data;
  const counts=new Map<string,{n:number;rgb:number[]}>();
  for(let i=0;i<pixels.length;i+=24){const r=pixels[i],g=pixels[i+1],b=pixels[i+2],alpha=pixels[i+3];if(alpha<150)continue;
   const max=Math.max(r,g,b),min=Math.min(r,g,b);if(max>245&&min>235||max<25||max-min<28)continue;
   const key=[r,g,b].map(v=>Math.floor(v/28)).join(":");
   const old=counts.get(key);if(old){old.n++;}else counts.set(key,{n:1,rgb:[r,g,b]});
  }
  const best=[...counts.values()].sort((a,b)=>b.n-a.n)[0]?.rgb??[109,41,62];
  return {primary:hex(best),support:hex(mix(best,[255,255,255],.16)),background:hex(mix(best,[255,255,255],.965)),highlight:hex(mix(best,[255,255,255],.90))};
 } finally{URL.revokeObjectURL(url);}
}
export default function CompanyBrandEditor(){
 const [companies,setCompanies]=useState<Company[]>([]);
 const [selected,setSelected]=useState<string>("new");
 const [values,setValues]=useState<Fields>(empty);
 const [logoFile,setLogoFile]=useState<File|null>(null);
 const [logoSrc,setLogoSrc]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [success,setSuccess]=useState("");
 const [published,setPublished]=useState(false);
 const load=useCallback(async()=>{const r=await supabaseBrowser.from("smart_businesses").select("id,slug,name,category,whatsapp_number,logo_url,logo_initials,accent_color,brand_support_color,brand_background_color,brand_highlight_color,short_description,instagram_url,is_published").order("name");if(r.error){setError(r.error.message);return;}setCompanies((r.data??[]) as Company[]);},[]);
 useEffect(()=>{void Promise.resolve().then(load);},[load]);
 function choose(id:string){setSelected(id);setError("");setSuccess("");setLogoFile(null);const c=companies.find(x=>x.id===id);
  if(!c){setValues(empty);setLogoSrc(null);setPublished(false);return;}
  setValues({name:c.name,category:c.category??"",whatsapp_number:c.whatsapp_number??"",logo_initials:c.logo_initials??"",
    accent_color:c.accent_color??empty.accent_color,brand_support_color:c.brand_support_color??empty.brand_support_color,
    brand_background_color:c.brand_background_color??empty.brand_background_color,brand_highlight_color:c.brand_highlight_color??empty.brand_highlight_color,
    short_description:c.short_description??"",instagram_url:c.instagram_url??""});
  setLogoSrc(c.logo_url);setPublished(c.is_published);
 }
 async function chooseLogo(file:File|null){if(!file)return;if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>3*1024*1024){setError("Logo JPG, PNG ou WebP de até 3 MB.");return;}setLogoFile(file);setLogoSrc(URL.createObjectURL(file));try{const p=await logoPalette(file);setValues(v=>({...v,accent_color:p.primary,brand_support_color:p.support,brand_background_color:p.background,brand_highlight_color:p.highlight}));}catch{setError("Não foi possível extrair as cores. Você pode escolhê-las manualmente.");}}
 async function save(e:FormEvent){e.preventDefault();if(busy)return;const name=values.name.trim(),category=values.category.trim();
  if(!name||!category)return;const digits=values.whatsapp_number.replace(/\D/g,"");if(digits&&!/^\d{12,13}$/.test(digits)){setError("Informe WhatsApp com DDI 55 + DDD + número.");return;}
  setBusy(true);setError("");setSuccess("");
  const payload={name,category,whatsapp_number:digits||null,logo_initials:values.logo_initials.trim().toUpperCase().slice(0,5)||name.slice(0,2).toUpperCase(),
    accent_color:values.accent_color,brand_support_color:values.brand_support_color,brand_background_color:values.brand_background_color,brand_highlight_color:values.brand_highlight_color,
    short_description:values.short_description.trim()||null,instagram_url:values.instagram_url.trim()||null};
  let id=selected;
  if(selected==="new"){
   const slug=slugify(name);if(!slug){setError("Nome inválido para criar rota.");setBusy(false);return;}
   const response=await supabaseBrowser.from("smart_businesses").insert({...payload,slug,is_published:false}).select("id").single();
   if(response.error){setError("Não foi possível cadastrar: "+response.error.message);setBusy(false);return;}id=response.data.id;
  } else {
   const response=await supabaseBrowser.from("smart_businesses").update(payload).eq("id",id);
   if(response.error){setError("Não foi possível atualizar: "+response.error.message);setBusy(false);return;}
  }
  if(logoFile){
   const ext=logoFile.type==="image/png"?"png":logoFile.type==="image/webp"?"webp":"jpg";
   const path=id+"/logos/"+crypto.randomUUID()+"."+ext;
   const upload=await supabaseBrowser.storage.from("business-media").upload(path,logoFile,{upsert:false,contentType:logoFile.type});
   if(upload.error){setError("Empresa salva, mas a logo não foi enviada: "+upload.error.message);}else{
    const logoUrl=supabaseBrowser.storage.from("business-media").getPublicUrl(path).data.publicUrl;
    const update=await supabaseBrowser.from("smart_businesses").update({logo_url:logoUrl}).eq("id",id);
    if(update.error)setError("Empresa salva, mas não foi possível vincular a logo: "+update.error.message);
   }
  }
  setBusy(false);setLogoFile(null);setSuccess("Dados centralizados salvos. Os produtos e a identidade visual pertencem à mesma empresa.");await load();setSelected(id);
 }
 const selectedCompany=companies.find(c=>c.id===selected);
 return <div style={{display:"grid",gap:16}}>
  <section style={panel}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
   <div><h2 style={{margin:"0 0 6px",fontSize:20}}>Identidade visual e dados da loja</h2><p style={{...muted,margin:0}}>Um cadastro para Multilink, catálogo e placa opcional.</p></div>
   <button type="button" onClick={()=>choose("new")} style={btn}>+ Nova empresa</button></div>
   <label style={{display:"block",marginTop:17,fontSize:12,color:"#c5dbc8"}}>Empresa para editar<select style={{...field,marginTop:6}} value={selected} onChange={e=>choose(e.target.value)}>
    <option value="new">Cadastrar nova empresa</option>{companies.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
   {selectedCompany&&<p style={muted}>Rota do Multilink: /p/{selectedCompany.slug} {published?"· publicado":"· rascunho"} · Catálogo: /p/{selectedCompany.slug}/catalogo</p>}
  </section>
  {error&&<p role="alert" style={{...panel,borderColor:"#9f5050",color:"#ffb5b5"}}>{error}</p>}
  {success&&<p role="status" style={{...panel,color:"#aafa9a"}}>{success}</p>}
  <form onSubmit={save} style={panel}>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:15}}>
    {([["name","Nome da empresa *"],["whatsapp_number","WhatsApp (55 + DDD + número)"],["category","Tipo de loja / segmento *"],["logo_initials","Sigla para quando não houver logo"],["instagram_url","Instagram (URL)"]] as const).map(([key,title])=><label key={key} style={{display:"grid",gap:7,fontSize:12,color:"#b7d0ba"}}>{title}<input style={field} required={key==="name"||key==="category"} value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})}/></label>)}
   </div>
   <label style={{display:"grid",gap:7,fontSize:12,color:"#b7d0ba",marginTop:15}}>Descrição da empresa<textarea style={{...field,minHeight:85}} value={values.short_description} onChange={e=>setValues({...values,short_description:e.target.value})}/></label>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",alignItems:"center",gap:15,marginTop:17}}>
    <label style={{display:"grid",gap:7,fontSize:12,color:"#b7d0ba"}}>Enviar logo (até 3 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>void chooseLogo(e.target.files?.[0]??null)}/></label>
    {logoSrc&&<div style={{display:"flex",gap:12,alignItems:"center"}}><img src={logoSrc} alt="Prévia da logo" style={{width:66,height:66,borderRadius:11,objectFit:"contain",background:"white",padding:5}}/><span style={muted}>Paleta identificada automaticamente. Ajuste abaixo se necessário.</span></div>}
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginTop:19}}>
    {([["accent_color","Cor principal"],["brand_support_color","Cor de apoio"],["brand_background_color","Fundo"],["brand_highlight_color","Destaque"]] as const).map(([key,label])=><label key={key} style={{...panel,padding:10,display:"grid",gap:7,fontSize:12}}>{label}<input type="color" aria-label={label} value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})} style={{width:"100%",height:46,cursor:"pointer",border:0,background:"transparent"}}/><input aria-label={label+" em hexadecimal"} value={values[key]} maxLength={7} onChange={e=>{if(/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))setValues({...values,[key]:e.target.value});}} style={{...field,padding:8,fontSize:11}}/></label>)}
   </div>
   <p style={muted}>As cores são compartilhadas com o catálogo e podem ser revisadas. Empresas novas começam como rascunho e não ativam automaticamente nenhuma placa.</p>
   <div style={{display:"flex",alignItems:"center",gap:13,flexWrap:"wrap"}}><button disabled={busy} style={btn}>{busy?"Salvando...":selected==="new"?"Cadastrar empresa":"Salvar identidade da empresa"}</button>{selectedCompany&&<Link href="/admin/catalogos" style={{color:"#9ff68f",fontSize:13}}>Gerenciar catálogo ↗</Link>}</div>
  </form>
 </div>;
}
