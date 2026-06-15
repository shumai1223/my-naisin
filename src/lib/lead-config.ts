/**
 * 保護者リード（換金の本命）の「県 × 面」出し分けエンジン＝単一の設定ソース。
 *
 * 北極星（メモリ準拠）：稼ぐのは EPC型の有料バナーではなく「保護者 × 無料リード（資料請求/無料体験）」。
 * 有料成約は 100–330click/件、無料リードは数〜10click/件（20–50倍効率）。
 * よってここは「どの面・どの県で、どの無料リード案件を出すか」を一元管理し、
 * GA4（affiliate_click / lead_submit を program×page×placement で集計）の勝者をこの表に反映していく。
 *
 * 優先度（具体的なものが勝つ）：
 *   全体既定 < 面の既定 < 県の勝者 < 県×面の勝者
 *
 * 【2026-06-13 初期勝者の仮置き】Z会一本足を解消し、今日から GA4 で program×placement を学習する。
 *   - result（最高インテント）→ そら塾（オンライン個別の無料体験。全国オンライン対応で県を選ばない）
 *   - parent-lp（保護者LP）→ atama＋（AI塾の無料体験。全国オンライン対応）
 *   - 関西の県 → 個別指導キャンパス（関西地盤）／関東の県 → 森塾（関東地盤）を県オーバーライドで割当
 *   - 最大流入面（hensachi / hyotei-heikin / home / blog）は安全側の Z会 資料請求（無料）を維持＝クリーンな対照群
 *  すべて A8 の「無料体験／無料資料請求」型（live）で、有料バナーではない＝戦略に整合。
 *  勝者が出たら affiliateId をこの表で差し替えるだけ（コンポーネントは無改修）。
 */

import type { AffiliateId } from '@/lib/affiliates';

export type LeadPlacement =
  | 'result' // 計算結果の直後（最高インテント）
  | 'hensachi' // 偏差値ツール
  | 'hyotei-heikin' // 評定平均ツール
  | 'prefecture' // 県別ページ
  | 'parent-lp' // 保護者LP（/hogosha）
  | 'blog' // 記事内
  | 'dashboard' // 成績ダッシュボード（継続トラッキング＝高インテント）
  | 'hiyou' // 学費・塾代クラスタ（保護者が検索者本人＝権限ズレゼロの本命面）
  | 'mendan' // 三者面談パック（保護者が検索者・7月/12月の二毛作）
  | 'home'; // トップ

export interface LeadOffer {
  /** 送客先プログラム（affiliates.ts の live なIDのみ）。 */
  affiliateId: AffiliateId;
  heading: string;
  body: string;
  /** ボタン下の補足表記（PR/無料など）。送客先名に合わせる。 */
  note: string;
  /** CTAボタンの文言。 */
  ctaText: string;
}

/**
 * 全体既定＝現行 ParentLeadCTA の既定値そのまま（挙動非変更を保証）。
 * Z会の資料請求は全国対応の無料リードで、どの県・面でも破綻しない安全な土台。
 */
export const DEFAULT_LEAD_OFFER: LeadOffer = {
  affiliateId: 'zkai-text-request',
  heading: 'お子さまの成績、このままで志望校に届きますか？',
  body: '内申点・偏差値は「今からの伸ばし方」で大きく変わります。ご家庭でできる対策を、まずは無料の資料で確認してみませんか。費用はかからず、請求は数分で完了します。',
  note: 'Z会の通信教育の資料請求（PR）／無料',
  ctaText: '無料で資料をもらう',
};

/** 送客先プログラムごとの note / ctaText（表記ゆれ・ミスラベルを防ぐ単一ソース）。 */
const PROGRAM_PRESET: Partial<Record<AffiliateId, Pick<LeadOffer, 'note' | 'ctaText'>>> = {
  'sora-juku-text': { note: 'そら塾（オンライン個別指導）の無料体験（PR）', ctaText: '無料体験を申し込む' },
  'atama-text': { note: 'atama＋ オンライン塾の無料体験（PR）', ctaText: '無料体験を申し込む' },
  'campus-text': { note: '個別指導キャンパスの無料体験・資料請求（PR）', ctaText: '無料体験を申し込む' },
  'morijuku-text': { note: '森塾の無料体験授業（PR）', ctaText: '無料体験を申し込む' },
  'zkai-text-request': { note: 'Z会の通信教育の資料請求（PR）／無料', ctaText: '無料で資料をもらう' },
  'zkai-daigaku': { note: 'Z会 高校生・大学受験生向けの資料請求（PR）／無料', ctaText: '無料で資料をもらう' },
  'fp-soudan': { note: '専門家FPの無料相談（PR）／教育資金・保険・何度でも無料', ctaText: '教育資金を無料でFPに相談する' },
  'moshimo-e-live': { note: 'e-Live オンライン家庭教師の無料体験（PR）', ctaText: '無料体験を申し込む' },
  'moshimo-studycoach': { note: 'スタディコーチ（東大式オンライン塾）の無料体験（PR）', ctaText: '無料体験・相談をする' },
};

/** プログラムIDから note/ctaText を補完したオファー断片を作る（割当ミスを防ぐ）。 */
function offerFor(affiliateId: AffiliateId, copy: Pick<LeadOffer, 'heading' | 'body'>): Partial<LeadOffer> {
  return { affiliateId, ...PROGRAM_PRESET[affiliateId], ...copy };
}

/**
 * 面ごとの既定（文脈最適化）。
 * 最大流入面（hensachi/hyotei-heikin）は安全側の Z会（既定）を維持し、コピーだけ損失回避で締める。
 * 高インテント面（result/parent-lp）には無料体験案件を割当てて GA4 で勝者を学習する。
 */
export const PLACEMENT_LEAD_OVERRIDES: Partial<Record<LeadPlacement, Partial<LeadOffer>>> = {
  // 最高インテント面。結果が出た直後の保護者に「全国オンラインの無料体験」をぶつけて学習開始。
  result: offerFor('sora-juku-text', {
    heading: '結果が出た今が、対策の“始めどき”です',
    body: '内申点・偏差値の差は、動き出すのが遅いほど取り戻すのが大変になります。間に合ううちに、まずは無料体験で「今の学力で何が足りないか」を見える化しませんか。オンライン対応・費用はかかりません。',
  }),
  // 保護者LP。決裁者である保護者に AI塾の無料体験を提示。
  'parent-lp': offerFor('atama-text', {
    heading: 'お子さまの志望校合格を、ご家庭からあと押し',
    body: '「やり方が分からないまま時間だけが過ぎる」のが、いちばんもったいない失点です。AIが弱点だけを狙って学習をつくる無料体験で、最短ルートをまず確認してみませんか。費用はかかりません。',
  }),
  // ── 以下は安全側の Z会（既定）を維持し、コピーだけ損失回避で締める ──
  hensachi: {
    heading: '偏差値、間違った順番で勉強していませんか？',
    body: '偏差値は学習“量”より“やり方”で伸びが大きく変わります。遠回りで時間を失う前に、お子さまに合った伸ばし方を無料の資料で確認してみませんか。',
  },
  'hyotei-heikin': {
    heading: '評定平均は、あとから取り返しにくい数字です',
    body: '評定平均（内申）は日々の積み重ねで決まり、下がってからでは戻すのに学期単位の時間がかかります。今からできる対策と推薦の基準を、無料の資料でまとめて確認できます。',
  },
  prefecture: {
    heading: 'この地域の入試、お子さまの成績で本当に届きますか？',
    body: '都道府県ごとに内申点の比重は大きく異なり、同じ偏差値でも合否が分かれます。志望校との差を埋める家庭学習の進め方を、まずは無料の資料でご確認ください。',
  },
  // 2026-06-15 継続トラッキング面（高インテント）を、学習管理コーチングの無料体験（もしも・スタディコーチ）へ。
  dashboard: offerFor('moshimo-studycoach', {
    heading: '積み上げた“伸び”を、合格まで届く伸びに',
    body: '記録で伸びが見えてきた今が、次の一手の好機です。現役東大・難関大生による学習管理コーチングの無料体験で、中1→中3の積み上げを志望校ラインまで最短で届かせる進め方を確認できます。費用はかかりません。',
  }),
  // 2026-06-15 学費面（権限ズレ0・最高単価）を Z会資料請求のプレースホルダから「専門家FP無料相談」(もしも・CPA¥13,800)へ昇格。
  hiyou: offerFor('fp-soudan', {
    heading: '高校・大学でかかるお金、備えはできていますか？',
    body: '高校〜大学までの教育費は進路によって数百万円規模で変わります。「我が家はいくら必要か・どう準備するか」を、教育資金に詳しい専門家FPへ無料で相談できます。相談は何度でも無料で、その場で契約を迫られることはありません。',
  }),
  // 2026-06-15 面談面（保護者が検索者・最高インテント）を、小中高オンライン家庭教師の無料体験（もしも・e-Live）へ。
  mendan: offerFor('moshimo-e-live', {
    heading: '三者面談の前に、ご家庭の“現在地”を整理しておきませんか',
    body: '面談は限られた時間です。志望校との差・今からできる対策を事前に把握しておくと、先生に的確に相談できます。小中高対応のオンライン家庭教師の無料体験で「今の学力で何が足りないか」を見える化しておくと、面談がぐっと具体的になります。費用はかかりません。',
  }),
};

