import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = ({ weddingDate = "2025-01-01T10:00:00" }: { weddingDate?: string }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(weddingDate) - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-card rounded-2xl shadow-romantic p-6 mb-3 min-w-[100px] animate-scale-in">
        <span className="text-5xl md:text-6xl font-bold text-primary">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <section id="countdown" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12 animate-fade-in">
          <Heart className="w-12 h-12 mx-auto mb-6 text-primary animate-float" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Đếm Ngược Đến Ngày Trọng Đại
          </h2>
          <p className="text-muted-foreground text-lg">
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
