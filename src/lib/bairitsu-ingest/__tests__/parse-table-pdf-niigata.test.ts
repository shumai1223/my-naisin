import { type PdfPageGeometry } from '../parse-table-pdf';
import { NIIGATA_COMPETITION_RATES } from '@/data/competition-rates/niigata';
import niigataR8Geometry from '../__fixtures__/niigata-r8-geometry.json';
import { parseNiigata } from '../parsers/niigata';

/**
 * T-Y11B 段階2-b: niigata(新潟県)のR8倍率パーサ検証テスト。全日制4頁（8学科区分が1頁に複数
 * まとまって印字される・区分ごとに「計」小計行あり）・tochigi型に近いが、この県は
 * **schoolNameを行ごとに省略せず毎回律義に印字し直す**（複数学科を持つ学校でも2行目に
 * schoolNameが空欄にならない）という他県と逆方向の単純さを持つ。
 *
 * 列は[学番(未使用)/学校名/学科名(コース名)/募集学級(未使用)/一般選抜募集人数A(=quota)/
 * 一般選抜志願者数B(=finalApplicants)/倍率B/A(=finalRate)/海外帰国生徒等特別選抜志願者数
 * (未使用)]。93/93件・73校・完全一致（グランドトータルquota11,709・applicants11,679も
 * 「全日制合計」行と一致）。
 *
 * ⚠️罠1(既知・着手前に発見済み・実測で原因が判明): 「あおい」→改行→「碧」のように、学校名の
 * 上にふりがなが別行として先に印字される実例が1件ある（碧高校）。この1件だけ、ふりがな行
 * (y254.7)→データ行(y256.7・departmentのみ)→漢字行(y258.1)の3つのy位置が約1.4〜2.0pt刻みで
 * 隣接しており、`groupCharsIntoRows`の移動平均クラスタリング（yTolerance=2.5）だと**両端の
 * 差(3.4pt)は許容差を超えるのに、中間のデータ行が橋渡しして3行すべてが1行に連鎖結合される**
 * （結果、schoolName列の文字がx0昇順で「あ→碧→お→い」と入り混じった不可解な文字列になる・
 * shimane型の「字幅がほぼ同じ2行が交互に混ざる」と同根の罠）。yToleranceを1.5に下げることで
 * あおい行(254.7)とデータ行(256.7)の間(2.0pt)は分離しつつ、データ行(256.7)と碧行(258.1)の間
 * (1.4pt)は結合されたままにでき、結果としてデータ行が「碧」を自分のschoolNameとして直接
 * 取り込む形になり正しく解決した。あおい単独行はdepartmentを持たないため後段のフィルタで
 * 自然に除去される。
 *
 * ⚠️罠2: 学科区分ごとの小計「計」行は、`department`列でなく**schoolName列に「計」1文字が
 * 印字される**（department列は空欄）。素朴なcarry-forwardだと直前の学校名を「◯◯計」のように
 * 汚染してしまう（例: 見附→見附計）ため、`assembleSimpleTableRows`に通す前に
 * schoolNameが厳密に「計」の行を除去する前処理が必要（department列に「計」が来る他県
 * （nagasaki/shimane型）とは列位置が逆）。
 *
 * ⚠️罠3: 「全日制　合計」の直後に「定時制の課程」セクションが同一頁内で続けて印字される
 * （6頁構成のうち最後の頁1枚に全日制の残り区分＋定時制の全データが同居）。schoolName列に
 * 「全日制」が現れた時点で以降を読み飛ばす（`stopAt`相当の手動スライス）。
 *
 * ⚠️罠4: 分校・キャンパス名を括弧書きする学校が1件（佐渡(両津)）あり、PDFは全角「（）」で
 * 印字するが既存データは半角`()`で統一する（wakayama型と同型の県固有慣行）。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/niigata.ts`の`parseNiigata()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (niigata R8 実データ検証・ふりがな単独行とschoolName列の小計)', () => {
  const geometries = niigataR8Geometry as unknown as PdfPageGeometry[];
  const parsed = parseNiigata(geometries);

  const expectedR8Records = NIIGATA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する(93件・73校)', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(93);
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

  test('ふりがな単独行「あおい」は収録されず、碧が正しい学校名で収録される', () => {
    expect(parsed.some((r) => r.schoolName === 'あおい')).toBe(false);
    const aoi = parsed.find((r) => r.schoolName === '碧')!;
    expect({ schoolName: aoi.schoolName, department: aoi.department, quota: aoi.quota, finalApplicants: aoi.finalApplicants, finalRate: aoi.finalRate }).toEqual({ schoolName: '碧', department: '普通', quota: 160, finalApplicants: 153, finalRate: 0.95 });
  });

  test('定時制セクションは収録されない', () => {
    expect(parsed.some((r) => r.department.includes('午前') || r.department.includes('夜間'))).toBe(false);
  });

  test('機械集計のグランドトータルが「全日制合計」行(quota11,709・applicants11,679)と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(11709);
    expect(sumApplicants).toBe(11679);
  });
});
