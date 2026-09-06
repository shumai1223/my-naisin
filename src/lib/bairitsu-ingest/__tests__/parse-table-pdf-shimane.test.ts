import { normalizeExtractedText, type PdfPageGeometry } from '../parse-table-pdf';
import { SHIMANE_COMPETITION_RATES } from '@/data/competition-rates/shimane';
import shimaneR8Geometry from '../__fixtures__/shimane-r8-geometry.json';
import { parseShimane } from '../parsers/shimane';

/**
 * T-Y11B 段階2-b: shimane(島根県)のR8倍率パーサ検証テスト。全日制1頁・ibaraki型（結合セル・
 * 罫線でブロック境界判定）だが、この県特有の最大の罠はくくり募集の組み立てられ方: 代表学科
 * （数値が実際に乗る学科）が独自のミニブロック（内数コース名の行を複数含む）を形成し、その
 * ブロックの「学校名列」にはschoolNameでなく**学科群の名前**（例:「情報科学」）が印字される。
 * `.find(s=>s.length>0)`ベースの通常解決ではこの学科群名がschoolNameとして誤って採用される
 * （幾何学的にはこの学科群名も学校名とラベル位置的に区別できない・toyama/nagano型と同種の
 * 決定不能問題）。既知の4件（安来「情報科学」/松江商業・浜田商業「商業」/隠岐島前「普通」）を
 * 固定のCONTINUATION_LABELSとして扱い、直前に登場した真の学校名へ後処理で書き戻した。
 *
 * 列は[学校名/学科名/学級数(未使用)/入学定員(未使用)/身元引受人枠(未使用)/地域外枠(未使用)/
 * 特色選抜合格内定者数c・d・e・計(未使用)/ｇ・ｈ(未使用)/ｉ=一般選抜募集定員(=quota)/
 * ｋ(未使用)/ｊ=出願者数合計・志願変更後(=finalApplicants)/増減・ｎ・ｏ(未使用)/
 * ｐ=対募集定員競争率(=finalRate)/前年度倍率(未使用)]。i/j/pの位置は資料下部の
 * 「ｉ=」「ｊ=」「ｐ=」という数式注記の直下から特定した。
 *
 * ⚠️罠1: 「合計」「県立高校計」等の集計ラベルは列境界をまたいで分裂する（例:「合」がschoolName
 * 列・「計」がdepartment列）。さらに「県立高校計」は「校」の文字自体もdepartment列側に
 * わずかにはみ出す（department="校計"）ため、`department === '計'`の完全一致では検知できない。
 * `department.includes('計')`の部分一致に切り替えて対応した（実在の学科名に「計」を含むものが
 * この県には無いため衝突しない）。この判定だけで集計行が自然に弾かれるため、`summaryMarker`
 * （'合計'）による打ち切りは「定時制」セクション（別の学校群が全日制と同じ学校名で再登場する）
 * へ読み進めるのを防ぐためだけに必要。
 *
 * ⚠️罠2: 松江市立皆美が丘女子高等学校は、学校名セルの内部に「松江市立」（1行目）と
 * 「皆美が丘女子」（3行目、データ行を挟んで2行に分裂）が印字されるが、この2行の間に罫線が
 * 存在せず**データ行を含めて丸ごと1つのRawTableRow（同一y範囲）として捕捉される**。2つの
 * ラベルは文字幅がほぼ同じ（4文字と6文字だが右寄せで字間が揃う）ため、schoolName列の文字を
 * x0昇順にソートすると**2行の文字が交互に入り混じった不可解な文字列**
 * （「皆松美江が市丘立女子」）になる。他県の「ラベルが複数行に分裂」パターン（akita/ehime型）
 * は行単位の連結で対応できたが、これは文字単位での混入のため同じ手法が使えず、
 * 観測された不可解な文字列そのものをキーにした直接のSCHOOL_NAME_OVERRIDEで対応した。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/shimane.ts`の`parseShimane()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 罫線+結合セル組み立て (shimane R8 実データ検証・くくり募集ブロックの学校名誤認)', () => {
  const geometries = shimaneR8Geometry as unknown as PdfPageGeometry[];
  const parsed = parseShimane(geometries);

  const expectedR8Records = SHIMANE_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する(64件・35校)', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(64);
  });

  test('レコード単位で既存データと完全一致する(順序も含む)', () => {
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

  test('市立の皆美が丘女子高等学校が「松江市立」でなく正しい学校名で収録される', () => {
    expect(parsed.some((r) => r.schoolName === '松江市立')).toBe(false);
    expect(parsed.find((r) => r.schoolName === '皆美が丘女子')).toEqual({ schoolName: '皆美が丘女子', department: '普通', quota: 53, finalApplicants: 46, finalRate: 0.87 });
  });

  test('定時制セクションの重複校は収録されない(合計行での打ち切り)', () => {
    expect(parsed.some((r) => normalizeExtractedText(r.department) === '定時制')).toBe(false);
  });

  test('機械集計のグランドトータルが「合計」行(quota3,084・applicants2,493)と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(3084);
    expect(sumApplicants).toBe(2493);
  });
});
