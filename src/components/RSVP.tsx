import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

const RSVP = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attendance: "yes",
    guests: "1",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Tên, email và số điện thoại là bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally send the data to a backend
    console.log("RSVP submitted:", formData);
    
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        attendance: "yes",
        guests: "1",
        message: ""
      });
    }, 5000);
  };

  return (
    <section id="rsvp" className="section-spacing bg-background">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <Heart className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Xác Nhận Tham Dự
          </h2>
          <p className="text-muted-foreground text-lg">
            Vui lòng cho chúng tôi biết bạn có thể tham dự không
          </p>
        </div>

        {submitted ? (
          <div className="bg-card p-12 rounded-2xl shadow-romantic text-center animate-scale-in">
            <Heart className="w-16 h-16 mx-auto mb-6 text-primary animate-pulse" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Cảm ơn bạn đã xác nhận!
            </h3>
            <p className="text-muted-foreground text-lg">
              Chúng tôi rất vui được đón tiếp bạn trong ngày trọng đại của chúng tôi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card p-8 md:p-10 rounded-2xl shadow-romantic">
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-base">Họ và Tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="mt-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="email" className="text-base">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base">Số Điện Thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912345678"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base">Bạn có tham dự không? *</Label>
                <RadioGroup
                  value={formData.attendance}
                  onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="cursor-pointer flex-1 text-base">
                      Có, tôi sẽ tham dự
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="cursor-pointer flex-1 text-base">
                      Rất tiếc, tôi không thể tham dự
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.attendance === "yes" && (
                <div className="animate-fade-in">
                  <Label htmlFor="guests" className="text-base">Số Lượng Khách</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="message" className="text-base">Lời Nhắn (không bắt buộc)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Gửi lời chúc của bạn đến cô dâu chú rể..."
                  className="mt-2 min-h-[120px] resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold mt-4"
              >
                Gửi Xác Nhận
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default RSVP;
