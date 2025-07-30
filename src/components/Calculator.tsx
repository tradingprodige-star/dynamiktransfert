import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calculator = () => {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [result, setResult] = useState<{
    totalToPay: number;
    amountReceived: number;
    fees: number;
  } | null>(null);

  // Taux de change et frais (à ajuster selon vos besoins)
  const exchangeRates = {
    gabon: 0.98, // Exemple : 1 FCFA = 0.98 FCFA Gabon
    togo: 0.97,
    cemac: 0.99
  };

  const baseFeeRate = 0.03; // 3% de frais de base
  const promoCodes = {
    BIENVENUE: 1.0, // 100% de réduction (0% de frais)
    JONAS: 0.5, // 50% de réduction
    MARIE: 0.3, // 30% de réduction
  };

  const calculateTransfer = () => {
    if (!amount || !destination) return;

    const amountNum = parseFloat(amount);
    const rate = exchangeRates[destination as keyof typeof exchangeRates] || 1;
    
    // Calcul des frais avec code promo
    let feeReduction = 1;
    if (promoCode && promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes]) {
      feeReduction = 1 - promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];
    }
    
    const fees = amountNum * baseFeeRate * feeReduction;
    const totalToPay = amountNum + fees;
    const amountReceived = amountNum * rate;

    setResult({
      totalToPay,
      amountReceived,
      fees
    });
  };

  const sendToWhatsApp = () => {
    if (!result) return;
    
    const message = `Bonjour, je souhaite envoyer ${amount} FCFA vers ${destination.toUpperCase()}. ${promoCode ? `Voici mon code promo : ${promoCode}` : ''}
    
Détails du transfert :
- Montant à envoyer : ${amount} FCFA
- Destination : ${destination.toUpperCase()}
- Total à payer : ${result.totalToPay.toFixed(0)} FCFA
- Montant reçu : ${result.amountReceived.toFixed(0)} FCFA
- Frais : ${result.fees.toFixed(0)} FCFA

Je souhaite procéder à ce transfert.`;

    const whatsappUrl = `https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Calculez vos <span className="text-primary">frais de transfert</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Découvrez combien vous économisez avec DYNAMIK Exchange
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <Card className="shadow-card">
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
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choisissez la destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gabon">Gabon</SelectItem>
                      <SelectItem value="togo">Togo</SelectItem>
                      <SelectItem value="cemac">Zone CEMAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Code promo (optionnel)</label>
                  <Input
                    placeholder="Ex: BIENVENUE"
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
                  Calculer
                </Button>
              </CardContent>
            </Card>

            {/* Résultats */}
            <Card className="shadow-card">
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
                    </div>

                    <Button 
                      onClick={sendToWhatsApp}
                      className="w-full h-12 text-lg"
                      variant="whatsapp"
                    >
                      Envoyer cette demande à un agent !
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;