-- Link referral links and promo codes, and make usage visible to admins.

-- Public safe RPC used by the frontend when a visitor signs up or starts a WhatsApp transfer
-- from a referral/promo link. It records the pending filleul and increments the sponsor counter.
CREATE OR REPLACE FUNCTION public.record_referral_interest(
  _referral_code text,
  _godchild_id text,
  _godchild_phone text DEFAULT NULL,
  _source text DEFAULT 'web',
  _country_from text DEFAULT NULL,
  _country_to text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sponsor_id uuid;
  _inserted_id uuid;
BEGIN
  IF NULLIF(trim(_referral_code), '') IS NULL OR NULLIF(trim(_godchild_id), '') IS NULL THEN
    RETURN false;
  END IF;

  SELECT id INTO _sponsor_id
  FROM public.sponsors
  WHERE upper(referral_code) = upper(trim(_referral_code))
    AND is_active = true
    AND is_blocked = false
  LIMIT 1;

  IF _sponsor_id IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.referral_clicks (
    sponsor_id,
    referral_code,
    godchild_id,
    godchild_phone,
    source,
    country_from,
    country_to,
    transfer_status
  ) VALUES (
    _sponsor_id,
    upper(trim(_referral_code)),
    trim(_godchild_id),
    NULLIF(trim(_godchild_phone), ''),
    COALESCE(NULLIF(trim(_source), ''), 'web'),
    NULLIF(trim(_country_from), ''),
    NULLIF(trim(_country_to), ''),
    'pending'
  )
  ON CONFLICT (godchild_id) DO NOTHING
  RETURNING id INTO _inserted_id;

  IF _inserted_id IS NOT NULL THEN
    UPDATE public.sponsors
    SET total_referrals = total_referrals + 1,
        updated_at = now()
    WHERE id = _sponsor_id;
  END IF;

  RETURN true;
END;
$$;

-- Every sponsor code is also a promo code. This makes the share link and the promo code one object
-- from the user perspective: /?ref=DYNA-XXXX fills the discount code and tracks the parrain.
CREATE OR REPLACE FUNCTION public.ensure_sponsor_promo_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.promo_codes (code, type, discount_percentage, ambassador_name, is_active)
  VALUES (NEW.referral_code, 'ambassador', 10, NEW.phone_number, true)
  ON CONFLICT (code) DO UPDATE
  SET type = 'ambassador',
      discount_percentage = COALESCE(public.promo_codes.discount_percentage, 10),
      ambassador_name = COALESCE(public.promo_codes.ambassador_name, NEW.phone_number),
      is_active = true,
      updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sponsors_sync_promo_code ON public.sponsors;
CREATE TRIGGER sponsors_sync_promo_code
AFTER INSERT OR UPDATE OF referral_code, phone_number, is_active
ON public.sponsors
FOR EACH ROW
WHEN (NEW.is_active = true AND NEW.is_blocked = false)
EXECUTE FUNCTION public.ensure_sponsor_promo_code();

-- Backfill existing sponsor codes into promo_codes.
INSERT INTO public.promo_codes (code, type, discount_percentage, ambassador_name, is_active)
SELECT referral_code, 'ambassador', 10, phone_number, true
FROM public.sponsors
WHERE is_active = true AND is_blocked = false
ON CONFLICT (code) DO UPDATE
SET type = 'ambassador',
    is_active = true,
    updated_at = now();

-- Admin-friendly read/update policies for promo tracking. Existing policies are broad on some installs;
-- these are additive and safe if not already present.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'promo_code_usage'
      AND policyname = 'Admins can view all promo code usage'
  ) THEN
    CREATE POLICY "Admins can view all promo code usage"
    ON public.promo_code_usage
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'promo_codes'
      AND policyname = 'Admins can update promo codes'
  ) THEN
    CREATE POLICY "Admins can update promo codes"
    ON public.promo_codes
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END;
$$;
