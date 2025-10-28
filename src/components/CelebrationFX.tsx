import { useEffect, useState } from "react";

const CelebrationFX = () => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const sparkleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));
    setSparkles(sparkleArray);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Sparkle particles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ffd700] via-[#ffc0cb] to-[#fff]" />
        </div>
      ))}

      {/* Rotating glow rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rays-container">
        <div className="absolute inset-0 ray ray-1"></div>
        <div className="absolute inset-0 ray ray-2"></div>
        <div className="absolute inset-0 ray ray-3"></div>
      </div>

      <style>{`
        @keyframes sparkle-fade {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
        }

        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .sparkle {
          animation: sparkle-fade infinite ease-in-out;
        }

        .rays-container {
          animation: rotate-slow 30s linear infinite;
          opacity: 0.15;
        }

        .ray {
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255, 192, 203, 0.4) 10deg,
            transparent 20deg,
            transparent 340deg,
            rgba(255, 192, 203, 0.4) 350deg,
            transparent 360deg
          );
        }

        .ray-2 {
          transform: rotate(120deg);
        }

        .ray-3 {
          transform: rotate(240deg);
        }
      `}</style>
    </div>
  );
};

export default CelebrationFX;
