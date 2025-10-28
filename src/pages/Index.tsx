import { useEffect, useState } from "react";
import InvitationEnvelope from "@/components/InvitationEnvelope";
import WeddingContent from "@/components/WeddingContent";

const Index = () => {
    const [overlayVisible, setOverlayVisible] = useState(true);
    const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
    const [guestName, setGuestName] = useState("Quý khách");

    useEffect(() => {
        // Lấy tên khách mời từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const toParam = urlParams.get("to");
        if (toParam) setGuestName(decodeURIComponent(toParam));
    }, []);

    const handleOpenAll = async () => {
        // ✅ Gọi trong cùng tick click để Safari cho phép phát nhạc
        setShouldPlayMusic(true);

        // ✅ Cho hiệu ứng fade mượt
        setTimeout(() => {
            setOverlayVisible(false);
        }, 200);
    };

    return (
        <>
            {/* WeddingContent luôn ở dưới */}
            <WeddingContent autoPlayMusic={shouldPlayMusic} />

            {/* Overlay phong bì hiển thị trên cùng */}
            {overlayVisible && (
                <div
                    className={`fixed inset-0 z-[9999] transition-opacity duration-700 ${
                        overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    <InvitationEnvelope guestName={guestName} onOpenAll={handleOpenAll} />
                </div>
            )}
        </>
    );
};

export default Index;
