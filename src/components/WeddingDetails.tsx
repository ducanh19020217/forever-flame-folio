import { MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntersectionAppear } from "@/hooks/useIntersectionAppear";

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
    title: "Lễ Đón Dâu",
    date: "Chủ nhật, 07 Tháng 12, 2025",
    time: "10:00 AM",
    venue: "Tư gia nhà gái",
    address: "Thôn Đà Phố, xã Khúc Thừa Dụ, thành phố Hải Phòng",
    mapLink: "https://maps.app.goo.gl/zV5sV2rQX1CFiJzN8"
  };

  const reception: EventDetails = {
    title: "Lễ Thành Hôn",
    date: "Chủ Nhật, 07 Tháng 12, 2025",
    time: "11:00 AM",
    venue: "Tư gia nhà trai",
    address: "Thôn Thọ Sơn, xã Hồng Châu, thành phố Hải Phòng",
    mapLink: "https://maps.app.goo.gl/XbCCP9bC3GMamQ7R6"
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
    const { ref, isVisible } = useIntersectionAppear({ threshold: 0.2 });
    
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-700 ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : `opacity-0 ${direction === 'left' ? '-translate-x-8' : 'translate-x-8'}`
        }`}
        style={{ 
          transitionDelay: `${delay * 1000}ms`,
          willChange: 'opacity, transform'
        }}
      >
        <EventCard event={event} />
      </div>
    );
  };

  return (
    <section id="details" className="section-spacing px-4 bg-background">
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
