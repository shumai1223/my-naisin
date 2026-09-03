import { groupCharsIntoRows, extractRowFields, normalizeExtractedText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { NIIGATA_COMPETITION_RATES } from '@/data/competition-rates/niigata';
import niigataR8Geometry from '../__fixtures__/niigata-r8-geometry.json';

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
 */
const NIIGATA_LAYOUT: GeneralColumnLayout = {
  boundaries: [115, 200, 282, 320, 362, 406, 447],
  // 0学校名,1学科名,2募集学級(未使用),3quota(A),4finalApplicants(B),5finalRate(B/A)
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};

const HIRAGANA_ONLY = /^[ぁ-んー]+$/;

/**
 * 五泉総合高等学校は、PDFの学校名列に「五泉」（2文字）としか印字されない（総合学科の
 * 学校であるにもかかわらず「総合」が省略される・同じ総合学科区分の他9校は全て正式名称通り
 * 印字されており、この1校だけの例外）。既存データが正式校名「五泉総合」を採用しているため、
 * 固定のrenameで補う。
 */
const SCHOOL_NAME_OVERRIDE: Record<string, string> = { 五泉: '五泉総合' };

interface RowFields {
  schoolName: string;
  department: string;
  quotaText: string;
  applicantsText: string;
  rateText: string;
}

/** ふりがな単独行(碧の実例)を無視し、データ行が自前のschoolNameを持たない場合は前後3行以内の
 *  最初の非ひらがなschoolNameフラグメントを借用する。ふりがな単独行自体は最後に取り除く。 */
function resolveFuriganaOrphans(rows: RowFields[]): RowFields[] {
  const patched = rows.map((r) => ({ ...r }));
  for (let i = 0; i < patched.length; i++) {
    const r = patched[i];
    if (r.schoolName || !r.department) continue; // 自前の名前を持つ・またはデータ行でない
    for (const j of [i - 1, i + 1, i - 2, i + 2, i - 3, i + 3]) {
      const cand = patched[j]?.schoolName;
      if (cand && !HIRAGANA_ONLY.test(cand)) {
        r.schoolName = cand;
        break;
      }
    }
  }
  return patched.filter((r) => !(HIRAGANA_ONLY.test(r.schoolName) && !r.department));
}

function parseAllPages(geometries: PdfPageGeometry[]) {
  const allRowFields: RowFields[] = [];
  for (const geom of geometries) {
    const rows = groupCharsIntoRows(geom.chars, 1.5);
    for (const row of rows) {
      const fields = extractRowFields(row.chars, NIIGATA_LAYOUT);
      const schoolName = normalizeExtractedText(fields.schoolName);
      // 学科区分の小計「計」1文字はschoolName列に印字される（department列でなく）。
      if (schoolName === '計') continue;
      allRowFields.push({
        schoolName,
        department: normalizeExtractedText(fields.department),
        quotaText: fields.quotaText,
        applicantsText: fields.applicantsText,
        rateText: fields.rateText,
      });
    }
  }

  const cutIdx = allRowFields.findIndex((r) => r.schoolName === '全日制');
  const scoped = cutIdx === -1 ? allRowFields : allRowFields.slice(0, cutIdx);
  const resolved = resolveFuriganaOrphans(scoped);

  let currentSchool = '';
  const records = [];
  for (const r of resolved) {
    if (r.schoolName) currentSchool = r.schoolName;
    if (!r.department) continue;
    const quota = Number(r.quotaText.replace(/,/g, ''));
    const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
    const finalRate = Number(r.rateText);
    if (!Number.isFinite(quota) || quota <= 0) continue;
    if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
    // ⚠️「佐渡(両津)」のように分校・キャンパス名を括弧書きする学校が1件あり、PDFは全角
    // 「（）」で印字するが既存データは半角`()`で統一する（wakayama型と同型の県固有慣行）。
    const parenFixed = currentSchool.replace(/（/g, '(').replace(/）/g, ')');
    const schoolName = SCHOOL_NAME_OVERRIDE[parenFixed] ?? parenFixed;
    records.push({ schoolName, department: r.department, quota, finalApplicants, finalRate });
  }
  return records;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (niigata R8 実データ検証・ふりがな単独行とschoolName列の小計)', () => {
  const geometries = niigataR8Geometry as unknown as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);

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
    expect(parsed.find((r) => r.schoolName === '碧')).toEqual({ schoolName: '碧', department: '普通', quota: 160, finalApplicants: 153, finalRate: 0.95 });
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
