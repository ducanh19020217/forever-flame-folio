// RSVP.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

// ====== cấu hình GAS ======
const GAS_KEY = "AKfycbwUEYpa23JpnYtNiFfdnUdxKJ8fsHj7Qw8aTq3JWm6WQbxjFcRai-Prv46ItSA9L4xH";
const GAS_URL = `https://script.google.com/macros/s/${GAS_KEY}/exec`; // doPost/doGet

type Attendance = "yes" | "no";

interface RSVPForm {
    name: string;
    phone: string;
    attendance: Attendance;
    guests: string; // giữ string để bind input number
}

// chuẩn hoá YES/NO theo backend
const normalizeAttendance = (v: string): Attendance => (v === "no" ? "no" : "yes");

// chuẩn hoá phone (cắt space, chuẩn đầu 0/84 nếu cần)
const normalizePhone = (p: string) => p.replace(/\s+/g, "").trim();

// escape an toàn khi cần hiển thị lại ở FE
const escapeHtml = (str: string) =>
    str.replace(/[&<>"'`=\/]/g, (s) =>
        ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;",
        }[s] as string),
    );

// ====== gọi API GAS: dùng form-urlencoded để tránh preflight CORS ======
async function postRegister(payload: {
    name: string;
    phone: string;
    attendance: Attendance;
    guests: number;
}) {
    const body = new URLSearchParams({
        name: payload.name,
        phone: payload.phone,
        attendance: payload.attendance,
        guests: String(payload.guests),
    });

    const res = await fetch(`${GAS_URL}?action=register`, {
        method: "POST",
        // ❗ KHÔNG set headers Content-Type -> browser tự set 'application/x-www-form-urlencoded'
        body,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.ok !== true) {
        const msg = json?.error || `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return json;
}

const RSVP = () => {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<RSVPForm>({
        name: "",
        phone: "",
        attendance: "yes",
        guests: "1",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation đơn giản
        if (!formData.name.trim() || !formData.phone.trim()) {
            toast({
                title: "Vui lòng điền đầy đủ thông tin",
                description: "Tên và số điện thoại là bắt buộc.",
                variant: "destructive",
            });
            return;
        }

        const attendance = normalizeAttendance(formData.attendance);
        const guestsNumber =
            attendance === "no" ? 0 : Math.max(1, Number.parseInt(formData.guests || "1", 10));

        // chuẩn hoá & escape để hiển thị lại an toàn ở FE (không bắt buộc cho backend)
        const payload = {
            name: escapeHtml(formData.name.trim()),
            phone: normalizePhone(formData.phone),
            attendance,
            guests: guestsNumber,
        };

        try {
            setLoading(true);
            await postRegister(payload);

            // ok
            setSubmitted(true);
            toast({
                title: "Đã ghi nhận xác nhận tham dự",
                description:
                    attendance === "yes"
                        ? `Hẹn gặp ${payload.name} (${payload.phone}). Số lượng: ${guestsNumber}.`
                        : `Rất tiếc bạn không thể tham dự. Cảm ơn đã phản hồi!`,
            });

            // Reset form sau vài giây
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    name: "",
                    phone: "",
                    attendance: "yes",
                    guests: "1",
                });
            }, 5000);
        } catch (err: any) {
            toast({
                title: "Gửi thất bại",
                description: err?.message || "Vui lòng thử lại sau.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="rsvp" className="section-spacing bg-background">
            <div className="max-w-xl mx-auto px-4">
                <div className="text-center mb-12 animate-fade-in">
                    <Heart className="w-12 h-12 mx-auto mb-6 text-primary" />
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Xác Nhận Tham Dự</h2>
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
                                <Label htmlFor="name" className="text-base">
                                    Họ và Tên *
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nguyễn Văn A"
                                    className="mt-2"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-base">
                                    Số Điện Thoại *
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0912345678"
                                    className="mt-2"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label className="text-base">Bạn có tham dự không? *</Label>
                                <RadioGroup
                                    value={formData.attendance}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            attendance: value as Attendance,
                                            // nếu chọn "no" thì ép số khách = "0"
                                            guests: value === "no" ? "0" : formData.guests || "1",
                                        })
                                    }
                                    className="mt-3 space-y-3"
                                >
                                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="yes" id="yes" disabled={loading} />
                                        <Label htmlFor="yes" className="cursor-pointer flex-1 text-base">
                                            Có, tôi sẽ tham dự
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="no" id="no" disabled={loading} />
                                        <Label htmlFor="no" className="cursor-pointer flex-1 text-base">
                                            Rất tiếc, tôi không thể tham dự
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {formData.attendance === "yes" && (
                                <div className="animate-fade-in">
                                    <Label htmlFor="guests" className="text-base">
                                        Số Lượng Khách
                                    </Label>
                                    <Input
                                        id="guests"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                        className="mt-2"
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold mt-4"
                                disabled={loading}
                            >
                                {loading ? "Đang gửi..." : "Gửi Xác Nhận"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default RSVP;
