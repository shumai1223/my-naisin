import { type PdfPageGeometry } from '../parse-table-pdf';
import { FUKUOKA_COMPETITION_RATES } from '@/data/competition-rates/fukuoka';
import fukuokaR8Geometry from '../__fixtures__/fukuoka-r8-geometry.json';
import { parseFukuoka } from '../parsers/fukuoka';

/**
 * T-Y11B 段階2-b: fukuoka(福岡県)のR8倍率パーサ検証テスト。県立分PDF（全4頁）＋
 * 市組合立分PDF（別PDF・1頁）の計5頁を1本のgeometry fixtureにまとめて扱う。191/191件・
 * 98校（県立90校＋市組合立8校）・グランドトータルquota24,320・applicants25,204も
 * 県立合計（quota22,200/applicants22,854）＋市組合立合計（quota2,120/applicants2,350）と
 * 一致（段階2-b30県目）。
 *
 * ⚠️比較は他県のようなレコード順一致ではなく**多重集合（順不同）一致**で行う。理由は
 * ファイル冒頭コメントに記録されている通り、既存R8データは「八幡南・北筑・東筑・折尾・
 * 中間・遠賀」の6校がPDF読み取り後に追加発見され、自然なPDF読み順（八幡工業の直後）ではなく
 * 配列の後方（宗像〜大川樟風の後）に追記されているため。この6校の位置だけが崩れているのではなく
 * 「編集履歴を持つファイルは並び順を信頼できない」という一般的な教訓として扱う。
 *
 * 列は[学校名/学科(ｺｰｽ)名等/a=入学定員(変更前)/b=志願者数(変更前)/b・a(未使用)/c=志願者数
 * (確定数・変更後、これがfinalApplicants)/c・a=finalRate/増減数(未使用)/内定者数(未使用)/
 * d・e・e・d=前年度(R7)参考値・未使用]という「変更前→確定数」2段階比較表（他県に無い構造）。
 * 市組合立分PDF（ページ4）は同一構造だが罫線/文字座標が県立分（ページ0-3）よりx方向に
 * 約6-8pt左シフトしており、列境界を独自に持つ必要がある（博多工業「業」の欠落で発覚）。
 *
 * ⚠️罠1: 学校名列は文字数に関わらず常にx≈48.5〜89.9の固定幅に均等割り付け（justify）される
 * （2文字でも4文字でも同じ幅に広がる）。学科名列がx≈101〜122という早い位置から始まる学校
 * （「機械系」「電気系」等の短い分類ラベルや「普通科(コースを除く。)」等の長い学科名）があり、
 * 学校名列の境界を97ptより広く取ると学科名の先頭文字を誤って学校名列に取り込んでしまう
 * （実測でschoolNameの最大x1は96.1・departmentの最小x0は101.3のため、境界は97で安全に分離できる）。
 *
 * ⚠️罠2: 複数学科を持つ学校の「計」行は2種類の意味を持ち、区別には自己検算が必須:
 * ①真の小計行（苅田工業・行橋・小倉工業・戸畑工業・八幡・八幡中央・八幡工業・折尾・遠賀等）
 * =後続の各学科行がそれぞれ独自の完全なデータ（quota+finalApplicants+finalRate）を持ち、
 * その総和が「計」行の値と一致する→「計」行自体は除外し各学科行を採用。
 * ②くくり募集の集計行（小倉商業・若松商業・水産・久留米商業・八女農業・久留米筑水等）
 * =後続の学科ラベル行が学科名のみ（またはquotaのみ）でfinalApplicants/finalRateを持たない
 * →「計」行自体を1レコードとして採用（学科名は既存データを根拠にした値ベースoverrideで補完）。
 * 判定は「後続に完全データを持つ行が1つでもあるか」で機械的に行う。
 *
 * ⚠️罠3: くくり募集の「計」行が結合セルの垂直方向中央付近に描画される際、学科ラベル行の
 * どれか1行（多くの場合中央寄りの1行）に親「計」行のfinalApplicants/finalRateが**重複して
 * 印字される**ことがある（水産「食品流通科」・小倉商業の空白行等で実測）。この重複行は
 * 独自のquotaを持つことがあり見分けにくいが、「finalApplicants/finalRateが親と完全一致」
 * という条件で機械的に検出・除外できる。
 *
 * ⚠️罠4: 逆に「計」行の直下に、学校名・学科名列が完全に空欄なのにfinalApplicants/finalRate
 * だけを持つ浮動行が現れ、それが親と一致しない**独自の実データ**であることがある（折尾の
 * 「総合ビジネス科」・筑豊の「総合ビジネス科・ビジネス情報科（くくり募集）」）。quota列が
 * 空欄のためfullRowsには入らずfloatingRowsとして別扱いし、学校名+finalApplicants+finalRate
 * をキーにした専用のoverrideでdepartment/quotaを補う。
 *
 * ⚠️罠5: 玄界・新宮は学科別内訳の合計が「計」行と完全に一致するにもかかわらず、既存データは
 * 玄界を学科分解せず「計」行の値をそのまま1レコード「普通科」として採用し、新宮は逆に
 * PDFが1行に合算した「普通科」（quota400/applicants383）を「普通科（コースを除く）」
 * （360/366）＋「普通科国際文化コース」（40/17）に外部塾サイト裏取りで分解している
 * （ファイル冒頭コメント参照）。この2校は機械的パターンでは再現できない編集判断のため
 * ブロック単位でハードコードのoverrideに差し替える。
 *
 * ⚠️罠6: 「県　立　合　計　（９０校）」等のページ末尾総括行は全角スペースで均等割り付け
 * されるが、単純な「文字列に'合計'を含むか」で除外すると「嘉穂総合」+「計」＝「嘉穂総合計」
 * のような正当な学校名（末尾が「総合」）を誤って除外する。総括行は「計（〜校）」という
 * 固有パターンで判別する。
 *
 * ⚠️罠7: 小郡「普通科みらい創造コース」は新設1年目で前年度比較列（c/a等）に注記記号
 * 「＊」が印字されrateTextが数値にならない。quota/finalApplicantsは実測できているため
 * finalRate = finalApplicants / quota で算数的に補う。
 *
 * ⚠️罠8: 田川科学技術は「工業システム科建築・土木コース」と「ビジネス科学科」がquota/
 * finalApplicants/finalRateすべて偶然同一値（40/30/0.75）になり、quotaキーのoverrideでは
 * 一意に定まらない。学科の生テキスト自体をキーにした別overrideで対応する。
 *
 * ⚠️罠9（既知の不一致・書き換えは見送り）: 八幡「文理共創科」はPDF原本の印字（x=135.7〜160.7で
 * 「文」「理」「共」「創」「科」の5文字を実測確認済み）だが、既存データは「文理創創科」と
 * 記録している（過去のビジョン解析での誤読と判断）。他県（saitama等）の前例に倣い、既存データは
 * 書き換えずテストの既知除外として記録する。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/fukuoka.ts`の`parseFukuoka()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */

