import type { RankDefinition, ScoreMode, Scores, Subject } from './types';

export const APP_NAME = 'My Naishin';
export const APP_NAME_JA = 'マイナイシン';
export const APP_DESCRIPTION = '内申点を一瞬で可視化して、スマホ縦長画像でシェアできる。';

export const SUBJECTS: ReadonlyArray<Subject> = [
  { key: 'japanese', label: '国語', shortLabel: '国', category: 'core' },
  { key: 'math', label: '数学', shortLabel: '数', category: 'core' },
  { key: 'english', label: '英語', shortLabel: '英', category: 'core' },
  { key: 'science', label: '理科', shortLabel: '理', category: 'core' },
  { key: 'social', label: '社会', shortLabel: '社', category: 'core' },
  { key: 'music', label: '音楽', shortLabel: '音', category: 'practical' },
  { key: 'art', label: '美術', shortLabel: '美', category: 'practical' },
  { key: 'pe', label: '保体', shortLabel: '体', category: 'practical' },
  { key: 'tech', label: '技家', shortLabel: '技', category: 'practical' }
];

export const MODE_CONFIG: Record<ScoreMode, { label: string; description: string; max: number; weights: { core: number; practical: number } }> = {
  normal: {
    label: '通常モード',
    description: '9教科 × 5点 = 45点満点',
    max: 45,
    weights: { core: 1, practical: 1 }
  },
  tokyo: {
    label: '換算モード(東京方式)',
    description: '(5教科 × 5) + (実技4教科 × 2 × 5) = 65点満点',
    max: 65,
    weights: { core: 1, practical: 2 }
  },
  prefecture: {
    label: '都道府県別',
    description: '各都道府県の計算方法で算出',
    max: 0, // 動的に設定
    weights: { core: 1, practical: 1 } // 動的に設定
  }
};

export const RANK_DEFINITIONS: ReadonlyArray<RankDefinition> = [
  {
    code: 'S',
    minPercent: 80,
    maxPercent: 100,
    title: '神（カミ）',
    message: '強すぎ。ゲームなら最初からラスボス側。今すぐスクショ案件。'
  },
  {
    code: 'A',
    minPercent: 65,
    maxPercent: 79,
    title: 'エース',
    message: '十分強い！あとちょいでS、ここからが一番伸びるゾーン。'
  },
  {
    code: 'B',
    minPercent: 50,
    maxPercent: 64,
    title: '伸びしろ',
    message: 'ここからが育成タイム。どれか1教科上げると世界変わる。'
  },
  {
    code: 'C',
    minPercent: 0,
    maxPercent: 49,
    title: 'もっと伸びる',
    message: '大丈夫。今は“伸びしろ”が最大値。まずはBを目指そう！'
  }
];

export const DEFAULT_SCORES: Scores = {
  japanese: 3,
  math: 3,
  english: 3,
  science: 3,
  social: 3,
  music: 3,
  art: 3,
  pe: 3,
  tech: 3
};
