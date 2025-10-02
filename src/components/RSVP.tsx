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
    
    toast({
      title: "Cảm ơn bạn đã xác nhận!",
      description: "Chúng tôi rất vui được đón tiếp bạn trong ngày trọng đại.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      attendance: "yes",
      guests: "1",
      message: ""
    });
  };

  return (
    <section id="rsvp" className="py-20 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <Heart className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Xác Nhận Tham Dự
          </h2>
          <p className="text-muted-foreground text-lg">
            Vui lòng cho chúng tôi biết bạn có thể tham dự không
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl shadow-romantic">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Họ và Tên *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="phone">Số Điện Thoại *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Bạn có tham dự không? *</Label>
              <RadioGroup
                value={formData.attendance}
                onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="cursor-pointer">
                    Có, tôi sẽ tham dự
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="cursor-pointer">
                    Rất tiếc, tôi không thể tham dự
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.attendance === "yes" && (
              <div>
                <Label htmlFor="guests">Số Lượng Khách</Label>
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
              <Label htmlFor="message">Lời Nhắn (không bắt buộc)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Gửi lời chúc của bạn đến cô dâu chú rể..."
                className="mt-2 min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
            >
              Gửi Xác Nhận
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RSVP;
