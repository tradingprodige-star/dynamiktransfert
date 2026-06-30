import { useState } from "react";
import { motion } from "framer-motion";
import { Bitcoin, CheckCircle2, Copy, CreditCard, Landmark, LockKeyhole, QrCode, Smartphone, Timer, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BMIPAY_USDT_NOTICE, qrCodeUrl, whatsappUrl } from "@/lib/dynamik";

const countries = [
  { value: "togo", label: "Togo", prefix: "+228", networks: ["T-Money", "Moov Money"] },
  { value: "benin", label: "Bénin", prefix: "+229", networks: ["MTN MoMo", "Moov Money"] },
  { value: "burkina", label: "Burkina Faso", prefix: "+226", networks: ["Orange Money", "Moov Money"] },
  { value: "cote-ivoire", label: "Côte d'Ivoire", prefix: "+225", networks: ["Wave", "Orange Money", "MTN MoMo", "Moov Money"] },
];

const cryptoOptions = [
  { value: "usdt-bep20", label: "USDT BEP-20", rate: 585, network: "BSC" },
  { value: "usdt-trc20", label: "USDT TRC-20", rate: 585, network: "TRON" },
  { value: "btc-lightning", label: "Bitcoin Lightning", rate: 38500000, network: "Lightning" },
];

const sanitizeInput = (value: string) =>
  value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/[<>]/g, "").substring(0, 120);

