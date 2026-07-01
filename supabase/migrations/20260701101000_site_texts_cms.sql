-- Editable public site texts for the admin CMS.

CREATE TABLE IF NOT EXISTS public.site_texts (
  key text PRIMARY KEY,
  page text NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  default_value text NOT NULL,
  is_multiline boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_texts' AND policyname = 'Anyone can view active site texts'
  ) THEN
    CREATE POLICY "Anyone can view active site texts"
    ON public.site_texts
    FOR SELECT
    USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_texts' AND policyname = 'Admins can manage site texts'
  ) THEN
    CREATE POLICY "Admins can manage site texts"
    ON public.site_texts
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS update_site_texts_updated_at ON public.site_texts;
CREATE TRIGGER update_site_texts_updated_at
BEFORE UPDATE ON public.site_texts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_texts (key, page, label, value, default_value, is_multiline, sort_order)
VALUES
  ('home.hero.eyebrow', 'Accueil', 'Hero — petit texte au-dessus du titre', 'TRANSFERTS USDT & MOBILE MONEY EN AFRIQUE', 'TRANSFERTS USDT & MOBILE MONEY EN AFRIQUE', false, 0),
  ('home.hero.title.part1', 'Accueil', 'Hero — titre partie 1', 'Envoyez.', 'Envoyez.', false, 1),
  ('home.hero.title.part2', 'Accueil', 'Hero — titre partie 2 accentuée', 'Recevez.', 'Recevez.', false, 2),
  ('home.hero.title.part3', 'Accueil', 'Hero — titre partie 3', 'Multipliez.', 'Multipliez.', false, 3),
  ('home.hero.subtitle', 'Accueil', 'Hero — description principale', 'DYNAMIK TRANSFERT accompagne les transferts FCFA, les échanges USDT et les paiements Mobile Money avec un parcours clair, un suivi WhatsApp et une validation humaine.', 'DYNAMIK TRANSFERT accompagne les transferts FCFA, les échanges USDT et les paiements Mobile Money avec un parcours clair, un suivi WhatsApp et une validation humaine.', true, 4),
  ('home.hero.cta.primary', 'Accueil', 'Hero — bouton principal', 'Calculer mes frais', 'Calculer mes frais', false, 5),
  ('home.hero.cta.crypto', 'Accueil', 'Hero — bouton crypto', 'Crypto vers FCFA', 'Crypto vers FCFA', false, 6),
  ('home.partnership.eyebrow', 'Accueil', 'Section partenariats — petit titre', 'Partenariats', 'Partenariats', false, 7),
  ('home.partnership.title', 'Accueil', 'Section partenariats — titre', 'Accès rapide au programme partenaires.', 'Accès rapide au programme partenaires.', false, 8),
  ('home.partnership.subtitle', 'Accueil', 'Section partenariats — description', 'Créez votre lien, utilisez un code actif ou contactez DYNAMIK pour devenir partenaire.', 'Créez votre lien, utilisez un code actif ou contactez DYNAMIK pour devenir partenaire.', true, 9),
  ('home.ambassadors.eyebrow', 'Accueil', 'Section ambassadeurs — petit titre', 'Ambassadeurs DYNAMIK', 'Ambassadeurs DYNAMIK', false, 10),
  ('home.ambassadors.title', 'Accueil', 'Section ambassadeurs — titre', 'Utilisez directement les codes partenaires actifs.', 'Utilisez directement les codes partenaires actifs.', false, 11),
  ('home.ambassadors.subtitle', 'Accueil', 'Section ambassadeurs — description', 'Copiez un code actif, partagez-le à vos proches ou demandez votre propre lien partenaire.', 'Copiez un code actif, partagez-le à vos proches ou demandez votre propre lien partenaire.', true, 12),
  ('home.services.eyebrow', 'Accueil', 'Section services — badge', 'Services DYNAMIK', 'Services DYNAMIK', false, 13),
  ('home.services.title', 'Accueil', 'Section services — titre', 'Tout pour envoyer, recevoir et suivre votre transfert.', 'Tout pour envoyer, recevoir et suivre votre transfert.', false, 14),
  ('home.services.subtitle', 'Accueil', 'Section services — description', 'Choisissez le service qui vous concerne, simulez votre opération et finalisez avec DYNAMIK sur WhatsApp.', 'Choisissez le service qui vous concerne, simulez votre opération et finalisez avec DYNAMIK sur WhatsApp.', true, 15),
  ('offer.hero.eyebrow', 'Offres', 'Offres — badge hero', 'Offres DYNAMIK TRANSFERT', 'Offres DYNAMIK TRANSFERT', false, 16),
  ('offer.hero.title', 'Offres', 'Offres — titre hero', 'Les promotions, tarifs clés et services USDT au même endroit.', 'Les promotions, tarifs clés et services USDT au même endroit.', false, 17),
  ('offer.hero.subtitle', 'Offres', 'Offres — description hero', 'Choisissez une offre, simulez votre transfert, puis finalisez directement avec l’équipe DYNAMIK sur WhatsApp.', 'Choisissez une offre, simulez votre transfert, puis finalisez directement avec l’équipe DYNAMIK sur WhatsApp.', true, 18),
  ('offer.trust.eyebrow', 'Offres', 'Offres — section confiance petit titre', 'Pourquoi choisir DYNAMIK', 'Pourquoi choisir DYNAMIK', false, 19),
  ('offer.trust.title', 'Offres', 'Offres — section confiance titre', 'Rapide, sécurisé et confirmé avant action.', 'Rapide, sécurisé et confirmé avant action.', false, 20),
  ('offer.trust.subtitle', 'Offres', 'Offres — section confiance description', 'Le site prépare la demande. L’équipe DYNAMIK confirme toujours les détails sensibles sur WhatsApp avant toute opération.', 'Le site prépare la demande. L’équipe DYNAMIK confirme toujours les détails sensibles sur WhatsApp avant toute opération.', true, 21),
  ('footer.description', 'Pied de page', 'Footer — description', 'Transferts FCFA, USDT et Mobile Money avec suivi WhatsApp et validation humaine.', 'Transferts FCFA, USDT et Mobile Money avec suivi WhatsApp et validation humaine.', true, 22),
  ('footer.notice', 'Pied de page', 'Footer — note de sécurité', 'Service accompagné par WhatsApp. Les taux, réseaux et adresses USDT sont confirmés avant paiement.', 'Service accompagné par WhatsApp. Les taux, réseaux et adresses USDT sont confirmés avant paiement.', true, 23),
  ('footer.support.label', 'Pied de page', 'Footer — titre support', 'Support client 24/7', 'Support client 24/7', false, 24),
  ('footer.support.cta', 'Pied de page', 'Footer — bouton support', 'Contactez-nous sur WhatsApp', 'Contactez-nous sur WhatsApp', false, 25)
ON CONFLICT (key) DO NOTHING;
