import { Link } from "react-router-dom";
import PublicPage from "@/components/PublicPage";
import WelcomeCode from "@/components/WelcomeCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DYNAMIK_CONTACTS, PARTNER_CODES, whatsappUrl } from "@/lib/dynamik";
import { ArrowRight, BadgePercent, Bitcoin, CheckCircle2, Clock3, MessageCircle, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { useSiteContent } from "@/lib/siteContent";

const offerCards = [
  {
    title: "Premier transfert",
    value: "0% de frais",
    detail: "Saisissez BIENVENUE pour profiter de 0% de frais sur un premier transfert éligible.",
    badge: "Code BIENVENUE",
    icon: BadgePercent,
  },
  {
    title: "Rachat USDT",
    value: "565 F / USDT",
    detail: "Rachat et vente USDT avec validation humaine avant paiement.",
    badge: "USDT BEP-20 / TRC-20",
    icon: Bitcoin,
  },
  {
    title: "France → Togo",
    value: "1% fixe",
    detail: "Simulation claire, référence unique et finalisation WhatsApp.",
    badge: "Mobile Money",
    icon: WalletCards,
  },
];

const transferRoutes = [
  "France → Togo",
  "Togo → Europe",
  "Afrique de l’Ouest ↔ Afrique de l’Ouest",
  "Afrique Centrale → Afrique de l’Ouest",
  "Afrique de l’Ouest → Europe",
  "Crypto → FCFA Mobile Money",
];

const partnerCodes = PARTNER_CODES.slice(0, 6);

const trustPoints = [
  {
    title: "Validation humaine",
    text: "Chaque montant, réseau et instruction finale est confirmé par l’équipe avant paiement.",
  },
  {
    title: "WhatsApp comme point de contrôle",
    text: "La demande préremplie garde une trace claire du pays, du service, du code et de la référence.",
  },
  {
    title: "Offres lisibles",
    text: "Les conditions importantes restent visibles avant la simulation : frais, code, service et canal de contact.",
  },
];

const Offers = () => {
  const { t } = useSiteContent();
  const message = `Bonjour DYNAMIK TRANSFERT, je viens de la page Offres. Je veux profiter d'une offre ou demander un transfert. Code si applicable : BIENVENUE.`;

  return (
    <PublicPage>
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("offer.hero.eyebrow")}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              {t("offer.hero.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/68">
              {t("offer.hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-primary text-slate-950 hover:bg-primary-glow">
                <Link to="/#calculator">
                  Simuler maintenant <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                <a href={whatsappUrl(message)} target="_blank" rel="noreferrer">
                  Démarrer sur WhatsApp <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {offerCards.map((offer) => {
              const Icon = offer.icon;
              return (
                <Card key={offer.title} className="border-white/10 bg-white/[0.075] text-white shadow-2xl backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-slate-950">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{offer.badge}</p>
                    <h2 className="mt-2 text-2xl font-semibold">{offer.title}</h2>
                    <p className="mt-3 text-4xl font-black text-primary">{offer.value}</p>
                    <p className="mt-4 text-sm leading-6 text-white/62">{offer.detail}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <WelcomeCode />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-digital">{t("offer.trust.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">{t("offer.trust.title")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("offer.trust.subtitle")}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {trustPoints.map((point) => (
              <Card key={point.title} className="border-slate-200 bg-slate-50/70 shadow-card">
                <CardContent className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{point.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{point.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-digital">{t("offer.journey.eyebrow")}</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-5xl">{t("offer.journey.title")}</h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                {t("offer.journey.subtitle")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                  <Link to="/#calculator">Calculer les frais</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/crypto">Voir Crypto → FCFA</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {transferRoutes.map((route) => (
                <div key={route} className="rounded-[1.5rem] border bg-white p-5 shadow-card">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-foreground">{route}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Simulation + validation WhatsApp.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/10 via-background to-violet-500/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-digital">{t("offer.codes.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">{t("offer.codes.title")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("offer.codes.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {partnerCodes.map((partner) => (
              <Card key={partner.code} className="border-slate-200 bg-white/90 shadow-card transition hover:-translate-y-1 hover:shadow-financial">
                <CardContent className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{partner.label}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{partner.name}</h3>
                  <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-center font-mono text-sm font-bold text-slate-950">
                    {partner.code}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">Réduction ou suivi partenaire : {partner.discount}%.</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link to="/partenariats">
                Voir tous les partenaires <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 flex items-center gap-3 text-primary">
                <ShieldCheck className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em]">Sécurité</span>
              </div>
              <h2 className="text-3xl font-semibold">Aucune adresse crypto ou instruction sensible sans confirmation.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/65">
                DYNAMIK confirme toujours le réseau, le montant et les instructions finales sur WhatsApp avant paiement. Contact : {DYNAMIK_CONTACTS.whatsappDisplay}.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild size="lg" className="rounded-full bg-primary text-slate-950 hover:bg-primary-glow">
                <a href={whatsappUrl(message)} target="_blank" rel="noreferrer">
                  Confirmer mon offre <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                <Link to="/faq">
                  Questions fréquentes <Clock3 className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicPage>
  );
};

export default Offers;
