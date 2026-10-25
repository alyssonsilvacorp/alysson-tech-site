/* eslint-disable @next/next/no-img-element */
import {
  ArrowUpRight, Clock3, CreditCard, MapPin,
  Navigation, Scissors, Star
} from "lucide-react";
import type { ReactNode } from "react";
import type { SmartBusiness } from "../../lib/smart-business";
import PixCopy from "./PixCopy";
import styles from "./LimaMultilink.module.css";

type ShortcutProps = {
  icon: ReactNode;
  title: string;
  detail: string;
  href: string;
  primary?: boolean;
  external?: boolean;
};

function safeUrl(raw: string | null | undefined) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.5" cy="6.6" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Shortcut({ icon, title, detail, href, primary = false, external = true }: ShortcutProps) {
  return (
    <a className={`${styles.shortcut} ${primary ? styles.shortcutPrimary : ""}`}
       href={href}
       target={external ? "_blank" : undefined}
       rel={external ? "noopener noreferrer" : undefined}>
      <span className={styles.shortcutIcon}>{icon}</span>
      <span className={styles.shortcutText}><strong>{title}</strong><small>{detail}</small></span>
      <ArrowUpRight className={styles.shortcutArrow} size={19} strokeWidth={1.6} aria-hidden="true" />
    </a>
  );
}

