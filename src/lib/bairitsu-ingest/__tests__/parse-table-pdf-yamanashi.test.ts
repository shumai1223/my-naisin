import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { YAMANASHI_COMPETITION_RATES } from '@/data/competition-rates/yamanashi';
import yamanashiR8Geometry from '../__fixtures__/yamanashi-r8-geometry.json';

/**
 * T-Y11B 段階2-b: yamanashi(山梨県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）。quota/applicants/rateがすべて印字済みでシンプル。くくり募集4組
 * （韮崎工業・青洲2組・塩山・都留興譲館）はいずれも「○○（一括）」という1行完結ラベルで
 * 資料上すでに表現されており、mie型のような複数行合成が不要（既存データは半角括弧に統一・
 * okinawa/nara型と同じpost-process）。
 *
 * 各校末尾の「計」行・県立高校計/市立高校計/全日制課程計の集計行は、department列が「計」に
 * 完全一致する行として一貫して現れる（nara型の教訓どおり部分一致ではなく完全一致で判定）。
 *
 * フィクスチャは令和8年度公表PDF（`yamanashi-r8.pdf`・全7頁のうち全日制後期募集の2頁分
 * [page index 1-2]）を`extract-pdf-geometry.py`で抽出した文字座標データ。2頁目は全日制課程計
 * 行より後（学科カテゴリ別の県全体集計表）を除外済み。
 */
const YAMANASHI_LAYOUT: GeneralColumnLayout = {
  boundaries: [50, 100, 188, 210, 405, 428, 480, 515, 545],
  // 列: 学校名,学科名,後期募集人員(=quota),志願変更等3列+2/19時点志願者数(未使用),
  //     最終志願者数(帰国内数の括弧を除く先頭の数字だけを含む=finalApplicants),
  //     帰国内数の残り+空白(未使用),倍率(帰国を除く=finalRate),前年同期倍率(未使用)
  roles: { schoolName: 0, department: 1, quota: 2, finalApplicants: 4, finalRate: 6 },
};

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (yamanashi R8 実データ検証)', () => {
  const geometries = yamanashiR8Geometry as PdfPageGeometry[];
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, YAMANASHI_LAYOUT))
  );

  const parsedFullwidthParens = assembleSimpleTableRows(allRowFields, {
    // ⚠️「県立高校計」等の集計ラベルは学校名列/学科名列の境界をまたいで分裂することがある
    // （nara型の教訓と同型）。既知の集計ラベルへの前方一致で判定する。
    excludeRow: (schoolName, department) => {
      if (department.trim() === '計') return true;
      const combined = schoolName + department;
      return ['県立高校計', '市立高校計', '全日制課程計'].some((marker) => combined.startsWith(marker));
    },
  });
  // ⚠️既存データはokinawa/nara型と同じく学科名の括弧を半角で統一している。
  const parsed = parsedFullwidthParens.map((r) => ({ ...r, department: r.department.replace(/（/g, '(').replace(/）/g, ')') }));

  const expectedR8Records = YAMANASHI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（48件・26校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(48);
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

  test('学校別「計」行・県立高校計/市立高校計/全日制課程計は収録されない', () => {
    expect(parsed.some((r) => r.department === '計')).toBe(false);
    expect(parsed.some((r) => r.quota === 3356)).toBe(false);
  });

  test('機械集計のグランドトータルが既存noteの「全日制課程計」行（quota3,356・applicants3,037）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(3356);
    expect(sumApplicants).toBe(3037);
  });
});
