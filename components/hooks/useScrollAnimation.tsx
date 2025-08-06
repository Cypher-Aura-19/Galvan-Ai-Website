import { useEffect, useState } from 'react';

export const useScrollAnimation = (elementRef: React.RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the timeline is visible
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Progress calculation based on scroll position
      const scrolled = Math.max(0, windowHeight - elementTop);
      const maxScroll = windowHeight + elementHeight;
      const scrollProgress = Math.min(100, (scrolled / maxScroll) * 100);
      
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef]);

  return { progress };
};