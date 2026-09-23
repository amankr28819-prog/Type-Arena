import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fadeUp' | 'fadeScale' | 'slideIn' | 'depthSettle';
  delayMs?: number;
  className?: string;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeUp',
  delayMs = 0,
  className = '',
  threshold = 0.1
}) => {
  const { settings } = useSettings();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (settings.reducedMotion || settings.animationIntensity === 'off') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, settings.reducedMotion, settings.animationIntensity]);

  const animationStyles: Record<string, { hidden: string; visible: string }> = {
    fadeUp: {
      hidden: 'opacity-0 translate-y-6',
      visible: 'opacity-100 translate-y-0'
    },
    fadeScale: {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100'
    },
    slideIn: {
      hidden: 'opacity-0 -translate-x-6',
      visible: 'opacity-100 translate-x-0'
    },
    depthSettle: {
      hidden: 'opacity-0 translate-y-8 scale-90 blur-sm',
      visible: 'opacity-100 translate-y-0 scale-100 blur-0'
    }
  };

  const anim = animationStyles[animation];

  return (
    <div
      ref={elementRef}
      style={{
        transitionDuration: '0.4s',
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.3, 1)'
      }}
      className={`transition-all ${isVisible ? anim.visible : anim.hidden} ${className}`}
    >
      {children}
    </div>
  );
};
