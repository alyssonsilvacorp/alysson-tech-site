/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check,
  CreditCard, Instagram, MapPin, MessageCircle, Star,
} from "lucide-react";
import type { SmartBusiness } from "../../lib/smart-business";
import FenniProductGallery from "./FenniProductGallery";
import PixCopy from "./PixCopy";
import styles from "./FenniMultilink.module.css";

function httpsUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

function whatsappUrl(business: SmartBusiness) {
  const action = business.actions.find(a => a.actionType === "whatsapp");
  const custom = httpsUrl(action?.url);
  if (custom) return custom;
  const number = (business.whatsappNumber ?? "").replace(/\D/g, "");
  if (number.length < 10 || number.length > 13) return null;
  return "https://wa.me/" + number +
    "?text=" + encodeURIComponent("Olá! Conheci a Ótica Fenni pelo cartão digital e gostaria de informações.");
}

function AccessCard({
  title, description, icon, href, featured = false,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href: string | null;
  featured?: boolean;
}) {
  const content = (
    <>
      <span className={styles.accessIcon}>{icon}</span>
      <span className={styles.accessCopy}>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <ArrowUpRight className={styles.accessArrow} size={19} aria-hidden="true" />
    </>
  );
  const className = featured ? styles.accessFeatured : styles.accessCard;
  if (!href) {
    return (
      <div className={className + " " + styles.unavailable} aria-disabled="true">
        {content}
      </div>
    );
  }
  const external = !href.startsWith("#");
  return (
    <a
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

export default function FenniMultilink({ business }: { business: SmartBusiness }) {
  const google = business.actions.find(a => a.actionType === "google_review");
  const review = httpsUrl(google?.url);
  const reviewIsMap = Boolean(review && (
    review.includes("maps.app.goo.gl") || review.includes("/maps/")
  ));
  const whatsapp = whatsappUrl(business);
  const instagram = httpsUrl(business.instagramUrl)
    ?? httpsUrl(business.actions.find(a => a.actionType === "instagram")?.url);
  const location = httpsUrl(business.mapsUrl)
    ?? httpsUrl(business.actions.find(a => a.actionType === "location")?.url);

  const pix = business.actions.find(a => a.actionType === "pix");
  const copyPaste = pix?.config["pix_copia_e_cola"];
  const key = pix?.config["pix_key"];
  const pixValue = typeof copyPaste === "string" && copyPaste.trim()
    ? copyPaste.trim()
    : typeof key === "string" && key.trim() ? key.trim() : null;
  const pixReceiver = pix?.config["receiver_name"];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a href="#inicio" className={styles.brand} aria-label="Ótica Fenni, voltar ao início">
            <span className={styles.brandMark}>
              <img src="/fenni/logo-oficial-instagram.jpg" alt="Logo oficial FN da Ótica Fenni" width="76" height="76" />
            </span>
            <span className={styles.brandWords}>
              <strong>Ótica Fenni</strong>
              <small>SEU ESPAÇO DIGITAL</small>
            </span>
          </a>
          <div className={styles.headerLocation}><MapPin size={14} aria-hidden="true" /> Tabuleiro dos Martins, Maceió</div>
        </header>

        <div id="inicio" className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><span className={styles.tinyLine} /> BEM-VINDO À FENNI</span>
            <h1>Seu novo olhar <em>começa aqui.</em></h1>
            <p>
              Mais perto de você, dentro e fora da nossa loja.
              Conheça nossos canais, encontre o que procura e compartilhe sua experiência.
            </p>
            <div className={styles.heroActions}>
              <a href="#acessos" className={styles.heroPrimary}>Conhecer a Fenni <ArrowRight size={17} /></a>
              <a href="#catalogo" className={styles.heroSecondary}>Explorar catálogo <ArrowDown size={16} /></a>
            </div>
            <div className={styles.heroTags}>
              <span><Check size={13} /> Loja física</span>
              <span><Check size={13} /> Atendimento personalizado</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <img src="/fenni/loja-fenni.jpg" alt="Atendimento no interior da Ótica Fenni" width="820" height="1000" fetchPriority="high" />
            <div className={styles.imageCaption}>
              <span className={styles.imageCaptionDot} />
              NOSSA LOJA · MACEIÓ, AL
            </div>
          </div>
        </div>

        <section id="acessos" className={styles.actionSection} aria-labelledby="acessos-titulo">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>TUDO EM UM SÓ LUGAR</span>
              <h2 id="acessos-titulo">Como podemos ajudar?</h2>
            </div>
            <p>Um toque e você chega aonde precisa.</p>
          </div>
          <div className={styles.accessGrid}>
            <AccessCard
              featured
              title="Avaliar no Google"
              description={!review ? "Avaliação em preparação" : reviewIsMap
                ? "Abra o perfil e selecione Avaliar"
                : "Compartilhe sua experiência com a Fenni"}
              icon={<Star size={24} strokeWidth={1.7} />}
              href={review}
            />
            <AccessCard
              featured
              title="Falar no WhatsApp"
              description="Dúvidas, orçamento e atendimento"
              icon={<MessageCircle size={23} strokeWidth={1.7} />}
              href={whatsapp}
            />
            <AccessCard
              title="Instagram"
              description="Novidades e inspirações"
              icon={<Instagram size={23} strokeWidth={1.7} />}
              href={instagram}
            />
            <AccessCard
              title="Como chegar"
              description="Encontre nossa loja no mapa"
              icon={<MapPin size={23} strokeWidth={1.7} />}
              href={location}
            />
            <AccessCard
              title="Catálogo de armações"
              description={business.services.length ? "Conheça nossos modelos" : "Nossa vitrine está chegando"}
              icon={<BookOpen size={23} strokeWidth={1.7} />}
              href="#catalogo"
            />
          </div>
        </section>

        {business.services.length > 0 ? (
          <FenniProductGallery products={business.services} contactUrl={whatsapp} />
        ) : (
          <section id="catalogo" className={styles.catalogTeaser} aria-labelledby="catalogo-titulo">
            <div className={styles.catalogCopy}>
              <span className={styles.eyebrow}>A VITRINE FENNI</span>
              <h2 id="catalogo-titulo">Seu estilo merece <em>um novo olhar.</em></h2>
              <p>
                Estamos preparando um catálogo digital com fotos reais das armações.
                Em seguida, cada modelo poderá ganhar uma prévia em vídeo de poucos segundos.
              </p>
              <span className={styles.catalogStatus}>CATÁLOGO EM PREPARAÇÃO</span>
              {whatsapp && (
                <a className={styles.catalogAction} href={whatsapp} target="_blank" rel="noopener noreferrer">
                  Conheça as opções pelo WhatsApp <ArrowUpRight size={17} />
                </a>
              )}
            </div>
            <div className={styles.catalogVisual} aria-hidden="true">
              <div className={styles.catalogMonogram}>FN</div>
              <span>ÓTICA FENNI</span>
              <small>ARMAÇÕES · ESTILO · CUIDADO</small>
            </div>
          </section>
        )}

        <section className={styles.aboutStrip} aria-label="Atendimento da Ótica Fenni">
          <div><span className={styles.aboutNumber}>01</span><strong>Atendimento de perto</strong><p>Mais atenção na escolha dos seus óculos.</p></div>
          <div><span className={styles.aboutNumber}>02</span><strong>Visite nossa loja</strong><p>Tabuleiro dos Martins, Maceió.</p></div>
          <div><span className={styles.aboutNumber}>03</span><strong>Atendimento em domicílio</strong><p>Consulte disponibilidade e agendamento.</p></div>
        </section>

        <section className={styles.payment} aria-label="Pagamento por Pix">
          <div className={styles.paymentHeader}>
            <span className={styles.paymentIcon}><CreditCard size={22} strokeWidth={1.5} /></span>
            <div>
              <span className={styles.eyebrow}>COMODIDADE</span>
              <h2>Pagamento via Pix</h2>
              <p>{pixValue ? "Pagamento disponível." : "Disponível após confirmação dos dados da loja."}</p>
            </div>
          </div>
          {pixValue && (
            <div className={styles.pixCopy}>
              {typeof pixReceiver === "string" && pixReceiver.trim() && <p>Recebedor: {pixReceiver}</p>}
              <PixCopy value={pixValue} label={typeof copyPaste === "string" && copyPaste.trim() ? "Pix Copia e Cola" : "Chave Pix"} />
              <small>Confirme o nome do recebedor no aplicativo do seu banco.</small>
            </div>
          )}
        </section>

        <footer className={styles.footer}>
          <div>
            <strong>Ótica Fenni</strong>
            <span>Um novo olhar começa aqui.</span>
          </div>
          <div className={styles.footerRight}>
            <span>Rua Pedrosa, 294-C · Maceió/AL</span>
            <small>Tecnologia por <strong>ALYSSON TECH</strong></small>
          </div>
        </footer>
      </div>
    </main>
  );
}
