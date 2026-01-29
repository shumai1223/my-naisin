export type ScoreMode = 'normal' | 'tokyo' | 'prefecture';

export type SubjectCategory = 'core' | 'practical';

export type SubjectKey =
  | 'japanese'
  | 'math'
  | 'english'
  | 'science'
  | 'social'
  | 'music'
  | 'art'
  | 'pe'
  | 'tech';

export type Scores = Record<SubjectKey, number>;

export interface Subject {
  key: SubjectKey;
  label: string;
  shortLabel: string;
  category: SubjectCategory;
}

export type RankCode = 'S' | 'A' | 'B' | 'C';

export interface RankDefinition {
  code: RankCode;
  minPercent: number;
  maxPercent: number;
  title: string;
  message: string;
}

export interface ResultData {
  mode: ScoreMode;
  total: number;
  max: number;
  percent: number;
  rank: RankDefinition;
}

export interface SavedHistoryEntry {
  id: string;
  savedAt: string;
  mode: ScoreMode;
  scores: Scores;
  memo?: string;
  prefectureCode?: string;
  use10PointScale?: boolean;
}

export interface CalculationSettings {
  mode: ScoreMode;
  prefectureCode: string;
  use10PointScale: boolean;
}
