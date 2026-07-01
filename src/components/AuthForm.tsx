import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { getStoredReferralCode, persistReferralCode } from '@/lib/dynamik';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralCode = getStoredReferralCode();
  const initialMode = useMemo(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup" || mode === "inscription") return "signup";
    return "signin";
  }, [searchParams]);
  const [activeTab, setActiveTab] = useState(initialMode);

  useEffect(() => {
    setActiveTab(referralCode ? "signup" : initialMode);
  }, [initialMode, referralCode]);

  const applyReferralAfterSignup = async (userId: string, phone: string) => {
    const code = persistReferralCode(referralCode);
    if (!code) return;

    // Lien de parrainage: crée une ligne visible côté super-admin.
    const { error: referralError } = await supabase.rpc('record_referral_interest', {
      _referral_code: code,
      _godchild_id: userId,
      _godchild_phone: phone,
      _source: 'signup',
      _country_from: null,
      _country_to: null,
    });

    if (referralError) {
      console.info('Referral tracking fallback skipped:', referralError.message);
    }

    // Code promo lié: marque le code comme utilisé par ce nouvel inscrit, si le code existe dans promo_codes.
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('id, current_uses')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();

    if (!promo) return;

    const { error: usageError } = await supabase
      .from('promo_code_usage')
      .insert({ user_id: userId, promo_code_id: promo.id });

    if (!usageError) {
      await supabase
        .from('promo_codes')
        .update({ current_uses: (promo.current_uses || 0) + 1 })
        .eq('id', promo.id);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+\d{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const handleSignUp = async () => {
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phoneNumber);
    
    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    if (!validatePhoneNumber(sanitizedPhone)) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone valide avec l'indicatif pays",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Use Supabase Auth for secure authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone_number: sanitizedPhone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([{ 
            id: authData.user.id,
            phone_number: sanitizedPhone 
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        await applyReferralAfterSignup(authData.user.id, sanitizedPhone);

        toast({
          title: "Inscription réussie !",
          description: "Vérifiez votre email pour confirmer votre compte",
        });

        onSuccess();
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur d'inscription",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    const sanitizedEmail = sanitizeInput(email);
    
    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Mot de passe invalide",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur DYNAMIK Exchange",
      });

      onSuccess();

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur de connexion",
        description: message === 'Invalid login credentials'
          ? "Email ou mot de passe incorrect" 
          : message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card hover-anticipate">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl text-center bg-gradient-primary bg-clip-text text-transparent font-bold">
          Accès DYNAMIK
        </CardTitle>
      </CardHeader>
      <CardContent>
        {referralCode && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-200">
            Code parrain détecté : <span className="font-bold">{referralCode}</span>. Il sera appliqué automatiquement à votre inscription.
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            
            <Button 
              onClick={handleSignIn}
              className="w-full h-12 bg-gradient-primary text-white hover:opacity-95 font-bold micro-interaction shadow-financial border border-white/10"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Numéro de téléphone
              </label>
              <PhoneInput
                defaultCountry="tg"
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                inputClassName="!h-12 !border-input !bg-background !text-foreground"
                countrySelectorStyleProps={{
                  className: "!border-input !bg-background"
                }}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="Au moins 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                placeholder="Répétez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12"
              />
            </div>
            
            <Button 
              onClick={handleSignUp}
              className="w-full h-12 bg-gradient-primary text-white hover:opacity-95 font-bold micro-interaction shadow-financial border border-white/10"
              disabled={loading}
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          En vous inscrivant, vous acceptez nos conditions d'utilisation.
          Votre email servira d'identifiant et votre numéro de téléphone pour les services.
          Vérifiez votre email après inscription.
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;