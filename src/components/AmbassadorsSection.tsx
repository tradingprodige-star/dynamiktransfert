import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AmbassadorsSection = () => {
  const scrollRevealRef = useScrollReveal();
  
  // Partenaire officiel en vedette
  const featuredPartner = {
    name: "CID",
    code: "CID",
    message: "Centre de l'Innovation Digital, partenaire officiel !",
    color: "from-slate-900 to-violet-700",
    isFeatured: true
  };

  const ambassadors = [
    {
      name: "Bienvenue",
      code: "BIENVENUE",
      message: "Premier transfert gratuit !",
      color: "from-slate-800 to-violet-600"
    },
    {
      name: "Corsko",
      code: "CORSKO",
      message: "Avec Corsko, transfert en force !",
      color: "from-violet-700 to-fuchsia-700"
    },
    {
      name: "Mr Bourses",
      code: "MR_BOURSES",
      message: "Avec Mr Bourses, analyse et profit !",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Jones",
      code: "JONES",
      message: "Avec Jones, simplicité garantie !",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Krissroy",
      code: "KRISSROY",
      message: "Avec Krissroy, royal service !",
      color: "from-purple-500 to-violet-500"
    },
    {
      name: "Turbo",
      code: "TURBO",
      message: "Avec Turbo, vitesse maximum !",
      color: "from-red-500 to-pink-500"
    },
    {
      name: "Tony",
      code: "TONY",
      message: "Avec Tony, confiance totale !",
      color: "from-indigo-500 to-blue-500"
    },
    {
      name: "J-Zenith",
      code: "J-ZENITH",
      message: "Avec J-Zenith, au sommet !",
      color: "from-teal-500 to-green-500"
    }
  ];

  const requestPromoCode = () => {
    const message = "Bonjour ! Je souhaiterais devenir ambassadeur DYNAMIK Exchange et obtenir mon propre code promo. Pouvez-vous me donner plus d'informations ?";
    const finalMessage = `Bonjour DYNAMIK TRANSFERT, ${message}`;
    const whatsappUrl = `https://wa.me/22899771419?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
  };


  return (
    <section className="py-20 bg-card scroll-reveal" ref={scrollRevealRef}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Nos <span className="text-violet-digital">Ambassadeurs</span>
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground mb-12 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Profitez de codes promo exclusifs avec nos ambassadeurs de confiance
          </motion.p>

          {/* Partenaire officiel en vedette */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <Card className="relative overflow-hidden border-2 border-violet-digital/20 bg-gradient-to-br from-violet-digital/10 via-card to-slate-50 shadow-xl">
              <div className="absolute top-0 right-0 bg-slate-950 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                Partenaire Officiel
              </div>
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${featuredPartner.color} flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-violet-digital/20`}>
                    {featuredPartner.name}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {featuredPartner.name} - Centre de l'Innovation Digital
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Partenaire stratégique de DYNAMIK TRANSFERT. Utilisez le code <span className="font-bold text-violet-digital">{featuredPartner.code}</span> pour bénéficier d'avantages exclusifs sur vos transferts.
                  </p>
                  <div className="bg-violet-digital/10 rounded-lg p-3 mb-4 border border-violet-digital/20">
                    <p className="text-sm text-violet-digital font-medium">
                      Code partenaire officiel actif sur les transferts éligibles.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <div className="bg-slate-950 text-white px-6 py-2 rounded-full text-lg font-bold inline-block shadow-lg">
                      {featuredPartner.code}
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(featuredPartner.code);
                      }}
                      className="border-violet-digital/40 text-violet-digital hover:bg-violet-digital hover:text-white"
                    >
                      Copier le code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grille des codes promos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ambassadors.map((ambassador, index) => (
              <motion.div
                key={ambassador.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 group hover-anticipate micro-interaction">
                  <CardContent className="p-6">
                    {/* Avatar généré avec gradient */}
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${ambassador.color} mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:animate-pulse`}>
                      {ambassador.name.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 group-hover:text-violet-digital transition-colors">{ambassador.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4 italic">
                      "{ambassador.message}"
                    </p>
                    
                    <div className="bg-slate-950 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 group-hover:bg-violet-digital transition-all">
                      {ambassador.code}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(ambassador.code);
                      }}
                      className="w-full group-hover:border-violet-digital group-hover:text-violet-digital"
                    >
                      Copier
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA pour devenir ambassadeur */}
          <div className="text-center">
            <div className="bg-gradient-hero rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Devenez Ambassadeur DYNAMIK
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Obtenez votre propre code promo et gagnez sur chaque parrainage !
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={requestPromoCode}
                className="bg-white text-slate-950 hover:bg-white/90"
              >
                Demander mon code promo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorsSection;