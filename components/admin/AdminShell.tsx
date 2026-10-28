"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, ScanLine, Building2, BookOpen, Users, CreditCard,
  BriefcaseBusiness, Settings, LogOut, Menu, X, ExternalLink, ShieldCheck,
} from "lucide-react";
import styles from "./AdminShell.module.css";

type Module = "dashboard" | "plates" | "companies" | "catalogs" | "users" | "subscriptions" | "products" | "settings";
type AdminShellProps = { children: ReactNode; current?: Module; onSignOut: () => void | Promise<void> };

const groups = [
  { title: "OPERAÇÃO", items: [
    { key: "dashboard", label: "Visão geral", href: "/admin", Icon: LayoutDashboard },
    { key: "companies", label: "Empresas", href: "/admin/empresas", Icon: Building2 },
    { key: "plates", label: "Placas inteligentes", href: "/admin/placas", Icon: ScanLine },
    { key: "catalogs", label: "Catálogos", href: "/admin/catalogos", Icon: BookOpen },
  ] },
  { title: "COMERCIAL", items: [
    { key: "products", label: "Produtos e serviços", href: "/admin/produtos", Icon: BriefcaseBusiness },
    { key: "subscriptions", label: "Assinaturas", href: "/admin/assinaturas", Icon: CreditCard },
    { key: "users", label: "Usuários e acessos", href: "/admin/usuarios", Icon: Users },
  ] },
  { title: "SISTEMA", items: [
    { key: "settings", label: "Configurações", href: "/admin/configuracoes", Icon: Settings },
  ] },
] as const;

const titles: Record<Module, string> = {
  dashboard: "Visão geral",
  plates: "Placas inteligentes",
  companies: "Empresas",
  catalogs: "Catálogos",
  users: "Usuários e acessos",
  subscriptions: "Assinaturas",
  products: "Produtos e serviços",
  settings: "Configurações",
};

export default function AdminShell({ children, current = "dashboard", onSignOut }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <Link href="/admin" className={styles.brand} aria-label="Ir para a visão geral">
            <span className={styles.brandMark}>
              <Image src="/brand/alysson-tech-icon.png" alt="" fill unoptimized sizes="42px" />
            </span>
            <span className={styles.brandName}><strong>ALYSSON</strong><span>TECH</span></span>
          </Link>
          <button type="button" className={styles.menuToggle} onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="at-admin-navigation">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <div className={menuOpen ? `${styles.sidebarBody} ${styles.sidebarBodyOpen}` : styles.sidebarBody} id="at-admin-navigation">
          <div className={styles.workspace}>
            <span>ÁREA ADMINISTRATIVA</span>
            <strong>Control Center</strong>
            <small>Gestão central da Alysson Tech</small>
          </div>
          <nav className={styles.nav} aria-label="Navegação administrativa">
            {groups.map(group => (
              <div key={group.title} className={styles.navGroup}>
                <p>{group.title}</p>
                {group.items.map(({ key, label, href, Icon }) => (
                  <Link key={key} href={href} onClick={() => setMenuOpen(false)}
                    className={current === key ? styles.navActive : styles.navItem}
                    aria-current={current === key ? "page" : undefined}>
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <div className={styles.systemStatus}>
              <ShieldCheck size={17} aria-hidden="true" />
              <div><strong>Acesso administrativo</strong><span>Alterações protegidas por permissões</span></div>
            </div>
            <button type="button" className={styles.signOut} onClick={() => void onSignOut()}>
              <LogOut size={16} aria-hidden="true" /> Encerrar sessão
            </button>
          </div>
        </div>
      </aside>
      <main className={styles.main}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.content}>
          <div className={styles.topbar}>
            <div className={styles.breadcrumb}><span>ALYSSON TECH</span><span aria-hidden="true">/</span><strong>{titles[current]}</strong></div>
            <Link href="/" className={styles.siteLink} target="_blank" rel="noreferrer">
              Ver site <ExternalLink size={14} aria-hidden="true" />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
