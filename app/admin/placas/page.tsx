"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabase-browser";

type ReviewPlate = {
  code: string;
  business_name: string | null;
  destination_url: string | null;
  status: string;
  activated_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function ReviewPlatesAdminPage() {
  const router = useRouter();

  const [plates, setPlates] =
    useState<ReviewPlate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } =
        await supabaseBrowser.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } =
        await supabaseBrowser.rpc(
          "list_review_plates",
        );

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setPlates(
        (data ?? []) as ReviewPlate[],
      );

      setLoading(false);
    }

    void load();
  }, [router]);

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050806",
        color: "#ffffff",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div>
            <p
              style={{
                color: "#61ff36",
                fontWeight: 800,
              }}
            >
              ALYSSON TECH
            </p>

            <h1>Placas NFC / QR</h1>
          </div>

          <button
            onClick={signOut}
            style={{
              background: "transparent",
              border: "1px solid #29412c",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 14px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </header>

        {loading && <p>Carregando placas...</p>}

        {errorMessage && (
          <p style={{ color: "#ff7676" }}>
            {errorMessage}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          {plates.map((plate) => (
            <article
              key={plate.code}
              style={{
                border: "1px solid #1c3320",
                background: "#080d09",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div>
                <strong
                  style={{
                    color: "#61ff36",
                    fontSize: "18px",
                  }}
                >
                  {plate.code}
                </strong>

                <div
                  style={{
                    marginTop: "6px",
                    color: "#cbd2cc",
                  }}
                >
                  {plate.business_name ??
                    "Sem estabelecimento"}
                </div>
              </div>

              <span
                style={{
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {plate.status}
              </span>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}