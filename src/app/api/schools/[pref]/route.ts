import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { licensableRecords } from '@/lib/competition-rate';
import { getPrefectureByCode } from '@/lib/prefectures';

/**
 * 公開データAPI（堀B・Y-7）— 都道府県別の学校ごと入試競争率（募集人員・応募者数・倍率）。
 *
 * GET /api/schools/{pref}（例: /api/schools/tokyo）
 *   Y-2/Y-6で構築した`src/data/competition-rates/`のうち、その都道府県の学校別レコードを返す。
 *   `licensableRecords()`により、商用第三者資料のみを唯一の出典とするレコード
 *   （`commercialSourceOnly: true`）は既存のA-2配布ポリシーに従い自動的に除外する。
 * GET /api/schools/{pref}?fiscalYear=令和8年度（2026年度）
 *   特定年度のレコードのみに絞り込む（掛-1・多年度データ対応）。
 */
export async function GET(request: Request, { params }: { params: Promise<{ pref: string }> }) {
  // 2026-09-01(API1-1): 学校・学科単位の倍率は提案書上「無償公開APIではキー登録が必要（Business以上）」
  // としているため、Business以上のキーを必須にする。未達は402＋申込先(/developers)を返す（無言の403にしない）。
  const gate = await gateApiRequest(request, { requireMinTier: 'business' });
  if (!gate.allowed) return gate.response;
  const { pref } = await params;
  await logApiHit('schools-detail', request, { pref, tier: gate.tier });
  const h = { headers: gate.headers, private: gate.cachePrivate } as const;

  const notFound = () =>
    corsJson(
      {
        error: 'not_found',
        message: `都道府県コード「${pref}」の学校別入試競争率データは見つかりませんでした。`,
      },
      { status: 404, cacheSeconds: 300, headers: gate.headers }
    );

  const file = COMPETITION_RATE_BY_PREFECTURE[pref];
  if (!file) return notFound();

  const prefecture = getPrefectureByCode(pref);
  let records = licensableRecords(file);

  const fiscalYear = new URL(request.url).searchParams.get('fiscalYear');
  if (fiscalYear !== null) {
    const defaultFiscalYear = file.sources[0]?.fiscalYear;
    records = records.filter((r) => (r.fiscalYear ?? defaultFiscalYear) === fiscalYear);
  }

  return corsJson(
    {
      prefectureCode: pref,
      prefectureName: prefecture?.name ?? pref,
      sources: file.sources,
      coverage: file.coverage,
      recordCount: records.length,
      records,
      officialSubtotals: file.officialSubtotals,
    },
    h
  );
}

export function OPTIONS() {
  return corsPreflight();
}
