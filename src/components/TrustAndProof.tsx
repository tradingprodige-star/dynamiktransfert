import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, CheckCircle2, Clock3, MessageCircle, ReceiptText, SearchCheck, ShieldCheck, Star, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/dynamik";
import { useSiteContent } from "@/lib/siteContent";
import { CmsCollectionItem, fetchCmsCollections } from "@/lib/cmsCollections";

const trustStats = [
  {
    value: "Référence unique",
    label: "pour chaque demande",
    detail: "Gardez une trace claire du montant, du pays, du réseau et du bénéficiaire.",
    icon: ReceiptText,
  },
  {
    value: "< 10 min",
    label: "pour obtenir une estimation",
    detail: "Simulez les frais et le total à prévoir avant la confirmation WhatsApp.",
    icon: Clock3,
  },
  {
    value: "4 étapes",
    label: "du formulaire à la confirmation",
    detail: "Remplir, payer, recevoir, confirmer : chaque étape reste simple et visible.",
    icon: CheckCircle2,
  },
  {
    value: "Support humain",
    label: "avant tout paiement sensible",
    detail: "Les taux, réseaux Mobile Money, adresses USDT et instructions finales sont confirmés par l’équipe.",
    icon: ShieldCheck,
  },
];

const steps = [
  {
    step: "01",
    title: "Remplir le formulaire",
    text: "Choisissez le pays, le montant, le réseau Mobile Money ou USDT, puis renseignez le bénéficiaire.",
  },
  {
    step: "02",
    title: "Effectuer le paiement",
    text: "DYNAMIK confirme les frais, le total à payer et les instructions officielles avant paiement.",
  },
  {
    step: "03",
    title: "Réception par le bénéficiaire",
    text: "Le bénéficiaire reçoit sur le canal choisi : Mobile Money, banque ou autre méthode validée.",
  },
  {
    step: "04",
    title: "Confirmation",
    text: "La référence est clôturée avec une confirmation client et un suivi en cas de réclamation.",
  },
];

const defaultTestimonials: CmsCollectionItem[] = [
  {
    type: "testimonial",
    title: "Client diaspora",
    subtitle: "France → Togo",
    description: "Le parcours est clair : je calcule, j’envoie les informations et je reçois la confirmation sur WhatsApp.",
    imageUrl: "",
    rating: 5,
    isActive: true,
    sortOrder: 1,
  },
  {
    type: "testimonial",
    title: "Commerçant mobile money",
    subtitle: "USDT → FCFA",
    description: "Les instructions sont confirmées avant paiement, ce qui évite les erreurs de réseau ou d’adresse.",
    imageUrl: "",
    rating: 5,
    isActive: true,
    sortOrder: 2,
  },
  {
    type: "testimonial",
    title: "Utilisateur partenaire",
    subtitle: "Code ambassadeur",
    description: "Le code partenaire est repris dans la demande, donc le suivi est plus simple pour tout le monde.",
    imageUrl: "",
    rating: 5,
    isActive: true,
    sortOrder: 3,
  },
];

const defaultProofs: CmsCollectionItem[] = [
  {
    type: "proof",
    title: "Captures de transactions réussies",
    subtitle: "Transactions anonymisées",
    description: "Des confirmations floutées peuvent montrer la référence, le statut confirmé et le montant protégé.",
    imageUrl: "",
    isActive: true,
    sortOrder: 1,
  },
  {
    type: "proof",
    title: "Avis clients structurés",
    subtitle: "Retours vérifiables",
    description: "Chaque avis met en avant le pays, le cas d’usage et l’expérience, sans exposer de données privées.",
    imageUrl: "",
    isActive: true,
    sortOrder: 2,
  },
  {
    type: "proof",
    title: "Suivi clair",
    subtitle: "Demande, validation, confirmation",
    description: "Les informations importantes restent visibles : référence créée, demande confirmée et support joignable.",
    imageUrl: "",
    isActive: true,
    sortOrder: 3,
  },
];

