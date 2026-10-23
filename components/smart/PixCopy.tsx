"use client";

import { useState } from "react";
import styles from "../../app/p/[slug]/portal.module.css";

export default function PixCopy({
  value,
  copyValue,
  label,
}: {
  value: string;
  copyValue?: string;
  label: string;
}) {
  const [feedback, setFeedback] = useState("");

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      setFeedback("Copiado! Confira os dados do recebedor no seu banco.");
    } catch {
      setFeedback("Não foi possível copiar automaticamente. Selecione o texto acima para copiar.");
    }
  }

  return (
    <div className={styles.pixBox}>
      <label className={styles.pixLabel} htmlFor="smart-pix-value">
        {label}
      </label>
      <input
        id="smart-pix-value"
        className={styles.pixInput}
        type="text"
        value={value}
        readOnly
        onFocus={(event) => event.currentTarget.select()}
      />
      <button
        type="button"
        className={styles.pixCopyButton}
        onClick={copyPix}
      >
        Copiar chave Pix
      </button>
      {feedback && (
        <div className={styles.pixFeedback} role="status">
          {feedback}
        </div>
      )}
    </div>
  );
}
