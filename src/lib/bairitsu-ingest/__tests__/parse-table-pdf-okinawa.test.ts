import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, normalizeExtractedText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { OKINAWA_COMPETITION_RATES } from '@/data/competition-rates/okinawa';
import okinawaR8Geometry from '../__fixtures__/okinawa-r8-geometry.json';

/**
 * T-Y11B 段階2-b: okinawa(沖縄県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）だが、**全日制・定時制が同一表に混在**しており、他県のような「全日制計」の
 * 独立行が存在しない（既存データのヘッダコメントに明記済み）。
 *
 * 解法: 表には「課程」列（全日/定時）が独立して存在するため、この列の値で機械的に絞り込める
 * （既存データのヘッダコメントが挙げる6校の名前リストに頼る必要はない・列の値で判定する方が
 * 頑健）。学校別「◯◯ 集計」小計行は課程列の中に収まり学科名列が空になるため、既存の
 * `!department`チェックで自然に除外される。
 *
 * フィクスチャは令和8年度公表PDF（`okinawa-r8.pdf`・全4頁）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。
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

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (okinawa R8 実データ検証・全日制/定時制混在)', () => {
  const geometries = okinawaR8Geometry as PdfPageGeometry[];
  const clusteredRows = geometries.flatMap((geom) => groupCharsIntoRows(geom.chars, 3.0));

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

  // ⚠️学級数(2桁="10"等)の先頭桁が、右端x0=241の学級数列の左側にはみ出し、department列
  // ([140,241))の末尾に混入することがある。department本文が数字だけで終わることは無いため、
  // 末尾の連続する半角数字は機械的に除去してよい。
  const stripTrailingClassCountDigits = (s: string) => s.replace(/[0-9]+$/, '');

  const allRowFields = zenjitsuRows.map((row) => {
    const fields = extractRowFields(row.chars, OKINAWA_LAYOUT);
    return { ...fields, department: stripTrailingClassCountDigits(fields.department) };
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
  const parsed = parsedFullwidthParens.map((r) => ({ ...r, department: r.department.replace(/（/g, '(').replace(/）/g, ')') }));

  const expectedR8Records = OKINAWA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（156件・58校・全日制のみ）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(156);
  });

  test('レコード単位で既存データと完全一致する（順序も含む）', () => {
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

  test('定時制単独校「泊」は課程列フィルタで除外される', () => {
    expect(parsed.some((r) => r.schoolName === '泊')).toBe(false);
  });

  test('定時制と全日制が混在する学校（コザ・那覇工業等）の定時制ぶんは除外される', () => {
    expect(parsed.some((r) => r.department.includes('定時'))).toBe(false);
  });

  test('学校別「◯◯集計」小計行・総計行は収録されない', () => {
    expect(parsed.some((r) => r.department.includes('集計'))).toBe(false);
    expect(parsed.some((r) => r.quota === 14484)).toBe(false);
  });

  test('機械集計のグランドトータルが既存noteの自己算出値（quota14,084・applicants13,522）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(14084);
    expect(sumApplicants).toBe(13522);
  });
});
