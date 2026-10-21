/* eslint-disable @next/next/no-img-element */
import type { SmartBusiness } from "../../lib/smart-business";
import PixCopy from "./PixCopy";
import styles from "./FenniMultilink.module.css";

const originalLogo = "https://raw.githubusercontent.com/alyssonsilvacorp/otica-fenni-vitrine/main/public/images/brand/logo-fenni.png";

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
      <span className={styles.actionArrow} aria-hidden="true">{href ? "↗" : "—"}</span>
    </>
  );
  const className = `${styles.accessCard} ${variant === "featured" ? styles.featured : ""} ${!href ? styles.disabled : ""}`;
  if (!href) return <div className={className} aria-disabled="true">{content}</div>;
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
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
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topline}>
          <span className={styles.smallBrand}>FENNI <span>ÓTICA</span></span>
          <span className={styles.toplineDetail}>SEU ESPAÇO DIGITAL</span>
        </div>

        <header className={styles.hero}>
          <span aria-hidden="true" className={styles.heroRule} />
          <div className={styles.identity}>
            <div className={styles.logoFrame}>
              <span aria-hidden="true" className={styles.logoFallback}>FN</span>
              <img src={business.logoUrl ?? originalLogo} alt="Marca da Ótica Fenni" />
            </div>
            <span className={styles.category}>ÓTICA FENNI · MACEIÓ</span>
          </div>
          <h1>Um novo olhar <em>começa aqui.</em></h1>
          <p>Seu acesso rápido à Fenni. Avalie nosso atendimento, fale com a equipe e encontre tudo em um só lugar.</p>
          <div className={styles.heroFooter}>
            <span>ATENDIMENTO PERSONALIZADO</span>
            <span className={styles.star} aria-hidden="true">✦</span>
          </div>
        </header>

        <section className={styles.actions} aria-labelledby="fenni-links">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>ACESSO RÁPIDO</span>
            <h2 id="fenni-links">Como podemos ajudar?</h2>
            <p>Escolha uma opção para continuar.</p>
          </div>
          <div className={styles.actionList}>
            <AccessCard
              title="Avaliar no Google"
              subtitle={reviewUrl ? "Sua opinião faz a diferença" : "Avaliação em preparação"}
              symbol="☆"
              href={reviewUrl}
              variant="featured"
            />
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
              href={business.services.length ? "#catalogo" : null}
            />
          </div>
        </section>

        {business.services.length > 0 && (
          <section id="catalogo" className={styles.catalog}>
            <span className={styles.eyebrow}>COLEÇÃO FENNI</span>
            <h2>Produtos e opções</h2>
            <div className={styles.catalogList}>
              {business.services.map((item, index) => (
                <div className={styles.catalogItem} key={`${item.name}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  {(item.priceLabel || item.price !== null) && (
                    <span>{item.priceLabel ?? brl.format(item.price!)}</span>
                  )}
                </div>
              ))}
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
