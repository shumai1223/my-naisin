import {
  groupCharsIntoRows,
  extractRowFields,
  normalizeExtractedText,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: niigata(新潟県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-niigata.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型に近いが、この県は**schoolNameを行ごとに省略せず毎回律義に印字し直す**
 * という他県と逆方向の単純さを持つ。ふりがな単独行の孤立解消・学科区分小計「計」の
 * schoolName列側除外・「全日制」検知による定時制打ち切り・分校名の括弧post-processなど
 * 多数の罠を持つ（詳細はテストファイル側のコメントを参照）。
 */

const NIIGATA_LAYOUT: GeneralColumnLayout = {
  boundaries: [115, 200, 282, 320, 362, 406, 447],
  // 0学校名,1学科名,2募集学級(未使用),3quota(A),4finalApplicants(B),5finalRate(B/A)
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};

const HIRAGANA_ONLY = /^[ぁ-んー]+$/;

/**
 * 五泉総合高等学校は、PDFの学校名列に「五泉」（2文字）としか印字されない（総合学科の
 * 学校であるにもかかわらず「総合」が省略される・同じ総合学科区分の他9校は全て正式名称通り
 * 印字されており、この1校だけの例外）。既存データが正式校名「五泉総合」を採用しているため、
 * 固定のrenameで補う。
 */
const SCHOOL_NAME_OVERRIDE: Record<string, string> = { 五泉: '五泉総合' };

interface RowFields {
  schoolName: string;
  department: string;
  quotaText: string;
  applicantsText: string;
  rateText: string;
  page: number;
}

/** ふりがな単独行(碧の実例)を無視し、データ行が自前のschoolNameを持たない場合は前後3行以内の
 *  最初の非ひらがなschoolNameフラグメントを借用する。ふりがな単独行自体は最後に取り除く。 */
function resolveFuriganaOrphans(rows: RowFields[]): RowFields[] {
  const patched = rows.map((r) => ({ ...r }));
  for (let i = 0; i < patched.length; i++) {
    const r = patched[i];
    if (r.schoolName || !r.department) continue; // 自前の名前を持つ・またはデータ行でない
    for (const j of [i - 1, i + 1, i - 2, i + 2, i - 3, i + 3]) {
      const cand = patched[j]?.schoolName;
      if (cand && !HIRAGANA_ONLY.test(cand)) {
        r.schoolName = cand;
        break;
      }
    }
  }
  return patched.filter((r) => !(HIRAGANA_ONLY.test(r.schoolName) && !r.department));
}

/**
 * 新潟県R8倍率PDFの学校別データ全4頁分（`niigata-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: geometry配列4頁は生PDF全6頁中の物理ページ3〜6
 * （1〜2頁目は概要・志願変更受付の説明のためスコープ外。2026-09-11に生PDF全文grepで
 * 先頭の新潟「普通」quota240/applicants303/finalRate1.26が物理ページ3に実在することを
 * 確認）。オフセットは配列添字+3。「全日制」検知による定時制打ち切りはページ境界と無関係に
 * 発生するため、pageは各行が実際に含まれていた物理ページをそのまま保持する。
 */
export function parseNiigata(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields: RowFields[] = [];
  geometries.forEach((geom, pageIdx) => {
    const page = pageIdx + 3;
    const rows = groupCharsIntoRows(geom.chars, 1.5);
    for (const row of rows) {
      const fields = extractRowFields(row.chars, NIIGATA_LAYOUT);
      const schoolName = normalizeExtractedText(fields.schoolName);
      // 学科区分の小計「計」1文字はschoolName列に印字される（department列でなく）。
      if (schoolName === '計') continue;
      allRowFields.push({
        schoolName,
        department: normalizeExtractedText(fields.department),
        quotaText: fields.quotaText,
        applicantsText: fields.applicantsText,
        rateText: fields.rateText,
        page,
      });
    }
  });

  const cutIdx = allRowFields.findIndex((r) => r.schoolName === '全日制');
  const scoped = cutIdx === -1 ? allRowFields : allRowFields.slice(0, cutIdx);
  const resolved = resolveFuriganaOrphans(scoped);

  let currentSchool = '';
  const records: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  for (const r of resolved) {
    if (r.schoolName) currentSchool = r.schoolName;
    if (!r.department) continue;
    const quota = Number(r.quotaText.replace(/,/g, ''));
    const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
    const finalRate = Number(r.rateText);
    if (!Number.isFinite(quota) || quota <= 0) continue;
    if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
    // ⚠️「佐渡(両津)」のように分校・キャンパス名を括弧書きする学校が1件あり、PDFは全角
    // 「（）」で印字するが既存データは半角`()`で統一する（wakayama型と同型の県固有慣行）。
    const parenFixed = currentSchool.replace(/（/g, '(').replace(/）/g, ')');
    const schoolName = SCHOOL_NAME_OVERRIDE[parenFixed] ?? parenFixed;
    const rowIndex = rowIndexByPage.get(r.page) ?? 0;
    rowIndexByPage.set(r.page, rowIndex + 1);
    records.push({ schoolName, department: r.department, quota, finalApplicants, finalRate, page: r.page, rowIndex });
  }
  return records;
}
