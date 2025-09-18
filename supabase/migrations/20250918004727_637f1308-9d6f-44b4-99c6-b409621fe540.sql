-- Fix critical security vulnerability: Restrict promo codes access to authenticated users only
DROP POLICY "Anyone can view active promo codes" ON public.promo_codes;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view active promo codes" 
ON public.promo_codes 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

-- Add the hardcoded ambassador promo codes to the database for better security
INSERT INTO public.promo_codes (code, type, discount_percentage, ambassador_name, is_active, max_uses) VALUES
('WELCOME10', 'welcome', 10, NULL, true, NULL),
('AMB001', 'ambassador', 5, 'Jean Dupont', true, 100),
('AMB002', 'ambassador', 7, 'Marie Martin', true, 100),
('AMB003', 'ambassador', 6, 'Paul Bernard', true, 100),
('AMB004', 'ambassador', 8, 'Sophie Dubois', true, 100),
('AMB005', 'ambassador', 5, 'Luc Thomas', true, 100)
ON CONFLICT (code) DO NOTHING;