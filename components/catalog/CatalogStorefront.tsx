"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./CatalogStorefront.module.css";

export type CatalogProduct = {
 id:string;name:string;description:string|null;price:number|null;price_label:string|null;
 image_url:string|null;sku:string|null;availability:string;catalog_category:string|null;
 catalog_badge:string|null;catalog_variants:unknown;sort_order:number;
};
export type DeliveryZone = {id:string;label:string;delivery_fee:number};
export type CatalogBrand = {
 name:string;slug:string;initials:string;category:string|null;logo:string|null;
 whatsapp:string|null;primary:string;support:string;background:string;highlight:string;
 headline:string|null;subheadline:string|null;announcement:string|null;
 deliveryEnabled:boolean;pickupEnabled:boolean;acceptInquiries:boolean;
};
type CartLine={key:string;product:CatalogProduct;quantity:number;selection:Record<string,string>};
const brl=(v:number)=>Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const safeHex=(s:string)=>/^#[0-9a-fA-F]{6}$/.test(s)?s:"#6d293e";
const mobile=(number:string|null)=>{const digits=(number??"").replace(/\D/g,"");return /^\d{12,13}$/.test(digits)?digits:null};
const variationList=(v:unknown):{name:string;options:string[]}[]=>{
 if(!Array.isArray(v))return [];
 return v.filter(item=>item&&typeof item==="object"&&typeof item.name==="string"&&Array.isArray(item.options))
 .map(item=>({name:String(item.name).slice(0,80),options:item.options.filter((o:unknown)=>typeof o==="string").map((o:string)=>o.slice(0,80))}));
};
const priceText=(p:CatalogProduct)=>p.price===null?(p.price_label&&p.price_label!=="0"&&p.price_label!=="R$ 0,00"?p.price_label:"Sob consulta"):brl(p.price);

