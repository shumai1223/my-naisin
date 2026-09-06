import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: saitama(埼玉県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-saitama.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（単純carry-forward）だが、chibaより列数が多く、県全体の合計行
 * （「全日制 普通・専門・総合学科計」）が学科名列にまではみ出す特異なレイアウトのため、
 * 性別列の位置(x0≈245〜256)に「計」の文字が単独で出現する行を抽出前の生データ段階で除外する
 * （実在学科名の「計」は常に学科名列の内側に出現するため位置ベース判定は安全）。
 * 市立高校の学校名接頭辞「〇○」の除去と、伊奈学園総合「普通科」の個別注記も行う
 * （詳細はテストファイル側のコメントを参照）。
 */

const SAITAMA_LAYOUT: GeneralColumnLayout = {
  boundaries: [0, 145, 245, 360, 395, 422, 460],
  // 列: 学校名,学科・コース・系,性別+募集人員(内数の転編入者数込み・未使用),
  //     入学許可予定者数(A=quota),確定志願者数(B=finalApplicants),倍率(B/A=finalRate)
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};

/** 埼玉県R8倍率PDFの学校別データ8頁分（`saitama-r8-geometry.json`）を解析する。 */
export function parseSaitama(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0)
      // ⚠️小計/合計行の判定: 性別列の位置(x0≈245〜256)に「計」の文字が単独で出現する行を除外する。
      .filter((row) => !row.chars.some((c) => c.c === '計' && c.x0 >= 244 && c.x0 <= 256))
      .map((row) => extractRowFields(row.chars, SAITAMA_LAYOUT))
  );

  // ⚠️市立高校の学校名には脚注記号「〇」が接頭辞として付与される（「○印は、市立高等学校」）。
  // 既存データはこの記号を含めない学校名で収録している。
  const parsedRaw = assembleSimpleTableRows(
    allRowFields.map((f) => ({ ...f, schoolName: f.schoolName.replace(/^[〇○]/, '') })),
    {}
  );

  // ⚠️伊奈学園総合の「普通科」は普通・スポーツ科学・芸術の3コースの合算値（PDF脚注に明記）。
  // 既存データは学科名に「（普通・スポーツ科学・芸術の合算）」という注記を追加している
  // （PDF本文の生テキストには無い注記のため、既存データを根拠にした個別補正で対応する）。
  return parsedRaw.map((r) => {
    if (r.schoolName === '伊奈学園総合' && r.department === '普通科') {
      return { ...r, department: '普通科（普通・スポーツ科学・芸術の合算）' };
    }
    return r;
  });
}
