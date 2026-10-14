/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import {
  getSmartBusiness,
  type SmartBusiness,
  type SmartBusinessAction,
} from "../../../lib/smart-business";
import styles from "./portal.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const actionIcons: Record<string, string> = {
  services: "✂️",
  catalog: "🛍️",
  whatsapp: "💬",
  booking: "📅",
  instagram: "📸",
  location: "📍",
  pix: "💳",
  google_review: "⭐",
  website: "🌐",
};

function getActionHref(
  action: SmartBusinessAction,
  business: SmartBusiness,
) {
  if (action.url) {
    return action.url;
  }

  if (
    action.actionType === "services" ||
    action.actionType === "catalog"
  ) {
    return "#servicos";
  }

  if (
    action.actionType === "whatsapp" &&
    business.whatsappNumber
  ) {
    const phone = business.whatsappNumber.replace(/\D/g, "");

    if (phone) {
      return `https://wa.me/${phone}`;
    }
  }

  if (
    action.actionType === "instagram" &&
    business.instagramUrl
  ) {
    return business.instagramUrl;
  }

  if (
    action.actionType === "location" &&
    business.mapsUrl
  ) {
    return business.mapsUrl;
  }

  return null;
}

function getAccentColor(value: string | null) {
  if (value && /^#[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }

  return "#d4af37";
}

export default async function SmartBusinessPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const business = await getSmartBusiness(slug);

  if (!business) {
    notFound();
  }

  const portalStyle = {
    "--portal-accent": getAccentColor(
      business.accentColor,
    ),
  } as CSSProperties;

  const visibleActions = business.actions
    .map((action) => ({
      action,
      href: getActionHref(action, business),
    }))
    .filter(
      (
        item,
      ): item is {
        action: SmartBusinessAction;
        href: string;
      } => item.href !== null,
    );

  return (
    <main
      className={styles.page}
      style={portalStyle}
    >
      <section className={styles.portal}>
        <header className={styles.header}>
          {business.logoUrl ? (
            <img
              className={styles.logo}
              src={business.logoUrl}
              alt={`Logo ${business.name}`}
            />
          ) : (
            <div
              className={styles.logoPlaceholder}
              aria-hidden="true"
            >
              {business.name
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0] ?? "")
                .join("")
                .toUpperCase()}
            </div>
          )}

          <div className={styles.titleBlock}>
            <p className={styles.eyebrow}>
              {business.category ?? "Negócio local"}
            </p>
            <h1>{business.name}</h1>
            <p className={styles.description}>
              {business.shortDescription ??
                "Tudo o que você precisa em um só lugar."}
            </p>
          </div>
        </header>

        {visibleActions.length > 0 ? (
          <nav
            className={styles.actions}
            aria-label="Acessos rápidos"
          >
            {visibleActions.map(({ action, href }) => {
              const external = href.startsWith("http");

              return (
                <a
                  key={`${action.actionType}-${action.label}`}
                  className={styles.action}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={
                    external
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <span className={styles.actionIcon}>
                    {actionIcons[action.actionType] ?? "↗"}
                  </span>
                  <span>{action.label}</span>
                </a>
              );
            })}
          </nav>
        ) : (
          <div className={styles.emptyState}>
            Os acessos deste estabelecimento estão sendo
            atualizados.
          </div>
        )}

        {business.services.length > 0 && (
          <section
            className={styles.services}
            id="servicos"
          >
            <div className={styles.sectionHeading}>
              <p>Catálogo</p>
              <h2>Serviços e valores</h2>
            </div>

            <div className={styles.serviceList}>
              {business.services.map((service) => {
                const price =
                  service.priceLabel ??
                  (service.price !== null
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(service.price)
                    : null);

                return (
                  <article
                    className={styles.serviceCard}
                    key={`${service.name}-${service.sortOrder}`}
                  >
                    <div>
                      <h3>{service.name}</h3>
                      {service.description && (
                        <p>{service.description}</p>
                      )}
                    </div>

                    {price && (
                      <strong>{price}</strong>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {business.address && (
          <section className={styles.address}>
            <span aria-hidden="true">📍</span>
            <span>{business.address}</span>
          </section>
        )}

        <footer className={styles.footer}>
          <span>Placa Smart</span>
          <strong>Alysson Tech</strong>
        </footer>
      </section>
    </main>
  );
}
