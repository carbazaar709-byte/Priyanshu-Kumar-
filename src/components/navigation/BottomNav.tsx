import React from 'react';
import { Home, Layers, Trophy, User, Settings } from 'lucide-react';
import { ScreenType } from '../../types';
import { soundManager } from '../../utils/audio';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate
}) => {
  // Hide nav during splash screen and active quiz game for full immersion
  if (currentScreen === 'splash' || currentScreen === 'quiz') {
    return null;
  }

  const navItems: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Garage',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'categories',
      label: 'Tracks',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'leaderboard',
      label: 'Podium',
      icon: <Trophy className="w-5 h-5" />
    },
    {
      id: 'profile',
      label: 'Driver',
      icon: <User className="w-5 h-5" />
    },
    {
      id: 'admin',
      label: 'Pit Stop',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C0C0E]/95 backdrop-blur-lg border-t border-[#D4AF37]/20 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigate(item.id);
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-[#D4AF37] font-semibold'
                  : 'text-[#9A9A9F] hover:text-[#F4F4F6]'
              }`}
            >
              {/* Active top glow indicator */}
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]" />
              )}
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] tracking-wider uppercase font-medium mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
