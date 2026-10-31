"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { BriefcaseBusiness, Plus, Search, Pencil, Power, RotateCw, Wallet, PackageCheck } from "lucide-react";
import { supabaseBrowser } from "../../lib/supabase-browser";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./AdminOfferings.module.css";

type Offering = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  billing_type: "one_time" | "monthly";
  reference_price: number | null;
  is_active: boolean;
  sort_order: number;
};

const blank = { name: "", category: "", description: "", billing_type: "one_time" as Offering["billing_type"], reference_price: "" };
const money = (amount: number | null) => amount === null ? "Sob consulta" : Number(amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminOfferings() {
  const [items, setItems] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOffering, setConfirmOffering] = useState<Offering | null>(null);
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await supabaseBrowser.from("at_service_offerings")
      .select("id,name,category,description,billing_type,reference_price,is_active,sort_order")
      .order("sort_order", { ascending: true }).order("name");
    setLoading(false);
    if (r.error) { setError("Não foi possível carregar os serviços: " + r.error.message); return; }
    setItems((r.data ?? []) as Offering[]);
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    return items.filter(item => {
      if (filter === "active" && !item.is_active) return false;
      if (filter === "inactive" && item.is_active) return false;
      return !needle || [item.name, item.category, item.description ?? ""]
        .some(part => part.toLocaleLowerCase("pt-BR").includes(needle));
    });
  }, [items, query, filter]);

  function start(item?: Offering) {
    setMessage(""); setError("");
    setEditing(item?.id ?? null);
    setForm(item ? {
      name: item.name, category: item.category,
      description: item.description ?? "", billing_type: item.billing_type,
      reference_price: item.reference_price === null ? "" : String(item.reference_price),
    } : blank);
    setFormOpen(true);
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const amount = form.reference_price.trim() === "" ? null : Number(form.reference_price.replace(",", "."));
    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) { setError("Informe um preço válido ou deixe em branco."); return; }
    if (form.name.trim().length < 2 || form.category.trim().length < 2) { setError("Preencha o nome e a categoria."); return; }
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim() || null,
      billing_type: form.billing_type,
      reference_price: amount,
      updated_at: new Date().toISOString(),
    };
    setBusy(true); setError(""); setMessage("");
    const result = editing
      ? await supabaseBrowser.from("at_service_offerings").update(payload).eq("id", editing)
      : await supabaseBrowser.from("at_service_offerings").insert({ ...payload, is_active: true, sort_order: items.length * 10 + 10 });
    setBusy(false);
    if (result.error) { setError(result.error.message); return; }
    setFormOpen(false); setEditing(null);
    setMessage(editing ? "Serviço atualizado." : "Serviço cadastrado.");
    await load();
  }

  async function toggle() {
    const item = confirmOffering;
    if (!item || busy) return;
    const next = !item.is_active;
    setBusy(true); setError(""); setMessage("");
    const result = await supabaseBrowser.from("at_service_offerings")
      .update({ is_active: next, updated_at: new Date().toISOString() }).eq("id", item.id);
    setBusy(false);
    if (result.error) { setError(result.error.message); return; }
    setConfirmOffering(null);
    setMessage(next ? "Serviço reativado." : "Serviço arquivado; o registro foi preservado.");
    await load();
  }

  return <div className={styles.root}>
    <ConfirmDialog
      open={confirmOffering !== null}
      title={confirmOffering?.is_active ? "Arquivar serviço?" : "Reativar serviço?"}
      description={confirmOffering?.is_active
        ? "O serviço será retirado da lista de ofertas ativas, mas o cadastro será preservado. Contratos anteriores não serão modificados."
        : "O serviço voltará a aparecer como uma oferta ativa da Alysson Tech."}
      context={confirmOffering?.name}
      confirmLabel={confirmOffering?.is_active ? "Sim, arquivar" : "Sim, reativar"}
      tone={confirmOffering?.is_active ? "danger" : "success"}
      busy={busy}
      error={error || undefined}
      onCancel={() => { if (!busy) { setConfirmOffering(null); setError(""); } }}
      onConfirm={() => void toggle()}
    />
    <div className={styles.summary}>
      <div><PackageCheck aria-hidden="true" /><span>Serviços ativos</span><strong>{loading ? "—" : items.filter(x => x.is_active).length}</strong></div>
      <div><BriefcaseBusiness aria-hidden="true" /><span>Total cadastrados</span><strong>{loading ? "—" : items.length}</strong></div>
      <div><Wallet aria-hidden="true" /><span>Ofertas mensais</span><strong>{loading ? "—" : items.filter(x => x.billing_type === "monthly" && x.is_active).length}</strong></div>
    </div>
    <div className={styles.toolbar}>
      <label className={styles.search}><Search size={18} aria-hidden="true" /><input aria-label="Buscar serviços" placeholder="Buscar nome ou categoria" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <select className={styles.select} aria-label="Filtrar serviços" value={filter} onChange={e => setFilter(e.target.value as "all" | "active" | "inactive")}>
        <option value="all">Todos</option><option value="active">Ativos</option><option value="inactive">Arquivados</option>
      </select>
      <button type="button" className={styles.secondary} onClick={() => void load()} disabled={loading}><RotateCw size={16} /> Atualizar</button>
      <button type="button" className={styles.primary} onClick={() => start()}><Plus size={17} /> Novo serviço</button>
    </div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {message && <p role="status" className={styles.success}>{message}</p>}
    {formOpen && <form className={styles.form} onSubmit={save}>
      <div className={styles.formHeader}><h2>{editing ? "Editar serviço" : "Cadastrar serviço"}</h2><button type="button" className={styles.secondary} onClick={() => setFormOpen(false)}>Fechar</button></div>
      <div className={styles.fields}>
        <label>Nome do serviço *<input required maxLength={120} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>Categoria *<input required maxLength={80} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex.: Placas inteligentes" /></label>
        <label>Forma comercial<select value={form.billing_type} onChange={e => setForm({ ...form, billing_type: e.target.value as Offering["billing_type"] })}><option value="one_time">Venda / serviço avulso</option><option value="monthly">Mensalidade</option></select></label>
        <label>Preço de referência (R$)<input inputMode="decimal" placeholder="Opcional — sob consulta" value={form.reference_price} onChange={e => setForm({ ...form, reference_price: e.target.value })} /></label>
      </div>
      <label className={styles.description}>Descrição<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
      <div className={styles.formFooter}><p>O valor é apenas uma referência comercial. Nenhuma cobrança é criada automaticamente.</p><button type="submit" className={styles.primary} disabled={busy}>{busy ? "Salvando..." : "Salvar serviço"}</button></div>
    </form>}
    <div className={styles.grid}>
      {visible.map(item => <article key={item.id} className={styles.card}>
        <div className={styles.cardHeader}><span className={styles.category}>{item.category}</span><span className={item.is_active ? styles.active : styles.inactive}>{item.is_active ? "Ativo" : "Arquivado"}</span></div>
        <h3>{item.name}</h3><p className={styles.descriptionText}>{item.description || "Sem descrição cadastrada."}</p>
        <div className={styles.price}><strong>{money(item.reference_price)}</strong><small>{item.billing_type === "monthly" ? "por mês (referência)" : "venda / serviço"}</small></div>
        <div className={styles.cardActions}><button type="button" onClick={() => start(item)}><Pencil size={15} /> Editar</button><button type="button" disabled={busy} onClick={() => { setError(""); setConfirmOffering(item); }}><Power size={15} /> {item.is_active ? "Arquivar" : "Reativar"}</button></div>
      </article>)}
    </div>
    {!loading && visible.length === 0 && <div className={styles.empty}>Nenhum serviço encontrado. Ajuste os filtros ou cadastre uma nova oferta.</div>}
  </div>;
}
