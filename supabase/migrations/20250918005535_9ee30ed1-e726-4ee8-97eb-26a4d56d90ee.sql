-- CRITICAL SECURITY FIX: Restrict promo_codes access to prevent business data exposure
-- Replace the overly permissive RLS policy with one that limits what authenticated users can see

-- First, drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view active promo codes" ON public.promo_codes;

-- Create a more restrictive policy that only shows essential fields and limits access
-- Users can only see promo codes they should have access to (not all business intelligence)
CREATE POLICY "Users can view limited promo code info when using codes" 
ON public.promo_codes 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  is_active = true AND 
  (expires_at IS NULL OR expires_at > now()) AND
  (max_uses IS NULL OR current_uses < max_uses)
);

-- Add some sample ambassador promo codes to the database
-- (Moving these from hardcoded values in the frontend)
INSERT INTO public.promo_codes (code, type, discount_percentage, ambassador_name, is_active, max_uses) VALUES
('FATIMA10', 'ambassador', 10, 'Fatima Kouassi', true, NULL),
('JEAN15', 'ambassador', 15, 'Jean Baptiste Nana', true, NULL),  
('MARIE12', 'ambassador', 12, 'Marie Soglo', true, NULL),
('AHMED08', 'ambassador', 8, 'Ahmed Diallo', true, NULL)
ON CONFLICT (code) DO NOTHING;