/**
 * 能動運用ロードマップの目盛りゲート G0〜G6（2026-07-11会話・収益試算v2アーティファクトの正準化）。
 *
 * 北極星：現状運用のまま（保守〜強気）と能動運用（努力〜最高）の差はほぼ全額が👤ゲート
 * （名簿velocity・直接契約・API営業）から来る（[[session-2026-07-11-revenue-forecast-roadmap]]）。
 * ここは各月末の目盛りを実測と突き合わせ、努力軌道／最高軌道のどちらに乗っているかを
 * 機械的に判定する純関数群。¥予測はしない＝実測（すでに起きたこと）だけを評価する
 * （[[no-revenue-projections-guideline]]の対象は「予測」であり「実績」ではないため、
 * 本ファイルはASP/契約/APIの実測¥を扱う＝evaluateJulyGate等と同じ「実測のみ」原則）。
 *
 * G0（ASP発生>0の反証ゲート）は既存 evaluateJulyGate と完全に同一ロジックのため重複させない
 * （weekly-kpi-report.ts で両方呼び出し、本ファイルはG1以降のみを扱う）。
 */

import { AFFILIATES, isLiveAffiliate, type AffiliateId } from '@/lib/affiliates';

export type GateStatus =
  | 'upcoming' // 判定日前
  | 'on-track-max' // 判定日到達・最高軌道の基準を満たす
  | 'on-track-effort' // 判定日到達・努力軌道の基準は満たすが最高には届かない
  | 'behind' // 判定日到達・努力軌道にも届かない
  | 'manual-check' // 数値でなくチェックリスト系（自動判定不可・👤確認が必要）
  | 'unmeasured'; // 判定日到達だが実測値が渡されていない

export interface RoadmapGateActuals {
  /**
   * D1 leads の累計（unsubscribed除く）。**これ単独では「名簿」ではない**。
   *
   * ⚠️2026-08-07修正: 以前はこの値だけでG1/G5の「名簿N」を判定していたが、
   * 実運用の名簿の大半は**LINE友だち**であり、D1 leadsはごく一部（2026-08-07実測で
   * LINE 55人に対しD1 leads 6件）。この状態でG1を判定すると `N=6` で `behind` となり、
   * missedAction「Aレバー（名簿）縮小・B（直接契約）へ重心移動」＝**実際には伸びている
   * チャネルを畳む戦略転換が誤発火する**。G1/G5は必ず lineFriends と合算して判定する。
   */
  rosterN?: number;
  /**
   * LINE公式アカウントの友だち数（累計・ブロック除く）。G1/G5で rosterN と合算する。
   *
   * LINE Messaging APIでは自動取得できない指標のため、👤が手動で `data/line-friends.json`
   * に記録する（[[roster-line-friends]]）。**未記録のまま判定に進まないこと**——
   * 欠けている場合は `behind` ではなく `unmeasured` を返す設計にしてある。
   */
  lineFriends?: number;
  /** 当月のASP発生件数（絶対条件・G4）。0件明示のみ measured=trueとして扱う。 */
  conversionsThisMonth?: number;
  /** 当月のC_p（保護者起点クリック=parent_landing_view）合計。G4。 */
  cpThisMonth?: number;
  /** 稼働中の直接契約社数。G3/G5。 */
  contractCount?: number;
  /** 直接契約の月額合計（¥・実測請求額）。G5。 */
  contractsMrr?: number;
  /** API有料顧客数。G3。 */
  apiCustomers?: number;
  /** API課金の月額合計（¥・実測）。G5。 */
  apiMrr?: number;
  /** シーズン累計の確定額（¥・アフィリ確定+契約+API等を合算した実測。ASP/契約/API管理画面から手集計）。G5/G6。 */
  cumulativeConfirmedYen?: number;
  /** G2（冬案件ASP申請＋S-3インデックス確認）が完了したかの👤確認。 */
  g2Confirmed?: boolean;
}

export interface RoadmapGateDefinition {
  id: string;
  dateIso: string;
  label: string;
  metricLabel: string;
  /** 努力軌道の基準を1行で説明（表示用）。 */
  effortTargetLabel: string;
  /** 最高軌道の基準を1行で説明（表示用）。 */
  maxTargetLabel: string;
  /** 未達時のアクション（表示用）。 */
  missedAction: string;
}

/**
 * G1/G5の「名簿N」＝ LINE友だち数 ＋ D1 leads累計。
 *
 * **どちらか一方でも欠けていたら null を返す**のが本関数の要点。片方だけの数字で判定すると
 * 実態の1/10で `behind` を出し、missedAction（名簿レバー縮小）が誤発火するため
 * （2026-08-07の実測: LINE 55 / D1 leads 6 ＝ D1だけ見ると実態の11%）。
 */
