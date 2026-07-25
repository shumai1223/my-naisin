/**
 * 富山県 公立高等学校 倍率パイプラインα（Y-6・13県目・全日制完全達成）。
 *
 * 一次ソース: 富山県教育委員会「令和8年度富山県立高等学校入学者選抜 全日制の課程一般入学者
 * 選抜志願状況（令和8年2月24日正午現在）」（全3ページ）。
 *
 * ⚠️富山県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重と同型の高信頼度技法）。列は[募集定員(A) /
 * 推薦入学内定者数及び全国募集合格者数(B) / 推薦内定者数等を除いた募集人数(A-B＝本ファイルの
 * quota) / 志願者数(applicants) / 倍率]。
 *
 * ⚠️罠1（内数コース）: 括弧書きで示される「普通科(体育コース)」「普通科(自然科学コース)」
 * 「普通科(音楽コース)」は、PDF冒頭の注記①「1年次から開設する普通科コースは、普通科の内数として
 * 示し、学科数には入れない」により、既に普通科本体の募集定員に含まれる内数であり、独立レコード
 * として二重計上しない。
 *
 * ⚠️罠2（探究科学科＝理数科学科＋人文社会科学科の総称）: 富山・富山中部・高岡の3校の「探究科学科」
 * は注記④により理数科学科と人文社会科学科の総称（2学科と数える）だが、本表には理数科学科の数値
 * のみが記載され人文社会科学科には一切数値が無い（別選抜枠等の理由と推測されるが本表からは
 * 確認できない）。捏造ゼロ優先で人文社会科学科はレコードとして採用しない。
 *
 * ⚠️罠3（くくり募集）: 魚津工業（機械創造科・電気情報科・ＩＴ環境化学科）と中央農業（生物生産科・
 * 園芸デザイン科・バイオ技術科）は複数学科が募集人員を共有する「くくり募集」（注記②③に「3学科と
 * 数える」と明記）。連結学科名の単一レコードとして記録する（他県のくくり募集と同型パターン）。
 *
 * 機械集計（quota5,020・applicants4,482・倍率0.89、34校75レコード）が「合計 34校82学科」行と
 * 完全一致した（初回転記で一致。学科数82と収録75レコードの差はくくり募集・罠2の数え方の違いに
 * よるもので、quota/applicantsの実数自体は完全一致）。定時制・通信制課程は他県と同じ理由で
 * スコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const TOYAMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'toyama',
  sources: [
    {
      url: 'https://www.pref.toyama.jp/documents/47208/080224.pdf',
      docTitle: '富山県教育委員会 令和8年度富山県立高等学校入学者選抜 全日制の課程一般入学者選抜志願状況（令和8年2月24日正午現在）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（34校75レコード）'],
    pendingDepartments: ['定時制・通信制課程（他県と同じ理由でスコープ外）'],
    note: '「合計 34校82学科」行（quota5,020・applicants4,482・倍率0.89）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 34, quota: 5020, finalApplicants: 4482, finalRate: 0.89 }],
  records: [
    { schoolName: '入善', department: '普通科', quota: 108, finalApplicants: 63, finalRate: 0.58 },
    { schoolName: '入善', department: '農業科', quota: 24, finalApplicants: 15, finalRate: 0.63 },
    { schoolName: '桜井', department: '普通科', quota: 120, finalApplicants: 108, finalRate: 0.9 },
    { schoolName: '桜井', department: '土木科', quota: 29, finalApplicants: 22, finalRate: 0.76 },
    { schoolName: '桜井', department: '生活環境科', quota: 22, finalApplicants: 19, finalRate: 0.86 },
    { schoolName: '魚津', department: '普通科', quota: 160, finalApplicants: 148, finalRate: 0.93 },
    { schoolName: '魚津工業', department: '機械創造科・電気情報科・ＩＴ環境化学科（くくり募集）', quota: 85, finalApplicants: 41, finalRate: 0.48 },
    { schoolName: '滑川', department: '普通科', quota: 80, finalApplicants: 70, finalRate: 0.88 },
    { schoolName: '滑川', department: '薬業科', quota: 33, finalApplicants: 30, finalRate: 0.91 },
    { schoolName: '滑川', department: '商業科', quota: 25, finalApplicants: 24, finalRate: 0.96 },
    { schoolName: '上市', department: '海洋科', quota: 31, finalApplicants: 21, finalRate: 0.68 },
    { schoolName: '上市', department: '総合学科', quota: 103, finalApplicants: 53, finalRate: 0.51 },
    { schoolName: '雄山', department: '普通科', quota: 80, finalApplicants: 38, finalRate: 0.48 },
    { schoolName: '雄山', department: '生活文化科', quota: 27, finalApplicants: 44, finalRate: 1.63 },
    { schoolName: '中央農業', department: '生物生産科・園芸デザイン科・バイオ技術科（くくり募集）', quota: 52, finalApplicants: 20, finalRate: 0.38 },
    { schoolName: '八尾', department: '普通科', quota: 107, finalApplicants: 104, finalRate: 0.97 },
    { schoolName: '富山西', department: '普通科', quota: 120, finalApplicants: 53, finalRate: 0.44 },
    { schoolName: '富山', department: '普通科', quota: 160, finalApplicants: 149, finalRate: 0.93 },
    { schoolName: '富山', department: '理数科学科', quota: 80, finalApplicants: 131, finalRate: 1.64 },
    { schoolName: '富山中部', department: '普通科', quota: 160, finalApplicants: 67, finalRate: 0.42 },
    { schoolName: '富山中部', department: '理数科学科', quota: 80, finalApplicants: 168, finalRate: 2.1 },
    { schoolName: '富山北部', department: '普通科', quota: 96, finalApplicants: 115, finalRate: 1.2 },
    { schoolName: '富山北部', department: 'くすり・バイオ科', quota: 51, finalApplicants: 49, finalRate: 0.96 },
    { schoolName: '富山北部', department: '情報デザイン科', quota: 20, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '富山工業', department: '機械工学科', quota: 55, finalApplicants: 34, finalRate: 0.62 },
    { schoolName: '富山工業', department: '電子機械工学科', quota: 27, finalApplicants: 29, finalRate: 1.07 },
    { schoolName: '富山工業', department: '金属工学科', quota: 28, finalApplicants: 23, finalRate: 0.82 },
    { schoolName: '富山工業', department: '電気工学科', quota: 60, finalApplicants: 58, finalRate: 0.97 },
    { schoolName: '富山工業', department: '建築工学科', quota: 22, finalApplicants: 25, finalRate: 1.14 },
    { schoolName: '富山工業', department: '土木工学科', quota: 23, finalApplicants: 27, finalRate: 1.17 },
    { schoolName: '富山商業', department: '流通ビジネス科', quota: 40, finalApplicants: 64, finalRate: 1.6 },
    { schoolName: '富山商業', department: 'ビジネスマネジメント科', quota: 22, finalApplicants: 19, finalRate: 0.86 },
    { schoolName: '富山商業', department: '会計ビジネス科', quota: 22, finalApplicants: 37, finalRate: 1.68 },
    { schoolName: '富山商業', department: '情報ビジネス科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '富山いずみ', department: '総合学科', quota: 116, finalApplicants: 127, finalRate: 1.09 },
    { schoolName: '富山いずみ', department: '看護科', quota: 24, finalApplicants: 18, finalRate: 0.75 },
    { schoolName: '富山東', department: '普通科', quota: 231, finalApplicants: 237, finalRate: 1.03 },
    { schoolName: '富山南', department: '普通科', quota: 186, finalApplicants: 204, finalRate: 1.1 },
    { schoolName: '呉羽', department: '普通科', quota: 220, finalApplicants: 243, finalRate: 1.1 },
    { schoolName: '小杉', department: '総合学科', quota: 113, finalApplicants: 115, finalRate: 1.02 },
    { schoolName: '大門', department: '普通科', quota: 108, finalApplicants: 83, finalRate: 0.77 },
    { schoolName: '新湊', department: '普通科', quota: 120, finalApplicants: 86, finalRate: 0.72 },
    { schoolName: '新湊', department: '商業科', quota: 24, finalApplicants: 22, finalRate: 0.92 },
    { schoolName: '高岡', department: '普通科', quota: 160, finalApplicants: 182, finalRate: 1.14 },
    { schoolName: '高岡', department: '理数科学科', quota: 80, finalApplicants: 55, finalRate: 0.69 },
    { schoolName: '高岡工芸', department: '機械科', quota: 28, finalApplicants: 18, finalRate: 0.64 },
    { schoolName: '高岡工芸', department: '電子機械科', quota: 27, finalApplicants: 24, finalRate: 0.89 },
    { schoolName: '高岡工芸', department: '電気科', quota: 28, finalApplicants: 19, finalRate: 0.68 },
    { schoolName: '高岡工芸', department: '建築科', quota: 22, finalApplicants: 33, finalRate: 1.5 },
    { schoolName: '高岡工芸', department: '土木環境科', quota: 29, finalApplicants: 27, finalRate: 0.93 },
    { schoolName: '高岡工芸', department: '工芸科', quota: 22, finalApplicants: 22, finalRate: 1.0 },
    { schoolName: '高岡工芸', department: 'デザイン・絵画科', quota: 20, finalApplicants: 31, finalRate: 1.55 },
    { schoolName: '高岡商業', department: '流通ビジネス科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '高岡商業', department: '国際ビジネス科', quota: 22, finalApplicants: 5, finalRate: 0.23 },
    { schoolName: '高岡商業', department: '会計ビジネス科', quota: 32, finalApplicants: 23, finalRate: 0.72 },
    { schoolName: '高岡商業', department: '情報ビジネス科', quota: 23, finalApplicants: 19, finalRate: 0.83 },
    { schoolName: '伏木', department: '国際交流科', quota: 78, finalApplicants: 23, finalRate: 0.29 },
    { schoolName: '高岡南', department: '普通科', quota: 146, finalApplicants: 150, finalRate: 1.03 },
    { schoolName: '福岡', department: '普通科', quota: 109, finalApplicants: 128, finalRate: 1.17 },
    { schoolName: '氷見', department: '普通科', quota: 80, finalApplicants: 58, finalRate: 0.73 },
    { schoolName: '氷見', department: '農業科学科', quota: 19, finalApplicants: 9, finalRate: 0.47 },
    { schoolName: '氷見', department: '海洋科学科', quota: 16, finalApplicants: 15, finalRate: 0.94 },
    { schoolName: '氷見', department: 'ビジネス科', quota: 23, finalApplicants: 27, finalRate: 1.17 },
    { schoolName: '氷見', department: '生活福祉科', quota: 32, finalApplicants: 20, finalRate: 0.63 },
    { schoolName: '砺波', department: '普通科', quota: 160, finalApplicants: 139, finalRate: 0.87 },
    { schoolName: '砺波工業', department: '機械科', quota: 50, finalApplicants: 31, finalRate: 0.62 },
    { schoolName: '砺波工業', department: '電気科', quota: 26, finalApplicants: 13, finalRate: 0.5 },
    { schoolName: '砺波工業', department: '電子科', quota: 20, finalApplicants: 24, finalRate: 1.2 },
    { schoolName: '南砺福野', department: '普通科', quota: 160, finalApplicants: 140, finalRate: 0.88 },
    { schoolName: '南砺福野', department: '国際科', quota: 20, finalApplicants: 13, finalRate: 0.65 },
    { schoolName: '南砺福野', department: '農業環境科', quota: 16, finalApplicants: 14, finalRate: 0.88 },
    { schoolName: '南砺福野', department: '福祉科', quota: 19, finalApplicants: 12, finalRate: 0.63 },
    { schoolName: '南砺平', department: '普通科', quota: 34, finalApplicants: 10, finalRate: 0.29 },
    { schoolName: '石動', department: '普通科', quota: 120, finalApplicants: 68, finalRate: 0.57 },
    { schoolName: '石動', department: '商業科', quota: 25, finalApplicants: 28, finalRate: 1.12 },
  ],
};
