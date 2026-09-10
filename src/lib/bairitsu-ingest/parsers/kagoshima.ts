import {
  groupCharsIntoRows,
  extractRowFields,
  normalizeExtractedText,
  normalizeDepartmentText,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: kagoshima(鹿児島県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-kagoshima.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。7学区が4頁に2段組(ehime/tokushima型)で並ぶが、この県特有の最大の罠は「最終出願者数
 * セルが3行に垂直分割される」構造。与論(0人・直後行が存在しない)の先読み方式・学科名折り返しの
 * 値ベースoverride・2段組のページ単位LEFT→RIGHT連結・RIGHT列の集計行分裂位置ずれへの対応など
 * 多数の罠を持つ（詳細はテストファイル側のコメントを参照）。
 */

const KAGOSHIMA_LEFT_LAYOUT: GeneralColumnLayout = {
  boundaries: [15, 66.5, 111, 152, 187, 219, 253, 286],
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};
const KAGOSHIMA_RIGHT_LAYOUT: GeneralColumnLayout = {
  boundaries: [286.2, 332, 382.2, 423.2, 458.2, 490.2, 524.2, 557.2],
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};

const SUBTOTAL_LABELS = new Set(['計', '合計']);

/**
 * 学科名が長い学校は学科名列の幅を超えて2〜3行に折り返され、主行(数値が乗る行)自身の
 * department列は空欄になる(折り返し断片が主行の前後どちらに乗るか幾何学的に一定しない)。
 * 既存データを根拠にした値ベースoverride(schoolName+quota+finalApplicants キー・
 * fukui/tottori型)で対応する。
 */
const DEPARTMENT_OVERRIDE = new Map<string, string>([
  ['鹿児島商業|83|87', 'ビジネスクリエイト'],
  ['鹿児島商業|92|74', '情報イノベーション'],
  ['鹿児島商業|8|5', 'アスリートスポーツ'],
  ['鹿児島女子|33|16', 'ファイナンシャルビジネス'],
  ['鹿児島女子|72|37', 'ビジネスデザイン'],
  ['鹿児島女子|27|1', 'スポーツビジネス'],
  ['鹿児島女子|62|56', 'ファッション・フードクリエイト'],
  ['鹿児島女子|53|29', 'ライフ・スポーツ'],
  ['山川|40|8', '園芸工学・農業経済'],
  ['加世田常潤|38|12', '食農プロデュース'],
  ['指宿商業|106|95', '商業マネジメント'],
  ['指宿商業|37|10', '会計マネジメント'],
  ['指宿商業|38|29', '情報マネジメント'],
  ['川内商工|33|34', 'インテリア'],
  ['川薩清修館|40|7', 'ビジネス会計'],
  ['隼人工業|36|23', 'インテリア'],
  ['国分中央|106|82', 'ビジネス情報'],
  ['国分中央|18|5', 'スポーツ健康'],
  ['串良商業|40|22', '総合ビジネス'],
  ['垂水|38|20', '生活デザイン'],
  ['鹿屋女子|73|29', '情報ビジネス'],
  ['種子島中央|40|13', 'ミライデザイン'],
  ['屋久島|39|26', '情報ビジネス'],
]);

function parseHalf(
  rows: { chars: PdfPageGeometry['chars']; page: number }[],
  layout: GeneralColumnLayout
): ParsedCompetitionRow[] {
  const rowFields = rows.map((row) => ({ ...extractRowFields(row.chars, layout), page: row.page }));
  const records: ParsedCompetitionRow[] = [];
  let currentSchool = '';
  let rowIndex = 0;

  for (let i = 0; i < rowFields.length; i++) {
    const r = rowFields[i];
    const schoolNameRaw = normalizeExtractedText(r.schoolName);
    const departmentRaw = normalizeDepartmentText(r.department);
    const quotaRaw = r.quotaText.trim();
    const applicantsRaw = r.applicantsText.trim();
    const rateRaw = r.rateText.trim();

    if (!quotaRaw) {
      // 主行ではない補助行(内数注記・値だけの直後行・学科名折り返し断片)は、対応する主行の
      // 処理時点で先読み消費されるはずなので、ここに来た行はすべて無視してよい。
      continue;
    }

    // 主行（学校名/学科名/学力検査定員/倍率が乗る行）。集計行もこの分岐に入る。
    // 「学区合計」「全日制　合計」は列境界をまたいで「学」「区」がschoolName列・
    // 「合」「計」がdepartment列に分裂する(境界は学区ごとに微妙にずれる)ため、
    // 学校別「計」の完全一致に加えて連結文字列の部分一致でも検出する
    // （「合計」は実在の学科名「会計」等とは衝突しない・"合"≠"会"）。
    if (SUBTOTAL_LABELS.has(departmentRaw) || (schoolNameRaw + departmentRaw).includes('合計')) continue;
    if (schoolNameRaw) currentSchool = schoolNameRaw;

    const quota = Number(quotaRaw.replace(/,/g, ''));
    const finalRate = Number(rateRaw);
    if (!Number.isFinite(quota) || quota <= 0) continue;
    if (!Number.isFinite(finalRate)) continue;

    let finalApplicants: number;
    if (applicantsRaw && /^[0-9,]+$/.test(applicantsRaw)) {
      finalApplicants = Number(applicantsRaw.replace(/,/g, ''));
    } else {
      // 一定枠を持つ普通科(またはそれに準ずる行): 直後の行が「値だけの行」なら先読みして採用。
      // 直後行が無い/値だけの行でない場合は、内数の再掲が無い(=0人)とみなす(与論の実例)。
      const next = rowFields[i + 1];
      const nextApplicants = next?.applicantsText.trim() ?? '';
      const nextIsValueOnly =
        next !== undefined &&
        !next.schoolName.trim() &&
        !next.department.trim() &&
        !next.quotaText.trim() &&
        !next.rateText.trim() &&
        /^[0-9,]+$/.test(nextApplicants);
      if (nextIsValueOnly) {
        finalApplicants = Number(nextApplicants.replace(/,/g, ''));
        i++; // 消費済みとして読み飛ばす
      } else {
        finalApplicants = 0;
      }
    }

    const override = DEPARTMENT_OVERRIDE.get(`${currentSchool}|${quota}|${finalApplicants}`);
    const department = override ?? departmentRaw;
    records.push({ schoolName: currentSchool, department, quota, finalApplicants, finalRate, page: r.page, rowIndex: rowIndex++ });
  }

  return records;
}

/**
 * 鹿児島県R8倍率PDFの学校別データ全4頁分（`kagoshima-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: geometry配列4頁は生PDF全7頁中の物理ページ3〜6
 * （1頁目=全体サマリー・2頁目=学区別クロス集計・3〜6頁目が全日制学校別詳細表・7頁目は
 * 定時制でスコープ外。2026-09-10にpdftoppmビジョン確認: 先頭の鶴丸「普通」quota288/
 * applicants423が物理ページ3に実在）。オフセットは配列添字+3。
 * LEFT/RIGHTは同一の物理ページを共有するため、ページごとに独立して呼び出し
 * （currentSchoolの状態を学区＝ページ単位でリセットする既存挙動を維持）、RIGHT側の
 * rowIndexには同一ページのLEFT側件数分のオフセットを加えてpage+rowIndexの一意性を保つ
 * （ehime/tokushimaと同型の対応）。
 */
export function parseKagoshima(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  return geometries.flatMap((geom, pageIdx) => {
    const page = pageIdx + 3;
    const clusteredRows = groupCharsIntoRows(geom.chars, 2.5).map((row) => ({ ...row, page }));
    const leftParsed = parseHalf(clusteredRows, KAGOSHIMA_LEFT_LAYOUT);
    const rightParsedRaw = parseHalf(clusteredRows, KAGOSHIMA_RIGHT_LAYOUT);
    const rightParsed = rightParsedRaw.map((r) => ({ ...r, rowIndex: (r.rowIndex ?? 0) + leftParsed.length }));
    return [...leftParsed, ...rightParsed];
  });
}
