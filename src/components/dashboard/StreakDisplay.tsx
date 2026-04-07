'use client';

import { useGameState } from '@/hooks/useGameState';
import StreakFlame from '@/components/gamification/StreakFlame';

export default function StreakDisplay() {
  const { state } = useGameState();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <StreakFlame count={state.streak.current} size="md" />
      {state.streak.longest > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          Rekord: {state.streak.longest} {state.streak.longest === 1 ? 'Tag' : 'Tage'}
        </p>
      )}
    </div>
  );
}
