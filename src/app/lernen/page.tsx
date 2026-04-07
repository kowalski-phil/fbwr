'use client';

import PageShell from '@/components/layout/PageShell';
import TopicCard from '@/components/learning/TopicCard';
import { lessons } from '@/data/lessons';
import { useGameState } from '@/hooks/useGameState';
import XPGainToast from '@/components/gamification/XPGainToast';
import LevelUpModal from '@/components/gamification/LevelUpModal';

export default function LernenPage() {
  return (
    <PageShell>
      <LernenContent />
      <XPGainToast />
      <LevelUpModal />
    </PageShell>
  );
}

function LernenContent() {
  const { state } = useGameState();

  function getStatus(lesson: typeof lessons[0], index: number): 'locked' | 'available' | 'completed' {
    if (state.completedLessons.includes(lesson.id)) return 'completed';
    if (index === 0) return 'available';
    const prevLesson = lessons[index - 1];
    if (state.completedLessons.includes(prevLesson.id)) return 'available';
    return 'locked';
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Lernbereich</h1>
        <p className="text-sm text-gray-500">
          {state.completedLessons.length} von {lessons.length} Lektionen abgeschlossen
        </p>
      </div>
      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <TopicCard
            key={lesson.id}
            lesson={lesson}
            status={getStatus(lesson, i)}
            score={state.lessonScores[lesson.id]}
          />
        ))}
      </div>
    </div>
  );
}
