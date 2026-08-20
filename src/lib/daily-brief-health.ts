/**
 * Λ-1: 朝ブリーフィング（docs/daily-brief.md）への収益導線生存監視。
 *
 * なぜ: 24時間稼働のloopは、収益導線を壊すコード変更をしても誰も気づかないまま
 * 数日間サイレント破損が走るリスクがある（前科=AdSense審査用auditHideが保護者リード
 * CTAを全非表示にしていた自傷・[[session-2026-07-04-affiliate-ev-optimization]]）。
 *
 * ⚠️2026-07-31 設計変更（誤検知の是正）:
 * 初版はGA4イベントの前日ゼロで🔴を出していたが、これは実測で誤りと判明した。
 * GA4は Consent Mode と離脱時のビーコン欠損で **収益系イベントを大幅に取りこぼす**:
 *   - stats_submit_ok  : GA4 7/27=0件 に対し D1実データは 25件
 *   - line_friend_click: GA4 週6件 に対し LINE友だち実数は10日で+17人
 *   - lead_submit      : GA4 週0件 に対し 実リードは同期間に +1件
 * 送信自体は `keepalive: true` で成功するのに、その直後の trackEvent がページ離脱で
 * 実行されないため「着弾したが計測だけ失われる」ことが構造的に起きる。
 *
 * したがって:
 *   - **判定の主語はD1の真値**（サーバ側で確定した件数）。ここが枯れたら本物の異常。
 *   - **GA4は「下限値」として参考表示のみ**。GA4のゼロを根拠に🔴を出さない。
 *   - 日次はバースト的にゼロになるのが正常なので、**D1は7日窓の合計**で見る。
 * 誤検知を消すことは留守番モード（Λ-21）の前提でもある。オオカミ少年になった監視は、
 * 「赤なら家族に電話」という運用そのものを無効化する。
 */

/** GA4由来のイベント件数（クライアント計測＝取りこぼしがあるため下限値として扱う）。 */
export interface EventHealthCounts {
  cta_view: number;
  lead_submit: number;
  line_friend_click: number;
  affiliate_click: number;
}

/** D1由来の確定値（サーバ側で書き込みが成立した件数＝真値）。 */
export interface TruthCounts {
  /** 直近7日の匿名統計投稿数（データバンクの流入＝複利資産の入口）。 */
  statsSubmissions7d: number;
  /** 直近7日の名簿登録数。 */
  leads7d: number;
  /** 累計の匿名統計投稿数（Ω-1の到達点を毎朝可視化する）。 */
  statsSubmissionsTotal: number;
}

/**
 * 脅威13(TH-13・2026-08-20発見)のクリック不正バースト検知結果（前日分・
 * `scripts/lib/click-fraud-detector.mjs`と同じ判定ロジックを使う）。
 * 取得自体に失敗した場合は null（判定は保留＝既存のstatus判定を悪化させない）。
 */
export interface ClickFraudCheck {
  date: string;
  total: number;
  distinctIp: number;
  distinctUa: number;
  ipRatio: number;
  flagged: boolean;
}

export const HEALTH_EVENT_NAMES: (keyof EventHealthCounts)[] = [
  'cta_view',
  'lead_submit',
  'line_friend_click',
  'affiliate_click',
];

export type HealthStatus = 'ok' | 'caution' | 'alert';

export interface HealthInput {
  /** 前日のGA4イベント件数（下限値）。 */
  ga4: EventHealthCounts;
  /** D1から取得した確定値。取得できなかった場合は null（その場合🔴判定は行わない）。 */
  truth: TruthCounts | null;
  /** TH-13クリック不正バースト検知（前日分）。省略/取得できなかった場合はnull扱い（判定に影響させない）。 */
  clickFraud?: ClickFraudCheck | null;
}

/**
 * 生存監視の判定。
 *
 * - `alert`  : D1の7日窓で統計投稿がゼロ＝データバンクの流入が本当に止まっている
 * - `caution`: D1は健全だがGA4の cta_view が前日ゼロ（高頻度イベントなので要確認。
 *              ただし計測欠損の可能性が高く、単独では異常と断定しない）
 * - `ok`     : 上記以外
 *
 * D1が取得できなかった場合（truth=null）は判定材料が無いため `caution` 止まりにする。
 * 「分からない」を「異常」に丸めない（それが初版の誤りだった）。
 */
export function judgeHealth(input: HealthInput): HealthStatus {
  const { ga4, truth, clickFraud } = input;
  if (truth === null) return 'caution';
  if (truth.statsSubmissions7d === 0) return 'alert';
  if (ga4.cta_view === 0) return 'caution';
  if (clickFraud?.flagged) return 'caution';
  return 'ok';
}

const STATUS_LABEL: Record<HealthStatus, string> = {
  ok: '🟢 正常',
  caution: '🟡 要確認（計測欠損の可能性あり・単独では異常と断定しない）',
  alert: '🔴 異常（D1の7日窓で統計投稿がゼロ＝流入が止まっている）',
};

