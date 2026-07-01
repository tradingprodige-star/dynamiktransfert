import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteTextField = {
  key: string;
  page: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
};

export const SITE_TEXT_FIELDS: SiteTextField[] = [
  {
    key: "home.hero.eyebrow",
    page: "Accueil",
    label: "Hero — petit texte au-dessus du titre",
    defaultValue: "TRANSFERTS USDT & MOBILE MONEY EN AFRIQUE",
  },
  {
    key: "home.hero.title.part1",
    page: "Accueil",
    label: "Hero — titre partie 1",
    defaultValue: "Envoyez.",
  },
  {
    key: "home.hero.title.part2",
    page: "Accueil",
    label: "Hero — titre partie 2 accentuée",
    defaultValue: "Recevez.",
  },
  {
    key: "home.hero.title.part3",
    page: "Accueil",
    label: "Hero — titre partie 3",
    defaultValue: "Multipliez.",
  },
  {
    key: "home.hero.subtitle",
    page: "Accueil",
    label: "Hero — description principale",
    defaultValue: "DYNAMIK TRANSFERT accompagne les transferts FCFA, les échanges USDT et les paiements Mobile Money avec un parcours clair, un suivi WhatsApp et une validation humaine.",
    multiline: true,
  },
  {
    key: "home.hero.cta.primary",
    page: "Accueil",
    label: "Hero — bouton principal",
    defaultValue: "Calculer mes frais",
  },
  {
    key: "home.hero.cta.crypto",
    page: "Accueil",
    label: "Hero — bouton crypto",
    defaultValue: "Crypto vers FCFA",
  },
  {
    key: "home.partnership.eyebrow",
    page: "Accueil",
    label: "Section partenariats — petit titre",
    defaultValue: "Partenariats",
  },
  {
    key: "home.partnership.title",
    page: "Accueil",
    label: "Section partenariats — titre",
    defaultValue: "Accès rapide au programme partenaires.",
  },
  {
    key: "home.partnership.subtitle",
    page: "Accueil",
    label: "Section partenariats — description",
    defaultValue: "Créez votre lien, utilisez un code actif ou contactez DYNAMIK pour devenir partenaire.",
    multiline: true,
  },
  {
    key: "home.ambassadors.eyebrow",
    page: "Accueil",
    label: "Section ambassadeurs — petit titre",
    defaultValue: "Ambassadeurs DYNAMIK",
  },
  {
    key: "home.ambassadors.title",
    page: "Accueil",
    label: "Section ambassadeurs — titre",
    defaultValue: "Utilisez directement les codes partenaires actifs.",
  },
  {
    key: "home.ambassadors.subtitle",
    page: "Accueil",
    label: "Section ambassadeurs — description",
    defaultValue: "Copiez un code actif, partagez-le à vos proches ou demandez votre propre lien partenaire.",
    multiline: true,
  },
  {
    key: "home.services.eyebrow",
    page: "Accueil",
    label: "Section services — badge",
    defaultValue: "Services DYNAMIK",
  },
  {
    key: "home.services.title",
    page: "Accueil",
    label: "Section services — titre",
    defaultValue: "Tout pour envoyer, recevoir et suivre votre transfert.",
  },
  {
    key: "home.services.subtitle",
    page: "Accueil",
    label: "Section services — description",
    defaultValue: "Choisissez le service qui vous concerne, simulez votre opération et finalisez avec DYNAMIK sur WhatsApp.",
    multiline: true,
  },
  {
    key: "offer.hero.eyebrow",
    page: "Offres",
    label: "Offres — badge hero",
    defaultValue: "Offres DYNAMIK TRANSFERT",
  },
  {
    key: "offer.hero.title",
    page: "Offres",
    label: "Offres — titre hero",
    defaultValue: "Les promotions, tarifs clés et services USDT au même endroit.",
  },
  {
    key: "offer.hero.subtitle",
    page: "Offres",
    label: "Offres — description hero",
    defaultValue: "Choisissez une offre, simulez votre transfert, puis finalisez directement avec l’équipe DYNAMIK sur WhatsApp.",
    multiline: true,
  },
  {
    key: "offer.trust.eyebrow",
    page: "Offres",
    label: "Offres — section confiance petit titre",
    defaultValue: "Pourquoi choisir DYNAMIK",
  },
  {
    key: "offer.trust.title",
    page: "Offres",
    label: "Offres — section confiance titre",
    defaultValue: "Rapide, sécurisé et confirmé avant action.",
  },
  {
    key: "offer.trust.subtitle",
    page: "Offres",
    label: "Offres — section confiance description",
    defaultValue: "Le site prépare la demande. L’équipe DYNAMIK confirme toujours les détails sensibles sur WhatsApp avant toute opération.",
    multiline: true,
  },
  {
    key: "crypto.hero.eyebrow",
    page: "Crypto",
    label: "Crypto — badge hero",
    defaultValue: "Paiement crypto vers FCFA Mobile Money",
  },
  {
    key: "crypto.hero.title",
    page: "Crypto",
    label: "Crypto — titre hero",
    defaultValue: "Payez en crypto. Le bénéficiaire reçoit en FCFA.",
  },
  {
    key: "crypto.hero.subtitle",
    page: "Crypto",
    label: "Crypto — description hero",
    defaultValue: "USDT propulsé par la technologie de BMIPAY. Choisissez le pays, le réseau Mobile Money et le montant à recevoir ; la demande s’ouvre immédiatement sur WhatsApp pour confirmer l’adresse, le réseau et le QR Code.",
    multiline: true,
  },
  {
    key: "crypto.flow.title",
    page: "Crypto",
    label: "Crypto — titre flux",
    defaultValue: "Wallet crypto → DYNAMIK → Mobile Money",
  },
  {
    key: "partnerships.hero.eyebrow",
    page: "Partenariats",
    label: "Partenariats — badge hero",
    defaultValue: "Opportunités partenaires DYNAMIK",
  },
  {
    key: "partnerships.hero.title",
    page: "Partenariats",
    label: "Partenariats — titre hero",
    defaultValue: "Parrainage, codes promo et partenaires DYNAMIK.",
  },
  {
    key: "partnerships.hero.subtitle",
    page: "Partenariats",
    label: "Partenariats — description hero",
    defaultValue: "Rejoignez le réseau DYNAMIK, partagez vos annonces et suivez les personnes orientées vers nos services de transfert et crypto.",
    multiline: true,
  },
  {
    key: "partnerships.ads.eyebrow",
    page: "Partenariats",
    label: "Partenariats — annonces petit titre",
    defaultValue: "Annonces & opportunités",
  },
  {
    key: "partnerships.ads.title",
    page: "Partenariats",
    label: "Partenariats — annonces titre",
    defaultValue: "Codes, campagnes et contacts partenaires réunis.",
  },
  {
    key: "partnerships.ads.subtitle",
    page: "Partenariats",
    label: "Partenariats — annonces description",
    defaultValue: "Retrouvez les promotions en cours, les codes à partager et les actions utiles : devenir partenaire, utiliser un code ou contacter DYNAMIK sur WhatsApp.",
    multiline: true,
  },
  {
    key: "partnerships.codes.eyebrow",
    page: "Partenariats",
    label: "Partenariats — codes petit titre",
    defaultValue: "Codes promo",
  },
  {
    key: "partnerships.codes.title",
    page: "Partenariats",
    label: "Partenariats — codes titre",
    defaultValue: "Liens de parrainage disponibles",
  },
  {
    key: "partnerships.codes.subtitle",
    page: "Partenariats",
    label: "Partenariats — codes description",
    defaultValue: "Chaque lien applique le code partenaire dans le calculateur et transmet l’information à l’équipe DYNAMIK lors de la finalisation WhatsApp.",
    multiline: true,
  },
  {
    key: "partnerships.cta.title",
    page: "Partenariats",
    label: "Partenariats — CTA titre",
    defaultValue: "Besoin d’un lien personnalisé ?",
  },
  {
    key: "partnerships.cta.subtitle",
    page: "Partenariats",
    label: "Partenariats — CTA description",
    defaultValue: "Inscrivez-vous avec votre nom et votre numéro WhatsApp. L’équipe DYNAMIK vous accompagne ensuite pour activer votre lien et vos annonces.",
    multiline: true,
  },
  {
    key: "about.title",
    page: "À propos",
    label: "À propos — titre principal",
    defaultValue: "À propos de DYNAMIK Transfert",
  },
  {
    key: "about.story.1",
    page: "À propos",
    label: "À propos — histoire paragraphe 1",
    defaultValue: "En 2020, le monde était figé par la crise du Covid. Mais pendant que la planète tournait au ralenti, deux jeunes amis de Lomé décidaient de créer leur propre dynamique :",
    multiline: true,
  },
  {
    key: "about.story.2",
    page: "À propos",
    label: "À propos — histoire paragraphe 2",
    defaultValue: "Une boutique de vêtements en ligne qui connaît un succès, qu'ils baptisent DYNAMIK SHOP.",
    multiline: true,
  },
  {
    key: "about.story.highlight",
    page: "À propos",
    label: "À propos — phrase mise en avant",
    defaultValue: "5 ans plus tard, ils reviennent avec un projet 10 fois plus grand.",
  },
  {
    key: "about.founders.title",
    page: "À propos",
    label: "À propos — titre fondateurs",
    defaultValue: "Corneille & Prodige",
  },
  {
    key: "about.mission.title",
    page: "À propos",
    label: "À propos — titre mission",
    defaultValue: "Notre Mission",
  },
  {
    key: "about.mission.text",
    page: "À propos",
    label: "À propos — texte mission",
    defaultValue: "Démocratiser les transferts d'argent en Afrique plus précisément entre l'Afrique de l'Ouest Et L'Afrique centrale en offrant une solution accessible, transparente et économique.",
    multiline: true,
  },
  {
    key: "about.vision.title",
    page: "À propos",
    label: "À propos — titre vision",
    defaultValue: "Notre Vision",
  },
  {
    key: "about.vision.text",
    page: "À propos",
    label: "À propos — texte vision",
    defaultValue: "Devenir la référence des échanges financiers entre le Gabon, Togo et dans toute la zone BECEAO.",
    multiline: true,
  },
  {
    key: "faq.title",
    page: "FAQ",
    label: "FAQ — titre",
    defaultValue: "Questions Fréquemment Posées",
  },
  {
    key: "faq.subtitle",
    page: "FAQ",
    label: "FAQ — description",
    defaultValue: "Tout ce que vous devez savoir sur DYNAMIK TRANSFERT",
    multiline: true,
  },
  {
    key: "faq.cta.text",
    page: "FAQ",
    label: "FAQ — texte avant bouton",
    defaultValue: "Vous ne trouvez pas la réponse à votre question ?",
  },
  {
    key: "faq.cta.button",
    page: "FAQ",
    label: "FAQ — bouton WhatsApp",
    defaultValue: "Contactez-nous sur WhatsApp",
  },
  {
    key: "complaints.title",
    page: "Réclamations",
    label: "Réclamations — titre",
    defaultValue: "Plaintes et Réclamations",
  },
  {
    key: "complaints.subtitle",
    page: "Réclamations",
    label: "Réclamations — description",
    defaultValue: "Un problème avec votre transfert ? Nous sommes là pour vous aider.",
    multiline: true,
  },
  {
    key: "complaints.card.title",
    page: "Réclamations",
    label: "Réclamations — titre formulaire",
    defaultValue: "Formulaire de réclamation",
  },
  {
    key: "complaints.card.description",
    page: "Réclamations",
    label: "Réclamations — description formulaire",
    defaultValue: "Remplissez ce formulaire et votre réclamation sera automatiquement transmise à notre équipe via WhatsApp.",
    multiline: true,
  },
  {
    key: "complaints.submit",
    page: "Réclamations",
    label: "Réclamations — bouton d’envoi",
    defaultValue: "Envoyer la réclamation via WhatsApp",
  },
  {
    key: "terms.hero.eyebrow",
    page: "Termes",
    label: "Termes — badge hero",
    defaultValue: "Termes et fichiers",
  },
  {
    key: "terms.hero.title",
    page: "Termes",
    label: "Termes — titre hero",
    defaultValue: "Documents DYNAMIK Transfert.",
  },
  {
    key: "terms.hero.subtitle",
    page: "Termes",
    label: "Termes — description hero",
    defaultValue: "Retrouvez les liens des conditions d’utilisation, fichiers et contacts officiels. Pour toute question, l’équipe répond directement sur WhatsApp.",
    multiline: true,
  },
  {
    key: "terms.confirm.title",
    page: "Termes",
    label: "Termes — bloc confirmation titre",
    defaultValue: "Besoin d’une confirmation ?",
  },
  {
    key: "terms.confirm.text",
    page: "Termes",
    label: "Termes — bloc confirmation texte",
    defaultValue: "Les liens, adresses USDT, réseaux et montants à payer sont confirmés avant paiement par WhatsApp.",
    multiline: true,
  },
  {
    key: "ambassadors.title",
    page: "Ambassadeurs",
    label: "Ambassadeurs — titre",
    defaultValue: "Nos Ambassadeurs",
  },
  {
    key: "ambassadors.subtitle",
    page: "Ambassadeurs",
    label: "Ambassadeurs — description",
    defaultValue: "Profitez de codes promo exclusifs avec nos ambassadeurs de confiance",
    multiline: true,
  },
  {
    key: "ambassadors.featured.badge",
    page: "Ambassadeurs",
    label: "Ambassadeurs — badge partenaire officiel",
    defaultValue: "Partenaire Officiel",
  },
  {
    key: "ambassadors.cta.title",
    page: "Ambassadeurs",
    label: "Ambassadeurs — CTA titre",
    defaultValue: "Devenez Ambassadeur DYNAMIK",
  },
  {
    key: "ambassadors.cta.subtitle",
    page: "Ambassadeurs",
    label: "Ambassadeurs — CTA description",
    defaultValue: "Obtenez votre propre code promo et gagnez sur chaque parrainage !",
    multiline: true,
  },
  {
    key: "referral.title",
    page: "Parrainage",
    label: "Parrainage — titre",
    defaultValue: "Programme de Parrainage",
  },
  {
    key: "referral.subtitle",
    page: "Parrainage",
    label: "Parrainage — description",
    defaultValue: "Parrainez vos proches et gagnez des récompenses à chaque transfert effectué",
    multiline: true,
  },
  {
    key: "offer.journey.eyebrow",
    page: "Offres",
    label: "Offres — parcours petit titre",
    defaultValue: "Votre parcours",
  },
  {
    key: "offer.journey.title",
    page: "Offres",
    label: "Offres — parcours titre",
    defaultValue: "Choisissez l’offre, calculez, puis validez sur WhatsApp.",
  },
  {
    key: "offer.journey.subtitle",
    page: "Offres",
    label: "Offres — parcours description",
    defaultValue: "Consultez les promotions actives, lancez une simulation et envoyez votre demande avec une référence claire. L’équipe DYNAMIK confirme ensuite le montant, le réseau et les instructions finales avant tout paiement.",
    multiline: true,
  },
  {
    key: "offer.codes.eyebrow",
    page: "Offres",
    label: "Offres — codes petit titre",
    defaultValue: "Codes partenaires",
  },
  {
    key: "offer.codes.title",
    page: "Offres",
    label: "Offres — codes titre",
    defaultValue: "Les codes actifs restent visibles et actionnables.",
  },
  {
    key: "offer.codes.subtitle",
    page: "Offres",
    label: "Offres — codes description",
    defaultValue: "Ces codes peuvent être saisis dans le calculateur ou partagés via les liens partenaires.",
    multiline: true,
  },
  {
    key: "footer.description",
    page: "Pied de page",
    label: "Footer — description",
    defaultValue: "Transferts FCFA, USDT et Mobile Money avec suivi WhatsApp et validation humaine.",
    multiline: true,
  },
  {
    key: "footer.notice",
    page: "Pied de page",
    label: "Footer — note de sécurité",
    defaultValue: "Service accompagné par WhatsApp. Les taux, réseaux et adresses USDT sont confirmés avant paiement.",
    multiline: true,
  },
  {
    key: "footer.support.label",
    page: "Pied de page",
    label: "Footer — titre support",
    defaultValue: "Support client 24/7",
  },
  {
    key: "footer.support.cta",
    page: "Pied de page",
    label: "Footer — bouton support",
    defaultValue: "Contactez-nous sur WhatsApp",
  },
];