export function rosterTotalOf(actuals: RoadmapGateActuals): { total: number; breakdown: string } | null {
  const { lineFriends, rosterN } = actuals;
  if (lineFriends === undefined || rosterN === undefined) return null;
  return {
    total: lineFriends + rosterN,
    breakdown: `（LINE${lineFriends}＋D1 leads${rosterN}）`,
  };
}

/** 名簿Nが判定不能なときに、どちらが欠けているかを明示する。 */
export function unmeasuredRosterDetail(actuals: RoadmapGateActuals): string {
  const missing: string[] = [];
  if (actuals.lineFriends === undefined) missing.push('LINE友だち数（data/line-friends.jsonに👤が記録）');
  if (actuals.rosterN === undefined) missing.push('D1 leads累計');
  return `名簿Nが未計測＝${missing.join(' / ')}が不足。**片方だけで判定しない**（実態の約1/10で誤ってbehindになるため）`;
}

/** 目盛りゲート G1〜G6（正準・単一ソース。2026-07-11ロードマップ artifact と同一の日付・数値）。 */
export const ROADMAP_GATES: RoadmapGateDefinition[] = [
  {
    id: 'g1-roster-velocity',
    dateIso: '2026-08-31',
    label: 'G1 名簿velocity',
    metricLabel: '名簿累計N（LINE友だち数 ＋ D1 leads総数）',
    effortTargetLabel: 'N ≥ 100（≈20/週ペース）',
    maxTargetLabel: 'N ≥ 150（≈40/週ペース）',
    missedAction: 'Aレバー（名簿）縮小・B（直接契約）へ重心移動',
  },
  {
    id: 'g2-winter-prep',
    dateIso: '2026-09-30',
    label: 'G2 冬案件申請＋S-3インデックス',
    metricLabel: '冬期講習/直前案件ASP申請完了＋S-3面のインデックス確認（数値でなくチェック項目）',
    effortTargetLabel: '申請完了',
    maxTargetLabel: '申請完了＋特単候補の選定済',
    missedAction: 'Eレバー（冬アフィリ）期待値を半減して再計画',
  },
  {
    id: 'g3-contract-api',
    dateIso: '2026-10-31',
    label: 'G3 直接契約／API',
    metricLabel: '契約社数・API顧客数',
    effortTargetLabel: '契約1社 or API1社',
    maxTargetLabel: '契約1社稼働＋API1社',
    missedAction: 'Bは来季送り・A/Eへ集中',
  },
  {
    id: 'g4-cp-november',
    dateIso: '2026-11-30',
    label: 'G4 C_p実測（11月）',
    metricLabel: 'C_p/月（＋ASP発生>0が絶対条件）',
    effortTargetLabel: 'C_p ≥ 40（N≈400）',
    maxTargetLabel: 'C_p ≥ 100（N≈620）',
    missedAction: '発生0なら全シナリオを保守側へ再校正',
  },
  {
    id: 'g5-december-close',
    dateIso: '2026-12-25',
    label: 'G5 窓フル回収',
    metricLabel: '名簿N／契約MRR＋APIMRR／シーズン累計確定額',
    effortTargetLabel: 'N≈540・契約1社・累計¥24万',
    maxTargetLabel: 'N≈880・MRR計¥10万/月・累計¥62万',
    missedAction: '1-2月は在庫最適化のみに切替',
  },
  {
    id: 'g6-february-check',
    dateIso: '2027-02-28',
    label: 'G6 実測照合',
    metricLabel: 'シーズン累計確定額',
    effortTargetLabel: '≈¥56万',
    maxTargetLabel: '≈¥160万',
    missedAction: '実測でモデルを置換・来季計画へ',
  },
];

/**
 * G2の機械検出補助（T-6・部分的）。
 *
 * G2（冬案件ASP申請＋S-3インデックス確認）は「数値でなくチェック項目」のため本来👤確認が必要だが、
 * 「冬期講習/直前案件のASP申請完了」の半分（ASP申請→承認→live化）は、affiliates.tsの
 * pending枠（winter-koushuu-trial/last-minute-trial）がisLiveAffiliate()でlive判定できるかを見れば
 * 機械検出できる。S-3インデックス確認（GSC実測）は依然👤確認が必要なため置き換えず、
 * g2Confirmedのそばに補助情報として添えるだけ（👤の最終判断を上書きしない）。
 */
