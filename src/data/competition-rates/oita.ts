/**
 * 大分県 公立高等学校 倍率パイプラインα（Y-6・21県目・全日制完全達成）。
 *
 * 一次ソース: 大分県教育委員会「令和8年度大分県立高等学校第一次入学者選抜第一志願最終志願状況」
 * （2月27日公表・全4ページ）。
 *
 * ⚠️大分県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重・富山・石川・福井・愛媛・徳島・香川・佐賀・長崎と
 * 同型の高信頼度技法）。列は[入学定員 / 募集人員（＝本ファイルのquota） / 当初志願者数 / 志願変更
 * 取り下げ数(－) / 志願変更提出数(＋) / 最終志願者数（＝applicants）]。他県と異なり倍率が印字
 * されないため、finalRate=applicants/quota（小数第2位に四捨五入）を自前で算出した。
 *
 * ⚠️罠（全国募集内数注記によるレイアウト崩れ）: 「うち全国募集は◯人程度」という注記が複数の学校の
 * 数値行の間に挿入され、pdftotextの列抽出が見かけ上崩れる（中津南耶馬溪校・安心院・国東・久住高原
 * 農業・日田林工など）。各校末尾の「計」行との照合（内訳合計＝学校計）で正しい学科別数値を確定した。
 *
 * ⚠️くくり募集2組: 大分舞鶴の普通・理数（理数科の数値行が独立して存在せず、普通科の数値行に完全に
 * 統合済み）、大分東の園芸ビジネス・園芸デザイン（同様に園芸デザインの数値行が独立して存在しない）。
 *
 * 機械集計（quota5,806・applicants5,969、39校81レコード）が「県立高校全日制課程合計」行と完全
 * 一致した（初回転記で一致・再修正なし）。定時制課程は他県と同じ理由でスコープ外。
 *
 * ⚠️掛-1（R7追加時の年度差）: R7一次資料は「令和7年度大分県立高等学校第一次入学者選抜第一志願
 * 最終志願状況」（2月28日公表・全4頁・pref.oita.jp/uploaded/attachment/2234489.pdf）。R7も
 * テキスト埋め込み型だが日本語ToUnicodeマッピングが欠落しておりpdftotextでは数値のみ抽出でき
 * 学校名・学科名が読めなかったため、pdftoppm 300dpiビジョン解析で全4頁を転記した。機械集計
 * （quota5,666・applicants5,783、39校82レコード）が「県立高校全日制課程合計」行と初回転記から
 * 完全一致した。学校名のキー集合はR8と完全一致（統廃合なし）。**大分東の学科構成がR7とR8で異なる**:
 * R7のPDFは普通・園芸ビジネス・園芸デザインの3学科すべてに独立した数値が印字されておりくくり
 * 募集の様子は無かった（計108/69が3学科の単純合算と一致）。R8はこのうち園芸ビジネス・園芸デザイン
 * のみが「くくり募集」として1レコードに統合されている（R8ファイルのコメント参照）。転記ミスでは
 * なく、両年度で実際に公表PDFのレイアウトが異なっていたため、R7はPDF記載どおり3学科を独立
 * レコードとして記録した（そのためR7は39校82レコードとR8の39校81レコードよりレコード数が1件
 * 多い）。大分舞鶴の普通・理数はR7もR8と同じくくり募集（理数科の数値行が独立せず普通科に統合済み）
 * だった。芸術緑丘の美術科はR7時点でquota0（募集なし）のため、他県のquota=0除外ルールと同じく
 * 収録対象外とした。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const OITA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'oita',
  sources: [
    {
      url: 'https://www.pref.oita.jp/uploaded/attachment/2261572.pdf',
      docTitle: '大分県教育委員会 令和8年度大分県立高等学校第一次入学者選抜第一志願最終志願状況',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.pref.oita.jp/uploaded/attachment/2234489.pdf',
      docTitle: '大分県教育委員会 令和7年度大分県立高等学校第一次入学者選抜第一志願最終志願状況',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-08',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（39校81レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '「県立高校全日制課程合計」行（quota5,806・applicants5,969）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 39, quota: 5806, finalApplicants: 5969, finalRate: 1.03 }],
  records: [
    { schoolName: '中津南', department: '普通', quota: 175, finalApplicants: 192, finalRate: 1.1 },
    { schoolName: '中津南耶馬溪校', department: '環境・社会共生', quota: 30, finalApplicants: 23, finalRate: 0.77 },
    { schoolName: '中津北', department: '普通', quota: 155, finalApplicants: 156, finalRate: 1.01 },
    { schoolName: '中津東', department: '機械', quota: 34, finalApplicants: 36, finalRate: 1.06 },
    { schoolName: '中津東', department: '電気', quota: 31, finalApplicants: 36, finalRate: 1.16 },
    { schoolName: '中津東', department: '土木', quota: 35, finalApplicants: 42, finalRate: 1.2 },
    { schoolName: '中津東', department: '生産システム', quota: 27, finalApplicants: 30, finalRate: 1.11 },
    { schoolName: '中津東', department: 'ビジネス会計', quota: 35, finalApplicants: 26, finalRate: 0.74 },
    { schoolName: '中津東', department: 'ビジネス情報', quota: 32, finalApplicants: 35, finalRate: 1.09 },
    { schoolName: '宇佐', department: '普通', quota: 127, finalApplicants: 132, finalRate: 1.04 },
    { schoolName: '宇佐産業科学', department: 'グリーン環境', quota: 30, finalApplicants: 26, finalRate: 0.87 },
    { schoolName: '宇佐産業科学', department: '電子機械', quota: 34, finalApplicants: 21, finalRate: 0.62 },
    { schoolName: '宇佐産業科学', department: 'ビジネス管理', quota: 30, finalApplicants: 28, finalRate: 0.93 },
    { schoolName: '宇佐産業科学', department: '生活デザイン', quota: 28, finalApplicants: 23, finalRate: 0.82 },
    { schoolName: '安心院', department: '普通', quota: 44, finalApplicants: 14, finalRate: 0.32 },
    { schoolName: '高田', department: '普通', quota: 120, finalApplicants: 115, finalRate: 0.96 },
    { schoolName: '国東', department: '普通', quota: 79, finalApplicants: 65, finalRate: 0.82 },
    { schoolName: '国東', department: '園芸ビジネス', quota: 27, finalApplicants: 7, finalRate: 0.26 },
    { schoolName: '国東', department: '環境土木', quota: 26, finalApplicants: 5, finalRate: 0.19 },
    { schoolName: '国東', department: '電子工業', quota: 32, finalApplicants: 24, finalRate: 0.75 },
    { schoolName: '杵築', department: '普通', quota: 175, finalApplicants: 158, finalRate: 0.9 },
    { schoolName: '日出総合', department: '農業経営', quota: 34, finalApplicants: 5, finalRate: 0.15 },
    { schoolName: '日出総合', department: '機械電子', quota: 32, finalApplicants: 23, finalRate: 0.72 },
    { schoolName: '日出総合', department: '総合学科', quota: 63, finalApplicants: 46, finalRate: 0.73 },
    { schoolName: '別府鶴見丘', department: '普通', quota: 216, finalApplicants: 282, finalRate: 1.31 },
    { schoolName: '別府翔青', department: 'クロスアカデミア', quota: 70, finalApplicants: 80, finalRate: 1.14 },
    { schoolName: '別府翔青', department: 'グローバルコミュニケーション', quota: 11, finalApplicants: 10, finalRate: 0.91 },
    { schoolName: '別府翔青', department: 'ビジネスイノベーション', quota: 98, finalApplicants: 147, finalRate: 1.5 },
    { schoolName: '大分上野丘', department: '普通', quota: 300, finalApplicants: 398, finalRate: 1.33 },
    { schoolName: '大分舞鶴', department: '普通・理数（くくり募集）', quota: 264, finalApplicants: 376, finalRate: 1.42 },
    { schoolName: '大分雄城台', department: '普通', quota: 210, finalApplicants: 278, finalRate: 1.32 },
    { schoolName: '大分南', department: '普通', quota: 93, finalApplicants: 119, finalRate: 1.28 },
    { schoolName: '大分南', department: '福祉', quota: 66, finalApplicants: 58, finalRate: 0.88 },
    { schoolName: '大分豊府', department: '普通', quota: 108, finalApplicants: 152, finalRate: 1.41 },
    { schoolName: '大分工業', department: '機械', quota: 70, finalApplicants: 70, finalRate: 1 },
    { schoolName: '大分工業', department: '電気', quota: 38, finalApplicants: 51, finalRate: 1.34 },
    { schoolName: '大分工業', department: '電子', quota: 79, finalApplicants: 70, finalRate: 0.89 },
    { schoolName: '大分工業', department: '建築', quota: 33, finalApplicants: 40, finalRate: 1.21 },
    { schoolName: '大分工業', department: '土木', quota: 65, finalApplicants: 79, finalRate: 1.22 },
    { schoolName: '大分工業', department: '工業化学', quota: 37, finalApplicants: 30, finalRate: 0.81 },
    { schoolName: '大分商業', department: '商業', quota: 95, finalApplicants: 124, finalRate: 1.31 },
    { schoolName: '大分商業', department: '国際経済', quota: 38, finalApplicants: 41, finalRate: 1.08 },
    { schoolName: '大分商業', department: '情報処理', quota: 67, finalApplicants: 75, finalRate: 1.12 },
    { schoolName: '芸術緑丘', department: '音楽', quota: 14, finalApplicants: 0, finalRate: 0 },
    { schoolName: '大分西', department: '総合学科', quota: 210, finalApplicants: 245, finalRate: 1.17 },
    { schoolName: '大分鶴崎', department: '普通', quota: 238, finalApplicants: 291, finalRate: 1.22 },
    { schoolName: '鶴崎工業', department: '機械', quota: 73, finalApplicants: 79, finalRate: 1.08 },
    { schoolName: '鶴崎工業', department: '電気', quota: 68, finalApplicants: 82, finalRate: 1.21 },
    { schoolName: '鶴崎工業', department: '建築', quota: 34, finalApplicants: 44, finalRate: 1.29 },
    { schoolName: '鶴崎工業', department: '化学工学', quota: 32, finalApplicants: 44, finalRate: 1.38 },
    { schoolName: '鶴崎工業', department: '産業デザイン', quota: 37, finalApplicants: 42, finalRate: 1.14 },
    { schoolName: '情報科学', department: 'ＡＩテクノロジー', quota: 34, finalApplicants: 44, finalRate: 1.29 },
    { schoolName: '情報科学', department: 'ビジネスソリューション', quota: 69, finalApplicants: 69, finalRate: 1 },
    { schoolName: '情報科学', department: 'デジタル創造', quota: 69, finalApplicants: 84, finalRate: 1.22 },
    { schoolName: '大分東', department: '普通', quota: 59, finalApplicants: 22, finalRate: 0.37 },
    { schoolName: '大分東', department: '園芸ビジネス・園芸デザイン（くくり募集）', quota: 60, finalApplicants: 40, finalRate: 0.67 },
    { schoolName: '由布', department: '普通', quota: 62, finalApplicants: 26, finalRate: 0.42 },
    { schoolName: '臼杵', department: '普通', quota: 159, finalApplicants: 150, finalRate: 0.94 },
    { schoolName: '海洋科学', department: '海洋', quota: 35, finalApplicants: 17, finalRate: 0.49 },
    { schoolName: '津久見', department: '普通', quota: 29, finalApplicants: 8, finalRate: 0.28 },
    { schoolName: '津久見', department: '生産機械', quota: 24, finalApplicants: 20, finalRate: 0.83 },
    { schoolName: '津久見', department: '電気電子', quota: 23, finalApplicants: 20, finalRate: 0.87 },
    { schoolName: '津久見', department: '地域みらいビジネス', quota: 52, finalApplicants: 42, finalRate: 0.81 },
    { schoolName: '佐伯鶴城', department: '普通', quota: 148, finalApplicants: 135, finalRate: 0.91 },
    { schoolName: '佐伯豊南', department: '食農ビジネス', quota: 28, finalApplicants: 26, finalRate: 0.93 },
    { schoolName: '佐伯豊南', department: '工業技術', quota: 24, finalApplicants: 25, finalRate: 1.04 },
    { schoolName: '佐伯豊南', department: '福祉', quota: 29, finalApplicants: 4, finalRate: 0.14 },
    { schoolName: '佐伯豊南', department: '総合学科', quota: 59, finalApplicants: 37, finalRate: 0.63 },
    { schoolName: '三重総合', department: '普通', quota: 56, finalApplicants: 17, finalRate: 0.3 },
    { schoolName: '三重総合', department: '生物環境', quota: 33, finalApplicants: 28, finalRate: 0.85 },
    { schoolName: '三重総合', department: 'メディア科学', quota: 34, finalApplicants: 30, finalRate: 0.88 },
    { schoolName: '竹田', department: '普通', quota: 107, finalApplicants: 78, finalRate: 0.73 },
    { schoolName: '久住高原農業', department: '農業', quota: 20, finalApplicants: 19, finalRate: 0.95 },
    { schoolName: '玖珠美山', department: '普通', quota: 80, finalApplicants: 68, finalRate: 0.85 },
    { schoolName: '玖珠美山', department: '地域産業', quota: 28, finalApplicants: 25, finalRate: 0.89 },
    { schoolName: '日田', department: '普通', quota: 180, finalApplicants: 189, finalRate: 1.05 },
    { schoolName: '日田三隈', department: '総合学科', quota: 100, finalApplicants: 74, finalRate: 0.74 },
    { schoolName: '日田林工', department: '林業', quota: 22, finalApplicants: 20, finalRate: 0.91 },
    { schoolName: '日田林工', department: '機械', quota: 27, finalApplicants: 31, finalRate: 1.15 },
    { schoolName: '日田林工', department: '電気', quota: 27, finalApplicants: 19, finalRate: 0.7 },
    { schoolName: '日田林工', department: '建築土木', quota: 30, finalApplicants: 27, finalRate: 0.9 },
    { schoolName: '中津南', department: '普通', quota: 180, finalApplicants: 189, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津南耶馬溪校', department: '普通', quota: 29, finalApplicants: 11, finalRate: 0.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津北', department: '普通', quota: 150, finalApplicants: 168, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津東', department: '機械', quota: 32, finalApplicants: 28, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津東', department: '電気', quota: 32, finalApplicants: 32, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津東', department: '土木', quota: 32, finalApplicants: 35, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津東', department: '生産システム', quota: 28, finalApplicants: 29, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津東', department: 'ビジネス会計', quota: 33, finalApplicants: 29, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中津東', department: 'ビジネス情報', quota: 32, finalApplicants: 34, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '宇佐', department: '普通', quota: 126, finalApplicants: 124, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '宇佐産業科学', department: 'グリーン環境', quota: 31, finalApplicants: 20, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '宇佐産業科学', department: '電子機械', quota: 32, finalApplicants: 22, finalRate: 0.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '宇佐産業科学', department: 'ビジネス管理', quota: 30, finalApplicants: 12, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '宇佐産業科学', department: '生活デザイン', quota: 29, finalApplicants: 23, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '安心院', department: '普通', quota: 35, finalApplicants: 31, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高田', department: '普通', quota: 126, finalApplicants: 105, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国東', department: '普通', quota: 87, finalApplicants: 57, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国東', department: '園芸ビジネス', quota: 27, finalApplicants: 8, finalRate: 0.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国東', department: '環境土木', quota: 26, finalApplicants: 16, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国東', department: '電子工業', quota: 33, finalApplicants: 26, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杵築', department: '普通', quota: 176, finalApplicants: 161, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日出総合', department: '農業経営', quota: 32, finalApplicants: 8, finalRate: 0.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日出総合', department: '機械電子', quota: 30, finalApplicants: 15, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日出総合', department: '総合学科', quota: 64, finalApplicants: 41, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '別府鶴見丘', department: '普通', quota: 216, finalApplicants: 254, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '別府翔青', department: '普通', quota: 68, finalApplicants: 73, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '別府翔青', department: 'グローバルコミュニケーション', quota: 11, finalApplicants: 8, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '別府翔青', department: '商業', quota: 84, finalApplicants: 128, finalRate: 1.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分上野丘', department: '普通', quota: 301, finalApplicants: 365, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分舞鶴', department: '普通・理数（くくり募集）', quota: 264, finalApplicants: 336, finalRate: 1.27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分雄城台', department: '普通', quota: 209, finalApplicants: 279, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分南', department: '普通', quota: 97, finalApplicants: 136, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分南', department: '福祉', quota: 64, finalApplicants: 55, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分豊府', department: '普通', quota: 110, finalApplicants: 159, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分工業', department: '機械', quota: 67, finalApplicants: 74, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分工業', department: '電気', quota: 34, finalApplicants: 24, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分工業', department: '電子', quota: 73, finalApplicants: 66, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分工業', department: '建築', quota: 33, finalApplicants: 47, finalRate: 1.42, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分工業', department: '土木', quota: 64, finalApplicants: 61, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分工業', department: '工業化学', quota: 35, finalApplicants: 23, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分商業', department: '商業', quota: 96, finalApplicants: 121, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分商業', department: '国際経済', quota: 32, finalApplicants: 47, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分商業', department: '情報処理', quota: 64, finalApplicants: 67, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芸術緑丘', department: '音楽', quota: 7, finalApplicants: 3, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分西', department: '総合学科', quota: 180, finalApplicants: 238, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分鶴崎', department: '普通', quota: 204, finalApplicants: 277, finalRate: 1.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴崎工業', department: '機械', quota: 64, finalApplicants: 65, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴崎工業', department: '電気', quota: 64, finalApplicants: 53, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴崎工業', department: '建築', quota: 35, finalApplicants: 40, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴崎工業', department: '化学工学', quota: 33, finalApplicants: 32, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴崎工業', department: '産業デザイン', quota: 38, finalApplicants: 45, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '情報科学', department: 'AIテクノロジー', quota: 32, finalApplicants: 47, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '情報科学', department: 'ビジネスソリューション', quota: 64, finalApplicants: 95, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '情報科学', department: 'デジタル創造', quota: 64, finalApplicants: 84, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分東', department: '普通', quota: 55, finalApplicants: 25, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分東', department: '園芸ビジネス', quota: 24, finalApplicants: 23, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大分東', department: '園芸デザイン', quota: 29, finalApplicants: 21, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '由布', department: '普通', quota: 60, finalApplicants: 32, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '臼杵', department: '普通', quota: 152, finalApplicants: 167, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '海洋科学', department: '海洋', quota: 34, finalApplicants: 16, finalRate: 0.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津久見', department: '普通', quota: 28, finalApplicants: 11, finalRate: 0.39, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津久見', department: '生産機械', quota: 24, finalApplicants: 19, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津久見', department: '電気電子', quota: 25, finalApplicants: 21, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津久見', department: '地域みらいビジネス', quota: 51, finalApplicants: 49, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐伯鶴城', department: '普通', quota: 162, finalApplicants: 152, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐伯豊南', department: '食農ビジネス', quota: 27, finalApplicants: 18, finalRate: 0.67, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐伯豊南', department: '工業技術', quota: 25, finalApplicants: 23, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐伯豊南', department: '福祉', quota: 28, finalApplicants: 5, finalRate: 0.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐伯豊南', department: '総合学科', quota: 49, finalApplicants: 53, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三重総合', department: '普通', quota: 53, finalApplicants: 23, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三重総合', department: '生物環境', quota: 32, finalApplicants: 28, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三重総合', department: 'メディア科学', quota: 38, finalApplicants: 26, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '竹田', department: '普通', quota: 117, finalApplicants: 77, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久住高原農業', department: '農業', quota: 22, finalApplicants: 18, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '玖珠美山', department: '普通', quota: 82, finalApplicants: 77, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '玖珠美山', department: '地域産業', quota: 29, finalApplicants: 31, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日田', department: '普通', quota: 169, finalApplicants: 157, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日田三隈', department: '総合学科', quota: 100, finalApplicants: 58, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日田林工', department: '林業', quota: 24, finalApplicants: 28, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日田林工', department: '機械', quota: 28, finalApplicants: 37, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日田林工', department: '電気', quota: 28, finalApplicants: 22, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日田林工', department: '建築土木', quota: 32, finalApplicants: 40, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
  ],
};
