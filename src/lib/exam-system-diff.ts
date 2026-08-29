// T-N1-3: 2つの年度スナップショット(exam-system.json形式)を比較し、差分を返す純関数。
//
// N1-2(前年度データ収集)が完了するまで比較対象の前年度スナップショットは実在しないため、
// この関数自体は実データに依存しない(引数として2つのスナップショットを受け取るだけ)。
// N1-2完了後は src/data/snapshots/2025-r7/exam-system.json を読み込んで呼び出すだけで
// N1-3が完成する設計(実装の先出し・データ収集とロジック実装を分離)。
//
// N1-0の3値ルールを厳守する: 前年度に県のレコードが存在しない場合は「変更なし」に丸めず
// unverifiableとして正直に返す(取得不能を隠さない)。

import type { DetectionMethod, DiffEntry, DiffStatus } from '@/lib/exam-system-diff-types';

export interface ExamSystemSnapshotEntry {
  code: string;
  name: string;
  fiscalYear: number | null;
  targetGrades: number[];
  gradeMultipliers: Record<string, number> | number[] | null;
  coreMultiplier: number;
  practicalMultiplier: number;
  maxScore: number;
  simplifiedCalc: boolean;
  actualMaxScore: number | null;
  supports10PointScale: boolean;
  variantCount: number;
  reverseCalc: unknown;
  sourceUrl: string | null;
  [key: string]: unknown;
}

export interface ExamSystemSnapshot {
  meta: { fiscalYearLabel: string; [key: string]: unknown };
  entries: ExamSystemSnapshotEntry[];
}

/** 差分検出の対象フィールド(制度の実質に関わるもののみ。name/lastVerified/sourceUrl等のメタ情報は対象外)。 */
const COMPARABLE_FIELDS = [
  'targetGrades',
  'gradeMultipliers',
  'coreMultiplier',
  'practicalMultiplier',
  'maxScore',
  'simplifiedCalc',
  'actualMaxScore',
  'supports10PointScale',
  'variantCount',
  'reverseCalc',
] as const;

const DETECTION_METHOD: DetectionMethod = 'machine';

function byCode(entries: ExamSystemSnapshotEntry[]): Map<string, ExamSystemSnapshotEntry> {
  return new Map(entries.map((e) => [e.code, e]));
}

/** 値の等価判定。配列/オブジェクトはJSON文字列化して比較する(スナップショットは同一生成関数由来のためキー順は安定している)。 */
function valuesEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * 2つの年度スナップショットを比較し、都道府県×フィールド単位のDiffEntry配列を返す。
 * - 片方に県のレコードが無い場合はその県の全フィールドを'unverifiable'として返す(2値化しない)。
 * - sourceUrlが片方でも欠けているフィールドは'unverifiable'として返す(1差分1出典を守れないため)。
 * - detectionMethodは常に'machine'(この関数自体は自動検出のみを行う。人間による確認はN1-0②の別工程)。
 */
export function diffExamSystemSnapshots(
  previous: ExamSystemSnapshot,
  current: ExamSystemSnapshot
): DiffEntry[] {
  const prevByCode = byCode(previous.entries);
  const currByCode = byCode(current.entries);
  const allCodes = new Set<string>([...prevByCode.keys(), ...currByCode.keys()]);

  const result: DiffEntry[] = [];

  for (const code of Array.from(allCodes).sort()) {
    const prev = prevByCode.get(code);
    const curr = currByCode.get(code);

    if (!prev || !curr) {
      // 片方の年度にレコードが無い＝比較不能。'unchanged'に丸めず正直に不明と返す。
      result.push({
        prefectureCode: code,
        field: '*',
        status: 'unverifiable',
        previousValue: prev ? '(entry exists)' : null,
        currentValue: curr ? '(entry exists)' : null,
        previousSourceUrl: prev?.sourceUrl ?? null,
        currentSourceUrl: curr?.sourceUrl ?? null,
        detectionMethod: DETECTION_METHOD,
        unverifiableReason: !prev
          ? '前年度スナップショットにこの県のレコードが無い(未収集)'
          : '今年度スナップショットにこの県のレコードが無い(未収集)',
      });
      continue;
    }

    for (const field of COMPARABLE_FIELDS) {
      const previousValue = prev[field];
      const currentValue = curr[field];
      const previousSourceUrl = prev.sourceUrl;
      const currentSourceUrl = curr.sourceUrl;

      let status: DiffStatus;
      let unverifiableReason: string | undefined;

      if (!previousSourceUrl || !currentSourceUrl) {
        // 出典URLが片方でも無ければ「変更あり/なし」を確定させない(1差分1出典を守る)。
        status = 'unverifiable';
        unverifiableReason = '出典URLが片方の年度で未記録のため差分を確定できない';
      } else {
        status = valuesEqual(previousValue, currentValue) ? 'unchanged' : 'changed';
      }

      result.push({
        prefectureCode: code,
        field,
        status,
        previousValue,
        currentValue,
        previousSourceUrl,
        currentSourceUrl,
        detectionMethod: DETECTION_METHOD,
        ...(unverifiableReason ? { unverifiableReason } : {}),
      });
    }
  }

  return result;
}

/** 'changed'判定のみを抽出する(レポート生成側でよく使うフィルタなのでヘルパー化)。 */
export function changedEntries(diffs: DiffEntry[]): DiffEntry[] {
  return diffs.filter((d) => d.status === 'changed');
}

/** 'unverifiable'判定のみを抽出する(「検出できない範囲」をレポートに正直に明記するために使う)。 */
export function unverifiableEntries(diffs: DiffEntry[]): DiffEntry[] {
  return diffs.filter((d) => d.status === 'unverifiable');
}
