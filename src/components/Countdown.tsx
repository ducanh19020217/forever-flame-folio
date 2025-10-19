import { useEffect, useMemo, useRef, useState, memo } from "react";
import { Heart } from "lucide-react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

type CountdownProps = { weddingDate?: string };

const computeTimeLeft = (targetISO: string): TimeLeft => {
    const diff = new Date(targetISO).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds };
};

/**
 * DigitRoller: trượt số cũ -> số mới theo trục Y (chỉ transform => cực mượt)
 * - Cố định chiều cao bằng cap container
 * - Dùng tabular-nums để không “giật” chiều rộng
 */
const DigitRoller = memo(function DigitRoller({ value }: { value: number }) {
    const [prev, setPrev] = useState(value);
    const [cur, setCur] = useState(value);
    const animRef = useRef<number | null>(null);

    useEffect(() => {
        if (value === cur) return;
        setPrev(cur);
        // Bắt đầu frame sau để đảm bảo transition ăn
        animRef.current = requestAnimationFrame(() => {
            setCur(value);
        });
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [value, cur]);

    return (
        <div
            className="relative h-[72px] md:h-[88px] w-[ch] overflow-hidden tabular-nums"
            style={{ width: "100px" }} // luôn 2 chữ số
            aria-live="polite"
        >
            <div
                className="absolute inset-0 will-change-transform transition-transform duration-300 ease-out"
                style={{
                    transform:
                        prev === cur ? "translateY(0%)" : "translateY(-100%)",
                }}
            >
                {/* current (trên) */}
                <div className="h-[72px] md:h-[88px] flex items-center justify-center">
                    <span className="text-5xl md:text-6xl font-bold">{String(cur).padStart(2, "0")}</span>
                </div>
                {/* previous (dưới) */}
                <div className="h-[72px] md:h-[88px] flex items-center justify-center">
          <span className="text-5xl md:text-6xl font-bold opacity-70">
            {String(prev).padStart(2, "0")}
          </span>
                </div>
            </div>
        </div>
    );
});

/**
 * TimeBlock: chỉ re-render khi value đổi (memo)
 * Không dùng animate-* lặp lại gây restart keyframe mỗi giây
 */
const TimeBlock = memo(function TimeBlock({
                                              value,
                                              label,
                                          }: {
    value: number;
    label: string;
}) {
    return (
        <div className="flex flex-col items-center">
            <div className="bg-card rounded-2xl shadow-md p-5 md:p-6 mb-3 min-w-[110px] flex items-center justify-center">
                <DigitRoller value={value} />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider select-none">
        {label}
      </span>
        </div>
    );
}, (prev, next) => prev.value === next.value && prev.label === next.label);

const Countdown = ({ weddingDate = "2025-01-01T10:00:00" }: CountdownProps) => {
    const target = useMemo(() => new Date(weddingDate).toISOString(), [weddingDate]);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => computeTimeLeft(target));

    useEffect(() => {
        let raf = 0;
        let lastSecond = -1;
        let stopped = false;

        const targetMs = new Date(target).getTime();

        const loop = () => {
            if (stopped) return;

            const now = Date.now();
            const diff = targetMs - now;

            // Giây còn lại trong phút hiện tại (>=0)
            const seconds = diff > 0 ? Math.floor((diff % 60000) / 1000) : 0;

            // Chỉ cập nhật khi "đổi giây" để tránh render dư và chống nhảy 2s
            if (seconds !== lastSecond) {
                lastSecond = seconds;
                setTimeLeft(computeTimeLeft(target));
            }

            raf = requestAnimationFrame(loop);
        };

        // đồng bộ ngay khi mount
        setTimeLeft(computeTimeLeft(target));
        raf = requestAnimationFrame(loop);

        // Khi quay lại từ tab nền / iOS resume → đồng bộ lại
        const handleVis = () => {
            if (!document.hidden) {
                lastSecond = -1;
                setTimeLeft(computeTimeLeft(target));
            }
        };
        document.addEventListener("visibilitychange", handleVis);

        return () => {
            stopped = true;
            cancelAnimationFrame(raf);
            document.removeEventListener("visibilitychange", handleVis);
        };
    }, [target]);


    return (
        <section id="countdown" className="section-spacing px-4 bg-gradient-romantic">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-10">
                    {/* bỏ animate-float/animate-fade-in lặp lại */}
                    <Heart className="w-12 h-12 mx-auto mb-6 text-primary" />
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                        Đếm Ngược Đến Ngày Trọng Đại
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Chúng tôi không thể chờ đợi để chia sẻ ngày đặc biệt này với bạn
                    </p>
                </div>

                <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
                    <TimeBlock value={timeLeft.days} label="Ngày" />
                    <TimeBlock value={timeLeft.hours} label="Giờ" />
                    <TimeBlock value={timeLeft.minutes} label="Phút" />
                    <TimeBlock value={timeLeft.seconds} label="Giây" />
                </div>
            </div>
        </section>
    );
};

export default Countdown;
