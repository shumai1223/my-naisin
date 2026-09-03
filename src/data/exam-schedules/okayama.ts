/**
 * 岡山県 県立高等学校 入学者選抜日程（T-Y12・17県目）。
 *
 * 一次ソース: 岡山県教育委員会「令和8年度岡山県立中学校及び岡山県立中等教育学校並びに
 * 岡山県立高等学校入学者選抜日程について」（令和7年3月14日付・別添p2）
 * https://www.pref.okayama.jp/uploaded/life/1054600_10219024_misc.pdf
 * （掲載元ページ: https://www.pref.okayama.jp/site/16/913706.html）
 *
 * ⚠️このPDFはToUnicode欠落があった（他県と同型のブロッカー）が2ページのみでビジョン解析で
 * 軽量に完了。
 *
 * 一般入学者選抜の学力検査（3/10）・合格者の発表（3/18）はWebSearchで得た独立した二次情報源
 * （塾業界メディア記事）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 岡山県は「特別入学者選抜」（2月・学力検査+面接等）と「一般入学者選抜」（3月・主選抜）の
 * 2段階選抜。kumamotoと同様、特別入学者選抜の「合格者の発表」は一般入学者選抜と同日
 * （3/18）にまとめて公表される設計（「選抜結果の通知」2/13は別途行われる）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const OKAYAMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'okayama',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.okayama.jp/uploaded/life/1054600_10219024_misc.pdf',
      docTitle: '令和8年度岡山県立高等学校入学者選抜日程について',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特別入学者選抜 出願の期間', startDate: '2026-01-20', endDate: '2026-01-22' },
        { label: '特別入学者選抜 学力検査', startDate: '2026-02-04' },
        { label: '特別入学者選抜 選抜結果の通知', startDate: '2026-02-13' },
        { label: '特別入学者選抜 合格者の発表', startDate: '2026-03-18' },
        { label: '一般入学者選抜（全日制・定時制） 出願の期間', startDate: '2026-02-24', endDate: '2026-02-26' },
        { label: '一般入学者選抜（全日制・定時制） 学力検査', startDate: '2026-03-10' },
        { label: '一般入学者選抜（全日制・定時制） 面接・実技', startDate: '2026-03-11' },
        { label: '一般入学者選抜（全日制・定時制） 合格者の発表', startDate: '2026-03-18' },
      ],
    },
  ],
};
