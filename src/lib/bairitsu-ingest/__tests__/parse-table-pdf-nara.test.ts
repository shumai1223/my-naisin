import { groupCharsIntoRows, extractRowFields, normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';
import { NARA_COMPETITION_RATES } from '@/data/competition-rates/nara';
import naraR8Geometry from '../__fixtures__/nara-r8-geometry.json';

/**
 * T-Y11B 段階2-b: nara(奈良県)のR8倍率パーサ検証テスト。toyama/aomori型（罫線ブロック内の
 * どこにラベルがあっても採用・学科名/数値の行分離のpendingキュー）を流用。
 *
 * ⚠️**新しい罠: 資料に倍率が印字されておらず自前算出が必要**。既存データも同様に
 * `applicants÷quota`を自前算出しているため、パーサ側もT-Y11Cで確立した`roundHalfUpScaled`
 * （BigInt整数演算・`toFixed`のバグを踏まない）で算出し、既存データと突合する。
 *
 * また既存データは学科名の括弧を半角`()`で統一しており（okinawaと同型）、資料には第一出願
 * 期間と第二出願期間の2つの出願者数列があるが、既存データは第一出願期間のみを採用する
 * （第二出願期間は未充足学科への第2希望受付という別プロセスのため対象外）。
 *
 * フィクスチャは令和8年度公表PDF（`nara-r8.pdf`・全2頁）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ。2頁目は定時制課程セクション（y座標420以降）を除外済み。
 */
const NARA_LAYOUT: GeneralColumnLayout = {
  boundaries: [145, 212, 480, 620, 760, 800],
  // 列: 学校名,学科(コース)名,募集人員(=quota),第一出願期間出願者数(=finalApplicants),
  //     第二出願期間出願者数(未使用・対象外)
  roles: { schoolName: 0, department: 1, quota: 2, finalApplicants: 3, finalRate: 4 },
};

const NARA_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '国際|国際（ＬＩ）': '国際(LI)',
  '商業|会計': '会計・情報ビジネス・経営ビジネス・総合ビジネス(くくり募集)',
};

interface ClusteredRow {
  y: number;
  chars: PdfPageGeometry['chars'];
}

function groupRowsIntoBlocks(rows: ClusteredRow[], hlines: PdfPageGeometry['hlines'], fullLineX0Max: number): ClusteredRow[][] {
  const fullLines = hlines.filter((h) => h.x0 <= fullLineX0Max);
  const sorted = [...fullLines].sort((a, b) => a.y - b.y);
  const boundaries: number[] = [];
  for (const h of sorted) {
    if (boundaries.length && Math.abs(boundaries[boundaries.length - 1] - h.y) < 3.0) continue;
    boundaries.push(h.y);
  }
  const blocks: ClusteredRow[][] = Array.from({ length: Math.max(boundaries.length - 1, 0) }, () => []);
  for (const row of rows) {
    for (let i = 0; i < boundaries.length - 1; i++) {
      if (row.y >= boundaries[i] - 0.5 && row.y < boundaries[i + 1] - 0.5) {
        blocks[i].push(row);
        break;
      }
    }
  }
  return blocks.filter((b) => b.length > 0);
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (nara R8 実データ検証・倍率自前算出)', () => {
  const geometries = naraR8Geometry as PdfPageGeometry[];

  const blocks = geometries.flatMap((geom) => {
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines, 155);
  });

  const parsedFullwidthParens: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }[] = [];
  for (const block of blocks) {
    const fields = block.map((row) => extractRowFields(row.chars, NARA_LAYOUT));
    const schoolName = fields.map((f) => normalizeExtractedText(f.schoolName)).find((s) => s.length > 0) ?? '';
    // ⚠️「会計」のように「計」を含む正当な学科名があるため部分一致では除外できない。かつ
    // 「県立計」の「計」の文字が学校名列にはみ出し schoolName="県" department="立計..." に
    // 分裂することもある（gunma/ehime型と同型）。既知の小計/合計ラベルへの前方一致でのみ除外する。
    const blockText = schoolName + fields.map((f) => f.department).join('');
    if (['県立計', '市立計', '合計', '総計'].some((marker) => blockText.startsWith(marker))) continue;

    // ⚠️添上「普通」→（人文探究）（人文探究以外）・桜井「普通」→（書芸）（書芸以外）のように、
    // 数値を持たない「基底ラベル」1件が、数値を持つ複数の「（コース名）」行に共通して適用される
    // （fukui/aomori型のpendingキュー1個消費とは異なり、基底ラベルは複数回使い回される）。
    // 数値行の学科名が「（」で始まる場合だけ直前の基底ラベルと連結する。
    let currentBaseLabel = '';
    for (const f of fields) {
      const rawDept = normalizeExtractedText(f.department);
      const quota = Number(f.quotaText.replace(/,/g, ''));
      const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
      const hasNumbers = Number.isFinite(quota) && quota > 0 && Number.isFinite(finalApplicants);
      if (!hasNumbers) {
        if (rawDept) currentBaseLabel = rawDept;
        continue;
      }
      const isSuffixOnly = rawDept.startsWith('（') || rawDept.startsWith('(');
      const resolvedRawDept = isSuffixOnly ? currentBaseLabel + rawDept : rawDept || currentBaseLabel;
      if (rawDept && !isSuffixOnly) currentBaseLabel = rawDept;
      if (!resolvedRawDept) continue;
      const overridden = NARA_DEPARTMENT_OVERRIDES[`${schoolName}|${resolvedRawDept}`];
      const department = overridden ?? normalizeDepartmentText(resolvedRawDept);
      const finalRate = Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100;
      parsedFullwidthParens.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }
  // ⚠️既存データはokinawa型と同じく学科名の括弧を半角で統一している。
  const parsed = parsedFullwidthParens.map((r) => ({ ...r, department: r.department.replace(/（/g, '(').replace(/）/g, ')') }));

  const expectedR8Records = NARA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（71件・29校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(71);
  });

  test('レコード単位で既存データと完全一致する（順序も含む・倍率は自前算出値で突合）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
      const p = parsed[i];
      const e = expectedR8Records[i];
      expect({ schoolName: p?.schoolName, department: p?.department, quota: p?.quota, finalApplicants: p?.finalApplicants, finalRate: p?.finalRate }).toEqual({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      });
    }
  });

  test('県立計・市立計・合計行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 6896)).toBe(false);
  });

  test('機械集計のグランドトータルが既存noteの「合計」行（quota6,896・applicants6,276）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(6896);
    expect(sumApplicants).toBe(6276);
  });
});
