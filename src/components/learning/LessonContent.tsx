'use client';

import { LessonSection, KeyConcept, TableRow } from '@/data/types';
import KeyConceptBox from './KeyConceptBox';
import ComparisonTable from './ComparisonTable';

interface LessonContentProps {
  sections: LessonSection[];
  keyConcepts: KeyConcept[];
  firefighterAnalogy: string;
}

export default function LessonContent({ sections, keyConcepts, firefighterAnalogy }: LessonContentProps) {
  return (
    <div className="space-y-6">
      {/* Feuerwehr-Brücke */}
      <div className="bg-flame-orange/10 border-l-4 border-flame-orange rounded-r-xl p-4">
        <div className="flex items-start gap-2">
          <span className="text-xl flex-shrink-0">🧑‍🚒</span>
          <div>
            <p className="font-bold text-sm text-navy mb-1">Feuerwehr-Brücke</p>
            <p className="text-sm text-gray-700 leading-relaxed">{firefighterAnalogy}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <div key={i} className="space-y-3">
          <h3 className="font-bold text-navy text-lg">{section.heading}</h3>
          {section.content && (
            <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
          )}
          {section.bulletPoints && (
            <ul className="space-y-1.5">
              {section.bulletPoints.map((point, j) => (
                <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-fire-red mt-0.5 flex-shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          {section.infoBox && (
            <div className="bg-navy/5 border border-navy/10 rounded-xl p-4">
              <p className="text-sm text-navy font-medium leading-relaxed whitespace-pre-line">{section.infoBox}</p>
            </div>
          )}
          {section.tableData && section.tableData.length > 0 && (
            <ComparisonTable rows={section.tableData} />
          )}
        </div>
      ))}

      {/* Key Concepts */}
      {keyConcepts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-navy text-lg flex items-center gap-2">
            <span>📝</span> Schlüsselbegriffe
          </h3>
          <div className="space-y-2">
            {keyConcepts.map((concept, i) => (
              <KeyConceptBox key={i} concept={concept} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
