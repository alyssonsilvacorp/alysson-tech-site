-- Optional artwork for storefront banner; existing catalogs remain unchanged.
ALTER TABLE public.smart_catalog_settings
  ADD COLUMN IF NOT EXISTS banner_image_url text;
COMMENT ON COLUMN public.smart_catalog_settings.banner_image_url IS 'Imagem opcional de banner 1600x640; apenas URL de mídia aprovada pelo administrador';
