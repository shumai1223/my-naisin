/**
 * 倍率パイプラインα（Y-2・先行8県）の型・純関数群。
 *
 * 各都道府県教育委員会が公表する「募集人員・応募状況・倍率」を学校単位で構造化する。
 * Y-0憲法②「1データ点=1出典」に従い、チャンクファイル単位でsourceを持つ（Y-1と同じ設計）。
 * Y-0憲法⑤「インデックス解禁は県単位👤ゲート」は上位のページ層（Y-3）が担うため、
 * このモジュール自体はデータの構造化と整合検証のみを扱う。
 *
 * 「学科/コース行の扱い」の型（最初の県=東京都で確立・以後横展開）:
 *   東京都教育委員会の公表資料は学科区分ごとに別ファイル（普通科／コース・単位制／
 *   専門学科・定時制）に分かれ、それぞれに校数・募集人員・応募人員の「計」行を持つ。
 *   このモジュールでは1レコード=1校の1学科（同じ学校が複数学科を持つ場合は複数レコード
 *   になり得る）とし、公式公表の「計」行をofficialSubtotalsとして別途保持することで、
 *   「自分が積み上げた合計」と「公式公表の合計」を突合できるようにする（DoD「突合テスト」）。
 */

export interface CompetitionRateRecord {
  /** 公表資料に記載の学校名（例: '日比谷'。Y-1のフルネームとの突合はY-3以降の課題）。 */
  schoolName: string;
  /** 区市町村名等、公表資料上のグルーピング単位（任意）。 */
  area?: string;
  /** 学科（例: '普通科'）。同一校で複数学科があれば学科ごとに別レコード。 */
  department: string;
  /** 募集人員。 */
  quota: number;
  /** 最終応募人員。 */
  finalApplicants: number;
  /** 最終応募倍率（公表値をそのまま転記。四捨五入方式は県により異なるため独自計算はしない）。 */
  finalRate: number;
}

export interface OfficialSubtotal {
  /** 公表資料に記載のラベル（例: '区部計'）。 */
  label: string;
  schoolCount?: number;
  quota: number;
  finalApplicants: number;
  finalRate?: number;
}

export interface CompetitionRateSource {
  url: string;
  docTitle: string;
  /** 例: '令和8年度(2026年度)'。 */
  fiscalYear: string;
  fetchedAt: string;
}

export interface PrefectureCompetitionRateFile {
  prefectureCode: string;
  /** 複数の公表資料（学科区分ごとに別ファイルの県が多いため配列）。各recordsは由来を追わないが、全体としてどの資料から来たかを保持する。 */
  sources: CompetitionRateSource[];
  /**
   * 取り込みの網羅状況を正直に記録する（Y-0憲法③「機械可読不能は正直にスキップ」の精神を
   * 「まだ着手できていない」にも適用：一部の学科区分のみ取り込み済みの状態を隠さない）。
   */
  coverage: {
    status: 'partial' | 'complete';
    /** 取り込み済みの学科区分（例: ['普通科（コース・単位制以外）', '普通科（島しょ）']）。 */
    includedDepartments: string[];
    /** 未取り込みの学科区分（例: ['単位制', '専門学科', '総合学科']）。 */
    pendingDepartments: string[];
    note: string;
  };
  records: CompetitionRateRecord[];
  /** 公表資料の「計」行（自己集計との突合対象）。 */
  officialSubtotals: OfficialSubtotal[];
}

/** recordsからquota/finalApplicantsの合計を積み上げる（都道府県非依存の純粋集計）。 */
export function sumRecords(records: CompetitionRateRecord[]): { quota: number; finalApplicants: number; schoolCount: number } {
  return records.reduce(
    (acc, r) => ({
      quota: acc.quota + r.quota,
      finalApplicants: acc.finalApplicants + r.finalApplicants,
      schoolCount: acc.schoolCount + 1,
    }),
    { quota: 0, finalApplicants: 0, schoolCount: 0 }
  );
}

export interface SubtotalCheckResult {
  label: string;
  expectedQuota: number;
  actualQuota: number;
  expectedApplicants: number;
  actualApplicants: number;
  matches: boolean;
}

/**
 * records群を、officialSubtotalsの中から指定したラベルの行と突合する（DoD「突合テスト」の実体）。
 * predicateでrecordsをどう絞り込んで合計するかを呼び出し側が指定する（例: area==='区部'に該当する行）。
 */
export function checkAgainstSubtotal(
  records: CompetitionRateRecord[],
  subtotal: OfficialSubtotal,
  predicate: (r: CompetitionRateRecord) => boolean
): SubtotalCheckResult {
  const matched = records.filter(predicate);
  const sums = sumRecords(matched);
  return {
    label: subtotal.label,
    expectedQuota: subtotal.quota,
    actualQuota: sums.quota,
    expectedApplicants: subtotal.finalApplicants,
    actualApplicants: sums.finalApplicants,
    matches: sums.quota === subtotal.quota && sums.finalApplicants === subtotal.finalApplicants,
  };
}
