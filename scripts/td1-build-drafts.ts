#!/usr/bin/env -S npx tsx
/**
 * T-TD1 TD-7: 「下書きの下書き」(1社1ファイル・そのままGmail/フォームに貼れる完成形)と INDEX.md、
 * および文面の型4つ(ops/baselines/td1-email-templates-2026-09.md)を生成する。
 *
 * ⚠️ Gmail下書きは価格が決まるまで1件も置かない(👤指示 2026-09-24)。価格の箇所だけ {{PRICE}} のまま残し、
 *    それ以外に未確定の穴を残さない。価格確定後は `node scripts/td1-fill-price.mjs` で一括置換する。
 * ⚠️ 送信しない。相手の事実は「2026年2〜3月に掲載していた記事」だけ(買う意思は未確認)。
 *
 * 使い方: npx tsx scripts/td1-build-drafts.ts   （drafts-source.json → drafts/*.md, INDEX.md, README.md）
 */
import fs from 'node:fs';
import path from 'node:path';
import { NENDOMATSU_PACK, getDeliverablePrefectures } from '../src/lib/nendomatsu-pack';

const DIR = 'ops/deliverables/nendomatsu-pack-sample';
const DRAFTS = path.join(DIR, 'drafts');

type Kind = 'shimbun' | 'publisher' | 'juku' | 'reapproach' | 'reply-meeting';
interface Prior {
  status: string;
  lastContact: string;
  followups: number;
  threadId: string | null;
  note: string;
  mention?: string;
}
interface Entry {
  slug: string;
  org: string;
  dept: string;
  kind: Kind;
  channel: 'email' | 'email-reply' | 'form';
  contact: string;
  contactEvidence: string;
  prefectures: string[];
  evidenceUrl: string;
  orgLine: string;
  prior: Prior | null;
  routingNote?: string;
  evidenceCaveat?: string;
}
const source = JSON.parse(fs.readFileSync(path.join(DIR, 'drafts-source.json'), 'utf8')) as { entries: Entry[] };

const deliverables = getDeliverablePrefectures();
const nameOf = new Map(deliverables.map((d) => [d.code, d.name]));
const allNames = deliverables.map((d) => d.name).join('・');
const classOf = new Map(deliverables.map((d) => [d.code, d.deliveryClass]));

const SAMPLE_FILES = ['ONE-PAGER.pdf', 'sample-r8-chiba.csv', 'sample-r8-nagano.csv', 'sample-r8-akita.csv', 'SPEC.pdf', 'TERMS.pdf'];

function relNames(e: Entry): string {
  return e.prefectures
    .map((c) => {
      const n = nameOf.get(c);
      if (!n) throw new Error(`${e.slug}: ${c} は納品対象県(A+B かつ許諾ok)ではありません`);
      return n;
    })
    .join('・');
}

function timing(e: Entry): string {
  const cls = new Set(e.prefectures.map((c) => classOf.get(c)));
  const parts: string[] = [];
  if (cls.has('A')) parts.push(`${NENDOMATSU_PACK.deliveryPromise.A}`);
  if (cls.has('B')) parts.push(`${NENDOMATSU_PACK.deliveryPromise.B}`);
  return parts.join('／');
}

const SIGNATURE = `${NENDOMATSU_PACK.issuer}（契約名義人: ${NENDOMATSU_PACK.contractHolder}）\nnaishin.dev@gmail.com / https://my-naishin.com`;
const MINOR_NOTE = `なお、当サイトは個人（中学生）が開発・運営しており、ご契約・請求のやり取りは契約名義人の${NENDOMATSU_PACK.contractHolder}が対応いたします。`;

function subject(e: Entry): string {
  return `令和9年度 公立高校 倍率データ 県の公表後すぐ納品のご案内（${e.org.replace(/^株式会社/, '').replace(/株式会社$/, '')}様）`;
}

function offerBlock(e: Entry, withAttachments: boolean): string {
  const lines = [
    `令和9年度は、県の公表後に、Excelで開けるCSVとシステム取り込み用のJSONで納品する「年度末パック」をご用意しました。`,
    ``,
    `・内容: 令和9年度 公立高校の学校・学科別の募集人員・出願者数・倍率（県教育委員会の公表値の転記・全行に出典URL付き。当方の推計や予測は含みません）`,
    `・対象県: ${allNames}（県教育委員会から出典明記での掲載許諾を得ている県のうち、当方の体制で反映できる県。これ以外の県は許諾が確認でき次第ご案内します）`,
    `・貴社が令和8年度に掲載されていた県（${relNames(e)}）は、対象県に含まれています`,
    `・納品の目安: ${timing(e)}（営業日ベースの目安です。県の公表日・公表方法が変わった場合は速やかにご連絡します）`,
    `・価格: {{PRICE}}（買い切り・請求書払い・${NENDOMATSU_PACK.paymentDeadline}まで）。${NENDOMATSU_PACK.invoiceNotice}`,
  ];
  if (withAttachments) lines.push(`・添付: 決裁用の1枚資料／令和8年度の確定値で作ったサンプル（千葉・長野・秋田）／仕様書／利用条件（案）`);
  else lines.push(`・資料: 決裁用の1枚資料・令和8年度の確定値で作ったサンプル・仕様書・利用条件（案）は、ご返信いただければ添付してお送りします`);
  return lines.join('\n');
}

function closing(): string {
  return [
    `このメールにご返信いただければ、貴社宛ての見積書をお出しします（ご希望の県と宛名をお知らせください）。`,
    `ご不要な場合は、その旨だけご返信いただければ、以後ご連絡いたしません。`,
    ``,
    MINOR_NOTE,
    ``,
    SIGNATURE,
  ].join('\n');
}

function body(e: Entry): string {
  const withAtt = e.channel !== 'form';
  const greet = `${e.org}\n${e.dept}\n\n`;
  const routing = e.routingNote ? `${e.routingNote}\n\n` : '';
  const caveat = '';
  if (e.kind === 'reply-meeting') {
    return [
      `${e.dept}様`,
      ``,
      `7月22日にはお打ち合わせのお時間をいただき、ありがとうございました。`,
      `その後、年度末に向けた新しいご案内ができましたので、お知らせいたします。`,
      ``,
      `${e.orgLine}`,
      `毎年2月に各県教育委員会が公表する出願状況を、公表後すぐ納品する形にしたものが下記の「年度末パック」です。`,
      ``,
      offerBlock(e, true),
      ``,
      `お打ち合わせでお話しした内容とは別の、年度末の予算で1回でご検討いただける単発のご案内です。ご参考になれば幸いです。`,
      ``,
      `ご返信いただければ、貴社宛ての見積書をお出しします（ご希望の県と宛名をお知らせください）。`,
      ``,
      SIGNATURE,
    ].join('\n');
  }
  const prior = e.prior?.mention ? `${e.prior.mention}\n\n` : '';
  const intro =
    e.kind === 'reapproach'
      ? `${greet}${prior}${e.orgLine}\n\n毎年2月に、県教育委員会が公表する出願状況（学校・学科ごとの募集人員・出願者数・倍率）のPDFを追って転記する作業について、ご提案です。\n\n`
      : `${greet}はじめてご連絡いたします。${NENDOMATSU_PACK.issuer}（契約名義人: ${NENDOMATSU_PACK.contractHolder}）と申します。\n${prior ? '\n' + prior : ''}${routing}${e.orgLine}\n\n毎年2月に、県教育委員会が公表する出願状況（学校・学科ごとの募集人員・出願者数・倍率）のPDFを追って転記する作業について、ご提案です。\n\n`;
  const lead = e.kind === 'juku' || e.kind === 'publisher' ? '' : caveat;
  return `${intro}${lead}${offerBlock(e, withAtt)}\n\n${closing()}`;
}

