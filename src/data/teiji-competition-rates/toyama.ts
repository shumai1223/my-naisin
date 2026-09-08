import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 富山県 定時制課程（T-Y11F §5順序#4・S1-3 B分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 富山県教育委員会「令和8年度富山県立高等学校入学者選抜」（全3頁・既存の全日制
 * `src/data/competition-rates/toyama.ts`と同一PDF）3頁目下段「令和8年度富山県立高等学校
 * 入学者選抜定時制の課程（単位制前期第1次選抜）」の全数表。
 *
 * ⚠️S1-3台帳の懸念「学校別レコードはページ1-2のみ」は誤りだったと判明した（3頁目にも
 * 全日制の参考表に続けて定時制の学校別全数表が独立して存在する）。5校12学科（新川みどり野・
 * 雄峰・志貴野・小矢部園芸・となみ野）を学校×学科×昼夜間部の組み合わせで19レコードに展開。
 * 「12学科」は学科名の異なり数（例: 新川みどり野の普通科は昼間Ⅰ部/Ⅱ部/夜間単位制の3レコード
 * だが学科としては1つと数える）であり、19という収録レコード数と矛盾しない。
 *
 * 募集定員はすべて「約」を冠した概数（約40・約80）だが、原資料の表記どおり数値のみを
 * quotaへ収録する（Y-0: 概数であることは本コメントに明記し、フィールド自体には反映しない）。
 *
 * 機械集計（quota840・applicants199・倍率0.24、5校12学科）が表末尾の「合計」行と完全一致した
 * （参考: 昨年度は志願者数309・倍率0.37）。この頁はToUnicode欠落があったが数字自体は
 * `pdftotext -layout`で抽出可能で、`pdftoppm 150dpi`のビジョン解析で日本語ラベルを補完し
 * 1回で全19レコードを判読できた。
 */

export const TOYAMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'toyama',
  sources: [
    {
      url: 'https://www.pref.toyama.jp/documents/47208/080224.pdf',
      docTitle: '富山県教育委員会 令和8年度富山県立高等学校入学者選抜 定時制の課程（単位制前期第1次選抜）志願状況（3頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制の課程（単位制前期第1次選抜）'],
    pendingDepartments: [],
    note: '3頁目「定時制の課程（単位制前期第1次選抜）」の全19レコード（5校12学科）を完全収録。',
  },
  records: [
    { schoolName: '新川みどり野', department: '普通科・昼間単位制Ⅰ部', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '新川みどり野', department: '普通科・昼間単位制Ⅱ部', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '新川みどり野', department: '普通科・夜間単位制', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '新川みどり野', department: '福祉教養科・昼間単位制Ⅰ部', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '雄峰', department: '普通科・昼間単位制Ⅰ部', quota: 80, finalApplicants: 50, finalRate: 0.63 },
    { schoolName: '雄峰', department: '普通科・昼間単位制Ⅱ部', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '雄峰', department: '普通科・夜間単位制', quota: 80, finalApplicants: 8, finalRate: 0.1 },
    { schoolName: '雄峰', department: '総合ビジネス科・夜間単位制', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '雄峰', department: '生活文化科・昼間単位制Ⅰ部', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '志貴野', department: '普通科・昼間単位制Ⅰ部', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '志貴野', department: '普通科・夜間単位制', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '志貴野', department: '国際教養科・夜間単位制', quota: 40, finalApplicants: 0, finalRate: 0 },
    { schoolName: '志貴野', department: '総合ビジネス科・昼間単位制Ⅰ部', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '志貴野', department: '総合ビジネス科・昼間単位制Ⅱ部', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '志貴野', department: '生活文化科・昼間単位制Ⅱ部', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '小矢部園芸', department: '園芸科・昼間単位制', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: 'となみ野', department: '普通科・昼間単位制Ⅰ部', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: 'となみ野', department: '普通科・昼間単位制Ⅱ部', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: 'となみ野', department: '総合福祉科・昼間単位制Ⅰ部', quota: 40, finalApplicants: 5, finalRate: 0.13 },
  ],
  officialSubtotals: [{ label: '合計（5校12学科）', quota: 840, finalApplicants: 199, finalRate: 0.24 }],
};
