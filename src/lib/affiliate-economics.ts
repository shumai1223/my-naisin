/**
 * 送客の「推定経済性」＝クリック実数から 推定リード数／推定額 を概算するための係数（H5）。
 *
 * ⚠ 重要（[[monetization-reality-2026-06]] / [[no-revenue-projections-guideline]]）：
 *   ここの CPA・転換率は **すべて未実測の「仮定」** です（ASPの公開報酬・一般的な相場から置いた推定値）。
 *   実際の確定報酬は ASP 管理画面が正。これは「営業資料・KPIの当たりをつける」ための概算であって、
 *   予測の断定ではありません。実測値が出たら必ずこの表を実数で置き換える運用（捏造ゼロの原則）。
 *
 * 【2026-06-19 三層化】「盛れすぎ」を是正。楽観だけでなく保守を主役に：
 *   - convRate    … 楽観転換率（理想上限＝営業の天井）。従来値。
 *   - convRateLow … 保守転換率（権限ズレ＝生徒面で保護者案件は完結しづらい、を織り込んだ現実線）。**主役**。
 *   - CONFIRM_RATE… 「発生→確定（着金）」の歩留まり。ASP却下（無効/重複/条件未達）を控除する係数。
 *   推定発生額（楽観）= clicks × convRate    × cpaYen
 *   推定確定額（保守）= clicks × convRateLow × cpaYen × CONFIRM_RATE   ← ダッシュボードの主役
 *
 * 使い手：
 *  - /admin/report（認証付き・送客アナリティクスの金額換算）
 *  - scripts/generate-sales-report.ts（月次の営業/振り返りレポート Markdown 生成）
 *
 * PLAYBOOK移植メモ（F-7④）: 型・計算式（EV公式そのもの）は src/lib/ev-engine.ts に分離済み
 * （他サイトへそのままコピー可能）。このファイルに残るのは my-naishin 固有の実データ
 * （AFFILIATE_ECONOMICS・CONFIRM_RATE等の仮定値）と、AffiliateId に紐づくルックアップ関数群。
 *
 * 【U-5・2026-07-12 業界公開データによる裏取り調査】
 *   クリックデータがほぼ0（実測待ち）のため、ASPが公表している一般値をWebSearchで調査し、
 *   下記の仮定値の「桁がおかしくないか」を実測データ非依存で補強した（数値そのものを上書きは
 *   しない＝業界ブログの概算値で個別プログラムの数値を書き換えるのは偽の精度＝捏造リスクのため）。
 *   - CVR一般値: クリック起点のCVRは業界一般に3〜10%、うち「資料請求・無料登録」等の
 *     金銭負担ゼロの成果地点は3〜5%超と高めに出やすいとされる（複数のアフィリエイト解説記事）。
 *     → doc-request の convRate=0.12/convRateLow=0.06、free-lead の 0.08/0.04 はこの帯の
 *       上限寄りだが、高インテント流入（内申点/偏差値計算直後の保護者）を考えれば桁として妥当。
 *   - 承認率: ASP各社（バリューコマース等）はプログラム単位の平均承認率を会員向けに開示するが、
 *     業界横断の公開統計は無い。アフィリエイター向け解説では「承認率70%程度」が目安として
 *     語られることが多い（却下理由＝重複成果・期日超過キャンセル・悪戯注文等）。
 *     → CONFIRM_RATE=0.6（却下40%）はこの「70%目安」より厳しめ＝保守側に振っており妥当。
 *   - 学習塾ジャンルの実例: 学習塾アフィリエイトの報酬レンジは公開情報で1,500〜25,000円、
 *     内訳は「資料請求・問い合わせ」が1,500〜2,900円、「入塾（本契約）」が数千〜25,000円と
 *     報告されている。→ 本ファイルの塾・家庭教師の無料体験系CPA（3,000〜5,000円）は、この
 *     「資料請求」と「入塾」の中間＝無料体験という成果地点の位置づけとして桁が整合する。
 *   - 未検証のまま残るもの: FP相談・学資保険個別プログラムのCVRはASPが個別公開しておらず、
 *     業界一般値での裏取りができなかった（fp-soudan/hoken-compass等の convRate=0.05 は
 *     引き続き未実測の仮置き）。実クリックデータが貯まり次第、最優先でこの帯から実測へ置換する。
 */

import { AFFILIATES, isLiveAffiliate, type AffiliateId } from '@/lib/affiliates';
import {
  type OfferKind,
  type AffiliateEconomics,
  commitmentLevel,
  yen,
  estimatedLeadsFor,
  estimatedLeadsLowFor,
  estimatedRevenueYenFor,
  confirmedRevenueYenFor,
} from '@/lib/ev-engine';

export type { OfferKind, AffiliateEconomics };
export { commitmentLevel, yen };

/**
 * 「発生」→「確定（着金）」の歩留まり。ASPは無効・重複・条件未達のリードを 3〜4割却下するため、
 * 保守側の確定額にこの控除を掛ける。発生≠着金を数式に織り込むための単一係数。
 */
export const CONFIRM_RATE = 0.6;

/**
 * 種別ごとの既定（個別指定が無いプログラムのフォールバック）。
 * 無料リードは CVR が高くCPA中、有料は CVR が低くEPCで溶ける、という北極星の経験則を反映。
 */
const KIND_DEFAULT: Record<OfferKind, AffiliateEconomics> = {
  'free-lead': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'doc-request': { cpaYen: 600, convRate: 0.12, convRateLow: 0.06, kind: 'doc-request' },
  paid: { cpaYen: 1500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
};

/**
 * プログラム別の推定経済性（仮定）。CPAは ASP公開値・相場の概算、convRate は未実測の仮置き。
 * convRateLow は「生徒が大半の流入で、保護者の決裁が要る案件ほど完結率が落ちる」を織り込んだ保守値：
 *   - 塾/家庭教師の無料体験（生徒に直接刺さる）= 4% 前後
 *   - FP相談/学資/不登校資料など高CPAの保護者案件（生徒面では完結しづらい）= 1.5〜2%
 *   - 資料請求 = 6%、有料 = 0.5〜1.2%
 * 実測が出たら上書きする。未掲載IDは下の economicsFor() で種別既定にフォールバック。
 */
export const AFFILIATE_ECONOMICS: Partial<Record<AffiliateId, AffiliateEconomics>> = {
  // ── 最高単価帯（保護者＝決裁者・無料相談/資料請求／生徒面では完結しづらい＝保守は厳しめ） ──
  'fp-soudan': { cpaYen: 13800, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' }, // もしも・保険トータルプロフェッショナル
  'hoken-compass': { cpaYen: 12000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'money-doctor': { cpaYen: 11000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'gakushi-hoken': { cpaYen: 8000, convRate: 0.06, convRateLow: 0.02, kind: 'doc-request' },
  // ── もしも 2026-07-07 承認分（FP・学資＝保護者決裁で保守厳しめ／塾・家庭教師＝生徒に刺さる） ──
  'moshimo-garden-gakushi': { cpaYen: 11500, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'moshimo-garden-chochiku': { cpaYen: 11500, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'moshimo-manecafe': { cpaYen: 11500, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'moshimo-minhoken': { cpaYen: 17000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'moshimo-withstudy': { cpaYen: 11500, convRate: 0.07, convRateLow: 0.04, kind: 'free-lead' },
  'moshimo-manabuterasu': { cpaYen: 8000, convRate: 0.06, convRateLow: 0.04, kind: 'free-lead' },
  // ── 不登校クラスタ（高CPA・専門性で転換しやすい仮定／資料系は保護者決裁で保守厳しめ） ──
  'moshimo-classjapan': { cpaYen: 20000, convRate: 0.04, convRateLow: 0.015, kind: 'free-lead' },
  'moshimo-tintoru': { cpaYen: 5000, convRate: 0.07, convRateLow: 0.04, kind: 'free-lead' },
  // ── 塾・家庭教師の無料体験（本線の換金口・生徒に直接刺さる＝保守4%前後） ──
  'moshimo-e-live': { cpaYen: 5000, convRate: 0.07, convRateLow: 0.04, kind: 'free-lead' },
  'moshimo-studycoach': { cpaYen: 5000, convRate: 0.06, convRateLow: 0.04, kind: 'free-lead' },
  'moshimo-rewrite': { cpaYen: 3000, convRate: 0.06, convRateLow: 0.04, kind: 'free-lead' },
  'sora-juku-text': { cpaYen: 3500, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'morijuku-text': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'campus-text': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'atama-text': { cpaYen: 4000, convRate: 0.07, convRateLow: 0.04, kind: 'free-lead' },
  // 家庭教師の高CPA（保護者決裁＝保守厳しめ）
  'gakken-katei-kyoshi': { cpaYen: 12000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'ganba-katei-kyoshi': { cpaYen: 11000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'manalink-katei-kyoshi': { cpaYen: 8000, convRate: 0.05, convRateLow: 0.02, kind: 'free-lead' },
  'afb-juku-trial': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'accesstrade-juku-trial': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'rentracks-juku-trial': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  // 季節講習（受験直前/長期休みの高インテント＝通年より転換やや高めの仮定）
  'winter-koushuu-trial': { cpaYen: 4000, convRate: 0.1, convRateLow: 0.05, kind: 'free-lead' },
  'summer-koushuu-trial': { cpaYen: 4000, convRate: 0.09, convRateLow: 0.045, kind: 'free-lead' },
  // 入試直前（1-2月）＝出願・当日点で検索意図が最も切実な窓＝季節枠の中でも転換は最も高めの仮定（D-7）
  'last-minute-trial': { cpaYen: 4000, convRate: 0.11, convRateLow: 0.055, kind: 'free-lead' },
  'afb-katei-kyoshi': { cpaYen: 10000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  // ── 通信教育（資料請求＝溶けにくい無料リード） ──
  'zkai-text-request': { cpaYen: 800, convRate: 0.12, convRateLow: 0.06, kind: 'doc-request' },
  'zkai-daigaku': { cpaYen: 800, convRate: 0.1, convRateLow: 0.05, kind: 'doc-request' },
  // ── 通信教育・スマホ学習（EPC型・有料寄り） ──
  'zkai-banner': { cpaYen: 500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
  'zkai-text-middle': { cpaYen: 500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
  'zkai-text-advanced': { cpaYen: 500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
  'sapuri-text': { cpaYen: 1500, convRate: 0.02, convRateLow: 0.008, kind: 'paid' },
  'sapuri-banner-468': { cpaYen: 1500, convRate: 0.015, convRateLow: 0.006, kind: 'paid' },
  'sapuri-banner-300': { cpaYen: 1500, convRate: 0.015, convRateLow: 0.006, kind: 'paid' },
  'sora-juku-banner': { cpaYen: 3500, convRate: 0.06, convRateLow: 0.03, kind: 'free-lead' },
  'morijuku-banner': { cpaYen: 4000, convRate: 0.06, convRateLow: 0.03, kind: 'free-lead' },
  'campus-banner': { cpaYen: 4000, convRate: 0.06, convRateLow: 0.03, kind: 'free-lead' },
  'atama-banner': { cpaYen: 4000, convRate: 0.05, convRateLow: 0.03, kind: 'free-lead' },
  'shoin-banner': { cpaYen: 800, convRate: 0.03, convRateLow: 0.012, kind: 'paid' },
  // ── アクセストレード（入会＝paid型・CVR低めの仮定） ──
  'shinken-koukou': { cpaYen: 5860, convRate: 0.02, convRateLow: 0.008, kind: 'paid' },
  'eten-net': { cpaYen: 1905, convRate: 0.02, convRateLow: 0.008, kind: 'paid' },
};

/** プログラムの推定経済性を返す（未掲載は free-lead 既定）。 */
export function economicsFor(id: AffiliateId): AffiliateEconomics {
  return AFFILIATE_ECONOMICS[id] ?? KIND_DEFAULT['free-lead'];
}

/** 種別の日本語ラベル（営業資料・監査表示の単一ソース）。 */
export const OFFER_KIND_LABEL: Record<OfferKind, string> = {
  'doc-request': '資料請求（無料）',
  'free-lead': '無料リード（体験/相談）',
  paid: '有料成約',
};

/**
 * 保護者リード面に置いて良いオファーか（=有料成約でない）。
 * 「保護者 × 無料リード」だけが効くという北極星を、コードで判定可能にする（CIで戦略ドリフトを止める）。
 */
export function isParentSafeOffer(id: AffiliateId): boolean {
  return economicsFor(id).kind !== 'paid';
}

/** クリック数 → 推定成果（リード）数【楽観】。 */
export function estimatedLeads(id: AffiliateId, clicks: number): number {
  return estimatedLeadsFor(economicsFor(id), clicks);
}

/** クリック数 → 推定成果（リード）数【保守】。 */
export function estimatedLeadsLow(id: AffiliateId, clicks: number): number {
  return estimatedLeadsLowFor(economicsFor(id), clicks);
}

/** クリック数 → 推定発生額（円）【楽観】。発生≠着金（承認・確定はラグ＋却下あり）。 */
export function estimatedRevenueYen(id: AffiliateId, clicks: number): number {
  return estimatedRevenueYenFor(economicsFor(id), clicks);
}

/**
 * クリック数 → 推定確定額（円）【保守・主役】。
 * 保守転換率 × CPA × 却下控除（CONFIRM_RATE）で「着金見込み」に寄せた現実線。
 */
export function confirmedRevenueYen(id: AffiliateId, clicks: number): number {
  return confirmedRevenueYenFor(economicsFor(id), clicks, CONFIRM_RATE);
}

// ── EVランキング（“既存アフィリの最適解”の単一ソース） ──────────────────────────
/**
 * クリック1,000あたりの推定確定額（保守・主役）＝1オファーのEVを表す単一の指標。
 * 「この面にどのオファーを置くと1クリックがいくら生むか」を1数字で比較するための正準関数。
 */
export function confirmedPer1000(id: AffiliateId): number {
  return confirmedRevenueYen(id, 1000);
}

export interface LiveOfferEV {
  id: AffiliateId;
  programName: string;
  kind: OfferKind;
  cpaYen: number;
  /** クリック1,000あたりの推定確定額（保守）。EVの単一指標。 */
  confirmedPer1000: number;
}

/**
 * live な全プログラムを「1クリックあたりの推定確定額（保守）」の高い順に並べた表。
 * ＝いま提携済みのアフィリの中で“1クリックがいくら生むか”の単一の真実。配置最適化の物差し。
 *
 * 使い道：
 *  - /admin/report・generate-sales-report に「稼ぐ順」を出し、どの面を高EVオファーに寄せるか判断する。
 *  - 新規承認が出たら AFFILIATES を live にするだけで、ここに自動で正しい順位で並ぶ（＝手作業のランキング更新が不要）。
 *  - CIの不変条件（保護者面に高EVの無料リードが載っているか）を機械検証する土台。
 * pending（未確定枠＝デッドリンクで0円）は除外する。
 */
export function rankLiveOffersByEV(): LiveOfferEV[] {
  return (Object.keys(AFFILIATES) as AffiliateId[])
    .filter((id) => isLiveAffiliate(id))
    .map((id) => {
      const e = economicsFor(id);
      return {
        id,
        programName: AFFILIATES[id].name,
        kind: e.kind,
        cpaYen: e.cpaYen,
        confirmedPer1000: confirmedRevenueYen(id, 1000),
      };
    })
    .sort((a, b) => b.confirmedPer1000 - a.confirmedPer1000);
}

/**
 * 述語に合う live プログラムのうち EV 最大の1つのIDを返す（未一致は undefined）。
 * 面に置く「最適オファー」をIDハードコードせず選ぶのに使う
 * （例：全国オンライン塾の無料体験のうちEV最大＝承認状況が変わっても自動で最適へ追従できる）。
 */
export function topLiveOfferByEV(
  predicate: (o: LiveOfferEV) => boolean = () => true
): AffiliateId | undefined {
  return rankLiveOffersByEV().find(predicate)?.id;
}
