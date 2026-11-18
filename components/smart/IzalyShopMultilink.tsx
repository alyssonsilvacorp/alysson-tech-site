import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Gem, Headphones, MessageCircle, ShoppingBag, Smartphone, Sparkles, Watch } from "lucide-react";
import styles from "./IzalyShopMultilink.module.css";

export type ShopSlug = "izaly-joias" | "izaly-tech";

const shops = {
  "izaly-joias": {
    name: "IZALY Joias",
    eyebrow: "A ELEGÂNCIA MORA NOS DETALHES",
    title: "O brilho está nos",
    highlight: "detalhes.",
    description: "Joias que acompanham histórias, celebram momentos e expressam quem você é.",
    store: "https://izalyjoias.netlify.app/",
    instagram: "https://www.instagram.com/izalyjoalheria/",
    whatsapp: "5582991749337",
    message: "Olá! Vim pelo espaço digital da IZALY Joias e gostaria de conhecer a coleção.",
    cta: "Explorar a coleção",
  },
  "izaly-tech": {
    name: "IZALY Tech",
    eyebrow: "TECNOLOGIA EM OUTRO NÍVEL",
    title: "O futuro está na",
    highlight: "sua mão.",
    description: "Conecte-se ao que importa. Explore smartphones, eletrônicos e acessórios em um só lugar.",
    store: "https://izalytech.netlify.app/",
    instagram: null,
    whatsapp: "5582999926146",
    message: "Olá! Vim pelo espaço digital da IZALY Tech e gostaria de saber mais sobre os produtos.",
    cta: "Explorar a loja",
  },
} as const;

const jewelryCategories = [
  { title: "Prata 925", detail: "Detalhes que acompanham você", icon: <Gem size={22} strokeWidth={1.4} /> },
  { title: "Folheados a Ouro 18K", detail: "Um toque de luz em cada momento", icon: <Sparkles size={22} strokeWidth={1.4} /> },
  { title: "Presentes especiais", detail: "Escolhas para celebrar histórias", icon: <ShoppingBag size={22} strokeWidth={1.4} /> },
];

const techCategories = [
  { title: "Smartphones", detail: "Tecnologia para a sua rotina", icon: <Smartphone size={22} strokeWidth={1.4} /> },
  { title: "Eletrônicos", detail: "Explore novas possibilidades", icon: <Watch size={22} strokeWidth={1.4} /> },
  { title: "Acessórios", detail: "Complete seu setup", icon: <Headphones size={22} strokeWidth={1.4} /> },
];

function InstagramGlyph() {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none" /></svg>;
}

function JewelArtwork() {
  return (
    <div className={styles.jewelScene} aria-hidden="true">
      <div className={styles.jewelHalo} />
      <div className={styles.jewelOrbit} />
      <div className={styles.jewelOrbitAlt} />
      <svg className={styles.jewelPiece} viewBox="0 0 420 455" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="izj-chain" x1="48" y1="14" x2="370" y2="375" gradientUnits="userSpaceOnUse"><stop stopColor="#fbdeb0" /><stop offset=".23" stopColor="#9e602f" /><stop offset=".52" stopColor="#fff2c9" /><stop offset=".79" stopColor="#b47948" /><stop offset="1" stopColor="#f6d39b" /></linearGradient>
          <linearGradient id="izj-stone" x1="152" y1="230" x2="266" y2="364" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset=".28" stopColor="#d5e0e7" /><stop offset=".59" stopColor="#fffefc" /><stop offset="1" stopColor="#aebfc7" /></linearGradient>
        </defs>
        <path d="M86 18C76 130 127 211 209 250C289 213 338 130 328 18" stroke="url(#izj-chain)" strokeWidth="5" strokeLinecap="round" />
        <path d="M94 17C86 126 132 207 209 240C285 207 330 123 321 17" stroke="#fff6dc" strokeOpacity=".6" strokeWidth="1.5" />
        <path d="M209 220V263" stroke="url(#izj-chain)" strokeWidth="12" strokeLinecap="round"/>
        <path d="M209 246L277 310L209 399L141 310L209 246Z" stroke="url(#izj-chain)" strokeWidth="10" strokeLinejoin="round" />
        <path d="M209 257L265 311L209 380L153 311L209 257Z" fill="url(#izj-stone)" />
        <path d="M153 311H265M209 257L184 311L209 380L234 311L209 257M153 311L209 380L265 311" stroke="#fff" strokeOpacity=".85" strokeWidth="2.2" />
        <path d="M328 116V154M309 135H347M317 123L340 146M340 123L317 146" stroke="#fff8df" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M91 336V354M82 345H100" stroke="#fff8df" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className={styles.jewelSparkOne}>✦</span>
      <span className={styles.jewelSparkTwo}>✧</span>
      <span className={styles.artworkCaption}>LUZ, FORMA & ELEGÂNCIA</span>
    </div>
  );
}

