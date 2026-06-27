import { useState } from 'react';
import { motion } from 'framer-motion';
import SponsorRegistration from './SponsorRegistration';
import SponsorDashboard from './SponsorDashboard';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SponsorData {
  id: string;
  phone_number: string;
  referral_code: string;
  total_points: number;
  total_referrals: number;
  total_validated: number;
}

const ReferralSection = () => {
  const [currentSponsor, setCurrentSponsor] = useState<SponsorData | null>(null);
  const scrollRevealRef = useScrollReveal();

  return (
    <section 
      id="parrainage" 
      className="py-20 bg-gradient-to-b from-background to-secondary/20 scroll-reveal"
      ref={scrollRevealRef}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Programme de <span className="text-violet-digital">Parrainage</span>
            </h2>
            <p className="text-muted-foreground">
              Parrainez vos proches et gagnez des récompenses à chaque transfert effectué
            </p>
          </motion.div>

          {currentSponsor ? (
            <SponsorDashboard 
              sponsor={currentSponsor} 
              onBack={() => setCurrentSponsor(null)}
            />
          ) : (
            <SponsorRegistration 
              onSponsorFound={(sponsor) => setCurrentSponsor(sponsor)}
            />
          )}

          {/* Avantages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-center mb-4">Points par transfert</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-card p-3 rounded-xl border text-center">
                <p className="font-bold text-violet-digital">2 pts</p>
                <p className="text-xs text-muted-foreground">5K - 20K</p>
              </div>
              <div className="bg-card p-3 rounded-xl border text-center">
                <p className="font-bold text-violet-digital">5 pts</p>
                <p className="text-xs text-muted-foreground">20K - 50K</p>
              </div>
              <div className="bg-card p-3 rounded-xl border text-center">
                <p className="font-bold text-violet-digital">12 pts</p>
                <p className="text-xs text-muted-foreground">50K - 100K</p>
              </div>
              <div className="bg-card p-3 rounded-xl border text-center">
                <p className="font-bold text-violet-digital">30 pts</p>
                <p className="text-xs text-muted-foreground">100K - 250K</p>
              </div>
              <div className="bg-card p-3 rounded-xl border text-center">
                <p className="font-bold text-violet-digital">70 pts</p>
                <p className="text-xs text-muted-foreground">250K - 500K</p>
              </div>
              <div className="bg-card p-3 rounded-xl border border-violet-digital/30 text-center">
                <p className="font-bold text-violet-digital">150 pts</p>
                <p className="text-xs text-muted-foreground">+500K</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-xl border text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="font-semibold">Cashback</p>
                <p className="text-xs text-muted-foreground">à partir de 1000 FCFA</p>
              </div>
              <div className="bg-card p-4 rounded-xl border text-center">
                <div className="text-3xl mb-2">🎁</div>
                <p className="font-semibold">Transferts gratuits</p>
                <p className="text-xs text-muted-foreground">jusqu'à 200K FCFA</p>
              </div>
              <div className="bg-card p-4 rounded-xl border text-center">
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-semibold">×1.5 points</p>
                <p className="text-xs text-muted-foreground">sur transferts filleuls</p>
              </div>
              <div className="bg-card p-4 rounded-xl border text-center">
                <div className="text-3xl mb-2">👑</div>
                <p className="font-semibold">Statut VIP</p>
                <p className="text-xs text-muted-foreground">+20% bonus points</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
