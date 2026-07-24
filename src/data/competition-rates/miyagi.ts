/**
 * 宮城県 公立高等学校 倍率パイプラインα（Y-6・5県目）。
 *
 * 一次ソース: 宮城県教育庁高校教育課「令和8年度宮城県公立高等学校入学者選抜に係る第一次募集
 * 学校・学科別出願状況」（令和8年2月13日公表・第一次募集出願確定の志願者数）。
 *
 * ⚠️宮城県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した。列構成は
 * [募集定員(quota) / 令和8年度第一次募集出願志願者数(finalApplicants) / 同倍率(finalRate) /
 * 参考: 令和8年度出願希望調査志願者数・倍率 / 参考: 令和7年度出願希望調査・第一次募集倍率]
 * とシンプルで、広島県・熊本県のような特別選抜控除の入れ子構造は無い。
 *
 * ⚠️罠: 表には学校別の行の他に「○○地区計」「○○地区合計」という2階層の地区別小計行が多数
 * 挟まっており（例:刈田柴田地区計・南部地区合計）、pdftotext -layout後のテキストでは地区名の
 * 各文字が全角スペースで区切られる（例:「地　区　計」）ため、素朴な文字列一致では検出できず
 * 誤って学校レコードとして取り込み集計が3倍近くに膨張する事故が発生した（文字間の任意空白を
 * 許容する正規表現に変更して解決）。学校数・学科数がPDF冒頭の概要
 * （全日制課程：県立64校、市立4校＝計68校・129学科）と完全一致することも二重の検証として機能した。
 *
 * 機械集計（quota13,400・applicants12,516・倍率0.93）はPDF末尾の「全日制合計」行と完全一致した。
 * 定時制課程は東京都・神奈川県・千葉県・埼玉県・福岡県・兵庫県・静岡県・広島県・熊本県と同じ
 * 理由でスコープ外。（参考）欄に前年度比較のみで今年度実施の無い旧コース（岩ヶ崎の文系教養・
 * 理系教養コース等）は今年度データが「----」のため対象外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const MIYAGI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'miyagi',
  sources: [
    {
      url: 'https://www.pref.miyagi.jp/documents/63612/0213_r8kouritukoukou_nyuugakusyasenbatsu_gakuryokukensa.pdf',
      docTitle:
        '宮城県教育庁高校教育課 令和8年度宮城県公立高等学校入学者選抜に係る第一次募集出願状況について（学校・学科別出願状況）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（第一次募集、県立64校＋市立4校＝68校・完全収録）'],
    pendingDepartments: [
      '定時制課程（全日制の外側の別課程のため他県と同じ理由で意図的にスコープ外）',
    ],
    note:
      '全日制課程68校129レコードを完全収録し、機械集計（quota13,400・applicants12,516・' +
      '倍率0.93）がPDF末尾の「全日制合計」行と完全一致した。学校数・学科数もPDF冒頭の概要' +
      '（68校129学科）と完全一致。',
  },
  officialSubtotals: [
    { label: '全日制合計', quota: 13400, finalApplicants: 12516, finalRate: 0.93 },
  ],
  records: [
    { schoolName: '白石', department: '普通科', quota: 240, finalApplicants: 231, finalRate: 0.96 },
    { schoolName: '白石', department: '看護科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '白石蔵王', department: '普通科', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '白石工', department: '機械科', quota: 80, finalApplicants: 50, finalRate: 0.63 },
    { schoolName: '白石工', department: '電気科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '白石工', department: '工業化学科', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '白石工', department: '建築科', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '白石工', department: '設備工業科', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '村田', department: '総合学科', quota: 120, finalApplicants: 32, finalRate: 0.27 },
    { schoolName: '大河原産業', department: '農業科学科', quota: 80, finalApplicants: 85, finalRate: 1.06 },
    { schoolName: '大河原産業', department: '企画デザイン科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '大河原産業', department: '総合ビジネス科', quota: 120, finalApplicants: 113, finalRate: 0.94 },
    { schoolName: '大河原産川崎', department: '普通科', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '柴田', department: '普通科', quota: 120, finalApplicants: 59, finalRate: 0.49 },
    { schoolName: '柴田', department: '体育科', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '角田', department: '普通科', quota: 160, finalApplicants: 120, finalRate: 0.75 },
    { schoolName: '伊具', department: '総合学科', quota: 120, finalApplicants: 23, finalRate: 0.19 },
    { schoolName: '名取', department: '普通科', quota: 240, finalApplicants: 263, finalRate: 1.1 },
    { schoolName: '名取', department: '家政科', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '名取北', department: '普通科', quota: 240, finalApplicants: 257, finalRate: 1.07 },
    { schoolName: '亘理', department: '普通科', quota: 80, finalApplicants: 29, finalRate: 0.36 },
    { schoolName: '亘理', department: '食品科学科', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '亘理', department: '家政科', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '宮城農', department: '農業科・園芸科', quota: 120, finalApplicants: 153, finalRate: 1.27 },
    { schoolName: '宮城農', department: '農業機械科', quota: 40, finalApplicants: 51, finalRate: 1.27 },
    { schoolName: '宮城農', department: '食品化学科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '宮城農', department: '生活科', quota: 40, finalApplicants: 55, finalRate: 1.38 },
    { schoolName: '仙台一', department: '普通科', quota: 320, finalApplicants: 452, finalRate: 1.41 },
    { schoolName: '仙台二華', department: '普通科', quota: 240, finalApplicants: 268, finalRate: 1.12 },
    { schoolName: '仙台三桜', department: '普通科', quota: 280, finalApplicants: 378, finalRate: 1.35 },
    { schoolName: '仙台向山', department: '普通科', quota: 160, finalApplicants: 204, finalRate: 1.27 },
    { schoolName: '仙台向山', department: '理数科', quota: 40, finalApplicants: 64, finalRate: 1.6 },
    { schoolName: '仙台南', department: '普通科', quota: 280, finalApplicants: 385, finalRate: 1.38 },
    { schoolName: '仙台西', department: '普通科', quota: 240, finalApplicants: 225, finalRate: 0.94 },
    { schoolName: '仙台東', department: '普通科', quota: 200, finalApplicants: 251, finalRate: 1.25 },
    { schoolName: '仙台東', department: '英語科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '宮城工', department: '機械科', quota: 80, finalApplicants: 93, finalRate: 1.16 },
    { schoolName: '宮城工', department: '電子機械科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '宮城工', department: '電気科', quota: 80, finalApplicants: 105, finalRate: 1.31 },
    { schoolName: '宮城工', department: '情報技術科', quota: 40, finalApplicants: 67, finalRate: 1.68 },
    { schoolName: '宮城工', department: '化学工業科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '宮城工', department: 'インテリア科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '仙台工', department: '建築科', quota: 30, finalApplicants: 38, finalRate: 1.27 },
    { schoolName: '仙台工', department: '機械科', quota: 60, finalApplicants: 72, finalRate: 1.2 },
    { schoolName: '仙台工', department: '電気科', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '仙台工', department: '土木科', quota: 30, finalApplicants: 35, finalRate: 1.17 },
    { schoolName: '仙台工', department: '情報科', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '仙台二', department: '普通科', quota: 320, finalApplicants: 381, finalRate: 1.19 },
    { schoolName: '仙台三', department: '普通科', quota: 240, finalApplicants: 326, finalRate: 1.36 },
    { schoolName: '仙台三', department: '理数科', quota: 80, finalApplicants: 96, finalRate: 1.2 },
    { schoolName: '宮城一', department: '普通科', quota: 200, finalApplicants: 321, finalRate: 1.61 },
    { schoolName: '宮城一', department: '国際探究科・理数探究科', quota: 80, finalApplicants: 108, finalRate: 1.35 },
    { schoolName: '宮城広瀬', department: '普通科', quota: 240, finalApplicants: 99, finalRate: 0.41 },
    { schoolName: '泉', department: '普通科', quota: 200, finalApplicants: 266, finalRate: 1.33 },
    { schoolName: '泉', department: '英語科', quota: 40, finalApplicants: 50, finalRate: 1.25 },
    { schoolName: '泉松陵', department: '普通科', quota: 240, finalApplicants: 185, finalRate: 0.77 },
    { schoolName: '泉館山', department: '普通科', quota: 240, finalApplicants: 293, finalRate: 1.22 },
    { schoolName: '宮城野', department: '普通科', quota: 200, finalApplicants: 225, finalRate: 1.13 },
    { schoolName: '宮城野', department: '美術科', quota: 40, finalApplicants: 59, finalRate: 1.48 },
    { schoolName: '仙台', department: '普通科', quota: 280, finalApplicants: 313, finalRate: 1.12 },
    { schoolName: '仙台商', department: '商業科', quota: 320, finalApplicants: 376, finalRate: 1.18 },
    { schoolName: '塩釜', department: '普通科', quota: 200, finalApplicants: 255, finalRate: 1.27 },
    { schoolName: '塩釜', department: 'ビジネス科', quota: 80, finalApplicants: 123, finalRate: 1.54 },
    { schoolName: '多賀城', department: '普通科', quota: 240, finalApplicants: 275, finalRate: 1.15 },
    { schoolName: '多賀城', department: '災害科学科', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '松島', department: '普通科', quota: 80, finalApplicants: 91, finalRate: 1.14 },
    { schoolName: '松島', department: '観光科', quota: 80, finalApplicants: 55, finalRate: 0.69 },
    { schoolName: '利府', department: '普通科', quota: 200, finalApplicants: 175, finalRate: 0.88 },
    { schoolName: '利府', department: 'スポーツ科学科', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '黒川', department: '普通科', quota: 80, finalApplicants: 56, finalRate: 0.7 },
    { schoolName: '黒川', department: '機械科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '黒川', department: '電子工学科', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '黒川', department: '環境技術科', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '富谷', department: '普通科', quota: 240, finalApplicants: 242, finalRate: 1.01 },
    { schoolName: '古川', department: '普通科', quota: 240, finalApplicants: 213, finalRate: 0.89 },
    { schoolName: '古川黎明', department: '普通科', quota: 240, finalApplicants: 219, finalRate: 0.91 },
    { schoolName: '岩出山', department: '普通科', quota: 80, finalApplicants: 25, finalRate: 0.31 },
    { schoolName: '中新田', department: '普通科', quota: 120, finalApplicants: 80, finalRate: 0.67 },
    { schoolName: '松山', department: '普通科', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '松山', department: '家政科', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '加美農', department: '農業科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '加美農', department: '農業機械科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '加美農', department: '生活技術科', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '古川工', department: '土木情報科', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '古川工', department: '建築科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '古川工', department: '電気電子科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '古川工', department: '機械科', quota: 80, finalApplicants: 78, finalRate: 0.98 },
    { schoolName: '古川工', department: '化学技術科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '鹿島台商', department: '商業科', quota: 80, finalApplicants: 11, finalRate: 0.14 },
    { schoolName: '涌谷', department: '普通科', quota: 120, finalApplicants: 28, finalRate: 0.23 },
    { schoolName: '小牛田農林', department: '農業技術科・農業科学コース', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '小牛田農林', department: '農業技術科・農業土木コース', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '小牛田農林', department: '総合学科', quota: 120, finalApplicants: 118, finalRate: 0.98 },
    { schoolName: '南郷', department: '普通科', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '南郷', department: '産業技術科', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '佐沼', department: '普通科', quota: 240, finalApplicants: 239, finalRate: 1 },
    { schoolName: '登米', department: '普通科', quota: 80, finalApplicants: 48, finalRate: 0.6 },
    { schoolName: '登米総合産業', department: '農業科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '登米総合産業', department: '機械科', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '登米総合産業', department: '電気科', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '登米総合産業', department: '情報技術科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '登米総合産業', department: '商業科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '登米総合産業', department: '福祉科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '築館', department: '普通科', quota: 160, finalApplicants: 159, finalRate: 0.99 },
    { schoolName: '築館一迫商業', department: '情報ビジネス科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '岩ヶ崎', department: '普通科', quota: 80, finalApplicants: 20, finalRate: 0.25 },
    { schoolName: '迫桜', department: '総合学科', quota: 160, finalApplicants: 80, finalRate: 0.5 },
    { schoolName: '石巻', department: '普通科', quota: 240, finalApplicants: 213, finalRate: 0.89 },
    { schoolName: '石巻好文館', department: '普通科', quota: 200, finalApplicants: 168, finalRate: 0.84 },
    { schoolName: '石巻西', department: '普通科', quota: 160, finalApplicants: 170, finalRate: 1.06 },
    { schoolName: '石巻北', department: '総合学科', quota: 160, finalApplicants: 73, finalRate: 0.46 },
    { schoolName: '宮城水産', department: '船舶運航科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '宮城水産', department: '生物環境科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '宮城水産', department: '食品科', quota: 40, finalApplicants: 41, finalRate: 1.02 },
    { schoolName: '石巻工', department: '機械科', quota: 40, finalApplicants: 41, finalRate: 1.02 },
    { schoolName: '石巻工', department: '電気情報科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '石巻工', department: '化学技術科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '石巻工', department: '土木システム科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '石巻工', department: '建築科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '石巻商', department: '総合ビジネス科', quota: 160, finalApplicants: 75, finalRate: 0.47 },
    { schoolName: '桜坂', department: '普通科・学励探求コース', quota: 80, finalApplicants: 43, finalRate: 0.54 },
    { schoolName: '桜坂', department: '普通科・キャリア探求コース', quota: 80, finalApplicants: 53, finalRate: 0.66 },
    { schoolName: '気仙沼', department: '普通科', quota: 240, finalApplicants: 202, finalRate: 0.84 },
    { schoolName: '南三陸', department: '普通科', quota: 80, finalApplicants: 22, finalRate: 0.28 },
    { schoolName: '南三陸', department: '情報ビジネス科', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '本吉響', department: '総合学科', quota: 120, finalApplicants: 34, finalRate: 0.28 },
    { schoolName: '気仙沼向洋', department: '情報海洋科', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '気仙沼向洋', department: '産業経済科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '気仙沼向洋', department: '機械技術科', quota: 40, finalApplicants: 40, finalRate: 1 },
  ],
};
