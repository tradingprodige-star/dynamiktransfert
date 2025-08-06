import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PromoCodeManager from "@/components/PromoCodeManager";
import { Button } from "@/components/ui/button";

const PromoManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem('dynamik_user');
    if (!userData) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('dynamik_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Gestion des codes promo
              </h1>
              <p className="text-muted-foreground">
                Utilisez vos codes promo pour bénéficier de réductions exclusives
              </p>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
          
          <PromoCodeManager />
        </div>
      </div>
    </div>
  );
};

export default PromoManager;