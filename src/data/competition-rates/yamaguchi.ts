/**
 * 山口県 公立高等学校 倍率パイプラインα（Y-6・25県目・全日制完全達成）。
 *
 * 一次ソース: 山口県教育委員会「令和8年度山口県公立高等学校入学志願者数について（訂正）」
 * （令和8年2月27日訂正・第一次募集出願期間2月13日〜2月24日午前10時締切の確定値）。
 *
 * ⚠️罠（公表資料が2種類存在し、先に読んだ方は不採用）: 山口県は出願期間（2/13〜2/24）開始前の
 * 2/12に「志願状況調査」という**事前意向調査**（実際の出願ではなく、志願変更前の意向を尋ねる
 * 予備調査）を公表しており、初回はこちらを一次ソースとして読み進めてしまった。しかし全日制の
 * グランドトータルが「志願状況調査」（募集人員4,893・志願者4,901・倍率1.00）と、2/24出願締切後
 * に公表される「入学志願者数」（募集人員4,893・志願者4,677・倍率0.96）とで大きく異なることに
 * 気付き、後者（実際の出願結果）に切り替えた。県教育委員会サイトの新しいR9年度ページには
 * R8年度資料への直接リンクが既に無くなっていたため、WebSearchでリセモム記事等の外部報道を
 * 手がかりに一次ソースURL（pref.yamaguchi.lg.jp/site/kyouiku/338005.html＝2/27訂正版）を特定した。
 * **今後PDFを読む際は「志願状況調査」（予備調査）と「入学志願者数」（確定出願）の2種類が別々に
 * 公表される県がある可能性を念頭に置き、グランドトータルの数値だけで安易に一次ソースと判断せず、
 * 出願期間の日付と資料タイトルを必ず確認すること。**
 *
 * ⚠️山口県のPDFはテキスト埋め込み型でpdftotextを試みたが日本語のToUnicodeマッピングが欠落しており
 * 学校名/学科名が読めなかったため、PDFをReadツールで画像として視覚的に読み取った。
 *
 * 列は[入学定員(A) / 特色選抜等合格内定者数(B) / 第一次募集の定員(C=A-B。＝本ファイルのquota) /
 * 第一志願者数(D。＝applicants) / 名目志願者数(E=B+D) / 名目志願倍率(E/A) / 志願倍率(D/C。＝
 * finalRateとして採用) / 昨年度志願倍率]。山口県は令和8年度より推薦入学を廃止し「特色選抜」に
 * 一本化したため、特色選抜等合格内定者数を除いた第一志願者数が実質的な一般選抜相当の志願者数となる。
 *
 * ⚠️「文理探究」学科は岩国・山口・宇部・下関西・萩の5校で人文社会科学系/自然科学系の2コースを
 * くくり募集しており、PDF上もB/C/D/E等の数値が2コース分を1組の値としてのみ記載される（東京都・
 * 大分県等の「くくり募集」と同型）。一方、徳山高校の「文理探究」は文コース・理数コースそれぞれに
 * 独立した数値が印字されており、くくり募集ではなく2レコードとして収録した。
 *
 * ⚠️山口県は倍率を小数第1位までしか公表しない（他県の多くは第2位まで）。第一志願者数÷第一次募集
 * 定員の生の計算値と印字済み倍率との差が最大で約0.05生じる箇所が複数あるが、これは丸め桁数の違いに
 * よるものであり転記ミスではない（quota・applicantsのみで積み上げた機械集計はグランドトータルと
 * quota・applicantsともに完全一致することを確認済み）。
 *
 * 機械集計（quota4,893・applicants4,677、43校98レコード）が「全日制」計行（募集人員4,893・
 * 志願者数4,677・志願倍率0.96）と完全一致した。定時制課程は他県と同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const YAMAGUCHI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'yamaguchi',
  sources: [
    {
      url: 'https://www.pref.yamaguchi.lg.jp/uploaded/life/338005_649954_misc.pdf',
      docTitle: '山口県教育委員会 令和8年度山口県公立高等学校入学志願者数について（訂正）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程（43校98レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note:
      '「全日制」計行（募集人員4,893・志願者数4,677・志願倍率0.96）と機械集計が完全一致した。' +
      '山口県は倍率を小数第1位までしか公表しないため、生の計算値との差が最大約0.05生じる箇所が' +
      '複数あるが、印字済み倍率をそのまま転記しており転記ミスではない。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 43, quota: 4893, finalApplicants: 4677, finalRate: 0.96 }],
  records: [
    { schoolName: '岩国', department: '普通', quota: 112, finalApplicants: 100, finalRate: 0.9 },
    { schoolName: '岩国', department: '文理探究(人文探究・理数探究くくり募集)', quota: 49, finalApplicants: 45, finalRate: 0.9 },
    { schoolName: '坂上分校', department: '普通', quota: 21, finalApplicants: 7, finalRate: 0.3 },
    { schoolName: '岩国総合', department: '総合学科', quota: 63, finalApplicants: 65, finalRate: 1.0 },
    { schoolName: '高森', department: '普通', quota: 47, finalApplicants: 14, finalRate: 0.3 },
    { schoolName: '岩国商業', department: '総合ビジネス', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '岩国商業', department: '国際情報', quota: 27, finalApplicants: 5, finalRate: 0.2 },
    { schoolName: '岩国工業', department: '機械', quota: 17, finalApplicants: 15, finalRate: 0.9 },
    { schoolName: '岩国工業', department: '電気', quota: 17, finalApplicants: 17, finalRate: 1.0 },
    { schoolName: '岩国工業', department: '都市工学', quota: 17, finalApplicants: 23, finalRate: 1.4 },
    { schoolName: '岩国工業', department: 'システム化学', quota: 17, finalApplicants: 18, finalRate: 1.1 },
    { schoolName: '柳井', department: '普通', quota: 140, finalApplicants: 117, finalRate: 0.8 },
    { schoolName: '柳井', department: 'ビジネス情報', quota: 22, finalApplicants: 24, finalRate: 1.1 },
    { schoolName: '田布施農工', department: '食農デザイン', quota: 22, finalApplicants: 30, finalRate: 1.4 },
    { schoolName: '田布施農工', department: '緑地土木デザイン', quota: 33, finalApplicants: 16, finalRate: 0.5 },
    { schoolName: '田布施農工', department: '機械デジタル', quota: 22, finalApplicants: 30, finalRate: 1.4 },
    { schoolName: '田布施農工', department: '建築', quota: 27, finalApplicants: 10, finalRate: 0.4 },
    { schoolName: '田布施農工', department: 'ライフデザイン', quota: 22, finalApplicants: 33, finalRate: 1.5 },
    { schoolName: '光', department: '普通', quota: 105, finalApplicants: 58, finalRate: 0.6 },
    { schoolName: '光', department: '総合学科', quota: 48, finalApplicants: 77, finalRate: 1.6 },
    { schoolName: '下松', department: '普通', quota: 144, finalApplicants: 158, finalRate: 1.1 },
    { schoolName: '華陵', department: '普通', quota: 40, finalApplicants: 59, finalRate: 1.5 },
    { schoolName: '華陵', department: '英語', quota: 16, finalApplicants: 7, finalRate: 0.4 },
    { schoolName: '下松工業', department: 'システム機械', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '下松工業', department: '電子機械', quota: 20, finalApplicants: 30, finalRate: 1.5 },
    { schoolName: '下松工業', department: '情報電子', quota: 28, finalApplicants: 37, finalRate: 1.3 },
    { schoolName: '下松工業', department: '化学工業', quota: 30, finalApplicants: 29, finalRate: 1.0 },
    { schoolName: '徳山', department: '普通', quota: 210, finalApplicants: 236, finalRate: 1.1 },
    { schoolName: '徳山', department: '文理探究・文', quota: 18, finalApplicants: 17, finalRate: 0.9 },
    { schoolName: '徳山', department: '文理探究・理数', quota: 28, finalApplicants: 59, finalRate: 2.1 },
    { schoolName: '新南陽', department: '普通', quota: 90, finalApplicants: 84, finalRate: 0.9 },
    { schoolName: '徳山商工', department: '総合ビジネス', quota: 22, finalApplicants: 27, finalRate: 1.2 },
    { schoolName: '徳山商工', department: '情報ビジネス', quota: 22, finalApplicants: 30, finalRate: 1.4 },
    { schoolName: '徳山商工', department: '機械', quota: 28, finalApplicants: 22, finalRate: 0.8 },
    { schoolName: '徳山商工', department: '電子情報技術', quota: 20, finalApplicants: 21, finalRate: 1.1 },
    { schoolName: '徳山商工', department: '環境システム', quota: 20, finalApplicants: 24, finalRate: 1.2 },
    { schoolName: '南陽工業', department: '機械システム', quota: 20, finalApplicants: 30, finalRate: 1.5 },
    { schoolName: '南陽工業', department: '電気', quota: 21, finalApplicants: 20, finalRate: 1.0 },
    { schoolName: '南陽工業', department: '応用化学', quota: 23, finalApplicants: 22, finalRate: 1.0 },
    { schoolName: '防府', department: '普通', quota: 144, finalApplicants: 213, finalRate: 1.5 },
    { schoolName: '防府', department: '衛生看護', quota: 20, finalApplicants: 26, finalRate: 1.3 },
    { schoolName: '防府西', department: '総合学科', quota: 117, finalApplicants: 64, finalRate: 0.5 },
    { schoolName: '防府商工', department: '商業', quota: 72, finalApplicants: 88, finalRate: 1.2 },
    { schoolName: '防府商工', department: '情報処理', quota: 24, finalApplicants: 35, finalRate: 1.5 },
    { schoolName: '防府商工', department: '機械', quota: 40, finalApplicants: 55, finalRate: 1.4 },
    { schoolName: '山口', department: '普通', quota: 230, finalApplicants: 291, finalRate: 1.3 },
    { schoolName: '山口', department: '文理探究(文・理数くくり募集)', quota: 52, finalApplicants: 72, finalRate: 1.4 },
    { schoolName: '山口中央', department: '普通', quota: 191, finalApplicants: 254, finalRate: 1.3 },
    { schoolName: '西京', department: '普通', quota: 84, finalApplicants: 85, finalRate: 1.0 },
    { schoolName: '西京', department: '体育コース', quota: 10, finalApplicants: 11, finalRate: 1.1 },
    { schoolName: '西京', department: '総合ビジネス', quota: 26, finalApplicants: 16, finalRate: 0.6 },
    { schoolName: '西京', department: '情報処理', quota: 26, finalApplicants: 26, finalRate: 1.0 },
    { schoolName: '山口農業', department: '生物生産', quota: 23, finalApplicants: 22, finalRate: 1.0 },
    { schoolName: '山口農業', department: '食品工学', quota: 29, finalApplicants: 12, finalRate: 0.4 },
    { schoolName: '山口農業', department: '生活科学', quota: 22, finalApplicants: 13, finalRate: 0.6 },
    { schoolName: '山口農業', department: '環境科学', quota: 28, finalApplicants: 14, finalRate: 0.5 },
    { schoolName: '西市分校', department: '総合学科', quota: 23, finalApplicants: 8, finalRate: 0.3 },
    { schoolName: '宇部', department: '普通', quota: 160, finalApplicants: 202, finalRate: 1.3 },
    { schoolName: '宇部', department: '文理探究(人文社会科学・自然科学くくり募集)', quota: 49, finalApplicants: 39, finalRate: 0.8 },
    { schoolName: '宇部中央', department: '普通', quota: 104, finalApplicants: 57, finalRate: 0.5 },
    { schoolName: '宇部商業', department: '商業', quota: 68, finalApplicants: 52, finalRate: 0.8 },
    { schoolName: '宇部商業', department: '総合情報', quota: 24, finalApplicants: 10, finalRate: 0.4 },
    { schoolName: '宇部工業', department: '機械', quota: 20, finalApplicants: 17, finalRate: 0.9 },
    { schoolName: '宇部工業', department: '電子機械', quota: 20, finalApplicants: 21, finalRate: 1.1 },
    { schoolName: '宇部工業', department: '電気', quota: 17, finalApplicants: 18, finalRate: 1.1 },
    { schoolName: '宇部工業', department: '化学工業', quota: 20, finalApplicants: 11, finalRate: 0.6 },
    { schoolName: '小野田', department: '普通', quota: 112, finalApplicants: 97, finalRate: 0.9 },
    { schoolName: '厚狭明進', department: '普通', quota: 57, finalApplicants: 29, finalRate: 0.5 },
    { schoolName: '厚狭明進', department: '生活創造', quota: 55, finalApplicants: 28, finalRate: 0.5 },
    { schoolName: '小野田工業', department: '機械', quota: 15, finalApplicants: 15, finalRate: 1.0 },
    { schoolName: '小野田工業', department: '電子情報', quota: 15, finalApplicants: 13, finalRate: 0.9 },
    { schoolName: '小野田工業', department: '化学工業', quota: 18, finalApplicants: 15, finalRate: 0.8 },
    { schoolName: '美祢青嶺', department: '普通', quota: 42, finalApplicants: 9, finalRate: 0.2 },
    { schoolName: '美祢青嶺', department: '機械', quota: 15, finalApplicants: 3, finalRate: 0.2 },
    { schoolName: '美祢青嶺', department: '電気', quota: 21, finalApplicants: 4, finalRate: 0.2 },
    { schoolName: '豊浦', department: '普通', quota: 140, finalApplicants: 134, finalRate: 1.0 },
    { schoolName: '長府', department: '総合学科', quota: 94, finalApplicants: 80, finalRate: 0.9 },
    { schoolName: '下関西', department: '普通', quota: 160, finalApplicants: 170, finalRate: 1.1 },
    { schoolName: '下関西', department: '文理探究(人文社会科学・自然科学くくり募集)', quota: 49, finalApplicants: 52, finalRate: 1.1 },
    { schoolName: '下関南', department: '普通', quota: 112, finalApplicants: 106, finalRate: 0.9 },
    { schoolName: '下関北', department: '普通', quota: 67, finalApplicants: 14, finalRate: 0.2 },
    { schoolName: '下関工科', department: '機械工学', quota: 55, finalApplicants: 57, finalRate: 1.0 },
    { schoolName: '下関工科', department: '電気工学', quota: 49, finalApplicants: 22, finalRate: 0.4 },
    { schoolName: '下関工科', department: '建設工学', quota: 20, finalApplicants: 27, finalRate: 1.4 },
    { schoolName: '下関工科', department: '応用化学工学', quota: 20, finalApplicants: 17, finalRate: 0.9 },
    { schoolName: '大津緑洋', department: '普通', quota: 77, finalApplicants: 62, finalRate: 0.8 },
    { schoolName: '大津緑洋', department: '生物生産', quota: 22, finalApplicants: 8, finalRate: 0.4 },
    { schoolName: '大津緑洋', department: '生活科学', quota: 22, finalApplicants: 11, finalRate: 0.5 },
    { schoolName: '大津緑洋', department: '海洋技術', quota: 19, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '大津緑洋', department: '海洋科学', quota: 24, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '萩', department: '普通', quota: 70, finalApplicants: 60, finalRate: 0.9 },
    { schoolName: '萩', department: '文理探究(人文社会科学・自然科学くくり募集)', quota: 23, finalApplicants: 10, finalRate: 0.4 },
    { schoolName: '奈古分校', department: '総合学科', quota: 27, finalApplicants: 3, finalRate: 0.1 },
    { schoolName: '萩商工', department: '総合ビジネス', quota: 15, finalApplicants: 18, finalRate: 1.2 },
    { schoolName: '萩商工', department: '情報デザイン', quota: 15, finalApplicants: 17, finalRate: 1.1 },
    { schoolName: '萩商工', department: '機械・土木', quota: 21, finalApplicants: 15, finalRate: 0.7 },
    { schoolName: '萩商工', department: '電気・建築', quota: 15, finalApplicants: 11, finalRate: 0.7 },
    { schoolName: '下関商業', department: '商業に関する学科(商業・情報処理くくり募集)', quota: 96, finalApplicants: 132, finalRate: 1.4 },
  ],
};
