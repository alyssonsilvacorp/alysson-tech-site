/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { SmartBusiness } from "../../lib/smart-business";
import styles from "./AlyssonTechMultilink.module.css";

const formatIndex = (number: number) => String(number).padStart(2, "0");

function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

function whatsappForService(baseUrl: string | null, serviceName: string) {
  if (!baseUrl) return null;
  try {
    const parsed = new URL(baseUrl);
    if (parsed.hostname !== "wa.me" && parsed.hostname !== "api.whatsapp.com") return baseUrl;
    const text = "Olá! Vi o multilink da Alysson Tech e gostaria de um orçamento para " + serviceName + ".";
    parsed.searchParams.set("text", text);
    return parsed.href;
  } catch {
    return baseUrl;
  }
}

function ExternalLink({
  href,
  children,
  className,
  label,
}: {
  href: string | null;
  children: ReactNode;
  className: string;
  label?: string;
}) {
  return href ? (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {children}
    </a>
  ) : null;
}

export default function AlyssonTechMultilink({ business }: { business: SmartBusiness }) {
  const whatsappAction = business.actions.find((a) => a.actionType === "whatsapp");
  const reviewAction = business.actions.find((a) => a.actionType === "google_review");
  const websiteAction = business.actions.find((a) => a.actionType === "website");
  const instagramAction = business.actions.find((a) => a.actionType === "instagram");
  const phone = business.whatsappNumber?.replace(/\D/g, "") ?? "";
  const whatsapp = safeUrl(whatsappAction?.url) ??
    (phone.length >= 10 && phone.length <= 13 ? "https://wa.me/" + phone : null);
  const instagram = safeUrl(instagramAction?.url) ?? safeUrl(business.instagramUrl);
  const website = safeUrl(websiteAction?.url) ?? "https://alyssontech.com.br/";
  const reviews = safeUrl(reviewAction?.url);
  const logo = safeUrl(business.logoUrl);
  const services = business.services;

  return (
    <main className={styles.page}>
      <div className={styles.glowA} aria-hidden="true" />
      <div className={styles.glowB} aria-hidden="true" />
      <div className={styles.shell}>
        <nav className={styles.nav} aria-label="Navegação principal do multilink">
          <a className={styles.identity} href="#inicio" aria-label="Alysson Tech, início">
            {logo ? <img src={logo} alt="Logotipo Alysson Tech" className={styles.logo} width={56} height={56} /> : <span className={styles.logoFallback}>AT</span>}
            <span className={styles.identityText}><strong>ALYSSON<span>TECH</span></strong><small>SOLUÇÕES DIGITAIS</small></span>
          </a>
          <a href="#solucoes" className={styles.navLink}>Conheça as soluções <span aria-hidden="true">↗</span></a>
        </nav>

        <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}><span className={styles.indicator} /> TECNOLOGIA PARA NEGÓCIOS REAIS</p>
            <h1 id="hero-title">Seu negócio merece <em>mais presença.</em> Mais resultado.</h1>
            <p className={styles.intro}>Sites, sistemas, automações e soluções inteligentes para aproximar sua empresa de novos clientes.</p>
            <div className={styles.heroButtons}>
              <ExternalLink href={whatsapp} className={styles.primaryButton} label="Solicitar orçamento no WhatsApp da Alysson Tech">
                Solicitar um orçamento <span aria-hidden="true">↗</span>
              </ExternalLink>
              <a href="#solucoes" className={styles.ghostButton}>Explorar serviços <span aria-hidden="true">↓</span></a>
            </div>
            <div className={styles.heroDetails}><span>ATENDIMENTO EM MACEIÓ E REGIÃO</span><span>PROJETOS SOB MEDIDA</span></div>
          </div>
          <div className={styles.heroArtwork} aria-hidden="true">
            <div className={styles.artGrid} />
            <div className={styles.orbitOne} />
            <div className={styles.orbitTwo} />
            <div className={styles.glassPanel}>
              <div className={styles.glassTop}><span /> <span /> <span /></div>
              <div className={styles.artGlyph}>AT<span>✦</span></div>
              <div className={styles.glassBottom}><small>DESIGN / TECNOLOGIA / RESULTADOS</small><strong>ALYSSON TECH <span>↗</span></strong></div>
            </div>
            <span className={styles.sparkOne}>✦</span><span className={styles.sparkTwo}>+</span>
          </div>
        </section>

        <section className={styles.quickSection} aria-label="Acessos rápidos">
          <p className={styles.sectionKicker}>CONECTE-SE COM A GENTE</p>
          <div className={styles.quickGrid}>
            <ExternalLink href={whatsapp} className={styles.quickCard}><span>01 / CONTATO</span><strong>WhatsApp</strong><small>Orçamentos e atendimento</small><b aria-hidden="true">↗</b></ExternalLink>
            <ExternalLink href={instagram} className={styles.quickCard}><span>02 / NOVIDADES</span><strong>Instagram</strong><small>Projetos e bastidores</small><b aria-hidden="true">↗</b></ExternalLink>
            <ExternalLink href={website} className={styles.quickCard}><span>03 / CONHEÇA</span><strong>Site oficial</strong><small>Portfólio e soluções</small><b aria-hidden="true">↗</b></ExternalLink>
            <ExternalLink href={reviews} className={styles.quickCard}><span>04 / CONFIANÇA</span><strong>Google</strong><small>Avalie nossa empresa</small><b aria-hidden="true">↗</b></ExternalLink>
          </div>
        </section>

        <section className={styles.servicesSection} id="solucoes" aria-labelledby="services-heading">
          <div className={styles.sectionHead}>
            <div><p className={styles.sectionKicker}>O QUE PODEMOS FAZER POR VOCÊ</p><h2 id="services-heading">Soluções que <em>transformam.</em></h2></div>
            <p>Escolha o que seu negócio precisa. Nós cuidamos da parte tecnológica com foco em praticidade e experiência.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <article className={styles.serviceCard} key={service.name + "-" + index}>
                <div className={styles.serviceVisual}>
                  {safeUrl(service.imageUrl) ? <img loading="lazy" src={safeUrl(service.imageUrl)!} alt="" /> : <div className={styles.serviceFallback} />}
                  <span>{formatIndex(index + 1)}</span>
                </div>
                <div className={styles.serviceBody}>
                  <h3>{service.name}</h3>
                  {service.description && <p>{service.description}</p>}
                  <div className={styles.serviceFooter}>
                    <small>{service.priceLabel ?? "Projeto sob medida"}</small>
                    {whatsapp && <ExternalLink href={whatsappForService(whatsapp, service.name)} className={styles.serviceLink} label={"Solicitar orçamento para " + service.name}>Orçamento <span aria-hidden="true">↗</span></ExternalLink>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="cta-heading">
          <span className={styles.finalTag}>SEU PRÓXIMO PROJETO COMEÇA AQUI</span>
          <h2 id="cta-heading">Sua próxima evolução <em>começa com uma conversa.</em></h2>
          <p>Conte sua ideia e vamos encontrar a solução certa para o seu negócio.</p>
          <ExternalLink href={whatsapp} className={styles.primaryButton}>Conversar no WhatsApp <span aria-hidden="true">↗</span></ExternalLink>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerBrand}><strong>ALYSSON TECH</strong><span>Tecnologia prática para negócios reais.</span></div>
          <span>MACEIÓ · ALAGOAS · BRASIL</span>
          <a href="#inicio">Voltar ao topo ↑</a>
        </footer>
      </div>
    </main>
  );
}