export const WINTER_SEASONAL_AFFILIATE_IDS: AffiliateId[] = ['winter-koushuu-trial', 'last-minute-trial'];

export interface WinterAffiliateReadiness {
  id: AffiliateId;
  name: string;
  live: boolean;
}

/** 冬季アフィリ枠（pending先回し）ごとのlive化状況を実データ（affiliates.ts）から検出する。 */
export function detectWinterAffiliateReadiness(
  ids: AffiliateId[] = WINTER_SEASONAL_AFFILIATE_IDS
): WinterAffiliateReadiness[] {
  return ids.map((id) => ({ id, name: AFFILIATES[id]?.name ?? id, live: isLiveAffiliate(id) }));
}

/** 「N/M件live化」の1行サマリ（週次KPIメール・admin/report向け）。 */
export function winterAffiliateReadinessSummary(ids: AffiliateId[] = WINTER_SEASONAL_AFFILIATE_IDS): string {
  const readiness = detectWinterAffiliateReadiness(ids);
  const liveCount = readiness.filter((r) => r.live).length;
  const names = readiness.map((r) => `${r.name}${r.live ? '✅live' : '未申請/承認待ち'}`).join('・');
  return `冬季アフィリ${liveCount}/${readiness.length}件live化（${names}）`;
}

/**
 * B2Bアウトリーチ送信ログ（U-1/U-2成果の実行記録・👤実施・履歴として追記していく）。
 *
 * G3（直接契約／API）判定の補助情報として表示するだけで、contractCount/apiCustomers
 * （実際に成約した数）を置き換えるものではない＝「送信した」と「成約した」は別の事実
 * （捏造ゼロ・実測のみ原則）。送信するたびにこの配列へ1エントリ追記する運用。
 */
export interface B2bOutreachLogEntry {
  dateIso: string;
  count: number;
  note: string;
}

export const B2B_OUTREACH_LOG: B2bOutreachLogEntry[] = [
  {
    dateIso: '2026-07-12',
    count: 20,
    note: 'API/データ連携アウトリーチ（MONETIZATION.md§6のA/B/C/F/G/H区分20社・docs/b2b-outreach-ready-2026-07.md使用）を送信完了。返信・成約は未計測。',
  },
  {
    dateIso: '2026-07-17',
    count: 9,
    note: 'W-1（B2B弾薬工場）経由の送信。返信・成約は未計測。',
  },
  {
    dateIso: '2026-07-18',
    count: 4,
    note: 'W-1経由の送信。返信・成約は未計測。',
  },
  {
    dateIso: '2026-08-06',
    count: 33,
    note: 'X-14（一次ソースアーカイブ関連）・X-6（NPO無償API）経由の送信合算。返信・成約は未計測。',
  },
  {
    dateIso: '2026-08-14',
    count: 49,
    note: 'S13-A（データバンク商品化・教委への再配布可否照会）中心の送信。返信・成約は未計測。',
  },
  {
    dateIso: '2026-08-16',
    count: 45,
    note: 'T-C2（アウトリーチ本文工場）経由の送信。返信・成約は未計測。',
  },
  {
    dateIso: '2026-08-19',
    count: 33,
    note: 'T-C2経由の送信。返信・成約は未計測。',
  },
  {
    dateIso: '2026-08-23',
    count: 1,
    note: 'T-C2経由の送信。返信・成約は未計測。',
  },
];

/**
 * ⚠️ 上記は data/outreach-ledger.json（loop/Node実行専用・本ファイルからは直接importしない設計）を
 * 2026-08-24時点でスナップショットした集計値。2026-07-12の1件を除き、2026-07-15/2026-07-20/2026-08-12の
 * 少数日（合計6件）は既存バッチへ丸め込まず省略した（数件単位の日次バッチを無限に追加し続けると
 * このファイルの保守コストが際限なく増えるため）。**この配列は「送信するたびに追記」ではなく
 * 「定期的にledgerからスナップショットを取り直す」運用に変更する方が持続可能** — 前回のスナップショットは
 * 2026-07-12の1件のみで1か月以上更新されず169件の乖離（累計20社→実際189社）が生じていた。
 * 次にこのファイルを更新する際は `node -e` で `data/outreach-ledger.json` の `sentDate`/`sourceTaskId`別
 * 集計を取り直し、この配列全体を置き換えるのが最も安全（個別追記による蓄積誤差を避ける）。
 */

