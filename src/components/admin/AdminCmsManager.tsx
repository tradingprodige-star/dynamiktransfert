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
import { CmsCollectionItem, CmsCollectionType, adRowToCmsItem, cmsItemToAdPayload, CMS_COLLECTION_PREFIX } from "@/lib/cmsCollections";

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

const emptyCollectionItem = (type: CmsCollectionType, sortOrder = 10): CmsCollectionItem => ({
  type,
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  badge: "",
  rating: 5,
  isActive: true,
  sortOrder,
});

const collectionLabels: Record<CmsCollectionType, { title: string; description: string; titleLabel: string; subtitleLabel: string; imageLabel: string; descriptionLabel: string }> = {
  team: {
    title: "Équipe affichée sur le site",
    description: "Ajoutez les personnes que les visiteurs verront dans la section équipe. Utilisez une photo professionnelle ou laissez le champ image vide.",
    titleLabel: "Nom / rôle affiché",
    subtitleLabel: "Fonction courte",
    imageLabel: "Image profil",
    descriptionLabel: "Description courte",
  },
  testimonial: {
    title: "Avis clients affichés",
    description: "Publiez uniquement des avis prêts à être lus par les visiteurs. Le texte doit parler de l’expérience client, pas du travail interne.",
    titleLabel: "Nom affiché",
    subtitleLabel: "Trajet / type d’opération",
    imageLabel: "Photo client",
    descriptionLabel: "Avis client",
  },
  proof: {
    title: "Preuves client anonymisées",
    description: "Ajoutez des captures de transactions réussies uniquement après avoir flouté les noms, numéros, références et montants privés.",
    titleLabel: "Titre de la capture",
    subtitleLabel: "Libellé / statut",
    imageLabel: "Capture d’écran",
    descriptionLabel: "Texte sous la capture",
  },
};

