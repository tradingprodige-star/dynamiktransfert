import { Link } from "react-router-dom";
import { ArrowRight, Camera, CheckCircle2, Clock3, MessageCircle, ReceiptText, SearchCheck, ShieldCheck, Star, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/dynamik";

const trustStats = [
  {
    value: "Référence unique",
    label: "pour chaque demande",
    detail: "Le client garde une trace claire du montant, du pays, du réseau et du bénéficiaire.",
    icon: ReceiptText,
  },
  {
    value: "< 10 min",
    label: "pour obtenir une estimation",
    detail: "Le simulateur prépare les frais et le total avant l’échange WhatsApp.",
    icon: Clock3,
  },
  {
    value: "4 étapes",
    label: "du formulaire à la confirmation",
    detail: "Remplir, payer, recevoir, confirmer : le parcours est expliqué sans zone grise.",
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

const testimonials = [
  {
    name: "Client diaspora",
    role: "France → Togo",
    quote: "Le parcours est clair : je calcule, j’envoie les infos et je reçois la confirmation sur WhatsApp.",
  },
  {
    name: "Commerçant mobile money",
    role: "USDT → FCFA",
    quote: "Les instructions sont confirmées avant paiement, ce qui évite les erreurs de réseau ou d’adresse.",
  },
  {
    name: "Utilisateur partenaire",
    role: "Code ambassadeur",
    quote: "Le code partenaire est repris dans la demande, donc le suivi est plus simple pour tout le monde.",
  },
];

const proofCards = [
  {
    title: "Captures de transactions réussies",
    text: "Les confirmations peuvent être partagées en captures floutées : référence, statut confirmé et montant protégé.",
    icon: Camera,
  },
  {
    title: "Avis clients structurés",
    text: "Les retours clients mettent en avant le pays, le cas d’usage et l’expérience, sans exposer les données privées.",
    icon: Star,
  },
  {
    title: "Statistiques de suivi",
    text: "Les indicateurs publics se concentrent sur ce qui rassure : référence créée, demande confirmée et support joignable.",
    icon: SearchCheck,
  },
];

const team = [
  { name: "Équipe opérations", role: "Validation paiements, réseaux et références" },
  { name: "Support client", role: "Assistance WhatsApp, réclamations et confirmations" },
  { name: "Partenaires & ambassadeurs", role: "Codes, campagnes locales et accompagnement terrain" },
];

const TrustAndProof = () => {
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
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Confiance avant paiement</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                Des repères visibles pour décider sans hésiter.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                DYNAMIK TRANSFERT met en avant les éléments qui rassurent : référence claire, estimation rapide, validation humaine et preuves publiables sans exposer les données privées.
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">Comment ça marche</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Le parcours expliqué en 4 étapes.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Le visiteur comprend exactement ce qui se passe avant, pendant et après le transfert.
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
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">Preuves & avis</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Des signaux de sérieux avant le premier message WhatsApp.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Avis clients, captures anonymisées et indicateurs de suivi rendent le service plus concret tout en protégeant les informations sensibles.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {proofCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="rounded-[1.5rem] border bg-white p-5 shadow-card">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-foreground">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <article key={testimonial.name} className="rounded-[1.75rem] border bg-white p-6 shadow-card">
                  <div className="mb-4 flex items-center gap-1 text-primary">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base leading-7 text-foreground">“{testimonial.quote}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border bg-slate-950 p-6 text-white shadow-financial md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Équipe DYNAMIK</p>
                <h3 className="mt-3 text-3xl font-semibold">Une équipe visible, pas un formulaire anonyme.</h3>
                <p className="mt-3 text-white/60">L’équipe est organisée autour des opérations, du support et des partenaires terrain pour accompagner chaque demande.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {team.map((member) => (
                  <div key={member.name} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5">
                    <UsersRound className="mb-4 h-6 w-6 text-emerald-300" />
                    <p className="font-semibold">{member.name}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{member.role}</p>
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
