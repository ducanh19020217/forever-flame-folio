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

const Index = () => {
  useAutoScroll({ speed: 360, resumeDelayMs: 2500, enabled: true, bottomStrategy: 'stop' });
  
  return (
    <div className="min-h-screen">
      <FallingPetals />
      <Navigation />
      <Hero 
        brideName="Hà Phương"
        groomName="Đức Ánh"
        weddingDate="06.12.2025"
        quote="Tình yêu là hành trình đẹp nhất của cuộc đời"
      />
      <Timeline />
      <Gallery />
      <WeddingDetails />
      <Countdown weddingDate="2025-12-06T10:00:00" />
      <RSVP />
      <GuestWishes />
      <Guestbook />
      <GiftSection />
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default Index;
