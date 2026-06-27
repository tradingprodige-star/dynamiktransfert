import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";
import ReferralBanner from "@/components/referral/ReferralBanner";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgePercent, Bitcoin, HelpCircle, MessageCircle, Share2, Users, Info, Sparkles, ShieldCheck, WalletCards } from "lucide-react";

const serviceSections = [
  {
    id: "section-crypto",
    to: "/crypto",
    eyebrow: "Crypto → FCFA",
    title: "Payer en crypto, recevoir sur Mobile Money.",
    text: "Un tunnel clair pour créer une demande USDT/BTC vers T-Money, Moov, MTN, Orange ou Wave, avec référence et validation humaine.",
    icon: Bitcoin,
    stat: "USDT / BTC",
    accent: "emerald",
    bullets: ["Togo, Bénin, Burkina, Côte d’Ivoire", "Référence de paiement générée", "Validation finale par WhatsApp"],
  },
  {
    id: "section-parrainage",
    to: "/parrainage",
    eyebrow: "Parrainage",
    title: "Transformez vos recommandations en récompenses.",
    text: "Une page dédiée pour créer son code parrain, suivre les points, comprendre les paliers et débloquer les bonus.",
    icon: Share2,
    stat: "150 pts",
    accent: "violet",
    bullets: ["Points par transfert", "Cashback et bonus", "Statut VIP"],
  },
  {
    id: "section-ambassadeurs",
    to: "/ambassadeurs",
    eyebrow: "Ambassadeurs",
    title: "Codes partenaires et influenceurs dans un espace propre.",
    text: "Les codes promo restent disponibles, mais sur une page organisée avec un design plus sérieux et des actions simples.",
    icon: Users,
    stat: "Codes actifs",
    accent: "slate",
    bullets: ["CID partenaire officiel", "Copie rapide des codes", "Demande de code ambassadeur"],
  },
  {
    id: "section-offres",
    to: "/offre",
    eyebrow: "Offres & USDT",
    title: "Promos et services USDT sans lumière agressive.",
    text: "Le code BIENVENUE et le service de rachat USDT sont séparés dans une page sombre, lisible et plus premium.",
    icon: BadgePercent,
    stat: "565 F/USDT",
    accent: "emerald",
    bullets: ["Code BIENVENUE", "Rachat et vente USDT", "Partenaires Turboexchange/Jones"],
  },
  {
    id: "section-a-propos",
    to: "/a-propos",
    eyebrow: "À propos",
    title: "L’histoire et la mission de DYNAMIK à part.",
    text: "La partie storytelling ne surcharge plus l’accueil. Elle existe toujours dans une page dédiée, plus confortable à lire.",
    icon: Info,
    stat: "2020 → 2025",
    accent: "violet",
    bullets: ["Histoire DYNAMIK SHOP", "Fondateurs", "Mission et vision"],
  },
  {
    id: "section-support",
    to: "/reclamations",
    eyebrow: "Support",
    title: "Réclamations et FAQ accessibles sans chercher.",
    text: "Les utilisateurs peuvent trouver les réponses fréquentes ou envoyer une réclamation depuis des pages propres.",
    icon: MessageCircle,
    stat: "24/7",
    accent: "slate",
    bullets: ["FAQ dédiée", "Formulaire réclamation", "Transmission WhatsApp"],
    secondaryTo: "/faq",
  },
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
  return (
    <div className="min-h-screen premium-page">
      <ReferralBanner />
      <Header />
      <Calculator />

      <section id="services" className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-emerald-400/[0.06] blur-3xl" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-violet-500/[0.08] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-25" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Aperçu complet de la plateforme
            </div>
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Toutes les sections sont visibles, mais chaque service a sa page.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
              L’accueil présente les services sous forme de sections premium compactes. En cliquant, l’utilisateur ouvre la page complète correspondante.
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
                        <span className={`text-sm font-semibold uppercase tracking-[0.22em] ${accent.text}`}>{section.eyebrow}</span>
                      </div>

                      <h3 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                        {section.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
                        {section.text}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {section.bullets.map((bullet) => (
                          <span key={bullet} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-sm text-white/70">
                            <ShieldCheck className="h-4 w-4 text-emerald-300" />
                            {bullet}
                          </span>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-white/90">
                          <Link to={section.to}>
                            Ouvrir la page <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        {section.secondaryTo && (
                          <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                            <Link to={section.secondaryTo}>Voir la FAQ</Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className={reverse ? "lg:order-1" : ""}>
                      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-6">
                        <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                        <div className="mb-12 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/45">Module DYNAMIK</p>
                            <p className="mt-1 text-xl font-semibold">{section.eyebrow}</p>
                          </div>
                          <WalletCards className={`h-8 w-8 ${accent.text}`} />
                        </div>
                        <div className="rounded-3xl bg-white/[0.07] p-5">
                          <p className="text-sm uppercase tracking-[0.24em] text-white/40">Indicateur</p>
                          <p className={`mt-2 text-4xl font-semibold ${accent.text}`}>{section.stat}</p>
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
