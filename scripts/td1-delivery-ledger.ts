#!/usr/bin/env -S npx tsx
/**
 * T-TD1 TD-0: 「2月当日に本当に納品できるか」の県別台帳を、リポジトリ内の実データだけから生成する。
 * 出力: ops/baselines/td1-delivery-capability-2026-09.md（手で数字を打たない・再実行で再生成できる）
 *
 * 使い方: npx tsx scripts/td1-delivery-ledger.ts   （ネットワークアクセスなし）
 *
 * 区分の定義（甘く数えない）:
 *   A = 確定パーサがR8実PDFのリプレイでR8データと一致(registry登録・validate-all-registered OK)
 *       かつ 公表ハブ台帳(publication-hubs.ts)でR9の掲載位置が判明している県
 *   B = 確定パーサはあるが、R9の公表位置(ハブ)が未特定＝当日の位置探しに手作業が入る県
 *   C = 上記いずれでもない(パーサ無し・ビジョン転記が必要・WAF/robotsで取得不可 等)
 */
import fs from 'node:fs';
import { DATA_LICENSE_LEDGER } from '../src/lib/data-license-ledger';
import { PREFECTURE_PARSER_REGISTRY } from '../src/lib/bairitsu-ingest/registry';
import { COMPETITION_RATE_BY_PREFECTURE } from '../src/data/competition-rates';
import { EXAM_SCHEDULE_BY_PREFECTURE } from '../src/data/exam-schedules';
import { INTERIM_BULLETIN_REGISTRY } from '../src/data/interim-rate-bulletin-registry';
import { PUBLICATION_HUBS } from '../src/data/publication-hubs';
import { PREFECTURES } from '../src/lib/prefectures';

type Klass = 'A' | 'B' | 'C';

/** C県の理由。パーサが無い県は、なぜ無いかを実データ(R8の取り込み方式)から一言で書く。 */
const C_REASON: Record<string, string> = {
  hokkaido: 'R8の収録元が「入学者選抜状況報告書(受検者・合格者)」で出願時点の倍率ではない。2月の出願状況は別資料でパーサ無し',
  fukushima: '確定パーサ未登録(runbook「未パイプライン化11県」)。R8は別方式で収録',
  tokyo: '確定パーサ未登録(未パイプライン化11県)。R8は最終応募状況を別方式で収録',
  kanagawa: '確定パーサ未登録。速報xlsxは機械パース済み(replay-interim-kanagawa)だが、志願変更後版が同形式かは未検証',
  aichi: '確定パーサ未登録。pref.aichi.jpはImperva/Incapsulaでbot対策(HEADを302で中継)＝取得失敗の前科(W-8)',
  mie: '確定パーサ未登録(未パイプライン化11県)',
  osaka: '確定パーサ未登録。xlsxパーサはあるが単一学科校のみ(165件中96件・複数学科27件はスキップ)で全件は通らない',
  hyogo: 'robots.txtが拒否＝そもそも取得しない県(検知器も対象外)。パーサも未登録',
  okayama: '確定パーサ未登録(未パイプライン化11県)',
  yamaguchi: '確定パーサ未登録(未パイプライン化11県)',
  miyazaki: '確定パーサ未登録(未パイプライン化11県)',
};

const watch = JSON.parse(fs.readFileSync('ops/state/competition-rate-watch.json', 'utf8')).entries as Record<
  string,
  { fingerprint?: string; lastStatus?: string }
>;

function lastModified(code: string): string {
  const raw = (watch[code]?.fingerprint ?? '').split('|')[1];
  if (!raw) return '不明';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '不明';
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return `${jst.getUTCFullYear()}-${String(jst.getUTCMonth() + 1).padStart(2, '0')}-${String(jst.getUTCDate()).padStart(2, '0')}`;
}

function finalityOf(title: string): string {
  if (/変更前|速報/.test(title)) return '速報(志願変更前)';
  if (/変更後|最終|確定|調整後|本出願/.test(title)) return '確定(志願変更後・最終)';
  return '出願状況(時点は資料名から判別不可)';
}

/**
 * R9日程DBのうち「一般(全日制)選抜の志願変更、無ければ出願の締切」にあたるイベントのラベル(部分一致)。
 * 各県のR9イベント一覧(EXAM_SCHEDULE_BY_PREFECTURE)を目視で読んで選んだ。DBに存在しないラベルを書くと
 * 実行時に例外で止まる(=日付を手で打たず、必ずDBから引く)。null=R9日程に該当する出願・変更の締切が無い。
 */
const BASELINE_LABEL: Record<string, string | null> = {
  hokkaido: null, aomori: '出願先変更 受付期限', iwate: null, miyagi: null, akita: null, yamagata: null, fukushima: null,
  ibaraki: null, tochigi: '出願変更期間', gunma: '志願先変更期間（第2回）', saitama: '志願先変更期間', chiba: null,
  tokyo: '学力検査に基づく選抜（第一次募集・分割前期募集） 出願受付期間', kanagawa: '志願変更情報申請期間',
  niigata: '一般選抜 志願変更', toyama: '一般 志願期間', ishikawa: '一般入学 志願変更期間', fukui: '志願変更',
  yamanashi: '後期募集 出願期間', nagano: '後期選抜 志望変更受付期間', gifu: '第一次選抜 変更期間', shizuoka: '志願変更受付',
  aichi: '一般選抜 志願変更期日', mie: null, shiga: '一次募集 出願変更期間', kyoto: '前期選抜・特別入学者選抜 出願期間',
  osaka: '出願期間', hyogo: null, nara: '一次選抜 第二出願期間', wakayama: '一般選抜・スポーツ推薦 本出願受付',
  tottori: null, shimane: null, okayama: '一般入学者選抜（全日制・定時制） 出願の期間', hiroshima: '志願変更',
  yamaguchi: '第一次募集 出願期間', tokushima: '一般選抜 志願変更', kagawa: null, ehime: null, kochi: 'A日程 志願先変更期間',
  fukuoka: '一般入学者選抜 志願先変更受付', saga: '一般選抜 志願変更届', nagasaki: '一般選抜 入学願書受付',
  kumamoto: '後期（一般）選抜 出願変更', oita: '一般入学者選抜 第一志願志願変更期間', miyazaki: null, kagoshima: null,
  okinawa: '志願変更取り下げ・再出願',
};

function r9Baseline(code: string): { date: string | null; label: string } {
  const y = EXAM_SCHEDULE_BY_PREFECTURE[code]?.years.find((x) => x.fiscalYear.includes('令和9'));
  if (!y || y.events.length === 0) return { date: null, label: '未公表(R9日程DB未収録)' };
  const want = BASELINE_LABEL[code];
  if (want === undefined) throw new Error('BASELINE_LABEL未定義: ' + code);
  if (want === null) return { date: null, label: 'R9日程DBに出願・変更の締切なし(検査日のみ等)' };
  const pick = y.events.find((e) => e.label.includes(want));
  if (!pick) throw new Error('R9日程DBに該当イベントなし: ' + code + ' / ' + want);
  const end = pick.endDate ?? pick.startDate;
  return { date: end, label: pick.label + ' の締切 ' + end };
}

const hubKnown = new Set(PUBLICATION_HUBS.filter((h) => h.r9Url).map((h) => h.prefecture));

interface Row {
  code: string;
  name: string;
  klass: Klass;
  reason: string;
  license: string;
  finality: string;
  r8Date: string;
  r9Base: string;
  r9Month: string;
  interim: string;
}
const rows: Row[] = [];
for (const p of PREFECTURES) {
  const code = p.code;
  const hasParser = !!PREFECTURE_PARSER_REGISTRY[code];
  const hub = hubKnown.has(code);
  const klass: Klass = hasParser ? (hub ? 'A' : 'B') : 'C';
  const led = DATA_LICENSE_LEDGER[code];
  const cr = COMPETITION_RATE_BY_PREFECTURE[code];
  const r8src = (cr?.sources ?? []).filter((s) => s.fiscalYear.includes('令和8'));
  const ib = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === code);
  const interim = ib
    ? `${ib.status === 'confirmed-multistage' ? '別公表あり' : ib.status}${
        ib.interimIncludesRate === true ? '・倍率あり' : ib.interimIncludesRate === false ? '・倍率なし(出願者数のみ)' : '・倍率有無未確認'
      }`
    : '調査対象外';
  const base = r9Baseline(code);
  const monthLabel = base.date ? (base.date <= '2027-02-28' ? '2月中' : '3月') : '不明';
  let reason: string;
  if (klass === 'A')
    reason =
      '確定パーサあり(R8リプレイOK)＋ハブ台帳にR9掲載位置あり。ハブ監視は年度ページの出現まで自動・PDF本体の特定〜変換は当日の作業';
  else if (klass === 'B') reason = '確定パーサあり(R8リプレイOK)。R9の掲載位置(ハブ)が未特定＝当日は位置探しから手作業';
  else reason = C_REASON[code] ?? '確定パーサ未登録';
  rows.push({
    code,
    name: p.name,
    klass,
    reason,
    license: led?.redistribution ?? 'unknown',
    finality: finalityOf(r8src.map((s) => s.docTitle).join(' ')),
    r8Date: lastModified(code),
    r9Base: base.label,
    r9Month: monthLabel,
    interim,
  });
}

