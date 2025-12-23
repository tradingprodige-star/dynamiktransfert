import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, TrendingUp, CheckCircle, Clock, XCircle, 
  Search, Download, RefreshCw, ArrowLeft, Shield,
  Crown, Award, Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReferralClick {
  id: string;
  sponsor_id: string;
  referral_code: string;
  godchild_id: string;
  godchild_phone: string | null;
  source: string;
  country_from: string | null;
  country_to: string | null;
  transfer_amount: number | null;
  transfer_status: string;
  points_awarded: number;
  created_at: string;
  sponsors?: {
    phone_number: string;
    referral_code: string;
    current_level: string;
    monthly_volume: number;
    total_points: number;
  };
}

interface Sponsor {
  id: string;
  phone_number: string;
  referral_code: string;
  total_points: number;
  total_referrals: number;
  total_validated: number;
  monthly_volume: number;
  cumulative_volume: number;
  current_level: string;
  created_at: string;
}

interface Stats {
  totalSponsors: number;
  totalClicks: number;
  totalValidated: number;
  totalPoints: number;
  totalVolume: number;
}

const LEVEL_COLORS: Record<string, string> = {
  starter: 'bg-gray-500',
  active: 'bg-blue-500',
  ambassadeur: 'bg-purple-500',
  vip: 'bg-amber-500',
  elite: 'bg-primary',
};

const LEVEL_EMOJIS: Record<string, string> = {
  starter: '🔰',
  active: '🚀',
  ambassadeur: '💼',
  vip: '👑',
  elite: '🏆',
};

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralClick[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSponsors: 0, totalClicks: 0, totalValidated: 0, totalPoints: 0, totalVolume: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'referrals' | 'sponsors'>('referrals');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [validateDialog, setValidateDialog] = useState<{ open: boolean; click: ReferralClick | null }>({ open: false, click: null });
  const [transferAmount, setTransferAmount] = useState('');
  const { toast } = useToast();

  const ADMIN_CODE = 'DYNAMIK2025';

  useEffect(() => {
    const storedAdmin = localStorage.getItem('dynamik_admin');
    if (storedAdmin === 'true') {
      setIsAdmin(true);
      loadData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_CODE) {
      localStorage.setItem('dynamik_admin', 'true');
      setIsAdmin(true);
      loadData();
      toast({ title: "Accès admin accordé" });
    } else {
      toast({ title: "Code incorrect", variant: "destructive" });
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Charger les referrals avec les infos sponsor
      const { data: clicksData, error: clicksError } = await supabase
        .from('referral_clicks')
        .select(`
          *,
          sponsors (
            phone_number,
            referral_code,
            current_level,
            monthly_volume,
            total_points
          )
        `)
        .order('created_at', { ascending: false });

      if (clicksError) throw clicksError;
      setReferrals(clicksData as ReferralClick[]);

      // Charger les sponsors
      const { data: sponsorsData } = await supabase
        .from('sponsors')
        .select('*')
        .order('total_points', { ascending: false });

      if (sponsorsData) {
        setSponsors(sponsorsData as Sponsor[]);
      }

      // Calculer les stats
      const totalSponsors = sponsorsData?.length || 0;
      const totalPoints = sponsorsData?.reduce((sum, s) => sum + (s.total_points || 0), 0) || 0;
      const totalVolume = sponsorsData?.reduce((sum, s) => sum + (s.cumulative_volume || 0), 0) || 0;
      const totalClicks = clicksData?.length || 0;
      const totalValidated = clicksData?.filter(c => c.transfer_status === 'validated').length || 0;

      setStats({ totalSponsors, totalClicks, totalValidated, totalPoints, totalVolume });

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({ title: "Erreur de chargement", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const openValidateDialog = (click: ReferralClick) => {
    setValidateDialog({ open: true, click });
    setTransferAmount('');
  };

  const validateTransfer = async () => {
    if (!validateDialog.click || !transferAmount) return;

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount < 5000) {
      toast({ title: "Montant invalide", description: "Le montant doit être au moins 5000 FCFA", variant: "destructive" });
      return;
    }

    try {
      // Mettre à jour le clic avec le nouveau système de points
      const { error: updateError } = await supabase
        .from('referral_clicks')
        .update({
          transfer_status: 'validated',
          transfer_amount: amount,
          validated_at: new Date().toISOString()
        })
        .eq('id', validateDialog.click.id);

      if (updateError) throw updateError;

      // Calculer les points selon le barème
      let basePoints = 0;
      if (amount >= 500000) basePoints = 150;
      else if (amount >= 250001) basePoints = 70;
      else if (amount >= 100001) basePoints = 30;
      else if (amount >= 50001) basePoints = 12;
      else if (amount >= 20001) basePoints = 5;
      else if (amount >= 5000) basePoints = 2;

      // Multiplicateur filleul (1.5x par défaut)
      const finalPoints = Math.ceil(basePoints * 1.5);

      // Mettre à jour les points du parrain
      const { data: sponsorData } = await supabase
        .from('sponsors')
        .select('total_points, total_validated, monthly_volume, cumulative_volume, monthly_volume_reset_at')
        .eq('id', validateDialog.click.sponsor_id)
        .single();

      if (sponsorData) {
        const now = new Date();
        const resetAt = new Date(sponsorData.monthly_volume_reset_at);
        const isNewMonth = resetAt.getMonth() !== now.getMonth() || resetAt.getFullYear() !== now.getFullYear();

        const newMonthlyVolume = isNewMonth ? amount : (sponsorData.monthly_volume || 0) + amount;
        
        // Calculer le nouveau niveau
        let newLevel = 'starter';
        if (newMonthlyVolume >= 10000000) newLevel = 'elite';
        else if (newMonthlyVolume >= 3000000) newLevel = 'vip';
        else if (newMonthlyVolume >= 1000000) newLevel = 'ambassadeur';
        else if (newMonthlyVolume >= 250000) newLevel = 'active';

        await supabase
          .from('sponsors')
          .update({
            total_points: sponsorData.total_points + finalPoints,
            total_validated: sponsorData.total_validated + 1,
            monthly_volume: newMonthlyVolume,
            monthly_volume_reset_at: isNewMonth ? now.toISOString() : sponsorData.monthly_volume_reset_at,
            cumulative_volume: (sponsorData.cumulative_volume || 0) + amount,
            current_level: newLevel
          })
          .eq('id', validateDialog.click.sponsor_id);
      }

      // Mettre à jour les points attribués sur le clic
      await supabase
        .from('referral_clicks')
        .update({ points_awarded: finalPoints })
        .eq('id', validateDialog.click.id);

      // Ajouter à l'historique des points
      await supabase
        .from('points_history')
        .insert({
          sponsor_id: validateDialog.click.sponsor_id,
          referral_click_id: validateDialog.click.id,
          points: finalPoints,
          reason: `Transfert validé: ${amount.toLocaleString()} FCFA (${basePoints} pts × 1.5)`
        });

      toast({ 
        title: "Transfert validé", 
        description: `+${finalPoints} points attribués (${amount.toLocaleString()} FCFA)` 
      });
      
      setValidateDialog({ open: false, click: null });
      loadData();

    } catch (error: any) {
      console.error('Error validating:', error);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const rejectTransfer = async (clickId: string) => {
    try {
      await supabase
        .from('referral_clicks')
        .update({ transfer_status: 'rejected' })
        .eq('id', clickId);

      toast({ title: "Transfert marqué comme non abouti" });
      loadData();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const exportCSV = () => {
    if (activeTab === 'referrals') {
      const headers = ['Date', 'Code Parrain', 'Tel Parrain', 'Niveau', 'ID Filleul', 'Source', 'Montant', 'Statut', 'Points'];
      const rows = filteredReferrals.map(r => [
        new Date(r.created_at).toLocaleDateString('fr-FR'),
        r.referral_code,
        r.sponsors?.phone_number || '',
        r.sponsors?.current_level || 'starter',
        r.godchild_id,
        r.source,
        r.transfer_amount || '',
        r.transfer_status,
        r.points_awarded
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dynamik-referrals-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      const headers = ['Tel', 'Code', 'Niveau', 'Points', 'Filleuls', 'Validés', 'Volume Mensuel', 'Volume Cumulé', 'Date inscription'];
      const rows = filteredSponsors.map(s => [
        s.phone_number,
        s.referral_code,
        s.current_level || 'starter',
        s.total_points,
        s.total_referrals,
        s.total_validated,
        s.monthly_volume || 0,
        s.cumulative_volume || 0,
        new Date(s.created_at).toLocaleDateString('fr-FR')
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dynamik-sponsors-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = 
      r.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.godchild_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sponsors?.phone_number?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || r.transfer_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSponsors = sponsors.filter(s => {
    const matchesSearch = 
      s.phone_number.includes(searchTerm) ||
      s.referral_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || s.current_level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  const formatVolume = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Admin Parrainage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Code d'accès admin"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <Button className="w-full" onClick={handleAdminLogin}>
              Accéder
            </Button>
            <Link to="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Admin Parrainage</h1>
              <p className="text-muted-foreground">Gestion complète des parrainages DYNAMIK</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalSponsors}</p>
                  <p className="text-xs text-muted-foreground">Parrains</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalClicks}</p>
                  <p className="text-xs text-muted-foreground">Clics totaux</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalValidated}</p>
                  <p className="text-xs text-muted-foreground">Validés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalPoints}</p>
                  <p className="text-xs text-muted-foreground">Points distribués</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{formatVolume(stats.totalVolume)}</p>
                  <p className="text-xs text-muted-foreground">Volume total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === 'referrals' ? 'default' : 'outline'}
            onClick={() => setActiveTab('referrals')}
          >
            Transferts ({referrals.length})
          </Button>
          <Button 
            variant={activeTab === 'sponsors' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sponsors')}
          >
            Parrains ({sponsors.length})
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par code, ID filleul, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {activeTab === 'referrals' ? (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="validated">Validés</SelectItem>
                    <SelectItem value="rejected">Non aboutis</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="starter">🔰 Starter</SelectItem>
                    <SelectItem value="active">🚀 Active</SelectItem>
                    <SelectItem value="ambassadeur">💼 Ambassadeur</SelectItem>
                    <SelectItem value="vip">👑 VIP</SelectItem>
                    <SelectItem value="elite">🏆 Elite</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tables */}
        {activeTab === 'referrals' ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Code Parrain</TableHead>
                      <TableHead>Tél Parrain</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>ID Filleul</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(ref.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {ref.referral_code}
                        </TableCell>
                        <TableCell>
                          {ref.sponsors?.phone_number || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${LEVEL_COLORS[ref.sponsors?.current_level || 'starter']} text-white`}>
                            {LEVEL_EMOJIS[ref.sponsors?.current_level || 'starter']} {ref.sponsors?.current_level || 'starter'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {ref.godchild_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{ref.source}</Badge>
                        </TableCell>
                        <TableCell>
                          {ref.transfer_amount ? `${ref.transfer_amount.toLocaleString()} FCFA` : '-'}
                        </TableCell>
                        <TableCell>
                          {ref.transfer_status === 'validated' && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" /> Validé
                            </Badge>
                          )}
                          {ref.transfer_status === 'pending' && (
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" /> En attente
                            </Badge>
                          )}
                          {ref.transfer_status === 'rejected' && (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" /> Non abouti
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {ref.points_awarded > 0 ? (
                            <span className="text-green-600 font-medium">+{ref.points_awarded}</span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {ref.transfer_status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => openValidateDialog(ref)}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => rejectTransfer(ref.id)}
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredReferrals.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun parrainage trouvé
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Filleuls</TableHead>
                      <TableHead>Validés</TableHead>
                      <TableHead>Vol. Mensuel</TableHead>
                      <TableHead>Vol. Cumulé</TableHead>
                      <TableHead>Inscription</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSponsors.map((sponsor) => (
                      <TableRow key={sponsor.id}>
                        <TableCell className="font-medium">
                          {sponsor.phone_number}
                        </TableCell>
                        <TableCell className="font-mono">
                          {sponsor.referral_code}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${LEVEL_COLORS[sponsor.current_level || 'starter']} text-white`}>
                            {LEVEL_EMOJIS[sponsor.current_level || 'starter']} {sponsor.current_level || 'starter'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-primary">{sponsor.total_points}</span>
                        </TableCell>
                        <TableCell>{sponsor.total_referrals}</TableCell>
                        <TableCell>
                          <span className="text-green-600">{sponsor.total_validated}</span>
                        </TableCell>
                        <TableCell>
                          {formatVolume(sponsor.monthly_volume || 0)} FCFA
                        </TableCell>
                        <TableCell>
                          {formatVolume(sponsor.cumulative_volume || 0)} FCFA
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(sponsor.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredSponsors.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun parrain trouvé
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialog de validation */}
        <Dialog open={validateDialog.open} onOpenChange={(open) => setValidateDialog({ open, click: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Valider le transfert</DialogTitle>
              <DialogDescription>
                Entrez le montant du transfert pour calculer les points automatiquement.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Montant du transfert (FCFA)</label>
                <Input
                  type="number"
                  placeholder="Ex: 50000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  min="5000"
                />
              </div>
              {transferAmount && parseFloat(transferAmount) >= 5000 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Prévisualisation des points :</p>
                  <div className="space-y-1 text-sm">
                    {(() => {
                      const amount = parseFloat(transferAmount);
                      let basePoints = 0;
                      if (amount >= 500000) basePoints = 150;
                      else if (amount >= 250001) basePoints = 70;
                      else if (amount >= 100001) basePoints = 30;
                      else if (amount >= 50001) basePoints = 12;
                      else if (amount >= 20001) basePoints = 5;
                      else if (amount >= 5000) basePoints = 2;
                      
                      const finalPoints = Math.ceil(basePoints * 1.5);
                      return (
                        <>
                          <p>Points de base : <span className="font-bold">{basePoints}</span></p>
                          <p>Multiplicateur filleul : <span className="font-bold">× 1.5</span></p>
                          <p className="text-primary font-bold">Points finaux : {finalPoints}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setValidateDialog({ open: false, click: null })}>
                Annuler
              </Button>
              <Button onClick={validateTransfer} disabled={!transferAmount || parseFloat(transferAmount) < 5000}>
                Valider le transfert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminReferrals;