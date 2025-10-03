import { Gift, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

const GiftSection = () => {
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
          {/* Groom's Bank Info */}
          <Card className="p-8 text-center shadow-romantic card-hover-effect">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Chú Rể</h3>
              <p className="text-lg text-foreground font-semibold mb-1">Tên Chú Rể</p>
            </div>
            
            <div className="space-y-3 mb-6 text-left">
              <div>
                <p className="text-sm text-muted-foreground">Ngân hàng</p>
                <p className="text-base font-medium text-foreground">Vietcombank</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số tài khoản</p>
                <p className="text-base font-medium text-foreground">1234567890</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chủ tài khoản</p>
                <p className="text-base font-medium text-foreground">NGUYEN VAN A</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank:Vietcombank|Account:1234567890|Name:NGUYEN_VAN_A" 
                alt="QR Code Chú Rể" 
                className="w-48 h-48 mx-auto"
              />
              <p className="text-sm text-muted-foreground mt-2">Quét mã QR để chuyển khoản</p>
            </div>
          </Card>

          {/* Bride's Bank Info */}
          <Card className="p-8 text-center shadow-romantic card-hover-effect">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Cô Dâu</h3>
              <p className="text-lg text-foreground font-semibold mb-1">Tên Cô Dâu</p>
            </div>
            
            <div className="space-y-3 mb-6 text-left">
              <div>
                <p className="text-sm text-muted-foreground">Ngân hàng</p>
                <p className="text-base font-medium text-foreground">Techcombank</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số tài khoản</p>
                <p className="text-base font-medium text-foreground">0987654321</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chủ tài khoản</p>
                <p className="text-base font-medium text-foreground">TRAN THI B</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank:Techcombank|Account:0987654321|Name:TRAN_THI_B" 
                alt="QR Code Cô Dâu" 
                className="w-48 h-48 mx-auto"
              />
              <p className="text-sm text-muted-foreground mt-2">Quét mã QR để chuyển khoản</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GiftSection;
