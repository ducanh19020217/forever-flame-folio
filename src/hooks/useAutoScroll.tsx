import { useEffect, useRef, useState } from 'react';

interface AutoScrollOptions {
  speed?: number;
  resumeDelay?: number;
  enabled?: boolean;
}

export const useAutoScroll = ({ 
  speed = 0.5, 
  resumeDelay = 2500,
  enabled = true 
}: AutoScrollOptions = {}) => {
  const [isScrolling, setIsScrolling] = useState(true);
  const timeoutRef = useRef<number>();
  const rafRef = useRef<number>();
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsScrolling(false);
      return;
    }

    const pauseScrolling = () => {
      setIsScrolling(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(true);
      }, resumeDelay);
    };

    const handleInteraction = () => {
      pauseScrolling();
    };

    // Add passive listeners for better performance
    window.addEventListener('wheel', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('touchmove', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, resumeDelay]);

  useEffect(() => {
    if (!isScrolling || !enabled) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return;
    }

    let startTime: number | null = null;

    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const scroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      if (window.scrollY >= maxScroll) {
        // Reached bottom, stop auto-scroll
        setIsScrolling(false);
        return;
      }

      const progress = (elapsed % 1000) / 1000;
      const easedProgress = easeInOutQuad(progress);
      
      window.scrollBy(0, speed * easedProgress);
      lastScrollY.current = window.scrollY;
      
      rafRef.current = requestAnimationFrame(scroll);
    };

    rafRef.current = requestAnimationFrame(scroll);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isScrolling, speed, enabled]);

  return { isScrolling, setIsScrolling };
};
