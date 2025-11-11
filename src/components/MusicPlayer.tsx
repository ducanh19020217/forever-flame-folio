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

    const unlockAudio = async () => {
        const a = audioRef.current;
        if (unlockedRef.current || !a) return;
        try {
            if (!a.src) a.src = SAFE_AUDIO_URL;
            await a.play();
            a.pause();
            unlockedRef.current = true;
        } catch {
            // ignore
        }
    };

    // lắng nghe event PAUSE / RESUME từ video
    useEffect(() => {
        const handlePause = () => {
            const a = audioRef.current;
            if (a && !a.paused) {
                a.pause();
                setIsPlaying(false);
            }
        };

        const handleResume = async () => {
            const a = audioRef.current;
            if (!a) return;
            try {
                await unlockAudio();
                await a.play();
                setIsPlaying(true);
            } catch (e) {
                // nếu bị block thì thôi, user tự bấm nút
                console.warn("resume bg music failed", e);
            }
        };

        window.addEventListener("bg-music-pause", handlePause);
        window.addEventListener("bg-music-resume", handleResume);

        return () => {
            window.removeEventListener("bg-music-pause", handlePause);
            window.removeEventListener("bg-music-resume", handleResume);
        };
    }, []);

    // load audio + optional autoplay
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        const onCanPlay = () => setIsLoaded(true);
        a.addEventListener("canplaythrough", onCanPlay, { once: true });
        a.addEventListener("loadedmetadata", onCanPlay, { once: true });

        if (autoPlay) {
            (async () => {
                try {
                    if (!a.src) a.src = SAFE_AUDIO_URL;
                    await a.play();
                    setIsPlaying(true);
                } catch {
                    setIsPlaying(false);
                }
            })();
        }

        return () => {
            a.removeEventListener("canplaythrough", onCanPlay);
            a.removeEventListener("loadedmetadata", onCanPlay);
        };
    }, [autoPlay]);

    const togglePlay = async () => {
        const a = audioRef.current;
        if (!a) return;
        try {
            await unlockAudio();
            if (a.paused) {
                if (!a.src) a.src = SAFE_AUDIO_URL;
                await a.play();
                setIsPlaying(true);
            } else {
                a.pause();
                setIsPlaying(false);
            }
        } catch (err) {
            console.error("Audio play failed:", err);
        }
    };

    if (!isClient) return null;

    return createPortal(
        <>
            <audio ref={audioRef} src={SAFE_AUDIO_URL} preload="auto" loop />

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
                >
                    {isPlaying ? <Volume2 className="w-6 h-6 animate-pulse" /> : <Music className="w-6 h-6" />}
                </Button>
                {isPlaying && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                )}
            </div>
        </>,
        document.body
    );
}
