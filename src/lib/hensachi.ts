/**
 * 偏差値（deviation value）まわりの決定論ライブラリ。
 *
 * すべて数式で確定する＝検証済み県データ不要＝「信頼の堀」リスクゼロ。
 * /hensachi 配下の各ページ・各クライアントツール・jest テストの単一ソース。
 *
 * 設計方針：
 * - 偏差値→上位%・順位は正規分布から数学的に厳密に算出（模試の種類に依存しない）。
 * - 「偏差値→高校レベル」「偏差値↔内申点」は一般的に公表されている“目安バンド”であり、
 *   特定校の合格ボーダーは一切含めない（信頼の堀を守る／断定しない）。
 */

/* ────────────────────────────────────────────────────────────────────────
 * 正規分布ユーティリティ
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * 標準正規分布の累積分布関数 Φ(z)＝P(Z ≤ z)。
 * Abramowitz & Stegun 7.1.26 の erf 近似（絶対誤差 < 1.5e-7）を用いる。
 */
export function standardNormalCdf(z: number): number {
  // Φ(z) = 0.5 * (1 + erf(z / √2))
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const erf =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-((z / Math.SQRT2) * (z / Math.SQRT2)));
  const signed = z < 0 ? -erf : erf;
  return 0.5 * (1 + signed);
}

/**
 * 標準正規分布の逆関数（probit）。下側確率 p（0<p<1）に対応する z を返す。
 * Acklam の有理多項式近似（相対誤差 < 1.15e-9）。
 */
export function standardNormalInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/* ────────────────────────────────────────────────────────────────────────
 * 偏差値そのものの計算
 * ──────────────────────────────────────────────────────────────────────── */

/** 標準的な定期テストの標準偏差の目安（成績表に記載がない場合の既定値）。 */
export const DEFAULT_STD_DEV = 15;

/** 偏差値 = 50 + 10 × (自分の点数 − 平均点) ÷ 標準偏差。無効入力は null。 */
export function calcHensachi(score: number, average: number, stdDev: number): number | null {
  if (!Number.isFinite(score) || !Number.isFinite(average) || !Number.isFinite(stdDev) || stdDev <= 0) {
    return null;
  }
  return 50 + (10 * (score - average)) / stdDev;
}

/** 偏差値を小数1桁に丸める（表示用）。 */
export function roundHensachi(h: number): number {
  return Math.round(h * 10) / 10;
}

/** 偏差値 h に対応する z 値（z = (h − 50) / 10）。 */
export function hensachiToZ(h: number): number {
  return (h - 50) / 10;
}

/** 偏差値 h の「上位パーセンタイル」(%)。例：偏差値60 → 約15.87%（＝上位約16%）。 */
export function hensachiToUpperPercent(h: number): number {
  const z = hensachiToZ(h);
  return (1 - standardNormalCdf(z)) * 100;
}

/**
 * 偏差値 h の、母集団 population 人中の順位（1始まり、上位から数えた概算）。
 * 例：偏差値50・300人 → 150位、偏差値60・300人 → 約48位。
 */
export function hensachiToRank(h: number, population: number): number {
  const upper = hensachiToUpperPercent(h) / 100;
  return Math.max(1, Math.min(population, Math.ceil(upper * population)));
}

/** 上位パーセンタイル(%)（0〜100）から偏差値を逆算。例：上位16% → 約59.9。 */
export function upperPercentToHensachi(upperPercent: number): number {
  const clamped = Math.min(99.999, Math.max(0.001, upperPercent));
  // 上側 upperPercent% は下側 (100 − upperPercent)% 分位点。
  const z = standardNormalInv(1 - clamped / 100);
  return 50 + 10 * z;
}

/**
 * 母集団 population 人中 rank 位（1始まり、上位から数えた順位）から偏差値を逆算。
 * 順位は整数に量子化されているため hensachiToRank と厳密な往復一致はしない（概算）。
 * 無効入力（0以下・非有限）は null。
 */
export function rankToHensachi(rank: number, population: number): number | null {
  if (!Number.isFinite(rank) || !Number.isFinite(population) || population <= 0 || rank <= 0) {
    return null;
  }
  const clampedRank = Math.min(rank, population);
  const upperPercent = (clampedRank / population) * 100;
  return upperPercentToHensachi(upperPercent);
}

/* ────────────────────────────────────────────────────────────────────────
 * 教科メタ（5教科 / 3教科 / 主要科目の区分）
 * ──────────────────────────────────────────────────────────────────────── */

export interface SubjectMeta {
  key: string;
  label: string;
  /** 私立一般入試で主流の3教科（英・数・国）に含まれるか。 */
  in3: boolean;
  /** 教科別偏差値ページ用の、点を取りやすくするワンポイント。 */
  tip: string;
}

