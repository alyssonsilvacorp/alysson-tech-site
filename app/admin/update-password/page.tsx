"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      setHasSession(Boolean(session));
      setChecking(false);
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setHasSession(true);
          setChecking(false);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "A senha precisa ter pelo menos 8 caracteres.",
      );
      return;
    }

    if (password !== confirmation) {
      setErrorMessage("As senhas não são iguais.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabaseBrowser.auth.updateUser({
        password,
      });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050806",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Validando link de recuperação...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050806",
        color: "#fff",
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
          background: "#080d09",
          border: "1px solid #18341b",
          borderRadius: "24px",
          padding: "32px",
        }}
      >
        <p
          style={{
            color: "#61ff36",
            fontWeight: 800,
            letterSpacing: ".12em",
            fontSize: "12px",
          }}
        >
          ALYSSON TECH
        </p>

        <h1>Definir nova senha</h1>

        {!hasSession ? (
          <p style={{ color: "#ff9b9b", lineHeight: 1.6 }}>
            Este link não possui uma sessão válida de recuperação.
            Solicite um novo link na tela de login.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "24px",
            }}
          >
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Nova senha"
              autoComplete="new-password"
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #28452c",
                background: "#0d130e",
                color: "#fff",
                fontSize: "16px",
              }}
            />

            <input
              type="password"
              required
              minLength={8}
              value={confirmation}
              onChange={(event) =>
                setConfirmation(event.target.value)
              }
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #28452c",
                background: "#0d130e",
                color: "#fff",
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
              {loading
                ? "Salvando..."
                : "Definir senha"}
            </button>

            {errorMessage && (
              <p style={{ color: "#ff7676" }}>
                {errorMessage}
              </p>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
