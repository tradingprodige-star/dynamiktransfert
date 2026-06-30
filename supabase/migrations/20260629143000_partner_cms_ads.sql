-- Partner identity fields and lightweight CMS announcement banners.

ALTER TABLE public.sponsors
ADD COLUMN IF NOT EXISTS full_name text;

ALTER TABLE public.promo_codes
ADD COLUMN IF NOT EXISTS partner_name text,
ADD COLUMN IF NOT EXISTS partner_phone text;

UPDATE public.promo_codes
SET partner_name = COALESCE(partner_name, ambassador_name)
WHERE partner_name IS NULL AND ambassador_name IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.ad_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_banners ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ad_banners' AND policyname = 'Anyone can view active ad banners'
  ) THEN
    CREATE POLICY "Anyone can view active ad banners"
    ON public.ad_banners
    FOR SELECT
    USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ad_banners' AND policyname = 'Admins can manage ad banners'
  ) THEN
    CREATE POLICY "Admins can manage ad banners"
    ON public.ad_banners
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'promo_codes' AND policyname = 'Admins can insert promo codes'
  ) THEN
    CREATE POLICY "Admins can insert promo codes"
    ON public.promo_codes
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS update_ad_banners_updated_at ON public.ad_banners;
CREATE TRIGGER update_ad_banners_updated_at
BEFORE UPDATE ON public.ad_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Keep sponsor identity synchronized into promo codes.
CREATE OR REPLACE FUNCTION public.ensure_sponsor_promo_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.promo_codes (code, type, discount_percentage, ambassador_name, partner_name, partner_phone, is_active)
  VALUES (NEW.referral_code, 'ambassador', 10, COALESCE(NEW.full_name, NEW.phone_number), NEW.full_name, NEW.phone_number, true)
  ON CONFLICT (code) DO UPDATE
  SET type = 'ambassador',
      discount_percentage = COALESCE(public.promo_codes.discount_percentage, 10),
      ambassador_name = COALESCE(NEW.full_name, public.promo_codes.ambassador_name, NEW.phone_number),
      partner_name = COALESCE(NEW.full_name, public.promo_codes.partner_name),
      partner_phone = COALESCE(NEW.phone_number, public.promo_codes.partner_phone),
      is_active = true,
      updated_at = now();

  RETURN NEW;
END;
$$;

INSERT INTO public.ad_banners (title, image_url, link_url, sort_order)
VALUES
  ('Programme partenaires DYNAMIK', '/og-dynamik-transfert.png', '/partenariats', 1),
  ('Codes promo et transferts rapides', '/og-dynamik-transfert.png', '/offre', 2)
ON CONFLICT DO NOTHING;
