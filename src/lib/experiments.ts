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
  primaryMetric:
    | 'cta_view'
    | 'affiliate_click'
    | 'lead_submit'
    | 'line_friend_click'
    | 'unlock_granted'
    | 'stats_optin_grant'
    | 'lead_magnet_next';
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
    // T-2（2026-07-12）：結果画面LINE登録導線のコピーA/B。SaveResultCTAが参照。
    id: 'line-cta-copy-2026',
    hypothesis: '結果画面のLINE友だち追加ボタンの副題を「内申点アップのコツを毎週お届け」と具体的な受け取り内容にすると、汎用の「受験情報をプッシュ通知」より line_friend_click が上がる。',
    status: 'running',
    arms: [
      { id: 'control', label: '既定副題（汎用訴求：受験情報をプッシュ通知）' },
      { id: 'benefit', label: '具体内容フレーム', body: '友だち追加で、内申点アップのコツを毎週LINEでお届け' },
    ],
    primaryMetric: 'line_friend_click',
    placement: 'result',
    note: '送り先・登録の仕組みは同一・副題コピーのみ差し替え。SaveResultCTAの全設置面（result/prefecture/hensachi等）で母数を稼ぐ。',
    startedAt: '2026-07-12',
  },
  {
    // T-2（2026-07-12）：結果画面LINE登録導線の位置A/B。SaveResultCTAが参照。
    id: 'line-cta-position-2026',
    hypothesis: 'LINE友だち追加ボタンをメール登録フォームより先（上）に出す既定の並びに対し、メールを先に出す方がline_friend_clickが下がるかを検証する（プッシュ可能なLINEを先出しする現行判断の裏付け）。',
    status: 'running',
    arms: [
      { id: 'control', label: '既定の並び（LINEが先・メールが後）' },
      { id: 'email-first', label: 'メールを先に表示', body: 'placement-order:email-first' },
    ],
    primaryMetric: 'line_friend_click',
    placement: 'result',
    note: 'SaveResultCTAの受け皿2種（LINE/メール）の表示順のみ入れ替え。文言・機能は同一（bodyは実装が読む疑似フラグ。prefecture-order-2026と同じ表現規約）。',
    startedAt: '2026-07-12',
  },
  {
    // T-2（2026-07-12）：結果画面LINE登録導線の表示タイミングA/B。SaveResultCTAが参照。
    id: 'line-cta-timing-2026',
    hypothesis: 'LINE友だち追加ボタンを結果表示直後でなく少し間を置いて表示すると、結果を読んだ状態での意図が伴い line_friend_click の質（歩留まり）が上がる。',
    status: 'running',
    arms: [
      { id: 'control', label: '即時表示（既定）' },
      { id: 'delayed', label: '結果表示から1.2秒後に表示', revealDelayMs: 1200 },
    ],
    primaryMetric: 'line_friend_click',
    placement: 'result',
    note: 'SaveResultCTA自体は結果確定後にマウントされる設計のため、ここでの遅延はLINE受け皿ブロックの表示タイミングのみを指す（フォーム自体は変わらず表示）。',
    startedAt: '2026-07-12',
  },
  {
    // U-3（2026-07-12）：紹介・解放機構（T-1・UnlockGate）のティザー文言A/B。3アーム。
    // 好奇心訴求（現行・control）vs 損失回避訴求 vs 具体的ベネフィット訴求で unlock_granted（分母=unlock_teaser_view）を比較する。
    id: 'unlock-teaser-copy-2026',
    hypothesis: '解放ゲートのティザー文言を「見れていない」型の損失回避訴求、または「順位がわかる」型の具体的ベネフィット訴求にすると、現行の好奇心訴求より unlock_granted（共有/LINE追加による解放）が上がる。',
    status: 'running',
    arms: [
      {
        id: 'control',
        label: '好奇心訴求（現行）',
        heading: '全国の協力者と比べてみませんか？',
        body: 'おうちの人に結果を送るか、保護者向けLINEに登録すると、全国の協力者データと比べた「あなたの立ち位置」が見られるようになります。',
      },
      {
        id: 'loss',
        label: '損失回避訴求',
        heading: 'あなたの立ち位置、まだ見れていません',
        body: 'おうちの人に送るかLINE登録をするまで、全国の協力者データと比べた「あなたの立ち位置」は見られないままです。',
      },
      {
        id: 'benefit',
        label: '具体的ベネフィット訴求',
        heading: '同学年・同都道府県との差が、数字でわかります',
        body: 'おうちの人に送るかLINE登録をすると、同学年・同都道府県の受験生と比べた実際の順位（パーセンタイル）がすぐにわかります。',
      },
    ],
    primaryMetric: 'unlock_granted',
    note: 'UnlockGateのteaserTitle/teaserBody未指定時（=全設置面共通）の既定文言を差し替える。分母となるunlock_teaser_viewも同時計測。送信先・解放条件（共有 or LINE追加）は3アームとも同一。',
    startedAt: '2026-07-12',
  },
  {
    // ZZ-1c（2026-07-24）：匿名統計オプトインの価値交換コピーA/B。StatsOptInが参照。
    // ZZ-1b（NationalPercentileReveal）で「投稿すると立ち位置が見える」体験を実装したので、
    // オプトイン時点の文言でもその見返りを先出しで明示すれば同意率が上がるはずという仮説。
    id: 'stats-optin-value-exchange-2026',
    hypothesis: '匿名統計オプトインの文言を「投稿すると全国比較の立ち位置（パーセンタイル）が見られる」という具体的な見返り明示にすると、既定の汎用文言（分布データが正確になる）より同意率（stats_optin_grant）が上がる。',
    status: 'running',
    arms: [
      { id: 'control', label: '既定文言（汎用訴求：分布データが正確になる）' },
      {
        id: 'unlock-frame',
        label: '解禁フレーム（見返り明示）',
        heading: '投稿すると、あなたの立ち位置がわかります',
        body: '同意すると、全国・県内の協力者データと比べたあなたの立ち位置（パーセンタイル）がすぐに見られるようになります。送られるのは計算結果の数値のみで、氏名など個人を特定できる情報は一切含みません。同意はいつでも撤回できます。',
      },
    ],
    primaryMetric: 'stats_optin_grant',
    note: 'StatsOptInが参照。分母=stats_optin_view・分子=stats_optin_grant（いずれもvariantパラメータ付きで送出・variant別集計が可能）。全計算面（hensachi/naishin/total-score等）で母数を稼ぐ。',
    startedAt: '2026-07-24',
  },
  {
    // ZZ-2b（2026-07-24）：リードマグネットv2「県別・内申点アクションプラン」のnext step A/B。
    // SaveResultCTAが参照。既定(source+gapベースの汎用リンク)と、prefectures.ts実データ由来の
    // 県固有の事実+47県naishin-omomi面への深掘りリンク（W-13で全県執筆済み）を比較する。
    id: 'lead-magnet-action-plan-2026',
    hypothesis: 'リードマグネットの「次の一手」を県別の内申点制度の事実（実技倍率/学年比重等）に基づく具体的なアクションプランにすると、汎用の内申点の上げ方リンクよりnext step クリック率（lead_magnet_next）が上がる。',
    status: 'running',
    arms: [
      { id: 'control', label: '既定（source+gapベースの汎用next step）', body: 'next-step:generic' },
      { id: 'action-plan-v2', label: '県別アクションプラン（47県naishin-omomiへの個別深掘りリンク）', body: 'next-step:prefecture-action-plan' },
    ],
    primaryMetric: 'lead_magnet_next',
    note: '分母=lead_magnet_view・分子=lead_magnet_next（いずれもvariant付きで送出）。hensachi/hyotei-heikin系sourceは対象外（既に専用next stepがあるため）。',
    startedAt: '2026-07-24',
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

  /* ────────────────────────────────────────────────────────────────────
   * 実験バンク第2弾（TIER Q-1・2026-07-09追加）: 未配線の候補30本。
   * L-4の15本は「面（配置/オファー/色/タイミング）」軸で横断していたのに対し、
   * こちらは「コピーの型（訴求パターン）」軸で横断する30本＝見出し型5・社会証明型5・
   * 時期訴求型5・簡潔型5・保護者宛名型10。同一面でも異なる訴求パターンを試せるよう、
   * 既存のqueued/running実験とは別軸（同一placementへの追加ラウンドも可）で設計。
   * 社会証明型は「利用者数」等の未検証統計を一切使わず、既にサイト全体で実装済みの
   * 一次情報準拠（教育委員会/文科省統計）というデータ根拠のみを訴求する（捏造回避）。
   * 不登校クラスタの時期訴求は、対象読者の心理的負荷を踏まえ「早めの相談で選択肢が
   * 広がる」という機会訴求に留め、恐怖・強い緊急性を煽る表現は使わない。
   * ──────────────────────────────────────────────────────────────────── */

  // ── 見出し型（heading A/B）×5 ──
  {
    id: 'result-headline-2026',
    hypothesis: '結果画面で見出しを「志望校まであと何が必要か」というギャップ直接訴求にすると、既定の一般見出しより affiliate_click が伸びる（見出し型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'gap-frame', label: 'ギャップ直接訴求', heading: '志望校まで、あと何が必要か分かりましたか？' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'result',
    note: '配線先候補: ResultSection内のParentLeadCTA。見出し軸のみ変更し送客先・本文は既定を維持。result-offer-2026・result-second-round-timing-2026とは別軸。',
  },
  {
    id: 'hensachi-headline-2026',
    hypothesis: '偏差値ツールで見出しを「あと何点で偏差値が上がるか」の具体行動フレームにすると、既定の一般見出しより affiliate_click が伸びる（見出し型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'action-frame', label: '具体行動フレーム', heading: '偏差値をあと5上げるには、何をすればいいですか？' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hensachi',
    note: '配線先候補: /hensachi のParentLeadCTA。hensachi-cta-color-2026（色軸）とは別軸。',
  },
  {
    id: 'parent-lp-headline-2026',
    hypothesis: '/hogoshaで見出しを「今の内申点は志望校の基準に届いているか」という基準比較フレームにすると、既定より affiliate_click が伸びる（見出し型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'benchmark-frame', label: '基準比較フレーム', heading: '今の内申点、志望校の基準に届いていますか？' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'parent-lp',
    note: '配線先候補: /hogosha のCTA。hogosha-cta-text-2026（ctaPrefix軸）・parent-lp-order-2026（配置順軸）とは別軸。',
  },
  {
    id: 'blog-headline-2026',
    hypothesis: '記事内CTAで見出しを「この記事を読んだ今だからできること」という文脈連動フレームにすると、汎用見出しより affiliate_click が伸びる（見出し型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'context-frame', label: '文脈連動フレーム', heading: 'この記事を読んだ今、次にできることがあります' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'blog',
    note: '配線先候補: BlogCTA。blog-cta-timing-2026（timing軸）・blog-offer-2026（offer軸）とは別軸。',
  },
  {
    id: 'futoukou-headline-2026',
    hypothesis: '不登校クラスタで見出しを「学校に行けなくても進路の選択肢はある」という安心訴求にすると、既定見出しより affiliate_click が伸びる（見出し型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'reassurance-frame', label: '安心訴求フレーム', heading: '学校に行けなくても、進路の選択肢はあります' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'futoukou',
    note: '配線先候補: FutoukouLeadCTA。futoukou-offer-2026（offer軸）とは別軸。',
  },

  // ── 社会証明型（データ根拠訴求。利用者数等の未検証統計は不使用）×5 ──
  {
    id: 'home-social-proof-2026',
    hypothesis: 'トップページの保護者CTA本文に「47都道府県の教育委員会一次情報に基づく」というデータ根拠訴求を加えると、既定本文より affiliate_click が伸びる（社会証明型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（汎用訴求）' },
      {
        id: 'source-authority',
        label: 'データ根拠訴求',
        body: '内申点・偏差値は「今からの伸ばし方」で大きく変わります。47都道府県の教育委員会が公表する入学者選抜要綱を一次情報として計算しており、ご家庭でできる対策をまずは無料の資料で確認できます。',
      },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'home',
    note: '利用者数・満足度等の未検証統計は使わず、既に/for-teachers等で実装済みの一次情報準拠という事実のみを訴求（捏造回避）。home-cta-color-2026（色軸）とは別軸。',
  },
  {
    id: 'hyotei-heikin-social-proof-2026',
    hypothesis: '評定平均ツールの本文に「学校推薦型・総合型選抜での評定平均の使われ方に基づく」というデータ根拠訴求を加えると、既定本文より affiliate_click が伸びる（社会証明型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（汎用訴求）' },
      {
        id: 'source-authority',
        label: 'データ根拠訴求',
        body: '評定平均は学校推薦型・総合型選抜の出願基準として使われます。仕組みを踏まえた対策を、まずは無料の資料で確認できます。',
      },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hyotei-heikin',
    note: 'hyotei-heikin-heading-2026（見出し軸）とは別軸。',
  },
  {
    id: 'prefecture-social-proof-2026',
    hypothesis: '県別ページの保護者CTA本文に「お住まいの都道府県の教育委員会データに基づく」というデータ根拠訴求を加えると、既定本文より affiliate_click が伸びる（社会証明型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（汎用訴求）' },
      {
        id: 'source-authority',
        label: 'データ根拠訴求',
        body: 'お住まいの都道府県の教育委員会が公表する入学者選抜要綱に基づいて計算しています。今からの対策を、まずは無料の資料で確認できます。',
      },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'prefecture',
    note: 'prefecture-order-2026（配置順軸）とは別軸。',
  },
  {
    id: 'hiyou-social-proof-2026',
    hypothesis: '学費シミュレーターの本文に「文部科学省の統計に基づく試算」というデータ根拠訴求を加えると、既定本文より affiliate_click が伸びる（社会証明型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（汎用訴求）' },
      {
        id: 'source-authority',
        label: 'データ根拠訴求',
        body: '文部科学省の統計に基づく教育費データで試算しています。進路によって数百万円規模で変わる教育費を、まずは無料でFPに相談できます。',
      },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hiyou',
    note: 'hiyou-copy-2026・hiyou-third-round-copy-2026（いずれもフレーム軸）とは別軸。education-costエンジンが文科省統計ベースである事実のみを訴求。',
  },
  {
    id: 'mendan-social-proof-2026',
    hypothesis: '三者面談パックの本文に「内申点・偏差値の実測値をそのまま使える」というデータ根拠訴求を加えると、既定本文より affiliate_click が伸びる（社会証明型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（汎用訴求）' },
      {
        id: 'source-authority',
        label: 'データ根拠訴求',
        body: 'ご家庭で計算した内申点・偏差値の実測値をそのまま面談準備に使えます。面談前に、対策の相談先も確認しておきましょう。',
      },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'mendan',
    note: 'mendan-offer-2026（offer軸）とは別軸。「学校の先生も使っている」等の未検証な採用実績は主張しない。',
  },

  // ── 時期訴求型（urgency/timing A/B）×5 ──
  {
    id: 'suisen-urgency-2026',
    hypothesis: '総合型選抜・学校推薦型選抜の出願時期（秋）が近いタイミングで時期を明示した見出しにすると、既定より affiliate_click が伸びる（時期訴求型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（制度解説フレーム）' },
      { id: 'season-frame', label: '出願シーズン明示フレーム', heading: '出願シーズンに向けて、今のうちに学費の相談を' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'suisen',
    note: 'suisen-copy-2026（学費フレーム軸）とは別軸。断定日付は書かず「出願シーズン」という一般的な時期感のみ。秋（9-11月）に活性化するのが自然。',
  },
  {
    id: 'jitsugika-urgency-2026',
    hypothesis: '実技教科の評定は学期末の通知表で確定するため、時期を明示した見出しにすると既定より affiliate_click が伸びる（時期訴求型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（弱点克服フレーム）' },
      { id: 'timing-frame', label: '通知表前の時期明示フレーム', heading: '次の通知表が出る前に、実技教科の対策を' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'jitsugika',
    note: 'jitsugika-copy-2026（内申点影響フレーム軸）とは別軸。学期末（7月・12月・3月頃）に活性化するのが自然。',
  },
  {
    id: 'naishin-up-urgency-2026',
    hypothesis: '内申点の上げ方面で、次の通知表が出る前という時期を明示した見出しにすると既定より affiliate_click が伸びる（時期訴求型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'timing-frame', label: '通知表前の時期明示フレーム', heading: '次の通知表が出る前に、内申点の伸ばし方を確認' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'naishin-up',
    note: 'naishin-up-offer-2026（offer軸）とは別軸。',
  },
  {
    id: 'dashboard-urgency-2026',
    hypothesis: '成績ダッシュボードで、新しい記録を追加した直後という時期を明示した見出しにすると既定より affiliate_click が伸びる（時期訴求型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'just-recorded-frame', label: '記録直後の時期明示フレーム', heading: '今回の記録が出た今だからこそ、次に向けた対策を' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'dashboard',
    note: 'dashboard-cta-copy-2026（前回比差分フレーム軸）とは別軸。',
  },
  {
    id: 'futoukou-urgency-2026',
    hypothesis: '不登校クラスタで「早めの相談ほど選べる選択肢が増える」という機会訴求にすると既定より affiliate_click が伸びる（時期訴求型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'early-opportunity-frame', label: '早期相談の機会訴求フレーム', heading: '早めに相談するほど、選べる選択肢が増えます' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'futoukou',
    note: '対象読者の心理的負荷に配慮し、恐怖・強い緊急性を煽らず「早いほど選択肢が増える」という前向きな機会訴求に留める。futoukou-offer-2026・futoukou-headline-2026とは別軸。',
  },

  // ── 簡潔型（コピー短縮 A/B）×5 ──
  {
    id: 'hensachi-concise-2026',
    hypothesis: '偏差値ツールの本文を短く簡潔にすると、既定の長め本文より cta_view→affiliate_click が伸びる（簡潔型A/B。読了負荷を下げて離脱を防ぐ仮説）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（詳しめの説明）' },
      { id: 'concise', label: '簡潔本文（1文に短縮）', body: '偏差値は伸ばし方次第。無料の資料でご家庭の対策を確認できます。' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hensachi',
    note: 'hensachi-cta-color-2026・hensachi-headline-2026とは別軸。内容の主張は変えず文字数のみ短縮。',
  },
  {
    id: 'hyotei-heikin-concise-2026',
    hypothesis: '評定平均ツールの本文を短く簡潔にすると、既定の長め本文より affiliate_click が伸びる（簡潔型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（詳しめの説明）' },
      { id: 'concise', label: '簡潔本文（1文に短縮）', body: '評定平均は伸ばし方次第。無料の資料で対策を確認できます。' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hyotei-heikin',
    note: 'hyotei-heikin-heading-2026・hyotei-heikin-social-proof-2026とは別軸。',
  },
  {
    id: 'prefecture-concise-2026',
    hypothesis: '県別ページの保護者CTA本文を短く簡潔にすると、既定の長め本文より affiliate_click が伸びる（簡潔型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（詳しめの説明）' },
      { id: 'concise', label: '簡潔本文（1文に短縮）', body: '内申点は今からの対策で変わります。無料の資料で確認できます。' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'prefecture',
    note: 'prefecture-order-2026・prefecture-social-proof-2026とは別軸。',
  },
  {
    id: 'home-concise-2026',
    hypothesis: 'トップページの保護者CTA本文を短く簡潔にすると、既定の長め本文より affiliate_click が伸びる（簡潔型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（詳しめの説明）' },
      { id: 'concise', label: '簡潔本文（1文に短縮）', body: '内申点・偏差値は今からの対策で変わります。無料の資料で確認できます。' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'home',
    note: 'home-cta-color-2026・home-social-proof-2026とは別軸。',
  },
  {
    id: 'result-concise-2026',
    hypothesis: '結果画面の保護者CTA本文を短く簡潔にすると、既定の長め本文より affiliate_click が伸びる（簡潔型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定本文（詳しめの説明）' },
      { id: 'concise', label: '簡潔本文（1文に短縮）', body: 'この結果を踏まえた対策を、無料の資料で確認できます。' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'result',
    note: 'result-offer-2026・result-headline-2026・result-second-round-timing-2026とは別軸。',
  },

  // ── 保護者宛名型（見出しで「保護者の方へ」と直接呼びかけるA/B）×10 ──
  {
    id: 'blog-parent-address-2026',
    hypothesis: '記事内CTAの見出しで「保護者の方へ」と直接呼びかけると、既定の汎用見出しより affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：お子さまの今の内申点・偏差値を無料で確認できます' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'blog',
    note: 'blog-cta-timing-2026・blog-offer-2026・blog-headline-2026とは別軸。',
  },
  {
    id: 'dashboard-parent-address-2026',
    hypothesis: '成績ダッシュボードの見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：お子さまの成績推移を踏まえた次の一手' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'dashboard',
    note: 'dashboard-cta-copy-2026・dashboard-urgency-2026とは別軸。',
  },
  {
    id: 'mendan-parent-address-2026',
    hypothesis: '三者面談パックの見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：三者面談前に準備しておきたいこと' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'mendan',
    note: 'mendan-offer-2026・mendan-social-proof-2026とは別軸。',
  },
  {
    id: 'suisen-parent-address-2026',
    hypothesis: '推薦・総合型選抜面の見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（制度解説フレーム）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：推薦・総合型選抜後の学費、今から相談できます' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'suisen',
    note: 'suisen-copy-2026・suisen-urgency-2026とは別軸。',
  },
  {
    id: 'naishin-up-parent-address-2026',
    hypothesis: '内申点の上げ方面の見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：内申点を上げるためにご家庭でできること' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'naishin-up',
    note: 'naishin-up-offer-2026・naishin-up-urgency-2026とは別軸。',
  },
  {
    id: 'jitsugika-parent-address-2026',
    hypothesis: '実技教科対策面の見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（弱点克服フレーム）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：実技教科の内申点、対策の選択肢があります' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'jitsugika',
    note: 'jitsugika-copy-2026・jitsugika-urgency-2026とは別軸。',
  },
  {
    id: 'futoukou-parent-address-2026',
    hypothesis: '不登校クラスタの見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：お子さまの「学校に行けない」を進路の不利にしない方法があります' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'futoukou',
    note: 'futoukou-offer-2026・futoukou-headline-2026・futoukou-urgency-2026とは別軸。文言はfutoukou-headline-2026と重複しないよう別表現にした。',
  },
  {
    id: 'hiyou-parent-address-2026',
    hypothesis: '学費シミュレーターの見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（一般論フレーム）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：高校3年間の教育費、今から把握できます' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'hiyou',
    note: 'hiyou-copy-2026・hiyou-third-round-copy-2026・hiyou-social-proof-2026とは別軸。',
  },
  {
    id: 'parent-lp-parent-address-2026',
    hypothesis: '/hogoshaの見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：お子さまの内申点・偏差値を今すぐ無料で確認' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'parent-lp',
    note: '既に保護者向けLPだが、明示的な宛名呼びかけの効きを検証。parent-lp-order-2026・parent-lp-headline-2026とは別軸。',
  },
  {
    id: 'home-parent-address-2026',
    hypothesis: 'トップページの見出しで「保護者の方へ」と直接呼びかけると、既定より affiliate_click が伸びる（保護者宛名型A/B）。',
    status: 'queued',
    arms: [
      { id: 'control', label: '既定見出し（汎用訴求）' },
      { id: 'parent-address', label: '保護者宛名フレーム', heading: '保護者の方へ：お子さまの内申点、今のままで大丈夫ですか？' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'home',
    note: 'home-cta-color-2026・home-social-proof-2026・home-concise-2026とは別軸。',
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
  /**
   * 現在観測されているリフト（bestRate-controlRate）を本当の効果量だと仮定した場合に、
   * 有意差を検出力80%で検出するのに各アーム必要な母数の目安（Q-2）。
   * controlRate=0またはリフト=0で計算不能なときはnull（事後検出力の参考値であり、これ単体を
   * 停止基準にはしない＝既存のminSample/有意差判定が引き続き唯一の意思決定ロジック）。
   */
  requiredSampleEstimate: number | null;
  /** 日本語の一言（運用にそのまま出せる）。 */
  recommendation: string;
}

/* ────────────────────────────────────────────────────────────────────────
 * 検出力分析（Q-2）：二項比率の検出力サンプルサイズ計算（標準公式・Fleiss et al.）。
 * n = (z_(α/2)・√(2p̄q̄) + z_β・√(p1q1+p2q2))² / (p1-p2)²
 * z値は既定のα=0.05（両側）・power=0.8/0.9のみサポート（任意値の逆正規分布計算は
 * 近似誤差が積み重なりやすいため、実務でよく使う組み合わせに限定して精度を担保する）。
 * ──────────────────────────────────────────────────────────────────────── */

/** 有意水準（両側）ごとの z_(α/2)。サポート外の値を渡すとrequiredSampleSizePerArmがエラーを投げる。 */
const Z_ALPHA_TWO_SIDED: Record<number, number> = { 0.05: 1.959964, 0.01: 2.575829 };
/** 検出力ごとの z_β。サポート外の値を渡すとrequiredSampleSizePerArmがエラーを投げる。 */
const Z_BETA: Record<number, number> = { 0.8: 0.841621, 0.9: 1.281552 };

/** requiredSampleSizePerArm の既定の有意水準（両側5%）。 */
export const DEFAULT_TEST_ALPHA = 0.05;
/** requiredSampleSizePerArm の既定の検出力（80%）。 */
export const DEFAULT_TEST_POWER = 0.8;

export interface SampleSizeInput {
  /** controlの想定CVR（0-1）。 */
  baselineRate: number;
  /** 検出したい絶対差（0-1・例0.02=2ポイント差。相対リフトでなく絶対差で指定する）。 */
  minDetectableEffect: number;
  /** 有意水準（両側・既定0.05）。サポート値: 0.05, 0.01。 */
  alpha?: number;
  /** 検出力（既定0.8）。サポート値: 0.8, 0.9。 */
  power?: number;
}

/**
 * 二項比率のA/Bで、指定した検出力・有意水準のもとで最小検出差を検出するのに
 * 各アームへ必要な最小サンプルサイズ（分母）を返す（標準公式・純粋関数）。
 * 「最小サンプルは何件あればいいか」を勘でなく計算で決めるための土台（Q-2）。
 */
export function requiredSampleSizePerArm(input: SampleSizeInput): number {
  const alpha = input.alpha ?? DEFAULT_TEST_ALPHA;
  const power = input.power ?? DEFAULT_TEST_POWER;
  const zAlpha = Z_ALPHA_TWO_SIDED[alpha];
  const zBeta = Z_BETA[power];
  if (zAlpha === undefined) throw new Error(`requiredSampleSizePerArm: unsupported alpha ${alpha}（対応値: ${Object.keys(Z_ALPHA_TWO_SIDED).join(', ')}）`);
  if (zBeta === undefined) throw new Error(`requiredSampleSizePerArm: unsupported power ${power}（対応値: ${Object.keys(Z_BETA).join(', ')}）`);
  if (input.minDetectableEffect <= 0) throw new Error('requiredSampleSizePerArm: minDetectableEffect must be > 0');

  const p1 = input.baselineRate;
  const p2 = input.baselineRate + input.minDetectableEffect;
  const pBar = (p1 + p2) / 2;
  const term1 = zAlpha * Math.sqrt(2 * pBar * (1 - pBar));
  const term2 = zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  const n = (term1 + term2) ** 2 / input.minDetectableEffect ** 2;
  return Math.ceil(n);
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

  // 現在観測中のリフトを真の効果量と仮定した場合の必要サンプル目安（事後診断・停止基準ではない）。
  const observedEffect = Math.abs(bestRate - controlRate);
  let requiredSampleEstimate: number | null = null;
  if (best.id !== control.id && controlRate > 0 && controlRate < 1 && observedEffect > 0) {
    try {
      requiredSampleEstimate = requiredSampleSizePerArm({ baselineRate: controlRate, minDetectableEffect: observedEffect });
    } catch {
      requiredSampleEstimate = null;
    }
  }

  let recommendation: string;
  if (best.id === control.id) {
    recommendation = enoughSample
      ? `対照群（${control.id}）が最良。現状維持を推奨。`
      : `サンプル不足（各アーム${minSample}件未満）。判定保留。`;
  } else if (!enoughSample) {
    const powerNote = requiredSampleEstimate !== null ? `（検出力80%の目安：各アーム約${fmtSampleSize(requiredSampleEstimate)}件）` : '';
    recommendation = `${best.id} がリード（+${(lift * 100).toFixed(1)}%）だがサンプル不足。継続して母数を貯める${powerNote}。`;
  } else if (significant) {
    recommendation = `${best.id} を採用推奨：control比 +${(lift * 100).toFixed(1)}%・有意（p≈${pValue.toFixed(3)}）。lead-config / コピーを ${best.id} に昇格。`;
  } else {
    recommendation = `${best.id} がやや優勢（+${(lift * 100).toFixed(1)}%）だが有意差なし（p≈${pValue.toFixed(3)}）。継続。`;
  }

  return { control: control.id, controlRate, bestArm: best.id, bestRate, lift, z, pValue, significant, requiredSampleEstimate, recommendation };
}

/** 3桁区切りの簡易フォーマット（依存追加を避けるための最小実装）。 */
function fmtSampleSize(n: number): string {
  return n.toLocaleString('en-US');
}
