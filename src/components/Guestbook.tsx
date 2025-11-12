import {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/hooks/use-toast";
import {Clock, Heart, MessageCircle, User} from "lucide-react";

const API_URL = "https://script.google.com/macros/s/AKfycbwUEYpa23JpnYtNiFfdnUdxKJ8fsHj7Qw8aTq3JWm6WQbxjFcRai-Prv46ItSA9L4xH/exec";

type WishRow = {
    name: string;
    message: string;
    timestamp: string | Date;
    approved?: string | boolean | number;
};

type ApiGetResponse = {
    ok: boolean;
    method: "GET";
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: WishRow[];
};

interface GuestMessage {
    id: string;           // dùng timestamp + name để unique
    name: string;
    message: string;
    timestamp: Date;
}

const toGuestMessage = (r: WishRow): GuestMessage => ({
    id: `${r.timestamp}-${r.name}`,
    name: r.name ?? "",
    message: r.message ?? "",
    timestamp: r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp),
});

const Guestbook = () => {
    const {toast} = useToast();

    const [messages, setMessages] = useState<GuestMessage[]>([]);
    const [newMessage, setNewMessage] = useState({name: "", message: ""});
    const [loading, setLoading] = useState(false);

    // paging & search
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState("");

    // fetch list
    const fetchWishes = async (opts?: { append?: boolean; resetPage?: boolean }) => {
        try {
            setLoading(true);
            const q = new URLSearchParams();
            q.set("page", String(page));
            q.set("limit", String(limit));
            if (keyword.trim()) q.set("keyword", keyword.trim());

            const res = await fetch(`${API_URL}?${q.toString()}`, {
                method: "GET",
            });
            const json: ApiGetResponse = await res.json();

            const list = json.data.map(toGuestMessage);
            setTotalPages(json.totalPages);

            setMessages(prev => (opts?.append ? [...prev, ...list] : list));
        } catch (e) {
            console.error(e);
            toast({
                title: "Không tải được lời chúc",
                description: "Vui lòng thử lại sau ít phút.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // load khi mount & khi page/keyword đổi
    useEffect(() => {
        fetchWishes({append: page > 1});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, keyword]);

    // submit lời chúc (form-encoded để tránh CORS preflight)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const name = newMessage.name.trim();
        const msg = newMessage.message.trim();
        if (!name || !msg) {
            toast({
                title: "Vui lòng điền đầy đủ thông tin",
                description: "Tên và lời chúc không được để trống.",
                variant: "destructive",
            });
            return;
        }

        try {
            const body = new URLSearchParams();
            body.set("name", name);
            body.set("message", msg);

            const res = await fetch(API_URL, {
                method: "POST",
                body, // 👈 form-encoded, không set Content-Type để browser tự set
            });

            // Có thể đọc JSON nếu GAS trả về JSON (không preflight)
            let ok = true;
            try {
                const js = await res.json();
                ok = !!js?.ok;
            } catch (_) {
                // 1 số deployment có thể không đọc được JSON → vẫn coi là ok
            }

            // Optimistic update (hiển thị ngay)
            const optimistic: GuestMessage = {
                id: `${Date.now()}-${name}`,
                name,
                message: msg,
                timestamp: new Date(),
            };
            setMessages(prev => [optimistic, ...prev]);

            // reset form
            setNewMessage({name: "", message: ""});

            toast({
                title: "Cảm ơn lời chúc của bạn!",
                description: "Lời chúc đã được ghi vào sổ khách.",
            });

            // Nếu bạn KHÔNG auto-approve ở GAS, lời chúc mới sẽ không xuất hiện khi refetch.
            // Nhưng do ta đã optimistic, vẫn thấy ngay. Bạn có thể refetch để đồng bộ:
            // setPage(1); fetch lại nếu muốn:
            // setTimeout(() => { setPage(1); fetchWishes(); }, 800);
        } catch (e) {
            console.error(e);
            toast({
                title: "Gửi không thành công",
                description: "Vui lòng thử lại trong giây lát.",
                variant: "destructive",
            });
        }
    };

    // tiện cho UI
    const canLoadMore = useMemo(() => page < totalPages, [page, totalPages]);

    return (
        <section id="guestbook" className="section-spacing px-4 bg-muted/30">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <MessageCircle className="w-12 h-12 mx-auto mb-6 text-primary"/>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{
                        fontFamily: '"Playfair Display", serif'
                    }}>
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
                            onChange={(e) => setNewMessage({...newMessage, name: e.target.value})}
                        />
                        <Textarea
                            placeholder="Viết lời chúc của bạn..."
                            value={newMessage.message}
                            onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
                            className="min-h-[120px]"
                        />
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={loading}
                            style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: '18px'
                            }}
                        >
                            Gửi Lời Chúc
                        </Button>
                    </div>
                </form>

                {!loading && messages?.length === 0 && <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground" style={{
                            fontFamily: '"Playfair Display", serif'
                        }}>
                            Đang tải lời chúc...
                        </div>
                    ) : <div className="text-center py-12 bg-card rounded-2xl shadow-soft">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-primary/30"/>
                        <p className="text-muted-foreground text-lg">
                            No wishes yet — be the first to leave one!
                        </p>
                    </div>
                    }
                </div>}
                {/* Messages Display */}
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id}
                            className="bg-card p-6 rounded-xl shadow-soft animate-fade-in-up"
                            style={{animationDelay: `${index * 0.04}s`}}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-primary"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-foreground break-words">{msg.name}</h4>
                                        <span className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleDateString("vi-VN")}
                    </span>
                                    </div>
                                    <p className="text-muted-foreground whitespace-pre-wrap break-words">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load more */}
                <div className="mt-6 flex justify-center">
                    {canLoadMore && (
                        <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
                            {loading ? "Đang tải..." : "Tải thêm"}
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Guestbook;
