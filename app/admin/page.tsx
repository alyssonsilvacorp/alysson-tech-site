"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../components/admin/AdminShell";
import { supabaseBrowser } from "../../lib/supabase-browser";
import styles from "./dashboard.module.css";

type ReviewPlate = {
  code: string;
  business_name: string | null;
  destination_url: string | null;
  status: "available" | "active" | "disabled";
  activated_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [plates, setPlates] = useState<ReviewPlate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } =
        await supabaseBrowser.rpc("list_review_plates");

      if (!error) {
        setPlates((data ?? []) as ReviewPlate[]);
      }

      setLoading(false);
    }

    void load();
  }, [router]);

  const stats = useMemo(() => {
    const active = plates.filter(
      (plate) => plate.status === "active",
    ).length;

    const available = plates.filter(
      (plate) => plate.status === "available",
    ).length;

    const disabled = plates.filter(
      (plate) => plate.status === "disabled",
    ).length;

    return {
      total: plates.length,
      active,
      available,
      disabled,
    };
  }, [plates]);

  const recent = useMemo(
    () =>
      plates
        .filter((plate) => plate.activated_at)
        .sort(
          (a, b) =>
            new Date(b.activated_at ?? 0).getTime() -
            new Date(a.activated_at ?? 0).getTime(),
        )
        .slice(0, 4),
    [plates],
  );

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <AdminShell current="dashboard" onSignOut={signOut}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            CONTROL CENTER / REVIEW INTELLIGENCE
          </p>

          <h1>
            Visão geral
            <span>.</span>
          </h1>

          <p className={styles.subtitle}>
            Controle das placas inteligentes, ativações e
            rotas permanentes da Alysson Tech.
          </p>
        </div>

        <div className={styles.headerMeta}>
          <span>
            <i />
            produção online
          </span>

          <strong>AT / 2026</strong>
        </div>
      </header>

      <section className={styles.metrics}>
        <article className={styles.metricPrimary}>
          <span>PLACAS ATIVAS</span>
          <strong>{loading ? "—" : stats.active}</strong>
          <p>
            Clientes utilizando a infraestrutura Alysson Tech.
          </p>
          <div className={styles.metricPulse} />
        </article>

        <article className={styles.metric}>
          <span>DISPONÍVEIS</span>
          <strong>{loading ? "—" : stats.available}</strong>
          <p>Unidades prontas para uma nova ativação.</p>
        </article>

        <article className={styles.metric}>
          <span>PLACAS CADASTRADAS</span>
          <strong>{loading ? "—" : stats.total}</strong>
          <p>Placas cadastradas na infraestrutura atual.</p>
        </article>

        <article className={styles.metric}>
          <span>DESATIVADAS</span>
          <strong>{loading ? "—" : stats.disabled}</strong>
          <p>Unidades fora de operação no momento.</p>
        </article>
      </section>

      <section className={styles.mainGrid}>
        <article className={styles.inventoryPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span>ESTOQUE INTELIGENTE</span>
              <h2>Operação das placas</h2>
            </div>

            <Link href="/admin/placas">
              Gerenciar placas →
            </Link>
          </div>

          <div className={styles.inventoryVisual}>
            <div className={styles.ring}>
              <div>
                <strong>{stats.active}</strong>
                <span>ATIVAS</span>
              </div>
            </div>

            <div className={styles.inventoryData}>
              <div>
                <span>Disponíveis</span>
                <strong>{stats.available}</strong>
              </div>

              <div>
                <span>Em operação</span>
                <strong>{stats.active}</strong>
              </div>

              <div>
                <span>Utilização</span>
                <strong>
                  {stats.total
                    ? Math.round(
                        (stats.active / stats.total) * 100,
                      )
                    : 0}
                  %
                </strong>
              </div>
            </div>
          </div>
        </article>

        <article className={styles.routesPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span>INFRAESTRUTURA</span>
              <h2>Rotas permanentes</h2>
            </div>
          </div>

          <div className={styles.routeFlow}>
            <div>
              <small>01</small>
              <strong>NFC / QR</strong>
              <span>Leitura física</span>
            </div>

            <i />

            <div>
              <small>02</small>
              <strong>alyssontech.com.br/r</strong>
              <span>Rota permanente</span>
            </div>

            <i />

            <div>
              <small>03</small>
              <strong>Destino</strong>
              <span>Google Review</span>
            </div>
          </div>

          <p className={styles.routeNote}>
            O destino pode mudar sem regravar o NFC ou
            substituir o QR Code físico.
          </p>
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.activity}>
          <div className={styles.panelHeader}>
            <div>
              <span>ATIVIDADE</span>
              <h2>Ativações recentes</h2>
            </div>
          </div>

          {recent.length === 0 ? (
            <div className={styles.empty}>
              Nenhuma ativação recente.
            </div>
          ) : (
            <div className={styles.activityList}>
              {recent.map((plate) => (
                <div
                  className={styles.activityRow}
                  key={plate.code}
                >
                  <div>
                    <i />
                    <span>{plate.code}</span>
                  </div>

                  <strong>
                    {plate.business_name ??
                      "Estabelecimento"}
                  </strong>

                  <small>ATIVA</small>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className={styles.quickActions}>
          <span>AÇÕES RÁPIDAS</span>
          <h2>Operação</h2>

          <Link href="/admin/placas">
            <strong>Gerenciar placas</strong>
            <small>
              Ativar e consultar unidades cadastradas
            </small>
            <b>→</b>
          </Link>

          <a
            href="/r/AT-R001"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Testar rota AT-R001</strong>
            <small>
              Abrir a rota da Clínica Ultrassaúde
            </small>
            <b>↗</b>
          </a>
        </article>
      </section>
    </AdminShell>
  );
}

