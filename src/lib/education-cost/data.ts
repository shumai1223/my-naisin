// 教育費の一次データ（単一ソース）。出典は文部科学省の公的調査のみ。
//
// 学習費総額＝授業料・学校教育費・学校給食費・学校外活動費（塾・習い事等）を含む年間総額。
// 値は文部科学省「令和3年度 子供の学習費調査」の学習費総額（全日制・1年あたり）。
// ※ 子供の学習費調査は2年ごと（直近の確定値が令和3年度）。最新版が出たらここだけ更新する。

import type { CostSource, JukuRate, ShugakuShienTier, StageAnnualCost } from './types';

/** 子供の学習費調査の出典（学習費総額の単一ソース）。 */
export const MEXT_GAKUSHUHI_SOURCE: CostSource = {
  url: 'https://www.mext.go.jp/b_menu/toukei/chousa03/gakushuuhi/1268091.htm',
  docTitle: '文部科学省「令和3年度 子供の学習費調査」（学習費総額）',
  lastChecked: '2026-06-14',
};

/** 高等学校等就学支援金の出典。 */
export const MEXT_SHUGAKU_SHIEN_SOURCE: CostSource = {
  url: 'https://www.mext.go.jp/a_menu/shotou/mushouka/index.htm',
  docTitle: '文部科学省「高校生等への修学支援（高等学校等就学支援金制度）」',
  lastChecked: '2026-06-14',
};

/**
 * 段階×課程の年間学習費総額（円）。令和3年度 子供の学習費調査・学習費総額（全日制）。
 * 公立高校 約51万円/年・私立高校 約105万円/年は既存の高校費用シミュレーターと同一の一次ソース。
 */
export const LEARNING_COST_ANNUAL: Record<StageAnnualCost['stage'], { public: number; private: number }> = {
  shougakkou: { public: 352566, private: 1666949 },
  chuugakkou: { public: 538799, private: 1436353 },
  koukou: { public: 512971, private: 1054444 },
};

/** 高校の入学準備費（入学金・制服・教材など）の概算（円）。学習費総額とは別枠で初年度に発生。 */
export const HIGH_SCHOOL_INITIAL_COST: { public: number; private: number } = {
  public: 120000,
  private: 250000,
};

/**
 * 塾の形態別・相場の目安（JukuhiCalculator と整合）。
 * 月謝＋年間講習費。特定塾の価格を断定しない一般的な目安（編集可能・信頼の堀）。
 */
export const JUKU_RATES: Record<Exclude<JukuRate['type'], never>, JukuRate> = {
  shudan: { type: 'shudan', label: '集団塾', monthly: 20000, seasonal: 150000, note: '大手・地域密着の集団指導' },
  kobetsu: { type: 'kobetsu', label: '個別指導', monthly: 30000, seasonal: 250000, note: '1対1〜1対3の個別指導' },
  katei: { type: 'katei', label: '家庭教師', monthly: 28000, seasonal: 80000, note: '訪問・オンラインの家庭教師' },
};

/** 受験学年（中3）の費用上昇係数（学年×通塾年数の概算に使う）。 */
export const JUKU_GRADE_FACTOR: Record<1 | 2 | 3, number> = { 1: 1.0, 2: 1.1, 3: 1.3 };

/**
 * 高等学校等就学支援金の区分別・支援額の目安（円/年）。
 * 公立は授業料相当（年118,800円）が実質無償化、私立は世帯年収の区分で年額上限が変わる。
 * ※ 正確な判定は「市町村民税の課税標準額×6%−市町村民税の調整控除額」で行われ、年収はあくまで目安。
 *   制度は年度で見直されるため、最新の金額・所得基準は必ず文科省・都道府県で確認すること。
 */
export const SHUGAKU_SHIEN_TIERS: ShugakuShienTier[] = [
  {
    bracket: 'under590',
    label: '世帯年収 約590万円未満（目安）',
    publicAnnual: 118800,
    privateAnnual: 396000,
    note: '私立高校は年額上限39万6,000円まで支援。多くの私立で授業料の大部分がまかなわれる区分。',
  },
  {
    bracket: 'under910',
    label: '世帯年収 約590〜910万円（目安）',
    publicAnnual: 118800,
    privateAnnual: 118800,
    note: '公立・私立とも授業料相当の年11万8,800円を支援。私立の上乗せ（39.6万円）は対象外。',
  },
  {
    bracket: 'over910',
    label: '世帯年収 約910万円以上（目安）',
    publicAnnual: 0,
    privateAnnual: 0,
    note: '従来は就学支援金の対象外。近年は所得制限の見直しや自治体独自の補助があり、自治体ごとに要確認。',
  },
];

/**
 * 大学進学費用の概算（円）。深掘りは姉妹サイト My Shingaku が担当するため、ここは橋渡し用の概数のみ。
 * 出典：国立は標準額（授業料535,800円/年・入学金282,000円）、私立は文科省「私立大学等の
 * 入学者に係る学生納付金等調査」の系統別平均の概算。正確な金額は学部・大学で大きく異なる。
 */
export const UNIVERSITY_ESTIMATE = {
  national: { label: '国立大学', firstYear: 817800, fourYear: 2425200, note: '授業料535,800円/年＋入学金282,000円（標準額）' },
  privateHumanities: { label: '私立大学（文系）', firstYear: 1180000, fourYear: 4000000, note: '入学金・授業料・施設設備費の概算' },
  privateScience: { label: '私立大学（理系）', firstYear: 1550000, fourYear: 5400000, note: '実験実習費を含む概算' },
} as const;

/** 自宅外通学（下宿・一人暮らし）の費用目安の出典。 */
export const JFC_AWAY_COST_SOURCE: CostSource = {
  url: 'https://www.jfc.go.jp/n/findings/',
  docTitle: '日本政策金融公庫「教育費負担の実態調査結果」（自宅外通学・仕送り）',
  lastChecked: '2026-06-15',
};

/**
 * 大学で自宅外通学（下宿・一人暮らし）をする場合の追加費用の目安（円）。
 * 出典：日本政策金融公庫「教育費負担の実態調査結果」。自宅外通学を始めるための費用 約39.3万円、
 * 自宅外通学者への仕送り（家賃・生活費）年額 約95.8万円。あくまで全国平均の目安で、地域・大学で大きく変動する。
 */
export const UNIVERSITY_AWAY_COST = {
  /** 自宅外通学を始めるための初期費用（敷金・家財・転居等）。 */
  firstYearSetup: 393000,
  /** 仕送り（家賃・生活費）の年額目安。 */
  annualSupport: 958000,
  note: '日本政策金融公庫調査：自宅外通学開始費用 約39.3万円・年間仕送り 約95.8万円（全国平均の目安）',
} as const;
