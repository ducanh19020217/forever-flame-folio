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
import {brideShortName, groomShortName, quote, weddingDate, weddingTime} from "@/config/weddingConfig.ts";

interface WeddingContentProps {
  autoPlayMusic?: boolean;
}

const WeddingContent = ({ autoPlayMusic = false }: WeddingContentProps) => {
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
      console.log('autoPlayMusic', autoPlayMusic)
  }, [autoPlayMusic]);

  return (
    <div className="min-h-[100svh]">
      <FallingPetals />
      <Navigation />
      <Hero
        brideName={brideShortName}
        groomName={groomShortName}
        weddingDate={weddingDate}
        quote={quote}
      />
      <Timeline />
      <Gallery />
      <WeddingDetails />
      <Countdown weddingDate={weddingTime} />
      <RSVP />
      <Guestbook />
      <GiftSection />
      <Footer />
      <MusicPlayer autoPlay={autoPlayMusic} />
    </div>
  );
};

export default WeddingContent;
