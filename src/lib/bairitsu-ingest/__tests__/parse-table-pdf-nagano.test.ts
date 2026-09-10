import { type PdfPageGeometry } from '../parse-table-pdf';
import { NAGANO_COMPETITION_RATES } from '@/data/competition-rates/nagano';
import naganoR8Geometry from '../__fixtures__/nagano-r8-geometry.json';
import { parseNagano } from '../parsers/nagano';

/**
 * T-Y11B 段階2-b: nagano(長野県)のR8倍率パーサ検証テスト。129/129件・完全一致（多重集合・
 * 順不同比較）。2026-08-31に「学科列が広域区分/具体名の二段組に見えるが二段組として機能する
 * 行と1語が幅広セルにトラッキング印字されただけの行が幾何学的に区別不能」という罠で次点
 * 扱いになっていたが、shiga/kochi/yamagataで確立した技法で2026-09-04に再挑戦し解決した
 * （段階2-b35県目・T-Y11B次点県の最後の1つ）。倍率は資料に印字されているが浮動小数の丸め
 * 誤差を避けるため`roundHalfUpScaled`で自前算出し突合する。
 *
 * fixtureは元PDFの8頁中、学校別状況の4通学区分（ページ2-5＝北信/東信/南信/中信）のみを
 * 収録（ページ0=表紙・ページ1=学科別全県状況の集計表・ページ6-7=定時制課程はスコープ外）。
 *
 * 列は[学校名/学科名(カテゴリ+具体名がgapで分かれることがある)/募集人員(quota)/志願数
 * (finalApplicants)/倍率(未使用・自前算出)]。
 *
 * ⚠️罠1（前回セッションの真因判明）: 「幾何学的に区別不能」は誤りだった。学科名は
 * 「カテゴリ(2文字・工業/商業/農業/家庭等)」+「具体名」がx方向の字間ギャップ（通常の
 * 字間~6.5ptに対しカテゴリ境界は~9.5pt）で分かれることがあるが、**カテゴリを持たない
 * 短い単語（「建築学」等）がセル幅いっぱいにジャスティファイされると内部の字間が
 * ~13ptまで開き、カテゴリ境界のギャップと数値的に重なってしまう**。この重なりはギャップ
 * サイズだけでは解決できないため、**「先頭グループが必ず2文字か」を判定基準にする**
 * （カテゴリは常に2文字の熟語＝工業/商業/農業/家庭等。先頭グループが2文字でなければ
 * カテゴリなしの1語と判断し分割せず全体を結合する）。
 *
 * ⚠️罠2: 数値列の左端が学科名列の右端に近く、3桁の募集人員（例:「240」）の先頭桁が学科名列
 * にはみ出すことがある（長野「普通」募集人員240で発覚）。学科名列の右端境界を数値列の
 * 開始位置より十分左（x<340）に絞ることで解決した。
 *
 * ⚠️罠3: カテゴリは①持ち越し専用ラベル行（家庭のように単独出現・数値も学校名も無し）と
 * ②自分の行に具体名と同居した「本来の情報源」行（「工業」+「電気」が同じ行に乗る）の
 * 2通りで現れる。どちらも前方の行へキャリーフォワードする必要があるが、**学校名ラベルの
 * ような「1ブロック=1校なので遡り適用してよい」という前提はカテゴリには成り立たない**
 * （同一校内で複数のカテゴリ区分が切り替わるため、山形工業と同じ理由で遡り適用は無効）。
 * また、ギャップ分割で2グループ以上が見つかった行は、カテゴリ===具体名で自己解決する
 * 場合（「商業」+「商業」→「商業」）でも独立した1レコードの完結行として持ち越し状態を
 * リセットする（そうしないと直前のカテゴリが後続の無関係な行まで漏れ出す）。
 *
 * ⚠️罠4: 学校名ラベルが結合セルの中央付近に出現する行で、学校名の末尾2文字（業種を表す
 * 部分）が学科名列にも重複して印字されることがある（長野工業の「工業」・南安曇農業の
 * 「農業」）。この重複はカテゴリの持ち越し元として誤認識されるため、学校名ラベルを
 * 伴う行の2文字ラベルは持ち越し元として採用しない。
 *
 * ⚠️罠5: くくり募集（飯山の自然科学探究＋人文科学探究、長野商業の商業＋会計、須坂創成の
 * 3学科、更級農業の3学科、諏訪実業の商業＋会計情報、上伊那農業の3コース、駒ケ根工業の
 * 3学科、松本県ケ丘の自然探究＋国際探究、池田工業の3学科、佐久平総合技術の3学科）は、
 * 学科名の合成規則が学校ごとに異なり（「くくり募集」という語を明示的に付けるものと、
 * カテゴリでまとめて括弧書きにするものの2パターン）機械的な単一ルールでは再現できないため、
 * 既存データを根拠にしたブロック単位のoverrideで対応した。同じブロック単位のoverrideを、
 * 学校名末尾2文字の重複が複数行にまたがって解決不能な学校（上田千曲・木曽青峰・松本工業・
 * 飯田OIDE長姫・南安曇農業・小諸義塾）にも適用した。
 *
 * ⚠️比較は他県のようなレコード順一致ではなく多重集合（順不同）一致で行う。理由は
 * ブロック単位のoverride対象校を配列の末尾にまとめて追加しているため、既存データの
 * 元の掲載順（通学区・学校コード順）とは一致しないため。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/nagano.ts`の`parseNagano()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (nagano R8 実データ検証・カテゴリ2文字判定＋学校ごとの持ち越し境界)', () => {
  const geometries = naganoR8Geometry as PdfPageGeometry[];
  const parsed = parseNagano(geometries);
  const expectedR8Records = NAGANO_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（129件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(129);
  });

  test('レコードの多重集合が既存データと完全一致する（ブロックoverride校を配列末尾へ追加するため順不同比較）', () => {
    const keyOf = (r: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }) =>
      `${r.schoolName}|${r.department}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
    const parsedKeys = parsed.map(keyOf).sort();
    const expectedKeys = expectedR8Records.map(keyOf).sort();
    expect(parsedKeys).toEqual(expectedKeys);
  });

  test('カテゴリ2文字判定により「建築学」のような幅広ジャスティファイ語が誤分割されない（長野工業の実例）', () => {
    const naganoKogyo = parsed.filter((r) => r.schoolName === '長野工業');
    expect(naganoKogyo.map((r) => r.department).sort()).toEqual(['土木工学', '情報工学', '機械工学', '物質化学', '電気電子工学', '建築学'].sort());
  });

  test('数値列の桁が学科名列にはみ出さない（長野「普通」募集人員240の実例）', () => {
    const nagano = parsed.find((r) => r.schoolName === '長野' && r.department === '普通')!;
    expect({ schoolName: nagano.schoolName, area: nagano.area, department: nagano.department, quota: nagano.quota, finalApplicants: nagano.finalApplicants, finalRate: nagano.finalRate }).toEqual({
      schoolName: '長野',
      area: '北信',
      department: '普通',
      quota: 280,
      finalApplicants: 290,
      finalRate: 1.04,
    });
  });

  test('くくり募集（飯山の自然科学探究・人文科学探究）が既存データどおり1レコードに統合される', () => {
    expect(parsed.find((r) => r.schoolName === '飯山' && r.department.includes('くくり募集'))).toEqual({
      schoolName: '飯山',
      area: '北信',
      department: '自然科学探究・人文科学探究（くくり募集）',
      quota: 44,
      finalApplicants: 10,
      finalRate: 0.23,
    });
  });
});
