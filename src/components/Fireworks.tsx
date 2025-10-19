import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

type FireworksProps = {
    show: boolean;
    durationMs?: number;          // tổng thời gian overlay tồn tại
    colors?: string[];
    onEnd?: () => void;
    piecesPerBurst?: number;      // số mảnh mỗi phát
};

const DEFAULT_COLORS = ['#ff6b6b','#ffd166','#06d6a0','#4d96ff','#c77dff','#fff'];

export default function Fireworks({
                                      show,
                                      durationMs = 1200,
                                      colors = DEFAULT_COLORS,
                                      onEnd,
                                      piecesPerBurst = 14,
                                  }: FireworksProps) {
    const closedRef = useRef(false);

    // tạo 1 phát nổ: vị trí, góc, màu, kích thước… (cực nhẹ)
    const burst = useMemo(() => {
        if (!show) return null;
        const x = 10 + Math.random() * 80;   // %
        const y = 10 + Math.random() * 25;   // vh
        const sizeBase = 6 + Math.random() * 4;

        const items = Array.from({ length: piecesPerBurst }, (_, i) => {
            const angle = (360 / piecesPerBurst) * i + (Math.random() * 10 - 5); // tỏa đều + nhiễu nhẹ
            return {
                id: i,
                angle,
                dist: 80 + Math.random() * 80,   // px
                delay: i * 0.012,                // fan-out nhẹ
                size: sizeBase * (0.9 + Math.random() * 0.3),
                color: colors[i % colors.length],
            };
        });

        return { x, y, items };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // mỗi lần show=true sẽ sinh 1 burst mới

    useEffect(() => {
        if (!show) return;
        closedRef.current = false;
        const t = setTimeout(() => {
            if (!closedRef.current) onEnd?.();
        }, durationMs);
        return () => {
            closedRef.current = true;
            clearTimeout(t);
        };
    }, [show, durationMs, onEnd]);

    if (!show || !burst) return null;

    // Portal để nằm top-level, z-index thắng mọi thứ
    return createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 2147483647,
                opacity: 1,
                transition: 'opacity 180ms ease',
            }}
        >
            {burst.items.map(p => (
                <div
                    key={p.id}
                    className="fw-spark"
                    style={{
                        left: `${burst.x}%`,
                        top: `${burst.y}vh`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.color,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${durationMs / 1000}s`,
                        // @ts-ignore — truyền biến cho CSS
                        '--angle': `${p.angle}deg`,
                        '--dist': `${p.dist}px`,
                    } as React.CSSProperties}
                />
            ))}
        </div>,
        document.body
    );
}
