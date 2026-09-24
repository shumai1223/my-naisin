#!/usr/bin/env -S npx tsx
/**
 * T-TD1 TD-4/TD-5: 決裁用の1枚資料(ONE-PAGER.html)と、見積書・請求書・納品書のひな形を生成する。
 *
 * 価格は src/data/nendomatsu-pack-pricing.json の1か所だけから差し込む。価格を直したら
 *   npm run td1:build-kit
 * で全て再生成される（ページ・メール下書き({{PRICE}})も同じ定数）。
 *
 * ⚠️ PII: 振込先口座・住所・電話番号・請求先の宛名は空欄（👤が記入）。個人名は契約名義人「國井」のみ。
 * ⚠️ 価格が未確定(pending)の間は、全ての出力に「価格未確定・送付不可」の帯を付ける。
 * ⚠️ フォントは "Yu Gothic"+"Yu Mincho" に固定・絵文字を使わない（提案書PDFで踏んだ罠）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { COMPETITION_RATE_BY_PREFECTURE } from '../src/data/competition-rates';
import {
  NENDOMATSU_PACK,
  displayPriceLabel,
  getDeliverablePrefectures,
  isPriceConfirmed,
  confirmedPriceLabel,
  getPricing,
  formatYen,
} from '../src/lib/nendomatsu-pack';
import { finalityOf, r9Baseline } from '../src/lib/nendomatsu-pack-schedule';
import { mdToHtml } from '../src/lib/nendomatsu-pack-md';

const OUT = 'ops/deliverables/nendomatsu-pack-sample';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `
@page { size: A4; margin: 12mm; }
* { box-sizing: border-box; }
body { font-family: "Yu Gothic", "YuGothic", "Meiryo", sans-serif; font-size: 9pt; line-height: 1.38; color: #111; margin: 0; }
h1 { font-family: "Yu Mincho", "YuMincho", serif; font-size: 15pt; margin: 0 0 2mm; }
h2 { font-family: "Yu Mincho", "YuMincho", serif; font-size: 10pt; margin: 2.4mm 0 0.8mm; border-bottom: 1px solid #333; padding-bottom: 0.5mm; }
p { margin: 0.8mm 0; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #666; padding: 0.5mm 1.6mm; text-align: left; vertical-align: top; font-size: 8.2pt; }
table.sched { table-layout: fixed; }
table.sched td:first-child { white-space: nowrap; }
th { background: #eee; }
.draft { border: 2px solid #b00; color: #b00; font-weight: bold; padding: 1.2mm 2mm; margin-bottom: 2mm; }
.small { font-size: 8pt; color: #333; }
.box { border: 1px solid #333; min-height: 8mm; padding: 1mm 2mm; }
.right { text-align: right; }
`;

function html(title: string, body: string): string {
  return `<!doctype html>\n<html lang="ja"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body>\n${body}\n</body></html>\n`;
}

const draftBanner = isPriceConfirmed()
  ? ''
  : '<div class="draft">価格未確定・送付不可（価格の確定後に `npm run td1:build-kit` で再生成してから使うこと）</div>';

// ---- ONE-PAGER ----
const deliverables = getDeliverablePrefectures();
const rows = deliverables
  .map((d) => {
    const cr = COMPETITION_RATE_BY_PREFECTURE[d.code];
    const r8 = (cr?.sources ?? []).filter((s) => s.fiscalYear.includes('令和8'));
    const target = finalityOf(r8.map((s) => s.docTitle).join(' ')).replace('(志願変更後・最終)', '（志願変更後・最終）').replace('(志願変更前)', '（志願変更前）')
      .replace(/^出願状況\(時点は資料名から判別不可\)$/,'県の出願状況資料（区分は納品時に明記）');
    const base = r9Baseline(d.code);
    const when = base.date ? `${base.date.replace(/-/g, '/')}（目安）` : 'R9日程の公表待ち';
    const promise = d.deliveryClass === 'A' ? NENDOMATSU_PACK.deliveryPromise.A : NENDOMATSU_PACK.deliveryPromise.B;
    return `<tr><td>${esc(d.name)}</td><td>${esc(target)}</td><td>${esc(when)}</td><td>${esc(promise)}</td></tr>`;
  })
  .join('\n');

const priceCell = isPriceConfirmed() ? esc(confirmedPriceLabel()!) : `<b>${esc(displayPriceLabel())}</b>`;

const onePager = html(
  `${NENDOMATSU_PACK.productName} 決裁用1枚資料`,
  `${draftBanner}
<h1>${esc(NENDOMATSU_PACK.productName)}（決裁用1枚資料）</h1>
<p class="small">提供: ${esc(NENDOMATSU_PACK.issuer)}（契約名義人: ${esc(NENDOMATSU_PACK.contractHolder)}）／お問い合わせ: naishin.dev@gmail.com</p>

<h2>1. 何が、誰のどの作業に置き換わるか</h2>
<p>毎年2月に、各県教育委員会が公表する公立高校の出願状況（学校・学科ごとの募集人員・出願者数・倍率）のPDFを追い、手作業で転記している作業を、
<b>県の公表後に、Excelで開けるCSVとシステム取り込み用のJSONで納品</b>します。紙面・模試資料・塾内資料・自社サイトの倍率表の元データにお使いいただけます。</p>

<h2>2. 何が届くか</h2>
<p>1行＝1校×1学科。列は「県／学校コード／学校名／学科／募集人員／出願者数／倍率／区分（速報・確定）／公表日／出典URL／確認日／前年度倍率／前年度差」。
<b>倍率は県の公表値の転記</b>で、こちらで計算し直していません（前年度差のみ公表値どうしの差）。全行に県教育委員会の公表資料のURLが付きます。
令和8年度の確定値で作った実物サンプル（千葉・長野・秋田）と、列の定義を書いた仕様書を同封します。</p>

<h2>3. いつ、どの県が届くか（納品予定表）</h2>
<p class="small">対象は、県教育委員会から「出典を明記すれば掲載してよい」との回答を書面で得ている県のうち、当方の体制で反映できる県のみです（現在 ${deliverables.length} 県）。
これ以外の県は、許諾が確認でき次第ご案内します。<b>この表にない県は納品しません。</b></p>
<table class="sched">
<colgroup><col style="width:11%"><col style="width:30%"><col style="width:29%"><col style="width:30%"></colgroup>
<tr><th>県</th><th>対象資料</th><th>令和9年度の志願変更の締切（県の日程に基づく目安）</th><th>納品の目安（案・県の公表を起点）</th></tr>
${rows}
</table>
<p class="small">「納品の目安」は県の公表を起点にした営業日ベースの案で、実測前です。県の公表日・公表方法が変わった場合は速やかにご連絡し、日程を再提示します。県が公表しない場合は納品できません。</p>

<h2>4. 価格・お支払い</h2>
<table>
<tr><th style="width:26%">価格</th><td>${priceCell}（買い切り・表示は税込）</td></tr>
<tr><th>お支払い</th><td>請求書払い・支払期限 ${esc(NENDOMATSU_PACK.paymentDeadline)}</td></tr>
<tr><th>インボイス</th><td>${esc(NENDOMATSU_PACK.invoiceNotice)}</td></tr>
</table>

<h2>5. 数字は信用できるか</h2>
<p>各行の値は県教育委員会の公表資料から転記し、資料の合計行との照合を行っています。<b>転記誤りは無償で訂正・再納品</b>し、県が訂正版を公表した場合は訂正版を反映して再納品します（訂正履歴つき）。
独自の推計・予測・偏差値は一切含みません。利用条件（案）は同封の TERMS をご覧ください（社内利用・自社の紙面/資料への掲載は可、出典として各県教育委員会を明記／データそのものの再販売・再配布は不可）。</p>

<h2>6. 実績・方針</h2>
<p>47都道府県の入試制度・内申点の計算方法を、教育委員会の一次資料に基づき出典つきで公開しています（https://my-naishin.com）。推定値・独自の合否予測は出さない方針です。</p>

<h2>7. 上司の方に見せるときの要点／次にすること</h2>
<p>要点: ①毎年2月の転記作業が不要になる ②全行に出典URLがあり、県が公表した値のみ ③一回払い・請求書払い・${esc(NENDOMATSU_PACK.paymentDeadline)}まで。<br>
次にすること: <b>このメールにご返信いただければ、貴社宛ての見積書をお出しします</b>（ご希望の県・宛名をお知らせください）。</p>
`
);

// ---- 見積書・請求書・納品書 ----
function docTemplate(kind: '見積書' | '請求書' | '納品書'): string {
  const priceLine = isPriceConfirmed() ? esc(confirmedPriceLabel()!) : `<b>${esc(displayPriceLabel())}</b>`;
  // 2026-09-24 👤確定: 1県目と2県目以降で単価が違うため、明細は県ごとの2行＋合計（県名・数量は👤が記入）。
  const pr = getPricing();
  const detailRows = isPriceConfirmed() && pr.additionalPrefectureYenTaxIncluded
    ? `<tr><td>${esc(NENDOMATSU_PACK.productName)} 1県目（県名: <span class="box">　　　　</span>）</td><td>1</td><td class="right">${esc(formatYen(pr.confirmedYenTaxIncluded as number))}</td></tr>
<tr><td>同 2県目以降（県名: <span class="box">　　　　　　　　</span>）</td><td class="box">　</td><td class="right">${esc(formatYen(pr.additionalPrefectureYenTaxIncluded))} × 数量 ＝ <span class="box">　　　　</span></td></tr>
<tr><th colspan="2" class="right">合計（税込）</th><td class="right box">　　　　</td></tr>`
    : `<tr><td>${esc(NENDOMATSU_PACK.productName)}（令和9年度 県立高校 出願状況 CSV/JSON・納品予定表の県）</td><td>1式</td><td class="right">${priceLine}</td></tr>`;
  const dateLabel = kind === '納品書' ? '納品日' : '発行日';
  const extra =
    kind === '請求書'
      ? `<tr><th>支払期限</th><td>${esc(NENDOMATSU_PACK.paymentDeadline)}</td></tr>
<tr><th>お振込先</th><td class="box">（👤が記入: 金融機関名・支店名・口座種別・口座番号・口座名義）</td></tr>`
      : kind === '見積書'
        ? `<tr><th>有効期限</th><td class="box">（発行日から30日など、👤が記入）</td></tr>
<tr><th>支払条件</th><td>納品後、請求書払い（支払期限 ${esc(NENDOMATSU_PACK.paymentDeadline)}）</td></tr>`
        : `<tr><th>納品内容</th><td class="box">（納品した県・ファイル名・区分・公表日を記入）</td></tr>`;
  return html(
    `${kind}（ひな形）`,
    `${draftBanner}
<h1>${kind}</h1>
<table>
<tr><th style="width:24%">宛名</th><td class="box">（貴社名・部署名）　　　　　　　御中</td></tr>
<tr><th>${dateLabel}</th><td class="box">（　　年　　月　　日）</td></tr>
<tr><th>書類番号</th><td class="box">（👤が採番）</td></tr>
<tr><th>件名</th><td>${esc(NENDOMATSU_PACK.productName)}</td></tr>
</table>
<h2>明細</h2>
<table>
<tr><th>品名</th><th style="width:12%">数量</th><th style="width:36%">金額（税込）</th></tr>
${detailRows}
</table>
<p class="small">${esc(NENDOMATSU_PACK.invoiceNotice)}</p>
<table style="margin-top:3mm">
${extra}
</table>
<h2>発行者</h2>
<table>
<tr><th style="width:24%">発行者</th><td>${esc(NENDOMATSU_PACK.issuer)}（契約名義人: ${esc(NENDOMATSU_PACK.contractHolder)}）</td></tr>
<tr><th>住所</th><td class="box">（👤が記入）</td></tr>
<tr><th>電話</th><td class="box">（👤が記入）</td></tr>
<tr><th>連絡先メール</th><td>naishin.dev@gmail.com</td></tr>
</table>
`
  );
}

const DOC_CSS_EXTRA = '<style>blockquote{border-left:3px solid #999;margin:2mm 0;padding:0 3mm;color:#333}ul{margin:1mm 0;padding-left:5mm}li{margin:0.4mm 0}code{font-family:Consolas,monospace;font-size:8pt}</style>';
for (const [name, title] of [['SPEC', 'データ仕様書'], ['TERMS', '利用条件（案）']] as const) {
  const md = fs.readFileSync(path.join(OUT, name + '.md'), 'utf8');
  fs.writeFileSync(path.join(OUT, name + '.html'), html(title, mdToHtml(md)).replace('</head>', DOC_CSS_EXTRA + '</head>'), 'utf8');
}

fs.mkdirSync(path.join(OUT, 'templates'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'ONE-PAGER.html'), onePager, 'utf8');
fs.writeFileSync(path.join(OUT, 'templates', 'mitsumori.html'), docTemplate('見積書'), 'utf8');
fs.writeFileSync(path.join(OUT, 'templates', 'seikyusho.html'), docTemplate('請求書'), 'utf8');
fs.writeFileSync(path.join(OUT, 'templates', 'nohinsho.html'), docTemplate('納品書'), 'utf8');
console.log(`生成: ONE-PAGER.html / SPEC.html / TERMS.html / templates/{mitsumori,seikyusho,nohinsho}.html（価格: ${displayPriceLabel()}・納品対象 ${deliverables.length}県）`);
