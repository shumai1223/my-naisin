import { type PdfPageGeometry } from '../parse-table-pdf';
import { ISHIKAWA_COMPETITION_RATES } from '@/data/competition-rates/ishikawa';
import ishikawaR8Geometry from '../__fixtures__/ishikawa-r8-geometry.json';
import { parseIshikawa } from '../parsers/ishikawa';

/**
 * T-Y11B 段階2-b: 「quota/applicants/rateが隣接しない列構成」向け検証テスト（ishikawa型）。
 * ibaraki型（結合セル・delayed label）と組み合わせて`TableColumnLayout.roles`を使う実例。
 * 列は[№?/学校名/学科名/募集定員(A)/内定者数(B)/一般入学枠(C=quota)/出願者数(D=applicants)/
 * 出願倍率(D/C=rate)/確定出願倍率]で、quota/applicants/rateが学校名・学科名の隣接列ではない。
 * フィクスチャは令和8年度公表PDF（全3ページ中2ページ）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ（2026-09-02取得・実データそのもの）。
 *
 * ⚠️このPDFの罫線検出で、`extract-pdf-geometry.py`の矩形高さ閾値`height < 1.0`が
 * height=1.2の実在する罫線を取りこぼすバグを発見・修正した（`height < 3.0`へ緩和）。
 * このフィクスチャは修正後の抽出結果。
 *
 * ⚠️小松・金沢泉丘・七尾の3校は「普・理併願」という学科横断の合算制度を持ち、複数の学科行が
 * 1つの「小計」行に統合される（ヘッダコメント参照）。この3校はパーサの出力からは正しく
 * 分離できないため、既存データ（`ishikawa.ts`に確定値として記録済み）を根拠に明示的な
 * 置き換えを行う（tokushimaの那賀/海部と同型の対応）。
 *
 * ⚠️2026-09-06(T-Y11E E-1/E-6): パース本体は`../parsers/ishikawa.ts`の`parseIshikawa()`へ純関数と
 * して抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 非隣接roles (ishikawa R8 実データ検証)', () => {
  const parsed = parseIshikawa(ishikawaR8Geometry as PdfPageGeometry[]);

  const expectedR8Records = ISHIKAWA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（70件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(70);
  });

  test('レコードの集合が既存データと完全一致する（順不同）', () => {
    const key = (r: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }) =>
      `${r.schoolName}|${r.department}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
    const parsedKeys = new Set(parsed.map(key));
    const expectedKeys = new Set(expectedR8Records.map(key));
    expect(parsedKeys).toEqual(expectedKeys);
  });

  test('グランドトータルが公式「全県合計」行と一致する（6,566 / 6,076）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    const official = ISHIKAWA_COMPETITION_RATES.officialSubtotals[0];
    expect(sumQuota).toBe(official.quota);
    expect(sumApplicants).toBe(official.finalApplicants);
  });

  test('併願制度の3校（小松・金沢泉丘・七尾）は既存データの確定値に置き換えられる', () => {
    expect(parsed.find((r) => r.schoolName === '小松')).toEqual({ schoolName: '小松', department: '普通・理数（併願あり・合算）', quota: 320, finalApplicants: 377, finalRate: 1.18 });
    expect(parsed.find((r) => r.schoolName === '金沢泉丘')).toEqual({ schoolName: '金沢泉丘', department: '普通・理数（併願あり・合算）', quota: 400, finalApplicants: 490, finalRate: 1.23 });
    expect(parsed.find((r) => r.schoolName === '七尾')).toEqual({
      schoolName: '七尾',
      department: '普通・普通(文系フロンティア)・理数（併願あり・合算）',
      quota: 200,
      finalApplicants: 188,
      finalRate: 0.94,
    });
  });

  test('半角括弧のコース名が既存データの全角括弧表記に正規化される（穴水の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '穴水' && r.department.includes('キャリア'))?.department).toBe('普通（キャリア）');
  });
});