function TechArtwork() {
  return (
    <div className={styles.techScene} aria-hidden="true">
      <div className={styles.techHalo} />
      <div className={styles.techOrbit} />
      <div className={styles.techOrbitAlt} />
      <div className={styles.device}>
        <div className={styles.deviceCamera}/>
        <div className={styles.deviceScreen}>
          <span className={styles.screenWave}/>
          <span className={styles.screenWaveTwo}/>
          <span className={styles.screenBrand}>IZ</span>
          <span className={styles.screenSubtitle}>TECH PREMIUM</span>
        </div>
      </div>
      <span className={styles.techGlass}>● &nbsp; CONNECT TO MORE &nbsp; ↗</span>
      <span className={styles.artworkCaption}>DESIGNED FOR YOUR NEXT MOVE</span>
    </div>
  );
}

function ActionCard({ number, title, description, icon, href, featured = false }: {
  number: string; title: string; description: string; icon: ReactNode; href: string; featured?: boolean;
}) {
  return <a className={styles.actionCard + (featured ? " " + styles.actionFeatured : "")} href={href} target="_blank" rel="noopener noreferrer">
    <span className={styles.actionNumber}>{number} / 03</span>
    <span className={styles.actionIcon}>{icon}</span>
    <span className={styles.actionText}><strong>{title}</strong><small>{description}</small></span>
    <ArrowUpRight className={styles.actionArrow} size={20} strokeWidth={1.6} aria-hidden="true" />
  </a>;
}

