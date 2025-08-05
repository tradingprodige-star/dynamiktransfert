import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqData = [
    {
      question: "Comment fonctionne DYNAMIK TRANSFERT ?",
      answer: "Très simple ! Vous nous contactez sur WhatsApp, indiquez le montant à envoyer, les informations du bénéficiaire, et nous nous occupons du reste. Le transfert est effectué instantanément après réception de votre paiement."
    },
    {
      question: "Quels sont les frais de transfert ?",
      answer: "Nos frais sont transparents : 2% pour les transferts Togo vers France, et 1% fixe pour les transferts France vers Togo. Utilisez notre calculateur pour voir le montant exact."
    },
    {
      question: "Combien de temps prend un transfert ?",
      answer: "Nos transferts sont instantanés ! Dès réception de votre paiement, l'argent est immédiatement disponible pour le bénéficiaire."
    },
    {
      question: "Quels documents faut-il fournir ?",
      answer: "Une pièce d'identité valide (CNI, passeport) pour l'expéditeur et les informations complètes du bénéficiaire (nom, prénom, numéro de téléphone)."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les virements bancaires, Mobile Money (Flooz, T-Money), et les cryptomonnaies (USDT). Contactez-nous pour plus de détails."
    },
    {
      question: "Y a-t-il une limite sur les montants ?",
      answer: "Nous n'avons pas de limite minimum. Pour les gros montants, contactez-nous directement sur WhatsApp pour bénéficier de conditions préférentielles."
    },
    {
      question: "Le service est-il disponible 24h/24 ?",
      answer: "Oui ! Notre service client est disponible 24h/24 et 7j/7 sur WhatsApp. Nous traitons vos demandes en temps réel."
    },
    {
      question: "Comment utiliser un code promo ?",
      answer: "Mentionnez simplement votre code promo lors de votre demande sur WhatsApp. Nos codes promo offrent des réductions ou des cashbacks selon le code utilisé."
    },
    {
      question: "Est-ce que vos services sont sécurisés ?",
      answer: "Absolument ! Nous respectons toutes les réglementations financières et luttons activement contre le blanchiment d'argent et la cybercriminalité. Vos transactions sont entièrement sécurisées."
    },
    {
      question: "Que faire en cas de problème avec un transfert ?",
      answer: "Contactez immédiatement notre service client sur WhatsApp ou utilisez notre formulaire de réclamation. Nous résolvons tous les problèmes dans les plus brefs délais."
    },
    {
      question: "Comment devenir ambassadeur DYNAMIK TRANSFERT ?",
      answer: "Contactez-nous sur WhatsApp pour connaître les conditions. Nos ambassadeurs bénéficient de codes promo exclusifs et de commissions attractives."
    },
    {
      question: "Puis-je annuler un transfert ?",
      answer: "Les transferts étant instantanés, l'annulation n'est possible que si l'argent n'a pas encore été récupéré par le bénéficiaire. Contactez-nous immédiatement en cas de besoin."
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions Fréquemment Posées
            </h2>
            <p className="text-muted-foreground text-lg">
              Tout ce que vous devez savoir sur DYNAMIK TRANSFERT
            </p>
          </div>

          <Accordion type="multiple" className="space-y-2">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <button
              onClick={() => window.open('https://wa.me/22899771419?text=Bonjour%20DYNAMIK%20TRANSFERT,%20j\'ai%20une%20question%20qui%20n\'est%20pas%20dans%20la%20FAQ...', '_blank')}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Contactez-nous sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;