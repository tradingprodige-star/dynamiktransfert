import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";
import ReferralBanner from "@/components/referral/ReferralBanner";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BadgePercent, Bitcoin, HelpCircle, MessageCircle, Share2, Users, Info } from "lucide-react";

const serviceLinks = [
  { to: "/crypto", title: "Crypto → FCFA", text: "Créer une demande de paiement crypto vers Mobile Money.", icon: Bitcoin },
  { to: "/parrainage", title: "Parrainage", text: "Obtenir un code parrain et suivre les récompenses.", icon: Share2 },
  { to: "/ambassadeurs", title: "Ambassadeurs", text: "Consulter les codes ambassadeurs disponibles.", icon: Users },
  { to: "/offre", title: "Offres & USDT", text: "Voir le code BIENVENUE et les services USDT.", icon: BadgePercent },
  { to: "/a-propos", title: "À propos", text: "Découvrir l’histoire et la mission de DYNAMIK.", icon: Info },
  { to: "/faq", title: "FAQ", text: "Réponses rapides aux questions fréquentes.", icon: HelpCircle },
  { to: "/reclamations", title: "Réclamations", text: "Envoyer une plainte ou un problème de transfert.", icon: MessageCircle },
];

const Index = () => {
  return (
    <div className="min-h-screen premium-page">
      <ReferralBanner />
      <Header />
      <Calculator />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">Navigation rapide</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Chaque service a maintenant sa page.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              La page d’accueil reste courte. Choisissez directement la partie dont vous avez besoin.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceLinks.map((item) => (
              <Link key={item.to} to={item.to}>
                <Card className="h-full premium-card transition-all duration-300 hover:-translate-y-1 hover:border-violet-digital/30 hover:shadow-financial">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="mb-5 text-sm leading-6 text-muted-foreground">{item.text}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-digital">
                      Ouvrir la page <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
