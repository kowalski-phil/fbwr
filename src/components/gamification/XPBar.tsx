'use client';

import { getXPProgress, getLevelForXP, getNextLevel } from '@/data/levels';

export default function XPBar({ xp, showLabel = true }: { xp: number; showLabel?: boolean }) {
  const progress = getXPProgress(xp);
  const level = getLevelForXP(xp);
  const next = getNextLevel(level.level);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{level.rank}</span>
          <span>{next ? `${progress.current} / ${progress.needed} XP` : 'MAX'}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-flame-orange to-flame-yellow h-full rounded-full transition-all duration-700 ease-out animate-fill"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      {showLabel && next && (
        <p className="text-xs text-gray-400 mt-1 text-right">
          Nächster Rang: {next.rank}
        </p>
      )}
    </div>
  );
}
