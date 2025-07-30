import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/message/YOUR_WHATSAPP_NUMBER', '_blank');
  };

  return (
    <header className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              DYNAMIK <span className="text-primary-glow">EXCHANGE</span>
            </h1>
            <div className="w-20 h-1 bg-primary-glow mx-auto rounded-full" />
          </div>

          {/* Hero Title */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Envoyez. Recevez. Multipliez.
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            En moins de 10 minutes. Sans vous ruiner.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="xl" 
              variant="hero"
              onClick={scrollToCalculator}
              className="w-full sm:w-auto"
            >
              Calculer mes frais
            </Button>
            <Button 
              size="xl" 
              variant="whatsapp"
              onClick={openWhatsApp}
              className="w-full sm:w-auto"
            >
              Commencer sur WhatsApp
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 text-white/70">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-glow rounded-full animate-pulse" />
              <span>Transfert instantané</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-glow rounded-full animate-pulse" />
              <span>Frais transparents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-glow rounded-full animate-pulse" />
              <span>Service 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;