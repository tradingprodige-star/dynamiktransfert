import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

// Génération d'un numéro de référence unique
const generateReferenceNumber = (): string => {
  const prefix = "DYN";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const Calculator = () => {
  const scrollRevealRef = useScrollReveal();
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("france-togo");
  const [destination, setDestination] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [senderMobileMoney, setSenderMobileMoney] = useState("");
  const [receiverMobileMoney, setReceiverMobileMoney] = useState("");
  const [europeReceiveMethod, setEuropeReceiveMethod] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("instant");
  const [promoCode, setPromoCode] = useState("");
  const [motif, setMotif] = useState("famille");
  const [formError, setFormError] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  const [showCustomRequest, setShowCustomRequest] = useState(false);
  const [promoCodes, setPromoCodes] = useState<Array<{
    id: string;
    code: string;
    type: string;
    discount_percentage: number;
    ambassador_name?: string;
  }>>([]);
  const [result, setResult] = useState<{
    totalToPay: number;
    amountReceived: number;
    fees: number;
    cashback: number;
    promoEffect: string;
    senderMobileMoneyInfo?: string;
    receiverMobileMoneyInfo?: string;
    referenceNumber: string;
  } | null>(null);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const { data, error } = await supabase
          .from('promo_codes')
          .select('id, code, type, discount_percentage, ambassador_name')
          .eq('is_active', true);
        
        if (error) {
          console.error('Error fetching promo codes:', error);
          setPromoCodes([]);
          return;
        }
        
        setPromoCodes(data || []);
      } catch (error) {
        console.error('Error fetching promo codes:', error);
        setPromoCodes([]);
      }
    };

    fetchPromoCodes();
  }, []);

  // Configuration des frais selon direction et destination
  const feeRates = {
    "beceao-cemac": {
      gabon: 0.11,
      cameroun: 0.035,
      "centrafrique": 0.035,
      "congo": 0.035,
      "congo-rdc": 0.035,
      "guinee-equatoriale": 0.035,
      "tchad": 0.035
    },
    "cemac-beceao": {
      instant: 0.096,
      "1-2days": 0.087,
      "3days": 0.073
    },
    "beceao-beceao": {
      instant: 0.05,
      "1-2days": 0.04,
      "3days": 0.03
    },
    "france-togo": {
      standard: 0.01
    },
    "togo-europe": {
      france: 0.089,
      allemagne: 0.089,
      autres: 0.089
    },
    "cemac-europe": {
      gabon: 0.089,
      cameroun: 0.089,
      "centrafrique": 0.089,
      "congo": 0.089,
      "congo-rdc": 0.089,
      "guinee-equatoriale": 0.089,
      "tchad": 0.089
    },
    "beceao-europe": {
      togo: 0.089,
      "cote-ivoire": 0.089,
      benin: 0.089,
      burkina: 0.089,
      senegal: 0.089,
      mali: 0.089
    }
  };

  const deliveryDiscounts = {
    instant: 0,
    "1day": 0.01,
    "2days": 0.02,
    "3days": 0.03
  };

  // Options Mobile Money expéditeur
  const senderMobileMoneyOptions: Record<string, Array<{value: string, label: string, recommended?: boolean, fees: string}>> = {
    gabon: [
      { value: "moov-money", label: "Moov Money", recommended: true, fees: "2-3%" },
      { value: "airtel-money", label: "Airtel Money", fees: "3-4%" }
    ],
    cameroun: [
      { value: "orange-money", label: "Orange Money", recommended: true, fees: "Variable" },
      { value: "mtn", label: "MTN Mobile Money", fees: "Variable" }
    ],
    centrafrique: [
      { value: "moov-money", label: "Moov Money", recommended: true, fees: "Variable" },
      { value: "orange-money", label: "Orange Money", fees: "Variable" }
    ],
    congo: [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    "congo-rdc": [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    "guinee-equatoriale": [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    tchad: [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    // Afrique de l'Ouest
    togo: [
      { value: "mix-by-yas", label: "Mix by Yas", recommended: true, fees: "Variable" },
      { value: "moov-money", label: "Moov Money", fees: "Variable" }
    ],
    "cote-ivoire": [
      { value: "orange-money", label: "Orange Money", fees: "Variable" },
      { value: "wave", label: "Wave", fees: "Variable" }
    ],
    benin: [{ value: "mtn", label: "MTN", fees: "Variable" }],
    burkina: [{ value: "wave", label: "Wave", fees: "Variable" }],
    senegal: [{ value: "wave", label: "Wave", fees: "Variable" }],
    mali: [{ value: "wave", label: "Wave", fees: "Variable" }]
  };

  // Options Mobile Money destinataire
  const receiverMobileMoneyOptions: Record<string, Array<{value: string, label: string, recommended?: boolean, note?: string}>> = {
    togo: [
      { value: "mix-by-yas", label: "Mix by Yas", recommended: true, note: "Rapide" },
      { value: "moov-money", label: "Moov Money", note: "Délai possible" }
    ],
    "cote-ivoire": [
      { value: "orange-money", label: "Orange Money" },
      { value: "wave", label: "Wave" }
    ],
    benin: [{ value: "mtn", label: "MTN" }],
    burkina: [{ value: "wave", label: "Wave" }],
    senegal: [{ value: "wave", label: "Wave" }],
    mali: [{ value: "wave", label: "Wave" }],
    ghana: [{ value: "mtn", label: "MTN" }]
  };

  // Méthodes de réception en Europe
  const europeReceiveMethods = [
    { value: "virement", label: "Virement bancaire" },
    { value: "paypal", label: "PayPal" },
    { value: "revolut", label: "Revolut / Néo-banque" },
    { value: "paiement-site", label: "Paiement sur un site web" },
    { value: "autres", label: "Autres" }
  ];

  // Pays Afrique de l'Ouest
  const westAfricaCountries = [
    { value: "togo", label: "Togo" },
    { value: "cote-ivoire", label: "Côte d'Ivoire" },
    { value: "benin", label: "Bénin" },
    { value: "burkina", label: "Burkina Faso" },
    { value: "senegal", label: "Sénégal" },
    { value: "mali", label: "Mali" },
    { value: "ghana", label: "Ghana" }
  ];

  // Pays CEMAC (Afrique Centrale)
  const cemacCountries = [
    { value: "gabon", label: "🇬🇦 Gabon", recommended: true },
    { value: "cameroun", label: "🇨🇲 Cameroun" },
    { value: "centrafrique", label: "🇨🇫 République Centrafricaine" },
    { value: "congo", label: "🇨🇬 Congo-Brazzaville" },
    { value: "congo-rdc", label: "🇨🇩 Congo-Kinshasa (RDC)" },
    { value: "guinee-equatoriale", label: "🇬🇶 Guinée Équatoriale" },
    { value: "tchad", label: "🇹🇩 Tchad" }
  ];

  const calculateTransfer = () => {
    setFormError("");

    if (!amount || parseFloat(amount) <= 0) {
      setFormError("Entrez un montant valide pour lancer la simulation.");
      return;
    }

    if (!direction || !deliveryTime) {
      setFormError("Choisissez la direction du transfert et le délai de réception.");
      return;
    }
    
    // Validations spécifiques
    if (direction === "cemac-beceao" && (!destination || !destinationCountry || !senderMobileMoney || !receiverMobileMoney)) {
      setFormError("Complétez le pays d’origine, le pays de réception et les moyens Mobile Money.");
      return;
    }
    if (direction === "beceao-beceao" && (!destination || !destinationCountry || !senderMobileMoney || !receiverMobileMoney)) {
      setFormError("Complétez le pays d’origine, le pays de réception et les moyens Mobile Money.");
      return;
    }
    if ((direction === "cemac-europe" || direction === "beceao-europe") && (!destination || !senderMobileMoney || !europeReceiveMethod)) {
      setFormError("Complétez le pays d’origine, le Mobile Money expéditeur et le mode de réception en Europe.");
      return;
    }
    if (direction !== "cemac-beceao" && direction !== "beceao-beceao" && direction !== "france-togo" && direction !== "cemac-europe" && direction !== "beceao-europe" && !destination) {
      setFormError("Choisissez le pays de destination pour calculer les frais.");
      return;
    }

    const amountNum = parseFloat(amount);
    let baseFeeRate = 0;
    let cashback = 0;
    let promoEffect = "";
    let senderMobileMoneyInfo = "";
    let receiverMobileMoneyInfo = "";

    if (direction === "beceao-cemac") {
      baseFeeRate = feeRates["beceao-cemac"][destination as keyof typeof feeRates["beceao-cemac"]] || 0.035;
    } else if (direction === "cemac-beceao") {
      const PROMO_MINIMUM = 50000;
      
      if (amountNum >= PROMO_MINIMUM) {
        if (deliveryTime === "instant") {
          baseFeeRate = feeRates["cemac-beceao"].instant;
        } else if (deliveryTime === "1-2days") {
          baseFeeRate = feeRates["cemac-beceao"]["1-2days"];
        } else if (deliveryTime === "3days") {
          baseFeeRate = feeRates["cemac-beceao"]["3days"];
        }
        promoEffect = "Promo appliquée (montant ≥ 50 000 FCFA)";
      } else {
        baseFeeRate = 0.11;
        promoEffect = "Taux standard 11% (montant < 50 000 FCFA)";
      }
      
      const senderOption = senderMobileMoneyOptions[destination]?.find(o => o.value === senderMobileMoney);
      const receiverOption = receiverMobileMoneyOptions[destinationCountry]?.find(o => o.value === receiverMobileMoney);
      senderMobileMoneyInfo = senderOption ? `${senderOption.label} (${senderOption.fees} frais réseau)` : "";
      receiverMobileMoneyInfo = receiverOption ? `${receiverOption.label}${receiverOption.note ? ` - ${receiverOption.note}` : ""}` : "";
    } else if (direction === "beceao-beceao") {
      if (deliveryTime === "instant") {
        baseFeeRate = feeRates["beceao-beceao"].instant;
      } else if (deliveryTime === "1-2days") {
        baseFeeRate = feeRates["beceao-beceao"]["1-2days"];
      } else if (deliveryTime === "3days") {
        baseFeeRate = feeRates["beceao-beceao"]["3days"];
      }
      
      const senderOption = senderMobileMoneyOptions[destination]?.find(o => o.value === senderMobileMoney);
      const receiverOption = receiverMobileMoneyOptions[destinationCountry]?.find(o => o.value === receiverMobileMoney);
      senderMobileMoneyInfo = senderOption ? `${senderOption.label}` : "";
      receiverMobileMoneyInfo = receiverOption ? `${receiverOption.label}${receiverOption.note ? ` - ${receiverOption.note}` : ""}` : "";
    } else if (direction === "france-togo") {
      baseFeeRate = feeRates["france-togo"].standard;
    } else if (direction === "togo-europe") {
      baseFeeRate = feeRates["togo-europe"][destination as keyof typeof feeRates["togo-europe"]] || 0.089;
    } else if (direction === "cemac-europe") {
      baseFeeRate = feeRates["cemac-europe"][destination as keyof typeof feeRates["cemac-europe"]] || 0.089;
      const senderOption = senderMobileMoneyOptions[destination]?.find(o => o.value === senderMobileMoney);
      senderMobileMoneyInfo = senderOption ? `${senderOption.label}` : "";
    } else if (direction === "beceao-europe") {
      baseFeeRate = feeRates["beceao-europe"][destination as keyof typeof feeRates["beceao-europe"]] || 0.089;
      const senderOption = senderMobileMoneyOptions[destination]?.find(o => o.value === senderMobileMoney);
      senderMobileMoneyInfo = senderOption ? `${senderOption.label}` : "";
    }

    if (direction === "beceao-cemac") {
      const deliveryDiscount = deliveryDiscounts[deliveryTime as keyof typeof deliveryDiscounts] || 0;
      baseFeeRate = Math.max(0, baseFeeRate - deliveryDiscount);
    }

    // Codes promo (pas pour CEMAC → BECEAO)
    if (promoCode && direction !== "cemac-beceao") {
      const matchedPromo = promoCodes.find(p => p.code.toUpperCase() === promoCode.toUpperCase());
      
      if (matchedPromo) {
        if (matchedPromo.type === "welcome") {
          baseFeeRate = 0;
          promoEffect = `Code BIENVENUE : 0% de frais`;
        } else if (matchedPromo.type === "ambassador") {
          const feesAmount = amountNum * baseFeeRate;
          cashback = Math.round(feesAmount * (matchedPromo.discount_percentage / 100));
          promoEffect = `Cashback ambassadeur : ${matchedPromo.discount_percentage}% des frais`;
        }
      }
    }

    const fees = amountNum * baseFeeRate;
    const totalToPay = amountNum + fees;
    const amountReceived = amountNum;
    const referenceNumber = generateReferenceNumber();

    setResult({
      totalToPay,
      amountReceived,
      fees,
      cashback,
      promoEffect,
      senderMobileMoneyInfo,
      receiverMobileMoneyInfo,
      referenceNumber
    });
  };

  const sendToWhatsApp = () => {
    if (!result) return;
    
    let directionText = "";
    if (direction === "beceao-cemac") {
      directionText = `depuis le Togo vers ${destination.toUpperCase()}`;
    } else if (direction === "cemac-beceao") {
      const destCountryLabel = westAfricaCountries.find(c => c.value === destinationCountry)?.label || destinationCountry;
      directionText = `depuis ${destination.toUpperCase()} vers ${destCountryLabel.toUpperCase()}`;
    } else if (direction === "beceao-beceao") {
      const originLabel = westAfricaCountries.find(c => c.value === destination)?.label || destination;
      const destLabel = westAfricaCountries.find(c => c.value === destinationCountry)?.label || destinationCountry;
      directionText = `depuis ${originLabel.toUpperCase()} vers ${destLabel.toUpperCase()}`;
    } else if (direction === "togo-europe") {
      directionText = `depuis le Togo vers ${destination === "autres" ? "l'EUROPE" : destination.toUpperCase()}`;
    } else if (direction === "cemac-europe") {
      directionText = `depuis ${destination.toUpperCase()} vers l'EUROPE`;
    } else if (direction === "beceao-europe") {
      const originLabel = westAfricaCountries.find(c => c.value === destination)?.label || destination;
      directionText = `depuis ${originLabel.toUpperCase()} vers l'EUROPE`;
    } else {
      directionText = "depuis la FRANCE vers le Togo";
    }
    
    let deliveryText = "instantané";
    if (deliveryTime === "1day") deliveryText = "24h";
    else if (deliveryTime === "2days") deliveryText = "2 jours";
    else if (deliveryTime === "3days") deliveryText = "3 jours";
    else if (deliveryTime === "1-2days") deliveryText = "1-2 jours";
    
    const today = new Date();
    const transactionDate = today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });

    const EUR_RATE = 655;
    
    // Devises et montants selon la direction
    let sendCurrency = 'XOF';
    let receiveCurrency = 'XOF';
    let displayAmountReceived = result.amountReceived;
    let displayFees = result.fees;
    let displayTotalToPay = result.totalToPay;
    
    if (direction === 'france-togo') {
      sendCurrency = 'EUR';
      receiveCurrency = 'XOF';
      // Montant en EUR, on reçoit en XOF
      displayAmountReceived = Math.floor(result.amountReceived * EUR_RATE);
    } else if (direction === 'togo-europe' || direction === 'beceao-europe') {
      sendCurrency = 'XOF';
      receiveCurrency = 'EUR';
      // Envoi en XOF, conversion en EUR pour réception
      displayAmountReceived = Math.floor(result.amountReceived / EUR_RATE);
    } else if (direction === 'cemac-europe') {
      sendCurrency = 'XAF';
      receiveCurrency = 'EUR';
      displayAmountReceived = Math.floor(result.amountReceived / EUR_RATE);
    } else if (direction === 'beceao-cemac') {
      sendCurrency = 'XOF';
      receiveCurrency = 'XAF';
    } else if (direction === 'cemac-beceao') {
      sendCurrency = 'XAF';
      receiveCurrency = 'XOF';
    } else if (direction === 'beceao-beceao') {
      sendCurrency = 'XOF';
      receiveCurrency = 'XOF';
    }
    
    // Récupérer le code parrain depuis l'URL ou localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref') || localStorage.getItem('referralCode') || '';
    
    let message = `🎄✨ DYNAMIK Transfert - Demande de transfert ✨🎄

📋 RÉFÉRENCE : ${result.referenceNumber}
📅 Date : ${transactionDate}${referralCode ? `\n🎁 Code parrain : ${referralCode}` : ''}

🎅 Joyeuses Fêtes et Meilleurs Vœux pour 2026 ! 🎅
Merci de votre confiance !

💰 DÉTAILS DU TRANSFERT :
- Montant à envoyer : ${parseFloat(amount).toFixed(0)} ${sendCurrency}
- Direction : ${directionText}
- Motif : ${motif || 'Non spécifié'}
- Délai : ${deliveryText}
- Frais : ${displayFees.toFixed(0)} ${sendCurrency}
- Total à payer : ${displayTotalToPay.toFixed(0)} ${sendCurrency}
- Montant reçu : ${displayAmountReceived} ${receiveCurrency}`;

    // Mobile Money info
    if (direction === "cemac-beceao" || direction === "beceao-beceao") {
      message += `\n\n📱 MOBILE MONEY :`;
      if (result.senderMobileMoneyInfo) {
        message += `\n- Envoi via : ${result.senderMobileMoneyInfo}`;
      }
      if (result.receiverMobileMoneyInfo) {
        message += `\n- Réception via : ${result.receiverMobileMoneyInfo}`;
      }
    }

    // Europe transfers - Mobile Money sender + receive method
    if (direction === "cemac-europe" || direction === "beceao-europe") {
      message += `\n\n📱 MOBILE MONEY EXPÉDITEUR :`;
      if (result.senderMobileMoneyInfo) {
        message += `\n- Envoi via : ${result.senderMobileMoneyInfo}`;
      }
      const receiveMethodLabel = europeReceiveMethods.find(m => m.value === europeReceiveMethod)?.label || europeReceiveMethod;
      message += `\n\n💳 MODE DE RÉCEPTION EN EUROPE :`;
      message += `\n- ${receiveMethodLabel}`;
      message += `\n\n📄 NOTE : Carte d'identité requise pour ce transfert.`;
    }

    if (promoCode) {
      message += `\n- Code promo : ${promoCode.toUpperCase()} (${result.promoEffect})`;
    }

    if (result.cashback > 0) {
      message += `\n- Cashback ambassadeur : +${result.cashback} FCFA`;
    }

    message += `\n\n✅ Je confirme vouloir procéder à ce transfert.
📱 Merci de me contacter pour finaliser.

🔖 Conservez votre référence : ${result.referenceNumber}`;

    const finalMessage = `Bonjour DYNAMIK TRANSFERT, ${message}`;
    const whatsappUrl = `https://wa.me/22899771419?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendCustomRequest = () => {
    if (!customRequest.trim()) return;
    
    const message = `Bonjour DYNAMIK TRANSFERT,

📋 DEMANDE PERSONNALISÉE

Je ne trouve pas l'option de transfert que je cherche. Voici ma demande :

${customRequest}

Merci de me contacter pour plus d'informations.`;

    const whatsappUrl = `https://wa.me/22899771419?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Reset des champs dépendants lors du changement de direction
  const handleDirectionChange = (value: string) => {
    setDirection(value);
    setDestination("");
    setDestinationCountry("");
    setSenderMobileMoney("");
    setReceiverMobileMoney("");
    setEuropeReceiveMethod("");
    setDeliveryTime(value === "france-togo" ? "instant" : "");
    setFormError("");
    setResult(null);
  };

  return (
    <section id="calculator" className="py-20 bg-background scroll-reveal" ref={scrollRevealRef}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Calculez vos <span className="text-violet-digital">frais de transfert</span>
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground mb-12 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Transferts rapides, sécurisés et économiques avec DYNAMIK Transfert
          </motion.p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="shadow-card hover-anticipate">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Votre transfert</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Montant à envoyer</label>
                  <Input
                    type="number"
                    placeholder="Ex: 50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Direction du transfert</label>
                  <Select value={direction} onValueChange={handleDirectionChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choisissez votre transfert" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Les plus fréquents en premier */}
                      <SelectItem value="cemac-beceao">🔥 Afrique Centrale → Afrique de l'Ouest (PROMO -7.3%)</SelectItem>
                      <SelectItem value="france-togo">🇫🇷 France → Togo (1% fixe)</SelectItem>
                      <SelectItem value="cemac-europe">🌍 Afrique Centrale → Europe (8.9%)</SelectItem>
                      <SelectItem value="beceao-europe">🌍 Afrique de l'Ouest → Europe (8.9%)</SelectItem>
                      <SelectItem value="beceao-beceao">🌍 Afrique de l'Ouest ↔ Afrique de l'Ouest</SelectItem>
                      <SelectItem value="beceao-cemac">🌍 Togo → Afrique Centrale</SelectItem>
                      <SelectItem value="togo-europe">🎄 Togo → Europe (Promo 8.9%)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {direction === "cemac-beceao" && (
                    <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                      <p className="text-xs text-emerald-700 font-medium">
                        🔥 Promo spéciale jusqu'au 20 janvier 2026 !
                      </p>
                      <p className="text-xs text-muted-foreground">
                        💡 Minimum 50 000 FCFA pour la promo. En dessous : 11% fixe.
                      </p>
                    </div>
                  )}

                  {(direction === "cemac-europe" || direction === "beceao-europe") && (
                    <div className="mt-2 p-3 bg-accent/10 border border-accent/30 rounded-lg space-y-1">
                      <p className="text-xs text-accent font-medium">
                        💳 Transferts vers l'Europe simplifiés !
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Envoyez depuis votre Mobile Money, recevez par virement, PayPal, Revolut ou payez directement sur un site.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Motif du transfert</label>
                  <Select value={motif} onValueChange={setMotif}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Sélectionnez un motif" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="famille">Soutien familial</SelectItem>
                      <SelectItem value="education">Frais d'éducation</SelectItem>
                      <SelectItem value="medical">Frais médicaux</SelectItem>
                      <SelectItem value="business">Transaction commerciale</SelectItem>
                      <SelectItem value="investment">Investissement</SelectItem>
                      <SelectItem value="paiement-service">Paiement de service</SelectItem>
                      <SelectItem value="achat-en-ligne">Achat en ligne</SelectItem>
                      <SelectItem value="autres">Autres</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requis pour la conformité (LCB-FT)
                  </p>
                </div>

                {/* Pays d'origine / destination selon direction */}
                {direction && direction !== "france-togo" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {direction === "beceao-cemac" || direction === "togo-europe" 
                        ? "Pays de destination" 
                        : "Pays d'origine (où vous envoyez)"}
                    </label>
                    <Select value={destination} onValueChange={(value) => {
                      setDestination(value);
                      setSenderMobileMoney("");
                    }}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionnez le pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {direction === "beceao-cemac" && cemacCountries.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                        {direction === "cemac-beceao" && cemacCountries.map(c => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.recommended ? "🌟 " : ""}{c.label}
                            {c.recommended ? " (Moov Money recommandé)" : ""}
                          </SelectItem>
                        ))}
                        {direction === "cemac-europe" && cemacCountries.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                        {direction === "beceao-europe" && westAfricaCountries.filter(c => c.value !== "ghana").map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                        {direction === "beceao-beceao" && westAfricaCountries.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                        {direction === "togo-europe" && (
                          <>
                            <SelectItem value="france">France</SelectItem>
                            <SelectItem value="allemagne">Allemagne</SelectItem>
                            <SelectItem value="autres">Autres pays européens</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Mobile Money Expéditeur */}
                {(direction === "cemac-beceao" || direction === "cemac-europe" || direction === "beceao-europe" || direction === "beceao-beceao") && destination && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      📱 Votre Mobile Money (envoi)
                    </label>
                    <Select value={senderMobileMoney} onValueChange={setSenderMobileMoney}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choisissez votre Mobile Money" />
                      </SelectTrigger>
                      <SelectContent>
                        {senderMobileMoneyOptions[destination]?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.recommended ? "⭐ " : ""}{option.label}
                            {option.recommended ? " - Recommandé" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {destination === "gabon" && (
                      <p className="text-xs text-accent mt-1">
                        💡 Moov Money : moins de frais de retrait et plus rapide !
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      ℹ️ Les frais Mobile Money sont à votre charge selon votre opérateur.
                    </p>
                  </div>
                )}

                {/* Pays destinataire Afrique de l'Ouest */}
                {(direction === "cemac-beceao" || direction === "beceao-beceao") && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      🌍 Pays destinataire
                    </label>
                    <Select value={destinationCountry} onValueChange={(value) => {
                      setDestinationCountry(value);
                      setReceiverMobileMoney("");
                    }}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Vers quel pays ?" />
                      </SelectTrigger>
                      <SelectContent>
                        {westAfricaCountries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Mobile Money Destinataire */}
                {(direction === "cemac-beceao" || direction === "beceao-beceao") && destinationCountry && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      📱 Mobile Money destinataire
                    </label>
                    <Select value={receiverMobileMoney} onValueChange={setReceiverMobileMoney}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Mobile Money de réception" />
                      </SelectTrigger>
                      <SelectContent>
                        {receiverMobileMoneyOptions[destinationCountry]?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.recommended ? "⭐ " : ""}{option.label}
                            {option.note ? ` (${option.note})` : ""}
                            {option.recommended ? " - Recommandé" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {destinationCountry === "togo" && (
                      <p className="text-xs text-accent mt-1">
                        💡 Mix by Yas : traitement prioritaire et rapide !
                      </p>
                    )}
                  </div>
                )}

                {/* Mode de réception Europe */}
                {(direction === "cemac-europe" || direction === "beceao-europe") && destination && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      💳 Mode de réception en Europe
                    </label>
                    <Select value={europeReceiveMethod} onValueChange={setEuropeReceiveMethod}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Comment recevoir les fonds ?" />
                      </SelectTrigger>
                      <SelectContent>
                        {europeReceiveMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      📄 Une pièce d'identité sera demandée pour ce transfert.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Délai de réception</label>
                  <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choisissez le délai" />
                    </SelectTrigger>
                    <SelectContent>
                      {direction === "beceao-cemac" ? (
                        <>
                          <SelectItem value="instant">Instantané (frais standards)</SelectItem>
                          <SelectItem value="1day">24h (-1% sur frais)</SelectItem>
                          <SelectItem value="2days">2 jours (-2% sur frais)</SelectItem>
                          <SelectItem value="3days">3 jours (-3% sur frais)</SelectItem>
                        </>
                       ) : direction === "cemac-beceao" ? (
                         <>
                           <SelectItem value="instant">⚡ Instantané (9.6%)</SelectItem>
                           <SelectItem value="1-2days">📅 1-2 jours (8.7%)</SelectItem>
                           <SelectItem value="3days">📅 Après 3 jours (7.3%)</SelectItem>
                         </>
                        ) : direction === "beceao-beceao" ? (
                          <>
                            <SelectItem value="instant">⚡ Instantané (5%)</SelectItem>
                            <SelectItem value="1-2days">📅 1-2 jours (4%)</SelectItem>
                            <SelectItem value="3days">📅 Après 3 jours (3%)</SelectItem>
                          </>
                        ) : (direction === "togo-europe" || direction === "cemac-europe" || direction === "beceao-europe") ? (
                          <SelectItem value="instant">Instantané (8.9%)</SelectItem>
                        ) : direction === "france-togo" ? (
                          <SelectItem value="instant">Instantané (1% fixe)</SelectItem>
                        ) : null}
                    </SelectContent>
                  </Select>
                  {(direction === "togo-europe" || direction === "cemac-europe" || direction === "beceao-europe") && (
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-medium mb-1">
                        ⚠️ Transferts vers l'Europe :
                      </p>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                        <li>Limite : 1000€ max/jour</li>
                        <li>Vérification d'identité obligatoire</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Code promo (optionnel)</label>
                   <Input
                    placeholder="Entrez votre code promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-12"
                    disabled={direction === "cemac-beceao"}
                  />
                  {direction === "cemac-beceao" ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      ⚠️ Codes promos non applicables sur cette promotion
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Premier transfert ? Utilisez <span className="font-bold text-violet-digital">BIENVENUE</span>
                    </p>
                  )}
                </div>

                <Button 
                  onClick={calculateTransfer}
                  className="w-full h-12 text-lg"
                  variant="hero"
                >
                  Calculer mes frais
                </Button>

                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {formError}
                  </div>
                )}

                {/* Option demande personnalisée */}
                <div className="pt-4 border-t border-border">
                  <button 
                    onClick={() => setShowCustomRequest(!showCustomRequest)}
                    className="text-sm text-muted-foreground hover:text-violet-digital transition-colors flex items-center gap-2"
                  >
                    <span>🔍</span>
                    <span>Vous ne trouvez pas votre option de transfert ?</span>
                  </button>
                  
                  {showCustomRequest && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        placeholder="Décrivez votre besoin de transfert (pays d'origine, destination, montant, etc.)"
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        onClick={sendCustomRequest}
                        variant="outline"
                        className="w-full"
                        disabled={!customRequest.trim()}
                      >
                        Envoyer ma demande sur WhatsApp
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              </Card>
            </motion.div>

            {/* Résultats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <Card className="shadow-card hover-anticipate">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Votre devis</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Référence */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">Référence</p>
                      <p className="text-lg font-mono font-bold text-violet-digital">{result.referenceNumber}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Total à payer</span>
                        <span className="text-2xl font-bold text-violet-digital">
                          {result.totalToPay.toFixed(0)} {direction === 'france-togo' ? 'EUR' : (direction?.includes('cemac') && !direction?.includes('beceao')) ? 'XAF' : 'XOF'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-violet-digital/10 rounded-lg">
                        <span className="text-muted-foreground">Montant reçu</span>
                        <span className="text-2xl font-bold text-accent">
                          {direction === 'france-togo' 
                            ? `${Math.floor(result.amountReceived * 655)} XOF`
                            : (direction === 'togo-europe' || direction === 'cemac-europe' || direction === 'beceao-europe')
                              ? `${Math.floor(result.amountReceived / 655)} EUR`
                              : `${result.amountReceived.toFixed(0)} ${direction === 'cemac-beceao' ? 'XOF' : direction === 'beceao-cemac' ? 'XAF' : 'XOF'}`
                          }
                        </span>
                      </div>
                      
                       <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Frais appliqués</span>
                        <span className="text-lg font-bold">
                          {result.fees.toFixed(0)} {direction === 'france-togo' ? 'EUR' : (direction?.startsWith('cemac') && direction !== 'cemac-beceao') ? 'XAF' : 'XOF'}
                        </span>
                      </div>

                      {result.promoEffect && (
                        <div className="flex justify-between items-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                          <span className="text-muted-foreground">Promo</span>
                          <span className="text-sm font-bold text-accent">
                            {result.promoEffect}
                          </span>
                        </div>
                      )}

                      {result.cashback > 0 && (
                        <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                          <span className="text-muted-foreground">Cashback</span>
                          <span className="text-lg font-bold text-emerald-700">
                            +{result.cashback} FCFA
                          </span>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={sendToWhatsApp}
                      className="w-full h-12 text-lg"
                      variant="whatsapp"
                    >
                      Finaliser sur WhatsApp 🚀
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Conservez votre référence : <span className="font-mono font-bold">{result.referenceNumber}</span>
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Remplissez le formulaire pour voir votre devis
                    </p>
                  </div>
                )}
              </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;