'use client';

import { KeyConcept } from '@/data/types';

export default function KeyConceptBox({ concept }: { concept: KeyConcept }) {
  return (
    <div className="bg-flame-yellow/10 border border-flame-yellow/30 rounded-lg p-3">
      <p className="font-bold text-sm text-navy">{concept.term}</p>
      <p className="text-sm text-gray-600 mt-0.5">{concept.definition}</p>
      {concept.example && (
        <p className="text-xs text-gray-400 mt-1 italic">Beispiel: {concept.example}</p>
      )}
    </div>
  );
}
