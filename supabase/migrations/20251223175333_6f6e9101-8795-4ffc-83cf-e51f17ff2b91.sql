-- Ajouter colonnes pour le tracking des niveaux et volumes
ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS monthly_volume numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_volume_reset_at timestamp with time zone DEFAULT date_trunc('month', now()),
ADD COLUMN IF NOT EXISTS cumulative_volume numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_level varchar(20) DEFAULT 'starter',
ADD COLUMN IF NOT EXISTS is_vip_godchild boolean DEFAULT false;

-- Créer une fonction pour calculer les points selon le montant
CREATE OR REPLACE FUNCTION public.calculate_points_for_amount(_amount numeric)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF _amount >= 500000 THEN
        RETURN 150;
    ELSIF _amount >= 250001 THEN
        RETURN 70;
    ELSIF _amount >= 100001 THEN
        RETURN 30;
    ELSIF _amount >= 50001 THEN
        RETURN 12;
    ELSIF _amount >= 20001 THEN
        RETURN 5;
    ELSIF _amount >= 5000 THEN
        RETURN 2;
    ELSE
        RETURN 0;
    END IF;
END;
$$;

-- Créer une fonction pour obtenir le multiplicateur selon le type de filleul
CREATE OR REPLACE FUNCTION public.get_referral_multiplier(_is_vip_godchild boolean)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF _is_vip_godchild THEN
        RETURN 2.0;  -- Filleul VIP
    ELSE
        RETURN 1.5;  -- Filleul normal
    END IF;
END;
$$;

