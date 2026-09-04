import { type PdfPageGeometry } from '../parse-table-pdf';
import { TOYAMA_COMPETITION_RATES } from '@/data/competition-rates/toyama';
import toyamaR8Geometry from '../__fixtures__/toyama-r8-geometry.json';
import { parseToyama } from '../parsers/toyama';

/**
 * T-Y11B 段階2-b: toyama(富山県)のR8倍率パーサ検証テスト。
 *
 * ⚠️**第6のパターン「ブロック内のどこにラベルが来るか予測できない」**（2026-09-02発見）:
 * ibaraki型は「結合セルの中央付近」・tochigi型は「先頭行」に学校名ラベルが固定的に出現する
 * 前提だったが、toyamaは**同じ表の中で学校ごとにラベルの出現位置が不規則**（入善は3行中2行目、
 * 桜井は3行中2行目だが学科名と同居、魚津・魚津工業・上市は先頭行に学科名と同居、滑川は5行中
 * 3行目）。単純なcarry-forwardでは先頭行に学科ラベルが無い学校（入善等）で直前の学校名を
 * 誤って引き継いでしまう。
 *
 * **解法**: 罫線（hlines）は「学校の境界」を正確にマークしている（結合セル内部を分割する線は
 * 存在しない＝ibaraki型と違い内部罫線に頼れないが、外周の罫線は信頼できる）。罫線のy座標だけで
 * 「ブロック」（1校ぶんの行の集合）を機械的に決定し、**ブロック内のどの行にラベルがあっても
 * そのブロック全体の学校名として採用する**（位置に依存しない）。
 *
 * フィクスチャは令和8年度公表PDF（`toyama-r8.pdf`・全3頁のうち学校別データの2頁分[page index
 * 0-1]）。3頁目は「(大学科別)」という学科ごとの県全体集計表（学校別ではない）のためスコープ外。
 *
 * ⚠️2026-09-05(T-Y11E E-1): パース本体は`../parsers/toyama.ts`の`parseToyama()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (toyama R8 実データ検証・第6パターン: ブロック内ラベル位置不定)', () => {
  const geometries = toyamaR8Geometry as PdfPageGeometry[];
  const parsed = parseToyama(geometries);

  const expectedR8Records = TOYAMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（75件・34校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(75);
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

  test('内数コース（普通科(体育コース)等・括弧で囲まれた印字）は二重計上を避けるため収録されない', () => {
    expect(parsed.some((r) => r.department.includes('体育コース') || r.department.includes('自然科学コース') || r.department.includes('音楽コース'))).toBe(false);
  });

  test('探究科学科の人文社会科学科（数値が印字されない側）は収録されない', () => {
    expect(parsed.some((r) => r.department.includes('人文社会科学科'))).toBe(false);
  });

  test('グランドトータル「合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 5020)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データの「合計」行（quota5,020・applicants4,482）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(5020);
    expect(sumApplicants).toBe(4482);
  });
});
