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
 * T-Y11E E-1: okinawa(沖縄県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-okinawa.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・単純carry-forward）だが、**全日制・定時制が同一表に
 * 混在**しており、表の「課程」列（全日/定時）の値で機械的に絞り込む（詳細はテストファイル側の
 * コメントを参照）。
 */

const OKINAWA_LAYOUT: GeneralColumnLayout = {
  boundaries: [40, 100, 140, 241, 260, 300, 330, 360, 460, 490, 525, 545],
  // 列: 学校名,課程(全日/定時・別途参照),学科+コース(=department),学級数(未使用),定員(未使用),
  //     併設型進学予定者(未使用),募集人員(=quota),通学区域内+外+特別募集3列(未使用),
  //     計(=finalApplicants),最終志願倍率(=finalRate),空定員数(未使用)
  roles: { schoolName: 0, department: 2, quota: 6, finalApplicants: 8, finalRate: 9 },
};

/** 課程列（全日/定時）だけを読むための軽量レイアウト。 */
const OKINAWA_COURSE_TYPE_LAYOUT: GeneralColumnLayout = {
  boundaries: [40, 100, 140, 241, 260, 300, 330, 360, 460, 490, 525, 545],
  roles: { schoolName: 0, department: 1, quota: 6, finalApplicants: 8, finalRate: 9 },
};

const OKINAWA_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '本部|普通進学・情報': '普通（進学・情報）',
  '本部|スポーツ・保育福祉': '普通（スポーツ・保育福祉）',
  '前原|普通文理': '普通（文理）',
  '嘉手納|総合学ドリームデザイン': '総合学（ドリームデザイン）',
  '嘉手納|キャリアアップ': '総合学（キャリアアップ）',
  '宜野湾|普通普通': '普通（普通）',
  '西原|普通健康科学': '普通（健康科学）',
  '西原|文理': '普通（文理）',
  '開邦|芸術音楽': '芸術（音楽）',
  '開邦|美術': '芸術（美術）',
  '真和志|普通普通': '普通（普通）',
  '真和志|クリエイティブアーツ': '普通（クリエイティブアーツ）',
  '小禄|普通普通': '普通（普通）',
  '豊見城南|普通普通': '普通（普通）',
  '南風原|普通普通総合': '普通（普通総合）',
  '美来工科|ＩＴシステム': 'ITシステム',
  '南部工業|建築設備建築デザイン': '建築設備（建築デザイン）',
  '南部工業|設備工学': '建築設備（設備工学）',
  '名護商工|工業技術機械': '工業技術（機械）',
  '名護商工|電気': '工業技術（電気）',
  '八重山商工|機械電気機械': '機械電気（機械）',
  '八重山商工|電気': '機械電気（電気）',
  '八重山商工|商業会計システム': '商業（会計システム）',
  '八重山商工|情報ビジネス': '商業（情報ビジネス）',
  '八重山商工|観光': '商業（観光）',
  '浦添商業|ＩＴビジネス': 'ITビジネス',
  '宮古総合実業|食と環境フードクリエイト': '食と環境（フードクリエイト）',
  '宮古総合実業|環境クリエイト': '食と環境（環境クリエイト）',
};

/** 学級数(2桁="10"等)の先頭桁がdepartment列末尾に混入することがある。department本文が数字だけで
 *  終わることは無いため、末尾の連続する半角数字は機械的に除去してよい。 */
function stripTrailingClassCountDigits(s: string): string {
  return s.replace(/[0-9]+$/, '');
}

/**
 * 沖縄県R8倍率PDFの学校別データ全4頁分（`okinawa-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: pageオフセットは県ごとに異なるため生PDFで毎回実測する
 * （2026-09-10確認: 詳細は本ファイルの変更コミット参照）。
 */
export function parseOkinawa(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const clusteredRows = geometries.flatMap((geom, pageIdx) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => ({ ...row, page: pageIdx + 1 }))
  );

  // ⚠️課程列（全日/定時）は学校名と同じく「学科群の先頭行にだけ印字され、継続行は空欄」の
  // carry-forward構造を持つ（那覇工業の定時「機械」行にはあるが続く「電気」行には無い）。
  // 各行自身の値だけで判定すると継続行が誤って通過するため、schoolName同様にcarry-forward
  // してから判定する。
  let currentCourseType = '';
  const zenjitsuRows = clusteredRows.filter((row) => {
    const courseTypeRaw = extractRowFields(row.chars, OKINAWA_COURSE_TYPE_LAYOUT).department.trim();
    if (courseTypeRaw) currentCourseType = courseTypeRaw;
    return !currentCourseType.includes('定時');
  });

  const allRowFields = zenjitsuRows.map((row) => {
    const fields = extractRowFields(row.chars, OKINAWA_LAYOUT);
    return { ...fields, department: stripTrailingClassCountDigits(fields.department), page: row.page };
  });

  let currentSchool = '';
  const rowFieldsWithOverrides = allRowFields.map((r) => {
    const schoolNameNorm = r.schoolName.trim();
    if (schoolNameNorm) currentSchool = schoolNameNorm;
    const deptKey = normalizeExtractedText(r.department);
    const overridden = OKINAWA_DEPARTMENT_OVERRIDES[`${currentSchool}|${deptKey}`];
    return { ...r, department: overridden ?? r.department };
  });

  const parsedFullwidthParens = assembleSimpleTableRows(rowFieldsWithOverrides, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('集計') || (schoolName + department).includes('総計'),
  });
  // ⚠️okinawaの既存データは他県と異なり括弧を半角のまま採用している（normalizeDepartmentText
  // は全県共通で半角→全角に変換する設計のため、ここだけ変換後に半角へ戻す）。
  return parsedFullwidthParens.map((r) => ({ ...r, department: r.department.replace(/（/g, '(').replace(/）/g, ')') }));
}
