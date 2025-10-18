import { useEffect, useRef, useState } from 'react';

interface UseIntersectionAppearOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionAppear = ({
  threshold = 0.1,
  rootMargin = '0px 0px -10% 0px',
  triggerOnce = true,
}: UseIntersectionAppearOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            hasTriggered.current = true;
          }
        } else if (!triggerOnce && !hasTriggered.current) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