export default function LimaMultilink({ business }: { business: SmartBusiness }) {
  const getAction = (actionType: string) => business.actions.find(a => a.actionType === actionType);
  const whatsappDigits = business.whatsappNumber?.replace(/\D/g, "") ?? "";
  const whatsappAction = getAction("whatsapp");
  const message = encodeURIComponent("Olá! Encontrei a Barbearia Lima pelo cartão digital e gostaria de saber mais sobre o atendimento por ordem de chegada.");
  const whatsapp = safeUrl(whatsappAction?.url) ??
    (whatsappDigits.length >= 10 && whatsappDigits.length <= 13 ? `https://wa.me/${whatsappDigits}?text=${message}` : null);

  const instagram = safeUrl(getAction("instagram")?.url) ?? safeUrl(business.instagramUrl);
  const storedMap = safeUrl(getAction("location")?.url) ?? safeUrl(business.mapsUrl);
  // Busca de endereço, não equivale à ficha do estabelecimento no Google.
  const mapSearch = business.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}`)}`
    : null;
  const mapUrl = storedMap ?? mapSearch;
  const review = safeUrl(getAction("google_review")?.url);

  const pixAction = getAction("pix");
  const pixCode = pixAction?.config["pix_copia_e_cola"];
  const pixKey = pixAction?.config["pix_key"];
  const pixValue = typeof pixCode === "string" && pixCode.trim()
    ? pixCode.trim()
    : typeof pixKey === "string" && pixKey.trim() ? pixKey.trim() : null;
  const pixLabel = typeof pixCode === "string" && pixCode.trim() ? "Pix Copia e Cola" : "Chave Pix";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <span className={styles.eyebrow}>BARBEARIA · MACEIÓ</span>
          <span className={styles.topBarLine} />
          <span className={styles.topBarRight}>ESPAÇO DIGITAL</span>
        </div>

        <header className={styles.hero}>
          {business.coverUrl && <img src={business.coverUrl} className={styles.heroPhoto} alt="" aria-hidden="true" />}
          <span aria-hidden="true" className={styles.heroOrnament}>L</span>
          <div className={styles.heroInner}>
            <div className={styles.brandLine}>
              {business.logoUrl ? (
                <div className={styles.brandLogoOfficial}>
                  <img src={business.logoUrl} alt="Logotipo oficial da Barbearia Lima" width={680} height={438} />
                </div>
              ) : (
                <>
                  <div className={styles.brandEmblem}>
                    <Scissors size={32} strokeWidth={1.25} aria-hidden="true" />
                  </div>
                  <div className={styles.brandIdentity}>
                    <span>IDENTIDADE · ESTILO · PRECISÃO</span>
                    <strong>BARBEARIA LIMA</strong>
                  </div>
                </>
              )}
            </div>
            <div className={styles.heroText}>
              <span className={styles.heroKicker}>SEU ESTILO COMEÇA AQUI</span>
              <h1>Seu corte.<br /><em>Sua identidade.</em></h1>
              <p>Conheça nossos canais e fale com a equipe da Barbearia Lima de forma rápida e direta.</p>
            </div>
            <div className={styles.heroFoot}>
              <span><Clock3 size={15} strokeWidth={1.7} /> Atendimento por ordem de chegada</span>
              <span className={styles.fourPoint} aria-hidden="true">✦</span>
            </div>
          </div>
        </header>

        <section className={styles.contacts} aria-labelledby="lima-contact-heading">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>SEU PRÓXIMO CORTE</span>
            <h2 id="lima-contact-heading">Tudo em um só lugar.</h2>
            <p>Escolha uma opção e continue diretamente pelo celular.</p>
          </div>

          <div className={styles.shortcutGrid}>
            {whatsapp && <Shortcut primary icon={<WhatsAppMark />} title="Falar pelo WhatsApp" detail="Dúvidas, valores e atendimento" href={whatsapp} />}
            {instagram && <Shortcut icon={<InstagramMark />} title="Instagram" detail="Acompanhe os trabalhos e novidades" href={instagram} />}
            {mapUrl && <Shortcut icon={<MapPin size={23} strokeWidth={1.6} />} title={storedMap ? "Como chegar" : "Buscar localização"} detail={storedMap ? "Abrir localização no Google Maps" : "Localizar a barbearia no Maps"} href={mapUrl} />}
            <Shortcut icon={<Scissors size={23} strokeWidth={1.55} />} title="Serviços e valores" detail="Consulte as opções de atendimento" href="#servicos" external={false} />
            {review && <Shortcut icon={<Star size={23} strokeWidth={1.6} />} title="Avaliar no Google" detail="Compartilhe sua experiência" href={review} />}
            {pixValue && <Shortcut icon={<CreditCard size={23} strokeWidth={1.6} />} title="Chave Pix" detail="Ver e copiar dados de pagamento" href="#pix" external={false} />}
          </div>
        </section>

        <section className={styles.serviceSection} id="servicos" aria-labelledby="lima-services-heading">
          <div className={styles.serviceHeading}>
            <span className={styles.kicker}>01 / SERVIÇOS</span>
            <h2 id="lima-services-heading">Cuide do seu estilo.</h2>
          </div>

          {business.services.length ? (
            <div className={styles.serviceGrid}>
              {business.services.map((service, index) => (
                <article key={service.sku ?? `${service.name}-${index}`} className={styles.serviceCard}>
                  {service.imageUrl && <img src={service.imageUrl} alt={service.name} loading="lazy" />}
                  <div className={styles.serviceContent}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{service.name}</h3>{service.description && <p>{service.description}</p>}</div>
                    {service.priceLabel && <strong>{service.priceLabel}</strong>}
                    {!service.priceLabel && service.price !== null && <strong>{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(service.price)}</strong>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.serviceIntro}>
              <Scissors size={26} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <strong>Atendimento direto na barbearia</strong>
                <p>O atendimento acontece por ordem de chegada. Valores e serviços disponíveis podem ser consultados com a equipe.</p>
                {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer">Consultar pelo WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a>}
              </div>
            </div>
          )}
        </section>

        {pixValue && (
          <section className={styles.pixSection} id="pix" aria-labelledby="lima-pix-heading">
            <span className={styles.kicker}>02 / PAGAMENTO</span>
            <h2 id="lima-pix-heading">Pague com Pix.</h2>
            <PixCopy value={pixValue} label={pixLabel} />
            <p>Antes de concluir, confira os dados exibidos pelo seu banco.</p>
          </section>
        )}

        <footer className={styles.footer}>
          <div className={styles.footerBrand}><Scissors size={21} strokeWidth={1.3} aria-hidden="true" /><strong>BARBEARIA LIMA</strong></div>
          <p><Navigation size={15} aria-hidden="true" /> Santos Dumont · Maceió, AL</p>
          <small>Seu estilo em boas mãos. Atendimento por ordem de chegada.</small>
          <div className={styles.credit}>TECNOLOGIA <strong>ALYSSON TECH</strong> · QR & NFC</div>
        </footer>
      </div>
    </main>
  );
}
