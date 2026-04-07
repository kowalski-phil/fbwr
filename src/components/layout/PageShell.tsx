'use client';

import Header from './Header';
import BottomNav from './BottomNav';
import { GameStateProvider } from '@/hooks/useGameState';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <GameStateProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 px-4 py-4 max-w-lg mx-auto w-full">
          {children}
        </main>
        <BottomNav />
      </div>
    </GameStateProvider>
  );
}
