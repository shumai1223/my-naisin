/**
 * 千葉県 県立高等学校 入学者選抜日程（T-Y12・2県目）。
 *
 * 一次ソース: 千葉県教育庁教育振興部学習指導課「令和8年度千葉県公立高等学校入学者選抜実施要項
 * 『1 一般入学者選抜』」
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/r8ippanyoukou.html
 * （関連PDF: https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/02r8ippan.pdf）
 * （2026-09-04にWebFetchで内容確認・同日WebSearchで学力検査日2/17-18・合格発表3/3を
 * 独立した二次情報源（市進高校受験情報ナビ・よみうり進学メディア等の複数の教育系メディア記事）
 * と突合し一致を確認）。
 *
 * ⚠️「学力検査（本検査）実施日」は2日間（2/17・2/18）にまたがるが、公表資料上は「連続する
 * 1つの検査」として扱われているため、startDate/endDateで期間表現する（ibarakiのような
 * 単日複数イベントの並列とは性質が異なる）。
 *
 * 令和9年度（2027年度）分はこのページにはまだ公表されていない（2026-09-04時点）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const CHIBA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'chiba',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/r8ippanyoukou.html',
      docTitle: '令和8年度千葉県公立高等学校入学者選抜実施要項「1 一般入学者選抜」',
      fetchedAt: '2026-09-04',
      events: [
        { label: '志願者情報登録・入学検査料納付期間', startDate: '2026-01-13', endDate: '2026-02-02' },
        { label: '出願書類提出期間', startDate: '2026-02-03', endDate: '2026-02-05' },
        { label: '志願・希望変更受付期間', startDate: '2026-02-10', endDate: '2026-02-12' },
        { label: '学力検査（本検査）実施日', startDate: '2026-02-17', endDate: '2026-02-18' },
        { label: '追検査受検願提出期間', startDate: '2026-02-20', endDate: '2026-02-24' },
        { label: '追検査実施日', startDate: '2026-02-26' },
        { label: '合格発表', startDate: '2026-03-03', note: '9:00' },
      ],
    },
  ],
};
