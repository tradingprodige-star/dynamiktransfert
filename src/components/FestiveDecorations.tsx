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
      // Mix équilibré de décorations festives
      const types: Particle["type"][] = ["snow", "snow", "snow", "snow", "star", "gift", "tree"];
      return Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100 - 100,
        size: Math.random() * 14 + 10,
        speed: Math.random() * 1.2 + 0.4,
        opacity: Math.random() * 0.6 + 0.25,
        type: types[Math.floor(Math.random() * types.length)],
        drift: (Math.random() - 0.5) * 1.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
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
      
      {/* Sapins et décorations aux coins */}
      <div className="fixed bottom-0 left-4 text-4xl opacity-60 animate-pulse">
        🎄
      </div>
      <div className="fixed bottom-0 right-4 text-4xl opacity-60 animate-pulse">
        🎄
      </div>
      
      {/* Guirlandes en haut */}
      <div className="fixed top-2 left-1/4 text-2xl opacity-50">
        ✨🎀✨
      </div>
      <div className="fixed top-2 right-1/4 text-2xl opacity-50">
        ✨🎀✨
      </div>
    </div>
  );
};

export default FestiveDecorations;