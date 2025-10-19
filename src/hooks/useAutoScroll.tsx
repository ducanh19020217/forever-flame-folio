import { useEffect, useRef, useState, RefObject } from 'react';

type BottomStrategy = 'stop' | 'loop' | 'bounce';

interface AutoScrollOptions {
  speed?: number; // pixels per second
  resumeDelayMs?: number;
  enabled?: boolean;
  containerRef?: RefObject<HTMLElement>; // optional: scroll a specific container instead of window
  bottomStrategy?: BottomStrategy;
}

export const useAutoScroll = ({ 
  speed = 50, // px/s
  resumeDelayMs = 2500,
  enabled = true,
  containerRef,
  bottomStrategy = 'stop'
}: AutoScrollOptions = {}) => {
  const [isScrolling, setIsScrolling] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = down, -1 = up (for bounce)
  const timeoutRef = useRef<number>();
  const rafRef = useRef<number>();
  const lastTimestampRef = useRef<number>(0);
  const userScrollDetectedRef = useRef(false);

  // Get scroll element (window or container)
  const getScrollElement = () => {
    return containerRef?.current || window;
  };

  const getScrollTop = () => {
    const element = getScrollElement();
    return element === window 
      ? window.scrollY || document.documentElement.scrollTop
      : (element as HTMLElement).scrollTop;
  };

  const getScrollHeight = () => {
    const element = getScrollElement();
    return element === window
      ? document.documentElement.scrollHeight
      : (element as HTMLElement).scrollHeight;
  };

  const getClientHeight = () => {
    const element = getScrollElement();
    return element === window
      ? window.innerHeight
      : (element as HTMLElement).clientHeight;
  };

  const scrollBy = (delta: number) => {
    const element = getScrollElement();
    if (element === window) {
      window.scrollBy(0, delta);
    } else {
      (element as HTMLElement).scrollTop += delta;
    }
  };

  // Detect scroll interaction listener
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
      userScrollDetectedRef.current = true;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(true);
        userScrollDetectedRef.current = false;
      }, resumeDelayMs);
    };

    // Keyboard handler with specific keys
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', ' ', 'Home', 'End'];
      if (scrollKeys.includes(e.key)) {
        pauseScrolling();
      }
    };

    const handleInteraction = () => {
      pauseScrolling();
    };

    const element = getScrollElement();
    const target = element === window ? window : element;

    // Add passive listeners for better performance
    target.addEventListener('wheel', handleInteraction, { passive: true });
    target.addEventListener('touchstart', handleInteraction, { passive: true });
    target.addEventListener('touchmove', handleInteraction, { passive: true });
    target.addEventListener('scroll', handleInteraction, { passive: true }); // Detects scrollbar drag
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      target.removeEventListener('wheel', handleInteraction);
      target.removeEventListener('touchstart', handleInteraction);
      target.removeEventListener('touchmove', handleInteraction);
      target.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleKeyDown);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, resumeDelayMs, containerRef]);

  // Auto-scroll animation loop
  useEffect(() => {
    if (!isScrolling || !enabled) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTimestampRef.current = 0;
      return;
    }

    const scroll = (timestamp: number) => {
      // Initialize on first frame
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
        rafRef.current = requestAnimationFrame(scroll);
        return;
      }

      // Calculate time-based delta (accounts for throttling/low FPS)
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000; // seconds
      lastTimestampRef.current = timestamp;

      // Skip if delta is too large (tab was throttled/hidden)
      if (deltaTime > 0.1) {
        rafRef.current = requestAnimationFrame(scroll);
        return;
      }

      const scrollTop = getScrollTop();
      const scrollHeight = getScrollHeight();
      const clientHeight = getClientHeight();
      const maxScroll = scrollHeight - clientHeight;

      // Calculate pixel delta based on speed (px/s) and time
      const pixelDelta = speed * deltaTime * direction;

      // Check boundaries
      const atBottom = scrollTop >= maxScroll - 1;
      const atTop = scrollTop <= 1;

      if (atBottom && direction === 1) {
        // Reached bottom
        switch (bottomStrategy) {
          case 'stop':
            setIsScrolling(false);
            return;
          
          case 'loop':
            // Jump to top and continue
            if (getScrollElement() === window) {
              window.scrollTo(0, 0);
            } else {
              (getScrollElement() as HTMLElement).scrollTop = 0;
            }
            break;
          
          case 'bounce':
            // Reverse direction
            setDirection(-1);
            break;
        }
      } else if (atTop && direction === -1) {
        // Reached top (only relevant for bounce)
        setDirection(1);
      } else {
        // Normal scroll
        scrollBy(pixelDelta);
      }
      
      rafRef.current = requestAnimationFrame(scroll);
    };

    rafRef.current = requestAnimationFrame(scroll);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isScrolling, speed, enabled, direction, bottomStrategy, containerRef]);

  return { isScrolling, setIsScrolling };
};
