'use client';

import { useGameState } from '@/hooks/useGameState';
import { getLevelForXP } from '@/data/levels';
import XPBar from '@/components/gamification/XPBar';

export default function ProfileCard() {
  const { state } = useGameState();
  const level = getLevelForXP(state.xp);

  return (
    <div className="bg-navy rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-navy-light rounded-full flex items-center justify-center text-3xl">
          🧑‍🚒
        </div>
        <div className="flex-1">
          <p className="text-sm text-silver">Level {level.level}</p>
          <h2 className="text-xl font-bold">{level.rank}</h2>
        </div>
      </div>
      <XPBar xp={state.xp} />
    </div>
  );
}
