/**
 * 山梨県 公立高等学校 倍率パイプラインα（Y-6・29県目・全日制完全達成／掛-1・R7多年度追加済み）。
 *
 * 一次ソース: 山梨県教育委員会「令和8年度山梨県公立高等学校入学者選抜 全日制後期募集及び定時制
 * 課程の最終志願状況について」内の「志願変更後の最終志願者数」一覧（令和8年2月25日午後4時締切）。
 *
 * ⚠️山梨県は「前期選抜」を数年前に廃止し「後期募集」（他県の一般選抜相当）1本の選抜に一本化して
 * いる。列は[後期募集人員（＝本ファイルのquota）/ 最終志願者数（＝applicants）/ 倍率（帰国生徒等
 * を除く。＝finalRate。印字済み値をそのまま採用）]。韮崎工業（工業科6学科）・青洲（工業科2学科・
 * 商業科2学科）・塩山（商業科2学科）・都留興譲館（工業科4学科）は教委が公式に「一括して募集する」
 * と注記する学科群で、単一レコードとして収録した（他県のくくり募集と同型）。
 *
 * ⚠️帰国生徒等特別措置の適用者は最終志願者数に内数として含まれるが、倍率の算定からは除外される
 * （注記「志願者数のうち帰国生徒等特別措置の適用を受ける者は内数とし、倍率の算定には加えていない」）。
 * このため笛吹高校果樹園芸科・都留興譲館高校普通科等、帰国生徒等の内数が小さくない学科では
 * 印字済み倍率が「最終志願者数÷後期募集人員」の単純計算値と若干（0.04〜0.06程度）ずれるが、
 * 転記ミスではなく公表資料の算定方式によるものである（finalRateは印字値をそのまま採用）。
 *
 * 機械集計（quota3,356・applicants3,037、26校48学科=48レコード）が「全日制課程計」行（後期募集
 * 人員3,356・最終志願者数3,037・倍率0.90）および資料が明記する「26校 48学科」と初回転記で完全
 * 一致した（再修正なし）。定時制課程は他県と同じ理由でスコープ外。
 *
 * ⚠️掛-1（学校別×多年度）R7追加: 令和7年度版「志願変更後の最終志願者数」（令和7年2月27日公表・
 * 志願変更締切2/26午後4時・全7頁のうち全日制後期募集は2〜3頁）
 * https://www.pref.yamanashi.jp/documents/7061/r7_saisyuu_sigansya.pdf を取得。R8と異なり
 * この年度版はテキスト埋め込みでもpdftotext -layoutでCJKラベルが抽出できなかったため、pdftoppm
 * 300dpiビジョン解析で48レコード（26校）を転記した。学校・学科構成はR8と完全一致（学校再編0件）。
 * ページ3末尾の印字済み「全日制課程計」（quota3,395・applicants3,227・倍率0.95）とnode.js機械
 * 集計が完全一致し、資料1ページ目の概要記載（後期募集3,395人・最終志願者数3,227人・倍率0.95）とも
 * 一致した。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const YAMANASHI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'yamanashi',
  sources: [
    {
      url: 'https://www.pref.yamanashi.jp/documents/7061/r8saisyuusigansyasuu1.pdf',
      docTitle: '山梨県教育委員会 令和8年度山梨県公立高等学校入学者選抜 全日制後期募集及び定時制課程の最終志願状況について',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.pref.yamanashi.jp/documents/7061/r7_saisyuu_sigansya.pdf',
      docTitle: '山梨県教育委員会 令和7年度山梨県公立高等学校入学者選抜 全日制後期募集及び定時制課程の最終志願状況について',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制後期募集（26校48学科=48レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note:
      '「全日制課程計」行（後期募集人員3,356・最終志願者数3,037・倍率0.90）および資料が明記する' +
      '「26校 48学科」と機械集計が完全一致した（初回転記で一致・再修正なし）。',
  },
  officialSubtotals: [{ label: '全日制課程計', schoolCount: 26, quota: 3356, finalApplicants: 3037, finalRate: 0.9 }],
  records: [
    { schoolName: '北杜', department: '普通', quota: 49, finalApplicants: 45, finalRate: 0.92 },
    { schoolName: '北杜', department: '総合学科', quota: 55, finalApplicants: 41, finalRate: 0.75 },
    { schoolName: '韮崎', department: '普通', quota: 126, finalApplicants: 139, finalRate: 1.1 },
    { schoolName: '韮崎', department: '文理', quota: 21, finalApplicants: 15, finalRate: 0.71 },
    { schoolName: '韮崎工業', department: '工業(一括)', quota: 103, finalApplicants: 84, finalRate: 0.82 },
    { schoolName: '甲府第一', department: '普通', quota: 122, finalApplicants: 123, finalRate: 1.01 },
    { schoolName: '甲府第一', department: '探究', quota: 42, finalApplicants: 34, finalRate: 0.81 },
    { schoolName: '甲府西', department: '普通', quota: 141, finalApplicants: 130, finalRate: 0.92 },
    { schoolName: '甲府南', department: '普通', quota: 143, finalApplicants: 129, finalRate: 0.9 },
    { schoolName: '甲府南', department: '理数', quota: 28, finalApplicants: 37, finalRate: 1.32 },
    { schoolName: '甲府東', department: '普通', quota: 182, finalApplicants: 207, finalRate: 1.14 },
    { schoolName: '甲府工業', department: '機械', quota: 45, finalApplicants: 40, finalRate: 0.89 },
    { schoolName: '甲府工業', department: '電気', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '甲府工業', department: '建築', quota: 20, finalApplicants: 16, finalRate: 0.8 },
    { schoolName: '甲府工業', department: '土木', quota: 23, finalApplicants: 23, finalRate: 1.0 },
    { schoolName: '甲府工業', department: '電子', quota: 30, finalApplicants: 22, finalRate: 0.73 },
    { schoolName: '甲府城西', department: '総合学科', quota: 130, finalApplicants: 114, finalRate: 0.88 },
    { schoolName: '甲府昭和', department: '普通', quota: 160, finalApplicants: 155, finalRate: 0.96 },
    { schoolName: '農林', department: 'システム園芸', quota: 23, finalApplicants: 25, finalRate: 1.09 },
    { schoolName: '農林', department: '森林科学', quota: 25, finalApplicants: 13, finalRate: 0.52 },
    { schoolName: '農林', department: '環境土木', quota: 20, finalApplicants: 14, finalRate: 0.7 },
    { schoolName: '農林', department: '造園緑地', quota: 23, finalApplicants: 11, finalRate: 0.48 },
    { schoolName: '農林', department: '食品科学', quota: 17, finalApplicants: 17, finalRate: 1.0 },
    { schoolName: '巨摩', department: '普通', quota: 108, finalApplicants: 118, finalRate: 1.08 },
    { schoolName: '白根', department: '普通', quota: 75, finalApplicants: 82, finalRate: 1.09 },
    { schoolName: '青洲', department: '普通', quota: 96, finalApplicants: 106, finalRate: 1.1 },
    { schoolName: '青洲', department: '工業(一括)', quota: 43, finalApplicants: 41, finalRate: 0.95 },
    { schoolName: '青洲', department: '商業(一括)', quota: 42, finalApplicants: 52, finalRate: 1.24 },
    { schoolName: '身延', department: '総合学科', quota: 59, finalApplicants: 27, finalRate: 0.46 },
    { schoolName: '笛吹', department: '普通', quota: 49, finalApplicants: 38, finalRate: 0.78 },
    { schoolName: '笛吹', department: '食品化学', quota: 16, finalApplicants: 13, finalRate: 0.81 },
    { schoolName: '笛吹', department: '果樹園芸', quota: 21, finalApplicants: 11, finalRate: 0.48 },
    { schoolName: '笛吹', department: '総合学科', quota: 55, finalApplicants: 30, finalRate: 0.55 },
    { schoolName: '日川', department: '普通', quota: 118, finalApplicants: 105, finalRate: 0.89 },
    { schoolName: '山梨', department: '普通', quota: 96, finalApplicants: 102, finalRate: 1.06 },
    { schoolName: '塩山', department: '普通', quota: 56, finalApplicants: 24, finalRate: 0.41 },
    { schoolName: '塩山', department: '商業(一括)', quota: 30, finalApplicants: 8, finalRate: 0.27 },
    { schoolName: '都留', department: '普通', quota: 128, finalApplicants: 115, finalRate: 0.89 },
    { schoolName: '上野原', department: '総合学科', quota: 69, finalApplicants: 53, finalRate: 0.77 },
    { schoolName: '都留興譲館', department: '普通', quota: 53, finalApplicants: 48, finalRate: 0.85 },
    { schoolName: '都留興譲館', department: '英語理数', quota: 22, finalApplicants: 5, finalRate: 0.23 },
    { schoolName: '都留興譲館', department: '工業(一括)', quota: 72, finalApplicants: 40, finalRate: 0.56 },
    { schoolName: '吉田', department: '普通', quota: 140, finalApplicants: 129, finalRate: 0.92 },
    { schoolName: '吉田', department: '理数', quota: 34, finalApplicants: 42, finalRate: 1.24 },
    { schoolName: '富士北稜', department: '総合学科', quota: 165, finalApplicants: 135, finalRate: 0.81 },
    { schoolName: '富士河口湖', department: '普通', quota: 118, finalApplicants: 105, finalRate: 0.89 },
    { schoolName: '甲府商業', department: '商業', quota: 75, finalApplicants: 86, finalRate: 1.15 },
    { schoolName: '甲府商業', department: '情報処理', quota: 48, finalApplicants: 48, finalRate: 1.0 },
    { schoolName: '北杜', department: '普通', quota: 48, finalApplicants: 42, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北杜', department: '総合学科', quota: 45, finalApplicants: 41, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '韮崎', department: '普通', quota: 126, finalApplicants: 142, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '韮崎', department: '文理', quota: 21, finalApplicants: 19, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '韮崎工業', department: '工業(一括)', quota: 101, finalApplicants: 55, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府第一', department: '普通', quota: 128, finalApplicants: 139, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府第一', department: '探究', quota: 42, finalApplicants: 33, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府西', department: '普通', quota: 140, finalApplicants: 146, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府南', department: '普通', quota: 149, finalApplicants: 182, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府南', department: '理数', quota: 28, finalApplicants: 40, finalRate: 1.39, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府東', department: '普通', quota: 194, finalApplicants: 219, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府工業', department: '機械', quota: 46, finalApplicants: 44, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府工業', department: '電気', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府工業', department: '建築', quota: 21, finalApplicants: 18, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府工業', department: '土木', quota: 31, finalApplicants: 20, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府工業', department: '電子', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府城西', department: '総合学科', quota: 136, finalApplicants: 157, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府昭和', department: '普通', quota: 171, finalApplicants: 210, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農林', department: 'システム園芸', quota: 18, finalApplicants: 19, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農林', department: '森林科学', quota: 21, finalApplicants: 11, finalRate: 0.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農林', department: '環境土木', quota: 22, finalApplicants: 12, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農林', department: '造園緑地', quota: 23, finalApplicants: 19, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農林', department: '食品科学', quota: 17, finalApplicants: 20, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '巨摩', department: '普通', quota: 108, finalApplicants: 115, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白根', department: '普通', quota: 80, finalApplicants: 80, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '青洲', department: '普通', quota: 96, finalApplicants: 96, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '青洲', department: '工業(一括)', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '青洲', department: '商業(一括)', quota: 50, finalApplicants: 55, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '身延', department: '総合学科', quota: 55, finalApplicants: 26, finalRate: 0.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笛吹', department: '普通', quota: 56, finalApplicants: 44, finalRate: 0.77, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笛吹', department: '食品化学', quota: 15, finalApplicants: 15, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笛吹', department: '果樹園芸', quota: 15, finalApplicants: 17, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笛吹', department: '総合学科', quota: 44, finalApplicants: 42, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日川', department: '普通', quota: 122, finalApplicants: 136, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '山梨', department: '普通', quota: 96, finalApplicants: 107, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '塩山', department: '普通', quota: 57, finalApplicants: 23, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '塩山', department: '商業(一括)', quota: 35, finalApplicants: 8, finalRate: 0.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '都留', department: '普通', quota: 137, finalApplicants: 132, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上野原', department: '総合学科', quota: 63, finalApplicants: 37, finalRate: 0.59, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '都留興譲館', department: '普通', quota: 48, finalApplicants: 34, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '都留興譲館', department: '英語理数', quota: 21, finalApplicants: 11, finalRate: 0.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '都留興譲館', department: '工業(一括)', quota: 69, finalApplicants: 31, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉田', department: '普通', quota: 156, finalApplicants: 142, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉田', department: '理数', quota: 34, finalApplicants: 32, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富士北稜', department: '総合学科', quota: 159, finalApplicants: 133, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富士河口湖', department: '普通', quota: 124, finalApplicants: 107, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府商業', department: '商業', quota: 75, finalApplicants: 73, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲府商業', department: '情報処理', quota: 52, finalApplicants: 52, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
  ],
};
