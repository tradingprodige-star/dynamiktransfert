-- Corriger la fonction generate_referral_code avec search_path
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS VARCHAR(20)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_code VARCHAR(20);
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := 'DYNA-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM public.sponsors WHERE referral_code = new_code) INTO code_exists;
        EXIT WHEN NOT code_exists;
    END LOOP;
    RETURN new_code;
END;
$$;