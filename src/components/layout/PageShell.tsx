'use client';

import Header from './Header';
import BottomNav from './BottomNav';
import { GameStateProvider } from '@/hooks/useGameState';
import { BUILD_TIMESTAMP } from '@/lib/buildTimestamp';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <GameStateProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-24 px-4 py-4 max-w-lg mx-auto w-full">
          {children}
          <p className="text-center text-xs text-gray-400 mt-8">
            Letztes Update {BUILD_TIMESTAMP}
          </p>
        </main>
        <BottomNav />
      </div>
    </GameStateProvider>
  );
}