const AdminCmsManager = () => {
  const [siteTexts, setSiteTexts] = useState<SiteContentMap>(defaultSiteContent);
  const [promos, setPromos] = useState<PromoRow[]>([]);
  const [ads, setAds] = useState<AdRow[]>([]);
  const [teamItems, setTeamItems] = useState<CmsCollectionItem[]>([]);
  const [testimonialItems, setTestimonialItems] = useState<CmsCollectionItem[]>([]);
  const [proofItems, setProofItems] = useState<CmsCollectionItem[]>([]);
  const [newTeamItem, setNewTeamItem] = useState<CmsCollectionItem>(emptyCollectionItem("team"));
  const [newTestimonialItem, setNewTestimonialItem] = useState<CmsCollectionItem>(emptyCollectionItem("testimonial"));
  const [newProofItem, setNewProofItem] = useState<CmsCollectionItem>(emptyCollectionItem("proof"));
  const [newPromo, setNewPromo] = useState<PromoRow>(emptyPromo);
  const [newAd, setNewAd] = useState<AdRow>(emptyAd);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadCms = async () => {
    const [remoteTexts, { data: promoData }, { data: adData }, { data: collectionData }] = await Promise.all([
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
        .not("title", "like", `${CMS_COLLECTION_PREFIX}%`)
        .order("sort_order", { ascending: true }),
      supabase
        .from("ad_banners")
        .select("id,title,image_url,link_url,is_active,sort_order")
        .like("title", `${CMS_COLLECTION_PREFIX}%`)
        .order("sort_order", { ascending: true }),
    ]);

    if (remoteTexts) {
      setSiteTexts(remoteTexts);
      cacheSiteContent(remoteTexts);
    }

    const collectionItems = ((collectionData || []) as AdRow[]).map((row) =>
      adRowToCmsItem(row, row.title.includes("::testimonial::") ? "testimonial" : row.title.includes("::proof::") ? "proof" : "team")
    );

    setPromos((promoData || []) as PromoRow[]);
    setAds((adData || []) as AdRow[]);
    setTeamItems(collectionItems.filter((item) => item.type === "team"));
    setTestimonialItems(collectionItems.filter((item) => item.type === "testimonial"));
    setProofItems(collectionItems.filter((item) => item.type === "proof"));
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

  const collectionState = (type: CmsCollectionType) => {
    if (type === "team") return { items: teamItems, setItems: setTeamItems, newItem: newTeamItem, setNewItem: setNewTeamItem };
    if (type === "testimonial") return { items: testimonialItems, setItems: setTestimonialItems, newItem: newTestimonialItem, setNewItem: setNewTestimonialItem };
    return { items: proofItems, setItems: setProofItems, newItem: newProofItem, setNewItem: setNewProofItem };
  };

  const updateCollectionLocal = (type: CmsCollectionType, index: number, patch: Partial<CmsCollectionItem>) => {
    const { setItems } = collectionState(type);
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const loadImageFile = (file: File, onValue: (value: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => onValue(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const saveCollectionItem = async (item: CmsCollectionItem) => {
    setIsSaving(true);
    const payload = cmsItemToAdPayload(item);
    const query = item.id ? supabase.from("ad_banners").update(payload).eq("id", item.id) : supabase.from("ad_banners").insert(payload);
    const { error } = await query;
    setIsSaving(false);

    if (error) {
      toast({ title: "Erreur d’enregistrement", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Contenu enregistré" });
    if (!item.id) {
      if (item.type === "team") setNewTeamItem(emptyCollectionItem("team"));
      if (item.type === "testimonial") setNewTestimonialItem(emptyCollectionItem("testimonial"));
      if (item.type === "proof") setNewProofItem(emptyCollectionItem("proof"));
    }
    loadCms();
  };

  const deleteCollectionItem = async (item: CmsCollectionItem) => {
    if (!item.id) return;
    const { error } = await supabase.from("ad_banners").delete().eq("id", item.id);
    if (error) {
      toast({ title: "Erreur suppression", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Contenu supprimé" });
    loadCms();
  };

  const renderCollectionSection = (type: CmsCollectionType) => {
    const labels = collectionLabels[type];
    const { items, newItem, setNewItem } = collectionState(type);

    return (
      <Card key={type}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImagePlus className="h-5 w-5" /> {labels.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 rounded-2xl border bg-muted/30 p-4 md:grid-cols-6">
            <div className="space-y-1 md:col-span-2"><Label>{labels.titleLabel}</Label><Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} /></div>
            <div className="space-y-1 md:col-span-2"><Label>{labels.subtitleLabel}</Label><Input value={newItem.subtitle} onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })} /></div>
            <div className="space-y-1 md:col-span-2"><Label>{labels.imageLabel} — URL</Label><Input value={newItem.imageUrl} onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })} placeholder="https://...jpg" /></div>
            <div className="space-y-1 md:col-span-2"><Label>Importer une image</Label><Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && loadImageFile(e.target.files[0], (value) => setNewItem({ ...newItem, imageUrl: value }))} /></div>
            <div className="space-y-1 md:col-span-3"><Label>{labels.descriptionLabel}</Label><Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="min-h-[90px]" /></div>
            <div className="space-y-1 md:col-span-1"><Label>Ordre</Label><Input type="number" value={newItem.sortOrder} onChange={(e) => setNewItem({ ...newItem, sortOrder: Number(e.target.value) })} /></div>
            <div className="flex items-end"><Button className="w-full" onClick={() => saveCollectionItem(newItem)} disabled={isSaving || !newItem.title}><Plus className="h-4 w-4" /> Ajouter</Button></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((item, index) => (
              <div key={item.id || index} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[160px_1fr]">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-32 w-full rounded-xl bg-muted object-cover" /> : <div className="flex h-32 items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">Aucune image</div>}
                <div className="space-y-3">
                  <Input value={item.title} onChange={(e) => updateCollectionLocal(type, index, { title: e.target.value })} />
                  <Input value={item.subtitle} onChange={(e) => updateCollectionLocal(type, index, { subtitle: e.target.value })} />
                  <Input value={item.imageUrl} onChange={(e) => updateCollectionLocal(type, index, { imageUrl: e.target.value })} placeholder="URL image" />
                  <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && loadImageFile(e.target.files[0], (value) => updateCollectionLocal(type, index, { imageUrl: value }))} />
                  <Textarea value={item.description} onChange={(e) => updateCollectionLocal(type, index, { description: e.target.value })} className="min-h-[90px]" />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2"><Switch checked={item.isActive} onCheckedChange={(checked) => updateCollectionLocal(type, index, { isActive: checked })} /><span className="text-sm">Actif</span></div>
                    {type === "testimonial" && <Input className="w-20" type="number" min={1} max={5} value={item.rating || 5} onChange={(e) => updateCollectionLocal(type, index, { rating: Number(e.target.value) })} />}
                    <Input className="w-20" type="number" value={item.sortOrder} onChange={(e) => updateCollectionLocal(type, index, { sortOrder: Number(e.target.value) })} />
                    <Button size="sm" onClick={() => saveCollectionItem(item)} disabled={isSaving}><Save className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteCollectionItem(item)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
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
      toast({ title: "Erreur d’enregistrement", description: error.message, variant: "destructive" });
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
            <CardTitle>Textes publics du site</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Modifiez les textes que les clients voient sur le site : accueil, crypto, partenariats, offres, à propos, FAQ, réclamations, termes, ambassadeurs, parrainage et pied de page.
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
                    <p className="text-xs text-muted-foreground">Texte affiché aux visiteurs.</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {renderCollectionSection("team")}
      {renderCollectionSection("testimonial")}
      {renderCollectionSection("proof")}

      <Card>
        <CardHeader>
          <CardTitle>Codes promo et partenaires</CardTitle>
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
          <CardTitle className="flex items-center gap-2"><ImagePlus className="h-5 w-5" /> Annonces affichées sur l’accueil</CardTitle>
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
