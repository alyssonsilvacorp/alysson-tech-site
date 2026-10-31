import {notFound} from "next/navigation";
import ControlModules from "../../../components/admin/ControlModules";
import UnifiedCatalogAdminPage from "../../../components/admin/UnifiedCatalogAdminPage";
const modules=["empresas","catalogos","usuarios","assinaturas","produtos","configuracoes"] as const;
export default async function AdminModulePage({params}:{params:Promise<{module:string}>}){
 const {module}=await params;
 if(!modules.some(x=>x===module))notFound();
 if(module==="empresas"||module==="catalogos")return <UnifiedCatalogAdminPage section={module}/>;
 return <ControlModules module={module as (typeof modules)[number]}/>;
}
