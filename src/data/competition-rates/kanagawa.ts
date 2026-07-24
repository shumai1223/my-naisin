/**
 * 神奈川県 公立高等学校 倍率パイプラインα（Y-2・先行8県の2県目）。
 *
 * 一次ソース: 神奈川県教育委員会「令和8年度神奈川県公立高等学校入学者選抜一般募集共通選抜等
 * 志願変更締切時志願状況」（別紙3・全13ページ）。
 * https://www.pref.kanagawa.jp/docs/dc4/prs/koko/r5617851.html （公表日: 2026-02-09）
 * https://www.pref.kanagawa.jp/documents/131973/bessi3.pdf
 *
 * 東京都と異なり、この資料は「1月30日（志願締切時・当初）」と「2月9日（志願変更締切時・
 * 最終）」の2段階の志願者数を併記する。本ファイルは常に2月9日（最終）列を採用する
 * （東京都の「最終応募状況」を採るのと同じ設計方針）。募集定員は志願変更で変わらない。
 *
 * ✅対象範囲=別紙3の「1 一般募集共通選抜志願変更締切時志願状況（全日制の課程）」＋
 * 「2 連携募集志願変更締切時志願状況」（連携募集は既存校への追加募集枠のため合算）。
 * 「3 一般募集共通選抜志願変更締切時志願状況（定時制の課程及び通信制の課程）」と
 * 「4 特別募集及び中途退学者募集」（海外帰国生徒特別募集・在県外国人等特別募集）は
 * 東京都の定時制/チャレンジスクール/在京外国人選抜と同じ理由でスコープ外（対象外として
 * 明示的に除外・全日制の外側の別集計）。
 *
 * 学校×学科は東京都と同じく「学校の学科別『計』行」単位で集計する（機械科/電気科等の
 * さらに細かいコース単位までは分解しない）。
 *
 * 転記の正しさは二重に検証済み: ①本ファイルの全レコード合計が quota=39,431 /
 * finalApplicants=43,821 に一致することを__tests__で機械確認 ②この39,431/43,821という
 * 数値自体は、県教育委員会の公表資料（別紙1「集計結果の概要」）を報じた複数の報道
 * （リセマム等）が伝える「一般募集共通選抜（志願変更締切時）全体の募集定員39,431人・
 * 志願者数43,821人・倍率1.11倍」と一致する（WebSearch実測で確認・2026-07-24）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const KANAGAWA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kanagawa',
  sources: [
    {
      url: 'https://www.pref.kanagawa.jp/documents/131973/bessi3.pdf',
      docTitle:
        '神奈川県教育委員会 令和8年度神奈川県公立高等学校入学者選抜一般募集共通選抜等志願変更締切時志願状況（別紙3）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '普通科（共通選抜・クリエイティブスクール含む）',
      '普通科（連携募集）',
      '専門学科（農業・工業・商業・水産・家庭・福祉・理数・体育・美術・国際の10学科）',
      '単位制（普通科・普通科専門コース・総合学科・専門学科8学科）',
    ],
    pendingDepartments: [],
    note:
      '全日制（一般募集共通選抜＋連携募集）を完了。定時制・通信制・特別募集（海外帰国/在県外国人）は全日制の外側の別集計のため対象外として明示的に除外。',
  },
  officialSubtotals: [
    { label: '普通科（共通選抜）県立計', schoolCount: 87, quota: 26045, finalApplicants: 30122, finalRate: 1.16 },
    { label: '普通科（共通選抜）市立計', schoolCount: 5, quota: 1230, finalApplicants: 1603, finalRate: 1.3 },
    { label: '普通科（共通選抜）合計', schoolCount: 92, quota: 27275, finalApplicants: 31725, finalRate: 1.16 },
    { label: '普通科（クリエイティブスクール）合計', schoolCount: 4, quota: 672, finalApplicants: 525, finalRate: 0.78 },
    { label: '専門学科（農業）合計', schoolCount: 3, quota: 460, finalApplicants: 488, finalRate: 1.06 },
    { label: '専門学科（工業）合計', schoolCount: 10, quota: 2181, finalApplicants: 1874, finalRate: 0.86 },
    { label: '専門学科（商業）合計', schoolCount: 7, quota: 1026, finalApplicants: 1078, finalRate: 1.05 },
    { label: '専門学科（水産）計', schoolCount: 1, quota: 152, finalApplicants: 141, finalRate: 0.93 },
    { label: '専門学科（福祉）合計', schoolCount: 4, quota: 193, finalApplicants: 128, finalRate: 0.66 },
    { label: '専門学科（体育）合計', schoolCount: 2, quota: 77, finalApplicants: 95, finalRate: 1.23 },
    { label: '専門学科（美術）合計', schoolCount: 2, quota: 76, finalApplicants: 82, finalRate: 1.08 },
    { label: '専門学科（国際）合計', schoolCount: 2, quota: 74, finalApplicants: 102, finalRate: 1.38 },
    { label: '単位制普通科合計', schoolCount: 16, quota: 4097, finalApplicants: 4204, finalRate: 1.03 },
    { label: '単位制総合学科（クリエイティブ除く）合計', schoolCount: 7, quota: 1859, finalApplicants: 2011, finalRate: 1.08 },
    { label: '単位制専門学科（農業）合計', schoolCount: 2, quota: 152, finalApplicants: 105, finalRate: 0.69 },
    { label: '単位制専門学科（国際関係）計', schoolCount: 1, quota: 159, finalApplicants: 190, finalRate: 1.19 },
    { label: '一般募集共通選抜（全日制）+連携募集 全体', quota: 39431, finalApplicants: 43821, finalRate: 1.11 },
  ],
  records: [
    // ===== 普通科（共通選抜）県立87校 =====
    // --- 横浜北（13校） ---
    { schoolName: '鶴見', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 381, finalRate: 1.2 },
    { schoolName: '横浜翠嵐', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 736, finalRate: 2.05 },
    { schoolName: '城郷', area: '横浜北', department: '普通科', quota: 238, finalApplicants: 277, finalRate: 1.16 },
    { schoolName: '港北', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 478, finalRate: 1.34 },
    { schoolName: '新羽', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 450, finalRate: 1.13 },
    { schoolName: '岸根', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 427, finalRate: 1.34 },
    { schoolName: '霧が丘', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 339, finalRate: 1.07 },
    { schoolName: '白山', area: '横浜北', department: '普通科', quota: 238, finalApplicants: 224, finalRate: 0.94 },
    { schoolName: '市ケ尾', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 515, finalRate: 1.29 },
    { schoolName: '元石川', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 432, finalRate: 1.21 },
    { schoolName: '川和', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 452, finalRate: 1.26 },
    { schoolName: '荏田', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 473, finalRate: 1.19 },
    { schoolName: '新栄', area: '横浜北', department: '普通科', quota: 346, finalApplicants: 359, finalRate: 1.04 },

    // --- 横浜中（11校） ---
    { schoolName: '希望ケ丘', area: '横浜中', department: '普通科', quota: 359, finalApplicants: 527, finalRate: 1.47 },
    { schoolName: '二俣川', area: '横浜中', department: '普通科', quota: 118, finalApplicants: 94, finalRate: 0.8 },
    { schoolName: '旭', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 326, finalRate: 1.03 },
    { schoolName: '松陽', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 410, finalRate: 1.29 },
    { schoolName: '横浜瀬谷', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 378, finalRate: 1.19 },
    { schoolName: '横浜平沼', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 443, finalRate: 1.39 },
    { schoolName: '光陵', area: '横浜中', department: '普通科', quota: 279, finalApplicants: 380, finalRate: 1.36 },
    { schoolName: '保土ケ谷', area: '横浜中', department: '普通科', quota: 238, finalApplicants: 249, finalRate: 1.05 },
    { schoolName: '舞岡', area: '横浜中', department: '普通科', quota: 358, finalApplicants: 364, finalRate: 1.02 },
    { schoolName: '上矢部', area: '横浜中', department: '普通科', quota: 238, finalApplicants: 243, finalRate: 1.02 },
    { schoolName: '金井', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 358, finalRate: 1.13 },

    // --- 横浜南（5校） ---
    { schoolName: '横浜南陵', area: '横浜南', department: '普通科', quota: 238, finalApplicants: 272, finalRate: 1.14 },
    { schoolName: '柏陽', area: '横浜南', department: '普通科', quota: 319, finalApplicants: 503, finalRate: 1.58 },
    { schoolName: '横浜緑ケ丘', area: '横浜南', department: '普通科', quota: 279, finalApplicants: 433, finalRate: 1.55 },
    { schoolName: '横浜立野', area: '横浜南', department: '普通科', quota: 278, finalApplicants: 336, finalRate: 1.21 },
    { schoolName: '横浜氷取沢', area: '横浜南', department: '普通科', quota: 358, finalApplicants: 428, finalRate: 1.2 },

    // --- 川崎（9校） ---
    { schoolName: '新城', area: '川崎', department: '普通科', quota: 268, finalApplicants: 440, finalRate: 1.64 },
    { schoolName: '住吉', area: '川崎', department: '普通科', quota: 358, finalApplicants: 440, finalRate: 1.23 },
    { schoolName: '川崎北', area: '川崎', department: '普通科', quota: 278, finalApplicants: 255, finalRate: 0.92 },
    { schoolName: '多摩', area: '川崎', department: '普通科', quota: 279, finalApplicants: 491, finalRate: 1.76 },
    { schoolName: '生田', area: '川崎', department: '普通科', quota: 398, finalApplicants: 470, finalRate: 1.18 },
    { schoolName: '百合丘', area: '川崎', department: '普通科', quota: 398, finalApplicants: 384, finalRate: 0.96 },
    { schoolName: '生田東', area: '川崎', department: '普通科', quota: 318, finalApplicants: 335, finalRate: 1.05 },
    { schoolName: '菅', area: '川崎', department: '普通科', quota: 278, finalApplicants: 162, finalRate: 0.58 },
    { schoolName: '麻生', area: '川崎', department: '普通科', quota: 318, finalApplicants: 318, finalRate: 1.0 },

    // --- 横須賀・三浦（5校） ---
    { schoolName: '横須賀', area: '横須賀三浦', department: '普通科', quota: 279, finalApplicants: 348, finalRate: 1.25 },
    { schoolName: '横須賀大津', area: '横須賀三浦', department: '普通科', quota: 278, finalApplicants: 321, finalRate: 1.15 },
    { schoolName: '追浜', area: '横須賀三浦', department: '普通科', quota: 318, finalApplicants: 349, finalRate: 1.1 },
    { schoolName: '津久井浜', area: '横須賀三浦', department: '普通科', quota: 238, finalApplicants: 281, finalRate: 1.18 },
    { schoolName: '逗子葉山', area: '横須賀三浦', department: '普通科', quota: 318, finalApplicants: 364, finalRate: 1.14 },

    // --- 鎌倉・藤沢・茅ケ崎（11校） ---
    { schoolName: '鎌倉', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 359, finalApplicants: 441, finalRate: 1.23 },
    { schoolName: '七里ガ浜', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 358, finalApplicants: 529, finalRate: 1.48 },
    { schoolName: '大船', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 398, finalApplicants: 471, finalRate: 1.18 },
    { schoolName: '湘南', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 359, finalApplicants: 593, finalRate: 1.65 },
    { schoolName: '藤沢西', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 318, finalApplicants: 379, finalRate: 1.19 },
    { schoolName: '湘南台', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 238, finalApplicants: 273, finalRate: 1.15 },
    { schoolName: '茅ケ崎', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 278, finalApplicants: 337, finalRate: 1.21 },
    { schoolName: '茅ケ崎北陵', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 279, finalApplicants: 371, finalRate: 1.33 },
    { schoolName: '鶴嶺', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 383, finalApplicants: 438, finalRate: 1.14 },
    { schoolName: '茅ケ崎西浜', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 358, finalApplicants: 371, finalRate: 1.04 },
    { schoolName: '寒川', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 238, finalApplicants: 132, finalRate: 0.55 },

    // --- 平塚・秦野・伊勢原（8校） ---
    { schoolName: '平塚江南', area: '平塚秦野伊勢原', department: '普通科', quota: 319, finalApplicants: 374, finalRate: 1.17 },
    { schoolName: '高浜', area: '平塚秦野伊勢原', department: '普通科', quota: 228, finalApplicants: 249, finalRate: 1.09 },
    { schoolName: '大磯', area: '平塚秦野伊勢原', department: '普通科', quota: 278, finalApplicants: 346, finalRate: 1.24 },
    { schoolName: '二宮', area: '平塚秦野伊勢原', department: '普通科', quota: 238, finalApplicants: 84, finalRate: 0.35 },
    { schoolName: '秦野', area: '平塚秦野伊勢原', department: '普通科', quota: 358, finalApplicants: 414, finalRate: 1.16 },
    { schoolName: '秦野曽屋', area: '平塚秦野伊勢原', department: '普通科', quota: 278, finalApplicants: 247, finalRate: 0.89 },
    { schoolName: '伊勢原', area: '平塚秦野伊勢原', department: '普通科', quota: 228, finalApplicants: 255, finalRate: 1.12 },
    { schoolName: '伊志田', area: '平塚秦野伊勢原', department: '普通科', quota: 308, finalApplicants: 331, finalRate: 1.07 },

    // --- 県西（4校） ---
    { schoolName: '小田原東', area: '県西', department: '普通科', quota: 118, finalApplicants: 67, finalRate: 0.57 },
    { schoolName: '西湘', area: '県西', department: '普通科', quota: 348, finalApplicants: 340, finalRate: 0.98 },
    { schoolName: '足柄', area: '県西', department: '普通科', quota: 238, finalApplicants: 239, finalRate: 1.0 },
    { schoolName: '山北', area: '県西', department: '普通科', quota: 198, finalApplicants: 153, finalRate: 0.77 },

    // --- 県央（13校） ---
    { schoolName: '厚木', area: '県央', department: '普通科', quota: 359, finalApplicants: 450, finalRate: 1.25 },
    { schoolName: '厚木王子', area: '県央', department: '普通科', quota: 198, finalApplicants: 214, finalRate: 1.08 },
    { schoolName: '厚木北', area: '県央', department: '普通科', quota: 238, finalApplicants: 253, finalRate: 1.06 },
    { schoolName: '厚木西', area: '県央', department: '普通科', quota: 238, finalApplicants: 204, finalRate: 0.86 },
    { schoolName: '海老名', area: '県央', department: '普通科', quota: 398, finalApplicants: 473, finalRate: 1.19 },
    { schoolName: '有馬', area: '県央', department: '普通科', quota: 318, finalApplicants: 345, finalRate: 1.08 },
    { schoolName: '愛川', area: '県央', department: '普通科', quota: 178, finalApplicants: 97, finalRate: 0.54 },
    { schoolName: '大和', area: '県央', department: '普通科', quota: 279, finalApplicants: 379, finalRate: 1.36 },
    { schoolName: '大和南', area: '県央', department: '普通科', quota: 308, finalApplicants: 307, finalRate: 1.0 },
    { schoolName: '大和西', area: '県央', department: '普通科', quota: 278, finalApplicants: 321, finalRate: 1.15 },
    { schoolName: '座間', area: '県央', department: '普通科', quota: 318, finalApplicants: 421, finalRate: 1.32 },
    { schoolName: '綾瀬', area: '県央', department: '普通科', quota: 318, finalApplicants: 324, finalRate: 1.02 },
    { schoolName: '綾瀬西', area: '県央', department: '普通科', quota: 318, finalApplicants: 288, finalRate: 0.91 },

    // --- 相模原（8校） ---
    { schoolName: '麻溝台', area: '相模原', department: '普通科', quota: 358, finalApplicants: 419, finalRate: 1.17 },
    { schoolName: '上鶴間', area: '相模原', department: '普通科', quota: 278, finalApplicants: 287, finalRate: 1.03 },
    { schoolName: '上溝', area: '相模原', department: '普通科', quota: 238, finalApplicants: 278, finalRate: 1.17 },
    { schoolName: '相模原', area: '相模原', department: '普通科', quota: 279, finalApplicants: 360, finalRate: 1.29 },
    { schoolName: '上溝南', area: '相模原', department: '普通科', quota: 358, finalApplicants: 383, finalRate: 1.07 },
    { schoolName: '橋本', area: '相模原', department: '普通科', quota: 268, finalApplicants: 314, finalRate: 1.17 },
    { schoolName: '相模田名', area: '相模原', department: '普通科', quota: 278, finalApplicants: 267, finalRate: 0.96 },
    { schoolName: '津久井', area: '相模原', department: '普通科', quota: 158, finalApplicants: 59, finalRate: 0.37 },

    // ===== 普通科（共通選抜）市立5校 =====
    { schoolName: '横浜市立桜丘', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 390, finalRate: 1.23 },
    { schoolName: '横浜市立金沢', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 413, finalRate: 1.3 },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '普通科', quota: 198, finalApplicants: 286, finalRate: 1.44 },
    { schoolName: '川崎市立高津', area: '川崎市立', department: '普通科', quota: 278, finalApplicants: 349, finalRate: 1.26 },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '普通科', quota: 118, finalApplicants: 165, finalRate: 1.4 },

    // ===== 普通科（クリエイティブスクール・4校） =====
    { schoolName: '釜利谷', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 238, finalApplicants: 113, finalRate: 0.47 },
    { schoolName: '横須賀南', area: '横須賀市', department: '普通科（クリエイティブスクール）', quota: 118, finalApplicants: 115, finalRate: 0.97 },
    { schoolName: '小田原北', area: '小田原市', department: '普通科（クリエイティブスクール）', quota: 78, finalApplicants: 73, finalRate: 0.94 },
    { schoolName: '大和東', area: '大和市', department: '普通科（クリエイティブスクール）', quota: 238, finalApplicants: 224, finalRate: 0.94 },

    // ===== 専門学科（農業・3校） =====
    { schoolName: '平塚農商', area: '平塚', department: '農業科', quota: 152, finalApplicants: 168, finalRate: 1.11 },
    { schoolName: '相原', area: '相模原', department: '農業科', quota: 114, finalApplicants: 138, finalRate: 1.21 },
    { schoolName: '中央農業', area: '海老名', department: '農業科', quota: 194, finalApplicants: 182, finalRate: 0.94 },

    // ===== 専門学科（工業・10校） =====
    { schoolName: '神奈川工業', area: '横浜市', department: '工業科', quota: 312, finalApplicants: 354, finalRate: 1.13 },
    { schoolName: '商工', area: '藤沢市', department: '工業科', quota: 118, finalApplicants: 102, finalRate: 0.86 },
    { schoolName: '磯子工業', area: '横浜市', department: '工業科', quota: 224, finalApplicants: 212, finalRate: 0.95 },
    { schoolName: '川崎工科', area: '川崎市', department: '工業科', quota: 238, finalApplicants: 248, finalRate: 1.04 },
    { schoolName: '向の岡工業', area: '川崎市', department: '工業科', quota: 234, finalApplicants: 181, finalRate: 0.77 },
    { schoolName: '横須賀工業', area: '横須賀市', department: '工業科', quota: 232, finalApplicants: 179, finalRate: 0.77 },
    { schoolName: '平塚工科', area: '平塚市', department: '工業科', quota: 238, finalApplicants: 127, finalRate: 0.53 },
    { schoolName: '藤沢工科', area: '藤沢市', department: '工業科', quota: 238, finalApplicants: 161, finalRate: 0.68 },
    { schoolName: '小田原北', area: '小田原市', department: '工業科', quota: 152, finalApplicants: 117, finalRate: 0.77 },
    { schoolName: '川崎市立川崎総合科学', area: '川崎市', department: '工業科', quota: 195, finalApplicants: 193, finalRate: 0.99 },

    // ===== 専門学科（商業・7校） =====
    { schoolName: '商工', area: '藤沢市', department: '商業科', quota: 118, finalApplicants: 106, finalRate: 0.9 },
    { schoolName: '平塚農商', area: '平塚', department: '商業科', quota: 158, finalApplicants: 164, finalRate: 1.04 },
    { schoolName: '小田原東', area: '県西', department: '商業科', quota: 118, finalApplicants: 75, finalRate: 0.64 },
    { schoolName: '相原', area: '相模原', department: '商業科', quota: 118, finalApplicants: 136, finalRate: 1.15 },
    { schoolName: '厚木王子', area: '県央', department: '商業科', quota: 158, finalApplicants: 184, finalRate: 1.16 },
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '商業科', quota: 238, finalApplicants: 274, finalRate: 1.15 },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '商業科', quota: 118, finalApplicants: 139, finalRate: 1.18 },

    // ===== 専門学科（水産・1校） =====
    { schoolName: '海洋科学', area: '横須賀市', department: '水産科', quota: 152, finalApplicants: 141, finalRate: 0.93 },

    // ===== 専門学科（家庭・1校） =====
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '家庭科', quota: 39, finalApplicants: 31, finalRate: 0.79 },

    // ===== 専門学科（福祉・4校） =====
    { schoolName: '二俣川', area: '横浜中', department: '福祉科', quota: 38, finalApplicants: 28, finalRate: 0.74 },
    { schoolName: '横須賀南', area: '横須賀市', department: '福祉科', quota: 78, finalApplicants: 48, finalRate: 0.62 },
    { schoolName: '津久井', area: '相模原', department: '福祉科', quota: 38, finalApplicants: 15, finalRate: 0.39 },
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '福祉科', quota: 39, finalApplicants: 37, finalRate: 0.95 },

    // ===== 専門学科（理数・1校） =====
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '理数科', quota: 39, finalApplicants: 53, finalRate: 1.36 },

    // ===== 専門学科（体育・2校） =====
    { schoolName: '厚木北', area: '県央', department: '体育科', quota: 38, finalApplicants: 46, finalRate: 1.21 },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '体育科', quota: 39, finalApplicants: 49, finalRate: 1.26 },

    // ===== 専門学科（美術・2校） =====
    { schoolName: '白山', area: '横浜北', department: '美術科', quota: 38, finalApplicants: 35, finalRate: 0.92 },
    { schoolName: '上矢部', area: '横浜中', department: '美術科', quota: 38, finalApplicants: 47, finalRate: 1.24 },

    // ===== 専門学科（国際・2校） =====
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '国際科', quota: 35, finalApplicants: 52, finalRate: 1.49 },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '国際科', quota: 39, finalApplicants: 50, finalRate: 1.28 },

    // ===== 単位制 普通科（16校。神奈川総合は2コース・横浜市立戸塚は一般コースのみここに含む） =====
    { schoolName: '神奈川総合', area: '横浜市', department: '普通科（単位制）', quota: 208, finalApplicants: 320, finalRate: 1.54 },
    { schoolName: '横浜緑園', area: '横浜市', department: '普通科（単位制）', quota: 278, finalApplicants: 262, finalRate: 0.94 },
    { schoolName: '横浜桜陽', area: '横浜市', department: '普通科（単位制）', quota: 270, finalApplicants: 191, finalRate: 0.71 },
    { schoolName: '横浜清陵', area: '横浜市', department: '普通科（単位制）', quota: 305, finalApplicants: 332, finalRate: 1.09 },
    { schoolName: '横浜栄', area: '横浜市', department: '普通科（単位制）', quota: 318, finalApplicants: 382, finalRate: 1.2 },
    { schoolName: '川崎', area: '川崎市', department: '普通科（単位制）', quota: 222, finalApplicants: 284, finalRate: 1.28 },
    { schoolName: '大師', area: '川崎市', department: '普通科（単位制）', quota: 225, finalApplicants: 150, finalRate: 0.67 },
    { schoolName: '三浦初声', area: '三浦市', department: '普通科（単位制）', quota: 198, finalApplicants: 86, finalRate: 0.43 },
    { schoolName: '藤沢清流', area: '藤沢市', department: '普通科（単位制）', quota: 278, finalApplicants: 303, finalRate: 1.09 },
    { schoolName: '平塚湘風', area: '平塚市', department: '普通科（単位制）', quota: 238, finalApplicants: 170, finalRate: 0.71 },
    { schoolName: '小田原', area: '小田原市', department: '普通科（単位制）', quota: 319, finalApplicants: 371, finalRate: 1.16 },
    { schoolName: '厚木清南', area: '県央', department: '普通科（単位制）', quota: 230, finalApplicants: 234, finalRate: 1.02 },
    { schoolName: '相模原城山', area: '相模原', department: '普通科（単位制）', quota: 278, finalApplicants: 263, finalRate: 0.95 },
    { schoolName: '相模原弥栄', area: '相模原', department: '普通科（単位制）', quota: 183, finalApplicants: 191, finalRate: 1.04 },
    { schoolName: '横浜市立東', area: '横浜市立', department: '普通科（単位制）', quota: 268, finalApplicants: 324, finalRate: 1.21 },
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・一般コース）', quota: 279, finalApplicants: 341, finalRate: 1.22 },

    // ===== 単位制 普通科専門コース（1校） =====
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・音楽コース）', quota: 39, finalApplicants: 46, finalRate: 1.18 },

    // ===== 単位制 総合学科（クリエイティブ除く・7校） =====
    { schoolName: '鶴見総合', area: '横浜市', department: '総合学科（単位制）', quota: 259, finalApplicants: 302, finalRate: 1.17 },
    { schoolName: '金沢総合', area: '横浜市', department: '総合学科（単位制）', quota: 278, finalApplicants: 316, finalRate: 1.14 },
    { schoolName: '藤沢総合', area: '藤沢市', department: '総合学科（単位制）', quota: 268, finalApplicants: 320, finalRate: 1.19 },
    { schoolName: '秦野総合', area: '秦野市', department: '総合学科（単位制）', quota: 238, finalApplicants: 198, finalRate: 0.83 },
    { schoolName: '座間総合', area: '座間市', department: '総合学科（単位制）', quota: 264, finalApplicants: 261, finalRate: 0.99 },
    { schoolName: '横浜市立みなと総合', area: '横浜市立', department: '総合学科（単位制）', quota: 232, finalApplicants: 250, finalRate: 1.08 },
    { schoolName: '横須賀市立横須賀総合', area: '横須賀市立', department: '総合学科（単位制）', quota: 320, finalApplicants: 364, finalRate: 1.14 },

    // ===== 単位制 総合学科クリエイティブスクール（1校） =====
    { schoolName: '青葉総合', area: '横浜市', department: '総合学科（単位制・クリエイティブスクール）', quota: 158, finalApplicants: 143, finalRate: 0.91 },

    // ===== 単位制 専門学科（農業・2校） =====
    { schoolName: '三浦初声', area: '三浦市', department: '農業科（単位制）', quota: 38, finalApplicants: 26, finalRate: 0.68 },
    { schoolName: '吉田島', area: '開成町', department: '農業科（単位制）', quota: 114, finalApplicants: 79, finalRate: 0.69 },

    // ===== 単位制 専門学科（家庭・1校） =====
    { schoolName: '吉田島', area: '開成町', department: '家庭科（単位制）', quota: 38, finalApplicants: 34, finalRate: 0.89 },

    // ===== 単位制 専門学科（理数・1校） =====
    { schoolName: '横浜サイエンスフロンティア', area: '横浜市立', department: '理数科（単位制）', quota: 158, finalApplicants: 255, finalRate: 1.61 },

    // ===== 単位制 専門学科（体育・1校） =====
    { schoolName: '相模原弥栄', area: '相模原', department: '体育科（単位制）', quota: 78, finalApplicants: 85, finalRate: 1.09 },

    // ===== 単位制 専門学科（音楽・1校） =====
    { schoolName: '相模原弥栄', area: '相模原', department: '音楽科（単位制）', quota: 38, finalApplicants: 45, finalRate: 1.18 },

    // ===== 単位制 専門学科（美術・1校） =====
    { schoolName: '相模原弥栄', area: '相模原', department: '美術科（単位制）', quota: 38, finalApplicants: 55, finalRate: 1.45 },

    // ===== 単位制 専門学科（国際関係・1校） =====
    { schoolName: '横浜国際', area: '横浜市', department: '国際科（単位制）', quota: 159, finalApplicants: 190, finalRate: 1.19 },

    // ===== 単位制 専門学科（総合産業・1校） =====
    { schoolName: '神奈川総合産業', area: '横浜市', department: '総合産業科（単位制）', quota: 238, finalApplicants: 218, finalRate: 0.92 },

    // ===== 単位制 専門学科（舞台芸術・1校） =====
    { schoolName: '神奈川総合', area: '横浜市', department: '舞台芸術科（単位制）', quota: 30, finalApplicants: 37, finalRate: 1.23 },

    // ===== 連携募集（2校・既存校への追加募集枠。志願変更を行わないため1/30の値=最終値） =====
    { schoolName: '光陵', area: '横浜中', department: '普通科（連携募集）', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '愛川', area: '県央', department: '普通科（連携募集）', quota: 45, finalApplicants: 31, finalRate: 0.69 },
  ],
};
