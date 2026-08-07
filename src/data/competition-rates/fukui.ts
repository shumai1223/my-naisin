/**
 * 福井県 公立高等学校 倍率パイプラインα（Y-6・15県目・全日制完全達成／掛-1・R7多年度追加済み）。
 *
 * 一次ソース: 福井県教育委員会「令和8年度福井県立高等学校一般入学者選抜志願変更状況
 * （2月16日変更最終日）」（全2ページ）。
 *
 * ⚠️福井県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城・三重・富山・石川と同型の高信頼度技法）。列は[募集定員
 * (A) / 推薦・特色等合格者数(B) / 一般選抜募集人員(C=A-B＝本ファイルのquota) / 第一志望出願者数
 * (2/9) / 志願変更(取下げ／再出願) / 変更後第一志望出願者数(＝applicants) / 変更後第一志望倍率
 * (＝finalRate)]。他県と同じく「変更後」の確定値を採用した。
 *
 * ⚠️罠（鯖江・くくり募集の列抽出崩れ）: 鯖江高校「普通　スポーツ・健康福祉」「普通　IT・
 * アートデザイン」の2組は、推薦・特色等合格者数(B)が子コースごとに分割表示される特殊レイアウトで
 * pdftotextのテキスト抽出だけでは数値の対応関係が不明瞭だったため、pdftoppmで該当ページを画像化
 * し目視確認した。募集定員(A=37)から子コース別内定者数の合計（スポーツ17＋健康福祉6＝23、または
 * IT6＋アートデザイン5＝11）を差し引いた値が一般選抜募集人員(C)と一致することを確認し、連結学科名
 * の単一レコード（くくり募集）として記録した。
 *
 * ⚠️罠（高志中学校からの内部進学枠）: 高志高校「探究創造※2（90）」はPDF注記②「高志中学校からの
 * 入学定員、合計には含まれていない」により、附属中学校からの内部進学者専用の別枠（一般選抜の対象
 * 外）と確認できたため、レコードとして採用しない。
 *
 * 機械集計（quota3,316・applicants3,428・倍率1.03、24校72レコード）が全日制「合計」行と完全
 * 一致した（画像確認込みでも初回転記で一致・再修正なし）。定時制課程は他県と同じ理由でスコープ外。
 *
 * ⚠️掛-1（学校別×多年度）R7追加: 令和7年度版「志願変更状況」（2月18日変更最終日・全2ページ）
 * https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r7ippan_d/fil/R7henko3.pdf を取得。R8は
 * pdftotext成功済みだったがR7は同じテキスト埋め込み型でもCJKラベル抽出不能な埋め込みフォントだった
 * ためpdftoppm 300dpiビジョン解析で72レコード（24校）を転記した。ページ2末尾「全日制 合計」行
 * （quota3,398・applicants3,465・倍率1.02）とnode.js機械集計が完全一致。学校・学科構成はR8と
 * ほぼ完全一致だが、**鯖江高校のくくり募集1件のみ名称が異なる**: R7では「普通（IT・デザイン
 * くくり募集）」だったが、R8では「普通（IT・アートデザインくくり募集）」に改称されている
 * （quota/applicants等の実質的な学科内容は同一・画像で「IT・デザイン」と明瞭に判読できたため
 * 誤読ではなく実際の課程名称変更と判断）。それ以外の23校は学校名+学科名がR7/R8で完全一致
 * （学校再編なし）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const FUKUI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'fukui',
  sources: [
    {
      url: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08ippan_d/fil/R8henko3.pdf',
      docTitle: '福井県教育委員会 令和8年度福井県立高等学校一般入学者選抜志願変更状況（2月16日変更最終日）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r7ippan_d/fil/R7henko3.pdf',
      docTitle: '福井県教育委員会 令和7年度福井県立高等学校一般入学者選抜志願変更状況（2月18日変更最終日）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（24校72レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '全日制「合計」行（quota3,316・applicants3,428・倍率1.03）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 24, quota: 3316, finalApplicants: 3428, finalRate: 1.03 }],
  records: [
    { schoolName: '足羽', department: '普通（キャリアデザイン）', quota: 71, finalApplicants: 57, finalRate: 0.8 },
    { schoolName: '足羽', department: '多文化共生（中国語・英語）', quota: 27, finalApplicants: 12, finalRate: 0.44 },
    { schoolName: '足羽', department: '多文化共生（日本語）', quota: 1, finalApplicants: 1, finalRate: 1.0 },
    { schoolName: '羽水', department: '普通', quota: 232, finalApplicants: 163, finalRate: 0.7 },
    { schoolName: '羽水', department: '探究特進', quota: 33, finalApplicants: 122, finalRate: 3.7 },
    { schoolName: '金津', department: '普通', quota: 164, finalApplicants: 155, finalRate: 0.95 },
    { schoolName: '高志', department: '探究創造', quota: 143, finalApplicants: 282, finalRate: 1.97 },
    { schoolName: '藤島', department: '普通', quota: 296, finalApplicants: 397, finalRate: 1.34 },
    { schoolName: '丸岡', department: '普通（みらい共創）', quota: 42, finalApplicants: 38, finalRate: 0.9 },
    { schoolName: '丸岡', department: '普通（スポーツ探究）', quota: 12, finalApplicants: 14, finalRate: 1.17 },
    { schoolName: '三国', department: '普通', quota: 100, finalApplicants: 99, finalRate: 0.99 },
    { schoolName: '大野', department: '普通', quota: 93, finalApplicants: 84, finalRate: 0.9 },
    { schoolName: '勝山', department: '普通', quota: 72, finalApplicants: 69, finalRate: 0.96 },
    { schoolName: '勝山', department: '探究特進', quota: 14, finalApplicants: 16, finalRate: 1.14 },
    { schoolName: '鯖江', department: '普通（スタンダード）', quota: 129, finalApplicants: 114, finalRate: 0.88 },
    { schoolName: '鯖江', department: '普通（スポーツ・健康福祉くくり募集）', quota: 14, finalApplicants: 14, finalRate: 1.0 },
    { schoolName: '鯖江', department: '普通（IT・アートデザインくくり募集）', quota: 26, finalApplicants: 29, finalRate: 1.12 },
    { schoolName: '鯖江', department: '探究', quota: 27, finalApplicants: 43, finalRate: 1.59 },
    { schoolName: '武生', department: '普通', quota: 225, finalApplicants: 196, finalRate: 0.87 },
    { schoolName: '武生', department: '探究進学', quota: 72, finalApplicants: 116, finalRate: 1.61 },
    { schoolName: '武生東', department: '学際フロンティア', quota: 85, finalApplicants: 87, finalRate: 1.02 },
    { schoolName: '丹生', department: '普通', quota: 78, finalApplicants: 80, finalRate: 1.03 },
    { schoolName: '敦賀', department: '普通', quota: 70, finalApplicants: 71, finalRate: 1.01 },
    { schoolName: '敦賀', department: '文理進学', quota: 42, finalApplicants: 44, finalRate: 1.05 },
    { schoolName: '敦賀', department: '商業', quota: 8, finalApplicants: 7, finalRate: 0.88 },
    { schoolName: '敦賀', department: '情報経理', quota: 12, finalApplicants: 8, finalRate: 0.67 },
    { schoolName: '美方', department: '普通', quota: 33, finalApplicants: 24, finalRate: 0.73 },
    { schoolName: '美方', department: '生活情報', quota: 12, finalApplicants: 13, finalRate: 1.08 },
    { schoolName: '美方', department: '食物', quota: 13, finalApplicants: 14, finalRate: 1.08 },
    { schoolName: '若狭', department: '普通', quota: 124, finalApplicants: 105, finalRate: 0.85 },
    { schoolName: '若狭', department: '文理探究', quota: 30, finalApplicants: 56, finalRate: 1.87 },
    { schoolName: '若狭', department: '海洋科学', quota: 46, finalApplicants: 49, finalRate: 1.07 },
    { schoolName: '福井農林', department: '生物生産', quota: 22, finalApplicants: 26, finalRate: 1.18 },
    { schoolName: '福井農林', department: '環境工学', quota: 29, finalApplicants: 16, finalRate: 0.55 },
    { schoolName: '福井農林', department: '生活科学', quota: 22, finalApplicants: 28, finalRate: 1.27 },
    { schoolName: '福井農林', department: '食品流通', quota: 31, finalApplicants: 29, finalRate: 0.94 },
    { schoolName: '科学技術', department: '機械システム', quota: 24, finalApplicants: 20, finalRate: 0.83 },
    { schoolName: '科学技術', department: '情報工学', quota: 26, finalApplicants: 26, finalRate: 1.0 },
    { schoolName: '科学技術', department: '電子電気', quota: 27, finalApplicants: 24, finalRate: 0.89 },
    { schoolName: '科学技術', department: '化学創造', quota: 30, finalApplicants: 19, finalRate: 0.63 },
    { schoolName: '科学技術', department: '産業デザイン', quota: 22, finalApplicants: 19, finalRate: 0.86 },
    { schoolName: '敦賀工業', department: '電子機械', quota: 14, finalApplicants: 14, finalRate: 1.0 },
    { schoolName: '敦賀工業', department: '電気', quota: 23, finalApplicants: 19, finalRate: 0.83 },
    { schoolName: '敦賀工業', department: '建築システム', quota: 15, finalApplicants: 20, finalRate: 1.33 },
    { schoolName: '敦賀工業', department: '情報ケミカル', quota: 23, finalApplicants: 20, finalRate: 0.87 },
    { schoolName: '福井商業', department: '商業', quota: 27, finalApplicants: 35, finalRate: 1.3 },
    { schoolName: '福井商業', department: '流通経済', quota: 25, finalApplicants: 31, finalRate: 1.24 },
    { schoolName: '福井商業', department: '会計', quota: 28, finalApplicants: 20, finalRate: 0.71 },
    { schoolName: '福井商業', department: '情報処理', quota: 37, finalApplicants: 37, finalRate: 1.0 },
    { schoolName: '福井商業', department: '国際経済', quota: 13, finalApplicants: 12, finalRate: 0.92 },
    { schoolName: '坂井', department: '食農科学（農業）', quota: 23, finalApplicants: 19, finalRate: 0.83 },
    { schoolName: '坂井', department: '食農科学（食品）', quota: 19, finalApplicants: 20, finalRate: 1.05 },
    { schoolName: '坂井', department: '機械・自動車（機械）', quota: 19, finalApplicants: 14, finalRate: 0.74 },
    { schoolName: '坂井', department: '機械・自動車（自動車）', quota: 18, finalApplicants: 17, finalRate: 0.94 },
    { schoolName: '坂井', department: '電気・情報システム（電気）', quota: 19, finalApplicants: 18, finalRate: 0.95 },
    { schoolName: '坂井', department: '電気・情報システム（情報システム）', quota: 13, finalApplicants: 16, finalRate: 1.23 },
    { schoolName: '坂井', department: 'ビジネス・生活デザイン（ビジネス）', quota: 17, finalApplicants: 14, finalRate: 0.82 },
    { schoolName: '坂井', department: 'ビジネス・生活デザイン（生活デザイン）', quota: 16, finalApplicants: 16, finalRate: 1.0 },
    { schoolName: '奥越明成', department: '機械', quota: 18, finalApplicants: 9, finalRate: 0.5 },
    { schoolName: '奥越明成', department: '電気', quota: 26, finalApplicants: 7, finalRate: 0.27 },
    { schoolName: '奥越明成', department: 'ビジネス情報', quota: 17, finalApplicants: 8, finalRate: 0.47 },
    { schoolName: '奥越明成', department: '生活福祉（生活）', quota: 19, finalApplicants: 11, finalRate: 0.58 },
    { schoolName: '奥越明成', department: '生活福祉（福祉）', quota: 18, finalApplicants: 2, finalRate: 0.11 },
    { schoolName: '武生商工', department: '機械創造', quota: 40, finalApplicants: 50, finalRate: 1.25 },
    { schoolName: '武生商工', department: '電気情報', quota: 27, finalApplicants: 26, finalRate: 0.96 },
    { schoolName: '武生商工', department: '都市・建築', quota: 24, finalApplicants: 23, finalRate: 0.96 },
    { schoolName: '武生商工', department: '商業マネジメント', quota: 44, finalApplicants: 42, finalRate: 0.95 },
    { schoolName: '武生商工', department: '情報ビジネス', quota: 13, finalApplicants: 14, finalRate: 1.08 },
    { schoolName: '若狭東', department: '生活創造', quota: 22, finalApplicants: 24, finalRate: 1.09 },
    { schoolName: '若狭東', department: '地域創造', quota: 22, finalApplicants: 19, finalRate: 0.86 },
    { schoolName: '若狭東', department: '工業創造', quota: 51, finalApplicants: 23, finalRate: 0.45 },
    { schoolName: '若狭東', department: 'ビジネス情報', quota: 47, finalApplicants: 42, finalRate: 0.89 },
    { schoolName: '足羽', department: '普通（キャリアデザイン）', quota: 66, finalApplicants: 71, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足羽', department: '多文化共生（中国語・英語）', quota: 26, finalApplicants: 22, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足羽', department: '多文化共生（日本語）', quota: 6, finalApplicants: 0, finalRate: 0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽水', department: '普通', quota: 252, finalApplicants: 190, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽水', department: '探究特進', quota: 32, finalApplicants: 99, finalRate: 3.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '金津', department: '普通', quota: 170, finalApplicants: 183, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高志', department: '探究創造', quota: 148, finalApplicants: 269, finalRate: 1.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤島', department: '普通', quota: 313, finalApplicants: 400, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '丸岡', department: '普通（みらい共創）', quota: 43, finalApplicants: 28, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '丸岡', department: '普通（スポーツ探究）', quota: 15, finalApplicants: 16, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三国', department: '普通', quota: 113, finalApplicants: 91, finalRate: 0.81, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大野', department: '普通', quota: 97, finalApplicants: 100, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '勝山', department: '普通', quota: 69, finalApplicants: 45, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '勝山', department: '探究特進', quota: 21, finalApplicants: 21, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鯖江', department: '普通（スタンダード）', quota: 132, finalApplicants: 87, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鯖江', department: '普通（スポーツ・健康福祉くくり募集）', quota: 9, finalApplicants: 11, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鯖江', department: '普通（IT・デザインくくり募集）', quota: 19, finalApplicants: 30, finalRate: 1.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鯖江', department: '探究', quota: 27, finalApplicants: 56, finalRate: 2.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生', department: '普通', quota: 222, finalApplicants: 199, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生', department: '探究進学', quota: 69, finalApplicants: 113, finalRate: 1.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生東', department: '学際フロンティア', quota: 79, finalApplicants: 55, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '丹生', department: '普通', quota: 72, finalApplicants: 66, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀', department: '普通', quota: 80, finalApplicants: 66, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀', department: '文理進学', quota: 42, finalApplicants: 57, finalRate: 1.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀', department: '商業', quota: 7, finalApplicants: 9, finalRate: 1.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀', department: '情報経理', quota: 11, finalApplicants: 12, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美方', department: '普通', quota: 30, finalApplicants: 32, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美方', department: '生活情報', quota: 15, finalApplicants: 16, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美方', department: '食物', quota: 18, finalApplicants: 15, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若狭', department: '普通', quota: 136, finalApplicants: 121, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若狭', department: '文理探究', quota: 30, finalApplicants: 43, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若狭', department: '海洋科学', quota: 47, finalApplicants: 48, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井農林', department: '生物生産', quota: 23, finalApplicants: 27, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井農林', department: '環境工学', quota: 28, finalApplicants: 16, finalRate: 0.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井農林', department: '生活科学', quota: 29, finalApplicants: 29, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井農林', department: '食品流通', quota: 31, finalApplicants: 32, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '科学技術', department: '機械システム', quota: 20, finalApplicants: 23, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '科学技術', department: '情報工学', quota: 29, finalApplicants: 38, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '科学技術', department: '電子電気', quota: 25, finalApplicants: 33, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '科学技術', department: '化学創造', quota: 28, finalApplicants: 10, finalRate: 0.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '科学技術', department: '産業デザイン', quota: 16, finalApplicants: 19, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀工業', department: '電子機械', quota: 18, finalApplicants: 20, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀工業', department: '電気', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀工業', department: '建築システム', quota: 13, finalApplicants: 17, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '敦賀工業', department: '情報ケミカル', quota: 23, finalApplicants: 28, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井商業', department: '商業', quota: 39, finalApplicants: 45, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井商業', department: '流通経済', quota: 33, finalApplicants: 38, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井商業', department: '会計', quota: 19, finalApplicants: 13, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井商業', department: '情報処理', quota: 39, finalApplicants: 37, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福井商業', department: '国際経済', quota: 21, finalApplicants: 21, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: '食農科学（農業）', quota: 23, finalApplicants: 19, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: '食農科学（食品）', quota: 24, finalApplicants: 20, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: '機械・自動車（機械）', quota: 15, finalApplicants: 14, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: '機械・自動車（自動車）', quota: 27, finalApplicants: 25, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: '電気・情報システム（電気）', quota: 24, finalApplicants: 18, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: '電気・情報システム（情報システム）', quota: 20, finalApplicants: 16, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: 'ビジネス・生活デザイン（ビジネス）', quota: 21, finalApplicants: 12, finalRate: 0.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂井', department: 'ビジネス・生活デザイン（生活デザイン）', quota: 16, finalApplicants: 16, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奥越明成', department: '機械', quota: 21, finalApplicants: 7, finalRate: 0.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奥越明成', department: '電気', quota: 19, finalApplicants: 8, finalRate: 0.42, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奥越明成', department: 'ビジネス情報', quota: 17, finalApplicants: 7, finalRate: 0.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奥越明成', department: '生活福祉（生活）', quota: 17, finalApplicants: 11, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奥越明成', department: '生活福祉（福祉）', quota: 17, finalApplicants: 4, finalRate: 0.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生商工', department: '機械創造', quota: 39, finalApplicants: 44, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生商工', department: '電気情報', quota: 27, finalApplicants: 28, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生商工', department: '都市・建築', quota: 18, finalApplicants: 15, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生商工', department: '商業マネジメント', quota: 35, finalApplicants: 36, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武生商工', department: '情報ビジネス', quota: 17, finalApplicants: 16, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若狭東', department: '生活創造', quota: 18, finalApplicants: 24, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若狭東', department: '地域創造', quota: 20, finalApplicants: 12, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若狭東', department: '工業創造', quota: 46, finalApplicants: 44, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若狭東', department: 'ビジネス情報', quota: 47, finalApplicants: 31, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
  ],
};
