"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../../components/admin/AdminShell";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import styles from "./plates.module.css";

type ReviewPlate = {
  code: string;
  business_name: string | null;
  destination_url: string | null;
  status: "available" | "active" | "disabled";
  activated_at: string | null;
  created_at: string;
  updated_at: string;
};

type DrawerMode = "activate" | "edit";

type LoadPlatesResult =
  | {
      status: "ok";
      plates: ReviewPlate[];
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "error";
      message: string;
    };

async function fetchReviewPlates(): Promise<LoadPlatesResult> {
  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();

  if (!session) {
    return {
      status: "unauthorized",
    };
  }

  const { data, error } =
    await supabaseBrowser.rpc("list_review_plates");

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  return {
    status: "ok",
    plates: (data ?? []) as ReviewPlate[],
  };
}

export default function ReviewPlatesAdminPage() {
  const router = useRouter();

  const [plates, setPlates] =
    useState<ReviewPlate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [selectedPlate, setSelectedPlate] =
    useState<ReviewPlate | null>(null);

  const [drawerMode, setDrawerMode] =
    useState<DrawerMode | null>(null);

  const [businessName, setBusinessName] =
    useState("");

  const [destinationUrl, setDestinationUrl] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [drawerError, setDrawerError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const result =
        await fetchReviewPlates();

      if (cancelled) {
        return;
      }

      if (result.status === "unauthorized") {
        router.replace("/admin/login");
        return;
      }

      if (result.status === "error") {
        setErrorMessage(result.message);
        setLoading(false);
        return;
      }

      setErrorMessage("");
      setPlates(result.plates);
      setLoading(false);
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!selectedPlate) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !saving
      ) {
        setSelectedPlate(null);
        setDrawerMode(null);
        setBusinessName("");
        setDestinationUrl("");
        setDrawerError("");
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [selectedPlate, saving]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [successMessage]);

  const summary = useMemo(() => {
    const active =
      plates.filter(
        (plate) =>
          plate.status === "active",
      ).length;

    const available =
      plates.filter(
        (plate) =>
          plate.status === "available",
      ).length;

    return {
      active,
      available,
    };
  }, [plates]);

  async function refreshPlates() {
    const result =
      await fetchReviewPlates();

    if (result.status === "unauthorized") {
      router.replace("/admin/login");
      return;
    }

    if (result.status === "error") {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage("");
    setPlates(result.plates);
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  function translateStatus(
    status: ReviewPlate["status"],
  ) {
    if (status === "active") {
      return "ATIVA";
    }

    if (status === "available") {
      return "DISPONÍVEL";
    }

    return "DESATIVADA";
  }

  function openActivationDrawer(
    plate: ReviewPlate,
  ) {
    setSuccessMessage("");
    setSelectedPlate(plate);
    setDrawerMode("activate");
    setBusinessName("");
    setDestinationUrl("");
    setDrawerError("");
  }

  function openEditDrawer(
    plate: ReviewPlate,
  ) {
    setSuccessMessage("");
    setSelectedPlate(plate);
    setDrawerMode("edit");

    setBusinessName(
      plate.business_name ?? "",
    );

    setDestinationUrl(
      plate.destination_url ?? "",
    );

    setDrawerError("");
  }

  function closeDrawer() {
    if (saving) {
      return;
    }

    setSelectedPlate(null);
    setDrawerMode(null);
    setBusinessName("");
    setDestinationUrl("");
    setDrawerError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !selectedPlate ||
      !drawerMode
    ) {
      return;
    }

    setDrawerError("");

    const normalizedBusinessName =
      businessName.trim();

    const normalizedDestinationUrl =
      destinationUrl.trim();

    if (
      drawerMode === "activate" &&
      !normalizedBusinessName
    ) {
      setDrawerError(
        "Informe o nome do estabelecimento.",
      );
      return;
    }

    try {
      const parsedUrl =
        new URL(
          normalizedDestinationUrl,
        );

      if (
        parsedUrl.protocol !== "https:"
      ) {
        setDrawerError(
          "O destino precisa utilizar HTTPS.",
        );
        return;
      }
    } catch {
      setDrawerError(
        "Informe uma URL de destino válida.",
      );
      return;
    }

    setSaving(true);

    if (drawerMode === "activate") {
      const { error } =
        await supabaseBrowser.rpc(
          "activate_review_plate",
          {
            p_code: selectedPlate.code,
            p_business_name:
              normalizedBusinessName,
            p_destination_url:
              normalizedDestinationUrl,
          },
        );

      if (error) {
        setDrawerError(error.message);
        setSaving(false);
        return;
      }

      setSuccessMessage(
        `${selectedPlate.code} ativada e vinculada a ${normalizedBusinessName}.`,
      );
    }

    if (drawerMode === "edit") {
      const { error } =
        await supabaseBrowser.rpc(
          "update_review_plate_destination",
          {
            p_code: selectedPlate.code,
            p_destination_url:
              normalizedDestinationUrl,
          },
        );

      if (error) {
        setDrawerError(error.message);
        setSaving(false);
        return;
      }

      setSuccessMessage(
        `Destino da ${selectedPlate.code} atualizado com sucesso.`,
      );
    }

    setSaving(false);
    setSelectedPlate(null);
    setDrawerMode(null);
    setBusinessName("");
    setDestinationUrl("");
    setDrawerError("");

    await refreshPlates();
  }

  const editing =
    drawerMode === "edit";

  return (
    <AdminShell
      current="plates"
      onSignOut={signOut}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            INVENTÁRIO / REVIEW INTELLIGENCE
          </p>

          <h1>
            Placas inteligentes
            <span>.</span>
          </h1>

          <p className={styles.subtitle}>
            Gerencie as unidades físicas,
            rotas permanentes e clientes
            vinculados à infraestrutura
            Alysson Tech.
          </p>
        </div>

        <div className={styles.summary}>
          <span>
            {summary.active}
            <small>ATIVAS</small>
          </span>

          <span>
            {summary.available}
            <small>
              DISPONÍVEIS
            </small>
          </span>
        </div>
      </header>

      {successMessage && (
        <div
          className={styles.successToast}
          role="status"
        >
          <i />

          <div>
            <strong>
              Operação concluída
            </strong>

            <span>
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className={styles.error}>
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          Carregando infraestrutura...
        </div>
      ) : (
        <section className={styles.list}>
          {plates.map((plate) => (
            <article
              className={styles.card}
              key={plate.code}
            >
              <div
                className={
                  styles.cardIdentity
                }
              >
                <span
                  className={
                    styles.code
                  }
                >
                  {plate.code}
                </span>

                <strong>
                  {plate.business_name ??
                    "Sem estabelecimento"}
                </strong>

                <small>
                  alyssontech.com.br/r/
                  {plate.code}
                </small>
              </div>

              <div
                className={
                  styles.cardDestination
                }
              >
                <span>
                  DESTINO ATUAL
                </span>

                <p
                  title={
                    plate.destination_url ??
                    "Aguardando ativação"
                  }
                >
                  {plate.destination_url ??
                    "Aguardando ativação"}
                </p>
              </div>

              <div
                className={
                  styles.actions
                }
              >
                <span
                  className={
                    plate.status ===
                    "active"
                      ? styles.statusActive
                      : plate.status ===
                          "available"
                        ? styles.statusAvailable
                        : styles.statusDisabled
                  }
                >
                  <i />

                  {translateStatus(
                    plate.status,
                  )}
                </span>

                <div
                  className={
                    styles.actionButtons
                  }
                >
                  {plate.status ===
                    "available" && (
                    <button
                      type="button"
                      className={
                        styles.primaryAction
                      }
                      onClick={() =>
                        openActivationDrawer(
                          plate,
                        )
                      }
                    >
                      Ativar placa
                    </button>
                  )}

                  {plate.status ===
                    "active" && (
                    <button
                      type="button"
                      className={
                        styles.primaryAction
                      }
                      onClick={() =>
                        openEditDrawer(
                          plate,
                        )
                      }
                    >
                      Editar destino
                    </button>
                  )}

                  <a
                    className={
                      styles.secondaryAction
                    }
                    href={`/r/${plate.code}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Testar rota ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedPlate &&
        drawerMode && (
        <div
          className={
            styles.drawerBackdrop
          }
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDrawer();
            }
          }}
        >
          <aside
            className={styles.drawer}
            aria-label={
              editing
                ? `Editar ${selectedPlate.code}`
                : `Ativar ${selectedPlate.code}`
            }
          >
            <div
              className={
                styles.drawerTop
              }
            >
              <div>
                <span>
                  {editing
                    ? "EDIÇÃO DE DESTINO"
                    : "ATIVAÇÃO DE PLACA"}
                </span>

                <strong>
                  {selectedPlate.code}
                </strong>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                disabled={saving}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div
              className={
                styles.drawerHero
              }
            >
              <span>
                ROTA PERMANENTE
              </span>

              <strong>
                alyssontech.com.br/r/
                {selectedPlate.code}
              </strong>

              <p>
                Esta rota não muda. O QR
                Code e o NFC continuam
                funcionando mesmo quando o
                destino é alterado.
              </p>
            </div>

            <form
              className={
                styles.activationForm
              }
              onSubmit={handleSubmit}
            >
              <label>
                <span>
                  {editing
                    ? "ESTABELECIMENTO VINCULADO"
                    : "ESTABELECIMENTO"}
                </span>

                <input
                  type="text"
                  required={!editing}
                  disabled={editing}
                  value={businessName}
                  onChange={(event) =>
                    setBusinessName(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Açaí do João"
                />
              </label>

              <label>
                <span>
                  {editing
                    ? "DESTINO"
                    : "URL DE DESTINO"}
                </span>

                <input
                  type="url"
                  required
                  autoFocus={editing}
                  value={destinationUrl}
                  onChange={(event) =>
                    setDestinationUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://..."
                />

                <small>
                  {editing
                    ? "Altere somente o destino final. A rota física da placa continuará a mesma."
                    : "Para avaliações Google, utilize o link direto que abre a tela de avaliação do estabelecimento."}
                </small>
              </label>

              <div
                className={
                  styles.activationPreview
                }
              >
                <span>
                  FLUXO DA PLACA
                </span>

                <div>
                  <strong>
                    NFC / QR
                  </strong>

                  <i>→</i>

                  <strong>
                    {selectedPlate.code}
                  </strong>

                  <i>→</i>

                  <strong>
                    Destino
                  </strong>
                </div>
              </div>

              {drawerError && (
                <p
                  className={
                    styles.drawerError
                  }
                >
                  {drawerError}
                </p>
              )}

              <div
                className={
                  styles.drawerActions
                }
              >
                <button
                  type="button"
                  className={
                    styles.cancelButton
                  }
                  onClick={closeDrawer}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={
                    styles.activateButton
                  }
                  disabled={saving}
                >
                  {saving
                    ? editing
                      ? "Salvando..."
                      : "Ativando..."
                    : editing
                      ? "Salvar alteração"
                      : `Ativar ${selectedPlate.code}`}
                </button>
              </div>
            </form>

            <div
              className={
                styles.drawerSecurity
              }
            >
              <i />

              <p>
                <strong>
                  Operação protegida
                </strong>

                <span>
                  Apenas administradores
                  autorizados podem alterar
                  a configuração de uma
                  placa.
                </span>
              </p>
            </div>
          </aside>
        </div>
      )}
    </AdminShell>
  );
}