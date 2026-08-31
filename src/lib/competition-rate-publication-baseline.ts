/**
 * T-Y11 A-1: 47都道府県の倍率「公表ソース台帳」。
 *
 * `ops/tasks/T-Y11-winter-bairitsu-pipeline.md` A-1の1つ目のチェックボックス
 * （一次ソースURL・公表形式(PDF/xlsx/HTML)を機械的に抽出して台帳化する）に対応する。
 *
 * 台帳を別ファイルに複製すると、来年R9データが追加された時に更新を忘れてズレる
 * （N1-2/T-A1で繰り返し起きた「古い年度のまま放置」と同型のリスク）。そのため
 * `COMPETITION_RATE_BY_PREFECTURE`（各県ファイルの`sources[]`＝既に1データ点1出典で
 * 管理されている一次ソース）から**実行時に導出する**設計にした。年度が進んでも
 * このモジュールは無改修で最新年度を追従する。
 *
 * ⚠️ 抽出できないもの（`CompetitionRateSource`型に無い情報）は`unresolved`に正直に書く。
 * 埋めない（Y-0憲法③）。公表日（発表日そのもの。fetchedAtはこちらが取得した日でしかない）は
 * `competition-rate-publication-notes.ts`の手作業台帳に既存ヘッダコメントの記述がある県のみ
 * `publishedAt`へ入る（2026-09-01時点で5/47県）。速報版/確定版の区別は`docTitle`に「速報」
 * 「最終」「確定」「変更後」等の語があるかで機械判定する（`classifyFinality()`）。
 * ⚠️2026-09-01判明: `ops/tasks/T-Y11-winter-bairitsu-pipeline.md`が例示していた
 * 「埼玉は令和8年度が速報版」という記述は誤りだった。実際のsaitama.tsのdocTitleはR5〜R8
 * 全て「入学志願確定者数」で統一されており速報表記は無い（実データを見ずに書かれた説明だった
 * ため、タスクファイル側を訂正した）。**この教訓のとおり、この種の判定は必ずdocTitle文字列を
 * 直接見て機械判定し、プローズの記憶に頼らないこと。**
 * PDF内の列構成は、現状docTitleの自然文からしか読み取れずまだ台帳化していないため
 * `unresolved`に残る。A-1の残りのチェックボックスは、この台帳を読みながら1県ずつ目視で
 * 埋めていく別作業として残る。
 */
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import type { CompetitionRateSource } from '@/lib/competition-rate';
import { PUBLICATION_TIMING_NOTES } from '@/lib/competition-rate-publication-notes';

export type PublicationFormat = 'pdf' | 'xlsx' | 'csv' | 'html' | 'unknown';
export type FinalityLabel = 'preliminary' | 'final' | 'unknown';

export interface CompetitionRatePublicationBaselineEntry {
  prefecture: string;
  /** そのプレフェクチャで`sources[]`に登場する最新の会計年度ラベル（例: '令和8年度（2026年度）'）。 */
  latestFiscalYear: string;
  /** 最新年度の公表資料のうち、ホストが`.lg.jp`/`.go.jp`/`.ed.jp`の一次ソースのみ。 */
  officialSources: CompetitionRateSource[];
  /** 最新年度の資料のうち一次ソース以外（裏取り用の商用サイト等）の件数。 */
  supplementarySourceCount: number;
  /** `officialSources`のURLから推定した公表形式（重複除く）。 */
  formats: PublicationFormat[];
  /**
   * 公表日（発表日そのもの）。`competition-rate-publication-notes.ts`に手作業台帳がある県のみ
   * 判明した精度のまま入る。無ければ`null`（推測しない）。
   */
  publishedAt: string | null;
  /**
   * 速報版/確定版の区別。`officialSources`の`docTitle`に「速報」「最終」「確定」「変更後」等の
   * 語があるかで機械判定する（`classifyFinality()`）。複数ソースで判定が割れた場合は
   * `'unknown'`にする（数字を合わせにいかない・A-4と同じ思想）。
   */
  finality: FinalityLabel;
  /** このモジュールでは埋められない項目（次に1県ずつ埋める作業のTODOリスト）。 */
  unresolved: string[];
}

const PRELIMINARY_KEYWORDS = ['速報'];
const FINAL_KEYWORDS = ['最終', '確定', '変更後'];

/** `docTitle`の語彙から速報/確定を機械判定する。どちらの語も無ければ`'unknown'`。 */
export function classifyFinality(docTitle: string): FinalityLabel {
  const hasPreliminary = PRELIMINARY_KEYWORDS.some((k) => docTitle.includes(k));
  const hasFinal = FINAL_KEYWORDS.some((k) => docTitle.includes(k));
  if (hasPreliminary && !hasFinal) return 'preliminary';
  if (hasFinal && !hasPreliminary) return 'final';
  return 'unknown';
}

