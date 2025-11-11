import { Heart } from "lucide-react";

const Footer = () => {
  return (
      <footer className="relative py-16 px-4 overflow-hidden">
          {/* 🌸 Nền gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,230,235,1)_0%,rgba(255,210,220,0.8)_40%,rgba(255,240,245,1)_100%)]" />
          <div className="absolute inset-0 opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/polished-metal.png')]" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_30%_30%,rgba(255,170,190,0.4)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[radial-gradient(circle_at_70%_70%,rgba(255,200,210,0.4)_0%,transparent_70%)] blur-3xl" />

          <div className="relative max-w-6xl mx-auto text-center">
              {/* 🈶 Chữ Hỷ cưới */}
              <div className="flex justify-center mb-4">
          <span className="text-[64px] sm:text-[80px] md:text-[100px] leading-none font-bold text-[#C0392B] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            囍
          </span>
              </div>

              {/*<Heart className="w-8 h-8 mx-auto mb-4 text-primary animate-float" />*/}

              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 pt-4">
                  Hà Phương & Đức Ánh
              </h3>

              <p className="text-muted-foreground mb-6 text-sm md:text-base">
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
