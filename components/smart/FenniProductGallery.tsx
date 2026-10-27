"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle, Play, X } from "lucide-react";
import type { SmartBusinessService } from "../../lib/smart-business";
import styles from "./FenniMultilink.module.css";

type Props = {
  products: SmartBusinessService[];
  contactUrl: string | null;
};

const audiences = ["Todos", "Feminino", "Masculino", "Infantil"] as const;
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function safeMedia(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function consultUrl(base: string | null, product: SmartBusinessService) {
  const url = safeMedia(base);
  if (!url) return null;
  const parsed = new URL(url);
  if (parsed.hostname === "wa.me" || parsed.hostname === "api.whatsapp.com" || parsed.hostname === "web.whatsapp.com") {
    parsed.searchParams.set(
      "text",
      `Olá! Vi a armação ${product.sku ?? product.name} (${product.name}) no catálogo digital da Ótica Fenni e gostaria de confirmar a disponibilidade.`,
    );
  }
  return parsed.href;
}

function priceLabel(product: SmartBusinessService) {
  if (product.price !== null) return brl.format(product.price);
  return product.priceLabel || "Disponibilidade sob consulta";
}

export default function FenniProductGallery({ products, contactUrl }: Props) {
  const [audience, setAudience] = useState<string>("Todos");
  const [frame, setFrame] = useState<string>("Todos");
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [mediaMode, setMediaMode] = useState<"photo" | "video">("photo");
  const closeRef = useRef<HTMLButtonElement>(null);
  const selected = products.find((p) => (p.sku ?? p.name) === selectedSku) ?? null;

  const categoryProducts = useMemo(
    () => products.filter((product) => audience === "Todos" || product.audience === audience),
    [products, audience],
  );
  const frameOptions = useMemo(
    () => ["Todos", ...new Set(categoryProducts.map((p) => p.frameType).filter((value): value is string => Boolean(value)))],
    [categoryProducts],
  );
  const visible = useMemo(
    () => categoryProducts.filter((product) => frame === "Todos" || product.frameType === frame),
    [categoryProducts, frame],
  );
  const selectedIndex = selected ? visible.findIndex((item) => item.sku === selected.sku) : -1;

  useEffect(() => {
    if (!selected) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedSku(null);
    };
    document.addEventListener("keydown", escapeListener);
    return () => {
      document.removeEventListener("keydown", escapeListener);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selectedSku, selected]);

  function selectAudience(next: string) {
    setAudience(next);
    setFrame("Todos");
    setSelectedSku(null);
  }

  function changeItem(step: number) {
    if (selectedIndex < 0 || !visible.length) return;
    const index = (selectedIndex + step + visible.length) % visible.length;
    setMediaMode("photo");
    setSelectedSku(visible[index].sku ?? visible[index].name);
  }

  return (
    <section id="catalogo" className={styles.catalog} aria-labelledby="catalogo-heading">
      <span className={styles.eyebrow}>FENNI · ÓTICA · CATÁLOGO</span>
      <h2 id="catalogo-heading">Coleção Fenni</h2>
      <p className={styles.galleryLead}>
        Explore nossa seleção de armações. Fotos reais da loja, consulta personalizada e modelos sujeitos à disponibilidade.
      </p>

      <div className={styles.galleryFilters} role="group" aria-label="Filtrar por coleção">
        {audiences.map((item) => {
          const count = item === "Todos" ? products.length : products.filter((p) => p.audience === item).length;
          if (count === 0) return null;
          return (
            <button
              key={item}
              type="button"
              className={`${styles.filterPill} ${item === audience ? styles.filterActive : ""}`}
              aria-pressed={item === audience}
              onClick={() => selectAudience(item)}
            >
              {item} <span>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.frameFilters} role="group" aria-label="Filtrar tipo de armação">
        {frameOptions.map((item) => (
          <button
            key={item}
            type="button"
            className={`${styles.typePill} ${item === frame ? styles.typeActive : ""}`}
            aria-pressed={item === frame}
            onClick={() => setFrame(item)}
          >
            {item === "Todos" ? "Todos os tipos" : item}
          </button>
        ))}
      </div>

      <p className={styles.galleryCount} aria-live="polite">
        {visible.length} {visible.length === 1 ? "modelo" : "modelos"} · Disponibilidade sob consulta
      </p>

      <div className={styles.galleryGrid}>
        {visible.map((product) => {
          const image = safeMedia(product.imageUrl);
          const video = safeMedia(product.videoUrl);
          const key = product.sku ?? product.name;
          return (
            <button
              key={key}
              className={styles.productCard}
              type="button"
              onClick={() => { setMediaMode("photo"); setSelectedSku(key); }}
              aria-label={`Ver fotos e detalhes de ${product.name}`}
            >
              <span className={styles.productMedia}>
                {image ? <img src={image} alt={`Armação ${product.name}`} loading="lazy" /> : <span className={styles.productMonogram} aria-hidden="true">FN</span>}
                {video && <span className={styles.videoLabel}><Play size={12} fill="currentColor" /> PRÉVIA</span>}
              </span>
              <span className={styles.productInfo}>
                <span className={styles.productSku}>{product.sku ?? "COLEÇÃO FENNI"}</span>
                <strong>{product.name}</strong>
                <small>{product.frameType ?? "Armação"} · {product.audience ?? "Coleção"}</small>
                <span className={styles.productPrice}>{priceLabel(product)}</span>
              </span>
              <ArrowUpRight size={16} className={styles.productOpenIcon} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className={styles.galleryOverlay}
          onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedSku(null); }}
        >
          <div role="dialog" aria-modal="true" aria-label={`Detalhes de ${selected.name}`} className={styles.galleryDialog}>
            <button ref={closeRef} type="button" className={styles.galleryClose} onClick={() => setSelectedSku(null)} aria-label="Fechar detalhes"><X size={21} /></button>
            <div className={styles.galleryMediaDetail}>
              {mediaMode === "video" && safeMedia(selected.videoUrl) ? (
                <video key={selected.sku} src={safeMedia(selected.videoUrl)!} poster={safeMedia(selected.imageUrl) ?? undefined} muted autoPlay loop playsInline controls preload="metadata" aria-label={`Vídeo curto da armação ${selected.name}`} />
              ) : safeMedia(selected.imageUrl) ? (
                <img src={safeMedia(selected.imageUrl)!} alt={`Armação ${selected.name}`} />
              ) : <span className={styles.productMonogram} aria-hidden="true">FN</span>}
            </div>
            {safeMedia(selected.videoUrl) && (
              <div className={styles.galleryMediaControls} role="group" aria-label="Escolher mídia do produto">
                <button type="button" aria-pressed={mediaMode === "photo"} className={mediaMode === "photo" ? styles.mediaSelected : ""} onClick={() => setMediaMode("photo")}>Foto</button>
                <button type="button" aria-pressed={mediaMode === "video"} className={mediaMode === "video" ? styles.mediaSelected : ""} onClick={() => setMediaMode("video")}><Play size={14} /> Vídeo curto</button>
              </div>
            )}
            <div className={styles.galleryDialogText}>
              <span className={styles.eyebrow}>{selected.sku ?? "ÓTICA FENNI"} · {selected.frameType ?? "ARMAÇÃO"}</span>
              <h3>{selected.name}</h3>
              {selected.description && <p>{selected.description}</p>}
              <strong className={styles.dialogPrice}>{priceLabel(selected)}</strong>
              {contactUrl && (
                <a className={styles.galleryContact} href={consultUrl(contactUrl, selected) ?? contactUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={17} /> Consultar este modelo no WhatsApp <ArrowUpRight size={16} />
                </a>
              )}
              <div className={styles.galleryNavigation}>
                <button type="button" onClick={() => changeItem(-1)} disabled={visible.length < 2}><ChevronLeft size={18} /> Anterior</button>
                <span>{selectedIndex + 1} / {visible.length}</span>
                <button type="button" onClick={() => changeItem(1)} disabled={visible.length < 2}>Próximo <ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
