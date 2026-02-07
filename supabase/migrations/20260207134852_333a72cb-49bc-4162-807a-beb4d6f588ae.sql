-- Supprimer la contrainte de type existante et en créer une nouvelle incluant 'event'
ALTER TABLE public.promo_codes DROP CONSTRAINT IF EXISTS promo_codes_type_check;
ALTER TABLE public.promo_codes ADD CONSTRAINT promo_codes_type_check CHECK (type IN ('welcome', 'ambassador', 'event'));

-- Ajouter le code promo Saint-Valentin : 0% de frais (100% de réduction)
INSERT INTO public.promo_codes (
  code,
  type,
  discount_percentage,
  is_active,
  ambassador_name,
  max_uses,
  expires_at
) VALUES (
  'SAINTVALENTIN',
  'event',
  100,
  true,
  'Saint-Valentin 2026',
  NULL,
  '2026-02-15 00:00:00+00'
);