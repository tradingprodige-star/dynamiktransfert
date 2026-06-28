import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

interface PromoCode {
  id: string;
  code: string;
  type: string;
  discount_percentage: number;
  ambassador_name?: string;
  expires_at?: string;
  is_active: boolean;
  max_uses?: number;
  current_uses: number;
}

interface PromoCodeUsage {
  id: string;
  used_at: string;
  promo_code_id: string;
  user_id: string;
}

const PromoCodeManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [usedCodes, setUsedCodes] = useState<PromoCodeUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get current authenticated user
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get the user profile from our users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
        }
      }
    };

    getCurrentUser();
    loadPromoCodes();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserUsage();
    }
  }, [user]);

  const loadPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error: unknown) {
      console.error('Erreur lors du chargement des codes promo:', error);
    }
  };

  const loadUserUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('promo_code_usage')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUsedCodes(data || []);
    } catch (error: unknown) {
      console.error('Erreur lors du chargement de l\'usage:', error);
    }
  };

  const usePromoCode = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour utiliser un code promo",
        variant: "destructive"
      });
      return;
    }

    if (!promoCode.trim()) {
      toast({
        title: "Code manquant",
        description: "Veuillez saisir un code promo",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Vérifier si le code existe et est actif
      const { data: codeData, error: codeError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (codeError || !codeData) {
        toast({
          title: "Code invalide",
          description: "Ce code promo n'existe pas ou a expiré",
          variant: "destructive"
        });
        return;
      }

      // Vérifier si le code a expiré
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        toast({
          title: "Code expiré",
          description: "Ce code promo a expiré",
          variant: "destructive"
        });
        return;
      }

      // Vérifier si l'utilisateur a déjà utilisé ce code
      const { data: usageData } = await supabase
        .from('promo_code_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('promo_code_id', codeData.id)
        .single();

      if (usageData) {
        toast({
          title: "Code déjà utilisé",
          description: "Ce code a déjà été utilisé avec ce numéro",
          variant: "destructive"
        });
        return;
      }

      // Règles spéciales pour les codes ambassadeurs
      if (codeData.type === 'ambassador') {
        const { data: ambassadorUsage } = await supabase
          .from('promo_code_usage')
          .select('promo_codes!inner(*)')
          .eq('user_id', user.id)
          .eq('promo_codes.type', 'ambassador')
          .single();

        if (ambassadorUsage) {
          toast({
            title: "Code ambassadeur déjà utilisé",
            description: "Vous avez déjà utilisé un code ambassadeur. Cette offre est réservée aux nouveaux parrainages.",
            variant: "destructive"
          });
          return;
        }
      }

      // Vérifier les limites d'usage
      if (codeData.max_uses && codeData.current_uses >= codeData.max_uses) {
        toast({
          title: "Code épuisé",
          description: "Ce code promo a atteint sa limite d'utilisation",
          variant: "destructive"
        });
        return;
      }

      // Enregistrer l'usage
      const { error: usageError } = await supabase
        .from('promo_code_usage')
        .insert([{
          user_id: user.id,
          promo_code_id: codeData.id
        }]);

      if (usageError) throw usageError;

      // Mettre à jour le compteur d'usage
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update({ current_uses: codeData.current_uses + 1 })
        .eq('id', codeData.id);

      if (updateError) throw updateError;

      toast({
        title: "Code validé !",
        description: `Code ${codeData.code} utilisé avec succès. Réduction : ${codeData.discount_percentage}%`,
      });

      // Recharger les données
      loadPromoCodes();
      loadUserUsage();
      setPromoCode("");

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUsedCodeInfo = (codeId: string) => {
    return promoCodes.find(code => code.id === codeId);
  };

  const hasUsedWelcomeCode = usedCodes.some(usage => {
    const code = getUsedCodeInfo(usage.promo_code_id);
    return code?.type === 'welcome';
  });

  const hasUsedAmbassadorCode = usedCodes.some(usage => {
    const code = getUsedCodeInfo(usage.promo_code_id);
    return code?.type === 'ambassador';
  });

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connexion requise</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connectez-vous pour utiliser les codes promo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Utilisation de code promo */}
      <Card>
        <CardHeader>
          <CardTitle>Utiliser un code promo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Code promo</label>
            <Input
              placeholder="Entrez votre code promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="h-12"
            />
          </div>
          
          <Button 
            onClick={usePromoCode}
            className="w-full h-12"
            disabled={loading}
          >
            {loading ? "Validation..." : "Utiliser le code"}
          </Button>
        </CardContent>
      </Card>

      {/* Status des codes */}
      <Card>
        <CardHeader>
          <CardTitle>Votre statut</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Code BIENVENUE</span>
            <Badge variant={hasUsedWelcomeCode ? "secondary" : "default"}>
              {hasUsedWelcomeCode ? "Utilisé" : "Disponible"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Code Ambassadeur</span>
            <Badge variant={hasUsedAmbassadorCode ? "secondary" : "default"}>
              {hasUsedAmbassadorCode ? "Utilisé" : "Disponible"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Codes utilisés */}
      {usedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Codes utilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {usedCodes.map((usage) => {
                const code = getUsedCodeInfo(usage.promo_code_id);
                return (
                  <div key={usage.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{code?.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {code?.type === 'welcome' ? 'Code de bienvenue' : `Code ambassadeur - ${code?.ambassador_name}`}
                      </p>
                    </div>
                    <Badge>-{code?.discount_percentage}%</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Codes disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Codes disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {promoCodes.map((code) => {
              const hasUsed = usedCodes.some(usage => usage.promo_code_id === code.id);
              const canUse = code.type === 'welcome' ? !hasUsedWelcomeCode : !hasUsedAmbassadorCode;
              
              return (
                <div key={code.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{code.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {code.type === 'welcome' ? 'Code de bienvenue' : `Code ambassadeur - ${code.ambassador_name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={hasUsed ? "secondary" : canUse ? "default" : "destructive"}>
                      {hasUsed ? "Utilisé" : canUse ? `-${code.discount_percentage}%` : "Non disponible"}
                    </Badge>
                    {code.max_uses && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {code.current_uses}/{code.max_uses} utilisés
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodeManager;