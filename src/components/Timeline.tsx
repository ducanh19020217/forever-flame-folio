import { Calendar, Heart, Sparkles, Church } from "lucide-react";
import timeline1 from "@/assets/timeline-1.jpg";
import timeline2 from "@/assets/timeline-2.jpg";
import timeline3 from "@/assets/timeline-3.jpg";
import timeline4 from "@/assets/timeline-4.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface Milestone {
  title: string;
  date: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

const milestones: Milestone[] = [
  {
    title: "Lần Đầu Gặp Gỡ",
    date: "Mùa xuân 2020",
    description: "Chúng tôi gặp nhau trong một buổi chiều nắng đẹp. Đó là định mệnh đã sắp đặt cho chúng tôi.",
    image: timeline1,
    icon: <Calendar className="w-6 h-6" />
  },
  {
    title: "Yêu Nhau",
    date: "Mùa hè 2020",
    description: "Từ những cuộc trò chuyện đơn giản, chúng tôi dần nhận ra rằng chúng tôi là của nhau.",
    image: timeline2,
    icon: <Heart className="w-6 h-6" />
  },
  {
    title: "Lời Cầu Hôn",
    date: "Mùa đông 2023",
    description: "Anh đã quỳ gối và hỏi em câu hỏi quan trọng nhất đời anh. Em đã gật đầu với nước mắt hạnh phúc.",
    image: timeline3,
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    title: "Ngày Cưới",
    date: "Tháng 12, 2025",
    description: "Chúng tôi hân hạnh mời bạn đến chung vui trong ngày trọng đại nhất cuộc đời chúng tôi.",
    image: timeline4,
    icon: <Church className="w-6 h-6" />
  }
];

const Timeline = () => {
  return (
    <section id="timeline" className="section-spacing px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Câu Chuyện Tình Yêu
          </h2>
          <p className="text-muted-foreground text-lg">
            Hành trình từ ngày đầu tiên đến mãi mãi
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform -translate-x-1/2" />

          {milestones.map((milestone, index) => {
            const MilestoneItem = () => {
              const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
              
              return (
                <div
                  ref={ref}
                  key={index}
                  className={`relative mb-16 last:mb-0 transition-all duration-700 ${
                    isVisible 
                      ? index % 2 === 0 
                        ? 'animate-slide-in-left' 
                        : 'animate-slide-in-right'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`bg-card p-6 rounded-2xl shadow-soft hover:shadow-romantic transition-all duration-500 ${
                        isVisible ? 'animate-scale-in' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.15}s` }}>
                        <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          <div className="text-primary">{milestone.icon}</div>
                          <h3 className="text-2xl font-bold text-foreground">{milestone.title}</h3>
                        </div>
                        <p className="text-primary font-medium mb-2">{milestone.date}</p>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Center Dot */}
                    <div className={`hidden md:flex w-4 h-4 bg-primary rounded-full border-4 border-background shadow-romantic z-10 transition-all duration-500 ${
                      isVisible ? 'animate-pulse-glow' : 'opacity-0'
                    }`} 
                    style={{ animationDelay: `${index * 0.2}s` }} />

                    {/* Image */}
                    <div className="flex-1">
                      <div className={`relative overflow-hidden rounded-2xl shadow-romantic group transition-all duration-700 ${
                        isVisible ? 'animate-scale-in' : 'opacity-0 scale-75'
                      }`}
                      style={{ animationDelay: `${index * 0.2}s` }}>
                        <img
                          src={milestone.image}
                          alt={milestone.title}
                          className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            };
            
            return <MilestoneItem key={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
