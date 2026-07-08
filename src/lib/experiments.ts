/**
 * 実験レジストリ＋勝者判定（A/Bの一元管理・P6-3）。
 *
 * 北極星（[[fable5-master-plan-2026-06]]）：勝者を「勘」でなく「データ」で lead-config に昇格させる。
 * ab-test.ts は割当の“仕組み”（assignVariant / experiment_impression）だが、実験そのものは
 * 各コンポーネントに散っていた。ここに「いま走っている実験・仮説・バリアント・状態・勝者」を
 * 単一ソース化し、週次レビュー（GA4の experiment_impression × cta_view/affiliate_click/lead_submit）で
 * judgeWinner に集計値を渡せば、有意差つきで「どのアームを採用すべきか」が機械的に出る。
 *
 * judgeWinner は純粋関数（window非依存・テスト可能）。二項比率のz検定で control 比のリフトと有意性を出す。
 */

import type { LeadPlacement } from '@/lib/lead-config';
import type { AffiliateId } from '@/lib/affiliates';

/**
 * 'queued'（TIER L-4追加）: まだどのコンポーネントにも配線していない候補実験。
 * runningExperiments() / checkExperimentPortfolioHealth の稼働数カウントには入らない
 * （母数を稼げていない実験を「稼働中」と誤カウントしないため）。ポートフォリオが
 * MIN_RUNNING_EXPERIMENTS を割ったり月次ローテーション対象が出たりしたときに、
 * queuedExperiments() から仮説を練り直さず次の1本を選んで配線・status を running に変える運用。
 */
export type ExperimentStatus = 'running' | 'paused' | 'decided' | 'queued';

export interface ExperimentArm {
  id: string;
  /** 人間向けの説明（何を変えたアームか）。 */
  label: string;
  /** 割当の重み（既定1）。 */
  weight?: number;
  /** 送客先を差し替えるアーム（offer A/B）。指定が live なときだけ ParentLeadCTAExperiment が採用。 */
  affiliateId?: AffiliateId;
  /** CTA文言の接頭辞（copy A/B 例「今すぐ」）。 */
  ctaPrefix?: string;
  /** 見出しの差し替え（copy A/B）。 */
  heading?: string;
  /** 本文の差し替え（copy A/B）。 */
  body?: string;
  /** CTAボタンの配色クラス差し替え（color A/B・TIER L-4追加。activate時にボタン側の実装が読む）。 */
  ctaColorClass?: string;
  /** CTA表示までの遅延ms（timing A/B・TIER L-4追加。0=即時表示）。 */
  revealDelayMs?: number;
}

export interface ExperimentDef {
  id: string;
  /** 検証する仮説（1文）。 */
  hypothesis: string;
  status: ExperimentStatus;
  /** arms[0] を対照群（control）とみなす。 */
  arms: ExperimentArm[];
  /** 効きを突合する主要指標（GA4イベント）。 */
  primaryMetric: 'cta_view' | 'affiliate_click' | 'lead_submit';
  /** 関係する設置面（勝者を lead-config に昇格させる際の対象）。 */
  placement?: LeadPlacement;
  /** decided のとき採用したアーム。 */
  winner?: string;
  /** 判定日 YYYY-MM-DD。 */
  decidedAt?: string;
  /** 運用メモ。 */
  note?: string;
  /** 実験を開始した日（'YYYY-MM-DD'）。月次ローテーション判定に使う（I-2）。 */
  startedAt?: string;
}

/**
 * 実験レジストリ（単一ソース）。新しいA/Bはここに1オブジェクト足す。
 * 実装側（useExperiment / ParentLeadCTAExperiment）は同じ id / arms を参照する。
 */
