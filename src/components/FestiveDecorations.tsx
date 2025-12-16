import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  type: "snow" | "tree" | "star" | "gift";
  drift: number;
  rotation: number;
  rotationSpeed: number;
}

const FestiveDecorations = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = (): Particle[] => {
      // Réduction de la densité - moins de particules et principalement de la neige
      const types: Particle["type"][] = ["snow", "snow", "snow", "star", "gift"];
      return Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100 - 100,
        size: Math.random() * 15 + 8,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        type: types[Math.floor(Math.random() * types.length)],
        drift: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      }));
    };

    setParticles(generateParticles());

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y > 110 ? -10 : particle.y + particle.speed * 0.25,
          x: particle.x + particle.drift * 0.08,
          rotation: particle.rotation + particle.rotationSpeed,
        }))
      );
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const getEmoji = (type: Particle["type"]) => {
    switch (type) {
      case "snow":
        return "❄️";
      case "tree":
        return "🎄";
      case "star":
        return "⭐";
      case "gift":
        return "🎁";
      default:
        return "❄️";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            filter: particle.type === "snow" ? "drop-shadow(0 0 2px rgba(255,255,255,0.6))" : "none",
          }}
        >
          {getEmoji(particle.type)}
        </div>
      ))}
      
      {/* Sapins discrets aux coins */}
      <div className="fixed bottom-0 left-4 text-4xl opacity-50">
        🎄
      </div>
      <div className="fixed bottom-0 right-4 text-4xl opacity-50">
        🎄
      </div>
    </div>
  );
};

export default FestiveDecorations;