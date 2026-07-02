import { useCallback, useEffect, useState } from 'react';
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
  Crown, Award, Wallet, LogOut, TicketPercent
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminCmsManager from '@/components/admin/AdminCmsManager';

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

interface PromoUsage {
  id: string;
  used_at: string;
  user_id: string;
  promo_code_id: string;
  promo_codes?: {
    code: string;
    type: string;
    discount_percentage: number;
    ambassador_name: string | null;
    current_uses: number;
  };
  users?: {
    phone_number: string;
  };
}

interface Stats {
  totalSponsors: number;
  totalClicks: number;
  totalValidated: number;
  totalPoints: number;
  totalVolume: number;
  totalPromoUses: number;
}

const TEST_DATA_PATTERN = /\b(test|demo|démo|essai|sample|placeholder|lorem|fake|mock)\b/i;

const isTestLikeValue = (value?: string | null) => Boolean(value && TEST_DATA_PATTERN.test(value));

const sourceLabels: Record<string, string> = {
  signup: "Inscription client",
  calculator: "Simulation de transfert",
  transfer: "Demande de transfert",
  whatsapp: "Contact WhatsApp",
  referral: "Lien partenaire",
};

const formatSource = (source?: string | null) => {
  if (!source) return "Parcours client";
  return sourceLabels[source] || source.replace(/[_-]/g, " ");
};

const maskIdentifier = (value?: string | null) => {
  if (!value) return "Client non renseigné";
  if (value.startsWith("+") || /^\d{7,}$/.test(value.replace(/\D/g, ""))) return value;
  if (value.includes("@")) return value.replace(/^(.{2}).*(@.*)$/, "$1•••$2");
  if (value.length > 14) return `${value.slice(0, 6)}…${value.slice(-4)}`;
  return value;
};

const isTestReferral = (item: ReferralClick) =>
  [item.referral_code, item.godchild_id, item.godchild_phone, item.source, item.sponsors?.phone_number]
    .some(isTestLikeValue);

const isTestSponsor = (item: Sponsor) =>
  [item.phone_number, item.referral_code]
    .some(isTestLikeValue);