export const EXPERIMENTS: ExperimentDef[] = [
  {
    id: 'hogosha-cta-text-2026',
    hypothesis: 'CTA文言に「今すぐ」で緊急性を足すと、保護者リードのクリック率（affiliate_click）が上がる。',
    status: 'running',
    arms: [
      { id: 'control', label: '出し分けエンジンの既定文言' },
      { id: 'urgent', label: '「今すぐ＋（既定文言）」で緊急性を付与', ctaPrefix: '今すぐ' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'parent-lp',
    note: '送客先（affiliateId）は固定し、純粋にコピーの効きだけを測る。最大流入の県別47面に設置して母数を稼ぐ。',
    startedAt: '2026-06-16',
  },
  {
    // 実験1（H8）：result面の送客オファーA/B。そら塾（現状）vs e-Live（もしも live）。
    id: 'result-offer-2026',
    hypothesis: 'result面で、個別指導塾（そら塾）よりオンライン家庭教師（e-Live）の方が affiliate_click/CVR が高い。',
    status: 'running',
    arms: [
      { id: 'control', label: 'そら塾（オンライン個別指導・現状の既定）', affiliateId: 'sora-juku-text' },
      { id: 'elive', label: 'e-Live（小中高オンライン家庭教師）', affiliateId: 'moshimo-e-live' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'result',
    note: 'コピーは同一・送客先だけを差し替えて純粋にオファーの効きを測る。両アームとも live。勝者を lead-config の result面に固定する。',
    startedAt: '2026-06-17',
  },
  {
    // 実験2（H8）：hiyou面のコピーA/B。FP相談の訴求 vs ツール文脈（計算する）。送客先は同一（fp-soudan）。
    id: 'hiyou-copy-2026',
    hypothesis: 'hiyou面で「高校3年間でいくら必要か計算する」（ツール文脈）の方が、FP相談の直接訴求より cta_view→affiliate_click が伸びる。',
    status: 'running',
    arms: [
      { id: 'control', label: '教育資金をFPに相談（現状の既定コピー）' },
      {
        id: 'tool-frame',
        label: 'ツール文脈：まず費用を計算する流れで誘導',
        heading: '高校3年間で、いくら必要か把握できていますか？',
        body: '進路によって教育費は数百万円規模で変わります。まずは我が家の必要額をざっくり把握し、必要なら教育資金に詳しい専門家FPへ無料で相談できます（その場で契約を迫られることはありません）。',
      },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hiyou',
    note: '送客先（fp-soudan）は固定。直接訴求 vs ツール文脈で「保護者の入り口」の効きを比較する。',
    startedAt: '2026-06-17',
  },
  {
    // 実験4（A6/K1）：名簿登録ボタンのコピーA/B。これが初の primaryMetric='lead_submit' 実験。
    // 仮説：登録の“見返り”（成績カード）を先に名指しすると、互恵性で送信率（lead_submit）が上がる。
    // 送信先・フォームは同一。ボタン文言だけを差し替えて純粋にコピーの効きを測る（SaveResultCTAが参照）。
    id: 'lead-copy-2026',
    hypothesis: '名簿登録ボタンを「結果カードを無料でもらう」と見返りで名指しすると、汎用の「無料で受け取る」より lead_submit が上がる。',
    status: 'running',
    arms: [
      { id: 'control', label: '無料で受け取る（汎用）' },
      { id: 'reward', label: '結果カードを無料でもらう（見返りを名指し）', ctaPrefix: '結果カードを' },
    ],
    primaryMetric: 'lead_submit',
    placement: 'result',
    note: '最高インテント面（result/gap-target）で母数を稼ぐ。勝者が出たら SaveResultCTA の既定ボタン文言を昇格させる。',
    startedAt: '2026-06-20',
  },
  {
    // 実験3（H8）：承認後のFP A/B（保険コンパス vs マネードクター）。両者 pending のため承認まで paused。
    id: 'fp-offer-2026',
    hypothesis: 'FP無料相談で、保険コンパス（EPC高）とマネードクターのどちらが affiliate_click→成果で勝るか。',
    status: 'paused',
    arms: [
      { id: 'control', label: '保険コンパス（EPC高め）', affiliateId: 'hoken-compass' },
      { id: 'money-doctor', label: 'マネードクター', affiliateId: 'money-doctor' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hiyou',
    note: '両案件とも承認待ち（pending）。承認され live 化したら status を running に変更して走らせる。',
    startedAt: '2026-06-17',
  },

  /* ────────────────────────────────────────────────────────────────────
   * 実験バンク（TIER L-4・2026-07-08新設）: 未配線の候補15本。
   * ポートフォリオが MIN_RUNNING_EXPERIMENTS を割った・月次ローテーション対象が出た際に、
   * ここから次の1本を選んで対象コンポーネントに experimentId を配線し、status を running に
   * 変更するだけで新しい仮説検証を始められる（毎回ゼロから仮説を考え直さない弾倉）。
   * コピー/配置順/オファー/色/タイミングの5軸を横断済み。placement は既存実験と重複しない
   * 面を優先し、まだA/Bが1本も走っていない面（hensachi/hyotei-heikin/prefecture/blog/
   * dashboard/mendan/suisen/naishin-up/jitsugika/futoukou/home）を中心にカバー。
   * ──────────────────────────────────────────────────────────────────── */
  {
    id: 'hensachi-cta-color-2026',
    hypothesis: '偏差値ツールの保護者CTAボタンを緑系にすると、既定の青系より affiliate_click が上がる（color A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定の配色（青系）' },
      { id: 'green', label: '緑系（安心感訴求）', ctaColorClass: 'bg-emerald-600 hover:bg-emerald-700' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hensachi',
    note: '配線先候補: /hensachi 内のParentLeadCTA。activate時にボタン側でctaColorClassを読む実装を追加する。',
  },
  {
    id: 'hyotei-heikin-heading-2026',
    hypothesis: '評定平均ツールの見出しを「推薦・併願優遇の基準を確認」にすると、汎用見出しより cta_view→affiliate_click が伸びる（copy A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'suisen-frame', label: '推薦・併願優遇の基準フレーム', heading: '推薦・併願優遇の基準を確認' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hyotei-heikin',
    note: '配線先候補: /hyotei-heikin のParentLeadCTA。suisen-kijunページとの導線文脈と整合させて活性化する。',
  },
  {
    id: 'prefecture-order-2026',
    hypothesis: '県別ページで保護者CTAを内申点計算ツールより先（ページ上部）に出すと、後出しより cta_view が伸びる（配置順A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定の並び順（ツール→保護者CTA）' },
      { id: 'cta-first', label: '保護者CTAを先に表示', body: 'placement-order:cta-first' },
    ],
    primaryMetric: 'cta_view',
    placement: 'prefecture',
    note: '配線先候補: [prefecture]/page.tsx。activate時にbodyの疑似フラグでなく実際のJSX順序を分岐させる実装に置き換える。',
  },
  {
    id: 'blog-cta-timing-2026',
    hypothesis: '記事内CTAを即時表示でなく本文の30%スクロール到達後に表示すると、既読者に絞れてaffiliate_clickの質(CVR)が上がる（timing A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '即時表示' },
      { id: 'scroll-gated', label: 'スクロール30%到達後に表示', revealDelayMs: 0 },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'blog',
    note: '配線先候補: BlogCTA。revealDelayMsは時間ベース、scroll-gatedは実際にはスクロール位置ベースなので活性化時にIntersectionObserver実装を追加する。',
  },
  {
    id: 'dashboard-cta-copy-2026',
    hypothesis: '成績ダッシュボードの保護者CTAで「前回比+◯点」を見出しに出すと、汎用コピーより affiliate_click が伸びる（継続トラッキングの実測差分訴求・copy A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '汎用の保護者向けコピー' },
      { id: 'delta-frame', label: '前回比の実測差分を見出しに（動的差し込み）', heading: '前回の記録からの変化を踏まえて' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'dashboard',
    note: '配線先候補: DashboardClient内のParentLeadCTA。deltaは[[session-2026-07-08]]のcomputeLiveGoalProgress系の実測値を差し込む。',
  },
  {
    id: 'mendan-offer-2026',
    hypothesis: '三者面談パック面で、個別指導塾よりオンライン家庭教師（スタディコーチ）の方が affiliate_click が高い（offer A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '個別指導塾（既定）', affiliateId: 'moshimo-e-live' },
      { id: 'studycoach', label: 'スタディコーチ（東大式オンライン塾）', affiliateId: 'moshimo-studycoach' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'mendan',
    note: '配線先候補: /mendan のParentLeadCTA。result-offer-2026と同軸だが面談準備という別インテントでの再検証。',
  },
  {
    id: 'suisen-copy-2026',
    hypothesis: '推薦・総合型選抜面でFP無料相談を「大学までの学費」で訴求すると、制度解説文脈の既定コピーより affiliate_click が伸びる（copy A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定コピー（制度解説文脈）' },
      { id: 'cost-frame', label: '大学までの学費フレーム', heading: '推薦で進学した後の学費、今から相談できます' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'suisen',
    note: '配線先候補: /suisen-nyuushi・/sougou-gata-senbatsu のParentLeadCTA。',
  },
  {
    id: 'naishin-up-offer-2026',
    hypothesis: '内申点の上げ方面で、映像授業（atama+）より個別指導塾（そら塾）の方が affiliate_click が高い（offer A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: 'atama+（既定・映像授業AI型）', affiliateId: 'atama-text' },
      { id: 'sora-juku', label: 'そら塾（個別指導）', affiliateId: 'sora-juku-text' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'naishin-up',
    note: '配線先候補: /naishin-age-kata系のParentLeadCTA。「内申を上げたい」という通塾動機の強いインテントでの再検証。',
  },
  {
    id: 'jitsugika-copy-2026',
    hypothesis: '実技教科対策面で見出しを「内申点への影響」で訴求すると、「弱点克服」の既定コピーより affiliate_click が伸びる（copy A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（弱点克服フレーム）' },
      { id: 'naishin-impact', label: '内申点への影響フレーム', heading: '実技教科の評定、内申点への影響を今から対策' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'jitsugika',
    note: '配線先候補: /jitsugika のParentLeadCTA。',
  },
  {
    id: 'futoukou-offer-2026',
    hypothesis: '不登校クラスタで、ティントル（個別指導特化）よりクラスジャパン小中学園（フリースクール）の方が affiliate_click が高い（offer A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: 'ティントル（既定・不登校専門個別指導）', affiliateId: 'moshimo-tintoru' },
      { id: 'classjapan', label: 'クラスジャパン小中学園（オンラインフリースクール）', affiliateId: 'moshimo-classjapan' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'futoukou',
    note: '配線先候補: /futoukou・/futoukou/tsugaku のParentLeadCTA。両者とも在宅学習の学び方が異なるため訴求文脈の違いにも注意。',
  },
  {
    id: 'home-cta-color-2026',
    hypothesis: 'トップページの保護者CTAボタンをオレンジ系にすると、既定の青系より cta_view→affiliate_click が伸びる（color A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定の配色（青系）' },
      { id: 'orange', label: 'オレンジ系（緊急性・注目訴求）', ctaColorClass: 'bg-orange-500 hover:bg-orange-600' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'home',
    note: '配線先候補: HomeClient内のParentLeadCTA。最大流入面のため慎重に既存CVRを壊さないか小さいトラフィック比率から開始する。',
  },
  {
    id: 'result-second-round-timing-2026',
    hypothesis: 'result面のCTAを、計算結果アニメーション完了後に表示すると、即時表示より結果を認知した状態でのaffiliate_clickの質(CVR)が上がる（timing A/B・result系ローテーション2巡目）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '即時表示（既定）' },
      { id: 'post-animation', label: '結果アニメーション完了後に表示', revealDelayMs: 600 },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'result',
    note: 'result-offer-2026が決着した後のローテーション候補。revealDelayMsはResultSection側のアニメーション完了イベントに合わせて調整する。',
  },
  {
    id: 'hiyou-third-round-copy-2026',
    hypothesis: 'hiyou面で「高校3年間で約◯万円」と具体額を見出しに出すと、一般論の既定コピーより cta_view→affiliate_click が伸びる（copy A/B・hiyou系ローテーション3巡目）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定コピー（一般論フレーム）' },
      { id: 'concrete-yen', label: '具体額フレーム（動的差し込み）', heading: '高校3年間で必要な金額、今すぐ目安を確認' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hiyou',
    note: 'hiyou-copy-2026・fp-offer-2026に続く3巡目候補。concrete-yenはeducation-cost enginで算出した実測レンジを差し込む。',
  },
  {
    id: 'parent-lp-order-2026',
    hypothesis: '/hogoshaでCTAをページ最上部（ファーストビュー）に出すと、記事末配置の既定より cta_view が伸びる（配置順A/B・parent-lp系ローテーション2巡目）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定の配置（記事末）' },
      { id: 'above-fold', label: 'ファーストビューに配置', body: 'placement-order:above-fold' },
    ],
    primaryMetric: 'cta_view',
    placement: 'parent-lp',
    note: 'hogosha-cta-text-2026（コピーA/B）とは別軸（配置順）。両実験は同時に走らせず順番に検証する。',
  },
  {
    id: 'blog-offer-2026',
    hypothesis: '記事内広告で、Z会（通信教育）よりatama+（映像授業AI型）の方が affiliate_click が高い（offer A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: 'Z会（既定）', affiliateId: 'zkai-text-middle' },
      { id: 'atama', label: 'atama+（映像授業AI型）', affiliateId: 'atama-text' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'blog',
    note: '配線先候補: AffiliateAd（記事内設置）。blog-cta-timing-2026（同一面のtiming軸）と同時に走らせない。',
  },
];

/** id から実験定義を引く。 */
export function getExperiment(id: string): ExperimentDef | undefined {
  return EXPERIMENTS.find((e) => e.id === id);
}

/** 走っている実験だけ。 */
export function runningExperiments(): ExperimentDef[] {
  return EXPERIMENTS.filter((e) => e.status === 'running');
}

/** まだ配線していない候補実験（弾倉）。配列の並び順＝優先度（先頭から順に活性化する運用）。 */
export function queuedExperiments(): ExperimentDef[] {
  return EXPERIMENTS.filter((e) => e.status === 'queued');
}

/** 次に活性化すべき候補を1本選ぶ。placementを指定するとその面の候補を優先し、無ければ先頭を返す。 */
export function nextQueuedExperiment(
  placement?: LeadPlacement,
  experiments: ExperimentDef[] = EXPERIMENTS
): ExperimentDef | undefined {
  const queued = experiments.filter((e) => e.status === 'queued');
  if (placement) {
    const matched = queued.find((e) => e.placement === placement);
    if (matched) return matched;
  }
  return queued[0];
}

/* ────────────────────────────────────────────────────────────────────────
 * 実験ポートフォリオの健全性（I-2：常時2本A/B運用・月次ローテーション）。
 *
 * 「常に2本以上を稼働させる」「未決着のまま1ヶ月を超えたら判定 or 差し替えを検討する」という
 * 運用ルールを、月が変わるたびに手作業でチェックしなくても機械的に気づけるようにする。
 * judgeWinner自体は既存（GA4の集計値が要る）。ここは「そもそも母数が足りているか／
 * 判定を先延ばしにし続けていないか」という運用のヘルスチェックのみ（純粋関数）。
 * ──────────────────────────────────────────────────────────────────────── */

const EXPERIMENT_DAY_MS = 86_400_000;

/** 常時ここまでは稼働させる、というポートフォリオの下限。 */
export const MIN_RUNNING_EXPERIMENTS = 2;
/** この日数を超えて未決着のまま稼働中なら、月次ローテーション（判定 or 差し替え）の対象として警告する。 */
export const ROTATION_INTERVAL_DAYS = 30;

export interface ExperimentPortfolioHealth {
  runningCount: number;
  /** runningCount が下限未満か。 */
  belowMinimum: boolean;
  /** ROTATION_INTERVAL_DAYS を超えて稼働中（要・判定 or ローテーション）の実験。 */
  overdueForRotation: { id: string; daysRunning: number }[];
  /** 未配線の候補実験（弾倉）の残数（TIER L-4）。belowMinimum/overdueが出た時に即活性化できる本数の目安。 */
  queuedAvailableCount: number;
}

/**
 * 実験ポートフォリオの健全性を判定する（純粋関数・テスト可能）。
 * startedAt が無い実験はローテーション判定の対象外（開始日不明のため判定不能・除外するのみで安全側）。
 */
export function checkExperimentPortfolioHealth(
  experiments: ExperimentDef[] = EXPERIMENTS,
  now: Date = new Date(),
  minRunning: number = MIN_RUNNING_EXPERIMENTS,
  rotationDays: number = ROTATION_INTERVAL_DAYS
): ExperimentPortfolioHealth {
  const running = experiments.filter((e) => e.status === 'running');
  const overdueForRotation = running
    .filter((e): e is ExperimentDef & { startedAt: string } => Boolean(e.startedAt))
    .map((e) => ({
      id: e.id,
      daysRunning: Math.floor((now.getTime() - new Date(`${e.startedAt}T00:00:00Z`).getTime()) / EXPERIMENT_DAY_MS),
    }))
    .filter((r) => r.daysRunning >= rotationDays);

  return {
    runningCount: running.length,
    belowMinimum: running.length < minRunning,
    overdueForRotation,
    queuedAvailableCount: experiments.filter((e) => e.status === 'queued').length,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 勝者判定（二項比率のz検定）
 *
 * GA4 から各アームの「分母（impression / cta_view）」と「分子（conversion）」を取り、
 * control（arms[0]）に対する最良アームのリフトと統計的有意性を返す。
 * これにより「勝った文言を lead-config へ昇格」する意思決定を機械化する。
 * ──────────────────────────────────────────────────────────────────────── */

export interface ArmResult {
  id: string;
  /** 分母（露出 or cta_view など、primaryMetric の母数）。 */
  impressions: number;
  /** 分子（コンバージョン件数）。 */
  conversions: number;
}

export interface WinnerVerdict {
  /** 対照群のアームID。 */
  control: string;
  controlRate: number;
  /** 最もCVRが高かったアーム。 */
  bestArm: string;
  bestRate: number;
  /** control 比の相対リフト（例 0.18 = +18%）。control が0なら NaN を避け 0。 */
  lift: number;
  /** 二標本z統計量（bestArm vs control）。 */
  z: number;
  /** 両側p値の近似。 */
  pValue: number;
  /** 95%（|z|>=1.96）かつ最小サンプル充足で有意。 */
  significant: boolean;
  /** 日本語の一言（運用にそのまま出せる）。 */
  recommendation: string;
}

/** 標準正規分布の両側p値の近似（Abramowitz & Stegun 7.1.26 ベース）。 */
function twoSidedP(z: number): number {
  const az = Math.abs(z);
  // 1 - Φ(az) の近似
  const t = 1 / (1 + 0.2316419 * az);
  const d = 0.3989422804014327 * Math.exp((-az * az) / 2);
  const upper = d * (0.319381530 * t - 0.356563782 * t * t + 1.781477937 * t ** 3 - 1.821255978 * t ** 4 + 1.330274429 * t ** 5);
  return Math.min(1, Math.max(0, 2 * upper));
}

/**
 * 勝者判定。arms[0] を control とする。十分なサンプルが無い／有意差が無いときは significant:false。
 * @param minSample 各アームに必要な最小分母（既定 100）。
 */
export function judgeWinner(arms: ArmResult[], minSample = 100): WinnerVerdict | null {
  if (arms.length < 2) return null;
  const control = arms[0];
  const rate = (a: ArmResult) => (a.impressions > 0 ? a.conversions / a.impressions : 0);
  const controlRate = rate(control);

  // control を除く中で最良、ただし control 自身が最良なら control を best にする。
  let best = control;
  for (const a of arms) {
    if (rate(a) > rate(best)) best = a;
  }
  const bestRate = rate(best);
  const lift = controlRate > 0 ? (bestRate - controlRate) / controlRate : 0;

  // 二項比率のプール分散でz検定（best vs control）。
  const n1 = best.impressions;
  const n2 = control.impressions;
  let z = 0;
  if (best.id !== control.id && n1 > 0 && n2 > 0) {
    const pPool = (best.conversions + control.conversions) / (n1 + n2);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
    z = se > 0 ? (bestRate - controlRate) / se : 0;
  }
  const pValue = twoSidedP(z);
  const enoughSample = n1 >= minSample && n2 >= minSample;
  const significant = best.id !== control.id && enoughSample && Math.abs(z) >= 1.96;

  let recommendation: string;
  if (best.id === control.id) {
    recommendation = enoughSample
      ? `対照群（${control.id}）が最良。現状維持を推奨。`
      : `サンプル不足（各アーム${minSample}件未満）。判定保留。`;
  } else if (!enoughSample) {
    recommendation = `${best.id} がリード（+${(lift * 100).toFixed(1)}%）だがサンプル不足。継続して母数を貯める。`;
  } else if (significant) {
    recommendation = `${best.id} を採用推奨：control比 +${(lift * 100).toFixed(1)}%・有意（p≈${pValue.toFixed(3)}）。lead-config / コピーを ${best.id} に昇格。`;
  } else {
    recommendation = `${best.id} がやや優勢（+${(lift * 100).toFixed(1)}%）だが有意差なし（p≈${pValue.toFixed(3)}）。継続。`;
  }

  return { control: control.id, controlRate, bestArm: best.id, bestRate, lift, z, pValue, significant, recommendation };
}
