import { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Beautiful in White - Shane Filan (Wedding Song)
  // Note: Please add your own licensed audio file URL here
  // You can upload the song to your hosting or use a legal streaming service
  const audioUrl = "https://cdn.pixabay.com/audio/2022/03/10/audio_2c87ba19c9.mp3"; // Placeholder romantic music

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

  // Always render the music player

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