function fileFor(n: number, e: Entry): { name: string; text: string } {
  const num = String(n).padStart(2, '0');
  const name = `${num}-${e.slug}.md`;
  const channelLabel = e.channel === 'email' ? 'メール（新規）' : e.channel === 'email-reply' ? 'メール（既存スレッドへ返信）' : 'フォーム（Cowork入力→確認画面で停止→送信は👤）';
  const priorText = e.prior
    ? `${e.prior.status}／最終接触 ${e.prior.lastContact}／追撃 ${e.prior.followups}回／スレッドID ${e.prior.threadId ?? 'なし(フォーム経由)'}\n  - ${e.prior.note}`
    : 'なし（初回）';
  const send =
    e.channel === 'form'
      ? `- 入口URL: ${e.contact}\n- 共通入力: お名前=${NENDOMATSU_PACK.contractHolder} ／ 所属=${NENDOMATSU_PACK.issuer} ／ メール=naishin.dev@gmail.com ／ URL=https://my-naishin.com ／ 電話・住所は入力しない（必須なら未入力で止めて報告）\n- 件名欄があれば下の「件名」、本文欄には下の「本文」を貼る`
      : e.channel === 'email-reply'
        ? `- 設置方法: gmail_create_reply_draft（threadId ${e.prior?.threadId}）。宛先はスレッドの相手を引き継ぐ`
        : `- 宛先: ${e.contact}\n- 設置方法: gmail_create_draft`;
  const attach = e.channel === 'form' ? '（フォームは添付不可。本文どおり「ご返信いただければ添付してお送りします」）' : SAMPLE_FILES.map((f) => `- ${DIR}/${f}`).join('\n');
  const text = `# ${num} ${e.org}（${e.dept}）

- 状態: 待機
- 窓口: ${channelLabel}
${send}
- 窓口の確認: ${e.contactEvidence}
- 既接触: ${priorText}
- 証拠（TD-6・Aランクの根拠）: ${e.evidenceUrl}${e.evidenceCaveat ? `\n- 証拠の弱い点: ${e.evidenceCaveat}` : ''}
- 関係する県: ${relNames(e)}

## 件名

${subject(e)}

## 本文

${body(e)}

## 添付するファイル

${attach}
`;
  return { name, text };
}

fs.mkdirSync(DRAFTS, { recursive: true });
for (const f of fs.readdirSync(DRAFTS)) if (/^\d\d-.*\.md$/.test(f)) fs.unlinkSync(path.join(DRAFTS, f));

const index: string[] = [
  '# 下書き一覧（INDEX）',
  '',
  '状態: `待機` → `設置済み draftId <id>` → `送信済み <日付>`。**価格が確定するまで Gmail下書きは1件も置かない**（`README.md` の手順を先に読むこと）。',
  '',
  '| 連番 | 組織 | 区分 | 窓口 | 窓口の宛先 | スレッドID | 状態 |',
  '|---|---|---|---|---|---|---|',
];
source.entries.forEach((e, i) => {
  const { name, text } = fileFor(i + 1, e);
  fs.writeFileSync(path.join(DRAFTS, name), text, 'utf8');
  const kindLabel = { shimbun: '地方紙', publisher: '進学情報誌', juku: '塾本部', reapproach: '地方紙(既接触)', 'reply-meeting': '進学情報(商談済み)' }[e.kind];
  const ch = e.channel === 'email' ? 'メール' : e.channel === 'email-reply' ? 'メール(返信)' : 'フォーム';
  index.push(`| ${String(i + 1).padStart(2, '0')} | [${e.org}](${name}) | ${kindLabel} | ${ch} | ${e.channel === 'email' ? e.contact : e.channel === 'form' ? e.contact : 'スレッドを引き継ぐ'} | ${e.prior?.threadId ?? '-'} | 待機 |`);
});
index.push('', `合計 ${source.entries.length} 社（メール ${source.entries.filter((e) => e.channel !== 'form').length}／フォーム ${source.entries.filter((e) => e.channel === 'form').length}）。`, '');
fs.writeFileSync(path.join(DRAFTS, 'INDEX.md'), index.join('\n'), 'utf8');

