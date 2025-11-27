-- Fix RLS policies to explicitly target only authenticated users
-- This prevents the "Anonymous Access Policies" warning

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Prevent user account deletion" ON public.users;

-- Recreate policies with explicit role targeting (authenticated only)
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
TO authenticated
USING ((auth.uid())::text = (id)::text);

CREATE POLICY "Users can insert their own data" 
ON public.users 
FOR INSERT 
TO authenticated
WITH CHECK ((auth.uid())::text = (id)::text);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING ((auth.uid())::text = (id)::text);

CREATE POLICY "Prevent user account deletion" 
ON public.users 
FOR DELETE 
TO authenticated
USING (false);