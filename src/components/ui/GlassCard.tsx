import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
        glow
          ? 'border-[#D4AF37] bg-[#16161A]/90 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
          : 'border-[#D4AF37]/20 bg-[#16161A]/80 hover:border-[#D4AF37]/40'
      } backdrop-blur-md ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
      {/* Subtle corner highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent pointer-events-none rounded-bl-full" />
      {children}
    </div>
  );
};
