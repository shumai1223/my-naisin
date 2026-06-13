// 公立高校「総合得点／合否判定」の統一スキーマ（令和8年度 / 2026年度）。
//
// 方針（[[fable5-task-backlog-2026-06]] #17・[[prefecture-exam-systems-verified]] 準拠）：
//  - 第1層＝満点・換算式・比率が公文書で明示され、内申点と当日点の入力で総合得点を「足し算で再現できる」県のみを計算対象にする。
//  - 第2層（相関図・相関表・割合方式・「総合的に判断」）は計算機を作らず、解説ページで扱う（捏造ゼロ＝信頼の堀）。
//  - 学校別の合格ボーダーは持たない（検証不能＝載せない）。

/** 学力検査（当日点）の素点仕様。 */
export interface TsAcademic {
  /** 教科数（通常5：国数英理社）。 */
  subjects: number;
  /** 1教科の満点。 */
  perSubjectMax: number;
  /** 素点の満点（= subjects × perSubjectMax）。入力の上限。 */
  rawMax: number;
  /** 傾斜配点の注記（学科・コース別。計算には用いず表示のみ）。 */
  weightingNote?: string;
}

/**
 * 調査書（内申）の換算仕様。
 * total-score 専用に持つ（県の「総合得点用の内申換算」は prefectures.ts の表示用内申とは別物のことがあるため）。
 */
export interface TsReport {
  /** 合否に使う対象学年。 */
  targetGrades: number[];
  /** 1評定の満点（通常5。10段階の県は10）。 */
  perGradeMax: number;
  /** 5教科（主要）の評定合計に掛ける倍率。 */
  coreMultiplier: number;
  /** 実技4教科の評定合計に掛ける倍率。 */
  practicalMultiplier: number;
  /** 換算後の内申素点満点（対象学年分・core満点×coreMul ＋ practical満点×practicalMul）。 */
  rawMax: number;
  note?: string;
}

/** 比率オプション（県＝高校が選ぶ「内申:学力」の置き方）。固定式の県は1件だけ持つ。 */
export interface TsRatioOption {
  id: string;
  /** UI表示名（例 '内申5：学力5'、'盛岡第一・第三（7:3）'）。 */
  label: string;
  /** このオプション下での学力検査の換算満点。 */
  academicMax: number;
  /** このオプション下での内申の換算満点。 */
  reportMax: number;
  note?: string;
}

/** 県教委一次ソースの参照。 */
export interface TsSource {
  url: string;
  docTitle: string;
  section?: string;
  /** 最終確認日 YYYY-MM-DD。 */
  lastChecked: string;
}

/** 1県ぶんの総合得点システム（=計算機1台の定義）。 */
export interface TotalScoreSystem {
  code: string;
  name: string;
  /** 公開ルートのスラッグ（既存の手書き県と衝突しない現地語）。 */
  routeSlug: string;
  /** タイトル/H1に使う現地語（兵庫=判定資料、京都=中期選抜 等）。 */
  localTerm: string;
  /** 対象年度（'2026' ＝ 令和8年度）。 */
  fiscalYear: string;
  academic: TsAcademic;
  report: TsReport;
  /** 比率オプション（先頭が既定）。固定式は1件。 */
  ratioOptions: TsRatioOption[];
  source: TsSource;
  /** 学校別ボーダーは持たない（常に true・信頼の堀）。 */
  schoolBordersOmitted: true;
}

/** 第2層（計算機にしない）の合成方式の分類。 */
export type Tier2Method = '相関図' | '相関表' | '割合方式' | '段階選抜' | '校別比重' | '総合判断';

/**
 * 第2層県の解説ページ用データ。
 * 相関図・相関表・割合・段階選抜・校別比重・総合判断のため「足し算で総合得点を出せない」県を、
 * 計算機を偽造せず正直に解説する（＝競合が真似できない独自コンテンツ＝信頼の堀）。
 * 満点・配点は公文書で確認できた範囲のみ持ち、不明は持たない（捏造ゼロ）。
 */
export interface TotalScoreExplainer {
  code: string;
  name: string;
  routeSlug: string;
  localTerm: string;
  fiscalYear: string;
  method: Tier2Method;
  academic: { subjects: number; perSubjectMax?: number; rawMax?: number; weightingNote?: string; note?: string };
  report: { targetGrades: number[]; rawMax?: number; note: string };
  /** 面接・特色検査などの概要（任意）。 */
  others?: string;
  /** 合成方法の説明（なぜ単純な足し算で総合得点が出ないか）。 */
  composition: string;
  /** 第2層と判定した理由。 */
  tier2Reason: string;
  /** ※前年度版・要確認 等の注記（任意）。 */
  caveat?: string;
  source: TsSource;
  /** 学校別ボーダーは持たない（常に true・信頼の堀）。 */
  schoolBordersOmitted: true;
}
