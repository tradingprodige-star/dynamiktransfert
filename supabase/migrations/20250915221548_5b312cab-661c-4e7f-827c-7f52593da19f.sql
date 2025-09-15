-- Fix critical RLS policy vulnerabilities

-- Update users table RLS policies to restrict access to own data only
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;

CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own data" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Update promo_code_usage RLS policies to use proper authentication
DROP POLICY IF EXISTS "Users can view their own usage" ON public.promo_code_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.promo_code_usage;

CREATE POLICY "Users can view their own usage" 
ON public.promo_code_usage 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own usage" 
ON public.promo_code_usage 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Add user_id column constraint to ensure it's not nullable (if not already set)
ALTER TABLE public.users ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.promo_code_usage ALTER COLUMN user_id SET NOT NULL;

-- Update the function security definer settings
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER SET search_path = public;