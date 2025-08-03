import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ambassador {
  id: number;
  name: string;
  code: string;
  location: string;
  description: string;
  avatar: string;
  gradient: string;
}

const ambassadors: Ambassador[] = [
  {
    id: 1,
    name: "Marie KONAN",
    code: "MARIE10",
    location: "Abidjan, Côte d'Ivoire",
    description: "Influenceuse lifestyle & entrepreneuriat",
    avatar: "👩🏾‍💼",
    gradient: "from-primary to-secondary"
  },
  {
    id: 2,
    name: "David MENSAH",
    code: "DAVID15",
    location: "Accra, Ghana",
    description: "Expert en finance digitale",
    avatar: "👨🏾‍💻",
    gradient: "from-secondary to-accent"
  },
  {
    id: 3,
    name: "Fatou DIALLO",
    code: "FATOU20",
    location: "Dakar, Sénégal",
    description: "Consultante en remittances",
    avatar: "👩🏾‍🎓",
    gradient: "from-accent to-primary"
  },
  {
    id: 4,
    name: "Kwame ASANTE",
    code: "KWAME12",
    location: "Kumasi, Ghana",
    description: "Entrepreneur tech & blockchain",
    avatar: "👨🏾‍🚀",
    gradient: "from-primary/80 to-accent/80"
  },
  {
    id: 5,
    name: "Aissata TRAORE",
    code: "AISSA25",
    location: "Bamako, Mali",
    description: "Leader communautaire diaspora",
    avatar: "👩🏾‍🏫",
    gradient: "from-secondary/80 to-primary/80"
  },
  {
    id: 6,
    name: "Joseph KONE",
    code: "JOSEPH18",
    location: "Ouagadougou, Burkina Faso",
    description: "Spécialiste transferts internationaux",
    avatar: "👨🏾‍💼",
    gradient: "from-accent/80 to-secondary/80"
  },
  {
    id: 7,
    name: "Aminata BARRY",
    code: "AMINA30",
    location: "Conakry, Guinée",
    description: "Experte en inclusion financière",
    avatar: "👩🏾‍💻",
    gradient: "from-primary/70 to-secondary/70"
  },
  {
    id: 8,
    name: "Ibrahim TOURE",
    code: "IBRAHIM22",
    location: "Niamey, Niger",
    description: "Consultant fintech Afrique",
    avatar: "👨🏾‍🎓",
    gradient: "from-secondary/70 to-accent/70"
  },
  {
    id: 9,
    name: "Mariam KEITA",
    code: "MARIAM35",
    location: "Lomé, Togo",
    description: "Ambassadrice innovation digitale",
    avatar: "👩🏾‍🚀",
    gradient: "from-accent/70 to-primary/70"
  }
];

const AmbassadorSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const totalSlides = Math.ceil(ambassadors.length / itemsPerView.desktop);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Code copié !",
        description: `Le code ${code} a été copié dans votre presse-papiers.`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code.",
        variant: "destructive",
      });
    }
  };

  const useCode = (code: string) => {
    // Scroll to calculator and pre-fill the code
    const calculator = document.getElementById('calculator');
    if (calculator) {
      calculator.scrollIntoView({ behavior: 'smooth' });
      // You can add logic here to pre-fill the promo code in the calculator
    }
    toast({
      title: "Code sélectionné !",
      description: `Le code ${code} sera appliqué à votre transfert.`,
    });
  };

  const getVisibleAmbassadors = () => {
    const startIndex = currentIndex * itemsPerView.desktop;
    return ambassadors.slice(startIndex, startIndex + itemsPerView.desktop);
  };

  return (
    <section className="py-16 bg-gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Nos Ambassadeurs DYNAMIK TRANSFERT
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos partenaires de confiance à travers l'Afrique et bénéficiez de leurs codes exclusifs
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white shadow-elegant"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white shadow-elegant"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Slider Container */}
          <div className="mx-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {getVisibleAmbassadors().map((ambassador, index) => (
                  <motion.div
                    key={ambassador.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Card className={`relative overflow-hidden bg-gradient-to-br ${ambassador.gradient} border-0 shadow-elegant hover:shadow-xl transition-all duration-300`}>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                      <div className="relative p-6 text-white">
                        {/* Avatar */}
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                            {ambassador.avatar}
                          </div>
                          <h3 className="text-xl font-bold">{ambassador.name}</h3>
                          <p className="text-sm opacity-90">{ambassador.location}</p>
                        </div>

                        {/* Code Promo */}
                        <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur-sm border border-white/30">
                          <div className="text-center">
                            <p className="text-sm opacity-80 mb-1">Code Promo</p>
                            <div className="text-2xl font-bold tracking-wider mb-3">
                              {ambassador.code}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => copyCode(ambassador.code)}
                                className="flex-1 bg-white/20 text-white hover:bg-white/30 border-white/30"
                              >
                                {copiedCode === ambassador.code ? (
                                  <Check className="h-4 w-4 mr-1" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-1" />
                                )}
                                Copier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => useCode(ambassador.code)}
                                className="flex-1 border-white/30 text-white hover:bg-white/10"
                              >
                                Utiliser
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-center opacity-90">
                          {ambassador.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-primary w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorSlider;