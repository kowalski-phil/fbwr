'use client';

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { GameState, MissionScore, Activity } from '@/data/types';
import { useLocalStorage } from './useLocalStorage';
import { getLevelForXP } from '@/data/levels';
import { today } from '@/lib/utils';

const defaultState: GameState = {
  xp: 0,
  level: 1,
  completedLessons: [],
  lessonScores: {},
  completedMissions: [],
  missionScores: {},
  earnedBadges: [],
  streak: { current: 0, longest: 0, lastActiveDate: '' },
  lastActivity: '',
  createdAt: '',
  activities: [],
};

interface GameStateContextType {
  state: GameState;
  addXP: (amount: number, label?: string) => { newLevel: boolean; oldLevel: number; newLevelNum: number };
  completeLesson: (topicId: string, quizScore: number) => void;
  completeMission: (missionId: string, score: MissionScore) => void;
  earnBadge: (badgeId: string) => void;
  recordActivity: (activity: Omit<Activity, 'timestamp'>) => void;
  updateStreak: () => void;
  resetProgress: () => void;
  xpToasts: Array<{ id: number; amount: number }>;
  dismissXPToast: (id: number) => void;
  levelUpInfo: { rank: string; level: number } | null;
  dismissLevelUp: () => void;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<GameState>('feuerwache-bwr-state', {
    ...defaultState,
    createdAt: today(),
  });
  const [xpToasts, setXPToasts] = useState<Array<{ id: number; amount: number }>>([]);
  const [levelUpInfo, setLevelUpInfo] = useState<{ rank: string; level: number } | null>(null);
  const [toastCounter, setToastCounter] = useState(0);

  const addXP = useCallback((amount: number, label?: string) => {
    let result = { newLevel: false, oldLevel: 0, newLevelNum: 0 };
    setState(prev => {
      const oldLevel = getLevelForXP(prev.xp);
      const newXP = prev.xp + amount;
      const newLevel = getLevelForXP(newXP);
      result = {
        newLevel: newLevel.level > oldLevel.level,
        oldLevel: oldLevel.level,
        newLevelNum: newLevel.level,
      };
      if (newLevel.level > oldLevel.level) {
        setLevelUpInfo({ rank: newLevel.rank, level: newLevel.level });
      }
      return { ...prev, xp: newXP, level: newLevel.level, lastActivity: today() };
    });

    const id = toastCounter;
    setToastCounter(c => c + 1);
    setXPToasts(prev => [...prev, { id, amount }]);
    setTimeout(() => {
      setXPToasts(prev => prev.filter(t => t.id !== id));
    }, 1500);

    return result;
  }, [setState, toastCounter]);

  const completeLesson = useCallback((topicId: string, quizScore: number) => {
    setState(prev => {
      const completedLessons = prev.completedLessons.includes(topicId)
        ? prev.completedLessons
        : [...prev.completedLessons, topicId];
      const lessonScores = {
        ...prev.lessonScores,
        [topicId]: Math.max(prev.lessonScores[topicId] ?? 0, quizScore),
      };
      return { ...prev, completedLessons, lessonScores };
    });
  }, [setState]);

  const completeMission = useCallback((missionId: string, score: MissionScore) => {
    setState(prev => {
      const completedMissions = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];
      const existing = prev.missionScores[missionId];
      const missionScores = {
        ...prev.missionScores,
        [missionId]: !existing || score.score > existing.score ? score : existing,
      };
      return { ...prev, completedMissions, missionScores };
    });
  }, [setState]);

  const earnBadge = useCallback((badgeId: string) => {
    setState(prev => {
      if (prev.earnedBadges.includes(badgeId)) return prev;
      return { ...prev, earnedBadges: [...prev.earnedBadges, badgeId] };
    });
  }, [setState]);

  const recordActivity = useCallback((activity: Omit<Activity, 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      activities: [{ ...activity, timestamp: new Date().toISOString() }, ...prev.activities].slice(0, 20),
    }));
  }, [setState]);

  const updateStreak = useCallback(() => {
    setState(prev => {
      const todayStr = today();
      if (prev.streak.lastActiveDate === todayStr) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newCurrent: number;
      if (prev.streak.lastActiveDate === yesterdayStr) {
        newCurrent = prev.streak.current + 1;
      } else {
        newCurrent = 1;
      }
      const newLongest = Math.max(prev.streak.longest, newCurrent);
      return {
        ...prev,
        streak: { current: newCurrent, longest: newLongest, lastActiveDate: todayStr },
      };
    });
  }, [setState]);

  const resetProgress = useCallback(() => {
    setState({ ...defaultState, createdAt: today() });
    setXPToasts([]);
    setLevelUpInfo(null);
  }, [setState]);

  const dismissXPToast = useCallback((id: number) => {
    setXPToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpInfo(null);
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        state,
        addXP,
        completeLesson,
        completeMission,
        earnBadge,
        recordActivity,
        updateStreak,
        resetProgress,
        xpToasts,
        dismissXPToast,
        levelUpInfo,
        dismissLevelUp,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
}