const generatePaymentReference = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DYN-CRYPTO-${stamp}-${random}`;
};

const CryptoPayment = () => {
  const [country, setCountry] = useState("togo");
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("T-Money");
  const [amount, setAmount] = useState("35000");
  const [crypto, setCrypto] = useState("usdt-bep20");
  const [reference, setReference] = useState("");

  const selectedCountry = countries.find((item) => item.value === country) || countries[0];
  const selectedCrypto = cryptoOptions.find((item) => item.value === crypto) || cryptoOptions[0];
  const amountNumber = Math.max(0, Number(amount || 0));
  const serviceFee = Math.ceil(amountNumber * 0.015);
  const beneficiaryReceives = Math.max(0, amountNumber);
  const totalFcfa = amountNumber + serviceFee;
  const cryptoAmount = selectedCrypto.value.includes("btc")
    ? totalFcfa / selectedCrypto.rate
    : totalFcfa / selectedCrypto.rate;

  const paymentReady = country && phone.length >= 6 && network && amountNumber >= 1000 && crypto;

  const handleCountryChange = (value: string) => {
    const nextCountry = countries.find((item) => item.value === value) || countries[0];
    setCountry(value);
    setNetwork(nextCountry.networks[0]);
  };

  const currentReference = reference || generatePaymentReference();

  const buildPaymentMessage = (safeReference: string, trigger: string) => {
    const safePhone = sanitizeInput(phone);
    return `Bonjour DYNAMIK TRANSFERT, je veux finaliser une transaction crypto vers Mobile Money.\n\nAction demandée: ${trigger}\nRéférence: ${safeReference}\nPays bénéficiaire: ${selectedCountry.label}\nNuméro bénéficiaire: ${selectedCountry.prefix} ${safePhone}\nRéseau Mobile Money: ${network}\nMontant à recevoir: ${beneficiaryReceives.toLocaleString("fr-FR")} FCFA\nFrais estimés: ${serviceFee.toLocaleString("fr-FR")} FCFA\nCrypto utilisée: ${selectedCrypto.label}\nRéseau crypto: ${selectedCrypto.network}\nMontant crypto estimé: ${cryptoAmount.toFixed(selectedCrypto.value.includes("btc") ? 8 : 2)} ${selectedCrypto.value.includes("btc") ? "BTC" : "USDT"}\n\nJe viens de copier l’adresse / les informations de paiement. Merci de confirmer l’adresse exacte, le réseau et la suite de la transaction sur WhatsApp.`;
  };

  const createPayment = () => {
    if (!paymentReady) return;
    const safeReference = reference || generatePaymentReference();
    setReference(safeReference);
    window.open(whatsappUrl(buildPaymentMessage(safeReference, "Demande de paiement créée")), "_blank");
  };

  const copyReference = () => {
    const safeReference = reference || currentReference;
    setReference(safeReference);
    navigator.clipboard.writeText(safeReference);
  };

  const copyAddressAndOpenWhatsApp = () => {
    if (!paymentReady) return;
    const safeReference = reference || generatePaymentReference();
    setReference(safeReference);
    const paymentLine = `${selectedCrypto.label} • ${selectedCrypto.network} • Référence ${safeReference}`;
    navigator.clipboard?.writeText(paymentLine).catch(() => undefined);
    window.open(whatsappUrl(buildPaymentMessage(safeReference, "Adresse USDT copiée depuis le QR Code")), "_blank");
  };

  return (
    <section id="crypto-payment" className="relative overflow-hidden py-24 bg-matte-black text-off-white">
      <div className="absolute inset-0 opacity-45">
        <div className="absolute -top-40 left-10 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
              <Wallet className="h-4 w-4 text-emerald-300" />
              Paiement crypto vers FCFA Mobile Money
            </div>

            <div className="space-y-5">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Payez en crypto. Le bénéficiaire reçoit en FCFA.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/70">
                USDT propulsé par la technologie de BMIPAY. Choisissez le pays, le réseau Mobile Money et le montant à recevoir ; la demande s’ouvre immédiatement sur WhatsApp pour confirmer l’adresse, le réseau et le QR Code.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Timer, title: "< 15 min", text: "Traitement prioritaire" },
                { icon: LockKeyhole, title: "Sécurisé", text: "Vérification humaine" },
                { icon: Landmark, title: "FCFA", text: "Togo, Bénin, Burkina, CI" },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
                  <item.icon className="mb-4 h-6 w-6 text-emerald-300" />
                  <p className="text-xl font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/60">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/50">Flux du paiement</p>
                  <p className="mt-1 font-medium">Wallet crypto → DYNAMIK → Mobile Money</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <Bitcoin className="h-6 w-6" />
                  <div className="h-px w-10 bg-emerald-300/50" />
                  <Smartphone className="h-6 w-6" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <Card className="overflow-hidden rounded-[2rem] border-white/15 bg-white text-foreground shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
              <CardHeader className="border-b bg-gradient-to-br from-slate-50 to-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Créer un paiement</p>
                    <CardTitle className="mt-1 text-2xl">Crypto → Mobile Money</CardTitle>
                  </div>
                  <div className="rounded-2xl bg-matte-black p-3 text-white">
                    <QrCode className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pays bénéficiaire</Label>
                    <Select value={country} onValueChange={handleCountryChange}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Réseau Mobile Money</Label>
                    <Select value={network} onValueChange={setNetwork}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCountry.networks.map((item) => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Numéro Mobile Money bénéficiaire</Label>
                  <div className="flex rounded-2xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                    <div className="flex min-w-20 items-center justify-center border-r px-4 text-sm font-semibold text-muted-foreground">
                      {selectedCountry.prefix}
                    </div>
                    <Input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="90 00 00 00"
                      className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Montant à recevoir en FCFA</Label>
                    <Input
                      type="number"
                      min="1000"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="h-12 rounded-2xl text-lg font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Crypto de paiement</Label>
                    <Select value={crypto} onValueChange={setCrypto}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border bg-slate-950 p-5 text-white">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Reçu</p>
                      <p className="mt-1 text-xl font-semibold">{beneficiaryReceives.toLocaleString("fr-FR")} FCFA</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Frais</p>
                      <p className="mt-1 text-xl font-semibold">{serviceFee.toLocaleString("fr-FR")} FCFA</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">À payer</p>
                      <p className="mt-1 text-xl font-semibold text-emerald-300">{cryptoAmount.toFixed(selectedCrypto.value.includes("btc") ? 8 : 2)} {selectedCrypto.value.includes("btc") ? "BTC" : "USDT"}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-3 text-sm text-white/70">
                    <span>Référence : {reference || currentReference}</span>
                    <button onClick={copyReference} className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200">
                      <Copy className="h-4 w-4" /> Copier
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:grid-cols-[auto_1fr]">
                    <img
                      src={qrCodeUrl(`${selectedCrypto.label} | ${selectedCrypto.network} | ${reference || currentReference}`)}
                      alt="QR Code référence paiement USDT"
                      className="h-24 w-24 rounded-xl bg-white p-2"
                    />
                    <div className="text-sm text-white/70">
                      <p className="font-semibold text-white">{BMIPAY_USDT_NOTICE.title}</p>
                      <p className="mt-1">Réseau choisi : <span className="text-emerald-300">{selectedCrypto.network}</span></p>
                      <p className="mt-1">Adresse USDT : finalisation sécurisée sur WhatsApp.</p>
                      <button
                        type="button"
                        disabled={!paymentReady}
                        onClick={copyAddressAndOpenWhatsApp}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Copy className="h-4 w-4" /> Copier l’adresse et ouvrir WhatsApp
                      </button>
                      <p className="mt-2 text-xs text-white/45">Après la copie, WhatsApp s’ouvre avec les détails nécessaires pour finaliser avec DYNAMIK.</p>
                    </div>
                  </div>
                </div>

                <Button
                  disabled={!paymentReady}
                  onClick={createPayment}
                  size="xl"
                  className="w-full rounded-full bg-matte-black text-white hover:bg-matte-black/90 hover:shadow-financial"
                >
                  <CreditCard className="h-5 w-5" />
                  Générer la demande de paiement
                </Button>

                <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
                  <p>
                    Le taux final est confirmé par l'équipe DYNAMIK avant exécution. Aucun paiement crypto n'est demandé sans validation humaine.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CryptoPayment;
