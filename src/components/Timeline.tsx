import {Calendar, Heart, Sparkles, Church} from "lucide-react";
import timeline1 from "@/assets/timeline-1.jpg";
import timeline2 from "@/assets/timeline-2.jpg";
import timeline3 from "@/assets/timeline-3.jpg";
import timeline4 from "@/assets/timeline-4.jpg";
import {useIntersectionAppear} from "@/hooks/useIntersectionAppear";
import {useRef} from "react";

interface Milestone {
    title: string;
    date: string;
    description: string;
    image: string;
    icon: React.ReactNode;
}

const milestones: Milestone[] = [
    {
        title: "Thuở Ban Đầu",
        date: "Năm 2014",
        description:
            "Chúng tôi gặp nhau khi còn là những cô cậu học trò lớp 10. Khi ấy, mọi thứ đều ngây ngô, hồn nhiên, thậm chí còn thờ ơ, chẳng mảy may để ý đến nhau.",
        image: timeline1,
        icon: <Calendar className="w-6 h-6" />,
    },
    {
        title: "Tình Yêu Tuổi Học Trò",
        date: "Năm 2017",
        description:
            "Sau năm lớp 12, sau những năm tháng đồng hành cùng nhau trên ghế nhà trường, tình cảm dần lớn lên, từ bạn thân trở thành người thương. Đó là khởi đầu cho hành trình yêu thương sẽ là dài nhất cuộc đời.",
        image: timeline2,
        icon: <Heart className="w-6 h-6" />,
    },
    {
        title: "Chặng Đường Thanh Xuân",
        date: "2018 – 2024",
        description:
            "Suốt những năm tháng trưởng thành, chúng tôi cùng nhau đi qua biết bao chông gai, thăng trầm, vui buồn. Có lúc mệt mỏi, có khi xa cách, nhưng tình yêu vẫn luôn đủ lớn để giữ chúng tôi bên nhau. Tình cảm ấy được tôi luyện qua thời gian, càng ngày càng vững bền và sâu sắc hơn.",
        image: timeline3,
        icon: <Sparkles className="w-6 h-6" />,
    },
    {
        title: "Lời Cầu Hôn",
        date: "Tháng 10, 2025",
        description:
            "Một buổi chiều mùa thu đầy cảm xúc, anh trao chiếc nhẫn và lời hứa trọn đời. Khoảnh khắc ấy, mọi kỷ ùa về – và chúng tôi biết, đây chính là ‘mãi mãi’.",
        image: timeline3,
        icon: <Sparkles className="w-6 h-6" />,
    },
    {
        title: "Lễ Ăn Hỏi",
        date: "26 Tháng 11, 2025",
        description:
            "Ngày ra mắt hai gia đình – đầy ấm cúng và thiêng liêng. Một cột mốc quan trọng, đánh dấu bước chuyển mình từ hai người yêu thành hai gia đình gắn bó.",
        image: timeline4,
        icon: <Church className="w-6 h-6" />,
    },
    {
        title: "Ngày Cưới",
        date: "07 Tháng 12, 2025",
        description:
            "Sau hơn một thập kỷ đồng hành, chúng tôi chính thức nên duyên vợ chồng. Một hành trình dài khép lại bằng lời hứa trọn đời – và mở ra chặng đường hạnh phúc mới.",
        image: timeline4,
        icon: <Church className="w-6 h-6" />,
    },
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
                    <div
                        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform -translate-x-1/2"/>

                    {milestones.map((milestone, index) => {
                        const MilestoneItem = () => {
                            const {ref, isVisible} = useIntersectionAppear({threshold: 0.2});
                            const isEven = index % 2 === 0;
                            // nhớ trạng thái "đã hiện rồi"
                            const everVisibleRef = useRef(false);
                            if (isVisible && !everVisibleRef.current) {
                                everVisibleRef.current = true;
                            }

                            // Nếu đã hiện rồi ít nhất một lần, thì giữ luôn trạng thái hiện
                            const shown = everVisibleRef.current || isVisible;

                            return (
                                <div
                                    ref={ref as React.RefObject<HTMLDivElement>}
                                    className={`
        mb-16 last:mb-0
        transition-opacity transition-transform duration-700 ease-out
        ${shown ? 'opacity-100 translate-x-0' : (index % 2 === 0 ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8')}
      `}
                                    style={{
                                        // bỏ stagger delay khi auto-scroll vì nó gây giật
                                        transitionDelay: shown ? '0ms' : `${index * 150}ms`,
                                        // chỉ bật willChange trong giai đoạn chưa hiện -> browser tối ưu đúng lúc cần
                                        willChange: shown ? 'auto' : 'opacity, transform'
                                    }}
                                >
                                    <div className={`flex flex-col md:flex-row gap-8 items-center ${
                                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}>
                                        {/* Content */}
                                        <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                            <div
                                                className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-romantic transition-all duration-500">
                                                <div
                                                    className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                                    <div className="text-primary">{milestone.icon}</div>
                                                    <h3 className="text-2xl font-bold text-foreground">{milestone.title}</h3>
                                                </div>
                                                <p className="text-primary font-medium mb-2">{milestone.date}</p>
                                                <p className="text-muted-foreground">{milestone.description}</p>
                                            </div>
                                        </div>

                                        {/* Center Dot */}
                                        <div
                                            className="hidden md:flex w-4 h-4 bg-primary rounded-full border-4 border-background shadow-romantic z-10"/>

                                        {/* Image */}
                                        <div className="flex-1">
                                            <div
                                                className="image-wrap relative overflow-hidden rounded-2xl shadow-romantic group">
                                                <img
                                                    src={milestone.image}
                                                    alt={milestone.title}
                                                    loading={index < 2 ? "eager" : "lazy"}
                                                    decoding={index < 2 ? "sync" : "async"}
                                                    width={800}
                                                    height={600}
                                                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                                                    style={{
                                                        transform: "translateZ(0)",
                                                        backfaceVisibility: "hidden",
                                                        willChange: "transform",
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        };

                        return <MilestoneItem key={index}/>;
                    })}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
