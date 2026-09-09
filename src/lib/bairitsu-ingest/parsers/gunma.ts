import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  normalizeExtractedText,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: gunma(群馬県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-gunma.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・単純carry-forward）だが、gunma独自の3種の罠を持つ:
 * ①学科名の主部分/副部分が離れたx位置に印字され`カテゴリ（副部分）`の形に合成する必要がある、
 * ②複数学科がquotaを共有するくくり募集、③department列に同じラベルが2回印字されるPDF側の
 * 冗長描画。座標だけからは一意に合成規則を決定できないため、既存データを根拠とした
 * `GUNMA_DEPARTMENT_OVERRIDES`で対応する（詳細はテストファイル側のコメントを参照）。
 */

const GUNMA_LAYOUT: GeneralColumnLayout = {
  boundaries: [50, 160, 194, 318, 354, 389, 416, 460, 487, 540],
  // 列: 学校名,学校別募集定員(A),学科・コース等,性別,学科等別募集定員(B)=quota,
  //     学科等別志願者数(C)=finalApplicants,学科等別倍率(C/B)=finalRate,学校別志願者数(D),学校別倍率(D/A)
  roles: { schoolName: 0, department: 2, quota: 4, finalApplicants: 5, finalRate: 6 },
};

/**
 * department列に同一ラベルが前半/後半で連続して2回印字される行を1回分に畳む
 * （前橋清陵・沼田・高崎経済大学附属で確認。理由は不明だが、いずれも代表課程「普通」の
 * 行でのみ発生し、既存データの正解は単一の「普通」）。
 */
function collapseRepeatedLabel(s: string): string {
  if (s.length >= 2 && s.length % 2 === 0) {
    const half = s.length / 2;
    if (s.slice(0, half) === s.slice(half)) return s.slice(0, half);
  }
  return s;
}

const GUNMA_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '勢多農林|動物科学資源動物': '動物科学（資源動物）',
  '勢多農林|応用動物': '動物科学（応用動物）',
  '前橋清陵|普通昼間部': '普通（昼間部）',
  '前橋清陵|普通夜間部': '普通（夜間部）',
  '高崎商業|グローバルビジネス': '商業（グローバル/会計/情報/総合ビジネス）',
  '桐生清桜|アドバンスト探究': '普通（アドバンスト探究）',
  '桐生工業|創造技術電気': '創造技術（電気）',
  '桐生工業|染織デザイン': '創造技術（染織デザイン）',
  '太田フレックス|普通Ⅰ部（昼）': '普通（Ⅰ部・昼）',
  '太田フレックス|普通Ⅱ部（昼）': '普通（Ⅱ部・昼）',
  '太田フレックス|普通Ⅲ部（夜）': '普通（Ⅲ部・夜）',
  '利根実業|創生工学機械': '創生工学（機械）',
  '利根実業|建設': '創生工学（建設）',
  '西邑楽|芸術音楽': '芸術（音楽）',
  '西邑楽|美術': '芸術（美術）',
};

/**
 * 群馬県R8倍率PDFの学校別データ2頁分（`gunma-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: `geometries`は物理ページ1〜2頁分（PDF全3頁のうち
 * 詳細表の先頭が物理ページ1から始まる。2026-09-10に`pdftotext -f 1`で前橋の
 * quota280/applicants314が物理ページ1に実在することを確認済み。3頁目は詳細表対象外
 * 〈定時制等〉のため出典ロケータの対象外）。出典ロケータ用のpageは配列添字+1（オフセット
 * 無し）で記録する。tottoriのような概要ページ分のオフセットが必要な県もあるため、
 * 他県へ横展開する際は毎回この検証を省略しないこと。
 */
export function parseGunma(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom, pageIdx) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => ({ ...extractRowFields(row.chars, GUNMA_LAYOUT), page: pageIdx + 1 }))
  );

  let currentSchoolForOverride = '';
  const rowFieldsWithOverrides = allRowFields.map((r) => {
    const schoolNameNorm = normalizeExtractedText(r.schoolName);
    if (schoolNameNorm) currentSchoolForOverride = schoolNameNorm;
    const deptKey = collapseRepeatedLabel(normalizeExtractedText(r.department));
    const overridden = GUNMA_DEPARTMENT_OVERRIDES[`${currentSchoolForOverride}|${deptKey}`];
    return { ...r, department: overridden ?? deptKey };
  });

  return assembleSimpleTableRows(rowFieldsWithOverrides, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  });
}
