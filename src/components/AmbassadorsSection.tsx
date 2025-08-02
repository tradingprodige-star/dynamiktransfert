import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AmbassadorsSection = () => {
  const ambassadors = [
    {
      name: "Bienvenue",
      code: "BIENVENUE",
      message: "Premier transfert gratuit !",
      color: "from-gold-500 to-yellow-500"
    },
    {
      name: "Corsko",
      code: "CORSKO",
      message: "Avec Corsko, transfert en force !",
      color: "from-yellow-500 to-orange-500"
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
    },
    {
      name: "Com Master",
      code: "COM-MASTER",
      message: "Avec Com Master, communication parfaite !",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const requestPromoCode = () => {
    const message = "Bonjour ! Je souhaiterais devenir ambassadeur DYNAMIK Exchange et obtenir mon propre code promo. Pouvez-vous me donner plus d'informations ?";
    const whatsappUrl = `https://wa.me/22899771419?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground animate-fade-in">
            Nos <span className="text-primary">Ambassadeurs</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg animate-fade-in">
            Profitez de codes promo exclusifs avec nos ambassadeurs de confiance
          </p>

          {/* Grille des codes promos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ambassadors.map((ambassador, index) => (
                <Card key={ambassador.code} className="text-center shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-6">
                    {/* Avatar généré avec gradient */}
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${ambassador.color} mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:animate-pulse`}>
                      {ambassador.name.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{ambassador.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4 italic">
                      "{ambassador.message}"
                    </p>
                    
                    <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-bold mb-4 group-hover:bg-gradient-accent transition-all">
                      {ambassador.code}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(ambassador.code);
                      }}
                      className="w-full group-hover:border-primary group-hover:text-primary"
                    >
                      Copier
                    </Button>
                  </CardContent>
                </Card>
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
                className="bg-white text-primary hover:bg-white/90"
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