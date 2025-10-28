import { useEffect, useState } from 'react';

const IntroFallingPetals = () => {
  const [petals, setPetals] = useState<
    Array<{ id: number; left: number; delay: number; duration: number }>
  >([]);

  useEffect(() => {
    // Giảm số lượng petals để nhẹ nhàng hơn
    const petalArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 8, // Rơi chậm hơn
    }));
    setPetals(petalArray);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2C8 2 6 4 6 6C6 4 4 2 2 2C4 2 6 4 6 6C6 8 4 10 2 10C4 10 6 12 6 14C6 12 8 10 10 10C8 10 6 8 6 6C6 8 8 10 10 10C12 10 14 12 14 14C14 12 16 10 18 10C16 10 14 8 14 6C14 8 16 10 18 10C16 10 14 8 14 6C14 4 16 2 18 2C16 2 14 4 14 6C14 4 12 2 10 2Z"
              fill="hsl(var(--primary))"
              opacity="0.4"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default IntroFallingPetals;