const defaultTeam: CmsCollectionItem[] = [
  {
    type: "team",
    title: "Équipe opérations",
    subtitle: "Validation paiements, réseaux et références",
    description: "Une équipe dédiée au suivi des opérations et à la vérification des informations sensibles.",
    imageUrl: "",
    isActive: true,
    sortOrder: 1,
  },
  {
    type: "team",
    title: "Support client",
    subtitle: "Assistance WhatsApp et confirmations",
    description: "Un accompagnement humain pour les questions, les réclamations et les confirmations.",
    imageUrl: "",
    isActive: true,
    sortOrder: 2,
  },
  {
    type: "team",
    title: "Partenaires & ambassadeurs",
    subtitle: "Codes, campagnes locales et terrain",
    description: "Des relais locaux pour orienter les clients et simplifier les demandes.",
    imageUrl: "",
    isActive: true,
    sortOrder: 3,
  },
];

const TrustAndProof = () => {
  const { t } = useSiteContent();
  const [team, setTeam] = useState<CmsCollectionItem[]>(defaultTeam);
  const [testimonials, setTestimonials] = useState<CmsCollectionItem[]>(defaultTestimonials);
  const [proofs, setProofs] = useState<CmsCollectionItem[]>(defaultProofs);

  useEffect(() => {
    let mounted = true;

    fetchCmsCollections(true).then((collections) => {
      if (!mounted) return;
      if (collections.team.length) setTeam(collections.team);
      if (collections.testimonials.length) setTestimonials(collections.testimonials);
      if (collections.proofs.length) setProofs(collections.proofs);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const openWhatsApp = () => {
    window.open(
      whatsappUrl("Bonjour DYNAMIK TRANSFERT, je veux confirmer les frais, délais et pays pris en charge avant mon transfert."),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <section id="confiance" className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{t("trust.hero.eyebrow")}</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                {t("trust.hero.title")}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                {t("trust.hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={openWhatsApp} className="rounded-full bg-primary text-slate-950 hover:bg-primary-glow">
                  Vérifier mon transfert <MessageCircle className="h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                  <Link to="/faq">Lire la FAQ</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {trustStats.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.value} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">{item.label}</p>
                    <p className="mt-4 text-sm leading-6 text-white/60">{item.detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnement" className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">{t("trust.steps.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              {t("trust.steps.title")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {t("trust.steps.subtitle")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.step} className="group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-card transition hover:-translate-y-2 hover:shadow-financial">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl transition group-hover:bg-primary/25" />
                <p className="font-mono text-5xl font-black text-primary/70">{step.step}</p>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="preuves" className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">{t("trust.proofs.eyebrow")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                {t("trust.proofs.title")}
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {t("trust.proofs.subtitle")}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {proofs.map((card, index) => {
                  const Icon = index === 0 ? Camera : index === 1 ? Star : SearchCheck;
                  return (
                    <div key={`${card.title}-${index}`} className="overflow-hidden rounded-[1.5rem] border bg-white shadow-card">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.title} className="h-36 w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-24 items-center justify-center bg-slate-950 text-primary">
                          <Icon className="h-8 w-8" />
                        </div>
                      )}
                      <div className="p-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-digital">{card.subtitle}</p>
                        <h3 className="font-semibold text-foreground">{card.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <article key={`${testimonial.title}-${index}`} className="rounded-[1.75rem] border bg-white p-6 shadow-card">
                  <div className="mb-4 flex items-center gap-1 text-primary">
                    {Array.from({ length: Math.max(1, Math.min(5, Number(testimonial.rating || 5))) }).map((_, star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base leading-7 text-foreground">“{testimonial.description}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    {testimonial.imageUrl ? (
                      <img src={testimonial.imageUrl} alt={testimonial.title} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-primary">
                        {testimonial.title.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.title}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.subtitle}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border bg-slate-950 p-6 text-white shadow-financial md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{t("trust.team.eyebrow")}</p>
                <h3 className="mt-3 text-3xl font-semibold">{t("trust.team.title")}</h3>
                <p className="mt-3 text-white/60">{t("trust.team.subtitle")}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {team.map((member, index) => (
                  <div key={`${member.title}-${index}`} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07]">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.title} className="h-32 w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-24 items-center justify-center bg-white/[0.06]">
                        <UsersRound className="h-8 w-8 text-emerald-300" />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="font-semibold">{member.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/55">{member.subtitle}</p>
                      {member.description && <p className="mt-3 text-xs leading-5 text-white/45">{member.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <Link to="/a-propos">
                Découvrir l’équipe <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TrustAndProof;
