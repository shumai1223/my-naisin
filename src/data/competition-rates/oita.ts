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
  ],
};
