import type { RankDefinition, Scores, Subject } from './types';

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

export const RANK_DEFINITIONS: ReadonlyArray<RankDefinition> = [
  {
    code: 'S',
    minPercent: 85,
    maxPercent: 100,
    title: '神（カミ）',
    message: '強すぎ。ゲームなら最初からラスボス側。今すぐスクショ案件。'
  },
  {
    code: 'A',
    minPercent: 70,
    maxPercent: 84,
    title: 'エース',
    message: '十分強い！あとちょいでS、ここからが一番伸びるゾーン。'
  },
  {
    code: 'B',
    minPercent: 55,
    maxPercent: 69,
    title: '伸びしろ',
    message: 'ここからが育成タイム。どれか1教科上げると世界変わる。'
  },
  {
    code: 'C',
    minPercent: 0,
    maxPercent: 54,
    title: 'もっと伸びる',
    message: '大丈夫。今は"伸びしろ"が最大値。まずはBを目指そう！'
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
