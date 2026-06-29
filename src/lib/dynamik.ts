export const DYNAMIK_CONTACTS = {
  whatsappDisplay: "+228 99 77 14 19",
  whatsappNumber: "22899771419",
  instagram: "https://www.instagram.com/dynamik_shop?igsh=MXU0NnFxMWllb3N0",
  termsFr: "https://publuu.com/flip-book/939638/_0_",
  termsEn: "https://publuu.com/flip-book/939638/2062188",
  productionUrl: "https://dynamiktransfert.netlify.app",
};

export const whatsappUrl = (message: string, number = DYNAMIK_CONTACTS.whatsappNumber) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const getReferralBaseUrl = () => {
  if (typeof window === "undefined") return DYNAMIK_CONTACTS.productionUrl;
  return window.location.origin || DYNAMIK_CONTACTS.productionUrl;
};

export const makeReferralLink = (code: string) => `${getReferralBaseUrl()}/?ref=${encodeURIComponent(code)}`;

export const qrCodeUrl = (payload: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(payload)}`;

export const PARTNER_CODES = [
  { name: "CID", code: "CID", label: "Partenaire officiel", discount: 10, type: "ambassador" },
  { name: "Bienvenue", code: "BIENVENUE", label: "Premier transfert", discount: 100, type: "welcome" },
  { name: "Corsko", code: "CORSKO", label: "Partenaire", discount: 10, type: "ambassador" },
  { name: "Mr Bourses", code: "MR_BOURSES", label: "Partenaire", discount: 10, type: "ambassador" },
  { name: "Jones", code: "JONES", label: "Partenaire", discount: 10, type: "ambassador" },
  { name: "Krissroy", code: "KRISSROY", label: "Partenaire", discount: 10, type: "ambassador" },
  { name: "Turbo", code: "TURBO", label: "Partenaire", discount: 10, type: "ambassador" },
  { name: "Tony", code: "TONY", label: "Partenaire", discount: 10, type: "ambassador" },
  { name: "J-Zenith", code: "J-ZENITH", label: "Partenaire", discount: 10, type: "ambassador" },
];

export const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/crypto", label: "Crypto → FCFA" },
  { to: "/partenariats", label: "Partenariats" },
  { to: "/offre", label: "Offres" },
  { to: "/a-propos", label: "À propos" },
  { to: "/termes", label: "Termes" },
  { to: "/faq", label: "FAQ" },
];

export const BMIPAY_USDT_NOTICE = {
  title: "Propulsé par la technologie de BMIPAY",
  subtitle: "USDT BEP-20 et TRC-20 avec adresse, réseau et QR validés avant paiement.",
  addressLabel: "Adresse USDT vérifiée",
  addressValue: "Disponible immédiatement sur WhatsApp après confirmation du réseau",
};
