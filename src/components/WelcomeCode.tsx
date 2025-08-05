import { Button } from "@/components/ui/button";

const WelcomeCode = () => {
  const copyCode = () => {
    navigator.clipboard.writeText("BIENVENUE");
  };

  const useCodeNow = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-gradient-primary slow-blink">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
              <span className="text-4xl">🎁</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Offre Spéciale Premier Transfert
            </h2>
            <p className="text-xl opacity-90">
              Utilisez le code <span className="font-bold text-primary-glow">BIENVENUE</span> et payez 0% de frais !
            </p>
          </div>

          {/* Code en évidence */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <div className="text-6xl font-bold mb-4 text-primary-glow tracking-wider">
              BIENVENUE
            </div>
            <p className="text-lg opacity-80 mb-6">
              Valable pour votre premier transfert uniquement
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary"
                size="lg"
                onClick={copyCode}
                className="bg-white text-primary hover:bg-white/90"
              >
                Copier le code
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={useCodeNow}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-primary/10"
              >
                Utiliser maintenant
              </Button>
            </div>
          </div>

          {/* Conditions */}
          <div className="text-sm opacity-70">
            <p>* Offre valable une seule fois par client</p>
            <p>* Applicable sur tous les transferts vers le Gabon, Togo et zone CEMAC</p>
          </div>
          
          {/* Services USDT */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-3">💰 Services USDT</h3>
            <p className="text-lg mb-4">
              Nous rachetons et vendons vos USDT dans toutes les zones BECEAO et CEMAC.
            </p>
            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <p className="text-2xl font-bold text-primary-glow">
                Rachat : 565 F/USDT
              </p>
            </div>
            <div className="flex justify-center gap-4 text-sm opacity-70 mb-2">
              <span>Partenaires officiels :</span>
              <span>Turbo-Exchange</span>
              <span>•</span>
              <span>Jones Exchange</span>
            </div>
            <p className="text-sm opacity-80">
              Taux mis à jour quotidiennement • Service disponible 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeCode;