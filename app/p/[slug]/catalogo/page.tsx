import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogStorefront from "../../../../components/catalog/CatalogStorefront";
import { getPublicCatalog } from "../../../../lib/catalog";

export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params; const catalog=await getPublicCatalog(slug);
 if(!catalog)return {title:"Catálogo indisponível"};
 return {title:catalog.brand.name+" | Catálogo",description:catalog.brand.subheadline||"Conheça os produtos e consulte diretamente pelo WhatsApp.",icons:{icon:catalog.brand.logo||"/favicon.ico",shortcut:catalog.brand.logo||"/favicon.ico",apple:catalog.brand.logo||"/apple-touch-icon.png"},openGraph:{title:catalog.brand.name+" | Catálogo",description:catalog.brand.subheadline||"Catálogo oficial de produtos da "+catalog.brand.name,type:"website",images:catalog.brand.logo?[{url:catalog.brand.logo,alt:"Logo "+catalog.brand.name}]:undefined},robots:{index:true,follow:true},alternates:{canonical:"/p/"+slug+"/catalogo"}};
}
export default async function PublicCatalogPage({params}:Props){
 const {slug}=await params;
 const catalog=await getPublicCatalog(slug);
 if(!catalog)notFound();
 return <CatalogStorefront {...catalog}/>;
}
