import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, User, Clock } from "lucide-react";

// Replace with your actual Google Apps Script URL
const APPS_URL = "https://script.google.com/macros/s/AKfycbwUEYpa23JpnYtNiFfdnUdxKJ8fsHj7Qw8aTq3JWm6WQbxjFcRai-Prv46ItSA9L4xH/exec";

interface Wish {
  ts: string;
  name: string;
  message: string;
}

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

const GuestWishes = () => {
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${APPS_URL}?wishes&limit=100`);
      if (!response.ok) throw new Error("Failed to fetch wishes");
      const data = await response.json();
      setWishes(data.items || []);
    } catch (err) {
      setError("Cannot load wishes. Please try again later.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Tên và lời chúc không được để trống.",
        variant: "destructive"
      });
      return;
    }

    if (formData.name.length > 80) {
      toast({
        title: "Tên quá dài",
        description: "Tên không được vượt quá 80 ký tự.",
        variant: "destructive"
      });
      return;
    }

    if (formData.message.length > 500) {
      toast({
        title: "Lời chúc quá dài",
        description: "Lời chúc không được vượt quá 500 ký tự.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Escape input to prevent XSS
      const sanitizedData = {
        name: escapeHtml(formData.name.trim()),
        message: escapeHtml(formData.message.trim())
      };

      // Optimistic update
      const optimisticWish: Wish = {
        ts: new Date().toISOString(),
        name: sanitizedData.name,
        message: sanitizedData.message
      };
      setWishes([optimisticWish, ...wishes]);

      // Send to backend
      const response = await fetch(APPS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData)
      });

      if (!response.ok) throw new Error("Failed to submit wish");

      // Clear form
      setFormData({ name: "", message: "" });

      toast({
        title: "Thank you for your wish 💖",
        description: "Lời chúc của bạn đã được gửi thành công!",
      });

      // Refresh wishes from server after a short delay
      setTimeout(() => fetchWishes(), 1000);

    } catch (err) {
      // Remove optimistic update on error
      setWishes(wishes);
      toast({
        title: "Không thể gửi lời chúc",
        description: "Vui lòng thử lại sau.",
        variant: "destructive"
      });
      console.error("Submit error:", err);
    } finally {
      // Lock button for 3 seconds to prevent spam
      setTimeout(() => setSubmitting(false), 3000);
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return ts;
    }
  };

  return (
    <section id="guest-wishes" className="section-spacing px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <Heart className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Guest Wishes
          </h2>
          <p className="text-muted-foreground text-lg">
            Chia sẻ lời chúc phúc của bạn đến đôi uyên ương
          </p>
        </div>

        {/* Wish Form */}
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl shadow-romantic mb-12">
          <div className="space-y-4">
            <Input
              placeholder="Tên của bạn *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={80}
              disabled={submitting}
              required
            />
            <Textarea
              placeholder="Viết lời chúc của bạn... *"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="min-h-[120px]"
              maxLength={500}
              disabled={submitting}
              required
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.message.length}/500 ký tự
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Send wish"}
            </Button>
          </div>
        </form>

        {/* Wishes Display */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Đang tải lời chúc...
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchWishes} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : wishes.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl shadow-soft">
              <Heart className="w-16 h-16 mx-auto mb-4 text-primary/30" />
              <p className="text-muted-foreground text-lg">
                No wishes yet — be the first to leave one!
              </p>
            </div>
          ) : (
            wishes.map((wish, index) => (
              <div
                key={`${wish.ts}-${index}`}
                className="bg-card p-6 rounded-xl shadow-soft animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold text-foreground">{wish.name}</h4>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(wish.ts)}
                      </span>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{wish.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestWishes;