export const SUBJECTS: SubjectMeta[] = [
  { key: 'kokugo', label: '国語', in3: true, tip: '漢字・語句・文法など“覚えれば確実に取れる”配点を満点固定にし、記述は型（理由→根拠→結論）で底上げ。' },
  { key: 'sugaku', label: '数学', in3: true, tip: '計算ミスの撲滅が最短の偏差値アップ。大問1の小問（計算・基本）を全問正解で平均点超えは安定する。' },
  { key: 'eigo', label: '英語', in3: true, tip: '単語・文法の土台ができたら長文を毎日1本。リスニングは配点が高い割に伸ばしやすい“穴場”。' },
  { key: 'rika', label: '理科', in3: false, tip: '暗記分野（生物・地学）で点を固め、計算分野（物理・化学）は典型パターンを反復。' },
  { key: 'shakai', label: '社会', in3: false, tip: '直前でも伸びる教科の代表。一問一答→流れ（因果）の順で、用語と背景をセットで覚える。' },
];

/** 5教科の各偏差値から合計偏差値（単純平均）を概算。空欄は除外。 */
export function combinedHensachi(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

/* ────────────────────────────────────────────────────────────────────────
 * 偏差値 → 高校レベル（一般的な“目安バンド”。特定校のボーダーではない）
 * ──────────────────────────────────────────────────────────────────────── */

export interface HighSchoolTier {
  id: string;
  /** バンド下限の偏差値（この値以上）。 */
  min: number;
  /** バンド上限（表示用、この値未満）。最上位は null。 */
  max: number | null;
  label: string;
  /** 一般的に各レベルの公立高校が目安とする内申（9科5段階＝45点満点）の概算バンド。 */
  naishin45: string;
  /** どんな高校・進路イメージか（一般論）。 */
  description: string;
  colorClass: string;
}

/**
 * 偏差値→高校難易度の一般的バンド。
 * 出典：各社の高校受験偏差値ランキング・進学塾の公開資料で広く共有されている一般的な区分。
 * ※特定校の合否ラインではなく、あくまで“どのレベル帯か”の目安。実際の合否は内申＋当日点の合計と
 *   都道府県の制度で決まる。
 */
export const HIGH_SCHOOL_TIERS: HighSchoolTier[] = [
  { id: 'top', min: 70, max: null, label: '最難関校（地域トップ）', naishin45: 'おおむね43〜45', description: '都道府県のトップ公立・国立大附属・難関私立。内申はほぼオール5に近く、当日点も高水準が必要。', colorClass: 'red' },
  { id: 'advanced', min: 65, max: 70, label: '難関校', naishin45: 'おおむね40〜44', description: '各地域の伝統校・進学校。難関大学への進学実績が高い層。', colorClass: 'orange' },
  { id: 'upper', min: 60, max: 65, label: '上位校', naishin45: 'おおむね37〜42', description: '地域の人気進学校。国公立・難関私大を狙えるカリキュラム。', colorClass: 'amber' },
  { id: 'mid-upper', min: 55, max: 60, label: '中堅上位校', naishin45: 'おおむね33〜39', description: '大学進学を前提とした中堅校。指定校推薦の選択肢も広がる。', colorClass: 'emerald' },
  { id: 'mid', min: 50, max: 55, label: '中堅校', naishin45: 'おおむね30〜36', description: '進学・就職どちらにも対応。バランス型の高校が多い層。', colorClass: 'teal' },
  { id: 'standard', min: 45, max: 50, label: '標準校', naishin45: 'おおむね27〜33', description: 'オール3前後でも十分に射程。基礎を固めれば内申・当日点で逆転の余地が大きい。', colorClass: 'sky' },
  { id: 'basic', min: 40, max: 45, label: '基礎校', naishin45: 'おおむね24〜30', description: '基礎学力の定着を重視。専門学科・実業系の選択肢も豊富。', colorClass: 'blue' },
  { id: 'foundation', min: 0, max: 40, label: '基礎徹底校', naishin45: 'おおむね20〜27', description: '一人ひとりの学び直しに対応。出席・提出物など内申で挽回しやすい。', colorClass: 'slate' },
];

/** 偏差値からレベルバンドを引く。範囲外でも必ず1件返す。 */
export function tierForHensachi(h: number): HighSchoolTier {
  return (
    HIGH_SCHOOL_TIERS.find((t) => h >= t.min && (t.max === null || h < t.max)) ??
    HIGH_SCHOOL_TIERS[HIGH_SCHOOL_TIERS.length - 1]
  );
}

export interface ReachBand {
  /** 安全圏（合格可能性が高い目安）の上限偏差値の高校レベル。 */
  safe: HighSchoolTier;
  /** 実力相応（ちょうど狙える）レベル。 */
  match: HighSchoolTier;
  /** チャレンジ（+5前後で挑戦できる）レベル。 */
  challenge: HighSchoolTier;
}

/**
 * 模試偏差値から「届く高校レンジ」を安全圏 / 実力相応 / チャレンジの3帯で返す。
 * 一般的な受験指導の経験則（安全圏 ≒ 自分の偏差値−3、チャレンジ ≒ +5）に基づく目安。
 */
export function reachBandsForHensachi(h: number): ReachBand {
  return {
    safe: tierForHensachi(h - 3),
    match: tierForHensachi(h),
    challenge: tierForHensachi(h + 5),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 偏差値 ↔ 内申点の「並置」（換算ではなく、別々の物差しを並べる）
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * 内申点（9科5段階＝45点満点）の代表点。
 * これは“事実”（オール3＝27 等）であり、偏差値との換算式を主張するものではない。
 */
export interface NaishinReference {
  naishin45: number;
  label: string;
  /** 各レベル帯の偏差値の“目安”（同じ位置の高校が見ている偏差値帯）。換算ではなく並置。 */
  hensachiGuide: string;
}

export const NAISHIN_REFERENCES: NaishinReference[] = [
  { naishin45: 45, label: 'オール5', hensachiGuide: '68〜' },
  { naishin45: 41, label: '5が多め（4.5前後）', hensachiGuide: '63〜68' },
  { naishin45: 36, label: 'オール4', hensachiGuide: '58〜63' },
  { naishin45: 32, label: '4が多め（3.5前後）', hensachiGuide: '53〜58' },
  { naishin45: 27, label: 'オール3', hensachiGuide: '47〜53' },
  { naishin45: 23, label: '3が多め（2.5前後）', hensachiGuide: '42〜47' },
  { naishin45: 18, label: 'オール2', hensachiGuide: '〜42' },
];

/**
 * 内申点（45点満点）に対し、同じ高校レベル帯で“一緒に見られやすい”偏差値の目安バンドを返す。
 * ⚠️ これは換算式ではない。内申点と偏差値は別の物差しであり、合否は両者の合計＋制度で決まる。
 *    あくまで「同じくらいのレベルの高校を志望する人の、内申と偏差値の典型的な組み合わせ」を並置するもの。
 */
export function naishinToHensachiGuide(naishin45: number): NaishinReference {
  // 最も近い代表点を返す（補間はしない＝断定を避ける）。
  return NAISHIN_REFERENCES.reduce((best, cur) =>
    Math.abs(cur.naishin45 - naishin45) < Math.abs(best.naishin45 - naishin45) ? cur : best,
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * 早見表データ（ページの参照表・Dataset構造化・テストの単一ソース）
 * ──────────────────────────────────────────────────────────────────────── */

/** 偏差値→上位%・順位の対応表を生成（数学的に算出）。 */
export function buildPercentileTable(
  hensachiValues: number[] = [75, 72.5, 70, 67.5, 65, 62.5, 60, 57.5, 55, 52.5, 50, 47.5, 45, 40, 35, 30],
): { h: number; upperPercent: number; rank300: number; rank1000: number }[] {
  return hensachiValues.map((h) => ({
    h,
    upperPercent: hensachiToUpperPercent(h),
    rank300: hensachiToRank(h, 300),
    rank1000: hensachiToRank(h, 1000),
  }));
}

/* ────────────────────────────────────────────────────────────────────────
 * 偏差値診断（/hensachi/shindan）：点数を知らなくても答えられる自己申告バンドから
 * 偏差値“帯”を推定する。数字を捏造せず、既存の正規分布数式を自己申告バンドの
 * 境界値に適用するだけ＝計算式は他の偏差値ツールと完全に同一。
 * ──────────────────────────────────────────────────────────────────────── */

export interface RankBand {
  id: string;
  label: string;
  /** 上位%の範囲（小さいほど上位）。lowerPercent < upperPercent、0〜100。 */
  lowerPercent: number;
  upperPercent: number;
}

/** 「テストの順位はだいたいどのくらい？」の自己申告バンド（点数を知らなくても回答できる）。 */
export const RANK_BANDS: RankBand[] = [
  { id: 'top', label: 'だいたいいつも上位（学年で上位1割くらい）', lowerPercent: 0, upperPercent: 10 },
  { id: 'upper-mid', label: '平均より上（学年で上位3割くらい）', lowerPercent: 10, upperPercent: 30 },
  { id: 'mid', label: '真ん中くらい', lowerPercent: 30, upperPercent: 70 },
  { id: 'lower-mid', label: '平均より下（学年で下位3割くらい）', lowerPercent: 70, upperPercent: 90 },
  { id: 'bottom', label: '苦手な方だと思う（学年で下位1割くらい）', lowerPercent: 90, upperPercent: 100 },
];

/**
 * 自己申告バンドを偏差値の目安に変換。両端が開いているバンド（top/bottom）は
 * 片側だけの目安（〜以上／〜以下）を返し、閉じたバンドは範囲を返す
 * （0%・100%側の境界は数学的に無限大に発散するため、偽の精度を出さない）。
 */
export function bandToHensachiRange(band: RankBand): { min: number | null; max: number | null } {
  const min = band.upperPercent >= 100 ? null : roundHensachi(upperPercentToHensachi(band.upperPercent));
  const max = band.lowerPercent <= 0 ? null : roundHensachi(upperPercentToHensachi(band.lowerPercent));
  return { min, max };
}
