import { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Beautiful in White - Shane Filan (Wedding Song)
  // Note: Please add your own licensed audio file URL here
  // You can upload the song to your hosting or use a legal streaming service
  const audioUrl = "https://cdn.pixabay.com/audio/2022/03/10/audio_2c87ba19c9.mp3"; // Placeholder romantic music

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "auto";
    
    // Add event listeners
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });
    
    audio.addEventListener('error', (e) => {
      console.error("Audio loading error:", e);
    });
    
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Reset the audio to start if it's ended
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio play failed:", error);
      // Try to reload the audio
      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  };

  return (
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
  );
};

export default MusicPlayer;
