import { parseTablePdfPageRows, assembleCompetitionRateRows, normalizeExtractedText, type PdfPageGeometry, type TableColumnLayout } from '../parse-table-pdf';
import { SHIMANE_COMPETITION_RATES } from '@/data/competition-rates/shimane';
import shimaneR8Geometry from '../__fixtures__/shimane-r8-geometry.json';

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
 */
const SHIMANE_LAYOUT: TableColumnLayout = {
  // 0学校名,1学科名,2未使用,3quota(i),4未使用(k),5applicants(j),6未使用,7未使用,8rate(p)
  boundaries: [100, 150, 185, 441.65, 460.7, 479.8, 500.6, 560, 613.6, 638.3],
  fullLineX0Max: 120,
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 5, finalRate: 8 },
};

const SCHOOL_NAME_OVERRIDE: Record<string, string> = { 皆松美江が市丘立女子: '皆美が丘女子' };

/** くくり募集4組: 代表学科のブロックの学校名列には学科群名が印字される（幾何学的に区別不能）。 */
const CONTINUATION_LABELS = new Set(['情報科学', '商業', '普通']);

/** くくり募集4組の内数コース名合成。既存データを根拠にした値ベースoverride。 */
const KUKURI_OVERRIDE = new Map<string, string>([
  ['安来|72|46', '情報科学(情報システム・情報処理・マルチメディア)'],
  ['松江商業|101|133', '商業(商業・国際ビジネス・情報処理)'],
  ['浜田商業|44|29', '商業(商業・情報処理)'],
  ['隠岐島前|51|17', '普通(普通・地域共創)'],
]);

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

describe('bairitsu-ingest parse-table-pdf 罫線+結合セル組み立て (shimane R8 実データ検証・くくり募集ブロックの学校名誤認)', () => {
  const geometries = shimaneR8Geometry as unknown as PdfPageGeometry[];

  const rawRows = geometries.map((geom) => parseTablePdfPageRows(geom, SHIMANE_LAYOUT));
  const assembled = assembleCompetitionRateRows(rawRows, '合計', {
    excludeRow: (department) => department.includes('計'),
  }).filter((r) => r.quota > 0);
  // ⚠️罠3(wakayama型の再確認): Number('')は0(finite)を返すため、くくり募集の内数コース行
  // （数値が一切乗らない継続行）がquota=0の偽レコードとしてassembleCompetitionRateRowsの
  // NaNチェックを素通りする。quota>0を呼び出し側の不変条件として追加要求する。

  let lastRealSchool = '';
  const parsed: ParsedRow[] = assembled.map((r) => {
    const renamed = SCHOOL_NAME_OVERRIDE[r.schoolName] ?? r.schoolName;
    const schoolName = CONTINUATION_LABELS.has(renamed) ? lastRealSchool : renamed;
    if (!CONTINUATION_LABELS.has(renamed)) lastRealSchool = schoolName;
    const override = KUKURI_OVERRIDE.get(`${schoolName}|${r.quota}|${r.finalApplicants}`);
    return { schoolName, department: override ?? r.department, quota: r.quota, finalApplicants: r.finalApplicants, finalRate: r.finalRate };
  });

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
