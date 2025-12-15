import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const Calculator = () => {
  const scrollRevealRef = useScrollReveal();
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationCountry, setDestinationCountry] = useState(""); // Pour CEMAC → BECEAO
  const [senderMobileMoney, setSenderMobileMoney] = useState("");
  const [receiverMobileMoney, setReceiverMobileMoney] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [motif, setMotif] = useState("");
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
  } | null>(null);

  // Fetch available promo codes from database on component mount
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const { data, error } = await supabase
          .from('promo_codes')
          .select('id, code, type, discount_percentage, ambassador_name')
          .eq('is_active', true);
        
        if (error) {
          console.error('Error fetching promo codes:', error);
          // Set empty array if fetch fails
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
      gabon: 0.11, // 11% pour le Gabon
      cameroun: 0.035, // 3.5% pour autres pays CEMAC
      "centrafrique": 0.035,
      "congo": 0.035,
      "guinee-equatoriale": 0.035,
      "tchad": 0.035
    },
    // PROMO CEMAC → BECEAO (jusqu'au 20 janvier 2026)
    "cemac-beceao": {
      instant: 0.096, // 9.6% instantané
      "1-2days": 0.087, // 8.7% en 1-2 jours
      "3days": 0.073 // 7.3% après 3 jours
    },
    "france-togo": {
      standard: 0.01 // 1% fixe pour France vers Togo
    },
    "togo-europe": {
      france: 0.089, // 8.9% promo fêtes de fin d'année
      allemagne: 0.089,
      autres: 0.089
    },
    "cemac-europe": {
      gabon: 0.089, // 8.9% pour le Gabon vers Europe
      cameroun: 0.089,
      "centrafrique": 0.089,
      "congo": 0.089,
      "guinee-equatoriale": 0.089,
      "tchad": 0.089
    }
  };

  // Réductions selon délai de livraison (pour BECEAO → CEMAC)
  const deliveryDiscounts = {
    instant: 0,
    "1day": 0.01, // -1%
    "2days": 0.02, // -2%
    "3days": 0.03 // -3%
  };

  // Options Mobile Money expéditeur selon pays
  const senderMobileMoneyOptions: Record<string, Array<{value: string, label: string, recommended?: boolean, fees: string}>> = {
    gabon: [
      { value: "moov-money", label: "Moov Money", recommended: true, fees: "2-3%" },
      { value: "airtel-money", label: "Airtel Money", fees: "3-4%" }
    ],
    cameroun: [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    centrafrique: [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    congo: [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    "guinee-equatoriale": [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }],
    tchad: [{ value: "airtel-money", label: "Airtel Money", fees: "Variable" }]
  };

  // Options Mobile Money destinataire selon pays d'Afrique de l'Ouest
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

  // Liste des pays destinataires Afrique de l'Ouest
  const westAfricaCountries = [
    { value: "togo", label: "Togo" },
    { value: "cote-ivoire", label: "Côte d'Ivoire" },
    { value: "benin", label: "Bénin" },
    { value: "burkina", label: "Burkina Faso" },
    { value: "senegal", label: "Sénégal" },
    { value: "mali", label: "Mali" },
    { value: "ghana", label: "Ghana" }
  ];

  const calculateTransfer = () => {
    if (!amount || !direction || !deliveryTime) return;
    
    // Validation spécifique par direction
    if (direction === "cemac-beceao" && (!destination || !destinationCountry || !senderMobileMoney || !receiverMobileMoney)) return;
    if (direction !== "cemac-beceao" && direction !== "france-togo" && !destination) return;

    const amountNum = parseFloat(amount);
    let baseFeeRate = 0;
    let cashback = 0;
    let promoEffect = "";
    let senderMobileMoneyInfo = "";
    let receiverMobileMoneyInfo = "";

    // Détermination du taux de base selon direction
    if (direction === "beceao-cemac") {
      baseFeeRate = feeRates["beceao-cemac"][destination as keyof typeof feeRates["beceao-cemac"]] || 0.035;
    } else if (direction === "cemac-beceao") {
      // PROMO jusqu'au 20 janvier 2026 - frais selon délai
      if (deliveryTime === "instant") {
        baseFeeRate = feeRates["cemac-beceao"].instant; // 9.6%
      } else if (deliveryTime === "1-2days") {
        baseFeeRate = feeRates["cemac-beceao"]["1-2days"]; // 8.7%
      } else if (deliveryTime === "3days") {
        baseFeeRate = feeRates["cemac-beceao"]["3days"]; // 7.3%
      }
      
      // Info Mobile Money
      const senderOption = senderMobileMoneyOptions[destination]?.find(o => o.value === senderMobileMoney);
      const receiverOption = receiverMobileMoneyOptions[destinationCountry]?.find(o => o.value === receiverMobileMoney);
      senderMobileMoneyInfo = senderOption ? `${senderOption.label} (${senderOption.fees} frais réseau)` : "";
      receiverMobileMoneyInfo = receiverOption ? `${receiverOption.label}${receiverOption.note ? ` - ${receiverOption.note}` : ""}` : "";
    } else if (direction === "france-togo") {
      baseFeeRate = feeRates["france-togo"].standard; // 1% fixe
    } else if (direction === "togo-europe") {
      baseFeeRate = feeRates["togo-europe"][destination as keyof typeof feeRates["togo-europe"]] || 0.089;
    } else if (direction === "cemac-europe") {
      baseFeeRate = feeRates["cemac-europe"][destination as keyof typeof feeRates["cemac-europe"]] || 0.089;
    }

    // Application des réductions de délai (pour BECEAO → CEMAC uniquement)
    if (direction === "beceao-cemac") {
      const deliveryDiscount = deliveryDiscounts[deliveryTime as keyof typeof deliveryDiscounts] || 0;
      baseFeeRate = Math.max(0, baseFeeRate - deliveryDiscount);
    }

    // Application des codes promo ambassadeurs - CASHBACK uniquement (pas de réduction supplémentaire)
    // Les réductions de fêtes sont déjà appliquées pour les clients
    if (promoCode && direction !== "cemac-beceao") {
      const matchedPromo = promoCodes.find(p => p.code.toUpperCase() === promoCode.toUpperCase());
      
      if (matchedPromo) {
        if (matchedPromo.type === "welcome") {
          // Code bienvenue : 0% de frais pour le premier transfert
          baseFeeRate = 0;
          promoEffect = `Code BIENVENUE : 0% de frais`;
        } else if (matchedPromo.type === "ambassador") {
          // Codes ambassadeurs : uniquement cashback pour le détenteur du code
          // Calcul du cashback basé sur le pourcentage des frais
          const feesAmount = amountNum * baseFeeRate;
          cashback = Math.round(feesAmount * (matchedPromo.discount_percentage / 100));
          promoEffect = `Cashback ambassadeur : ${matchedPromo.discount_percentage}% des frais`;
        }
      }
    }

    const fees = amountNum * baseFeeRate;
    const totalToPay = amountNum + fees;
    const amountReceived = amountNum; // Même devise FCFA

    setResult({
      totalToPay,
      amountReceived,
      fees,
      cashback,
      promoEffect,
      senderMobileMoneyInfo,
      receiverMobileMoneyInfo
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
    } else if (direction === "togo-europe") {
      directionText = `depuis le Togo vers ${destination === "autres" ? "l'EUROPE" : destination.toUpperCase()}`;
    } else if (direction === "cemac-europe") {
      directionText = `depuis ${destination.toUpperCase()} vers l'EUROPE`;
    } else {
      directionText = "depuis la FRANCE vers le Togo";
    }
    
    let deliveryText = "instantané";
    if (deliveryTime === "1day") deliveryText = "24h";
    else if (deliveryTime === "2days") deliveryText = "2 jours";
    else if (deliveryTime === "3days") deliveryText = "3 jours";
    else if (deliveryTime === "1-2days") deliveryText = "1-2 jours";
    
    // Formatage de la date du jour
    const today = new Date();
    const transactionDate = today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });

    // Devise selon la direction
    // XOF = Franc CFA BCEAO (Togo/Afrique de l'Ouest)
    // XAF = Franc CFA CEMAC (Gabon, Cameroun, etc.)
    // EUR = Euro
    const EUR_RATE = 655; // Taux de conversion FCFA -> EUR
    
    let sendCurrency = 'XOF';
    let receiveCurrency = 'XOF';
    let displayAmountReceived = result.amountReceived;
    
    if (direction === 'france-togo') {
      sendCurrency = 'EUR';
      receiveCurrency = 'XOF';
    } else if (direction === 'togo-europe') {
      sendCurrency = 'XOF';
      receiveCurrency = 'EUR';
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
    }
    
    let message = `🎄✨ DYNAMIK Transfert - Demande de transfert ✨🎄
📅 Date de la transaction : ${transactionDate}

🎅 Joyeux Noël et Excellentes Fêtes de fin d'année ! 🎅
Toute l'équipe DYNAMIK Transfert vous souhaite ses meilleurs vœux de bonheur, de santé et de prospérité pour cette période festive et pour la nouvelle année à venir.
Merci de votre confiance ! Profitez de nos tarifs réduits spécial fêtes 🎁

💰 DÉTAILS DU TRANSFERT :
- Montant : ${amount} ${sendCurrency}
- Direction : ${directionText}
- Motif : ${motif || 'Non spécifié'}
- Délai : ${deliveryText}
- Total à payer : ${result.totalToPay.toFixed(0)} ${sendCurrency}
- Montant reçu : ${displayAmountReceived} ${receiveCurrency}
- Frais appliqués : ${result.fees.toFixed(0)} ${sendCurrency}`;

    // Ajout des infos Mobile Money pour CEMAC → BECEAO
    if (direction === "cemac-beceao") {
      message += `\n\n📱 MOBILE MONEY :`;
      if (result.senderMobileMoneyInfo) {
        message += `\n- Envoi via : ${result.senderMobileMoneyInfo}`;
      }
      if (result.receiverMobileMoneyInfo) {
        message += `\n- Réception via : ${result.receiverMobileMoneyInfo}`;
      }
    }

    if (promoCode) {
      message += `\n- Code promo : ${promoCode.toUpperCase()} (${result.promoEffect})`;
    }

    if (result.cashback > 0) {
      message += `\n- Cashback ambassadeur prévu : +${result.cashback} FCFA`;
    }

    message += `\n\n✅ Je confirme vouloir procéder à ce transfert.
📱 Merci de me contacter pour finaliser la transaction.
🎄 Bonnes fêtes avec DYNAMIK Transfert ! 🎄`;

    const finalMessage = `Bonjour DYNAMIK TRANSFERT, ${message}`;
    const whatsappUrl = `https://wa.me/22899771419?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
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
            Calculez vos <span className="text-primary">frais de transfert</span>
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground mb-12 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Découvrez combien vous économisez avec DYNAMIK Transfert
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
                  <label className="block text-sm font-medium mb-2">Montant à envoyer (FCFA)</label>
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
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choisissez la direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="togo-europe">🎄 Togo → Europe (Promo Fêtes 8.9%)</SelectItem>
                      <SelectItem value="cemac-europe">🎄 CEMAC → Europe (Promo Fêtes 8.9%)</SelectItem>
                      <SelectItem value="france-togo">France → Togo (1% fixe)</SelectItem>
                      <SelectItem value="beceao-cemac">BECEAO → CEMAC (Depuis le Togo)</SelectItem>
                      <SelectItem value="cemac-beceao">🔥 CEMAC → Afrique de l'Ouest (PROMO jusqu'au 20/01/2026)</SelectItem>
                    </SelectContent>
                  </Select>
                  {direction === "cemac-beceao" && (
                    <div className="mt-2 p-2 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-xs text-primary font-medium">
                        🔥 Promo spéciale : Frais réduits jusqu'au 20 janvier 2026 !
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
                      <SelectItem value="autres">Autres</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requis pour la lutte contre le blanchiment et la cybercriminalité
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {direction === "beceao-cemac" || direction === "togo-europe" || direction === "france-togo" 
                      ? "Pays de destination" 
                      : "Pays d'origine"}
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={
                        direction === "beceao-cemac" || direction === "togo-europe" || direction === "france-togo"
                          ? "Vers quel pays ?" 
                          : "Depuis quel pays ?"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {direction === "beceao-cemac" ? (
                        <>
                          <SelectItem value="gabon">Gabon</SelectItem>
                          <SelectItem value="cameroun">Cameroun</SelectItem>
                          <SelectItem value="centrafrique">République Centrafricaine</SelectItem>
                          <SelectItem value="congo">Congo-Brazzaville</SelectItem>
                          <SelectItem value="guinee-equatoriale">Guinée Équatoriale</SelectItem>
                          <SelectItem value="tchad">Tchad</SelectItem>
                        </>
                      ) : direction === "cemac-beceao" ? (
                        <>
                          <SelectItem value="gabon">🌟 Gabon (Moov Money recommandé)</SelectItem>
                          <SelectItem value="cameroun">Cameroun</SelectItem>
                          <SelectItem value="centrafrique">République Centrafricaine</SelectItem>
                          <SelectItem value="congo">Congo-Brazzaville</SelectItem>
                          <SelectItem value="guinee-equatoriale">Guinée Équatoriale</SelectItem>
                          <SelectItem value="tchad">Tchad</SelectItem>
                        </>
                      ) : direction === "togo-europe" ? (
                        <>
                          <SelectItem value="france">France</SelectItem>
                          <SelectItem value="allemagne">Allemagne</SelectItem>
                          <SelectItem value="autres">Autres pays européens</SelectItem>
                        </>
                      ) : direction === "cemac-europe" ? (
                        <>
                          <SelectItem value="gabon">Gabon</SelectItem>
                          <SelectItem value="cameroun">Cameroun</SelectItem>
                          <SelectItem value="centrafrique">République Centrafricaine</SelectItem>
                          <SelectItem value="congo">Congo-Brazzaville</SelectItem>
                          <SelectItem value="guinee-equatoriale">Guinée Équatoriale</SelectItem>
                          <SelectItem value="tchad">Tchad</SelectItem>
                        </>
                      ) : direction === "france-togo" ? (
                        <SelectItem value="togo">Togo</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Money Expéditeur - CEMAC → BECEAO uniquement */}
                {direction === "cemac-beceao" && destination && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      📱 Mobile Money expéditeur (depuis {destination.charAt(0).toUpperCase() + destination.slice(1)})
                    </label>
                    <Select value={senderMobileMoney} onValueChange={setSenderMobileMoney}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choisissez votre Mobile Money" />
                      </SelectTrigger>
                      <SelectContent>
                        {senderMobileMoneyOptions[destination]?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.recommended ? "⭐ " : ""}{option.label} ({option.fees} frais réseau)
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
                  </div>
                )}

                {/* Pays destinataire Afrique de l'Ouest - CEMAC → BECEAO uniquement */}
                {direction === "cemac-beceao" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      🌍 Pays destinataire (Afrique de l'Ouest)
                    </label>
                    <Select value={destinationCountry} onValueChange={(value) => {
                      setDestinationCountry(value);
                      setReceiverMobileMoney(""); // Reset receiver mobile money
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

                {/* Mobile Money Destinataire - CEMAC → BECEAO uniquement */}
                {direction === "cemac-beceao" && destinationCountry && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      📱 Mobile Money destinataire
                    </label>
                    <Select value={receiverMobileMoney} onValueChange={setReceiverMobileMoney}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choisissez le Mobile Money de réception" />
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
                        ) : direction === "togo-europe" ? (
                          <SelectItem value="instant">Instantané (8.9% promo fêtes)</SelectItem>
                        ) : direction === "cemac-europe" ? (
                          <SelectItem value="instant">Instantané (8.9% promo fêtes)</SelectItem>
                        ) : direction === "france-togo" ? (
                          <SelectItem value="instant">Instantané (1% fixe)</SelectItem>
                        ) : null}
                    </SelectContent>
                  </Select>
                  {(direction === "togo-europe" || direction === "cemac-europe") && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-xs text-amber-800 dark:text-amber-200 font-medium mb-1">
                        ⚠️ Note importante - Transferts vers l'Europe :
                      </p>
                      <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                        <li>Limite : 1000€ maximum par client par jour</li>
                        <li>Modes acceptés : Néo-banques ou cash uniquement</li>
                        <li>Non acceptés : PayPal, virements bancaires classiques</li>
                        <li>Vérification de l'origine des fonds obligatoire (lutte anti-blanchiment)</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Code promo ambassadeur (optionnel)</label>
                   <Input
                    placeholder="Entrez votre code promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-12"
                    disabled={direction === "cemac-beceao"}
                  />
                  {direction === "cemac-beceao" ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      ⚠️ Les codes promos ne s'appliquent pas aux transferts CEMAC → BECEAO
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Premier transfert ? Utilisez <span className="font-bold text-primary">WELCOME10</span> pour une réduction !
                    </p>
                  )}
                </div>

                <Button 
                  onClick={calculateTransfer}
                  className="w-full h-12 text-lg"
                  variant="hero"
                >
                  Calculer
                </Button>
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
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Total à payer</span>
                        <span className="text-2xl font-bold text-primary">
                          {result.totalToPay.toFixed(0)} FCFA
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                        <span className="text-muted-foreground">Montant reçu</span>
                        <span className="text-2xl font-bold text-accent">
                          {result.amountReceived.toFixed(0)} FCFA
                        </span>
                      </div>
                      
                       <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Frais appliqués</span>
                        <span className="text-lg font-bold">
                          {result.fees.toFixed(0)} FCFA
                        </span>
                      </div>

                      {result.promoEffect && (
                        <div className="flex justify-between items-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                          <span className="text-muted-foreground">Code promo appliqué</span>
                          <span className="text-sm font-bold text-accent">
                            {result.promoEffect}
                          </span>
                        </div>
                      )}

                      {result.cashback > 0 && (
                        <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <span className="text-muted-foreground">Cashback à recevoir</span>
                          <span className="text-lg font-bold text-primary">
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