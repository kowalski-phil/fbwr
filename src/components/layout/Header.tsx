'use client';

import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';
import { getLevelForXP, getXPProgress } from '@/data/levels';

export default function Header() {
  const { state } = useGameState();
  const level = getLevelForXP(state.xp);
  const progress = getXPProgress(state.xp);

  return (
    <header className="bg-navy text-white px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🚒</span>
          <span className="font-bold text-lg">Feuerwache BWR</span>
        </Link>
        <div className="flex items-center gap-3">
          {state.streak.current > 0 && (
            <div className="flex items-center gap-1 text-flame-orange">
              <span className="text-lg animate-flame">🔥</span>
              <span className="font-bold text-sm">{state.streak.current}</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-navy-light rounded-full px-3 py-1">
            <span className="text-xs text-silver">{level.rank}</span>
            <span className="font-bold text-flame-orange text-sm">{state.xp} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
