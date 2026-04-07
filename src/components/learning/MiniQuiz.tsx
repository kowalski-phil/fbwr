'use client';

import { useState } from 'react';
import { Quiz, Question } from '@/data/types';
import { cn } from '@/lib/utils';

interface MiniQuizProps {
  quiz: Quiz;
  onComplete: (score: number, totalXP: number) => void;
}

export default function MiniQuiz({ quiz, onComplete }: MiniQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[currentIndex];
  const isCorrect = selectedAnswer === question?.correctIndex;
  const progress = ((currentIndex + (finished ? 1 : 0)) / quiz.questions.length) * 100;

  function handleAnswer(index: number) {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setCorrectCount(c => c + 1);
      setEarnedXP(xp => xp + question.xpValue);
    }
  }

  function handleNext() {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
      const finalCorrect = correctCount + (isCorrect ? 0 : 0); // already counted
      const score = Math.round((correctCount / quiz.questions.length) * 100);
      onComplete(score, earnedXP);
    }
  }

  if (finished) {
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    return (
      <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
        <div className="text-5xl mb-3">
          {score >= 80 ? '🎉' : score >= 50 ? '👍' : '💪'}
        </div>
        <h3 className="text-xl font-bold text-navy mb-1">Quiz abgeschlossen!</h3>
        <p className="text-3xl font-bold mb-1">
          <span className={score >= 80 ? 'text-success' : score >= 50 ? 'text-flame-orange' : 'text-error'}>
            {score}%
          </span>
        </p>
        <p className="text-sm text-gray-500">
          {correctCount} von {quiz.questions.length} richtig
        </p>
        <p className="text-flame-orange font-bold mt-2">+{earnedXP} XP</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        <span>Frage {currentIndex + 1} von {quiz.questions.length}</span>
        <span>{correctCount} richtig</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-fire-red h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

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
                !showResult && selectedAnswer === null && 'border-gray-200',
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={cn(
            'mt-4 p-3 rounded-lg text-sm',
            isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          )}>
            <p className="font-bold mb-1">{isCorrect ? '✓ Richtig!' : '✗ Leider falsch'}</p>
            <p className="text-gray-600">{question.explanation}</p>
          </div>
        )}

        {showResult && (
          <button
            onClick={handleNext}
            className="w-full mt-4 bg-fire-red text-white font-bold py-3 rounded-lg hover:bg-fire-red-light transition-colors"
          >
            {currentIndex < quiz.questions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
          </button>
        )}
      </div>
    </div>
  );
}
