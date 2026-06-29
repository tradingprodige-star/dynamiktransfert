import PublicPage from "@/components/PublicPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReferralSection from "@/components/referral/ReferralSection";
import { DYNAMIK_CONTACTS, PARTNER_CODES, makeReferralLink, whatsappUrl } from "@/lib/dynamik";
import { ArrowRight, Copy, Handshake, MessageCircle, Share2, Sparkles, Users } from "lucide-react";
import { useMemo } from "react";

const featuredSlides = [
  {
    title: "Devenir partenaire",
    text: "Recevez un lien de parrainage relié à votre nom, prénom et numéro WhatsApp.",
    cta: "Demander mon lien",
  },
  {
    title: "Codes promo actifs",
    text: "Les codes partenaires sont reconnus dans le calculateur et visibles dans la demande WhatsApp.",
    cta: "Voir les codes",
  },
  {
    title: "Suivi des recommandations",
    text: "Chaque filleul passe par le lien de parrainage, puis finalise son transfert avec DYNAMIK sur WhatsApp.",
    cta: "Comprendre le suivi",
  },
];

const Partnerships = () => {
  const partnerMessage = "Bonjour DYNAMIK TRANSFERT, je souhaite rejoindre le programme PARTENARIATS et obtenir mon lien de parrainage lié à mon nom, prénom et numéro WhatsApp.";

  const promoCards = useMemo(() => PARTNER_CODES.map((partner) => ({
    ...partner,
    link: makeReferralLink(partner.code),
  })), []);

  const copy = (text: string) => navigator.clipboard?.writeText(text);

  return (
    <PublicPage>
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              <Handshake className="h-4 w-4 text-primary" />
              Page et menu PARTENARIATS
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Parrainage, codes promo et partenaires DYNAMIK.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/68">
              Chaque partenaire peut partager un lien simple. Le code est repris dans le calculateur puis envoyé à DYNAMIK sur WhatsApp avec la demande de transfert.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-primary text-slate-950 hover:bg-primary-glow">
                <a href={whatsappUrl(partnerMessage)} target="_blank" rel="noreferrer">
                  Demander mon lien partenaire <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                <a href="#codes-partenaires">Voir les codes actifs</a>
              </Button>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {featuredSlides.map((slide, index) => (
              <a
                key={slide.title}
                href="#programme-parrainage"
                className="group block rounded-[2rem] border border-white/10 bg-white/[0.075] p-6 shadow-2xl backdrop-blur-xl transition hover:-translate-y-2 hover:bg-white/[0.105]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-slate-950">
                  {index === 0 ? <Users className="h-6 w-6" /> : index === 1 ? <Sparkles className="h-6 w-6" /> : <Share2 className="h-6 w-6" />}
                </div>
                <h2 className="text-2xl font-semibold">{slide.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/62">{slide.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {slide.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="codes-partenaires" className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-digital">Codes promo</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Liens de parrainage opérationnels</h2>
            <p className="mt-4 text-muted-foreground">
              Le lien remplit automatiquement le code dans le calculateur. Si le client finalise sur WhatsApp, DYNAMIK reçoit le code dans la demande.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {promoCards.map((partner) => (
              <Card key={partner.code} className="overflow-hidden border-slate-200 shadow-card transition hover:-translate-y-1 hover:shadow-financial">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{partner.label}</p>
                      <h3 className="mt-1 text-2xl font-semibold">{partner.name}</h3>
                    </div>
                    <div className="rounded-2xl bg-slate-950 px-4 py-3 font-mono text-sm font-bold text-white">{partner.code}</div>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Code utilisable dans le simulateur. Le lien conserve le code dans l'URL pour éviter les oublis.
                  </p>
                  <div className="mt-5 rounded-2xl border bg-muted/40 p-3 text-xs text-muted-foreground break-all">
                    {partner.link}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => copy(partner.link)}>
                      <Copy className="h-4 w-4" /> Copier
                    </Button>
                    <Button asChild className="bg-slate-950 text-white hover:bg-slate-800">
                      <a href={partner.link}>Tester</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="programme-parrainage">
        <ReferralSection />
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold">Besoin d’un lien personnalisé ?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/65">
            Envoyez votre nom, prénom et numéro WhatsApp à DYNAMIK. L’équipe vous confirme le code partenaire à utiliser.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full bg-primary text-slate-950 hover:bg-primary-glow">
            <a href={whatsappUrl(partnerMessage)} target="_blank" rel="noreferrer">
              Contacter WhatsApp {DYNAMIK_CONTACTS.whatsappDisplay}
            </a>
          </Button>
        </div>
      </section>
    </PublicPage>
  );
};

export default Partnerships;
