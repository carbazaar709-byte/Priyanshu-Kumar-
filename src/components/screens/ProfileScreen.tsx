import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Trophy, 
  RotateCcw, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Zap, 
  Coins, 
  Flame,
  Star
} from 'lucide-react';
import { UserProfile, ScreenType, Achievement } from '../../types';
import { DEFAULT_ACHIEVEMENTS } from '../../data/achievements';
import { GlassCard } from '../ui/GlassCard';
import { GoldButton } from '../ui/GoldButton';
import { soundManager } from '../../utils/audio';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (screen: ScreenType) => void;
  onResetStats: () => void;
}

const AVATAR_OPTIONS = ['🏎️', '🚙', '⚡', '🔥', '👑', '🏁', '🏆', '🚀', '🚗', '🛠️'];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  onResetStats
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [usernameInput, setUsernameInput] = useState(profile.username);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSaveName = () => {
    if (!usernameInput.trim()) return;
    soundManager.playClick();
    onUpdateProfile({
      ...profile,
      username: usernameInput.trim()
    });
    setIsEditingName(false);
  };

  const handleSelectAvatar = (av: string) => {
    soundManager.playClick();
    onUpdateProfile({
      ...profile,
      avatar: av
    });
    setShowAvatarPicker(false);
  };

  const handleToggleSound = () => {
    const nextVal = !profile.soundEnabled;
    soundManager.setPreferences(nextVal, profile.hapticEnabled);
    if (nextVal) soundManager.playClick();
    onUpdateProfile({
      ...profile,
      soundEnabled: nextVal
    });
  };

  const handleToggleHaptic = () => {
    const nextVal = !profile.hapticEnabled;
    soundManager.setPreferences(profile.soundEnabled, nextVal);
    if (nextVal) soundManager.vibrate([40]);
    onUpdateProfile({
      ...profile,
      hapticEnabled: nextVal
    });
  };

  const accuracy = profile.totalAnswered > 0
    ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
    : 0;

  const winRate = profile.gamesPlayed > 0
    ? Math.round((profile.unlockedAchievements.length / DEFAULT_ACHIEVEMENTS.length) * 100)
    : 0;

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-5 animate-fade-in select-none">
      {/* Profile Banner */}
      <GlassCard glow className="p-5 relative">
        <div className="flex items-center gap-4">
          {/* Avatar with tap to change */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowAvatarPicker(!showAvatarPicker);
              }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#222228] to-[#16161A] border-2 border-[#D4AF37] flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all"
            >
              {profile.avatar}
            </button>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-[10px]">
              <Edit3 className="w-3 h-3" />
            </div>
          </div>

          {/* Username & Level */}
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  maxLength={18}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="bg-[#0C0C0E] border border-[#D4AF37] text-white px-2.5 py-1 rounded-lg text-sm font-bold uppercase w-full outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-1.5 rounded-lg bg-[#D4AF37] text-black"
                >
                  <Check className="w-4 h-4 font-bold" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-heading text-xl font-bold text-white uppercase tracking-wide">
                  {profile.username}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-[#9A9A9F] hover:text-[#D4AF37]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
              <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2 py-0.5 rounded-md uppercase text-[10px]">
                Level {profile.level}
              </span>
              <span>{profile.xp} Career XP</span>
            </div>
          </div>
        </div>

        {/* Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 animate-fade-in">
            <span className="text-[10px] uppercase font-bold text-[#9A9A9F] tracking-wider block mb-2">
              Choose Driver Helmet / Mascot
            </span>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                    profile.avatar === av
                      ? 'bg-[#D4AF37]/30 border-2 border-[#D4AF37]'
                      : 'bg-[#222228] border border-white/10 hover:border-[#D4AF37]/50'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Career Telemetry Statistics Grid */}
      <div>
        <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#D4AF37] rounded-full" />
          Driver Statistics
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#16161A] border border-[#D4AF37]/20 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222228] flex items-center justify-center text-[#D4AF37]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider">Total Points</div>
              <div className="font-heading text-xl font-bold text-white">{profile.totalScore}</div>
            </div>
          </div>

          <div className="bg-[#16161A] border border-[#D4AF37]/20 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222228] flex items-center justify-center text-emerald-400">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider">High Score</div>
              <div className="font-heading text-xl font-bold text-[#D4AF37]">{profile.highestScore}</div>
            </div>
          </div>

          <div className="bg-[#16161A] border border-[#D4AF37]/20 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222228] flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider">Accuracy</div>
              <div className="font-heading text-xl font-bold text-white">{accuracy}%</div>
            </div>
          </div>

          <div className="bg-[#16161A] border border-[#D4AF37]/20 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222228] flex items-center justify-center text-[#D4AF37]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider">Wallet Coins</div>
              <div className="font-heading text-xl font-bold text-[#D4AF37]">{profile.coins}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Automotive Achievements */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#D4AF37] rounded-full" />
            Trophy Room ({profile.unlockedAchievements.length}/{DEFAULT_ACHIEVEMENTS.length})
          </h3>
        </div>

        <div className="space-y-2">
          {DEFAULT_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = profile.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-[#16161A] border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                    : 'bg-[#121215]/80 border-white/5 opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    isUnlocked
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                      : 'bg-[#222228] text-[#9A9A9F]'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-white uppercase">
                      {ach.title}
                    </span>
                    {isUnlocked && (
                      <span className="text-[9px] bg-[#D4AF37] text-black font-extrabold uppercase px-1.5 py-0.2 rounded">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9A9A9F] leading-tight mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audio & Haptic Hardware Settings */}
      <div className="rounded-2xl bg-[#16161A] border border-[#D4AF37]/20 p-4 space-y-3">
        <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-full" />
          Hardware & Sound Settings
        </h4>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#222228] flex items-center justify-center text-[#D4AF37]">
              {profile.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Engine & SFX Audio</div>
              <div className="text-[10px] text-[#9A9A9F]">Real-time synthesized chime, rev & buzz</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              profile.soundEnabled ? 'bg-[#D4AF37]' : 'bg-[#222228]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                profile.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Haptic Feedback Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#222228] flex items-center justify-center text-[#D4AF37]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Haptic Feedback</div>
              <div className="text-[10px] text-[#9A9A9F]">Tactile vibration on tap and answer reveal</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleHaptic}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              profile.hapticEnabled ? 'bg-[#D4AF37]' : 'bg-[#222228]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                profile.hapticEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Admin Shortcut */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="text-xs text-[#D4AF37] hover:underline font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Question Pit Stop (Admin)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all career statistics and achievements?')) {
                onResetStats();
              }
            }}
            className="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
};
