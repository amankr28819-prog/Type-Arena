import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

export interface PageTransitionProps {
  activeKey: string;
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  activeKey,
  children,
  className = ''
}) => {
  const { settings } = useSettings();
  const [displayedKey, setDisplayedKey] = useState(activeKey);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (activeKey !== displayedKey) {
      if (settings.reducedMotion || settings.animationIntensity === 'off') {
        setDisplayedKey(activeKey);
        return;
      }

      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedKey(activeKey);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [activeKey, displayedKey, settings.reducedMotion, settings.animationIntensity]);

  return (
    <div
      key={displayedKey}
      className={`w-full flex-1 flex flex-col ${
        isTransitioning
          ? 'animate-section-exit pointer-events-none'
          : 'animate-section-enter'
      } ${className}`}
    >
      {children}
    </div>
  );
};
