/**
 * 山形県 公立高等学校 入学者選抜日程（T-Y12・24県目）。
 *
 * 一次ソース: 山形県教育委員会「令和8年度山形県公立高等学校入学者選抜実施要項」内
 * 「令和8年度山形県公立高等学校入学者選抜日程」（フローチャート形式の日程図・p3）
 * https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf
 *
 * ⚠️このPDFはp2（別の一覧表）がフォント欠落（Symbol/ArialUnicode）でビジョン解析でも白紙表示に
 * なる罠だったが、p3の日程フローチャートは正常にレンダリングされ全項目を一次ソースから直接
 * 転記できた（akitaと同型：白紙ページに遭遇しても諦めず別ページを試すこと）。
 *
 * 山形県は令和8年度から前期（特色）選抜（A日程/B日程の2回受検機会）＋後期（一般）選抜
 * （本検査は学力検査と適性検査を別日実施）という他県に無い構造。合格発表は前期・後期・
 * 連携型入学者選抜すべて共通で3/17に実施される。通信制の課程は別トラックのため対象外。
 *
 * 主要日程（前期A日程検査1/20・後期本検査学力検査3/7・合格発表3/17等）はWebSearchで得た
 * 2つの独立した二次情報源（地元学習塾サイト・リセマム）と完全一致を確認済み（2026-09-04）。
 * 追検査が2日間（学力検査3/12・適性検査3/13）にわたる点は一方の二次情報源で「3/12のみ」と
 * 簡略化されていたが、一次ソースで両日程を確認し確定した。
 *
 * ⚠️令和9年度分（T-Y11F §5順序#2）: 一次ソース「令和9年度山形県立高等学校入学者選抜基本方針」
 * https://www.pref.yamagata.jp/documents/49031/r09kihonnhousinn.pdf
 * このPDFもR8同型のフォント欠落でpdftotextは失敗したが、pdftoppm 200dpi+Read toolのビジョン
 * 解析で全項目を直接転記できた。R9は基本方針レベルの公表のみで、R8の「実施要項」相当の詳細な
 * 日程フローチャート（志願受付期間・前期A/B結果通知日・追検査適性検査日等）はこの資料には
 * 含まれておらず、確認できたのは前期A日程検査・前期B日程検査・後期本検査（学力検査）・
 * 後期追検査（学力検査）・合格者発表の5項目のみ（Y-0: 推測で埋めず確認できた項目のみ収録）。
 * WebSearchで得た独立した二次情報源（塾選ジャーナル・地元高校受験対策サイト）と完全一致を
 * 確認済み（2026-09-08）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const YAMAGATA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'yamagata',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf',
      docTitle: '令和8年度山形県公立高等学校入学者選抜日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期（特色）選抜 志願受付', startDate: '2026-01-05', endDate: '2026-01-08', note: '締切は12:00' },
        { label: '前期（特色）選抜 A日程検査', startDate: '2026-01-20' },
        { label: '前期（特色）選抜 A日程結果通知', startDate: '2026-01-29' },
        { label: '前期（特色）選抜 B日程検査', startDate: '2026-02-03' },
        { label: '前期（特色）選抜 B日程結果通知', startDate: '2026-02-12' },
        { label: '後期（一般）選抜 志願受付', startDate: '2026-02-18', endDate: '2026-02-24', note: '締切は12:00' },
        { label: '後期（一般）選抜 本検査（学力検査）', startDate: '2026-03-07' },
        { label: '後期（一般）選抜 本検査（適性検査）', startDate: '2026-03-08' },
        { label: '後期（一般）選抜 追検査（学力検査）', startDate: '2026-03-12' },
        { label: '後期（一般）選抜 追検査（適性検査）', startDate: '2026-03-13' },
        { label: '合格発表', startDate: '2026-03-17', note: '前期・後期・連携型入学者選抜とも共通' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.yamagata.jp/documents/49031/r09kihonnhousinn.pdf',
      docTitle: '令和9年度山形県立高等学校入学者選抜基本方針',
      fetchedAt: '2026-09-08',
      events: [
        { label: '前期（特色）選抜 A日程検査', startDate: '2027-01-19', note: '各校がA日程・B日程いずれかを選択して実施' },
        { label: '前期（特色）選抜 B日程検査', startDate: '2027-02-02', note: '各校がA日程・B日程いずれかを選択して実施' },
        { label: '後期（一般）選抜 本検査（学力検査）', startDate: '2027-03-07' },
        { label: '後期（一般）選抜 追検査（学力検査）', startDate: '2027-03-12' },
        { label: '合格者発表', startDate: '2027-03-17' },
      ],
    },
  ],
};
