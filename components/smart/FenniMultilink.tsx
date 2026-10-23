/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { ArrowUpRight, CreditCard, Glasses, Instagram, MapPin, Star } from "lucide-react";
import type { SmartBusiness } from "../../lib/smart-business";
import PixCopy from "./PixCopy";
import FenniProductGallery from "./FenniProductGallery";
import styles from "./FenniMultilink.module.css";

function safeUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function getWhatsapp(business: SmartBusiness) {
  const action = business.actions.find((item) => item.actionType === "whatsapp");
  const custom = safeUrl(action?.url);
  if (custom) return custom;
  const phone = business.whatsappNumber?.replace(/\D/g, "") ?? "";
  if (phone.length < 10 || phone.length > 13) return null;
  const message = encodeURIComponent(
    "Olá! Acessei o cartão digital da Ótica Fenni e gostaria de informações."
  );
  return `https://wa.me/${phone}?text=${message}`;
}

// Marca reconhecível do WhatsApp em SVG, com a cor editorial da Fenni.
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
    </svg>
  );
}

function AccessCard({
  title,
  subtitle,
  href,
  icon,
  variant = "standard",
}: {
  title: string;
  subtitle: string;
  href: string | null;
  icon: ReactNode;
  variant?: "standard" | "featured";
}) {
  const content = (
    <>
      <span className={styles.actionSymbol} aria-hidden="true">{icon}</span>
      <span className={styles.actionCopy}>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className={styles.actionArrow} aria-hidden="true">{href ? <ArrowUpRight size={19} strokeWidth={1.6} /> : "—"}</span>
    </>
  );
  const className = `${styles.accessCard} ${variant === "featured" ? styles.featured : ""} ${!href ? styles.disabled : ""}`;
  if (!href) return <div className={className} aria-disabled="true">{content}</div>;
  return (
    <a className={className} href={href} target={href.startsWith("#") ? undefined : "_blank"} rel={href.startsWith("#") ? undefined : "noopener noreferrer"}>
      {content}
    </a>
  );
}

