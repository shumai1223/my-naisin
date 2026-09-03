import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';
import { YAMAGATA_COMPETITION_RATES } from '@/data/competition-rates/yamagata';
import yamagataR8Geometry from '../__fixtures__/yamagata-r8-geometry.json';

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
 */

// 0 NO(未使用), 1 schoolName, 2 category(タイト詰め2文字ゾーン), 3 specific(具体名)
const boundaries = [50, 70, 196, 226, 390];
const numCols = boundaries.length - 1;
const fullLineX0Max = 65;

function columnIndexForX(x: number): number {
  for (let i = 0; i < numCols; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

function cellTextFromChars(chars: PdfPageGeometry['chars'], colIdx: number): string {
  const inCol = chars.filter((c) => c.x0 < 390 && columnIndexForX((c.x0 + c.x1) / 2) === colIdx);
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
}

// 数値は右揃えのため、桁の並び（隙間3pt未満で連結）を1トークンとみなし右端x1で列判定する
// （kochiで確立した技法）。0=入学定員(未使用),1=前期選抜内定者数等(未使用),2=quota,
// 3=applicants,4=rate(未使用・自前算出)
const numericRightEdges = [410, 475, 535, 600, 660];
function numericTokensFromChars(chars: PdfPageGeometry['chars']): { quotaText: string; applicantsText: string } {
  const inRegion = [...chars].filter((c) => c.x0 >= 390).sort((a, b) => a.x0 - b.x0);
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
  const cols = ['', '', '', '', ''];
  for (const t of tokens) {
    let idx = numericRightEdges.findIndex((edge) => t.x1 <= edge);
    if (idx === -1) idx = numericRightEdges.length - 1;
    cols[idx] = t.text.trim();
  }
  return { quotaText: cols[2], applicantsText: cols[3] };
}

interface FineRow {
  y: number;
  schoolNameRaw: string;
  categoryRaw: string;
  specificRaw: string;
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
      schoolNameRaw: cellTextFromChars(r.chars, 1),
      categoryRaw: cellTextFromChars(r.chars, 2),
      specificRaw: cellTextFromChars(r.chars, 3),
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

// 学校名列は結合セルの任意の行にだけラベルが乗り、他の行は空欄のままキャリーフォワードされる。
// 前方伝播しつつ、ラベルが現れる前の先頭側の行は最初に見つかったラベルまで遡って適用する
// （kochi「安芸」と同型）。
function forwardCarryWithBackfill<T extends Record<string, unknown>>(rows: T[], rawKey: keyof T, outKey: string): (T & { [k: string]: string })[] {
  let firstIdx = -1;
  let current = '';
  const out = rows.map((r, idx) => {
    const v = normalizeExtractedText(String(r[rawKey]));
    if (v) {
      current = v;
      if (firstIdx === -1) firstIdx = idx;
    }
    return { ...r, [outKey]: current } as T & { [k: string]: string };
  });
  if (firstIdx > 0) {
    const first = out[firstIdx][outKey];
    for (let i = 0; i < firstIdx; i++) out[i][outKey] = first;
  }
  return out;
}

// 罠1: カテゴリ列は「持ち越し専用ラベル行」（category有り・specific無し・数値も無し）と
// 「行内完結の重複」（同じ行にcategory・specific・数値が同居）の2種類がある。前者だけを
// 後続行へキャリーフォワードし、後者はその行だけに閉じることで区別する。
function carryCategoryLabelOnly(rows: (FineRow & { schoolName: string })[]): (FineRow & { schoolName: string; category: string; isLabelOnly: boolean })[] {
  let pending = '';
  let firstLabelIdx = -1;
  const out = rows.map((r, idx) => {
    const category = normalizeExtractedText(r.categoryRaw);
    const specific = normalizeExtractedText(r.specificRaw);
    const isLabelOnly = Boolean(category) && !specific && !r.quotaText && !r.applicantsText;
    if (isLabelOnly) {
      pending = category;
      if (firstLabelIdx === -1) firstLabelIdx = idx;
      return { ...r, category, isLabelOnly: true };
    }
    return { ...r, category: category || pending, isLabelOnly: false };
  });
  if (firstLabelIdx > 0) {
    const first = out[firstLabelIdx].category;
    for (let i = 0; i < firstLabelIdx; i++) {
      if (!normalizeExtractedText(out[i].categoryRaw)) out[i].category = first;
    }
  }
  return out;
}

function composeDepartment(categoryRaw: string, specificRaw: string): string {
  const category = normalizeExtractedText(categoryRaw);
  const specificPlain = normalizeExtractedText(specificRaw);
  const specific = normalizeDepartmentText(specificRaw);
  if (!specific) return category;
  if (!category) return specific;
  // 罠2: 具体名列が既にカテゴリと同じ文字で始まる場合（置賜農業「農業資源活用」等）は、
  // カテゴリ自体が具体名の先頭部分と重複しているだけなので具体名側をそのまま採用する。
  if (specificPlain === category || specificPlain.startsWith(category)) return specific;
  return category + specific;
}

// 罠2: 業種を表す学校名の学校（○○工業・○○商業等）はcategoryが具体名と無関係な冗長ラベルに
// なるため値ベースoverrideで対応する（キーは学校名|composeDepartmentの生出力）。
const DEPARTMENT_OVERRIDE = new Map<string, string>([
  ['山形工業|工業情報技術', '情報技術'],
  ['山形東|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['新庄志誠館|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['米沢興譲館|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['酒田東|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['寒河江工業|工業ロボットエンジニア', 'ロボットエンジニア'],
  ['寒河江工業|工業ＩＴエンジニア', 'ITエンジニア'],
  ['村山産業|商業流通ビジネス', '流通ビジネス'],
  ['新庄神室産業|商業ビジネス創造', 'ビジネス創造'],
  ['米沢鶴城|工業電気情報', '電気情報'],
  ['米沢鶴城|商業総合ビジネス・会計情報', '総合ビジネス・会計情報'],
  ['長井工業|工業電子', '電子'],
  ['鶴岡工業|工業情報通信', '情報通信'],
  ['加茂水産|水産水産', '水産'],
  ['酒田光陵|工業電気電子', '電気電子'],
  ['山形市立商業|商業情報', '情報'],
  ['寒河江工業|ＩＴエンジニア', 'ITエンジニア'],
  ['村山産業|農業みどり活用', 'みどり活用'],
  ['村山産業|農業機械', '機械'],
  ['村山産業|工業電子情報', '電子情報'],
  ['新庄神室産業|農業食料生産', '食料生産'],
  ['新庄神室産業|農業農産活用', '農産活用'],
  ['新庄神室産業|農業機械電気', '機械電気'],
  ['新庄神室産業|工業環境デザイン', '環境デザイン'],
  ['置賜農業|農業食料生産経営', '食料生産経営'],
  ['庄内農業|農業食料生産', '食料生産'],
  ['庄内農業|農業食品科学', '食品科学'],
  ['酒田光陵|商業機械制御', '機械制御'],
  ['酒田光陵|商業環境技術', '環境技術'],
  ['酒田光陵|商業ビジネス流通', 'ビジネス流通'],
  ['酒田光陵|商業ビジネス会計', 'ビジネス会計'],
]);

// 罠4: 数値だけの行が前の学校名を誤って引き継ぎ、直後に現れる真の学校名（真室川校）より前の
// 学校名（金山校）に誤帰属することがある。個別renameで対応する。
const SCHOOL_RENAME_ON_VALUE = new Map<string, string>([['新庄神室産業金山校|36|2', '新庄神室産業真室川校']]);

const HEADER_MARKERS = ['学校名', '学科名', '入学定員', '募集人員', '志願者数', '志願倍率', '前期', '連携型', '併設型', '内定者数', '入学予定者数', '合計', '注)', '注１', '注２'];

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function parseAllPages(geometries: PdfPageGeometry[]): ParsedRow[] {
  const allRows: (FineRow & { schoolName: string; category: string; isLabelOnly: boolean })[] = [];
  for (const geom of geometries) {
    const ranges = blockRangesForPage(geom);
    for (const { yTop, yBottom } of ranges) {
      const fine = fineRowsInRange(geom.chars, yTop, yBottom);
      const withNames = forwardCarryWithBackfill(fine, 'schoolNameRaw', 'schoolName') as (FineRow & { schoolName: string })[];
      const withCategory = carryCategoryLabelOnly(withNames);
      for (const r of withCategory) allRows.push(r);
    }
  }

  // 罠5: 【定時制の課程】の見出しはブロック外（表タイトル）のため通常走査では検出できず、
  // このページ自体（ページ4=定時制専用）を呼び出し側で除外する前提とする。

  const records: ParsedRow[] = [];
  for (const r of allRows) {
    const combined = normalizeExtractedText(r.schoolNameRaw + r.categoryRaw + r.specificRaw);
    if (HEADER_MARKERS.some((m) => combined.includes(m))) continue;
    if (!r.schoolName) continue;
    if (r.isLabelOnly) continue;
    const rawDepartment = composeDepartment(r.category, r.specificRaw);
    if (!rawDepartment || rawDepartment === '計') continue;
    // 罠3: 学科名と数値列の間に混入する孤立した脚注数字を末尾から除去する。
    const cleanedDepartment = rawDepartment.replace(/[0-9０-９]+$/, '');
    const department = DEPARTMENT_OVERRIDE.get(`${r.schoolName}|${cleanedDepartment}`) ?? cleanedDepartment;
    const quota = Number(r.quotaText.replace(/,/g, ''));
    const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
    if (!Number.isFinite(quota) || quota <= 0 || !Number.isFinite(finalApplicants)) continue;
    const schoolName = SCHOOL_RENAME_ON_VALUE.get(`${r.schoolName}|${quota}|${finalApplicants}`) ?? r.schoolName;
    const finalRate = Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100;
    records.push({ schoolName, department, quota, finalApplicants, finalRate });
  }
  return records;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (yamagata R8 実データ検証・カテゴリ持ち越しラベルと行内完結重複の判別)', () => {
  // ページ0は表紙、ページ4は【定時制の課程】専用のためスコープ外（fixtureにはページ1-3のみ収録）。
  const geometries = yamagataR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
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
