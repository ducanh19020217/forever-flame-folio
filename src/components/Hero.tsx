import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-wedding.jpg";

interface HeroProps {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  quote?: string;
}

const Hero = ({
  brideName = "Tên Cô Dâu",
  groomName = "Tên Chú Rể",
  weddingDate = "01.01.2025",
  quote = "Tình yêu là hành trình đẹp nhất của cuộc đời"
}: HeroProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 animate-zoom-in"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 py-20 animate-fade-in-up">
        <Heart className="w-12 h-12 mx-auto mb-8 text-primary animate-pulse-glow" />
        
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-foreground">
          {brideName}
          <span className="text-primary mx-4">&</span>
          {groomName}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light italic">
          "{quote}"
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-12 bg-primary" />
          <p className="text-2xl md:text-3xl font-serif text-primary">
            {weddingDate}
          </p>
          <div className="h-px w-12 bg-primary" />
        </div>
        
        <Button 
          onClick={() => scrollToSection('rsvp')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-romantic"
        >
          RSVP Now
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
