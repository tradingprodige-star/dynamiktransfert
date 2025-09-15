import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Calculator = () => {
  const scrollRevealRef = useScrollReveal();
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("");
  const [destination, setDestination] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [motif, setMotif] = useState("");
  const [result, setResult] = useState<{
    totalToPay: number;
    amountReceived: number;
    fees: number;
    cashback: number;
    promoEffect: string;
  } | null>(null);

    // Configuration des frais selon direction et destination
  const feeRates = {
    "beceao-cemac": {
      gabon: 0.045, // 4.5% pour le Gabon
      cameroun: 0.035, // 3.5% pour autres pays CEMAC
      "centrafrique": 0.035,
      "congo": 0.035,
      "guinee-equatoriale": 0.035,
      "tchad": 0.035
    },
    "cemac-beceao": {
      cameroun: 0.07, // 7% pour Cameroun vers Togo
      gabon: 0.085, // 8.5% pour Gabon vers Togo
      "centrafrique": 0.08, // 8% pour autres pays CEMAC
      "congo": 0.08,
      "guinee-equatoriale": 0.08,
      "tchad": 0.08
    },
    "togo-france": {
      standard: 0.02, // 2% pour Togo vers France 
      depreciation: 0.01 // +1% de dépréciation jusqu'à 3 jours
    },
    "france-togo": {
      standard: 0.01 // 1% fixe pour France vers Togo
    }
  };

  // Réductions selon délai de livraison
  const deliveryDiscounts = {
    instant: 0,
    "1day": 0.01, // -1%
    "2days": 0.02, // -2%
    "3days": 0.03 // -3%
  };

  // Codes promo ambassadeurs
  const ambassadorCodes = {
    BIENVENUE: { type: "free", effect: "0% de frais" },
    CORSKO: { type: "reduction", value: 0.02, effect: "Réduction 2%" },
    MR_BOURSES: { type: "reduction", value: 0.02, effect: "Réduction 2%" },
    JONES: { type: "cashback", value: 500, effect: "Cashback 500 FCFA" },
    KRISSROY: { type: "cashback", value: 500, effect: "Cashback 500 FCFA" },
    TURBO: { type: "reduction", value: 0.02, effect: "Réduction 2%" },
    TONY: { type: "cashback", value: 500, effect: "Cashback 500 FCFA" },
    "J-ZENITH": { type: "reduction", value: 0.02, effect: "Réduction 2%" },
    "COM-MASTER": { type: "cashback", value: 500, effect: "Cashback 500 FCFA" }
  } as const;

  type PromoCode = {
    type: "free" | "reduction" | "cashback";
    value?: number;
    effect: string;
  };

  const openUSDTPrice = () => {
    const searchQuery = "prix USDT en temps réel marché crypto";
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleUrl, '_blank');
  };

  const calculateTransfer = () => {
    if (!amount || !direction || !deliveryTime || (!destination && direction !== "france-togo" && direction !== "usdt-rachat")) return;
    
    // Pour USDT, rediriger vers Google
    if (direction === "usdt-rachat") {
      openUSDTPrice();
      return;
    }

    const amountNum = parseFloat(amount);
    let baseFeeRate = 0;
    let cashback = 0;
    let promoEffect = "";

    // Détermination du taux de base selon direction
    if (direction === "beceao-cemac") {
      baseFeeRate = feeRates["beceao-cemac"][destination as keyof typeof feeRates["beceao-cemac"]] || 0.035;
    } else if (direction === "cemac-beceao") {
      baseFeeRate = feeRates["cemac-beceao"][destination as keyof typeof feeRates["cemac-beceao"]] || 0.08;
    } else if (direction === "togo-france") {
      baseFeeRate = feeRates["togo-france"].standard;
      // Ajout de 1% de dépréciation pour jusqu'à 3 jours
      if (deliveryTime === "1day" || deliveryTime === "2days" || deliveryTime === "3days") {
        baseFeeRate += feeRates["togo-france"].depreciation;
      }
    } else if (direction === "france-togo") {
      baseFeeRate = feeRates["france-togo"].standard; // 1% fixe
    }

    // Application des réductions de délai (pour BECEAO → CEMAC et TOGO → FRANCE)
    if (direction === "beceao-cemac" || direction === "togo-france") {
      const deliveryDiscount = deliveryDiscounts[deliveryTime as keyof typeof deliveryDiscounts] || 0;
      baseFeeRate = Math.max(0, baseFeeRate - deliveryDiscount);
    }

    // Application des codes promo ambassadeurs (sauf pour CEMAC → BECEAO)
    if (promoCode && ambassadorCodes[promoCode.toUpperCase() as keyof typeof ambassadorCodes] && direction !== "cemac-beceao") {
      const promoData = ambassadorCodes[promoCode.toUpperCase() as keyof typeof ambassadorCodes];
      
      if (promoData.type === "free") {
        baseFeeRate = 0;
        promoEffect = promoData.effect;
      } else if (promoData.type === "reduction" && promoData.value) {
        baseFeeRate = Math.max(0, baseFeeRate - promoData.value);
        promoEffect = promoData.effect;
      } else if (promoData.type === "cashback" && promoData.value) {
        cashback = promoData.value;
        promoEffect = promoData.effect;
      }
    } else if (promoCode && direction === "cemac-beceao") {
      promoEffect = "Code promo non applicable pour CEMAC → BECEAO";
    }

    const fees = amountNum * baseFeeRate;
    const totalToPay = amountNum + fees;
    const amountReceived = amountNum; // Même devise FCFA

    setResult({
      totalToPay,
      amountReceived,
      fees,
      cashback,
      promoEffect
    });
  };

  const sendToWhatsApp = () => {
    if (!result) return;
    
    const directionText = direction === "beceao-cemac" ? `depuis le Togo vers ${destination.toUpperCase()}` : 
                          direction === "cemac-beceao" ? `depuis ${destination.toUpperCase()} vers le Togo` :
                          direction === "togo-france" ? "depuis le Togo vers la FRANCE" :
                          "depuis la FRANCE vers le Togo";
    const deliveryText = deliveryTime === "instant" ? "instantané" : deliveryTime === "1day" ? "24h" : deliveryTime === "2days" ? "2 jours" : "3 jours";
    
    let message = `🏦 DYNAMIK Transfert - Demande de transfert

💰 DÉTAILS DU TRANSFERT :
- Montant : ${amount} ${direction === 'togo-france' ? 'FCFA' : direction === 'france-togo' ? 'EUR' : 'FCFA'}
- Direction : ${directionText}
- Motif : ${motif || 'Non spécifié'}
- Délai : ${deliveryText}
- Total à payer : ${result.totalToPay.toFixed(0)} ${direction === 'togo-france' ? 'FCFA' : direction === 'france-togo' ? 'EUR' : 'FCFA'}
- Montant reçu : ${result.amountReceived.toFixed(0)} ${direction === 'togo-france' ? 'EUR' : direction === 'france-togo' ? 'FCFA' : 'FCFA'}
- Frais appliqués : ${result.fees.toFixed(0)} ${direction === 'togo-france' ? 'FCFA' : direction === 'france-togo' ? 'EUR' : 'FCFA'}`;

    if (promoCode) {
      message += `\n- Code promo : ${promoCode.toUpperCase()} (${result.promoEffect})`;
    }

    if (result.cashback > 0) {
      message += `\n- Cashback prévu : +${result.cashback} FCFA`;
    }

    message += `\n\n✅ Je confirme vouloir procéder à ce transfert.
📱 Merci de me contacter pour finaliser la transaction.`;

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
                      <SelectItem value="togo-france">Togo → France (depuis le Togo)</SelectItem>
                      <SelectItem value="france-togo">France → Togo (1% fixe)</SelectItem>
                      <SelectItem value="beceao-cemac">BECEAO → CEMAC (Depuis le Togo)</SelectItem>
                      <SelectItem value="cemac-beceao">CEMAC → BECEAO (Vers le Togo)</SelectItem>
                      <SelectItem value="usdt-rachat">Rachat USDT au prix du marché</SelectItem>
                    </SelectContent>
                  </Select>
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

                {direction !== "usdt-rachat" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {direction === "beceao-cemac" ? "Pays de destination" : "Pays d'origine"}
                    </label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={direction === "beceao-cemac" ? "Vers quel pays ?" : "Depuis quel pays ?"} />
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
                            <SelectItem value="gabon">Gabon (8.5% frais)</SelectItem>
                            <SelectItem value="cameroun">Cameroun (7% frais)</SelectItem>
                            <SelectItem value="centrafrique">République Centrafricaine (8% frais)</SelectItem>
                            <SelectItem value="congo">Congo-Brazzaville (8% frais)</SelectItem>
                            <SelectItem value="guinee-equatoriale">Guinée Équatoriale (8% frais)</SelectItem>
                            <SelectItem value="tchad">Tchad (8% frais)</SelectItem>
                          </>
                        ) : direction === "togo-france" ? (
                          <SelectItem value="france">France</SelectItem>
                        ) : direction === "france-togo" ? (
                          <SelectItem value="togo">Togo</SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
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
                           <SelectItem value="instant">Instantané (frais selon pays)</SelectItem>
                         </>
                        ) : direction === "togo-france" ? (
                          <>
                            <SelectItem value="instant">Instantané (2% frais)</SelectItem>
                            <SelectItem value="1day">24h (avec dépréciation 1%)</SelectItem>
                            <SelectItem value="2days">2 jours (avec dépréciation 1%)</SelectItem>
                            <SelectItem value="3days">3 jours (avec dépréciation 1%)</SelectItem>
                          </>
                         ) : direction === "france-togo" ? (
                           <SelectItem value="instant">Instantané (1% fixe)</SelectItem>
                         ) : direction === "usdt-rachat" ? (
                           <SelectItem value="instant">Prix du marché en temps réel</SelectItem>
                         ) : null}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Code promo ambassadeur (optionnel)</label>
                   <Input
                    placeholder="Ex: CORSKO, MR_BOURSES, JONES..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Premier transfert ? Utilisez <span className="font-bold text-primary">BIENVENUE</span> pour 0% de frais !
                  </p>
                </div>

                <Button 
                  onClick={calculateTransfer}
                  className="w-full h-12 text-lg"
                  variant="hero"
                >
                  {direction === "usdt-rachat" ? "Voir prix en temps réel" : "Calculer"}
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