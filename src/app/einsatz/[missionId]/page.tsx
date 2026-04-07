'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import PageShell from '@/components/layout/PageShell';
import XPGainToast from '@/components/gamification/XPGainToast';
import LevelUpModal from '@/components/gamification/LevelUpModal';
import { getMissionById, missions } from '@/data/missions';
import { quizzes } from '@/data/quizzes';
import { Question } from '@/data/types';
import { useGameState } from '@/hooks/useGameState';
import { checkBadgeCondition, badges } from '@/data/badges';
import { cn } from '@/lib/utils';

export default function MissionPage() {
  return (
    <PageShell>
      <MissionContent />
      <XPGainToast />
      <LevelUpModal />
    </PageShell>
  );
}

function MissionContent() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string;
  const { state, addXP, completeMission, earnBadge, recordActivity, updateStreak } = useGameState();

  const mission = getMissionById(missionId);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const finishMission = useCallback((correct: number, totalQuestions: number) => {
    if (!mission) return;
    const score = Math.round((correct / totalQuestions) * 100);
    const timeUsed = Math.round((Date.now() - startTime) / 1000);
    const isRepeat = state.completedMissions.includes(mission.id);
    const xp = isRepeat ? Math.round(mission.xpReward * 0.5) : mission.xpReward;

    addXP(xp);
    completeMission(mission.id, {
      score,
      timeSeconds: timeUsed,
      difficulty: mission.difficulty,
      completedAt: new Date().toISOString(),
    });
    updateStreak();
    recordActivity({ type: 'mission', label: `${mission.title} abgeschlossen (${score}%)` });

    const updatedState = {
      ...state,
      completedMissions: state.completedMissions.includes(mission.id)
        ? state.completedMissions
        : [...state.completedMissions, mission.id],
    };
    for (const badge of badges) {
      if (!state.earnedBadges.includes(badge.id) && checkBadgeCondition(badge, updatedState)) {
        earnBadge(badge.id);
        addXP(badge.xpBonus);
        recordActivity({ type: 'badge', label: `Abzeichen "${badge.name}" freigeschaltet!` });
      }
    }

    setFinished(true);
  }, [mission, startTime, state, addXP, completeMission, updateStreak, recordActivity, earnBadge]);

  // Timer
  useEffect(() => {
    if (!started || finished || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishMission(correctCount, questions.length);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished, timeLeft, correctCount, questions.length, finishMission]);

  if (!mission) {
    return <p className="text-center text-gray-500 py-8">Einsatz nicht gefunden.</p>;
  }

  function startMission() {
    // Collect questions from relevant quizzes
    const relevantQuestions: Question[] = [];
    for (const topicId of mission!.topicIds) {
      const quiz = quizzes.find(q => q.id === `quiz-${topicId}`);
      if (quiz) relevantQuestions.push(...quiz.questions);
    }
    // Shuffle and take the right number
    const shuffled = relevantQuestions.sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, mission!.questionCount));
    setTimeLeft(mission!.timeLimitSeconds);
    setStartTime(Date.now());
    setStarted(true);
  }

  function handleAnswer(index: number) {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentIndex].correctIndex) {
      setCorrectCount(c => c + 1);
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalCorrect = correctCount + (selectedAnswer === questions[currentIndex].correctIndex ? 0 : 0);
      finishMission(correctCount, questions.length);
    }
  }

  // Pre-start screen
  if (!started) {
    return (
      <div className="space-y-6 text-center py-8">
        <div className="text-6xl">🚨</div>
        <h1 className="text-2xl font-bold text-navy">{mission.title}</h1>
        <p className="text-gray-500">{mission.description}</p>
        <div className="flex justify-center gap-6 text-sm text-gray-500">
          <span>📝 {mission.questionCount} Fragen</span>
          <span>⏱️ {Math.floor(mission.timeLimitSeconds / 60)}:{(mission.timeLimitSeconds % 60).toString().padStart(2, '0')} Min</span>
          <span className="text-flame-orange font-bold">{mission.xpReward} XP</span>
        </div>
        <button
          onClick={startMission}
          className="bg-fire-red text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-fire-red-light transition-colors"
        >
          Einsatz starten! 🚒
        </button>
        <button
          onClick={() => router.push('/einsatz')}
          className="block mx-auto text-sm text-gray-400 hover:text-navy"
        >
          ← Zurück
        </button>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="space-y-6 text-center py-8">
        <div className="text-6xl">{score >= 80 ? '🎉' : score >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-navy">Einsatz beendet!</h2>
        <p className="text-4xl font-bold">
          <span className={score >= 80 ? 'text-success' : score >= 50 ? 'text-flame-orange' : 'text-error'}>
            {score}%
          </span>
        </p>
        <p className="text-gray-500">{correctCount} von {questions.length} richtig</p>
        <button
          onClick={() => router.push('/einsatz')}
          className="bg-fire-red text-white font-bold py-3 px-8 rounded-xl hover:bg-fire-red-light transition-colors"
        >
          Zurück zur Einsatz-Zentrale
        </button>
      </div>
    );
  }

  // Active quiz
  const question = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <div className="space-y-4">
      {/* Timer bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Frage {currentIndex + 1}/{questions.length}</span>
        <span className={cn(
          'font-mono font-bold text-lg',
          timeLeft <= 30 ? 'text-error' : 'text-navy'
        )}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={cn('h-full rounded-full transition-all', timeLeft <= 30 ? 'bg-error' : 'bg-fire-red')}
          style={{ width: `${(timeLeft / mission.timeLimitSeconds) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <p className="font-bold text-navy mb-4">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showResult}
              className={cn(
                'w-full text-left p-3 rounded-lg border text-sm font-medium transition-all',
                !showResult && 'hover:bg-gray-50 border-gray-200',
                showResult && i === question.correctIndex && 'bg-success/10 border-success text-success',
                showResult && i === selectedAnswer && i !== question.correctIndex && 'bg-error/10 border-error text-error animate-shake',
                showResult && i !== selectedAnswer && i !== question.correctIndex && 'opacity-50',
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <>
            <div className={cn(
              'mt-4 p-3 rounded-lg text-sm',
              isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            )}>
              <p className="font-bold mb-1">{isCorrect ? '✓ Richtig!' : '✗ Falsch'}</p>
              <p className="text-gray-600">{question.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-fire-red text-white font-bold py-3 rounded-lg hover:bg-fire-red-light transition-colors"
            >
              {currentIndex < questions.length - 1 ? 'Weiter' : 'Ergebnis'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
