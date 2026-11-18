import type { Metadata } from "next";
import CatalogStorefront from "../../../../components/catalog/CatalogStorefront";
import IzalyTechPending from "../../../../components/catalog/IzalyTechPending";
import { getPublicCatalog } from "../../../../lib/catalog";

export const dynamic="force-dynamic";

export async function generateMetadata():Promise<Metadata>{
 const data=await getPublicCatalog("izaly-tech");
 return {
  title:"Catálogo | IZALY Tech Premium",
  description:"Confira produtos reais e consulte a disponibilidade da IZALY Tech em Maceió.",
  icons:{icon:"/izaly/izaly-tech-favicon-192.png",shortcut:"/izaly/izaly-tech-favicon.ico",apple:"/izaly/izaly-tech-favicon-192.png"},
  alternates:{canonical:"/p/izaly-tech/catalogo"},
  openGraph:{title:"Catálogo | IZALY Tech Premium",images:[{url:"/izaly/izaly-tech-logo-v2.webp",width:1440,height:480,alt:"IZALY Tech Premium"}]},
  robots:{index:!!data,follow:true},
 };
}

export default async function IzalyTechCatalogPage(){
 const catalog=await getPublicCatalog("izaly-tech");
 if(!catalog)return <IzalyTechPending/>;
 return (
  <>
   <div style={{background:"#081c34",color:"#b8dafa",padding:"9px 16px",fontSize:12,textAlign:"center"}}>IZALY Tech Premium · Atendimento inicialmente em Maceió/AL · Entrega e retirada conforme disponibilidade</div>
   <CatalogStorefront {...catalog} persistCartKey="izaly-tech-cart-v1"/>
  </>
 );
}
