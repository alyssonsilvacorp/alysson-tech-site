"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (!mounted) return;

      if (session) {
        router.replace("/admin/placas");
        return;
      }

      setCheckingSession(false);
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } =
      await supabaseBrowser.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
  console.error("Supabase login error:", error);
  setErrorMessage(error.message);
  setLoading(false);
  return;
}

    router.replace("/admin/placas");
  }

  async function handleRecovery() {
    if (!email.trim()) {
      setErrorMessage(
        "Digite primeiro o e-mail administrativo.",
      );
      return;
    }

    setRecovering(true);
    setMessage("");
    setErrorMessage("");

    const redirectTo =
      `${window.location.origin}/admin/update-password`;

    const { error } =
      await supabaseBrowser.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo },
      );

    if (error) {
      setErrorMessage(error.message);
      setRecovering(false);
      return;
    }

    setMessage(
      "Enviamos o link para definir uma nova senha.",
    );
    setRecovering(false);
  }

  if (checkingSession) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050806",
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Verificando acesso...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050806",
        color: "#ffffff",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          border: "1px solid #18341b",
          borderRadius: "24px",
          padding: "32px",
          background: "#080d09",
          boxShadow: "0 24px 80px rgba(0,0,0,.35)",
        }}
      >
        <p
          style={{
            color: "#61ff36",
            fontWeight: 800,
            letterSpacing: "0.12em",
            fontSize: "12px",
          }}
        >
          ALYSSON TECH
        </p>

        <h1 style={{ marginBottom: "8px" }}>
          Portal administrativo
        </h1>

        <p style={{ color: "#a5ada7", lineHeight: 1.6 }}>
          Acesso interno para gerenciamento das placas inteligentes.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "14px",
            marginTop: "28px",
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="E-mail"
            autoComplete="email"
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #28452c",
              background: "#0d130e",
              color: "#ffffff",
              fontSize: "16px",
            }}
          />

          <input
            type="password"
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Senha"
            autoComplete="current-password"
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #28452c",
              background: "#0d130e",
              color: "#ffffff",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 18px",
              border: 0,
              borderRadius: "12px",
              background: "#61ff36",
              color: "#071006",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleRecovery}
          disabled={recovering}
          style={{
            marginTop: "14px",
            width: "100%",
            background: "transparent",
            border: 0,
            color: "#9bb69f",
            cursor: "pointer",
            padding: "10px",
          }}
        >
          {recovering
            ? "Enviando..."
            : "Esqueci / ainda não defini minha senha"}
        </button>

        {message && (
          <p style={{ color: "#61ff36" }}>
            {message}
          </p>
        )}

        {errorMessage && (
          <p style={{ color: "#ff7676" }}>
            {errorMessage}
          </p>
        )}
      </section>
    </main>
  );
}
