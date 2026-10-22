import { supabase } from "./supabase";

export type SmartBusinessAction = {
  actionType: string;
  label: string;
  url: string | null;
  config: Record<string, unknown>;
  sortOrder: number;
};

export type SmartBusinessService = {
  name: string;
  description: string | null;
  price: number | null;
  priceLabel: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  sortOrder: number;
};

export type SmartBusiness = {
  slug: string;
  name: string;
  category: string | null;
  shortDescription: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  accentColor: string | null;
  whatsappNumber: string | null;
  instagramUrl: string | null;
  address: string | null;
  mapsUrl: string | null;
  actions: SmartBusinessAction[];
  services: SmartBusinessService[];
};

type BusinessRow = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  short_description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  accent_color: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  address: string | null;
  maps_url: string | null;
};

type ActionRow = {
  action_type: string;
  label: string;
  url: string | null;
  config: Record<string, unknown> | null;
  sort_order: number;
};

type ServiceRow = {
  name: string;
  description: string | null;
  price: number | null;
  price_label: string | null;
  image_url: string | null;
  video_url: string | null;
  sort_order: number;
};

export async function getSmartBusiness(
  slug: string,
): Promise<SmartBusiness | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
    return null;
  }

  const { data: businessData, error: businessError } =
    await supabase
      .from("smart_businesses")
      .select(
        "id,slug,name,category,short_description,logo_url,cover_url,accent_color,whatsapp_number,instagram_url,address,maps_url",
      )
      .eq("slug", normalizedSlug)
      .eq("is_published", true)
      .maybeSingle();

  if (businessError) {
    console.error(
      "Erro ao consultar portal Smart:",
      businessError.message,
    );
    throw new Error("Não foi possível carregar o portal.");
  }

  if (!businessData) {
    return null;
  }

  const business = businessData as BusinessRow;

  const [actionsResult, servicesResult] = await Promise.all([
    supabase
      .from("smart_business_actions")
      .select("action_type,label,url,config,sort_order")
      .eq("business_id", business.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("smart_business_services")
      .select(
        "name,description,price,price_label,image_url,video_url,sort_order",
      )
      .eq("business_id", business.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (actionsResult.error) {
    console.error(
      "Erro ao consultar ações Smart:",
      actionsResult.error.message,
    );
    throw new Error("Não foi possível carregar as ações do portal.");
  }

  if (servicesResult.error) {
    console.error(
      "Erro ao consultar serviços Smart:",
      servicesResult.error.message,
    );
    throw new Error("Não foi possível carregar os serviços do portal.");
  }

  const actionRows =
    (actionsResult.data as ActionRow[] | null) ?? [];
  const serviceRows =
    (servicesResult.data as ServiceRow[] | null) ?? [];

  return {
    slug: business.slug,
    name: business.name,
    category: business.category,
    shortDescription: business.short_description,
    logoUrl: business.logo_url,
    coverUrl: business.cover_url,
    accentColor: business.accent_color,
    whatsappNumber: business.whatsapp_number,
    instagramUrl: business.instagram_url,
    address: business.address,
    mapsUrl: business.maps_url,
    actions: actionRows.map((action) => ({
      actionType: action.action_type,
      label: action.label,
      url: action.url,
      config: action.config ?? {},
      sortOrder: action.sort_order,
    })),
    services: serviceRows.map((service) => ({
      name: service.name,
      description: service.description,
      price: service.price,
      priceLabel: service.price_label,
      imageUrl: service.image_url,
      videoUrl: service.video_url,
      sortOrder: service.sort_order,
    })),
  };
}
