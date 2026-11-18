import type { Metadata } from "next";
import Link from "next/link";
import CatalogStorefront from "../../../../components/catalog/CatalogStorefront";
import IzalyTechPending from "../../../../components/catalog/IzalyTechPending";
import { getPublicCatalog } from "../../../../lib/catalog";

export const dynamic="force-dynamic";
export const metadata:Metadata={
 title:"Minha sacola | IZALY Tech",
 description:"Revise produtos e envie uma solicitação de compra para a IZALY Tech em Maceió. Sem pagamento online nesta etapa.",
 robots:{index:false,follow:true},
 icons:{icon:"/izaly/izaly-tech-favicon-192.png",shortcut:"/izaly/izaly-tech-favicon.ico"},
};

export default async function IzalyTechCartPage(){
 const catalog=await getPublicCatalog("izaly-tech");
 if(!catalog)return <IzalyTechPending cart/>;
 return (
  <>
   <div style={{background:"#061429",color:"#d6eaff",padding:"12px 16px",fontSize:12,textAlign:"center"}}><Link href="/p/izaly-tech/catalogo" style={{color:"#8ec7ff",textDecoration:"underline"}}>← Voltar aos produtos</Link> · Solicitações somente para atendimento em Maceió · Pagamento online desativado</div>
   <CatalogStorefront {...catalog} persistCartKey="izaly-tech-cart-v1" initialCartOpen/>
  </>
 );
}
