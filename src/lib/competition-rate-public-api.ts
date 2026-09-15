/**
 * T-S13A A-2: 倍率データバンクのセルフサーブ配布API — 純関数群。
 *
 * `obunsha-poc-export.ts`（47都道府県・licensableRecords適用済み）から、さらに
 * `redistributableOkPrefectures()`（教委が「出典明記で掲載差し支えない」と回答済みの10県）
 * だけを取り出す。`/api/schools/{pref}`（Business+キー限定・全47都道府県）とは別の、
 * 匿名・低ティアでも呼べる公開データ商品として設計する（G3「新規indexページを生まない」・
 * G5「匿名化比較で勝つ」に対応する層）。
 */
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import type { PrefectureCompetitionRateFile } from './competition-rate';
import { redistributableOkPrefectures } from './data-license-ledger';
import { buildFullExportRecords, toCsv, type ObunshaPocRecord } from './obunsha-poc-export';
import { getPrefectureByCode } from './prefectures';
import { SITE_URL } from './naishin-dataset';

/** COMPETITION_RATE_BY_PREFECTUREを`redistribution: 'ok'`の県だけに絞り込む。 */
function redistributableByPrefecture(
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
): Partial<Record<string, PrefectureCompetitionRateFile>> {
  const ok = new Set(redistributableOkPrefectures());
  return Object.fromEntries(Object.entries(byPrefecture).filter(([code]) => ok.has(code)));
}

/** 再配布許諾済み県のみのフラットレコード配列（1行=1校1学科1年度）。 */
export function redistributableExportRecords(
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
): ObunshaPocRecord[] {
  return buildFullExportRecords(redistributableByPrefecture(byPrefecture));
}

/** CSV配布用（GET /api/competition-rates/csv）。 */
export function buildCompetitionRatesCsv(
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
): string {
  return toCsv(redistributableExportRecords(byPrefecture));
}

export interface CompetitionRatesIndexEntry {
  prefectureCode: string;
  prefectureName: string;
  recordCount: number;
  fiscalYears: string[];
  apiUrl: string;
}

/** インデックス（GET /api/competition-rates）用の県別サマリー。 */
export function buildCompetitionRatesIndex(
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
) {
  const records = redistributableExportRecords(byPrefecture);
  const recordsByPref = new Map<string, ObunshaPocRecord[]>();
  for (const r of records) {
    const list = recordsByPref.get(r.prefectureCode) ?? [];
    list.push(r);
    recordsByPref.set(r.prefectureCode, list);
  }

  const prefectures: CompetitionRatesIndexEntry[] = redistributableOkPrefectures()
    .slice()
    .sort()
    .map((code) => {
      const list = recordsByPref.get(code) ?? [];
      return {
        prefectureCode: code,
        prefectureName: getPrefectureByCode(code)?.name ?? code,
        recordCount: list.length,
        fiscalYears: [...new Set(list.map((r) => r.fiscalYear))].filter((y) => y !== '').sort(),
        apiUrl: `${SITE_URL}/api/competition-rates/${code}`,
      };
    });

  return {
    meta: {
      title: '公立高校入試 学校別競争率データバンク（再配布許諾済み都道府県）',
      description:
        '各都道府県教育委員会が「出典明記のうえ掲載して差し支えない」と個別に回答した都道府県のみを収録。' +
        '商用第三者資料のみを唯一の出典とするレコードは配布ポリシーにより除外済み（licensableRecords）。',
      license: '出典明記で商用利用可。利用条件・ティア別クォータは /developers を参照。',
      count: prefectures.length,
      totalRecords: records.length,
      generatedAt: new Date().toISOString(),
      endpoints: {
        index: `${SITE_URL}/api/competition-rates`,
        csv: `${SITE_URL}/api/competition-rates/csv`,
        prefecture: `${SITE_URL}/api/competition-rates/{code}`,
        allPrefectures: `${SITE_URL}/api/schools/{pref}`,
        docs: `${SITE_URL}/developers`,
      },
    },
    prefectures,
  };
}

export interface CompetitionRatesPrefectureDetail {
  prefectureCode: string;
  prefectureName: string;
  recordCount: number;
  records: ObunshaPocRecord[];
}

/**
 * 単一都道府県の再配布許諾済みレコード（GET /api/competition-rates/{code}）。
 * `redistribution: 'ok'`でない県・データ未収録の県は`null`（呼び出し側が404にする）。
 */
export function competitionRatesForPrefecture(
  code: string,
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
): CompetitionRatesPrefectureDetail | null {
  const ok = new Set(redistributableOkPrefectures());
  if (!ok.has(code)) return null;
  const file = byPrefecture[code];
  if (!file) return null;
  const records = buildFullExportRecords({ [code]: file });
  return {
    prefectureCode: code,
    prefectureName: getPrefectureByCode(code)?.name ?? code,
    recordCount: records.length,
    records,
  };
}
