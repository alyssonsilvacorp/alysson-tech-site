"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, ClipboardList, Copy, Download, FileImage, RefreshCw, Save, Search } from "lucide-react";
import AdminShell from "../../../components/admin/AdminShell";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import styles from "./briefings.module.css";
import { getSiteSteps, siteNicheLabel } from "../../../lib/site-briefing-config";

type Briefing = {
  id: string;
  briefing_type: "filmmaker" | "website";
  client_name: string;
  client_studio: string;
  client_whatsapp: string;
  answers: Record<string, string | string[]>;
  attachment_names: string[];
  status: "received" | "analysis" | "proposal" | "development" | "completed";
  internal_notes: string;
  created_at: string;
};

type MediaAsset = { name: string; url: string };
type Gate = "checking" | "authorized" | "denied";
const BUCKET = "at-client-briefings";
const STATUSES: { value: Briefing["status"]; label: string }[] = [
  { value: "received", label: "Recebido" },
  { value: "analysis", label: "Em análise" },
  { value: "proposal", label: "Proposta" },
  { value: "development", label: "Desenvolvimento" },
  { value: "completed", label: "Concluído" },
];
const STAGES = [
  { name: "Informações profissionais", fields: ["name", "studio", "city", "whatsapp", "instagram", "domain"] },
  { name: "Serviços e posicionamento", fields: ["services", "audience", "bio", "difference"] },
  { name: "Identidade visual", fields: ["style", "colors", "logo", "references", "feeling"] },
  { name: "Portfólio e materiais", fields: ["portfolio", "hero", "categories", "assets", "drive"] },
  { name: "Objetivos e funcionalidades", fields: ["goal", "features", "pricing", "admin", "adminFeatures", "deadline", "notes"] },
] as const;
const FIELD_LABELS: Record<string, string> = {
  name: "Nome profissional", studio: "Nome da marca", city: "Cidade e regiões atendidas", whatsapp: "WhatsApp",
  instagram: "Instagram", domain: "Domínio / site existente", services: "Serviços",
  audience: "Público-alvo", bio: "História e experiência", difference: "Diferenciais",
  style: "Estilo visual", colors: "Cores", logo: "Identidade visual", references: "Referências",
  feeling: "Sensação desejada", portfolio: "Links de produções", hero: "Vídeo de destaque",
  categories: "Categorias do portfólio", assets: "Materiais disponíveis", drive: "Pasta de arquivos",
  goal: "Principal objetivo", features: "Funcionalidades", pricing: "Preços/pacotes",
  admin: "Painel para atualização", adminFeatures: "Itens gerenciáveis",
  deadline: "Prazo desejado", notes: "Observações",
};
function siteSegment(brief: Briefing): string {
  if (brief.briefing_type === "filmmaker") return "Filmmaker / Portfólio";
  const niche = typeof brief.answers.niche === "string" ? brief.answers.niche : "other";
  return niche === "other" && typeof brief.answers.custom_niche === "string" && brief.answers.custom_niche.trim()
    ? brief.answers.custom_niche : siteNicheLabel(niche);
}
function displaySections(brief: Briefing): { name: string; fields: { id: string; label: string }[] }[] {
  if (brief.briefing_type === "website") {
    const niche = typeof brief.answers.niche === "string" ? brief.answers.niche : "other";
    return getSiteSteps(niche).map(section => ({
      name: section.title,
      fields: section.fields.filter(field => !field.showWhen || brief.answers[field.showWhen.id] === field.showWhen.equals)
        .map(field => ({ id: field.id, label: field.label })),
    }));
  }
  return STAGES.map(stage => ({ name: stage.name, fields: stage.fields.map(id => ({ id, label: FIELD_LABELS[id] || id })) }));
}
function valueOf(value: unknown): string {
  return Array.isArray(value) ? value.map(String).join(", ") : typeof value === "string" ? value.trim() : "Não informado";
}
function dateOf(value: string) {
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
function createDocument(brief: Briefing, includePrompt = false): string {
  const lines = [
    "ALYSSON TECH — BRIEFING DO CLIENTE",
    `Projeto: ${brief.client_studio || brief.client_name}`,
    `Tipo: ${brief.briefing_type === "website" ? "Site para qualquer nicho" : "Site de filmmaker"}`,
    `Segmento: ${siteSegment(brief)}`,
    `Recebido: ${dateOf(brief.created_at)}`,
    `Status: ${STATUSES.find(s => s.value === brief.status)?.label || brief.status}`,
    `Identificador: ${brief.id}`,
    "",
  ];
  for (const stage of displaySections(brief)) {
    lines.push(`## ${stage.name}`);
    for (const field of stage.fields) {
      lines.push(`${field.label}: ${valueOf(brief.answers[field.id])}`);
    }
    lines.push("");
  }
  lines.push("## Anexos", ...(brief.attachment_names.length ? brief.attachment_names.map(name => `- ${name}`) : ["Nenhum arquivo informado."]));
  lines.push("Os arquivos estão no armazenamento privado do portal Alysson Tech. Não use URLs temporárias como links permanentes em produção.", "");
  if (brief.internal_notes) lines.push("## Observações internas", brief.internal_notes, "");
  if (includePrompt) {
    lines.push("## Orientação para desenvolvimento");
    lines.push("Com base exclusivamente neste briefing, elabore: (1) escopo funcional, (2) sitemap e fluxo de contato, (3) identidade e layout responsivo, (4) componentes e dados necessários, (5) plano de implementação e checklist de homologação. Diferencie requisitos confirmados de lacunas; não invente preços, depoimentos ou projetos. Use os vídeos e imagens do próprio cliente com autorização. Não execute deploy nem faça alterações em produção sem minha aprovação.");
  }
  return lines.join("\n");
}

export default function AdminBriefingsPage() {
  const router = useRouter();
  const [gate, setGate] = useState<Gate>("checking");
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Briefing["briefing_type"]>("all");
  const [draftStatus, setDraftStatus] = useState<Briefing["status"]>("received");
  const [draftNotes, setDraftNotes] = useState("");

  const fetchBriefings = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabaseBrowser
      .from("at_client_briefings")
      .select("id,briefing_type,client_name,client_studio,client_whatsapp,answers,attachment_names,status,internal_notes,created_at")
      .order("created_at", { ascending: false }).limit(250);
    if (loadError) setError("Não foi possível consultar os briefings: " + loadError.message);
    else {
      const rows = (data || []) as Briefing[];
      setBriefings(rows);
      setSelectedId(current => current && rows.some(b => b.id === current) ? current : (rows[0]?.id || null));
      setError("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data, error: authError } = await supabaseBrowser.auth.getUser();
      if (!alive) return;
      if (authError || !data.user) { router.replace("/admin/login"); return; }
      const { data: member, error: memberError } = await supabaseBrowser.from("portal_members")
        .select("role,is_active").eq("user_id", data.user.id).maybeSingle();
      if (!alive) return;
      if (memberError || member?.role !== "admin" || !member.is_active) {
        setGate("denied"); setLoading(false); return;
      }
      setGate("authorized");
      void fetchBriefings();
    })();
    return () => { alive = false; };
  }, [fetchBriefings, router]);

  const current = briefings.find(item => item.id === selectedId) || null;
  const filtered = useMemo(() => briefings.filter(item =>
    (typeFilter === "all" || item.briefing_type === typeFilter) &&
    [item.client_name, item.client_studio, item.client_whatsapp, item.status, siteSegment(item)].join(" ").toLowerCase()
      .includes(search.trim().toLowerCase())), [briefings, search, typeFilter]);

  useEffect(() => {
    setDraftStatus(current?.status || "received");
    setDraftNotes(current?.internal_notes || "");
    setNotice("");
  }, [current?.id, current?.status, current?.internal_notes]);

  useEffect(() => {
    if (!selectedId || gate !== "authorized") return;
    let alive = true;
    setAssets([]);
    setMediaLoading(true);
    void (async () => {
      const { data, error: listingError } = await supabaseBrowser.storage.from(BUCKET).list(selectedId, { limit: 30 });
      if (!alive) return;
      if (listingError) { setError("Imagens: " + listingError.message); setMediaLoading(false); return; }
      const fileNames = (data || []).filter(file => file.name && file.id).map(file => file.name);
      const signed = await Promise.all(fileNames.map(async name => {
        const { data: signedData, error: signingError } = await supabaseBrowser.storage.from(BUCKET)
          .createSignedUrl(`${selectedId}/${name}`, 1800);
        return signingError || !signedData?.signedUrl ? null : { name, url: signedData.signedUrl };
      }));
      if (alive) { setAssets(signed.filter((entry): entry is MediaAsset => Boolean(entry))); setMediaLoading(false); }
    })();
    return () => { alive = false; };
  }, [selectedId, gate]);

  async function saveChanges() {
    if (!current || saving) return;
    setSaving(true); setNotice(""); setError("");
    const { error: updateError } = await supabaseBrowser.from("at_client_briefings")
      .update({ status: draftStatus, internal_notes: draftNotes.slice(0, 12000), updated_at: new Date().toISOString() })
      .eq("id", current.id);
    if (updateError) setError("Não foi possível salvar: " + updateError.message);
    else {
      setBriefings(rows => rows.map(row => row.id === current.id ? { ...row, status: draftStatus, internal_notes: draftNotes } : row));
      setNotice("Etapa e observações atualizadas.");
    }
    setSaving(false);
  }
  async function copyDocument(prompt: boolean) {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(createDocument(current, prompt));
      setNotice(prompt ? "Instruções de desenvolvimento copiadas." : "Briefing copiado.");
    } catch { setError("Não foi possível copiar automaticamente. Use Exportar JSON."); }
  }
  function downloadJson() {
    if (!current) return;
    const blob = new Blob([JSON.stringify({ ...current, files: assets.map(a => a.name) }, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `briefing-${current.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function signOut() {
    await supabaseBrowser.auth.signOut(); router.replace("/admin/login");
  }

  if (gate === "checking") return <main className={styles.gate}>Verificando permissão de acesso...</main>;
  if (gate === "denied") return <main className={styles.gate}>Acesso restrito aos administradores da Alysson Tech.</main>;

  return <AdminShell current="briefings" onSignOut={signOut}>
    <header className={styles.heading}>
      <div><p className={styles.eyebrow}>CENTRAL COMERCIAL / CLIENTES</p>
        <h1>Briefings recebidos<span>.</span></h1>
        <p>Solicitações, respostas e materiais dos clientes reunidos para elaborar propostas e iniciar projetos.</p>
      </div>
      <div className={styles.topActions}><a className={styles.newBriefing} href="/briefing/site" target="_blank" rel="noopener noreferrer">Novo briefing de site <ArrowUpRight size={15}/></a><button className={styles.refresh} type="button" onClick={() => void fetchBriefings()} disabled={loading}><RefreshCw size={16}/> Atualizar</button></div>
    </header>
    <div className={styles.stats}>
      <div><small>TOTAL RECEBIDO</small><strong>{briefings.length}</strong></div>
      <div><small>AGUARDANDO ANÁLISE</small><strong>{briefings.filter(item => item.status === "received").length}</strong></div>
      <div><small>EM ANDAMENTO</small><strong>{briefings.filter(item => ["analysis", "proposal", "development"].includes(item.status)).length}</strong></div>
    </div>
    {error && <p className={styles.error} role="alert">{error}</p>}
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    <div className={styles.layout}>
      <section className={styles.inbox} aria-label="Lista de briefings">
        <div className={styles.inboxTitle}><ClipboardList size={19}/><h2>Solicitações</h2></div>
        <div className={styles.search}><Search size={17}/><input aria-label="Buscar cliente" placeholder="Buscar nome, marca ou WhatsApp" value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className={styles.filters} role="group" aria-label="Tipo de briefing">{([{ value: "all", label: "Todos" }, { value: "website", label: "Sites" }, { value: "filmmaker", label: "Filmmaker" }] as const).map(item => <button type="button" key={item.value} aria-pressed={typeFilter === item.value} className={typeFilter === item.value ? styles.filterActive : styles.filter} onClick={() => setTypeFilter(item.value)}>{item.label}</button>)}</div>
        {loading && <p className={styles.empty}>Carregando solicitações...</p>}
        {!loading && !filtered.length && <p className={styles.empty}>Nenhum briefing encontrado. Os novos envios aparecerão aqui.</p>}
        {filtered.map(item => <button key={item.id} type="button" className={item.id === selectedId ? styles.itemActive : styles.item}
          onClick={() => setSelectedId(item.id)}>
          <span className={styles.itemFirst}><strong>{item.client_studio || item.client_name}</strong><span>{STATUSES.find(s => s.value === item.status)?.label}</span></span>
          <small>{item.client_name} · {dateOf(item.created_at)}</small>
          <small>{siteSegment(item)}</small>
          <span className={styles.itemMeta}><FileImage size={13}/> {item.attachment_names.length} imagens declaradas</span>
        </button>)}
      </section>

      <section className={styles.detail} aria-label="Detalhamento do briefing">
        {!current ? <div className={styles.emptyDetails}><ClipboardList size={26}/><h2>Selecione um briefing</h2><p>Quando os clientes enviarem o formulário, suas respostas aparecerão aqui.</p></div> :
        <>
          <div className={styles.detailHeader}><div><p className={styles.eyebrow}>{siteSegment(current).toUpperCase()}</p><h2>{current.client_studio || current.client_name}</h2><small>Recebido em {dateOf(current.created_at)} · {current.id.slice(0, 8).toUpperCase()}</small></div>
            <a className={styles.contact} href={`https://wa.me/${current.client_whatsapp.replace(/\D/g, "").startsWith("55") ? current.client_whatsapp.replace(/\D/g, "") : "55" + current.client_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={15}/></a>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => void copyDocument(false)}><Copy size={16}/> Copiar briefing</button>
            <button type="button" onClick={() => void copyDocument(true)}><ClipboardList size={16}/> Copiar instruções para desenvolvimento</button>
            <button type="button" onClick={downloadJson}><Download size={16}/> Exportar JSON</button>
          </div>
          <div className={styles.workflow}>
            <div><label htmlFor="status">Etapa comercial</label><select id="status" value={draftStatus} onChange={e => setDraftStatus(e.target.value as Briefing["status"])}>{STATUSES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
            <div><label htmlFor="notes">Observações internas</label><textarea id="notes" rows={3} maxLength={12000} value={draftNotes} onChange={e => setDraftNotes(e.target.value)} placeholder="Análise, pendências, proposta ou decisões internas..." /></div>
            <button className={styles.save} disabled={saving} onClick={() => void saveChanges()}><Save size={16}/> {saving ? "Salvando..." : "Salvar acompanhamento"}</button>
          </div>
          {displaySections(current).map(stage => <section className={styles.section} key={stage.name}><h3>{stage.name}</h3>
            {stage.fields.map(field => <div key={field.id} className={styles.answer}><span>{field.label}</span><p>{field.id === "niche" ? siteSegment(current) : valueOf(current.answers?.[field.id])}</p></div>)}
          </section>)}
          <section className={styles.section}><h3>Imagens e materiais privados</h3>
            <p className={styles.mediaHint}>Apenas administradores autorizados podem abrir os arquivos. Os links expiram automaticamente.</p>
            {mediaLoading && <p className={styles.empty}>Buscando imagens...</p>}
            {!mediaLoading && !assets.length && <p className={styles.empty}>Nenhuma imagem armazenada para este briefing.</p>}
            <div className={styles.mediaGrid}>{assets.map(asset => <a href={asset.url} target="_blank" rel="noopener noreferrer" key={asset.name} title={asset.name}><img src={asset.url} alt="Imagem enviada pelo cliente"/><span>Ver imagem <ArrowUpRight size={12}/></span></a>)}</div>
            {current.attachment_names.length > 0 && <p className={styles.mediaHint}>Selecionadas pelo cliente: {current.attachment_names.join(", ")}</p>}
          </section>
          <p className={styles.endNote}><Check size={15}/> Informações registradas na Alysson Tech e protegidas por permissões do portal.</p>
        </>}
      </section>
    </div>
  </AdminShell>;
}
