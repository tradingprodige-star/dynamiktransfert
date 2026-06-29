import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Users, TrendingUp, Copy, Share2, Check, Loader2 } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { makeReferralLink } from '@/lib/dynamik';

interface SponsorData {
  id: string;
  phone_number: string;
  referral_code: string;
  total_points: number;
  total_referrals: number;
  total_validated: number;
}

interface SponsorRegistrationProps {
  onSponsorFound: (sponsor: SponsorData) => void;
}

const SponsorRegistration = ({ onSponsorFound }: SponsorRegistrationProps) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newSponsor, setNewSponsor] = useState<SponsorData | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Extraire les chiffres du numéro de téléphone
  const getCleanPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/\D/g, '');
  };

  // Ouvrir WhatsApp avec un message de confirmation
  const sendWhatsAppConfirmation = (phoneNumber: string, referralCode: string) => {
    const cleanPhone = getCleanPhoneNumber(phoneNumber);
    const message = `🎉 Félicitations et bienvenue chez DYNAMIK TRANSFERT ! 

Votre inscription au programme de parrainage est confirmée.

📌 Votre code parrain : ${referralCode}

🔗 Votre lien de parrainage :
${makeReferralLink(referralCode)}

Ce lien remplit automatiquement le code promo dans le calculateur. Partagez-le avec vos proches et gagnez des points à chaque transfert validé.`;
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation plus souple - minimum 8 chiffres
    const cleanPhone = getCleanPhoneNumber(phone);
    if (!phone || cleanPhone.length < 8) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone valide (minimum 8 chiffres)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Vérifier si le numéro existe déjà
      const { data: existingSponsor, error: searchError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('phone_number', phone)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingSponsor) {
        // Sponsor existant trouvé
        onSponsorFound(existingSponsor as SponsorData);
        toast({
          title: "Bienvenue !",
          description: "Votre compte parrain a été retrouvé",
        });
      } else {
        // Générer un nouveau code parrain
        const { data: codeData, error: codeError } = await supabase
          .rpc('generate_referral_code');

        if (codeError) throw codeError;

        // Créer le nouveau parrain
        const { data: newData, error: insertError } = await supabase
          .from('sponsors')
          .insert({
            phone_number: phone,
            referral_code: codeData
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setNewSponsor(newData as SponsorData);
        
        // Créer aussi le code promo lié au lien de parrainage (si la politique DB le permet).
        await supabase
          .from('promo_codes')
          .upsert({
            code: codeData,
            type: 'ambassador',
            discount_percentage: 10,
            ambassador_name: phone,
            is_active: true,
          }, { onConflict: 'code' });

        // Envoyer la notification WhatsApp
        sendWhatsAppConfirmation(phone, codeData);
        
        toast({
          title: "Félicitations !",
          description: "Votre code parrain a été créé avec succès. Vérifiez WhatsApp !",
        });
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copié !",
      description: "Le lien a été copié dans le presse-papiers",
    });
  };

  const shareLink = async () => {
    if (!newSponsor) return;
    
    const shareUrl = makeReferralLink(newSponsor.referral_code);
    const shareText = `🎁 Rejoins DYNAMIK Transfert avec mon code parrain ${newSponsor.referral_code} et bénéficie d'avantages exclusifs sur tes transferts d'argent !`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DYNAMIK Transfert - Parrainage',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (newSponsor) {
    const referralLink = makeReferralLink(newSponsor.referral_code);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Votre code parrain</CardTitle>
            <CardDescription>Partagez ce code pour gagner des points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Code affiché */}
            <div className="bg-background rounded-xl p-6 text-center border-2 border-dashed border-primary">
              <p className="text-4xl font-bold text-primary tracking-widest">
                {newSponsor.referral_code}
              </p>
            </div>

            {/* Lien complet */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Votre lien de parrainage</label>
              <div className="flex gap-2">
                <Input 
                  value={referralLink}
                  readOnly
                  className="text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(referralLink)}
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Boutons de partage */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={shareLink}
                className="bg-green-600 hover:bg-green-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  onSponsorFound(newSponsor);
                }}
              >
                Voir mon tableau
              </Button>
            </div>

            {/* Info points */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Comment ça marche ?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Partagez votre lien avec vos proches</li>
                <li>• Ils effectuent un transfert via DYNAMIK</li>
                <li>• Vous gagnez 10 points par transfert validé</li>
                <li>• Échangez vos points contre des récompenses</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <CardTitle>Devenez Parrain DYNAMIK</CardTitle>
          <CardDescription>
            Entrez votre numéro WhatsApp pour obtenir votre code de parrainage unique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Numéro WhatsApp</label>
              <PhoneInput
                defaultCountry="tg"
                value={phone}
                onChange={(phone) => setPhone(phone)}
                className="w-full"
                inputClassName="!w-full !h-11 !text-base !rounded-md !border-input"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Obtenir mon code parrain
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SponsorRegistration;
