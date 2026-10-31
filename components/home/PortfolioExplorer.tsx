"use client";

import {useMemo,useState} from "react";
import Image from "next/image";
import {ArrowUpRight,Check,ChevronRight,Globe2,Layers3,MessageSquareText,ScanLine,
 ShoppingBag,Store,UtensilsCrossed,Workflow,Wrench,PanelTop,MessagesSquare,MapPinned,
 Sparkles,ShieldCheck,MousePointerClick} from "lucide-react";
import styles from "./PortfolioExplorer.module.css";

type Category="Todos"|"Placas & NFC"|"Presença digital"|"Sistemas & SaaS"|"Serviços técnicos";
type Offering={
 id:string;name:string;eyebrow:string;category:Exclude<Category,"Todos">;
 summary:string;detail:string;outcomes:string[];
 status:"Disponível"|"Sob consulta"|"Piloto"|"Em homologação"|"Em integração";
 Icon:typeof ScanLine;
};
const categories:Category[]=["Todos","Placas & NFC","Presença digital","Sistemas & SaaS","Serviços técnicos"];
const products:Offering[]=[
 {id:"placa-avaliacoes",name:"Placa Google Avaliações",eyebrow:"QR CODE + NFC",category:"Placas & NFC",summary:"Avaliações a um toque do cliente.",detail:"Placa física com acesso facilitado à página de avaliação do estabelecimento. O destino pode ser administrado sem substituir o QR/NFC.",outcomes:["Acesso por aproximação ou câmera","Rota permanente","Modelo padrão ou personalizado"],status:"Disponível",Icon:ScanLine},
 {id:"placa-multilink",name:"Placa Multilink",eyebrow:"QR CODE + NFC",category:"Placas & NFC",summary:"Uma placa que abre toda a presença digital.",detail:"QR Code e NFC para o cartão digital da empresa, reunindo WhatsApp, Instagram, localização, Pix e catálogo quando contratado.",outcomes:["Destino editável","Identidade da empresa","Painel opcional"],status:"Disponível",Icon:Layers3},
 {id:"placa-food",name:"Placa Food por Mesa",eyebrow:"IZALY FOOD",category:"Placas & NFC",summary:"Da mesa para o cardápio e pedidos.",detail:"Identificação de mesa para acesso ao cardápio digital do IZALY Food, conforme implantação e configuração de cada restaurante.",outcomes:["QR Code por mesa","Cardápio digital","Integrada ao módulo Food"],status:"Disponível",Icon:UtensilsCrossed},
 {id:"multilink",name:"Multilink Empresarial",eyebrow:"PRESENÇA DIGITAL",category:"Presença digital",summary:"Todos os canais da empresa em um único link.",detail:"Perfil digital com a identidade do estabelecimento e atalhos diretos para seus principais canais, serviços e catálogo.",outcomes:["WhatsApp, Instagram e mapa","Pix e serviços","Vinculação a placa opcional"],status:"Disponível",Icon:Globe2},
 {id:"catalogos",name:"IZALY Catálogos",eyebrow:"CATÁLOGO PREMIUM",category:"Presença digital",summary:"Vitrine independente com seleção e WhatsApp.",detail:"Catálogo digital com identidade visual da loja, filtros de produtos, consulta e seleção para WhatsApp, com gerenciamento integrado ao portal da Alysson Tech.",outcomes:["Página independente","Consulta e seleção de produtos","Identidade da loja personalizada"],status:"Disponível",Icon:ShoppingBag},
 {id:"sites",name:"Sites & Landing Pages",eyebrow:"WEB DESIGN",category:"Presença digital",summary:"Uma presença profissional para gerar contatos.",detail:"Sites institucionais e páginas de conversão desenvolvidos para apresentar ofertas, serviços e diferenciais com uma navegação clara.",outcomes:["Design responsivo","Apresentação da marca","Contato e conversão"],status:"Disponível",Icon:PanelTop},
 {id:"presenca-local",name:"Presença Digital Local",eyebrow:"GOOGLE + WHATSAPP",category:"Presença digital",summary:"Sua empresa mais fácil de encontrar e contatar.",detail:"Organização dos canais de atendimento e presença local, com orientação para Perfil da Empresa no Google e WhatsApp Business.",outcomes:["Google Perfil da Empresa","WhatsApp Business","Canais de contato integrados"],status:"Disponível",Icon:MapPinned},
 {id:"food",name:"IZALY Food",eyebrow:"TECNOLOGIA PARA RESTAURANTES",category:"Sistemas & SaaS",summary:"Cardápio, pedidos e rotina de atendimento.",detail:"Solução comercial de cardápio digital e pedidos para estabelecimentos de alimentação, com implantação adequada à rotina de cada cliente.",outcomes:["Cardápio e categorias","Pedidos digitais","Gestão operacional em evolução"],status:"Disponível",Icon:UtensilsCrossed},
 {id:"crm",name:"IZALY CRM IA",eyebrow:"RELACIONAMENTO",category:"Sistemas & SaaS",summary:"Atendimento e oportunidades organizadas.",detail:"Solução de CRM IA oferecida pela Alysson Tech para organizar contatos e oportunidades. Integrações e automações dependem da configuração e do escopo contratado.",outcomes:["Organização de contatos","Acompanhamento de oportunidades","Integrações conforme o escopo"],status:"Disponível",Icon:MessagesSquare},
 {id:"sob-medida",name:"Sistemas sob Medida",eyebrow:"DESENVOLVIMENTO",category:"Sistemas & SaaS",summary:"Software que acompanha sua operação.",detail:"Sistemas web, portais e painéis construídos a partir do processo real de cada empresa, com escopo definido antes do desenvolvimento.",outcomes:["Gestão de processos","Perfis e permissões","Projeto personalizado"],status:"Disponível",Icon:Store},
 {id:"automacoes",name:"Automações & Integrações",eyebrow:"EFICIÊNCIA OPERACIONAL",category:"Serviços técnicos",summary:"Menos tarefas manuais, mais controle.",detail:"Integração de ferramentas e automatização de rotinas repetitivas, com análise de viabilidade e segurança dos dados.",outcomes:["Fluxos automatizados","Integrações entre sistemas","Acompanhamento operacional"],status:"Disponível",Icon:Workflow},
 {id:"suporte",name:"Suporte de TI & Redes",eyebrow:"INFRAESTRUTURA",category:"Serviços técnicos",summary:"Tecnologia funcionando no dia a dia.",detail:"Diagnóstico, manutenção e suporte de computadores, redes e ambientes de trabalho, com atendimento conforme disponibilidade e escopo.",outcomes:["Suporte e diagnóstico","Computadores e redes","Orientação técnica"],status:"Disponível",Icon:Wrench},
];
export default function PortfolioExplorer(){
 const [category,setCategory]=useState<Category>("Todos");
 const [selected,setSelected]=useState<string[]>([]);
 const [focused,setFocused]=useState<string>("multilink");
 const list=useMemo(()=>products.filter(p=>category==="Todos"||p.category===category),[category]);
 const current=products.find(p=>p.id===focused)??products[0];
 const choose=(id:string)=>{setFocused(id);setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);};
 const selectedNames=selected.map(id=>products.find(p=>p.id===id)?.name).filter(Boolean);
 const consultUrl="https://wa.me/5582999926146?text="+encodeURIComponent("Olá! Encontrei as soluções da Alysson Tech pelo site e gostaria de uma proposta sobre:\n"+(selectedNames.length?selectedNames.map(x=>"• "+x).join("\n"):"Uma solução para meu negócio")+"\n\nPodemos conversar sobre as opções?");
 return <div className={styles.explorer}>
  <div className={styles.toolbar}>
   <div className={styles.intro}><span><Sparkles size={14} aria-hidden="true"/> PORTFÓLIO DE SOLUÇÕES</span><h3>Escolha a tecnologia que faz sentido.</h3><p>Explore nossos produtos, selecione as opções de interesse e solicite uma análise sem compromisso.</p></div>
   <div className={styles.counter}><strong>{String(products.length).padStart(2,"0")}</strong><span>SOLUÇÕES<br/>NO PORTFÓLIO</span></div>
  </div>
  <div className={styles.filters} role="group" aria-label="Filtrar soluções por área">
    {categories.map(cat=><button key={cat} type="button" onClick={()=>setCategory(cat)} aria-pressed={category===cat}
     className={category===cat?styles.filterActive:styles.filter}>{cat}</button>)}
  </div>
  <div className={styles.workspace}>
   <div className={styles.catalogGrid}>
     {list.map((product,index)=><button type="button" key={product.id} onClick={()=>choose(product.id)} aria-pressed={selected.includes(product.id)}
      className={selected.includes(product.id)?styles.cardSelected:styles.card}>
       <div className={styles.cardTop}><span className={styles.cardIcon}>{(product.id==="food"||product.id==="crm"||product.id==="catalogos")?<Image src="/brand/izaly-platform.jpeg" alt="" width={38} height={38} unoptimized className={styles.solutionBrandLogo}/>:<product.Icon size={23} strokeWidth={1.6} aria-hidden="true"/>}</span><span className={styles.cardIndex}>{String(index+1).padStart(2,"0")}</span></div>
       <span className={styles.kicker}>{product.eyebrow}</span><strong>{product.name}</strong><p>{product.summary}</p>
       <div className={styles.cardFooter}><span>{product.status}</span><span className={styles.cardChoose}>{selected.includes(product.id)?<Check size={17}/>:<ChevronRight size={17}/>}</span></div>
      </button>)}
   </div>
   <aside className={styles.inspector} aria-live="polite">
    <div className={styles.inspectorHead}><span>AT / SELETOR DE SOLUÇÕES</span><span className={styles.live}><i/> EM DESTAQUE</span></div>
    <div className={styles.logobox}><Image src="/brand/alysson-tech-icon.png" alt="Símbolo oficial Alysson Tech" width={100} height={100} unoptimized/></div>
    <div className={styles.inspectorBody}>
      <span className={styles.activeKicker}>{current.eyebrow}</span>
      <h4>{current.name}</h4>
      <p>{current.detail}</p>
      <div className={styles.inspectorDivider}/>
      <span className={styles.includesLabel}>O QUE INCLUI</span>
      {current.outcomes.map(x=><div className={styles.outcome} key={x}><ShieldCheck size={16} aria-hidden="true"/><span>{x}</span></div>)}
      <div className={styles.inspectorStatus}><span>CONDIÇÃO ATUAL</span><strong>{current.status}</strong></div>
    </div>
    <div className={styles.inspectorFooter}><div><MousePointerClick size={16}/><span>{selected.length?selected.length+" solução(ões) selecionada(s)":"Clique nos produtos para selecionar"}</span></div>
     {selected.length>0&&<button type="button" className={styles.clear} onClick={()=>setSelected([])}>Limpar seleção</button>}
     <a href={consultUrl} target="_blank" rel="noopener noreferrer" className={styles.contact}>
       {selected.length?"Solicitar proposta das selecionadas":"Conversar sobre esta solução"} <ArrowUpRight size={18}/>
     </a>
    </div>
   </aside>
  </div>
  <div className={styles.bottom}>
    <div><span className={styles.bottomLine}/><p>Uma marca. Diferentes soluções. Projetos sob medida e produtos em diferentes estágios de implantação.</p></div>
    <a href="#analise">Prefere explicar sua necessidade? Solicite uma análise <ArrowUpRight size={17}/></a>
  </div>
 </div>;
}
