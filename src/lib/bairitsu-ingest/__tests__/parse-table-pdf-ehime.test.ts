import { type PdfPageGeometry } from '../parse-table-pdf';
import { EHIME_COMPETITION_RATES } from '@/data/competition-rates/ehime';
import ehimeR8Geometry from '../__fixtures__/ehime-r8-geometry.json';
import { parseEhime } from '../parsers/ehime';

/**
 * T-Y11B 段階2-b: ehime(愛媛県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）だが、**1ページ2段組**（左右2組の学校リストが横に並ぶ・tokushima型と
 * 同種のレイアウト分割）という罠がある。同じ行の文字集合にLEFT用/RIGHT用2つの`GeneralColumnLayout`
 * を順に適用するだけで良い（`extractRowFields`は自レイアウトの境界外の文字を無視するため、
 * 事前にジオメトリをx範囲で分割する必要がない）。LEFT/RIGHTそれぞれで独立にcarry-forwardし、
 * 結果をLEFT全件→RIGHT全件の順で連結すると既存データの並び順と一致する。
 *
 * 右下の余白に印字される脚注（「くくり募集の略称である。」等）はLEFTの実データ行と同じy座標に
 * 存在するが、数値列に数字を持たないため`assembleSimpleTableRows`のquota検証で自然に除外される。
 *
 * フィクスチャは令和8年度公表PDF（`ehime-r8.pdf`・全1頁2段組）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。
 *
 * ⚠️2026-09-05(T-Y11E E-1): パース本体は`../parsers/ehime.ts`の`parseEhime()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (ehime R8 実データ検証・1ページ2段組)', () => {
  const geometries = ehimeR8Geometry as unknown as PdfPageGeometry[];
  const parsed = parseEhime(geometries);

  const expectedR8Records = EHIME_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（99件・43校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(99);
  });

  test('レコード単位で既存データと完全一致する（LEFT列→RIGHT列の順で順序も含む）', () => {
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

  test('脚注テキスト「くくり募集の略称である」由来の空行は数値化できず除外される', () => {
    expect(parsed.some((r) => r.department.includes('くくり募集の略称'))).toBe(false);
  });

  test('グランドトータル「合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 8370)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データの「合計」行（quota8,370・applicants7,468）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(8370);
    expect(sumApplicants).toBe(7468);
  });
});
