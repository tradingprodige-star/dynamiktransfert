-- Create users table with phone as unique identifier
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('welcome', 'ambassador')),
  discount_percentage INTEGER NOT NULL,
  ambassador_name VARCHAR(100),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo code usage tracking table
CREATE TABLE public.promo_code_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, promo_code_id)
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for users
CREATE POLICY "Users can view their own data" ON public.users
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON public.users
FOR INSERT WITH CHECK (true);

-- RLS policies for promo codes (public read)
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes
FOR SELECT USING (is_active = true);

-- RLS policies for promo code usage
CREATE POLICY "Users can view their own usage" ON public.promo_code_usage
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own usage" ON public.promo_code_usage
FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
BEFORE UPDATE ON public.promo_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial promo codes
INSERT INTO public.promo_codes (code, type, discount_percentage, ambassador_name, expires_at, max_uses) VALUES
('BIENVENUE', 'welcome', 10, NULL, NULL, NULL),
('CRYPTO20', 'ambassador', 20, 'CryptoExpert', now() + INTERVAL '30 days', 100),
('TRADER15', 'ambassador', 15, 'TraderPro', now() + INTERVAL '30 days', 50),
('FINANCE25', 'ambassador', 25, 'FinanceGuru', now() + INTERVAL '30 days', 75);