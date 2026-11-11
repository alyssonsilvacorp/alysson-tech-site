"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clapperboard, Copy, Film, RotateCcw, Send, ShieldCheck, Upload, ImagePlus, X, Share2, Video } from "lucide-react";
import styles from "./briefing.module.css";

type Field = {
  id: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "single" | "multi";
  options?: string[];
  placeholder?: string;
  hint?: string;
  showWhen?: { id: string; equals: string };
};
type Answers = Record<string, string | string[]>;
const KEY = "alysson-tech-filmmaker-briefing-v2";
const WHATSAPP = "5582999926146";
const MAX_PHOTOS = 8;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const VIDEO_SOURCE = "https://videos.pexels.com/video-files/8089126/8089126-uhd_4096_2160_25fps.mp4";

const sections: { kicker: string; name: string; description: string; fields: Field[] }[] = [
  {
    kicker: "01 / APRESENTAÇÃO", name: "Quem está por trás das lentes?",
    description: "Conte quem você é e como os clientes encontram o seu trabalho.",
    fields: [
      { id: "name", label: "Nome profissional ou nome artístico", required: true, placeholder: "Ex.: Lucas Almeida Films" },
      { id: "studio", label: "Nome da produtora ou marca", placeholder: "Se trabalhar com seu próprio nome, pode repetir." },
      { id: "city", label: "Cidade e regiões onde atende", required: true, placeholder: "Ex.: Maceió, litoral de Alagoas e outras cidades" },
      { id: "whatsapp", label: "WhatsApp profissional", required: true, placeholder: "(82) 99999-9999" },
      { id: "instagram", label: "Instagram profissional", placeholder: "@seuperfil" },
      { id: "domain", label: "Você já possui domínio ou site?", placeholder: "Ex.: minhaprodutora.com.br ou ainda não" },
    ],
  },
  {
    kicker: "02 / POSICIONAMENTO", name: "Que histórias você produz?",
    description: "O site precisa valorizar o que você faz e atrair o público certo.",
    fields: [
      { id: "services", label: "Quais produções você realiza?", type: "multi", required: true, options: ["Casamentos", "Eventos", "Vídeos comerciais", "Institucionais", "Reels e redes sociais", "Videoclipes", "Drone", "Fotografia", "Outros"] },
      { id: "audience", label: "Qual é o seu público principal?", type: "multi", required: true, options: ["Empresas e marcas", "Casais e noivos", "Artistas", "Influenciadores", "Produtoras", "Eventos", "Público variado"] },
      { id: "bio", label: "Conte um pouco da sua história e experiência", type: "textarea", required: true, placeholder: "Como começou, o que você valoriza e os trabalhos mais importantes..." },
      { id: "difference", label: "Qual é o seu diferencial?", type: "textarea", placeholder: "Direção criativa, narrativa, velocidade, equipamentos, estilo..." },
    ],
  },
  {
    kicker: "03 / IDENTIDADE", name: "Qual é a sua assinatura visual?",
    description: "O site terá a identidade da sua marca, enquanto este briefing segue o padrão Alysson Tech.",
    fields: [
      { id: "style", label: "Qual estilo combina melhor com o seu trabalho?", type: "single", required: true, options: ["Cinematográfico / escuro", "Minimalista / elegante", "Editorial / artístico", "Moderno / vibrante", "Quero orientação"] },
      { id: "colors", label: "Cores de preferência para o seu site", placeholder: "Ex.: preto e branco, dourado, tons neutros..." },
      { id: "logo", label: "Você já possui identidade visual?", type: "single", required: true, options: ["Sim, logo e identidade completa", "Tenho apenas logotipo", "Ainda não tenho"] },
      { id: "references", label: "Sites, perfis ou marcas que servem de referência", type: "textarea", placeholder: "Cole os links, um por linha." },
      { id: "feeling", label: "O que alguém deve sentir ao entrar no site?", placeholder: "Ex.: confiança, exclusividade, emoção, criatividade..." },
    ],
  },
  {
    kicker: "04 / PORTFÓLIO", name: "Vamos apresentar seus melhores trabalhos.",
    description: "Os vídeos são protagonistas. Envie links para selecionarmos o destaque principal.",
    fields: [
      { id: "portfolio", label: "Links dos seus melhores trabalhos", type: "textarea", required: true, placeholder: "YouTube, Vimeo, Instagram, Drive... Cole de 3 a 6 links, um por linha.", hint: "Links privados devem permitir visualização pela Alysson Tech." },
      { id: "hero", label: "Qual vídeo você gostaria de destacar na abertura?", placeholder: "Nome ou link da produção" },
      { id: "categories", label: "Como gostaria de organizar o portfólio?", type: "multi", options: ["Por tipo de serviço", "Por cliente", "Por ano", "Galeria única", "Quero orientação"] },
      { id: "assets", label: "Quais materiais já possui?", type: "multi", options: ["Fotos profissionais", "Bastidores", "Depoimentos", "Logotipo em alta", "Textos sobre mim", "Ainda vou organizar"] },
      { id: "drive", label: "Link de pasta com materiais (opcional)", placeholder: "Google Drive, Dropbox ou equivalente" },
    ],
  },
  {
    kicker: "05 / OBJETIVOS", name: "O que seu novo site precisa entregar?",
    description: "Essas escolhas definem as funcionalidades, o escopo e a proposta.",
    fields: [
      { id: "goal", label: "Principal objetivo do site", type: "single", required: true, options: ["Conseguir mais orçamentos", "Apresentar meu portfólio", "Fortalecer minha marca", "Todos os anteriores"] },
      { id: "features", label: "Quais funcionalidades são importantes?", type: "multi", required: true, options: ["Botão WhatsApp", "Formulário de orçamento", "Portfólio com filtros", "Vídeo na abertura", "Depoimentos", "Pacotes e serviços", "Redes sociais", "Blog"] },
      { id: "pricing", label: "Como apresentar os valores?", type: "single", options: ["Orçamento sob consulta", "Mostrar pacotes e preços", "Ainda não sei"] },
      { id: "admin", label: "Você quer atualizar vídeos e conteúdo sem depender da Alysson Tech?", type: "single", required: true, options: ["Sim, quero painel administrativo", "Não, prefiro solicitar atualizações", "Quero avaliar as opções"] },
      { id: "adminFeatures", label: "O que gostaria de gerenciar sozinho?", type: "multi", options: ["Adicionar vídeos", "Editar serviços", "Atualizar fotos", "Depoimentos", "Pedidos de orçamento"], showWhen: { id: "admin", equals: "Sim, quero painel administrativo" } },
      { id: "deadline", label: "Existe uma data desejada de lançamento?", placeholder: "Ex.: antes do início de dezembro" },
      { id: "notes", label: "Alguma outra ideia ou necessidade?", type: "textarea", placeholder: "Conte o que não perguntamos." },
    ],
  },
];

