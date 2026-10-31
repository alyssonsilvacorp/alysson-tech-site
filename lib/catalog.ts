import { supabase } from "./supabase";
import type { CatalogBrand, CatalogProduct, DeliveryZone } from "../components/catalog/CatalogStorefront";

type BusinessRow = {id:string;slug:string;name:string;category:string|null;logo_url:string|null;logo_initials:string|null;whatsapp_number:string|null;accent_color:string|null;brand_support_color:string|null;brand_background_color:string|null;brand_highlight_color:string|null};
type SettingsRow = {status:string;headline:string|null;subheadline:string|null;announcement:string|null;delivery_enabled:boolean;pickup_enabled:boolean;accept_inquiries:boolean};
export type PublicCatalog={brand:CatalogBrand;products:CatalogProduct[];zones:DeliveryZone[]};

export async function getPublicCatalog(slug:string):Promise<PublicCatalog|null>{
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>90)return null;
 const b=await supabase.from("smart_businesses").select("id,slug,name,category,logo_url,logo_initials,whatsapp_number,accent_color,brand_support_color,brand_background_color,brand_highlight_color").eq("slug",slug).maybeSingle();
 if(b.error)throw Error("Falha ao consultar a empresa do catálogo.");
 if(!b.data)return null;
 const business=b.data as BusinessRow;
 const settings=await supabase.from("smart_catalog_settings").select("status,headline,subheadline,announcement,delivery_enabled,pickup_enabled,accept_inquiries").eq("business_id",business.id).eq("status","published").maybeSingle();
 if(settings.error)throw Error("Falha ao consultar a publicação do catálogo.");
 if(!settings.data)return null;
 const c=settings.data as SettingsRow;
 const [p,z]=await Promise.all([
   supabase.from("smart_business_services").select("id,name,description,price,price_label,image_url,sku,availability,catalog_category,catalog_badge,catalog_variants,sort_order").eq("business_id",business.id).eq("is_active",true).order("sort_order"),
   supabase.from("smart_catalog_delivery_zones").select("id,label,delivery_fee").eq("business_id",business.id).eq("is_active",true).order("sort_order"),
 ]);
 if(p.error||z.error)throw Error("Falha ao consultar itens e modalidades do catálogo.");
 return {
   brand:{
    name:business.name,slug:business.slug,initials:business.logo_initials??business.name.slice(0,2).toUpperCase(),category:business.category,
    logo:business.logo_url,whatsapp:business.whatsapp_number,primary:business.accent_color||"#6d293e",
    support:business.brand_support_color||"#8d3b50",background:business.brand_background_color||"#faf8f9",
    highlight:business.brand_highlight_color||"#f2e6e9",headline:c.headline,subheadline:c.subheadline,announcement:c.announcement,
    deliveryEnabled:c.delivery_enabled,pickupEnabled:c.pickup_enabled,acceptInquiries:c.accept_inquiries
   },
   products:(p.data??[]) as CatalogProduct[],zones:(z.data??[]) as DeliveryZone[]
 };
}
