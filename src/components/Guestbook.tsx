import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, User } from "lucide-react";

interface GuestMessage {
  id: number;
  name: string;
  message: string;
  timestamp: Date;
}

const Guestbook = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<GuestMessage[]>([
    {
      id: 1,
      name: "Nguyễn Văn A",
      message: "Chúc hai bạn trăm năm hạnh phúc! Mãi bên nhau.",
      timestamp: new Date("2024-12-15")
    },
    {
      id: 2,
      name: "Trần Thị B",
      message: "Chúc mừng cô dâu chú rể! Hạnh phúc mãi mãi nhé!",
      timestamp: new Date("2024-12-20")
    }
  ]);
  const [newMessage, setNewMessage] = useState({ name: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.name || !newMessage.message) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Tên và lời chúc không được để trống.",
        variant: "destructive"
      });
      return;
    }

    const message: GuestMessage = {
      id: messages.length + 1,
      name: newMessage.name,
      message: newMessage.message,
      timestamp: new Date()
    };

    setMessages([message, ...messages]);
    setNewMessage({ name: "", message: "" });
    
    toast({
      title: "Cảm ơn lời chúc của bạn!",
      description: "Lời chúc đã được ghi vào sổ khách.",
    });
  };

  return (
    <section id="guestbook" className="section-spacing px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <MessageCircle className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sổ Lưu Bút
          </h2>
          <p className="text-muted-foreground text-lg">
            Gửi lời chúc tốt đẹp đến cô dâu chú rể
          </p>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl shadow-romantic mb-12">
          <div className="space-y-4">
            <Input
              placeholder="Tên của bạn"
              value={newMessage.name}
              onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
            />
            <Textarea
              placeholder="Viết lời chúc của bạn..."
              value={newMessage.message}
              onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
              className="min-h-[120px]"
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Gửi Lời Chúc
            </Button>
          </div>
        </form>

        {/* Messages Display */}
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className="bg-card p-6 rounded-xl shadow-soft animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{msg.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guestbook;
