import { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Note: Add your own audio file URL here
  const audioUrl = ""; // Add your audio file path

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.log("Audio play failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Don't render if no audio URL is provided
  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-romantic animate-float"
        aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </Button>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
    </div>
  );
};

export default MusicPlayer;
