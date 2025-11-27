-- Fix RLS policies for promo_code_usage table
DROP POLICY IF EXISTS "Users can view their own usage" ON public.promo_code_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.promo_code_usage;
DROP POLICY IF EXISTS "Prevent usage record updates" ON public.promo_code_usage;
DROP POLICY IF EXISTS "Prevent usage record deletion" ON public.promo_code_usage;

CREATE POLICY "Users can view their own usage" 
ON public.promo_code_usage 
FOR SELECT 
TO authenticated
USING ((auth.uid())::text = (user_id)::text);

CREATE POLICY "Users can insert their own usage" 
ON public.promo_code_usage 
FOR INSERT 
TO authenticated
WITH CHECK ((auth.uid())::text = (user_id)::text);

CREATE POLICY "Prevent usage record updates" 
ON public.promo_code_usage 
FOR UPDATE 
TO authenticated
USING (false);

CREATE POLICY "Prevent usage record deletion" 
ON public.promo_code_usage 
FOR DELETE 
TO authenticated
USING (false);

-- Fix RLS policies for promo_codes table
DROP POLICY IF EXISTS "Users can view limited promo code info when using codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Prevent promo code updates" ON public.promo_codes;
DROP POLICY IF EXISTS "Prevent promo code deletion" ON public.promo_codes;

CREATE POLICY "Users can view limited promo code info when using codes" 
ON public.promo_codes 
FOR SELECT 
TO authenticated
USING ((auth.uid() IS NOT NULL) AND (is_active = true) AND ((expires_at IS NULL) OR (expires_at > now())) AND ((max_uses IS NULL) OR (current_uses < max_uses)));

CREATE POLICY "Prevent promo code updates" 
ON public.promo_codes 
FOR UPDATE 
TO authenticated
USING (false);

CREATE POLICY "Prevent promo code deletion" 
ON public.promo_codes 
FOR DELETE 
TO authenticated
USING (false);