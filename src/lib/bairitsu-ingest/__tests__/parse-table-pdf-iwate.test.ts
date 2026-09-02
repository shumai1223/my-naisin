import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { IWATE_COMPETITION_RATES } from '@/data/competition-rates/iwate';
import iwateR8Geometry from '../__fixtures__/iwate-r8-geometry.json';

/**
 * T-Y11B 段階2-b: iwate(岩手県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 先頭行にラベル・単純carry-forward）をそのまま流用できた最も単純な部類の県。倍率も印字済み
 * （自前算出不要）。
 *
 * 列は[学校名/大学科(未使用)/学科(学系)(=department)/入学定員(未使用)/いわて留学合格者数
 * (未使用)/連携型志願者数・併設型入学決定者数(未使用)/募集定員(=quota)/志願者数(=finalApplicants)/
 * 志願倍率(=finalRate)/...]。**大学科列（例:「普通」「農業」）は既存データでは使われず、
 * 学科(学系)列（例:「普通科」「動物科学科」）だけが単独でdepartmentとして採用される**（他県で
 * 見られる「広域区分+具体名の二段組」とは異なり、この県では大学科列は基本的に冗長情報）。
 *
 * ⚠️唯一の例外: 大東の「商業(情報ビジネス科)」は大学科列「商業」+学科(学系)列
 * 「情報ビジネス科」を括弧で連結した表記が既存データの正解。しかも同校の「普通科」レコードと
 * quota/finalApplicants/finalRateが偶然完全に同一（40/7/0.18）のため、値ベースoverride
 * （fukui/tottori型）ではキーが衝突する。**学校名+学科名テキストをキーにしたoverride**に
 * 切り替えて回避した（数値ではなくテキストをキーにする点が他県のoverride例外）。⚠️overrideは
 * `assembleSimpleTableRows`が返した**後**の（`normalizeDepartmentText`適用済みの）department
 * 値に対して適用する必要がある（適用前の生テキストに対して行うと、この県が半角括弧を維持する
 * 唯一のケースであるにもかかわらず、`normalizeDepartmentText`の半角→全角変換が後から上書き
 * してしまう）。113件中この1件のみが例外で、他112件は学科(学系)列をそのまま採用するだけで
 * 完全一致した。
 */
const IWATE_LAYOUT: GeneralColumnLayout = {
  boundaries: [15, 56, 88, 163, 247, 271, 293, 320],
  // 列: 学校名,大学科(未使用),学科(学系)(=department),定員等の未使用列,募集定員(=quota),
  //     志願者数(=finalApplicants),志願倍率(=finalRate)
  roles: { schoolName: 0, department: 2, quota: 4, finalApplicants: 5, finalRate: 6 },
};

const DEPARTMENT_TEXT_OVERRIDE: Record<string, string> = {
  '大東|情報ビジネス科': '商業(情報ビジネス科)',
};

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (iwate R8 実データ検証・倍率印字済み)', () => {
  const geometries = iwateR8Geometry as PdfPageGeometry[];
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, IWATE_LAYOUT))
  );

  const parsed = assembleSimpleTableRows(allRowFields, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  }).map((r) => {
    const override = DEPARTMENT_TEXT_OVERRIDE[`${r.schoolName}|${r.department}`];
    return override ? { ...r, department: override } : r;
  });

  const expectedR8Records = IWATE_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（113件・59校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(113);
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

  test('大学科列（未使用の広域区分）は学科名に混入しない（例外の大東を除く）', () => {
    const morioka1 = parsed.find((r) => r.schoolName === '盛岡第一');
    expect(morioka1).toEqual({ schoolName: '盛岡第一', department: '普通・理数科', quota: 280, finalApplicants: 341, finalRate: 1.22 });
  });

  test('機械集計のグランドトータルが公式資料の「合計」行（quota8,215・applicants6,574）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(8215);
    expect(sumApplicants).toBe(6574);
  });
});
