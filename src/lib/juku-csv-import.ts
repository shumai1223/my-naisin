/**
 * 塾SaaS MVP「デモできる実物」(ZZ-4b・Ω-8実行層・build-not-launch)のCSV一括取込。
 *
 * なぜ：塾担当者は生徒数十〜数百人分の成績を毎回1件ずつ手入力できない。
 * CSVテンプレートで一括登録できる導線が「使ってもらえる実物」の必要条件。
 *
 * 設計思想（捏造ゼロ・決定論バリデーション）：
 *  - パース自体は決定論の純関数（DBにもネットワークにも触れない）＝テストで完全固定できる。
 *  - 曖昧な自動補正（表記ゆれの推測補完等）は一切行わない。1行でも規則に反したら
 *    その行だけをエラー行として明示し、有効な行は取り込む（1行の不正で全件を止めない）。
 *  - value/max_valueは既存エンジン(naishin/hensachi/total-score)の計算結果をそのまま
 *    転記する想定で、本モジュールは数値の妥当性チェックのみ行い採点は一切しない。
 */
import { PREFECTURES } from '@/lib/prefectures';
import { addJukuStudent, addScoreSnapshot, listJukuStudents, type SnapshotMetric } from '@/lib/juku-saas-db';

const VALID_METRICS: readonly SnapshotMetric[] = ['naishin', 'hensachi', 'total-score'];
const VALID_PREFECTURE_CODES = new Set(PREFECTURES.map((p) => p.code));

/** 期待するCSVヘッダ（順不同可・大文字小文字/前後空白は無視）。 */
export const JUKU_CSV_REQUIRED_HEADERS = ['display_name', 'metric', 'value', 'recorded_at'] as const;
export const JUKU_CSV_OPTIONAL_HEADERS = ['prefecture_code', 'max_value'] as const;
export const JUKU_CSV_ALL_HEADERS = [...JUKU_CSV_REQUIRED_HEADERS, ...JUKU_CSV_OPTIONAL_HEADERS] as const;

/** RFC4180簡易パーサ：ダブルクォート囲み・エスケープ("")・カンマ内包に対応。改行はサポート外(1行1レコード前提)。 */
export function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields.map((f) => f.trim());
}

export interface JukuCsvRowData {
  displayName: string;
  prefectureCode?: string;
  metric: SnapshotMetric;
  value: number;
  maxValue?: number;
  recordedAt: string;
}

export interface JukuCsvRowResult {
  /** 人間向けの行番号（ヘッダを1行目として2行目から採番）。 */
  rowNumber: number;
  raw: string;
  valid: boolean;
  data?: JukuCsvRowData;
  error?: string;
}

export interface JukuCsvParseResult {
  /** ヘッダ自体が不正（必須列の欠落）な場合のみ設定。設定時はrowsは空。 */
  headerError?: string;
  rows: JukuCsvRowResult[];
  validRows: JukuCsvRowResult[];
  errorRows: JukuCsvRowResult[];
}

/** YYYY-MM-DD形式かつ実在する暦日か（例: 2026-02-30は無効）を検証。 */
function isValidCalendarDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/**
 * CSVテキストをパース+決定論バリデーションする（DB非依存の純関数）。
 * ヘッダ必須列が1つでも欠けていれば headerError を返しrows処理自体を行わない。
 * ヘッダが有効なら、データ行を1行ずつ検証し validRows / errorRows に振り分ける
 * （1行の不正で他の行の取込を止めない）。
 */
