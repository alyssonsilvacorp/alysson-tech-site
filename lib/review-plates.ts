import { supabase } from "./supabase";

export type ReviewPlateStatus =
  | "available"
  | "active"
  | "disabled";

export type ReviewPlate = {
  code: string;
  status: ReviewPlateStatus;
  destinationUrl: string | null;
};

type ReviewPlateRpcRow = {
  code: string;
  status: ReviewPlateStatus;
  destination_url: string | null;
};

export async function getReviewPlate(
  code: string,
): Promise<ReviewPlate | null> {
  const normalizedCode = code.trim().toUpperCase();

  const { data, error } = await supabase.rpc(
    "resolve_review_plate",
    {
      p_code: normalizedCode,
    },
  );

  if (error) {
    console.error(
      "Erro ao consultar placa:",
      error.message,
    );

    throw new Error(
      "Não foi possível consultar a placa.",
    );
  }

  const rows = data as ReviewPlateRpcRow[] | null;
  const row = rows?.[0];

  if (!row) {
    return null;
  }

  return {
    code: row.code,
    status: row.status,
    destinationUrl: row.destination_url,
  };
}