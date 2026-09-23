import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  interactive?: boolean;
  maxTilt?: number;
  glow?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  glass = false,
  interactive = true,
  maxTilt = 5,
  glow = true,
  className = '',
  style,
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true);
    }
  }, []);

  const canTilt = interactive && settings.cardTilt && !settings.reducedMotion && !isTouchDevice && settings.animationIntensity !== 'off';

  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setMousePos({ x: percentX, y: percentY });

    const tiltX = ((y / rect.height) - 0.5) * -maxTilt;
    const tiltY = ((x / rect.width) - 0.5) * maxTilt;
    setTilt({ x: tiltX, y: tiltY });
    setIsHovered(true);

    onMouseMove?.(e);
  }, [canTilt, maxTilt, onMouseMove]);

  const handlePointerLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  const tiltTransform = canTilt && isHovered
    ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-4px)`
    : undefined;

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={{
        transform: tiltTransform,
        ...style
      }}
      className={`card-3d relative overflow-hidden ${glass ? 'card-3d-glass' : ''} ${className}`}
      {...props}
    >
      {/* Specular Mouse Spotlight Highlight */}
      {isHovered && glow && canTilt && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-60"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, var(--theme-glow, rgba(56, 189, 248, 0.15)), transparent 70%)`
          }}
        />
      )}

      {/* Card Content Surface */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
