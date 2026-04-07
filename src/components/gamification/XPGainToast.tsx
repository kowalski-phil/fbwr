'use client';

import { useGameState } from '@/hooks/useGameState';

export default function XPGainToast() {
  const { xpToasts } = useGameState();

  if (xpToasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2">
      {xpToasts.map(toast => (
        <div
          key={toast.id}
          className="animate-xp-float bg-flame-orange text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg"
        >
          +{toast.amount} XP
        </div>
      ))}
    </div>
  );
}