function textOf(value?: string | string[]) {
  return Array.isArray(value) ? value.join(", ") : (value || "").trim();
}
function visible(field: Field, answers: Answers) {
  return !field.showWhen || answers[field.showWhen.id] === field.showWhen.equals;
}
function buildBriefing(answers: Answers, photos: File[] = []) {
  const lines = ["BRIEFING DO SITE — FILMMAKER", "ALYSSON TECH", `Preenchido em: ${new Date().toLocaleString("pt-BR")}`, ""];
  sections.forEach(section => {
    lines.push(section.name.toUpperCase());
    section.fields.filter(field => visible(field, answers)).forEach(field => {
      lines.push(`${field.label}:\n${textOf(answers[field.id]) || "Não informado"}\n`);
    });
    lines.push("");
  });
  if (photos.length) {
    lines.push("FOTOS SELECIONADAS NO FORMULÁRIO (ANEXOS SÃO ENVIADOS À PARTE)");
    photos.forEach(photo => lines.push(`• ${photo.name}`));
    lines.push("As fotos precisam ser compartilhadas separadamente pelo cliente no WhatsApp.", "");
  }
  return lines.join("\n");
}

export default function FilmmakerBriefingPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ key: string; url: string }[]>([]);
  const [photoNotice, setPhotoNotice] = useState("");
  const [isSharingPhotos, setIsSharingPhotos] = useState(false);
  const isReview = step === sections.length;
  const current = sections[step];
  const progress = Math.round(step / sections.length * 100);
  const brand = textOf(answers.studio) || textOf(answers.name) || "Sua história. Seu próximo capítulo.";
  const tagline = textOf(answers.services) || "DIREÇÃO • FILME • NARRATIVA";
  const filled = useMemo(() => sections.reduce((n, section) => n + section.fields.filter(f => f.required && textOf(answers[f.id])).length, 0), [answers]);
  const total = sections.reduce((n, section) => n + section.fields.filter(f => f.required).length, 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) setAnswers(saved);
    } catch { /* Browser storage is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(answers)); } catch { /* Browser storage is optional. */ }
  }, [answers, ready]);

  useEffect(() => {
    const objects = photos.map(photo => ({ key: `${photo.name}:${photo.size}:${photo.lastModified}`, url: URL.createObjectURL(photo) }));
    setPreviews(objects);
    return () => objects.forEach(item => URL.revokeObjectURL(item.url));
  }, [photos]);

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files || []);
    event.target.value = "";
    if (!incoming.length) return;
    const next = [...photos];
    const rejected: string[] = [];
    for (const photo of incoming) {
      if (!ALLOWED_IMAGES.includes(photo.type)) { rejected.push(`${photo.name}: formato não aceito`); continue; }
      if (photo.size > MAX_PHOTO_SIZE) { rejected.push(`${photo.name}: ultrapassa 8 MB`); continue; }
      if (next.some(p => p.name === photo.name && p.size === photo.size && p.lastModified === photo.lastModified)) continue;
      if (next.length >= MAX_PHOTOS) { rejected.push("Limite de 8 fotos atingido"); break; }
      if (next.reduce((total, item) => total + item.size, 0) + photo.size > MAX_TOTAL_SIZE) { rejected.push("Limite total de 30 MB atingido"); break; }
      next.push(photo);
    }
    setPhotos(next);
    setPhotoNotice(rejected.length ? rejected.join(" · ") : `${next.length} ${next.length === 1 ? "imagem selecionada" : "imagens selecionadas"} para compartilhar.`);
  }

  async function sharePhotos() {
    if (!photos.length) { setPhotoNotice("Selecione suas fotos na etapa Portfólio."); return; }
    if (!navigator.share || !navigator.canShare?.({ files: photos })) {
      setPhotoNotice("Este navegador não permite compartilhar arquivos diretamente. Abra a conversa no WhatsApp e anexe essas fotos manualmente pelo celular ou computador.");
      return;
    }
    setIsSharingPhotos(true);
    try {
      await navigator.share({ files: photos, title: "Fotos do briefing — Alysson Tech", text: "Fotos e materiais para o briefing de site filmmaker da Alysson Tech. Selecione o WhatsApp e o contato comercial da Alysson Tech." });
      setPhotoNotice("Compartilhamento iniciado. Confira no WhatsApp se as fotos realmente foram enviadas ao contato da Alysson Tech.");
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") setPhotoNotice("Não foi possível compartilhar as fotos. Você pode anexá-las manualmente na conversa do WhatsApp.");
    } finally { setIsSharingPhotos(false); }
  }

  function update(id: string, next: string | string[]) {
    setAnswers(previous => ({ ...previous, [id]: next }));
    setErrors(previous => previous.filter(e => e !== id));
  }
  function choose(field: Field, option: string) {
    if (field.type === "multi") {
      const selected = Array.isArray(answers[field.id]) ? answers[field.id] as string[] : [];
      update(field.id, selected.includes(option) ? selected.filter(item => item !== option) : [...selected, option]);
    } else update(field.id, option);
  }
  function goNext() {
    if (isReview) return;
    const invalid = current.fields.filter(f => visible(f, answers) && f.required && !textOf(answers[f.id])).map(f => f.id);
    if (invalid.length) {
      setErrors(invalid);
      document.getElementById("field-" + invalid[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors([]);
    setStep(previous => Math.min(previous + 1, sections.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goBack() {
    setErrors([]);
    setStep(previous => Math.max(previous - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function sendWhatsApp() {
    const message = buildBriefing(answers, photos);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    if (photos.length) {
      setPhotoNotice("O WhatsApp foi aberto em outra aba para enviar o texto. Depois volte aqui e use Compartilhar fotos para enviar as imagens separadamente.");
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(url);
    }
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(buildBriefing(answers, photos));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      alert("Não foi possível copiar automaticamente. Use o botão de enviar pelo WhatsApp.");
    }
  }
  function restart() {
    if (!window.confirm("Deseja começar outro briefing? As respostas salvas neste aparelho serão apagadas.")) return;
    setAnswers({});
    setPhotos([]);
    setPreviews([]);
    setPhotoNotice("");
    setStep(0);
    setErrors([]);
  }

  return (
    <main className={styles.page}>
      <div className={styles.gridBg} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Alysson Tech, página inicial">
          <span className={styles.logo}><Image src="/brand/alysson-tech-icon.png" alt="" fill sizes="48px" /></span>
          <span className={styles.brandWord}>ALYSSON <strong>TECH</strong></span>
        </Link>
        <span className={styles.headerInfo}><span className={styles.liveDot} /> BRIEFING DIGITAL <span className={styles.headerSuffix}>/ FILMMAKER</span></span>
      </header>

      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}><span /> ALYSSON TECH / DESENVOLVIMENTO WEB</p>
          <h1>Seu trabalho conta histórias.<br /><em>Seu site também deveria.</em></h1>
          <p>Vamos entender sua marca, seus projetos e o que você espera do novo site. Responda às etapas para receber uma proposta alinhada ao seu trabalho.</p>
        </div>

        <div className={styles.layout}>
          <section className={styles.formCard} aria-label="Briefing interativo">
            <div className={styles.progressHeader}><strong>ETAPA {String(Math.min(step + 1, 6)).padStart(2, "0")} / 06</strong><span>{isReview ? "Concluído" : `${filled} de ${total} respostas essenciais`}</span></div>
            <div className={styles.progressTrack}><div style={{ width: `${progress}%` }} /></div>
            <div className={styles.dots}>{[0,1,2,3,4,5].map(n => <span key={n} className={n <= step ? styles.dotActive : ""}/>)}</div>

            {isReview ? (
              <div className={styles.body}>
                <div className={styles.sectionKicker}><CheckCircle2 size={16}/> 06 / REVISÃO</div>
                <h2>Seu briefing está pronto.</h2>
                <p className={styles.sectionLead}>Confira as informações abaixo. Ao clicar em enviar, o WhatsApp da Alysson Tech será aberto com suas respostas preenchidas. É necessário confirmar o envio na conversa.</p>
                <div className={styles.review}>
                  {sections.map(section => (
                    <div key={section.name}>
                      <h3>{section.name}</h3>
                      {section.fields.filter(f => visible(f, answers)).map(field => (
                        <div className={styles.reviewItem} key={field.id}><span>{field.label}</span><strong>{textOf(answers[field.id]) || "Não informado"}</strong></div>
                      ))}
                    </div>
                  ))}
                </div>
                {photos.length > 0 && <div className={styles.attachmentSummary}><ImagePlus size={18}/><div><strong>{photos.length} fotos selecionadas</strong><span>Essas fotos não acompanham automaticamente o texto do WhatsApp. Utilize o botão de compartilhamento abaixo para enviá-las também.</span></div></div>}
                <div className={styles.reviewActions}>
                  <button className={styles.primaryButton} type="button" onClick={sendWhatsApp}><Send size={17} /> Enviar para Alysson Tech</button>
                  {photos.length > 0 && <button className={styles.secondaryButton} type="button" onClick={sharePhotos} disabled={isSharingPhotos}><Share2 size={17}/> {isSharingPhotos ? "Compartilhando..." : "Compartilhar fotos"}</button>}
                  <button className={styles.secondaryButton} type="button" onClick={copyBrief}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Copiado!" : "Copiar respostas"}</button>
                </div>
                {photoNotice && <p className={styles.photoNotice} role="status">{photoNotice}</p>}
                <p className={styles.privacy}><ShieldCheck size={16}/> Respostas de texto ficam salvas neste navegador. As imagens não são armazenadas no servidor nem preservadas ao fechar/recarregar a página. O envio ocorre somente quando você compartilha e confirma no WhatsApp.</p>
              </div>
            ) : (
              <form className={styles.body} onSubmit={event => { event.preventDefault(); goNext(); }} noValidate>
                <div className={styles.sectionKicker}><Film size={16}/> {current.kicker}</div>
                <h2>{current.name}</h2><p className={styles.sectionLead}>{current.description}</p>
                <div className={styles.fields}>
                  {current.fields.filter(field => visible(field, answers)).map(field => (
                    <div id={`field-${field.id}`} className={styles.field} key={field.id}>
                      <label htmlFor={`answer-${field.id}`}>{field.label} {field.required && <span className={styles.required}>*</span>}</label>
                      {field.type === "single" || field.type === "multi" ? (
                        <div className={styles.choices} role="group" aria-label={field.label}>
                          {(field.options || []).map(option => {
                            const selected = Array.isArray(answers[field.id]) ? (answers[field.id] as string[]).includes(option) : answers[field.id] === option;
                            return <button type="button" key={option} aria-pressed={selected} className={selected ? styles.chipSelected : styles.chip} onClick={() => choose(field, option)}>{selected && <Check size={14}/>} {option}</button>;
                          })}
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea id={`answer-${field.id}`} rows={4} maxLength={2500} placeholder={field.placeholder} className={errors.includes(field.id) ? styles.inputError : styles.input} value={textOf(answers[field.id])} onChange={event => update(field.id, event.target.value)} />
                      ) : (
                        <input id={`answer-${field.id}`} type="text" maxLength={400} placeholder={field.placeholder} className={errors.includes(field.id) ? styles.inputError : styles.input} value={textOf(answers[field.id])} onChange={event => update(field.id, event.target.value)} />
                      )}
                      {field.hint && <small className={styles.hint}>{field.hint}</small>}
                      {errors.includes(field.id) && <small className={styles.error} role="alert">Este campo é obrigatório.</small>}
                    </div>
                  ))}
                </div>
                {step === 3 && <div className={styles.uploadSection}>
                  <div className={styles.uploadHeading}><ImagePlus size={18}/><div><strong>Anexar fotos e materiais visuais</strong><span>Envie fotos de bastidores, retratos, capas e logotipo.</span></div></div>
                  <label className={styles.uploadDrop} htmlFor="filmmaker-photo-upload"><Upload size={22}/><strong>Escolher imagens</strong><small>JPG, PNG, WebP ou HEIC · até 8 imagens · 8 MB por arquivo</small></label>
                  <input id="filmmaker-photo-upload" className={styles.visuallyHidden} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple onChange={addPhotos}/>
                  {photos.length > 0 && <div className={styles.photosGrid}>{photos.map((photo, i) => {
                    const thumb = previews.find(p => p.key === `${photo.name}:${photo.size}:${photo.lastModified}`)?.url;
                    return <div className={styles.photoItem} key={`${photo.name}-${photo.lastModified}`}>
                      {thumb && <Image src={thumb} alt={`Imagem anexada: ${photo.name}`} fill unoptimized sizes="120px" className={styles.photoThumb}/>}
                      <button type="button" className={styles.removePhoto} title={`Remover ${photo.name}`} aria-label={`Remover ${photo.name}`} onClick={() => { setPhotos(prev => prev.filter((_, index) => index !== i)); setPhotoNotice(""); }}><X size={15}/></button>
                      <span className={styles.photoName} title={photo.name}>{photo.name}</span>
                    </div>;
                  })}</div>}
                  {photoNotice && <p className={styles.photoNotice} role="status">{photoNotice}</p>}
                  <p className={styles.uploadHint}>As imagens ficam apenas nesta sessão. No final, você poderá compartilhá-las pelo menu do celular; não são enviadas automaticamente.</p>
                </div>}
                <div className={styles.navigation}>
                  <button type="button" className={styles.secondaryButton} onClick={goBack} disabled={step === 0}><ArrowLeft size={16}/> Voltar</button>
                  <button type="submit" className={styles.primaryButton}>{step === sections.length - 1 ? "Revisar briefing" : "Continuar"} <ArrowRight size={17}/></button>
                </div>
              </form>
            )}
            {isReview && <div className={styles.bottomActions}><button className={styles.textButton} type="button" onClick={goBack}><ArrowLeft size={14}/> Corrigir respostas</button><button className={styles.textButton} type="button" onClick={restart}><RotateCcw size={14}/> Novo briefing</button></div>}
          </section>

          <aside className={styles.aside}>
            <div className={styles.previewPanel}>
              <div className={styles.previewTop}><span>PRÉVIA CONCEITUAL</span><Clapperboard size={17}/></div>
              <div className={styles.previewVisual}>
                <video className={styles.previewVideo} autoPlay loop muted playsInline preload="metadata" aria-hidden="true" poster="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=900"><source src={VIDEO_SOURCE} type="video/mp4"/></video>
                <div className={styles.previewGradient} aria-hidden="true"/>
                <div className={styles.previewIndicator}><span className={styles.recDot}/> LIVE PREVIEW <Video size={13}/></div>
                <span className={styles.previewLabel}>CREATIVE / PORTFOLIO</span>
                <strong>{brand}</strong>
                <small>{tagline.toUpperCase()}</small>
                <div className={styles.videoControls}><span>◉ EM EXIBIÇÃO</span><span>4K / CINEMA</span></div>
                <div className={styles.videoTimeline}><span/></div>
              </div>
              <p>Referência cinematográfica em movimento. O site definitivo será construído com seus próprios vídeos e a identidade da sua marca. <small>Vídeo demonstrativo: Pexels / Ron Lach.</small></p>
            </div>
            <div className={styles.stepsPanel}>
              <h3>SUA JORNADA</h3>
              {sections.map((section, i) => <div className={styles.stepItem} key={section.name}>
                <span className={i < step ? styles.stepDone : styles.stepCount}>{i < step ? <Check size={14}/> : String(i+1).padStart(2, "0")}</span><span>{section.name}</span>
              </div>)}
              <div className={styles.secure}><ShieldCheck size={17}/><span>Preenchimento gratuito, sem necessidade de cadastro.</span></div>
            </div>
          </aside>
        </div>
        <footer className={styles.footer}><span>© ALYSSON TECH · SOLUÇÕES DIGITAIS</span><span>Briefing para filmmaker e produtor audiovisual</span></footer>
      </div>
    </main>
  );
}
