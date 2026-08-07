/**
 * 徳島県 公立高等学校 倍率パイプラインα（Y-6・17県目・全日制完全達成／掛-1・R7多年度対応済）。
 *
 * 一次ソース: 徳島県教育委員会「令和8年度徳島県公立高等学校一般選抜出願状況（2月26日志願変更後）」
 * （全1ページ・全日制は左右2段組＋定時制1段の3ブロック構成）。
 *
 * ⚠️徳島県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重・富山・石川・福井・愛媛と同型の高信頼度技法）。
 * 列は[募集人員 / 出願者数 / 倍率]という最も単純な構成。R7側PDFは同型レイアウトだがテキスト埋め込み
 * が効かずpdftoppm 300dpi＋vision転記が必要だった。
 *
 * ⚠️罠1（2段組双方での学校名遅延）: 全日制ブロックが左右2段組で構成され、各段で学校名が学科群の
 * 途中（1〜2行遅れ）に出現するレイアウト崩れが左右両方で発生する（岡山県・群馬県で確立済みの
 * パターンと同型だが、今回は左右2系統で同時に発生するため判定が複雑だった）。
 *
 * ⚠️罠2（訂正済み・R8初回転記のバグ2件を掛-1着手時に発見）: R8初回セッションでは「機械ロボット
 * システム・電気情報システム・都市環境システム」（3学科）を徳島科学技術高校の9学科目として誤統合
 * していたが、R7側のvision転記＋WebSearch照合（阿南光高等学校の実在学科構成＝工業科3学科＋
 * 産業創造科）により、この3学科は阿南光高校に属することが判明し訂正した（徳島科学技術は総合科学類
 * 〜海洋技術類の6学科のみが正）。さらに「阿南光・普通（quota30）」も罠1と同型の学校名遅延誤帰属で、
 * 実際は海部高校の普通科（阿南光には普通科が存在しない＝WebSearchで実在学科と非存在を再確認済み・
 * R7側で海部が3学科[普通/情報ビジネス/数理科学]、阿南光が4学科[産業創造+工業科3学科]と収録されており
 * 学科数の突合からも裏付けられる）と判明し訂正した。学校名の帰属のみを修正し、quota/applicants等の
 * 数値・機械集計の合計は無変更（茨城の那珂湊/海洋・鉾田第一/鉾田第二と同型のバグパターンが3件目）。
 *
 * 機械集計（quota4,165・applicants4,160・倍率1.00、32校69レコード）が「合計」行と完全一致した
 * （複雑な列帰属判定にもかかわらず初回転記で一致）。定時制課程・学区外出願状況（別紙参考表）は
 * 他県と同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const TOKUSHIMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tokushima',
  sources: [
    {
      url: 'https://nyuushi.tokushima-ec.ed.jp/file/975',
      docTitle: '徳島県教育委員会 令和8年度徳島県公立高等学校一般選抜出願状況（2月26日志願変更後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://nyuushi.tokushima-ec.ed.jp/file/415',
      docTitle: '徳島県教育委員会 令和7年度徳島県公立高等学校一般選抜出願状況（2月27日志願変更後）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（32校69レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '「合計」行（quota4,165・applicants4,160・倍率1.00）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 32, quota: 4165, finalApplicants: 4160, finalRate: 1.0 }],
  records: [
    { schoolName: '城東', department: '普通', quota: 251, finalApplicants: 243, finalRate: 0.97 },
    { schoolName: '城南', department: '普通', quota: 210, finalApplicants: 221, finalRate: 1.05 },
    { schoolName: '城南', department: '応用数理', quota: 28, finalApplicants: 20, finalRate: 0.71 },
    { schoolName: '城北', department: '普通', quota: 217, finalApplicants: 229, finalRate: 1.06 },
    { schoolName: '城北', department: '理数科学', quota: 27, finalApplicants: 22, finalRate: 0.81 },
    { schoolName: '徳島北', department: '普通', quota: 214, finalApplicants: 216, finalRate: 1.01 },
    { schoolName: '徳島北', department: '国際英語', quota: 38, finalApplicants: 35, finalRate: 0.92 },
    { schoolName: '徳島市立', department: '普通', quota: 248, finalApplicants: 253, finalRate: 1.02 },
    { schoolName: '徳島市立', department: '理数', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '城西', department: '生産技術', quota: 18, finalApplicants: 26, finalRate: 1.44 },
    { schoolName: '城西', department: '植物活用', quota: 20, finalApplicants: 24, finalRate: 1.2 },
    { schoolName: '城西', department: '食品科学', quota: 24, finalApplicants: 29, finalRate: 1.21 },
    { schoolName: '城西', department: 'アグリビジネス', quota: 24, finalApplicants: 27, finalRate: 1.13 },
    { schoolName: '城西', department: '総合', quota: 62, finalApplicants: 70, finalRate: 1.13 },
    { schoolName: '城西・神山', department: '地域創生類', quota: 26, finalApplicants: 26, finalRate: 1.0 },
    { schoolName: '徳島科学技術', department: '総合科学類', quota: 54, finalApplicants: 57, finalRate: 1.06 },
    { schoolName: '徳島科学技術', department: '機械技術類', quota: 56, finalApplicants: 51, finalRate: 0.91 },
    { schoolName: '徳島科学技術', department: '電気技術類', quota: 53, finalApplicants: 49, finalRate: 0.92 },
    { schoolName: '徳島科学技術', department: '建設技術類', quota: 62, finalApplicants: 58, finalRate: 0.94 },
    { schoolName: '徳島科学技術', department: '海洋科学類', quota: 10, finalApplicants: 12, finalRate: 1.2 },
    { schoolName: '徳島科学技術', department: '海洋技術類', quota: 18, finalApplicants: 18, finalRate: 1.0 },
    { schoolName: '阿南光', department: '機械ロボットシステム', quota: 25, finalApplicants: 28, finalRate: 1.12 },
    { schoolName: '阿南光', department: '電気情報システム', quota: 23, finalApplicants: 21, finalRate: 0.91 },
    { schoolName: '阿南光', department: '都市環境システム', quota: 25, finalApplicants: 27, finalRate: 1.08 },
    { schoolName: '徳島商業', department: 'ビジネス探究', quota: 56, finalApplicants: 57, finalRate: 1.02 },
    { schoolName: '徳島商業', department: 'ビジネス創造', quota: 149, finalApplicants: 156, finalRate: 1.05 },
    { schoolName: '小松島', department: '普通', quota: 154, finalApplicants: 157, finalRate: 1.02 },
    { schoolName: '小松島西', department: '商業', quota: 38, finalApplicants: 41, finalRate: 1.08 },
    { schoolName: '小松島西', department: '食物', quota: 64, finalApplicants: 67, finalRate: 1.05 },
    { schoolName: '小松島西', department: '生活文化', quota: 20, finalApplicants: 20, finalRate: 1.0 },
    { schoolName: '小松島西', department: '福祉', quota: 30, finalApplicants: 33, finalRate: 1.1 },
    { schoolName: '小松島西・勝浦', department: '応用生産', quota: 12, finalApplicants: 13, finalRate: 1.08 },
    { schoolName: '小松島西・勝浦', department: '園芸福祉', quota: 13, finalApplicants: 6, finalRate: 0.46 },
    { schoolName: '富岡東', department: '普通', quota: 73, finalApplicants: 60, finalRate: 0.82 },
    { schoolName: '富岡東', department: '商業', quota: 17, finalApplicants: 18, finalRate: 1.06 },
    { schoolName: '富岡東・羽ノ浦', department: '看護', quota: 33, finalApplicants: 30, finalRate: 0.91 },
    { schoolName: '富岡西', department: '普通', quota: 147, finalApplicants: 160, finalRate: 1.09 },
    { schoolName: '富岡西', department: '理数', quota: 30, finalApplicants: 18, finalRate: 0.6 },
    { schoolName: '阿南光', department: '産業創造', quota: 64, finalApplicants: 77, finalRate: 1.2 },
    { schoolName: '那賀', department: '森林クリエイト', quota: 13, finalApplicants: 10, finalRate: 0.77 },
    { schoolName: '那賀', department: '普通', quota: 47, finalApplicants: 43, finalRate: 0.91 },
    { schoolName: '海部', department: '普通', quota: 30, finalApplicants: 25, finalRate: 0.83 },
    { schoolName: '海部', department: '情報ビジネス', quota: 18, finalApplicants: 19, finalRate: 1.06 },
    { schoolName: '海部', department: '数理科学', quota: 28, finalApplicants: 22, finalRate: 0.79 },
    { schoolName: '鳴門', department: '普通', quota: 236, finalApplicants: 239, finalRate: 1.01 },
    { schoolName: '鳴門渦潮', department: '総合', quota: 108, finalApplicants: 124, finalRate: 1.15 },
    { schoolName: '板野', department: '普通', quota: 118, finalApplicants: 138, finalRate: 1.17 },
    { schoolName: '名西', department: '普通', quota: 56, finalApplicants: 55, finalRate: 0.98 },
    { schoolName: '名西', department: '芸術（音楽）', quota: 4, finalApplicants: 2, finalRate: 0.5 },
    { schoolName: '吉野川', department: '農業科学', quota: 12, finalApplicants: 17, finalRate: 1.42 },
    { schoolName: '吉野川', department: '生物活用', quota: 15, finalApplicants: 15, finalRate: 1.0 },
    { schoolName: '吉野川', department: '会計ビジネス', quota: 20, finalApplicants: 16, finalRate: 0.8 },
    { schoolName: '吉野川', department: '情報ビジネス', quota: 19, finalApplicants: 20, finalRate: 1.05 },
    { schoolName: '吉野川', department: '食ビジネス', quota: 23, finalApplicants: 22, finalRate: 0.96 },
    { schoolName: '川島', department: '普通', quota: 61, finalApplicants: 61, finalRate: 1.0 },
    { schoolName: '阿波', department: '普通', quota: 131, finalApplicants: 131, finalRate: 1.0 },
    { schoolName: '阿波西', department: '普通', quota: 20, finalApplicants: 15, finalRate: 0.75 },
    { schoolName: '穴吹', department: '普通', quota: 38, finalApplicants: 42, finalRate: 1.11 },
    { schoolName: '脇町', department: '普通', quota: 158, finalApplicants: 157, finalRate: 0.99 },
    { schoolName: 'つるぎ', department: '電気', quota: 33, finalApplicants: 33, finalRate: 1.0 },
    { schoolName: 'つるぎ', department: '機械', quota: 34, finalApplicants: 34, finalRate: 1.0 },
    { schoolName: 'つるぎ', department: '建設', quota: 15, finalApplicants: 13, finalRate: 0.87 },
    { schoolName: 'つるぎ', department: '商業', quota: 24, finalApplicants: 22, finalRate: 0.92 },
    { schoolName: 'つるぎ', department: '地域ビジネス', quota: 19, finalApplicants: 17, finalRate: 0.89 },
    { schoolName: '池田', department: '普通', quota: 101, finalApplicants: 79, finalRate: 0.78 },
    { schoolName: '池田', department: '探究', quota: 35, finalApplicants: 33, finalRate: 0.94 },
    { schoolName: '池田・辻', department: '総合', quota: 41, finalApplicants: 25, finalRate: 0.61 },
    { schoolName: '池田・三好', department: '食農科学', quota: 20, finalApplicants: 19, finalRate: 0.95 },
    { schoolName: '池田・三好', department: '環境資源', quota: 15, finalApplicants: 4, finalRate: 0.27 },
    // 掛-1（学校別×多年度）: 令和7年度（2025年度）分。阿南光/海部の学校名帰属はR8修正後と同じ正しい形で収録。
    { schoolName: '城東', department: '普通', quota: 251, finalApplicants: 256, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城南', department: '普通', quota: 215, finalApplicants: 227, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城南', department: '応用数理', quota: 29, finalApplicants: 22, finalRate: 0.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城北', department: '普通', quota: 218, finalApplicants: 237, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城北', department: '理数科学', quota: 28, finalApplicants: 23, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島北', department: '普通', quota: 205, finalApplicants: 225, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島北', department: '国際英語', quota: 37, finalApplicants: 38, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島市立', department: '普通', quota: 228, finalApplicants: 246, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島市立', department: '理数', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城西', department: '生産技術', quota: 17, finalApplicants: 19, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城西', department: '植物活用', quota: 20, finalApplicants: 24, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城西', department: '食品科学', quota: 25, finalApplicants: 26, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城西', department: 'アグリビジネス', quota: 24, finalApplicants: 23, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城西', department: '総合', quota: 61, finalApplicants: 59, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城西・神山', department: '地域創生類', quota: 28, finalApplicants: 18, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島科学技術', department: '総合科学類', quota: 54, finalApplicants: 52, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島科学技術', department: '機械技術類', quota: 55, finalApplicants: 52, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島科学技術', department: '電気技術類', quota: 56, finalApplicants: 46, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島科学技術', department: '建設技術類', quota: 64, finalApplicants: 61, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島科学技術', department: '海洋科学類', quota: 8, finalApplicants: 6, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島科学技術', department: '海洋技術類', quota: 17, finalApplicants: 15, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '阿南光', department: '機械ロボットシステム', quota: 21, finalApplicants: 21, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '阿南光', department: '電気情報システム', quota: 24, finalApplicants: 21, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '阿南光', department: '都市環境システム', quota: 23, finalApplicants: 19, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島商業', department: 'ビジネス探究', quota: 57, finalApplicants: 45, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '徳島商業', department: 'ビジネス創造', quota: 150, finalApplicants: 157, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松島', department: '普通', quota: 150, finalApplicants: 153, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松島西', department: '商業', quota: 39, finalApplicants: 41, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松島西', department: '食物', quota: 65, finalApplicants: 63, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松島西', department: '生活文化', quota: 18, finalApplicants: 20, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松島西', department: '福祉', quota: 28, finalApplicants: 22, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松島西・勝浦', department: '応用生産', quota: 9, finalApplicants: 7, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松島西・勝浦', department: '園芸福祉', quota: 14, finalApplicants: 7, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富岡東', department: '普通', quota: 73, finalApplicants: 65, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富岡東', department: '商業', quota: 21, finalApplicants: 21, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富岡東・羽ノ浦', department: '看護', quota: 32, finalApplicants: 32, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富岡西', department: '普通', quota: 144, finalApplicants: 160, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富岡西', department: '理数', quota: 30, finalApplicants: 19, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '阿南光', department: '産業創造', quota: 65, finalApplicants: 67, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '那賀', department: '森林クリエイト', quota: 17, finalApplicants: 19, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '那賀', department: '普通', quota: 26, finalApplicants: 26, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '海部', department: '普通', quota: 48, finalApplicants: 41, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '海部', department: '情報ビジネス', quota: 17, finalApplicants: 14, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '海部', department: '数理科学', quota: 28, finalApplicants: 22, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳴門', department: '普通', quota: 227, finalApplicants: 238, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳴門渦潮', department: '総合', quota: 106, finalApplicants: 108, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '板野', department: '普通', quota: 118, finalApplicants: 120, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '名西', department: '普通', quota: 55, finalApplicants: 53, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '名西', department: '芸術（音楽）', quota: 6, finalApplicants: 1, finalRate: 0.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉野川', department: '農業科学', quota: 9, finalApplicants: 10, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉野川', department: '生物活用', quota: 15, finalApplicants: 18, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉野川', department: '会計ビジネス', quota: 20, finalApplicants: 18, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉野川', department: '情報ビジネス', quota: 21, finalApplicants: 21, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉野川', department: '食ビジネス', quota: 25, finalApplicants: 25, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川島', department: '普通', quota: 68, finalApplicants: 69, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '阿波', department: '普通', quota: 117, finalApplicants: 117, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '阿波西', department: '普通', quota: 18, finalApplicants: 15, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '穴吹', department: '普通', quota: 39, finalApplicants: 35, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '脇町', department: '普通', quota: 149, finalApplicants: 150, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'つるぎ', department: '電気', quota: 35, finalApplicants: 33, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'つるぎ', department: '機械', quota: 33, finalApplicants: 33, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'つるぎ', department: '建設', quota: 15, finalApplicants: 15, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'つるぎ', department: '商業', quota: 24, finalApplicants: 23, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'つるぎ', department: '地域ビジネス', quota: 16, finalApplicants: 16, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '池田', department: '普通', quota: 103, finalApplicants: 78, finalRate: 0.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '池田', department: '探究', quota: 35, finalApplicants: 28, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '池田・辻', department: '総合', quota: 34, finalApplicants: 30, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '池田・三好', department: '食農科学', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '池田・三好', department: '環境資源', quota: 15, finalApplicants: 12, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
  ],
};