const readme = `# 下書きの使い方（価格が決まったら）

**現在、価格は未確定です（\`src/data/nendomatsu-pack-pricing.json\` の status が "pending"）。Gmail下書きは1件も置かないでください。**
価格が確定するまで、このフォルダの各ファイルには価格の差し込み口 \`{{PRICE}}\` が残っています。

## 価格が決まったらやること（この順番）

1. **価格を1か所だけ直す**: \`src/data/nendomatsu-pack-pricing.json\` を開き、\`"status": "confirmed"\`、\`"confirmedYenTaxIncluded": <税込の整数>\` にする（例: 250000）。ほかは何も直さない。
2. **1枚資料・見積書/請求書ひな形・商品ページを再生成**: \`npm run td1:build-kit\`（ONE-PAGER.html などの価格が同じ定数から変わる）。続けて PDF 化（ONE-PAGER・SPEC・TERMS）: 下の「PDFにする」。
3. **下書きの \`{{PRICE}}\` を一括置換**: \`node scripts/td1-fill-price.mjs\`（\`--dry-run\` で先に確認できる）。**未確定なら何もせず終了／置換漏れが1件でもあれば1ファイルも書き換えず止まる。**
4. **メール窓口の相手だけ Gmail下書きを設置**: 既接触は \`gmail_create_reply_draft\`（threadId は各ファイルに記載）、新規は \`gmail_create_draft\`。**1晩10〜15社まで。** 設置したら \`INDEX.md\` の状態を \`設置済み draftId <id>\` に書き換える。
5. **フォーム窓口の相手**: \`ops/cowork/COWORK-TASK-td1-nendomatsu-forms.md\` を Cowork に渡す（各ファイルの「本文」を貼り、確認画面で停止）。
6. **送信は👤だけ。** loopは送りません。送ったら \`ops/baselines/td1-funnel-2026-10.md\` に1行足す。

## PDFにする（Edge headless）

\`\`\`
"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --headless --disable-gpu --no-pdf-header-footer ^
  --print-to-pdf="ops\\deliverables\\nendomatsu-pack-sample\\ONE-PAGER.pdf" "file:///C:/Users/E24054/my-naisin/ops/deliverables/nendomatsu-pack-sample/ONE-PAGER.html"
\`\`\`

SPEC.html / TERMS.html も同じ要領で SPEC.pdf / TERMS.pdf にする。ONE-PAGER は A4・1枚に収まることを \`pdfinfo\` で確認する（Pages: 1）。

## 作り直したいとき

文面や送り先を直す場合は \`drafts-source.json\` を編集して \`npx tsx scripts/td1-build-drafts.ts\` で再生成する（\`drafts/*.md\` は生成物・手で直すと次の再生成で消える）。⚠️ 価格置換後に再生成すると \`{{PRICE}}\` が戻るので、置換前に行うこと。
`;
fs.writeFileSync(path.join(DRAFTS, 'README.md'), readme, 'utf8');

// ---- 文面の型4つ ----
const sample: Entry = source.entries[0];
const tpl = `# T-TD1 TD-7: 文面の型4つ（2026-09-24）

実際の宛先ごとの完成形は \`ops/deliverables/nendomatsu-pack-sample/drafts/\`（\`scripts/td1-build-drafts.ts\` で生成）。ここは型の説明。
価格は \`{{PRICE}}\`（\`src/data/nendomatsu-pack-pricing.json\` の1か所から \`scripts/td1-fill-price.mjs\` で差し込む）。**価格が確定するまでGmail下書きは置かない。**

## 共通の作り方

- **件名で中身が分かる**: 「令和9年度 公立高校 倍率データ 県の公表後すぐ納品のご案内（〇〇様）」
- **本文の順番**: 相手が2026年2〜3月に実際に掲載していた事実（1文・証拠URLはdraftsファイルに保存）→ 提案（何を・どの県を・いつ・いくらで）→ 添付の見方 → 返信だけで見積書を出す旨 → 断りの逃げ道 → 運営者の一文 → 署名
- **運営者が中学生であることは隠さないが前に出しすぎない**: 末尾の1文と、署名の「契約名義人: ${NENDOMATSU_PACK.contractHolder}」だけ
- **大げさに書かない**: 「47県対応」「業界唯一」は使わない。対象県は許諾が確認できている県だけを県名で列挙する（現在 ${deliverables.length}県）
- **相手の事実は「掲載していた記事」まで**。「毎年手作業で集めているはずだ」等の推測は書かない（買う意思は未確認）

## 型① 模試会社・初回（★今回は使い手がいない）

対象: 県の模試を運営する会社。今回のTD-6では、模試会社で「倍率を載せる／使う」証拠が確認でき、かつメール/フォーム窓口があった相手が0社（誠伸社・総進図書は電話のみ）。
使うときは型②の骨格に、「模試の判定資料・志望校判定に県別の倍率を載せている」事実を1文目に置き、「判定資料の更新のタイミング（県の公表後何日か）」を提案の中心にする。

## 型② 地方紙・初回（drafts の shimbun）

骨格（宛先は「会社名／部署」）:

\`\`\`
${body({ ...sample, channel: 'email' }).split('\n').join('\n')}
\`\`\`

## 型③ 塾本部・出版・初回（drafts の publisher / juku）

型②と同じ骨格。1文目を「サイト・出版物に掲載していた事実」にし、提案の文脈を「保護者向け資料・塾内資料・自社サイトの倍率表の元データ」に寄せる（新聞の紙面ではなく）。

## 型④ 既に接触済み（awaiting）への再打診（drafts の reapproach / reply-meeting）

**新しい材料＝「2月当日納品の具体物（サンプル・納品予定表・価格）」を差分として出す**。前回の連絡の繰り返しにしない。
- 冒頭に「〇月〇日に別件でご連絡した者です」の1文（同じ社への別部署・別窓口の場合は別件であることを明記）
- 商談済みの相手（reply-meeting）は、商談のお礼から入り「単発のご案内」であることを明記（既存の商談を上書きしない）
- フォーム経由でスレッドが無い相手は、フォームに再入力（Cowork）。追撃上限（1回）に達している相手には出さない

## 使わない相手（TD-6の除外）

育伸社（closed・営業メール不可）／イード（追撃上限）／窓口が電話のみ・生徒募集用フォームのみ・窓口なしの相手。詳細は \`ops/baselines/td1-target-list-2026-09.md\`。
`;
fs.writeFileSync('ops/baselines/td1-email-templates-2026-09.md', tpl, 'utf8');

