import { Timeline } from "antd";
import { WeddingVariant } from "@/config/weddingConfig";
import { UtensilsCrossed, Car, Diamond, Gem } from "lucide-react";


interface WeddingTimelineAntdProps {
    variant: WeddingVariant;
}

const WeddingTimelineAntd = ({ variant }: WeddingTimelineAntdProps) => {
    // map timeline (time/title) -> antd items
    const items = variant.timeline.map(step => ({
        label: (
            <div className="text-[12px] leading-none font-normal text-[rgba(80,50,60,0.7)]">
                {step.time}
            </div>
        ),
        children: (
            <div
                className="text-[13px] leading-snug font-medium"
                style={{ color: variant.themeColor }}
            >
                {step.title}
            </div>
        ),
        color: variant.themeColor,
    }));

    return (
        <div className="mt-4 text-center">
            <div
                className="font-semibold text-[14px] leading-snug mb-4"
                style={{ color: variant.themeColor }}
            >
                Lịch ngày cưới
            </div>

            <div className="flex flex-col items-center gap-2">
                {[
                    { icon: <UtensilsCrossed className="w-4 h-4 text-[#7a2b38]" />, title: "Dùng tiệc ấm cúng", time: "08:00" },
                    { icon: <Car className="w-4 h-4 text-[#7a2b38]" />, title: "Đón dâu", time: "10:00" },
                    { icon: <Gem className="w-4 h-4 text-[#7a2b38]" />, title: "Lễ cưới", time: "11:00" },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between w-[220px] px-1"
                    >
                        {/* Icon + Text */}
                        <div className="flex items-center gap-2">
          <span className="text-[16px]" role="img" aria-label={item.title}>
            {item.icon}
          </span>
                            <span
                                className="text-[13px] font-medium leading-tight"
                                style={{ color: variant.themeColor }}
                            >
            {item.title}
          </span>
                        </div>

                        {/* Time */}
                        <div className="text-[12px] text-[rgba(80,50,60,0.7)] font-normal min-w-[40px] text-right">
                            {item.time}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default WeddingTimelineAntd;