-- Créer une fonction pour calculer le bonus de niveau
CREATE OR REPLACE FUNCTION public.get_level_bonus_percentage(_monthly_volume numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF _monthly_volume >= 10000000 THEN
        RETURN 0.25;  -- Elite: +25%
    ELSIF _monthly_volume >= 3000000 THEN
        RETURN 0.20;  -- VIP: +20%
    ELSIF _monthly_volume >= 1000000 THEN
        RETURN 0.10;  -- Ambassadeur: +10%
    ELSIF _monthly_volume >= 250000 THEN
        RETURN 0.05;  -- Active: +5%
    ELSE
        RETURN 0;     -- Starter: pas de bonus
    END IF;
END;
$$;

-- Créer une fonction pour déterminer le niveau
CREATE OR REPLACE FUNCTION public.calculate_sponsor_level(_monthly_volume numeric)
RETURNS varchar
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF _monthly_volume >= 10000000 THEN
        RETURN 'elite';
    ELSIF _monthly_volume >= 3000000 THEN
        RETURN 'vip';
    ELSIF _monthly_volume >= 1000000 THEN
        RETURN 'ambassadeur';
    ELSIF _monthly_volume >= 250000 THEN
        RETURN 'active';
    ELSE
        RETURN 'starter';
    END IF;
END;
$$;

-- Créer une fonction pour vérifier et attribuer les bonus de palier
CREATE OR REPLACE FUNCTION public.check_and_award_milestone_bonus(_sponsor_id uuid, _old_cumulative numeric, _new_cumulative numeric)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _bonus_points integer := 0;
BEGIN
    -- Palier 100 000 FCFA: +10 pts
    IF _old_cumulative < 100000 AND _new_cumulative >= 100000 THEN
        _bonus_points := _bonus_points + 10;
        INSERT INTO public.points_history (sponsor_id, points, reason)
        VALUES (_sponsor_id, 10, 'Bonus palier 100 000 FCFA atteint');
    END IF;
    
    -- Palier 500 000 FCFA: +25 pts
    IF _old_cumulative < 500000 AND _new_cumulative >= 500000 THEN
        _bonus_points := _bonus_points + 25;
        INSERT INTO public.points_history (sponsor_id, points, reason)
        VALUES (_sponsor_id, 25, 'Bonus palier 500 000 FCFA atteint');
    END IF;
    
    -- Palier 1 000 000 FCFA: +50 pts
    IF _old_cumulative < 1000000 AND _new_cumulative >= 1000000 THEN
        _bonus_points := _bonus_points + 50;
        INSERT INTO public.points_history (sponsor_id, points, reason)
        VALUES (_sponsor_id, 50, 'Bonus palier 1 000 000 FCFA atteint');
    END IF;
    
    -- Palier 5 000 000 FCFA: transfert gratuit (on ajoute 180 pts équivalent)
    IF _old_cumulative < 5000000 AND _new_cumulative >= 5000000 THEN
        _bonus_points := _bonus_points + 180;
        INSERT INTO public.points_history (sponsor_id, points, reason)
        VALUES (_sponsor_id, 180, 'Bonus palier 5 000 000 FCFA - Transfert gratuit offert');
    END IF;
    
    RETURN _bonus_points;
END;
$$;

-- Mettre à jour la fonction validate_transfer avec le nouveau système
CREATE OR REPLACE FUNCTION public.validate_transfer(_admin_id uuid, _click_id uuid, _transfer_amount numeric)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _sponsor_id UUID;
    _sponsor_monthly_volume numeric;
    _sponsor_cumulative_volume numeric;
    _base_points INTEGER;
    _multiplier numeric;
    _level_bonus numeric;
    _final_points INTEGER;
    _milestone_bonus INTEGER;
    _new_level varchar;
    _is_vip boolean;
    _monthly_reset_at timestamp with time zone;
BEGIN
    -- Vérifier que l'admin a le rôle
    IF NOT public.has_role(_admin_id, 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required';
    END IF;

    -- Récupérer les infos du sponsor
    SELECT rc.sponsor_id INTO _sponsor_id 
    FROM public.referral_clicks rc 
    WHERE rc.id = _click_id;
    
    IF _sponsor_id IS NULL THEN
        RAISE EXCEPTION 'Referral click not found';
    END IF;

    -- Récupérer les volumes actuels du sponsor
    SELECT 
        monthly_volume,
        cumulative_volume,
        monthly_volume_reset_at,
        COALESCE(is_vip_godchild, false)
    INTO _sponsor_monthly_volume, _sponsor_cumulative_volume, _monthly_reset_at, _is_vip
    FROM public.sponsors 
    WHERE id = _sponsor_id;

    -- Reset mensuel si nécessaire
    IF _monthly_reset_at < date_trunc('month', now()) THEN
        _sponsor_monthly_volume := 0;
    END IF;

    -- Calculer les points de base selon le montant
    _base_points := public.calculate_points_for_amount(_transfer_amount);
    
    -- Appliquer le multiplicateur parrainage (filleul = 1.5x, VIP = 2x)
    _multiplier := public.get_referral_multiplier(_is_vip);
    
    -- Appliquer le bonus de niveau
    _level_bonus := public.get_level_bonus_percentage(_sponsor_monthly_volume + _transfer_amount);
    
    -- Calcul final des points
    _final_points := CEIL(_base_points * _multiplier * (1 + _level_bonus));
    
    -- Vérifier les bonus de palier
    _milestone_bonus := public.check_and_award_milestone_bonus(
        _sponsor_id, 
        _sponsor_cumulative_volume, 
        _sponsor_cumulative_volume + _transfer_amount
    );
    
    -- Total des points
    _final_points := _final_points + _milestone_bonus;
    
    -- Calculer le nouveau niveau
    _new_level := public.calculate_sponsor_level(_sponsor_monthly_volume + _transfer_amount);

    -- Mettre à jour le clic
    UPDATE public.referral_clicks
    SET transfer_status = 'validated',
        transfer_amount = _transfer_amount,
        points_awarded = _final_points,
        validated_at = NOW(),
        validated_by = _admin_id
    WHERE id = _click_id AND transfer_status != 'validated';

    -- Mettre à jour le sponsor
    UPDATE public.sponsors
    SET total_points = total_points + _final_points,
        total_validated = total_validated + 1,
        monthly_volume = CASE 
            WHEN monthly_volume_reset_at < date_trunc('month', now()) 
            THEN _transfer_amount 
            ELSE monthly_volume + _transfer_amount 
        END,
        monthly_volume_reset_at = CASE 
            WHEN monthly_volume_reset_at < date_trunc('month', now()) 
            THEN date_trunc('month', now()) 
            ELSE monthly_volume_reset_at 
        END,
        cumulative_volume = cumulative_volume + _transfer_amount,
        current_level = _new_level
    WHERE id = _sponsor_id;

    -- Enregistrer l'historique des points (hors bonus palier déjà enregistrés)
    INSERT INTO public.points_history (sponsor_id, referral_click_id, points, reason)
    VALUES (
        _sponsor_id, 
        _click_id, 
        _final_points - _milestone_bonus, 
        'Transfert validé: ' || _transfer_amount || ' FCFA (x' || _multiplier || ' filleul, +' || (_level_bonus * 100) || '% niveau)'
    );

    RETURN TRUE;
END;
$$;

-- Supprimer les anciennes récompenses et insérer les nouvelles
DELETE FROM public.rewards;

INSERT INTO public.rewards (name, description, points_required, reward_type, reward_value, is_active) VALUES
('Réduction 5% frais', 'Réduction de 5% sur les frais de votre prochain transfert', 40, 'fee_discount', 5, true),
('Réduction 10% frais', 'Réduction de 10% sur les frais de votre prochain transfert', 80, 'fee_discount', 10, true),
('Cashback 1 000 FCFA', 'Recevez 1 000 FCFA de cashback', 120, 'cashback', 1000, true),
('Cashback 3 000 FCFA', 'Recevez 3 000 FCFA de cashback', 250, 'cashback', 3000, true),
('Transfert gratuit ≤ 50k', 'Un transfert gratuit jusqu''à 50 000 FCFA', 180, 'free_transfer', 50000, true),
('Transfert gratuit ≤ 200k', 'Un transfert gratuit jusqu''à 200 000 FCFA', 400, 'free_transfer', 200000, true),
('Statut VIP 1 mois', 'Profitez du statut VIP pendant 1 mois (+20% points)', 500, 'vip_status', 1, true);