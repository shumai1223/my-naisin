import { type PdfPageGeometry } from '../parse-table-pdf';
import { OITA_COMPETITION_RATES } from '@/data/competition-rates/oita';
import oitaR8Geometry from '../__fixtures__/oita-r8-geometry.json';
import { parseOita } from '../parsers/oita';

/**
 * T-Y11B 段階2-b: oita(大分県)のR8倍率パーサ検証テスト。81/81件・39校・完全一致（順序も含む）。
 * 2026-09-03に「座標抽出した数値が既存データと一致しない・原因未特定」として次点扱いに
 * なっていたが、shigaで確立した技法（y座標クラスタリングのタイト化・注記サブ行の数値混入
 * フィルタ）で2026-09-04に再挑戦し解決した（段階2-b32県目）。倍率は資料に印字されておらず
 * `roundHalfUpScaled`で自前算出（nara/shiga型）。
 *
 * 列は`boundaries=[57.8, 135, 205.3, 264.8, 324.4, 383.9, 443.4, 502.9, 562.4]`で
 * [学校名/学科名/入学定員(未使用)/quota(募集人員)/当初志願者数(未使用)/取り下げ数(未使用)/
 * 提出数(未使用)/finalApplicants(最終志願者数)]。
 *
 * ⚠️罠1（前回セッションが「数値が別の学校の値と入れ替わっている」と誤認した真因）:
 * 「うちビジネスＩＴコースは14人以内」等の注記が、学科名列だけでなく**quota/applicants列
 * にまではみ出して印字される**ことがあり、これを数値として採用してしまうと直前の行の
 * 正しい数値を上書きしてしまう（国東「普通」で実際に発生）。対策は「quota/applicants列の
 * 生テキストが数字（カンマ含む）のみで構成されている時だけ数値として採用する」という
 * 正規表現ガード。前回セッションの「y座標クラスタリングの許容値を狭める/広げる」という
 * 打開案は的外れで、真因は列そのものへの注記混入だった。
 *
 * ⚠️罠2: 学科名ラベルと数値(quota/applicants)が同じ細分行に乗らず前後の別行に分裂すること
 * がある。パターンは学校によって異なり、①別府翔青は「数値の行→(次行)ラベルの行」、
 * ②国東は「数値の行→…（注記を挟む）…→ラベルの行」、③安心院は**前の学校ブロックの末尾に
 * 数値だけが浮いて残り、次の学校のラベル行と合体する**。①②③いずれも「ラベル/数値の
 * どちらか一方しか持たない行を出現順にgreedyへ合体させ、ブロック（学校）境界をまたいで
 * pending状態を持ち越す」という単一のアルゴリズムで解決できる。レコードの帰属校は
 * 「合体が完了した時点のcurrentSchool」で判定する。
 *
 * ⚠️罠3: 中津南耶馬溪校（中津南の分校）は、**学科名ラベル→分校名ラベルの順で、学校名が
 * 学科名より後に出現する**（罠2の合体ロジックでは学科名+数値の完了時点でまだ前の学校名
 * 「中津南」のままのため、完了時に誤って中津南へ帰属してしまう）。この1校だけは
 * `(currentSchool|department)`キーの個別renameで対応した。
 *
 * ⚠️罠4: 「計」という1文字の小計行を除外する際、`department.includes('計')`のような部分
 * 一致だと実在する学科名「ビジネス会計」まで誤って除外してしまう（末尾に「計」を含む）。
 * 完全一致`department === '計'`に変更して解決。
 *
 * ⚠️罠5: 「[ 定 時 制 ]」セクション見出しは実際の文字が「定　時　制」のように全角スペースで
 * 均等割り付けされて印字されるため、正規化前の生テキストへの`.includes('定時制')`では
 * 検知できない（内部空白を除去する`normalizeExtractedText`を通してから判定する必要がある）。
 * この節には中津東・大分工業・爽風館（全て定時制専用で既存データに存在しない）・日田が
 * 全日制と別の数値で再登場するため、検知したら以降を打ち切る。
 *
 * ⚠️罠6: 大分舞鶴「普通・理数（くくり募集）」・大分東「園芸ビジネス・園芸デザイン（くくり
 * 募集）」は資料上くくり募集の相方学科名が別セルに分散し単純結合では復元できないため、
 * 既存データを根拠にした値ベースoverrideで対応した（fukui/tottori型）。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/oita.ts`の`parseOita()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (oita R8 実データ検証・ラベル/数値分裂のブロック横断合体)', () => {
  const geometries = oitaR8Geometry as PdfPageGeometry[];
  const parsed = parseOita(geometries);
  const expectedR8Records = OITA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（81件・39校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(81);
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

  test('注記が数値列にはみ出す行でも直前の正しい数値を上書きしない（国東「普通」の実例）', () => {
    const kunisaki = parsed.find((r) => r.schoolName === '国東' && r.department === '普通')!;
    expect({ schoolName: kunisaki.schoolName, department: kunisaki.department, quota: kunisaki.quota, finalApplicants: kunisaki.finalApplicants, finalRate: kunisaki.finalRate }).toEqual({
      schoolName: '国東',
      department: '普通',
      quota: 79,
      finalApplicants: 65,
      finalRate: 0.82,
    });
  });

  test('学科名ラベルと数値がブロック境界をまたいで分裂しても正しく合体する（安心院の実例）', () => {
    const ajimu = parsed.find((r) => r.schoolName === '安心院')!;
    expect({ schoolName: ajimu.schoolName, department: ajimu.department, quota: ajimu.quota, finalApplicants: ajimu.finalApplicants, finalRate: ajimu.finalRate }).toEqual({
      schoolName: '安心院',
      department: '普通',
      quota: 44,
      finalApplicants: 14,
      finalRate: 0.32,
    });
  });

  test('【定時制】以降が打ち切られ中津東の全日制6学科のみが残る（定時制専用の爽風館は0件）', () => {
    const nakatsuHigashi = parsed.filter((r) => r.schoolName === '中津東');
    expect(nakatsuHigashi).toHaveLength(6);
    expect(parsed.some((r) => r.schoolName === '爽風館')).toBe(false);
  });
});
