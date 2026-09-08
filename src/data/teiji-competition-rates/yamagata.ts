import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 山形県 定時制課程（T-Y11F §5順序#4・S1-3 B分類最後の1県→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 山形県教育委員会「令和8年度山形県公立高等学校一般入学者選抜志願状況」
 * （全5頁・既存の全日制`src/data/competition-rates/yamagata.ts`と同一PDF）5頁目
 * 「【定時制の課程】」の全数表。
 *
 * ⚠️S1-3台帳の懸念「定時制という語自体は他県同様のスコープ外定型文でしか出現せず未確認」は
 * 誤りだったと判明した。全日制と同じ列構成（入学定員／前期(特色)選抜・連携型入学者選抜
 * 内定者数及び併設型中学校からの入学予定者数／募集人員／志願者数／志願倍率）の学校別内訳表
 * （5校7レコード：霞城学園[Ⅰ部・Ⅱ部・Ⅲ部の3レコード]・新庄志誠館・米沢鶴城・庄内総合・
 * 酒田西）が独立して存在する。quotaは「募集人員」列（入学定員から前期選抜等内定者数を
 * 差し引いた実質枠）、finalApplicantsは「志願者数」列（※成人の志願者を含む、と注記あり）、
 * finalRateは「志願倍率」列を採用（全日制yamagata.tsと同じ規律）。
 *
 * 機械集計（quota241・applicants109・倍率0.45）が表末尾の「定時制公立合計」
 * 280(入学定員)/39/241/109/0.45と完全一致した。この頁はToUnicode欠落があったが数字自体は
 * `pdftotext -layout`で抽出可能で、`pdftoppm 150dpi`のビジョン解析で学校名・学科名を
 * 補完し1回で全7レコードを判読できた。
 */

export const YAMAGATA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'yamagata',
  sources: [
    {
      url: 'https://www.pref.yamagata.jp/documents/42443/r8koukiippannsigannjoukyouhp.pdf',
      docTitle: '山形県教育委員会 令和8年度山形県公立高等学校一般入学者選抜志願状況（定時制の課程・5頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制の課程'],
    pendingDepartments: [],
    note: '5頁目「【定時制の課程】」の全7レコード（5校）を完全収録。',
  },
  records: [
    { schoolName: '霞城学園', department: '普通科（Ⅰ部・午前）', quota: 32, finalApplicants: 37, finalRate: 1.16 },
    { schoolName: '霞城学園', department: '普通科（Ⅱ部・午後）', quota: 34, finalApplicants: 24, finalRate: 0.71 },
    { schoolName: '霞城学園', department: '普通科（Ⅲ部・夜）', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '新庄志誠館', department: '普通科', quota: 34, finalApplicants: 2, finalRate: 0.06 },
    { schoolName: '米沢鶴城', department: '総合学科', quota: 32, finalApplicants: 16, finalRate: 0.5 },
    { schoolName: '庄内総合', department: '総合学科', quota: 39, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '酒田西', department: '普通科', quota: 30, finalApplicants: 8, finalRate: 0.27 },
  ],
  officialSubtotals: [{ label: '定時制公立合計', quota: 241, finalApplicants: 109, finalRate: 0.45 }],
};
