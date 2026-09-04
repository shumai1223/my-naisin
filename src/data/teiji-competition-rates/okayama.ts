import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 岡山県 定時制（県立・市立）（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 岡山県教育委員会「令和8年度岡山県公立高等学校一般入学者選抜志願者数について」
 * （全7頁。既存の全日制`src/data/competition-rates/okayama.ts`と同一URL登録だが、
 * ⚠️そのURL(`1044733_10111198_misc.pdf`)は2026-09-05時点で404となっており、ハブページ
 * （県立高等学校の入学者選抜 https://www.pref.okayama.jp/site/16/913706.html）をWebFetchで
 * 確認し新URL(`1054600_10219046_misc.pdf`)を発見して取得した。既存の全日制ファイルのURLも
 * 更新が必要な可能性がある（本ファイルでは定時制の収集のみを行い、全日制ファイル自体の
 * URL修正は別タスクとする）。
 *
 * ⚠️対象範囲=6頁目「（県立定時制）」1校2レコードと「（市立定時制）」6校10レコードの計7校
 * 12レコード。quotaは「一般入学募集人員(A-B)」列、finalApplicantsは「一般入学志願者数(C)」列を
 * 採用（特別入学等合格内定者(B)を除いた一般選抜枠のみ・他県と同じ設計）。
 *
 * 機械集計は2ブロックそれぞれの印字済み「計」と完全一致した:
 * ①「県立定時制」計78／75／0.96（烏城1校） ②「市立定時制」計395／138／0.35（6校）。
 * 県立・市立を合算した「定時制全体」の印字済み合計は資料に存在しないため、officialSubtotalsは
 * 2ブロック分をそれぞれ計上する。ToUnicode欠落は無く`pdftoppm 180dpi`のビジョン解析1回で
 * 全12レコードを判読できた。
 */

export const OKAYAMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'okayama',
  sources: [
    {
      url: 'https://www.pref.okayama.jp/uploaded/life/1054600_10219046_misc.pdf',
      docTitle: '岡山県教育委員会 令和8年度岡山県公立高等学校一般入学者選抜志願者数について（県立定時制）（市立定時制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制（県立）', '定時制（市立）'],
    pendingDepartments: [],
    note: '6頁目の（県立定時制）（市立定時制）両表の全12レコードを完全収録。',
  },
  records: [
    // ===== 県立定時制 =====
    { schoolName: '烏城', department: '普通（昼間部）', quota: 50, finalApplicants: 57, finalRate: 1.14 },
    { schoolName: '烏城', department: '普通（夜間部）', quota: 28, finalApplicants: 18, finalRate: 0.64 },

    // ===== 市立定時制 =====
    { schoolName: '精思', department: '普通（夜間部）', quota: 79, finalApplicants: 8, finalRate: 0.1 },
    { schoolName: '精思霞丘校', department: '普通（昼間部）', quota: 30, finalApplicants: 34, finalRate: 1.13 },
    { schoolName: '精思霞丘校', department: '商業（昼間部）', quota: 15, finalApplicants: 9, finalRate: 0.6 },
    { schoolName: '倉敷市立工業', department: '機械（夜間部）', quota: 80, finalApplicants: 17, finalRate: 0.21 },
    { schoolName: '倉敷市立工業', department: '電気（夜間部）', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '倉敷翔南', department: '総合学科（昼間部）', quota: 48, finalApplicants: 11, finalRate: 0.23 },
    { schoolName: '倉敷翔南', department: '総合学科（夜間部）', quota: 13, finalApplicants: 2, finalRate: 0.15 },
    { schoolName: '真備陵南', department: '普通（昼間部）＜3修コース＞', quota: 20, finalApplicants: 15, finalRate: 0.75 },
    { schoolName: '真備陵南', department: '普通（昼間部）＜4修コース＞', quota: 30, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '玉野備南', department: '普通（昼間部）', quota: 40, finalApplicants: 29, finalRate: 0.73 },
  ],
  officialSubtotals: [
    { label: '県立定時制計', quota: 78, finalApplicants: 75, finalRate: 0.96 },
    { label: '市立定時制計', quota: 395, finalApplicants: 138, finalRate: 0.35 },
  ],
};
