/**
 * 岡山県 公立高等学校 倍率パイプラインα（Y-6・7県目）。
 *
 * 一次ソース: 岡山県教育委員会「令和8年度岡山県公立高等学校一般入学者選抜志願者数について」
 * （令和8年2月27日公表・全7ページ、全国募集を除く）。
 *
 * ⚠️岡山県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜と同型の高信頼度技法）。
 *
 * ⚠️構造: 表は[募集定員(A) / 特別入学等合格内定者数(B・既に別枠で決定済み) / 一般入学募集人員
 * (A-B) / 一般入学志願者数(C) / 一般入学募集人員に対する比率(C/(A-B)) / 前年度募集人員に対する
 * 比率]の6列。本ファイルのquota=一般入学募集人員(A-B)・finalApplicants=一般入学志願者数(C)・
 * finalRate=公表比率(C/(A-B))として転記する（他県と同じ「一般選抜の実質倍率」の定義に整合）。
 *
 * ⚠️罠（重要）: 複数学科が一般入学募集人員を共有する「くくり募集」は、PDF画像上で複数の学科名
 * 行にまたがる波括弧（brace）で示され、pdftotextのテキスト抽出だけでは列がどの学科に対応するか
 * 判別できない（岡山一宮の普通+理数・東岡山工業の機械+電子機械+電気・岡山東商業のビジネス創造+
 * 情報ビジネス・西大寺の普通+国際情報で実際に確認）。該当校はpdftoppmで画像化し波括弧の範囲を
 * 目視確認したうえで、連結学科名（例:「普通・理数（くくり募集）」）の単一レコードとして記録する
 * （福岡県小倉商業・広島県呉工業等と同型パターン）。
 *
 * coverage.status='partial'（PDF3ページ目=県立全日制の最初の14校36レコードのみ収録。残り約35校
 * ＋市立全日制2校を次回以降のセッションで継続する）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const OKAYAMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'okayama',
  sources: [
    {
      url: 'https://www.pref.okayama.jp/uploaded/life/1044733_10111198_misc.pdf',
      docTitle: '岡山県教育委員会 令和8年度岡山県公立高等学校一般入学者選抜志願者数について',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '全日制県立（PDF3ページ目・岡山朝日〜岡山南の14校36レコードのみ、全50校中の一部）',
    ],
    pendingDepartments: [
      '全日制県立の残り約35校（PDF4〜7ページ目）',
      '全日制市立2校（岡山後楽館・玉野商工）',
      '定時制（県立1校・市立5校、他県と同じ理由でスコープ外）',
      '全国募集（別枠のため対象外）',
    ],
    note:
      '総括表（全国募集を除く）記載の県立全日制目標値: 50校・quota5,698・applicants5,650・倍率0.99。' +
      '現時点はPDF3ページ目の14校36レコードのみ収録した部分収録状態。',
  },
  officialSubtotals: [
    { label: '県立全日制計', schoolCount: 50, quota: 5698, finalApplicants: 5650, finalRate: 0.99 },
  ],
  records: [
    { schoolName: '岡山朝日', department: '普通', quota: 320, finalApplicants: 299, finalRate: 0.93 },
    { schoolName: '岡山操山', department: '普通', quota: 166, finalApplicants: 188, finalRate: 1.13 },
    { schoolName: '岡山芳泉', department: '普通', quota: 320, finalApplicants: 376, finalRate: 1.18 },
    { schoolName: '岡山一宮', department: '普通・理数（くくり募集）', quota: 280, finalApplicants: 320, finalRate: 1.14 },
    { schoolName: '岡山城東', department: '普通', quota: 263, finalApplicants: 352, finalRate: 1.34 },
    { schoolName: '西大寺', department: '普通・国際情報（くくり募集）', quota: 180, finalApplicants: 243, finalRate: 1.35 },
    { schoolName: '西大寺', department: '商業', quota: 16, finalApplicants: 31, finalRate: 1.94 },
    { schoolName: '瀬戸', department: '普通', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '高松農業', department: '農業科学', quota: 8, finalApplicants: 10, finalRate: 1.25 },
    { schoolName: '高松農業', department: '園芸科学', quota: 10, finalApplicants: 3, finalRate: 0.3 },
    { schoolName: '高松農業', department: '畜産科学', quota: 8, finalApplicants: 10, finalRate: 1.25 },
    { schoolName: '高松農業', department: '農業土木', quota: 12, finalApplicants: 4, finalRate: 0.33 },
    { schoolName: '高松農業', department: '食品科学', quota: 8, finalApplicants: 12, finalRate: 1.5 },
    { schoolName: '興陽', department: '農業', quota: 8, finalApplicants: 17, finalRate: 2.13 },
    { schoolName: '興陽', department: '農業機械', quota: 8, finalApplicants: 11, finalRate: 1.38 },
    { schoolName: '興陽', department: '造園デザイン', quota: 8, finalApplicants: 13, finalRate: 1.63 },
    { schoolName: '興陽', department: 'ライフデザイン', quota: 16, finalApplicants: 35, finalRate: 2.19 },
    { schoolName: '瀬戸南', department: '生物生産', quota: 8, finalApplicants: 7, finalRate: 0.88 },
    { schoolName: '瀬戸南', department: '園芸科学', quota: 8, finalApplicants: 1, finalRate: 0.13 },
    { schoolName: '瀬戸南', department: '生活デザイン', quota: 8, finalApplicants: 24, finalRate: 3.0 },
    { schoolName: '岡山工業', department: '機械', quota: 16, finalApplicants: 21, finalRate: 1.31 },
    { schoolName: '岡山工業', department: '電気', quota: 8, finalApplicants: 15, finalRate: 1.88 },
    { schoolName: '岡山工業', department: '情報技術', quota: 8, finalApplicants: 23, finalRate: 2.88 },
    { schoolName: '岡山工業', department: '化学工学', quota: 8, finalApplicants: 14, finalRate: 1.75 },
    { schoolName: '岡山工業', department: '土木', quota: 8, finalApplicants: 11, finalRate: 1.38 },
    { schoolName: '岡山工業', department: '建築', quota: 8, finalApplicants: 16, finalRate: 2.0 },
    { schoolName: '岡山工業', department: 'デザイン', quota: 8, finalApplicants: 13, finalRate: 1.63 },
    { schoolName: '東岡山工業', department: '機械・電子機械・電気（くくり募集）', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '東岡山工業', department: '設備システム', quota: 8, finalApplicants: 6, finalRate: 0.75 },
    { schoolName: '東岡山工業', department: '工業化学', quota: 8, finalApplicants: 3, finalRate: 0.38 },
    { schoolName: '岡山東商業', department: 'ビジネス創造・情報ビジネス（くくり募集）', quota: 64, finalApplicants: 143, finalRate: 2.23 },
    { schoolName: '岡山南', department: '商業', quota: 16, finalApplicants: 23, finalRate: 1.44 },
    { schoolName: '岡山南', department: '国際経済', quota: 8, finalApplicants: 9, finalRate: 1.13 },
    { schoolName: '岡山南', department: '情報処理', quota: 16, finalApplicants: 27, finalRate: 1.69 },
    { schoolName: '岡山南', department: '生活創造', quota: 16, finalApplicants: 41, finalRate: 2.56 },
    { schoolName: '岡山南', department: '服飾デザイン', quota: 8, finalApplicants: 9, finalRate: 1.13 },
  ],
};
