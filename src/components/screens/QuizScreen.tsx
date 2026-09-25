import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Split,
  FastForward,
  Coins
} from 'lucide-react';
import { Question, CategoryId, Difficulty, QuizResult, UserAnswerRecord } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { soundManager } from '../../utils/audio';
import { GoldButton } from '../ui/GoldButton';

interface QuizScreenProps {
  questions: Question[];
  category: CategoryId;
  difficulty: Difficulty;
  onFinishQuiz: (result: QuizResult) => void;
  onExit: () => void;
}

const QUESTION_TIME_LIMIT = 15; // 15 seconds per question

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  category,
  difficulty,
  onFinishQuiz,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentIndex];

  const difficultyMultiplier = difficulty === 'hard' ? 2.0 : difficulty === 'medium' ? 1.5 : 1.0;

  // Start 15-second countdown timer for current question
  useEffect(() => {
    if (!currentQuestion || isAnswerRevealed) return;

    setTimeRemaining(QUESTION_TIME_LIMIT);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }

        // Sound tick in last 5 seconds
        if (prev <= 5) {
          soundManager.playTick(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswerRevealed]);

  const handleTimeOut = () => {
    soundManager.playWrong();
    recordAnswer(-1, true); // -1 means timeout
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerRevealed || eliminatedOptions.includes(index)) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(index);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      // Calculate score: Base 10 pts + time bonus (up to 5 pts) * difficulty multiplier
      const timeBonus = Math.floor(timeRemaining / 3);
      const pointsEarned = Math.round((10 + timeBonus) * difficultyMultiplier);
      setScore((prev) => prev + pointsEarned);
    } else {
      soundManager.playWrong();
    }

    recordAnswer(index, false);
  };

  const recordAnswer = (selectedIndex: number, isTimeout: boolean) => {
    setIsAnswerRevealed(true);

    const isCorrect = !isTimeout && selectedIndex === currentQuestion.correctIndex;
    const timeSpent = QUESTION_TIME_LIMIT - timeRemaining;

    const answerRecord: UserAnswerRecord = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      options: currentQuestion.options,
      selectedIndex,
      correctIndex: currentQuestion.correctIndex,
      isCorrect,
      timeSpent: isTimeout ? QUESTION_TIME_LIMIT : timeSpent,
      explanation: currentQuestion.explanation
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setEliminatedOptions([]);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const totalQuestions = questions.length;
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const wrongCount = totalQuestions - correctCount;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const totalTimeTaken = userAnswers.reduce((acc, curr) => acc + curr.timeSpent, 0);

    // Driver Rank assessment
    let driverRank = 'Pit Crew';
    if (accuracy >= 90) driverRank = 'Apex Champion';
    else if (accuracy >= 70) driverRank = 'Track Specialist';
    else if (accuracy >= 50) driverRank = 'Street Tuner';
    else driverRank = 'Rookie Driver';

    // Coins: 5 coins per correct answer + 20 bonus if accuracy >= 70%
    const coinsEarned = correctCount * 5 + (accuracy >= 70 ? 20 : 5);

    const result: QuizResult = {
      category,
      difficulty,
      totalQuestions,
      correctCount,
      wrongCount,
      score,
      coinsEarned,
      timeTakenSeconds: totalTimeTaken,
      accuracy,
      driverRank,
      timestamp: new Date().toISOString(),
      answers: userAnswers
    };

    onFinishQuiz(result);
  };

  // 50:50 Lifeline
  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || isAnswerRevealed) return;
    soundManager.playClick();
    setFiftyFiftyUsed(true);

    const incorrectIndices = currentQuestion.options
      .map((_, i) => i)
      .filter((i) => i !== currentQuestion.correctIndex);

    // Shuffle and pick 2 to eliminate
    const toEliminate = incorrectIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="bg-[#16161A] p-6 rounded-2xl border border-[#D4AF37]">
          <p className="text-white font-bold mb-4">No questions available in this category.</p>
          <GoldButton onClick={onExit}>Return to Garage</GoldButton>
        </div>
      </div>
    );
  }

  // Timer ring calculations
  const progressRatio = timeRemaining / QUESTION_TIME_LIMIT;
  const isUrgent = timeRemaining <= 5;
  const timerStrokeColor = isUrgent ? '#C62828' : timeRemaining <= 9 ? '#F57C00' : '#D4AF37';

  return (
    <div className="min-h-screen bg-[#0C0C0E] pb-10 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          {/* Exit Button */}
          <button
            type="button"
            onClick={() => setShowExitDialog(true)}
            aria-label="Exit Quiz"
            className="w-9 h-9 rounded-full bg-[#16161A] border border-[#D4AF37]/30 flex items-center justify-center text-[#9A9A9F] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16161A] border border-[#D4AF37]/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
              {CATEGORIES[category]?.title || 'Racing Track'}
            </span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#222228] text-white font-semibold">
              {difficulty}
            </span>
          </div>

          {/* Current Score Ticker */}
          <div className="flex items-center gap-1.5 bg-[#16161A] px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
            <span className="text-[11px] text-[#9A9A9F] uppercase font-semibold">Score</span>
            <span className="font-heading text-base font-bold text-[#D4AF37]">
              {score}
            </span>
          </div>
        </div>

        {/* Progress & Speedometer Timer */}
        <div className="flex items-center justify-between px-2 mb-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#9A9A9F]">Question Lap</span>
            <div className="font-heading text-xl font-black text-white">
              {currentIndex + 1} <span className="text-xs text-[#9A9A9F]">/ {questions.length}</span>
            </div>
          </div>

          {/* Circular Countdown Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="#16161A"
                stroke="#222228"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke={timerStrokeColor}
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - progressRatio)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`font-gauge text-lg font-bold leading-none ${
                  isUrgent ? 'text-red-500 animate-pulse' : 'text-white'
                }`}
              >
                {timeRemaining}
              </span>
              <span className="text-[8px] uppercase tracking-tighter text-[#9A9A9F]">sec</span>
            </div>
          </div>
        </div>

        {/* Progress Segmented Bar */}
        <div className="w-full grid grid-cols-10 gap-1 mb-4">
          {questions.map((_, i) => {
            const answeredRecord = userAnswers[i];
            let barBg = 'bg-[#222228]';
            if (i === currentIndex) barBg = 'bg-[#D4AF37] animate-pulse';
            else if (answeredRecord) {
              barBg = answeredRecord.isCorrect ? 'bg-emerald-500' : 'bg-red-500';
            }
            return (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${barBg}`}
              />
            );
          })}
        </div>

        {/* Question Card */}
        <div className="relative rounded-2xl bg-[#16161A] border border-[#D4AF37]/30 p-5 shadow-xl overflow-hidden mb-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />

          {/* Optional Car Image if question contains one */}
          {currentQuestion.carImage && (
            <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-[#D4AF37]/20">
              <img
                src={currentQuestion.carImage}
                alt="Car Quiz Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h3 className="font-heading text-lg md:text-xl font-bold text-white tracking-wide leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        {/* 4 Stacked High-Contrast Answer Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;
            const isEliminated = eliminatedOptions.includes(idx);

            let buttonStyle = 'bg-[#16161A] border-[#D4AF37]/20 text-[#F4F4F6] hover:border-[#D4AF37]/60';
            let optionBadgeStyle = 'bg-[#222228] text-[#D4AF37] border-[#D4AF37]/30';

            if (isEliminated) {
              buttonStyle = 'bg-[#121214] border-transparent text-[#9A9A9F]/40 opacity-30 pointer-events-none line-through';
              optionBadgeStyle = 'bg-[#16161A] text-[#9A9A9F]/40 border-transparent';
            } else if (isAnswerRevealed) {
              if (isCorrectOption) {
                // Correct answer reveal: solid green
                buttonStyle = 'bg-[#2E7D32]/90 border-emerald-400 text-white font-bold shadow-[0_0_15px_rgba(46,125,50,0.5)]';
                optionBadgeStyle = 'bg-white text-[#2E7D32] border-white font-extrabold';
              } else if (isSelected) {
                // Selected wrong answer: solid red
                buttonStyle = 'bg-[#C62828]/90 border-red-400 text-white font-bold shadow-[0_0_15px_rgba(198,40,40,0.5)]';
                optionBadgeStyle = 'bg-white text-[#C62828] border-white font-extrabold';
              } else {
                buttonStyle = 'bg-[#16161A]/50 border-white/5 text-[#9A9A9F] opacity-50';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-[#D4AF37]/20 border-[#D4AF37] text-white';
              optionBadgeStyle = 'bg-[#D4AF37] text-black font-extrabold border-[#D4AF37]';
            }

            const letters = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerRevealed || isEliminated}
                onClick={() => handleSelectOption(idx)}
                className={`w-full min-h-[52px] p-3.5 rounded-xl border flex items-center justify-between text-left transition-all duration-150 active:scale-[0.99] cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3 pr-2">
                  <span
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-colors ${optionBadgeStyle}`}
                  >
                    {letters[idx]}
                  </span>
                  <span className="text-sm font-medium leading-tight">
                    {option}
                  </span>
                </div>

                {isAnswerRevealed && (
                  <div className="flex-shrink-0">
                    {isCorrectOption ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation / Telemetry Reveal */}
        {isAnswerRevealed && (
          <div className="mt-3.5 p-3.5 rounded-xl bg-[#222228] border border-[#D4AF37]/30 text-xs text-[#E4E4E8] animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gearhead Telemetry</span>
            </div>
            <p className="leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar & Lifelines */}
      <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
        {/* Lifeline Buttons */}
        {!isAnswerRevealed && (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={fiftyFiftyUsed}
              onClick={handleUseFiftyFifty}
              className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                fiftyFiftyUsed
                  ? 'bg-[#121214] border-white/5 text-[#9A9A9F]/40 cursor-not-allowed'
                  : 'bg-[#16161A] border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37] active:scale-95'
              }`}
            >
              <Split className="w-4 h-4" />
              <span>50:50 ({fiftyFiftyUsed ? 'Used' : '1 Left'})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                handleTimeOut();
              }}
              className="py-2 px-3 rounded-xl border border-white/10 bg-[#16161A] text-[#9A9A9F] hover:text-white flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
            >
              <FastForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          </div>
        )}

        {/* Next Question / Finish Button */}
        {isAnswerRevealed && (
          <GoldButton
            size="lg"
            fullWidth
            onClick={handleNext}
            icon={<ArrowRight className="w-5 h-5 fill-black" />}
          >
            {currentIndex + 1 < questions.length ? 'NEXT QUESTION' : 'VIEW FINAL RESULTS'}
          </GoldButton>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16161A] border border-[#D4AF37] p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-[0_0_30px_rgba(212,175,55,0.25)]">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
              <X className="w-6 h-6" />
            </div>
            <h4 className="font-heading text-xl font-bold text-white uppercase">
              Abandon Race?
            </h4>
            <p className="text-xs text-[#9A9A9F]">
              Your current lap progress and points will not be recorded in your career stats.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowExitDialog(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222228] text-white text-xs font-bold uppercase"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitDialog(false);
                  onExit();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold uppercase"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
