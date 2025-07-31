const AboutSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground animate-fade-in">
            À propos de <span className="text-primary">DYNAMIK Exchange</span>
          </h2>
          
          {/* Description principale */}
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed">
              DYNAMIK Exchange facilite les transferts d'argent entre l'Afrique de l'Ouest et l'Afrique centrale. 
              Des frais réduits, des délais rapides, une solution moderne pour vos besoins financiers.
            </p>
            <div className="bg-gradient-primary text-white p-6 rounded-2xl shadow-card">
              <h3 className="text-lg font-bold mb-2">💰 Services USDT</h3>
              <p className="text-sm opacity-90">
                Nous rachetons et vendons vos USDT dans toutes les zones BECEAO et CEMAC. 
                Taux du jour mis à jour quotidiennement sur notre site.
              </p>
            </div>
          </div>

          {/* Fondateurs */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-12 text-foreground">Nos Co-Fondateurs</h3>
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Corneille */}
              <div className="text-center group hover-scale">
                <div className="w-32 h-32 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-glow">
                  CK
                </div>
                <h4 className="text-xl font-bold mb-2 text-foreground">Corneille Kokou D'Almeida</h4>
                <p className="text-accent font-semibold mb-3">Co-Fondateur & Développeur</p>
                <p className="text-muted-foreground leading-relaxed">
                  Jeune entrepreneur togolais-français, co-fondateur de DYNAMIKSHOP et aujourd'hui 
                  développeur et co-fondateur de DYNAMIK Exchange. Vision technologique et innovation.
                </p>
              </div>

              {/* Prodige */}
              <div className="text-center group hover-scale">
                <div className="w-32 h-32 rounded-full bg-gradient-accent mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-glow">
                  PK
                </div>
                <h4 className="text-xl font-bold mb-2 text-foreground">Prodige K. ADJOTE</h4>
                <p className="text-accent font-semibold mb-3">Business Developer & Analyste Boursier</p>
                <p className="text-muted-foreground leading-relaxed">
                  Co-fondateur de DYNAMIK SHOP et DYNAMIK Exchange. Expert en développement commercial 
                  et analyse boursière, architecte de la stratégie business.
                </p>
              </div>
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