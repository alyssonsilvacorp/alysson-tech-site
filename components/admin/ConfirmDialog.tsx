"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck, X } from "lucide-react";
import styles from "./ConfirmDialog.module.css";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  context?: string;
  warning?: string;
  busy?: boolean;
  tone?: "danger" | "success" | "neutral";
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open, title, description, context, warning, confirmLabel,
  cancelLabel = "Cancelar", busy = false, tone = "neutral", error,
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousRef.current = document.activeElement as HTMLElement | null;
    const focus = window.requestAnimationFrame(() => cancelRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) { event.preventDefault(); onCancel(); }
      if (event.key !== "Tab") return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(focus);
      document.removeEventListener("keydown", onKey);
      previousRef.current?.focus();
    };
  }, [open, busy, onCancel]);

  if (!open) return null;
  const Icon = tone === "danger" ? AlertTriangle : tone === "success" ? CheckCircle2 : ShieldCheck;
  return (
    <div className={styles.backdrop} onMouseDown={(e) => {
      if (e.target === e.currentTarget && !busy) onCancel();
    }}>
      <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="at-dialog-title"
        aria-describedby="at-dialog-description" className={styles.dialog}>
        <div className={styles.heading}>
          <span className={tone === "danger" ? styles.iconDanger : styles.icon}>
            <Icon size={23} aria-hidden="true" />
          </span>
          <button type="button" className={styles.close} aria-label="Fechar confirmação"
            onClick={onCancel} disabled={busy}><X size={18}/></button>
        </div>
        <p className={styles.eyebrow}>ALYSSON TECH / CONFIRMAÇÃO</p>
        <h2 id="at-dialog-title">{title}</h2>
        <p id="at-dialog-description" className={styles.description}>{description}</p>
        {context && <div className={styles.context}>{context}</div>}
        {warning && <p className={styles.warning}><AlertTriangle size={15} aria-hidden="true"/>{warning}</p>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" ref={cancelRef} className={styles.cancel} onClick={onCancel}
            disabled={busy}>{cancelLabel}</button>
          <button type="button" className={tone === "danger" ? styles.danger : styles.confirm}
            onClick={onConfirm} disabled={busy} aria-busy={busy}>
            {busy ? "Processando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
