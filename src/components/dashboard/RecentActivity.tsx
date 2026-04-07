'use client';

import { useGameState } from '@/hooks/useGameState';

export default function RecentActivity() {
  const { state } = useGameState();
  const activities = state.activities.slice(0, 5);

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center text-gray-400">
        <p className="text-sm">Noch keine Aktivitäten.</p>
        <p className="text-xs mt-1">Starte deine erste Lektion!</p>
      </div>
    );
  }

  const icons: Record<string, string> = {
    lesson: '📚',
    mission: '🚨',
    badge: '🏅',
    levelup: '🎖️',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-bold text-sm text-gray-700 mb-3">Letzte Aktivitäten</h3>
      <div className="space-y-2">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-lg">{icons[a.type] ?? '📌'}</span>
            <span className="flex-1 text-gray-600">{a.label}</span>
            <span className="text-xs text-gray-400">
              {new Date(a.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
