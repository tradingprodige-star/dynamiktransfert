import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";
import AdMarquee from "@/components/AdMarquee";
import ReferralBanner from "@/components/referral/ReferralBanner";
import TrustAndProof from "@/components/TrustAndProof";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgePercent, Bitcoin, MessageCircle, Share2, Users, Info, Sparkles, ShieldCheck, WalletCards } from "lucide-react";
import { useSiteContent } from "@/lib/siteContent";

const serviceSections = [
  {
    id: "section-crypto",
    to: "/crypto",
    eyebrowKey: "home.service.crypto.eyebrow",
    titleKey: "home.service.crypto.title",
    textKey: "home.service.crypto.text",
    icon: Bitcoin,
    statKey: "home.service.crypto.stat",
    accent: "emerald",
    bulletKeys: ["home.service.crypto.bullet1", "home.service.crypto.bullet2", "home.service.crypto.bullet3"],
  },
  {
    id: "section-parrainage",
    to: "/partenariats",
    eyebrowKey: "home.service.referral.eyebrow",
    titleKey: "home.service.referral.title",
    textKey: "home.service.referral.text",
    icon: Share2,
    statKey: "home.service.referral.stat",
    accent: "violet",
    bulletKeys: ["home.service.referral.bullet1", "home.service.referral.bullet2", "home.service.referral.bullet3"],
  },
  {
    id: "section-ambassadeurs",
    to: "/partenariats",
    eyebrowKey: "home.service.partners.eyebrow",
    titleKey: "home.service.partners.title",
    textKey: "home.service.partners.text",
    icon: Users,
    statKey: "home.service.partners.stat",
    accent: "slate",
    bulletKeys: ["home.service.partners.bullet1", "home.service.partners.bullet2", "home.service.partners.bullet3"],
  },
  {
    id: "section-offres",
    to: "/offre",
    eyebrowKey: "home.service.offers.eyebrow",
    titleKey: "home.service.offers.title",
    textKey: "home.service.offers.text",
    icon: BadgePercent,
    statKey: "home.service.offers.stat",
    accent: "emerald",
    bulletKeys: ["home.service.offers.bullet1", "home.service.offers.bullet2", "home.service.offers.bullet3"],
  },
  {
    id: "section-a-propos",
    to: "/a-propos",
    eyebrowKey: "home.service.about.eyebrow",
    titleKey: "home.service.about.title",
    textKey: "home.service.about.text",
    icon: Info,
    statKey: "home.service.about.stat",
    accent: "violet",
    bulletKeys: ["home.service.about.bullet1", "home.service.about.bullet2", "home.service.about.bullet3"],
  },
  {
    id: "section-support",
    to: "/reclamations",
    eyebrowKey: "home.service.support.eyebrow",
    titleKey: "home.service.support.title",
    textKey: "home.service.support.text",
    icon: MessageCircle,
    statKey: "home.service.support.stat",
    accent: "slate",
    bulletKeys: ["home.service.support.bullet1", "home.service.support.bullet2", "home.service.support.bullet3"],
    secondaryTo: "/faq",
  },
];

const ambassadorPreview = [
  { name: "CID", code: "CID", label: "Partenaire officiel", gradient: "from-primary to-amber-300" },
  { name: "Bienvenue", code: "BIENVENUE", label: "Premier transfert", gradient: "from-amber-300 to-primary" },
  { name: "Corsko", code: "CORSKO", label: "Ambassadeur", gradient: "from-violet-500 to-primary" },
  { name: "Mr Bourses", code: "MR_BOURSES", label: "Ambassadeur", gradient: "from-emerald-400 to-primary" },
];

const accentClasses = {
  emerald: {
    icon: "bg-emerald-400/12 text-emerald-300 border-emerald-300/20",
    glow: "bg-emerald-400/10",
    text: "text-emerald-300",
  },
  violet: {
    icon: "bg-violet-400/12 text-violet-200 border-violet-300/20",
    glow: "bg-violet-500/10",
    text: "text-violet-200",
  },
  slate: {
    icon: "bg-white/10 text-white border-white/15",
    glow: "bg-white/8",
    text: "text-white",
  },
} as const;

