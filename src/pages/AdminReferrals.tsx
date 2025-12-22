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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, TrendingUp, CheckCircle, Clock, XCircle, 
  Search, Download, RefreshCw, ArrowLeft, Shield
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
  };
}

interface Stats {
  totalSponsors: number;
  totalClicks: number;
  totalValidated: number;
  totalPoints: number;
}

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralClick[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSponsors: 0, totalClicks: 0, totalValidated: 0, totalPoints: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const { toast } = useToast();

  // Code admin simple pour l'accès (à remplacer par auth complète plus tard)
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
            referral_code
          )
        `)
        .order('created_at', { ascending: false });

      if (clicksError) throw clicksError;
      setReferrals(clicksData as ReferralClick[]);

      // Charger les stats
      const { data: sponsorsData } = await supabase
        .from('sponsors')
        .select('id, total_points');

      const totalSponsors = sponsorsData?.length || 0;
      const totalPoints = sponsorsData?.reduce((sum, s) => sum + (s.total_points || 0), 0) || 0;
      const totalClicks = clicksData?.length || 0;
      const totalValidated = clicksData?.filter(c => c.transfer_status === 'validated').length || 0;

      setStats({ totalSponsors, totalClicks, totalValidated, totalPoints });

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({ title: "Erreur de chargement", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const validateTransfer = async (click: ReferralClick, amount: number) => {
    try {
      // Mettre à jour le clic
      const { error: updateError } = await supabase
        .from('referral_clicks')
        .update({
          transfer_status: 'validated',
          transfer_amount: amount,
          points_awarded: 10,
          validated_at: new Date().toISOString()
        })
        .eq('id', click.id);

      if (updateError) throw updateError;

      // Mettre à jour les points du parrain
      const { error: sponsorError } = await supabase
        .from('sponsors')
        .update({
          total_points: supabase.rpc ? 10 : 10, // Will add 10 via RPC ideally
          total_validated: supabase.rpc ? 1 : 1
        })
        .eq('id', click.sponsor_id);

      // Ajouter à l'historique des points
      await supabase
        .from('points_history')
        .insert({
          sponsor_id: click.sponsor_id,
          referral_click_id: click.id,
          points: 10,
          reason: 'Transfert validé'
        });

      toast({ title: "Transfert validé", description: "+10 points attribués au parrain" });
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
    const headers = ['Date', 'Code Parrain', 'Tel Parrain', 'ID Filleul', 'Source', 'Montant', 'Statut', 'Points'];
    const rows = filteredReferrals.map(r => [
      new Date(r.created_at).toLocaleDateString('fr-FR'),
      r.referral_code,
      r.sponsors?.phone_number || '',
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
  };

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = 
      r.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.godchild_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sponsors?.phone_number?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || r.transfer_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
              <p className="text-muted-foreground">Gestion des parrainages DYNAMIK</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalPoints}</p>
                  <p className="text-xs text-muted-foreground">Points distribués</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Code Parrain</TableHead>
                    <TableHead>Tél Parrain</TableHead>
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
                              onClick={() => {
                                const amount = prompt('Montant du transfert (FCFA) :');
                                if (amount) validateTransfer(ref, parseFloat(amount));
                              }}
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
      </div>
    </div>
  );
};

export default AdminReferrals;
