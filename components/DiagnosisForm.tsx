"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";

const whatsappBaseUrl = "https://wa.me/5582999926146";

const needOptions = [
  "Vender melhor pela internet",
  "Organizar meu atendimento",
  "Automatizar tarefas repetitivas",
  "Organizar clientes, pedidos ou operação",
  "Desenvolver uma ideia de sistema",
  "Começar minha presença digital",
  "Outro problema",
] as const;

type DiagnosisValues = {
  name: string;
  business: string;
  activity: string;
  need: string;
  problem: string;
  currentFlow: string;
};

type DiagnosisErrors = Partial<Record<keyof DiagnosisValues, string>>;

const initialValues: DiagnosisValues = {
  name: "",
  business: "",
  activity: "",
  need: "",
  problem: "",
  currentFlow: "",
};

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="arrow-icon"
    >
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  );
}

export default function DiagnosisForm() {
  const [values, setValues] = useState<DiagnosisValues>(initialValues);
  const [errors, setErrors] = useState<DiagnosisErrors>({});

  const updateField =
    (field: keyof DiagnosisValues) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const nextValue = event.target.value;

      setValues((currentValues) => ({
        ...currentValues,
        [field]: nextValue,
      }));

      if (errors[field]) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          [field]: undefined,
        }));
      }
    };

  const validate = () => {
    const nextErrors: DiagnosisErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Informe como podemos te chamar.";
    }

    if (!values.activity.trim()) {
      nextErrors.activity = "Informe a atividade do negócio ou projeto.";
    }

    if (!values.need) {
      nextErrors.need = "Selecione a principal necessidade.";
    }

    if (!values.problem.trim()) {
      nextErrors.problem = "Conte brevemente o que está acontecendo.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0];
      document.getElementById(`diagnosis-${firstInvalidField}`)?.focus();
      return;
    }

    const message = `Olá, Alysson! Vim pelo site da Alysson Tech e gostaria de solicitar uma análise inicial.

DADOS DO DIAGNÓSTICO

Nome:
${values.name.trim()}

Negócio/projeto:
${values.business.trim() || "Não informado"}

Atividade:
${values.activity.trim()}

Principal necessidade:
${values.need}

O que está acontecendo:
${values.problem.trim()}

Como funciona hoje:
${values.currentFlow.trim() || "Não informado"}

Gostaria de entender qual solução faria mais sentido para esse cenário.`;

    const whatsappUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="diagnosis-form" onSubmit={handleSubmit} noValidate>
      <div className="diagnosis-form__topline" aria-hidden="true">
        <span>Diagnóstico inicial</span>
        <small>01 — 06</small>
      </div>

      <div className="diagnosis-form__grid">
        <div className="form-field">
          <label htmlFor="diagnosis-name">Como podemos te chamar?</label>
          <input
            id="diagnosis-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={60}
            required
            value={values.name}
            onChange={updateField("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "diagnosis-name-error" : undefined}
          />
          {errors.name ? (
            <span className="form-field__error" id="diagnosis-name-error" role="alert">
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="diagnosis-business">Nome do negócio ou projeto</label>
          <input
            id="diagnosis-business"
            name="business"
            type="text"
            autoComplete="organization"
            placeholder="Ex: Barbearia Central"
            maxLength={80}
            value={values.business}
            onChange={updateField("business")}
          />
        </div>

        <div className="form-field">
          <label htmlFor="diagnosis-activity">O que você faz?</label>
          <input
            id="diagnosis-activity"
            name="activity"
            type="text"
            placeholder="Ex: barbearia, loja, clínica, delivery..."
            maxLength={100}
            required
            value={values.activity}
            onChange={updateField("activity")}
            aria-invalid={Boolean(errors.activity)}
            aria-describedby={
              errors.activity ? "diagnosis-activity-error" : undefined
            }
          />
          {errors.activity ? (
            <span
              className="form-field__error"
              id="diagnosis-activity-error"
              role="alert"
            >
              {errors.activity}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="diagnosis-need">O que você precisa resolver?</label>
          <select
            id="diagnosis-need"
            name="need"
            required
            value={values.need}
            onChange={updateField("need")}
            aria-invalid={Boolean(errors.need)}
            aria-describedby={errors.need ? "diagnosis-need-error" : undefined}
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {needOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.need ? (
            <span className="form-field__error" id="diagnosis-need-error" role="alert">
              {errors.need}
            </span>
          ) : null}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="diagnosis-problem">
            Conte um pouco do que está acontecendo
          </label>
          <textarea
            id="diagnosis-problem"
            name="problem"
            placeholder="Explique como funciona hoje e o que está dificultando sua rotina."
            maxLength={600}
            rows={5}
            required
            value={values.problem}
            onChange={updateField("problem")}
            aria-invalid={Boolean(errors.problem)}
            aria-describedby={
              errors.problem ? "diagnosis-problem-error" : undefined
            }
          />
          {errors.problem ? (
            <span
              className="form-field__error"
              id="diagnosis-problem-error"
              role="alert"
            >
              {errors.problem}
            </span>
          ) : null}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="diagnosis-current-flow">Como você trabalha hoje?</label>
          <textarea
            id="diagnosis-current-flow"
            name="currentFlow"
            placeholder="Ex: recebo pedidos pelo Instagram, organizo tudo pelo WhatsApp e anoto manualmente..."
            maxLength={500}
            rows={4}
            value={values.currentFlow}
            onChange={updateField("currentFlow")}
          />
        </div>
      </div>

      <div className="diagnosis-form__actions">
        <button className="button button--primary" type="submit">
          Enviar diagnóstico
          <SendIcon />
        </button>
        <p>
          Você será direcionado ao WhatsApp para revisar e enviar a mensagem.
        </p>
        <a href={whatsappBaseUrl} target="_blank" rel="noreferrer">
          Prefiro falar direto pelo WhatsApp
        </a>
      </div>
    </form>
  );
}
