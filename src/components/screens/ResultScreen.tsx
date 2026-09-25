import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  ArrowRight, 
  Coins, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Share2, 
  ChevronDown, 
  ChevronUp,
  Award
} from 'lucide-react';
import { QuizResult, ScreenType, CategoryId } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { GlassCard } from '../ui/GlassCard';
import { GoldButton } from '../ui/GoldButton';
import { soundManager } from '../../utils/audio';

interface ResultScreenProps {
  result: QuizResult | null;
  onPlayAgain: () => void;
  onNavigateCategories: () => void;
  onNavigateHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onPlayAgain,
  onNavigateCategories,
  onNavigateHome
}) => {
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!result) return;

    // Trigger victory audio
    soundManager.playVictory();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF0B3', '#AA820A', '#FFFFFF']
      });
    } catch {
      // Fallback
    }
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <GlassCard className="p-6">
          <p className="text-white font-bold mb-4">No result recorded.</p>
          <GoldButton onClick={onNavigateHome}>Back to Garage</GoldButton>
        </GlassCard>
      </div>
    );
  }

  const handleShare = () => {
    soundManager.playClick();
    const shareText = `🏎️ I scored ${result.score} pts with ${result.accuracy}% accuracy in Car Quiz Challenge (${result.driverRank})! Can you beat my lap time?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isHighAccuracy = result.accuracy >= 80;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-fade-in select-none">
      {/* Victory Completion Hero Card */}
      <GlassCard glow className="p-6 text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Trophy Badge */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F3DA8E] to-[#AA820A] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.5)] mb-3">
            <Trophy className="w-10 h-10 text-black fill-black" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-[#222228] px-3 py-1 rounded-full border border-[#D4AF37]/30">
            {CATEGORIES[result.category]?.title} • {result.difficulty}
          </span>

          <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tight mt-2 mb-1">
            CIRCUIT COMPLETED
          </h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            Rank: {result.driverRank}
          </div>

          {/* Primary Score Counter */}
          <div className="bg-[#121215] border border-[#D4AF37]/30 rounded-2xl p-4 mb-4">
            <div className="text-[11px] uppercase tracking-widest text-[#9A9A9F]">Total Points Earned</div>
            <div className="font-heading text-5xl font-black text-white tracking-tight my-1 gold-gradient-text">
              +{result.score}
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold">
              <Coins className="w-4 h-4 text-[#D4AF37]" />
              <span>+{result.coinsEarned} Coins Added to Wallet</span>
            </div>
          </div>

          {/* Score Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#16161A] border border-white/5 rounded-xl p-2.5">
              <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider">Correct</div>
              <div className="font-heading text-xl font-bold text-emerald-400">
                {result.correctCount}/{result.totalQuestions}
              </div>
            </div>
            <div className="bg-[#16161A] border border-white/5 rounded-xl p-2.5">
              <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider">Accuracy</div>
              <div className="font-heading text-xl font-bold text-[#D4AF37]">
                {result.accuracy}%
              </div>
            </div>
            <div className="bg-[#16161A] border border-white/5 rounded-xl p-2.5">
              <div className="text-[10px] text-[#9A9A9F] uppercase tracking-wider">Lap Time</div>
              <div className="font-heading text-xl font-bold text-cyan-400">
                {result.timeTakenSeconds}s
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Share Score Button */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full py-2.5 px-4 rounded-xl bg-[#16161A] border border-[#D4AF37]/30 hover:border-[#D4AF37] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] transition-all active:scale-[0.98]"
      >
        <Share2 className="w-4 h-4" />
        <span>{copied ? 'Score Copied to Clipboard!' : 'Share Driver Telemetry'}</span>
      </button>

      {/* Review Answers Accordion */}
      <div className="rounded-2xl bg-[#16161A] border border-[#D4AF37]/20 overflow-hidden">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setShowReview(!showReview);
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#222228]/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-heading text-base font-bold text-white uppercase tracking-wider">
              Telemetry Review ({result.answers.length} Questions)
            </span>
          </div>
          {showReview ? <ChevronUp className="w-5 h-5 text-[#D4AF37]" /> : <ChevronDown className="w-5 h-5 text-[#D4AF37]" />}
        </button>

        {showReview && (
          <div className="p-4 pt-0 space-y-3 divide-y divide-white/5">
            {result.answers.map((ans, idx) => (
              <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white leading-snug">
                    {idx + 1}. {ans.questionText}
                  </span>
                  {ans.isCorrect ? (
                    <span className="flex-shrink-0 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                      Correct
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase">
                      Wrong
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#9A9A9F]">
                  Your answer:{' '}
                  <span className={ans.isCorrect ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {ans.selectedIndex >= 0 ? ans.options[ans.selectedIndex] : 'Time Expired'}
                  </span>
                </div>

                {!ans.isCorrect && (
                  <div className="text-[11px] text-emerald-400">
                    Correct answer: <span className="font-semibold">{ans.options[ans.correctIndex]}</span>
                  </div>
                )}

                <p className="text-[10px] text-[#E4E4E8] bg-[#222228] p-2 rounded-lg leading-relaxed mt-1">
                  💡 {ans.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <GoldButton
          size="lg"
          fullWidth
          onClick={onPlayAgain}
          icon={<RotateCcw className="w-4 h-4 text-black" />}
        >
          RACE AGAIN
        </GoldButton>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onNavigateCategories}
            className="py-3 px-4 rounded-xl bg-[#222228] border border-[#D4AF37]/30 text-white hover:border-[#D4AF37] flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all"
          >
            <span>Other Tracks</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="py-3 px-4 rounded-xl bg-[#222228] border border-[#D4AF37]/30 text-white hover:border-[#D4AF37] flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4 text-[#D4AF37]" />
            <span>Garage Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
