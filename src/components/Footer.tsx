import { Instagram, MessageCircle, FileText, Users, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { DYNAMIK_CONTACTS, whatsappUrl } from "@/lib/dynamik";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              DYNAMIK <span className="text-violet-digital">TRANSFERT</span>
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Transferts FCFA, USDT et Mobile Money avec suivi WhatsApp et validation humaine.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <button
              onClick={() => openLink(DYNAMIK_CONTACTS.instagram)}
              className="flex items-center gap-2 text-muted-foreground hover:text-violet-digital transition-colors"
            >
              <Instagram size={20} />
              <span>Instagram</span>
            </button>

            <button
              onClick={() => openLink(whatsappUrl("Bonjour DYNAMIK TRANSFERT, je viens depuis le site."))}
              className="flex items-center gap-2 text-muted-foreground hover:text-violet-digital transition-colors"
            >
              <MessageCircle size={20} />
              <span>WhatsApp {DYNAMIK_CONTACTS.whatsappDisplay}</span>
            </button>

            <Link
              to="/partenariats"
              className="flex items-center gap-2 text-muted-foreground hover:text-violet-digital transition-colors"
            >
              <Handshake size={20} />
              <span>Partenariats</span>
            </Link>

            <Link
              to="/termes"
              className="flex items-center gap-2 text-muted-foreground hover:text-violet-digital transition-colors"
            >
              <FileText size={20} />
              <span>Termes et fichiers</span>
            </Link>

            <button
              onClick={() => openLink(DYNAMIK_CONTACTS.termsFr)}
              className="flex items-center gap-2 text-muted-foreground hover:text-violet-digital transition-colors"
            >
              <FileText size={20} />
              <span>Termes FR</span>
            </button>

            <button
              onClick={() => openLink(DYNAMIK_CONTACTS.termsEn)}
              className="flex items-center gap-2 text-muted-foreground hover:text-violet-digital transition-colors"
            >
              <FileText size={20} />
              <span>Terms EN</span>
            </button>

            <Link
              to="/a-propos"
              className="flex items-center gap-2 text-muted-foreground hover:text-violet-digital transition-colors"
            >
              <Users size={20} />
              <span>À propos</span>
            </Link>
          </div>

          <div className="w-full h-px bg-border mb-8" />

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Propulsé par <span className="font-bold text-violet-digital">DYNAMIK</span> • {currentYear}
            </p>
            <p className="text-sm text-muted-foreground">
              Service accompagné par WhatsApp. Les taux, réseaux et adresses USDT sont confirmés avant paiement.
            </p>
          </div>

          <div className="text-center mt-8">
            <div className="inline-block bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Support client 24/7</p>
              <button
                onClick={() => openLink(whatsappUrl("Bonjour DYNAMIK TRANSFERT, j’ai besoin d’assistance."))}
                className="text-violet-digital font-bold hover:underline"
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
