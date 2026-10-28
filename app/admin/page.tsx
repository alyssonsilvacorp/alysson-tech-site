"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Building2, ScanLine, CreditCard, Package, RefreshCw, Plus, UserPlus, BookOpen, ChevronRight } from "lucide-react";
import AdminShell from "../../components/admin/AdminShell";
import { supabaseBrowser } from "../../lib/supabase-browser";
import styles from "./dashboard.module.css";

type Plate = {
 code: string;
 status: "available" | "active" | "disabled";
 business_name: string | null;
 activated_at: string | null;
 plate_type: string;
};
type Company = { id: string; name: string; is_published: boolean };
type Subscription = { business_id: string; monthly_amount: number; status: string };
type Offering = { id: string; is_active: boolean };

const currency = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminDashboardPage() {
 const router = useRouter();
 const [gate, setGate] = useState<"checking" | "ok" | "denied">("checking");
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [refreshId, setRefreshId] = useState(0);
 const [plates, setPlates] = useState<Plate[]>([]);
 const [companies, setCompanies] = useState<Company[]>([]);
 const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
 const [offerings, setOfferings] = useState<Offering[]>([]);

 useEffect(() => {
  let alive = true;
  void (async () => {
   const auth = await supabaseBrowser.auth.getUser();
   if (!alive) return;
   if (auth.error || !auth.data.user) { router.replace("/admin/login"); return; }
   const membership = await supabaseBrowser.from("portal_members")
    .select("role,is_active").eq("user_id",auth.data.user.id).maybeSingle();
   if (!alive) return;
   if (membership.error || membership.data?.role !== "admin" || !membership.data.is_active) {
    setGate("denied"); setLoading(false); return;
   }
   setGate("ok"); setLoading(true); setError("");
   const [p, c, s, o] = await Promise.all([
    supabaseBrowser.rpc("list_review_plates_extended"),
    supabaseBrowser.from("smart_businesses").select("id,name,is_published").order("name"),
    supabaseBrowser.from("smart_business_subscriptions").select("business_id,monthly_amount,status"),
    supabaseBrowser.from("at_service_offerings").select("id,is_active"),
   ]);
   if (!alive) return;
   const problems = [p, c, s, o].map(r => r.error?.message).filter(Boolean);
   setPlates((p.data ?? []) as Plate[]);
   setCompanies((c.data ?? []) as Company[]);
   setSubscriptions((s.data ?? []) as Subscription[]);
   setOfferings((o.data ?? []) as Offering[]);
   if (problems.length) setError("Alguns indicadores não puderam ser carregados: " + problems.join(" · "));
   setLoading(false);
  })();
  return () => { alive = false; };
 }, [router, refreshId]);

 const stats = useMemo(() => ({
  platesTotal: plates.length,
  platesActive: plates.filter(p => p.status === "active").length,
  platesAvailable: plates.filter(p => p.status === "available").length,
  platesDisabled: plates.filter(p => p.status === "disabled").length,
  companies: companies.length,
  companiesPublished: companies.filter(c => c.is_published).length,
  subscriptionsActive: subscriptions.filter(s => s.status === "active").length,
  monthlyBooked: subscriptions.filter(s => s.status === "active")
    .reduce((total, s) => total + Number(s.monthly_amount || 0), 0),
  servicesActive: offerings.filter(o => o.is_active).length,
 }), [plates, companies, subscriptions, offerings]);

 const recent = useMemo(() => plates
  .filter(p => p.activated_at)
  .sort((a, b) => new Date(b.activated_at ?? 0).getTime() - new Date(a.activated_at ?? 0).getTime())
  .slice(0, 5), [plates]);

 async function signOut() {
  await supabaseBrowser.auth.signOut();
  router.replace("/admin/login");
 }

 if (gate === "checking") return <main className={styles.gate}>Verificando acesso à Alysson Tech...</main>;
 if (gate === "denied") return <main className={styles.gate}><h1>Acesso restrito</h1><p>Esta conta não tem permissão administrativa.</p><Link href="/admin/login">Trocar de conta</Link></main>;

 return <AdminShell current="dashboard" onSignOut={signOut}>
  <header className={styles.header}>
   <div><p className={styles.eyebrow}>CENTRAL DE OPERAÇÕES</p><h1>Visão geral<span>.</span></h1>
    <p className={styles.subtitle}>Empresas, placas e serviços da Alysson Tech reunidos em um só lugar, com dados reais da operação.</p>
   </div>
   <button type="button" className={styles.refresh} disabled={loading} onClick={() => setRefreshId(n => n + 1)}>
    <RefreshCw size={16} aria-hidden="true" /> {loading ? "Atualizando" : "Atualizar"}
   </button>
  </header>
  {error && <div role="alert" className={styles.error}>{error}</div>}
  <section className={styles.metrics} aria-label="Indicadores da operação">
   <Link href="/admin/empresas" className={styles.metric}><div className={styles.metricTop}><span>EMPRESAS</span><Building2 size={19}/></div>
    <strong>{loading ? "—" : stats.companies}</strong><p>{stats.companiesPublished} multilink(s) publicado(s)</p></Link>
   <Link href="/admin/placas" className={styles.metricPrimary}><div className={styles.metricTop}><span>PLACAS ATIVAS</span><ScanLine size={19}/></div>
    <strong>{loading ? "—" : stats.platesActive}</strong><p>QR/NFC em operação</p></Link>
   <Link href="/admin/placas" className={styles.metric}><div className={styles.metricTop}><span>DISPONÍVEIS</span><Package size={19}/></div>
    <strong>{loading ? "—" : stats.platesAvailable}</strong><p>Unidades prontas para vender</p></Link>
   <Link href="/admin/assinaturas" className={styles.metric}><div className={styles.metricTop}><span>ASSINATURAS ATIVAS</span><CreditCard size={19}/></div>
    <strong>{loading ? "—" : stats.subscriptionsActive}</strong><p>Registros ativos no controle interno</p></Link>
  </section>

  <div className={styles.mainGrid}>
   <section className={styles.panel}>
    <div className={styles.panelHeading}><div><p className={styles.eyebrow}>INVENTÁRIO</p><h2>Operação das placas</h2></div><Link href="/admin/placas">Gerenciar <ArrowUpRight size={16}/></Link></div>
    <div className={styles.inventoryHero}><strong>{loading ? "—" : stats.platesTotal}</strong><div><span>placas cadastradas</span><p>Códigos permanentes gerenciados pela Alysson Tech.</p></div></div>
    <div className={styles.progress} role="progressbar" aria-label="Percentual de placas ativas" aria-valuenow={stats.platesTotal ? Math.round(stats.platesActive / stats.platesTotal * 100) : 0} aria-valuemin={0} aria-valuemax={100}>
     <div style={{width: (stats.platesTotal ? Math.round(stats.platesActive / stats.platesTotal * 100) : 0)+"%"}}/>
    </div>
    <div className={styles.inventoryBreakdown}>
     <div><span className={styles.greenDot}/>Ativas<strong>{stats.platesActive}</strong></div>
     <div><span className={styles.grayDot}/>Disponíveis<strong>{stats.platesAvailable}</strong></div>
     <div><span className={styles.redDot}/>Desativadas<strong>{stats.platesDisabled}</strong></div>
    </div>
    <p className={styles.note}>As placas disponíveis ainda não possuem destino ativo. A rota física é preservada após a venda.</p>
   </section>
   <section className={styles.panel}>
    <div className={styles.panelHeading}><div><p className={styles.eyebrow}>CARTEIRA COMERCIAL</p><h2>Empresas e serviços</h2></div><Link href="/admin/produtos">Abrir <ArrowUpRight size={16}/></Link></div>
    <div className={styles.commercialRows}>
     <div><span>Empresas cadastradas</span><strong>{loading ? "—" : stats.companies}</strong></div>
     <div><span>Multilinks publicados</span><strong>{loading ? "—" : stats.companiesPublished}</strong></div>
     <div><span>Serviços comerciais ativos</span><strong>{loading ? "—" : stats.servicesActive}</strong></div>
     <div><span>Mensalidades ativas cadastradas</span><strong>{loading ? "—" : stats.subscriptionsActive}</strong></div>
    </div>
    <div className={styles.monthly}>
     <span>VALOR MENSAL CADASTRADO</span><strong>{loading ? "—" : currency(stats.monthlyBooked)}</strong>
     <p>Referência de contratos ativos, não representa recebimentos confirmados.</p>
    </div>
   </section>
  </div>

  <div className={styles.bottomGrid}>
   <section className={styles.panel}>
    <div className={styles.panelHeading}><div><p className={styles.eyebrow}>MOVIMENTAÇÕES</p><h2>Últimas ativações</h2></div><Link href="/admin/placas">Ver placas <ArrowUpRight size={16}/></Link></div>
    <div className={styles.activityList}>
    {recent.length ? recent.map(p => <div className={styles.activityRow} key={p.code}>
      <span className={styles.route}>{p.code}</span><div><strong>{p.business_name || "Estabelecimento não informado"}</strong><small>{p.plate_type === "smart" ? "Multilink Alysson Tech" : "Link externo / Google Review"}</small></div>
      <span className={p.status==="active" ? styles.active : styles.inactive}>{p.status==="active" ? "Ativa" : "Inativa"}</span>
     </div>) : <p className={styles.empty}>{loading ? "Carregando ativações..." : "Nenhuma ativação registrada."}</p>}
    </div>
   </section>
   <section className={styles.panel}>
    <div className={styles.panelHeading}><div><p className={styles.eyebrow}>FLUXO DE TRABALHO</p><h2>Próxima venda</h2></div></div>
    <div className={styles.workflow}>
     <Link href="/admin/empresas"><Building2 size={18}/><span><strong>1. Cadastrar estabelecimento</strong><small>Crie ou consulte a empresa.</small></span><ChevronRight size={16}/></Link>
     <Link href="/admin/placas"><Plus size={18}/><span><strong>2. Ativar uma placa</strong><small>Escolha multilink ou link externo.</small></span><ChevronRight size={16}/></Link>
     <Link href="/admin/assinaturas"><CreditCard size={18}/><span><strong>3. Registrar mensalidade</strong><small>Low ticket ou plano padrão, se contratado.</small></span><ChevronRight size={16}/></Link>
     <Link href="/admin/usuarios"><UserPlus size={18}/><span><strong>4. Liberar acesso (opcional)</strong><small>Convide quem terá painel de edição.</small></span><ChevronRight size={16}/></Link>
     <Link href="/admin/catalogos"><BookOpen size={18}/><span><strong>Catálogos</strong><small>Gerencie produtos dos multilinks.</small></span><ChevronRight size={16}/></Link>
    </div>
   </section>
  </div>
 </AdminShell>;
}
