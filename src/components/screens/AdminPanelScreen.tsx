import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Filter, 
  Database, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Question, CategoryId, Difficulty } from '../../types';
import { CATEGORIES, CATEGORY_LIST } from '../../data/categories';
import { GlassCard } from '../ui/GlassCard';
import { GoldButton } from '../ui/GoldButton';
import { soundManager } from '../../utils/audio';

interface AdminPanelScreenProps {
  questions: Question[];
  onAddQuestion: (newQ: Omit<Question, 'id'>) => void;
  onUpdateQuestion: (updatedQ: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onResetQuestions: () => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onResetQuestions
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<CategoryId>('indian_cars');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('medium');
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const openAddModal = () => {
    soundManager.playClick();
    setEditingQuestion(null);
    setFormCategory('indian_cars');
    setFormDifficulty('medium');
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanation('');
    setFormImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    soundManager.playClick();
    setEditingQuestion(q);
    setFormCategory(q.category);
    setFormDifficulty(q.difficulty);
    setFormQuestion(q.question);
    setFormOptions([...q.options]);
    setFormCorrectIndex(q.correctIndex);
    setFormExplanation(q.explanation);
    setFormImageUrl(q.carImage || '');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formQuestion.trim()) {
      alert('Please provide question text.');
      return;
    }

    if (formOptions.some((opt) => !opt.trim())) {
      alert('Please fill out all 4 answer options.');
      return;
    }

    soundManager.playClick();

    if (editingQuestion) {
      onUpdateQuestion({
        ...editingQuestion,
        category: formCategory,
        difficulty: formDifficulty,
        question: formQuestion.trim(),
        options: formOptions.map((o) => o.trim()),
        correctIndex: formCorrectIndex,
        explanation: formExplanation.trim() || 'Automotive trivia detail.',
        carImage: formImageUrl.trim() || undefined
      });
    } else {
      onAddQuestion({
        category: formCategory,
        difficulty: formDifficulty,
        question: formQuestion.trim(),
        options: formOptions.map((o) => o.trim()),
        correctIndex: formCorrectIndex,
        explanation: formExplanation.trim() || 'Automotive trivia detail.',
        carImage: formImageUrl.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4 animate-fade-in select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          <span>Question Telemetry & Pit Stop</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tight">
            ADMIN <span className="gold-gradient-text">PANEL</span>
          </h2>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 font-black" />
            <span>Add Question</span>
          </button>
        </div>
        <p className="text-xs text-[#9A9A9F] mt-1">
          Manage, inspect, and expand live automotive questions across all racing tracks.
        </p>
      </div>

      {/* Database Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#16161A] border border-[#D4AF37]/20 p-2.5 rounded-xl text-center">
          <div className="text-[10px] text-[#9A9A9F] uppercase font-semibold">Total Questions</div>
          <div className="font-heading text-xl font-bold text-white mt-0.5">{questions.length}</div>
        </div>
        <div className="bg-[#16161A] border border-[#D4AF37]/20 p-2.5 rounded-xl text-center">
          <div className="text-[10px] text-[#9A9A9F] uppercase font-semibold">Filtered</div>
          <div className="font-heading text-xl font-bold text-[#D4AF37] mt-0.5">
            {filteredQuestions.length}
          </div>
        </div>
        <div className="bg-[#16161A] border border-[#D4AF37]/20 p-2.5 rounded-xl text-center">
          <div className="text-[10px] text-[#9A9A9F] uppercase font-semibold">Custom Added</div>
          <div className="font-heading text-xl font-bold text-emerald-400 mt-0.5">
            {questions.filter((q) => q.isCustom).length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9A9A9F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16161A] border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#9A9A9F] outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9F] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#D4AF37] text-black shadow-sm'
                : 'bg-[#16161A] text-[#9A9A9F] border border-white/5'
            }`}
          >
            All Tracks
          </button>
          {CATEGORY_LIST.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'bg-[#16161A] text-[#9A9A9F] border border-white/5'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards List */}
      {filteredQuestions.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <HelpCircle className="w-10 h-10 mx-auto text-[#9A9A9F] mb-2 opacity-50" />
          <p className="text-sm font-bold text-white uppercase">No Questions Found</p>
          <p className="text-xs text-[#9A9A9F] mt-1 mb-4">
            Try adjusting your search query or add a brand new question below.
          </p>
          <GoldButton size="sm" onClick={openAddModal}>
            Add Question Now
          </GoldButton>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-[#16161A] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] bg-[#222228] text-[#D4AF37] px-2 py-0.5 rounded font-bold uppercase">
                    {CATEGORIES[q.category]?.title}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      q.difficulty === 'hard'
                        ? 'bg-red-500/20 text-red-400'
                        : q.difficulty === 'medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  {q.isCustom && (
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded font-bold uppercase">
                      Custom
                    </span>
                  )}
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(q)}
                    className="p-1.5 rounded-lg bg-[#222228] text-white hover:text-[#D4AF37] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this question from database?')) {
                        soundManager.playClick();
                        onDeleteQuestion(q.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#222228] text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h4 className="font-heading text-sm font-bold text-white leading-snug">
                {idx + 1}. {q.question}
              </h4>

              {/* 4 Options Preview */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctIndex;
                  return (
                    <div
                      key={oIdx}
                      className={`p-1.5 rounded-lg truncate ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                          : 'bg-[#222228] text-[#9A9A9F]'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </div>
                  );
                })}
              </div>

              {/* Explanation note */}
              {q.explanation && (
                <div className="text-[10px] text-[#9A9A9F] bg-[#121215] p-2 rounded-lg leading-relaxed">
                  💡 {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Database Reset Action */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#9A9A9F]">
        <span>Need fresh factory data?</span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset question database to default questions?')) {
              soundManager.playClick();
              onResetQuestions();
            }
          }}
          className="text-[#D4AF37] hover:underline font-bold uppercase flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Factory Questions</span>
        </button>
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#16161A] border border-[#D4AF37] rounded-2xl max-w-sm w-full p-5 shadow-[0_0_30px_rgba(212,175,55,0.3)] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-4">
              <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#9A9A9F] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5">
              {/* Category Select */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A9F] block mb-1">
                  Category Track
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                  className="w-full bg-[#0C0C0E] border border-[#D4AF37]/30 text-white text-xs rounded-xl p-2.5 outline-none font-semibold"
                >
                  {CATEGORY_LIST.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#16161A]">
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Select */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A9F] block mb-1">
                  Difficulty Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormDifficulty(d)}
                      className={`py-2 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        formDifficulty === d
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-[#222228] text-[#9A9A9F]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A9F] block mb-1">
                  Question Text
                </label>
                <textarea
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Which automaker produced the 1,914 hp Nevera hypercar?"
                  className="w-full bg-[#0C0C0E] border border-[#D4AF37]/30 focus:border-[#D4AF37] text-white text-xs rounded-xl p-2.5 outline-none leading-relaxed"
                  required
                />
              </div>

              {/* 4 Options & Correct Answer Radio */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A9F] block mb-1">
                  Answer Options (Select the correct radio)
                </label>
                <div className="space-y-2">
                  {formOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOptionRadio"
                        checked={formCorrectIndex === idx}
                        onChange={() => setFormCorrectIndex(idx)}
                        className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#D4AF37] w-4">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] text-white text-xs rounded-lg p-2 outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A9F] block mb-1">
                  Gearhead Fact / Explanation
                </label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Fact revealed after question is answered"
                  className="w-full bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] text-white text-xs rounded-xl p-2 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#222228] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <GoldButton size="sm" className="flex-1">
                  {editingQuestion ? 'Update' : 'Save Question'}
                </GoldButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
