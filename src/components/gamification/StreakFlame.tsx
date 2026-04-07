'use client';

import { cn } from '@/lib/utils';

export default function StreakFlame({ count, size = 'md' }: { count: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn(sizeClasses[size], count > 0 && 'animate-flame')}>
        {count > 0 ? '🔥' : '💨'}
      </span>
      <div>
        <p className={cn(
          'font-bold',
          size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm',
          count > 0 ? 'text-flame-orange' : 'text-gray-400'
        )}>
          {count} {count === 1 ? 'Tag' : 'Tage'}
        </p>
        {size !== 'sm' && (
          <p className="text-xs text-gray-400">
            {count > 0 ? 'Streak läuft!' : 'Starte deinen Streak!'}
          </p>
        )}
      </div>
    </div>
  );
}
