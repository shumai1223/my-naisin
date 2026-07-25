/**
 * 香川県 公立高等学校 倍率パイプラインα（Y-6・18県目・全日制完全達成）。
 *
 * 一次ソース: 香川県教育委員会「令和8年度香川県公立高等学校一般選抜出願者数（全日制課程小学科・
 * コース別）（一般選抜志願変更締切後・2月24日）」（全2ページ）。
 *
 * ⚠️香川県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重・富山・石川・福井・愛媛・徳島と同型の高信頼度
 * 技法）。列は[入学定員（合計） / 自己推薦選抜合格者等数（内数） / 入学定員（差引後＝本ファイルの
 * quota） / 出願者数（＝applicants） / 志願変更内訳 / 競争率]。番号付き学校リストのため他県で
 * 頻出した「学校名の行折返し遅延」の罠が無く、転記難度は比較的低かった。
 *
 * ⚠️くくり募集は凡例で明記済み（※印＝くくり募集）: 三本松「普通，理数」、農業経営「農業生産，
 * 環境園芸，動物科学，食農科学」（4学科くくり）、観音寺第一「普通，理数」の3組。連結学科名の
 * 単一レコードとして記録した。高松北の☆印（高松北中学校からの入学予定者70人を除く）は既に
 * 入学定員の差引後の値に反映済みのため追加調整不要。
 *
 * ⚠️このPDFにはページ2以降に別の小規模な表（連携型選抜等・合計quota298/applicants15）が存在する
 * が、表題・規模から一般選抜とは異なる別枠の選抜区分と判断し対象外とした。
 *
 * 機械集計（quota4,208・applicants4,296・倍率1.02、30校68レコード）が「全日制合計」行と完全
 * 一致した（初回転記で一致・再修正なし）。定時制課程は他県と同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const KAGAWA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kagawa',
  sources: [
    {
      url: 'https://www.pref.kagawa.lg.jp/documents/15096/syutugan8-3-2.pdf',
      docTitle: '香川県教育委員会 令和8年度香川県公立高等学校一般選抜出願者数（全日制課程小学科・コース別）（一般選抜志願変更締切後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（30校68レコード）'],
    pendingDepartments: ['定時制課程・連携型選抜等（他県と同じ理由・別枠のためスコープ外）'],
    note: '「全日制合計」行（quota4,208・applicants4,296・倍率1.02）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 30, quota: 4208, finalApplicants: 4296, finalRate: 1.02 }],
  records: [
    { schoolName: '小豆島中央', department: '特進コース', quota: 30, finalApplicants: 31, finalRate: 1.03 },
    { schoolName: '小豆島中央', department: '普通コース', quota: 117, finalApplicants: 85, finalRate: 0.73 },
    { schoolName: '三本松', department: '普通・理数（くくり募集）', quota: 87, finalApplicants: 80, finalRate: 0.92 },
    { schoolName: '石田', department: '生産経済', quota: 12, finalApplicants: 11, finalRate: 0.92 },
    { schoolName: '石田', department: '園芸デザイン', quota: 12, finalApplicants: 11, finalRate: 0.92 },
    { schoolName: '石田', department: '農業土木', quota: 17, finalApplicants: 12, finalRate: 0.71 },
    { schoolName: '石田', department: '生活デザイン', quota: 16, finalApplicants: 6, finalRate: 0.38 },
    { schoolName: '志度', department: '電子機械', quota: 15, finalApplicants: 18, finalRate: 1.2 },
    { schoolName: '志度', department: '情報科学', quota: 15, finalApplicants: 16, finalRate: 1.07 },
    { schoolName: '志度', department: '商業', quota: 15, finalApplicants: 9, finalRate: 0.6 },
    { schoolName: '津田', department: '普通', quota: 57, finalApplicants: 52, finalRate: 0.91 },
    { schoolName: '三木', department: '文理', quota: 56, finalApplicants: 53, finalRate: 0.95 },
    { schoolName: '三木', department: '総合', quota: 49, finalApplicants: 54, finalRate: 1.1 },
    { schoolName: '高松', department: '普通', quota: 280, finalApplicants: 304, finalRate: 1.09 },
    { schoolName: '高松工芸', department: '機械', quota: 24, finalApplicants: 30, finalRate: 1.25 },
    { schoolName: '高松工芸', department: '電気', quota: 21, finalApplicants: 31, finalRate: 1.48 },
    { schoolName: '高松工芸', department: '工業化学', quota: 24, finalApplicants: 25, finalRate: 1.04 },
    { schoolName: '高松工芸', department: '建築', quota: 21, finalApplicants: 23, finalRate: 1.1 },
    { schoolName: '高松工芸', department: 'デザイン', quota: 15, finalApplicants: 21, finalRate: 1.4 },
    { schoolName: '高松工芸', department: '工芸', quota: 36, finalApplicants: 47, finalRate: 1.31 },
    { schoolName: '高松工芸', department: '美術', quota: 11, finalApplicants: 9, finalRate: 0.82 },
    { schoolName: '高松商業', department: '商業', quota: 126, finalApplicants: 154, finalRate: 1.22 },
    { schoolName: '高松商業', department: '情報数理', quota: 16, finalApplicants: 18, finalRate: 1.13 },
    { schoolName: '高松商業', department: '英語実務', quota: 17, finalApplicants: 18, finalRate: 1.06 },
    { schoolName: '高松東', department: '普通', quota: 166, finalApplicants: 157, finalRate: 0.95 },
    { schoolName: '高松南', department: '普通', quota: 101, finalApplicants: 146, finalRate: 1.45 },
    { schoolName: '高松南', department: '環境科学', quota: 24, finalApplicants: 25, finalRate: 1.04 },
    { schoolName: '高松南', department: '生活デザイン', quota: 21, finalApplicants: 33, finalRate: 1.57 },
    { schoolName: '高松南', department: '看護', quota: 21, finalApplicants: 20, finalRate: 0.95 },
    { schoolName: '高松南', department: '福祉', quota: 21, finalApplicants: 18, finalRate: 0.86 },
    { schoolName: '高松西', department: '普通', quota: 189, finalApplicants: 182, finalRate: 0.96 },
    { schoolName: '高松北', department: '普通', quota: 93, finalApplicants: 72, finalRate: 0.77 },
    { schoolName: '香川中央', department: '普通', quota: 189, finalApplicants: 194, finalRate: 1.03 },
    { schoolName: '高松桜井', department: '普通', quota: 252, finalApplicants: 315, finalRate: 1.25 },
    { schoolName: '農業経営', department: '農業生産・環境園芸・動物科学・食農科学（くくり募集）', quota: 77, finalApplicants: 41, finalRate: 0.53 },
    { schoolName: '坂出商業', department: '商業', quota: 74, finalApplicants: 84, finalRate: 1.14 },
    { schoolName: '坂出商業', department: '情報技術', quota: 20, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '坂出', department: '普通', quota: 217, finalApplicants: 241, finalRate: 1.11 },
    { schoolName: '坂出', department: '音楽', quota: 10, finalApplicants: 5, finalRate: 0.5 },
    { schoolName: '坂出工業', department: '機械', quota: 15, finalApplicants: 21, finalRate: 1.4 },
    { schoolName: '坂出工業', department: '電気', quota: 15, finalApplicants: 10, finalRate: 0.67 },
    { schoolName: '坂出工業', department: '化学工学', quota: 21, finalApplicants: 13, finalRate: 0.62 },
    { schoolName: '坂出工業', department: '建築', quota: 15, finalApplicants: 14, finalRate: 0.93 },
    { schoolName: '丸亀', department: '普通', quota: 280, finalApplicants: 291, finalRate: 1.04 },
    { schoolName: '飯山', department: '看護', quota: 21, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '飯山', department: '総合', quota: 71, finalApplicants: 59, finalRate: 0.83 },
    { schoolName: '丸亀城西', department: '普通', quota: 136, finalApplicants: 146, finalRate: 1.07 },
    { schoolName: '善通寺第一', department: '普通', quota: 106, finalApplicants: 119, finalRate: 1.12 },
    { schoolName: '善通寺第一', department: 'デザイン', quota: 19, finalApplicants: 18, finalRate: 0.95 },
    { schoolName: '琴平', department: '普通', quota: 126, finalApplicants: 109, finalRate: 0.87 },
    { schoolName: '多度津', department: '機械', quota: 19, finalApplicants: 13, finalRate: 0.68 },
    { schoolName: '多度津', department: '電気', quota: 19, finalApplicants: 15, finalRate: 0.79 },
    { schoolName: '多度津', department: '土木', quota: 19, finalApplicants: 16, finalRate: 0.84 },
    { schoolName: '多度津', department: '建築', quota: 19, finalApplicants: 11, finalRate: 0.58 },
    { schoolName: '多度津', department: '海洋技術', quota: 16, finalApplicants: 13, finalRate: 0.81 },
    { schoolName: '多度津', department: '海洋生産', quota: 16, finalApplicants: 21, finalRate: 1.31 },
    { schoolName: '笠田', department: '農産科学', quota: 20, finalApplicants: 17, finalRate: 0.85 },
    { schoolName: '笠田', department: '植物科学', quota: 20, finalApplicants: 16, finalRate: 0.8 },
    { schoolName: '笠田', department: '食品科学', quota: 20, finalApplicants: 13, finalRate: 0.65 },
    { schoolName: '笠田', department: '生活デザイン', quota: 20, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '高瀬', department: '普通', quota: 87, finalApplicants: 77, finalRate: 0.89 },
    { schoolName: '観音寺第一', department: '普通・理数（くくり募集）', quota: 150, finalApplicants: 134, finalRate: 0.89 },
    { schoolName: '観音寺総合', department: '機械', quota: 18, finalApplicants: 12, finalRate: 0.67 },
    { schoolName: '観音寺総合', department: '電気', quota: 18, finalApplicants: 13, finalRate: 0.72 },
    { schoolName: '観音寺総合', department: '電子', quota: 18, finalApplicants: 16, finalRate: 0.89 },
    { schoolName: '観音寺総合', department: '総合', quota: 89, finalApplicants: 102, finalRate: 1.15 },
    { schoolName: '高松第一', department: '普通', quota: 240, finalApplicants: 316, finalRate: 1.32 },
    { schoolName: '高松第一', department: '音楽', quota: 11, finalApplicants: 2, finalRate: 0.18 },
  ],
};
