import {Calendar, Heart, Sparkles, Church} from "lucide-react";
import timeline1 from "@/assets/timeline-1.jpg";
import T2 from "@/assets/T2.jpg";
import T3 from "@/assets/T3.jpg";
import T4 from "@/assets/T4.jpg";
import A1 from "@/assets/A1.jpg";
import A9 from "@/assets/A9.jpg";
import TL1 from "@/assets/TL1.jpeg";
import timeline3 from "@/assets/timeline-3.jpg";
import timeline4 from "@/assets/timeline-4.jpg";
import {useIntersectionAppear} from "@/hooks/useIntersectionAppear";
import {useRef} from "react";

interface Milestone {
    title: string;
    date: string;
    description: string;
    image: string; // URL ảnh hoặc video
    isVideo?: boolean; // true nếu là video
    icon: JSX.Element;
}

const milestones: Milestone[] = [
    {
        title: "Chúng mình từng...",
        date: "2014",
        description:
            "Chúng mình từng là bạn cùng lớp từ những ngày đầu bước vào lớp 10. Khi ấy, chúng mình còn ngây thơ, hồn nhiên, chẳng để ý đến nhau, và cũng chưa từng nghĩ sẽ có ngày yêu nhau. ",
        image: TL1,
        icon: <Calendar className="w-6 h-6" />,
    },
    {
        title: "Từ tình bạn đến tình yêu",
        date: "2017",
        description:
            "Những ngày tháng ôn thi đại học căng thẳng, chúng mình luôn đồng hành cùng nhau, tình cảm cũng dần lớn lên, từ bạn thân trở thành người thương...",
        image: T2,
        icon: <Heart className="w-6 h-6" />,
    },
    {
        title: "Chặng đường thanh xuân",
        date: "2018–2024",
        description:
            "Trải qua những cột mốc đáng nhớ của cuộc đời, cùng chia sẻ niềm vui và nỗi buồn, có lúc mệt mỏi, vài lần xa cách, nhưng tình yêu vẫn đủ lớn để giữ chúng mình ở lại bên nhau. Tình yêu ấy luôn luôn được tôi luyện qua thời gian, càng ngày càng bền vững và sâu sắc hơn.",
        image: '/audio/video.mp4',
        isVideo: true,
        icon: <Sparkles className="w-6 h-6" />,
    },
    {
        title: "Cầu hôn",
        date: "22-10-2025",
        description:
            "\"Anh không giỏi nói lời ngọt ngào, nhưng điều anh chắc chắn nhất — là muốn đi cùng em qua những ngày tháng tiếp theo.\n" +
            "Mình về chung một nhà nhé!\" \n \"Em đồng ý!\"",
        image: T4,
        icon: <Sparkles className="w-6 h-6" />,
    },
    {
        title: "Lễ ăn hỏi",
        date: "25-11-2025",
        description:
            "Ngày đánh dấu cột mốc quan trọng trong hành trình yêu thương của chúng mình, tình yêu của hai đứa được chứng nhận bằng sự đồng thuận và chúc phúc của gia đình hai bên. Đây không chỉ là nghi lễ kết nối hai họ, mà còn là lời hứa hẹn cho một tương lai trọn vẹn, dài lâu.",
        image: A1,
        icon: <Church className="w-6 h-6" />,
    },
    {
        title: "Ngày chung đôi",
        date: "07-12-2025",
        description:
            "Sau hơn một thập kỷ đồng hành, chúng tôi chính thức nên duyên vợ chồng. Một hành trình dài khép lại bằng lời hứa trọn đời – và mở ra chặng đường hạnh phúc mớiHơn 8 năm không phải là quãng thời gian quá dài, nhưng cũng không quá ngắn, đủ để chúng mình nhận ra nhiều điều. Cuối cùng ngày vui nhất của chúng mình cũng tới. Cảm ơn vì chúng ta đã luôn là một phần trong cuộc sống của nhau. Anh và Em không chỉ là người yêu mà còn là tri kỷ, là bạn đồng hành. Kể từ hôm nay, anh là Chồng, em là Vợ, và chúng ta là Một gia đình.",
        image: A9,
        icon: <Church className="w-6 h-6" />,
    },
];


const Timeline = () => {
    return (
        <section id="timeline" className="section-spacing px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '32px'
                    }}>
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
                                                <p
                                                    className="text-muted-foreground text-justify leading-relaxed tracking-[0.01em]"
                                                    dangerouslySetInnerHTML={{
                                                        __html: milestone.description.replace(/\n/g, "<br/>"),
                                                    }}
                                                ></p>
                                            </div>
                                        </div>

                                        {/* Center Dot */}
                                        <div
                                            className="hidden md:flex w-4 h-4 bg-primary rounded-full border-4 border-background shadow-romantic z-10"/>

                                        {/* Image */}
                                        {/* Media */}
                                        <div className="flex-1">
                                            <div className="image-wrap relative overflow-hidden rounded-2xl shadow-romantic group">
                                                {milestone.isVideo ? (
                                                    <video
                                                        src={milestone.image}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        style={{
                                                            transform: "translateZ(0)",
                                                            backfaceVisibility: "hidden",
                                                            willChange: "transform",
                                                        }}
                                                        loop={false}
                                                        controls
                                                        playsInline
                                                        onPlay={() => {
                                                            window.dispatchEvent(new Event("bg-music-pause"));
                                                        }}
                                                        onPause={() => {
                                                            window.dispatchEvent(new Event("bg-music-resume"));
                                                        }}
                                                        onEnded={() => {
                                                            window.dispatchEvent(new Event("bg-music-resume"));
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={milestone.image}
                                                        alt={milestone.title}
                                                        loading={index < 2 ? "eager" : "lazy"}
                                                        decoding={index < 2 ? "sync" : "async"}
                                                        className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        style={{
                                                            transform: "translateZ(0)",
                                                            backfaceVisibility: "hidden",
                                                            willChange: "transform",
                                                        }}
                                                    />
                                                )}

                                                {/* overlay hover */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
