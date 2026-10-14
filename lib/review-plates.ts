import { supabase } from "./supabase";

export type ReviewPlateStatus =
  | "available"
  | "active"
  | "disabled";

export type ReviewPlateType =
  | "google_review"
  | "smart";

export type ReviewPlate = {
  code: string;
  status: ReviewPlateStatus;
  destinationUrl: string | null;
  plateType: ReviewPlateType;
  smartSlug: string | null;
  smartPublished: boolean;
};

type ReviewPlateRpcRow = {
  code: string;
  status: ReviewPlateStatus;
  destination_url: string | null;
  plate_type: ReviewPlateType;
  smart_slug: string | null;
  smart_published: boolean;
};

export async function getReviewPlate(
  code: string,
): Promise<ReviewPlate | null> {
  const normalizedCode = code.trim().toUpperCase();

  const { data, error } = await supabase.rpc(
    "resolve_review_plate_v2",
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
    plateType: row.plate_type,
    smartSlug: row.smart_slug,
    smartPublished: row.smart_published,
  };
}
