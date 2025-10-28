import { useEffect, useState } from 'react';

const FallingPetals = () => {
    const [petals, setPetals] = useState<
        Array<{ id: number; left: number; delay: number; duration: number; type: 'petal' | 'heart' | 'flower' }>
    >([]);

    useEffect(() => {
        const shapes: Array<'petal' | 'heart' | 'flower'> = ['petal', 'heart', 'flower'];
        const petalArray = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 10 + Math.random() * 10,
            type: shapes[Math.floor(Math.random() * shapes.length)],
        }));
        setPetals(petalArray);
    }, []);

    // 🎨 SVG từng loại
    const renderShape = (type: 'petal' | 'heart' | 'flower') => {
        switch (type) {
            case 'heart':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12.1 21.35l-1.1-1.02C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.99 11.84l-1.11 1.01z"
                            fill="#ff6b6b"
                            opacity="0.8"
                        />
                    </svg>
                );
            case 'flower':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="3" fill="#ffd166" />
                        <path
                            d="M12 2c-1.5 0-3 2-3 4s1.5 4 3 4 3-2 3-4-1.5-4-3-4zm0 12c-1.5 0-3 2-3 4s1.5 4 3 4 3-2 3-4-1.5-4-3-4zM2 12c0-1.5 2-3 4-3s4 1.5 4 3-2 3-4 3-4-1.5-4-3zm12 0c0-1.5 2-3 4-3s4 1.5 4 3-2 3-4 3-4-1.5-4-3z"
                            fill="#ff8fa3"
                            opacity="0.9"
                        />
                    </svg>
                );
            default:
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M10 2C8 2 6 4 6 6C6 4 4 2 2 2C4 2 6 4 6 6C6 8 4 10 2 10C4 10 6 12 6 14C6 12 8 10 10 10C8 10 6 8 6 6C6 8 8 10 10 10C12 10 14 12 14 14C14 12 16 10 18 10C16 10 14 8 14 6C14 8 16 10 18 10C16 10 14 8 14 6C14 4 16 2 18 2C16 2 14 4 14 6C14 4 12 2 10 2Z"
                            fill="hsl(var(--primary))"
                            opacity="0.7"
                        />
                    </svg>
                );
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
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
                    {renderShape(petal.type)}
                </div>
            ))}
        </div>
    );
};

export default FallingPetals;
