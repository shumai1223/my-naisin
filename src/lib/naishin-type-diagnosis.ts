/**
 * 内申点タイプ診断（ZZ-5c・診断プロダクト1本）。
 *
 * 設計原則（👤指示: 射幸性・優劣煽り禁止）:
 *  - タイプ間に優劣・順位を設けない（S/A/B/C式のランクは既存の/（ホーム）の遊び要素であり、
 *    本診断では意図的に採用しない）。
 *  - 使う数値は①利用者が入力した9教科評定（Scores・既存のSUBJECTS定義）②prefectures.tsの
 *    検証済み倍率設定のみ。新規の一次データ・断定的な相場観は一切加えない。
 *  - 各タイプの説明は「あなたの県の制度でどう働くか」という構造的事実の記述に徹し、
 *    「有利/不利」ではなく「反映されやすい/されにくい」という中立語彙を使う。
 */
import { SUBJECTS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { Scores } from '@/lib/types';

export type NaishinTypeId = 'balanced' | 'practical-lean' | 'core-lean' | 'uneven';

export interface NaishinTypeDefinition {
  id: NaishinTypeId;
  label: string;
  /** タイプの判定根拠（利用者の入力データに基づく説明・優劣を含まない）。 */
  basis: string;
}

export const NAISHIN_TYPES: Record<NaishinTypeId, NaishinTypeDefinition> = {
  balanced: {
    id: 'balanced',
    label: 'バランス型',
    basis: '9教科の評定のばらつきが小さく、教科ごとの得意・不得意が目立たない構成です。',
  },
  'practical-lean': {
    id: 'practical-lean',
    label: '実技教科型',
    basis: '実技4教科（音楽・美術・保健体育・技術家庭）の評定が、主要5教科より平均して高い構成です。',
  },
  'core-lean': {
    id: 'core-lean',
    label: '主要教科型',
    basis: '主要5教科（国語・数学・英語・理科・社会）の評定が、実技4教科より平均して高い構成です。',
  },
  uneven: {
    id: 'uneven',
    label: '教科差型',
    basis: '9教科の中で評定の差が大きく（最も高い評定と最も低い評定の差が2以上）、特定教科に伸びしろが集中している構成です。',
  },
};

export interface NaishinTypeResult {
  type: NaishinTypeDefinition;
  coreAverage: number;
  practicalAverage: number;
  spread: number;
  /** 都道府県の制度がこのタイプにどう働くかの構造的事実（優劣を含まない）。県データ不明ならnull。 */
  prefectureNote: string | null;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

/** 評定バランスの閾値（この差以上でpractical-lean/core-leanと判定）。0.5評定分の平均差。 */
const LEAN_THRESHOLD = 0.5;
/** 教科差の閾値（最高-最低評定がこれ以上でuneven判定）。 */
const SPREAD_THRESHOLD = 2;

/**
 * 9教科評定から内申点タイプを決定論で判定する（純粋関数・優劣を含まない構造分類）。
 * evennessの判定を最優先（特定教科の落ち込みが最も対策の焦点になりやすいため）、
 * 次に実技/主要の傾き、どちらでもなければbalanced。
 */
export function diagnoseNaishinType(scores: Scores, prefectureCode?: string): NaishinTypeResult {
  const coreValues = SUBJECTS.filter((s) => s.category === 'core').map((s) => scores[s.key]);
  const practicalValues = SUBJECTS.filter((s) => s.category === 'practical').map((s) => scores[s.key]);
  const all = [...coreValues, ...practicalValues];

  const coreAverage = average(coreValues);
  const practicalAverage = average(practicalValues);
  const spread = Math.max(...all) - Math.min(...all);

  let typeId: NaishinTypeId;
  if (spread >= SPREAD_THRESHOLD) {
    typeId = 'uneven';
  } else if (practicalAverage - coreAverage >= LEAN_THRESHOLD) {
    typeId = 'practical-lean';
  } else if (coreAverage - practicalAverage >= LEAN_THRESHOLD) {
    typeId = 'core-lean';
  } else {
    typeId = 'balanced';
  }

  const prefectureNote = buildPrefectureNote(typeId, prefectureCode);

  return { type: NAISHIN_TYPES[typeId], coreAverage, practicalAverage, spread, prefectureNote };
}

/**
 * 都道府県の実技倍率設定から、このタイプが「その県の内申点計算にどう反映されるか」を
 * 中立的に記述する（prefectures.tsの検証済み数値のみを使用・新規断定なし）。
 */
function buildPrefectureNote(typeId: NaishinTypeId, prefectureCode?: string): string | null {
  if (!prefectureCode) return null;
  const pref = getPrefectureByCode(prefectureCode);
  if (!pref) return null;

  const practicalHeavier = pref.practicalMultiplier > pref.coreMultiplier;

  if (typeId === 'practical-lean') {
    return practicalHeavier
      ? `${pref.name}は実技4教科の倍率(${pref.practicalMultiplier}倍)が主要教科(${pref.coreMultiplier}倍)より高いため、実技教科の評定が内申点の計算により強く反映されます。`
      : `${pref.name}は実技教科と主要教科の倍率が同等(${pref.practicalMultiplier}倍/${pref.coreMultiplier}倍)のため、実技教科の評定は内申点の計算に評定の数値どおりそのまま反映されます。`;
  }
  if (typeId === 'core-lean') {
    return practicalHeavier
      ? `${pref.name}は実技4教科の倍率(${pref.practicalMultiplier}倍)が主要教科(${pref.coreMultiplier}倍)より高いため、内申点の計算では実技教科の評定の影響がより大きくなる構造です。`
      : `${pref.name}は実技教科と主要教科の倍率が同等(${pref.practicalMultiplier}倍/${pref.coreMultiplier}倍)のため、主要教科の評定は内申点の計算に評定の数値どおりそのまま反映されます。`;
  }
  if (typeId === 'uneven') {
    return practicalHeavier
      ? `${pref.name}は実技4教科の倍率が主要教科の${pref.practicalMultiplier}倍のため、評定差が大きい教科が実技側にある場合は内申点への影響がより大きくなります。`
      : null;
  }
  return null;
}
