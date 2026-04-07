'use client';

import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';
import { lessons } from '@/data/lessons';

export default function QuickActions() {
  const { state } = useGameState();

  const nextLesson = lessons.find(l => !state.completedLessons.includes(l.id));
  const lessonsCompleted = state.completedLessons.length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href={nextLesson ? `/lernen/${nextLesson.id}` : '/lernen'}
        className="bg-fire-red text-white rounded-xl p-4 text-center font-bold shadow-md hover:bg-fire-red-light transition-colors"
      >
        <span className="text-2xl block mb-1">📚</span>
        {nextLesson ? 'Weiterlernen' : 'Alle geschafft!'}
      </Link>
      <Link
        href="/einsatz"
        className="bg-navy text-white rounded-xl p-4 text-center font-bold shadow-md hover:bg-navy-light transition-colors"
      >
        <span className="text-2xl block mb-1">🚨</span>
        Einsatz starten
      </Link>
    </div>
  );
}
