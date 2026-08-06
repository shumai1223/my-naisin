/**
 * 埼玉県 多年度アーカイブ（Λ-4・41県目）。
 *
 * 一次ソース: 埼玉県教育委員会「埼玉県公立高等学校における入学志願（確定）者数」全日制。
 * 令和6年度: https://www.pref.saitama.lg.jp/documents/222625/r6nyuushikakuteisyasu.pdf（2026-08-03追加）
 * 令和7年度: https://www.pref.saitama.lg.jp/documents/241544/r7shigansha0220.pdf
 * 令和8年度: https://www.pref.saitama.lg.jp/documents/268192/r802101430shigansha.pdf
 *
 * **重要な経緯**: 埼玉県は2026-07-29のΛ-4着手時、報道発表で志願確定者数(38,587人)・
 * 倍率(1.10倍)は確認できたが、募集人員相当の公表値（入学許可予定者数）が見つからず一度
 * 見送っていた（Osaka/Aichi/Shizuokaと共に収穫逓減の兆候として記録）。2026-07-31に
 * 県教育委員会公式サイトの学校別入学志願確定者数PDFを直接WebFetch→バイナリ保存→Readで
 * 再取得したところ、募集人員・入学許可予定者数(A)・志願確定者数(B)・倍率(B÷A)が学科区分
 * ごとの「計」行として明記されており、当初の見送り理由が解消できた。
 *
 * quota（本ファイルの各カテゴリのquota）は募集人員そのものではなく**入学許可予定者数(A)**
 * を採用している（公表倍率がB÷Aで算出されているため、rateと整合させるにはAを分母にする
 * 必要がある。募集人員には転編入学者の内数（括弧内）が含まれ、Aはそれを除いた実質募集数）。
 * 令和7年度は「入学志願確定者数」（2月20日時点の確定版）、令和8年度は速報版「入学志願者数」
 * （備考欄に確定版でない旨の記載はないが、最終出願前の数値である可能性がある点は正直に記録）。
 * 学科区分の内訳合計→上位合計（普通科計／専門学科計／全日制合計）は両年度ともsumCategories()
 * で完全一致することを確認済み（__tests__/saitama.test.ts）。定時制課程は東京都と同じ理由で
 * スコープ外（全日制合計に含まれない別集計のため）。
 *
 * 学科区分の名称・構成は年度により変動する（例: 令和7年度の「国際文化科」「外国語科」構成が
 * 令和8年度は「国際関係科」新設＋外国語科の対象校減、令和8年度に「情報科」新設等）。これは
 * 高校の学科改編（八潮南→八潮フロンティア、越生→越生翔桜等の校名変更含む）を反映した
 * 正直な転記であり、集計上の矛盾ではない。
 *
 * 令和3年度（2021年度）: Λ-4深掘り(5年満了県の6年目)で2026-08-06追加。教委公式サイトに
 * 当時のPDFは残っておらず、学科別内訳の一次資料には到達できなかったため
 * granularity: 'grand-total-only'（categories: []）で全日制合計のみを収録する。
 * 一次ソースはリセモム「【高校受験2021】埼玉県公立高、一般選抜の志願状況（確定）」
 * （埼玉県教育委員会発表を引用・入学許可予定者数36,040・志願確定者数39,305・倍率1.09を
 * WebFetchで本文直接確認）。saitama-koko-jyuken.com（個別高校の学科別一覧・概数）でも
 * 学科ごとの倍率のオーダーが同水準であることを副次的に確認したが、この情報源は個別高校の
 * 積み上げが必要かつ数値が概数のため、category-detailとしての採用は見送った。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和3年度（2021年度）: リセモム「【高校受験2021】埼玉県公立高、一般選抜の志願状況（確定）
 * 大宮（理数）2.35倍」（https://resemom.jp/article/2021/02/22/60589.html・埼玉県教育委員会
 * 発表の引用・「確定」時点の数値）をWebFetchで直接確認。全日制合計: 入学許可予定者数36,040・
 * 志願確定者数39,305・倍率1.09（36,040÷39,305=1.0906で記事記載の1.09と一致・検算OK）。
 * 学科別内訳は記事に一部の倍率のみ記載され募集人員・志願者数の学科ごとの内訳が無いため、
 * granularity: 'grand-total-only'として全日制合計のみを収録する。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/02/22/60589.html',
  sourceTitle:
    'リセモム「【高校受験2021】埼玉県公立高、一般選抜の志願状況（確定）大宮（理数）2.35倍」（埼玉県教育委員会発表の引用）',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 普通・専門・総合学科計', quota: 36040, applicants: 39305, rate: 1.09 },
};

/**
 * 令和4年度（2022年度）: 埼玉県教育委員会「令和4年度埼玉県公立高等学校入学者選抜志願確定者数
 * （令和4年2月28日修正）」（報道発表ページ https://www.pref.saitama.lg.jp/f2208/r4nyuushi-jouhou.html
 * から直接リンクされる学科別詳細PDF・全11ページ・2026-08-03取得）。R5と同じ11頁PDFで
 * pages指定読み込みが成功した。各学科区分の「計」行（入学許可予定者数A・志願確定者数B・
 * 倍率B÷A）をそのまま転記。区分合計の積み上げ（quota 36,721・applicants 40,265）が
 * 「全日制 普通・専門・総合学科計」行と完全一致することを手計算でも確認済み
 * （__tests__/saitama.test.ts のcheckYearTotalで機械的にも検証）。R5-R7と同じ19区分構成
 * （「国際文化科」あり・「情報科」「国際関係科」はR8のみ新設なのでまだ無い）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.saitama.lg.jp/documents/196588/r4teisei_sigankakuteisya_2.pdf',
  sourceTitle: '埼玉県教育委員会 令和4年度埼玉県公立高等学校入学者選抜志願確定者数（全日制・令和4年2月28日修正）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科計', quota: 27200, applicants: 31004, rate: 1.14 },
    { label: '農業科計', quota: 795, applicants: 736, rate: 0.93 },
    { label: '工業科計', quota: 2580, applicants: 2412, rate: 0.93 },
    { label: '商業科計', quota: 2484, applicants: 2396, rate: 0.96 },
    { label: '家庭科計', quota: 319, applicants: 291, rate: 0.91 },
    { label: '看護科計', quota: 80, applicants: 95, rate: 1.19 },
    { label: '外国語科計', quota: 319, applicants: 398, rate: 1.25 },
    { label: '美術科計', quota: 120, applicants: 128, rate: 1.07 },
    { label: '音楽科計', quota: 120, applicants: 62, rate: 0.52 },
    { label: '書道科計', quota: 40, applicants: 24, rate: 0.6 },
    { label: '体育科計', quota: 160, applicants: 157, rate: 0.98 },
    { label: '理数科計', quota: 280, applicants: 513, rate: 1.83 },
    { label: '福祉科計', quota: 80, applicants: 39, rate: 0.49 },
    { label: '人文科計', quota: 40, applicants: 20, rate: 0.5 },
    { label: '国際文化科計', quota: 40, applicants: 31, rate: 0.78 },
    { label: '映像芸術科計', quota: 40, applicants: 54, rate: 1.35 },
    { label: '舞台芸術科計', quota: 40, applicants: 38, rate: 0.95 },
    { label: '生物系・環境系計', quota: 238, applicants: 248, rate: 1.04 },
    { label: '総合学科計', quota: 1746, applicants: 1619, rate: 0.93 },
  ],
  grandTotal: { label: '全日制 普通・専門・総合学科計', quota: 36721, applicants: 40265, rate: 1.1 },
};

/**
 * 令和5年度（2023年度）: 埼玉県教育委員会「令和5年度埼玉県公立高等学校における入学志願確定者数」
 * （報道発表ページ https://www.pref.saitama.lg.jp/f2208/r5nyuushi-jouhou.html から直接リンクされる
 * 学科別詳細PDF・全11ページ・2026-08-03取得）。前回セッション(2026-08-03早朝)ではこのPDFの
 * pages指定読み込みがpoppler未導入エラーで失敗していたが、本セッションで再試行したところ
 * `pages: "1-11"`が問題なく成功した（[[fable5-loop-protocol]]の「PDF内部構造により成否が
 * 分かれる」教訓どおり、一律に失敗するわけではなかった）。各学科区分の「計」行（入学許可予定者数A・
 * 志願確定者数B・倍率B÷A）をそのまま転記。区分合計の積み上げ（quota 36,002・applicants 39,921）が
 * 「全日制 普通・専門・総合学科計」行と完全一致することを手計算でも確認済み
 * （__tests__/saitama.test.ts のcheckYearTotalで機械的にも検証）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.saitama.lg.jp/documents/214401/r50217shigankakuteisyasu.pdf',
  sourceTitle: '埼玉県教育委員会 令和5年度埼玉県公立高等学校における入学志願確定者数（全日制）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科計', quota: 26562, applicants: 30879, rate: 1.16 },
    { label: '農業科計', quota: 795, applicants: 725, rate: 0.91 },
    { label: '工業科計', quota: 2580, applicants: 2253, rate: 0.87 },
    { label: '商業科計', quota: 2404, applicants: 2191, rate: 0.91 },
    { label: '家庭科計', quota: 319, applicants: 321, rate: 1.01 },
    { label: '看護科計', quota: 80, applicants: 82, rate: 1.03 },
    { label: '外国語科計', quota: 319, applicants: 383, rate: 1.20 },
    { label: '美術科計', quota: 120, applicants: 150, rate: 1.25 },
    { label: '音楽科計', quota: 120, applicants: 69, rate: 0.58 },
    { label: '書道科計', quota: 40, applicants: 34, rate: 0.85 },
    { label: '体育科計', quota: 160, applicants: 169, rate: 1.06 },
    { label: '理数科計', quota: 280, applicants: 512, rate: 1.83 },
    { label: '福祉科計', quota: 80, applicants: 42, rate: 0.53 },
    { label: '人文科計', quota: 40, applicants: 30, rate: 0.75 },
    { label: '国際文化科計', quota: 40, applicants: 46, rate: 1.15 },
    { label: '映像芸術科計', quota: 40, applicants: 42, rate: 1.05 },
    { label: '舞台芸術科計', quota: 40, applicants: 37, rate: 0.93 },
    { label: '生物系・環境系計', quota: 238, applicants: 299, rate: 1.26 },
    { label: '総合学科計', quota: 1745, applicants: 1657, rate: 0.95 },
  ],
  grandTotal: { label: '全日制 普通・専門・総合学科計', quota: 36002, applicants: 39921, rate: 1.11 },
};

/**
 * 令和6年度（2024年度）: 埼玉県教育委員会「令和6年度埼玉県公立高等学校における入学志願確定者数」
 * （報道発表ページ https://www.pref.saitama.lg.jp/f2208/r6nyuushi-jouhou.html から直接リンクされる
 * 学科別詳細PDF・全9ページ・2026-08-03取得）。各学科区分の「計」行（入学許可予定者数A・
 * 志願確定者数B・倍率B÷A）をそのまま転記。令和7・8年度と異なり「情報科」区分はまだ存在しない
 * （令和8年度に新設・saitama.ts冒頭コメント参照）。区分合計の積み上げ（quota 35,130・
 * applicants 39,414）が「全日制 普通・専門・総合学科計」行と完全一致することを手計算でも
 * 確認済み（__tests__/saitama.test.ts のcheckYearTotalで機械的にも検証）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.saitama.lg.jp/documents/222625/r6nyuushikakuteisyasu.pdf',
  sourceTitle: '埼玉県教育委員会 令和6年度埼玉県公立高等学校における入学志願確定者数（全日制）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科計', quota: 26007, applicants: 30146, rate: 1.16 },
    { label: '農業科計', quota: 795, applicants: 753, rate: 0.95 },
    { label: '工業科計', quota: 2382, applicants: 2124, rate: 0.89 },
    { label: '商業科計', quota: 2285, applicants: 2406, rate: 1.05 },
    { label: '家庭科計', quota: 319, applicants: 310, rate: 0.97 },
    { label: '看護科計', quota: 80, applicants: 91, rate: 1.14 },
    { label: '外国語科計', quota: 319, applicants: 427, rate: 1.34 },
    { label: '美術科計', quota: 120, applicants: 155, rate: 1.29 },
    { label: '音楽科計', quota: 120, applicants: 91, rate: 0.76 },
    { label: '書道科計', quota: 40, applicants: 41, rate: 1.03 },
    { label: '体育科計', quota: 160, applicants: 158, rate: 0.99 },
    { label: '理数科計', quota: 280, applicants: 479, rate: 1.71 },
    { label: '福祉科計', quota: 80, applicants: 34, rate: 0.43 },
    { label: '人文科計', quota: 40, applicants: 47, rate: 1.18 },
    { label: '国際文化科計', quota: 40, applicants: 60, rate: 1.50 },
    { label: '映像芸術科計', quota: 40, applicants: 50, rate: 1.25 },
    { label: '舞台芸術科計', quota: 40, applicants: 30, rate: 0.75 },
    { label: '生物系・環境系計', quota: 238, applicants: 259, rate: 1.09 },
    { label: '総合学科計', quota: 1745, applicants: 1753, rate: 1.00 },
  ],
  grandTotal: { label: '全日制 普通・専門・総合学科計', quota: 35130, applicants: 39414, rate: 1.12 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.saitama.lg.jp/documents/241544/r7shigansha0220.pdf',
  sourceTitle: '埼玉県教育委員会 令和7年度埼玉県公立高等学校における入学志願確定者数（全日制）',
  fetchedAt: '2026-07-31',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科計', quota: 25877, applicants: 29983, rate: 1.16 },
    { label: '農業科計', quota: 796, applicants: 641, rate: 0.81 },
    { label: '工業科計', quota: 2382, applicants: 2112, rate: 0.89 },
    { label: '商業科計', quota: 2285, applicants: 2151, rate: 0.94 },
    { label: '家庭科計', quota: 319, applicants: 304, rate: 0.95 },
    { label: '看護科計', quota: 80, applicants: 95, rate: 1.19 },
    { label: '外国語科計', quota: 319, applicants: 384, rate: 1.20 },
    { label: '美術科計', quota: 120, applicants: 132, rate: 1.10 },
    { label: '音楽科計', quota: 120, applicants: 66, rate: 0.55 },
    { label: '書道科計', quota: 40, applicants: 40, rate: 1.00 },
    { label: '体育科計', quota: 160, applicants: 186, rate: 1.16 },
    { label: '理数科計', quota: 280, applicants: 482, rate: 1.72 },
    { label: '福祉科計', quota: 80, applicants: 21, rate: 0.26 },
    { label: '人文科計', quota: 40, applicants: 29, rate: 0.73 },
    { label: '国際文化科計', quota: 40, applicants: 38, rate: 0.95 },
    { label: '映像芸術科計', quota: 40, applicants: 38, rate: 0.95 },
    { label: '舞台芸術科計', quota: 40, applicants: 33, rate: 0.83 },
    { label: '生物系・環境系計', quota: 238, applicants: 265, rate: 1.11 },
    { label: '総合学科計', quota: 1745, applicants: 1587, rate: 0.91 },
  ],
  grandTotal: { label: '全日制 普通・専門・総合学科計', quota: 35001, applicants: 38587, rate: 1.10 },
};

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.saitama.lg.jp/documents/268192/r802101430shigansha.pdf',
  sourceTitle: '埼玉県教育委員会 令和8年度埼玉県公立高等学校における入学志願者数（全日制・速報版）',
  fetchedAt: '2026-07-31',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科計', quota: 25517, applicants: 27878, rate: 1.09 },
    { label: '農業科計', quota: 797, applicants: 644, rate: 0.81 },
    { label: '工業科計', quota: 2343, applicants: 1991, rate: 0.85 },
    { label: '商業科計', quota: 2206, applicants: 2013, rate: 0.91 },
    { label: '家庭科計', quota: 319, applicants: 302, rate: 0.95 },
    { label: '看護科計', quota: 80, applicants: 88, rate: 1.10 },
    { label: '外国語科計', quota: 240, applicants: 277, rate: 1.15 },
    { label: '美術科計', quota: 120, applicants: 167, rate: 1.39 },
    { label: '音楽科計', quota: 120, applicants: 89, rate: 0.74 },
    { label: '書道科計', quota: 40, applicants: 28, rate: 0.70 },
    { label: '体育科計', quota: 160, applicants: 181, rate: 1.13 },
    { label: '理数科計', quota: 280, applicants: 425, rate: 1.52 },
    { label: '情報科計', quota: 80, applicants: 99, rate: 1.24 },
    { label: '福祉科計', quota: 80, applicants: 27, rate: 0.34 },
    { label: '人文科計', quota: 40, applicants: 36, rate: 0.90 },
    { label: '国際関係科計', quota: 159, applicants: 157, rate: 0.99 },
    { label: '映像芸術科計', quota: 40, applicants: 43, rate: 1.08 },
    { label: '舞台芸術科計', quota: 40, applicants: 44, rate: 1.10 },
    { label: '生物系・環境系計', quota: 238, applicants: 253, rate: 1.06 },
    { label: '総合学科計', quota: 1704, applicants: 1522, rate: 0.89 },
  ],
  grandTotal: { label: '全日制 普通・専門・総合学科計', quota: 34603, applicants: 36264, rate: 1.05 },
};

/**
 * 令和2年度（2020年度）: 2026-08-06にΛ-4深掘り(7年目)で追加。R3と同型のリセモム確定記事
 * （2020-02-25「【高校受験2020】埼玉県公立高入試、志願状況・倍率（確定）県立浦和（普通）
 * 1.49倍」・https://resemom.jp/article/2020/02/25/54946.html）をWebFetchで直接確認。「全日制の
 * 普通・専門・総合学科の合計で、入学許可予定者数3万6,880人に対し、志願者数は4万1,393人で、
 * 倍率は1.12倍だった」と本文に明記（41393/36880=1.1224…≈1.12で整合）。R3(36,040)と近い規模で
 * スコープ継続性を確認。R3と同じ理由でgrand-total-only（学科別内訳は本記事に記載なし）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/02/25/54946.html',
  sourceTitle:
    'リセモム「【高校受験2020】埼玉県公立高入試、志願状況・倍率（確定）県立浦和（普通）1.49倍」（埼玉県教育委員会 令和2年度入学志願確定者数の発表を引用）',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 普通・専門・総合学科計', quota: 36880, applicants: 41393, rate: 1.12 },
};

export const SAITAMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'saitama',
  years: [REIWA_2, REIWA_3, REIWA_4, REIWA_5, REIWA_6, REIWA_7, REIWA_8],
};
