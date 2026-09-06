import { type PdfPageGeometry } from '../parse-table-pdf';
import { KUMAMOTO_COMPETITION_RATES } from '@/data/competition-rates/kumamoto';
import kumamotoR8Geometry from '../__fixtures__/kumamoto-r8-geometry.json';
import { parseKumamoto } from '../parsers/kumamoto';

/**
 * T-Y11B 段階2-b: kumamoto(熊本県)のR8倍率パーサ検証テスト。ibaraki型（罫線ブロック・学校名列
 * は結合セル）をベースに、この県特有の2つの罠を追加で解決する。
 *
 * ⚠️罠1: 単一学科校は学科名を学校名列に「学校名（学科名）」として直接埋め込む
 * （例:「済々黌（普通）」）。長い学校名では閉じ括弧「）」が学科名列側に列境界を越えて
 * はみ出すことがある（例:「翔陽（総合学科）」）ため、学校名列・学科名列の生テキストを連結
 * してから括弧の対応を取る必要がある（片方の列だけを見ると判定できない）。
 *
 * ⚠️罠2: 分校（本校と独立した番号を持たない）は「〃」（同上記号）+分校名で学校名を表す
 * （例:「天草」の次のブロックが「〃倉岳校（普通）」→「天草倉岳校」）。この「〃」は学校名列
 * 側に出現する（罠1の学校名（学科名）パターンと同一行に同時出現することがある）。一方、
 * 学科名列側に出現する「〃」（例:「〃(キャリアコース)」）は学科の同上参照であり、直前の
 * 学科の基底名（括弧より前の部分）と連結する（意味が異なる2種類の「〃」を列の出現位置で
 * 判別する）。
 *
 * 罠1・2をまとめて解決する`resolveSingleDeptSchool`は、学校名列が「〃」で始まれば直前の
 * 学校名を前置してから、学校名列+学科名列の連結テキストに対して`/^([^（]*)（([^）]*)）$/`
 * （＝括弧の中身が丸ごと1つの学科名として完結し、後に何も続かない）を試みる。一致すれば
 * 単一学科校（分校の場合も含む）、一致しなければ通常の複数学科校の行として扱う。
 *
 * ⚠️学校集計行（学校名のみで学科名列が空・全学科の定員/志願者数の合計を示す）はレコード化
 * 不要のため、学科名が空の行は`quota<=0`と同じ扱いでスキップされる（`resolveSingleDeptSchool`
 * が学科名を復元できない限り、department文字列は空のまま）。
 *
 * ⚠️既存データ（`kumamoto.ts`）は学科名の括弧を半角`()`で統一している（okinawa/nara型と同型の
 * 例外）。列構成は[学校名/学科名/前期(特色)選抜等合格内定者数/後期(一般)募集人員(=quota)/
 * 当初出願者数/増減/出願確定者数(=finalApplicants)/学区外(内数)/8年度倍率(=finalRate)/
 * 7年度倍率]の10列（quota/finalApplicants/finalRateが学校名・学科名に隣接しないためroles指定
 * が必要・ishikawa型と同型）。
 *
 * くくり募集3組（矢部の食農科学2コース／大津の普通・理数／上天草の普通・グローカル文理コース）
 * は、広域ラベルを持つ行に数値が乗り、具体ラベルのみの行は数値を持たない（nagano/須坂創成型と
 * 同様に真の帰属ルールが幾何学的に決定できない）ため、`(学校名, quota, finalApplicants)`を
 * キーにした値ベースoverride（fukui/tottori型）で対応する。
 *
 * フィクスチャは令和8年度公表PDF（`kumamoto-r8.pdf`・全5頁）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。5頁目末尾の「計」行（グランドトータル）で機械的に打ち切り、以降の
 * 備考欄（脚注テキスト）は対象外とした。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/kumamoto.ts`の`parseKumamoto()`へ純関数と
 * して抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 結合セル組み立て (kumamoto R8 実データ検証・単一学科校の括弧埋め込み+分校の同上記号)', () => {
  const geometries = kumamotoR8Geometry as PdfPageGeometry[];
  const parsed = parseKumamoto(geometries);
  const expectedR8Records = KUMAMOTO_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（162件・52校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(162);
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

  test('学校集計行・地区見出し行は収録されない（学科名を持たない行はスキップ）', () => {
    expect(parsed.every((r) => r.department.length > 0)).toBe(true);
    expect(parsed.some((r) => r.schoolName === '')).toBe(false);
  });

  test('機械集計のグランドトータルが公式資料の「計」行（quota8,322・applicants7,295）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(8322);
    expect(sumApplicants).toBe(7295);
  });
});
