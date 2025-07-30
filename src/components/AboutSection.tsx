import foundersPortrait from "@/assets/founders-portrait.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            À propos de <span className="text-primary">DYNAMIK Exchange</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Portrait des fondateurs */}
            <div className="order-2 lg:order-1">
              <img 
                src={foundersPortrait} 
                alt="Fondateurs DYNAMIK Exchange"
                className="rounded-2xl shadow-card w-full h-auto"
              />
            </div>

            {/* Histoire */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Notre Histoire</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Tout a commencé en 2020 avec DYNAMIK SHOP, une plateforme e-commerce qui nous a permis 
                de comprendre les défis des paiements transfrontaliers en Afrique centrale.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Face aux frais exorbitants et aux délais interminables des solutions traditionnelles, 
                nous avons décidé de créer DYNAMIK Exchange en 2025 : une solution simple, rapide et abordable 
                pour tous.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-12 text-foreground">Notre Évolution</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  2020
                </div>
                <h4 className="font-bold text-lg mb-2">DYNAMIK SHOP</h4>
                <p className="text-muted-foreground">Lancement de notre plateforme e-commerce</p>
              </div>
              
              <div className="hidden md:block w-16 h-1 bg-gradient-primary rounded-full" />
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  2025
                </div>
                <h4 className="font-bold text-lg mb-2">DYNAMIK Exchange</h4>
                <p className="text-muted-foreground">Révolution des transferts d'argent</p>
              </div>
            </div>
          </div>

          {/* Mission et Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-8 rounded-2xl bg-background border border-border">
              <h4 className="text-xl font-bold mb-4 text-primary">Notre Mission</h4>
              <p className="text-muted-foreground">
                Démocratiser les transferts d'argent en Afrique centrale en offrant 
                une solution accessible, transparente et économique.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-background border border-border">
              <h4 className="text-xl font-bold mb-4 text-accent">Notre Vision</h4>
              <p className="text-muted-foreground">
                Devenir la référence des échanges financiers au Gabon, Togo et 
                dans toute la zone CEMAC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;