/** 実測件数から生存監視セクションのMarkdownを組み立てる（外部APIに依存しない純関数）。 */
export function buildHealthSection(input: HealthInput, dateLabel: string): string {
  const { ga4, truth, clickFraud } = input;
  const status = judgeHealth(input);

  const truthLines = truth
    ? [
        `- \`stats_submissions\`（7日）: **${truth.statsSubmissions7d.toLocaleString('en-US')}件**${truth.statsSubmissions7d === 0 ? ' ⚠️ゼロ' : ''}`,
        `- \`leads\`（7日）: **${truth.leads7d.toLocaleString('en-US')}件**`,
        `- \`stats_submissions\`（累計）: **${truth.statsSubmissionsTotal.toLocaleString('en-US')}件**`,
      ]
    : ['- ⚠️ D1から確定値を取得できなかった（判定は保留＝🟡）'];

  const ga4Lines = HEALTH_EVENT_NAMES.map(
    (name) => `- \`${name}\`: ${ga4[name].toLocaleString('en-US')}件以上`
  );

  const clickFraudLines = clickFraud
    ? [
        clickFraud.flagged
          ? `- ⚠️ **クリック不正の疑いあり**（総クリック${clickFraud.total}件・distinct IP比率${clickFraud.ipRatio.toFixed(2)}・distinct UA${clickFraud.distinctUa}種類。詳細は\`ops/THREATS.md\`脅威13）`
          : `- クリック不正の兆候なし（総クリック${clickFraud.total}件）`,
      ]
    : ['- （D1から取得できなかったため今回はチェック未実施）'];

  return [
    `## ⚡収益導線の生存監視（自動・${dateLabel}時点・Λ-1）`,
    '',
    `**${STATUS_LABEL[status]}**`,
    '',
    '### 確定値（D1・判定はこちらで行う）',
    '',
    ...truthLines,
    '',
    '### 参考値（GA4・前日／**下限値**）',
    '',
    'GA4はConsent Modeと離脱時のビーコン欠損で収益系イベントを取りこぼす（実測で',
    'D1 25件に対しGA4 0件の日がある）。**ここのゼロは異常の証拠にならない。**',
    '',
    ...ga4Lines,
    '',
    '### クリック不正バースト検知（前日・TH-13）',
    '',
    ...clickFraudLines,
    '',
  ].join('\n');
}

/**
 * Λ-21（留守番モード・第1層）向けのDiscord通知本文を組み立てる純関数。
 *
 * ⚠️重要: Λ-21のバックログ本文には「前日のcta_view等のいずれかがゼロなら赤」という
 * 古い判定条件が書かれているが、これはΛ-1が2026-07-31に自ら誤検知（オオカミ少年）と
 * 認定して撤回した判定方式そのもの（[[ga4-undercounts-conversions]]・
 * fable5-loop-protocolの「GA4のゼロをアラート条件に使わない」教訓）。ここでは古い
 * バックログ記述より新しい教訓を優先し、既存のjudgeHealth()（D1真値ベース・GA4は
 * 参考値止まり）をそのまま再利用する。二重の判定基準を作らない。
 */
export function buildDiscordMessage(input: HealthInput, dateLabel: string): string {
  const status = judgeHealth(input);
  const { truth, clickFraud } = input;
  const truthLine = truth
    ? `stats_submissions(7日)=${truth.statsSubmissions7d}件 / leads(7日)=${truth.leads7d}件`
    : 'D1から確定値を取得できず（判定保留）';
  const lines = [`${STATUS_LABEL[status]}（${dateLabel}時点・My Naishin 収益導線監視）`, truthLine];
  if (clickFraud?.flagged) {
    lines.push(`⚠️ クリック不正の疑い(TH-13): ${clickFraud.date} 総クリック${clickFraud.total}件`);
  }
  lines.push('詳細: docs/daily-brief.md');
  return lines.join('\n');
}

/**
 * JSTの「昨日」の日付を返す。
 *
 * 毎朝7:30 JST（=前日22:30 UTC）にcron実行されるため、UTC基準で「昨日」を計算すると
 * JSTの2日前を指してしまう（2026-08-14判明・[[fable5-loop-protocol]]記録済み）。
 * GA4プロパティの集計タイムゾーンもJSTのため、この関数の出力をそのままGA4クエリの
 * dateRangeとブリーフィングの表示ラベルの両方に使う。
 */
export function yesterdayJst(): string {
  const jstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  jstNow.setUTCDate(jstNow.getUTCDate() - 1);
  return jstNow.toISOString().slice(0, 10);
}

const SECTION_START = '<!-- LAMBDA1_HEALTH_START -->';
const SECTION_END = '<!-- LAMBDA1_HEALTH_END -->';

/**
 * docs/daily-brief.mdの本文へ生存監視セクションを冪等に挿入・更新する。
 * 既存のマーカーコメントがあれば置換、無ければ最初の見出し(`# `)の直後に新規挿入する。
 */
export function injectHealthSection(fileContent: string, sectionBody: string): string {
  const wrapped = `${SECTION_START}\n${sectionBody}${SECTION_END}`;
  if (fileContent.includes(SECTION_START) && fileContent.includes(SECTION_END)) {
    const startIdx = fileContent.indexOf(SECTION_START);
    const endIdx = fileContent.indexOf(SECTION_END) + SECTION_END.length;
    return fileContent.slice(0, startIdx) + wrapped + fileContent.slice(endIdx);
  }
  const lines = fileContent.split('\n');
  const titleIdx = lines.findIndex((l) => l.startsWith('# '));
  if (titleIdx === -1) return `${wrapped}\n\n${fileContent}`;
  lines.splice(titleIdx + 1, 0, '', wrapped);
  return lines.join('\n');
}
