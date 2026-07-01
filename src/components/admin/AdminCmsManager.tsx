import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { SITE_TEXT_FIELDS, SiteContentMap, cacheSiteContent, defaultSiteContent, fetchRemoteSiteContent, CMS_TEXT_AD_PREFIX } from "@/lib/siteContent";

type PromoRow = {
  id?: string;
  code: string;
  type: string;
  discount_percentage: number;
  ambassador_name: string | null;
  partner_phone?: string | null;
  partner_name?: string | null;
  is_active: boolean;
};

type AdRow = {
  id?: string;
  title: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const emptyPromo: PromoRow = {
  code: "",
  type: "ambassador",
  discount_percentage: 10,
  ambassador_name: "",
  partner_phone: "",
  partner_name: "",
  is_active: true,
};

const emptyAd: AdRow = {
  title: "",
  image_url: "",
  link_url: "",
  is_active: true,
  sort_order: 10,
};

const AdminCmsManager = () => {
  const [siteTexts, setSiteTexts] = useState<SiteContentMap>(defaultSiteContent);
  const [promos, setPromos] = useState<PromoRow[]>([]);
  const [ads, setAds] = useState<AdRow[]>([]);
  const [newPromo, setNewPromo] = useState<PromoRow>(emptyPromo);
  const [newAd, setNewAd] = useState<AdRow>(emptyAd);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadCms = async () => {
    const [remoteTexts, { data: promoData }, { data: adData }] = await Promise.all([
      fetchRemoteSiteContent(),
      supabase
        .from("promo_codes")
        .select("id,code,type,discount_percentage,ambassador_name,partner_phone,partner_name,is_active")
        .order("created_at", { ascending: false }),
      supabase
        .from("ad_banners")
        .select("id,title,image_url,link_url,is_active,sort_order")
        .eq("is_active", true)
        .not("title", "like", "CMS_TEXT::%")
        .order("sort_order", { ascending: true }),
    ]);

    if (remoteTexts) {
      setSiteTexts(remoteTexts);
      cacheSiteContent(remoteTexts);
    }

    setPromos((promoData || []) as PromoRow[]);
    setAds((adData || []) as AdRow[]);
  };

  useEffect(() => {
    loadCms();
  }, []);

  const updatePromoLocal = (index: number, patch: Partial<PromoRow>) => {
    setPromos((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const updateSiteTextLocal = (key: string, value: string) => {
    setSiteTexts((current) => ({ ...current, [key]: value }));
  };

  const saveSiteTexts = async () => {
    setIsSaving(true);
    const payload = SITE_TEXT_FIELDS.map((field, index) => ({
      key: field.key,
      page: field.page,
      label: field.label,
      value: siteTexts[field.key] ?? field.defaultValue,
      default_value: field.defaultValue,
      is_multiline: Boolean(field.multiline),
      sort_order: index,
      is_active: true,
    }));

    const { error } = await supabase
      .from("site_texts" as never)
      .upsert(payload as never, { onConflict: "key" });

    if (error) {
      const fallbackRows = SITE_TEXT_FIELDS.map((field, index) => ({
        title: `${CMS_TEXT_AD_PREFIX}${field.key}`,
        image_url: siteTexts[field.key] ?? field.defaultValue,
        link_url: field.label,
        is_active: true,
        sort_order: 9000 + index,
      }));

      const deleteResult = await supabase
        .from("ad_banners")
        .delete()
        .like("title", `${CMS_TEXT_AD_PREFIX}%`);

      if (deleteResult.error) {
        setIsSaving(false);
        toast({ title: "Erreur textes CMS", description: deleteResult.error.message, variant: "destructive" });
        return;
      }

      const insertResult = await supabase.from("ad_banners").insert(fallbackRows);
      setIsSaving(false);

      if (insertResult.error) {
        toast({ title: "Erreur textes CMS", description: insertResult.error.message, variant: "destructive" });
        return;
      }

      cacheSiteContent(siteTexts);
      toast({ title: "Textes du site enregistrés", description: "Sauvegarde active via stockage CMS compatible." });
      loadCms();
      return;
    }

    setIsSaving(false);
    cacheSiteContent(siteTexts);
    toast({ title: "Textes du site enregistrés", description: "Les pages publiques utilisent maintenant ces textes." });
    loadCms();
  };

  const resetSiteTexts = () => {
    setSiteTexts(defaultSiteContent);
    cacheSiteContent(defaultSiteContent);
    toast({ title: "Textes remis par défaut", description: "Cliquez sur Enregistrer pour publier ce retour." });
  };

  const updateAdLocal = (index: number, patch: Partial<AdRow>) => {
    setAds((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const savePromo = async (promo: PromoRow) => {
    setIsSaving(true);
    const payload = {
      code: promo.code.trim().toUpperCase(),
      type: promo.type || "ambassador",
      discount_percentage: Number(promo.discount_percentage) || 0,
      ambassador_name: promo.partner_name || promo.ambassador_name || null,
      partner_name: promo.partner_name || promo.ambassador_name || null,
      partner_phone: promo.partner_phone || null,
      is_active: promo.is_active,
    };

    const query = promo.id
      ? supabase.from("promo_codes").update(payload).eq("id", promo.id)
      : supabase.from("promo_codes").insert(payload);

    const { error } = await query;
    setIsSaving(false);

    if (error) {
      toast({ title: "Erreur CMS", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Code promo enregistré" });
    setNewPromo(emptyPromo);
    loadCms();
  };

  const saveAd = async (ad: AdRow) => {
    setIsSaving(true);
    const payload = {
      title: ad.title.trim(),
      image_url: ad.image_url.trim(),
      link_url: ad.link_url?.trim() || null,
      is_active: ad.is_active,
      sort_order: Number(ad.sort_order) || 0,
    };

    const query = ad.id ? supabase.from("ad_banners").update(payload).eq("id", ad.id) : supabase.from("ad_banners").insert(payload);
    const { error } = await query;
    setIsSaving(false);

    if (error) {
      toast({ title: "Erreur annonce", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Annonce enregistrée" });
    setNewAd(emptyAd);
    loadCms();
  };

  const deleteAd = async (ad: AdRow) => {
    if (!ad.id) return;
    const { error } = await supabase.from("ad_banners").delete().eq("id", ad.id);
    if (error) {
      toast({ title: "Erreur suppression", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Annonce supprimée" });
    loadCms();
  };

  const siteTextPages = Array.from(new Set(SITE_TEXT_FIELDS.map((field) => field.page)));

  return (
    <div className="space-y-8">
      <Card className="border-violet-200 bg-gradient-to-br from-white to-violet-50/60">
        <CardHeader className="gap-3 md:flex md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>CMS modification des textes du site</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Modifiez ici les textes visibles sur toutes les pages publiques : accueil, crypto, partenariats, offres, à propos, FAQ, réclamations, termes, ambassadeurs, parrainage et pied de page. Après sauvegarde, le site public affiche les nouveaux textes.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={resetSiteTexts} disabled={isSaving}>Remettre par défaut</Button>
            <Button onClick={saveSiteTexts} disabled={isSaving} className="bg-slate-950 text-white hover:bg-slate-800">
              <Save className="h-4 w-4" /> Enregistrer les textes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {siteTextPages.map((page) => (
            <div key={page} className="rounded-3xl border bg-white/80 p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-950">{page}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {SITE_TEXT_FIELDS.filter((field) => field.page === page).map((field) => (
                  <div key={field.key} className={field.multiline ? "space-y-2 md:col-span-2" : "space-y-2"}>
                    <Label>{field.label}</Label>
                    {field.multiline ? (
                      <Textarea
                        value={siteTexts[field.key] ?? field.defaultValue}
                        onChange={(event) => updateSiteTextLocal(field.key, event.target.value)}
                        className="min-h-[96px] bg-white"
                      />
                    ) : (
                      <Input
                        value={siteTexts[field.key] ?? field.defaultValue}
                        onChange={(event) => updateSiteTextLocal(field.key, event.target.value)}
                        className="bg-white"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">Clé technique : {field.key}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CMS codes promo / partenaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 rounded-2xl border bg-muted/30 p-4 md:grid-cols-6">
            <div className="space-y-1 md:col-span-1">
              <Label>Code</Label>
              <Input value={newPromo.code} onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })} placeholder="CODE" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Nom partenaire</Label>
              <Input value={newPromo.partner_name || ""} onChange={(e) => setNewPromo({ ...newPromo, partner_name: e.target.value, ambassador_name: e.target.value })} placeholder="Nom complet" />
            </div>
            <div className="space-y-1 md:col-span-1">
              <Label>Numéro</Label>
              <Input value={newPromo.partner_phone || ""} onChange={(e) => setNewPromo({ ...newPromo, partner_phone: e.target.value })} placeholder="WhatsApp" />
            </div>
            <div className="space-y-1 md:col-span-1">
              <Label>Réduction %</Label>
              <Input type="number" value={newPromo.discount_percentage} onChange={(e) => setNewPromo({ ...newPromo, discount_percentage: Number(e.target.value) })} />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => savePromo(newPromo)} disabled={isSaving || !newPromo.code}>
                <Plus className="h-4 w-4" /> Ajouter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom partenaire</TableHead>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Réduction</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos.map((promo, index) => (
                  <TableRow key={promo.id || promo.code}>
                    <TableCell><Input value={promo.code} onChange={(e) => updatePromoLocal(index, { code: e.target.value })} /></TableCell>
                    <TableCell><Input value={promo.partner_name || promo.ambassador_name || ""} onChange={(e) => updatePromoLocal(index, { partner_name: e.target.value, ambassador_name: e.target.value })} /></TableCell>
                    <TableCell><Input value={promo.partner_phone || ""} onChange={(e) => updatePromoLocal(index, { partner_phone: e.target.value })} /></TableCell>
                    <TableCell><Input type="number" value={promo.discount_percentage} onChange={(e) => updatePromoLocal(index, { discount_percentage: Number(e.target.value) })} /></TableCell>
                    <TableCell><Switch checked={promo.is_active} onCheckedChange={(checked) => updatePromoLocal(index, { is_active: checked })} /></TableCell>
                    <TableCell><Button size="sm" onClick={() => savePromo(promo)} disabled={isSaving}><Save className="h-4 w-4" /> Sauver</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImagePlus className="h-5 w-5" /> CMS annonces accueil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 rounded-2xl border bg-muted/30 p-4 md:grid-cols-6">
            <div className="space-y-1 md:col-span-1"><Label>Titre</Label><Input value={newAd.title} onChange={(e) => setNewAd({ ...newAd, title: e.target.value })} /></div>
            <div className="space-y-1 md:col-span-2"><Label>URL image</Label><Input value={newAd.image_url} onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })} placeholder="https://...jpg" /></div>
            <div className="space-y-1 md:col-span-2"><Label>Lien clic</Label><Input value={newAd.link_url || ""} onChange={(e) => setNewAd({ ...newAd, link_url: e.target.value })} placeholder="/partenariats" /></div>
            <div className="flex items-end"><Button className="w-full" onClick={() => saveAd(newAd)} disabled={isSaving || !newAd.title || !newAd.image_url}><Plus className="h-4 w-4" /> Ajouter</Button></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {ads.map((ad, index) => (
              <div key={ad.id || index} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[160px_1fr]">
                <img src={ad.image_url} alt={ad.title} className="h-28 w-full rounded-xl object-cover bg-muted" />
                <div className="space-y-3">
                  <Input value={ad.title} onChange={(e) => updateAdLocal(index, { title: e.target.value })} />
                  <Input value={ad.image_url} onChange={(e) => updateAdLocal(index, { image_url: e.target.value })} />
                  <Input value={ad.link_url || ""} onChange={(e) => updateAdLocal(index, { link_url: e.target.value })} />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2"><Switch checked={ad.is_active} onCheckedChange={(checked) => updateAdLocal(index, { is_active: checked })} /><span className="text-sm">Actif</span></div>
                    <Input className="w-20" type="number" value={ad.sort_order} onChange={(e) => updateAdLocal(index, { sort_order: Number(e.target.value) })} />
                    <Button size="sm" onClick={() => saveAd(ad)} disabled={isSaving}><Save className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteAd(ad)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCmsManager;
