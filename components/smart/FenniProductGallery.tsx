"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ArrowUpRight, MessageCircle, Play, X } from "lucide-react";
import type { SmartBusinessService } from "../../lib/smart-business";
import styles from "./FenniMultilink.module.css";

type Props = {
  products: SmartBusinessService[];
  contactUrl: string | null;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function validMediaUrl(raw: string | null) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function productContactUrl(base: string | null, productName: string) {
  if (!base) return null;
  try {
    const url = new URL(base);
    if (url.hostname === "wa.me" || url.hostname === "api.whatsapp.com") {
      url.searchParams.set("text", `Olá! Vi o modelo ${productName} no catálogo digital da Ótica Fenni e gostaria de saber mais.`);
    }
    return url.href;
  } catch {
    return null;
  }
}

export default function FenniProductGallery({ products, contactUrl }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected !== null ? products[selected] : null;

  useEffect(() => {
    if (selected === null) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", closeOnEscape);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = oldOverflow;
    };
  }, [selected]);

  return (
    <section id="catalogo" className={styles.catalog} aria-labelledby="catalogo-heading">
      <span className={styles.eyebrow}>COLEÇÃO FENNI</span>
      <h2 id="catalogo-heading">Encontre seu novo olhar.</h2>
      <p className={styles.galleryLead}>
        Uma seleção de armações para conhecer com calma. Toque em um modelo para ver os detalhes.
      </p>
      <div className={styles.galleryGrid}>
        {products.map((product, index) => {
          const image = validMediaUrl(product.imageUrl);
          const video = validMediaUrl(product.videoUrl);
          return (
            <button
              key={`${product.name}-${index}`}
              className={styles.productCard}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Visualizar ${product.name}`}
            >
              <span className={styles.productMedia}>
                {image ? <img src={image} alt="" loading="lazy" /> : <span className={styles.productMonogram} aria-hidden="true">FN</span>}
                {video && <span className={styles.videoLabel}><Play size={12} fill="currentColor" /> PRÉVIA</span>}
              </span>
              <span className={styles.productInfo}>
                <strong>{product.name}</strong>
                <small>{product.description ?? "Veja os detalhes da armação"}</small>
                <span className={styles.productPrice}>
                  {product.priceLabel ?? (product.price !== null ? currency.format(product.price) : "Consultar disponibilidade")}
                </span>
              </span>
              <ArrowUpRight size={17} className={styles.productOpenIcon} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {current && (
        <div className={styles.galleryOverlay} role="presentation">
          <div role="dialog" aria-modal="true" aria-label={`Detalhes de ${current.name}`} className={styles.galleryDialog}>
            <button type="button" className={styles.galleryClose} onClick={() => setSelected(null)} aria-label="Fechar visualização"><X size={21} /></button>
            <div className={styles.galleryMediaDetail}>
              {validMediaUrl(current.videoUrl) ? (
                <video
                  key={current.videoUrl}
                  src={validMediaUrl(current.videoUrl)!}
                  poster={validMediaUrl(current.imageUrl) ?? undefined}
                  muted
                  autoPlay
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  aria-label={`Vídeo do modelo ${current.name}`}
                />
              ) : validMediaUrl(current.imageUrl) ? (
                <img src={validMediaUrl(current.imageUrl)!} alt={current.name} />
              ) : (
                <span className={styles.productMonogram} aria-hidden="true">FN</span>
              )}
            </div>
            <div className={styles.galleryDialogText}>
              <span className={styles.eyebrow}>ÓTICA FENNI</span>
              <h3>{current.name}</h3>
              {current.description && <p>{current.description}</p>}
              <strong className={styles.dialogPrice}>
                {current.priceLabel ?? (current.price !== null ? currency.format(current.price) : "Consulte valores")}
              </strong>
              {contactUrl && (
                <a className={styles.galleryContact} href={productContactUrl(contactUrl, current.name) ?? contactUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={17} /> Perguntar sobre este modelo <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
