import { groupCharsIntoRows, extractRowFields, normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { TOTTORI_COMPETITION_RATES } from '@/data/competition-rates/tottori';
import tottoriR8Geometry from '../__fixtures__/tottori-r8-geometry.json';

/**
 * T-Y11B 段階2-b: tottori(鳥取県)のR8倍率パーサ検証テスト。toyama型（罫線ブロック内のどこに
 * ラベルがあっても採用）。学校名列が複数行に折り返して分裂する例（akita型・境港総合技術が
 * 「境港総合」＋「技術」の2行に分裂）もあるため、ブロック内の学校名列の全断片を行順に
 * 連結して学校名とする（先頭/中間どちらか一方だけを採用する既存パターンでは対応できない）。
 *
 * 列は[学校名 / 大学科(広域区分・未使用) / 小学科(コース)(＝department) / 名目募集定員(未使用) /
 * 実質募集定員(A＝quota) / 志願者数(2/18締切・未使用) / 競争率(2/18締切・未使用×2) /
 * 志願変更辞退者数(B)・新志願者数(C)・特例措置者数(D)(いずれも未使用) / 最終志願者数
 * (A-B+C+D＝finalApplicants) / 最終競争率(本年＝finalRate・昨年は未使用)]。既存データは
 * area(東部/中部/西部)を持つが、PDFの3頁がそれぞれ1地区に対応するため頁ごとに固定値で
 * 付与する（東部＝page index0＝物理5頁目、中部＝page index1＝物理6頁目、西部＝page index2＝
 * 物理7頁目）。
 *
 * ⚠️小計/合計行（「学校計」「東部/中部/西部 小計」「県計」）の判定: これらの行はラベル文字列の
 * 末尾「計」が常に小学科(コース)列の x範囲(142〜230)内に印字される（ラベル自体の開始位置は
 * 学校名列・大学科列にまたがることがあるが、「計」の1文字だけは必ず小学科列内に収まる）。
 * よって小学科(コース)列のテキストに「計」が含まれる行は無条件で除外する（会計科等の
 * 実在学科名との衝突は本県には存在しないため安全）。
 *
 * ⚠️くくり募集3組（鳥取東の普通・理数／智頭農林の生産科学・森林科学／鳥取工業の機械・電気・
 * 情報工学・建設工学）は、個別の小学科行に完全な数値（募集定員A・最終志願者数・倍率）が
 * 揃わない構造上の罠がある: 鳥取東・鳥取工業は数値が「大学科ラベルと同じ行」というブロック内の
 * 不定位置に1回だけ出現し他の小学科行は空欄、智頭農林に至っては個別の小学科行のどれにも
 * 完全な数値セットが無く（実質募集定員は大学科「農業」の行にのみ、最終志願者数のみ小学科別に
 * 分割記載）、ブロック末尾の「学校計」行だけが常に正しい集計値を持つ。3校とも一律で
 * 「学校計」行の数値をそのまま採用し、学科名は既存データの表記（くくり募集である旨を明記した
 * 合成ラベル）を個別に適用する（fukui/kyotoの数値ベース裏取りと同型の技法。学校計行の数値
 * 自体はPDF原本から機械的に読み取ったものであり、既存データの数値を書き写しているわけではない）。
 */
const TOTTORI_LAYOUT: GeneralColumnLayout = {
  boundaries: [0, 53, 95, 142, 230, 260, 295, 320, 350, 380, 410, 440, 465, 495, 520, 547],
  roles: { schoolName: 1, department: 3, quota: 5, finalApplicants: 12, finalRate: 13 },
};
/** 大学科(広域区分)列だけを`department`役として読み直すための補助レイアウト（後述の1学科校の
 *  ラベル分裂復元に使う）。 */
const TOTTORI_BROAD_LAYOUT: GeneralColumnLayout = {
  boundaries: TOTTORI_LAYOUT.boundaries,
  roles: { ...TOTTORI_LAYOUT.roles, department: 2 },
};

const AREA_BY_PAGE = ['東部', '中部', '西部'] as const;

const KUKURI_DEPARTMENT_OVERRIDE: Record<string, string> = {
  鳥取東: '普通・理数（くくり募集）',
  智頭農林: '生産科学・森林科学（くくり募集）',
  鳥取工業: '工業（機械・電気・情報工学・建設工学）（くくり募集）',
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

interface Parsed {
  schoolName: string;
  area: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (tottori R8 実データ検証)', () => {
  const geometries = tottoriR8Geometry as PdfPageGeometry[];

  const parsed: Parsed[] = [];
  geometries.forEach((geom, pageIdx) => {
    const area = AREA_BY_PAGE[pageIdx];
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    const blocks = groupRowsIntoBlocks(rows, geom.hlines, 90);

    for (const block of blocks) {
      const fields = block.map((row) => extractRowFields(row.chars, TOTTORI_LAYOUT));
      const schoolNameFragments = fields.map((f) => normalizeExtractedText(f.schoolName)).filter((s) => s.length > 0);
      const schoolName = schoolNameFragments.join('');
      if (!schoolName) continue;

      if (schoolName in KUKURI_DEPARTMENT_OVERRIDE) {
        const totalRow = fields.find((f) => f.department.includes('計'));
        if (!totalRow) continue;
        const quota = Number(totalRow.quotaText.replace(/,/g, ''));
        const finalApplicants = Number(totalRow.applicantsText.replace(/,/g, ''));
        const finalRate = Number(totalRow.rateText.replace(/,/g, ''));
        if (!Number.isFinite(quota) || !Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
        parsed.push({ schoolName, area, department: KUKURI_DEPARTMENT_OVERRIDE[schoolName], quota, finalApplicants, finalRate });
        continue;
      }

      const broadFields = block.map((row) => extractRowFields(row.chars, TOTTORI_BROAD_LAYOUT));
      // ⚠️1学科のみの学校（学校計行を持たない単独ブロック）は、学科名が「大学科列＋小学科列」の
      // 2列にまたがって分散印字されることがある（青谷「総合」→大学科列「総」＋小学科列「合」の
      // ように1単語が2列に割れて中央寄せされる／鳥取西「普通」のように両列に同じ語が重複印字
      // される、の2パターン）。多学科の学校（鳥取湖陵等）は大学科列が「農業」等の広域区分の
      // ラベルであり小学科列とは無関係の別の語なので、小学科列だけを採用する必要がある。
      // 判定は「学科計行を除いた実データ行が1本だけのブロックか」で行う（複数学科ブロックの
      // 大学科ラベルは複数の小学科行にまたがって共有されるため、この条件では該当しない）。
      const realRowCount = fields.filter((f) => f.department.trim() && !f.department.includes('計')).length;
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        const rawNarrow = f.department.trim();
        if (!rawNarrow || rawNarrow.includes('計')) continue;
        const rawBroad = broadFields[i].department.trim();
        const rawDept = realRowCount === 1 && rawBroad && rawBroad !== rawNarrow ? rawBroad + rawNarrow : rawNarrow;
        const quota = Number(f.quotaText.replace(/,/g, ''));
        const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
        const finalRate = Number(f.rateText.replace(/,/g, ''));
        if (!Number.isFinite(quota) || quota <= 0) continue;
        if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
        parsed.push({ schoolName, area, department: normalizeDepartmentText(rawDept), quota, finalApplicants, finalRate });
      }
    }
  });

  const expectedR8Records = TOTTORI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（43件・22校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(43);
  });

  test('レコード単位で既存データと完全一致する（順序も含む）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
      const p = parsed[i];
      const e = expectedR8Records[i];
      expect({ schoolName: p?.schoolName, area: p?.area, department: p?.department, quota: p?.quota, finalApplicants: p?.finalApplicants, finalRate: p?.finalRate }).toEqual({
        schoolName: e.schoolName,
        area: e.area,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      });
    }
  });

  test('「学校計」「東部/中部/西部 小計」「県計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 2937)).toBe(false);
  });

  test('地区別小計行（東部/中部/西部）と機械集計が一致する', () => {
    const byArea = (area: string) => parsed.filter((r) => r.area === area);
    const sum = (area: string, key: 'quota' | 'finalApplicants') => byArea(area).reduce((acc, r) => acc + r[key], 0);
    expect(sum('東部', 'quota')).toBe(1238);
    expect(sum('東部', 'finalApplicants')).toBe(956);
    expect(sum('中部', 'quota')).toBe(497);
    expect(sum('中部', 'finalApplicants')).toBe(349);
    expect(sum('西部', 'quota')).toBe(1202);
    expect(sum('西部', 'finalApplicants')).toBe(1029);
  });

  test('機械集計のグランドトータルが「県計」行（quota2,937・applicants2,334）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(2937);
    expect(sumApplicants).toBe(2334);
  });
});