/** 送信ログの累計を1行サマリで返す（G3のdetailに添える補助情報）。ログが空ならnull。 */
export function latestOutreachSummary(log: B2bOutreachLogEntry[] = B2B_OUTREACH_LOG): string | null {
  if (log.length === 0) return null;
  const totalSent = log.reduce((sum, e) => sum + e.count, 0);
  const latest = [...log].sort((a, b) => b.dateIso.localeCompare(a.dateIso))[0];
  return `送信実績: 累計${totalSent}社（最新${latest.dateIso}に${latest.count}社）・返信/成約は未計測`;
}

function endOfDayMs(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getTime();
}

export interface RoadmapGateEvaluation {
  id: string;
  label: string;
  dateIso: string;
  daysLeft: number;
  decided: boolean;
  status: GateStatus;
  detail: string;
}

/** 個別ゲートを実測と突き合わせて判定する（数値の3ゲートのみ自動判定・G2は常にmanual-check）。 */
function evaluateGate(def: RoadmapGateDefinition, actuals: RoadmapGateActuals, now: Date): RoadmapGateEvaluation {
  const deadlineMs = endOfDayMs(def.dateIso);
  const decided = now.getTime() >= deadlineMs;
  const daysLeft = Math.max(0, Math.ceil((deadlineMs - now.getTime()) / 86_400_000));
  const base = { id: def.id, label: def.label, dateIso: def.dateIso, daysLeft, decided };

  if (!decided) {
    return { ...base, status: 'upcoming', detail: `${def.dateIso}まであと${daysLeft}日。目安: 努力=${def.effortTargetLabel} / 最高=${def.maxTargetLabel}` };
  }

  switch (def.id) {
    case 'g1-roster-velocity': {
      const roster = rosterTotalOf(actuals);
      if (!roster) return { ...base, status: 'unmeasured', detail: unmeasuredRosterDetail(actuals) };
      const { total: n, breakdown } = roster;
      if (n >= 150) return { ...base, status: 'on-track-max', detail: `名簿N=${n}${breakdown}（最高軌道の目安150以上）` };
      if (n >= 100) return { ...base, status: 'on-track-effort', detail: `名簿N=${n}${breakdown}（努力軌道の目安100以上・最高には未達）` };
      return { ...base, status: 'behind', detail: `名簿N=${n}${breakdown}（努力軌道の目安100未満）＝${def.missedAction}` };
    }
    case 'g2-winter-prep': {
      const winterSummary = winterAffiliateReadinessSummary();
      if (actuals.g2Confirmed === undefined) {
        return {
          ...base,
          status: 'manual-check',
          detail: `数値化不可のチェック項目＝👤が申請完了を確認してg2Confirmedを渡してください（自動検出: ${winterSummary}・S-3インデックス確認は引き続き👤確認が必要）`,
        };
      }
      return actuals.g2Confirmed
        ? { ...base, status: 'on-track-max', detail: `冬案件ASP申請＋S-3インデックス確認済（自動検出: ${winterSummary}）` }
        : { ...base, status: 'behind', detail: `未完了＝${def.missedAction}（自動検出: ${winterSummary}）` };
    }
    case 'g3-contract-api': {
      const contracts = actuals.contractCount ?? 0;
      const api = actuals.apiCustomers ?? 0;
      const outreachNote = latestOutreachSummary();
      const suffix = outreachNote ? `（${outreachNote}）` : '';
      if (actuals.contractCount === undefined && actuals.apiCustomers === undefined) {
        return { ...base, status: 'unmeasured', detail: `契約社数・API顧客数が未計測${suffix}` };
      }
      if (contracts >= 1 && api >= 1) return { ...base, status: 'on-track-max', detail: `契約${contracts}社・API${api}社＝最高軌道${suffix}` };
      if (contracts >= 1 || api >= 1) return { ...base, status: 'on-track-effort', detail: `契約${contracts}社・API${api}社＝努力軌道（片方のみ）${suffix}` };
      return { ...base, status: 'behind', detail: `契約0社・API0社＝${def.missedAction}${suffix}` };
    }
    case 'g4-cp-november': {
      if (actuals.cpThisMonth === undefined || actuals.conversionsThisMonth === undefined) {
        return { ...base, status: 'unmeasured', detail: 'C_p/月・当月ASP発生件数のいずれかが未計測' };
      }
      if (actuals.conversionsThisMonth <= 0) {
        return { ...base, status: 'behind', detail: `ASP発生0件（絶対条件未達）＝${def.missedAction}` };
      }
      const cp = actuals.cpThisMonth;
      if (cp >= 100) return { ...base, status: 'on-track-max', detail: `C_p=${cp}/月・発生${actuals.conversionsThisMonth}件＝最高軌道` };
      if (cp >= 40) return { ...base, status: 'on-track-effort', detail: `C_p=${cp}/月・発生${actuals.conversionsThisMonth}件＝努力軌道` };
      return { ...base, status: 'behind', detail: `C_p=${cp}/月（努力軌道の目安40未満）` };
    }
    case 'g5-december-close': {
      const roster5 = rosterTotalOf(actuals);
      if (!roster5 || actuals.cumulativeConfirmedYen === undefined) {
        const missing = !roster5 ? unmeasuredRosterDetail(actuals) : 'シーズン累計確定額が未計測';
        return { ...base, status: 'unmeasured', detail: missing };
      }
      const n = roster5.total;
      const yen = actuals.cumulativeConfirmedYen;
      const mrr = (actuals.contractsMrr ?? 0) + (actuals.apiMrr ?? 0);
      if (n >= 880 && yen >= 620_000) return { ...base, status: 'on-track-max', detail: `名簿N=${n}・MRR計¥${mrr.toLocaleString('ja-JP')}・累計¥${yen.toLocaleString('ja-JP')}＝最高軌道` };
      if (n >= 540 && yen >= 240_000) return { ...base, status: 'on-track-effort', detail: `名簿N=${n}・累計¥${yen.toLocaleString('ja-JP')}＝努力軌道` };
      return { ...base, status: 'behind', detail: `名簿N=${n}・累計¥${yen.toLocaleString('ja-JP')}（努力軌道未達）＝${def.missedAction}` };
    }
    case 'g6-february-check': {
      if (actuals.cumulativeConfirmedYen === undefined) return { ...base, status: 'unmeasured', detail: 'シーズン累計確定額が未計測' };
      const yen = actuals.cumulativeConfirmedYen;
      if (yen >= 1_600_000) return { ...base, status: 'on-track-max', detail: `累計¥${yen.toLocaleString('ja-JP')}＝最高軌道` };
      if (yen >= 560_000) return { ...base, status: 'on-track-effort', detail: `累計¥${yen.toLocaleString('ja-JP')}＝努力軌道` };
      return { ...base, status: 'behind', detail: `累計¥${yen.toLocaleString('ja-JP')}（努力軌道未達）＝${def.missedAction}` };
    }
    default:
      return { ...base, status: 'unmeasured', detail: '未定義のゲートID' };
  }
}