const count = (f: (r: Row) => boolean) => rows.filter(f).length;
const names = (f: (r: Row) => boolean) => rows.filter(f).map((r) => r.code).join(' / ') || 'なし';
const A = count((r) => r.klass === 'A');
const B = count((r) => r.klass === 'B');
const C = count((r) => r.klass === 'C');
const licOk = count((r) => r.license === 'ok');
const licNg = count((r) => r.license === 'ng');
const abLicOk = count((r) => r.klass !== 'C' && r.license === 'ok');
const aLicOk = count((r) => r.klass === 'A' && r.license === 'ok');
const abFeb = count((r) => r.klass !== 'C' && r.r9Month === '2月中');
const abLicOkFeb = count((r) => r.klass !== 'C' && r.license === 'ok' && r.r9Month === '2月中');

const L: string[] = [];
L.push('# T-TD1 TD-0: 令和9年度 倍率速報「2月当日に本当に納品できるか」県別台帳');
L.push('');
L.push('生成: `npx tsx scripts/td1-delivery-ledger.ts`（リポジトリ内の実データのみ・ネットワークなし・再実行で再生成）。**手で数字を打っていない。**');
L.push('基準日: 2026-09-24。');
L.push('');
L.push('## 1. 集計（先に結論）');
L.push('');
L.push('| 指標 | 県数 | 内訳 |');
L.push('|---|---:|---|');
L.push(`| A（当日に機械で反映できる） | ${A} | ${names((r) => r.klass === 'A')} |`);
L.push(`| B（パーサはあるが当日の掲載位置探しに手作業が入る） | ${B} | ${names((r) => r.klass === 'B')} |`);
L.push(`| C（できない） | ${C} | ${names((r) => r.klass === 'C')} |`);
L.push(`| **A+B（技術的に納品対象にできる県）** | **${A + B}** | |`);
L.push(`| 再配布の許諾が台帳で確認済み(ok) | ${licOk} | ${names((r) => r.license === 'ok')} |`);
L.push(`| 再配布を断られた(ng) | ${licNg} | ${names((r) => r.license === 'ng')} |`);
L.push(`| 未確認(unknown・fail-closedで売り物から外す) | ${47 - licOk - licNg} | 返信待ち・接触経路なし等（\`src/lib/data-license-ledger.ts\`の各evidence参照） |`);
L.push(
  `| **A+B かつ 許諾ok（反証条件(d)の数え方）** | **${abLicOk}** | ${names((r) => r.klass !== 'C' && r.license === 'ok')}（うちA=${aLicOk}県: ${names(
    (r) => r.klass === 'A' && r.license === 'ok'
  )}） |`
);
L.push(`| 参考: A+B のうちR9の基準日が2月中の県 | ${abFeb} | 3月にずれ込む県は「2月に届く」とは書けない |`);
L.push(`| 参考: A+B かつ許諾ok かつ 基準日が2月中 | ${abLicOkFeb} | ${names((r) => r.klass !== 'C' && r.license === 'ok' && r.r9Month === '2月中')} |`);
L.push('');
L.push('### 反証条件(d)の判定（正直に）');
L.push('');
L.push('- 反証条件(d)は「公表当日に **30県未満** しか反映できない → 「速報」を名乗れない」。T-TD1のTD-0は **「A+Bかつ配布可」で数える** と定めている。');
L.push(`- 技術面だけなら A+B = **${A + B}県**（30県以上）。しかし **再配布の許諾が台帳で確認できているのは ${licOk}県だけ** で、A+Bと重なるのは **${abLicOk}県**（**30県に届かない**）。`);
L.push(
  `- したがって、この数え方に厳密に従うと **(d)は「成立（=速報を名乗れない）」側**。「47県完全対応」はもちろん「30県以上」とも書けない。書ける最大は **「許諾確認済みの${abLicOk}県は公表当日に反映、それ以外の県は許諾の確認が取れ次第追加」**。`
);
L.push(
  `- ⚠️ **「配布可」の定義が2つあり、混同されていた**: ①\`data-license-ledger.ts\`の\`redistribution==="ok"\`（県教委が書面で許諾）＝${licOk}県。②\`licensableRecords()\`＝「商用第三者資料のみを出典とするレコードを除く」＝旺文社PoCの「配布可21,548件」の根拠で、47県中46県が該当（**許諾の有無は見ていない**）。**T-TD1の指示は①を採用**（許諾が確認できない県は売り物から外す）。②を根拠に「30県以上」と書くのは、許諾を取っていない県の再配布を売り物にすることになるので**書かない**。`
);
L.push('- 👤の判断が要る点: 許諾が未確認の県のうち、返信待ちの県の回答が10〜12月に届けば数字は増える。**30に届かない限り「30県以上」と書かず、県名を列挙して売る**（買い手の欲しい県が含まれているかを先に確認できる形）。');
L.push('');
L.push('## 2. 区分の定義（甘く数えない）');
L.push('');
L.push('- **A**: 確定パーサがR8の実PDFのリプレイでR8データと一致（`registry.ts`登録・`validate-all-registered.ts`でOK）**かつ** `publication-hubs.ts`でR9の掲載位置(`r9Url`)が判明している県。');
L.push('  - ⚠️ Aでも**人手ゼロではない**: ハブ監視(`watch-hubs.mjs`)は年度ページ(1段目)の出現までしか自動で拾えず、PDF本体の特定→変換→検算は当日の作業（2〜3段構成・T-Y11F F-3の実測）。**当日=👤のProセッションを回した当日**。');
L.push('  - ⚠️ 速報(志願変更前)は別: 千葉・埼玉・広島・静岡の速報「パーサ」は**ビジョン目視転記の固定データ**であり機械パースではない。機械で通るのは大阪・神奈川のxlsxのみ（大阪は単一学科校のみ）。よって**志願変更前の速報を機械で当日反映できる県は0**と数える。本パックの「速報」は「志願変更後の最新の倍率(確定パーサの対象資料)」を指す。');
L.push('- **B**: 確定パーサはあるが、R9の掲載位置が未特定。公表を検知したうえでURLを探す手作業が入る。');
L.push('- **C**: パーサ未登録・ビジョン必須・WAF/robots等。**当日納品は約束しない**。');
L.push('- ⚠️ 「R7/R8で実データを通して合格」の実態: 確定パーサのリプレイ根拠は**R8のPDF geometryフィクスチャ1年分**（36ファイル）。R7のレコード再現は検証していない（R7で取ったのは選抜方法のpdfHashのみ）。したがって**R7でも通るかは未検証**。');
L.push('- ⚠️ 「当日」の意味: 公表は平日日中が多く、👤は学校にいる。**機械の作業は当日で終わるが、納品は👤の作業後**。売り文句としての約束時刻は TD-9（運用手順書）と ONE-PAGER で決める（👤確定待ち）。');
L.push('');
L.push('## 3. 県別台帳（47県）');
L.push('');
L.push(
  '列: 区分 / 再配布許諾(台帳) / R8の収録資料の種別(資料名から機械判定) / R8資料の最終更新日(HTTP Last-Modified・初公表日とは限らない) / R9の基準日(R9日程DBの志願変更または出願の締切・**県が公表予定日を事前告知しているわけではない**) / 基準日の月 / 志願変更前の速報の別公表(interim台帳) / 理由。'
);
L.push('');
L.push('| 県 | 区分 | 許諾 | R8収録資料の種別 | R8資料の最終更新 | R9の基準日 | 月 | 志願変更前の速報 | 理由 |');
L.push('|---|:-:|:-:|---|---|---|:-:|---|---|');
for (const r of rows) {
  L.push(`| ${r.name}(${r.code}) | ${r.klass} | ${r.license} | ${r.finality} | ${r.r8Date} | ${r.r9Base} | ${r.r9Month} | ${r.interim} | ${r.reason} |`);
}
L.push('');
L.push('## 4. 必ず理由を書くと指示された県');
L.push('');
for (const code of ['aichi', 'hyogo']) {
  const r = rows.find((x) => x.code === code)!;
  L.push(`- **${code} = ${r.klass}**: ${r.reason}`);
}
L.push('');
L.push('## 5. 売り込み文に反映すること（TD-2以降の書き方を縛る）');
L.push('');
L.push(`1. 「47県対応」「30県以上」とは書かない。**納品対象は許諾確認済みの県だけ**と明記し、県名を列挙する（現時点 ${abLicOk}県）。`);
L.push('2. 「2月に届く」と書けるのは基準日が2月中の県だけ。3月にずれる県は「変更締切(3月)後の当日」と書く。');
L.push('3. B県は「公表から◯日以内」（当日ではない）。数字は TD-9 の実測（未測定）が入るまで「営業日ベースの目安・未測定」と書く。');
L.push('4. C県は「納品しない」と明記する。買い手が欲しい県がCなら、その時点で見積もりから外す。');
L.push('');
fs.writeFileSync('ops/baselines/td1-delivery-capability-2026-09.md', L.join('\n') + '\n', 'utf8');
console.log({ A, B, C, licOk, licNg, abLicOk, aLicOk, abFeb, abLicOkFeb });
