import { parseTablePdfPageRows, assembleCompetitionRateRows, normalizeExtractedText, type PdfPageGeometry, type TableColumnLayout } from '../parse-table-pdf';
import { WAKAYAMA_COMPETITION_RATES } from '@/data/competition-rates/wakayama';
import wakayamaR8Geometry from '../__fixtures__/wakayama-r8-geometry.json';

/**
 * T-Y11B 段階2-b: wakayama(和歌山県)のR8倍率パーサ検証テスト。全1頁・ibaraki型（結合セル・
 * 罫線でブロック境界判定）だが、この県特有の最大の罠は列構成そのもの: quota(=入学者枠数A)と
 * finalApplicants(=D+E、スポーツ推薦本出願者数Dと一般選抜本出願者数Eの合算)が別々の列で、
 * 単一列をfinalApplicantsに割り当てる既存のroles機構では表現できない。
 *
 * 列は[学校名/学科名/学級数(未使用)/定員(未使用)/特色化選抜合格内定者数(未使用)/
 * (全国枠内数・未使用)/入学者枠数A(=quota)/スポーツ推薦一般出願者数B(未使用)/
 * 一般選抜一般出願者数C(未使用)/(全国枠内数・未使用)/一般出願倍率(B+C)/A(未使用)/
 * スポーツ推薦本出願者数D/一般選抜本出願者数E/(全国枠内数・未使用)/本出願倍率(D+E)/A(=finalRate)]。
 * `extraColumns`でDを追加取得し、`parseTablePdfPageRows`の出力を`.map()`してE(role側の
 * applicantsText)にDを加算してから`assembleCompetitionRateRows`へ渡す（kochi型の拡張と同型）。
 *
 * ⚠️罠1: 学校名ラベルは結合セルのほぼ中央行に出現する（ibaraki型）が、ブロックの行数が2の
 * 場合は中央位置が2行の"間"に落ちるため、ラベルだけの独立した行が生成される（橋本の例:
 * 探究科(主行)→橋本(ラベルのみの行)→探究科（県立中）*1(内部進学専用・除外)の3行1ブロック）。
 * 既存の`assembleCompetitionRateRows`はブロック内のどの行にラベルがあっても正しく拾うため
 * 追加対応は不要だった。
 *
 * ⚠️罠2: 分校4校（美里・清水・中津・龍神）はschoolName列に「(◯◯分校)」（親校名を伴わない
 * **半角**括弧付き名・学科名列の全角括弧とは印字が異なる）だけが独立したブロックとして
 * 印字される。既存データは「親校名(◯◯分校)」の複合名で表記するため、パース後に「直前に
 * 登場した非分校の学校名」を追跡し、`^\(.+\)$`にマッチするschoolNameを`親校名(◯◯分校)`へ
 * 書き換える後処理を行った。
 *
 * ⚠️罠3: くくり募集3組（有田中央/南部/串本古座）は、主課程の行にのみ数値が乗り、内数の
 * コース名は数値を持たない別行（主行の前または後）として独立に印字される（幾何学的に
 * 帰属決定不能な構造・nagano/tottori型と同型）。既存データを根拠にした値ベースoverride
 * （`schoolName+quota+finalApplicants`キー）でdepartmentを合成した。
 *
 * ⚠️罠4: 既存データの学科名は括弧をすべて**半角**`()`で統一する県固有の表記慣行を持つ
 * （学科名列のPDF印字自体は全角「（）」・okinawa型の逆パターン）。`normalizeDepartmentText`は
 * 半角→全角のみ変換するため、この県はパーサ出力側で全角→半角へ戻すpost-processが必要。
 * 分校を示す脚注番号(*2)等が学科名の末尾に連結印字されるため同時に除去する。
 *
 * ⚠️罠5: `Number('')`はJSの仕様上0(finite)を返すため、内部進学専用5学科（募集自体が存在
 * しない・quota欄が空欄）やくくり募集の内数コース行（数値が一切乗らない継続行）が
 * quota=0の偽レコードとして`assembleCompetitionRateRows`のNaNチェックを素通りしてしまう
 * （65件と過剰計上・8件の偽レコードが混入）。空欄と真の0を区別できないこの関数の限界に
 * 対し、呼び出し側で`quota>0`を明示的な不変条件として追加要求することで解決した。
 */