/** 全ゲートを判定する（日付昇順のまま返す）。 */
export function evaluateRoadmapGates(actuals: RoadmapGateActuals, now: Date = new Date()): RoadmapGateEvaluation[] {
  return ROADMAP_GATES.map((def) => evaluateGate(def, actuals, now));
}

/** 次に判定すべきゲート（未到来の最初のもの。全て決定済みなら最後のG6）。週次KPIレポの見出しに使う。 */
export function nextRoadmapGate(now: Date = new Date()): RoadmapGateDefinition {
  for (const g of ROADMAP_GATES) {
    if (now.getTime() <= endOfDayMs(g.dateIso)) return g;
  }
  return ROADMAP_GATES[ROADMAP_GATES.length - 1];
}

/**
 * 月次アクチュアル入力リマインダ（T-7）。
 *
 * G1/G3/G4/G5/G6は判定日に👤から渡された実測値（rosterN/contractCount/apiCustomers/cpThisMonth等）で
 * 自動判定されるが、実測値は月末になるまで自然に集まらない（ASP/契約/API管理画面を見る行為が要る）。
 * 判定日直前まで渡し忘れると unmeasured のまま判定が確定してしまうため、週次KPIレポの巡回で
 * 「そろそろ月次実測を渡すタイミング」と機械的に気づけるようにする（ROADMAP_GATESの日付から算出）。
 *
 * windowDaysの既定は7＝週次実行(毎週月曜)の1周期分。判定日当日〜7日前の間に実行された週次レポが
 * 必ず最低1回はこのリマインダを拾える（週次サイクルより短い閾値だと巡回タイミング次第で拾い漏れる）。
 */
export interface GateReminder {
  id: string;
  label: string;
  dateIso: string;
  daysLeft: number;
}

export function upcomingGateReminders(now: Date = new Date(), windowDays: number = 7): GateReminder[] {
  const reminders: GateReminder[] = [];
  for (const g of ROADMAP_GATES) {
    const deadlineMs = endOfDayMs(g.dateIso);
    const daysLeft = Math.ceil((deadlineMs - now.getTime()) / 86_400_000);
    if (daysLeft >= 0 && daysLeft <= windowDays) {
      reminders.push({ id: g.id, label: g.label, dateIso: g.dateIso, daysLeft });
    }
  }
  return reminders;
}
