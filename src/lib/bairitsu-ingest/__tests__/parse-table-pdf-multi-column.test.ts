import {
  parseTablePdfPageRows,
  assembleCompetitionRateRows,
  filterGeometryByXRange,
  type PdfPageGeometry,
  type TableColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';
import { TOKUSHIMA_COMPETITION_RATES } from '@/data/competition-rates/tokushima';
import tokushimaR8Geometry from '../__fixtures__/tokushima-r8-geometry.json';

/**
 * T-Y11B 段階2-b: 「1ページに複数の表が左右に並ぶ県」向け組み立て（tokushima型）の検証テスト。
 * ibaraki型・tochigi型・akita型のいずれとも異なる第4のパターン: 全日制が左右2段組
 * （+定時制1段は対象外）で、各段が独立にibaraki型の「学校名遅延（結合セル中央配置）」を
 * 起こす。フィクスチャは令和8年度公表PDF（全1ページ）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ（2026-09-02取得・実データそのもの）。
 *
 * ⚠️**この県だけは「順序も含めた完全一致」を検証基準にしない**。既存データの並び順を精査した
 * 結果、LEFT/MIDDLE2段の物理的な読み順が単純な規則に従っておらず（例:
 * 阿南光の4学科のうち3学科は早い位置に、残り1学科だけ離れた位置に収録されている）、
 * 当時の転記自体がvision解析＋個別検証を要する非機械的な作業だったと判断したため
 * （詳細は`ops/tasks/T-Y11B-bairitsu-ingest-parsers.md`参照）。検証は
 * **学校×学科×数値の集合として一致するか**で行う。
 *
 * ⚠️**那賀/海部の1件は幾何学的に一意に決定できない既知の曖昧ケース**（ラベル単独行の直前/
 * 直後どちらのデータ行に属するかが位置関係だけでは判定不能）。既存データ側は
 * `tokushima.ts`のヘッダコメントに記録されたWebSearchでの実在学科確認を根拠に確定して
 * いるため、パーサ出力にも同じ根拠で補正を適用する（後述の`applyKnownAmbiguityCorrection`）。
 */
const LEFT_LAYOUT: TableColumnLayout = {
  boundaries: [30, 102.72, 177.84, 211.92, 246, 280.92],
  fullLineX0Max: 50,
  syntheticTopY: 75,
  syntheticBottomY: 560,
};
const MIDDLE_LAYOUT: TableColumnLayout = {
  boundaries: [290, 355.92, 430.44, 464.52, 500.64, 536.4],
  fullLineX0Max: 300,
  syntheticTopY: 75,
  syntheticBottomY: 560,
};

/**
 * 那賀/海部の学校名帰属は幾何学的に一意に決まらない（`那賀`ラベル単独行の直前データ行が
 * 実は海部の学科である）。既存データ（WebSearch裏取り済み）に合わせて2レコードを入れ替える。
 */
function applyKnownAmbiguityCorrection(records: ParsedCompetitionRow[]): ParsedCompetitionRow[] {
  return records.map((r) => {
    if (r.schoolName === '那賀' && r.department === '普通' && r.quota === 30) {
      return { ...r, schoolName: '海部' };
    }
    if (r.schoolName === '海部' && r.department === '普通' && r.quota === 47) {
      return { ...r, schoolName: '那賀' };
    }
    return r;
  });
}

function recordKey(r: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }): string {
  return `${r.schoolName}|${r.department}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
}

describe('bairitsu-ingest parse-table-pdf 複数列組ページ (tokushima R8 実データ検証)', () => {
  const geom = tokushimaR8Geometry as PdfPageGeometry;
  const leftRows = parseTablePdfPageRows(filterGeometryByXRange(geom, 30, 290), LEFT_LAYOUT);
  const middleRows = parseTablePdfPageRows(filterGeometryByXRange(geom, 290, 545), MIDDLE_LAYOUT);
  const leftRecords = assembleCompetitionRateRows([leftRows], '合計');
  const middleRecords = assembleCompetitionRateRows([middleRows], '合計');
  const parsed = applyKnownAmbiguityCorrection([...leftRecords, ...middleRecords]);

  const expectedR8Records = TOKUSHIMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（69件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(69);
  });

  test('レコードの集合が既存データと完全一致する（順不同・理由は本ファイル冒頭コメント参照）', () => {
    const parsedKeys = new Set(parsed.map(recordKey));
    const expectedKeys = new Set(expectedR8Records.map(recordKey));
    expect(parsedKeys).toEqual(expectedKeys);
  });

  test('グランドトータルが公式「全日制計」行と一致する（4,165 / 4,160）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    const official = TOKUSHIMA_COMPETITION_RATES.officialSubtotals[0];
    expect(sumQuota).toBe(official.quota);
    expect(sumApplicants).toBe(official.finalApplicants);
  });

  test('罫線が無い表の先頭行・末尾行が欠落しない（城東・富岡西の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '城東' && r.department === '普通')).toEqual({
      schoolName: '城東', department: '普通', quota: 251, finalApplicants: 243, finalRate: 0.97,
    });
    expect(parsed.find((r) => r.schoolName === '富岡西' && r.department === '理数')).toEqual({
      schoolName: '富岡西', department: '理数', quota: 30, finalApplicants: 18, finalRate: 0.6,
    });
  });
});
