/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  getSmartBusiness,
  type SmartBusiness,
  type SmartBusinessAction,
} from "../../../lib/smart-business";
import PixCopy from "../../../components/smart/PixCopy";
import FenniMultilink from "../../../components/smart/FenniMultilink";
import styles from "./portal.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "otica-fenni") {
    return {
      title: "Ótica Fenni | Um novo olhar começa aqui",
      description: "Seu espaço digital da Ótica Fenni em Maceió. Avaliações Google, WhatsApp, localização e catálogo de armações.",
      alternates: { canonical: "/p/otica-fenni" },
      icons: { icon: "/fenni/logo-oficial-instagram.jpg" },
      openGraph: {
        title: "Ótica Fenni — Um novo olhar começa aqui",
        description: "Conheça a Ótica Fenni, avalie nossa loja e entre em contato com a equipe.",
        locale: "pt_BR",
        type: "website",
        images: [{ url: "/fenni/loja-fenni.jpg", width: 800, height: 1000, alt: "Ótica Fenni em Maceió" }],
      },
    };
  }
  return { title: "Menu digital" };
}

const iconMap: Record<string, string> = {
  services: "✂",
  catalog: "▦",
  whatsapp: "◉",
  booking: "▢",
  instagram: "◎",
  location: "⌖",
  pix: "◇",
  google_review: "☆",
  website: "↗",
  ifood: "◈",
};

