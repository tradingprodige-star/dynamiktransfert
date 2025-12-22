import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ReferralInfo {
  referralCode: string | null;
  source: string;
  godchildId: string;
}

// Génère un ID unique pour le filleul
const generateGodchildId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `GC-${timestamp}-${randomPart}`.toUpperCase();
};

// Détecte la source du clic
const detectSource = (referrer: string): string => {
  if (referrer.includes('whatsapp') || referrer.includes('wa.me')) {
    return 'whatsapp';
  } else if (referrer.includes('facebook') || referrer.includes('fb.com')) {
    return 'facebook';
  } else if (referrer.includes('instagram')) {
    return 'instagram';
  } else if (referrer.includes('twitter') || referrer.includes('x.com')) {
    return 'twitter';
  } else if (referrer.includes('tiktok')) {
    return 'tiktok';
  } else if (referrer.includes('linkedin')) {
    return 'linkedin';
  } else if (referrer) {
    return 'other';
  }
  return 'direct';
};

export const useReferralTracking = () => {
  const [searchParams] = useSearchParams();
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode) {
      // Vérifier si on a déjà enregistré ce parrainage
      const storedRef = localStorage.getItem('dynamik_referral');
      
      if (!storedRef) {
        const source = detectSource(document.referrer);
        const godchildId = generateGodchildId();
        
        const info: ReferralInfo = {
          referralCode: refCode.toUpperCase(),
          source,
          godchildId
        };
        
        // Stocker dans localStorage pour persistance
        localStorage.setItem('dynamik_referral', JSON.stringify(info));
        setReferralInfo(info);
      } else {
        setReferralInfo(JSON.parse(storedRef));
      }
    } else {
      // Vérifier s'il y a un parrainage stocké
      const storedRef = localStorage.getItem('dynamik_referral');
      if (storedRef) {
        setReferralInfo(JSON.parse(storedRef));
      }
    }
  }, [searchParams]);

  const clearReferral = () => {
    localStorage.removeItem('dynamik_referral');
    setReferralInfo(null);
  };

  return { referralInfo, clearReferral };
};
