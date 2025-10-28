import { useState } from "react";
import { Heart } from "lucide-react";
import CelebrationFX from "./CelebrationFX";
import IntroFallingPetals from "./IntroFallingPetals";

interface InvitationEnvelopeProps {
  guestName: string;
  onEnterWeddingPage: () => void;
  onStartMusic: () => void;
}

const InvitationEnvelope = ({ guestName, onEnterWeddingPage, onStartMusic }: InvitationEnvelopeProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpening(true);
    onStartMusic(); // Trigger music immediately
    setTimeout(() => {
      setIsOpened(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-gradient-romantic flex items-center justify-center p-4 overflow-hidden">
      {/* Celebration effects */}
      <CelebrationFX />
      <IntroFallingPetals />
      
      {/* Decorative elements - không pulse */}
      <div className="absolute top-10 left-10 opacity-10">
        <Heart className="w-16 h-16 text-primary/60" fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Heart className="w-20 h-20 text-primary/60" fill="currentColor" />
      </div>
      <div className="absolute top-1/4 right-1/4 opacity-5">
        <Heart className="w-12 h-12 text-primary/60" fill="currentColor" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Envelope container */}
        <div className="relative perspective-1000">
          {/* Envelope body */}
          <div
            className={`relative bg-card border-2 border-primary/20 rounded-2xl shadow-romantic transition-all duration-500 ${
              isOpened ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ 
              minHeight: "480px",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Envelope flap */}
            <div
              className={`absolute top-0 left-0 right-0 h-32 bg-gradient-gold border-b-2 border-primary/30 rounded-t-2xl origin-top transition-transform duration-400 ease-out ${
                isOpening ? "envelope-flap-open" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 60%, 0 100%)"
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Envelope content */}
            <div className="relative pt-24 p-8 flex flex-col items-center text-center">
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6 font-light">
                Kính mời
              </p>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-8 font-bold leading-tight px-4">
                {guestName}
              </h1>

              <div className="mb-10">
                <p className="text-sm text-muted-foreground mb-3">Thiệp cưới của</p>
                <p className="text-3xl md:text-4xl font-script text-primary leading-relaxed">
                  Đức Ánh & Hà Phương
                </p>
              </div>

              {!isOpening && (
                <button
                  onClick={handleOpenEnvelope}
                  className="px-10 py-4 bg-gradient-gold text-primary-foreground rounded-full shadow-romantic hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium tracking-wide text-lg"
                >
                  Mở thư & Bắt đầu ✉
                </button>
              )}
            </div>
          </div>

          {/* Card inside envelope */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isOpened
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8 pointer-events-none"
            }`}
          >
            <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-romantic p-8 h-full flex flex-col justify-center">
              <div className="text-center space-y-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" fill="currentColor" />
                
                <h2 className="text-xl text-foreground leading-relaxed">
                  Trân trọng kính mời<br />
                  <span className="text-3xl font-semibold text-primary mt-2 block">{guestName}</span>
                </h2>

                <p className="text-base text-muted-foreground leading-relaxed">
                  Đến dự lễ thành hôn của
                </p>

                <div className="space-y-2">
                  <p className="text-3xl font-script text-primary">Đức Ánh</p>
                  <Heart className="w-6 h-6 text-primary mx-auto" fill="currentColor" />
                  <p className="text-3xl font-script text-primary">Hà Phương</p>
                </div>

                <div className="border-t border-border pt-6 space-y-2">
                  <p className="text-sm text-foreground font-medium">
                    Vào lúc 10:00 | 07.12.2025
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tại nhà hàng tiệc cưới
                  </p>
                </div>

                <button
                  onClick={onEnterWeddingPage}
                  className="mt-8 px-10 py-4 bg-gradient-gold text-primary-foreground rounded-full shadow-romantic hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium tracking-wide text-lg"
                >
                  Vào thiệp mời →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .envelope-flap-open {
          transform: rotateX(-130deg);
          transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        @font-face {
          font-family: 'Script';
          src: local('Brush Script MT'), local('Lucida Handwriting'), local('Apple Chancery'), local('Segoe Script');
        }

        .font-script {
          font-family: 'Script', 'Playfair Display', cursive, serif;
        }
      `}</style>
    </div>
  );
};

export default InvitationEnvelope;
