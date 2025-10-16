import { useState, useRef, useEffect } from "react";
import { Music, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const audioUrl = "/audio/wedding-song.mp3";

    useEffect(() => {
        const audio = new Audio(audioUrl);
        audio.loop = true;
        audio.volume = 0.7;
        audio.preload = "auto";

        audio.addEventListener("canplaythrough", () => {
            setIsLoaded(true);
        });

        audio.addEventListener("error", (e) => {
            console.error("Audio loading error:", e);
        });

        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = "";
            audioRef.current = null;
        };
    }, [audioUrl]);

    const togglePlay = async () => {
        if (!audioRef.current) return;
        try {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                await audioRef.current.play();
                setIsPlaying(true);
                setShowPrompt(false);
            }
        } catch (error) {
            console.error("Audio play failed:", error);
        }
    };

    return (
        <>
            {/* Thông báo mời bật nhạc */}
            {showPrompt && isLoaded && (
                <div className="fixed top-6 right-6 bg-white shadow-lg rounded-xl px-4 py-3 z-50 animate-fade-in">
                    <p className="text-gray-700 font-medium mb-2">
                        🎵 Nhấn để bật nhạc cho không khí thêm lãng mạn nhé!
                    </p>
                    <Button onClick={togglePlay} className="bg-pink-500 hover:bg-pink-600 text-white">
                        Bật nhạc
                    </Button>
                </div>
            )}

            {/* Nút điều khiển nổi */}
            <div className="fixed bottom-8 right-8 z-40">
                <Button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-romantic animate-float"
                    aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
                    disabled={!isLoaded}
                >
                    {isPlaying ? (
                        <Volume2 className="w-6 h-6 animate-pulse" />
                    ) : (
                        <Music className="w-6 h-6" />
                    )}
                </Button>
                {isPlaying && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
                )}
            </div>
        </>
    );
};

export default MusicPlayer;
