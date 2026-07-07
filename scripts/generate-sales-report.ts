/**
 * 月次 送客実績レポート生成（Markdown）＝来季の直接送客契約の「営業資料」の土台（H5）。
 *
 *   # まず D1 のクリックを JSON でエクスポート（unsubscribed等の絞りは不要・clicksテーブル）：
 *   wrangler d1 execute my-naishin-leads --remote --json \
 *     --command "SELECT affiliate_id, prefecture, placement, COUNT(*) AS clicks
 *                FROM clicks WHERE created_at >= datetime('now','-30 days')
 *                GROUP BY affiliate_id, prefecture, placement" > clicks.json
 *
 *   # レポート生成（標準出力 / --out でファイル保存）：
 *   npx tsx scripts/generate-sales-report.ts --clicks=clicks.json --month=2026年8月 --out=report-2026-08.md
 *   # 7/20 反証ゲートに実測を載せる（任意・既定0）：--prev-clicks=前季クリック --leads=名簿累計 --conversions=ASP発生
 *   npx tsx scripts/generate-sales-report.ts --clicks=clicks.json --prev-clicks=120 --leads=12 --conversions=0
 *
 *   # 特単交渉トリガー（D-1・任意）：当月ASP発生累計が50件/月に達すると交渉文面を自動生成
 *   npx tsx scripts/generate-sales-report.ts --clicks=clicks.json --conversions-this-month=52
 *
 * 思想（[[fable5-master-plan-2026-06]] / [[honbun-portfolio-strategy]]）：
 *   来年3月に塾・個別指導へ「送客実績＋CPA交渉」を持ち込むには、実績データを今から貯めて
 *   いつでもレポート化できる必要がある。クリックは /go(D1) の一次データ＝欠測しない。
 *
 * ⚠ 金額は affiliate-economics.ts の「仮定」。確定報酬はASP管理画面が正。発生≠着金。
 */

import { readFileSync, writeFileSync } from 'node:fs';

import { AFFILIATES, type AffiliateId } from '@/lib/affiliates';
import {
  economicsFor,
  estimatedLeads,
  estimatedRevenueYen,
  yen,
} from '@/lib/affiliate-economics';
import { auditPlacementOffers } from '@/lib/lead-config';
import { evaluateJulyGate, evaluateSpecialRateNegotiationTrigger } from '@/lib/velocity';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

interface ClickRow {
  affiliate_id: string;
  prefecture?: string | null;
  placement?: string | null;
  clicks?: number;
}

/** wrangler --json（[{results:[...]}]）や素の配列、どちらの形でも行配列に正規化する。 */
function loadRows(path: string): ClickRow[] {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (Array.isArray(raw) && raw.length && Array.isArray(raw[0]?.results)) return raw[0].results as ClickRow[];
  if (Array.isArray(raw?.results)) return raw.results as ClickRow[];
  if (Array.isArray(raw)) return raw as ClickRow[];
  return [];
}

interface Agg {
  id: AffiliateId;
  name: string;
  clicks: number;
}

function aggregate(rows: ClickRow[]): { byProgram: Agg[]; byPlacement: Map<string, number>; byPref: Map<string, number> } {
  const prog = new Map<string, number>();
  const placement = new Map<string, number>();
  const pref = new Map<string, number>();
  for (const r of rows) {
    const c = typeof r.clicks === 'number' ? r.clicks : 1; // 集計済みなら clicks、生行なら1
    if (r.affiliate_id) prog.set(r.affiliate_id, (prog.get(r.affiliate_id) ?? 0) + c);
    placement.set(r.placement || '(none)', (placement.get(r.placement || '(none)') ?? 0) + c);
    pref.set(r.prefecture || '(none)', (pref.get(r.prefecture || '(none)') ?? 0) + c);
  }
  const byProgram: Agg[] = [...prog.entries()]
    .map(([id, clicks]) => ({ id: id as AffiliateId, name: (AFFILIATES[id as AffiliateId]?.name as string) ?? id, clicks }))
    .sort((a, b) => b.clicks - a.clicks);
  return { byProgram, byPlacement: placement, byPref: pref };
}

