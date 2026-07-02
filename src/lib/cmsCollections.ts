import { supabase } from "@/integrations/supabase/client";

export const CMS_COLLECTION_PREFIX = "CMS_CONTENT::";
export type CmsCollectionType = "team" | "testimonial" | "proof";

export type CmsCollectionItem = {
  id?: string;
  type: CmsCollectionType;
  title: string;
  imageUrl: string;
  subtitle: string;
  description: string;
  badge?: string;
  rating?: number;
  isActive: boolean;
  sortOrder: number;
};

type AdBannerRow = {
  id?: string;
  title: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const titlePrefix = (type: CmsCollectionType) => `${CMS_COLLECTION_PREFIX}${type}::`;

const safeParseMeta = (value?: string | null) => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { description: value };
  }
};

export const cmsCollectionTitle = (type: CmsCollectionType, title: string) => `${titlePrefix(type)}${title.trim()}`;

export const adRowToCmsItem = (row: AdBannerRow, fallbackType: CmsCollectionType): CmsCollectionItem => {
  const type = (row.title.match(/^CMS_CONTENT::([^:]+)::/)?.[1] as CmsCollectionType) || fallbackType;
  const meta = safeParseMeta(row.link_url) as Record<string, string | number | boolean>;

  return {
    id: row.id,
    type,
    title: row.title.replace(titlePrefix(type), ""),
    imageUrl: row.image_url || "",
    subtitle: String(meta.subtitle || ""),
    description: String(meta.description || ""),
    badge: String(meta.badge || ""),
    rating: Number(meta.rating || 5),
    isActive: row.is_active,
    sortOrder: Number(row.sort_order || 0),
  };
};

export const cmsItemToAdPayload = (item: CmsCollectionItem) => ({
  title: cmsCollectionTitle(item.type, item.title),
  image_url: item.imageUrl || "/og-dynamik-transfert.png",
  link_url: JSON.stringify({
    subtitle: item.subtitle || "",
    description: item.description || "",
    badge: item.badge || "",
    rating: Number(item.rating || 5),
  }),
  is_active: item.isActive,
  sort_order: Number(item.sortOrder || 0),
});

export const fetchCmsCollection = async (type: CmsCollectionType, activeOnly = true): Promise<CmsCollectionItem[]> => {
  let query = supabase
    .from("ad_banners")
    .select("id,title,image_url,link_url,is_active,sort_order")
    .like("title", `${titlePrefix(type)}%`)
    .order("sort_order", { ascending: true });

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) return [];
  return ((data || []) as AdBannerRow[]).map((row) => adRowToCmsItem(row, type));
};

export const fetchCmsCollections = async (activeOnly = true) => {
  const [team, testimonials, proofs] = await Promise.all([
    fetchCmsCollection("team", activeOnly),
    fetchCmsCollection("testimonial", activeOnly),
    fetchCmsCollection("proof", activeOnly),
  ]);

  return { team, testimonials, proofs };
};