const isTestPromoUsage = (item: PromoUsage) =>
  [item.user_id, item.users?.phone_number, item.promo_codes?.code, item.promo_codes?.ambassador_name]
    .some(isTestLikeValue);

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
  const [promoUsages, setPromoUsages] = useState<PromoUsage[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSponsors: 0, totalClicks: 0, totalValidated: 0, totalPoints: 0, totalVolume: 0, totalPromoUses: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'referrals' | 'sponsors' | 'promo' | 'cms'>('referrals');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [validateDialog, setValidateDialog] = useState<{ open: boolean; click: ReferralClick | null }>({ open: false, click: null });
  const [transferAmount, setTransferAmount] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
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

      // Charger les utilisations de codes promo avec les profils utilisateurs
      const { data: promoUsageData, error: promoUsageError } = await supabase
        .from('promo_code_usage')
        .select(`
          id,
          used_at,
          user_id,
          promo_code_id,
          promo_codes (
            code,
            type,
            discount_percentage,
            ambassador_name,
            current_uses
          ),
          users (
            phone_number
          )
        `)
        .order('used_at', { ascending: false });

      if (promoUsageError) {
        console.info('Promo usage loading skipped:', promoUsageError.message);
      } else {
        setPromoUsages((promoUsageData || []) as PromoUsage[]);
      }

      // Calculer les stats
      const totalSponsors = sponsorsData?.length || 0;
      const totalPoints = sponsorsData?.reduce((sum, s) => sum + (s.total_points || 0), 0) || 0;
      const totalVolume = sponsorsData?.reduce((sum, s) => sum + (s.cumulative_volume || 0), 0) || 0;
      const totalClicks = clicksData?.length || 0;
      const totalValidated = clicksData?.filter(c => c.transfer_status === 'validated').length || 0;

      const totalPromoUses = promoUsageData?.length || 0;

      setStats({ totalSponsors, totalClicks, totalValidated, totalPoints, totalVolume, totalPromoUses });

    } catch (error: unknown) {
      console.error('Error loading data:', error);
      toast({ title: "Erreur de chargement", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Check authentication and admin role on mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsCheckingAuth(true);

      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          setIsAdmin(false);
          setIsCheckingAuth(false);
          return;
        }

        // Check if user has admin role in database
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleError) {
          console.error('Error checking admin role:', roleError);
          setIsAdmin(false);
          setIsCheckingAuth(false);
          return;
        }

        if (roleData) {
          setIsAdmin(true);
          loadData();
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAccess();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({ title: "Déconnexion réussie" });
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
      // Get current user for admin validation
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Non authentifié", variant: "destructive" });
        return;
      }

      // Use the secure RPC function to validate transfer
      const { data, error } = await supabase.rpc('validate_transfer', {
        _admin_id: user.id,
        _click_id: validateDialog.click.id,
        _transfer_amount: amount
      });

      if (error) throw error;

      toast({ 
        title: "Transfert validé", 
        description: `Points attribués avec succès` 
      });
      
      setValidateDialog({ open: false, click: null });
      loadData();

    } catch (error: unknown) {
      console.error('Error validating:', error);
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  const rejectTransfer = async (clickId: string) => {
    try {
      const { error } = await supabase
        .from('referral_clicks')
        .update({ transfer_status: 'rejected' })
        .eq('id', clickId);

      if (error) throw error;

      toast({ title: "Demande marquée comme non confirmée" });
      loadData();
    } catch (error: unknown) {
      console.error('Error rejecting:', error);
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  const exportCSV = () => {
    if (activeTab === 'referrals') {
      const headers = ['Date', 'Code partenaire', 'Téléphone partenaire', 'Niveau', 'Client', 'Origine client', 'Montant', 'Statut', 'Points'];
      const rows = filteredReferrals.map(r => [
        new Date(r.created_at).toLocaleDateString('fr-FR'),
        r.referral_code,
        r.sponsors?.phone_number || '',
        r.sponsors?.current_level || 'starter',
        maskIdentifier(r.godchild_phone || r.godchild_id),
        formatSource(r.source),
        r.transfer_amount || '',
        r.transfer_status === 'validated' ? 'Transfert confirmé' : r.transfer_status === 'rejected' ? 'Non confirmé' : 'En attente',
        r.points_awarded
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dynamik-referrals-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else if (activeTab === 'sponsors') {
      const headers = ['Téléphone', 'Code', 'Niveau', 'Points', 'Clients invités', 'Validés', 'Volume mensuel', 'Volume cumulé', 'Date inscription'];
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
    } else if (activeTab === 'promo') {
      const headers = ['Date', 'Code promo', 'Type', 'Partenaire', 'Client', 'Réduction'];
      const rows = filteredPromoUsages.map((usage) => [
        new Date(usage.used_at).toLocaleDateString('fr-FR'),
        usage.promo_codes?.code || '',
        usage.promo_codes?.type || '',
        usage.promo_codes?.ambassador_name || '',
        usage.users?.phone_number || maskIdentifier(usage.user_id),
        usage.promo_codes?.discount_percentage ? `${usage.promo_codes.discount_percentage}%` : '',
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dynamik-codes-promo-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const cleanReferrals = referrals.filter((r) => !isTestReferral(r));
  const cleanSponsors = sponsors.filter((s) => !isTestSponsor(s));
  const cleanPromoUsages = promoUsages.filter((usage) => !isTestPromoUsage(usage));

  const cleanTotalValidated = cleanReferrals.filter((item) => item.transfer_status === 'validated').length;
  const cleanTotalPoints = cleanSponsors.reduce((sum, item) => sum + (item.total_points || 0), 0);
  const cleanTotalVolume = cleanSponsors.reduce((sum, item) => sum + (item.cumulative_volume || 0), 0);

  const filteredReferrals = cleanReferrals.filter(r => {
    const matchesSearch = 
      r.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.godchild_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sponsors?.phone_number?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || r.transfer_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSponsors = cleanSponsors.filter(s => {
    const matchesSearch = 
      s.phone_number.includes(searchTerm) ||
      s.referral_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || s.current_level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  const filteredPromoUsages = cleanPromoUsages.filter((usage) => {
    const code = usage.promo_codes?.code || '';
    const partner = usage.promo_codes?.ambassador_name || '';
    const phone = usage.users?.phone_number || '';

    return (
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      usage.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatVolume = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Show login redirect for non-admins
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Accès conseiller requis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Connectez-vous avec un compte conseiller autorisé pour gérer les partenaires, les codes et les demandes client.
            </p>
            <Link to="/auth?mode=signin">
              <Button className="w-full">
                Se connecter
              </Button>
            </Link>
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
              <h1 className="text-2xl font-bold">Espace conseiller DYNAMIK</h1>
              <p className="text-muted-foreground">Suivi des partenaires, codes promo et demandes client.</p>
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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{cleanSponsors.length}</p>
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
                  <p className="text-2xl font-bold">{cleanReferrals.length}</p>
                  <p className="text-xs text-muted-foreground">Demandes suivies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{cleanTotalValidated}</p>
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
                  <p className="text-2xl font-bold">{cleanTotalPoints}</p>
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
                  <p className="text-2xl font-bold">{formatVolume(cleanTotalVolume)}</p>
                  <p className="text-xs text-muted-foreground">Volume total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <TicketPercent className="w-8 h-8 text-violet-600" />
                <div>
                  <p className="text-2xl font-bold">{cleanPromoUsages.length}</p>
                  <p className="text-xs text-muted-foreground">Codes utilisés</p>
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
            Demandes client ({cleanReferrals.length})
          </Button>
          <Button 
            variant={activeTab === 'sponsors' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sponsors')}
          >
            Partenaires ({cleanSponsors.length})
          </Button>
          <Button
            variant={activeTab === 'promo' ? 'default' : 'outline'}
            onClick={() => setActiveTab('promo')}
          >
            Codes promo ({cleanPromoUsages.length})
          </Button>
          <Button
            variant={activeTab === 'cms' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cms')}
          >
            Contenus publics
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'promo' ? "Rechercher un code, un partenaire ou un client..." : activeTab === 'referrals' ? "Rechercher une demande, un code ou un téléphone..." : "Rechercher un partenaire, un téléphone ou un code..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {activeTab === 'referrals' ? (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="validated">Validés</SelectItem>
                <SelectItem value="rejected">Non confirmés</SelectItem>
              </SelectContent>
            </Select>
          ) : activeTab === 'sponsors' ? (
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Niveau" />
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
          ) : null}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activeTab === 'cms' ? (
          <AdminCmsManager />
        ) : activeTab === 'referrals' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Partenaire</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.map((click) => (
                    <TableRow key={click.id}>
                      <TableCell className="text-sm">
                        {new Date(click.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{click.referral_code}</p>
                          <p className="text-xs text-muted-foreground">{click.sponsors?.phone_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={LEVEL_COLORS[click.sponsors?.current_level || 'starter']}>
                          {LEVEL_EMOJIS[click.sponsors?.current_level || 'starter']} {click.sponsors?.current_level || 'starter'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{maskIdentifier(click.godchild_phone || click.godchild_id)}</p>
                          <p className="text-xs text-muted-foreground">{formatSource(click.source)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {click.transfer_amount ? (
                          <span className="font-medium">{click.transfer_amount.toLocaleString()} FCFA</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">+{click.points_awarded}</span>
                      </TableCell>
                      <TableCell>
                        {click.transfer_status === 'validated' && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Validé
                          </Badge>
                        )}
                        {click.transfer_status === 'pending' && (
                          <Badge variant="outline" className="text-orange-500 border-orange-500">
                            <Clock className="w-3 h-3 mr-1" />
                            En attente
                          </Badge>
                        )}
                        {click.transfer_status === 'rejected' && (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Non confirmé
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {click.transfer_status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => openValidateDialog(click)}>
                              Valider
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectTransfer(click.id)}>
                              Rejeter
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredReferrals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune demande client trouvée
                </div>
              )}
            </CardContent>
          </Card>
        ) : activeTab === 'sponsors' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partenaire</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Clients invités</TableHead>
                    <TableHead>Validés</TableHead>
                    <TableHead>Vol. Mensuel</TableHead>
                    <TableHead>Vol. Cumulé</TableHead>
                    <TableHead>Inscrit le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSponsors.map((sponsor) => (
                    <TableRow key={sponsor.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sponsor.phone_number}</p>
                          <p className="text-xs text-muted-foreground">{sponsor.referral_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={LEVEL_COLORS[sponsor.current_level || 'starter']}>
                          {LEVEL_EMOJIS[sponsor.current_level || 'starter']} {sponsor.current_level || 'starter'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">{sponsor.total_points}</span>
                      </TableCell>
                      <TableCell>{sponsor.total_referrals}</TableCell>
                      <TableCell>{sponsor.total_validated}</TableCell>
                      <TableCell>{formatVolume(sponsor.monthly_volume || 0)} FCFA</TableCell>
                      <TableCell>{formatVolume(sponsor.cumulative_volume || 0)} FCFA</TableCell>
                      <TableCell className="text-sm">
                        {new Date(sponsor.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredSponsors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun partenaire trouvé
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Code promo</TableHead>
                    <TableHead>Partenaire / parrain</TableHead>
                    <TableHead>Client inscrit</TableHead>
                    <TableHead>Réduction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromoUsages.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="text-sm">
                        {new Date(usage.used_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{usage.promo_codes?.code || 'Code supprimé'}</p>
                          <p className="text-xs text-muted-foreground">{usage.promo_codes?.type || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell>{usage.promo_codes?.ambassador_name || '—'}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{usage.users?.phone_number || 'Client non relié'}</p>
                          <p className="text-xs text-muted-foreground">Référence : {maskIdentifier(usage.user_id)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{usage.promo_codes?.discount_percentage || 0}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredPromoUsages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun code promo utilisé pour le moment
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Validate Dialog */}
        <Dialog open={validateDialog.open} onOpenChange={(open) => setValidateDialog({ open, click: validateDialog.click })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la demande client</DialogTitle>
              <DialogDescription>
                Entrez le montant réellement traité pour {maskIdentifier(validateDialog.click?.godchild_phone || validateDialog.click?.godchild_id)}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="number"
                placeholder="Montant en FCFA"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
              {transferAmount && parseFloat(transferAmount) >= 5000 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Points à attribuer:</p>
                  <p className="text-lg font-bold text-primary">
                    {(() => {
                      const amount = parseFloat(transferAmount);
                      let base = 0;
                      if (amount >= 500000) base = 150;
                      else if (amount >= 250001) base = 70;
                      else if (amount >= 100001) base = 30;
                      else if (amount >= 50001) base = 12;
                      else if (amount >= 20001) base = 5;
                      else if (amount >= 5000) base = 2;
                      return `~${Math.ceil(base * 1.5)} points (calcul final côté serveur)`;
                    })()}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setValidateDialog({ open: false, click: null })}>
                Annuler
              </Button>
              <Button onClick={validateTransfer}>
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminReferrals;
