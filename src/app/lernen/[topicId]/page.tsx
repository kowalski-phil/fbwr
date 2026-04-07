'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import LessonContent from '@/components/learning/LessonContent';
import MiniQuiz from '@/components/learning/MiniQuiz';
import InteractiveExample from '@/components/learning/InteractiveExample';
import XPGainToast from '@/components/gamification/XPGainToast';
import LevelUpModal from '@/components/gamification/LevelUpModal';
import { lessons } from '@/data/lessons';
import { getQuizById } from '@/data/quizzes';
import { useGameState } from '@/hooks/useGameState';
import { checkBadgeCondition, badges } from '@/data/badges';

export default function LessonPage() {
  return (
    <PageShell>
      <LessonPageContent />
      <XPGainToast />
      <LevelUpModal />
    </PageShell>
  );
}

function LessonPageContent() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const { state, addXP, completeLesson, earnBadge, recordActivity, updateStreak } = useGameState();
  const [showQuiz, setShowQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);

  const lesson = lessons.find(l => l.id === topicId);

  const quiz = lesson ? getQuizById(lesson.miniQuizId) : undefined;
  const isAlreadyCompleted = lesson ? state.completedLessons.includes(lesson.id) : false;
  const nextLesson = lessons.find(l => !state.completedLessons.includes(l.id) && l.id !== topicId);

  function handleQuizComplete(score: number, totalXP: number) {
    if (!lesson) return;
    const isRepeat = isAlreadyCompleted;
    const xpToAdd = isRepeat ? Math.round((totalXP + lesson.xpReward) * 0.5) : totalXP + lesson.xpReward;

    addXP(xpToAdd);
    completeLesson(lesson.id, score);
    updateStreak();
    recordActivity({ type: 'lesson', label: `Lektion "${lesson.title}" abgeschlossen (${score}%)` });

    // Check badges
    const updatedState = {
      ...state,
      completedLessons: state.completedLessons.includes(lesson.id)
        ? state.completedLessons
        : [...state.completedLessons, lesson.id],
      lessonScores: { ...state.lessonScores, [lesson.id]: Math.max(state.lessonScores[lesson.id] ?? 0, score) },
    };
    for (const badge of badges) {
      if (!state.earnedBadges.includes(badge.id) && checkBadgeCondition(badge, updatedState)) {
        earnBadge(badge.id);
        addXP(badge.xpBonus);
        recordActivity({ type: 'badge', label: `Abzeichen "${badge.name}" freigeschaltet!` });
      }
    }

    setCompleted(true);
  }

  if (!lesson) {
    return <p className="text-center text-gray-500 py-8">Lektion nicht gefunden.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => router.push('/lernen')} className="text-sm text-gray-400 hover:text-navy mb-2 flex items-center gap-1">
          ← Zurück
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{lesson.icon}</span>
          <div>
            <p className="text-xs text-gray-400">Lektion {lesson.topicNumber}</p>
            <h1 className="text-xl font-bold text-navy">{lesson.title}</h1>
          </div>
        </div>
        <p className="text-sm text-gray-500">{lesson.subtitle}</p>
        {isAlreadyCompleted && !completed && (
          <span className="inline-block mt-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-bold">
            ✓ Bereits abgeschlossen — Wiederholung gibt 50% XP
          </span>
        )}
      </div>

      <LessonContent
        sections={lesson.sections}
        keyConcepts={lesson.keyConcepts}
        firefighterAnalogy={lesson.firefighterAnalogy}
      />

      {lesson.interactiveType && (
        <InteractiveExample type={lesson.interactiveType} />
      )}

      {!showQuiz && !completed && (
        <button
          onClick={() => setShowQuiz(true)}
          className="w-full bg-fire-red text-white font-bold py-4 rounded-xl hover:bg-fire-red-light transition-colors text-lg"
        >
          🚨 Quiz starten!
        </button>
      )}

      {showQuiz && quiz && !completed && (
        <div>
          <h3 className="font-bold text-navy text-lg mb-3 flex items-center gap-2">
            <span>📝</span> Mini-Quiz
          </h3>
          <MiniQuiz quiz={quiz} onComplete={handleQuizComplete} />
        </div>
      )}

      {completed && (
        <div className="text-center space-y-3">
          {nextLesson && (
            <button
              onClick={() => router.push(`/lernen/${nextLesson.id}`)}
              className="w-full bg-fire-red text-white font-bold py-4 rounded-xl hover:bg-fire-red-light transition-colors"
            >
              Nächste Lektion: {nextLesson.title} →
            </button>
          )}
          <button
            onClick={() => router.push('/lernen')}
            className="w-full bg-gray-100 text-navy font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Zurück zur Übersicht
          </button>
        </div>
      )}
    </div>
  );
}
