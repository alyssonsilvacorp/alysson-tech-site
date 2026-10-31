-- Business-selected catalog behavior, independent of business sector / category label.
ALTER TABLE public.smart_catalog_settings
 ADD COLUMN IF NOT EXISTS catalog_kind text NOT NULL DEFAULT 'products';
ALTER TABLE public.smart_catalog_settings
 ADD CONSTRAINT smart_catalog_kind_valid CHECK (catalog_kind IN ('products','services'));
COMMENT ON COLUMN public.smart_catalog_settings.catalog_kind IS
 'Products use a bag and collection checkout; services use individual WhatsApp consultations.';
