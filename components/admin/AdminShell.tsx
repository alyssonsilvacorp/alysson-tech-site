"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { LayoutDashboard, ScanLine, Building2, BookOpen, Users, CreditCard, BriefcaseBusiness, Settings } from "lucide-react";
import styles from "./AdminShell.module.css";

type Module = "dashboard" | "plates" | "companies" | "catalogs" | "users" | "subscriptions" | "products" | "settings";
type AdminShellProps = {children: ReactNode;current?: Module;onSignOut: () => void | Promise<void>};

const navigation = [
  {key:"dashboard",label:"Visão geral",href:"/admin",Icon:LayoutDashboard},
  {key:"companies",label:"Empresas",href:"/admin/empresas",Icon:Building2},
  {key:"products",label:"Produtos e serviços",href:"/admin/produtos",Icon:BriefcaseBusiness},
  {key:"plates",label:"Placas inteligentes",href:"/admin/placas",Icon:ScanLine},
  {key:"catalogs",label:"Catálogos",href:"/admin/catalogos",Icon:BookOpen},
  {key:"users",label:"Usuários e permissões",href:"/admin/usuarios",Icon:Users},
  {key:"subscriptions",label:"Assinaturas",href:"/admin/assinaturas",Icon:CreditCard},
  {key:"settings",label:"Configurações",href:"/admin/configuracoes",Icon:Settings},
] as const;

export default function AdminShell({children,current="dashboard",onSignOut}:AdminShellProps){
 return <div className={styles.shell}>
  <aside className={styles.sidebar}>
   <div className={styles.brand}><span className={styles.brandMark}><Image src="/brand/alysson-tech-icon.png" alt="" fill unoptimized sizes="42px" /></span><div><strong>ALYSSON</strong><span>TECH</span></div></div>
   <div className={styles.workspace}><span>WORKSPACE</span><strong>Control Center</strong><small>Operação interna Alysson Tech</small></div>
   <nav className={styles.nav} aria-label="Gestão da Alysson Tech"><p>NAVEGAÇÃO</p>
    {navigation.map(({key,label,href,Icon})=><Link key={key} href={href} className={current===key?styles.navActive:styles.navItem} aria-current={current===key?"page":undefined}><Icon aria-hidden="true"/><span>{label}</span></Link>)}
   </nav>
   <div className={styles.sidebarFooter}><div className={styles.systemStatus}><i/><div><strong>Área administrativa</strong><span>Acesso restrito por autenticação</span></div></div><button type="button" className={styles.signOut} onClick={()=>void onSignOut()}>Encerrar sessão</button></div>
  </aside>
  <main className={styles.main}><div className={styles.grid} aria-hidden="true"/><div className={styles.glow} aria-hidden="true"/><div className={styles.content}>{children}</div></main>
 </div>;
}