// 罠9: 八幡「文理共創科」はPDF原本の印字（実測確認済み）だが既存データは「文理創創科」と
// 記録している（過去のビジョン解析での誤読と判断・saitama等の前例に倣い書き換えは見送る）。
// 学科名テキストが両者で異なる（共創 vs 創創）ため、除外はdepartmentを含まないキーで行う。
const KNOWN_DATA_TYPO = new Set(['八幡|200|216|1.08']);

function keyOf(r: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }): string {
  return `${r.schoolName}|${r.department}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
}

function nonDepartmentKeyOf(r: { schoolName: string; quota: number; finalApplicants: number; finalRate: number }): string {
  return `${r.schoolName}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (fukuoka R8 実データ検証・県立+市組合立2PDF合成構造)', () => {
  const geometries = fukuokaR8Geometry as PdfPageGeometry[];
  const parsed = parseFukuoka(geometries);
  const expectedR8Records = FUKUOKA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（191件・98校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(191);
  });

  test('レコードの多重集合が既存データと完全一致する（既知のデータ誤記1件を除く・順序は既存データの編集履歴により一致しないため順不同比較）', () => {
    const parsedKeys = parsed.filter((r) => !KNOWN_DATA_TYPO.has(nonDepartmentKeyOf(r))).map(keyOf).sort();
    const expectedKeys = expectedR8Records.filter((r) => !KNOWN_DATA_TYPO.has(nonDepartmentKeyOf(r))).map(keyOf).sort();
    expect(parsedKeys).toEqual(expectedKeys);
  });

  test('機械集計のグランドトータルが県立合計＋市組合立合計（quota24,320・applicants25,204）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(24320);
    expect(sumApplicants).toBe(25204);
  });

  test('親「計」行の重複印字を実データと誤認しない（水産「食品流通科」の実例・くくり募集として1レコードに集約される）', () => {
    // T-Y11F §5順序#8でpage/rowIndex（出典ロケータ用）が追加されたため、それ以外のフィールドで比較する
    const suisan = parsed.filter((r) => r.schoolName === '水産');
    expect(suisan).toHaveLength(1);
    const { page: _p1, rowIndex: _r1, ...suisanRest } = suisan[0];
    expect(suisanRest).toEqual({
      schoolName: '水産',
      department: '海洋科学科・食品流通科学科・アクアライフ科学科（くくり募集）',
      quota: 160,
      finalApplicants: 180,
      finalRate: 1.13,
    });
  });

  test('quota列が空欄の浮動行から実データを検出する（折尾「総合ビジネス科」の実例）', () => {
    const record = parsed.find((r) => r.schoolName === '折尾' && r.department === '総合ビジネス科');
    expect({ schoolName: record?.schoolName, department: record?.department, quota: record?.quota, finalApplicants: record?.finalApplicants, finalRate: record?.finalRate }).toEqual({
      schoolName: '折尾',
      department: '総合ビジネス科',
      quota: 80,
      finalApplicants: 83,
      finalRate: 1.04,
    });
  });
});
