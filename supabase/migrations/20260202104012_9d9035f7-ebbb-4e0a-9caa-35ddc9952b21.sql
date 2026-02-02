-- Insertion du code promo CID pour le Centre de l'Innovation Digital
INSERT INTO public.promo_codes (
    code,
    type,
    ambassador_name,
    discount_percentage,
    is_active,
    max_uses,
    expires_at
) VALUES (
    'CID',
    'ambassador',
    'Centre de l''Innovation Digital',
    5,
    true,
    NULL,
    NULL
);