export default function FenniMultilink({ business }: { business: SmartBusiness }) {
  const googleAction = business.actions.find((action) => action.actionType === "google_review");
  const reviewUrl = safeUrl(googleAction?.url);
  const whatsapp = getWhatsapp(business);
  const instagram = safeUrl(business.instagramUrl)
    ?? safeUrl(business.actions.find((action) => action.actionType === "instagram")?.url);
  const maps = safeUrl(business.mapsUrl)
    ?? safeUrl(business.actions.find((action) => action.actionType === "location")?.url);
  const pix = business.actions.find((action) => action.actionType === "pix");
  const copyPaste = pix?.config["pix_copia_e_cola"];
  const pixKey = pix?.config["pix_key"];
  const pixValue = typeof copyPaste === "string" && copyPaste.trim()
    ? copyPaste.trim()
    : typeof pixKey === "string" && pixKey.trim() ? pixKey.trim() : null;
  // A chave Pix de celular é copiada em formato internacional (+55),
  // mas o visitante vê apenas o número informado pela ótica.
  const displayPix = pixValue?.replace(/^\+55(?=\d{11}$)/, "") ?? null;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topline}>
          <span className={styles.smallBrand}>FENNI <span>ÓTICA</span></span>
          <span className={styles.toplineDetail}>SEU ESPAÇO DIGITAL</span>
        </div>

        <header className={styles.hero}>
          <img
            className={styles.heroPhoto}
            src="/fenni/loja-fenni.jpg"
            alt=""
            aria-hidden="true"
          />
          <span aria-hidden="true" className={styles.heroRule} />
          <div className={styles.identity}>
            <div className={styles.logoFrame}>
              <img src="/fenni/logo-oficial-instagram.jpg" alt="Logotipo original da Ótica Fenni" width="88" height="88" />
            </div>
            <div className={styles.identityBrand}>
              <span className={styles.category}>ÓTICA · MACEIÓ</span>
              <strong>Fenni</strong>
              <small>UM NOVO OLHAR</small>
            </div>
          </div>
          <h1>Um novo olhar <em>começa aqui.</em></h1>
          <p>Seu espaço Fenni. Encontre nossos canais, conheça as novidades e compartilhe sua experiência.</p>
          <div className={styles.heroFooter}>
            <span>ATENDIMENTO PERSONALIZADO</span>
            <span className={styles.star} aria-hidden="true">✦</span>
          </div>
        </header>

        <div className={styles.spotlight}>
          <AccessCard
            title="Avaliar no Google"
            subtitle={reviewUrl?.includes("maps.app.goo.gl") ? "No Google Maps, toque em Avaliar" : reviewUrl ? "Conte sua experiência" : "Avaliações em preparação"}
            icon={<Star size={22} strokeWidth={1.55} />}
            href={reviewUrl}
          />
        </div>

        <section className={styles.actions} aria-labelledby="fenni-links">
          <div className={styles.welcome}>
            <span className={styles.kicker}>CONTE COM A FENNI</span>
            <h2 id="fenni-links">Como podemos ajudar?</h2>
            <p>Escolha como deseja se conectar com a nossa ótica.</p>
          </div>
          <div className={styles.actionsList}>
            <AccessCard
              title="Falar no WhatsApp"
              subtitle={whatsapp ? "Tire suas dúvidas com a Fenni" : "Contato em preparação"}
              icon={<WhatsAppIcon />}
              href={whatsapp}
            />
            <AccessCard
              title="Instagram"
              subtitle={instagram ? "Novidades, armações e inspirações" : "Perfil em preparação"}
              icon={<Instagram size={22} strokeWidth={1.65} />}
              href={instagram}
            />
            <AccessCard
              title="Como chegar"
              subtitle={maps ? "Ver a localização no Google Maps" : "Localização em preparação"}
              icon={<MapPin size={22} strokeWidth={1.65} />}
              href={maps}
            />
            <AccessCard
              title="Catálogo de produtos"
              subtitle={business.services.length ? "Conheça nossos produtos" : "Catálogo em preparação"}
              icon={<Glasses size={22} strokeWidth={1.65} />}
              href="#catalogo"
            />
            <AccessCard
              title="Chave Pix"
              subtitle={pixValue ? "Toque para copiar os dados de pagamento" : "Pagamento em preparação"}
              icon={<CreditCard size={22} strokeWidth={1.65} />}
              href="#fenni-pix"
            />
          </div>
        </section>


        {business.services.length > 0 ? (
          <FenniProductGallery products={business.services} contactUrl={whatsapp} />
        ) : (
          <section id="catalogo" className={styles.catalog} aria-labelledby="fenni-catalog-coming">
            <span className={styles.eyebrow}>EM BREVE · COLEÇÃO FENNI</span>
            <h2 id="fenni-catalog-coming">Seu próximo olhar começa aqui.</h2>
            <div className={styles.catalogPreview}>
              <img
                src="/fenni/loja-fenni.jpg"
                alt="Interior da Ótica Fenni"
                loading="lazy"
              />
              <div>
                <strong>Estamos preparando nossa vitrine de armações.</strong>
                <p>Fotos reais, detalhes de cada modelo e atendimento pelo WhatsApp. Em breve, prévias de vídeo para conhecer as peças de perto.</p>
                {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer">Conhecer as opções pelo WhatsApp <span aria-hidden="true">↗</span></a>}
              </div>
            </div>
          </section>
        )}

        <section className={styles.payment} aria-labelledby="fenni-pix">
          <div className={styles.paymentIcon} aria-hidden="true"><CreditCard size={23} strokeWidth={1.5} /></div>
          <div className={styles.paymentContent}>
            <span className={styles.eyebrow}>PAGAMENTO</span>
            <h2 id="fenni-pix">Pagamento por Pix</h2>
            {pixValue ? (
              <>
                <div className={styles.pixWrapper}>
                  <PixCopy
                    value={displayPix ?? pixValue}
                    copyValue={pixValue}
                    label={typeof copyPaste === "string" && copyPaste.trim() ? "Pix Copia e Cola" : "Chave Pix"}
                  />
                </div>
                <p>Confira o nome do recebedor no banco antes de pagar.</p>
              </>
            ) : (
              <p className={styles.pending}>Em preparação. Dados de pagamento ainda não fornecidos pela loja.</p>
            )}
          </div>
        </section>

        {business.address && <p className={styles.address}>{business.address}</p>}
        <footer className={styles.footer}>
          <span>FENNI · ÓTICA</span>
          <small>Tecnologia por <strong>ALYSSON TECH</strong></small>
        </footer>
      </div>
    </main>
  );
}
