import { useState } from "react";
import { Heart } from "lucide-react";

interface InvitationEnvelopeProps {
  guestName: string;
  onEnterWeddingPage: () => void;
}

const InvitationEnvelope = ({ guestName, onEnterWeddingPage }: InvitationEnvelopeProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#fff7f8] via-[#fffafa] to-[#fff0f3] flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Heart className="w-16 h-16 text-[#e8cfd4]" fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <Heart className="w-20 h-20 text-[#e8cfd4]" fill="currentColor" />
      </div>
      <div className="absolute top-1/4 right-1/4 opacity-10">
        <Heart className="w-12 h-12 text-[#e8cfd4]" fill="currentColor" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Envelope container */}
        <div className="relative perspective-1000">
          {/* Envelope body */}
          <div
            className={`relative bg-white border-2 border-[#e8cfd4] rounded-2xl shadow-2xl transition-all duration-500 ${
              isOpened ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ 
              minHeight: "450px",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Envelope flap */}
            <div
              className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#f3d5dc] to-[#fce4ec] border-b-2 border-[#e8cfd4] rounded-t-2xl origin-top transition-transform duration-400 ease-out ${
                isOpening ? "envelope-flap-open" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 60%, 0 100%)"
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                <div className="w-12 h-12 rounded-full bg-[#e8cfd4]/30 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#d4a5b0]" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Envelope content */}
            <div className="relative pt-20 p-8 flex flex-col items-center text-center">
              <p className="text-sm tracking-widest text-[#a88894] uppercase mb-4 font-light">
                Kính mời
              </p>
              
              <h1 className="text-3xl md:text-4xl font-serif text-[#6b5b5f] mb-6 font-bold">
                {guestName}
              </h1>

              <div className="mb-8">
                <p className="text-sm text-[#a88894] mb-2">Thiệp cưới của</p>
                <p className="text-2xl font-script text-[#d4a5b0] leading-relaxed">
                  Đức Ánh & Hà Phương
                </p>
              </div>

              {!isOpening && (
                <button
                  onClick={handleOpenEnvelope}
                  className="px-8 py-3 bg-gradient-to-r from-[#e8cfd4] to-[#f3d5dc] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium tracking-wide"
                >
                  Mở thư ✉
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
            <div className="bg-white border-2 border-[#f3d5dc] rounded-2xl shadow-2xl p-8 h-full flex flex-col justify-center">
              <div className="text-center space-y-6">
                <Heart className="w-12 h-12 text-[#e8cfd4] mx-auto mb-4" fill="currentColor" />
                
                <h2 className="text-xl text-[#6b5b5f] leading-relaxed">
                  Trân trọng kính mời<br />
                  <span className="text-2xl font-semibold text-[#d4a5b0]">{guestName}</span>
                </h2>

                <p className="text-base text-[#a88894] leading-relaxed">
                  Đến dự lễ thành hôn của
                </p>

                <div className="space-y-2">
                  <p className="text-3xl font-script text-[#d4a5b0]">Đức Ánh</p>
                  <Heart className="w-6 h-6 text-[#e8cfd4] mx-auto" fill="currentColor" />
                  <p className="text-3xl font-script text-[#d4a5b0]">Hà Phương</p>
                </div>

                <div className="border-t border-[#f3d5dc] pt-6 space-y-2">
                  <p className="text-sm text-[#6b5b5f] font-medium">
                    Vào lúc 10:00 | 07.12.2025
                  </p>
                  <p className="text-sm text-[#a88894]">
                    Tại nhà hàng tiệc cưới
                  </p>
                </div>

                <button
                  onClick={onEnterWeddingPage}
                  className="mt-8 px-10 py-4 bg-gradient-to-r from-[#d4a5b0] to-[#e8cfd4] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium tracking-wide text-lg"
                >
                  Vào thiệp mời
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
        }

        @font-face {
          font-family: 'Script';
          src: local('Brush Script MT'), local('Lucida Handwriting'), local('Apple Chancery');
        }

        .font-script {
          font-family: 'Script', cursive, serif;
        }
      `}</style>
    </div>
  );
};

export default InvitationEnvelope;
