import React, { useState, useRef, useCallback } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number; // Maximum tilt angle in degrees (default: 8)
  glare?: boolean;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 8,
  glare = true,
  className = '',
  ...props
}) => {
  const { settings } = useSettings();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (settings.reducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1

      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - y) * (maxTilt * 2);

      setTilt({ rotateX, rotateY });
      setGlarePos({ x: x * 100, y: y * 100, opacity: 0.25 });
    },
    [maxTilt, settings.reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: settings.reducedMotion
          ? 'none'
          : `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease'
      }}
      className={`relative rounded-3xl ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Specular Glare Reflection */}
      {glare && !settings.reducedMotion && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18), transparent 70%)`,
            opacity: glarePos.opacity
          }}
        />
      )}
    </div>
  );
};
