/**
 * 塾診断（/juku-shindan）オファーマッチングの月次実測レポート（Q-5）。
 *
 *   # D1のclicksをplacement='shindan'で絞ってJSONエクスポート：
 *   wrangler d1 execute my-naishin-leads --remote --json \
 *     --command "SELECT affiliate_id, COUNT(*) AS clicks FROM clicks
 *                WHERE placement = 'shindan' AND created_at >= datetime('now','-30 days')
 *                GROUP BY affiliate_id" > shindan-clicks.json
 *
 *   npx tsx scripts/juku-offer-ranking-report.ts --clicks=shindan-clicks.json
 *
 * matchJuku()（juku-match.ts）が使うEV仮定順位（affiliate-economics.tsの未実測CVR/CPA由来）と、
 * 実際にjuku-shindan面から生まれたクリックの観測順位を突き合わせ、乖離の大きい案件を報告する。
 * 合計クリックがJUKU_OFFER_MIN_SAMPLE未満なら「サンプル不足」として判定を保留する
 * （捏造ゼロ・反証ゲート思想＝generate-sales-report.ts/L-3のCTR改善ガードと同じ規約）。
 *
 * このレポート自体はmatchJuku()の挙動を自動で書き換えない（月次で👤/監督付きセッションが
 * 乖離を見て、必要ならJUKU_OFFERSのスコアリング調整やaffiliate-economics.tsのEV仮定値を
 * 見直す判断材料として使う運用）。
 */

import { readFileSync } from 'node:fs';

import { rankLiveOffersByEV } from '@/lib/affiliate-economics';
import { JUKU_OFFERS } from '@/lib/juku-match';
import {
  computeObservedOfferRank,
  findRankDivergence,
  JUKU_OFFER_MIN_SAMPLE,
  type ObservedOfferClicks,
} from '@/lib/juku-offer-observed';
import type { AffiliateId } from '@/lib/affiliates';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

interface ClickRow {
  affiliate_id: string;
  clicks?: number;
}

/** wrangler --json（[{results:[...]}]）や素の配列、どちらの形でも行配列に正規化する（generate-sales-report.tsと同型）。 */
function loadRows(path: string): ClickRow[] {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (Array.isArray(raw) && raw.length && Array.isArray(raw[0]?.results)) return raw[0].results as ClickRow[];
  if (Array.isArray(raw?.results)) return raw.results as ClickRow[];
  if (Array.isArray(raw)) return raw as ClickRow[];
  return [];
}

function main() {
  const clicksPath = arg('clicks');
  if (!clicksPath) {
    console.error('✗ --clicks=shindan-clicks.json を指定してください（D1のclicksをplacement=shindanで絞ってエクスポート）。');
    process.exit(1);
  }

  const rows = loadRows(clicksPath);
  const jukuIds = new Set<AffiliateId>(JUKU_OFFERS.map((o) => o.id));
  const byId = new Map<AffiliateId, number>();
  for (const r of rows) {
    const id = r.affiliate_id as AffiliateId;
    if (!jukuIds.has(id)) continue; // 塾ユニバース外は対象外（誤集計防止）
    const c = typeof r.clicks === 'number' ? r.clicks : 1;
    byId.set(id, (byId.get(id) ?? 0) + c);
  }
  const clicks: ObservedOfferClicks[] = JUKU_OFFERS.map((o) => ({ id: o.id, clicks: byId.get(o.id) ?? 0 }));
  const totalClicks = clicks.reduce((s, c) => s + c.clicks, 0);

  console.log('=== 塾診断オファーマッチング 月次実測レポート（Q-5） ===\n');
  console.log(`対象クリック合計（placement=shindan・塾ユニバース内）: ${totalClicks}\n`);

  const observed = computeObservedOfferRank(clicks);
  if (!observed) {
    console.log(`サンプル不足（合計クリック${totalClicks} < 閾値${JUKU_OFFER_MIN_SAMPLE}）＝判定保留。もう少しデータを貯めてから再実行してください。`);
    return;
  }

  console.log('観測ランク（実クリック順）:');
  for (const o of observed) {
    console.log(`  ${o.rank}. ${o.id}（${o.clicks}クリック・シェア${(o.share * 100).toFixed(1)}%）`);
  }

  const assumedIds = rankLiveOffersByEV()
    .map((o) => o.id)
    .filter((id) => jukuIds.has(id));

  console.log('\nEV仮定ランク（affiliate-economics.ts・未実測の仮定CVR/CPA由来）:');
  assumedIds.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));

  const divergences = findRankDivergence(assumedIds, observed);
  console.log('\n乖離（|仮定順位 - 観測順位| >= 2）:');
  if (divergences.length === 0) {
    console.log('  なし（EVモデルの仮定と実測がおおむね一致）');
  } else {
    for (const d of divergences) {
      const direction = d.delta > 0 ? '過小評価（実測の方が良い）' : '過大評価（実測の方が悪い）';
      console.log(`  ${d.id}: 仮定${d.assumedRank}位 → 実測${d.observedRank}位（${direction}・delta=${d.delta}）`);
    }
    console.log('\n→ 乖離が大きい案件はaffiliate-economics.tsのCVR仮定値見直し、またはjuku-match.tsのスコアリング調整を検討してください。');
  }
}

main();