function topTable(title: string, m: Map<string, number>, limit = 12): string {
  const rows = [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  const body = rows.map(([k, v]) => `| ${k} | ${v.toLocaleString('ja-JP')} |`).join('\n');
  return `### ${title}\n\n| キー | クリック |\n| --- | ---: |\n${body}\n`;
}

function main() {
  const clicksPath = arg('clicks');
  const monthLabel = arg('month') ?? new Date().toISOString().slice(0, 7);
  const out = arg('out');

  if (!clicksPath) {
    console.error('✗ --clicks=clicks.json を指定してください（D1 の clicks を wrangler でエクスポート）。');
    process.exit(1);
  }

  const rows = loadRows(clicksPath);
  const { byProgram, byPlacement, byPref } = aggregate(rows);

  const totalClicks = byProgram.reduce((s, p) => s + p.clicks, 0);

  // 今季の桁レバー（7/20 反証ゲート）。発生・名簿・前季クリックは実測が一次なので引数で受ける（既定0）。
  const num = (v: string | undefined) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const gate = evaluateJulyGate({
    clicks: totalClicks,
    clicksPrev: num(arg('prev-clicks')),
    leads: num(arg('leads')),
    conversions: num(arg('conversions')),
  });
  const totalLeads = byProgram.reduce((s, p) => s + estimatedLeads(p.id, p.clicks), 0);
  const totalRevenue = byProgram.reduce((s, p) => s + estimatedRevenueYen(p.id, p.clicks), 0);

  const progTable = byProgram
    .map(
      (p) =>
        `| ${p.name} \`${p.id}\` | ${p.clicks.toLocaleString('ja-JP')} | ${yen(economicsFor(p.id).cpaYen)} | ${estimatedLeads(p.id, p.clicks).toFixed(1)} | ${yen(estimatedRevenueYen(p.id, p.clicks))} |`
    )
    .join('\n');

  // 面別オファー監査（通年の基底設定）。保護者面に有料が紛れていないか・各面の送客先を一望する。
  const auditRows = auditPlacementOffers({ season: null });
  const auditTable = auditRows
    .map(
      (a) =>
        `| ${a.placement} | ${a.programName} \`${a.affiliateId}\` | ${a.kindLabel} | ${a.parentSafe ? '✅' : '⚠️ 有料'} |`
    )
    .join('\n');
  const unsafeCount = auditRows.filter((a) => !a.parentSafe).length;

  // 特単交渉トリガー（D-1）：当月ASP発生件数の累計を渡すと閾値50件/月の判定＋交渉文面を出す。
  const conversionsThisMonth = arg('conversions-this-month');
  const nego = conversionsThisMonth !== undefined ? evaluateSpecialRateNegotiationTrigger(num(conversionsThisMonth)) : null;
  const negoSection = nego
    ? `

## 特単交渉トリガー（D-1）

- ${nego.triggered ? '🚨 発火' : '✅ 未発火'}：${nego.detail}
${
  nego.triggered
    ? `
### 交渉文面（叩き台・${monthLabel}）

> 送信は必ず親名義（👤）で。金額・条件は先方との関係性に応じて調整してください。

\`\`\`
件名：送客実績のご報告とお願い（My Naishin）

いつもお世話になっております。My Naishin（内申点・偏差値の計算サイト）です。

おかげさまで${monthLabel}の送客実績は下記の通りとなりました。
- 総クリック（実数）: ${totalClicks.toLocaleString('ja-JP')}件
- うち貴社向け送客の発生（貴社ご確認の実績）: ${nego.conversionsThisMonth}件

継続して安定した送客ができておりますので、送客件数の実績に応じた条件（成果単価の見直し、
または一定件数以上でのボリュームディスカウント／上乗せ）についてご相談させていただけますと幸いです。
可能でしたら一度オンラインでお時間をいただけますでしょうか。

引き続きよろしくお願いいたします。
\`\`\`
`
    : ''
}`
    : '';

  const md = `# 送客実績レポート — ${monthLabel}

> ⚠ 推定リード数・推定発生額は **未実測の仮定**（CPA・転換率は affiliate-economics.ts の概算）です。
> 確定報酬は各ASP管理画面が正。「発生」≠「着金」（承認・確定にラグあり）。
> クリック数は /go(D1) の一次データ（欠測しない実数）。

## サマリ

- 総クリック（実数）: **${totalClicks.toLocaleString('ja-JP')}**
- 推定リード数（仮定）: **${totalLeads.toFixed(1)}**
- 推定発生額（仮定）: **${yen(totalRevenue)}**

## 今季の桁レバー（7/20 反証ゲート）

> 桁を動かすのは保護者起点クリック（C_p）のみ。7/20 に「クリックN倍／発生M件」で GO / ITERATE / PIVOT を判定。
> ¥予測はしない＝先行指標だけで採点。発生・名簿・前季クリックは実測が一次（\`--conversions=\` / \`--leads=\` / \`--prev-clicks=\` で指定）。

- 判定: **${gate.verdictLabel}**（${gate.decided ? `判定日 ${gate.deadline} 到達` : `判定日 ${gate.deadline}・あと${gate.daysLeft}日`}）
- クリック前季比: **${gate.clickMultipleLabel}**（今季 ${gate.clicks.toLocaleString('ja-JP')} / 前季 ${gate.clicksPrev.toLocaleString('ja-JP')}）
- 発生（ASP実測）: **${gate.conversions}** ／ 本物リード累計: **${gate.leads.toLocaleString('ja-JP')}**
- 判断: ${gate.rationale}

## プログラム別

| プログラム | クリック | 推定CPA | 推定リード | 推定発生額 |
| --- | ---: | ---: | ---: | ---: |
${progTable || '| (データなし) | 0 | - | 0 | ¥0 |'}

${topTable('面（placement）別 クリック', byPlacement)}
${topTable('都道府県別 クリック', byPref)}

## 面別オファー監査（送客先と種別）

> 北極星：保護者面には「無料リード（資料請求／無料体験／無料相談）」のみを置く。
> 「種別」が有料成約の面（⚠️）は権限ズレで溶けやすく、CIの戦略ガード（lead-config.test）でも検出されます。
> ${unsafeCount === 0 ? '現在、有料が紛れている面はありません（戦略整合）。' : `⚠️ 有料が ${unsafeCount} 面で検出されました。lead-config を見直してください。`}

| 面（placement） | 送客先 | 種別 | 保護者面OK |
| --- | --- | --- | :---: |
${auditTable}

## 直接送客契約（来季）に向けたメモ

- ASP経由 CPA に対し、直接契約では +30〜80% の上乗せ余地があるケースがある（要交渉）。
- 上位プログラム＝塾/個別/家庭教師の「無料体験」をまず直接契約の打診対象に。
- 県×面で偏りがあれば、その県の地場塾へ「この地域で月◯クリック送れます」と提示できる。
${negoSection}`;

  if (out) {
    writeFileSync(out, md, 'utf8');
    console.log(`✓ レポートを書き出しました: ${out}`);
  } else {
    process.stdout.write(md);
  }
}

main();
