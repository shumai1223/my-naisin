/**
 * 佐賀県 公立高等学校 倍率パイプラインα（Y-6・19県目・全日制完全達成／掛-1・R7多年度対応済）。
 *
 * 一次ソース: 佐賀県教育委員会「令和8年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後）」
 * （訂正版・2月25日公表・全3ページ）。
 *
 * ⚠️罠（版違い）: 最初に2月17日時点版（本文に「志願変更後の確定値については、2月25日に改めて
 * お知らせします」と明記）を誤って取得しかけたが、この記述に気づき2月25日訂正版に切り替えた
 * （他県で確立済みの「複数版の中から正しい確定版を選ぶ」教訓の再適用）。
 *
 * ⚠️佐賀県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重・富山・石川・福井・愛媛・徳島・香川と同型の
 * 高信頼度技法）。列は[募集定員(a) / 一般選抜募集人員(c＝本ファイルのquota) / 志願者数変更前(e) /
 * 志願変更(出た数g／入った数h) / 志願者数変更後(k＝applicants) / 志願倍率(k/c)]が学科別・学校別の
 * 2階層で構成される。
 *
 * ⚠️罠（くくり募集10組）: 文末の凡例に9組（神埼の普通科＋こども教育進学コース、佐賀東の普通科＋
 * スポーツ科、唐津西の普通科・地域探究進学コース・学際探究進学コース、伊万里の普通科＋MIRAI進学科、
 * 白石の商業科＋情報ビジネス科、鹿島の普通科（文理探求＋未来探求進学コース）、鳥栖商業の商業科＋
 * 流通経済科、佐賀商業の商業科＋グローバルビジネス科、唐津商業の商業科＋会計科）が明記されている
 * が、嬉野「電気科、建築科」は凡例に無いにもかかわらず学科名自体が読点で連結表記され単一の
 * 募集人員行として掲載されており、データ構造から10組目のくくり募集と判定した（凡例の記載漏れを
 * 学科名の表記パターンで補完検出）。複数学科がまとめて1行に圧縮されるレイアウトでは、学校別合計
 * 列との整合（内訳の合計＝学校別合計）を機械的に確認して各行の帰属を確定した。
 *
 * 機械集計（quota4,212・applicants4,191・倍率1.00、32校71レコード）が「合計」行と完全一致した
 * （初回転記で一致・再修正なし）。定時制課程は他県と同じ理由でスコープ外。
 *
 * ⚠️掛-1（R7追加時に判明）: R7（令和7年度）とR8を突合したところ2校で新設学科を検出した。
 * いずれもWebSearchで公式発表を裏取り済みの実際の学科改編で誤読ではない: ①神埼「こども教育進学
 * コース」はR8（2026年度）新設（佐賀新聞記事で確認・R7は普通科単独120名）。②唐津青翔
 * 「eスポーツ学科」もR8新設（全日制公立高校として全国初・2025年6月佐賀県教育委員会公表）。
 * この2件を除けばR7/R8で学校名+学科名は完全一致（70レコード＝R8の71からeスポーツ学科の1件少ない）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const SAGA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'saga',
  sources: [
    {
      url: 'https://www.pref.saga.lg.jp/kyouiku/kiji003118261/3_118261_381978_up_jpwwphq6.pdf',
      docTitle: '佐賀県教育委員会 令和8年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後・訂正版）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.pref.saga.lg.jp/kyouiku/kiji003111936/3_111936_345623_up_nh8p0xkw.pdf',
      docTitle: '佐賀県教育委員会 令和7年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（32校71レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '「合計」行（quota4,212・applicants4,191・倍率1.00）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 32, quota: 4212, finalApplicants: 4191, finalRate: 1.0 }],
  records: [
    { schoolName: '鳥栖', department: '普通科', quota: 117, finalApplicants: 125, finalRate: 1.07 },
    { schoolName: '三養基', department: '普通科', quota: 178, finalApplicants: 183, finalRate: 1.03 },
    { schoolName: '神埼', department: '普通科・こども教育進学コース（くくり募集）', quota: 84, finalApplicants: 54, finalRate: 0.64 },
    { schoolName: '佐賀東', department: '普通科・スポーツ科（くくり募集）', quota: 184, finalApplicants: 130, finalRate: 0.71 },
    { schoolName: '佐賀西', department: '普通科', quota: 280, finalApplicants: 337, finalRate: 1.2 },
    { schoolName: '佐賀北', department: '普通科', quota: 197, finalApplicants: 314, finalRate: 1.59 },
    { schoolName: '佐賀北', department: '芸術科', quota: 19, finalApplicants: 24, finalRate: 1.26 },
    { schoolName: '致遠館', department: '普通科', quota: 64, finalApplicants: 91, finalRate: 1.42 },
    { schoolName: '致遠館', department: '理数科', quota: 60, finalApplicants: 68, finalRate: 1.13 },
    { schoolName: '小城', department: '普通科', quota: 181, finalApplicants: 228, finalRate: 1.26 },
    { schoolName: '唐津東', department: '普通科', quota: 123, finalApplicants: 143, finalRate: 1.16 },
    {
      schoolName: '唐津西',
      department: '普通科・地域探究進学コース・学際探究進学コース（くくり募集）',
      quota: 115,
      finalApplicants: 98,
      finalRate: 0.85,
    },
    { schoolName: '厳木', department: '普通科（総合評価枠）', quota: 32, finalApplicants: 36, finalRate: 1.13 },
    { schoolName: '厳木', department: '普通科（重点評価枠）', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '伊万里', department: '普通科・MIRAI進学科（くくり募集）', quota: 133, finalApplicants: 117, finalRate: 0.88 },
    { schoolName: '武雄', department: '普通科', quota: 117, finalApplicants: 122, finalRate: 1.04 },
    { schoolName: '白石', department: '普通科', quota: 102, finalApplicants: 81, finalRate: 0.79 },
    { schoolName: '白石', department: '商業科・情報ビジネス科（くくり募集）', quota: 66, finalApplicants: 55, finalRate: 0.83 },
    {
      schoolName: '鹿島',
      department: '普通科・文理探求進学コース・未来探求進学コース（くくり募集）',
      quota: 156,
      finalApplicants: 63,
      finalRate: 0.4,
    },
    { schoolName: '鹿島', department: '商業科', quota: 35, finalApplicants: 28, finalRate: 0.8 },
    { schoolName: '鹿島', department: '食品調理科', quota: 22, finalApplicants: 15, finalRate: 0.68 },
    { schoolName: '太良', department: '普通科（総合評価枠）', quota: 29, finalApplicants: 19, finalRate: 0.66 },
    { schoolName: '太良', department: '普通科（重点評価枠）', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '牛津', department: '生活経営科', quota: 23, finalApplicants: 16, finalRate: 0.7 },
    { schoolName: '牛津', department: '服飾デザイン科', quota: 26, finalApplicants: 9, finalRate: 0.35 },
    { schoolName: '牛津', department: '食品調理科', quota: 18, finalApplicants: 23, finalRate: 1.28 },
    { schoolName: '高志館', department: '食品流通科', quota: 38, finalApplicants: 30, finalRate: 0.79 },
    { schoolName: '高志館', department: '園芸科学科', quota: 36, finalApplicants: 28, finalRate: 0.78 },
    { schoolName: '高志館', department: '環境緑地科', quota: 35, finalApplicants: 12, finalRate: 0.34 },
    { schoolName: '唐津南', department: '生産技術科', quota: 19, finalApplicants: 18, finalRate: 0.95 },
    { schoolName: '唐津南', department: '食品流通科', quota: 21, finalApplicants: 24, finalRate: 1.14 },
    { schoolName: '唐津南', department: '生活教養科', quota: 23, finalApplicants: 26, finalRate: 1.13 },
    { schoolName: '伊万里実業', department: '生物科学科', quota: 29, finalApplicants: 24, finalRate: 0.83 },
    { schoolName: '伊万里実業', department: '森林環境科', quota: 16, finalApplicants: 15, finalRate: 0.94 },
    { schoolName: '伊万里実業', department: 'フードビジネス科', quota: 26, finalApplicants: 24, finalRate: 0.92 },
    { schoolName: '伊万里実業', department: '商業科', quota: 26, finalApplicants: 26, finalRate: 1.0 },
    { schoolName: '伊万里実業', department: '情報処理科', quota: 25, finalApplicants: 16, finalRate: 0.64 },
    { schoolName: '佐賀農業', department: '農業科学科', quota: 23, finalApplicants: 29, finalRate: 1.26 },
    { schoolName: '佐賀農業', department: '食品科学科', quota: 30, finalApplicants: 24, finalRate: 0.8 },
    { schoolName: '佐賀農業', department: '環境工学科', quota: 25, finalApplicants: 28, finalRate: 1.12 },
    { schoolName: '鳥栖工業', department: '機械科', quota: 46, finalApplicants: 50, finalRate: 1.09 },
    { schoolName: '鳥栖工業', department: '電子機械科', quota: 29, finalApplicants: 26, finalRate: 0.9 },
    { schoolName: '鳥栖工業', department: '電気科', quota: 23, finalApplicants: 22, finalRate: 0.96 },
    { schoolName: '鳥栖工業', department: '建築科', quota: 39, finalApplicants: 31, finalRate: 0.79 },
    { schoolName: '鳥栖工業', department: '土木科', quota: 12, finalApplicants: 16, finalRate: 1.33 },
    { schoolName: '佐賀工業', department: '機械科', quota: 29, finalApplicants: 37, finalRate: 1.28 },
    { schoolName: '佐賀工業', department: '機械システム科', quota: 28, finalApplicants: 28, finalRate: 1.0 },
    { schoolName: '佐賀工業', department: '電気科', quota: 34, finalApplicants: 46, finalRate: 1.35 },
    { schoolName: '佐賀工業', department: '電子科', quota: 37, finalApplicants: 43, finalRate: 1.16 },
    { schoolName: '佐賀工業', department: '情報システム科', quota: 33, finalApplicants: 44, finalRate: 1.33 },
    { schoolName: '佐賀工業', department: '建築科', quota: 35, finalApplicants: 40, finalRate: 1.14 },
    { schoolName: '唐津工業', department: '機械科', quota: 32, finalApplicants: 39, finalRate: 1.22 },
    { schoolName: '唐津工業', department: '電気科', quota: 39, finalApplicants: 32, finalRate: 0.82 },
    { schoolName: '唐津工業', department: '建築科', quota: 38, finalApplicants: 28, finalRate: 0.74 },
    { schoolName: '唐津工業', department: '土木科', quota: 39, finalApplicants: 14, finalRate: 0.36 },
    { schoolName: '有田工業', department: '機械科', quota: 36, finalApplicants: 35, finalRate: 0.97 },
    { schoolName: '有田工業', department: '電気科', quota: 35, finalApplicants: 32, finalRate: 0.91 },
    { schoolName: '有田工業', department: 'セラミック科', quota: 22, finalApplicants: 18, finalRate: 0.82 },
    { schoolName: '有田工業', department: 'デザイン科', quota: 24, finalApplicants: 17, finalRate: 0.71 },
    { schoolName: '嬉野', department: '機械科', quota: 23, finalApplicants: 24, finalRate: 1.04 },
    { schoolName: '嬉野', department: '電気科・建築科（くくり募集）', quota: 25, finalApplicants: 20, finalRate: 0.8 },
    { schoolName: '嬉野', department: '総合学科', quota: 64, finalApplicants: 38, finalRate: 0.59 },
    { schoolName: '鳥栖商業', department: '商業科・流通経済科（くくり募集）', quota: 105, finalApplicants: 84, finalRate: 0.8 },
    { schoolName: '鳥栖商業', department: '情報管理科', quota: 34, finalApplicants: 37, finalRate: 1.09 },
    { schoolName: '佐賀商業', department: '商業科・グローバルビジネス科（くくり募集）', quota: 144, finalApplicants: 186, finalRate: 1.29 },
    { schoolName: '佐賀商業', department: '情報処理科', quota: 30, finalApplicants: 35, finalRate: 1.17 },
    { schoolName: '唐津商業', department: '商業科・会計科（くくり募集）', quota: 140, finalApplicants: 158, finalRate: 1.13 },
    { schoolName: '神埼清明', department: '総合学科', quota: 66, finalApplicants: 82, finalRate: 1.24 },
    { schoolName: '多久', department: '総合学科', quota: 103, finalApplicants: 80, finalRate: 0.78 },
    { schoolName: '唐津青翔', department: '総合学科', quota: 43, finalApplicants: 39, finalRate: 0.91 },
    { schoolName: '唐津青翔', department: 'eスポーツ学科', quota: 12, finalApplicants: 15, finalRate: 1.25 },
    // 掛-1（学校別×多年度）: 令和7年度（2025年度）分。神埼はこども教育進学コース新設前、唐津青翔はeスポーツ学科新設前の学科構成。
    { schoolName: '鳥栖', department: '普通科', quota: 114, finalApplicants: 127, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三養基', department: '普通科', quota: 179, finalApplicants: 198, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '神埼', department: '普通科', quota: 102, finalApplicants: 75, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀東', department: '普通科・スポーツ科（くくり募集）', quota: 177, finalApplicants: 161, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀西', department: '普通科', quota: 280, finalApplicants: 338, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀北', department: '普通科', quota: 205, finalApplicants: 289, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀北', department: '芸術科', quota: 24, finalApplicants: 26, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '致遠館', department: '普通科', quota: 66, finalApplicants: 83, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '致遠館', department: '理数科', quota: 59, finalApplicants: 56, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小城', department: '普通科', quota: 175, finalApplicants: 208, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津東', department: '普通科', quota: 122, finalApplicants: 137, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    {
      schoolName: '唐津西',
      department: '普通科・地域探究進学コース・学際探究進学コース（くくり募集）',
      quota: 132,
      finalApplicants: 99,
      finalRate: 0.75,
      fiscalYear: '令和7年度（2025年度）',
    },
    { schoolName: '厳木', department: '普通科（総合評価枠）', quota: 38, finalApplicants: 28, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厳木', department: '普通科（重点評価枠）', quota: 40, finalApplicants: 49, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊万里', department: '普通科・MIRAI進学科（くくり募集）', quota: 153, finalApplicants: 134, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武雄', department: '普通科', quota: 114, finalApplicants: 142, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白石', department: '普通科', quota: 106, finalApplicants: 98, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白石', department: '商業科・情報ビジネス科（くくり募集）', quota: 63, finalApplicants: 74, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    {
      schoolName: '鹿島',
      department: '普通科・文理探求進学コース・未来探求進学コース（くくり募集）',
      quota: 154,
      finalApplicants: 75,
      finalRate: 0.49,
      fiscalYear: '令和7年度（2025年度）',
    },
    { schoolName: '鹿島', department: '商業科', quota: 27, finalApplicants: 26, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鹿島', department: '食品調理科', quota: 33, finalApplicants: 31, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太良', department: '普通科（総合評価枠）', quota: 33, finalApplicants: 18, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太良', department: '普通科（重点評価枠）', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '牛津', department: '生活経営科', quota: 27, finalApplicants: 21, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '牛津', department: '服飾デザイン科', quota: 32, finalApplicants: 12, finalRate: 0.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '牛津', department: '食品調理科', quota: 24, finalApplicants: 21, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高志館', department: '食品流通科', quota: 38, finalApplicants: 39, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高志館', department: '園芸科学科', quota: 36, finalApplicants: 21, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高志館', department: '環境緑地科', quota: 31, finalApplicants: 24, finalRate: 0.77, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津南', department: '生産技術科', quota: 20, finalApplicants: 28, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津南', department: '食品流通科', quota: 18, finalApplicants: 24, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津南', department: '生活教養科', quota: 22, finalApplicants: 26, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊万里実業', department: '生物科学科', quota: 29, finalApplicants: 37, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊万里実業', department: '森林環境科', quota: 17, finalApplicants: 15, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊万里実業', department: 'フードビジネス科', quota: 28, finalApplicants: 37, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊万里実業', department: '商業科', quota: 36, finalApplicants: 36, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊万里実業', department: '情報処理科', quota: 32, finalApplicants: 38, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀農業', department: '農業科学科', quota: 26, finalApplicants: 34, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀農業', department: '食品科学科', quota: 30, finalApplicants: 29, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀農業', department: '環境工学科', quota: 23, finalApplicants: 32, finalRate: 1.39, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥栖工業', department: '機械科', quota: 61, finalApplicants: 56, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥栖工業', department: '電子機械科', quota: 38, finalApplicants: 60, finalRate: 1.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥栖工業', department: '電気科', quota: 39, finalApplicants: 24, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥栖工業', department: '建築科', quota: 38, finalApplicants: 41, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥栖工業', department: '土木科', quota: 33, finalApplicants: 26, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀工業', department: '機械科', quota: 28, finalApplicants: 44, finalRate: 1.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀工業', department: '機械システム科', quota: 28, finalApplicants: 28, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀工業', department: '電気科', quota: 32, finalApplicants: 45, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀工業', department: '電子科', quota: 39, finalApplicants: 38, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀工業', department: '情報システム科', quota: 35, finalApplicants: 43, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀工業', department: '建築科', quota: 29, finalApplicants: 51, finalRate: 1.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津工業', department: '機械科', quota: 33, finalApplicants: 32, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津工業', department: '電気科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津工業', department: '建築科', quota: 38, finalApplicants: 36, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津工業', department: '土木科', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '有田工業', department: '機械科', quota: 31, finalApplicants: 34, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '有田工業', department: '電気科', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '有田工業', department: 'セラミック科', quota: 25, finalApplicants: 16, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '有田工業', department: 'デザイン科', quota: 24, finalApplicants: 22, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '嬉野', department: '機械科', quota: 32, finalApplicants: 37, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '嬉野', department: '電気科・建築科（くくり募集）', quota: 34, finalApplicants: 32, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '嬉野', department: '総合学科', quota: 73, finalApplicants: 41, finalRate: 0.56, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥栖商業', department: '商業科・流通経済科（くくり募集）', quota: 101, finalApplicants: 112, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥栖商業', department: '情報管理科', quota: 37, finalApplicants: 33, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀商業', department: '商業科・グローバルビジネス科（くくり募集）', quota: 158, finalApplicants: 205, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐賀商業', department: '情報処理科', quota: 38, finalApplicants: 44, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津商業', department: '商業科・会計科（くくり募集）', quota: 141, finalApplicants: 162, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '神埼清明', department: '総合学科', quota: 139, finalApplicants: 143, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多久', department: '総合学科', quota: 106, finalApplicants: 101, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '唐津青翔', department: '総合学科', quota: 71, finalApplicants: 41, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
  ],
};
