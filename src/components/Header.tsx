import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCursorMagnetic } from "@/hooks/useCursorMagnetic";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ArrowRight, Globe2, LogIn, Menu, ShieldCheck, Smartphone, UserPlus, Wallet, X } from "lucide-react";
import { navItems, whatsappUrl } from "@/lib/dynamik";
import { useSiteContent } from "@/lib/siteContent";

const Header = () => {
  const scrollRevealRef = useScrollReveal();
  const magneticRef1 = useCursorMagnetic(0.3);
  const magneticRef2 = useCursorMagnetic(0.3);
  const magneticRef3 = useCursorMagnetic(0.3);
  const navigate = useNavigate();
  const { t } = useSiteContent();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const scrollToCalculator = () => {
    setMobileOpen(false);
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  const openWhatsApp = () => {
    window.open(whatsappUrl("Bonjour DYNAMIK TRANSFERT, je souhaite être accompagné pour un transfert."), "_blank");
  };

  return (
    <motion.header
      className="relative min-h-screen overflow-hidden bg-gradient-hero text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    >
      <div className="mesh-orb absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-emerald-400/8" />
      <div className="mesh-orb absolute bottom-20 right-[-6rem] h-80 w-80 rounded-full bg-violet-500/8" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <nav className="mb-16 flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl md:rounded-full md:px-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-black text-matte-black shadow-financial">D</span>
            <span className="hidden text-sm font-semibold tracking-[0.24em] text-white/90 sm:inline">DYNAMIK TRANSFERT</span>
          </button>
          <div className="hidden items-center gap-5 text-sm text-white/70 lg:flex">
            <button onClick={scrollToCalculator} className="transition hover:text-white">Calculateur</button>
            <button onClick={() => navigate("/crypto")} className="transition hover:text-white">Crypto → FCFA</button>
            <button onClick={() => navigate("/partenariats")} className="transition hover:text-white">Partenariats</button>
            <button onClick={() => navigate("/a-propos")} className="transition hover:text-white">À propos</button>
            <button onClick={() => navigate("/termes")} className="transition hover:text-white">Termes</button>
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <div className="hidden items-center gap-2 md:flex">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white hover:text-slate-950"
                >
                  <Link to="/auth?mode=signin">
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </Link>
                </Button>
                <Button asChild className="rounded-full bg-primary text-slate-950 hover:bg-primary-glow">
                  <Link to="/auth?mode=signup">
                    <UserPlus className="h-4 w-4" />
                    S'inscrire
                  </Link>
                </Button>
              </div>
            )}
            {user && (
              <Button asChild className="hidden rounded-full bg-primary text-slate-950 hover:bg-primary-glow md:inline-flex">
                <Link to="/promo">Mon espace</Link>
              </Button>
            )}
            <Button onClick={openWhatsApp} className="hidden rounded-full bg-white text-matte-black hover:bg-white/90 sm:inline-flex">
              WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-full border-white/20 bg-white/10 px-3 text-white hover:bg-white hover:text-slate-950 lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              aria-controls="home-mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="text-xs font-semibold">Menu</span>
            </Button>
          </div>
        </nav>

        {mobileOpen && (
          <div id="home-mobile-menu" className="fixed left-4 right-4 top-[6.5rem] z-[120] rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 lg:hidden">
            <div className="grid max-h-[calc(100vh-8rem)] gap-2 overflow-y-auto">
              <button onClick={scrollToCalculator} className="rounded-2xl px-4 py-3 text-left text-white/80 hover:bg-white/10 hover:text-white">Calculateur</button>
              {navItems.filter((item) => item.to !== "/").map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white">
                  {item.label}
                </Link>
              ))}
              {!user ? (
                <div className="grid gap-2 rounded-3xl border border-white/10 bg-white/[0.04] p-2">
                  <Link to="/auth?mode=signin" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white hover:text-slate-950">
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-slate-950 hover:bg-primary-glow">
                    <UserPlus className="h-4 w-4" />
                    Créer un compte
                  </Link>
                </div>
              ) : (
                <Link to="/promo" onClick={() => setMobileOpen(false)} className="rounded-2xl bg-primary px-4 py-3 text-center text-sm font-bold text-slate-950 hover:bg-primary-glow">
                  Mon espace
                </Link>
              )}
              <button onClick={openWhatsApp} className="rounded-2xl bg-emerald-400 px-4 py-3 text-left font-semibold text-slate-950">WhatsApp immédiat</button>
            </div>
          </div>
        )}

        <div className="grid min-h-[72vh] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="scroll-reveal max-w-4xl" ref={scrollRevealRef}>
            <motion.div
              className="mb-7 inline-flex items-center gap-2 text-base font-semibold tracking-[0.16em] text-primary md:text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <span className="h-px w-10 bg-primary/70" />
              {t("home.hero.eyebrow")}
            </motion.div>

            <motion.h1
              className="mb-6 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-8xl"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-white">{t("home.hero.title.part1")}</span>{" "}
              <span className="text-primary">{t("home.hero.title.part2")}</span>{" "}
              <span className="text-white">{t("home.hero.title.part3")}</span>
            </motion.h1>

            <motion.p
              className="mb-9 max-w-2xl text-lg leading-8 text-white/70 md:text-xl"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div
              className="mb-12 flex flex-col gap-4 sm:flex-row"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
            >
              <motion.div ref={magneticRef1} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="xl" onClick={scrollToCalculator} className="w-full rounded-full bg-primary text-slate-950 hover:bg-primary-glow shadow-[0_18px_60px_rgba(245,187,0,0.22)] sm:w-auto">
                  {t("home.hero.cta.primary")} <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div ref={magneticRef2} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="xl" onClick={() => navigate("/crypto")} className="w-full rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 sm:w-auto">
                  {t("home.hero.cta.crypto")}
                </Button>
              </motion.div>
              <motion.div ref={magneticRef3} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {user ? (
                  <Button size="xl" variant="outline" onClick={() => navigate("/promo")} className="w-full rounded-full border-white/25 bg-transparent text-white hover:bg-white hover:text-matte-black sm:w-auto">
                    Mes codes promo
                  </Button>
                ) : (
                  <Button size="xl" variant="outline" onClick={() => navigate("/partenariats")} className="w-full rounded-full border-white/25 bg-transparent text-white hover:bg-white hover:text-matte-black sm:w-auto">
                    Partenariats
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
                ["< 10 min", "Estimation rapide"],
                ["24h/7", "Support WhatsApp"],
                ["USDT", "BMIPAY"],
              ].map(([value, label]) => (
                <div key={value} className="rounded-3xl border border-white/10 bg-slate-950/35 p-4 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
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
            <div className="absolute -inset-6 rounded-[3rem] bg-emerald-400/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Flux de transfert</p>
                  <p className="text-xl font-semibold">Dynamik Pay</p>
                </div>
                <div className="rounded-2xl bg-primary p-3 text-matte-black shadow-[0_14px_40px_rgba(245,187,0,0.18)]">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Globe2, title: "France / CEMAC / BECEAO", text: "Choix de la direction" },
                  { icon: Smartphone, title: "Mobile Money", text: "T-Money, Moov, Wave, MTN, Orange" },
                  { icon: ShieldCheck, title: "Validation DYNAMIK", text: "Référence et suivi WhatsApp" },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.08] p-5"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.25 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-primary/12 p-3 text-primary">
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