const OFFICIAL_TLD_RE = /\.(lg|go|ed)\.jp$/i;
/** `pref.<name>.jp` は`.lg.jp`移行前からの都道府県公式ドメインの旧来表記（愛知・岩手・宮城等で現役）。 */
const PREF_DOMAIN_RE = /(^|\.)pref\.[^.]+\.jp$/i;
/**
 * 上記パターンに当てはまらないが実際は一次ソースと確認済みの例外ドメイン。
 * 追加するときは必ず一次ソースであることを確認した根拠をコメントに残す。
 */
const KNOWN_OFFICIAL_HOST_ALLOWLIST = new Set<string>([
  // 京都府教育委員会の公式サイト。.lg.jp/.ed.jpでも`pref.`表記でもないが、
  // kyoto.tsのsourceUrlとして既存採用されている一次ソースドメイン（2026-09-01確認）。
  'www.kyoto-be.ne.jp',
]);

export function isOfficialUrl(url: string): boolean {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return OFFICIAL_TLD_RE.test(hostname) || PREF_DOMAIN_RE.test(hostname) || KNOWN_OFFICIAL_HOST_ALLOWLIST.has(hostname);
}

export function inferPublicationFormat(url: string): PublicationFormat {
  let path: string;
  try {
    path = new URL(url).pathname.toLowerCase();
  } catch {
    return 'unknown';
  }
  if (path.endsWith('.pdf')) return 'pdf';
  if (path.endsWith('.xlsx') || path.endsWith('.xls')) return 'xlsx';
  if (path.endsWith('.csv')) return 'csv';
  if (path.endsWith('.html') || path.endsWith('.htm') || path === '' || path === '/') return 'html';
  // 拡張子なしURL（例: 東京都・愛媛県のCMSがPDFを拡張子なしで配信する既知パターン）は
  // 確認済みの個別ケース以外、機械的には判定不能として正直に unknown を返す。
  return 'unknown';
}

/** fiscalYearラベルに含まれる西暦4桁を抽出する。無ければ0（最古扱い）。 */
function westernYearOf(fiscalYear: string): number {
  const m = fiscalYear.match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
}

export function buildCompetitionRatePublicationBaseline(): CompetitionRatePublicationBaselineEntry[] {
  const entries: CompetitionRatePublicationBaselineEntry[] = [];

  for (const [prefecture, file] of Object.entries(COMPETITION_RATE_BY_PREFECTURE)) {
    if (!file || file.sources.length === 0) continue;

    const latestYear = Math.max(...file.sources.map((s) => westernYearOf(s.fiscalYear)));
    const latestYearSources = file.sources.filter((s) => westernYearOf(s.fiscalYear) === latestYear);
    const latestFiscalYear = latestYearSources[0]?.fiscalYear ?? '不明';

    const officialSources = latestYearSources.filter((s) => isOfficialUrl(s.url));
    const supplementarySourceCount = latestYearSources.length - officialSources.length;

    const formats = Array.from(new Set(officialSources.map((s) => inferPublicationFormat(s.url))));

    const timingNote = PUBLICATION_TIMING_NOTES[prefecture];
    const publishedAt = timingNote?.publishedAt ?? null;

    const finalityLabels = new Set(officialSources.map((s) => classifyFinality(s.docTitle)).filter((f) => f !== 'unknown'));
    const finality: FinalityLabel = finalityLabels.size === 1 ? ([...finalityLabels][0] as FinalityLabel) : 'unknown';

    const unresolved: string[] = [];
    if (!timingNote) {
      unresolved.push('公表日（発表日そのもの）は未抽出。fetchedAtは取得日であり公表日ではない');
    }
    if (finality === 'unknown') {
      unresolved.push('速報版/確定版の区別は未抽出（docTitleに速報/最終/確定/変更後のいずれの語も無い、または複数ソースで判定が割れた）');
    }
    unresolved.push('列構成（募集人員/入学許可予定者数/志願者数等の内訳）は未抽出');
    if (officialSources.length === 0) {
      unresolved.unshift('一次ソース（.lg.jp/.go.jp/.ed.jp）のURLが見つからない（第三者サイト経由のみ）');
    }
    if (formats.includes('unknown')) {
      unresolved.push('一部URLの公表形式（拡張子なし等）を機械判定できていない');
    }

    entries.push({
      prefecture,
      latestFiscalYear,
      officialSources,
      supplementarySourceCount,
      formats,
      publishedAt,
      finality,
      unresolved,
    });
  }

  return entries.sort((a, b) => a.prefecture.localeCompare(b.prefecture));
}
