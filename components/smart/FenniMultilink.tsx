/* eslint-disable @next/next/no-img-element */
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

function AccessCard({
  title,
  subtitle,
  href,
  symbol,
  variant = "standard",
}: {
  title: string;
  subtitle: string;
  href: string | null;
  symbol: string;
  variant?: "standard" | "featured";
}) {
  const content = (
    <>
      <span className={styles.actionSymbol} aria-hidden="true">{symbol}</span>
      <span className={styles.actionCopy}>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className={styles.actionArrow} aria-hidden="true">{href ? "→" : "—"}</span>
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
  const receiver = pix?.config["receiver_name"];

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
            src="https://raw.githubusercontent.com/alyssonsilvacorp/otica-fenni-vitrine/main/public/images/store/loja-interior-fenni.jpg"
            alt=""
            aria-hidden="true"
          />
          <span aria-hidden="true" className={styles.heroRule} />
          <div className={styles.identity}>
            <div className={styles.logoFrame}>
              <svg viewBox="0 0 100 100" role="img" aria-label="Monograma FN, Ótica Fenni">
                <circle cx="50" cy="50" r="47" fill="#f7f1e8" stroke="#c9a970" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="39" fill="none" stroke="#947a6a" strokeWidth=".7" />
                <text x="50" y="19.5" textAnchor="middle" fill="#641f2a" fontSize="6.2" letterSpacing="2.4">ÓTICA</text>
                <text x="47" y="64" textAnchor="middle" fill="#641f2a" fontFamily="Georgia,serif" fontSize="44" letterSpacing="-4">FN</text>
                <text x="50" y="87" textAnchor="middle" fill="#641f2a" fontSize="6.2" letterSpacing="2.5">FENNI</text>
              </svg>
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
            subtitle={reviewUrl?.includes("maps.app.goo.gl") ? "Abra o perfil e toque em Avaliar" : reviewUrl ? "Conte sua experiência" : "Avaliações em preparação"}
            symbol="☆"
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
              symbol="◉"
              href={whatsapp}
            />
            <AccessCard
              title="Instagram"
              subtitle={instagram ? "Novidades, armações e inspirações" : "Perfil em preparação"}
              symbol="◎"
              href={instagram}
            />
            <AccessCard
              title="Como chegar"
              subtitle={maps ? "Ver a localização no Google Maps" : "Localização em preparação"}
              symbol="⌖"
              href={maps}
            />
            <AccessCard
              title="Catálogo de produtos"
              subtitle={business.services.length ? "Conheça nossos produtos" : "Catálogo em preparação"}
              symbol="▦"
              href="#catalogo"
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
                src="https://raw.githubusercontent.com/alyssonsilvacorp/otica-fenni-vitrine/main/public/images/store/loja-interior-fenni.jpg"
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
          <div className={styles.paymentIcon} aria-hidden="true">◇</div>
          <div className={styles.paymentContent}>
            <span className={styles.eyebrow}>PAGAMENTO</span>
            <h2 id="fenni-pix">Pagamento por Pix</h2>
            {pixValue ? (
              <>
                {typeof receiver === "string" && receiver.trim() && <p>Recebedor: {receiver}</p>}
                <div className={styles.pixWrapper}>
                  <PixCopy value={pixValue} label={typeof copyPaste === "string" && copyPaste.trim() ? "Pix Copia e Cola" : "Chave Pix"} />
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
