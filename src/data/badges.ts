import { BadgeDefinition } from './types';

export const badges: BadgeDefinition[] = [
  {
    id: 'erste-bilanz',
    name: 'Erste Bilanz',
    description: 'Erste Lektion abgeschlossen',
    hint: 'Schließe deine erste Lektion ab',
    icon: '📋',
    condition: { type: 'total-lessons', value: 1 },
    xpBonus: 10,
  },
  {
    id: 'zinseszins-profi',
    name: 'Zinseszins-Profi',
    description: 'Festgeld-Lektion mit 80%+ im Quiz',
    hint: 'Erreiche mindestens 80% im Festgeld-Quiz',
    icon: '💰',
    condition: { type: 'quiz-score', value: 80, lessonIds: ['festgeld'] },
    xpBonus: 15,
  },
  {
    id: 'boersen-experte',
    name: 'Börsen-Experte',
    description: 'Alle Wertpapier-Lektionen abgeschlossen',
    hint: 'Schließe Aktien, Anleihen, Fonds und ETFs ab',
    icon: '📈',
    condition: { type: 'specific-lessons', value: 4, lessonIds: ['aktien', 'anleihen', 'fonds', 'etfs'] },
    xpBonus: 20,
  },
  {
    id: 'goldene-medaille',
    name: 'Goldene Medaille',
    description: '100% in einem Quiz',
    hint: 'Erreiche 100% in irgendeinem Quiz',
    icon: '🥇',
    condition: { type: 'perfect-quiz', value: 100 },
    xpBonus: 20,
  },
  {
    id: 'feuertaufe',
    name: 'Feuertaufe',
    description: 'Ersten Einsatz abgeschlossen',
    hint: 'Bestehe deinen ersten Einsatz',
    icon: '🧑‍🚒',
    condition: { type: 'mission-complete', value: 1 },
    xpBonus: 15,
  },
  {
    id: 'durchhalte-held',
    name: 'Durchhalte-Held',
    description: '7 Tage Streak',
    hint: 'Lerne 7 Tage hintereinander',
    icon: '🔥',
    condition: { type: 'streak', value: 7 },
    xpBonus: 25,
  },
  {
    id: 'dreieck-meister',
    name: 'Dreieck-Meister',
    description: 'Magisches Dreieck gemeistert',
    hint: 'Schließe die Lektion zum Magischen Dreieck ab',
    icon: '🔺',
    condition: { type: 'lesson-complete', value: 'magisches-dreieck' },
    xpBonus: 15,
  },
  {
    id: 'nachhaltig-investor',
    name: 'Nachhaltig-Investor',
    description: 'Nachhaltigkeits-Lektion abgeschlossen',
    hint: 'Schließe die Lektion zu nachhaltigen Geldanlagen ab',
    icon: '🌱',
    condition: { type: 'lesson-complete', value: 'nachhaltigkeit' },
    xpBonus: 10,
  },
  {
    id: 'diversifikator',
    name: 'Diversifikator',
    description: 'Alle Anlageformen gelernt',
    hint: 'Schließe alle Anlageform-Lektionen ab (5-10)',
    icon: '🎯',
    condition: {
      type: 'specific-lessons',
      value: 6,
      lessonIds: ['aktien', 'anleihen', 'fonds', 'etfs', 'edelmetalle', 'immobilien'],
    },
    xpBonus: 25,
  },
  {
    id: 'komplett-geloescht',
    name: 'Komplett Gelöscht!',
    description: 'Alle 13 Lektionen abgeschlossen',
    hint: 'Schließe alle Lektionen ab',
    icon: '🏆',
    condition: { type: 'total-lessons', value: 13 },
    xpBonus: 50,
  },
];

export function checkBadgeCondition(badge: BadgeDefinition, state: {
  completedLessons: string[];
  lessonScores: Record<string, number>;
  completedMissions: string[];
  streak: { current: number; longest: number };
}): boolean {
  const { condition } = badge;
  switch (condition.type) {
    case 'total-lessons':
      return state.completedLessons.length >= (condition.value as number);
    case 'lesson-complete':
      return state.completedLessons.includes(condition.value as string);
    case 'specific-lessons':
      return (condition.lessonIds ?? []).every(id => state.completedLessons.includes(id));
    case 'quiz-score': {
      if (condition.lessonIds) {
        return condition.lessonIds.some(id => (state.lessonScores[id] ?? 0) >= (condition.value as number));
      }
      return Object.values(state.lessonScores).some(s => s >= (condition.value as number));
    }
    case 'perfect-quiz':
      return Object.values(state.lessonScores).some(s => s >= 100);
    case 'mission-complete':
      return state.completedMissions.length >= (condition.value as number);
    case 'streak':
      return state.streak.current >= (condition.value as number) || state.streak.longest >= (condition.value as number);
    default:
      return false;
  }
}
