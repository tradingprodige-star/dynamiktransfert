import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { useReferralTracking } from '@/hooks/useReferralTracking';
import { supabase } from '@/integrations/supabase/client';

const ReferralBanner = () => {
  const { referralInfo } = useReferralTracking();
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (referralInfo?.referralCode && !hasTracked) {
      trackClick();
    }
  }, [referralInfo, hasTracked]);

  const trackClick = async () => {
    if (!referralInfo) return;

    try {
      // Vérifier si le code parrain existe
      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select('id, phone_number')
        .eq('referral_code', referralInfo.referralCode)
        .eq('is_active', true)
        .eq('is_blocked', false)
        .maybeSingle();

      if (sponsorError || !sponsor) {
        console.log('Code parrain non trouvé ou inactif');
        return;
      }

      // Enregistrer le clic
      const { error: clickError } = await supabase
        .from('referral_clicks')
        .insert({
          sponsor_id: sponsor.id,
          referral_code: referralInfo.referralCode,
          godchild_id: referralInfo.godchildId,
          source: referralInfo.source,
          transfer_status: 'pending'
        });

      if (clickError) {
        // Si le godchild_id existe déjà, c'est ok (visite répétée)
        if (!clickError.message.includes('duplicate')) {
          console.error('Erreur enregistrement clic:', clickError);
        }
      }

      // Mettre à jour le compteur du parrain
      await supabase
        .from('sponsors')
        .update({ total_referrals: sponsor.phone_number ? 1 : 0 })
        .eq('id', sponsor.id);

      setSponsorName(sponsor.phone_number.slice(-4));
      setIsVisible(true);
      setHasTracked(true);

    } catch (error) {
      console.error('Erreur tracking:', error);
    }
  };

  if (!isVisible || !referralInfo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md"
      >
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <Gift className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-medium">
              Bienvenue ! Vous venez via le code <strong>{referralInfo.referralCode}</strong>
            </p>
            <p className="text-xs opacity-90">
              Effectuez un transfert pour bénéficier des avantages parrainage
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-primary-foreground/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReferralBanner;
