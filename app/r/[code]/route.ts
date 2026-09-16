import { NextResponse } from "next/server";
import { getReviewPlate } from "../../../lib/review-plates";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { code } = await params;
  const plate = getReviewPlate(code);

  if (!plate) {
    return new NextResponse(
      `<!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Placa não encontrada | Alysson Tech</title>
        </head>
        <body style="font-family:Arial,sans-serif;background:#090b10;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px">
          <main>
            <p style="color:#d4af37;font-weight:700">Alysson Tech</p>
            <h1>Placa não encontrada</h1>
            <p>Verifique o código desta placa.</p>
          </main>
        </body>
      </html>`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (plate.status !== "active" || !plate.destinationUrl) {
    return new NextResponse(
      `<!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Aguardando ativação | Alysson Tech</title>
        </head>
        <body style="font-family:Arial,sans-serif;background:#090b10;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px">
          <main>
            <p style="color:#d4af37;font-weight:700">${plate.code}</p>
            <h1>Placa aguardando ativação</h1>
            <p>Esta placa será configurada pela Alysson Tech para o estabelecimento.</p>
          </main>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const response = NextResponse.redirect(
    new URL(plate.destinationUrl),
    307,
  );

  response.headers.set("Cache-Control", "no-store");

  return response;
}
