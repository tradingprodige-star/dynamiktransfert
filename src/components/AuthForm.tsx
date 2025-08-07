import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string) => {
    // Validation basique pour numéro international avec indicatif pays
    const phoneRegex = /^\+\d{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string) => {
    // Nettoyer et s'assurer que le numéro commence par +
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    return '+' + cleaned;
  };

  const handleSignUp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
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
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Créer l'utilisateur dans notre table users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', formattedPhone)
        .single();

      if (existingUser) {
        toast({
          title: "Numéro déjà utilisé",
          description: "Ce numéro de téléphone est déjà enregistré",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ phone_number: formattedPhone }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès",
      });

      // Stocker les infos utilisateur localement
      localStorage.setItem('dynamik_user', JSON.stringify(data));
      onSuccess();

    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone valide avec l'indicatif pays",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', formattedPhone)
        .single();

      if (error || !data) {
        toast({
          title: "Utilisateur introuvable",
          description: "Ce numéro n'est pas enregistré",
          variant: "destructive"
        });
        return;
      }

      // Stocker les infos utilisateur localement
      localStorage.setItem('dynamik_user', JSON.stringify(data));
      
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur DYNAMIK Exchange",
      });

      onSuccess();

    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
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
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
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
            
            <Button 
              onClick={handleSignIn}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold micro-interaction"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
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
              <input
                type="password"
                placeholder="Au moins 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                placeholder="Répétez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <Button 
              onClick={handleSignUp}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold micro-interaction"
              disabled={loading}
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          En vous inscrivant, vous acceptez nos conditions d'utilisation.
          Votre numéro de téléphone servira d'identifiant unique.
          Compatible avec tous les pays.
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;