/**
 * 県の勝者（GA4の affiliate_click/lead_submit を県別に見て、効いた案件をここに固定していく）。
 * 【初期割当】地盤の塾を地域に割当。関西=個別指導キャンパス／関東=森塾。
 * （いずれも A8 の無料体験／資料請求。校舎カバレッジが高い地域＝CVRが出やすい仮説をGA4で検証）。
 */
const KANSAI_CAMPUS = offerFor('campus-text', {
  heading: 'この地域の入試、お子さまの成績で届きますか？',
  body: '内申の比重が地域で異なる中、合否ラインまでの距離は早く知るほど対策が打てます。関西で校舎数の多い個別指導の無料体験で、今の弱点を見える化しませんか。費用はかかりません。',
});
const KANTO_MORI = offerFor('morijuku-text', {
  heading: 'この地域の入試、お子さまの成績で届きますか？',
  body: '内申の比重が地域で異なる中、合否ラインまでの距離は早く知るほど対策が打てます。関東で校舎数の多い個別指導の無料体験授業で、今の弱点を見える化しませんか。費用はかかりません。',
});

export const PREFECTURE_LEAD_OVERRIDES: Partial<Record<string, Partial<LeadOffer>>> = {
  // 関西（個別指導キャンパスの地盤）
  osaka: KANSAI_CAMPUS,
  hyogo: KANSAI_CAMPUS,
  kyoto: KANSAI_CAMPUS,
  nara: KANSAI_CAMPUS,
  shiga: KANSAI_CAMPUS,
  wakayama: KANSAI_CAMPUS,
  // 関東（森塾の地盤）
  tokyo: KANTO_MORI,
  kanagawa: KANTO_MORI,
  saitama: KANTO_MORI,
  chiba: KANTO_MORI,
  ibaraki: KANTO_MORI,
  tochigi: KANTO_MORI,
  gunma: KANTO_MORI,
};

/**
 * 県×面の勝者（最も具体的＝最優先）。キーは `${prefectureCode}:${placement}`。
 * 「勝ち案件 × 勝ち面」マトリクスの最終形。GA4結果をここへ反映する。
 */
export const PREFECTURE_PLACEMENT_LEAD_OVERRIDES: Record<string, Partial<LeadOffer>> = {
  // 例: 'osaka:result': { affiliateId: 'morijuku-text', note: '森塾の無料体験（PR）／無料', ctaText: '無料体験を申し込む' },
};

/**
 * 県 × 面から最適な保護者リードオファーを解決する（純粋関数・サーバー安全）。
 * 何も指定が無ければ DEFAULT_LEAD_OFFER（=現行表示）を返す。
 */
export function selectLeadOffer(opts: { prefectureCode?: string; placement?: LeadPlacement } = {}): LeadOffer {
  const { prefectureCode, placement } = opts;
  const placementOverride = placement ? PLACEMENT_LEAD_OVERRIDES[placement] : undefined;
  const prefOverride = prefectureCode ? PREFECTURE_LEAD_OVERRIDES[prefectureCode] : undefined;
  const comboOverride =
    prefectureCode && placement
      ? PREFECTURE_PLACEMENT_LEAD_OVERRIDES[`${prefectureCode}:${placement}`]
      : undefined;

  return {
    ...DEFAULT_LEAD_OFFER,
    ...placementOverride,
    ...prefOverride,
    ...comboOverride,
  };
}
