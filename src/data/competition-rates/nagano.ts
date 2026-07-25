/**
 * 長野県 公立高等学校 倍率パイプラインα（Y-6・10県目・進行中）。
 *
 * 一次ソース: 長野県教育委員会「令和8年度公立高等学校入学者後期選抜志願者数②（志望変更受付
 * 締切後の集計結果）」（3月5日公表・全8ページ）。
 *
 * ⚠️長野県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬と同型の高信頼度技法）。
 *
 * ⚠️構造上の強み: 全県計（8,807／7,795／0.89）に加えて、4通学区（第1＝北信・第2＝東信・第3＝
 * 南信・第4＝中信）ごとの「合計」行が別紙内に明記されている。これを地区単位の進捗チェックポイント
 * として活用し、通学区ごとに転記→機械集計を突合→問題なければ次の通学区へ進む方式を採用する。
 *
 * ⚠️罠（くくり募集）: 複数学科・コースが募集人員を共有する「くくり募集」がPDF内に複数存在する
 * （飯山の自然科学探究＋人文科学探究、長野商業の商業＋会計、須坂創成の園芸農学＋食品科学＋
 * 環境造園、更級農業の地域園芸＋植物活用＋食農科学等）。PDF別紙１冒頭の注記に「理数科等と国際
 * 関係学科等の合計値は、飯山高等学校が自然科学探究科と人文科学探究科…でくくり募集を行うため、
 * それぞれの学科の学級数を参考にした仮の数になっています」と明記されており、これらは連結学科名の
 * 単一レコードとして記録する（他県のくくり募集と同型パターン）。
 *
 * coverage.status='partial'（第1通学区・北信地区の24校37レコードのみ収録。残り3通学区
 * ＋定時制課程は次回以降のセッションで継続する）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const NAGANO_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'nagano',
  sources: [
    {
      url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/20260305web-teisei.pdf',
      docTitle: '長野県教育委員会 令和8年度公立高等学校入学者後期選抜志願者数②（志望変更受付締切後の集計結果）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['第1通学区（北信地区）全日制（24校37レコード）'],
    pendingDepartments: [
      '第2通学区（東信地区）全日制',
      '第3通学区（南信地区）全日制',
      '第4通学区（中信地区）全日制',
      '定時制課程（普通・多部制単位制含む・他県と同じ理由でスコープ外）',
    ],
    note:
      '全県計（quota8,807・applicants7,795・倍率0.89）のうち、第1通学区（北信地区）合計' +
      '（quota2,623・applicants2,303・倍率0.88）と機械集計が完全一致した（初回転記で一致）。',
  },
  officialSubtotals: [
    { label: '第1通学区（北信地区）計', schoolCount: 24, quota: 2623, finalApplicants: 2303, finalRate: 0.88 },
  ],
  records: [
    { schoolName: '飯山', department: '普通', quota: 56, finalApplicants: 42, finalRate: 0.75 },
    { schoolName: '飯山', department: '自然科学探究・人文科学探究（くくり募集）', quota: 44, finalApplicants: 10, finalRate: 0.23 },
    { schoolName: '飯山', department: 'スポーツ科学', quota: 13, finalApplicants: 4, finalRate: 0.31 },
    { schoolName: '下高井農林', department: '地域創造農学', quota: 41, finalApplicants: 14, finalRate: 0.34 },
    { schoolName: '中野立志館', department: '総合', quota: 64, finalApplicants: 42, finalRate: 0.66 },
    { schoolName: '中野西', department: '普通', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '須坂東', department: '普通', quota: 86, finalApplicants: 28, finalRate: 0.33 },
    { schoolName: '須坂', department: '普通', quota: 240, finalApplicants: 252, finalRate: 1.05 },
    { schoolName: '須坂創成', department: '農業（園芸農学・食品科学・環境造園）', quota: 48, finalApplicants: 54, finalRate: 1.13 },
    { schoolName: '須坂創成', department: '工業（創造工学）', quota: 16, finalApplicants: 14, finalRate: 0.88 },
    { schoolName: '須坂創成', department: '商業', quota: 32, finalApplicants: 33, finalRate: 1.03 },
    { schoolName: '北部', department: '普通', quota: 51, finalApplicants: 26, finalRate: 0.51 },
    { schoolName: '長野吉田', department: '普通', quota: 240, finalApplicants: 262, finalRate: 1.09 },
    { schoolName: '長野', department: '普通', quota: 280, finalApplicants: 290, finalRate: 1.04 },
    { schoolName: '長野西', department: '普通', quota: 200, finalApplicants: 208, finalRate: 1.04 },
    { schoolName: '長野西', department: '国際教養', quota: 4, finalApplicants: 14, finalRate: 3.5 },
    { schoolName: '長野商業', department: '商業・会計（くくり募集）', quota: 80, finalApplicants: 82, finalRate: 1.03 },
    { schoolName: '長野東', department: '普通', quota: 112, finalApplicants: 112, finalRate: 1.0 },
    { schoolName: '長野工業', department: '機械工学', quota: 16, finalApplicants: 15, finalRate: 0.94 },
    { schoolName: '長野工業', department: '電気電子工学', quota: 16, finalApplicants: 16, finalRate: 1.0 },
    { schoolName: '長野工業', department: '物質化学', quota: 16, finalApplicants: 17, finalRate: 1.06 },
    { schoolName: '長野工業', department: '情報工学', quota: 16, finalApplicants: 15, finalRate: 0.94 },
    { schoolName: '長野工業', department: '土木工学', quota: 16, finalApplicants: 20, finalRate: 1.25 },
    { schoolName: '長野工業', department: '建築学', quota: 16, finalApplicants: 19, finalRate: 1.19 },
    { schoolName: '長野西中条校', department: '普通', quota: 31, finalApplicants: 2, finalRate: 0.06 },
    { schoolName: '篠ノ井犀峡校', department: '普通', quota: 33, finalApplicants: 0, finalRate: 0.0 },
    { schoolName: '市立長野', department: '総合', quota: 45, finalApplicants: 48, finalRate: 1.07 },
    { schoolName: '長野南', department: '普通', quota: 120, finalApplicants: 104, finalRate: 0.87 },
    { schoolName: '篠ノ井', department: '普通', quota: 200, finalApplicants: 198, finalRate: 0.99 },
    { schoolName: '更級農業', department: '地域園芸・植物活用・食農科学（くくり募集）', quota: 48, finalApplicants: 39, finalRate: 0.81 },
    { schoolName: '松代', department: '普通', quota: 61, finalApplicants: 15, finalRate: 0.25 },
    { schoolName: '松代', department: '商業', quota: 18, finalApplicants: 3, finalRate: 0.17 },
    { schoolName: '屋代', department: '普通', quota: 160, finalApplicants: 158, finalRate: 0.99 },
    { schoolName: '屋代', department: '理数', quota: 12, finalApplicants: 11, finalRate: 0.92 },
    { schoolName: '屋代南', department: '普通', quota: 48, finalApplicants: 45, finalRate: 0.94 },
    { schoolName: '屋代南', department: '家庭（ライフデザイン）', quota: 16, finalApplicants: 6, finalRate: 0.38 },
    { schoolName: '坂城', department: '普通', quota: 48, finalApplicants: 16, finalRate: 0.33 },
  ],
};
