// ---- Core Game State ----
export interface GameState {
  xp: number;
  level: number;
  completedLessons: string[];
  lessonScores: Record<string, number>;
  completedMissions: string[];
  missionScores: Record<string, MissionScore>;
  earnedBadges: string[];
  streak: StreakData;
  lastActivity: string;
  createdAt: string;
  activities: Activity[];
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string; // "YYYY-MM-DD"
}

export interface MissionScore {
  score: number;
  timeSeconds: number;
  difficulty: Difficulty;
  completedAt: string;
}

export interface Activity {
  type: 'lesson' | 'mission' | 'badge' | 'levelup';
  label: string;
  timestamp: string;
}

// ---- Content Types ----
export interface Lesson {
  id: string;
  topicNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  firefighterAnalogy: string;
  sections: LessonSection[];
  keyConcepts: KeyConcept[];
  interactiveType?: 'compound-calc' | 'triangle-widget' | 'rating-sort' | 'risk-slider';
  miniQuizId: string;
  xpReward: number;
  estimatedMinutes: number;
}

export interface LessonSection {
  heading: string;
  content: string;
  bulletPoints?: string[];
  infoBox?: string;
  tableData?: TableRow[];
}

export interface TableRow {
  cells: string[];
}

export interface KeyConcept {
  term: string;
  definition: string;
  example?: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpValue: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  topicIds: string[];
  difficulty: Difficulty;
  questionCount: number;
  timeLimitSeconds: number;
  xpReward: number;
  requiredLevel: number;
}

export type Difficulty = 'uebungseinsatz' | 'realeinsatz' | 'grosseinsatz';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  hint: string;
  icon: string;
  condition: BadgeCondition;
  xpBonus: number;
}

export interface BadgeCondition {
  type: 'lesson-complete' | 'quiz-score' | 'mission-complete' | 'streak' | 'level' | 'total-lessons' | 'perfect-quiz' | 'specific-lessons';
  value: number | string;
  lessonIds?: string[];
}

export interface LevelDefinition {
  level: number;
  rank: string;
  xpRequired: number;
}
