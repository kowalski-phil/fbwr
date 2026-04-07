'use client';

import { useGameState } from '@/hooks/useGameState';

export default function LevelUpModal() {
  const { levelUpInfo, dismissLevelUp } = useGameState();

  if (!levelUpInfo) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60" onClick={dismissLevelUp}>
      <div
        className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center animate-level-up shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">🎖️</div>
        <h2 className="text-2xl font-bold text-navy mb-2">Aufgestiegen!</h2>
        <p className="text-lg text-gray-600 mb-1">Du bist jetzt</p>
        <p className="text-2xl font-bold text-fire-red mb-1">{levelUpInfo.rank}</p>
        <p className="text-sm text-gray-400 mb-6">Level {levelUpInfo.level}</p>
        <button
          onClick={dismissLevelUp}
          className="bg-fire-red text-white font-bold py-3 px-8 rounded-full hover:bg-fire-red-light transition-colors"
        >
          Weiter!
        </button>
      </div>
    </div>
  );
}