export type SiteContentMap = Record<string, string>;

export const defaultSiteContent = SITE_TEXT_FIELDS.reduce<SiteContentMap>((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

const LOCAL_CACHE_KEY = "dynamik_site_texts_cache";
export const CMS_TEXT_AD_PREFIX = "CMS_TEXT::";

type SiteTextRow = {
  key: string;
  value: string;
};

type CmsTextAdRow = {
  title: string;
  image_url: string;
};

export const mergeSiteContent = (rows?: SiteTextRow[] | null): SiteContentMap => {
  const merged = { ...defaultSiteContent };
  rows?.forEach((row) => {
    if (row.key && typeof row.value === "string") {
      merged[row.key] = row.value;
    }
  });
  return merged;
};

const mapCmsAdRowsToTexts = (rows?: CmsTextAdRow[] | null): SiteTextRow[] =>
  (rows || [])
    .filter((row) => row.title?.startsWith(CMS_TEXT_AD_PREFIX))
    .map((row) => ({
      key: row.title.replace(CMS_TEXT_AD_PREFIX, ""),
      value: row.image_url || "",
    }));

export const fetchRemoteSiteContent = async (): Promise<SiteContentMap | null> => {
  try {
    const { data, error } = await supabase
      .from("site_texts" as never)
      .select("key,value")
      .eq("is_active", true);

    if (!error) return mergeSiteContent((data || []) as unknown as SiteTextRow[]);
  } catch {
    // Try legacy/fallback storage below.
  }

  try {
    const { data, error } = await supabase
      .from("ad_banners")
      .select("title,image_url")
      .eq("is_active", true)
      .like("title", `${CMS_TEXT_AD_PREFIX}%`);

    if (!error && data?.length) {
      return mergeSiteContent(mapCmsAdRowsToTexts(data as CmsTextAdRow[]));
    }
  } catch {
    // Keep cached/default content.
  }

  return null;
};

export const readCachedSiteContent = (): SiteContentMap => {
  if (typeof window === "undefined") return defaultSiteContent;
  try {
    const raw = window.localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return defaultSiteContent;
    const parsed = JSON.parse(raw) as SiteContentMap;
    return { ...defaultSiteContent, ...parsed };
  } catch {
    return defaultSiteContent;
  }
};

export const cacheSiteContent = (content: SiteContentMap) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(content));
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContentMap>(() => readCachedSiteContent());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const remoteContent = await fetchRemoteSiteContent();
        if (!remoteContent) return;

        cacheSiteContent(remoteContent);
        if (mounted) setContent(remoteContent);
      } catch {
        // Public site keeps default/cached text if CMS storage is not reachable.
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const t = useMemo(() => (key: string) => content[key] ?? defaultSiteContent[key] ?? key, [content]);

  return { content, t, isLoading };
};
