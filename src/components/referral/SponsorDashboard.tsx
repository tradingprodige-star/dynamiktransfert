import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, Users, TrendingUp, Copy, Share2, Check, 
  Trophy, Clock, CheckCircle, XCircle, ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SponsorData {
  id: string;
  phone_number: string;
  referral_code: string;
  total_points: number;
  total_referrals: number;
  total_validated: number;
}

interface ReferralClick {
  id: string;
  godchild_id: string;
  godchild_phone: string | null;
  source: string;
  transfer_status: string;
  transfer_amount: number | null;
  points_awarded: number;
  created_at: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  reward_type: string;
}

interface SponsorDashboardProps {
  sponsor: SponsorData;
  onBack: () => void;
}

const SponsorDashboard = ({ sponsor, onBack }: SponsorDashboardProps) => {
  const [referrals, setReferrals] = useState<ReferralClick[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReferrals();
    loadRewards();
  }, [sponsor.id]);

  const loadReferrals = async () => {
    const { data, error } = await supabase
      .from('referral_clicks')
      .select('*')
      .eq('sponsor_id', sponsor.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReferrals(data as ReferralClick[]);
    }
  };

  const loadRewards = async () => {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_required', { ascending: true });

    if (!error && data) {
      setRewards(data as Reward[]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copié !",
      description: "Le lien a été copié",
    });
  };

  const shareLink = async () => {
    const shareUrl = `https://dynamiktransfert.lovable.app/?ref=${sponsor.referral_code}`;
    const shareText = `🎁 Rejoins DYNAMIK Transfert avec mon code parrain ${sponsor.referral_code} et bénéficie d'avantages exclusifs !`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DYNAMIK Transfert - Parrainage',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const claimReward = async (reward: Reward) => {
    if (sponsor.total_points < reward.points_required) {
      toast({
        title: "Points insuffisants",
        description: `Il vous manque ${reward.points_required - sponsor.total_points} points`,
        variant: "destructive"
      });
      return;
    }

    // Ouvrir WhatsApp pour réclamer
    const message = `Bonjour DYNAMIK Transfert,

🎁 Je souhaite réclamer ma récompense :
- Récompense : ${reward.name}
- Points utilisés : ${reward.points_required}
- Mon code parrain : ${sponsor.referral_code}
- Mon numéro : ${sponsor.phone_number}

Merci de confirmer ma demande.`;

    const whatsappUrl = `https://wa.me/22899771419?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const referralLink = `https://dynamiktransfert.lovable.app/?ref=${sponsor.referral_code}`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Validé</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
      default:
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Non abouti</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header avec retour */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Tableau de bord Parrain</h2>
          <p className="text-sm text-muted-foreground">{sponsor.phone_number}</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <Trophy className="w-6 h-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-primary">{sponsor.total_points}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <Users className="w-6 h-6 mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold">{referrals.length}</p>
            <p className="text-xs text-muted-foreground">Filleuls</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <CheckCircle className="w-6 h-6 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold">{sponsor.total_validated}</p>
            <p className="text-xs text-muted-foreground">Validés</p>
          </CardContent>
        </Card>
      </div>

      {/* Code parrain */}
      <Card className="border-primary">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Votre code</span>
            <span className="text-xl font-bold text-primary">{sponsor.referral_code}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => copyToClipboard(referralLink)}
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              Copier le lien
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={shareLink}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Partager
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Récompenses disponibles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Récompenses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rewards.map((reward) => (
            <div 
              key={reward.id}
              className={`p-3 rounded-lg border ${sponsor.total_points >= reward.points_required ? 'border-primary bg-primary/5' : 'border-muted'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.description}</p>
                </div>
                <Badge variant={sponsor.total_points >= reward.points_required ? "default" : "secondary"}>
                  {reward.points_required} pts
                </Badge>
              </div>
              {sponsor.total_points >= reward.points_required && (
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => claimReward(reward)}
                >
                  Réclamer
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Liste des filleuls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Mes filleuls ({referrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucun filleul pour le moment.<br />
              Partagez votre lien pour commencer !
            </p>
          ) : (
            <div className="space-y-2">
              {referrals.map((ref) => (
                <div 
                  key={ref.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{ref.godchild_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ref.created_at).toLocaleDateString('fr-FR')} • {ref.source}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(ref.transfer_status)}
                    {ref.points_awarded > 0 && (
                      <p className="text-xs text-green-600 mt-1">+{ref.points_awarded} pts</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SponsorDashboard;
