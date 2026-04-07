'use client';

import Link from 'next/link';
import { Lesson } from '@/data/types';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  lesson: Lesson;
  status: 'locked' | 'available' | 'completed';
  score?: number;
}

export default function TopicCard({ lesson, status, score }: TopicCardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const card = (
    <div
      className={cn(
        'rounded-xl p-4 shadow-sm border transition-all',
        isLocked && 'bg-gray-100 border-gray-200 opacity-60',
        status === 'available' && 'bg-white border-fire-red/30 shadow-md hover:shadow-lg hover:border-fire-red/50',
        isCompleted && 'bg-white border-success/30',
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0',
          isLocked ? 'bg-gray-200' : isCompleted ? 'bg-success/10' : 'bg-fire-red/10'
        )}>
          {isLocked ? '🔒' : lesson.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{lesson.topicNumber}</span>
            {isCompleted && <span className="text-xs text-success font-bold">✓</span>}
          </div>
          <h3 className={cn(
            'font-bold text-sm leading-tight',
            isLocked ? 'text-gray-400' : 'text-navy'
          )}>
            {lesson.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{lesson.subtitle}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xs text-flame-orange font-bold">{lesson.xpReward} XP</span>
          <p className="text-xs text-gray-400">~{lesson.estimatedMinutes} Min</p>
          {isCompleted && score !== undefined && (
            <p className={cn(
              'text-xs font-bold mt-1',
              score >= 80 ? 'text-success' : score >= 50 ? 'text-flame-orange' : 'text-error'
            )}>
              {score}%
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isLocked) return card;

  return (
    <Link href={`/lernen/${lesson.id}`}>
      {card}
    </Link>
  );
}
