import React from 'react';
import { Volume2, VolumeX, Flame, Coins, ShieldCheck } from 'lucide-react';
import { UserProfile, ScreenType } from '../../types';
import { soundManager } from '../../utils/audio';

interface TopBarProps {
  profile: UserProfile;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onToggleSound: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  currentScreen,
  onNavigate,
  onToggleSound
}) => {
  if (currentScreen === 'splash' || currentScreen === 'quiz') {
    return null; // Immersive full-screen modes
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0C0C0E]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => {
            soundManager.playClick();
            onNavigate('home');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#AA820A] flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.4)]">
            <span className="text-black font-extrabold text-sm tracking-tighter">CQ</span>
          </div>
          <div>
            <div className="font-heading text-base font-bold tracking-wide text-white leading-tight flex items-center gap-1">
              CAR <span className="text-[#D4AF37]">QUIZ</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-[#9A9A9F] -mt-0.5">
              CHALLENGE
            </div>
          </div>
        </div>

        {/* Stats Pill & Controls */}
        <div className="flex items-center gap-2">
          {/* Daily Streak */}
          <div className="flex items-center gap-1 bg-[#16161A] px-2.5 py-1 rounded-full border border-orange-500/30 text-xs font-semibold text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Gold Coins */}
          <div className="flex items-center gap-1 bg-[#16161A] px-2.5 py-1 rounded-full border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
            <Coins className="w-3.5 h-3.5" />
            <span>{profile.coins}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="w-8 h-8 rounded-full bg-[#16161A] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:border-[#D4AF37]/60 active:scale-95 transition-all"
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#9A9A9F]" />
            )}
          </button>

          {/* Driver Avatar / Profile shortcut */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('profile');
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#222228] to-[#16161A] border border-[#D4AF37]/40 flex items-center justify-center text-sm shadow-[0_0_8px_rgba(212,175,55,0.2)] hover:border-[#D4AF37] active:scale-95 transition-all"
          >
            {profile.avatar}
          </button>
        </div>
      </div>
    </header>
  );
};
