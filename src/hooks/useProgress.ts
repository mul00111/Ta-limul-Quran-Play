import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

const STORAGE_KEY = 'tqp_user_progress';

const DEFAULT_PROGRESS: UserProgress = {
  coins: 0,
  streak: 0,
  lastActiveDate: '',
  completedLessons: [],
  xp: 0,
  badges: []
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
        updateStreak(parsed);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    } else {
      // First time user
      const initial = { ...DEFAULT_PROGRESS, lastActiveDate: new Date().toISOString() };
      setProgress(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const updateStreak = (current: UserProgress) => {
    const today = new Date().toDateString();
    const lastActive = current.lastActiveDate ? new Date(current.lastActiveDate).toDateString() : '';
    
    if (today === lastActive) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive === yesterday.toDateString()) {
      // Continued streak
      saveProgress({
        ...current,
        streak: current.streak + 1,
        lastActiveDate: new Date().toISOString()
      });
    } else if (lastActive !== '') {
      // Streak broken
      saveProgress({
        ...current,
        streak: 1,
        lastActiveDate: new Date().toISOString()
      });
    } else {
      // First day
      saveProgress({
        ...current,
        streak: 1,
        lastActiveDate: new Date().toISOString()
      });
    }
  };

  const addCoins = (amount: number) => {
    saveProgress({
      ...progress,
      coins: progress.coins + amount,
      xp: progress.xp + (amount * 2)
    });
  };

  const completeLesson = (lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      saveProgress({
        ...progress,
        completedLessons: [...progress.completedLessons, lessonId],
        coins: progress.coins + 50,
        xp: progress.xp + 100
      });
      return true; // Newly completed
    }
    return false;
  };

  return {
    progress,
    addCoins,
    completeLesson,
    updateStreak
  };
}
