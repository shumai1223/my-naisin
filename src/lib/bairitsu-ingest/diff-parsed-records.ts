/**
 * T-Y11E E-5: 「前年度からの変化を人が読める形で出す」ための純関数。
 *
 * 冬の収穫パイプラインで新しく取得したR9レコードを、既存の`competition-rates/<pref>.ts`の
 * 前年度（R8）レコードと突き合わせ、学校/学科単位で「新設・廃止・数値変化・変化なし」に
 * 分類する。数字を自動で書き換えることはしない（あくまで人（またはE-5後段の検算ロジック）が
 * 判断するための下ごしらえ）。
 */
import type { ParsedCompetitionRow } from './parse-table-pdf';

function recordKey(r: Pick<ParsedCompetitionRow, 'schoolName' | 'department'>): string {
  return `${r.schoolName}/${r.department}`;
}

export interface FieldChange {
  field: 'quota' | 'finalApplicants' | 'finalRate';
  from: number;
  to: number;
}

export interface ChangedRecordDiff {
  key: string;
  schoolName: string;
  department: string;
  changes: FieldChange[];
}

export interface RecordDiffResult {
  /** 前年度に無く今年度に新規で現れたレコード（学校新設・学科新設・分校独立等）。 */
  added: ParsedCompetitionRow[];
  /** 前年度にあり今年度に消えたレコード（学校統廃合・学科募集停止等）。 */
  removed: ParsedCompetitionRow[];
  /** 両年度に存在するが quota/finalApplicants/finalRate のいずれかが変わったレコード。 */
  changed: ChangedRecordDiff[];
  /** 両年度で完全一致したレコードの件数（差分レポートに列挙する必要が無いため件数のみ保持）。 */
  unchangedCount: number;
}

const NUMERIC_FIELDS: FieldChange['field'][] = ['quota', 'finalApplicants', 'finalRate'];

/**
 * `previous`（前年度）→`current`（今年度）の差分を取る。順序は問わない（内部でキー突合するため）。
 */
export function diffParsedRecords(previous: ParsedCompetitionRow[], current: ParsedCompetitionRow[]): RecordDiffResult {
  const previousByKey = new Map(previous.map((r) => [recordKey(r), r]));
  const currentByKey = new Map(current.map((r) => [recordKey(r), r]));

  const added: ParsedCompetitionRow[] = [];
  const changed: ChangedRecordDiff[] = [];
  let unchangedCount = 0;

  for (const [key, currentRecord] of currentByKey) {
    const previousRecord = previousByKey.get(key);
    if (!previousRecord) {
      added.push(currentRecord);
      continue;
    }
    const changes: FieldChange[] = [];
    for (const field of NUMERIC_FIELDS) {
      if (previousRecord[field] !== currentRecord[field]) {
        changes.push({ field, from: previousRecord[field], to: currentRecord[field] });
      }
    }
    if (changes.length > 0) {
      changed.push({ key, schoolName: currentRecord.schoolName, department: currentRecord.department, changes });
    } else {
      unchangedCount++;
    }
  }

  const removed = previous.filter((r) => !currentByKey.has(recordKey(r)));

  return { added, removed, changed, unchangedCount };
}

/** `diffParsedRecords`の結果を、👤またはloopがそのまま読める日本語のテキストレポートにする。 */
export function formatDiffReport(prefectureCode: string, diff: RecordDiffResult): string {
  const lines: string[] = [];
  lines.push(`# ${prefectureCode} 前年度差分`);
  lines.push('');
  lines.push(`新設: ${diff.added.length}件 / 廃止: ${diff.removed.length}件 / 数値変化: ${diff.changed.length}件 / 変化なし: ${diff.unchangedCount}件`);

  if (diff.added.length > 0) {
    lines.push('');
    lines.push('## 新設');
    for (const r of diff.added) {
      lines.push(`- ${r.schoolName}/${r.department}（quota${r.quota}・applicants${r.finalApplicants}・rate${r.finalRate}）`);
    }
  }

  if (diff.removed.length > 0) {
    lines.push('');
    lines.push('## 廃止');
    for (const r of diff.removed) {
      lines.push(`- ${r.schoolName}/${r.department}（前年quota${r.quota}・applicants${r.finalApplicants}・rate${r.finalRate}）`);
    }
  }

  if (diff.changed.length > 0) {
    lines.push('');
    lines.push('## 数値変化');
    for (const c of diff.changed) {
      const fieldSummary = c.changes.map((ch) => `${ch.field}: ${ch.from}→${ch.to}`).join('・');
      lines.push(`- ${c.schoolName}/${c.department}: ${fieldSummary}`);
    }
  }

  return lines.join('\n');
}