// ---- Cowork指示書 ----
const forms = source.entries.map((e, i) => ({ e, num: String(i + 1).padStart(2, '0') })).filter((x) => x.e.channel === 'form');
const cowork = `# Cowork指示書: T-TD1 年度末パックの売り込み（問い合わせフォーム ${forms.length}件）※送信は👤

## このファイルについて（2026-09-24作成）

令和9年度 公立高校 倍率データ「年度末パック」の売り込みのうち、**メールアドレスが無くフォームのみが窓口**の ${forms.length} 社に、
フォームへ本文を入力する作業です。**本文はこのファイルに書いていません**（二重管理をしないため）。
各社のファイル \`ops/deliverables/nendomatsu-pack-sample/drafts/<連番>-<slug>.md\` の「## 件名」「## 本文」をそのまま貼ってください。

## ⛔ 着手条件（必ず先に確認）

- **価格が確定し、\`drafts/README.md\` の手順3（\`node scripts/td1-fill-price.mjs\`）が済んでいること。**
  本文の中に \`{{PRICE}}\` という文字が残っているファイルは、価格が未確定です。**その場合は1件も入力せず、👤に報告して止まってください。**
- 対象の会社から返信が来ていないか、Gmailで確認してから着手する。

## ⛔ してはいけないこと

- **最終の送信ボタンは絶対に押さないでください。** 確認画面が出るところまで進めたら止めてください。送信は👤が内容を確認して行います。
- 会員登録・ログインが必要なページには入らない。
- 電話番号・住所など共通入力値にない項目が必須の場合は、推測で埋めず**未入力のまま止めて報告**する。
- 1回の作業は最大 ${Math.min(forms.length, 10)} 社まで（1晩10〜15社までのガードレール）。

## 共通の入力値

| 項目 | 値 |
|---|---|
| お名前（姓名） | ${NENDOMATSU_PACK.contractHolder} |
| 所属・団体名・会社名 | ${NENDOMATSU_PACK.issuer} |
| メールアドレス | naishin.dev@gmail.com |
| URL・ホームページ欄 | https://my-naishin.com |
| 電話番号・郵便番号・住所 | （未定義。必須なら送信直前で止めて報告。推測で埋めない） |

## 対象（${forms.length}社）

| 連番 | 組織 | 入口URL | 下書きファイル |
|---|---|---|---|
${forms.map((x) => `| ${x.num} | ${x.e.org} | ${x.e.contact} | \`ops/deliverables/nendomatsu-pack-sample/drafts/${x.num}-${x.e.slug}.md\` |`).join('\n')}

## 報告してほしいこと

各社について: 確認画面まで進めたか／止まった理由（必須項目・ログイン要求・CAPTCHA 等）／確認画面のスクリーンショットの保存先。
`;
fs.writeFileSync('ops/cowork/COWORK-TASK-td1-nendomatsu-forms.md', cowork, 'utf8');
console.log(`drafts: ${source.entries.length}社（メール${source.entries.filter((e) => e.channel !== 'form').length}／フォーム${forms.length}）`);
