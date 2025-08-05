import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PromoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Codes promos existants
  const promos = [
    {
      title: "Offre Spéciale Premier Transfert",
      code: "BIENVENUE",
      description: "Utilisez le code BIENVENUE et payez 0% de frais !",
      conditions: "* Offre valable une seule fois par client",
      icon: "🎁",
      gradient: "from-primary to-accent"
    },
    {
      title: "Services USDT",
      code: "USDT565",
      description: "Rachat USDT à 565 F/USDT dans toutes les zones BECEAO et CEMAC",
      conditions: "* Taux mis à jour quotidiennement • Service disponible 24/7",
      icon: "💰",
      gradient: "from-accent to-violet-digital"
    }
  ];

  const totalSlides = Math.ceil(promos.length / 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const useCodeNow = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentPromos = () => {
    const startIndex = currentSlide * 2;
    return promos.slice(startIndex, startIndex + 2);
  };

  return (
    <section className="py-16 bg-gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Offres Exclusives
          </motion.h2>

          <div className="relative">
            {/* Navigation arrows */}
            {totalSlides > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white hover:bg-white/30 -ml-4"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white hover:bg-white/30 -mr-4"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Carousel content */}
            <div className="relative h-[400px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="grid md:grid-cols-2 gap-6 h-full"
                >
                  {getCurrentPromos().map((promo, index) => (
                    <Card 
                      key={`${currentSlide}-${index}`}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white overflow-hidden group hover:scale-105 transition-all duration-300"
                    >
                      <CardContent className="p-8 h-full flex flex-col">
                        <div className="text-center mb-6">
                          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
                            <span className="text-4xl">{promo.icon}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {promo.title}
                          </h3>
                          <p className="text-lg opacity-90">
                            {promo.description}
                          </p>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <div className="bg-white/20 rounded-xl p-6 mb-6 text-center">
                            <div className="text-4xl font-bold mb-2 text-primary-glow tracking-wider">
                              {promo.code}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <Button 
                              variant="secondary"
                              onClick={() => copyCode(promo.code)}
                              className="bg-white text-primary hover:bg-white/90"
                            >
                              Copier le code
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={useCodeNow}
                              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-primary/10"
                            >
                              Utiliser maintenant
                            </Button>
                          </div>
                        </div>

                        <div className="text-xs opacity-70 text-center mt-4">
                          {promo.conditions}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-primary scale-125' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoCarousel;