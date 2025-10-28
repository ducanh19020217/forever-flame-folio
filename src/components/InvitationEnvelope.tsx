import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { weddingConfig, WeddingSide } from "@/config/weddingConfig";
import WeddingTimelineAntd from "@/components/WeddingTimelineAntd.tsx";

interface InvitationEnvelopeProps {
    guestName: string;
    // side: WeddingSide; // "bride" | "groom" | "friends"
    onOpenAll: () => void;
}

const InvitationEnvelope = ({
                                guestName,
                                // side,
                                onOpenAll,
                            }: InvitationEnvelopeProps) => {
    const [isOpening, setIsOpening] = useState(false); // flap opening + fade out
    const [isGone, setIsGone] = useState(false); // overlay removed
    const [showBurst, setShowBurst] = useState(false); // fireworks/confetti
    const [popScale, setPopScale] = useState(false); // envelope pop

    // chọn variant theo side, fallback friends
    const variant = weddingConfig.friends;

    const displayName =
        guestName && guestName.trim() !== "" ? guestName : "Quý khách";

    const handleOpen = async () => {
        if (isOpening || isGone) return;

        // 1. phát nhạc ngay khi user click
        // ✅ Phát nhạc ngay khi click (Safari-compatible)
        const audio = document.querySelector("audio");
        if (audio) {
            try {
                await audio.play();
            } catch {
                // ignore autoplay restriction, user gesture will unlock
            }
        }

        // 2. trigger animation
        setIsOpening(true);
        setPopScale(true);
        setShowBurst(true);

        // 3. kết thúc overlay
        setTimeout(() => {
            setIsGone(true);
            onOpenAll();
        }, 900);
    };

    return (
        <>
            {!isGone && (
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden transition-opacity duration-300 ${
                        isOpening ? "opacity-0" : "opacity-100"
                    }`}
                >
                    {/* Nền gradient lãng mạn */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,240,245,1)_0%,rgba(255,225,232,1)_40%,rgba(255,210,220,1)_70%,rgba(240,190,200,1)_100%)]" />

                    {/* Lớp grain (giấy) */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-multiply bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(0,0,0,0.4)_0px,rgba(0,0,0,0.4)_1px,transparent_1px,transparent_4px)]" />

                    {/* Tim + hoa rơi ngẫu nhiên */}
                    <FloatingRainLayer />

                    {/* Glow góc giả hoa */}
                    <CornerFlowers />

                    {/* Bùng pháo + confetti khi mở */}
                    {showBurst && (
                        <>
                            <BurstFireworks />
                            <ConfettiBurst />
                        </>
                    )}

                    {/* Khối phong bì */}
                    <div
                        className={`relative w-full max-w-md md:max-w-lg flex flex-col items-center transition-transform duration-[400ms] ${
                            popScale ? "scale-[1.07]" : "scale-100"
                        }`}
                    >
                        <div className="relative perspective-[1200px]">
                            {/* Thân phong bì */}
                            <div
                                className={`
                  relative
                  bg-[linear-gradient(145deg,#fffdfa,#fff7f8)]
                  rounded-xl
                  shadow-[0_24px_48px_rgba(0,0,0,0.22)]
                  border border-[rgba(217,181,184,0.6)]
                  pt-24 px-6 pb-8
                  text-center
                  transition-all duration-[400ms]
                `}
                                style={{
                                    minHeight: "440px",
                                }}
                            >
                                {/* Viền kép bên trong */}
                                <div
                                    className="pointer-events-none absolute inset-[8px] rounded-[10px] border border-[rgba(217,181,184,0.4)]"
                                    style={{
                                        boxShadow:
                                            "inset 0 0 4px rgba(217,181,184,0.4), 0 0 2px rgba(255,255,255,0.6)",
                                    }}
                                />

                                {/* Nắp phong bì */}
                                <div
                                    className={`
                    absolute -top-[88px] left-0 right-0 h-[120px]
                    origin-top
                    transition-transform duration-[400ms]
                    [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_60%,0%_100%)]
                    bg-[linear-gradient(160deg,rgba(255,245,245,1)_0%,rgba(255,232,236,1)_60%,rgba(250,220,225,1)_100%)]
                    border border-[rgba(217,181,184,0.6)]
                    rounded-t-[12px]
                    flex items-start justify-center
                    ${
                                        isOpening
                                            ? "rotate-x-[-130deg] shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
                                            : "shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
                                    }
                  `}
                                    style={{
                                        transformOrigin: "top center",
                                        boxShadow:
                                            "0 16px 28px rgba(0,0,0,0.28), inset 0 0 6px rgba(255,255,255,0.65)",
                                    }}
                                >
                                    {/* Con dấu sáp */}
                                    <div
                                        className={`
                      relative mt-4 w-16 h-16 rounded-full
                      bg-[radial-gradient(circle_at_30%_30%,#c46a75_0%,#a84d59_60%,#8a2f3b_100%)]
                      text-white flex flex-col items-center justify-center
                      shadow-[0_10px_20px_rgba(0,0,0,0.5)]
                      border border-[rgba(255,255,255,0.4)]
                    `}
                                        style={{
                                            boxShadow:
                                                "0 10px 20px rgba(0,0,0,0.5), inset 0 0 5px rgba(255,255,255,0.65)",
                                        }}
                                    >
                    <span className="text-[11px] leading-none font-semibold tracking-wide">
                      ĐA ♡ HP
                    </span>
                                        <span className="text-[9px] leading-none font-light">
                      07·12·2025
                    </span>
                                        <div className="absolute inset-0 rounded-full border border-[rgba(0,0,0,0.3)] opacity-30 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Hình cô dâu chú rể cách điệu */}
                                <BrideGroomSketch color={variant.themeColor} />

                                {/* Lời mời động theo role */}
                                <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-[rgba(120,80,90,0.7)] font-light text-center">
                                    {variant.inviteHeading}
                                </p>

                                <h1
                                    className="mt-3 text-[28px] md:text-[32px] font-semibold normal-case leading-tight px-4 text-center"
                                    style={{ color: variant.themeColor }}
                                >
                                    {displayName}
                                </h1>

                                <p className="mt-4 text-[13px] text-[rgba(80,50,60,0.8)] leading-relaxed text-center">
                                    {variant.inviteIntro}
                                </p>

                                <div
                                    className="mt-4 flex flex-col items-center"
                                    style={{ color: variant.themeColor }}
                                >
                                    <p className="font-script text-[28px] leading-none">
                                        {variant.groomName}
                                    </p>
                                    <Heart
                                        className="w-5 h-5 my-2"
                                        fill="currentColor"
                                        style={{ color: variant.themeColor }}
                                    />
                                    <p className="font-script text-[28px] leading-none">
                                        {variant.brideName}
                                    </p>
                                </div>

                                {/* Timeline rút gọn trong ngày (08:00 / 10:00 / 11:00) */}
                                <WeddingTimelineAntd variant={variant} />

                                {/* Nút mở thư */}
                                <div className="relative inline-block">
                                    <button
                                        onClick={handleOpen}
                                        className="mt-8 px-8 py-4 rounded-full text-base font-medium tracking-wide text-white
               bg-[linear-gradient(145deg,#b44a5c_0%,#7a2b38_100%)]
               shadow-[0_16px_32px_rgba(0,0,0,0.5)]
               active:scale-[0.98]
               transition-transform duration-200
               relative overflow-hidden"
                                        style={{
                                            boxShadow: "0 16px 32px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4) inset",
                                        }}
                                    >
                                        <span className="relative z-10">Mở thư &amp; Bắt đầu ✉</span>

                                        {/* 🌸 Viền sáng xoay nhẹ */}
                                        <span className="absolute inset-0 rounded-full border-[2px] border-transparent
                     bg-[conic-gradient(from_0deg,rgba(255,192,203,0.8),transparent,rgba(255,192,203,0.8))]
                     animate-spin-slow opacity-60" />
                                    </button>

                                    {/* CSS animation */}
                                    <style jsx>{`
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
  `}</style>
                                </div>

                                <p className="mt-3 text-[10px] text-[rgba(80,50,60,0.5)] text-center">
                                    (Âm nhạc sẽ phát ngay khi bạn mở thư)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* keyframes & font */}
                    <style>{`
            .rotate-x-\\[-130deg\\] {
              transform: rotateX(-130deg);
            }

            @font-face {
              font-family: 'Script';
              src: local('Brush Script MT'), local('Lucida Handwriting'), local('Apple Chancery'), local('Segoe Script');
            }
            .font-script {
              font-family: 'Script', 'Playfair Display', cursive, serif;
            }
          `}</style>

                    {/* hiệu ứng pháo / rơi riêng */}
                    {showBurst && <style>{globalBurstKeyframes}</style>}
                </div>
            )}
        </>
    );
};

/* ---------------- FloatingRainLayer ----------------
   Tim + hoa rơi tự nhiên với randomness (mỗi render cố định nhờ useMemo)
--------------------------------------------------- */
const FloatingRainLayer = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 18 }).map((_, i) => {
            const isHeart = Math.random() < 0.4;
            const char = isHeart ? "❤" : "❀";

            const startX = Math.random() * 100; // %
            const delay = (Math.random() * 4).toFixed(2); // 0-4s
            const duration = (5 + Math.random() * 4).toFixed(2); // 5-9s
            const size = 14 + Math.floor(Math.random() * 10); // px
            const sway = (5 + Math.random() * 15).toFixed(1); // px

            return {
                id: i,
                char,
                startX,
                delay,
                duration,
                size,
                sway,
                color: isHeart
                    ? "rgba(220,40,70,0.32)"
                    : "rgba(200,90,110,0.28)",
            };
        });
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute will-change-transform"
                    style={{
                        left: `${p.startX}%`,
                        top: "-10vh",
                        color: p.color,
                        fontSize: `${p.size}px`,
                        textShadow:
                            "0 2px 4px rgba(0,0,0,0.2), 0 0 6px rgba(255,255,255,0.4)",
                        animation: `fallAnim-${p.id} ${p.duration}s linear ${p.delay}s infinite`,
                    }}
                >
                    {p.char}
                    <style>{`
            @keyframes fallAnim-${p.id} {
              0%   { transform: translate3d(0,0,0) rotate(0deg); opacity: 1; }
              50%  { transform: translate3d(${p.sway}px,50vh,0) rotate(20deg); opacity: 1; }
              100% { transform: translate3d(${
                        -p.sway
                    }px,110vh,0) rotate(40deg); opacity: 0; }
            }
          `}</style>
                </div>
            ))}
        </div>
    );
};

/* ---------------- CornerFlowers ----------------
   Glow blobs giả cụm hoa ở các góc
------------------------------------------------- */
const CornerFlowers = () => {
    return (
        <>
            <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-70 blur-xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,210,0.9)_0%,rgba(255,170,185,0.4)_60%,transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-16 -right-12 w-48 h-48 rounded-full opacity-70 blur-xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,180,195,0.8)_0%,rgba(200,80,100,0.35)_60%,transparent_70%)]" />
            <div className="pointer-events-none absolute top-6 right-10 w-24 h-24 rounded-full opacity-50 blur-xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,230,235,0.9)_0%,rgba(255,200,210,0.4)_60%,transparent_70%)]" />
        </>
    );
};

/* ---------------- BurstFireworks ----------------
   Vòng sáng + tia sáng bùng ra (ánh trắng/hồng)
------------------------------------------------- */
const BurstFireworks = () => {
    // 2 vòng spark
    const sparks: Array<{
        x: number;
        y: number;
        size: number;
        delay: number;
    }> = [];
    const rings = [
        { count: 12, radius: 80 },
        { count: 8, radius: 40 },
    ];
    rings.forEach((ring, rIndex) => {
        for (let i = 0; i < ring.count; i++) {
            const angleDeg = (360 / ring.count) * i;
            const angleRad = (angleDeg * Math.PI) / 180;
            sparks.push({
                x: Math.cos(angleRad) * ring.radius,
                y: Math.sin(angleRad) * ring.radius,
                size: rIndex === 0 ? 6 : 4,
                delay: rIndex * 0.05 + i * 0.01,
            });
        }
    });

    // tia sáng (như pháo hoa flash)
    const rays = Array.from({ length: 10 }).map((_, i) => {
        const angle = (360 / 10) * i;
        return { angle, delay: i * 0.02 };
    });

    return (
        <div className="pointer-events-none absolute inset-0 overflow-visible">
            {/* spark dots */}
            {sparks.map((sp, i) => (
                <div
                    key={`spark-${i}`}
                    className="absolute left-1/2 top-1/2 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    style={{
                        width: sp.size,
                        height: sp.size,
                        transform: `translate(calc(-50% + ${sp.x}px), calc(-50% + ${sp.y}px)) scale(0.3)`,
                        animation: `spark-pop-${i} 700ms ease-out ${sp.delay}s forwards`,
                        boxShadow:
                            "0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,200,220,0.8)",
                    }}
                >
                    <style>{`
            @keyframes spark-pop-${i} {
              0%   { opacity: 1; transform: scale(0.3); }
              60%  { opacity: 1; transform: scale(1); }
              100% { opacity: 0; transform: scale(1.2); }
            }
          `}</style>
                </div>
            ))}

            {/* rays */}
            {rays.map((r, i) => (
                <div
                    key={`ray-${i}`}
                    className="absolute left-1/2 top-1/2 origin-left"
                    style={{
                        width: "60px",
                        height: "2px",
                        background:
                            "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
                        transform: `translate(-50%, -50%) rotate(${r.angle}deg) scaleX(0.2)`,
                        filter:
                            "drop-shadow(0 0 4px rgba(255,255,255,0.8)) drop-shadow(0 0 6px rgba(255,200,220,0.6))",
                        animation: `ray-pop-${i} 700ms ease-out ${r.delay}s forwards`,
                    }}
                >
                    <style>{`
            @keyframes ray-pop-${i} {
              0%   { opacity: 1; transform: scaleX(0.2); }
              60%  { opacity: 1; transform: scaleX(1); }
              100% { opacity: 0; transform: scaleX(1.1); }
            }
          `}</style>
                </div>
            ))}
        </div>
    );
};

/* ---------------- ConfettiBurst ----------------
   Mảnh giấy / pháo dây bắn tung ra rồi rơi
------------------------------------------------- */
const ConfettiBurst = () => {
    const pieces = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => {
            const angleBase =
                (Math.random() * 60 - 30) + (i % 2 === 0 ? -50 : 50); // quăng trái/phải
            const dist = 80 + Math.random() * 60; // px
            const rad = (angleBase * Math.PI) / 180;
            const x = Math.cos(rad) * dist;
            const y = Math.sin(rad) * dist;

            const rotateStart = Math.floor(Math.random() * 180);
            const rotateEnd = rotateStart + 180 + Math.random() * 180;

            const palette = [
                "rgba(200,60,90,0.9)",
                "rgba(255,210,220,0.9)",
                "rgba(255,235,240,0.9)",
                "rgba(160,40,60,0.9)",
            ];
            const color = palette[Math.floor(Math.random() * palette.length)];

            const w = 6 + Math.random() * 6;
            const h = 10 + Math.random() * 8;

            return {
                id: i,
                x,
                y,
                w,
                h,
                color,
                rotateStart,
                rotateEnd,
            };
        });
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-visible">
            {pieces.map((p) => (
                <div
                    key={p.id}
                    className="absolute left-1/2 top-1/2 rounded-[2px] will-change-transform shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    style={{
                        width: `${p.w}px`,
                        height: `${p.h}px`,
                        backgroundColor: p.color,
                        transform: `translate(-50%, -50%)`,
                        animation: `confetti-${p.id} 900ms ease-out forwards`,
                    }}
                >
                    <style>{`
            @keyframes confetti-${p.id} {
              0% {
                opacity: 1;
                transform: translate(-50%, -50%) rotate(${p.rotateStart}deg);
              }
              80% {
                opacity: 1;
                transform: translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px)) rotate(${p.rotateEnd}deg);
              }
              100% {
                opacity: 0;
                transform: translate(calc(-50% + ${p.x}px), calc(-50% + ${
                        p.y + 40
                    }px)) rotate(${p.rotateEnd + 60}deg);
              }
            }
          `}</style>
                </div>
            ))}
        </div>
    );
};

/* ---------------- BrideGroomSketch ----------------
   Line-art cô dâu chú rể, nhận màu để hợp theme theo side
------------------------------------------------- */
const BrideGroomSketch = ({ color }: { color: string }) => {
    return (
        <div className="w-24 h-24 mx-auto mt-2" style={{ color }}>
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* groom */}
                <path d="M30 70 C28 55 32 45 40 40 C45 37 45 30 40 28 C38 27 37 24 38 22 C40 18 46 18 48 22 C49 17 55 17 57 22 C58 24 57 27 55 28 C50 30 50 37 55 40 C63 45 67 55 65 70 Z" />
                <path d="M47 40 L50 48 L53 40 L50 37 Z" />
                {/* bride */}
                <path d="M70 70 C72 55 68 45 60 42 C58 41 57 38 58 36 C60 32 63 31 64 28 C66 23 62 18 58 20 C59 18 58 16 55 16 C52 16 51 18 50 20" />
                <path d="M60 42 C70 48 75 60 78 72 C70 74 60 75 50 74 C40 75 30 74 22 72 C25 60 30 48 40 42" />
                {/* heart between */}
                <path d="M48 56 C48 53 51 52 52.5 54 C54 52 57 53 57 56 C57 58 55 60 52.5 62 C50 60 48 58 48 56 Z" />
                {/* veil flow */}
                <path d="M62 28 C68 30 70 36 72 42 C74 47 76 50 80 51" />
                <path d="M38 22 C32 24 30 30 28 36 C26 41 24 44 20 45" />
            </svg>
        </div>
    );
};

/* ---------------- globalBurstKeyframes ----------------
   Một số keyframes dùng nhiều nơi (để chắc chắn trình duyệt có)
------------------------------------------------- */
const globalBurstKeyframes = `
@font-face {
  font-family: 'Script';
  src: local('Brush Script MT'), local('Lucida Handwriting'), local('Apple Chancery'), local('Segoe Script');
}
.font-script {
  font-family: 'Script', 'Playfair Display', cursive, serif;
}
.rotate-x-\\[-130deg\\] {
  transform: rotateX(-130deg);
}
`;

export default InvitationEnvelope;
