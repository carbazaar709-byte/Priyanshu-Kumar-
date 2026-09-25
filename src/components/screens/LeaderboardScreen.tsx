import React, { useState } from 'react';
import { Trophy, Crown, Flame, Award, Shield, User } from 'lucide-react';
import { LeaderboardPlayer, UserProfile } from '../../types';
import { INITIAL_LEADERBOARD } from '../../data/achievements';
import { GlassCard } from '../ui/GlassCard';
import { soundManager } from '../../utils/audio';

interface LeaderboardScreenProps {
  currentUserProfile: UserProfile;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  currentUserProfile
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'allTime'>('daily');

  const tabs: { id: 'daily' | 'weekly' | 'allTime'; label: string }[] = [
    { id: 'daily', label: 'Daily Grand Prix' },
    { id: 'weekly', label: 'Weekly Circuit' },
    { id: 'allTime', label: 'Hall of Fame' },
  ];

  // Merge current user dynamically into leaderboard
  const basePlayers = INITIAL_LEADERBOARD[activeTab];
  const userScore = currentUserProfile.totalScore;
  const userAccuracy = currentUserProfile.totalAnswered > 0
    ? Math.round((currentUserProfile.totalCorrect / currentUserProfile.totalAnswered) * 100)
    : 85;

  const currentLeaderboard: LeaderboardPlayer[] = [
    ...basePlayers,
    {
      id: 'current-user-lb',
      username: currentUserProfile.username,
      avatar: currentUserProfile.avatar,
      score: userScore > 0 ? userScore : 120,
      accuracy: userAccuracy,
      rank: 0,
      badge: 'You',
      carTitle: 'Your Garage',
      isCurrentUser: true
    }
  ]
    .sort((a, b) => b.score - a.score)
    .map((player, idx) => ({ ...player, rank: idx + 1 }));

  const top3 = currentLeaderboard.slice(0, 3);
  const remaining = currentLeaderboard.slice(3);

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          border: 'border-[#D4AF37]',
          bg: 'bg-gradient-to-b from-[#D4AF37] to-[#AA820A]',
          text: 'text-black',
          crown: '#D4AF37'
        };
      case 2:
        return {
          border: 'border-slate-300',
          bg: 'bg-gradient-to-b from-slate-200 to-slate-400',
          text: 'text-black',
          crown: '#CBD5E1'
        };
      case 3:
        return {
          border: 'border-amber-700',
          bg: 'bg-gradient-to-b from-amber-600 to-amber-800',
          text: 'text-white',
          crown: '#B45309'
        };
      default:
        return {
          border: 'border-[#D4AF37]/20',
          bg: 'bg-[#222228]',
          text: 'text-[#9A9A9F]',
          crown: ''
        };
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-5 animate-fade-in select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider mb-1">
          <Trophy className="w-4 h-4" />
          <span>Global Standings</span>
        </div>
        <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tight">
          CHAMPIONSHIP <span className="gold-gradient-text">PODIUM</span>
        </h2>
        <p className="text-xs text-[#9A9A9F]">
          The fastest minds in automotive trivia. Climb the ranks to earn exclusive titles!
        </p>
      </div>

      {/* Period Segmented Control Tabs */}
      <div className="bg-[#16161A] p-1.5 rounded-2xl border border-[#D4AF37]/20 flex items-center shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id);
              }}
              className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black shadow-md'
                  : 'text-[#9A9A9F] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium Cards */}
      <div className="pt-6 pb-2">
        <div className="grid grid-cols-3 gap-2 items-end">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-14 h-14 rounded-2xl bg-[#16161A] border-2 border-slate-300 flex items-center justify-center text-2xl shadow-lg">
                  {top3[1].avatar}
                </div>
                <div className="absolute -top-3 -right-1 w-6 h-6 rounded-full bg-slate-300 text-black flex items-center justify-center font-bold text-xs shadow-md">
                  2
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-white truncate max-w-[85px] text-center">
                {top3[1].username}
              </span>
              <span className="text-[10px] text-slate-300 font-semibold mt-0.5">
                {top3[1].score} pts
              </span>
              <div className="w-full h-16 bg-[#16161A] border-t-2 border-slate-300 rounded-t-xl mt-2 flex items-center justify-center text-slate-400 font-black text-xs">
                SILVER
              </div>
            </div>
          )}

          {/* 1st Place (Center, Elevated with Gold Crown) */}
          {top3[0] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <Crown className="w-7 h-7 text-[#D4AF37] absolute -top-6 left-1/2 -translate-x-1/2 filter drop-shadow-[0_0_8px_#D4AF37]" />
                <div className="w-16 h-16 rounded-2xl bg-[#16161A] border-2 border-[#D4AF37] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  {top3[0].avatar}
                </div>
                <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-extrabold text-xs shadow-md">
                  1
                </div>
              </div>
              <span className="font-heading text-sm font-black text-white truncate max-w-[95px] text-center">
                {top3[0].username}
              </span>
              <span className="text-xs text-[#D4AF37] font-bold mt-0.5">
                {top3[0].score} pts
              </span>
              <div className="w-full h-24 bg-gradient-to-t from-[#222228] to-[#16161A] border-t-2 border-[#D4AF37] rounded-t-xl mt-2 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <span className="text-[#D4AF37] font-black text-xs tracking-widest">POLE</span>
                <span className="text-[9px] text-[#9A9A9F]">CHAMPION</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-14 h-14 rounded-2xl bg-[#16161A] border-2 border-amber-700 flex items-center justify-center text-2xl shadow-lg">
                  {top3[2].avatar}
                </div>
                <div className="absolute -top-3 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  3
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-white truncate max-w-[85px] text-center">
                {top3[2].username}
              </span>
              <span className="text-[10px] text-amber-500 font-semibold mt-0.5">
                {top3[2].score} pts
              </span>
              <div className="w-full h-12 bg-[#16161A] border-t-2 border-amber-700 rounded-t-xl mt-2 flex items-center justify-center text-amber-600 font-black text-xs">
                BRONZE
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Remaining Leaderboard Players */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9F] px-1">
          Full Grid Classification
        </div>

        {remaining.map((player) => {
          const isUser = player.isCurrentUser;
          return (
            <div
              key={player.id}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isUser
                  ? 'bg-[#16161A] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]/50'
                  : 'bg-[#16161A]/80 border-[#D4AF37]/15 hover:border-[#D4AF37]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-heading text-base font-bold text-[#9A9A9F]">
                  #{player.rank}
                </span>

                <div className="w-9 h-9 rounded-xl bg-[#222228] border border-white/10 flex items-center justify-center text-lg">
                  {player.avatar}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading text-sm font-bold text-white">
                      {player.username}
                    </span>
                    {isUser && (
                      <span className="bg-[#D4AF37] text-black text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#9A9A9F]">
                    {player.carTitle} • {player.accuracy}% Acc
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-heading text-base font-bold text-[#D4AF37]">
                  {player.score} pts
                </div>
                <div className="text-[10px] text-[#9A9A9F] uppercase font-semibold">
                  {player.badge}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
