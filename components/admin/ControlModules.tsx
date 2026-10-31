"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "./AdminShell";
import AdminOfferings from "./AdminOfferings";
import ConfirmDialog from "./ConfirmDialog";
import { supabaseBrowser } from "../../lib/supabase-browser";

type Company = { id:string;name:string;slug:string;category:string|null;short_description:string|null;whatsapp_number:string|null;instagram_url:string|null;is_published:boolean };
type Product = {id:string;business_id:string;name:string;description:string|null;price:number|null;image_url:string|null;is_active:boolean;availability:string;sku:string|null;audience:string|null;frame_type:string|null;sort_order:number};
type Module = "empresas"|"catalogos"|"usuarios"|"assinaturas"|"produtos"|"configuracoes";
const meta:Record<Module,{title:string;subtitle:string;current:"companies"|"catalogs"|"users"|"subscriptions"|"products"|"settings"}>={
 empresas:{title:"Empresas",subtitle:"Cadastre os estabelecimentos e gerencie seus dados comerciais.",current:"companies"},
 catalogos:{title:"Catálogos",subtitle:"Gerencie os produtos que aparecem nos multilinks.",current:"catalogs"},
 usuarios:{title:"Usuários e permissões",subtitle:"Vincule acessos de clientes à empresa correta.",current:"users"},
 assinaturas:{title:"Assinaturas",subtitle:"Planejamento de cobrança e manutenção recorrente.",current:"subscriptions"},
 produtos:{title:"Produtos e serviços",subtitle:"Cadastre suas ofertas, mantenha preços de referência e escolha entre venda avulsa e mensalidade.",current:"products"},
 configuracoes:{title:"Configurações",subtitle:"Infraestrutura e operação do Control Center.",current:"settings"}
};
const input:React.CSSProperties={width:"100%",padding:"12px",border:"1px solid #344137",borderRadius:10,background:"#0b100d",color:"#f3f8f4",fontSize:14};
const card:React.CSSProperties={padding:22,border:"1px solid #243629",borderRadius:16,background:"#0b110d",marginBottom:16};
const primary:React.CSSProperties={padding:"12px 18px",background:"#71ff41",border:0,borderRadius:10,color:"#092006",fontWeight:700,cursor:"pointer"};
const secondary:React.CSSProperties={...primary,background:"#192a1b",color:"#d3e9d0",border:"1px solid #304632"};
const label:React.CSSProperties={display:"block",fontSize:12,color:"#a8b5aa",marginBottom:6};
function slugify(s:string){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function currency(n:number|null){return n==null?"Sob consulta":n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}

export default function ControlModules({module}: {module:Module}){
 const router=useRouter();
 const [gate,setGate]=useState<"checking"|"ok"|"denied">("checking");
 const [companies,setCompanies]=useState<Company[]>([]);
 const [companyId,setCompanyId]=useState("");
 const [products,setProducts]=useState<Product[]>([]);
 const [loading,setLoading]=useState(false);
 const [message,setMessage]=useState("");
 const [error,setError]=useState("");
 const [creating,setCreating]=useState(false);
 const [companyName,setCompanyName]=useState("");
 const [companyCategory,setCompanyCategory]=useState("");
 const [companyEdit,setCompanyEdit]=useState<Company|null>(null);
 const [productEdit,setProductEdit]=useState<Product|null>(null);
 const [productName,setProductName]=useState("");
 const [productPrice,setProductPrice]=useState("");
 const [productDescription,setProductDescription]=useState("");
 const [productImageUrl,setProductImageUrl]=useState("");
 const [productFile,setProductFile]=useState<File|null>(null);
 const [productAudience,setProductAudience]=useState("");
 const [productType,setProductType]=useState("");
 const [productSku,setProductSku]=useState("");
 const [productAvailability,setProductAvailability]=useState("disponivel");
 const [members,setMembers]=useState<{id:string;business_id:string;user_id:string;member_role:string;can_edit_profile:boolean;can_edit_catalog:boolean;can_edit_payment:boolean;is_active:boolean}[]>([]);
 const [inviteEmail,setInviteEmail]=useState("");
 const [confirmMember,setConfirmMember]=useState<{id:string;active:boolean}|null>(null);
 const [inviteLink,setInviteLink]=useState("");
 const [inviteRole,setInviteRole]=useState("editor");
 const [editProfile,setEditProfile]=useState(true);
 const [editCatalog,setEditCatalog]=useState(true);
 const [editPayment,setEditPayment]=useState(true);
 const [subscriptions,setSubscriptions]=useState<{business_id:string;monthly_amount:number;status:string;plan_tier:"low_ticket"|"standard"}[]>([]);

 const loadCompanies=useCallback(async()=>{
   const {data,error:e}=await supabaseBrowser.from("smart_businesses").select("id,name,slug,category,short_description,whatsapp_number,instagram_url,is_published").order("name");
   if(e) {setError(e.message);return;}
   setCompanies((data??[]) as Company[]);
   setCompanyId(current=>current||data?.[0]?.id||"");
 },[]);
 const loadProducts=useCallback(async()=>{
   if(!companyId) {setProducts([]);return;}
   const {data,error:e}=await supabaseBrowser.from("smart_business_services").select("id,business_id,name,description,price,image_url,is_active,availability,sku,audience,frame_type,sort_order").eq("business_id",companyId).order("sort_order");
   if(e){setError(e.message);return;}
   setProducts((data??[]) as Product[]);
 },[companyId]);
 const loadMembers=useCallback(async()=>{
   const {data,error:e}=await supabaseBrowser.from("smart_business_members").select("id,business_id,user_id,member_role,can_edit_profile,can_edit_catalog,can_edit_payment,is_active");
   if(e){setError("A gestão de usuários depende da migração de permissões: "+e.message);return;}
   setMembers(data??[]);
 },[]);

 useEffect(()=>{
  let alive=true;
  async function bootstrap(){
   const {data:{user},error:e}=await supabaseBrowser.auth.getUser();
   if(!alive)return;
   if(e||!user){router.replace("/admin/login");return;}
   const result=await supabaseBrowser.from("portal_members").select("role,is_active").eq("user_id",user.id).maybeSingle();
   if(!alive)return;
   if(result.error||result.data?.role!=="admin"||!result.data?.is_active){setGate("denied");return;}
   setGate("ok");
   void loadCompanies();
  }
  void bootstrap();
  return()=>{alive=false;};
 },[router,loadCompanies]);
 useEffect(()=>{if(gate!=="ok"||module!=="catalogos")return;void Promise.resolve().then(loadProducts);},[gate,module,loadProducts]);
 useEffect(()=>{if(gate!=="ok"||module!=="usuarios")return;void Promise.resolve().then(loadMembers);},[gate,module,loadMembers]);
 useEffect(()=>{if(gate!=="ok"||module!=="assinaturas")return;void (async()=>{const r=await supabaseBrowser.from("smart_business_subscriptions").select("business_id,monthly_amount,status,plan_tier");if(!r.error)setSubscriptions(r.data??[]);else setError("Assinaturas ainda dependem da migração: "+r.error.message);})();},[gate,module]);

 async function createCompany(e:React.FormEvent){e.preventDefault();setError("");setMessage("");
   const name=companyName.trim(),category=companyCategory.trim();
   if(!name||!category)return;
   setLoading(true);
   const {error:e2}=await supabaseBrowser.from("smart_businesses").insert({name,slug:slugify(name),category,is_published:false});
   setLoading(false);
   if(e2){setError(e2.message);return;}
   setCompanyName("");setCompanyCategory("");setCreating(false);setMessage("Empresa cadastrada como rascunho.");await loadCompanies();
 }
 async function saveCompany(e:React.FormEvent){e.preventDefault();if(!companyEdit)return;setLoading(true);setError("");
   const {error:e2}=await supabaseBrowser.from("smart_businesses").update({name:companyEdit.name,category:companyEdit.category,short_description:companyEdit.short_description,whatsapp_number:companyEdit.whatsapp_number,instagram_url:companyEdit.instagram_url}).eq("id",companyEdit.id);
   setLoading(false);if(e2){setError(e2.message);return;}
   setCompanyEdit(null);setMessage("Informações da empresa atualizadas.");await loadCompanies();
 }
 function beginProduct(p?:Product){
  setProductEdit(p||null);setCreating(true);setProductName(p?.name??"");setProductPrice(p?.price==null?"":String(p.price));setProductDescription(p?.description??"");
  setProductImageUrl(p?.image_url??"");setProductFile(null);setProductAudience(p?.audience??"");setProductType(p?.frame_type??"");setProductSku(p?.sku??"");setProductAvailability(p?.is_active?"disponivel":p?.availability||"oculto");
 }
 async function saveProduct(e:React.FormEvent){e.preventDefault();if(!companyId||!productName.trim())return;setLoading(true);setError("");setMessage("");
  let imageUrl=productImageUrl.trim()||null;
  if(productFile){
   if(!["image/png","image/jpeg","image/webp"].includes(productFile.type)||productFile.size>3*1024*1024){setError("Envie JPEG, PNG ou WebP de até 3 MB.");setLoading(false);return;}
   const path=companyId+"/"+crypto.randomUUID()+"."+ (productFile.type==="image/png"?"png":productFile.type==="image/webp"?"webp":"jpg");
   const upload=await supabaseBrowser.storage.from("business-media").upload(path,productFile,{contentType:productFile.type,upsert:false});
   if(upload.error){setError("Falha no envio da imagem: "+upload.error.message);setLoading(false);return;}
   imageUrl=supabaseBrowser.storage.from("business-media").getPublicUrl(path).data.publicUrl;
  }
  const amount=productPrice.trim()?Number(productPrice.replace(",",".")):null;
  if(amount!==null&&(!Number.isFinite(amount)||amount<0)){setError("Preço inválido.");setLoading(false);return;}
  const payload={name:productName.trim(),description:productDescription.trim()||null,price:amount,image_url:imageUrl,sku:productSku.trim()||null,audience:productAudience.trim()||null,frame_type:productType.trim()||null,availability:productAvailability,is_active:productAvailability==="disponivel"};
  const action=productEdit
   ?await supabaseBrowser.from("smart_business_services").update(payload).eq("id",productEdit.id).eq("business_id",companyId)
   :await supabaseBrowser.from("smart_business_services").insert({...payload,business_id:companyId,sort_order:products.length});
  setLoading(false);
  if(action.error){setError(action.error.message);return;}
  setCreating(false);setProductEdit(null);setMessage("Catálogo atualizado.");await loadProducts();
 }
 async function invite(e:React.FormEvent){e.preventDefault();if(!companyId)return;setLoading(true);setError("");setMessage("");setInviteLink("");
   const {data,error:inviteError}=await supabaseBrowser.rpc("create_smart_business_invite",{
     p_business_id:companyId,p_email:inviteEmail.trim().toLowerCase(),p_member_role:inviteRole,
     p_can_edit_profile:editProfile,p_can_edit_catalog:editCatalog,p_can_edit_payment:editPayment
   });
   setLoading(false);
   if(inviteError||typeof data!=="string"){setError(inviteError?.message??"Falha ao gerar convite");return;}
   setInviteLink("https://alyssontech.com.br/portal/convite/"+data);
   setMessage("Convite criado. Compartilhe o link com o responsável pelo WhatsApp ou e-mail. Validade: 14 dias.");
 }
 async function toggleMember(){
    if(!confirmMember||loading)return;
    const {id,active}=confirmMember;
    setLoading(true);setError("");
    const r=await supabaseBrowser.from("smart_business_members").update({is_active:active}).eq("id",id);
    setLoading(false);if(r.error){setError(r.error.message);return;}
    setConfirmMember(null);
    setMessage(active?"Acesso reativado.":"Acesso revogado.");await loadMembers();
  }
  async function signOut(){await supabaseBrowser.auth.signOut();router.replace("/admin/login");}
 if(gate==="checking")return <main style={{padding:40,background:"#050805",color:"white",minHeight:"100vh"}}>Verificando acesso administrativo...</main>;
 if(gate==="denied")return <main style={{padding:40,background:"#050805",color:"white",minHeight:"100vh"}}><h1>Acesso restrito</h1><p>Somente administradores podem acessar o Control Center.</p><Link href="/admin/login">Entrar com outra conta</Link></main>;
 return <AdminShell current={meta[module].current} onSignOut={signOut}>
   <ConfirmDialog
      open={confirmMember!==null}
      title={confirmMember?.active?"Reativar acesso?":"Revogar acesso do usuário?"}
      description={confirmMember?.active
       ?"Este usuário recuperará as permissões anteriormente configuradas para sua empresa."
       :"O usuário deixará de acessar o portal da empresa, sem excluir seus cadastros ou os conteúdos da loja."}
      context={confirmMember ? "Usuário "+(members.find(m=>m.id===confirmMember.id)?.user_id.slice(0,8)??"") +"… · "+(companies.find(c=>c.id===members.find(m=>m.id===confirmMember.id)?.business_id)?.name??"Empresa") : undefined}
      confirmLabel={confirmMember?.active?"Sim, reativar":"Sim, revogar acesso"}
      tone={confirmMember?.active?"success":"danger"}
      busy={loading}
      error={error||undefined}
      onCancel={()=>{if(!loading){setConfirmMember(null);setError("");}}}
      onConfirm={()=>void toggleMember()}
   />
  <header style={{marginBottom:25}}><p style={{fontSize:11,letterSpacing:2,color:"#71ff41"}}>ALYSSON TECH / CONTROL CENTER</p><h1 style={{fontSize:"clamp(28px,4vw,42px)",margin:"8px 0"}}>{meta[module].title}</h1><p style={{color:"#a9b7ac"}}>{meta[module].subtitle}</p></header>
  {message&&<p role="status" style={{...card,color:"#94fb87"}}>{message}</p>}
  {error&&<p role="alert" style={{...card,color:"#ff9999"}}>{error}</p>}
  {(module==="empresas"||module==="catalogos"||module==="usuarios")&&<div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
   <label style={{minWidth:240,flex:1}}><span style={label}>Empresa selecionada</span><select style={input} value={companyId} onChange={e=>setCompanyId(e.target.value)}><option value="">Selecione uma empresa</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
   {module==="empresas"&&<button style={primary} onClick={()=>{setCreating(true);setCompanyEdit(null);}}>+ Cadastrar empresa</button>}
   {module==="catalogos"&&<button disabled={!companyId} style={primary} onClick={()=>beginProduct()}>+ Adicionar produto</button>}
  </div>}
  {module==="empresas"&&<>
   {creating&&!companyEdit&&<form onSubmit={createCompany} style={card}><h2>Nova empresa</h2><label style={label}>Nome *</label><input required style={input} value={companyName} onChange={e=>setCompanyName(e.target.value)}/><label style={{...label,marginTop:15}}>Segmento *</label><input required style={input} value={companyCategory} onChange={e=>setCompanyCategory(e.target.value)} placeholder="Ex.: Ótica, Barbearia, Restaurante"/><p style={{color:"#a8b5aa",fontSize:12}}>Será criada como rascunho; nenhuma rota existente será alterada.</p><div style={{display:"flex",gap:10}}><button disabled={loading} style={primary}>Salvar empresa</button><button type="button" style={secondary} onClick={()=>setCreating(false)}>Cancelar</button></div></form>}
   {companyEdit&&<form onSubmit={saveCompany} style={card}><h2>Editar {companyEdit.name}</h2>{([["name","Nome"],["category","Segmento"],["short_description","Descrição"],["whatsapp_number","WhatsApp"],["instagram_url","Instagram"]] as const).map(([key,title])=><label key={key} style={{display:"block",marginBottom:10}}><span style={label}>{title}</span><input style={input} value={companyEdit[key]??""} onChange={e=>setCompanyEdit({...companyEdit,[key]:e.target.value})}/></label>)}<button style={primary} disabled={loading}>Salvar alterações</button>{" "}<button type="button" style={secondary} onClick={()=>setCompanyEdit(null)}>Cancelar</button></form>}
   {companies.map(c=><article key={c.id} style={card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div><h3 style={{margin:"0 0 5px"}}>{c.name}</h3><p style={{color:"#a4b2a6",fontSize:12,margin:0}}>{c.category??"Sem categoria"} · {c.is_published?"Publicado":"Rascunho"} · /p/{c.slug}</p></div><button style={secondary} onClick={()=>{setCreating(false);setCompanyEdit(c);}}>Editar dados</button></div></article>)}
   {companies.length===0&&<p>Nenhuma empresa cadastrada.</p>}
  </>}
  {module==="catalogos"&&<>
   {creating&&<form onSubmit={saveProduct} style={card}><h2>{productEdit?"Editar item":"Novo item"}</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
     <label><span style={label}>Nome *</span><input required style={input} value={productName} onChange={e=>setProductName(e.target.value)}/></label>
     <label><span style={label}>Preço (R$)</span><input style={input} inputMode="decimal" value={productPrice} onChange={e=>setProductPrice(e.target.value)} placeholder="0,00"/></label>
     <label><span style={label}>Categoria / público</span><input style={input} value={productAudience} onChange={e=>setProductAudience(e.target.value)} placeholder="Feminino, Masculino..."/></label>
     <label><span style={label}>Tipo</span><input style={input} value={productType} onChange={e=>setProductType(e.target.value)} placeholder="Óculos de grau..."/></label>
     <label><span style={label}>Código SKU</span><input style={input} value={productSku} onChange={e=>setProductSku(e.target.value)}/></label>
     <label><span style={label}>Disponibilidade</span><select style={input} value={productAvailability} onChange={e=>setProductAvailability(e.target.value)}><option value="disponivel">Disponível</option><option value="vendido">Vendido</option><option value="oculto">Oculto</option></select></label>
    </div>
    <label style={{display:"block",marginTop:12}}><span style={label}>Descrição</span><textarea style={{...input,minHeight:90}} value={productDescription} onChange={e=>setProductDescription(e.target.value)}/></label>
    <label style={{display:"block",marginTop:12}}><span style={label}>Foto do item (JPEG, PNG ou WebP até 3 MB)</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setProductFile(e.target.files?.[0]??null)}/></label>
    <label style={{display:"block",marginTop:12}}><span style={label}>Ou URL da foto já existente</span><input style={input} value={productImageUrl} onChange={e=>setProductImageUrl(e.target.value)}/></label>
    <div style={{display:"flex",gap:10,marginTop:16}}><button disabled={loading} style={primary}>{loading?"Salvando...":"Salvar item"}</button><button type="button" style={secondary} onClick={()=>setCreating(false)}>Cancelar</button></div>
   </form>}
   {products.map(p=><article key={p.id} style={{...card,display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}><div><strong>{p.name}</strong><p style={{color:"#a4b2a6",margin:"6px 0 0",fontSize:12}}>{currency(p.price)} · {p.is_active?"Visível":p.availability==="vendido"?"Vendido":"Oculto"}</p></div><button style={secondary} onClick={()=>beginProduct(p)}>Editar item</button></article>)}
   {companyId&&products.length===0&&<p>Essa empresa ainda não possui itens no catálogo.</p>}
  </>}
  {module==="usuarios"&&<>
   <form onSubmit={invite} style={card}><h2>Convidar responsável da empresa</h2><p style={{color:"#aab5ac",fontSize:13}}>Gere um link individual e compartilhe com o responsável. A pessoa cria a conta e confirma o próprio e-mail. Para uma venda sem painel, não é necessário convidar ninguém.</p>
    <label style={label}>E-mail do responsável</label><input style={input} type="email" required value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/>
    <label style={{display:"block",marginTop:12}}><span style={label}>Papel</span><select style={input} value={inviteRole} onChange={e=>setInviteRole(e.target.value)}><option value="editor">Editor</option><option value="viewer">Visualização</option><option value="owner">Responsável</option></select></label>
    <div style={{display:"flex",flexWrap:"wrap",gap:18,margin:"17px 0"}}>{([["Informações",editProfile,setEditProfile],["Catálogo",editCatalog,setEditCatalog],["Pix",editPayment,setEditPayment]] as const).map(([name,val,set])=><label key={name} style={{fontSize:13}}><input type="checkbox" checked={val} onChange={e=>set(e.target.checked)}/> {name}</label>)}</div>
    <button disabled={loading||!companyId} style={primary}>Gerar link de acesso</button>
   </form>
   {inviteLink&&<div style={{...card,borderColor:"#71ff41"}}><strong>Link de convite criado</strong><p style={{fontSize:12,color:"#c0cfbe"}}>Válido por 14 dias, utilizável somente pelo e-mail informado.</p><input readOnly value={inviteLink} aria-label="Link de convite" onFocus={e=>e.target.select()} style={input}/><button type="button" style={{...secondary,marginTop:10}} onClick={()=>void navigator.clipboard.writeText(inviteLink)}>Copiar link</button></div>}
   <h2>Acessos vinculados</h2>
   {members.filter(m=>!companyId||m.business_id===companyId).map(m=><article key={m.id} style={card}><strong>{m.member_role}</strong><p style={{fontSize:12,color:"#aab5ac"}}>Usuário {m.user_id.slice(0,8)}… · {companies.find(c=>c.id===m.business_id)?.name??m.business_id}</p><p style={{fontSize:12}}>Perfil: {m.can_edit_profile?"sim":"não"} · Catálogo: {m.can_edit_catalog?"sim":"não"} · Pix: {m.can_edit_payment?"sim":"não"}</p><p style={{fontSize:12,color:m.is_active?"#8ae98a":"#e5bcbc"}}>{m.is_active?"Acesso ativo":"Acesso revogado"}</p><button type="button" disabled={loading} style={secondary} onClick={()=>{setError("");setConfirmMember({id:m.id,active:!m.is_active});}}>{m.is_active?"Revogar acesso":"Reativar acesso"}</button></article>)}
   {members.length===0&&<p style={{color:"#aab5ac"}}>Nenhum acesso de cliente vinculado ainda.</p>}
  </>}
  {module==="assinaturas"&&<><p style={{color:"#a9b8a8"}}>Registro manual das mensalidades. Nenhuma cobrança automática é feita aqui.</p>{companies.map(c=>{const sub=subscriptions.find(x=>x.business_id===c.id);return <article key={c.id} style={card}><strong>{c.name}</strong><p style={{color:"#a9b8a8",fontSize:12}}>{sub?currency(Number(sub.monthly_amount))+" / mês · "+sub.status:"Sem assinatura cadastrada"}</p><div style={{display:"flex",gap:10,alignItems:"end",flexWrap:"wrap"}}><label><span style={label}>Modalidade</span><select id={"tier-"+c.id} defaultValue={sub?.plan_tier??"standard"} style={{...input,maxWidth:180}}><option value="low_ticket">Low ticket — manutenção</option><option value="standard">Padrão — gestão</option></select></label><label><span style={label}>Mensalidade (R$)</span><input aria-label={"Valor para "+c.name} id={"valor-"+c.id} type="number" min="0" step="0.01" defaultValue={sub?.monthly_amount??""} style={{...input,maxWidth:150}}/></label><label><span style={label}>Situação</span><select id={"status-"+c.id} defaultValue={sub?.status??"pending"} style={{...input,maxWidth:160}}><option value="pending">Pendente</option><option value="active">Ativa</option><option value="paused">Pausada</option><option value="cancelled">Cancelada</option></select></label><button style={secondary} onClick={()=>void(async()=>{const rawValue=(document.getElementById("valor-"+c.id) as HTMLInputElement)?.value?.trim()??"";const value=rawValue===""?NaN:Number(rawValue);const status=(document.getElementById("status-"+c.id) as HTMLSelectElement)?.value;const plan_tier=(document.getElementById("tier-"+c.id) as HTMLSelectElement)?.value as "low_ticket"|"standard";if(!Number.isFinite(value)||value<0)return setError("Valor inválido");const r=await supabaseBrowser.from("smart_business_subscriptions").upsert({business_id:c.id,monthly_amount:value,status,plan_tier});if(r.error)return setError(r.error.message);setSubscriptions(current=>[...current.filter(x=>x.business_id!==c.id),{business_id:c.id,monthly_amount:value,status,plan_tier}]);setError("");setMessage("Assinatura registrada internamente.");})()}>Salvar</button></div></article>;})}</>}
  {module==="produtos"&&<AdminOfferings />}
  {module==="configuracoes"&&<div style={card}><h2>Ambiente central</h2><p>Supabase: Alysson Tech AI Office</p><p>As rotas permanentes de QR/NFC permanecem no módulo Placas inteligentes.</p><p style={{color:"#a6b4aa"}}>Somente administradores autorizados podem alterar vínculos, permissões e redirecionamentos.</p><Link href="/admin/placas" style={{color:"#71ff41"}}>Gerenciar placas</Link></div>}
 </AdminShell>;
}
