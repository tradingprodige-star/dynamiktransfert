-- Enum pour les rôles admin
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Table des rôles utilisateurs
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction pour vérifier les rôles (Security Definer pour éviter récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Table des parrains
CREATE TABLE public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    referral_code VARCHAR(20) NOT NULL UNIQUE,
    total_points INTEGER NOT NULL DEFAULT 0,
    total_referrals INTEGER NOT NULL DEFAULT 0,
    total_validated INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Table des clics/filleuls
CREATE TABLE public.referral_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    godchild_id VARCHAR(20) NOT NULL UNIQUE,
    godchild_phone VARCHAR(20),
    source VARCHAR(50) DEFAULT 'web',
    country_from VARCHAR(50),
    country_to VARCHAR(50),
    transfer_amount DECIMAL(15, 2),
    transfer_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    points_awarded INTEGER DEFAULT 0,
    validated_at TIMESTAMP WITH TIME ZONE,
    validated_by UUID,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

-- Table de l'historique des points
CREATE TABLE public.points_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
    referral_click_id UUID REFERENCES public.referral_clicks(id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

-- Table des récompenses disponibles
CREATE TABLE public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    reward_value DECIMAL(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Table des récompenses réclamées
CREATE TABLE public.reward_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reward_claims ENABLE ROW LEVEL SECURITY;

-- Index pour performance
CREATE INDEX idx_referral_clicks_sponsor ON public.referral_clicks(sponsor_id);
CREATE INDEX idx_referral_clicks_status ON public.referral_clicks(transfer_status);
CREATE INDEX idx_referral_clicks_code ON public.referral_clicks(referral_code);
CREATE INDEX idx_points_history_sponsor ON public.points_history(sponsor_id);

-- Trigger pour updated_at
CREATE TRIGGER update_sponsors_updated_at
    BEFORE UPDATE ON public.sponsors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referral_clicks_updated_at
    BEFORE UPDATE ON public.referral_clicks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies pour sponsors (lecture publique pour vérification code, écriture limitée)
CREATE POLICY "Anyone can check if referral code exists"
    ON public.sponsors FOR SELECT
    USING (is_active = true AND is_blocked = false);

CREATE POLICY "Anyone can register as sponsor"
    ON public.sponsors FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Sponsors can update their own data"
    ON public.sponsors FOR UPDATE
    USING (phone_number = phone_number);

-- RLS Policies pour referral_clicks
CREATE POLICY "Anyone can create referral click"
    ON public.referral_clicks FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can view referral clicks"
    ON public.referral_clicks FOR SELECT
    USING (true);

CREATE POLICY "Admins can update referral clicks"
    ON public.referral_clicks FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies pour points_history
CREATE POLICY "Anyone can view points history"
    ON public.points_history FOR SELECT
    USING (true);

CREATE POLICY "System can insert points"
    ON public.points_history FOR INSERT
    WITH CHECK (true);

-- RLS Policies pour rewards
CREATE POLICY "Anyone can view active rewards"
    ON public.rewards FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage rewards"
    ON public.rewards FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies pour reward_claims
CREATE POLICY "Sponsors can view their claims"
    ON public.reward_claims FOR SELECT
    USING (true);

CREATE POLICY "Anyone can create claim"
    ON public.reward_claims FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can update claims"
    ON public.reward_claims FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS pour user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Fonction pour générer un code parrain unique
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS VARCHAR(20)
LANGUAGE plpgsql
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

-- Fonction pour valider un transfert et attribuer les points
CREATE OR REPLACE FUNCTION public.validate_transfer(
    _click_id UUID,
    _transfer_amount DECIMAL,
    _admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _sponsor_id UUID;
    _points_to_award INTEGER := 10;
BEGIN
    -- Vérifier que l'admin a le rôle
    IF NOT public.has_role(_admin_id, 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required';
    END IF;

    -- Récupérer le sponsor_id
    SELECT sponsor_id INTO _sponsor_id FROM public.referral_clicks WHERE id = _click_id;
    
    IF _sponsor_id IS NULL THEN
        RAISE EXCEPTION 'Referral click not found';
    END IF;

    -- Mettre à jour le clic
    UPDATE public.referral_clicks
    SET transfer_status = 'validated',
        transfer_amount = _transfer_amount,
        points_awarded = _points_to_award,
        validated_at = NOW(),
        validated_by = _admin_id
    WHERE id = _click_id AND transfer_status != 'validated';

    -- Ajouter les points au parrain
    UPDATE public.sponsors
    SET total_points = total_points + _points_to_award,
        total_validated = total_validated + 1
    WHERE id = _sponsor_id;

    -- Enregistrer l'historique des points
    INSERT INTO public.points_history (sponsor_id, referral_click_id, points, reason)
    VALUES (_sponsor_id, _click_id, _points_to_award, 'Transfert validé');

    RETURN TRUE;
END;
$$;

-- Insérer quelques récompenses par défaut
INSERT INTO public.rewards (name, description, points_required, reward_type, reward_value) VALUES
('Réduction 5%', 'Réduction de 5% sur les frais de votre prochain transfert', 50, 'discount_percentage', 5),
('Réduction 10%', 'Réduction de 10% sur les frais de votre prochain transfert', 100, 'discount_percentage', 10),
('Cashback 1000 FCFA', 'Recevez 1000 FCFA de cashback', 150, 'cashback', 1000),
('Transfert gratuit', 'Un transfert sans frais (jusqu''à 50 000 FCFA)', 200, 'free_transfer', 50000),
('Bonus VIP', 'Statut VIP pour 1 mois + transfert gratuit', 500, 'vip_status', 1);