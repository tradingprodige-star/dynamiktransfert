import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCursorMagnetic } from "@/hooks/useCursorMagnetic";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ArrowRight, BadgeCheck, Globe2, ShieldCheck, Smartphone, Wallet } from "lucide-react";

const Header = () => {
  const scrollRevealRef = useScrollReveal();
  const magneticRef1 = useCursorMagnetic(0.3);
  const magneticRef2 = useCursorMagnetic(0.3);
  const magneticRef3 = useCursorMagnetic(0.3);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCryptoPayment = () => {
    document.getElementById('crypto-payment')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/22899771419?text=Bonjour%20DYNAMIK%20TRANSFERT', '_blank');
  };

  return (
    <motion.header
      className="relative min-h-screen overflow-hidden bg-gradient-hero text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    >
      <div className="mesh-orb absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/30" />
      <div className="mesh-orb absolute bottom-20 right-[-6rem] h-96 w-96 rounded-full bg-accent/30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <nav className="mb-16 flex items-center justify-between rounded-full border border-white/10 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl md:px-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-black text-matte-black shadow-glow">D</span>
            <span className="hidden text-sm font-semibold tracking-[0.3em] text-white/90 sm:inline">DYNAMIK</span>
          </button>
          <div className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
            <button onClick={scrollToCalculator} className="transition hover:text-white">Calculateur</button>
            <button onClick={scrollToCryptoPayment} className="transition hover:text-white">Crypto → FCFA</button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="transition hover:text-white">À propos</button>
          </div>
          <Button onClick={openWhatsApp} className="rounded-full bg-white text-matte-black hover:bg-white/90">
            WhatsApp
          </Button>
        </nav>

        <div className="grid min-h-[72vh] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="scroll-reveal max-w-4xl" ref={scrollRevealRef}>
            <motion.div
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <BadgeCheck className="h-4 w-4 text-primary" />
              Transferts, USDT et Mobile Money en Afrique
            </motion.div>

            <motion.h1
              className="mb-6 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-8xl"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
            >
              Envoyez. Recevez. Multipliez.
            </motion.h1>

            <motion.p
              className="mb-9 max-w-2xl text-lg leading-8 text-white/70 md:text-xl"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              DYNAMIK TRANSFERT modernise les transferts FCFA, les échanges USDT et les paiements Mobile Money avec une expérience rapide, claire et premium.
            </motion.p>

            <motion.div
              className="mb-12 flex flex-col gap-4 sm:flex-row"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
            >
              <motion.div ref={magneticRef1} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="xl" onClick={scrollToCalculator} className="w-full rounded-full bg-primary text-matte-black hover:bg-primary-glow sm:w-auto">
                  Calculer mes frais <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div ref={magneticRef2} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="xl" onClick={scrollToCryptoPayment} className="w-full rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 sm:w-auto">
                  Crypto vers FCFA
                </Button>
              </motion.div>
              <motion.div ref={magneticRef3} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {user ? (
                  <Button size="xl" variant="outline" onClick={() => navigate('/promo')} className="w-full rounded-full border-white/25 bg-transparent text-white hover:bg-white hover:text-matte-black sm:w-auto">
                    Mes codes promo
                  </Button>
                ) : (
                  <Button size="xl" variant="outline" onClick={() => navigate('/auth')} className="w-full rounded-full border-white/25 bg-transparent text-white hover:bg-white hover:text-matte-black sm:w-auto">
                    Se connecter
                  </Button>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="grid max-w-2xl grid-cols-3 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.7 }}
            >
              {[
                ['< 10 min', 'Estimation rapide'],
                ['24h/7', 'Support WhatsApp'],
                ['USDT', 'Achat & rachat'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                  <p className="text-2xl font-semibold text-primary">{value}</p>
                  <p className="mt-1 text-xs text-white/55">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-primary opacity-25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Flux intelligent</p>
                  <p className="text-xl font-semibold">Dynamik Pay</p>
                </div>
                <div className="rounded-2xl bg-primary p-3 text-matte-black">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Globe2, title: 'France / CEMAC / BECEAO', text: 'Choix de la direction' },
                  { icon: Smartphone, title: 'Mobile Money', text: 'T-Money, Moov, Wave, MTN, Orange' },
                  { icon: ShieldCheck, title: 'Validation DYNAMIK', text: 'Référence et suivi WhatsApp' },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.08] p-5"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.25 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-white/10 p-3 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-white/55">{item.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 h-1 rounded-full flow-line" />
              <div className="mt-5 flex items-center justify-between text-sm text-white/55">
                <span>Demande créée</span>
                <span>Confirmation</span>
                <span>FCFA reçu</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
