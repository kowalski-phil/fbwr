'use client';

import PageShell from '@/components/layout/PageShell';
import { badges } from '@/data/badges';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/lib/utils';
import XPGainToast from '@/components/gamification/XPGainToast';
import LevelUpModal from '@/components/gamification/LevelUpModal';

export default function AbzeichenPage() {
  return (
    <PageShell>
      <AbzeichenContent />
      <XPGainToast />
      <LevelUpModal />
    </PageShell>
  );
}

function AbzeichenContent() {
  const { state } = useGameState();
  const earnedCount = state.earnedBadges.length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Abzeichen</h1>
        <p className="text-sm text-gray-500">{earnedCount} von {badges.length} freigeschaltet</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {badges.map(badge => {
          const earned = state.earnedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={cn(
                'rounded-xl p-4 text-center border transition-all',
                earned ? 'bg-white border-flame-yellow/50 shadow-md animate-badge-glow' : 'bg-gray-100 border-gray-200'
              )}
            >
              <div className="text-4xl mb-2">
                {earned ? badge.icon : '❓'}
              </div>
              <h3 className={cn(
                'font-bold text-sm',
                earned ? 'text-navy' : 'text-gray-400'
              )}>
                {badge.name}
              </h3>
              <p className="text-xs mt-1">
                {earned ? (
                  <span className="text-success">{badge.description}</span>
                ) : (
                  <span className="text-gray-400">{badge.hint}</span>
                )}
              </p>
              {earned && (
                <span className="text-xs text-flame-orange font-bold mt-1 block">+{badge.xpBonus} XP</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
