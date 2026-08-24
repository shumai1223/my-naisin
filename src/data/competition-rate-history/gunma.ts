/**
 * 群馬県 多年度アーカイブ（Λ-4・13県目）。
 *
 * 一次ソース: 群馬県教育委員会「令和７年度群馬県公立高等学校入学者選抜　全日制課程選抜、
 * フレックススクール選抜志願状況」（テキスト埋め込み型PDF・pdftotext -layout相当で明瞭抽出）。
 * https://www.pref.gunma.jp/uploaded/attachment/649962.pdf
 *
 * 既存Y-6 gunma.ts（令和8年度・第２回志願先変更後）と同一の資料シリーズ。PDF末尾の
 * 「公立全日制・ﾌﾚｯｸｽｽｸｰﾙ合計」行を直接転記: 学校別募集定員(A)列=11,435（括弧内11,561は
 * 太田市立太田高校の内部進学者102人＋利根商業高校の県外募集24人を含めた学校別定員合計で、
 * 倍率算出の分母には使われていないため不採用。11561-11435=126=102+24で内部整合を確認済み）。
 * 学校別志願者数(D)列=11,525・倍率(D/A)=1.01（11525/11435=1.0079…≈1.01で整合）。
 * 定時制課程選抜・連携型選抜実施校志願状況は別表のためスコープ外（Y-6と同じ理由）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 同一資料シリーズの令和8年度版「全日制課程選抜・フレックススクール選抜
 * 志願状況」（教委公式ページ754285.htmlの関連資料から発見・全2頁・テキスト埋め込み型PDF）を
 * 直接転記。末尾「公立全日制・ﾌﾚｯｸｽｽｸｰﾙ合計」行の学校別募集定員(A)=11,153（括弧内11,279は
 * 市立太田・利根商業の内部進学者/県外募集を含めた学科等別定員合計でR6/R7と同じ理由により
 * 不採用・11279-11153=126=102+24で内部整合を確認済み）・学校別志願者数(D)=10,800・
 * 学校別倍率(D/A)=0.97（10800/11153=0.9683…≈0.97で整合）。定時制課程選抜・連携型選抜実施校
 * 志願状況は別表のためR6/R7と同じ理由でスコープ外。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/688694.pdf',
  sourceTitle: '群馬県教育委員会 令和8年度群馬県公立高等学校入学者選抜 全日制課程選抜・フレックススクール選抜志願状況',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立全日制・フレックススクール合計', quota: 11153, applicants: 10800, rate: 0.97 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/649962.pdf',
  sourceTitle: '群馬県教育委員会 令和7年度群馬県公立高等学校入学者選抜 全日制課程選抜、フレックススクール選抜志願状況',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立全日制・フレックススクール合計', quota: 11435, applicants: 11525, rate: 1.01 },
};

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版「第２回志願先変更後の全日制課程選抜、
 * フレックススクール選抜志願状況」（群馬県公式サイトのR6志願状況ページから発見・全3頁・
 * テキスト埋め込み型PDF）を直接転記。末尾「公立全日制・ﾌﾚｯｸｽｽｸｰﾙ合計」行の学校別募集定員(A)
 * =11,757（括弧内11,889は市立太田・利根商業の内部進学者/県外募集を含めた学科等別定員合計で
 * R7と同じ理由により不採用）・学校別志願者数(D)=11,744・学校別倍率(D/A)=1.00
 * （11744/11757=0.9989…≈1.00で整合）。定時制課程選抜・連携型選抜実施校志願状況は別表のため
 * R7と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/616847.pdf',
  sourceTitle: '群馬県教育委員会 令和6年度群馬県公立高等学校入学者選抜 第2回志願先変更後の全日制課程選抜、フレックススクール選抜志願状況',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立全日制・フレックススクール合計', quota: 11757, applicants: 11744, rate: 1.0 },
};

/**
 * ⚠️令和3〜5年度は選抜制度が異なる（2026-08-06判明）: 令和6年度以降は「全日制課程選抜」に
 * 一本化されているが、令和3〜5年度は前期選抜（推薦系）＋後期選抜（学力検査）の二段階制度
 * だった。教委公式PDFの「学校別募集定員」列は学校の全体定員（前期選抜での合格者数を含む）
 * であり、実際に発表される倍率は前期選抜後に残った「後期学校別募集人員」に対する後期選抜
 * 志願者数の比率で計算されている。R6以降の「全日制課程選抜合計」（1段階制の全体倍率）とは
 * 算出方法が異なるため、quotaには後期募集人員（残席数）を採用し、labelに「後期選抜」と
 * 明記して単純な経年比較を避ける（Y-0憲法①検証可能性の精神）。3年度とも教委公式PDFを
 * Read toolで直読みし、志願者数÷後期募集人員が発表倍率と整合することを確認済み。令和3年度は
 * リセモム記事（募集定員6,358・志願者6,615・倍率1.04）とも完全一致し独立クロスチェック済み。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/146435.pdf',
  sourceTitle: '群馬県教育委員会 令和5年度群馬県公立高等学校入学者選抜 志願先変更後の全日制課程・フレックススクール後期選抜志願状況',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立全日制・フレックススクール 後期選抜（後期募集人員に対する倍率）', quota: 6344, applicants: 6276, rate: 0.99 },
};

const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/13778.pdf',
  sourceTitle: '群馬県教育委員会 令和4年度群馬県公立高等学校入学者選抜 志願先変更後の全日制課程・フレックススクール後期選抜志願状況',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立全日制・フレックススクール 後期選抜（後期募集人員に対する倍率）', quota: 6453, applicants: 6419, rate: 0.99 },
};

/** リセモム記事(https://resemom.jp/article/2021/03/05/60812.html)とも完全一致・独立2ソース。 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/13707.pdf',
  sourceTitle: '群馬県教育委員会 令和3年度群馬県公立高等学校入学者選抜 志願先変更後の全日制課程・フレックススクール後期選抜志願状況',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立全日制・フレックススクール 後期選抜（後期募集人員に対する倍率）', quota: 6358, applicants: 6615, rate: 1.04 },
};

/**
 * ⚠️2026-08-24調査(令和2年度・見送り): リセモム記事(2020-02-05付「【高校受験2020】群馬県公立高校
 * 入試、前期選抜の志願状況・倍率（確定）」https://resemom.jp/article/2020/02/05/54628.html)で
 * **前期選抜**の確定値(前期募集人員5,757・志願者12,197・倍率2.12)を発見したが、隣接するR3-R5(群馬は令和6年度から
 * 前期・後期の二段階選抜を単一選抜に統合しており、R6-R8は統合後の「合計」値・R3-R5は統合前の
 * **後期選抜**の値、を採用している。R3: quota6,358・applicants6,615・rate1.04)はいずれも
 * **後期選抜**の値であり、統合前の年度であるR2もR3-R5と揃えて後期選抜の値を使うべきだが、
 * 前期選抜の値しか見つかっておらず年度間の選抜区分が揃わない。後期選抜の令和2年度分は複数の
 * WebSearch(記事ID推測・関連記事探索含む)でも
 * 発見できず、公式サイト(pref.gunma.jp)も令和4年度より古い情報を保持していない。Wayback Machineは
 * この環境のツールから到達不可(既知の制約)。**前期選抜と後期選抜は別の選抜区分で単純に混在させると
 * 既存年度との整合性が崩れるため、後期選抜の値が見つかるまでR2追加を見送る**(捏造ゼロ原則)。
 */
export const GUNMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'gunma',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
