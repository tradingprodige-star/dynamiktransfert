-- Fix security issues identified in security scan

-- 1. Fix users table policies: Change from RESTRICTIVE to PERMISSIVE type
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

-- Recreate policies as PERMISSIVE (default type)
CREATE POLICY "Users can insert their own data" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Add DELETE policy to prevent unauthorized account deletion
CREATE POLICY "Prevent user account deletion" 
ON public.users 
FOR DELETE 
USING (false);

-- 2. Add UPDATE and DELETE policies for promo_codes to prevent tampering
CREATE POLICY "Prevent promo code updates" 
ON public.promo_codes 
FOR UPDATE 
USING (false);

CREATE POLICY "Prevent promo code deletion" 
ON public.promo_codes 
FOR DELETE 
USING (false);

-- 3. Add UPDATE and DELETE policies for promo_code_usage to prevent tampering
CREATE POLICY "Prevent usage record updates" 
ON public.promo_code_usage 
FOR UPDATE 
USING (false);

CREATE POLICY "Prevent usage record deletion" 
ON public.promo_code_usage 
FOR DELETE 
USING (false);