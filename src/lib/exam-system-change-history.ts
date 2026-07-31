/**
 * 公立高校入試「過去の制度変更」履歴DB（Λ+5・Ω-14・有限化版「過去5年分を1回作り切る」）。
 *
 * `src/lib/source-history.ts`（X-14・ZZ-9b）が「いつ・どの一次ソースを確認したか」という
 * “再検証ログ”（変更が無かった記録も含む）なのに対し、本ファイルは**実際に起きた制度変更**
 * だけを集めた「権威資産」（教育委員会・報道が言及しうる、他サイトが真似しにくい独自データ）。
 * `/nyushi-seido-henkou`（既存の「今後の変更予告」ページ）に「過去の変更履歴」節として追加する。
 *
 * 収録基準（Y-0憲法を継承）:
 *  - 教育委員会の公式発表（一次ソース）を必須とし、可能なら独立した二次情報源（報道・複数の
 *    教育系サイト）でも突合する
 *  - 「内申点の計算方式（配点・学年比率・実技傾斜等）」に影響する変更のみを対象とする
 *    （調査書の記載事項削減など、内申点の算出方法自体に影響しない変更はsource-history.tsの
 *    管轄のまま・本DBには含めない＝二重管理を避ける）
 *  - 過去5年（おおむね令和3年度〜令和8年度入試）の範囲に絞る（∞ではなく有限のバックフィル）
 *  - 裏取りできない・伝聞のみの変更は正直に収録を見送る（捏造ゼロ）
 */

export type SystemChangeCategory =
  | 'scoring-input' // 内申点の算出に使う入力要素の追加・変更（例: 新科目・新テストの得点算入）
  | 'selection-structure' // 選抜方式の統合・区分変更（例: 前期/後期の一本化）
  | 'weighting-formula' // 配点・学年比率・実技傾斜等の計算式そのものの変更
  | 'other';

export interface PastSystemChange {
  prefCode: string;
  prefName: string;
  /** 変更が実際に選抜へ反映された最初の年度（例: '令和5年度（2023年度）入試'）。 */
  effectiveYear: string;
  category: SystemChangeCategory;
  headline: string;
  detail: string;
  sourceUrl: string;
  sourceTitle: string;
  /** この変更を確認した日('YYYY-MM-DD')。捏造した日付を書かない。 */
  confirmedDate: string;
}

/**
 * 収録済みの過去の制度変更（実際に確認できたもののみ・追記のたびに一次ソースを必須とする）。
 *
 * 東京都ESAT-J: 令和4年度(2022年度)に中学校英語スピーキングテストとして実施開始し、
 * 令和5年度(2023年度)入試から都立高校入試の総合得点(1020点満点)に20点分(A〜Fの6段階評価)
 * として初めて算入された。公式ハブページ(kyoiku.metro.tokyo.lg.jp)が「令和4年度から実施開始」
 * と明記し、令和4年5月26日付「都立高校入学者選抜における…活用について」発表を起点として言及。
 * 独立した複数の教育系メディア（note.com/joyz、よみうり進学メディア等）も「令和5年度入試から
 * 総合得点1020点中20点(約2%)として算入」という点数配分で一致しており、既存のprefectures.ts
 * (tokyo・reverseCalc.totalMaxScore=1020)の現行値とも整合する。
 */
export const PAST_SYSTEM_CHANGES: PastSystemChange[] = [
  {
    prefCode: 'tokyo',
    prefName: '東京都',
    effectiveYear: '令和5年度（2023年度）入試',
    category: 'scoring-input',
    headline: '英語スピーキングテスト（ESAT-J）の結果が総合得点に新たに算入された',
    detail:
      '東京都教育委員会は中学校英語スピーキングテスト（ESAT-J）を令和4(2022)年度から実施し、その結果（A〜Fの6段階評価・20点満点）を令和5(2023)年度入試から都立高校入試の総合得点（学力検査700点＋調査書300点＋ESAT-J20点＝1020点満点）に初めて算入した。従来は学力検査（筆記）と調査書（内申点）の2要素だった総合得点の構成に、話す力を測る第3の要素が加わった変更。内申点そのものの計算方法（9教科の評定を実技系2倍で合算する65点満点の換算内申）自体は変更されていない。',
    sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/school/content/global/esat-j',
    sourceTitle: '東京都教育委員会「中学校英語スピーキングテスト（ESAT-J）」特設ページ',
    confirmedDate: '2026-08-01',
  },
];

export function getPastSystemChangesByPrefecture(prefCode: string): PastSystemChange[] {
  return PAST_SYSTEM_CHANGES.filter((c) => c.prefCode === prefCode);
}
