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
