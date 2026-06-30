import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdBanner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const fallbackAds: AdBanner[] = [
  {
    id: "fallback-1",
    title: "Annonce DYNAMIK",
    image_url: "/og-dynamik-transfert.png",
    link_url: "/partenariats",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "fallback-2",
    title: "Programme partenaires",
    image_url: "/og-dynamik-transfert.png",
    link_url: "/partenariats",
    is_active: true,
    sort_order: 2,
  },
];

const AdMarquee = () => {
  const [ads, setAds] = useState<AdBanner[]>([]);

  useEffect(() => {
    const loadAds = async () => {
      const { data, error } = await supabase
        .from("ad_banners")
        .select("id,title,image_url,link_url,is_active,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data?.length) {
        setAds(data as AdBanner[]);
      }
    };

    loadAds();
  }, []);

  const visibleAds = ads.length ? ads : fallbackAds;
  const marqueeItems = useMemo(() => [...visibleAds, ...visibleAds, ...visibleAds], [visibleAds]);

  return (
    <section id="annonces" className="relative overflow-hidden bg-slate-950 py-16 text-white">
      <style>{`
        @keyframes dynamik-ad-marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,187,0,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.15),transparent_38%)]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Annonces</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Espace publicitaire DYNAMIK</h2>
          <p className="mt-4 text-white/65">
            Affiches, promotions et annonces importantes défilent ici. L’administrateur peut modifier ces visuels sans coder.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        <div className="flex w-max gap-5 px-4" style={{ animation: "dynamik-ad-marquee 38s linear infinite" }}>
          {marqueeItems.map((ad, index) => {
            const card = (
              <div className="h-52 w-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.07] shadow-2xl transition hover:-translate-y-1 md:h-64 md:w-[420px]">
                <img src={ad.image_url} alt={ad.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
            );

            return ad.link_url ? (
              <a key={`${ad.id}-${index}`} href={ad.link_url} className="block" aria-label={ad.title}>
                {card}
              </a>
            ) : (
              <div key={`${ad.id}-${index}`}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdMarquee;
