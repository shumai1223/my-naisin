/**
 * 香川県 公立高等学校 倍率パイプラインα（Y-6・18県目・全日制完全達成／掛-1・R7多年度追加済み）。
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
 *
 * ⚠️掛-1（学校別×多年度）R7追加: 令和7年度版「一般選抜出願者数（全日制課程小学科・コース別）」
 * （2月26日12:00・一般選抜志願変更締切後・全1ページ）を取得。R8と同一の`documents/15096/`配下
 * だが`syutugan7-5.pdf`は直接URLが既に404（HTMLエラーページ）で、curl経由のWayback CDX API
 * （`http://web.archive.org/cdx/search/cdx?url=pref.kagawa.lg.jp/documents/15096/*`）で発見した
 * アーカイブ版（`https://web.archive.org/web/<timestamp>if_/<元URL>`）から直接ダウンロードして
 * 取得した（2026-08-07にloop-question-noteで判明したWayback活用技法の初適用例）。R8と同様pdftotext
 * ではCJKラベルが抽出できずpdftoppm 300dpiビジョン解析で68レコード（30校）を転記。全30校が単一
 * ページに収まる構成でR8の「学校名の行折返し遅延」トラップも今回は発生しなかった。ページ末尾
 * 「全日制合計」行（quota4,376・applicants4,732・倍率1.08）とnode.js機械集計が完全一致。学校・
 * 学科構成はR8と完全一致（学校再編なし・くくり募集3組=三本松/農業経営/観音寺第一も同一）。
 *
 * ⚠️掛-1（学校別×多年度）R6追加: 令和6年度版「一般選抜出願者数（全日制課程小学科・コース別）」
 * （2月22日12:00・一般選抜志願変更締切後）を取得。R7と同じ`documents/15096/`配下だが
 * `syutugan6-5.pdf`は直接URLが既に404で、R7と同様Wayback CDX API
 * （`http://web.archive.org/cdx/search/cdx?url=pref.kagawa.lg.jp/documents/15096/syutugan6*`）
 * で発見したアーカイブ版（2024-06-29クロール）から取得した。**このPDFはpdftoppm（MiKTeXバンドル
 * のpoppler、poppler-data未搭載）でレンダリングすると罫線のみでCJKグリフも数字も一切表示されない
 * 完全な空白ページになる**という新しい罠に遭遇した（Adobe-Japan1 CMap欠落によるテキスト抽出
 * 失敗＝pdftotextのSyntax Errorとは別に、ラスタライズ自体が失敗する重症ケース）。Python環境に
 * PyMuPDF（fitz）がインストール済みだったため`page.get_pixmap(dpi=300)`で代替レンダリングした
 * ところ全文字が正常に表示され解決した（MuPDFは内蔵CJKフォールバックフォントを持つため
 * poppler-dataに依存しない）。**教訓: pdftoppmが罫線だけの空白画像を返した場合はCMap欠落を疑い、
 * PyMuPDFへ切り替える**。68レコード（30校）を転記、ページ末尾「全日制合計」行
 * （quota4,553・applicants5,056・倍率1.11）とnode.js機械集計が完全一致（誤差ゼロ・初回転記で
 * 一致）。高松北の☆印（除外対象の高松北中学校からの入学予定者数）はR7が70人・R6は96人と
 * 年度によって異なる値だったが、どちらも入学定員の差引後の値（quota）に既に反映済みのため
 * 追加調整は不要（表記の違いは実在の年度変動であり誤記ではない）。学校・学科構成はR7と完全一致
 * （68/68キー一致・学校再編なし・くくり募集3組=三本松/農業経営/観音寺第一も同一）。ページ2以降は
 * 「全国からの生徒募集」枠（別選抜区分）と定時制課程の表のみでR7/R8と同じ理由でスコープ外。
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
    {
      url: 'https://www.pref.kagawa.lg.jp/documents/15096/syutugan7-5.pdf',
      docTitle: '香川県教育委員会 令和7年度香川県公立高等学校一般選抜出願者数（全日制課程小学科・コース別）（一般選抜志願変更締切後）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
    {
      url: 'https://www.pref.kagawa.lg.jp/documents/15096/syutugan6-5.pdf',
      docTitle: '香川県教育委員会 令和6年度香川県公立高等学校一般選抜出願者数（全日制課程小学科・コース別）（一般選抜志願変更締切後）※2026-08-09時点で県公式サイトからは404のため、Wayback Machine(20240629144739)経由で取得',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-09',
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
    { schoolName: '小豆島中央', department: '特進コース', quota: 30, finalApplicants: 43, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小豆島中央', department: '普通コース', quota: 128, finalApplicants: 106, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三本松', department: '普通・理数（くくり募集）', quota: 86, finalApplicants: 78, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石田', department: '生産経済', quota: 15, finalApplicants: 14, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石田', department: '園芸デザイン', quota: 15, finalApplicants: 11, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石田', department: '農業土木', quota: 17, finalApplicants: 8, finalRate: 0.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石田', department: '生活デザイン', quota: 15, finalApplicants: 8, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '志度', department: '電子機械', quota: 15, finalApplicants: 19, finalRate: 1.27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '志度', department: '情報科学', quota: 15, finalApplicants: 21, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '志度', department: '商業', quota: 15, finalApplicants: 13, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津田', department: '普通', quota: 61, finalApplicants: 65, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三木', department: '文理', quota: 56, finalApplicants: 49, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三木', department: '総合', quota: 52, finalApplicants: 54, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松', department: '普通', quota: 280, finalApplicants: 309, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松工芸', department: '機械', quota: 24, finalApplicants: 31, finalRate: 1.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松工芸', department: '電気', quota: 21, finalApplicants: 24, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松工芸', department: '工業化学', quota: 24, finalApplicants: 29, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松工芸', department: '建築', quota: 21, finalApplicants: 21, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松工芸', department: 'デザイン', quota: 15, finalApplicants: 22, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松工芸', department: '工芸', quota: 42, finalApplicants: 42, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松工芸', department: '美術', quota: 12, finalApplicants: 16, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松商業', department: '商業', quota: 133, finalApplicants: 169, finalRate: 1.27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松商業', department: '情報数理', quota: 16, finalApplicants: 17, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松商業', department: '英語実務', quota: 20, finalApplicants: 30, finalRate: 1.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松東', department: '普通', quota: 175, finalApplicants: 212, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松南', department: '普通', quota: 109, finalApplicants: 148, finalRate: 1.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松南', department: '環境科学', quota: 24, finalApplicants: 35, finalRate: 1.46, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松南', department: '生活デザイン', quota: 24, finalApplicants: 41, finalRate: 1.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松南', department: '看護', quota: 21, finalApplicants: 22, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松南', department: '福祉', quota: 21, finalApplicants: 31, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松西', department: '普通', quota: 238, finalApplicants: 226, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松北', department: '普通', quota: 91, finalApplicants: 76, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '香川中央', department: '普通', quota: 210, finalApplicants: 246, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松桜井', department: '普通', quota: 280, finalApplicants: 324, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農業経営', department: '農業生産・環境園芸・動物科学・食農科学（くくり募集）', quota: 70, finalApplicants: 77, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出商業', department: '商業', quota: 79, finalApplicants: 66, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出商業', department: '情報技術', quota: 15, finalApplicants: 22, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出', department: '普通', quota: 217, finalApplicants: 230, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出', department: '音楽', quota: 10, finalApplicants: 12, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出工業', department: '機械', quota: 15, finalApplicants: 15, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出工業', department: '電気', quota: 15, finalApplicants: 15, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出工業', department: '化学工学', quota: 22, finalApplicants: 15, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂出工業', department: '建築', quota: 15, finalApplicants: 20, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '丸亀', department: '普通', quota: 280, finalApplicants: 311, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '飯山', department: '看護', quota: 24, finalApplicants: 13, finalRate: 0.54, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '飯山', department: '総合', quota: 70, finalApplicants: 79, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '丸亀城西', department: '普通', quota: 136, finalApplicants: 143, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '善通寺第一', department: '普通', quota: 106, finalApplicants: 136, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '善通寺第一', department: 'デザイン', quota: 19, finalApplicants: 18, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '琴平', department: '普通', quota: 126, finalApplicants: 151, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多度津', department: '機械', quota: 19, finalApplicants: 16, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多度津', department: '電気', quota: 19, finalApplicants: 16, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多度津', department: '土木', quota: 19, finalApplicants: 16, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多度津', department: '建築', quota: 19, finalApplicants: 21, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多度津', department: '海洋技術', quota: 16, finalApplicants: 18, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多度津', department: '海洋生産', quota: 16, finalApplicants: 23, finalRate: 1.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笠田', department: '農産科学', quota: 19, finalApplicants: 17, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笠田', department: '植物科学', quota: 20, finalApplicants: 14, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笠田', department: '食品科学', quota: 19, finalApplicants: 11, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '笠田', department: '生活デザイン', quota: 19, finalApplicants: 17, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高瀬', department: '普通', quota: 76, finalApplicants: 72, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '観音寺第一', department: '普通・理数（くくり募集）', quota: 194, finalApplicants: 181, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '観音寺総合', department: '機械', quota: 17, finalApplicants: 17, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '観音寺総合', department: '電気', quota: 17, finalApplicants: 14, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '観音寺総合', department: '電子', quota: 17, finalApplicants: 11, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '観音寺総合', department: '総合', quota: 79, finalApplicants: 98, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松第一', department: '普通', quota: 240, finalApplicants: 271, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高松第一', department: '音楽', quota: 11, finalApplicants: 16, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小豆島中央', department: '特進コース', quota: 30, finalApplicants: 31, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小豆島中央', department: '普通コース', quota: 124, finalApplicants: 102, finalRate: 0.82, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三本松', department: '普通・理数（くくり募集）', quota: 96, finalApplicants: 95, finalRate: 0.99, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石田', department: '生産経済', quota: 18, finalApplicants: 17, finalRate: 0.94, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石田', department: '園芸デザイン', quota: 18, finalApplicants: 18, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石田', department: '農業土木', quota: 19, finalApplicants: 18, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石田', department: '生活デザイン', quota: 15, finalApplicants: 12, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '志度', department: '電子機械', quota: 18, finalApplicants: 17, finalRate: 0.94, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '志度', department: '情報科学', quota: 18, finalApplicants: 15, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '志度', department: '商業', quota: 15, finalApplicants: 17, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '津田', department: '普通', quota: 72, finalApplicants: 55, finalRate: 0.76, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三木', department: '文理', quota: 56, finalApplicants: 35, finalRate: 0.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三木', department: '総合', quota: 52, finalApplicants: 58, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松', department: '普通', quota: 280, finalApplicants: 296, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松工芸', department: '機械', quota: 24, finalApplicants: 39, finalRate: 1.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松工芸', department: '電気', quota: 24, finalApplicants: 40, finalRate: 1.67, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松工芸', department: '工業化学', quota: 24, finalApplicants: 23, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松工芸', department: '建築', quota: 24, finalApplicants: 30, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松工芸', department: 'デザイン', quota: 15, finalApplicants: 27, finalRate: 1.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松工芸', department: '工芸', quota: 49, finalApplicants: 55, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松工芸', department: '美術', quota: 12, finalApplicants: 12, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松商業', department: '商業', quota: 133, finalApplicants: 189, finalRate: 1.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松商業', department: '情報数理', quota: 16, finalApplicants: 25, finalRate: 1.56, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松商業', department: '英語実務', quota: 24, finalApplicants: 23, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松東', department: '普通', quota: 187, finalApplicants: 261, finalRate: 1.4, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松南', department: '普通', quota: 109, finalApplicants: 131, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松南', department: '環境科学', quota: 24, finalApplicants: 18, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松南', department: '生活デザイン', quota: 24, finalApplicants: 40, finalRate: 1.67, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松南', department: '看護', quota: 24, finalApplicants: 28, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松南', department: '福祉', quota: 21, finalApplicants: 20, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松西', department: '普通', quota: 238, finalApplicants: 307, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松北', department: '普通', quota: 82, finalApplicants: 109, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '香川中央', department: '普通', quota: 210, finalApplicants: 260, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松桜井', department: '普通', quota: 280, finalApplicants: 325, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '農業経営', department: '農業生産・環境園芸・動物科学・食農科学（くくり募集）', quota: 82, finalApplicants: 56, finalRate: 0.68, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出商業', department: '商業', quota: 79, finalApplicants: 88, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出商業', department: '情報技術', quota: 17, finalApplicants: 25, finalRate: 1.47, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出', department: '普通', quota: 217, finalApplicants: 246, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出', department: '音楽', quota: 10, finalApplicants: 2, finalRate: 0.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出工業', department: '機械', quota: 15, finalApplicants: 20, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出工業', department: '電気', quota: 15, finalApplicants: 6, finalRate: 0.4, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出工業', department: '化学工学', quota: 19, finalApplicants: 12, finalRate: 0.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂出工業', department: '建築', quota: 15, finalApplicants: 17, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '丸亀', department: '普通', quota: 280, finalApplicants: 284, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '飯山', department: '看護', quota: 24, finalApplicants: 22, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '飯山', department: '総合', quota: 81, finalApplicants: 90, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '丸亀城西', department: '普通', quota: 136, finalApplicants: 176, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '善通寺第一', department: '普通', quota: 156, finalApplicants: 160, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '善通寺第一', department: 'デザイン', quota: 19, finalApplicants: 32, finalRate: 1.68, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '琴平', department: '普通', quota: 126, finalApplicants: 126, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多度津', department: '機械', quota: 19, finalApplicants: 25, finalRate: 1.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多度津', department: '電気', quota: 20, finalApplicants: 18, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多度津', department: '土木', quota: 19, finalApplicants: 11, finalRate: 0.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多度津', department: '建築', quota: 19, finalApplicants: 22, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多度津', department: '海洋技術', quota: 16, finalApplicants: 20, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多度津', department: '海洋生産', quota: 16, finalApplicants: 31, finalRate: 1.94, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '笠田', department: '農産科学', quota: 21, finalApplicants: 25, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '笠田', department: '植物科学', quota: 21, finalApplicants: 21, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '笠田', department: '食品科学', quota: 21, finalApplicants: 27, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '笠田', department: '生活デザイン', quota: 21, finalApplicants: 23, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高瀬', department: '普通', quota: 93, finalApplicants: 101, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '観音寺第一', department: '普通・理数（くくり募集）', quota: 203, finalApplicants: 209, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '観音寺総合', department: '機械', quota: 18, finalApplicants: 16, finalRate: 0.89, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '観音寺総合', department: '電気', quota: 18, finalApplicants: 22, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '観音寺総合', department: '電子', quota: 21, finalApplicants: 16, finalRate: 0.76, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '観音寺総合', department: '総合', quota: 89, finalApplicants: 90, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松第一', department: '普通', quota: 240, finalApplicants: 261, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高松第一', department: '音楽', quota: 12, finalApplicants: 8, finalRate: 0.67, fiscalYear: '令和6年度（2024年度）' },
  ],
};
