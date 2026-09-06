import { type PdfPageGeometry } from '../parse-table-pdf';
import { GIFU_COMPETITION_RATES } from '@/data/competition-rates/gifu';
import gifuR8Geometry from '../__fixtures__/gifu-r8-geometry.json';
import { parseGifu } from '../parsers/gifu';

/**
 * T-Y11B 段階2-b: gifu(岐阜県)のR8倍率パーサ検証テスト。tochigi型（単純carry-forward）を
 * そのまま流用できた。134/134件・完全一致（グランドトータルquota12,925・applicants12,009も
 * 「変更後出願者数総括表」の全日制計と一致）。
 *
 * 列は[学校名/学科(群)名/募集人員(=quota)/出願者数(=finalApplicants)/倍率(=finalRate。
 * 印字済み値を採用)]。各学科(群)の本体行の下に、独自検査を含む選抜の区分（「Ⅰ」「Ⅱ」）・
 * 連携型選抜（「連携」）の内訳行が付随するが、これらは本体行の内数（学校名・学科名列が空欄
 * のまま数値だけが続く）であり、`!departmentRaw`（学科名列が空欄の行は捨てる、既存原則）で
 * 自然にスキップされる。
 *
 * ⚠️唯一の罠: 全日制の後（5頁目）に「２　定時制」「３　通信制」という別セクションが続き、
 * 華陽フロンティア（定時制11校の1つ・普通科Ⅰ部/Ⅱ部/Ⅲ部）・飛騨高山（通信制2校の1つ）等が
 * **全日制と同じ学校名・同じ学科名で別の（小さい）quota/applicantsを持つ行として再登場する**。
 * 単純な学校名+学科名のキーでは全日制の正しいレコードと区別できないため、「２　定時制」
 * 「３　通信制」という見出し行（学校名列に出現）を検知した時点で以降の行を丸ごと処理打ち切り
 * とする（定時制・通信制は他県と同じ理由でスコープ外）。
 *
 * ⚠️既存の罠の再確認: 学校集計行等の除外判定に単純な`.includes('計')`を使うと、正当な学科名
 * 「会計」（岐阜商業に実在）まで誤って除外してしまう（`.includes('合計')`のように完全な
 * マーカー文字列で判定する必要がある・nagasaki型の教訓の再確認）。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/gifu.ts`の`parseGifu()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (gifu R8 実データ検証・定時制/通信制セクションの打ち切り)', () => {
  const geometries = gifuR8Geometry as PdfPageGeometry[];
  const parsed = parseGifu(geometries);
  const expectedR8Records = GIFU_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（134件・63校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(134);
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

  test('定時制(華陽フロンティア)・通信制(飛騨高山)の同名重複レコードは収録されない', () => {
    expect(parsed.some((r) => r.schoolName === '華陽フロンティア')).toBe(false);
    expect(parsed.filter((r) => r.schoolName === '飛騨高山').length).toBe(6);
  });

  test('「会計」のような「計」を含む正当な学科名は誤って除外されない（岐阜商業の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '岐阜商業' && r.department === '会計')).toEqual({
      schoolName: '岐阜商業',
      department: '会計',
      quota: 80,
      finalApplicants: 88,
      finalRate: 1.1,
    });
  });

  test('機械集計のグランドトータルが「全日制計」（quota12,925・applicants12,009）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(12925);
    expect(sumApplicants).toBe(12009);
  });
});
