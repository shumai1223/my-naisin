import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1: fukuoka(福岡県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-fukuoka.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。県立分PDF（全4頁）＋市組合立分PDF（別PDF・1頁）の計5頁を1本のgeometryとして扱う。
 * 「計」行が真の小計行かくくり募集の集計行かの自己検算判定・親「計」行の重複印字検出・
 * quota列が空欄の浮動行の検出・玄界/新宮のブロック単位override・田川科学技術等の学科名
 * テキストoverride・注記記号による倍率欠落の算数補完などを含む（詳細はテストファイル側の
 * コメントを参照）。
 */

const boundaries = [40, 97, 220, 255, 285, 322, 352, 395, 415, 458, 505, 538, 561];
// 市組合立分PDF（ページ4）は県立分（ページ0-3）とx座標が全体的に約6-8pt左にシフトしている別PDF。
const boundariesPage4 = [40, 105, 210, 240, 270, 305, 340, 375, 404, 452, 487, 518, 560];
// 0 学校名, 1 学科名, 2 a=quota, 3 b(未使用), 4 b/a(未使用), 5 c=finalApplicants,
// 6 c/a=finalRate, 7 増減数(未使用), 8 <内定者数>(未使用), 9 d(未使用), 10 e(未使用), 11 e/d(未使用)

interface RawRow {
  schoolNameRaw: string;
  departmentRaw: string;
  quotaText: string;
  cText: string;
  rateText: string;
  page: number;
}

function cellText(rowChars: PdfPageGeometry['chars'], colIdx: number, bounds: number[]): string {
  const inCol = rowChars.filter((c) => {
    const cx = (c.x0 + c.x1) / 2;
    return cx >= bounds[colIdx] && cx < bounds[colIdx + 1];
  });
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
}

function rowsForPage(pageChars: PdfPageGeometry['chars']): { y: number; chars: PdfPageGeometry['chars'] }[] {
  const sorted = [...pageChars].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
  for (const c of sorted) {
    const row = rows.find((r) => Math.abs(r.y - c.y0) < 1.2);
    if (row) row.chars.push(c);
    else rows.push({ y: c.y0, chars: [c] });
  }
  rows.sort((a, b) => a.y - b.y);
  return rows;
}

// ◆（第2志望校制度対象）・★（まとめて入学定員設定）・※（くくり募集）は脚注記号であり
// 学科名の一部ではない（PDF末尾の凡例で定義済み）。プロジェクト共通のnormalizeExtractedText/
// normalizeDepartmentTextはこの県固有の記号を扱わないためローカルに除去する。
function stripFootnoteMarks(s: string): string {
  return s.replace(/[◆★※]/g, '');
}

function parseNum(t: string): number {
  if (!t) return NaN;
  return Number(t.replace(/,/g, ''));
}

function isFiniteNum(t: string): boolean {
  return t !== '' && Number.isFinite(parseNum(t));
}

// (学校名|quota|finalApplicants) -> 学科名。くくり募集の集計行や「系」ラベルの補完に使う。
const OVERRIDE = new Map<string, string>([
  ['水産|160|180', '海洋科学科・食品流通科学科・アクアライフ科学科（くくり募集）'],
  ['小倉商業|240|291', '商業に関する学科（くくり募集6コース）'],
  ['若松商業|160|107', '商業に関する学科（くくり募集）'],
  ['小倉工業|80|98', '機械系（機械科・電子機械科）'],
  ['小倉工業|80|83', '電気系（電気科・電子科）'],
  ['小倉工業|40|39', '化学科（工業化学科）'],
  ['戸畑工業|120|103', '機械・電気系（機械科・電気科）'],
  ['戸畑工業|40|39', '建築系（建築科）'],
  ['八幡工業|120|131', '機械系（機械科・電子機械科・材料技術科）'],
  ['八幡工業|40|41', '電気系（電気科）'],
  ['八幡工業|40|46', '土木系（土木科）'],
  ['遠賀|120|64', '普通科・情報科学コース・情報ビジネスコース・生活創造コース（くくり募集）'],
  ['久留米商業|240|266', '経営科学科（大学進学・経営情報・経営総合の3コース合算公表）'],
  ['八女農業|120|102', '農業系4科（くくり募集）'],
  ['久留米筑水|80|113', '園芸技術科等（くくり募集）'],
  // 香住丘「数理コミュニケーションコース」はPDF原本の印字だが、既存データはR8改称後の
  // 正式名称「数理データサイエンスコース」を採用している（fukuoka.tsヘッダコメント参照）。
  ['香住丘|40|55', '普通科数理データサイエンスコース'],
  ['大川樟風|80|60', '普通科文理コース'],
]);

// (学校名|正規化後の学科生テキスト) -> 補正後の学科名。田川科学技術のようにquota/
// finalApplicantsが偶然衝突しOVERRIDEでは一意に定まらないケース向け。
const DEPT_TEXT_OVERRIDE = new Map<string, string>([
  ['三井|普通科福祉教養コース', '福祉教養コース'],
  ['三井|普通科スポーツ健康コース', 'スポーツ健康コース'],
  ['三池工業|エネルギー系電気科', '電気科'],
  ['三池工業|メカトロニクス系', '電子機械科・情報電子科'],
  ['三池工業|社会基盤系', '土木科・工業化学科'],
  ['浮羽工業|建設系', '建築系'],
  ['浮羽工業|機械・電気系材料技術科', '機械・電気系'],
  ['田川科学技術|工業システム科機械・電気コース', '工業システム科機械電気コース'],
  ['田川科学技術|工業システム科建築・土木コース', '工業システム科建築土木コース'],
]);

// (学校名|finalApplicants|finalRate) -> {department,quota}。quota列自体が空欄のまま
// 「計」行の直下に浮動する数値専用行（折尾・筑豊）に使う。
const FLOATING_OVERRIDE = new Map<string, { department: string; quota: number }>([
  ['折尾|83|1.04', { department: '総合ビジネス科', quota: 80 }],
  ['筑豊|58|0.48', { department: '総合ビジネス科・ビジネス情報科（くくり募集）', quota: 120 }],
]);

const SCHOOL_NAME_RENAME = new Map<string, string>([['北九州市立', '北九州市立高等学校']]);

// 玄界・新宮はPDFの学科分解と既存データの採用方針が食い違う（詳細はfukuoka.tsのヘッダコメント
// 参照）ためブロック単位で丸ごと差し替える。
const BLOCK_OVERRIDE = new Map<string, Omit<ParsedCompetitionRow, 'schoolName'>[]>([
  ['玄界', [{ department: '普通科', quota: 360, finalApplicants: 230, finalRate: 0.64 }]],
  [
    '新宮',
    [
      { department: '普通科（コースを除く）', quota: 360, finalApplicants: 366, finalRate: 1.02 },
      { department: '普通科国際文化コース', quota: 40, finalApplicants: 17, finalRate: 0.43 },
      { department: '理数科', quota: 40, finalApplicants: 73, finalRate: 1.83 },
    ],
  ],
]);

function emit(
  records: ParsedCompetitionRow[],
  rowIndexByPage: Map<number, number>,
  schoolName: string,
  departmentRaw: string,
  quota: number,
  finalApplicants: number,
  finalRate: number,
  page: number
): void {
  const deptNorm = normalizeDepartmentText(stripFootnoteMarks(departmentRaw)).replace(/。/g, '').replace(/^合/, '');
  const textKey = `${schoolName}|${deptNorm}`;
  const quotaKey = `${schoolName}|${quota}|${finalApplicants}`;
  const department = DEPT_TEXT_OVERRIDE.get(textKey) ?? OVERRIDE.get(quotaKey) ?? deptNorm;
  const rowIndex = rowIndexByPage.get(page) ?? 0;
  rowIndexByPage.set(page, rowIndex + 1);
  records.push({ schoolName, department, quota, finalApplicants, finalRate, page, rowIndex });
}

/**
 * 福岡県R8倍率PDFの学校別データ（県立4頁+市組合立1頁の計5頁分・`fukuoka-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: pageオフセットは県ごとに異なるため生PDFで毎回実測する
 * （2026-09-10確認: 詳細は本ファイルの変更コミット参照）。BLOCK_OVERRIDE（玄界・新宮）は
 * ブロック単位で丸ごと差し替える合成レコードのため単一の行位置に帰属できず、page/rowIndexは
 * 付与しない（ishikawaのCOMBINED_APPLICATION_OVERRIDESと同型の設計判断）。
 */
export function parseFukuoka(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRows: RawRow[] = [];
  geometries.forEach((geom, pageIdx) => {
    const bounds = pageIdx === 4 ? boundariesPage4 : boundaries;
    const rows = rowsForPage(geom.chars);
    for (const row of rows) {
      if (row.y < 100) continue; // ページ上部の表ヘッダを除外（実データはy>=106から）
      const schoolNameRaw = cellText(row.chars, 0, bounds);
      const departmentRaw = cellText(row.chars, 1, bounds);
      const quotaText = cellText(row.chars, 2, bounds).replace(/＊/g, '');
      const cText = cellText(row.chars, 5, bounds).replace(/＊/g, '');
      const rateText = cellText(row.chars, 6, bounds).replace(/＊/g, '');
      if (schoolNameRaw + departmentRaw + quotaText + cText + rateText === '') continue;
      // ページ末尾総括行「県　立　合　計　（９０校）」等の除外。
      if (/計（[0-9０-９]+校）/.test(normalizeExtractedText(schoolNameRaw + departmentRaw))) continue;
      allRows.push({ schoolNameRaw, departmentRaw, quotaText, cText, rateText, page: pageIdx + 1 });
    }
  });

  const blocks: { schoolName: string; rows: RawRow[] }[] = [];
  let current: { schoolName: string; rows: RawRow[] } | null = null;
  for (const r of allRows) {
    const snRaw = normalizeExtractedText(r.schoolNameRaw);
    const sn = SCHOOL_NAME_RENAME.get(snRaw) ?? snRaw;
    if (sn) {
      current = { schoolName: sn, rows: [] };
      blocks.push(current);
    }
    if (!current) continue;
    current.rows.push(r);
  }

  const records: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  for (const block of blocks) {
    const override = BLOCK_OVERRIDE.get(block.schoolName);
    if (override) {
      for (const r of override) records.push({ schoolName: block.schoolName, ...r });
      continue;
    }
    const fullRows = block.rows
      .filter((r) => r.quotaText && r.cText && isFiniteNum(r.quotaText) && isFiniteNum(r.cText))
      .map((r) => ({
        ...r,
        // c/a列が注記記号で潰れ倍率が印字されない行はquota/finalApplicantsから算数で補う。
        rateText: isFiniteNum(r.rateText) ? r.rateText : String(Math.round((parseNum(r.cText) / parseNum(r.quotaText)) * 100) / 100),
      }));
    const floatingRows = block.rows.filter((r) => !r.quotaText && r.cText && r.rateText && isFiniteNum(r.cText) && isFiniteNum(r.rateText));
    if (fullRows.length === 0) continue;

    if (fullRows.length === 1 && floatingRows.length === 0) {
      const r = fullRows[0];
      emit(records, rowIndexByPage, block.schoolName, r.departmentRaw, parseNum(r.quotaText), parseNum(r.cText), parseNum(r.rateText), r.page);
      continue;
    }

    const first = fullRows[0];
    const firstDept = normalizeExtractedText(stripFootnoteMarks(first.departmentRaw));
    if (firstDept === '計') {
      const parentApplicants = parseNum(first.cText);
      const parentRate = parseNum(first.rateText);
      const isDupOfParent = (applicants: number, rate: number) => applicants === parentApplicants && rate === parentRate;
      const realRows = fullRows.slice(1).filter((r) => !isDupOfParent(parseNum(r.cText), parseNum(r.rateText)));
      const realFloating = floatingRows.filter((r) => !isDupOfParent(parseNum(r.cText), parseNum(r.rateText)));
      if (realRows.length === 0 && realFloating.length === 0) {
        emit(records, rowIndexByPage, block.schoolName, first.departmentRaw, parseNum(first.quotaText), parentApplicants, parentRate, first.page);
      } else {
        for (const r of realRows) {
          emit(records, rowIndexByPage, block.schoolName, r.departmentRaw, parseNum(r.quotaText), parseNum(r.cText), parseNum(r.rateText), r.page);
        }
        for (const r of realFloating) {
          const finalApplicants = parseNum(r.cText);
          const finalRate = parseNum(r.rateText);
          const info = FLOATING_OVERRIDE.get(`${block.schoolName}|${finalApplicants}|${finalRate}`);
          if (info) {
            const rowIndex = rowIndexByPage.get(r.page) ?? 0;
            rowIndexByPage.set(r.page, rowIndex + 1);
            records.push({ schoolName: block.schoolName, department: info.department, quota: info.quota, finalApplicants, finalRate, page: r.page, rowIndex });
          }
        }
      }
    } else {
      for (const r of fullRows) {
        emit(records, rowIndexByPage, block.schoolName, r.departmentRaw, parseNum(r.quotaText), parseNum(r.cText), parseNum(r.rateText), r.page);
      }
    }
  }
  return records;
}
