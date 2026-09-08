import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 埼玉県 定時制課程（T-Y11F §5順序#4・S1-3 B分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校における入学志願確定者数」
 * （全9頁・既存の全日制`src/data/competition-rates/saitama.ts`と同一PDF）9頁目「定時制
 * 普通科」「定時制 専門学科（工業に関する学科／商業に関する学科）」「定時制 総合学科」の
 * 全数表。
 *
 * ⚠️S1-3台帳の懸念「9頁目は3学科合算のカテゴリ計のみで学校別内訳は未確認」は誤りだったと
 * 判明した。実際は全日制と全く同じ「募集人員」「入学許可予定者数(A)」「志願確定者数(B)」
 * 「倍率(B÷A)」の4本立て形式で、23校31レコードの完全な学校別内訳が存在する
 * （大宮商業は普通科・商業科、川越工業は普通科・工業技術科でそれぞれ2区分に
 * またがり別レコードになるため、学校数23とレコード数31は一致しない）。
 * 全日制と同じくA=quota・B=finalApplicantsとして採用（募集人員の（）内は転編入者数で
 * 内数、羽生の普通科昼間・総合学科4校は転編入学者数がありAが募集人員より小さい）。
 *
 * 機械集計は3段階の自己検算がすべて一致した: 普通科(定)計=quota840・applicants367・
 * 倍率0.44（18レコード）／工業科(定)計=quota200・applicants41・倍率0.21（3レコード）／
 * 商業科(定)計=quota40・applicants7・倍率0.18（1レコード）／総合学科(定)計=quota840・
 * applicants645・倍率0.77（9レコード）。さらに「定時制 普通・専門・総合学科 計」
 * 1920/1060/0.55が上記4区分の合計と完全一致した（node.js機械計算）。
 * この頁はWebFetchのテキスト抽出で数字・罫線とも問題なく読み取れ、pdftoppm 150dpiの
 * ビジョン解析1回で全31レコードを判読できた。
 */

export const SAITAMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'saitama',
  sources: [
    {
      url: 'https://www.pref.saitama.lg.jp/documents/268192/r8shigankakutei0219.pdf',
      docTitle: '埼玉県教育委員会 令和8年度埼玉県公立高等学校における入学志願確定者数（定時制・9頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制 普通科', '定時制 専門学科（工業に関する学科）', '定時制 専門学科（商業に関する学科）', '定時制 総合学科'],
    pendingDepartments: [],
    note: '9頁目「定時制」全区分（普通科18・工業科3・商業科1・総合学科9=計31レコード）を完全収録。',
  },
  records: [
    { schoolName: '上尾（定）', department: '普通科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '朝霞（定）', department: '普通科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '浦和（定）', department: '普通科', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '浦和第一女子（定）', department: '普通科', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '大宮商業（定）', department: '普通科', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '大宮中央（定）', department: '普通科', quota: 80, finalApplicants: 39, finalRate: 0.49 },
    { schoolName: '小川（定）', department: '普通科', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '春日部（定）', department: '普通科', quota: 80, finalApplicants: 65, finalRate: 0.81 },
    { schoolName: '川越工業（定）', department: '普通科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '久喜（定）', department: '普通科', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '熊谷（定）', department: '普通科', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '越ケ谷（定）', department: '普通科', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '秩父農工科学（定）', department: '普通科', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '所沢（定）', department: '普通科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '羽生（定）', department: '普通科（昼間）', quota: 80, finalApplicants: 44, finalRate: 0.55 },
    { schoolName: '羽生（定）', department: '普通科（夜間）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '飯能（定）', department: '普通科', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '本庄（定）', department: '普通科', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '大宮科学技術（定）', department: '工業技術科', quota: 80, finalApplicants: 11, finalRate: 0.14 },
    { schoolName: '川口工業（定）', department: '工業技術科', quota: 80, finalApplicants: 18, finalRate: 0.23 },
    { schoolName: '川越工業（定）', department: '工業技術科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '大宮商業（定）', department: '商業科', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '狭山緑陽（定）', department: '総合学科（Ⅰ部）', quota: 156, finalApplicants: 142, finalRate: 0.91 },
    { schoolName: '狭山緑陽（定）', department: '総合学科（Ⅱ部）', quota: 78, finalApplicants: 11, finalRate: 0.14 },
    { schoolName: '戸田翔陽（定）', department: '総合学科（Ⅰ部）', quota: 78, finalApplicants: 86, finalRate: 1.1 },
    { schoolName: '戸田翔陽（定）', department: '総合学科（Ⅱ部）', quota: 78, finalApplicants: 90, finalRate: 1.15 },
    { schoolName: '戸田翔陽（定）', department: '総合学科（Ⅲ部）', quota: 78, finalApplicants: 81, finalRate: 1.04 },
    { schoolName: '吹上秋桜（定）', department: '総合学科（Ⅰ部）', quota: 144, finalApplicants: 128, finalRate: 0.89 },
    { schoolName: '吹上秋桜（定）', department: '総合学科（Ⅱ部）', quota: 72, finalApplicants: 9, finalRate: 0.13 },
    { schoolName: '吉川美南（定）', department: '総合学科（Ⅰ部）', quota: 78, finalApplicants: 76, finalRate: 0.97 },
    { schoolName: '吉川美南（定）', department: '総合学科（Ⅱ部）', quota: 78, finalApplicants: 22, finalRate: 0.28 },
  ],
  officialSubtotals: [{ label: '定時制 普通・専門・総合学科 計', quota: 1920, finalApplicants: 1060, finalRate: 0.55 }],
};