const labels: Record<string, string> = {
  barbearia: "BARBEARIA",
  otica: "ÓTICA",
  restaurante: "RESTAURANTE",
  lanchonete: "LANCHONETE",
  loja: "LOJA",
  clinica: "CLÍNICA",
  salao: "SALÃO",
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function safeUrl(raw: string | null | undefined) {
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

function whatsappLink(phone: string | null, businessName: string) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return null;
  const text = encodeURIComponent(
    `Olá! Acessei o menu digital da ${businessName} e gostaria de informações sobre o atendimento.`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}

function actionUrl(action: SmartBusinessAction, business: SmartBusiness) {
  if (action.actionType === "pix") return null;
  if (action.actionType === "services" || action.actionType === "catalog") {
    return business.services.length ? "#servicos" : null;
  }
  if (action.actionType === "whatsapp" || action.actionType === "booking") {
    return safeUrl(action.url) ?? whatsappLink(business.whatsappNumber, business.name);
  }
  if (action.actionType === "instagram") {
    return safeUrl(action.url) ?? safeUrl(business.instagramUrl);
  }
  if (action.actionType === "location") {
    return safeUrl(action.url) ?? safeUrl(business.mapsUrl);
  }
  return safeUrl(action.url);
}

function actionTitle(type: string) {
  if (type === "whatsapp") return "Falar no WhatsApp";
  if (type === "booking") return "Agendar horário";
  if (type === "instagram") return "Instagram";
  if (type === "location") return "Como chegar";
  if (type === "services" || type === "catalog") return "Serviços e valores";
  if (type === "google_review") return "Avaliar atendimento";
  return "Acessar";
}

function sectionHeading(eyebrow: string, title: string, intro?: string) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.sectionEyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function ActionLink({
  icon,
  label,
  detail,
  href,
  featured,
}: {
  icon: string;
  label: string;
  detail: string;
  href: string | null;
  featured?: boolean;
}) {
  const content = (
    <>
      <span aria-hidden="true" className={styles.actionIcon}>{icon}</span>
      <span className={styles.actionText}>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <span aria-hidden="true" className={styles.actionArrow}>
        {href ? "↗" : "—"}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className={`${styles.actionCard} ${styles.unavailable}`}>
        {content}
      </div>
    );
  }

  return (
    <a
      className={`${styles.actionCard} ${featured ? styles.featuredAction : ""}`}
      href={href}
      target={href.startsWith("https:") ? "_blank" : undefined}
      rel={href.startsWith("https:") ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

function InfoTile({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className={styles.infoTile}>
      <span aria-hidden="true">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </article>
  );
}

function getPixData(actions: SmartBusinessAction[]) {
  const action = actions.find(a => a.actionType === "pix");
  if (!action) return null;

  const code = action.config["pix_copia_e_cola"];
  const key = action.config["pix_key"];
  const receiver = action.config["receiver_name"];
  const value =
    typeof code === "string" && code.trim() ? code.trim() :
    typeof key === "string" && key.trim() ? key.trim() : null;
  if (!value) return null;

  return {
    value,
    label: typeof code === "string" && code.trim()
      ? "Pix Copia e Cola"
      : "Chave Pix",
    receiver: typeof receiver === "string" ? receiver : null,
  };
}

export default async function SmartBusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getSmartBusiness(slug);

  if (!business) notFound();

  if (business.slug === "otica-fenni") {
    return <FenniMultilink business={business} />;
  }

  const accent = business.accentColor && /^#[0-9a-fA-F]{6}$/.test(business.accentColor)
    ? business.accentColor
    : "#D7AE68";

  const theme = { "--portal-accent": accent } as CSSProperties;
  const initials = business.name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0] ?? "")
    .join("")
    .toUpperCase();

  const bookingAction = business.actions.find(a =>
    a.actionType === "booking" || a.actionType === "whatsapp");
  const bookingUrl = bookingAction
    ? actionUrl(bookingAction, business)
    : whatsappLink(business.whatsappNumber, business.name);

  const instagramAction = business.actions.find(a => a.actionType === "instagram");
  const instagramUrl = instagramAction
    ? actionUrl(instagramAction, business)
    : safeUrl(business.instagramUrl);

  const locationAction = business.actions.find(a => a.actionType === "location");
  const locationUrl = locationAction
    ? actionUrl(locationAction, business)
    : safeUrl(business.mapsUrl);

  const pixData = getPixData(business.actions);
  const reviewAction = business.actions.find(a => a.actionType === "google_review");
  const reviewUrl = reviewAction ? actionUrl(reviewAction, business) : null;
  const isOptica = business.category === "otica";
  const categoryLabel = labels[business.category?.toLowerCase() ?? ""] ??
    (business.category ?? "NEGÓCIO LOCAL").toUpperCase();

  const hasExtraActions = business.actions.some(a =>
    !["booking", "whatsapp", "instagram", "location", "services", "catalog", "pix", "google_review"].includes(a.actionType) &&
    actionUrl(a, business));

  return (
    <main className={styles.page} style={theme}>
      <div className={styles.portal}>
        <div className={styles.topBar}>
          <span className={styles.dot} />
          MENU DIGITAL
          <span className={styles.topBarLine} />
          <span>ACESSO RÁPIDO</span>
        </div>

        <header className={styles.hero}>
          {business.coverUrl && (
            <div className={styles.cover}>
              <img src={business.coverUrl} alt="" />
            </div>
          )}
          <div className={styles.heroShape} aria-hidden="true">{initials.slice(0, 1)}</div>

          <div className={styles.identity}>
            {business.logoUrl ? (
              <img className={styles.logo} src={business.logoUrl} alt={`Logo da ${business.name}`} />
            ) : (
              <div className={styles.logoPlaceholder} aria-hidden="true">{initials}</div>
            )}
            <span className={styles.category}>{categoryLabel}</span>
            <h1>{business.name}</h1>
            <p>{business.shortDescription ?? "Tudo o que você precisa em um só lugar."}</p>
          </div>
          <div className={styles.heroBottom}>
            <span>SEU ESPAÇO DIGITAL</span>
            <span aria-hidden="true">✦</span>
          </div>
        </header>

        <div className={styles.welcome}>
          <div>
            <span className={styles.kicker}>BEM-VINDO</span>
            <h2>Como podemos ajudar?</h2>
            <p>Escolha o que deseja fazer e acesse direto pelo celular.</p>
          </div>
        </div>

        <div className={styles.primaryActions}>
          <ActionLink
            featured
            icon={isOptica ? "▦" : "✂"}
            label={isOptica ? "Catálogo de produtos" : "Serviços e valores"}
            detail={business.services.length ? "Conheça nossos serviços" : "Catálogo em preparação"}
            href={business.services.length ? "#servicos" : null}
          />
          <ActionLink
            featured={Boolean(bookingUrl)}
            icon="◉"
            label={bookingAction?.actionType === "booking" ? "Agendar horário" : bookingAction?.label ?? "Falar no WhatsApp"}
            detail={bookingUrl ? "Atendimento pelo WhatsApp" : "Contato em configuração"}
            href={bookingUrl}
          />
        </div>

        <section className={styles.section} id="servicos">
          {sectionHeading(
            "01 / CATÁLOGO",
            business.category === "otica" ? "Produtos e opções" : "Nossos serviços",
            business.category === "otica"
              ? "Confira as opções disponibilizadas pelo estabelecimento."
              : "Escolha o serviço ideal para você.",
          )}

          {business.services.length > 0 ? (
            <div className={styles.serviceGrid}>
              {business.services.map((service, index) => (
                <article className={styles.serviceCard} key={`${service.name}-${index}`}>
                  {service.imageUrl && (
                    <img className={styles.servicePhoto} src={service.imageUrl} alt={service.name} />
                  )}
                  <div className={styles.serviceBody}>
                    <div className={styles.serviceIndex}>{String(index + 1).padStart(2, "0")}</div>
                    <div className={styles.serviceDetail}>
                      <h3>{service.name}</h3>
                      {service.description && <p>{service.description}</p>}
                    </div>
                    {(service.priceLabel || service.price !== null) && (
                      <strong className={styles.servicePrice}>
                        {service.priceLabel ?? currency.format(service.price!)}
                      </strong>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.preparing}>
              <span className={styles.preparingIcon} aria-hidden="true">{isOptica ? "▦" : "✂"}</span>
              <div>
                <strong>Catálogo em preparação</strong>
                <p>A relação de serviços, descrições e preços será disponibilizada após confirmação do estabelecimento.</p>
              </div>
            </div>
          )}
        </section>

        <section className={styles.section}>
          {sectionHeading(
            "02 / CONTATO",
            "Fale com a gente",
            "Tudo para facilitar seu atendimento.",
          )}
          <div className={styles.secondaryActions}>
            <ActionLink
              icon="◉"
              label="WhatsApp"
              detail={bookingUrl ? "Dúvidas e informações" : "Contato em preparação"}
              href={bookingUrl}
            />
            <ActionLink
              icon="◎"
              label="Instagram"
              detail={instagramUrl ? "Veja nossos conteúdos" : "Perfil em preparação"}
              href={instagramUrl}
            />
            <ActionLink
              icon="⌖"
              label="Localização"
              detail={locationUrl ? "Abrir no mapa" : "Endereço em preparação"}
              href={locationUrl}
            />
            <ActionLink
              icon="☆"
              label="Avaliar no Google"
              detail={reviewUrl ? "Conte sua experiência" : "Link de avaliação em preparação"}
              href={reviewUrl}
            />
          </div>
        </section>

        <section className={styles.section}>
          {sectionHeading("03 / PAGAMENTO", "Pague com Pix", "Praticidade na hora de pagar.")}
          <div className={styles.payment}>
            <div className={styles.paymentHeader}>
              <span aria-hidden="true">◇</span>
              <div>
                <strong>Pagamento por Pix</strong>
                <small>{pixData ? pixData.label : "Configuração pendente"}</small>
              </div>
            </div>
            {pixData ? (
              <>
                {pixData.receiver && <p className={styles.receiver}>Recebedor: {pixData.receiver}</p>}
                <PixCopy value={pixData.value} label={pixData.label} />
                <p className={styles.note}>Confira o nome do recebedor no aplicativo do banco antes de confirmar.</p>
              </>
            ) : (
              <p className={styles.pendingPix}>A opção de Pix aparecerá aqui quando os dados de pagamento forem confirmados pelo estabelecimento.</p>
            )}
          </div>
        </section>

        {hasExtraActions && (
          <section className={styles.section}>
            {sectionHeading("04 / MAIS ACESSOS", "Outros canais")}
            <div className={styles.secondaryActions}>
              {business.actions
                .filter(a => !["booking", "whatsapp", "instagram", "location", "services", "catalog", "pix", "google_review"].includes(a.actionType))
                .map(a => ({ action: a, href: actionUrl(a, business) }))
                .filter((item): item is { action: SmartBusinessAction; href: string } => item.href !== null)
                .map(({ action, href }) => (
                  <ActionLink
                    key={`${action.actionType}-${action.sortOrder}`}
                    icon={iconMap[action.actionType] ?? "↗"}
                    label={action.label}
                    detail={actionTitle(action.actionType)}
                    href={href}
                  />
                ))}
            </div>
          </section>
        )}

        {business.address && (
          <div className={styles.address}>
            <span aria-hidden="true">⌖</span>
            <span>{business.address}</span>
          </div>
        )}

        <footer className={styles.footer}>
          <span>MENU DIGITAL EXCLUSIVO</span>
          <p>Tecnologia desenvolvida por <strong>ALYSSON TECH</strong></p>
        </footer>
      </div>
    </main>
  );
}
