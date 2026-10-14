import { NextResponse } from "next/server";
import { getReviewPlate } from "../../../lib/review-plates";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

function htmlResponse(
  title: string,
  heading: string,
  message: string,
  code?: string,
  status = 200,
) {
  return new NextResponse(
    `<!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title} | Alysson Tech</title>
      </head>
      <body style="font-family:Arial,sans-serif;background:#090b10;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px">
        <main style="max-width:560px">
          <p style="color:#d4af37;font-weight:700">${code ?? "Alysson Tech"}</p>
          <h1>${heading}</h1>
          <p style="color:#c8cbd2;line-height:1.6">${message}</p>
        </main>
      </body>
    </html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET(request: Request, { params }: RouteContext) {
  const { code } = await params;
  const plate = await getReviewPlate(code);

  if (!plate) {
    return htmlResponse(
      "Placa não encontrada",
      "Placa não encontrada",
      "Verifique o código desta placa.",
      undefined,
      404,
    );
  }

  if (plate.status === "disabled") {
    return htmlResponse(
      "Placa indisponível",
      "Placa temporariamente indisponível",
      "Entre em contato com o estabelecimento ou com a Alysson Tech.",
      plate.code,
      410,
    );
  }

  if (plate.status !== "active") {
    return htmlResponse(
      "Aguardando ativação",
      "Placa aguardando ativação",
      "Esta placa será configurada pela Alysson Tech para o estabelecimento.",
      plate.code,
    );
  }

  if (plate.plateType === "smart") {
    if (!plate.smartSlug || !plate.smartPublished) {
      return htmlResponse(
        "Portal aguardando publicação",
        "Portal em preparação",
        "O menu digital deste estabelecimento ainda está sendo finalizado.",
        plate.code,
      );
    }

    const response = NextResponse.redirect(
      new URL(
        `/p/${encodeURIComponent(plate.smartSlug)}`,
        request.url,
      ),
      307,
    );

    response.headers.set("Cache-Control", "no-store");

    return response;
  }

  if (!plate.destinationUrl) {
    return htmlResponse(
      "Destino não configurado",
      "Placa aguardando configuração",
      "O destino desta placa ainda não foi configurado.",
      plate.code,
    );
  }

  const response = NextResponse.redirect(
    new URL(plate.destinationUrl),
    307,
  );

  response.headers.set("Cache-Control", "no-store");

  return response;
}
