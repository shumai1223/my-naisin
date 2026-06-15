// 教育費（学費・塾代・進学費用）の統一スキーマ＝保護者向けお金クラスタの単一ソース。
//
// 方針（[[fable5-master-plan-2026-06]] 準拠）：
//  - 換金の本命は「保護者 × 無料リード（資料請求/無料体験/FP相談）」。保護者が検索者＝決裁者の
//    「お金」面（学費・塾代・進学費用）は権限ズレがゼロで、CPAの高い無料リードが最も効く。
//  - 数値は文部科学省「子供の学習費調査」など一次情報のみを採用し、断定できない金額は範囲＋注記で扱う
//    （捏造ゼロ＝信頼の堀）。学校別・個別の正確な費用は持たない（検証不能＝載せない）。
//  - total-score エンジンと同じく「データは単一ソース・計算は純関数・テストで担保」する。

/** 学校段階。 */
export type SchoolStage = 'shougakkou' | 'chuugakkou' | 'koukou';

/** 公立 / 私立。 */
export type CourseType = 'public' | 'private';

/** 塾の形態（JukuhiCalculator と相場の目安を揃える）。 */
export type JukuType = 'none' | 'shudan' | 'kobetsu' | 'katei';

/** 就学支援金の世帯年収区分（目安。正確な判定は所得割課税標準額で行われる）。 */
export type IncomeBracket = 'under590' | 'under910' | 'over910';

/** 大学の種別（学費の概算区分）。'none' は大学進学なし（高卒）。 */
export type UniversityType = 'none' | 'national' | 'privateHumanities' | 'privateScience';

/** 通学形態（自宅通学 / 自宅外＝下宿・一人暮らし）。 */
export type Residence = 'home' | 'away';

/** 高校〜大学卒業までの進路別総額シミュレーションの入力。 */
export interface PathCostInput {
  /** 進学先高校の課程（公立 / 私立）。 */
  highCourse: CourseType;
  /** 就学支援金の世帯年収区分（高校授業料の軽減に使う）。 */
  incomeBracket: IncomeBracket;
  /** 進学先大学の種別（なし＝高卒）。 */
  universityType: UniversityType;
  /** 大学の通学形態（自宅 / 自宅外）。自宅外は仕送り・初期費用を加算。 */
  residence: Residence;
}

/** 高校〜大学卒業までの進路別総額の内訳つき結果。 */
export interface PathCostResult {
  /** 高校3年間の学習費総額（就学支援金 控除前）。 */
  highSchoolBeforeSupport: number;
  /** 高校3年間の就学支援金 軽減額（目安）。 */
  highSchoolSupport: number;
  /** 高校3年間の実質負担（就学支援金 控除後）。 */
  highSchoolReal: number;
  /** 大学の学費分（4年）。 */
  universityTuition: number;
  /** 大学の自宅外費用分（初期費用＋仕送り4年）。自宅なら0。 */
  universityLiving: number;
  /** 大学4年の総額（学費＋自宅外費用）。 */
  university: number;
  /** 高校〜大学の総額（高校実質負担＋大学総額）。 */
  total: number;
}

/** 1段階・1課程あたりの年間学習費総額（文科省 子供の学習費調査）。 */
export interface StageAnnualCost {
  stage: SchoolStage;
  /** 公立の年間学習費総額（円）。 */
  public: number;
  /** 私立の年間学習費総額（円）。 */
  private: number;
}

/** 塾の形態別・月謝＋年間講習費の相場（目安・編集可能）。 */
export interface JukuRate {
  type: Exclude<JukuType, 'none'>;
  label: string;
  /** 月謝の目安（円）。 */
  monthly: number;
  /** 季節講習など年間費の目安（円）。 */
  seasonal: number;
  note: string;
}

/** 就学支援金の区分別・私立高校の年額上限の目安（円）。 */
export interface ShugakuShienTier {
  bracket: IncomeBracket;
  label: string;
  /** 公立高校の授業料に対する支援額の目安（円/年）。 */
  publicAnnual: number;
  /** 私立高校の授業料に対する支援額の目安（円/年・上限）。 */
  privateAnnual: number;
  note: string;
}

/** 一次ソース参照（total-score の TsSource と同形）。 */
export interface CostSource {
  url: string;
  docTitle: string;
  section?: string;
  /** 最終確認日 YYYY-MM-DD。 */
  lastChecked: string;
}

/** 教育費総額シミュレーションの入力。 */
export interface EducationCostInput {
  /** 現在の学年（中1=1, 中2=2, 中3=3）。中学在学中を前提とする。 */
  currentGrade: 1 | 2 | 3;
  /** 在学中の中学が公立か私立か（既定: 公立）。 */
  juniorCourse: CourseType;
  /** 進学先高校の課程（公立 / 私立）。 */
  highCourse: CourseType;
  /** 塾の形態（なし / 集団 / 個別 / 家庭教師）。 */
  jukuType: JukuType;
}

/** 教育費総額シミュレーションの内訳つき結果。 */
export interface EducationCostResult {
  /** 中学の残り在学費用（現在の学年から中3まで）。 */
  juniorRemaining: number;
  /** 高校3年間の学習費総額。 */
  highSchool: number;
  /** 高校3年間の就学支援金で軽減される目安額（区分は under590 を既定の参考に表示用は別途）。 */
  highSchoolBeforeSupport: number;
  /** 塾代（現在の学年から中3までの通塾費）。 */
  juku: number;
  /** 合計（中学残り＋高校3年＋塾）。 */
  total: number;
  /** 中学の残り在学年数。 */
  juniorRemainingYears: number;
}
