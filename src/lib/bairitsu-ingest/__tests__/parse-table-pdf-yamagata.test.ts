import { type PdfPageGeometry } from '../parse-table-pdf';
import { YAMAGATA_COMPETITION_RATES } from '@/data/competition-rates/yamagata';
import yamagataR8Geometry from '../__fixtures__/yamagata-r8-geometry.json';
import { parseYamagata } from '../parsers/yamagata';

/**
 * T-Y11B 段階2-b: yamagata(山形県)のR8倍率パーサ検証テスト。90/90件・完全一致（順序も含む）。
 * 2026-09-02に「学校名の末尾2文字と一致する学科系統ラベルが重複印字されるが、削るべき重複か
 * 学科名の一部か区別不能」という罠で次点扱いになっていたが、kochi/oitaで確立した技法
 * （持ち越し専用ラベル行の識別・値ベースoverride）で2026-09-04に再挑戦し解決した
 * （段階2-b34県目）。倍率は資料に印字されているが浮動小数の丸め誤差を避けるため
 * `roundHalfUpScaled`で自前算出し突合する。
 *
 * 列は[NO(未使用)/学校名/学科カテゴリ(タイト詰め2文字ゾーン)/学科具体名/入学定員(未使用)/
 * 前期選抜内定者数等(未使用)/募集人員(quota)/志願者数(finalApplicants)/志願倍率(未使用・
 * 自前算出)]。ページ0は表紙で内容なし・ページ4は【定時制の課程】専用のためスコープ外。
 *
 * ⚠️罠1（前回セッションの真因判明）: カテゴリ2文字ゾーンには意味の異なる2種類の行がある。
 * ①**持ち越し専用ラベル行**（category有り・specific無し・数値も無し。山辺「家庭」・
 * 寒河江「普通」）＝複数の後続学科行に共通適用される。②**行内完結の重複**（山形工業の
 * 情報技術行のように、category・specific・数値が同じ行に同居し、他行へ伝播させては
 * いけない）。前回セッションが「区別不能」と判断したのは、①②を同じ「学校名末尾2文字と
 * 一致するラベル」として一括りに扱っていたためで、実際は**同じ行に数値まで揃っているか
 * どうか**で機械的に区別できる（①は数値が無い・②は数値がある）。①だけを後続行へ
 * キャリーフォワードし、②はその行のみに閉じる設計に変更して解決した。
 *
 * ⚠️罠2: category+specificを連結する既定ルール（例:上山明新館「農業」+「食料生産」→
 * 「農業食料生産」）は多数の学校で正しいが、**学校名が業種を表す学校（○○工業・○○商業・
 * ○○水産等）ではcategoryが具体名の先頭と重複する冗長ラベルになる**（山形工業「工業」+
 * 「情報技術」は「情報技術」が正しく、寒河江工業・米沢鶴城・長井工業・鶴岡工業・加茂水産・
 * 山形市立商業・村山産業・新庄神室産業・酒田光陵も同型）。具体名が既にcategoryと同じ文字で
 * 始まる場合（置賜農業「農業」+「資源活用」で具体名列自体が「農業資源活用」まで含んで
 * 印字されるケース）は具体名をそのまま採用する自動ルールで解決できたが、具体名がcategoryを
 * 含まない場合（村山産業「農業」+「経営」等）は既存データを根拠にした値ベースoverrideで
 * 個別対応した。
 *
 * ⚠️罠3: 学科名と数値列の間に脚注番号らしき孤立した数字1桁が印字され学科名の末尾に混入する
 * ことがある（新庄志誠館「普通」の実例・「普通0」）。実在の学科名が末尾に裸の数字を持つ
 * ことは無いため、合成後の末尾数字を除去して解決した。
 *
 * ⚠️罠4: 数値だけを持つ行（自分の学校名ラベルを持たない）の直後に、直前とは異なる新しい
 * 学校名ラベルが単独で現れることがある（新庄神室産業「金山校」→「真室川校」の実例・
 * 数値がどちらの学校に属するか判別できない構造）。個別renameで対応した。
 *
 * ⚠️罠5: 【定時制の課程】の見出し行自体は罫線ブロックの外（表タイトル）にあり通常の行走査
 * では検出できないため、定時制の課程を含むページ（ページ4）自体をスコープから除外した。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/yamagata.ts`の`parseYamagata()`へ純関数と
 * して抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (yamagata R8 実データ検証・カテゴリ持ち越しラベルと行内完結重複の判別)', () => {
  // ページ0は表紙、ページ4は【定時制の課程】専用のためスコープ外（fixtureにはページ1-3のみ収録）。
  const geometries = yamagataR8Geometry as PdfPageGeometry[];
  const parsed = parseYamagata(geometries);
  const expectedR8Records = YAMAGATA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（90件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(90);
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

  test('持ち越し専用ラベル行（山辺「家庭」）が食物・福祉の2学科に正しく適用される', () => {
    expect(parsed.find((r) => r.schoolName === '山辺' && r.department === '家庭食物')).toEqual({ schoolName: '山辺', department: '家庭食物', quota: 20, finalApplicants: 17, finalRate: 0.85 });
    expect(parsed.find((r) => r.schoolName === '山辺' && r.department === '家庭福祉')).toEqual({ schoolName: '山辺', department: '家庭福祉', quota: 21, finalApplicants: 3, finalRate: 0.14 });
  });

  test('行内完結の重複（山形工業「情報技術」）は他の学科行へ伝播しない', () => {
    const yamagataKogyo = parsed.filter((r) => r.schoolName === '山形工業');
    expect(yamagataKogyo).toEqual([
      { schoolName: '山形工業', department: '機械技術', quota: 20, finalApplicants: 30, finalRate: 1.5 },
      { schoolName: '山形工業', department: '電気電子', quota: 20, finalApplicants: 24, finalRate: 1.2 },
      { schoolName: '山形工業', department: '情報技術', quota: 20, finalApplicants: 31, finalRate: 1.55 },
      { schoolName: '山形工業', department: '建築', quota: 20, finalApplicants: 24, finalRate: 1.2 },
      { schoolName: '山形工業', department: '土木・化学', quota: 20, finalApplicants: 9, finalRate: 0.45 },
    ]);
  });
});
