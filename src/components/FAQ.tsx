import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteContent } from "@/lib/siteContent";

const FAQ = () => {
  const { t } = useSiteContent();
  const faqData = [
    {
      question: "Quels pays sont pris en charge ?",
      answer: "DYNAMIK TRANSFERT accompagne principalement les opérations entre la diaspora, le Togo, le Gabon, la zone BECEAO et la zone CEMAC. Les réseaux disponibles dépendent du pays, du montant et du canal choisi. Confirmez toujours le pays et le réseau sur WhatsApp avant paiement."
    },
    {
      question: "Quels sont les frais ?",
      answer: "Les frais sont affichés dans le calculateur avant la demande. Ils peuvent varier selon le sens du transfert, le réseau, le montant, le code promo et le service choisi. L’équipe confirme le total exact sur WhatsApp avant toute opération."
    },
    {
      question: "Quels sont les délais de traitement ?",
      answer: "L’estimation est rapide et la demande est traitée après confirmation du paiement. Certains transferts peuvent être quasi immédiats, mais le délai final dépend du réseau Mobile Money, de la banque, du pays et des vérifications nécessaires."
    },
    {
      question: "Quels sont les plafonds ?",
      answer: "Les plafonds dépendent du pays, du réseau Mobile Money, du compte bénéficiaire et des règles de vérification. Pour un gros montant, contactez DYNAMIK sur WhatsApp afin de valider les conditions avant de payer."
    },
    {
      question: "Est-ce sécurisé ?",
      answer: "Oui. Le site prépare la demande, mais les informations sensibles — montant final, réseau, adresse USDT, bénéficiaire et instructions — sont confirmées humainement avant paiement. Ne payez jamais une adresse ou un numéro non confirmé par le canal officiel DYNAMIK."
    },
    {
      question: "Comment fonctionne DYNAMIK TRANSFERT ?",
      answer: "Le parcours suit quatre étapes : remplir le formulaire ou le calculateur, recevoir les instructions de paiement confirmées, déclencher l’envoi vers le bénéficiaire, puis obtenir la confirmation de réception."
    },
    {
      question: "Quels documents faut-il fournir ?",
      answer: "Selon le montant et le pays, une pièce d’identité valide peut être demandée pour l’expéditeur et des informations complètes peuvent être nécessaires pour le bénéficiaire : nom, prénom, numéro, pays et réseau de réception."
    },
    {
      question: "Quels modes de paiement sont acceptés ?",
      answer: "DYNAMIK peut accompagner des paiements Mobile Money, virements ou crypto/USDT selon les cas. Les méthodes réellement disponibles sont confirmées sur WhatsApp avant paiement."
    },
    {
      question: "Comment utiliser un code promo ou partenaire ?",
      answer: "Saisissez le code dans le calculateur ou ouvrez un lien partenaire. Le code est repris dans la demande WhatsApp pour permettre à l’équipe de l’appliquer ou de le vérifier."
    },
    {
      question: "Puis-je annuler un transfert ?",
      answer: "L’annulation dépend de l’état de traitement. Contactez immédiatement le support si vous avez fait une erreur. Une opération déjà envoyée ou récupérée par le bénéficiaire peut ne plus être annulable."
    },
    {
      question: "Que faire en cas de problème avec un transfert ?",
      answer: "Utilisez la page Réclamations ou contactez le support WhatsApp avec votre référence, le montant, le pays, le numéro bénéficiaire et une capture si nécessaire."
    },
    {
      question: "Comment devenir ambassadeur DYNAMIK TRANSFERT ?",
      answer: "Rendez-vous sur la page Partenariats pour créer ou demander un lien/code. L’équipe DYNAMIK vous accompagne ensuite pour activer votre code et suivre vos recommandations."
    }
  ];

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-digital">Questions clés</p>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("faq.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("faq.subtitle")}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-[1.25rem] border border-border bg-card px-6 shadow-card"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2 leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">
              {t("faq.cta.text")}
            </p>
            <button
              onClick={() => window.open("https://wa.me/22899771419?text=Bonjour%20DYNAMIK%20TRANSFERT,%20j'ai%20une%20question%20qui%20n'est%20pas%20dans%20la%20FAQ...", "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 hover:text-slate-950"
            >
              {t("faq.cta.button")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
