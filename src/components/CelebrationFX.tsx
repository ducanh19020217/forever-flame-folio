import { useEffect, useState } from "react";

const CelebrationFX = () => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Giảm số lượng sparkles xuống còn 6 để tinh tế hơn
    const sparkleArray = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60, // Tập trung quanh giữa màn hình
      y: 20 + Math.random() * 60,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2, // Chậm hơn
    }));
    setSparkles(sparkleArray);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Sparkle particles - tinh tế, không nhấp nháy */}
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
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        </div>
      ))}

      <style>{`
        @keyframes sparkle-fade {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8) translateY(0);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2) translateY(-5px);
          }
        }

        .sparkle {
          animation: sparkle-fade infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CelebrationFX;
