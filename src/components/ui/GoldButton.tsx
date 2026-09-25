import React from 'react';
import { soundManager } from '../../utils/audio';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  icon
}) => {
  const handleClick = () => {
    if (disabled) return;
    soundManager.playClick();
    if (onClick) onClick();
  };

  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-xs font-bold tracking-wider',
    md: 'min-h-[48px] px-5 py-3 text-sm font-bold tracking-wider',
    lg: 'min-h-[54px] px-6 py-3.5 text-base font-extrabold tracking-widest'
  }[size];

  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = 'bg-gradient-to-r from-[#D4AF37] via-[#F3DA8E] to-[#AA820A] text-[#121214] shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] active:translate-y-0.5 border border-[#FFF0B3]/40';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-[#222228] text-[#F4F4F6] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#2A2A32] active:translate-y-0.5';
  } else if (variant === 'danger') {
    variantClasses = 'bg-gradient-to-r from-[#C62828] to-[#8E0000] text-white shadow-[0_4px_16px_rgba(198,40,40,0.35)] hover:brightness-110 active:translate-y-0.5';
  } else if (variant === 'ghost') {
    variantClasses = 'bg-transparent text-[#D4AF37] hover:bg-[#D4AF37]/10 border border-transparent hover:border-[#D4AF37]/30';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl uppercase transition-all duration-150 select-none ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses} ${variantClasses} ${
        disabled ? 'opacity-40 cursor-not-allowed filter grayscale' : 'cursor-pointer active:scale-[0.98]'
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
