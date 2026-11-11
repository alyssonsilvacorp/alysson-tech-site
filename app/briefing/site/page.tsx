"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCheck, Copy, ImagePlus, Layers3, RotateCcw, Send, ShieldCheck, Upload, X } from "lucide-react";
import { getSiteSteps, SITE_NICHES, siteNicheLabel, type SiteField } from "../../../lib/site-briefing-config";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import base from "../filmmaker/briefing.module.css";
import styles from "./site.module.css";

type Answers = Record<string, string | string[]>;
const KEY = "alysson-tech-briefing-site-v1";
const LIMIT = 8;
const FILE_MAX = 8 * 1024 * 1024;
const FILE_TOTAL = 30 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/heic": "heic", "image/heif": "heif",
};
function val(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.join(", ") : (value || "").trim();
}
function visible(field: SiteField, answers: Answers) {
  return !field.showWhen || answers[field.showWhen.id] === field.showWhen.equals;
}
function fileKey(file: File) { return file.name + "-" + file.size + "-" + file.lastModified; }

export default function SiteBriefingPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ key: string; url: string }[]>([]);
  const [notice, setNotice] = useState("");
  const [consent, setConsent] = useState(false);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendProgress, setSendProgress] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [uploadedIndices, setUploadedIndices] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const niche = val(answers.niche);
  const steps = useMemo(() => getSiteSteps(niche), [niche]);
  const isReview = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const totalRequired = steps.reduce((n, s) => n + s.fields.filter(f => f.required && visible(f, answers)).length, 0);
  const filledRequired = steps.reduce((n, s) => n + s.fields.filter(f => f.required && visible(f, answers) && val(answers[f.id])).length, 0);
  const businessName = val(answers.business) || "Sua empresa";
  const segmentName = niche === "other" && val(answers.custom_niche) ? val(answers.custom_niche) : (niche ? siteNicheLabel(niche) : "Seu próximo site");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) setAnswers(saved);
    } catch { /* Storage is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready && !submittedId && !completed) {
      try { localStorage.setItem(KEY, JSON.stringify(answers)); } catch { /* Storage is optional. */ }
    }
  }, [answers, ready, submittedId, completed]);
  useEffect(() => {
    const urls = images.map(file => ({ key: fileKey(file), url: URL.createObjectURL(file) }));
    setPreviews(urls);
    return () => urls.forEach(item => URL.revokeObjectURL(item.url));
  }, [images]);

  function setAnswer(id: string, answer: string | string[]) {
    setAnswers(prev => ({ ...prev, [id]: answer }));
    setErrors(prev => prev.filter(k => k !== id));
    setSendError("");
  }
  function pick(field: SiteField, option: string) {
    if (field.type !== "multi") { setAnswer(field.id, option); return; }
    const selected = Array.isArray(answers[field.id]) ? answers[field.id] as string[] : [];
    setAnswer(field.id, selected.includes(option) ? selected.filter(x => x !== option) : [...selected, option]);
  }
  function next() {
    const missing = current.fields.filter(f => visible(f, answers) && f.required && !val(answers[f.id])).map(f => f.id);
    if (step === 0 && val(answers.whatsapp).replace(/\D/g, "").length < 10) missing.push("whatsapp");
    if (missing.length) {
      setErrors(missing);
      document.getElementById("site-field-" + missing[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors([]);
    setStep(s => Math.min(s + 1, steps.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() { setErrors([]); setStep(s => Math.max(s - 1, 0)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function addImages(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selected.length) return;
    const list = [...images]; const warnings: string[] = [];
    for (const file of selected) {
      if (!TYPES[file.type]) { warnings.push(file.name + ": formato não aceito"); continue; }
      if (file.size > FILE_MAX) { warnings.push(file.name + ": máximo 8 MB"); continue; }
      if (list.some(other => fileKey(other) === fileKey(file))) continue;
      if (list.length >= LIMIT) { warnings.push("Limite de 8 arquivos"); break; }
      if (list.reduce((total, item) => total + item.size, 0) + file.size > FILE_TOTAL) { warnings.push("Limite total de 30 MB"); break; }
      list.push(file);
    }
    setImages(list);
    setNotice(warnings.length ? warnings.join(" · ") : list.length + " imagem(ns) pronta(s) para envio.");
  }
  function removeImage(index: number) {
    setImages(old => old.filter((_, i) => i !== index));
    setNotice("");
  }
  function formattedBrief() {
    const lines = ["BRIEFING DE SITE — ALYSSON TECH", "Empresa: " + businessName, "Segmento: " + segmentName, ""];
    for (const section of steps) {
      lines.push(section.title.toUpperCase());
      for (const f of section.fields.filter(field => visible(field, answers))) {
        lines.push(f.label + ": " + (val(answers[f.id]) || "Não informado"));
      }
      lines.push("");
    }
    lines.push("Anexos selecionados: " + (images.length ? images.map(f => f.name).join(", ") : "Nenhum"));
    return lines.join("\n");
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(formattedBrief());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { setSendError("Não foi possível copiar automaticamente no navegador."); }
  }
  async function submit() {
    if (sending || completed) return;
    if (!consent) { setSendError("Marque a autorização para enviar o briefing."); return; }
    const invalidIndex = steps.findIndex(s => s.fields.some(f => f.required && visible(f, answers) && !val(answers[f.id])));
    if (invalidIndex !== -1) {
      setStep(invalidIndex); setSendError("Preencha os campos obrigatórios antes de enviar."); return;
    }
    setSending(true); setSendError("");
    let id = submittedId;
    try {
      if (!id) {
        setSendProgress("Salvando suas respostas...");
        const freshId = crypto.randomUUID();
        const normalizedAnswers: Answers = {
          ...answers,
          consent: "Autorizou o uso de dados e imagens para análise da proposta",
          consent_at: new Date().toISOString(),
        };
        const { error } = await supabaseBrowser.from("at_client_briefings").insert({
          id: freshId,
          briefing_type: "website",
          client_name: val(answers.contact).slice(0, 180),
          client_whatsapp: val(answers.whatsapp).slice(0, 32),
          client_studio: val(answers.business).slice(0, 180),
          answers: normalizedAnswers,
          attachment_names: images.map(file => file.name.slice(0, 220)),
        });
        if (error) throw new Error(error.message);
        id = freshId;
        setSubmittedId(id);
      }
      for (let index = 0; index < images.length; index++) {
        if (uploadedIndices.includes(index)) continue;
        const file = images[index];
        setSendProgress("Enviando arquivo " + (index + 1) + " de " + images.length + "...");
        const path = id + "/" + crypto.randomUUID() + "." + TYPES[file.type];
        const { error } = await supabaseBrowser.storage.from("at-client-briefings")
          .upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
        if (error) throw new Error(error.message);
        setUploadedIndices(prev => [...prev, index]);
      }
      setSendProgress(""); setCompleted(true); setNotice("");
      try { localStorage.removeItem(KEY); } catch { /* Storage is optional. */ }
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Não foi possível concluir. Tente novamente.");
      setSendProgress("");
    } finally { setSending(false); }
  }
  function restart() {
    if (!window.confirm("Começar outro briefing? Suas respostas atuais serão apagadas.")) return;
    setAnswers({}); setImages([]); setStep(0); setErrors([]);
    setSubmittedId(null); setUploadedIndices([]); setCompleted(false);
    setConsent(false); setSendError(""); setNotice(""); setSendProgress("");
    try { localStorage.removeItem(KEY); } catch { /* Storage is optional. */ }
  }

  return <main className={base.page}>
    <div className={base.gridBg} aria-hidden="true" />
    <header className={base.header}>
      <Link className={base.brand} href="/" aria-label="Alysson Tech — início">
        <span className={base.logo}><Image src="/brand/alysson-tech-icon.png" alt="" fill sizes="48px"/></span>
        <span className={base.brandWord}>ALYSSON <strong>TECH</strong></span>
      </Link>
      <span className={base.headerInfo}><span className={base.liveDot}/> BRIEFING INTELIGENTE <span className={base.headerSuffix}>/ SITES</span></span>
    </header>
    <div className={base.shell}>
      <section className={base.intro}>
        <p className={base.eyebrow}><span/> ALYSSON TECH / PROJETOS DIGITAIS</p>
        <h1>Seu negócio é único.<br/><em>Seu site também será.</em></h1>
        <p>Responda algumas perguntas para criarmos o site ideal para sua empresa. O formulário se adapta ao seu segmento e você pode anexar materiais sem precisar criar uma conta.</p>
      </section>
      <div className={base.layout}>
        <section className={base.formCard} aria-label="Briefing de site">
          <div className={base.progressHeader}><strong>ETAPA {String(Math.min(step + 1, 6)).padStart(2, "0")} / 06</strong><span>{isReview ? "Revisão" : filledRequired + " de " + totalRequired + " essenciais"}</span></div>
          <div className={base.progressTrack}><div style={{ width: Math.round(step / steps.length * 100) + "%" }}/></div>
          <div className={base.dots}>{[0,1,2,3,4,5].map(n => <span key={n} className={n <= step ? base.dotActive : ""}/>)}</div>
          {!isReview ? <form className={base.body} onSubmit={e => { e.preventDefault(); next(); }} noValidate>
            <div className={base.sectionKicker}><Layers3 size={17}/>{current.eyebrow}</div>
            <h2>{current.title}</h2>
            <p className={base.sectionLead}>{current.description}</p>
            <div className={base.fields}>
              {current.fields.filter(f => visible(f, answers)).map(field =>
                <div className={base.field} key={field.id} id={"site-field-" + field.id}>
                  <label htmlFor={"site-answer-" + field.id}>{field.label}{field.required && <span className={base.required}> *</span>}</label>
                  {field.id === "niche" ? (
                    <div className={styles.nicheGrid} role="group" aria-label="Escolha o segmento">
                      {SITE_NICHES.map(item => <button type="button" key={item.id} aria-pressed={answers.niche === item.id}
                        className={answers.niche === item.id ? styles.nicheActive : styles.nicheCard}
                        onClick={() => setAnswer("niche", item.id)}>
                        <span className={styles.nicheIcon}>{answers.niche === item.id ? <Check size={15}/> : <span/>}</span>
                        <strong>{item.name}</strong><small>{item.desc}</small>
                      </button>)}
                    </div>
                  ) : field.type === "multi" || field.type === "single" ? (
                    <div className={base.choices} role="group" aria-label={field.label}>
                      {(field.options || []).map(option => {
                        const selected = Array.isArray(answers[field.id]) ? (answers[field.id] as string[]).includes(option) : answers[field.id] === option;
                        return <button key={option} type="button" aria-pressed={selected}
                          className={selected ? base.chipSelected : base.chip} onClick={() => pick(field, option)}>
                          {selected && <Check size={14}/>} {option}
                        </button>;
                      })}
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea id={"site-answer-" + field.id} rows={4} maxLength={2400}
                      className={errors.includes(field.id) ? base.inputError : base.input}
                      placeholder={field.placeholder} value={val(answers[field.id])}
                      onChange={e => setAnswer(field.id, e.target.value)}/>
                  ) : (
                    <input id={"site-answer-" + field.id} className={errors.includes(field.id) ? base.inputError : base.input}
                      placeholder={field.placeholder} type="text" maxLength={380}
                      value={val(answers[field.id])} onChange={e => setAnswer(field.id, e.target.value)}/>
                  )}
                  {field.hint && <small className={base.hint}>{field.hint}</small>}
                  {errors.includes(field.id) && <small className={base.error} role="alert">{field.id === "whatsapp" ? "Informe um WhatsApp válido com DDD." : "Preencha esta informação para continuar."}</small>}
                </div>
              )}
            </div>
            {step === 3 && <section className={base.uploadSection}>
              <div className={base.uploadHeading}><ImagePlus size={18}/><div><strong>Envie imagens e logotipo</strong><span>Fotos da empresa, produtos, ambientes ou trabalhos.</span></div></div>
              <label className={base.uploadDrop} htmlFor="site-assets"><Upload size={22}/><strong>Selecionar arquivos</strong><small>Até 8 fotos · 8 MB cada · JPG, PNG, WebP, HEIC</small></label>
              <input id="site-assets" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple
                className={base.visuallyHidden} onChange={addImages}/>
              {images.length > 0 && <div className={base.photosGrid}>{images.map((image, i) => {
                const preview = previews.find(p => p.key === fileKey(image))?.url;
                return <div className={base.photoItem} key={fileKey(image)}>
                  {preview && <Image src={preview} alt={"Arquivo " + image.name} unoptimized fill sizes="120px" className={base.photoThumb}/>}
                  <button type="button" className={base.removePhoto} onClick={() => removeImage(i)} aria-label={"Remover " + image.name}><X size={15}/></button>
                  <span className={base.photoName}>{image.name}</span>
                </div>;
              })}</div>}
              {notice && <p className={base.photoNotice} role="status">{notice}</p>}
              <p className={base.uploadHint}>Os arquivos serão enviados para armazenamento privado somente após sua confirmação final. Não inclua dados pessoais sensíveis de terceiros.</p>
            </section>}
            <div className={base.navigation}>
              <button className={base.secondaryButton} type="button" onClick={back} disabled={step === 0}><ArrowLeft size={16}/> Voltar</button>
              <button className={base.primaryButton} type="submit">{step === 4 ? "Revisar respostas" : "Continuar"} <ArrowRight size={17}/></button>
            </div>
          </form> : <div className={base.body}>
            <div className={base.sectionKicker}><ClipboardCheck size={17}/> 06 / CONFERÊNCIA</div>
            <h2>{completed ? "Briefing recebido com sucesso!" : "Seu briefing está pronto."}</h2>
            <p className={base.sectionLead}>{completed
              ? "O projeto e os anexos foram recebidos. A equipe Alysson Tech poderá analisar suas informações para preparar uma proposta."
              : "Confira as informações. Ao enviar, elas ficarão disponíveis no portal privado da Alysson Tech."}</p>
            <div className={base.review}>{steps.map(section => <div key={section.eyebrow}>
              <h3>{section.title}</h3>
              {section.fields.filter(f => visible(f, answers) && val(answers[f.id])).map(field =>
                <div className={base.reviewItem} key={field.id}>
                  <span>{field.label}</span>
                  <strong>{field.id === "niche" ? segmentName : val(answers[field.id])}</strong>
                </div>)}
              </div>)}</div>
            {images.length > 0 && <div className={base.attachmentSummary}><ImagePlus size={18}/><div>
              <strong>{images.length} imagens {completed ? "recebidas" : "selecionadas"}</strong>
              <span>Os arquivos serão vinculados a este projeto no armazenamento privado.</span>
            </div></div>}
            {!completed && <label className={base.consent}>
              <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setSendError(""); }}/>
              <span>Autorizo a Alysson Tech a armazenar meus dados de contato, respostas e arquivos para analisar esta solicitação e elaborar uma proposta. A publicação dos materiais dependerá de aprovação específica.</span>
            </label>}
            {sendProgress && <p className={base.photoNotice} role="status">{sendProgress}</p>}
            {sendError && <p className={base.submitError} role="alert">Não foi possível concluir: {sendError}. {submittedId ? "As respostas já foram salvas. Tente novamente para concluir os anexos." : "Revise e tente novamente."}</p>}
            <div className={base.reviewActions}>
              {!completed && <button className={base.primaryButton} type="button" disabled={sending} onClick={() => void submit()}><Send size={17}/> {sending ? "Enviando..." : "Enviar briefing e arquivos"}</button>}
              {completed && <div className={base.successReceipt}><CheckCircle2 size={18}/> Recebimento confirmado · {submittedId?.slice(0, 8).toUpperCase()}</div>}
              <button className={base.secondaryButton} type="button" onClick={() => void copyBrief()}><Copy size={16}/> {copied ? "Copiado!" : "Copiar respostas"}</button>
            </div>
            <p className={base.privacy}><ShieldCheck size={16}/> Seus arquivos não ficam públicos. Apenas administradores autorizados da Alysson Tech podem consultar o briefing.</p>
            <div className={base.bottomActions}>
              {!submittedId && <button className={base.textButton} type="button" onClick={back}><ArrowLeft size={15}/> Corrigir respostas</button>}
              {completed && <button className={base.textButton} type="button" onClick={restart}><RotateCcw size={15}/> Preencher outro briefing</button>}
            </div>
          </div>}
        </section>
        <aside className={base.aside}>
          <div className={styles.previewCard}>
            <div className={styles.previewHead}><span>SEU PROJETO / PRÉVIA CONCEITUAL</span><Layers3 size={18}/></div>
            <div className={styles.mockBrowser}>
              <div className={styles.mockTop}><i/><i/><i/><span>SEU FUTURO SITE</span></div>
              <div className={styles.mockHero}>
                <p>{segmentName.toUpperCase()}</p>
                <h3>{businessName}</h3>
                <span>{val(answers.differential) || "Sua marca, apresentada de forma profissional."}</span>
                <div className={styles.mockAction}>{val(answers.primary_action) || "Entre em contato"} <ArrowRight size={13}/></div>
              </div>
              <div className={styles.mockTiles}><div/><div/><div/></div>
            </div>
            <p>Prévia ilustrativa que acompanha suas respostas. O design definitivo será desenvolvido com sua marca e seus conteúdos.</p>
          </div>
          <div className={base.stepsPanel}>
            <h3>ETAPAS DO BRIEFING</h3>
            {steps.map((s,i) => <div className={base.stepItem} key={s.eyebrow}>
              <span className={i < step ? base.stepDone : base.stepCount}>{i < step ? <Check size={14}/> : String(i + 1).padStart(2,"0")}</span>
              <span>{s.eyebrow.slice(5)}</span>
            </div>)}
            <div className={base.secure}><ShieldCheck size={17}/> <span>Sem cadastro. Dados protegidos e envio direto à Alysson Tech.</span></div>
          </div>
        </aside>
      </div>
      <footer className={base.footer}><span>© ALYSSON TECH • PROJETOS DIGITAIS</span><span>Briefing adaptativo para qualquer negócio</span></footer>
    </div>
  </main>;
}
