import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    const phoneRegex = /^(\+228|228|00228)?[7-9]\d{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('+228')) return cleaned;
    if (cleaned.startsWith('228')) return '+' + cleaned;
    if (cleaned.startsWith('00228')) return '+' + cleaned.substring(2);
    return '+228' + cleaned;
  };

  const handleSignUp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone togolais valide",
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
        description: "Veuillez entrer un numéro de téléphone togolais valide",
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Accès DYNAMIK</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
              <Input
                type="tel"
                placeholder="+228 XX XX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12"
              />
            </div>
            
            <Button 
              onClick={handleSignIn}
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
              <Input
                type="tel"
                placeholder="+228 XX XX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <Input
                type="password"
                placeholder="Au moins 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
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
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          En vous inscrivant, vous acceptez nos conditions d'utilisation.
          Votre numéro de téléphone servira d'identifiant unique.
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;