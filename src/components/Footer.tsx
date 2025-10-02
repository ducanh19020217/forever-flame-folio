import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <Heart className="w-8 h-8 mx-auto mb-4 text-primary animate-float" />
        
        <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
          Cô Dâu & Chú Rể
        </h3>
        
        <p className="text-muted-foreground mb-6">
          Cảm ơn bạn đã dành thời gian xem thiệp mời của chúng tôi
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <span>for our special day</span>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          © 2025 All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