const WAKAYAMA_LAYOUT: TableColumnLayout = {
  // 0学校名,1学科名,2学級数,3定員,4内定者数,5全国枠1,6A(quota),7B,8C,9全国枠2,10rate1,11D,12E,13全国枠3,14rate2(finalRate)
  boundaries: [83, 127, 204, 225, 255, 270, 296, 318, 341, 366, 386, 417, 441, 464, 487, 512],
  fullLineX0Max: 100,
  roles: { schoolName: 0, department: 1, quota: 6, finalApplicants: 12, finalRate: 14 },
  extraColumns: { d: 11 },
};

/** PDFは全角括弧で印字するが、既存データは括弧をすべて半角で統一する県固有の表記慣行を持つ。
 *  脚注番号(*1〜*5)も学科名の末尾に連結印字されるため、既存データに合わせて除去する。 */
function toHalfWidthParens(s: string): string {
  return s
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/\*\d+$/, '');
}

/** くくり募集3組: 主課程行にのみ数値が乗り、内数コース名は別の数値を持たない行に分裂する。 */
const KUKURI_OVERRIDE = new Map<string, string>([
  ['有田中央|105|60', '総合学科(総合・福祉)'],
  ['南部|97|55', '食と農園科(園芸・加工流通・調理)'],
  ['串本古座|111|48', '未来創造学科(宇宙探究・地域探究/文理探究)'],
]);

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

describe('bairitsu-ingest parse-table-pdf 罫線+結合セル組み立て (wakayama R8 実データ検証・quota=A/finalApplicants=D+E)', () => {
  const geometries = wakayamaR8Geometry as unknown as PdfPageGeometry[];

  const rawRows = geometries.map((geom) => {
    const rows = parseTablePdfPageRows(geom, WAKAYAMA_LAYOUT);
    return rows.map((r) => ({
      ...r,
      applicantsText: String(Number(r.applicantsText.replace(/,/g, '') || 0) + Number(r.extra.d.replace(/,/g, '') || 0)),
    }));
  });

  const assembled = assembleCompetitionRateRows(rawRows, '合計', {
    excludeRow: (department) => department === '計' || department.includes('合計'),
  }).filter((r) => r.quota > 0);
  // ⚠️Number('')は0(finite)を返すため、内部進学専用行やくくり募集の内数コース行(数値が
  // 一切乗らない)がquota=0のまま素通りする。`assembleCompetitionRateRows`のNaNチェックは
  // 空欄と真の0を区別できないため、quota>0を明示的な不変条件として追加で要求する。

  let lastNonBranchSchool = '';
  const parsed: ParsedRow[] = assembled.map((r) => {
    const branchMatch = /^\((.+)\)$/.exec(r.schoolName);
    const schoolName = branchMatch ? `${lastNonBranchSchool}(${branchMatch[1]})` : r.schoolName;
    if (!branchMatch) lastNonBranchSchool = schoolName;
    const department = toHalfWidthParens(r.department);
    const override = KUKURI_OVERRIDE.get(`${schoolName}|${r.quota}|${r.finalApplicants}`);
    return { schoolName, department: override ?? department, quota: r.quota, finalApplicants: r.finalApplicants, finalRate: r.finalRate };
  });

  const expectedR8Records = WAKAYAMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する(57件・32校)', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(57);
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

  test('内部進学専用5学科(募集自体が存在しない)は収録されない', () => {
    expect(parsed.some((r) => normalizeExtractedText(r.department).includes('環境科学科'))).toBe(false);
  });

  test('分校4校が親校名(◯◯分校)の複合名で収録される', () => {
    expect(parsed.filter((r) => /（|分校）/.test(r.schoolName) === false && r.schoolName.includes('分校')).length).toBe(4);
  });

  test('機械集計のグランドトータルが「合計」行(quota5,761・applicants4,891)と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(5761);
    expect(sumApplicants).toBe(4891);
  });
});
