/**
 * 徳島県 公立高等学校 倍率パイプラインα（Y-6・17県目・全日制完全達成）。
 *
 * 一次ソース: 徳島県教育委員会「令和8年度徳島県公立高等学校一般選抜出願状況（2月26日志願変更後）」
 * （全1ページ・全日制は左右2段組＋定時制1段の3ブロック構成）。
 *
 * ⚠️徳島県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重・富山・石川・福井・愛媛と同型の高信頼度技法）。
 * 列は[募集人員 / 出願者数 / 倍率]という最も単純な構成。
 *
 * ⚠️罠1（2段組双方での学校名遅延）: 全日制ブロックが左右2段組で構成され、各段で学校名が学科群の
 * 途中（1〜2行遅れ）に出現するレイアウト崩れが左右両方で発生する（岡山県・群馬県で確立済みの
 * パターンと同型だが、今回は左右2系統で同時に発生するため判定が複雑だった）。
 *
 * ⚠️罠2（徳島科学技術高校が文書内で2箇所に分裂）: 右ブロック冒頭の「機械ロボットシステム・
 * 電気情報システム・都市環境システム」（3学科）と、左ブロック中盤の「総合科学類・機械技術類・
 * 電気技術類・建設技術類・海洋科学類・海洋技術類」（6学科）は、学校名ラベルの出現位置が離れて
 * いるため一見別の学校に見えるが、実在の徳島科学技術高校の学科構成（2023年の複数校統合により
 * 発足）と照合し、同一校の9学科として統合した。
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
    { schoolName: '徳島科学技術', department: '機械ロボットシステム', quota: 25, finalApplicants: 28, finalRate: 1.12 },
    { schoolName: '徳島科学技術', department: '電気情報システム', quota: 23, finalApplicants: 21, finalRate: 0.91 },
    { schoolName: '徳島科学技術', department: '都市環境システム', quota: 25, finalApplicants: 27, finalRate: 1.08 },
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
    { schoolName: '阿南光', department: '普通', quota: 30, finalApplicants: 25, finalRate: 0.83 },
    { schoolName: '那賀', department: '森林クリエイト', quota: 13, finalApplicants: 10, finalRate: 0.77 },
    { schoolName: '那賀', department: '普通', quota: 47, finalApplicants: 43, finalRate: 0.91 },
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
  ],
};
