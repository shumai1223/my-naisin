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
  prefectureCode: string;
  total: number;
  max: number;
  percent: number;
  rank: RankDefinition;
}

export interface SavedHistoryEntry {
  id: string;
  savedAt: string;
  scores: Scores;
  memo?: string;
  prefectureCode?: string;
  use10PointScale?: boolean;
}
