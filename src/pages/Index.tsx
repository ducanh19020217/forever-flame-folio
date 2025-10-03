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

const Index = () => {
  return (
    <div className="min-h-screen">
      <FallingPetals />
      <Navigation />
      <Hero 
        brideName="Tên Cô Dâu"
        groomName="Tên Chú Rể"
        weddingDate="01.01.2025"
        quote="Tình yêu là hành trình đẹp nhất của cuộc đời"
      />
      <Timeline />
      <Gallery />
      <WeddingDetails />
      <Countdown weddingDate="2025-01-01T10:00:00" />
      <RSVP />
      <Guestbook />
      <GiftSection />
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default Index;
