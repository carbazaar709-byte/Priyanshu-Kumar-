import React, { useState } from 'react';
import { 
  Play, 
  Flame, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { UserProfile, ScreenType, CategoryId, QuizResult } from '../../types';
import { CATEGORY_LIST } from '../../data/categories';
import { GlassCard } from '../ui/GlassCard';
import { GoldButton } from '../ui/GoldButton';
import { soundManager } from '../../utils/audio';

interface HomeScreenProps {
  profile: UserProfile;
  recentHistory: QuizResult[];
  onStartQuiz: (categoryId?: CategoryId) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  recentHistory,
  onStartQuiz,
  onNavigate
}) => {
  const [loading, setLoading] = useState(false);

  // Driver title based on level
  const getDriverTitle = (level: number) => {
    if (level <= 1) return 'Rookie Driver';
    if (level === 2) return 'Street Tuner';
    if (level === 3) return 'Track Specialist';
    if (level === 4) return 'Apex Predator';
    return 'Motorsport Legend';
  };

  const xpCurrent = profile.xp % 150;
  const xpProgress = Math.min((xpCurrent / 150) * 100, 100);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-fade-in select-none">
      {/* Driver Status Card */}
      <GlassCard glow className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#222228] to-[#16161A] border-2 border-[#D4AF37] flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(212,175,55,0.3)]">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-bold text-white tracking-wide">
                  {profile.username}
                </span>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#D4AF37]/40">
                  Lvl {profile.level}
                </span>
              </div>
              <div className="text-xs text-[#9A9A9F] font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                {getDriverTitle(profile.level)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="p-2 rounded-xl bg-[#222228] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Level XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-[#9A9A9F]">
            <span>Level Progress</span>
            <span className="text-[#D4AF37] font-semibold">{xpCurrent} / 150 XP</span>
          </div>
          <div className="w-full h-2 bg-[#0C0C0E] rounded-full overflow-hidden border border-[#D4AF37]/20">
            <div
              className="h-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] rounded-full transition-all duration-500 shadow-[0_0_8px_#D4AF37]"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Featured Daily Challenge Hero Card with Luxury Car Image */}
      <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)] group">
        <div
          className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/18320398/pexels-photo-18320398.jpeg')`
          }}
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/70 to-transparent" />

        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-black" />
              Daily Challenge
            </span>
            <div className="flex items-center gap-1 text-[11px] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-orange-400 border border-orange-500/30">
              <Clock className="w-3 h-3" />
              <span>Resets in 8h</span>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-black text-white uppercase tracking-tight">
              SUPERCAR SUPREMACY
            </h2>
            <p className="text-xs text-[#E4E4E8] line-clamp-1 mb-3">
              10 timed questions on V12 exotics & hypercar engineering. Earn +50 bonus coins!
            </p>

            <GoldButton
              size="md"
              fullWidth
              onClick={() => onStartQuiz('luxury_supercars')}
              icon={<Play className="w-4 h-4 fill-black" />}
            >
              START DAILY RACE
            </GoldButton>
          </div>
        </div>
      </div>

      {/* Quick Play CTA Bar */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onStartQuiz()}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-[#16161A] to-[#222228] border border-[#D4AF37]/40 hover:border-[#D4AF37] active:scale-[0.98] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="text-left">
            <div className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Quick Play
            </div>
            <div className="text-[10px] text-[#9A9A9F]">Random 10 Qs</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('categories')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-[#16161A] to-[#222228] border border-[#D4AF37]/40 hover:border-[#D4AF37] active:scale-[0.98] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Pick Track
            </div>
            <div className="text-[10px] text-[#9A9A9F]">6 Categories</div>
          </div>
        </button>
      </div>

      {/* Category Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#D4AF37] rounded-full" />
            Racing Tracks
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className="text-xs text-[#D4AF37] hover:underline font-semibold uppercase tracking-wider flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORY_LIST.slice(0, 4).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onStartQuiz(cat.id)}
              className="relative h-28 rounded-xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer group active:scale-[0.98] transition-all"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/70 to-transparent" />
              <div className="absolute inset-0 p-2.5 flex flex-col justify-end">
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  Track
                </span>
                <h4 className="font-heading text-sm font-bold text-white leading-tight">
                  {cat.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Statistics Highlights */}
      <div>
        <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#D4AF37] rounded-full" />
          Career Telemetry
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#16161A] border border-[#D4AF37]/20 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider font-semibold">
              Quizzes
            </div>
            <div className="font-heading text-xl font-bold text-white mt-0.5">
              {profile.gamesPlayed}
            </div>
          </div>
          <div className="bg-[#16161A] border border-[#D4AF37]/20 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider font-semibold">
              High Score
            </div>
            <div className="font-heading text-xl font-bold text-[#D4AF37] mt-0.5">
              {profile.highestScore}
            </div>
          </div>
          <div className="bg-[#16161A] border border-[#D4AF37]/20 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider font-semibold">
              Accuracy
            </div>
            <div className="font-heading text-xl font-bold text-emerald-400 mt-0.5">
              {profile.totalAnswered > 0
                ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Recent History or Empty State */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#D4AF37] rounded-full" />
            Recent Laps
          </h3>
        </div>

        {recentHistory.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#222228] flex items-center justify-center text-[#D4AF37] mb-2">
              <Trophy className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-sm font-semibold text-white">No recent game history found.</p>
            <p className="text-xs text-[#9A9A9F] mt-1 mb-4">Start your first quiz to record lap times and scores!</p>
            <GoldButton size="sm" onClick={() => onStartQuiz()}>
              Launch First Quiz
            </GoldButton>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {recentHistory.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#16161A] border border-[#D4AF37]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#222228] flex items-center justify-center font-bold text-[#D4AF37]">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold text-white capitalize">
                      {item.category.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-[#9A9A9F]">
                      {item.correctCount}/{item.totalQuestions} Correct • {item.accuracy}% Accuracy
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-heading text-base font-bold text-[#D4AF37]">
                    +{item.score} pts
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    +{item.coinsEarned} coins
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