export default function IzalyShopMultilink({ slug }: { slug: ShopSlug }) {
  const shop = shops[slug];
  const jewelry = slug === "izaly-joias";
  const wa = "https://wa.me/" + shop.whatsapp + "?text=" + encodeURIComponent(shop.message);
  const categories = jewelry ? jewelryCategories : techCategories;
  return (
    <main className={styles.page} data-brand={slug}>
      <div className={styles.shell}>
        <nav className={styles.nav} aria-label="Navegação da loja">
          <a className={styles.brand} href="#inicio" aria-label={shop.name + ", voltar ao início"}>
            <span className={styles.brandEmblem}><Image className={styles.brandImage} src={jewelry ? "/izaly/joias-logo.webp" : "/izaly/tech-logo.webp"} alt="" width={jewelry ? 45 : 163} height={jewelry ? 45 : 56} priority /></span>
            <span className={styles.brandName}><strong>IZALY</strong><small>{jewelry ? "JOIAS" : "TECH PREMIUM"}</small></span>
          </a>
          <a className={styles.navAction} href={shop.store} target="_blank" rel="noopener noreferrer">LOJA ONLINE <ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
        <header id="inicio" className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>— &nbsp; {shop.eyebrow}</span>
            <span className={styles.heroIndex}>IZ / {jewelry ? "JEWELRY EDITION" : "TECH EDITION"}</span>
            <h1>{shop.title} <em>{shop.highlight}</em></h1>
            <p>{shop.description}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={shop.store} target="_blank" rel="noopener noreferrer">{shop.cta}<ArrowUpRight size={18} /></a>
              <a className={styles.secondaryButton} href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Falar no WhatsApp</a>
            </div>
            <a href="#universo" className={styles.scrollHint}>EXPLORE A EXPERIÊNCIA <ArrowDown size={17}/></a>
          </div>
          <div className={styles.heroArt}>{jewelry ? <JewelArtwork/> : <TechArtwork/>}<div className={styles.officialBadge} aria-hidden="true"><Image src={jewelry ? "/izaly/joias-logo.webp" : "/izaly/tech-logo.webp"} alt="" width={jewelry ? 120 : 163} height={jewelry ? 120 : 56} /></div></div>
          <span className={styles.heroCounter}>01 — 03</span>
        </header>
        <div className={styles.marquee} aria-label={jewelry ? "Elegância em cada detalhe. Prata 925 e folheados a ouro 18K." : "Tecnologia Premium. Smartphones, eletrônicos e acessórios."}>
          <div className={styles.marqueeTrack} aria-hidden="true">
            {[0,1].map(i=><span className={styles.marqueeGroup} key={i}><span>{jewelry ? "ELEGÂNCIA EM CADA DETALHE" : "TECHNOLOGY MEETS STYLE"}</span><span>✦</span><span>{jewelry ? "PRATA 925 · FOLHEADOS A OURO 18K" : "SMARTPHONES · ELETRÔNICOS · ACESSÓRIOS"}</span><span>✦</span></span>)}
          </div>
        </div>
        <section className={styles.section} id="universo">
          <div className={styles.sectionTop}><span>01 / UNIVERSO</span><span>{jewelry ? "UM TOQUE DE ELEGÂNCIA" : "TECHNOLOGY / PREMIUM"}</span></div>
          <div className={styles.sectionHeading}>
            <h2>{jewelry ? <>Descubra peças para <em>cada momento.</em></> : <>Explore um mundo de <em>possibilidades.</em></>}</h2>
            <p>{jewelry ? "A coleção IZALY Joias reúne estilos para quem valoriza o significado de cada detalhe." : "Encontre suas categorias preferidas e consulte os produtos disponíveis na loja."}</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((item,index)=><a key={item.title} href={shop.store} target="_blank" rel="noopener noreferrer" className={styles.categoryCard}>
              <div className={styles.categoryTop}><span>0{index+1} / 03</span><span className={styles.categoryIcon}>{item.icon}</span></div>
              <div><h3>{item.title}</h3><p>{item.detail}</p></div>
              <ArrowUpRight className={styles.categoryArrow} size={20} strokeWidth={1.5} />
            </a>)}
          </div>
          <p className={styles.availabilityNote}>Modelos e disponibilidade sujeitos à consulta na loja virtual.</p>
        </section>
        <section className={styles.statement}>
          <span className={styles.statementEyebrow}>{jewelry ? "MAIS QUE UM ACESSÓRIO" : "MAIS QUE TECNOLOGIA"}</span>
          <h2>{jewelry ? <>Detalhes que deixam <em>marcas.</em></> : <>Sua próxima descoberta <em>começa aqui.</em></>}</h2>
          <p>{jewelry ? "Seu estilo, sua história, seu brilho." : "Escolha com praticidade e fale direto com nossa equipe."}</p>
          <a href={shop.store} target="_blank" rel="noopener noreferrer">ENTRAR NA LOJA <ArrowUpRight size={17}/></a>
        </section>
        <section className={styles.section} id="contato">
          <div className={styles.sectionTop}><span>02 / CONEXÕES</span><span>ACESSO DIRETO</span></div>
          <div className={styles.sectionHeading}><h2>Tudo a um <em>toque.</em></h2><p>Escolha como prefere se conectar com a {shop.name}.</p></div>
          <div className={styles.actionGrid}>
            <ActionCard number="01" featured title={shop.cta} description="Acesse a loja virtual" icon={<ShoppingBag size={22} strokeWidth={1.5}/>} href={shop.store}/>
            <ActionCard number="02" title="WhatsApp" description="Fale com a equipe" icon={<MessageCircle size={22} strokeWidth={1.5}/>} href={wa}/>
            {shop.instagram && <ActionCard number="03" title="Instagram oficial" description="@izalyjoalheria" icon={<InstagramGlyph/>} href={shop.instagram}/>}
          </div>
        </section>
        <footer className={styles.footer}>
          <span className={styles.footerBrand}>IZALY <small>{jewelry ? "JOIAS" : "TECH PREMIUM"}</small></span>
          <span>EXPERIÊNCIA DIGITAL IZALY</span>
          <small>Tecnologia por <a href="https://alyssontech.com.br/" rel="noopener noreferrer">ALYSSON TECH</a></small>
        </footer>
      </div>
    </main>
  );
}
