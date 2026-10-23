/**
 * T-PV2 A-4: 新年度（令和9年度）の倍率を「年度送りなし」で本番データに合成するオーバーレイ。
 *
 * 背景（ops/baselines/t-pv2-rehearsal-2026-10-23.md F2）: 現行の規約は
 * 「fiscalYear の無いレコード＝今季、sources[0]＝今季」。令和9年度を載せるために令和8年度の
 * 全レコードへ fiscalYear を書き足す「年度送り」をすると、「無印＝令和8年度」を前提にした
 * 約88本のテストが一斉に赤くなる。そこで新年度は別ファイル（src/data/competition-rates-next/<県>.ts）に
 * 置き、読み込み口（src/data/competition-rates/index.ts）でだけ合成する。
 *
 * - 新年度ファイルが無い県は、これまでと完全に同じ（合成しない）。
 * - 合成後は「新年度＝今季（無印・sources[0]）」「旧今季＝fiscalYear を付けた前年度」になるので、
 *   学校ページ・API・MCP・前年比の既存ロジックはそのまま動く。
 * - 元のファイル（令和8年度）は1文字も書き換えない。外せば元に戻る。
 */
import type { CompetitionRateRecord, PrefectureCompetitionRateFile } from './competition-rate';
import { isPublicationRefused } from './publication-refused-prefectures';

export const NEXT_YEAR_LABEL_PREFIX = '令和9年度';

/** 新年度ファイルの形式チェック。問題の説明を返す（空配列なら合格）。 */
export function validateNextYearFile(next: PrefectureCompetitionRateFile): string[] {
  const problems: string[] = [];
  const head = next.sources[0];
  if (!head) {
    problems.push('sources が空');
    return problems;
  }
  if (!head.fiscalYear.startsWith(NEXT_YEAR_LABEL_PREFIX)) {
    problems.push(`sources[0].fiscalYear が「${NEXT_YEAR_LABEL_PREFIX}」で始まらない: ${head.fiscalYear}`);
  }
  if (!/^https:\/\/[^/]*(\.lg\.jp|\.ed\.jp|\.go\.jp|pref\.[^/]+\.jp|\.metro\.tokyo\.jp)\//i.test(head.url)) {
    problems.push(`sources[0].url が公的機関のドメインに見えない: ${head.url}`);
  }
  if (!head.pdfSha256) problems.push('sources[0].pdfSha256 が無い（取得したPDFを後から特定できない）');
  if (next.records.length === 0) problems.push('records が空');
  const tagged = next.records.filter((r) => r.fiscalYear !== undefined || r.sourceIndex !== undefined);
  if (tagged.length > 0) {
    problems.push(`新年度ファイルのレコードに fiscalYear / sourceIndex が付いている（${tagged.length}件）。今季は無印で持つ`);
  }
  if (isPublicationRefused(next.prefectureCode)) {
    problems.push(`${next.prefectureCode} は掲載を断られた県`);
  }
  const sumQ = next.records.reduce((a, r) => a + r.quota, 0);
  const sumA = next.records.reduce((a, r) => a + r.finalApplicants, 0);
  if (next.officialSubtotals.length === 0) {
    problems.push('officialSubtotals が空（資料の合計行との突合ができない）');
  } else if (!next.officialSubtotals.some((s) => s.quota === sumQ && s.finalApplicants === sumA)) {
    problems.push(`records の合計(募集${sumQ}/志願${sumA})が officialSubtotals のどれとも一致しない`);
  }
  return problems;
}

/**
 * 旧ファイル（base）に新年度ファイル（next）を重ねる。
 * 返り値は「新年度が今季」の PrefectureCompetitionRateFile。base / next は変更しない。
 */
export function applyNextYearOverlay(
  base: PrefectureCompetitionRateFile,
  next: PrefectureCompetitionRateFile
): PrefectureCompetitionRateFile {
  if (base.prefectureCode !== next.prefectureCode) {
    throw new Error(`県コードが違う: base=${base.prefectureCode} next=${next.prefectureCode}`);
  }
  const baseYear = base.sources[0]?.fiscalYear;
  const nextYear = next.sources[0]?.fiscalYear;
  if (!baseYear || !nextYear) throw new Error(`${base.prefectureCode}: sources[0].fiscalYear が無い`);
  if (nextYear === baseYear) throw new Error(`${base.prefectureCode}: 新年度と旧年度のラベルが同じ（${nextYear}）`);
  if (base.sources.some((s) => s.fiscalYear === nextYear)) {
    throw new Error(`${base.prefectureCode}: ${nextYear} は旧ファイルに既にある`);
  }

  // sourceIndex は sources 配列の添字。先頭に next.sources を足すので、旧レコードの添字をずらす。
  const shift = next.sources.length;
  const demoted: CompetitionRateRecord[] = base.records.map((r) => ({
    ...r,
    fiscalYear: r.fiscalYear ?? baseYear,
    ...(r.sourceIndex !== undefined ? { sourceIndex: r.sourceIndex + shift } : {}),
  }));

  return {
    prefectureCode: base.prefectureCode,
    sources: [...next.sources, ...base.sources],
    coverage: next.coverage,
    officialSubtotals: next.officialSubtotals,
    records: [...next.records, ...demoted],
  };
}

/** 県コード→ファイルのマップに、新年度ファイルがある県だけオーバーレイをかける。 */
export function mergeNextYearOverlays(
  baseByPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>>,
  nextByPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>>
): Partial<Record<string, PrefectureCompetitionRateFile>> {
  const out: Partial<Record<string, PrefectureCompetitionRateFile>> = { ...baseByPrefecture };
  for (const [code, next] of Object.entries(nextByPrefecture)) {
    if (!next) continue;
    const base = baseByPrefecture[code];
    if (!base) throw new Error(`${code}: 旧ファイルが無い県には重ねられない`);
    out[code] = applyNextYearOverlay(base, next);
  }
  return out;
}
