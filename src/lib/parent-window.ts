/**
 * 保護者接点の「収穫窓」判定＝三者面談・出願の直前だけブリッジを点灯する純関数。
 *
 * 北極星（[[session-2026-07-04-oneshot-revenue-architecture]]）：
 *   このサイトの真のボトルネックは「保護者接点≈0」。生徒は結果を計算するが、決裁者（保護者）に
 *   届く動線が細い。唯一の桁レバーは C_p（保護者起点クリック/月）。その C_p が確実に立つのは、
 *   保護者が必ず関与する「三者面談・出願」の短い窓（7月＝1学期末、11〜12月＝2学期末・出願）だけ。
 *   よって結果直下の「三者面談の前に、現在地を持って行く」モジュールは、この窓の期間だけ出す。
 *
 * 設計：
 *  - 日付で自動判定（デプロイ不要で窓が開いたら勝手に点灯）。SSG/ビルド時刻ではなく“閲覧者の現在時刻”で
 *    判定するため、呼び出し側（ParentWindowBridge）はマウント後に new Date() を渡す（ビルド時刻固定の回避）。
 *  - window 非依存の純関数＝ユニットテスト可能（境界：6/30×・7/1○・7/26×）。
 *  - UTC月日で判定（[[seasonal]] と同じ方針・JSTとの数時間差は窓の端で無視できる）。
 *  - 捏造リスクゼロ：日付の断定はせず「一般的な面談時期」への言及に留める（コピーは PARENT_WINDOW_COPY）。
 */

export type ParentWindowId = 'mendan-july' | 'winter';

/**
 * いまが保護者の収穫窓か（三者面談・出願の直前）を返す。窓外は null。
 *  - mendan-july : 7/1〜7/25（1学期末の三者面談〜夏休み前。通知表が出て保護者が最も関与する短い窓）
 *  - winter      : 11/15〜12/25（2学期末の三者面談〜出願確定。中3の進路が実質決まる最重要面談）
 */
export function activeParentWindow(now: Date = new Date()): ParentWindowId | null {
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  if (m === 7 && d >= 1 && d <= 25) return 'mendan-july';
  if ((m === 11 && d >= 15) || (m === 12 && d <= 25)) return 'winter';
  return null;
}

export interface ParentWindowCopy {
  /** 期間バッジ（例:「7月・三者面談シーズン」）。断定を避けた一般的な時期の言及のみ。 */
  badge: string;
  /** モジュール見出し。 */
  heading: string;
  /** 現在地サマリの導入文（面談で数値を持参する動機づけ）。 */
  intro: string;
}

/**
 * 窓ごとの表示コピー（単一ソース＝コンポーネントを薄く保つ）。
 * いずれも「面談の前に現在地を整理しておくと相談が具体的になる」という一般論で、日付や合否の断定はしない。
 */
export const PARENT_WINDOW_COPY: Record<ParentWindowId, ParentWindowCopy> = {
  'mendan-july': {
    badge: '7月・三者面談シーズン',
    heading: '三者面談の前に、いまの成績の「現在地」を持って行きませんか？',
    intro:
      '1学期末の三者面談は、夏休みの過ごし方と志望校の方向性を確認する場です。お子さまの現在地（今の数値と目標との差）を保護者の方と共有しておくと、先生への相談がぐっと具体的になります。',
  },
  winter: {
    badge: '12月・三者面談／出願シーズン',
    heading: '出願を決める面談の前に、いまの「現在地」を整理しませんか？',
    intro:
      '2学期末の三者面談は、内申が実質固まり出願校を決める大切な場です。お子さまの現在地（今の数値と目標との差）を保護者の方と共有しておくと、限られた面談の時間を最大限に活かせます。',
  },
};

/** 窓IDから表示コピーを取得（未知IDは 7月コピーにフォールバック）。 */
export function parentWindowCopy(id: ParentWindowId): ParentWindowCopy {
  return PARENT_WINDOW_COPY[id] ?? PARENT_WINDOW_COPY['mendan-july'];
}
