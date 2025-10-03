import { Gift, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const GiftSection = () => {
  const BankCard = ({ 
    side, 
    name, 
    fullName, 
    bank, 
    account, 
    accountName, 
    qrData,
    delay 
  }: { 
    side: string; 
    name: string; 
    fullName: string; 
    bank: string; 
    account: string; 
    accountName: string; 
    qrData: string;
    delay: number;
  }) => {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
    
    return (
      <div
        ref={ref}
        className={`transition-all duration-700 ${
          isVisible 
            ? side === 'left' 
              ? 'animate-slide-in-left' 
              : 'animate-slide-in-right'
            : 'opacity-0 translate-y-10'
        }`}
        style={{ animationDelay: `${delay}s` }}
      >
        <Card className="p-8 text-center shadow-romantic card-hover-effect">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">{side === 'left' ? 'Chú Rể' : 'Cô Dâu'}</h3>
            <p className="text-lg text-foreground font-semibold mb-1">{name}</p>
          </div>
          
          <div className="space-y-3 mb-6 text-left">
            <div>
              <p className="text-sm text-muted-foreground">Ngân hàng</p>
              <p className="text-base font-medium text-foreground">{bank}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số tài khoản</p>
              <p className="text-base font-medium text-foreground">{account}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chủ tài khoản</p>
              <p className="text-base font-medium text-foreground">{accountName}</p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <img 
              src={qrData} 
              alt={`QR Code ${side === 'left' ? 'Chú Rể' : 'Cô Dâu'}`} 
              className="w-48 h-48 mx-auto transition-transform duration-300 hover:scale-110"
            />
            <p className="text-sm text-muted-foreground mt-2">Quét mã QR để chuyển khoản</p>
          </div>
        </Card>
      </div>
    );
  };
  return (
    <section id="gift" className="py-20 px-4 bg-gradient-romantic">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <Gift className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Mừng Cưới
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sự hiện diện của quý khách là niềm vinh hạnh của chúng tôi. 
            Nếu muốn gửi lời chúc mừng, quý khách có thể chuyển khoản qua thông tin dưới đây.
          </p>
        </div>


        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <BankCard 
            side="left"
            name="Đức Ánh"
            fullName="NGUYEN DUKE ANH"
            bank="Vietcombank"
            account="1234567890"
            accountName="NGUYEN DUKE ANH"
            qrData="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank:Vietcombank|Account:1234567890|Name:NGUYEN_DUKE_ANH"
            delay={0}
          />
          <BankCard 
            side="right"
            name="Hà Phương"
            fullName="TRAN HA PHUONG"
            bank="Techcombank"
            account="0987654321"
            accountName="TRAN HA PHUONG"
            qrData="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank:Techcombank|Account:0987654321|Name:TRAN_HA_PHUONG"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
};

export default GiftSection;
