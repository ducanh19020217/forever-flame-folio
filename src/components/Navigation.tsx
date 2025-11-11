import { useState, useEffect, useRef } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Trang Chủ", href: "#home" },
        { label: "Câu Chuyện", href: "#timeline" },
        { label: "Thư Viện", href: "#gallery" },
        { label: "Chi Tiết", href: "#details" },
        { label: "RSVP", href: "#rsvp" },
        { label: "Mừng Cưới", href: "#gift" },
        { label: "Sổ Lưu Bút", href: "#guestbook" },
    ];

    const doScrollWithFix = (el: HTMLElement) => {
        const getTargetTop = () => {
            const navH = navRef.current?.offsetHeight ?? 64;
            return el.offsetTop - navH - 8; // chừa 8px
        };

        // lần 1: cho nó đi ngay lập tức
        window.scrollTo({
            top: getTargetTop(),
            behavior: "smooth",
        });

        // lần 2: sau khi layout có thể đã đẩy xuống (ảnh render, menu đóng...)
        setTimeout(() => {
            window.scrollTo({
                top: getTargetTop(),
                // lần fix này không cần smooth để không thấy nhảy dài
                behavior: "instant" as ScrollBehavior,
            });
        }, 500);
    };

    const scrollToSection = (href: string) => {
        const target = document.querySelector(href) as HTMLElement | null;
        if (!target) return;

        // đóng menu trước để chiều cao nav đúng
        setIsOpen(false);

        // đợi 1 frame để menu đóng xong rồi mới đo
        requestAnimationFrame(() => {
            doScrollWithFix(target);
        });
    };

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-background/100 backdrop-blur-md shadow-soft"
                    : "bg-background/100"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-primary" />
                        <span className="font-serif text-xl font-bold text-foreground">
              Our Wedding
            </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8" style={{
                        fontSize: '18px'
                    }}>
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => scrollToSection(item.href)}
                                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-background border-t border-border animate-fade-in">
                    <div className="px-4 py-4 space-y-3">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => scrollToSection(item.href)}
                                className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary hover:text-primary transition-colors duration-200 rounded-lg"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
