/**
 * 石川県 公立高等学校 倍率パイプラインα（Y-6・14県目・全日制完全達成）。
 *
 * 一次ソース: 石川県教育委員会「令和8年度石川県公立高等学校一般入学(全日制)の出願状況
 * （2月24日）」（全3ページ）。
 *
 * ⚠️石川県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重・富山と同型の高信頼度技法）。列は[募集定員(A) /
 * 内定者数（推薦・連携型・併設型等の内定者数） / 一般入学枠(C=A-B＝本ファイルのquota) / 出願者数
 * (D＝applicants) / 出願倍率(D/C)]。各校末尾に「小計」行が付随し自己集計との突合チェックポイントと
 * して機能する（三重県と同型の高信頼度設計）。
 *
 * ⚠️罠（併願制度＝他県未見のパターン）: 石川県独自の「普・理併願」「普・普(文)併願」という制度が
 * あり、同一校内で複数学科（例: 普通と理数）に同時出願する生徒の人数が、いずれの学科にも帰属
 * させられない形でquota無しのapplicants専用行として計上される（小松・金沢泉丘・七尾の3校で確認）。
 * この3校は複数学科をまとめて単一レコード（例:「普通・理数（併願あり・合算）」）として記録し、
 * 学科別の応募者内訳を無理に分解しない（通常の「くくり募集」＝募集人員の共有とは異なる別種の
 * 罠として区別する）。
 *
 * 機械集計（quota6,566・applicants6,076・倍率0.93、40校70レコード）が「全県合計」行と完全一致
 * した（初回転記で一致・再修正なし）。定時制課程は他県と同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const ISHIKAWA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'ishikawa',
  sources: [
    {
      url: 'https://www.pref.ishikawa.lg.jp/kisya/r7kyoui/documents/20260224.pdf',
      docTitle: '石川県教育委員会 令和8年度石川県公立高等学校一般入学(全日制)の出願状況（2月24日）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（40校70レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '「全県合計」行（quota6,566・applicants6,076・倍率0.93）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全県合計', schoolCount: 40, quota: 6566, finalApplicants: 6076, finalRate: 0.93 }],
  records: [
    { schoolName: '大聖寺実業', department: '機械システム', quota: 68, finalApplicants: 13, finalRate: 0.19 },
    { schoolName: '大聖寺実業', department: '情報ビジネス', quota: 28, finalApplicants: 22, finalRate: 0.79 },
    { schoolName: '大聖寺', department: '普通', quota: 160, finalApplicants: 126, finalRate: 0.79 },
    { schoolName: '加賀', department: '総合学科', quota: 72, finalApplicants: 49, finalRate: 0.68 },
    { schoolName: '小松商業', department: '総合情報ビジネス', quota: 112, finalApplicants: 66, finalRate: 0.59 },
    { schoolName: '小松工業', department: '機械システム', quota: 56, finalApplicants: 54, finalRate: 0.96 },
    { schoolName: '小松工業', department: '電気', quota: 56, finalApplicants: 47, finalRate: 0.84 },
    { schoolName: '小松工業', department: '建設', quota: 28, finalApplicants: 26, finalRate: 0.93 },
    { schoolName: '小松工業', department: '材料化学', quota: 29, finalApplicants: 24, finalRate: 0.83 },
    { schoolName: '小松', department: '普通・理数（併願あり・合算）', quota: 320, finalApplicants: 377, finalRate: 1.18 },
    { schoolName: '小松明峰', department: '普通', quota: 240, finalApplicants: 246, finalRate: 1.03 },
    { schoolName: '寺井', department: '総合学科', quota: 113, finalApplicants: 68, finalRate: 0.6 },
    { schoolName: '鶴来', department: '普通', quota: 77, finalApplicants: 41, finalRate: 0.53 },
    { schoolName: '鶴来', department: '普通（スポーツ科学）', quota: 31, finalApplicants: 11, finalRate: 0.35 },
    { schoolName: '松任', department: '普通', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '松任', department: '総合学科', quota: 79, finalApplicants: 50, finalRate: 0.63 },
    { schoolName: '翠星', department: '総合グリーン科学', quota: 136, finalApplicants: 126, finalRate: 0.93 },
    { schoolName: '野々市明倫', department: '普通', quota: 240, finalApplicants: 249, finalRate: 1.04 },
    { schoolName: '金沢錦丘', department: '普通', quota: 202, finalApplicants: 291, finalRate: 1.44 },
    { schoolName: '金沢泉丘', department: '普通・理数（併願あり・合算）', quota: 400, finalApplicants: 490, finalRate: 1.23 },
    { schoolName: '金沢二水', department: '普通', quota: 400, finalApplicants: 567, finalRate: 1.42 },
    { schoolName: '金沢伏見', department: '普通', quota: 240, finalApplicants: 230, finalRate: 0.96 },
    { schoolName: '金沢辰巳丘', department: '普通', quota: 80, finalApplicants: 33, finalRate: 0.41 },
    { schoolName: '金沢辰巳丘', department: '普通（芸術）', quota: 31, finalApplicants: 27, finalRate: 0.87 },
    { schoolName: '金沢商業', department: '総合情報ビジネス', quota: 196, finalApplicants: 255, finalRate: 1.3 },
    { schoolName: '工業', department: '機械システム', quota: 56, finalApplicants: 91, finalRate: 1.63 },
    { schoolName: '工業', department: '電気', quota: 28, finalApplicants: 38, finalRate: 1.36 },
    { schoolName: '工業', department: '電子情報', quota: 31, finalApplicants: 18, finalRate: 0.58 },
    { schoolName: '工業', department: '材料化学', quota: 34, finalApplicants: 32, finalRate: 0.94 },
    { schoolName: '工業', department: '工芸', quota: 28, finalApplicants: 30, finalRate: 1.07 },
    { schoolName: '工業', department: 'テキスタイル工学', quota: 28, finalApplicants: 22, finalRate: 0.79 },
    { schoolName: '工業', department: 'デザイン', quota: 28, finalApplicants: 47, finalRate: 1.68 },
    { schoolName: '金沢桜丘', department: '普通', quota: 360, finalApplicants: 523, finalRate: 1.45 },
    { schoolName: '金沢西', department: '普通', quota: 320, finalApplicants: 401, finalRate: 1.25 },
    { schoolName: '金沢北陵', department: '総合学科', quota: 149, finalApplicants: 98, finalRate: 0.66 },
    { schoolName: '金沢向陽', department: '普通', quota: 116, finalApplicants: 38, finalRate: 0.33 },
    { schoolName: '内灘', department: '普通', quota: 118, finalApplicants: 55, finalRate: 0.47 },
    { schoolName: '津幡', department: 'スポーツ健康科学', quota: 58, finalApplicants: 31, finalRate: 0.53 },
    { schoolName: '津幡', department: '総合学科', quota: 80, finalApplicants: 58, finalRate: 0.73 },
    { schoolName: '羽咋', department: '普通', quota: 160, finalApplicants: 141, finalRate: 0.88 },
    { schoolName: '羽咋工業', department: '機械システム', quota: 32, finalApplicants: 33, finalRate: 1.03 },
    { schoolName: '羽咋工業', department: '電気', quota: 29, finalApplicants: 34, finalRate: 1.17 },
    { schoolName: '羽咋工業', department: '建設・デザイン', quota: 28, finalApplicants: 24, finalRate: 0.86 },
    { schoolName: '宝達', department: '普通', quota: 79, finalApplicants: 23, finalRate: 0.29 },
    { schoolName: '志賀', department: '普通', quota: 36, finalApplicants: 11, finalRate: 0.31 },
    { schoolName: '志賀', department: '普通（ビジネス・福祉）', quota: 38, finalApplicants: 8, finalRate: 0.21 },
    { schoolName: '七尾東雲', department: '機械システム', quota: 80, finalApplicants: 20, finalRate: 0.25 },
    { schoolName: '七尾東雲', department: '演劇', quota: 20, finalApplicants: 4, finalRate: 0.2 },
    { schoolName: '七尾東雲', department: '総合学科', quota: 59, finalApplicants: 32, finalRate: 0.54 },
    {
      schoolName: '七尾',
      department: '普通・普通(文系フロンティア)・理数（併願あり・合算）',
      quota: 200,
      finalApplicants: 188,
      finalRate: 0.94,
    },
    { schoolName: '田鶴浜', department: '衛生看護', quota: 28, finalApplicants: 26, finalRate: 0.93 },
    { schoolName: '田鶴浜', department: '健康福祉', quota: 38, finalApplicants: 6, finalRate: 0.16 },
    { schoolName: '鹿西', department: '普通', quota: 120, finalApplicants: 63, finalRate: 0.53 },
    { schoolName: '穴水', department: '普通', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '穴水', department: '普通（キャリア）', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '能登', department: '普通', quota: 33, finalApplicants: 22, finalRate: 0.67 },
    { schoolName: '能登', department: '地域産業', quota: 31, finalApplicants: 15, finalRate: 0.48 },
    { schoolName: '門前', department: '普通', quota: 36, finalApplicants: 19, finalRate: 0.53 },
    { schoolName: '門前', department: '普通（キャリア）', quota: 35, finalApplicants: 5, finalRate: 0.14 },
    { schoolName: '輪島', department: '普通', quota: 80, finalApplicants: 41, finalRate: 0.51 },
    { schoolName: '輪島', department: '普通（ビジネス）', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '飯田', department: '普通', quota: 80, finalApplicants: 34, finalRate: 0.43 },
    { schoolName: '飯田', department: '普通（ビジネス）', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '小松市立', department: '普通', quota: 90, finalApplicants: 80, finalRate: 0.89 },
    { schoolName: '小松市立', department: '普通（芸術）', quota: 28, finalApplicants: 14, finalRate: 0.5 },
    { schoolName: '金沢市立工業', department: '機械', quota: 56, finalApplicants: 87, finalRate: 1.55 },
    { schoolName: '金沢市立工業', department: '電気', quota: 29, finalApplicants: 21, finalRate: 0.72 },
    { schoolName: '金沢市立工業', department: '電子情報', quota: 33, finalApplicants: 18, finalRate: 0.55 },
    { schoolName: '金沢市立工業', department: '建築', quota: 30, finalApplicants: 38, finalRate: 1.27 },
    { schoolName: '金沢市立工業', department: '土木', quota: 30, finalApplicants: 24, finalRate: 0.8 },
  ],
};
