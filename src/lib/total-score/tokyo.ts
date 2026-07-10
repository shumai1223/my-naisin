/**
 * 東京都の総合得点計算（S-5②）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝東京都は学力検査700点+調査書300点+ESAT-J20点の
 * 独自配点(1020点満点)で、registryの単純な倍率×素点方式とは構造が異なるため個別実装している。
 * このファイルは TokyoTotalScoreCalculator.tsx にインラインだった計算ロジックを切り出した単一ソースで、
 * UIとAPI/MCPで計算結果がズレないようにする（新規計算ロジックの追加ではない）。
 */

export interface TokyoEsatGrade {
  grade: string;
  score: number;
  label: string;
}

/** ESAT-J（英語スピーキングテスト）の評価段階と加点。 */
export const TOKYO_ESAT_GRADES: TokyoEsatGrade[] = [
  { grade: 'A', score: 20, label: '80点以上' },
  { grade: 'B', score: 16, label: '65〜79点' },
  { grade: 'C', score: 12, label: '50〜64点' },
  { grade: 'D', score: 8, label: '35〜49点' },
  { grade: 'E', score: 4, label: '20〜34点' },
  { grade: 'F', score: 0, label: '20点未満' },
  { grade: 'なし', score: 0, label: '未受験・対象外' },
];

export const TOKYO_TOTAL_SCORE_MAX = 1020;

export interface TokyoTotalScoreInput {
  /** 5教科学力検査の合計点（500点満点）。 */
  academicRaw: number;
  /** 換算内申（65点満点＝5教科の評定＋実技4教科×2）。 */
  naishinRaw: number;
  /** ESAT-Jの評価段階（TOKYO_ESAT_GRADESのgrade）。未知の値は加点0扱い。 */
  esatGrade: string;
}

export interface TokyoTotalScoreResult {
  academicConverted: number;
  naishinConverted: number;
  esatScore: number;
  total: number;
  max: number;
  percent: number;
}

/** 学力検査点(500点満点)→700点換算＋調査書点(65点満点)→300点換算＋ESAT-J加点で総合得点(1020点満点)を計算。 */
export function computeTokyoTotalScore(input: TokyoTotalScoreInput): TokyoTotalScoreResult {
  const academicConverted = Math.round((input.academicRaw / 500) * 700);
  const naishinConverted = Math.round((input.naishinRaw / 65) * 300);
  const esatScore = TOKYO_ESAT_GRADES.find((g) => g.grade === input.esatGrade)?.score ?? 0;
  const total = academicConverted + naishinConverted + esatScore;
  return {
    academicConverted,
    naishinConverted,
    esatScore,
    total,
    max: TOKYO_TOTAL_SCORE_MAX,
    percent: (total / TOKYO_TOTAL_SCORE_MAX) * 100,
  };
}

/** 総合得点帯からおおまかな併願校レベルの目安ラベルを返す（学校別ボーダー断定なし）。 */
export function tokyoRankLabel(total: number): string {
  if (total >= 880) return '最難関校レベル（日比谷・西・国立）';
  if (total >= 840) return '難関校レベル（戸山・青山）';
  if (total >= 800) return '上位校レベル（新宿・駒場）';
  if (total >= 720) return '中堅上位校レベル（小山台・三田）';
  if (total >= 640) return '中堅校レベル（城東・広尾）';
  if (total >= 560) return '中堅下位校レベル';
  return '基礎を固める段階';
}
