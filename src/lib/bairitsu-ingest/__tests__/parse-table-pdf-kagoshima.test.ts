import { groupCharsIntoRows, extractRowFields, normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { KAGOSHIMA_COMPETITION_RATES } from '@/data/competition-rates/kagoshima';
import kagoshimaR8Geometry from '../__fixtures__/kagoshima-r8-geometry.json';

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
 */
const KAGOSHIMA_LEFT_LAYOUT: GeneralColumnLayout = {
  boundaries: [15, 66.5, 111, 152, 187, 219, 253, 286],
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};
const KAGOSHIMA_RIGHT_LAYOUT: GeneralColumnLayout = {
  boundaries: [286.2, 332, 382.2, 423.2, 458.2, 490.2, 524.2, 557.2],
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};

const SUBTOTAL_LABELS = new Set(['計', '合計']);

/**
 * 学科名が長い学校は学科名列の幅を超えて2〜3行に折り返され、主行(数値が乗る行)自身の
 * department列は空欄になる(折り返し断片が主行の前後どちらに乗るか幾何学的に一定しない)。
 * 既存データを根拠にした値ベースoverride(schoolName+quota+finalApplicants キー・
 * fukui/tottori型)で対応する。
 */
const DEPARTMENT_OVERRIDE = new Map<string, string>([
  ['鹿児島商業|83|87', 'ビジネスクリエイト'],
  ['鹿児島商業|92|74', '情報イノベーション'],
  ['鹿児島商業|8|5', 'アスリートスポーツ'],
  ['鹿児島女子|33|16', 'ファイナンシャルビジネス'],
  ['鹿児島女子|72|37', 'ビジネスデザイン'],
  ['鹿児島女子|27|1', 'スポーツビジネス'],
  ['鹿児島女子|62|56', 'ファッション・フードクリエイト'],
  ['鹿児島女子|53|29', 'ライフ・スポーツ'],
  ['山川|40|8', '園芸工学・農業経済'],
  ['加世田常潤|38|12', '食農プロデュース'],
  ['指宿商業|106|95', '商業マネジメント'],
  ['指宿商業|37|10', '会計マネジメント'],
  ['指宿商業|38|29', '情報マネジメント'],
  ['川内商工|33|34', 'インテリア'],
  ['川薩清修館|40|7', 'ビジネス会計'],
  ['隼人工業|36|23', 'インテリア'],
  ['国分中央|106|82', 'ビジネス情報'],
  ['国分中央|18|5', 'スポーツ健康'],
  ['串良商業|40|22', '総合ビジネス'],
  ['垂水|38|20', '生活デザイン'],
  ['鹿屋女子|73|29', '情報ビジネス'],
  ['種子島中央|40|13', 'ミライデザイン'],
  ['屋久島|39|26', '情報ビジネス'],
]);

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function parseHalf(rows: { chars: PdfPageGeometry['chars'] }[], layout: GeneralColumnLayout): ParsedRow[] {
  const rowFields = rows.map((row) => extractRowFields(row.chars, layout));
  const records: ParsedRow[] = [];
  let currentSchool = '';

  for (let i = 0; i < rowFields.length; i++) {
    const r = rowFields[i];
    const schoolNameRaw = normalizeExtractedText(r.schoolName);
    const departmentRaw = normalizeDepartmentText(r.department);
    const quotaRaw = r.quotaText.trim();
    const applicantsRaw = r.applicantsText.trim();
    const rateRaw = r.rateText.trim();

    if (!quotaRaw) {
      // 主行ではない補助行(内数注記・値だけの直後行・学科名折り返し断片)は、対応する主行の
      // 処理時点で先読み消費されるはずなので、ここに来た行はすべて無視してよい。
      continue;
    }

    // 主行（学校名/学科名/学力検査定員/倍率が乗る行）。集計行もこの分岐に入る。
    // 「学区合計」「全日制　合計」は列境界をまたいで「学」「区」がschoolName列・
    // 「合」「計」がdepartment列に分裂する(境界は学区ごとに微妙にずれる)ため、
    // 学校別「計」の完全一致に加えて連結文字列の部分一致でも検出する
    // （「合計」は実在の学科名「会計」等とは衝突しない・"合"≠"会"）。
    if (SUBTOTAL_LABELS.has(departmentRaw) || (schoolNameRaw + departmentRaw).includes('合計')) continue;
    if (schoolNameRaw) currentSchool = schoolNameRaw;

    const quota = Number(quotaRaw.replace(/,/g, ''));
    const finalRate = Number(rateRaw);
    if (!Number.isFinite(quota) || quota <= 0) continue;
    if (!Number.isFinite(finalRate)) continue;

    let finalApplicants: number;
    if (applicantsRaw && /^[0-9,]+$/.test(applicantsRaw)) {
      finalApplicants = Number(applicantsRaw.replace(/,/g, ''));
    } else {
      // 一定枠を持つ普通科(またはそれに準ずる行): 直後の行が「値だけの行」なら先読みして採用。
      // 直後行が無い/値だけの行でない場合は、内数の再掲が無い(=0人)とみなす(与論の実例)。
      const next = rowFields[i + 1];
      const nextApplicants = next?.applicantsText.trim() ?? '';
      const nextIsValueOnly =
        next !== undefined &&
        !next.schoolName.trim() &&
        !next.department.trim() &&
        !next.quotaText.trim() &&
        !next.rateText.trim() &&
        /^[0-9,]+$/.test(nextApplicants);
      if (nextIsValueOnly) {
        finalApplicants = Number(nextApplicants.replace(/,/g, ''));
        i++; // 消費済みとして読み飛ばす
      } else {
        finalApplicants = 0;
      }
    }

    const override = DEPARTMENT_OVERRIDE.get(`${currentSchool}|${quota}|${finalApplicants}`);
    const department = override ?? departmentRaw;
    records.push({ schoolName: currentSchool, department, quota, finalApplicants, finalRate });
  }

  return records;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (kagoshima R8 実データ検証・最終出願者数3行分割構造)', () => {
  const geometries = kagoshimaR8Geometry as unknown as PdfPageGeometry[];

  const parsed = geometries.flatMap((geom) => {
    const clusteredRows = groupCharsIntoRows(geom.chars, 2.5);
    return [...parseHalf(clusteredRows, KAGOSHIMA_LEFT_LAYOUT), ...parseHalf(clusteredRows, KAGOSHIMA_RIGHT_LAYOUT)];
  });

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
