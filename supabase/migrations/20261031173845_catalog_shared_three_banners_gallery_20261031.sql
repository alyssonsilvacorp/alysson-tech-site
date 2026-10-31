-- Shared catalog creative fields: same storefront template, per-business media.
-- Additive: no change to QR/NFC, companies, products, pricing or published statuses.
ALTER TABLE public.smart_catalog_settings
  ADD COLUMN IF NOT EXISTS banner_slides jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}'::text[];
ALTER TABLE public.smart_catalog_settings
  ADD CONSTRAINT smart_catalog_banner_slides_max_three CHECK (
    jsonb_typeof(banner_slides) = 'array' AND jsonb_array_length(banner_slides) <= 3
  );
ALTER TABLE public.smart_catalog_settings
  ADD CONSTRAINT smart_catalog_gallery_images_max_thirty CHECK (
    coalesce(array_length(gallery_images,1),0) <= 30
  );
COMMENT ON COLUMN public.smart_catalog_settings.banner_slides IS
 'Up to three custom visual slides per business, ordered; used by the shared catalog template.';
COMMENT ON COLUMN public.smart_catalog_settings.gallery_images IS
 'Optional authentic work photos used in a continuous marquee. Empty = static collection assets if configured.';
