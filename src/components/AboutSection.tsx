const AboutSection = () => {
  const openInstagram = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground animate-fade-in">
            À propos de <span className="text-primary">DYNAMIK Transfert</span>
          </h2>
          
          {/* Storytelling */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  En 2020, le monde était figé par la crise du Covid.
                  Mais pendant que la planète tournait au ralenti, deux jeunes amis de Lomé 
                  décidaient de créer leur propre dynamique :
                </p>
                
                <p>
                  💼 Une petite boutique de vente de vêtements en ligne, qu'ils baptisent 
                  <span className="font-bold text-accent"> DYNAMIK SHOP</span>.
                </p>
                
                <p>
                  Contre toute attente, le concept séduit. Les commandes affluent. Les amis se découvrent 
                  un vrai potentiel entrepreneurial. Le feu est lancé.
                </p>
                
                <div className="my-8">
                  <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
                </div>
                
                <p className="text-xl font-semibold">
                  💥 5 ans plus tard, ils reviennent avec un projet 10 fois plus grand.
                </p>
                
                <p>
                  Toujours unis. Toujours connectés. Toujours déterminés.
                </p>
                
                <p>
                  Cette fois, <span className="font-bold text-primary">DYNAMIK Transfert</span> n'est pas une boutique.
                  C'est une infrastructure complète pour :
                </p>
                
                <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto">
                  <li>Envoyer de l'argent en ligne en moins de 10 minutes</li>
                  <li>Acheter et revendre du USDT partout dans le monde</li>
                  <li>Et surtout, démocratiser l'accès à la finance en Afrique</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fondateurs */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-12 text-foreground">
              👬 Corneille & Prodige
            </h3>
            <p className="text-center text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Plus que des amis. Des frères de vision.
              Ils ont grandi ensemble. Travaillé ensemble. Rêvé ensemble.
              Aujourd'hui, ils vous invitent à entrer dans leur dynamique.
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Corneille */}
              <div className="text-center group hover-scale">
                <div className="w-32 h-32 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-glow">
                  CK
                </div>
                <h4 className="text-xl font-bold mb-2 text-foreground">Corneille Kokou D'Almeida</h4>
                <p className="text-accent font-semibold mb-2">Co-Fondateur & Développeur</p>
                <p className="text-sm text-muted-foreground mb-3">Français</p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Jeune entrepreneur français, co-fondateur de DYNAMIKSHOP et aujourd'hui 
                  développeur et co-fondateur de DYNAMIK Transfert. Vision technologique et innovation.
                </p>
                <button
                  onClick={() => openInstagram('https://www.instagram.com/corneille_dald?igsh=Y2UyNnE3a3EyeHN3')}
                  className="text-primary hover:text-accent transition-colors text-sm font-medium"
                >
                  Suivre sur Instagram →
                </button>
              </div>

              {/* Prodige */}
              <div className="text-center group hover-scale">
                <div className="w-32 h-32 rounded-full bg-gradient-accent mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-glow">
                  PK
                </div>
                <h4 className="text-xl font-bold mb-2 text-foreground">Prodige K. ADJOTE</h4>
                <p className="text-accent font-semibold mb-2">Business Developer & Analyste Boursier</p>
                <p className="text-sm text-muted-foreground mb-3">Togolais</p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Co-fondateur de DYNAMIK SHOP et DYNAMIK Transfert. Entrepreneur committed to Blockchain /web3 and financial Market.
                </p>
                <button
                  onClick={() => openInstagram('https://www.instagram.com/le_prodigieu?igsh=MXE1eTV4bXY3eTMxdw%3D%3D&utm_source=qr')}
                  className="text-primary hover:text-accent transition-colors text-sm font-medium"
                >
                  Suivre sur Instagram →
                </button>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-lg font-semibold text-primary">
                Bienvenue dans DYNAMIK Transfert.
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
                <h4 className="font-bold text-lg mb-2">DYNAMIK Transfert</h4>
                <p className="text-muted-foreground">Révolution des transferts d'argent</p>
              </div>
            </div>
          </div>

          {/* Mission et Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-8 rounded-2xl bg-background border border-border">
              <h4 className="text-xl font-bold mb-4 text-primary">Notre Mission</h4>
              <p className="text-muted-foreground">
                Démocratiser les transferts d'argent en Afrique plus précisément entre l'Afrique de l'Ouest 
                Et L'Afrique centrale en offrant une solution accessible, transparente et économique.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-background border border-border">
              <h4 className="text-xl font-bold mb-4 text-accent">Notre Vision</h4>
              <p className="text-muted-foreground">
                Devenir la référence des échanges financiers entre le Gabon, Togo et 
                dans toute la zone BECEAO.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;