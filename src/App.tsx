/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ScreenType, 
  CategoryId, 
  Difficulty, 
  Question, 
  QuizResult, 
  UserProfile 
} from './types';
import { AppStorage } from './utils/storage';
import { soundManager } from './utils/audio';

// TopBar & BottomNav
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';

// 8 Core Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoryScreen } from './components/screens/CategoryScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminPanelScreen } from './components/screens/AdminPanelScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [profile, setProfile] = useState<UserProfile>(() => AppStorage.getProfile());
  const [questions, setQuestions] = useState<Question[]>(() => AppStorage.getQuestions());
  const [history, setHistory] = useState<QuizResult[]>(() => AppStorage.getHistory());

  // Active Quiz State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('indian_cars');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('medium');
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null);

  // Initialize sounds and preferences on mount
  useEffect(() => {
    const loadedProfile = AppStorage.getProfile();
    setProfile(loadedProfile);
    soundManager.setPreferences(loadedProfile.soundEnabled, loadedProfile.hapticEnabled);
  }, []);

  // Handlers for Navigation
  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Quiz Handler
  const handleStartQuiz = (categoryId: CategoryId = 'indian_cars', difficulty: Difficulty = 'medium') => {
    const quizQuestions = AppStorage.getQuizQuestions(categoryId, difficulty);
    setActiveQuestions(quizQuestions);
    setActiveCategory(categoryId);
    setActiveDifficulty(difficulty);
    setCurrentScreen('quiz');
  };

  // Complete Quiz Handler
  const handleFinishQuiz = (result: QuizResult) => {
    const updatedProfile = AppStorage.updateProfileStats(result);
    setProfile(updatedProfile);
    setLatestResult(result);
    setHistory(AppStorage.getHistory());
    setCurrentScreen('result');
  };

  // Profile Updates
  const handleUpdateProfile = (updated: UserProfile) => {
    AppStorage.saveProfile(updated);
    setProfile(updated);
  };

  const handleToggleSound = () => {
    const updated = {
      ...profile,
      soundEnabled: !profile.soundEnabled
    };
    handleUpdateProfile(updated);
  };

  const handleResetStats = () => {
    const resetProfile: UserProfile = {
      ...profile,
      xp: 0,
      level: 1,
      coins: 100,
      streakDays: 1,
      gamesPlayed: 0,
      totalScore: 0,
      highestScore: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      unlockedAchievements: []
    };
    handleUpdateProfile(resetProfile);
    localStorage.removeItem('car_quiz_game_history');
    setHistory([]);
  };

  // Admin Question Handlers
  const handleAddQuestion = (newQ: Omit<Question, 'id'>) => {
    const created = AppStorage.addQuestion(newQ);
    setQuestions(AppStorage.getQuestions());
  };

  const handleUpdateQuestion = (updatedQ: Question) => {
    AppStorage.updateQuestion(updatedQ);
    setQuestions(AppStorage.getQuestions());
  };

  const handleDeleteQuestion = (id: string) => {
    AppStorage.deleteQuestion(id);
    setQuestions(AppStorage.getQuestions());
  };

  const handleResetQuestions = () => {
    const restored = AppStorage.resetQuestions();
    setQuestions(restored);
  };

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-[#F4F4F6] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Top Header Navigation (shown on non-fullscreen screens) */}
      <TopBar
        profile={profile}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onToggleSound={handleToggleSound}
      />

      {/* Main Screen Router */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {currentScreen === 'splash' && (
          <SplashScreen onStart={() => handleNavigate('home')} />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            profile={profile}
            recentHistory={history}
            onStartQuiz={(catId) => handleStartQuiz(catId || 'indian_cars', 'medium')}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'categories' && (
          <CategoryScreen
            onSelectCategory={(catId, diff) => handleStartQuiz(catId, diff)}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizScreen
            questions={activeQuestions}
            category={activeCategory}
            difficulty={activeDifficulty}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => handleNavigate('home')}
          />
        )}

        {currentScreen === 'result' && (
          <ResultScreen
            result={latestResult}
            onPlayAgain={() => handleStartQuiz(activeCategory, activeDifficulty)}
            onNavigateCategories={() => handleNavigate('categories')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardScreen currentUserProfile={profile} />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={handleNavigate}
            onResetStats={handleResetStats}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminPanelScreen
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onResetQuestions={handleResetQuestions}
          />
        )}
      </main>

      {/* Glassmorphic Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
