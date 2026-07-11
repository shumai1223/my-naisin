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

export type GateStatus =
  | 'upcoming' // 判定日前
  | 'on-track-max' // 判定日到達・最高軌道の基準を満たす
  | 'on-track-effort' // 判定日到達・努力軌道の基準は満たすが最高には届かない
  | 'behind' // 判定日到達・努力軌道にも届かない
  | 'manual-check' // 数値でなくチェックリスト系（自動判定不可・👤確認が必要）
  | 'unmeasured'; // 判定日到達だが実測値が渡されていない

export interface RoadmapGateActuals {
  /** 名簿累計（D1 leads総数・unsubscribed除く）。G1/G4/G5で使用。 */
  rosterN?: number;
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

/** 目盛りゲート G1〜G6（正準・単一ソース。2026-07-11ロードマップ artifact と同一の日付・数値）。 */
export const ROADMAP_GATES: RoadmapGateDefinition[] = [
  {
    id: 'g1-roster-velocity',
    dateIso: '2026-08-31',
    label: 'G1 名簿velocity',
    metricLabel: '名簿累計N（D1 leads総数）',
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
      if (actuals.rosterN === undefined) return { ...base, status: 'unmeasured', detail: '名簿累計Nが未計測（D1 leads総数を渡してください）' };
      const n = actuals.rosterN;
      if (n >= 150) return { ...base, status: 'on-track-max', detail: `名簿N=${n}（最高軌道の目安150以上）` };
      if (n >= 100) return { ...base, status: 'on-track-effort', detail: `名簿N=${n}（努力軌道の目安100以上・最高には未達）` };
      return { ...base, status: 'behind', detail: `名簿N=${n}（努力軌道の目安100未満）＝${def.missedAction}` };
    }
    case 'g2-winter-prep': {
      if (actuals.g2Confirmed === undefined) return { ...base, status: 'manual-check', detail: '数値化不可のチェック項目＝👤が申請完了を確認してg2Confirmedを渡してください' };
      return actuals.g2Confirmed
        ? { ...base, status: 'on-track-max', detail: '冬案件ASP申請＋S-3インデックス確認済' }
        : { ...base, status: 'behind', detail: `未完了＝${def.missedAction}` };
    }
    case 'g3-contract-api': {
      const contracts = actuals.contractCount ?? 0;
      const api = actuals.apiCustomers ?? 0;
      if (actuals.contractCount === undefined && actuals.apiCustomers === undefined) {
        return { ...base, status: 'unmeasured', detail: '契約社数・API顧客数が未計測' };
      }
      if (contracts >= 1 && api >= 1) return { ...base, status: 'on-track-max', detail: `契約${contracts}社・API${api}社＝最高軌道` };
      if (contracts >= 1 || api >= 1) return { ...base, status: 'on-track-effort', detail: `契約${contracts}社・API${api}社＝努力軌道（片方のみ）` };
      return { ...base, status: 'behind', detail: `契約0社・API0社＝${def.missedAction}` };
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
      if (actuals.rosterN === undefined || actuals.cumulativeConfirmedYen === undefined) {
        return { ...base, status: 'unmeasured', detail: '名簿N・シーズン累計確定額のいずれかが未計測' };
      }
      const n = actuals.rosterN;
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
