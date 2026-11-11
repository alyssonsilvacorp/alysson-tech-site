"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clapperboard, Copy, Film, RotateCcw, Send, ShieldCheck } from "lucide-react";
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
function buildBriefing(answers: Answers) {
  const lines = ["BRIEFING DO SITE — FILMMAKER", "ALYSSON TECH", `Preenchido em: ${new Date().toLocaleString("pt-BR")}`, ""];
  sections.forEach(section => {
    lines.push(section.name.toUpperCase());
    section.fields.filter(field => visible(field, answers)).forEach(field => {
      lines.push(`${field.label}:\n${textOf(answers[field.id]) || "Não informado"}\n`);
    });
    lines.push("");
  });
  return lines.join("\n");
}

export default function FilmmakerBriefingPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
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
    const message = buildBriefing(answers);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) window.location.assign(url);
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(buildBriefing(answers));
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
                <div className={styles.reviewActions}>
                  <button className={styles.primaryButton} type="button" onClick={sendWhatsApp}><Send size={17} /> Enviar para Alysson Tech</button>
                  <button className={styles.secondaryButton} type="button" onClick={copyBrief}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Copiado!" : "Copiar respostas"}</button>
                </div>
                <p className={styles.privacy}><ShieldCheck size={16}/> Suas respostas ficam salvas somente neste navegador até você decidir compartilhá-las. Não existe envio automático nem banco de dados nesta versão.</p>
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
                <div className={styles.play} aria-hidden="true">▶</div>
                <span className={styles.previewLabel}>CREATIVE / PORTFOLIO</span>
                <strong>{brand}</strong>
                <small>{tagline.toUpperCase()}</small>
              </div>
              <p>Uma ideia de apresentação do seu trabalho. O visual definitivo será criado para a identidade da sua marca.</p>
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
