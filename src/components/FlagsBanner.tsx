import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe } from 'lucide-react';
import flagsStrip from '@/assets/flags-strip.png';

const FlagsBanner = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`);
    setIsLanguageOpen(false);
  };

  return (
    <div className="bg-gradient-primary/10 backdrop-blur-sm border-b border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Flags animation */}
          <div className="flex-1 overflow-hidden relative h-12">
            <motion.div
              className="flex items-center h-full"
              animate={{ x: [0, -200] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <img 
                src={flagsStrip} 
                alt="Drapeaux des pays desservis" 
                className="h-8 object-contain opacity-80"
              />
              <img 
                src={flagsStrip} 
                alt="Drapeaux des pays desservis" 
                className="h-8 object-contain opacity-80 ml-8"
              />
            </motion.div>
          </div>

          {/* Language selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">FR</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            {isLanguageOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
              >
                <button
                  onClick={() => changeLanguage('fr')}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                >
                  🇬🇧 English
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagsBanner;