/**
 * 埼玉県 公立高等学校 入学者選抜日程（T-Y12・4県目）。
 *
 * 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校入学者選抜の日程」
 * https://www.pref.saitama.lg.jp/documents/268192/r8hiniti.pdf
 * （掲載元ページ: https://www.pref.saitama.lg.jp/f2208/r8nyuushi-jouhou.html）
 *
 * ⚠️このPDFはpdftotextで文字が一切抽出できない（pdffontsではuni=yesだが実際の
 * ToUnicodeマップが機能しない・tokyo/osaka等と同型のブロッカー）ため、pdftoppm 200dpiで
 * レンダリングしRead toolのビジョン解析で1ページ全体を直接転記した。
 * WebSearchで得た要約（塾業界メディア記事）と全項目が完全一致することを確認済み（2026-09-04）。
 *
 * 「出願書類等の提出期間」は2/13(金・郵送のみ)・2/16(月)・2/17(火)の3日で、2/14-15は
 * 土日のため実質連続する営業日区間。startDate/endDateの期間表現で収録し、2/13が郵送限定である
 * 旨はnoteに残す。「志願先変更期間」も同様に2/18・2/19の連続2日。
 *
 * 令和9年度（2027年度）分はまだ公表されていない（2026-09-04時点）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const SAITAMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'saitama',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.saitama.lg.jp/documents/268192/r8hiniti.pdf',
      docTitle: '令和8年度埼玉県公立高等学校入学者選抜の日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '出願入力期間（インターネットを活用した出願）', startDate: '2026-01-27', endDate: '2026-02-10' },
        { label: '出願書類等の提出期間', startDate: '2026-02-13', endDate: '2026-02-17', note: '2/13は郵送による提出のみ' },
        { label: '志願先変更期間', startDate: '2026-02-18', endDate: '2026-02-19' },
        { label: '学力検査', startDate: '2026-02-26' },
        { label: '実技検査（芸術系学科等）、面接（一部の学校）', startDate: '2026-02-27' },
        { label: '追検査', startDate: '2026-03-03', note: 'インフルエンザ罹患等やむを得ない事情により学力検査を受検できなかった志願者が対象' },
        { label: '入学許可候補者発表', startDate: '2026-03-06' },
      ],
    },
  ],
};
