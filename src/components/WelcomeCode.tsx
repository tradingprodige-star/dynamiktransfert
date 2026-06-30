import { Button } from "@/components/ui/button";
import { Coins, Gift } from "lucide-react";

const WelcomeCode = () => {
  const copyCode = () => {
    navigator.clipboard.writeText("BIENVENUE");
  };

  const useCodeNow = () => {
    const calculator = document.getElementById("calculator");
    if (calculator) {
      calculator.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.location.href = "/#calculator";
  };

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-dark">
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-4 border border-white/10 shadow-financial">
              <Gift className="h-9 w-9 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Offre Spéciale Premier Transfert
            </h2>
            <p className="text-xl text-white/80">
              Utilisez le code <span className="font-bold text-emerald-300">BIENVENUE</span> et payez 0% de frais !
            </p>
          </div>

          {/* Code en évidence */}
          <div className="bg-slate-950/70 backdrop-blur-xl rounded-[2rem] p-8 mb-8 border border-white/10 shadow-financial">
            <div className="inline-block rounded-2xl bg-slate-950/85 px-6 py-3 text-5xl md:text-6xl font-black mb-4 text-emerald-200 tracking-wider border border-emerald-300/20 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              BIENVENUE
            </div>
            <p className="text-lg text-white/75 mb-6">
              Valable pour votre premier transfert uniquement
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary"
                size="lg"
                onClick={copyCode}
                className="rounded-full bg-white text-matte-black hover:bg-white/90"
              >
                Copier le code
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={useCodeNow}
                className="rounded-full border-emerald-300/40 text-emerald-200 hover:bg-emerald-300 hover:text-matte-black bg-emerald-300/10"
              >
                Utiliser maintenant
              </Button>
            </div>
          </div>

          {/* Conditions */}
          <div className="text-sm text-white/60">
            <p>* Offre valable une seule fois par client</p>
            <p>* Applicable sur tous les transferts vers le Gabon, Togo et zone CEMAC</p>
          </div>
          
          {/* Services USDT */}
          <div className="mt-12 bg-white/[0.06] backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-financial">
            <h3 className="flex items-center justify-center gap-2 text-xl font-bold mb-3 text-white">
              <Coins className="h-5 w-5 text-emerald-300" />
              Services USDT
            </h3>
            <p className="text-lg mb-4 text-white/80">
              Nous rachetons et vendons vos USDT dans toutes les zones BECEAO et CEMAC.
            </p>
            <div className="bg-slate-950/75 rounded-2xl p-4 mb-4 border border-emerald-300/15">
              <p className="text-2xl font-bold text-emerald-200">
                Rachat : 565 F/USDT
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70 mb-4">
              <span className="text-white/60">Partenaires officiels :</span>
              <button 
                onClick={() => window.open('https://wa.me/22899060652?text=' + encodeURIComponent('Bonjour Turboexchange ! Je viens de la part de DYNAMIK TRANSFERT. Votre service m\'a été recommandé pour des échanges rapides, fiables et 100% sécurisés. J\'aimerais en savoir plus sur vos services d\'échange.'), '_blank')}
                className="text-emerald-300 hover:text-emerald-200 hover:underline font-medium"
              >
                Turboexchange
              </button>
              <span>•</span>
              <button 
                onClick={() => window.open('https://wa.me/22893941948?text=' + encodeURIComponent('Bonjour Jones Exchange ! Je viens de la part de DYNAMIK TRANSFERT. Votre service m\'a été recommandé pour des échanges rapides, fiables et 100% sécurisés. J\'aimerais en savoir plus sur vos services d\'échange.'), '_blank')}
                className="text-emerald-300 hover:text-emerald-200 hover:underline font-medium"
              >
                Jones Exchange
              </button>
            </div>
            
            <p className="text-sm text-white/60 mt-4">
              Taux mis à jour quotidiennement • Service disponible 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeCode;
