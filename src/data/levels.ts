import { LevelDefinition } from './types';

export const levels: LevelDefinition[] = [
  { level: 1, rank: 'Feuerwehr-Anwärter', xpRequired: 0 },
  { level: 2, rank: 'Feuerwehrmann-Anwärter', xpRequired: 100 },
  { level: 3, rank: 'Feuerwehrmann', xpRequired: 250 },
  { level: 4, rank: 'Oberfeuerwehrmann', xpRequired: 500 },
  { level: 5, rank: 'Hauptfeuerwehrmann', xpRequired: 800 },
  { level: 6, rank: 'Brandmeister-Anwärter', xpRequired: 1200 },
  { level: 7, rank: 'Brandmeister', xpRequired: 1800 },
  { level: 8, rank: 'Oberbrandmeister', xpRequired: 2500 },
];

export function getLevelForXP(xp: number): LevelDefinition {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) return levels[i];
  }
  return levels[0];
}

export function getNextLevel(currentLevel: number): LevelDefinition | null {
  const next = levels.find(l => l.level === currentLevel + 1);
  return next ?? null;
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevelForXP(xp);
  const next = getNextLevel(level.level);
  if (!next) return { current: xp - level.xpRequired, needed: 0, percent: 100 };
  const current = xp - level.xpRequired;
  const needed = next.xpRequired - level.xpRequired;
  return { current, needed, percent: Math.round((current / needed) * 100) };
}
