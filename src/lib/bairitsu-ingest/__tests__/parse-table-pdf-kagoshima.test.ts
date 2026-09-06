import { type PdfPageGeometry } from '../parse-table-pdf';
import { KAGOSHIMA_COMPETITION_RATES } from '@/data/competition-rates/kagoshima';
import kagoshimaR8Geometry from '../__fixtures__/kagoshima-r8-geometry.json';
import { parseKagoshima } from '../parsers/kagoshima';

/**
 * T-Y11B 段階2-b: kagoshima(鹿児島県)のR8倍率パーサ検証テスト。7学区が4頁に2段組(ehime/tokushima型)
 * で並ぶが、この県特有の最大の罠は「最終出願者数セルが3行に垂直分割される」構造。
 *
 * 列は[学校名/学科名/募集定員(未使用)/学力検査定員(=quota)/最終出願者数(=finalApplicants)/
 * 倍率本年(=finalRate)/倍率前年(未使用)]。全日制普通科は「一定枠」（地域指定枠）の内数を
 * 併記するため、最終出願者数セルが**3行1組**で構成される: ①主行の直前行に内数`(NN)`だけの行
 * （注記・無視してよい）②主行（学校名/学科名/学力検査定員/倍率が乗るが最終出願者数セル自体は
 * 空欄）③主行の直後行に生の最終出願者数だけの行（この値を主行のレコードへ充当する）。
 * 普通科以外の学科は①③が無く、②の行の最終出願者数セルに直接数値が印字される単純な1行構造。
 * 学区合計・全日制合計の集計行も同じ3行構造を持つが、department列が「合計」（列境界をまたいで
 * 「学」「区」がschoolName列・「合」「計」がdepartment列に分裂する）に一致するため他の集計行
 * （学校別「計」）と同じ除外ロジックで自然に弾ける。
 *
 * ⚠️罠1: 与論（普通科・最終出願者数0）は他の一定枠校と異なり③の直後行そのものが存在しない
 * （0人の場合はPDF側が生値行を印字しない）。「直前に押し込んだ未解決レコードを次の値だけの行で
 * 解決する」というcarry-forward式では、この直後行の空白を挟んで**遠く離れた全日制合計の直後行
 * （生値7,948）が誤って与論に充当される**事故が起きた。対策として先読み方式に切り替えた:
 * 主行を処理する時点で「次の行が値だけの行か」を`i+1`で直接確認し、そうでなければ即座に
 * finalApplicants=0として確定する（carry-forwardのような「未解決状態を持ち越す」設計をやめた）。
 *
 * ⚠️罠2: 学科名が長い学校（鹿児島商業3学科・鹿児島女子5学科等）は学科名列の幅を超えて2行に
 * 折り返され、主行自身のdepartment列は完全に空欄になる（折り返し断片が主行の前か後ろかも
 * 学校ごとに不規則）。断片の連結は試みず、既存データを根拠にした値ベースoverride
 * （`schoolName+quota+finalApplicants`キー・fukui/tottori型）で対応した（22件）。
 *
 * ⚠️罠3: 2段組はページ単位でLEFT→RIGHTの順に連結する必要がある（ehime/tokushimaは1頁のみ
 * だったため気付かなかったが、4頁ある本県で「全頁のLEFTをまとめてから全頁のRIGHT」という
 * 連結にすると学区の出現順が既存データと食い違う。ページごとにLEFT→RIGHTを連結してから
 * ページを跨いで連結するのが正しい）。
 *
 * ⚠️罠4: RIGHT列のschoolName/department境界は、5文字学校名（例:「鹿児島玉龍」x1≈331.3）と
 * 学科名の先頭が2桁桁の全角カナ1文字（例:「インテリア」の「イ」x0≈330.8）でx範囲が重なり、
 * 単一の境界値では両立しない。学校名列は境界を332に寄せて解決したが、この結果「学区合計」
 * （schoolName列「学区」+department列「合計」への分裂位置）も学区ごとに1〜2pxずれる。
 * 集計行の除外は`department`の完全一致だけでなく`(schoolName+department)`の部分一致
 * （「合計」を含むか）でも行う（「会計」等の実在学科名とは"合"≠"会"のため衝突しない）。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/kagoshima.ts`の`parseKagoshima()`へ純関数と
 * して抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (kagoshima R8 実データ検証・最終出願者数3行分割構造)', () => {
  const geometries = kagoshimaR8Geometry as unknown as PdfPageGeometry[];
  const parsed = parseKagoshima(geometries);

  const expectedR8Records = KAGOSHIMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する(156件・68校)', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(156);
  });

  test('レコード単位で既存データと完全一致する(頁順・LEFT列→RIGHT列の順で順序も含む)', () => {
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

  test('与論(最終出願者数0・直後行が存在しない実例)が正しく0として収録される', () => {
    expect(parsed.find((r) => r.schoolName === '与論')).toEqual({ schoolName: '与論', department: '普通', quota: 45, finalApplicants: 0, finalRate: 0 });
  });

  test('学区合計・全日制合計は収録されない', () => {
    expect(parsed.some((r) => r.quota === 10349)).toBe(false);
  });

  test('機械集計のグランドトータルが「全日制合計」行(quota10,349・applicants7,948)と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(10349);
    expect(sumApplicants).toBe(7948);
  });
});
