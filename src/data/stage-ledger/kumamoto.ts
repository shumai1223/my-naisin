import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 熊本県 段階台帳（T-Y11F §5順序#7・15県目・全日制52レコードで完結）。
 *
 * 一次ソース: 熊本県教育委員会「令和8年度（2026年度）熊本県公立高等学校入学者選抜の後期（一般）
 * 選抜における受検者数」＋「令和8年度（2026年度）熊本県公立高等学校合格者数及び二次募集実施校」
 * の2資料。
 * https://www.pref.kumamoto.jp/uploaded/life/260770_793518_misc.pdf
 * https://www.pref.kumamoto.jp/uploaded/life/261474_850380_misc.pdf
 *
 * ⚠️他県との設計上の違い（学校単位での収録）: 既存パイプライン`competition-rates/kumamoto.ts`は
 * 学校×学科粒度（「出願者数」資料ベース）だが、本台帳が典拠とする2資料はいずれも**学校単位の
 * 集計値のみ**を公表しており学科別内訳を持たない（pdftoppmビジョン確認済み・全52校で学科列自体が
 * 存在しない）。Y-0憲法③（機械可読不能・粒度が合わないものは無理に統合しない）に従い、本県のみ
 * 学校単位（department: '全学科（学校計・後期一般選抜）'）で収録する設計とした。
 *
 * quota・applicantsConfirmed・testTakersConfirmedは「受検者数」資料（後期(一般)選抜の募集人員・
 * 出願者数(A)・受検者数(B)列）から、finalPassersは「合格者数」資料の「後期(一般)選抜 合格者数」列
 * （前期(特色)選抜等合格内定者数を含まない）から、それぞれ独立に転記した。
 *
 * ⚠️既存パイプラインとの関係: 学校単位で既存パイプラインの学科別quota・finalApplicantsを合算した
 * ところ50/52校で本台帳の値と完全一致したが、大津（本台帳226 vs 既存225）・熊本農業（本台帳201 vs
 * 既存200）の2校のみapplicantsConfirmedが1名差だった。既存パイプラインが典拠とする「出願者数
 * （確定）」資料と本台帳の「受検者数」資料は公表日が異なる別スナップショットのため（鳥取県で確認
 * した追検査等のタイミング差と同型）、本台帳では独立に転記した本資料の値をそのまま採用し既存
 * パイプラインとの強制一致は行わない。
 *
 * quota・applicantsConfirmed・testTakersConfirmed・finalPassersの52校全数の機械集計
 * （8,322／7,297／6,893／5,651）が、両資料本文の「計」行・「前年度との比較」表の当該年度列と
 * それぞれ完全一致した（初回転記で一致・再修正なし）——4系列すべてが独立に県全体の印字済み
 * グランドトータルと一致する高信頼度検証。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const KUMAMOTO_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'kumamoto',
  sources: [
    {
      url: 'https://www.pref.kumamoto.jp/uploaded/life/260770_793518_misc.pdf',
      docTitle: '熊本県教育委員会 令和8年度（2026年度）熊本県公立高等学校入学者選抜の後期（一般）選抜における受検者数',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
    {
      url: 'https://www.pref.kumamoto.jp/uploaded/life/261474_850380_misc.pdf',
      docTitle: '熊本県教育委員会 令和8年度（2026年度）熊本県公立高等学校合格者数及び二次募集実施校',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（学校単位・52校を完全収録。資料が学科別内訳を持たないため学校単位が本県の最大粒度）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制52校を完全収録（他県と異なり本県のみ学校単位・departmentは"全学科（学校計・後期一般選抜）"固定）。資料自体が学科別内訳を公表していないため（既存パイプラインは別資料の学科別出願者数を典拠とするが本台帳の2資料はいずれも学校単位集計のみ）、Y-0憲法③に従い学校単位で収録した。quota・applicantsConfirmed・testTakersConfirmedは「受検者数」資料、finalPassersは「合格者数」資料の後期(一般)選抜合格者数列（前期特色選抜を含まない）から転記。4系列すべての機械集計（8,322／7,297／6,893／5,651）が両資料本文の「計」行と完全一致した。既存パイプラインの学科別合算と50/52校で一致したが大津・熊本農業のみ1名差（資料の公表日違いによるスナップショット差と推定・強制一致はしない）。定時制課程は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制計', quota: 8322, applicantsConfirmed: 7297, testTakersConfirmed: 6893, finalPassers: 5651 },
  ],
  records: [
    { schoolName: '済々黌', department: '全学科（学校計・後期一般選抜）', quota: 400, applicantsConfirmed: 565, testTakersConfirmed: 558, finalPassers: 414 },
    { schoolName: '熊本', department: '全学科（学校計・後期一般選抜）', quota: 400, applicantsConfirmed: 623, testTakersConfirmed: 620, finalPassers: 409 },
    { schoolName: '第一', department: '全学科（学校計・後期一般選抜）', quota: 340, applicantsConfirmed: 603, testTakersConfirmed: 567, finalPassers: 350 },
    { schoolName: '第二', department: '全学科（学校計・後期一般選抜）', quota: 360, applicantsConfirmed: 475, testTakersConfirmed: 457, finalPassers: 364 },
    { schoolName: '熊本西', department: '全学科（学校計・後期一般選抜）', quota: 320, applicantsConfirmed: 183, testTakersConfirmed: 155, finalPassers: 155 },
    { schoolName: '熊本北', department: '全学科（学校計・後期一般選抜）', quota: 320, applicantsConfirmed: 443, testTakersConfirmed: 407, finalPassers: 324 },
    { schoolName: '東稜', department: '全学科（学校計・後期一般選抜）', quota: 320, applicantsConfirmed: 384, testTakersConfirmed: 361, finalPassers: 323 },
    { schoolName: '湧心館', department: '全学科（学校計・後期一般選抜）', quota: 140, applicantsConfirmed: 132, testTakersConfirmed: 106, finalPassers: 106 },
    { schoolName: '熊本商業', department: '全学科（学校計・後期一般選抜）', quota: 180, applicantsConfirmed: 272, testTakersConfirmed: 257, finalPassers: 180 },
    { schoolName: '熊本工業', department: '全学科（学校計・後期一般選抜）', quota: 200, applicantsConfirmed: 358, testTakersConfirmed: 323, finalPassers: 200 },
    { schoolName: '熊本農業', department: '全学科（学校計・後期一般選抜）', quota: 140, applicantsConfirmed: 201, testTakersConfirmed: 193, finalPassers: 142 },
    { schoolName: '宇土', department: '全学科（学校計・後期一般選抜）', quota: 183, applicantsConfirmed: 154, testTakersConfirmed: 140, finalPassers: 140 },
    { schoolName: '松橋', department: '全学科（学校計・後期一般選抜）', quota: 101, applicantsConfirmed: 19, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '小川工業', department: '全学科（学校計・後期一般選抜）', quota: 104, applicantsConfirmed: 93, testTakersConfirmed: 87, finalPassers: 87 },
    { schoolName: '御船', department: '全学科（学校計・後期一般選抜）', quota: 180, applicantsConfirmed: 177, testTakersConfirmed: 165, finalPassers: 161 },
    { schoolName: '甲佐', department: '全学科（学校計・後期一般選抜）', quota: 91, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '矢部', department: '全学科（学校計・後期一般選抜）', quota: 80, applicantsConfirmed: 5, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '岱志', department: '全学科（学校計・後期一般選抜）', quota: 87, applicantsConfirmed: 15, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '玉名', department: '全学科（学校計・後期一般選抜）', quota: 213, applicantsConfirmed: 191, testTakersConfirmed: 180, finalPassers: 180 },
    { schoolName: '玉名工業', department: '全学科（学校計・後期一般選抜）', quota: 122, applicantsConfirmed: 75, testTakersConfirmed: 72, finalPassers: 71 },
    { schoolName: '北稜', department: '全学科（学校計・後期一般選抜）', quota: 102, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '鹿本', department: '全学科（学校計・後期一般選抜）', quota: 204, applicantsConfirmed: 96, testTakersConfirmed: 91, finalPassers: 91 },
    { schoolName: '鹿本商工', department: '全学科（学校計・後期一般選抜）', quota: 89, applicantsConfirmed: 42, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '鹿本農業', department: '全学科（学校計・後期一般選抜）', quota: 78, applicantsConfirmed: 8, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '菊池', department: '全学科（学校計・後期一般選抜）', quota: 149, applicantsConfirmed: 15, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '菊池農業', department: '全学科（学校計・後期一般選抜）', quota: 106, applicantsConfirmed: 65, testTakersConfirmed: 61, finalPassers: 61 },
    { schoolName: '阿蘇中央', department: '全学科（学校計・後期一般選抜）', quota: 165, applicantsConfirmed: 21, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '大津', department: '全学科（学校計・後期一般選抜）', quota: 289, applicantsConfirmed: 226, testTakersConfirmed: 210, finalPassers: 210 },
    { schoolName: '翔陽', department: '全学科（学校計・後期一般選抜）', quota: 140, applicantsConfirmed: 163, testTakersConfirmed: 155, finalPassers: 141 },
    { schoolName: '小国', department: '全学科（学校計・後期一般選抜）', quota: 67, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '高森', department: '全学科（学校計・後期一般選抜）', quota: 31, applicantsConfirmed: 19, testTakersConfirmed: 17, finalPassers: 16 },
    { schoolName: '八代', department: '全学科（学校計・後期一般選抜）', quota: 182, applicantsConfirmed: 185, testTakersConfirmed: 167, finalPassers: 167 },
    { schoolName: '八代清流', department: '全学科（学校計・後期一般選抜）', quota: 200, applicantsConfirmed: 90, testTakersConfirmed: 88, finalPassers: 88 },
    { schoolName: '八代東', department: '全学科（学校計・後期一般選抜）', quota: 98, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '八代工業', department: '全学科（学校計・後期一般選抜）', quota: 142, applicantsConfirmed: 79, testTakersConfirmed: 72, finalPassers: 72 },
    { schoolName: '八代農業', department: '全学科（学校計・後期一般選抜）', quota: 71, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 38 },
    { schoolName: '八代農業泉分校', department: '全学科（学校計・後期一般選抜）', quota: 31, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '人吉', department: '全学科（学校計・後期一般選抜）', quota: 280, applicantsConfirmed: 277, testTakersConfirmed: 273, finalPassers: 273 },
    { schoolName: '球磨工業', department: '全学科（学校計・後期一般選抜）', quota: 115, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '水俣', department: '全学科（学校計・後期一般選抜）', quota: 213, applicantsConfirmed: 64, testTakersConfirmed: 63, finalPassers: 63 },
    { schoolName: '天草', department: '全学科（学校計・後期一般選抜）', quota: 240, applicantsConfirmed: 191, testTakersConfirmed: 184, finalPassers: 184 },
    { schoolName: '天草倉岳校', department: '全学科（学校計・後期一般選抜）', quota: 40, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '牛深', department: '全学科（学校計・後期一般選抜）', quota: 98, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '天草工業', department: '全学科（学校計・後期一般選抜）', quota: 100, applicantsConfirmed: 96, testTakersConfirmed: 94, finalPassers: 92 },
    { schoolName: '天草拓心', department: '全学科（学校計・後期一般選抜）', quota: 196, applicantsConfirmed: 45, testTakersConfirmed: 43, finalPassers: 41 },
    { schoolName: '上天草', department: '全学科（学校計・後期一般選抜）', quota: 127, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '芦北', department: '全学科（学校計・後期一般選抜）', quota: 71, applicantsConfirmed: 50, testTakersConfirmed: 49, finalPassers: 48 },
    { schoolName: '球磨中央', department: '全学科（学校計・後期一般選抜）', quota: 70, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '南稜', department: '全学科（学校計・後期一般選抜）', quota: 94, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '人吉・五木分校', department: '全学科（学校計・後期一般選抜）', quota: 40, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '必由館', department: '全学科（学校計・後期一般選抜）', quota: 153, applicantsConfirmed: 309, testTakersConfirmed: 293, finalPassers: 157 },
    { schoolName: '千原台', department: '全学科（学校計・後期一般選抜）', quota: 60, applicantsConfirmed: 112, testTakersConfirmed: 103, finalPassers: 60 },
  ],
};
