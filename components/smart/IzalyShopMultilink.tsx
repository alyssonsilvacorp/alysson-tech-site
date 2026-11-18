import { ArrowUpRight, Gem, MessageCircle, ShoppingBag, Smartphone, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./IzalyShopMultilink.module.css";

export type ShopSlug = "izaly-joias" | "izaly-tech";

const shops = {
  "izaly-joias": {
    name: "IZALY Joias",
    category: "JOALHERIA · ELEGÂNCIA",
    eyebrow: "DETALHES QUE CONTAM HISTÓRIAS",
    headline: "A arte de brilhar.",
    description: "Conheça nossa coleção de joias e escolha o detalhe perfeito para o seu momento.",
    site: "https://izalyjoias.netlify.app/",
    instagram: "https://www.instagram.com/izalyjoalheria/",
    whatsapp: "5582991749337",
    message: "Olá! Conheci a IZALY Joias pelo multilink e gostaria de conhecer as peças disponíveis.",
    catalogLabel: "Explorar coleção",
    catalogDetail: "Conheça as joias e novidades",
  },
  "izaly-tech": {
    name: "IZALY Tech",
    category: "TECH PREMIUM · ELETRÔNICOS",
    eyebrow: "TECNOLOGIA QUE ACOMPANHA VOCÊ",
    headline: "Seu próximo upgrade.",
    description: "Celulares, eletrônicos e acessórios com uma experiência de compra moderna e atendimento direto.",
    site: "https://izalytech.netlify.app/",
    instagram: null,
    whatsapp: "5582999926146",
    message: "Olá! Conheci a IZALY Tech pelo multilink e gostaria de saber mais sobre os produtos.",
    catalogLabel: "Explorar produtos",
    catalogDetail: "Acesse nossa loja de tecnologia",
  },
} as const;

function Shortcut({ icon, title, detail, href, featured = false }: {
  icon: ReactNode;
  title: string;
  detail: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <a
      className={[styles.shortcut, featured ? styles.featured : ""].join(" ")}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.shortcutIcon} aria-hidden="true">{icon}</span>
      <span className={styles.shortcutLabel}>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ArrowUpRight size={20} strokeWidth={1.7} aria-hidden="true" />
    </a>
  );
}

export default function IzalyShopMultilink({ slug }: { slug: ShopSlug }) {
  const shop = shops[slug];
  const isJewelry = slug === "izaly-joias";
  const whatsappUrl = "https://wa.me/" + shop.whatsapp + "?text=" + encodeURIComponent(shop.message);

  return (
    <main className={styles.page} data-brand={slug}>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <span><span className={styles.statusDot} /> IZALY / EXCLUSIVO</span>
          <span>ESPAÇO DIGITAL</span>
        </div>

        <header className={styles.hero}>
          <span className={styles.heroOrnament} aria-hidden="true">IZ</span>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>{shop.eyebrow}</span>
            <div className={styles.identity}>
              <span className={styles.monogram} aria-hidden="true">IZ</span>
              <div className={styles.brandText}>
                <span className={styles.category}>{shop.category}</span>
                <h1>{shop.name}</h1>
                {slug === "izaly-tech" && <span className={styles.premium}>TECH PREMIUM</span>}
              </div>
            </div>
            <h2>{shop.headline}</h2>
            <p>{shop.description}</p>
            <div className={styles.heroFoot}>
              <span>{isJewelry ? <Gem size={16} strokeWidth={1.5} /> : <Smartphone size={16} strokeWidth={1.5} />} {isJewelry ? "ESTILO · ELEGÂNCIA" : "TECNOLOGIA · CONFIANÇA"}</span>
              <Sparkles size={19} strokeWidth={1.4} aria-hidden="true" />
            </div>
          </div>
        </header>

        <section className={styles.contactSection} aria-label={"Acessos da " + shop.name}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>TUDO EM UM SÓ LUGAR</span>
            <h2>Escolha por onde começar.</h2>
            <p>Explore a loja, confira novidades ou converse diretamente com nossa equipe.</p>
          </div>

          <div className={styles.shortcutGrid}>
            <Shortcut featured icon={<ShoppingBag size={22} strokeWidth={1.7} />} title={shop.catalogLabel} detail={shop.catalogDetail} href={shop.site} />
            <Shortcut icon={<MessageCircle size={22} strokeWidth={1.7} />} title="Atendimento pelo WhatsApp" detail="Tire dúvidas e consulte disponibilidade" href={whatsappUrl} />
            {shop.instagram && <Shortcut icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" /></svg>} title="Nosso Instagram" detail="Acompanhe as novidades" href={shop.instagram} />}
          </div>
        </section>

        <footer className={styles.footer}>
          <span>{shop.name.toUpperCase()} · EXPERIÊNCIA DIGITAL</span>
          <small>Tecnologia por <a href="https://alyssontech.com.br/" rel="noopener noreferrer">ALYSSON TECH</a></small>
        </footer>
      </div>
    </main>
  );
}
