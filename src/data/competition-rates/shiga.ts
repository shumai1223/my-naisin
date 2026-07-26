/**
 * 滋賀県 県立高等学校 倍率パイプラインα（Y-6・保留県からの再挑戦で完全達成）。
 *
 * 一次ソース: 滋賀県教育委員会「令和８年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料
 * （一次募集確定出願者数）」（令和8年2月13日公表・全日制3ページ）。
 *
 * ⚠️過去のセッションで「学校独自型選抜（自己推薦・中学校長推薦）と一般型選抜が同一の入学者枠数を
 * 共有し、志願者数がスポーツ推薦本出願+一般選抜本出願の合算という二重トラック構造で、膳所高校等の
 * 複数学科校では『両方の学科』という学科横断の追加集計行まで存在する三重の入れ子構造」として保留
 * していたが、実際には以下の3点で解決した:
 * ① quota=一般型選抜の募集人数（資料上は括弧書き「(304)」等で印字。募集定員から学校独自型選抜の
 *    入学許可予定者数を控除した値で、資料が既に計算済みの値をそのまま転記すればよく、自前で逆算
 *    する必要は無い）。
 * ② finalApplicants=一般型選抜の確定出願者数（2/13時点、志願変更後の値）。資料冒頭の注記
 *    「一般型選抜の出願者数は、学校独自型選抜を併願している者を含めた人数」の通り、既に学校独自型
 *    選抜に出願済みの生徒が一般型にも併願している数を含むため、他県より高めの倍率（1.2〜2.7倍）に
 *    なる学科があるが、これは資料が公式に採用している集計方針であり、独自の調整（併願者の除外等）
 *    は行わず公表値をそのまま転記した（他県で確立した「公表値のみ・独自推定禁止」原則に従う）。
 * ③ 膳所・草津東・守山北・高島・米原の5校は、複数学科（普通・理数等）に加えて「両方の学科」
 *    （学科を特定しない併願枠）が別行で存在するため、当該校の一般型選抜を単一レコードに統合し、
 *    quota/finalApplicantsとも該当行の合算値を採用した。
 *
 * ⚠️資料には一般型選抜のみの「計」行が印字されていない（「計①」は学校独自型選抜＋一般型選抜の
 * 合算値=募集人数9,230・確定出願者数12,201・倍率1.32で、外部二次情報（ベネッセ進研ゼミ高校入試
 * 情報サイト）が報じる同一年度の同一数値と一致することを確認済み）。そのため本データベースの
 * 一般型選抜のみの合計（quota6,016・applicants9,333）は機械集計による自己集計値であり、公式の
 * 印字済み合計行との直接突合はできていない。ただし「計①」から本データベースの自己集計値を差し
 * 引いた残差（学校独自型選抜分: quota3,214・applicants2,868）が、学校独自型選抜の合格予定人数の
 * 規模として妥当な範囲（各校20〜160人程度×44校）であることを確認し、内部整合性を担保した。
 * 学校独自型選抜（自己推薦・中学校長推薦）は他県の特色選抜・推薦選抜と同じ理由でスコープ外。
 * 定時制課程も他県の定時制と同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const SHIGA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'shiga',
  sources: [
    {
      url: 'https://www.pref.shiga.lg.jp/file/attachment/5591236.pdf',
      docTitle: '滋賀県教育委員会 令和８年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料（一次募集確定出願者数）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-26',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程・一般型選抜（44校61レコード。学校独自型選抜との併願者を含む確定出願者数）'],
    pendingDepartments: [
      '学校独自型選抜（自己推薦・中学校長推薦=他県の特色選抜・推薦選抜と同じ理由でスコープ外）',
      '定時制課程（他県の定時制と同じ理由でスコープ外）',
    ],
    note:
      '資料に一般型選抜のみの印字済み「計」行が無いため、機械集計（quota6,016・applicants9,333）は' +
      '自己集計値。ただし「計①」（学校独自型＋一般型の合算=募集人数9,230・確定出願者数12,201・' +
      '倍率1.32）は外部二次情報（ベネッセ進研ゼミ高校入試情報サイト）が報じる同一数値と一致することを' +
      '確認済みで、自己集計値との残差（学校独自型分3,214/2,868）も規模として妥当と判断した。',
  },
  officialSubtotals: [{ label: '一般型選抜のみ自己集計', schoolCount: 44, quota: 6016, finalApplicants: 9333 }],
  records: [
    {
      schoolName: '膳所',
      department: '普通・理数(一般型・両方の学科含む)',
      quota: 340,
      finalApplicants: 474,
      finalRate: 1.39,
    },
    { schoolName: '堅田', department: '普通', quota: 144, finalApplicants: 176, finalRate: 1.22 },
    { schoolName: '東大津', department: '普通', quota: 288, finalApplicants: 365, finalRate: 1.27 },
    { schoolName: '北大津', department: '普通', quota: 72, finalApplicants: 154, finalRate: 2.14 },
    { schoolName: '大津', department: '普通', quota: 168, finalApplicants: 366, finalRate: 2.18 },
    { schoolName: '大津', department: '家庭科学', quota: 48, finalApplicants: 80, finalRate: 1.67 },
    { schoolName: '石山', department: '普通', quota: 288, finalApplicants: 406, finalRate: 1.41 },
    { schoolName: '瀬田工業', department: '機械', quota: 60, finalApplicants: 133, finalRate: 2.22 },
    { schoolName: '瀬田工業', department: '電気', quota: 60, finalApplicants: 119, finalRate: 1.98 },
    { schoolName: '瀬田工業', department: '化学工業', quota: 20, finalApplicants: 45, finalRate: 2.25 },
    { schoolName: '大津商業', department: '総合ビジネス', quota: 100, finalApplicants: 226, finalRate: 2.26 },
    { schoolName: '大津商業', department: '情報システム', quota: 40, finalApplicants: 90, finalRate: 2.25 },
    { schoolName: '彦根東', department: '普通', quota: 304, finalApplicants: 394, finalRate: 1.3 },
    { schoolName: '河瀬', department: '普通', quota: 96, finalApplicants: 105, finalRate: 1.09 },
    { schoolName: '彦根工業', department: '機械', quota: 60, finalApplicants: 112, finalRate: 1.87 },
    { schoolName: '彦根工業', department: '電気', quota: 40, finalApplicants: 78, finalRate: 1.95 },
    { schoolName: '彦根工業', department: '建設', quota: 20, finalApplicants: 35, finalRate: 1.75 },
    { schoolName: '彦根翔西館', department: '総合', quota: 160, finalApplicants: 374, finalRate: 2.34 },
    { schoolName: '長浜北', department: '普通', quota: 120, finalApplicants: 204, finalRate: 1.7 },
    { schoolName: '虎姫', department: '普通', quota: 160, finalApplicants: 207, finalRate: 1.29 },
    { schoolName: '伊香', department: '普通', quota: 48, finalApplicants: 67, finalRate: 1.4 },
    { schoolName: '伊香', department: '森の探究', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '長浜農業', department: '農業', quota: 20, finalApplicants: 28, finalRate: 1.4 },
    { schoolName: '長浜農業', department: '食品', quota: 20, finalApplicants: 33, finalRate: 1.65 },
    { schoolName: '長浜農業', department: '園芸', quota: 20, finalApplicants: 36, finalRate: 1.8 },
    { schoolName: '長浜北星', department: '総合', quota: 140, finalApplicants: 200, finalRate: 1.43 },
    { schoolName: '八幡', department: '普通', quota: 168, finalApplicants: 291, finalRate: 1.73 },
    { schoolName: '八幡工業', department: '機械', quota: 40, finalApplicants: 82, finalRate: 2.05 },
    { schoolName: '八幡工業', department: '電気', quota: 40, finalApplicants: 80, finalRate: 2.0 },
    { schoolName: '八幡工業', department: '環境化学', quota: 20, finalApplicants: 40, finalRate: 2.0 },
    { schoolName: '八幡商業', department: '商業', quota: 80, finalApplicants: 182, finalRate: 2.28 },
    { schoolName: '八幡商業', department: '国際経済', quota: 20, finalApplicants: 31, finalRate: 1.55 },
    { schoolName: '八幡商業', department: '情報処理', quota: 20, finalApplicants: 34, finalRate: 1.7 },
    {
      schoolName: '草津東',
      department: '普通・体育(一般型・両方の学科含む)',
      quota: 212,
      finalApplicants: 475,
      finalRate: 2.24,
    },
    { schoolName: '草津', department: '普通', quota: 180, finalApplicants: 243, finalRate: 1.35 },
    { schoolName: '玉川', department: '普通', quota: 256, finalApplicants: 317, finalRate: 1.24 },
    { schoolName: '湖南農業', department: '農業', quota: 40, finalApplicants: 87, finalRate: 2.18 },
    { schoolName: '湖南農業', department: '食品', quota: 20, finalApplicants: 40, finalRate: 2.0 },
    { schoolName: '湖南農業', department: '花緑', quota: 20, finalApplicants: 54, finalRate: 2.7 },
    { schoolName: '守山', department: '普通', quota: 180, finalApplicants: 226, finalRate: 1.26 },
    {
      schoolName: '守山北',
      department: '普通・みらい共創(一般型・両方の学科含む)',
      quota: 80,
      finalApplicants: 122,
      finalRate: 1.53,
    },
    { schoolName: '栗東', department: '普通', quota: 80, finalApplicants: 120, finalRate: 1.5 },
    { schoolName: '国際情報', department: '総合', quota: 120, finalApplicants: 236, finalRate: 1.97 },
    { schoolName: '水口', department: '普通', quota: 130, finalApplicants: 217, finalRate: 1.67 },
    { schoolName: '水口東', department: '普通', quota: 90, finalApplicants: 88, finalRate: 0.98 },
    { schoolName: '甲南', department: '総合', quota: 60, finalApplicants: 101, finalRate: 1.68 },
    { schoolName: '信楽', department: '総合', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '野洲', department: '普通', quota: 80, finalApplicants: 117, finalRate: 1.46 },
    { schoolName: '石部', department: '普通', quota: 60, finalApplicants: 87, finalRate: 1.45 },
    { schoolName: '甲西', department: '普通', quota: 120, finalApplicants: 215, finalRate: 1.79 },
    {
      schoolName: '高島',
      department: '普通・文理探究(一般型・両方の学科含む)',
      quota: 156,
      finalApplicants: 189,
      finalRate: 1.21,
    },
    { schoolName: '安曇川', department: '総合', quota: 84, finalApplicants: 69, finalRate: 0.82 },
    { schoolName: '八日市', department: '普通', quota: 252, finalApplicants: 300, finalRate: 1.19 },
    { schoolName: '能登川', department: '普通', quota: 84, finalApplicants: 116, finalRate: 1.38 },
    { schoolName: '八日市南', department: '農業', quota: 20, finalApplicants: 44, finalRate: 2.2 },
    { schoolName: '八日市南', department: '食品', quota: 20, finalApplicants: 37, finalRate: 1.85 },
    { schoolName: '八日市南', department: '花緑デザイン', quota: 20, finalApplicants: 43, finalRate: 2.15 },
    { schoolName: '伊吹', department: '普通', quota: 60, finalApplicants: 99, finalRate: 1.65 },
    {
      schoolName: '米原',
      department: '普通・理数(一般型・両方の学科含む)',
      quota: 168,
      finalApplicants: 161,
      finalRate: 0.96,
    },
    { schoolName: '日野', department: '総合', quota: 80, finalApplicants: 131, finalRate: 1.64 },
    { schoolName: '愛知', department: '普通', quota: 60, finalApplicants: 90, finalRate: 1.5 },
  ],
};
