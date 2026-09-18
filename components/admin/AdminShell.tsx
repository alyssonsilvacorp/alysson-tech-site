"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import styles from "./AdminShell.module.css";

type AdminShellProps = {
  children: ReactNode;
  current?: "dashboard" | "plates";
  onSignOut: () => void | Promise<void>;
};

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function PlatesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 8h8M8 12h5M8 16h8" />
    </svg>
  );
}

export default function AdminShell({
  children,
  current = "dashboard",
  onSignOut,
}: AdminShellProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <Image
              src="/brand/alysson-tech-icon.png"
              alt=""
              fill
              unoptimized
              sizes="42px"
            />
          </span>

          <div>
            <strong>ALYSSON</strong>
            <span>TECH</span>
          </div>
        </div>

        <div className={styles.workspace}>
          <span>WORKSPACE</span>
          <strong>Review Intelligence</strong>
          <small>Google Review System</small>
        </div>

        <nav className={styles.nav}>
          <p>NAVEGAÇÃO</p>

          <Link
            href="/admin"
            className={
              current === "dashboard"
                ? styles.navActive
                : styles.navItem
            }
          >
            <DashboardIcon />
            <span>Visão geral</span>
          </Link>

          <Link
            href="/admin/placas"
            className={
              current === "plates"
                ? styles.navActive
                : styles.navItem
            }
          >
            <PlatesIcon />
            <span>Placas inteligentes</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.systemStatus}>
            <i />
            <div>
              <strong>Sistema operacional</strong>
              <span>Supabase + rotas online</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.signOut}
            onClick={() => void onSignOut()}
          >
            Encerrar sessão
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
