import { Instagram, MessageCircle, FileText, Users } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Logo et description */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              DYNAMIK <span className="text-primary">EXCHANGE</span>
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              La solution de transfert d'argent la plus simple et économique d'Afrique centrale.
            </p>
          </div>

          {/* Liens principaux */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <button
              onClick={() => openLink('https://instagram.com/dynamikexchange')}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram size={20} />
              <span>Instagram</span>
            </button>
            
            <button
              onClick={() => openLink('https://wa.me/YOUR_WHATSAPP_NUMBER')}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </button>
            
            <button
              onClick={() => openLink('#conditions')}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <FileText size={20} />
              <span>Conditions</span>
            </button>
            
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Users size={20} />
              <span>À propos</span>
            </button>
          </div>

          {/* Séparateur */}
          <div className="w-full h-px bg-border mb-8" />

          {/* Informations légales */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Propulsé par <span className="font-bold text-primary">DYNAMIK</span> • {currentYear}
            </p>
            <p className="text-sm text-muted-foreground">
              Service de transfert d'argent agréé • Sécurisé et régulé
            </p>
          </div>

          {/* Contact d'urgence */}
          <div className="text-center mt-8">
            <div className="inline-block bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Support client 24/7</p>
              <button
                onClick={() => openLink('https://wa.me/YOUR_WHATSAPP_NUMBER')}
                className="text-primary font-bold hover:underline"
              >
                Contactez-nous sur WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;