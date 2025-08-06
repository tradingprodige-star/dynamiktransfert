import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const userData = localStorage.getItem('dynamik_user');
    if (userData) {
      navigate('/');
    }
  }, [navigate]);

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Accès à votre compte
            </h1>
            <p className="text-muted-foreground">
              Connectez-vous ou créez votre compte pour utiliser les codes promo
            </p>
          </div>
          
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Auth;