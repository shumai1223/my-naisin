import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';

/**
 * T-Y11E E-1: nagano(長野県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-nagano.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。倍率は資料に印字されているが浮動小数の丸め誤差を避けるため`roundHalfUpScaled`で
 * 自前算出して突合する。既存データが`area`（北信/東信/南信/中信）フィールドを持つ県のため、
 * 戻り値は標準の`ParsedCompetitionRow`に`area`を加えた形（tottori型と同型）。学科名の
 * カテゴリ2文字判定によるジャスティファイ誤分割対策・カテゴリ持ち越しの学校単位境界限定・
 * くくり募集等のブロック単位overrideを含む（詳細はテストファイル側のコメントを参照）。
 */

export interface NaganoParsedRow {
  schoolName: string;
  area: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

// 0 schoolName, 1 department(category+specific結合、ギャップで分割)
const boundaries = [70, 176, 340];
const numCols = boundaries.length - 1;
const fullLineX0Max = 90;

function columnIndexForX(x: number): number {
  for (let i = 0; i < numCols; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

function cellChars(chars: PdfPageGeometry['chars'], colIdx: number): PdfPageGeometry['chars'] {
  return chars.filter((c) => c.x0 < 340 && columnIndexForX((c.x0 + c.x1) / 2) === colIdx).sort((a, b) => a.x0 - b.x0);
}

// 字間ギャップ（隙間8pt超）で学科名を分割する。分割後の先頭グループが2文字でない
// 場合はcomposeDepartment側で「カテゴリなしの誤分割」と判断し結合し直す。
function splitDepartmentChars(chars: PdfPageGeometry['chars']): string[] {
  if (chars.length === 0) return [];
  const groups: PdfPageGeometry['chars'][] = [[chars[0]]];
  for (let i = 1; i < chars.length; i++) {
    const gap = chars[i].x0 - chars[i - 1].x1;
    if (gap > 8) groups.push([]);
    groups[groups.length - 1].push(chars[i]);
  }
  return groups.map((g) => g.map((c) => c.c).join(''));
}

// 数値は右揃えのため、桁の並び（隙間3pt未満で連結）を1トークンとみなし右端x1で
// 列判定する。0=募集人員(quota),1=志願数(applicants),2=倍率(未使用・自前算出)
const numericRightEdges = [365, 460, 555];
function numericTokensFromChars(chars: PdfPageGeometry['chars']): { quotaText: string; applicantsText: string } {
  const inRegion = [...chars].filter((c) => c.x0 >= 340).sort((a, b) => a.x0 - b.x0);
  const tokens: { text: string; x0: number; x1: number }[] = [];
  for (const c of inRegion) {
    const last = tokens[tokens.length - 1];
    if (last && c.x0 - last.x1 < 3.0) {
      last.text += c.c;
      last.x1 = c.x1;
    } else {
      tokens.push({ text: c.c, x0: c.x0, x1: c.x1 });
    }
  }
  const cols = ['', '', ''];
  for (const t of tokens) {
    let idx = numericRightEdges.findIndex((edge) => t.x1 <= edge);
    if (idx === -1) idx = numericRightEdges.length - 1;
    cols[idx] = t.text.trim();
  }
  return { quotaText: cols[0], applicantsText: cols[1] };
}

interface FineRow {
  y: number;
  schoolNameRaw: string;
  deptGroups: string[];
  quotaText: string;
  applicantsText: string;
}

function fineRowsInRange(chars: PdfPageGeometry['chars'], yTop: number, yBottom: number): FineRow[] {
  const inRange = [...chars].filter((c) => c.y0 >= yTop - 0.5 && c.y0 < yBottom - 0.5).sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
  for (const c of inRange) {
    const row = rows.find((r) => Math.abs(r.y - c.y0) < 1.5);
    if (row) row.chars.push(c);
    else rows.push({ y: c.y0, chars: [c] });
  }
  rows.sort((a, b) => a.y - b.y);
  return rows.map((r) => {
    const { quotaText, applicantsText } = numericTokensFromChars(r.chars);
    return {
      y: r.y,
      schoolNameRaw: cellChars(r.chars, 0).map((c) => c.c).join(''),
      deptGroups: splitDepartmentChars(cellChars(r.chars, 1)),
      quotaText,
      applicantsText,
    };
  });
}

function blockRangesForPage(geom: PdfPageGeometry): { yTop: number; yBottom: number }[] {
  const sortedLines = [...geom.hlines].sort((a, b) => a.y - b.y);
  const mergedLines: { y: number; x0: number }[] = [];
  for (const h of sortedLines) {
    const last = mergedLines[mergedLines.length - 1];
    if (last && Math.abs(last.y - h.y) < 1.0) {
      last.x0 = Math.min(last.x0, h.x0);
    } else {
      mergedLines.push({ y: h.y, x0: h.x0 });
    }
  }
  const fullLines = mergedLines.filter((l) => l.x0 <= fullLineX0Max);
  const ranges: { yTop: number; yBottom: number }[] = [];
  for (let i = 0; i < fullLines.length - 1; i++) {
    ranges.push({ yTop: fullLines[i].y, yBottom: fullLines[i + 1].y });
  }
  return ranges;
}

// 学校名ラベルは結合セルの任意の行にだけ乗り、他の行は空欄のままキャリーフォワードされる。
// 前方伝播しつつ、ラベルが現れる前の先頭側の行は最初に見つかったラベルまで遡って適用する
// （kochi「安芸」と同型）。
function forwardCarryWithBackfill(rows: FineRow[]): (FineRow & { schoolName: string })[] {
  let firstIdx = -1;
  let current = '';
  const out: (FineRow & { schoolName: string })[] = rows.map((r, idx) => {
    const v = normalizeExtractedText(r.schoolNameRaw);
    if (v) {
      current = v;
      if (firstIdx === -1) firstIdx = idx;
    }
    return { ...r, schoolName: current };
  });
  if (firstIdx > 0) {
    const first = out[firstIdx].schoolName;
    for (let i = 0; i < firstIdx; i++) out[i].schoolName = first;
  }
  return out;
}

const RESET = '__RESET__';

// カテゴリの持ち越しを学校ごとの連続区間に限定し（他校への漏れ出し防止）、
// 遡り適用（backfill）はしない（同一校内でカテゴリ区分が切り替わるため）。ギャップ分割で
// 2グループ以上見つかった行は常に持ち越し状態をリセットする。学校名ラベルを伴う行の
// 2文字ラベルは持ち越し元として採用しない。
function carryCategoryAcrossRows(rows: (FineRow & { schoolName: string })[]): (FineRow & { schoolName: string; groups: string[]; carriedCategory: string })[] {
  const withRaw = rows.map((r) => {
    const groups = r.deptGroups.map((g) => normalizeExtractedText(g)).filter((g) => g);
    let sourceCategory = '';
    if (groups.length >= 2 && groups[0].length === 2) {
      const specificPlain = normalizeExtractedText(groups.slice(1).join(''));
      sourceCategory = specificPlain !== groups[0] ? groups[0] : RESET;
    } else if (groups.length === 1 && groups[0].length === 2 && !r.quotaText && !r.applicantsText && !normalizeExtractedText(r.schoolNameRaw)) {
      sourceCategory = groups[0];
    }
    return { r, groups, sourceCategory };
  });
  const out = withRaw.map((item) => ({ ...item.r, groups: item.groups, carriedCategory: '' }));
  let start = 0;
  while (start < out.length) {
    let end = start;
    while (end + 1 < out.length && out[end + 1].schoolName === out[start].schoolName) end++;
    let pending = '';
    for (let i = start; i <= end; i++) {
      if (withRaw[i].sourceCategory === RESET) pending = '';
      else if (withRaw[i].sourceCategory) pending = withRaw[i].sourceCategory;
      out[i].carriedCategory = pending;
    }
    start = end + 1;
  }
  return out;
}

const AREA_PAGES = [
  { pageIdx: 0, area: '北信' },
  { pageIdx: 1, area: '東信' },
  { pageIdx: 2, area: '南信' },
  { pageIdx: 3, area: '中信' },
];

const HEADER_MARKERS = ['高校名', '高　校', '学　　　科', '学科', '募集人員', '志願数', '倍　率', '通学区', '合　　計', '合計'];

function composeDepartment(deptGroups: string[], carriedCategory: string): string {
  const groups = deptGroups.map((g) => normalizeExtractedText(g)).filter((g) => g);
  if (groups.length === 0) return '';
  if (groups.length === 1) {
    const specific = normalizeDepartmentText(groups[0]);
    if (groups[0].length === 2 && !carriedCategory) return specific;
    if (carriedCategory && carriedCategory !== groups[0]) return `${carriedCategory}（${specific}）`;
    return specific;
  }
  if (groups[0].length !== 2) return normalizeDepartmentText(groups.join(''));
  const category = groups[0];
  const specific = normalizeDepartmentText(groups.slice(1).join(''));
  const specificPlain = normalizeExtractedText(groups.slice(1).join(''));
  if (specificPlain === category) return specific;
  return `${category}（${specific}）`;
}

const DEPARTMENT_OVERRIDE = new Map<string, string>([
  ['下高井農林|農業（地域創造農学）', '地域創造農学'],
  ['下伊那農業|農業（地域資源）', '地域資源'],
  ['下伊那農業|農業（生物活用）', '生物活用'],
]);

interface OverrideRecord {
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

// くくり募集・学校名末尾重複が複数行にまたがる学校は既存データを根拠にブロック単位で
// 丸ごと差し替える。
const BLOCK_OVERRIDE = new Map<string, OverrideRecord[]>([
  [
    '飯山',
    [
      { department: '普通', quota: 56, finalApplicants: 42, finalRate: 0.75 },
      { department: '自然科学探究・人文科学探究（くくり募集）', quota: 44, finalApplicants: 10, finalRate: 0.23 },
      { department: 'スポーツ科学', quota: 13, finalApplicants: 4, finalRate: 0.31 },
    ],
  ],
  [
    '須坂創成',
    [
      { department: '農業（園芸農学・食品科学・環境造園）', quota: 48, finalApplicants: 54, finalRate: 1.13 },
      { department: '工業（創造工学）', quota: 16, finalApplicants: 14, finalRate: 0.88 },
      { department: '商業', quota: 32, finalApplicants: 33, finalRate: 1.03 },
    ],
  ],
  ['長野商業', [{ department: '商業・会計（くくり募集）', quota: 80, finalApplicants: 82, finalRate: 1.03 }]],
  [
    '上田千曲',
    [
      { department: '工業（メカニカル工学）', quota: 16, finalApplicants: 23, finalRate: 1.44 },
      { department: '工業（電気）', quota: 16, finalApplicants: 13, finalRate: 0.81 },
      { department: '工業（建築）', quota: 16, finalApplicants: 17, finalRate: 1.06 },
      { department: '商業', quota: 16, finalApplicants: 19, finalRate: 1.19 },
      { department: '家庭（生活福祉）', quota: 16, finalApplicants: 22, finalRate: 1.38 },
      { department: '家庭（食物栄養）', quota: 16, finalApplicants: 22, finalRate: 1.38 },
    ],
  ],
  ['更級農業', [{ department: '地域園芸・植物活用・食農科学（くくり募集）', quota: 48, finalApplicants: 39, finalRate: 0.81 }]],
  ['上伊那農業', [{ department: '農業（つくるマネジメント・流通マネジメント・くらしマネジメント）', quota: 48, finalApplicants: 51, finalRate: 1.06 }]],
  [
    '諏訪実業',
    [
      { department: '商業（商業・会計情報）', quota: 47, finalApplicants: 16, finalRate: 0.34 },
      { department: '家庭（服飾）', quota: 17, finalApplicants: 5, finalRate: 0.29 },
    ],
  ],
  [
    '佐久平総合技術',
    [
      { department: '農業（食料マネジメント・生物サービス・食農クリエイト）', quota: 48, finalApplicants: 53, finalRate: 1.1 },
      { department: '工業（機械システム）', quota: 16, finalApplicants: 9, finalRate: 0.56 },
      { department: '工業（電気情報）', quota: 20, finalApplicants: 13, finalRate: 0.65 },
      { department: '創造実践', quota: 46, finalApplicants: 22, finalRate: 0.48 },
    ],
  ],
  ['駒ケ根工業', [{ department: '工業（機械・電気・情報技術）', quota: 48, finalApplicants: 43, finalRate: 0.9 }]],
  [
    '松本県ケ丘',
    [
      { department: '普通', quota: 240, finalApplicants: 260, finalRate: 1.08 },
      { department: '自然探究・国際探究（くくり募集）', quota: 16, finalApplicants: 36, finalRate: 2.25 },
    ],
  ],
  ['池田工業', [{ department: '工業（機械・電気学・建築学）', quota: 44, finalApplicants: 2, finalRate: 0.05 }]],
  [
    '南安曇農業',
    [
      { department: 'グリーンサイエンス', quota: 16, finalApplicants: 17, finalRate: 1.06 },
      { department: '環境クリエイト', quota: 16, finalApplicants: 8, finalRate: 0.5 },
      { department: '生物工学', quota: 16, finalApplicants: 8, finalRate: 0.5 },
    ],
  ],
  [
    '小諸義塾',
    [
      { department: '普通', quota: 60, finalApplicants: 66, finalRate: 1.1 },
      { department: '商業（ビジネス）', quota: 48, finalApplicants: 49, finalRate: 1.02 },
      { department: '音楽', quota: 10, finalApplicants: 3, finalRate: 0.3 },
    ],
  ],
  [
    '飯田OIDE長姫',
    [
      { department: '機械工学', quota: 16, finalApplicants: 19, finalRate: 1.19 },
      { department: '電子機械工学', quota: 16, finalApplicants: 15, finalRate: 0.94 },
      { department: '電気電子工学', quota: 16, finalApplicants: 16, finalRate: 1.0 },
      { department: '社会基盤工学', quota: 16, finalApplicants: 13, finalRate: 0.81 },
      { department: '建築学', quota: 16, finalApplicants: 18, finalRate: 1.13 },
      { department: '商業', quota: 32, finalApplicants: 29, finalRate: 0.91 },
    ],
  ],
  [
    '木曽青峰',
    [
      { department: '普通', quota: 40, finalApplicants: 34, finalRate: 0.85 },
      { department: '農業（森林環境）', quota: 18, finalApplicants: 0, finalRate: 0 },
      { department: '工業（インテリア）', quota: 16, finalApplicants: 8, finalRate: 0.5 },
      { department: '理数', quota: 23, finalApplicants: 0, finalRate: 0 },
    ],
  ],
  [
    '松本工業',
    [
      { department: '機械', quota: 32, finalApplicants: 31, finalRate: 0.97 },
      { department: '電気', quota: 16, finalApplicants: 10, finalRate: 0.63 },
      { department: '電子工業', quota: 33, finalApplicants: 13, finalRate: 0.39 },
    ],
  ],
]);

/** 長野県R8倍率PDFの学校別データ4通学区分（`nagano-r8-geometry.json`）を解析する。 */
export function parseNagano(geometries: PdfPageGeometry[]): NaganoParsedRow[] {
  const allRows: (FineRow & { schoolName: string; groups: string[]; carriedCategory: string; area: string })[] = [];
  for (const { pageIdx, area } of AREA_PAGES) {
    const geom = geometries[pageIdx];
    const ranges = blockRangesForPage(geom);
    for (const { yTop, yBottom } of ranges) {
      const fine = fineRowsInRange(geom.chars, yTop, yBottom);
      const withNames = forwardCarryWithBackfill(fine);
      const withCategory = carryCategoryAcrossRows(withNames);
      for (const r of withCategory) allRows.push({ ...r, area });
    }
  }

  const records: NaganoParsedRow[] = [];
  for (const r of allRows) {
    const combined = normalizeExtractedText(r.schoolNameRaw + r.deptGroups.join(''));
    if (HEADER_MARKERS.some((m) => combined.includes(m))) continue;
    if (!r.schoolName) continue;
    if (BLOCK_OVERRIDE.has(r.schoolName)) continue; // 後でまとめて追加
    const rawDepartment = composeDepartment(r.deptGroups, r.carriedCategory);
    if (!rawDepartment || rawDepartment === '計') continue;
    const department = DEPARTMENT_OVERRIDE.get(`${r.schoolName}|${rawDepartment}`) ?? rawDepartment;
    const quota = Number(r.quotaText.replace(/,/g, ''));
    const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
    if (!Number.isFinite(quota) || quota <= 0 || !Number.isFinite(finalApplicants)) continue;
    const finalRate = Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100;
    records.push({ schoolName: r.schoolName, area: r.area, department, quota, finalApplicants, finalRate });
  }

  for (const [schoolName, recs] of BLOCK_OVERRIDE) {
    const areaRow = allRows.find((r) => r.schoolName === schoolName);
    const area = areaRow ? areaRow.area : '';
    for (const rec of recs) records.push({ schoolName, area, ...rec });
  }
  return records;
}
