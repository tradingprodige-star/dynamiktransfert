import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  type: "snow" | "tree" | "star" | "gift" | "candy" | "bell";
  drift: number;
  rotation: number;
  rotationSpeed: number;
}

const FestiveDecorations = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = (): Particle[] => {
      const types: Particle["type"][] = ["snow", "snow", "snow", "snow", "tree", "star", "gift", "candy", "bell"];
      return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100 - 100,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        type: types[Math.floor(Math.random() * types.length)],
        drift: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
      }));
    };

    setParticles(generateParticles());

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y > 110 ? -10 : particle.y + particle.speed * 0.3,
          x: particle.x + particle.drift * 0.1,
          rotation: particle.rotation + particle.rotationSpeed,
        }))
      );
    }, 50);

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
      case "candy":
        return "🍬";
      case "bell":
        return "🔔";
      default:
        return "❄️";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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
            filter: particle.type === "snow" ? "drop-shadow(0 0 2px rgba(255,255,255,0.8))" : "none",
          }}
        >
          {getEmoji(particle.type)}
        </div>
      ))}
      
      {/* Sapins fixes aux coins */}
      <div className="fixed bottom-0 left-4 text-6xl opacity-80 animate-pulse">
        🎄
      </div>
      <div className="fixed bottom-0 right-4 text-6xl opacity-80 animate-pulse">
        🎄
      </div>
      <div className="fixed bottom-0 left-20 text-4xl opacity-60">
        🎄
      </div>
      <div className="fixed bottom-0 right-20 text-4xl opacity-60">
        🎄
      </div>
      
      {/* Guirlandes lumineuses en haut */}
      <div className="fixed top-0 left-0 right-0 h-8 flex justify-around items-center">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="text-lg animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          >
            {i % 4 === 0 ? "🔴" : i % 4 === 1 ? "🟢" : i % 4 === 2 ? "🟡" : "🔵"}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FestiveDecorations;
