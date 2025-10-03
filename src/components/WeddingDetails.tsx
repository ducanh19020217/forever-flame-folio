import { MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface EventDetails {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapLink: string;
}

const WeddingDetails = () => {
  const ceremony: EventDetails = {
    title: "Lễ Thành Hôn",
    date: "Thứ Bảy, 06 Tháng 12, 2025",
    time: "10:00 AM",
    venue: "Nhà Thờ Đức Bà",
    address: "01 Công xã Paris, Quận 1, TP. Hồ Chí Minh",
    mapLink: "https://maps.google.com"
  };

  const reception: EventDetails = {
    title: "Tiệc Cưới",
    date: "Chủ Nhật, 07 Tháng 12, 2025",
    time: "6:00 PM",
    venue: "Trung Tâm Hội Nghị Gem Center",
    address: "8 Nguyễn Bỉnh Khiêm, Quận 1, TP. Hồ Chí Minh",
    mapLink: "https://maps.google.com"
  };

  const EventCard = ({ event }: { event: EventDetails }) => (
    <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-romantic transition-all duration-300 card-hover-effect">
      <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
        {event.title}
      </h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-4">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-foreground">{event.date}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-foreground">{event.time}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-foreground">{event.venue}</p>
            <p className="text-muted-foreground text-sm mt-1">{event.address}</p>
          </div>
        </div>
      </div>
      
      <Button
        onClick={() => window.open(event.mapLink, '_blank')}
        variant="outline"
        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        Xem Bản Đồ
      </Button>
    </div>
  );

  const AnimatedEventCard = ({ event, delay, direction }: { event: EventDetails; delay: number; direction: 'left' | 'right' }) => {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
    
    return (
      <div
        ref={ref}
        className={`transition-all duration-700 ${
          isVisible 
            ? direction === 'left' 
              ? 'animate-slide-in-left' 
              : 'animate-slide-in-right'
            : 'opacity-0 translate-y-10'
        }`}
        style={{ animationDelay: `${delay}s` }}
      >
        <EventCard event={event} />
      </div>
    );
  };

  return (
    <section id="details" className="py-20 px-4 bg-gradient-romantic">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Chi Tiết Đám Cưới
          </h2>
          <p className="text-muted-foreground text-lg">
            Chúng tôi rất vui được đón tiếp quý khách
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedEventCard event={ceremony} delay={0} direction="left" />
          <AnimatedEventCard event={reception} delay={0.2} direction="right" />
        </div>
      </div>
    </section>
  );
};

export default WeddingDetails;