export function parseJukuCsv(csvText: string): JukuCsvParseResult {
  const lines = csvText.split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { headerError: 'CSVが空です。', rows: [], validRows: [], errorRows: [] };
  }

  const headerCells = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const missing = JUKU_CSV_REQUIRED_HEADERS.filter((h) => !headerCells.includes(h));
  if (missing.length > 0) {
    return {
      headerError: `必須列が見つかりません: ${missing.join(', ')}（1行目はヘッダ行である必要があります）`,
      rows: [],
      validRows: [],
      errorRows: [],
    };
  }

  const colIndex = (name: string): number => headerCells.indexOf(name);
  const iDisplayName = colIndex('display_name');
  const iPrefCode = colIndex('prefecture_code');
  const iMetric = colIndex('metric');
  const iValue = colIndex('value');
  const iMaxValue = colIndex('max_value');
  const iRecordedAt = colIndex('recorded_at');

  const rows: JukuCsvRowResult[] = [];
  for (let li = 1; li < lines.length; li++) {
    const raw = lines[li];
    const rowNumber = li + 1;
    const cells = parseCsvLine(raw);

    if (cells.length < headerCells.length) {
      rows.push({ rowNumber, raw, valid: false, error: `カラム数が不足しています（${headerCells.length}列必要・${cells.length}列しかありません）` });
      continue;
    }

    const displayName = cells[iDisplayName]?.trim() ?? '';
    if (!displayName) {
      rows.push({ rowNumber, raw, valid: false, error: 'display_nameが空です' });
      continue;
    }
    if (displayName.length > 80) {
      rows.push({ rowNumber, raw, valid: false, error: 'display_nameが80文字を超えています' });
      continue;
    }

    const prefectureCodeRaw = iPrefCode >= 0 ? cells[iPrefCode]?.trim() : '';
    if (prefectureCodeRaw && !VALID_PREFECTURE_CODES.has(prefectureCodeRaw)) {
      rows.push({ rowNumber, raw, valid: false, error: `prefecture_codeが未知の値です: ${prefectureCodeRaw}` });
      continue;
    }

    const metricRaw = cells[iMetric]?.trim() as SnapshotMetric;
    if (!VALID_METRICS.includes(metricRaw)) {
      rows.push({ rowNumber, raw, valid: false, error: `metricはnaishin/hensachi/total-scoreのいずれかである必要があります（実際: ${cells[iMetric]}）` });
      continue;
    }

    const valueRaw = cells[iValue]?.trim();
    const value = Number(valueRaw);
    if (valueRaw === '' || !Number.isFinite(value)) {
      rows.push({ rowNumber, raw, valid: false, error: `valueが数値ではありません: ${valueRaw}` });
      continue;
    }

    const maxValueRaw = iMaxValue >= 0 ? cells[iMaxValue]?.trim() : '';
    let maxValue: number | undefined;
    if (maxValueRaw) {
      maxValue = Number(maxValueRaw);
      if (!Number.isFinite(maxValue)) {
        rows.push({ rowNumber, raw, valid: false, error: `max_valueが数値ではありません: ${maxValueRaw}` });
        continue;
      }
    }

    const recordedAt = cells[iRecordedAt]?.trim() ?? '';
    if (!isValidCalendarDate(recordedAt)) {
      rows.push({ rowNumber, raw, valid: false, error: `recorded_atはYYYY-MM-DD形式の実在する日付である必要があります: ${recordedAt}` });
      continue;
    }

    rows.push({
      rowNumber,
      raw,
      valid: true,
      data: {
        displayName,
        prefectureCode: prefectureCodeRaw || undefined,
        metric: metricRaw,
        value,
        maxValue,
        recordedAt,
      },
    });
  }

  return {
    rows,
    validRows: rows.filter((r) => r.valid),
    errorRows: rows.filter((r) => !r.valid),
  };
}

export interface JukuCsvImportOutcome {
  headerError?: string;
  /** パース時点でのエラー行（D1に一切触れる前の決定論バリデーション結果）。 */
  errorRows: JukuCsvRowResult[];
  /** D1書き込みまで成功した件数。 */
  importedCount: number;
  /** バリデーションは通ったがD1書き込みに失敗した行（D1未バインド環境を含む）。 */
  writeFailedRows: JukuCsvRowResult[];
}

/**
 * CSVをパース+検証したうえで、有効行のみD1へ書き込む（生徒は表示名で塾アカウント内マッチ、
 * 無ければ新規作成）。バリデーションエラー行は一切書き込まない＝取込前に必ず弾く。
 * D1未バインド環境（jest等）では全書き込みが失敗しwriteFailedRowsに積まれる（例外は投げない）。
 */
export async function importJukuCsvRows(jukuAccountId: number, csvText: string): Promise<JukuCsvImportOutcome> {
  const parsed = parseJukuCsv(csvText);
  if (parsed.headerError) {
    return { headerError: parsed.headerError, errorRows: [], importedCount: 0, writeFailedRows: [] };
  }

  const existing = await listJukuStudents(jukuAccountId);
  const byName = new Map(existing.map((s) => [s.displayName, s.id]));

  let importedCount = 0;
  const writeFailedRows: JukuCsvRowResult[] = [];

  for (const row of parsed.validRows) {
    const data = row.data as JukuCsvRowData;
    let studentId = byName.get(data.displayName);
    if (studentId === undefined) {
      const created = await addJukuStudent(jukuAccountId, data.displayName, data.prefectureCode);
      if (created === null) {
        writeFailedRows.push(row);
        continue;
      }
      studentId = created;
      byName.set(data.displayName, studentId);
    }
    const ok = await addScoreSnapshot({
      studentId,
      metric: data.metric,
      value: data.value,
      maxValue: data.maxValue,
      recordedAt: data.recordedAt,
    });
    if (ok) {
      importedCount++;
    } else {
      writeFailedRows.push(row);
    }
  }

  return { errorRows: parsed.errorRows, importedCount, writeFailedRows };
}
