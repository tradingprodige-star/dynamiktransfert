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
              Programme de <span className="text-primary">Parrainage</span>
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
            className="mt-12 grid grid-cols-2 gap-4"
          >
            <div className="bg-card p-4 rounded-xl border text-center">
              <div className="text-3xl mb-2">🎁</div>
              <p className="font-semibold">10 points</p>
              <p className="text-xs text-muted-foreground">par transfert validé</p>
            </div>
            <div className="bg-card p-4 rounded-xl border text-center">
              <div className="text-3xl mb-2">💰</div>
              <p className="font-semibold">Cashback</p>
              <p className="text-xs text-muted-foreground">jusqu'à 1000 FCFA</p>
            </div>
            <div className="bg-card p-4 rounded-xl border text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-semibold">Réductions</p>
              <p className="text-xs text-muted-foreground">sur vos frais</p>
            </div>
            <div className="bg-card p-4 rounded-xl border text-center">
              <div className="text-3xl mb-2">⭐</div>
              <p className="font-semibold">Statut VIP</p>
              <p className="text-xs text-muted-foreground">bonus exclusifs</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
