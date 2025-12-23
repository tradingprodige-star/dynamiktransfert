import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, Users, TrendingUp, Copy, Share2, Check, 
  Trophy, Clock, CheckCircle, XCircle, ArrowLeft,
  Flame, Star, Crown, Zap, Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SponsorData {
  id: string;
  phone_number: string;
  referral_code: string;
  total_points: number;
  total_referrals: number;
  total_validated: number;
  monthly_volume?: number;
  cumulative_volume?: number;
  current_level?: string;
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

const LEVELS = [
  { key: 'starter', name: 'Starter', emoji: '🔰', volume: 50000, bonus: 0, color: 'bg-gray-500' },
  { key: 'active', name: 'Active', emoji: '🚀', volume: 250000, bonus: 5, color: 'bg-blue-500' },
  { key: 'ambassadeur', name: 'Ambassadeur', emoji: '💼', volume: 1000000, bonus: 10, color: 'bg-purple-500' },
  { key: 'vip', name: 'VIP', emoji: '👑', volume: 3000000, bonus: 20, color: 'bg-amber-500' },
  { key: 'elite', name: 'Elite', emoji: '🏆', volume: 10000000, bonus: 25, color: 'bg-primary' },
];

const MILESTONES = [
  { volume: 100000, bonus: 10, label: '100K FCFA' },
  { volume: 500000, bonus: 25, label: '500K FCFA' },
  { volume: 1000000, bonus: 50, label: '1M FCFA' },
  { volume: 5000000, bonus: 180, label: '5M FCFA (Transfert gratuit)' },
];

const SponsorDashboard = ({ sponsor, onBack }: SponsorDashboardProps) => {
  const [referrals, setReferrals] = useState<ReferralClick[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [fullSponsor, setFullSponsor] = useState<SponsorData>(sponsor);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSponsorData();
    loadReferrals();
    loadRewards();
  }, [sponsor.id]);

  const loadSponsorData = async () => {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('id', sponsor.id)
      .single();

    if (!error && data) {
      setFullSponsor(data as SponsorData);
    }
  };

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
    if (fullSponsor.total_points < reward.points_required) {
      toast({
        title: "Points insuffisants",
        description: `Il vous manque ${reward.points_required - fullSponsor.total_points} points`,
        variant: "destructive"
      });
      return;
    }

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

  // Calculer le niveau actuel et la progression
  const currentLevel = LEVELS.find(l => l.key === (fullSponsor.current_level || 'starter')) || LEVELS[0];
  const currentLevelIndex = LEVELS.findIndex(l => l.key === currentLevel.key);
  const nextLevel = LEVELS[currentLevelIndex + 1];
  const monthlyVolume = fullSponsor.monthly_volume || 0;
  const cumulativeVolume = fullSponsor.cumulative_volume || 0;

  // Progression vers le niveau suivant
  const progressToNextLevel = nextLevel 
    ? Math.min(100, (monthlyVolume / nextLevel.volume) * 100) 
    : 100;
  const amountToNextLevel = nextLevel 
    ? Math.max(0, nextLevel.volume - monthlyVolume) 
    : 0;

  // Prochaine récompense atteignable
  const nextReward = rewards.find(r => r.points_required > fullSponsor.total_points);
  const pointsToNextReward = nextReward 
    ? nextReward.points_required - fullSponsor.total_points 
    : 0;

  // Prochain palier de bonus
  const nextMilestone = MILESTONES.find(m => m.volume > cumulativeVolume);

  const formatVolume = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
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
        <div className="flex-1">
          <h2 className="text-xl font-bold">Tableau de bord Parrain</h2>
          <p className="text-sm text-muted-foreground">{sponsor.phone_number}</p>
        </div>
        <Badge className={`${currentLevel.color} text-white`}>
          {currentLevel.emoji} {currentLevel.name}
        </Badge>
      </div>

      {/* Affichage psychologique - Progression */}
      <Card className="border-primary bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-primary">Votre progression</span>
          </div>
          
          {nextReward && (
            <div className="mb-4 p-3 bg-background rounded-lg border">
              <p className="text-sm font-medium mb-1">
                🔥 Plus que <span className="text-primary font-bold">{pointsToNextReward} points</span> pour débloquer :
              </p>
              <p className="text-lg font-bold text-primary">{nextReward.name}</p>
            </div>
          )}

          {nextLevel && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Niveau suivant : {nextLevel.emoji} {nextLevel.name}</span>
                <span className="text-muted-foreground">{formatVolume(monthlyVolume)} / {formatVolume(nextLevel.volume)}</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Plus que <span className="font-semibold">{formatVolume(amountToNextLevel)} FCFA</span> ce mois-ci pour atteindre {nextLevel.name} (+{nextLevel.bonus}% bonus points)
              </p>
            </div>
          )}

          {nextMilestone && (
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-xs">
                🎯 Prochain palier bonus à <span className="font-bold">{nextMilestone.label}</span> : <span className="text-amber-600 font-bold">+{nextMilestone.bonus} pts</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <Trophy className="w-6 h-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-primary">{fullSponsor.total_points}</p>
            <p className="text-xs text-muted-foreground">Points totaux</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold">{formatVolume(monthlyVolume)}</p>
            <p className="text-xs text-muted-foreground">Volume mensuel</p>
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
            <p className="text-2xl font-bold">{fullSponsor.total_validated}</p>
            <p className="text-xs text-muted-foreground">Validés</p>
          </CardContent>
        </Card>
      </div>

      {/* Niveaux */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Niveaux & Avantages
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-2">
            {LEVELS.map((level, idx) => (
              <div 
                key={level.key}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  level.key === currentLevel.key 
                    ? 'bg-primary/10 border border-primary' 
                    : idx < currentLevelIndex 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{level.emoji}</span>
                  <div>
                    <p className={`font-medium ${level.key === currentLevel.key ? 'text-primary' : ''}`}>
                      {level.name}
                    </p>
                    <p className="text-xs text-muted-foreground">≥ {formatVolume(level.volume)} FCFA/mois</p>
                  </div>
                </div>
                <Badge variant={level.key === currentLevel.key ? "default" : "secondary"}>
                  {level.bonus > 0 ? `+${level.bonus}%` : 'Base'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

      {/* Barème des points */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Barème des points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted/50 rounded">
              <p className="font-medium">5K - 20K</p>
              <p className="text-muted-foreground">2 pts</p>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <p className="font-medium">20K - 50K</p>
              <p className="text-muted-foreground">5 pts</p>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <p className="font-medium">50K - 100K</p>
              <p className="text-muted-foreground">12 pts</p>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <p className="font-medium">100K - 250K</p>
              <p className="text-muted-foreground">30 pts</p>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <p className="font-medium">250K - 500K</p>
              <p className="text-muted-foreground">70 pts</p>
            </div>
            <div className="p-2 bg-primary/10 rounded border border-primary">
              <p className="font-medium text-primary">+500K</p>
              <p className="text-primary">150 pts</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            × 1,5 pour transfert de filleul • × 2 pour filleul VIP
          </p>
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
              className={`p-3 rounded-lg border ${fullSponsor.total_points >= reward.points_required ? 'border-primary bg-primary/5' : 'border-muted'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.description}</p>
                </div>
                <Badge variant={fullSponsor.total_points >= reward.points_required ? "default" : "secondary"}>
                  {reward.points_required} pts
                </Badge>
              </div>
              {fullSponsor.total_points >= reward.points_required ? (
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => claimReward(reward)}
                >
                  Réclamer
                </Button>
              ) : (
                <div className="mt-2">
                  <Progress 
                    value={(fullSponsor.total_points / reward.points_required) * 100} 
                    className="h-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Encore {reward.points_required - fullSponsor.total_points} pts
                  </p>
                </div>
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
                      {ref.transfer_amount && ` • ${ref.transfer_amount.toLocaleString()} FCFA`}
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