const Index = () => {
  const { t } = useSiteContent();

  return (
    <div className="min-h-screen premium-page">
      <ReferralBanner />
      <Header />
      <Calculator />
      <TrustAndProof />
      <AdMarquee />

      <section id="carrousel-partenariats" className="relative overflow-hidden bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">{t("home.partnership.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{t("home.partnership.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.partnership.subtitle")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Créer mon lien", "Nom, prénom, numéro WhatsApp et code partenaire reliés."],
              ["Codes promo", "BIENVENUE, CID et codes ambassadeurs dans le calculateur."],
              ["Suivi WhatsApp", "Le code est repris automatiquement dans la demande finale."],
            ].map(([title, text]) => (
              <Link key={title} to="/partenariats" className="group rounded-[2rem] border bg-white p-6 shadow-card transition hover:-translate-y-2 hover:shadow-financial">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-primary">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-digital">
                  Voir les détails <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="ambassadeurs-apercu" className="relative overflow-hidden bg-background py-20">
        <div className="absolute left-10 top-10 h-56 w-56 rounded-full bg-primary/[0.10] blur-3xl" />
        <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-violet-digital/[0.08] blur-3xl" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">{t("home.ambassadors.eyebrow")}</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              {t("home.ambassadors.title")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {t("home.ambassadors.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ambassadorPreview.map((ambassador) => (
              <div
                key={ambassador.code}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-financial"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${ambassador.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-35`} />
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${ambassador.gradient} text-lg font-black text-slate-950 shadow-[0_14px_38px_rgba(245,187,0,0.22)]`}>
                  {ambassador.name.split(" ").map((part) => part[0]).join("")}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{ambassador.label}</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{ambassador.name}</h3>
                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.10] px-4 py-3 text-center font-mono text-sm font-bold text-slate-950">
                  {ambassador.code}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <Link to="/partenariats">
                Voir les partenariats <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="services" className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-emerald-400/[0.06] blur-3xl" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-violet-500/[0.08] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-25" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              {t("home.services.eyebrow")}
            </div>
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
              {t("home.services.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
              {t("home.services.subtitle")}
            </p>
          </div>

          <div className="space-y-8">
            {serviceSections.map((section, index) => {
              const Icon = section.icon;
              const accent = accentClasses[section.accent as keyof typeof accentClasses];
              const reverse = index % 2 === 1;

              return (
                <section
                  id={section.id}
                  key={section.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.075] md:p-8"
                >
                  <div className={`absolute -top-20 ${reverse ? "left-0" : "right-0"} h-56 w-56 rounded-full ${accent.glow} blur-3xl transition-opacity duration-500 group-hover:opacity-80`} />
                  <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className={reverse ? "lg:order-2" : ""}>
                      <div className="mb-5 flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accent.icon}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`text-sm font-semibold uppercase tracking-[0.22em] ${accent.text}`}>{t(section.eyebrowKey)}</span>
                      </div>

                      <h3 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                        {t(section.titleKey)}
                      </h3>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
                        {t(section.textKey)}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {section.bulletKeys.map((bulletKey) => (
                          <span key={bulletKey} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-sm text-white/70">
                            <ShieldCheck className="h-4 w-4 text-emerald-300" />
                            {t(bulletKey)}
                          </span>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-white/90">
                          <Link to={section.to}>
                            Voir ce service <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        {section.secondaryTo && (
                          <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                            <Link to={section.secondaryTo}>Lire la FAQ</Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className={reverse ? "lg:order-1" : ""}>
                      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-6">
                        <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                        <div className="mb-12 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/45">Service DYNAMIK</p>
                            <p className="mt-1 text-xl font-semibold">{t(section.eyebrowKey)}</p>
                          </div>
                          <WalletCards className={`h-8 w-8 ${accent.text}`} />
                        </div>
                        <div className="rounded-3xl bg-white/[0.07] p-5">
                          <p className="text-sm uppercase tracking-[0.24em] text-white/40">Repère utile</p>
                          <p className={`mt-2 text-4xl font-semibold ${accent.text}`}>{t(section.statKey)}</p>
                        </div>
                        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-300 to-violet-300 transition-all duration-700 group-hover:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
