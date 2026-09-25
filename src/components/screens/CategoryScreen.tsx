import React, { useState } from 'react';
import { 
  Play, 
  Flame, 
  Crown, 
  Compass, 
  Zap, 
  Shield, 
  Wrench, 
  Sparkles,
  Gauge
} from 'lucide-react';
import { CategoryId, Difficulty } from '../../types';
import { CATEGORY_LIST } from '../../data/categories';
import { GlassCard } from '../ui/GlassCard';
import { GoldButton } from '../ui/GoldButton';
import { soundManager } from '../../utils/audio';

interface CategoryScreenProps {
  onSelectCategory: (categoryId: CategoryId, difficulty: Difficulty) => void;
  questionCounts?: Record<CategoryId, number>;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  onSelectCategory,
  questionCounts
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [selectedCatId, setSelectedCatId] = useState<CategoryId>('indian_cars');

  const difficulties: { id: Difficulty; label: string; multiplier: string; color: string }[] = [
    { id: 'easy', label: 'Easy', multiplier: '1.0x PTS', color: 'text-emerald-400' },
    { id: 'medium', label: 'Medium', multiplier: '1.5x PTS', color: 'text-[#D4AF37]' },
    { id: 'hard', label: 'Hard', multiplier: '2.0x PTS', color: 'text-red-400' },
  ];

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'indian_cars': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'luxury_supercars': return <Crown className="w-5 h-5 text-[#D4AF37]" />;
      case 'suvs_offroad': return <Compass className="w-5 h-5 text-amber-500" />;
      case 'evs_future': return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'brands_logos': return <Shield className="w-5 h-5 text-yellow-500" />;
      case 'mechanics_tech': return <Wrench className="w-5 h-5 text-[#D4AF37]" />;
      default: return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  const handleStart = (catId: CategoryId) => {
    soundManager.playEngineRev();
    onSelectCategory(catId, selectedDifficulty);
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-5 animate-fade-in select-none">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider mb-1">
          <Gauge className="w-4 h-4" />
          <span>Select Your Circuit</span>
        </div>
        <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tight">
          CHOOSE <span className="gold-gradient-text">CATEGORY</span>
        </h2>
        <p className="text-xs text-[#9A9A9F]">
          Pick an automotive domain and difficulty rating to race against the 15-second clock.
        </p>
      </div>

      {/* Difficulty Selector Tabs */}
      <div className="bg-[#16161A] p-1.5 rounded-2xl border border-[#D4AF37]/20 flex items-center gap-1 shadow-inner">
        {difficulties.map((diff) => {
          const isSelected = selectedDifficulty === diff.id;
          return (
            <button
              key={diff.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedDifficulty(diff.id);
              }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-extrabold shadow-md'
                  : 'text-[#9A9A9F] hover:text-white'
              }`}
            >
              <div className="text-xs uppercase tracking-wider">{diff.label}</div>
              <div
                className={`text-[9px] font-semibold ${
                  isSelected ? 'text-black/80' : diff.color
                }`}
              >
                {diff.multiplier}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2-Column Immersive Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {CATEGORY_LIST.map((cat) => {
          const isSelected = selectedCatId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCatId(cat.id);
              }}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer flex flex-col justify-between h-44 ${
                isSelected
                  ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                  : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
              }`}
            >
              {/* High-res automotive imagery */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                style={{ backgroundImage: `url(${cat.imageUrl})` }}
              />
              {/* 3-stop vertical gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/75 to-black/30" />

              {/* Card Top: Icon & Badge */}
              <div className="relative z-10 p-3 flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  {getCategoryIcon(cat.id)}
                </div>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                )}
              </div>

              {/* Card Bottom: Titles & Quick Start */}
              <div className="relative z-10 p-3">
                <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-bold block mb-0.5">
                  10 Questions
                </span>
                <h3 className="font-heading text-base font-bold text-white leading-tight uppercase mb-1">
                  {cat.title}
                </h3>
                <p className="text-[10px] text-[#9A9A9F] line-clamp-1 leading-snug">
                  {cat.subtitle}
                </p>

                {/* Instant Tap to Launch Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStart(cat.id);
                  }}
                  className="mt-2.5 w-full min-h-[36px] bg-[#D4AF37] text-black text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#F3DA8E] active:scale-95 transition-all shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  RACE NOW
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Overview Card for Selected */}
      {selectedCatId && (
        <GlassCard className="p-4 border-[#D4AF37]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#222228] border border-[#D4AF37]/40 flex items-center justify-center">
                {getCategoryIcon(selectedCatId)}
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white uppercase leading-tight">
                  {CATEGORY_LIST.find((c) => c.id === selectedCatId)?.title}
                </h4>
                <p className="text-xs text-[#9A9A9F]">
                  {CATEGORY_LIST.find((c) => c.id === selectedCatId)?.tagline}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
            <div className="text-xs text-[#9A9A9F]">
              Difficulty: <span className="font-bold text-[#D4AF37] uppercase">{selectedDifficulty}</span>
            </div>
            <GoldButton
              size="sm"
              onClick={() => handleStart(selectedCatId)}
              icon={<Play className="w-3.5 h-3.5 fill-black" />}
            >
              LAUNCH TRACK
            </GoldButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
