import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AmbassadorsSection = () => {
  const ambassadors = [
    {
      name: "Jonas",
      code: "JONAS",
      message: "Avec Jonas, t'économises !",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Marie",
      code: "MARIE",
      message: "Avec Marie, tout devient facile !",
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Paul",
      code: "PAUL",
      message: "Avec Paul, pas de tracas !",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Sarah",
      code: "SARAH",
      message: "Avec Sarah, ça brille !",
      color: "from-purple-500 to-violet-500"
    }
  ];

  const requestPromoCode = () => {
    const message = "Bonjour ! Je souhaiterais devenir ambassadeur DYNAMIK Exchange et obtenir mon propre code promo. Pouvez-vous me donner plus d'informations ?";
    const whatsappUrl = `https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Nos <span className="text-primary">Ambassadeurs</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Profitez de codes promo exclusifs avec nos ambassadeurs de confiance
          </p>

          {/* Grille des ambassadeurs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {ambassadors.map((ambassador, index) => (
              <Card key={ambassador.code} className="text-center shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  {/* Avatar généré avec gradient */}
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${ambassador.color} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {ambassador.name.charAt(0)}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{ambassador.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "{ambassador.message}"
                  </p>
                  
                  <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                    Code: {ambassador.code}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Copier le code dans le presse-papier
                      navigator.clipboard.writeText(ambassador.code);
                    }}
                    className="w-full"
                  >
                    Copier le code
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