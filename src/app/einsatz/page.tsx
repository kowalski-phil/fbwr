'use client';

import PageShell from '@/components/layout/PageShell';
import { missions } from '@/data/missions';
import { useGameState } from '@/hooks/useGameState';
import { lessons } from '@/data/lessons';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import XPGainToast from '@/components/gamification/XPGainToast';
import LevelUpModal from '@/components/gamification/LevelUpModal';

export default function EinsatzPage() {
  return (
    <PageShell>
      <EinsatzContent />
      <XPGainToast />
      <LevelUpModal />
    </PageShell>
  );
}

function EinsatzContent() {
  const { state } = useGameState();

  const difficultyLabels: Record<string, { label: string; emoji: string; color: string }> = {
    uebungseinsatz: { label: 'Übungseinsatz', emoji: '🟢', color: 'text-success' },
    realeinsatz: { label: 'Realeinsatz', emoji: '🟡', color: 'text-flame-orange' },
    grosseinsatz: { label: 'Großeinsatz', emoji: '🔴', color: 'text-fire-red' },
  };

  const grouped = {
    uebungseinsatz: missions.filter(m => m.difficulty === 'uebungseinsatz'),
    realeinsatz: missions.filter(m => m.difficulty === 'realeinsatz'),
    grosseinsatz: missions.filter(m => m.difficulty === 'grosseinsatz'),
  };

  function isMissionAvailable(mission: typeof missions[0]) {
    if (state.level < mission.requiredLevel) return false;
    return mission.topicIds.some(id => state.completedLessons.includes(id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Einsatz-Zentrale</h1>
        <p className="text-sm text-gray-500">Teste dein Wissen unter Zeitdruck!</p>
      </div>

      {Object.entries(grouped).map(([diff, missionList]) => {
        const info = difficultyLabels[diff];
        return (
          <div key={diff} className="space-y-3">
            <h2 className={cn('font-bold text-sm flex items-center gap-2', info.color)}>
              {info.emoji} {info.label}
            </h2>
            {missionList.map(mission => {
              const available = isMissionAvailable(mission);
              const completed = state.completedMissions.includes(mission.id);
              const bestScore = state.missionScores[mission.id]?.score;

              const card = (
                <div className={cn(
                  'rounded-xl p-4 border shadow-sm transition-all',
                  !available && 'bg-gray-100 border-gray-200 opacity-60',
                  available && !completed && 'bg-white border-gray-200 hover:shadow-md hover:border-fire-red/30',
                  completed && 'bg-white border-success/30',
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={cn('font-bold text-sm', available ? 'text-navy' : 'text-gray-400')}>
                        {available ? mission.title : '🔒 ' + mission.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{mission.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>📝 {mission.questionCount} Fragen</span>
                        <span>⏱️ {Math.floor(mission.timeLimitSeconds / 60)} Min</span>
                        <span className="text-flame-orange font-bold">{mission.xpReward} XP</span>
                      </div>
                    </div>
                    {completed && bestScore !== undefined && (
                      <div className="text-right">
                        <span className={cn(
                          'text-lg font-bold',
                          bestScore >= 80 ? 'text-success' : bestScore >= 50 ? 'text-flame-orange' : 'text-error'
                        )}>
                          {bestScore}%
                        </span>
                        <p className="text-xs text-gray-400">Bestleistung</p>
                      </div>
                    )}
                  </div>
                  {!available && (
                    <p className="text-xs text-gray-400 mt-2">
                      Benötigt: Level {mission.requiredLevel}+ und abgeschlossene Lektionen
                    </p>
                  )}
                </div>
              );

              if (!available) return <div key={mission.id}>{card}</div>;
              return (
                <Link key={mission.id} href={`/einsatz/${mission.id}`}>
                  {card}
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
