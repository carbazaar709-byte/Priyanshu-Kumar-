import { Question, UserProfile, QuizResult, CategoryId, Difficulty } from '../types';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';
import { soundManager } from './audio';

const STORAGE_KEYS = {
  PROFILE: 'car_quiz_user_profile',
  QUESTIONS: 'car_quiz_questions_db',
  HISTORY: 'car_quiz_game_history',
};

const INITIAL_PROFILE: UserProfile = {
  username: 'SpeedDemon77',
  avatar: '🏎️',
  xp: 150,
  level: 2,
  coins: 450,
  streakDays: 3,
  gamesPlayed: 5,
  totalScore: 380,
  highestScore: 90,
  totalCorrect: 38,
  totalAnswered: 50,
  unlockedAchievements: ['first_lap'],
  soundEnabled: true,
  hapticEnabled: true,
  lastPlayedDate: new Date().toISOString()
};

export class AppStorage {
  // ================= PROFILE =================
  public static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        soundManager.setPreferences(parsed.soundEnabled ?? true, parsed.hapticEnabled ?? true);
        return { ...INITIAL_PROFILE, ...parsed };
      }
    } catch {
      // Fallback
    }
    soundManager.setPreferences(INITIAL_PROFILE.soundEnabled, INITIAL_PROFILE.hapticEnabled);
    return INITIAL_PROFILE;
  }

  public static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      soundManager.setPreferences(profile.soundEnabled, profile.hapticEnabled);
    } catch (err) {
      console.error('Failed to save profile', err);
    }
  }

  public static updateProfileStats(result: QuizResult): UserProfile {
    const profile = this.getProfile();
    const newGamesPlayed = profile.gamesPlayed + 1;
    const newTotalScore = profile.totalScore + result.score;
    const newHighestScore = Math.max(profile.highestScore, result.score);
    const newTotalCorrect = profile.totalCorrect + result.correctCount;
    const newTotalAnswered = profile.totalAnswered + result.totalQuestions;
    const newCoins = profile.coins + result.coinsEarned;

    // XP calculation: 10 XP per correct + 25 XP for completing
    const gainedXp = result.correctCount * 10 + 25;
    const newXp = profile.xp + gainedXp;
    const newLevel = Math.floor(newXp / 150) + 1;

    // Achievements check
    const unlocked = new Set(profile.unlockedAchievements);
    unlocked.add('first_lap');
    if (result.correctCount === result.totalQuestions) {
      unlocked.add('flawless_victory');
    }
    if (result.category === 'indian_cars' && result.accuracy >= 80) {
      unlocked.add('desi_gearhead');
    }
    if (result.category === 'luxury_supercars' && result.score >= 100) {
      unlocked.add('v12_connoisseur');
    }
    if (result.category === 'evs_future' && result.difficulty === 'hard' && result.accuracy >= 70) {
      unlocked.add('ev_pioneer');
    }
    if (newTotalScore >= 500) {
      unlocked.add('centurion_racer');
    }

    const updatedProfile: UserProfile = {
      ...profile,
      gamesPlayed: newGamesPlayed,
      totalScore: newTotalScore,
      highestScore: newHighestScore,
      totalCorrect: newTotalCorrect,
      totalAnswered: newTotalAnswered,
      coins: newCoins,
      xp: newXp,
      level: newLevel,
      unlockedAchievements: Array.from(unlocked),
      lastPlayedDate: new Date().toISOString()
    };

    this.saveProfile(updatedProfile);
    this.addHistory(result);
    return updatedProfile;
  }

  // ================= QUESTIONS =================
  public static getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Initialise with defaults
    this.saveQuestions(DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  }

  public static saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (err) {
      console.error('Failed to save questions', err);
    }
  }

  public static addQuestion(newQuestion: Omit<Question, 'id'>): Question {
    const questions = this.getQuestions();
    const created: Question = {
      ...newQuestion,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isCustom: true
    };
    questions.unshift(created);
    this.saveQuestions(questions);
    return created;
  }

  public static updateQuestion(updated: Question): void {
    const questions = this.getQuestions().map(q => q.id === updated.id ? updated : q);
    this.saveQuestions(questions);
  }

  public static deleteQuestion(id: string): void {
    const questions = this.getQuestions().filter(q => q.id !== id);
    this.saveQuestions(questions);
  }

  public static resetQuestions(): Question[] {
    this.saveQuestions(DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  }

  // Filter questions for a quiz session (returns 10 questions)
  public static getQuizQuestions(category?: CategoryId, difficulty?: Difficulty): Question[] {
    const all = this.getQuestions();
    let pool = all;

    if (category) {
      pool = pool.filter(q => q.category === category);
    }
    if (difficulty) {
      const difficultyMatches = pool.filter(q => q.difficulty === difficulty);
      if (difficultyMatches.length >= 5) {
        pool = difficultyMatches;
      }
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // If less than 10, pad with other questions
    if (shuffled.length < 10) {
      const extra = all
        .filter(q => !shuffled.some(s => s.id === q.id))
        .sort(() => Math.random() - 0.5);
      shuffled.push(...extra);
    }

    return shuffled.slice(0, 10);
  }

  // ================= HISTORY =================
  public static getHistory(): QuizResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public static addHistory(result: QuizResult): void {
    const history = this.getHistory();
    history.unshift(result);
    // Keep last 25 games
    const trimmed = history.slice(0, 25);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch {
      // Ignore storage quota errors
    }
  }
}