export default function CatalogStorefront({brand,products,zones,adminPreview=false}:{brand:CatalogBrand;products:CatalogProduct[];zones:DeliveryZone[];adminPreview?:boolean}) {
 const [search,setSearch]=useState("");
 const [category,setCategory]=useState("Todos");
 const [detail,setDetail]=useState<CatalogProduct|null>(null);
 const [selection,setSelection]=useState<Record<string,string>>({});
 const [cart,setCart]=useState<CartLine[]>([]);
 const [showCart,setShowCart]=useState(false);
 const [step,setStep]=useState<1|2|3>(1);
 const [fulfilment,setFulfilment]=useState<"delivery"|"pickup">(brand.deliveryEnabled?"delivery":"pickup");
 const [zone,setZone]=useState("");
 const [address,setAddress]=useState("");
 const [customer,setCustomer]=useState("");
 const phone=mobile(brand.whatsapp);
 const palette={"--cat-primary":safeHex(brand.primary),"--cat-support":safeHex(brand.support),"--cat-background":safeHex(brand.background),"--cat-highlight":safeHex(brand.highlight)} as React.CSSProperties;
 const categories=useMemo(()=>["Todos",...Array.from(new Set(products.map(p=>p.catalog_category??"Geral"))).sort((a,b)=>a.localeCompare(b,"pt-BR"))],[products]);
 const list=useMemo(()=>products.filter(p=>(category==="Todos"||(p.catalog_category??"Geral")===category)&&[p.name,p.description??"",p.sku??""].some(v=>v.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR")))),[products,category,search]);
 const cartCount=cart.reduce((a,b)=>a+b.quantity,0);
 const shipping=zones.find(z=>z.id===zone);
 const subtotal=cart.reduce((sum,c)=>sum+(c.product.price??0)*c.quantity,0);
 const unknownPrices=cart.some(c=>c.product.price===null);
 const total=subtotal+(fulfilment==="delivery"&&shipping?Number(shipping.delivery_fee):0);
 function openProduct(p:CatalogProduct){setDetail(p);setSelection({});}
 function variantsReady(p:CatalogProduct){return variationList(p.catalog_variants).every(v=>!!selection[v.name]);}
 function lineSummary(p:CatalogProduct,options:Record<string,string>){return [p.name,p.sku?"Código: "+p.sku:"",...Object.entries(options).map(([k,v])=>k+": "+v)].filter(Boolean).join(" — ");}
 function addCart(p:CatalogProduct){if(!variantsReady(p))return;const key=p.id+":"+JSON.stringify(Object.entries(selection).sort());setCart(current=>{const old=current.find(c=>c.key===key);return old?current.map(c=>c.key===key?{...c,quantity:c.quantity+1}:c):[...current,{key,product:p,quantity:1,selection:{...selection}}]});setDetail(null);}
 function consult(p:CatalogProduct){if(!variantsReady(p)||!phone)return;const msg="Olá! Vi este produto no catálogo da "+brand.name+" e gostaria de mais informações:\n\n"+lineSummary(p,selection)+"\nPreço: "+priceText(p)+"\n\nPoderia me ajudar?";window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer");}
 function changeQty(key:string,delta:number){setCart(current=>current.map(x=>x.key===key?{...x,quantity:x.quantity+delta}:x).filter(x=>x.quantity>0));}
 function submitWhatsApp(){if(!phone||!cart.length||!customer.trim()||(fulfilment==="delivery"&&(!zone||!address.trim())))return;
  const lines=cart.map(l=>"- "+l.quantity+"× "+lineSummary(l.product,l.selection)+" — "+priceText(l.product)).join("\n");
  const deliveryInfo=fulfilment==="delivery"?"Entrega: "+shipping?.label+" (taxa "+brl(Number(shipping?.delivery_fee??0))+")\nEndereço: "+address.trim():"Modalidade: Retirada na loja";
  const msg="Olá! Quero consultar este pedido do catálogo "+brand.name+":\n\n"+lines+"\n\n"+deliveryInfo+"\nNome: "+customer.trim()+"\n"+(unknownPrices?"Valores de alguns produtos sob consulta.":"Total estimado: "+brl(total))+"\n\nPode confirmar disponibilidade e valores?";
  window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer");
 }
 return <div className={styles.root} style={palette}>
   {adminPreview&&<div className={styles.previewBanner}>PRÉ-VISUALIZAÇÃO ADMINISTRATIVA · Alterações não publicadas podem aparecer aqui.</div>}
   {brand.announcement&&<div className={styles.announcement}>{brand.announcement}</div>}
   <header className={styles.header}><div className={styles.headerInner}>
    <div className={styles.brandMark}>{brand.logo?<img src={brand.logo} alt={"Logo "+brand.name}/>:<span>{brand.initials||brand.name.slice(0,2).toUpperCase()}</span>}</div>
    <div className={styles.brandText}><strong>{brand.name}</strong><small>{brand.category??"Catálogo de produtos"}</small></div>
    <nav className={styles.headerLinks}><a href="#produtos">Produtos</a><a href="#contato">Contato</a></nav>
    <button className={styles.cartTrigger} onClick={()=>{setShowCart(true);setStep(1);}}>Meu carrinho <b>{cartCount}</b></button>
   </div></header>
   <main className={styles.main}>
    <section className={styles.hero}><div className={styles.heroCopy}><span>ESCOLHA COM LIBERDADE</span><h1>{brand.headline||"Encontre o que procura."}</h1><p>{brand.subheadline||"Conheça nossos produtos e consulte diretamente pelo WhatsApp."}</p><a href="#produtos">Explorar categorias <span aria-hidden="true">↗</span></a></div><div className={styles.heroVisual} aria-hidden="true"><span>{brand.initials||brand.name.slice(0,2).toUpperCase()}</span></div></section>
    <div className={styles.features}><div><strong>Catálogo atualizado</strong><small>Confira nossa seleção</small></div><div><strong>Escolha com facilidade</strong><small>Pesquise e personalize</small></div><div><strong>Pedido pelo WhatsApp</strong><small>Converse diretamente com a loja</small></div></div>
    <section id="produtos" className={styles.products}>
     <div className={styles.sectionTop}><div><span>NOSSA SELEÇÃO</span><h2>Explore os produtos</h2></div><small>{list.length} produto(s) encontrado(s)</small></div>
     <div className={styles.filters}><div className={styles.chips}>{categories.map(c=><button key={c} className={category===c?styles.chipSelected:styles.chip} onClick={()=>setCategory(c)}>{c}</button>)}</div><input aria-label="Buscar produtos" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produtos..."/></div>
     <div className={styles.grid}>{list.map(p=><article key={p.id} className={styles.card}>
       <button className={styles.productImage} onClick={()=>openProduct(p)} aria-label={"Ver detalhes de "+p.name}>
        {p.image_url?<img src={p.image_url} loading="lazy" alt={p.name}/>:<div className={styles.placeholder}>{brand.initials||"◇"}</div>}
       </button>
       <div className={styles.cardBody}><small>{p.catalog_category||"Geral"} {p.catalog_badge?" · "+p.catalog_badge:""}</small><h3>{p.name}</h3>
       <strong>{priceText(p)}</strong>
       <button onClick={()=>openProduct(p)}>Ver opções e consultar</button></div>
      </article>)}</div>
     {!list.length&&<p className={styles.empty}>Nenhum produto encontrado. Experimente outra categoria ou pesquisa.</p>}
    </section>
    <section id="contato" className={styles.footer}><h2>Ficou com alguma dúvida?</h2><p>Consulte preços, modelos e disponibilidade com a equipe da {brand.name}.</p>
      {phone?<a href={"https://wa.me/"+phone+"?text="+encodeURIComponent("Olá! Conheci o catálogo da "+brand.name+" e gostaria de informações.")} target="_blank" rel="noopener noreferrer">Falar no WhatsApp ↗</a>:<p>WhatsApp ainda não configurado pela loja.</p>}
    </section>
   </main>
   <footer className={styles.credit}><span>{brand.name} · Catálogo digital</span><Link href="/">Tecnologia Alysson Tech</Link></footer>
   {cartCount>0&&!showCart&&<button className={styles.floatCart} onClick={()=>{setShowCart(true);setStep(1);}}>Meu carrinho · {cartCount}</button>}
   {detail&&<div className={styles.overlay} role="presentation"><div className={styles.modal} role="dialog" aria-modal="true" aria-label={"Produto "+detail.name}>
     <button className={styles.close} onClick={()=>setDetail(null)} aria-label="Fechar">×</button>
     {detail.image_url&&<div className={styles.modalImage}><img src={detail.image_url} alt={detail.name}/></div>}
     <span className={styles.tag}>{detail.catalog_category||"Produto"}</span><h2>{detail.name}</h2>{detail.sku&&<small>Código: {detail.sku}</small>}
     <p>{detail.description||"Consulte este item diretamente com a loja."}</p><h3>{priceText(detail)}</h3>
     {variationList(detail.catalog_variants).map(v=><label key={v.name} className={styles.variation}>{v.name}<select value={selection[v.name]||""} onChange={e=>setSelection({...selection,[v.name]:e.target.value})} required><option value="">Selecione</option>{v.options.map(o=><option key={o} value={o}>{o}</option>)}</select></label>)}
     <div className={styles.modalActions}><button onClick={()=>addCart(detail)} disabled={!variantsReady(detail)}>Adicionar ao carrinho</button>{brand.acceptInquiries&&<button className={styles.outline} disabled={!phone||!variantsReady(detail)} onClick={()=>consult(detail)}>Consultar este produto</button>}</div>
   </div></div>}
   {showCart&&<div className={styles.overlay}><aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Meu pedido">
     <div className={styles.drawerHead}><div><h2>Meu pedido</h2><small>Confira os itens antes de conversar com a loja</small></div><button onClick={()=>setShowCart(false)} aria-label="Fechar">×</button></div>
     <div className={styles.steps}><span className={step===1?styles.current:""}>1 Carrinho</span><span className={step===2?styles.current:""}>2 Seus dados</span><span className={step===3?styles.current:""}>3 Revisar</span></div>
     <div className={styles.drawerBody}>
      {step===1&&<><h3>Seu carrinho</h3>{cart.map(l=><div className={styles.cartLine} key={l.key}><strong>{l.product.name}</strong><small>{Object.entries(l.selection).map(([k,v])=>k+": "+v).join(" · ")}</small><small>{priceText(l.product)}</small><div><button onClick={()=>changeQty(l.key,-1)}>−</button><span>{l.quantity}</span><button onClick={()=>changeQty(l.key,1)}>+</button></div></div>)}{!cart.length&&<p>Seu carrinho está vazio.</p>}</>}
      {step===2&&<><h3>Seus dados</h3><label>Seu nome<input required value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Como podemos chamar você?"/></label>{brand.deliveryEnabled&&brand.pickupEnabled&&<label>Recebimento<select value={fulfilment} onChange={e=>setFulfilment(e.target.value as "delivery"|"pickup")}><option value="delivery">Entrega</option><option value="pickup">Retirada</option></select></label>}{fulfilment==="delivery"&&brand.deliveryEnabled&&<><label>Bairro<select value={zone} onChange={e=>setZone(e.target.value)}><option value="">Selecione um bairro</option>{zones.map(z=><option key={z.id} value={z.id}>{z.label} · taxa {brl(Number(z.delivery_fee))}</option>)}</select></label><label>Endereço<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Rua, número e complemento"/></label></>}</>}
      {step===3&&<><h3>Revisar pedido</h3>{cart.map(l=><p key={l.key}>{l.quantity}× {lineSummary(l.product,l.selection)} — {priceText(l.product)}</p>)}<p>Cliente: {customer}</p><p>{fulfilment==="delivery"?"Entrega em "+(shipping?.label??""):"Retirada no local"}</p><p>{unknownPrices?"Valores sob consulta; serão confirmados pela loja.":"Total estimado: "+brl(total)}</p></>}
     </div>
     <div className={styles.drawerFooter}><p>{unknownPrices?"Produtos sem preço serão confirmados no WhatsApp.":"Subtotal: "+brl(subtotal)}{fulfilment==="delivery"&&shipping?" · Entrega: "+brl(Number(shipping.delivery_fee)):""}</p>
     <div>{step>1&&<button className={styles.outline} onClick={()=>setStep(step===3?2:1)}>Voltar</button>}
     {step===1?<button disabled={!cart.length} onClick={()=>setStep(2)}>Continuar</button>:step===2?<button disabled={!customer.trim()||(fulfilment==="delivery"&&(!zone||!address.trim()))} onClick={()=>setStep(3)}>Revisar pedido</button>:<button disabled={!phone} onClick={submitWhatsApp}>Enviar pelo WhatsApp</button>}</div>
     <small>Sem pagamento automático. Confirmação diretamente com a loja.</small></div>
    </aside></div>}
 </div>;
}
