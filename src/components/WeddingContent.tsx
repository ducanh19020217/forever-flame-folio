import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
import WeddingDetails from "@/components/WeddingDetails";
import Countdown from "@/components/Countdown";
import RSVP from "@/components/RSVP";
import Guestbook from "@/components/Guestbook";
import GiftSection from "@/components/GiftSection";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import FallingPetals from "@/components/FallingPetals";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useEffect } from "react";

const WeddingContent = () => {
  const isiOSSafari = typeof navigator !== "undefined"
    && /iPhone|iPad|iPod/.test(navigator.userAgent)
    && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const auto = useAutoScroll({
    speed: 30,
    resumeDelayMs: 2500,
    enabled: true,
    bottomStrategy: "stop",
    respectReducedMotion: true,
    maxFPS: isiOSSafari ? 30 : 60,
  });

  useEffect(() => {
    // Auto scroll logic remains unchanged
    // auto.start();
    // return () => auto.stop();
  }, []);

  return (
    <div className="min-h-[100svh]">
      <FallingPetals />
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
      <Guestbook />
      <GiftSection />
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default WeddingContent;
