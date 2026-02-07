-- Fix the broken sponsors UPDATE policy (phone_number = phone_number always true)
-- Replace with admin-only updates via has_role check
DROP POLICY IF EXISTS "Sponsors can update their own data" ON public.sponsors;

CREATE POLICY "Only admins can update sponsors"
    ON public.sponsors FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));