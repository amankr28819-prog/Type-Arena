import React from 'react';
import { soundEngine } from '../../lib/audio';

export interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  playSound?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  onClick,
  disabled,
  playSound = true,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5'
  }[size];

  const variantClasses = {
    primary: 'btn-3d-primary font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.4)]',
    secondary: 'btn-3d-secondary font-semibold shadow-[0_4px_0_0_rgba(0,0,0,0.4)]',
    ghost: 'btn-3d-ghost font-medium',
    outline: 'bg-transparent border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--color-primary)] font-semibold shadow-[0_3px_0_0_rgba(0,0,0,0.3)]',
    danger: 'bg-gradient-to-b from-rose-500 to-rose-700 text-white font-bold border border-rose-400/30 shadow-[0_4px_0_0_rgba(159,18,57,0.8)]'
  }[variant];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (playSound) {
      try {
        soundEngine.playKeystroke('clicky');
      } catch {}
    }
    onClick?.(e);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`btn-3d ${sizeClasses} ${variantClasses} ${
        disabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none pointer-events-none' : ''
      } ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
