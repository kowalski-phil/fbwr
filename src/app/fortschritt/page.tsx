'use client';

import PageShell from '@/components/layout/PageShell';
import { useGameState } from '@/hooks/useGameState';
import { lessons } from '@/data/lessons';
import { getLevelForXP } from '@/data/levels';
import { cn } from '@/lib/utils';
import XPGainToast from '@/components/gamification/XPGainToast';
import LevelUpModal from '@/components/gamification/LevelUpModal';
import Link from 'next/link';

export default function FortschrittPage() {
  return (
    <PageShell>
      <FortschrittContent />
      <XPGainToast />
      <LevelUpModal />
    </PageShell>
  );
}

function FortschrittContent() {
  const { state, resetProgress } = useGameState();
  const level = getLevelForXP(state.xp);
  const completedCount = state.completedLessons.length;
  const totalLessons = lessons.length;
  const avgScore = completedCount > 0
    ? Math.round(Object.values(state.lessonScores).reduce((a, b) => a + b, 0) / completedCount)
    : 0;

  const weakTopics = lessons.filter(l =>
    state.completedLessons.includes(l.id) && (state.lessonScores[l.id] ?? 0) < 70
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy">Fortschritt</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-flame-orange">{state.xp}</p>
          <p className="text-xs text-gray-400">Gesamt XP</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-navy">{completedCount}/{totalLessons}</p>
          <p className="text-xs text-gray-400">Lektionen</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
          <p className={cn('text-2xl font-bold', avgScore >= 80 ? 'text-success' : avgScore >= 50 ? 'text-flame-orange' : 'text-gray-400')}>
            {avgScore > 0 ? `${avgScore}%` : '—'}
          </p>
          <p className="text-xs text-gray-400">Ø Quiz</p>
        </div>
      </div>

      {/* Weak Areas */}
      {weakTopics.length > 0 && (
        <div className="bg-flame-orange/10 border border-flame-orange/20 rounded-xl p-4">
          <h3 className="font-bold text-sm text-navy mb-2 flex items-center gap-2">
            <span>⚠️</span> Schwachstellen — hier nochmal üben!
          </h3>
          <div className="space-y-2">
            {weakTopics.map(topic => (
              <Link key={topic.id} href={`/lernen/${topic.id}`}
                className="flex items-center justify-between bg-white rounded-lg p-3 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>{topic.icon}</span>
                  <span className="text-sm font-medium text-navy">{topic.title}</span>
                </div>
                <span className="text-sm font-bold text-error">{state.lessonScores[topic.id]}%</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Topic Progress */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-navy">Alle Lektionen</h3>
        {lessons.map(lesson => {
          const completed = state.completedLessons.includes(lesson.id);
          const score = state.lessonScores[lesson.id];
          return (
            <div key={lesson.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
              <span className="text-lg">{completed ? lesson.icon : '🔒'}</span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', completed ? 'text-navy' : 'text-gray-400')}>
                  {lesson.topicNumber}. {lesson.title}
                </p>
                {completed && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        (score ?? 0) >= 80 ? 'bg-success' : (score ?? 0) >= 50 ? 'bg-flame-orange' : 'bg-error'
                      )}
                      style={{ width: `${score ?? 0}%` }}
                    />
                  </div>
                )}
              </div>
              {completed && score !== undefined && (
                <span className={cn(
                  'text-sm font-bold',
                  score >= 80 ? 'text-success' : score >= 50 ? 'text-flame-orange' : 'text-error'
                )}>
                  {score}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            if (confirm('Wirklich alle Daten zurücksetzen? Das kann nicht rückgängig gemacht werden!')) {
              resetProgress();
            }
          }}
          className="text-xs text-gray-400 hover:text-error transition-colors"
        >
          Daten zurücksetzen
        </button>
      </div>
    </div>
  );
}
