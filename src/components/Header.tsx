import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCursorMagnetic } from "@/hooks/useCursorMagnetic";

const Header = () => {
  const scrollRevealRef = useScrollReveal();
  const magneticRef1 = useCursorMagnetic(0.3);
  const magneticRef2 = useCursorMagnetic(0.3);

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/22899771419?text=Bonjour%20DYNAMIK%20TRANSFERT,%20je%20souhaite%20effectuer%20un%20transfert', '_blank');
  };

  return (
    <motion.header 
      className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white scroll-reveal" ref={scrollRevealRef}>
          {/* Logo */}
          <motion.div 
            className="mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-2 float-animation hover-anticipate cursor-magnetic"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              DYNAMIK <span className="text-primary-glow">TRANSFERT</span>
            </motion.h1>
            <motion.div 
              className="w-20 h-1 bg-primary-glow mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </motion.div>

          {/* Hero Title */}
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            Envoyez. Recevez. Multipliez.
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/90"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          >
            La solution de transfert d'argent la plus simple et économique d'Afrique.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              ref={magneticRef1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-magnetic"
            >
              <Button 
                size="xl" 
                variant="hero"
                onClick={scrollToCalculator}
                className="w-full sm:w-auto hover-anticipate micro-interaction button-pulse animate-glow-pulse"
              >
                Calculer mes frais
              </Button>
            </motion.div>
            <motion.div
              ref={magneticRef2}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-magnetic"
            >
              <Button 
                size="xl" 
                variant="whatsapp"
                onClick={openWhatsApp}
                className="w-full sm:w-auto hover-anticipate micro-interaction button-pulse animate-glow-pulse"
              >
                Commencer sur WhatsApp
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {['Transfert instantané', 'Frais transparents', 'Service 24/7'].map((text, index) => (
              <motion.div 
                key={text}
                className="flex items-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-primary-glow rounded-full trust-light-sequence"
                  style={{ animationDelay: `${index * 0.5}s` }}
                />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;