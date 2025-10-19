import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
import WeddingDetails from "@/components/WeddingDetails";
import Countdown from "@/components/Countdown";
import RSVP from "@/components/RSVP";
import GuestWishes from "@/components/GuestWishes";
import Guestbook from "@/components/Guestbook";
import GiftSection from "@/components/GiftSection";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import FallingPetals from "@/components/FallingPetals";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import {useEffect, useRef, useState} from "react";
import Fireworks from "@/components/Fireworks.tsx";

const Index = () => {
    const [boom, setBoom] = useState(true);
    const auto = useAutoScroll({
        speed: 30,
        resumeDelayMs: 2500,
        enabled: true,
        bottomStrategy: "stop",
        respectReducedMotion: false,
        maxFPS: 60,
    });

    useEffect(() => {
        // ép iOS nhận sự kiện cuộn
        window.scrollTo(0, 1);
        setTimeout(() => window.scrollTo(0, 0), 200);
        auto.start();

        // 🌟 Thỉnh thoảng tự bắn pháo bông (ngẫu nhiên 15–35 giây/lần)
        const fire = () => {
            setBoom(true);
            setTimeout(() => setBoom(false), 1800);
        };

        const loop = setInterval(() => {
            if (Math.random() < 0.4) { // 40% xác suất mỗi chu kỳ
                fire();
            }
        }, 5000 + Math.random() * 10000); // 15–35s/lần

        // bắn lần đầu ngay khi vào trang
        setTimeout(fire, 3000);

        return () => {
            auto.stop();
            clearInterval(loop);
        };
    }, []);

    return (
    <div className="min-h-screen">
      <FallingPetals />
        {/*<Fireworks*/}
        {/*    show={boom}*/}
        {/*    durationMs={1500}*/}
        {/*    burstRate={4}*/}
        {/*    onEnd={() => setBoom(false)}*/}
        {/*/>*/}
      <Navigation />
      <Hero
        brideName="Hà Phương"
        groomName="Đức Ánh"
        weddingDate="07.12.2025"
        quote="Tình yêu là hành trình đẹp nhất của cuộc đời"
      />
      <Timeline />
      <Gallery />
      <WeddingDetails />
      <Countdown weddingDate="2025-12-07T10:00:00" />
      <RSVP />
      {/*<GuestWishes />*/}
      <Guestbook />
      <GiftSection />
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default Index;
