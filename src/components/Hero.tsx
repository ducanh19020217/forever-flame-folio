import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-wedding.jpg";
import { useIntersectionAppear } from "@/hooks/useIntersectionAppear";

interface HeroProps {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  quote?: string;
}

const Hero = ({
  brideName = "Hà Phương",
  groomName = "Đức Ánh",
  weddingDate = "07.12.2025",
  quote = "Tình yêu là hành trình đẹp nhất của cuộc đời"
}: HeroProps) => {
  const { ref, isVisible } = useIntersectionAppear({ threshold: 0.2 });
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <img
        src={heroImage}
        alt="Wedding celebration background"
        fetchPriority="high"
        decoding="async"
        width={1920}
        height={1080}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        style={{ willChange: 'opacity, transform' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/25" />
      
      {/* Content */}
      <div 
        className={`relative z-10 text-center px-4 py-20 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ willChange: 'opacity, transform' }}
      >
        <Heart className="w-14 h-14 mx-auto mb-8 text-white drop-shadow-lg animate-pulse-glow" />
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {brideName}
          <span className="text-primary mx-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">&</span>
          {groomName}
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-8 font-light italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] max-w-2xl mx-auto">
          "{quote}"
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-white/80" />
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            {weddingDate}
          </p>
          <div className="h-px w-16 bg-white/80" />
        </div>
        
        <Button 
          onClick={() => scrollToSection('rsvp')}
          className="bg-primary hover:bg-primary/80 text-white px-10 py-7 text-lg md:text-xl rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 font-semibold"
        >
          Xác Nhận Tham Dự
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
