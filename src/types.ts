export type CategoryId = 
  | 'indian_cars'
  | 'luxury_supercars'
  | 'suvs_offroad'
  | 'evs_future'
  | 'brands_logos'
  | 'mechanics_tech';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  subtitle: string;
  tagline: string;
  imageUrl: string;
  iconName: string;
  accentColor: string;
}

export interface Question {
  id: string;
  category: CategoryId;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  carImage?: string;
  isCustom?: boolean;
}

export interface UserAnswerRecord {
  questionId: string;
  questionText: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  timeSpent: number;
  explanation: string;
}

export interface QuizResult {
  category: CategoryId;
  difficulty: Difficulty;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  coinsEarned: number;
  timeTakenSeconds: number;
  accuracy: number;
  driverRank: string;
  timestamp: string;
  answers: UserAnswerRecord[];
}

export interface UserProfile {
  username: string;
  avatar: string;
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  gamesPlayed: number;
  totalScore: number;
  highestScore: number;
  totalCorrect: number;
  totalAnswered: number;
  unlockedAchievements: string[];
  soundEnabled: boolean;
  hapticEnabled: boolean;
  lastPlayedDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: { current: number; max: number };
}

export interface LeaderboardPlayer {
  id: string;
  username: string;
  avatar: string;
  score: number;
  accuracy: number;
  rank: number;
  badge: string;
  carTitle: string;
  isCurrentUser?: boolean;
}

export type ScreenType = 
  | 'splash'
  | 'home'
  | 'categories'
  | 'quiz'
  | 'result'
  | 'leaderboard'
  | 'profile'
  | 'admin';
