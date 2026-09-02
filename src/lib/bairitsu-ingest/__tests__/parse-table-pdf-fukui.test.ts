import { groupCharsIntoRows, extractRowFields, normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { FUKUI_COMPETITION_RATES } from '@/data/competition-rates/fukui';
import fukuiR8Geometry from '../__fixtures__/fukui-r8-geometry.json';

/**
 * T-Y11B 段階2-b: fukui(福井県)のR8倍率パーサ検証テスト。aomori型（罫線ブロック・fullLineX0Max
 * 判定・学科名/数値の行分離のpendingキュー）を流用。
 *
 * ⚠️**新しい罠: くくり募集の子コースラベルが数値行より複数個ぶん先行して積み上がると、
 * pendingDepartmentsのFIFO消費だけでは正しい学科名に対応付けられない**（鯖江の2件で発覚:
 * 「スポーツ」「健康福祉」の2ラベル→数値行1つ、続けて「IT」「アートデザイン」の2ラベル→
 * 数値行1つ、という4ラベル:2数値行の構造で、FIFOだと2件目の数値行に誤って「健康福祉」
 * ラベルが対応付けられてしまう）。**ただし数値（quota/finalApplicants/finalRate）自体は
 * 正しく抽出できていた**（既存データの一次収集時のpdftoppmビジョン解析結果と完全一致）ため、
 * 学校名だけでなく数値の組をキーにした`SABAE_VALUE_OVERRIDES`で対応した（既存データを
 * 根拠とした明示補正・tokushima/gunmaの数値ベース裏取りと同型）。
 *
 * フィクスチャは令和8年度公表PDF（`fukui-r8.pdf`・全2頁）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。2頁目は「定時制」セクション（y座標470以降）を除外済み。
 */
const FUKUI_LAYOUT: GeneralColumnLayout = {
  boundaries: [55, 68, 115, 225, 300, 340, 440, 475, 505],
  // 列: 番号(未使用),学校名,学科名,募集定員(A・未使用),一般選抜募集人員(=quota),
  //     2/9出願者数+取下げ+再出願(未使用まとめ),変更後第一志望出願者数(=finalApplicants),
  //     変更後第一志望倍率(=finalRate)
  roles: { schoolName: 1, department: 2, quota: 4, finalApplicants: 6, finalRate: 7 },
};

const FUKUI_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '足羽|普通キャリアデザイン': '普通（キャリアデザイン）',
  '足羽|多文化共生中国語・英語': '多文化共生（中国語・英語）',
  '足羽|多文化共生日本語': '多文化共生（日本語）',
  '丸岡|普通みらい共創': '普通（みらい共創）',
  '丸岡|普通スポーツ探究': '普通（スポーツ探究）',
  '鯖江|普通スタンダード': '普通（スタンダード）',
  '坂井|食農科学農業': '食農科学（農業）',
  '坂井|食農科学食品': '食農科学（食品）',
  '坂井|機械・自動車機械': '機械・自動車（機械）',
  '坂井|機械・自動車自動車': '機械・自動車（自動車）',
  '坂井|電気・情報システム電気': '電気・情報システム（電気）',
  '坂井|電気・情報システム情報システム': '電気・情報システム（情報システム）',
  '坂井|ビジネス・生活デザインビジネス': 'ビジネス・生活デザイン（ビジネス）',
  '坂井|ビジネス・生活デザイン生活デザイン': 'ビジネス・生活デザイン（生活デザイン）',
  '奥越明成|生活福祉生活': '生活福祉（生活）',
  '奥越明成|生活福祉福祉': '生活福祉（福祉）',
};

/**
 * 鯖江のくくり募集2件は、学科名の子コースラベルが数値行より先に複数個ぶん積み上がる
 * （「スポーツ」「健康福祉」の2ラベルの後に数値行が1つ、続けて「IT」「アートデザイン」の
 * 2ラベルの後に数値行が1つ）ため、pendingDepartmentsのFIFO消費だけでは正しい学科名に
 * 対応付けられない（数値自体は正しく抽出できることをquota/applicants一致で確認済み）。
 * 既存データ（一次収集時にpdftoppmビジョン解析で確定済み）の数値をキーに、学校名を明示的に
 * 上書きする。
 */
const SABAE_VALUE_OVERRIDES: Record<string, string> = {
  '14|14': '普通（スポーツ・健康福祉くくり募集）',
  '26|29': '普通（IT・アートデザインくくり募集）',
};

interface ClusteredRow {
  y: number;
  chars: PdfPageGeometry['chars'];
}

function groupRowsIntoBlocks(rows: ClusteredRow[], hlines: PdfPageGeometry['hlines'], fullLineX0Max: number): ClusteredRow[][] {
  const fullLines = hlines.filter((h) => h.x0 <= fullLineX0Max);
  const sorted = [...fullLines].sort((a, b) => a.y - b.y);
  const boundaries: number[] = [];
  for (const h of sorted) {
    if (boundaries.length && Math.abs(boundaries[boundaries.length - 1] - h.y) < 3.0) continue;
    boundaries.push(h.y);
  }
  const blocks: ClusteredRow[][] = Array.from({ length: Math.max(boundaries.length - 1, 0) }, () => []);
  for (const row of rows) {
    for (let i = 0; i < boundaries.length - 1; i++) {
      if (row.y >= boundaries[i] - 0.5 && row.y < boundaries[i + 1] - 0.5) {
        blocks[i].push(row);
        break;
      }
    }
  }
  return blocks.filter((b) => b.length > 0);
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (fukui R8 実データ検証)', () => {
  const geometries = fukuiR8Geometry as PdfPageGeometry[];

  const blocks = geometries.flatMap((geom) => {
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines, 75);
  });

  const parsed: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }[] = [];
  for (const block of blocks) {
    const fields = block.map((row) => extractRowFields(row.chars, FUKUI_LAYOUT));
    const schoolName = fields.map((f) => normalizeExtractedText(f.schoolName)).find((s) => s.length > 0) ?? '';
    if ((schoolName + fields.map((f) => f.department).join('')).includes('合計')) continue;

    const pendingDepartments: string[] = [];
    for (const f of fields) {
      const rawDept = normalizeExtractedText(f.department);
      const quota = Number(f.quotaText.replace(/,/g, ''));
      const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
      const finalRate = Number(f.rateText);
      const hasNumbers = Number.isFinite(quota) && quota > 0 && Number.isFinite(finalApplicants) && Number.isFinite(finalRate);
      if (!hasNumbers) {
        if (rawDept) pendingDepartments.push(rawDept);
        continue;
      }
      const resolvedRawDept = rawDept || pendingDepartments.shift() || '';
      if (!resolvedRawDept) continue;
      const sabaeValueOverride = schoolName === '鯖江' ? SABAE_VALUE_OVERRIDES[`${quota}|${finalApplicants}`] : undefined;
      const department = sabaeValueOverride ?? FUKUI_DEPARTMENT_OVERRIDES[`${schoolName}|${resolvedRawDept}`] ?? normalizeDepartmentText(resolvedRawDept);
      parsed.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }

  const expectedR8Records = FUKUI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（72件・24校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(72);
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

  test('高志「探究創造※2（内部進学枠）」は数値化できず自然に除外される', () => {
    expect(parsed.some((r) => r.schoolName === '高志' && r.department.includes('※2'))).toBe(false);
  });

  test('グランドトータル「合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 3316)).toBe(false);
  });
});
