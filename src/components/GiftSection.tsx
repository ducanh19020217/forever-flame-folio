import { Gift, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
    brideBank, brideBankAccount,
    brideFullName,
    brideShortName,
    groomBank, groomBankAccount,
    groomFullName,
    groomShortName
} from "@/config/weddingConfig.ts";

const GiftSection = () => {
    const BankCard = ({
                          side,
                          name,
                          fullName,
                          bank,
                          account,
                          accountName,
                          qrData,
                          delay
                      }: {
        side: "left" | "right";
        name: string;
        fullName: string;
        bank: string;
        account: string;
        accountName: string;
        qrData: string;
        delay: number;
    }) => {
        const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

        return (
            <div
                ref={ref}
                className={[
                    "transition-opacity transition-transform duration-700 ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                ].join(" ")}
                style={{ transitionDelay: `${delay}s` }}
            >
                {/* H-full + flex-col để kéo giãn đều; text-center mặc định, lg:text-left khi lên desktop */}
                <Card className="h-full p-8 text-center lg:text-center shadow-romantic card-hover-effect flex flex-col items-center">
                <div className="mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4 animate-pulse-glow">
                            <CreditCard className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-foreground">
                            {side === "left" ? "Chú Rể" : "Cô Dâu"}
                        </h3>
                        <p className="text-lg text-foreground font-semibold mb-1">{name}</p>
                    </div>

                    {/* ✅ Info: mobile/tablet = 1 cột, text-center; desktop = 2 cột, text-left */}
                    <div className="mb-6 flex-grow lg:text-left text-center space-y-4">
                        <div className="lg:grid lg:grid-cols-[140px_1fr] lg:gap-x-4">
                            <p className="text-sm text-muted-foreground lg:justify-self-start justify-self-center">
                                Ngân hàng
                            </p>
                            <p className="text-base font-medium text-foreground">{bank}</p>
                        </div>
                        <div className="lg:grid lg:grid-cols-[140px_1fr] lg:gap-x-4">
                            <p className="text-sm text-muted-foreground lg:justify-self-start justify-self-center">
                                Số tài khoản
                            </p>
                            <p className="text-base font-medium text-foreground font-mono tracking-wide break-all">
                                {account}
                            </p>
                        </div>
                        <div className="lg:grid lg:grid-cols-[140px_1fr] lg:gap-x-4">
                            <p className="text-sm text-muted-foreground lg:justify-self-start justify-self-center">
                                Chủ tài khoản
                            </p>
                            <p className="text-base font-medium text-foreground">{accountName}</p>
                        </div>
                    </div>

                    {/* QR luôn ở giữa, cố định khung để không đẩy layout */}
                    <div className="bg-muted p-4 rounded-lg image-wrap">
                        <div className="w-48 aspect-square mx-auto">
                            <img
                                src={qrData}
                                alt={`QR Code ${side === "left" ? "Chú Rể" : "Cô Dâu"}`}
                                width={200}
                                height={200}
                                decoding="sync"
                                loading="eager"
                                className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                                style={{
                                    transform: "translateZ(0)",
                                    backfaceVisibility: "hidden",
                                    willChange: "transform",
                                    contain: "paint layout style",
                                }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center lg:text-left">
                            Quét mã QR để chuyển khoản
                        </p>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <section id="gift" className="section-spacing px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 animate-fade-in-up">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        Mừng Cưới
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Sự hiện diện của quý khách là niềm vinh hạnh của chúng tôi.
                        Nếu muốn gửi lời chúc mừng, quý khách có thể chuyển khoản qua thông tin dưới đây.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto items-start justify-center">
                    <BankCard
                        side="left"
                        name={groomShortName}
                        fullName={groomFullName}
                        bank={groomBank}
                        account={groomBankAccount}
                        accountName={groomFullName}
                        qrData="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank:Vietcombank|Account:1234567890|Name:NGUYEN_DUKE_ANH"
                        delay={0.1}
                    />
                    <BankCard
                        side="right"
                        name={brideShortName}
                        fullName={brideFullName}
                        bank={brideBank}
                        account={brideBankAccount}
                        accountName={brideFullName}
                        qrData="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank:Vietcombank|Account:1234567890|Name:NGUYEN_DUKE_ANH"
                        delay={0.1}
                    />
                </div>

            </div>
        </section>
    );
};

export default GiftSection;
