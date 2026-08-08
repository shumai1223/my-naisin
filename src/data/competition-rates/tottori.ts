/**
 * 鳥取県 公立高等学校 倍率パイプラインα（Y-6・22県目・全日制完全達成／掛-1・R6-R8の3年度対応済）。
 *
 * 一次ソース: 鳥取県教育委員会「令和８年度鳥取県立高等学校入学者選抜最終志願者数一覧（全日制課程）」
 * （2月24日志願変更締切後・最終版。資料提供日は2月24日）。
 *
 * ⚠️鳥取県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（他の多くの県と
 * 同型の高信頼度技法）。列は[募集定員（名目） / 実質募集定員（＝本ファイルのquota） / 志願者数(2/18
 * 締切時点・参考) / 志願辞退者数 / 新志願者数 / 特例措置者数 / 最終志願者数（＝applicants）/ 競争率
 * （本年・昨年）]。倍率はPDFに印字済みの「本年」列をそのまま採用。学校別「学校計」行・地区別「小計」
 * 行（東部/中部/西部）・県全体「県計」行の3階層で自己検算できる高信頼度構造。
 *
 * ⚠️くくり募集2組: 鳥取東の普通・理数（理数科の数値行が独立して存在せず普通科の数値行に完全統合）、
 * 智頭農林の生産科学・森林科学（実質募集定員は2学科合計値のみ提示され、志願者数のみ学科別内訳が
 * 別記載されるが最終的にquotaは分離不能なため統合収録）。鳥取工業（機械・電気・情報工学・建設工学）
 * も同型の完全統合くくり募集。米子東の普通（生命科学）・普通（普通）は逆にquotaが分離提示されている
 * ため独立レコードとして収録（くくり募集ではない）。
 *
 * 機械集計（quota2,937・applicants2,334、22校43レコード）が「県計」行、および東部/中部/西部の
 * 3地区別小計行すべてと完全一致した（初回転記で一致・再修正なし）。定時制課程は他県と同じ理由で
 * スコープ外。
 *
 * ⚠️掛-1（R7追加時の年度差）: R7の一次資料は「令和7年度県立高等学校一般入学者選抜最終志願者数等
 * について」（資料提供2月21日・概要4ページ）と同名PDFの後半（物理ページ5〜8/pdftoppm換算）に
 * 収録された学校別詳細表の2部構成だった（R8も同じPDF内に概要4ページ＋詳細表という同型構成で、
 * 概要部分だけを見て詳細が無いと誤認しないよう注意。詳細表のヘッダーは「一般願変2.21」
 * （=志願変更2/21締切）とR8の「R08_0224」（2/24締切）で締切日付が年によって異なる）。
 * pdftotextでは名前欄が空欄のためpdftoppm 300dpiビジョン解析で全43レコードを転記した。県計行
 * （quota2,936・applicants2,586・倍率0.88）と東部/中部/西部の3地区別小計行すべてがnode.js
 * 機械集計と完全一致した（初回転記で一致）。22校43レコードともR7/R8で同数。
 *
 * ⚠️掛-1（tottori横展開R6完結・3年度目）: R6の一次資料「令和6年度県立高等学校一般入学者選抜最終
 * 志願者数等について」（資料提供2月22日・全8頁）はR7/R8と異なる単独PDFで、1〜4頁が地区別概要
 * （最終志願者数及び競争率・実質募集定員に満たない学校数等）、5〜8頁が学校別詳細表（東部/中部/
 * 西部/定時制+全体総括）という構成。R7/R8同様pdftotextでは学校名・学科名の日本語ラベルが全欠落
 * するためpdftoppm 300dpiビジョン解析で全43レコードを転記した。県計（全日制・quota3,048・
 * applicants2,648・倍率0.87）および東部/中部/西部の3地区別小計行すべてがnode.js機械集計と完全
 * 一致（初回転記で一致・再修正なし）。22校43レコードともR7/R8で同数。
 * ⚠️智頭農林の実在差: R6時点の学校別詳細表では「ふるさと創造・森林科学・生活環境」の3学科名で
 * 掲載されており（quota合算57・applicants合算28）、R7/R8の「生産科学・森林科学」2学科（くくり
 * 募集）とは学科名・学科数とも異なる。誤読ではなくR6→R7間の実在の学科再編（3学科→2学科への統合・
 * 改称）と判断し、R6時点の実際の学科名をそのまま収録した（他県の学科改編発見パターンと同様、
 * 過去年度のラベルを新年度のラベルへ機械的にコピーしない原則を遵守）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const TOTTORI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tottori',
  sources: [
    {
      url: 'https://www.pref.tottori.lg.jp/secure/1418417/R08_ippan_saisyuu_shigansya.pdf',
      docTitle: '鳥取県教育委員会 令和８年度鳥取県立高等学校入学者選抜最終志願者数一覧（全日制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.pref.tottori.lg.jp/secure/1378219/R7ippansaisyuusigansya.pdf',
      docTitle: '鳥取県教育委員会 令和7年度県立高等学校一般入学者選抜最終志願者数等について',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.pref.tottori.lg.jp/secure/1347424/R6saisyu.pdf',
      docTitle: '鳥取県教育委員会 令和6年度県立高等学校一般入学者選抜最終志願者数等について',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-08',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（22校43レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '「県計」行および東部/中部/西部の地区別小計行すべてと機械集計が完全一致した。',
  },
  officialSubtotals: [
    { label: '全日制計', schoolCount: 22, quota: 2937, finalApplicants: 2334, finalRate: 0.79 },
    { label: '東部小計', quota: 1238, finalApplicants: 956, finalRate: 0.77 },
    { label: '中部小計', quota: 497, finalApplicants: 349, finalRate: 0.7 },
    { label: '西部小計', quota: 1202, finalApplicants: 1029, finalRate: 0.86 },
  ],
  records: [
    { schoolName: '鳥取東', area: '東部', department: '普通・理数（くくり募集）', quota: 280, finalApplicants: 294, finalRate: 1.05 },
    { schoolName: '鳥取西', area: '東部', department: '普通', quota: 272, finalApplicants: 308, finalRate: 1.13 },
    { schoolName: '鳥取商業', area: '東部', department: '商業', quota: 100, finalApplicants: 67, finalRate: 0.67 },
    { schoolName: '鳥取工業', area: '東部', department: '工業（機械・電気・情報工学・建設工学）（くくり募集）', quota: 104, finalApplicants: 47, finalRate: 0.45 },
    { schoolName: '鳥取湖陵', area: '東部', department: '食品システム', quota: 21, finalApplicants: 12, finalRate: 0.57 },
    { schoolName: '鳥取湖陵', area: '東部', department: '緑地デザイン', quota: 28, finalApplicants: 5, finalRate: 0.18 },
    { schoolName: '鳥取湖陵', area: '東部', department: '電子機械', quota: 31, finalApplicants: 13, finalRate: 0.42 },
    { schoolName: '鳥取湖陵', area: '東部', department: '人間環境', quota: 27, finalApplicants: 14, finalRate: 0.52 },
    { schoolName: '鳥取湖陵', area: '東部', department: '情報科学', quota: 24, finalApplicants: 13, finalRate: 0.54 },
    { schoolName: '青谷', area: '東部', department: '総合', quota: 57, finalApplicants: 9, finalRate: 0.16 },
    { schoolName: '岩美', area: '東部', department: '普通', quota: 55, finalApplicants: 26, finalRate: 0.47 },
    { schoolName: '八頭', area: '東部', department: '普通', quota: 182, finalApplicants: 139, finalRate: 0.76 },
    { schoolName: '智頭農林', area: '東部', department: '生産科学・森林科学（くくり募集）', quota: 57, finalApplicants: 9, finalRate: 0.16 },
    { schoolName: '倉吉東', area: '中部', department: '普通', quota: 170, finalApplicants: 158, finalRate: 0.93 },
    { schoolName: '倉吉西', area: '中部', department: '普通', quota: 96, finalApplicants: 68, finalRate: 0.71 },
    { schoolName: '倉吉農業', area: '中部', department: '生物', quota: 24, finalApplicants: 14, finalRate: 0.58 },
    { schoolName: '倉吉農業', area: '中部', department: '食品', quota: 24, finalApplicants: 11, finalRate: 0.46 },
    { schoolName: '倉吉農業', area: '中部', department: '環境', quota: 29, finalApplicants: 4, finalRate: 0.14 },
    { schoolName: '倉吉総合産業', area: '中部', department: '機械', quota: 21, finalApplicants: 12, finalRate: 0.57 },
    { schoolName: '倉吉総合産業', area: '中部', department: '電気', quota: 23, finalApplicants: 9, finalRate: 0.39 },
    { schoolName: '倉吉総合産業', area: '中部', department: 'ビジネス', quota: 19, finalApplicants: 12, finalRate: 0.63 },
    { schoolName: '倉吉総合産業', area: '中部', department: '生活デザイン', quota: 19, finalApplicants: 14, finalRate: 0.74 },
    { schoolName: '鳥取中央育英', area: '中部', department: '普通', quota: 72, finalApplicants: 47, finalRate: 0.65 },
    { schoolName: '米子東', area: '西部', department: '普通（生命科学）', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '米子東', area: '西部', department: '普通（普通）', quota: 240, finalApplicants: 250, finalRate: 1.04 },
    { schoolName: '米子西', area: '西部', department: '普通', quota: 245, finalApplicants: 302, finalRate: 1.23 },
    { schoolName: '米子', area: '西部', department: '総合', quota: 114, finalApplicants: 83, finalRate: 0.73 },
    { schoolName: '米子南', area: '西部', department: 'ＩＴビジネス', quota: 69, finalApplicants: 38, finalRate: 0.55 },
    { schoolName: '米子南', area: '西部', department: '生活創造（ライフデザイン）', quota: 11, finalApplicants: 20, finalRate: 1.82 },
    { schoolName: '米子南', area: '西部', department: '生活創造（調理）', quota: 12, finalApplicants: 14, finalRate: 1.17 },
    { schoolName: '米子工業', area: '西部', department: '機械', quota: 22, finalApplicants: 14, finalRate: 0.64 },
    { schoolName: '米子工業', area: '西部', department: '電気', quota: 21, finalApplicants: 16, finalRate: 0.76 },
    { schoolName: '米子工業', area: '西部', department: '情報電子', quota: 22, finalApplicants: 19, finalRate: 0.86 },
    { schoolName: '米子工業', area: '西部', department: '環境エネルギー', quota: 23, finalApplicants: 13, finalRate: 0.57 },
    { schoolName: '米子工業', area: '西部', department: '建設（土木）', quota: 10, finalApplicants: 10, finalRate: 1 },
    { schoolName: '米子工業', area: '西部', department: '建設（建築）', quota: 10, finalApplicants: 9, finalRate: 0.9 },
    { schoolName: '境', area: '西部', department: '普通', quota: 150, finalApplicants: 106, finalRate: 0.71 },
    { schoolName: '境港総合技術', area: '西部', department: '海洋', quota: 29, finalApplicants: 21, finalRate: 0.72 },
    { schoolName: '境港総合技術', area: '西部', department: '食品・ビジネス', quota: 33, finalApplicants: 19, finalRate: 0.58 },
    { schoolName: '境港総合技術', area: '西部', department: '機械', quota: 30, finalApplicants: 13, finalRate: 0.43 },
    { schoolName: '境港総合技術', area: '西部', department: '電気電子', quota: 38, finalApplicants: 0, finalRate: 0 },
    { schoolName: '境港総合技術', area: '西部', department: '福祉', quota: 29, finalApplicants: 12, finalRate: 0.41 },
    { schoolName: '日野', area: '西部', department: '総合', quota: 54, finalApplicants: 22, finalRate: 0.41 },
    { schoolName: '鳥取東', area: '東部', department: '普通・理数（くくり募集）', quota: 280, finalApplicants: 290, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取西', area: '東部', department: '普通', quota: 272, finalApplicants: 289, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取商業', area: '東部', department: '商業', quota: 102, finalApplicants: 93, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取工業', area: '東部', department: '工業（機械・電気・情報工学・建設工学）（くくり募集）', quota: 108, finalApplicants: 49, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '食品システム', quota: 21, finalApplicants: 12, finalRate: 0.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '緑地デザイン', quota: 31, finalApplicants: 4, finalRate: 0.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '電子機械', quota: 32, finalApplicants: 14, finalRate: 0.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '人間環境', quota: 19, finalApplicants: 20, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '情報科学', quota: 22, finalApplicants: 25, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '青谷', area: '東部', department: '総合', quota: 56, finalApplicants: 21, finalRate: 0.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩美', area: '東部', department: '普通', quota: 55, finalApplicants: 35, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八頭', area: '東部', department: '普通', quota: 192, finalApplicants: 186, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '智頭農林', area: '東部', department: '生産科学・森林科学（くくり募集）', quota: 45, finalApplicants: 16, finalRate: 0.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉東', area: '中部', department: '普通', quota: 170, finalApplicants: 174, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉西', area: '中部', department: '普通', quota: 96, finalApplicants: 70, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉農業', area: '中部', department: '生物', quota: 24, finalApplicants: 14, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉農業', area: '中部', department: '食品', quota: 24, finalApplicants: 20, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉農業', area: '中部', department: '環境', quota: 27, finalApplicants: 7, finalRate: 0.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: '機械', quota: 19, finalApplicants: 23, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: '電気', quota: 19, finalApplicants: 7, finalRate: 0.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: 'ビジネス', quota: 19, finalApplicants: 15, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: '生活デザイン', quota: 19, finalApplicants: 20, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取中央育英', area: '中部', department: '普通', quota: 81, finalApplicants: 40, finalRate: 0.49, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子東', area: '西部', department: '普通(生命科学)', quota: 40, finalApplicants: 55, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子東', area: '西部', department: '普通(普通)', quota: 240, finalApplicants: 266, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子西', area: '西部', department: '普通', quota: 245, finalApplicants: 317, finalRate: 1.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子', area: '西部', department: '総合', quota: 114, finalApplicants: 113, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子南', area: '西部', department: 'ITビジネス', quota: 69, finalApplicants: 54, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子南', area: '西部', department: '生活創造(ライフデザイン)', quota: 11, finalApplicants: 7, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子南', area: '西部', department: '生活創造(調理)', quota: 12, finalApplicants: 22, finalRate: 1.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子工業', area: '西部', department: '機械', quota: 19, finalApplicants: 26, finalRate: 1.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子工業', area: '西部', department: '電気', quota: 22, finalApplicants: 24, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子工業', area: '西部', department: '情報電子', quota: 21, finalApplicants: 28, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子工業', area: '西部', department: '環境エネルギー', quota: 19, finalApplicants: 10, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子工業', area: '西部', department: '建設(土木)', quota: 10, finalApplicants: 10, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米子工業', area: '西部', department: '建設(建築)', quota: 11, finalApplicants: 7, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '境', area: '西部', department: '普通', quota: 150, finalApplicants: 119, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '海洋', quota: 31, finalApplicants: 14, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '食品・ビジネス', quota: 32, finalApplicants: 21, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '機械', quota: 31, finalApplicants: 16, finalRate: 0.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '電気電子', quota: 37, finalApplicants: 5, finalRate: 0.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '福祉', quota: 29, finalApplicants: 10, finalRate: 0.34, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日野', area: '西部', department: '総合', quota: 60, finalApplicants: 18, finalRate: 0.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳥取東', area: '東部', department: '普通・理数（くくり募集）', quota: 280, finalApplicants: 298, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取西', area: '東部', department: '普通', quota: 273, finalApplicants: 265, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取商業', area: '東部', department: '商業', quota: 102, finalApplicants: 85, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取工業', area: '東部', department: '工業（機械・電気・情報工学・建設工学）（くくり募集）', quota: 126, finalApplicants: 45, finalRate: 0.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '食品システム', quota: 20, finalApplicants: 16, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '緑地デザイン', quota: 30, finalApplicants: 11, finalRate: 0.37, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '電子機械', quota: 37, finalApplicants: 12, finalRate: 0.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '人間環境', quota: 20, finalApplicants: 17, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取湖陵', area: '東部', department: '情報科学', quota: 19, finalApplicants: 29, finalRate: 1.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '青谷', area: '東部', department: '総合', quota: 54, finalApplicants: 26, finalRate: 0.48, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '岩美', area: '東部', department: '普通', quota: 49, finalApplicants: 33, finalRate: 0.67, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八頭', area: '東部', department: '普通', quota: 206, finalApplicants: 213, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '智頭農林', area: '東部', department: 'ふるさと創造・森林科学・生活環境（くくり募集）', quota: 57, finalApplicants: 28, finalRate: 0.49, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉東', area: '中部', department: '普通', quota: 193, finalApplicants: 202, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉西', area: '中部', department: '普通', quota: 105, finalApplicants: 78, finalRate: 0.74, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉農業', area: '中部', department: '生物', quota: 24, finalApplicants: 9, finalRate: 0.38, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉農業', area: '中部', department: '食品', quota: 24, finalApplicants: 23, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉農業', area: '中部', department: '環境', quota: 25, finalApplicants: 9, finalRate: 0.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: '機械', quota: 23, finalApplicants: 15, finalRate: 0.65, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: '電気', quota: 23, finalApplicants: 19, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: 'ビジネス', quota: 23, finalApplicants: 24, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '倉吉総合産業', area: '中部', department: '生活デザイン', quota: 23, finalApplicants: 20, finalRate: 0.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳥取中央育英', area: '中部', department: '普通', quota: 86, finalApplicants: 49, finalRate: 0.57, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子東', area: '西部', department: '普通（生命科学）', quota: 40, finalApplicants: 66, finalRate: 1.65, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子東', area: '西部', department: '普通（普通）', quota: 240, finalApplicants: 261, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子西', area: '西部', department: '普通', quota: 245, finalApplicants: 279, finalRate: 1.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子', area: '西部', department: '総合', quota: 114, finalApplicants: 109, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子南', area: '西部', department: 'ITビジネス', quota: 72, finalApplicants: 54, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子南', area: '西部', department: '生活創造（ライフデザイン）', quota: 11, finalApplicants: 13, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子南', area: '西部', department: '生活創造（調理）', quota: 12, finalApplicants: 12, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子工業', area: '西部', department: '機械', quota: 27, finalApplicants: 8, finalRate: 0.3, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子工業', area: '西部', department: '電気', quota: 19, finalApplicants: 20, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子工業', area: '西部', department: '情報電子', quota: 27, finalApplicants: 28, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子工業', area: '西部', department: '環境エネルギー', quota: 27, finalApplicants: 19, finalRate: 0.7, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子工業', area: '西部', department: '建設（土木）', quota: 11, finalApplicants: 4, finalRate: 0.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米子工業', area: '西部', department: '建設（建築）', quota: 13, finalApplicants: 11, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '境', area: '西部', department: '普通', quota: 150, finalApplicants: 142, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '海洋', quota: 29, finalApplicants: 10, finalRate: 0.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '食品・ビジネス', quota: 29, finalApplicants: 24, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '機械', quota: 30, finalApplicants: 10, finalRate: 0.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '電気電子', quota: 37, finalApplicants: 10, finalRate: 0.27, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '境港総合技術', area: '西部', department: '福祉', quota: 29, finalApplicants: 19, finalRate: 0.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日野', area: '西部', department: '総合', quota: 64, finalApplicants: 23, finalRate: 0.36, fiscalYear: '令和6年度（2024年度）' },
  ],
};
