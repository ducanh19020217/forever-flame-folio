"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Music, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAFE_AUDIO_URL = "/audio/wedding-song.mp3";

function useIsClient() {
    const [ready, setReady] = useState(false);
    useEffect(() => setReady(true), []);
    return ready;
}

interface MusicPlayerProps {
    autoPlay?: boolean;
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
    const isClient = useIsClient();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const unlockedRef = useRef(false);

    // iOS unlock: gọi play() trong một gesture rồi pause ngay
    const unlockAudio = async () => {
        const a = audioRef.current;
        if (unlockedRef.current || !a) return;
        try {
            if (!a.src) a.src = SAFE_AUDIO_URL;
            await a.play();
            a.pause();
            unlockedRef.current = true;
        } catch {
            // bỏ qua: sẽ unlock ở lần bấm kế tiếp
        }
    };

    // Lắng nghe sự kiện load + unlock lần chạm đầu trên iOS
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        const onCanPlay = () => setIsLoaded(true);
        const onError = (e: any) => console.error("Audio error:", e);

        a.addEventListener("canplaythrough", onCanPlay, { once: true });
        a.addEventListener("loadedmetadata", onCanPlay, { once: true });
        a.addEventListener("error", onError);

        const touchUnlock = () => unlockAudio();
        window.addEventListener("touchstart", touchUnlock, { passive: true, once: true });

        return () => {
            a.removeEventListener("canplaythrough", onCanPlay);
            a.removeEventListener("loadedmetadata", onCanPlay);
            a.removeEventListener("error", onError);
            window.removeEventListener("touchstart", touchUnlock);
        };
    }, []);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        const syncIsPlaying = () => setIsPlaying(!a.paused);

        // nếu autoPlay bật
        if (autoPlay) {
            (async () => {
                try {
                    if (!a.src) a.src = SAFE_AUDIO_URL;
                    await a.play();
                } catch {
                    // bị block thì vẫn để isPlaying false
                } finally {
                    syncIsPlaying();
                }
            })();
        } else {
            // nếu autoPlay tắt thì pause audio
            a.pause();
            syncIsPlaying();
        }

        // lắng nghe event play/pause từ audio
        a.addEventListener("play", syncIsPlaying);
        a.addEventListener("pause", syncIsPlaying);

        return () => {
            a.removeEventListener("play", syncIsPlaying);
            a.removeEventListener("pause", syncIsPlaying);
        };
    }, [autoPlay, isLoaded]);

    const togglePlay = async () => {
        const a = audioRef.current;
        if (!a) return;
        try {
            await unlockAudio();

            if (isPlaying) {
                a.pause();
                setIsPlaying(false);
            } else {
                if (!a.src) a.src = SAFE_AUDIO_URL;
                await a.play();
                setIsPlaying(true);
                setShowPrompt(false);
            }
        } catch (err) {
            console.error("Audio play failed:", err);
            // vẫn hiện prompt để user bấm lại
            setShowPrompt(true);
        }
    };

    if (!isClient) return null;

    return createPortal(
        <>
            {/* audio trong DOM để iOS nhận gesture hợp lệ */}
            <audio ref={audioRef} src={SAFE_AUDIO_URL} preload="auto" loop />

            {/* Prompt bật nhạc (không phụ thuộc isLoaded để tránh “mất” trên 1 số trình duyệt) */}
            {/*{showPrompt && (*/}
            {/*    <div*/}
            {/*        className="fixed z-[99999] bg-white text-slate-700 rounded-xl shadow-2xl px-4 py-3"*/}
            {/*        style={{*/}
            {/*            top: `calc(env(safe-area-inset-top, 0px) + 4rem)`,*/}
            {/*            right: `calc(env(safe-area-inset-right, 0px) + 1rem)`,*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <p className="font-medium mb-2">🎵 Nhấn để bật nhạc cho không khí thêm lãng mạn nhé!</p>*/}
            {/*        <Button onClick={togglePlay} className="bg-pink-500 hover:bg-pink-600 text-white">*/}
            {/*            {isPlaying ? "Tắt nhạc" : "Bật nhạc"}*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* Nút nổi: chỉ Tailwind utility, z-index rất cao, safe-area inline */}
            <div
                className="fixed z-[2147483647] pointer-events-auto"
                style={{
                    bottom: `calc(env(safe-area-inset-bottom, 0px) + 2.25rem)`,
                    right: `calc(env(safe-area-inset-right, 0px) + 2.25rem)`,
                }}
            >
                <Button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                    aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
                    disabled={false /* vẫn cho bấm để trigger unlock ngay cả khi chưa isLoaded */}
                >
                    {isPlaying ? <Volume2 className="w-6 h-6 animate-pulse" /> : <Music className="w-6 h-6" />}
                </Button>
                {isPlaying && <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />}
            </div>
        </>,
        document.body
    );
}
