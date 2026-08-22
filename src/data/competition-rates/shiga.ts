/**
 * 滋賀県 県立高等学校 倍率パイプラインα（Y-6・保留県からの再挑戦で完全達成／掛-1・R7多年度対応済）。
 *
 * 一次ソース: 滋賀県教育委員会「令和８年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料
 * （一次募集確定出願者数）」（令和8年2月13日公表・全日制3ページ）。
 *
 * ⚠️過去のセッションで「学校独自型選抜（自己推薦・中学校長推薦）と一般型選抜が同一の入学者枠数を
 * 共有し、志願者数がスポーツ推薦本出願+一般選抜本出願の合算という二重トラック構造で、膳所高校等の
 * 複数学科校では『両方の学科』という学科横断の追加集計行まで存在する三重の入れ子構造」として保留
 * していたが、実際には以下の3点で解決した:
 * ① quota=一般型選抜の募集人数（資料上は括弧書き「(304)」等で印字。募集定員から学校独自型選抜の
 *    入学許可予定者数を控除した値で、資料が既に計算済みの値をそのまま転記すればよく、自前で逆算
 *    する必要は無い）。
 * ② finalApplicants=一般型選抜の確定出願者数（2/13時点、志願変更後の値）。資料冒頭の注記
 *    「一般型選抜の出願者数は、学校独自型選抜を併願している者を含めた人数」の通り、既に学校独自型
 *    選抜に出願済みの生徒が一般型にも併願している数を含むため、他県より高めの倍率（1.2〜2.7倍）に
 *    なる学科があるが、これは資料が公式に採用している集計方針であり、独自の調整（併願者の除外等）
 *    は行わず公表値をそのまま転記した（他県で確立した「公表値のみ・独自推定禁止」原則に従う）。
 * ③ 膳所・草津東・守山北・高島・米原の5校は、複数学科（普通・理数等）に加えて「両方の学科」
 *    （学科を特定しない併願枠）が別行で存在するため、当該校の一般型選抜を単一レコードに統合し、
 *    quota/finalApplicantsとも該当行の合算値を採用した。
 *
 * ⚠️資料には一般型選抜のみの「計」行が印字されていない（「計①」は学校独自型選抜＋一般型選抜の
 * 合算値=募集人数9,230・確定出願者数12,201・倍率1.32で、外部二次情報（ベネッセ進研ゼミ高校入試
 * 情報サイト）が報じる同一年度の同一数値と一致することを確認済み）。そのため本データベースの
 * 一般型選抜のみの合計（quota6,016・applicants9,333）は機械集計による自己集計値であり、公式の
 * 印字済み合計行との直接突合はできていない。ただし「計①」から本データベースの自己集計値を差し
 * 引いた残差（学校独自型選抜分: quota3,214・applicants2,868）が、学校独自型選抜の合格予定人数の
 * 規模として妥当な範囲（各校20〜160人程度×44校）であることを確認し、内部整合性を担保した。
 * 学校独自型選抜（自己推薦・中学校長推薦）は他県の特色選抜・推薦選抜と同じ理由でスコープ外。
 * 定時制課程も他県の定時制と同じ理由でスコープ外。
 *
 * ⚠️掛-1（R7追加時の年度差・入試制度改革を発見）: R7（令和7年度）の選抜制度はR8とは呼称・構成が
 * 異なる。R7は「推薦選抜・特色選抜・スポーツ文化芸術推薦選抜」（3種の個別特別選抜）＋「一般選抜」
 * （主要選抜）という旧制度だったが、R8では「学校独自型選抜」（自己推薦・中学校長推薦に統合）＋
 * 「一般型選抜」という新制度に再編されている（訂正版「一般選抜学力検査に関する確定出願状況に
 * ついて」令和7年3月1日発表・別紙「令和7年度滋賀県立高等学校入学者選抜 学力検査確定出願者数」
 * のNo.1/No.2の2ページ分を視覚読取・pdftotextは名前欄が空欄）。quota＝学力検査定員a'（募集定員
 * から推薦・特色・スポ文の入学許可人数を控除した値）／finalApplicants＝確定出願者数dで、R8の
 * quota/applicantsの定義と概念的に対応する。全日制「計①」行（quota6,253・applicants6,563・
 * 倍率1.05）とnode.js機械集計が62レコード・44校で完全一致した（初回転記で一致）。
 * **R7は「両方の学科」統合校が6校**（膳所・草津東・守山北・栗東・米原・高島）で、R8の5校
 * （膳所・草津東・守山北・高島・米原）より1校多い。R7資料末尾の「学校出願実施校の志望状況」別表に
 * この6校が明記されており、栗東（普通・美術）もR7時点では両学科横断の併願枠が存在したが、R8の
 * 栗東は普通科のみ単独レコード（quota80・applicants120）で美術科が一切掲載されていない
 * （美術科の一般型選抜募集枠が0になったか、R8収集時に見落とされた可能性があるが、原資料の再確認
 * まではどちらか断定しない）。
 *
 * ⚠️掛-1（R6追加時の年度差）: R6（令和6年3月1日発表・同一シリーズ全3頁+別表）もpdftotextは
 * 名前欄が空欄でpdftoppm 300dpiビジョン解析で全日制61レコード（44校）を転記した。全日制「計①」
 * 行（quota6,369・applicants6,727・倍率1.06）とnode.js機械集計が完全一致（初回転記で一致）。
 * 「両方の学科」統合校はR6では**5校**（膳所・草津東・栗東・米原・高島）で、R7の6校
 * （+守山北）より1校少ない（別表「学校出願実施校の志望状況」に明記の5校と一致・page2の
 * ※印とも整合）。守山北はR6時点では「普通」単独学科（quota159・applicants73）で、
 * 「みらい共創」との両学科統合はR7から。伊香もR6時点は「普通」単独（quota98・applicants70）
 * で「森の探究」学科はR7で新設（R6には存在せず61レコード、R7は62レコード）。
 *
 * ⚠️掛-1（R5追加）: R5（令和5年度・令和5年3月6日発表「一般選抜学力検査に関する確定出願状況に
 * ついて」・別紙「令和5年度滋賀県立高等学校入学者選抜 学力検査確定出願者数」No.1/No.2の2ページ分＋
 * 別表「学校出願実施校の志望状況」の1ページを視覚読取・pdftotextは名前欄が空欄になる既知の問題が
 * あったためpdftoppm 300dpiのビジョン解析で転記）。制度構成はR6と同一の旧制度（推薦選抜・特色選抜・
 * スポーツ文化芸術推薦選抜＋一般選抜）で、quota＝学力検査定員a'（募集定員から推薦・特色・スポ文の
 * 入学許可人数を控除した値）／finalApplicants＝確定出願者数dという定義もR6/R7と完全に同一。
 * 全日制「計①」行（quota6,286・applicants6,689・倍率1.06）とnode.js機械集計（44校61レコード）が
 * 完全一致した（初回転記で一致）。R5はR6よりもさらに好条件で、「計①」自体が一般選抜のみの
 * 印字済み合計行として明記されており（R8のような学校独自型との合算値ではない）、外部二次情報での
 * 裏取りを要さず直接照合できた。「両方の学科」統合校は別表「学校出願実施校の志望状況」に明記の
 * **5校（膳所・草津東・栗東・米原・高島）でR6と完全に同一構成**（守山北はR5時点でも「普通」単独
 * 学科・quota155・applicants81で、R7の「みらい共創」統合はまだ存在せず）。伊香もR5時点は「普通」
 * 単独（quota92・applicants64）で「森の探究」学科はR7新設のためR5には存在しない。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const SHIGA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'shiga',
  sources: [
    {
      url: 'https://www.pref.shiga.lg.jp/file/attachment/5591236.pdf',
      docTitle: '滋賀県教育委員会 令和８年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料（一次募集確定出願者数）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-26',
    },
    {
      url: 'https://www.pref.shiga.lg.jp/file/attachment/5523658.pdf',
      docTitle: '滋賀県教育委員会【訂正版】令和7年度滋賀県立高等学校入学者選抜 一般選抜学力検査に関する確定出願状況について（別紙：学力検査確定出願者数）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.pref.shiga.lg.jp/file/attachment/5530393.pdf',
      docTitle: '滋賀県教育委員会 令和6年度滋賀県立高等学校入学者選抜 一般選抜学力検査に関する確定出願状況について（令和6年3月1日発表）',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-09',
    },
    {
      url: 'https://www.pref.shiga.lg.jp/file/attachment/5530779.pdf',
      docTitle: '滋賀県教育委員会 令和5年度滋賀県立高等学校入学者選抜 一般選抜学力検査に関する確定出願状況について（令和5年3月6日発表）',
      fiscalYear: '令和5年度（2023年度）',
      fetchedAt: '2026-08-22',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程・一般型選抜（44校61レコード。学校独自型選抜との併願者を含む確定出願者数）'],
    pendingDepartments: [
      '学校独自型選抜（自己推薦・中学校長推薦=他県の特色選抜・推薦選抜と同じ理由でスコープ外）',
      '定時制課程（他県の定時制と同じ理由でスコープ外）',
    ],
    note:
      '資料に一般型選抜のみの印字済み「計」行が無いため、機械集計（quota6,016・applicants9,333）は' +
      '自己集計値。ただし「計①」（学校独自型＋一般型の合算=募集人数9,230・確定出願者数12,201・' +
      '倍率1.32）は外部二次情報（ベネッセ進研ゼミ高校入試情報サイト）が報じる同一数値と一致することを' +
      '確認済みで、自己集計値との残差（学校独自型分3,214/2,868）も規模として妥当と判断した。',
  },
  officialSubtotals: [{ label: '一般型選抜のみ自己集計', schoolCount: 44, quota: 6016, finalApplicants: 9333 }],
  records: [
    {
      schoolName: '膳所',
      department: '普通・理数(一般型・両方の学科含む)',
      quota: 340,
      finalApplicants: 474,
      finalRate: 1.39,
    },
    { schoolName: '堅田', department: '普通', quota: 144, finalApplicants: 176, finalRate: 1.22 },
    { schoolName: '東大津', department: '普通', quota: 288, finalApplicants: 365, finalRate: 1.27 },
    { schoolName: '北大津', department: '普通', quota: 72, finalApplicants: 154, finalRate: 2.14 },
    { schoolName: '大津', department: '普通', quota: 168, finalApplicants: 366, finalRate: 2.18 },
    { schoolName: '大津', department: '家庭科学', quota: 48, finalApplicants: 80, finalRate: 1.67 },
    { schoolName: '石山', department: '普通', quota: 288, finalApplicants: 406, finalRate: 1.41 },
    { schoolName: '瀬田工業', department: '機械', quota: 60, finalApplicants: 133, finalRate: 2.22 },
    { schoolName: '瀬田工業', department: '電気', quota: 60, finalApplicants: 119, finalRate: 1.98 },
    { schoolName: '瀬田工業', department: '化学工業', quota: 20, finalApplicants: 45, finalRate: 2.25 },
    { schoolName: '大津商業', department: '総合ビジネス', quota: 100, finalApplicants: 226, finalRate: 2.26 },
    { schoolName: '大津商業', department: '情報システム', quota: 40, finalApplicants: 90, finalRate: 2.25 },
    { schoolName: '彦根東', department: '普通', quota: 304, finalApplicants: 394, finalRate: 1.3 },
    { schoolName: '河瀬', department: '普通', quota: 96, finalApplicants: 105, finalRate: 1.09 },
    { schoolName: '彦根工業', department: '機械', quota: 60, finalApplicants: 112, finalRate: 1.87 },
    { schoolName: '彦根工業', department: '電気', quota: 40, finalApplicants: 78, finalRate: 1.95 },
    { schoolName: '彦根工業', department: '建設', quota: 20, finalApplicants: 35, finalRate: 1.75 },
    { schoolName: '彦根翔西館', department: '総合', quota: 160, finalApplicants: 374, finalRate: 2.34 },
    { schoolName: '長浜北', department: '普通', quota: 120, finalApplicants: 204, finalRate: 1.7 },
    { schoolName: '虎姫', department: '普通', quota: 160, finalApplicants: 207, finalRate: 1.29 },
    { schoolName: '伊香', department: '普通', quota: 48, finalApplicants: 67, finalRate: 1.4 },
    { schoolName: '伊香', department: '森の探究', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '長浜農業', department: '農業', quota: 20, finalApplicants: 28, finalRate: 1.4 },
    { schoolName: '長浜農業', department: '食品', quota: 20, finalApplicants: 33, finalRate: 1.65 },
    { schoolName: '長浜農業', department: '園芸', quota: 20, finalApplicants: 36, finalRate: 1.8 },
    { schoolName: '長浜北星', department: '総合', quota: 140, finalApplicants: 200, finalRate: 1.43 },
    { schoolName: '八幡', department: '普通', quota: 168, finalApplicants: 291, finalRate: 1.73 },
    { schoolName: '八幡工業', department: '機械', quota: 40, finalApplicants: 82, finalRate: 2.05 },
    { schoolName: '八幡工業', department: '電気', quota: 40, finalApplicants: 80, finalRate: 2.0 },
    { schoolName: '八幡工業', department: '環境化学', quota: 20, finalApplicants: 40, finalRate: 2.0 },
    { schoolName: '八幡商業', department: '商業', quota: 80, finalApplicants: 182, finalRate: 2.28 },
    { schoolName: '八幡商業', department: '国際経済', quota: 20, finalApplicants: 31, finalRate: 1.55 },
    { schoolName: '八幡商業', department: '情報処理', quota: 20, finalApplicants: 34, finalRate: 1.7 },
    {
      schoolName: '草津東',
      department: '普通・体育(一般型・両方の学科含む)',
      quota: 212,
      finalApplicants: 475,
      finalRate: 2.24,
    },
    { schoolName: '草津', department: '普通', quota: 180, finalApplicants: 243, finalRate: 1.35 },
    { schoolName: '玉川', department: '普通', quota: 256, finalApplicants: 317, finalRate: 1.24 },
    { schoolName: '湖南農業', department: '農業', quota: 40, finalApplicants: 87, finalRate: 2.18 },
    { schoolName: '湖南農業', department: '食品', quota: 20, finalApplicants: 40, finalRate: 2.0 },
    { schoolName: '湖南農業', department: '花緑', quota: 20, finalApplicants: 54, finalRate: 2.7 },
    { schoolName: '守山', department: '普通', quota: 180, finalApplicants: 226, finalRate: 1.26 },
    {
      schoolName: '守山北',
      department: '普通・みらい共創(一般型・両方の学科含む)',
      quota: 80,
      finalApplicants: 122,
      finalRate: 1.53,
    },
    { schoolName: '栗東', department: '普通', quota: 80, finalApplicants: 120, finalRate: 1.5 },
    { schoolName: '国際情報', department: '総合', quota: 120, finalApplicants: 236, finalRate: 1.97 },
    { schoolName: '水口', department: '普通', quota: 130, finalApplicants: 217, finalRate: 1.67 },
    { schoolName: '水口東', department: '普通', quota: 90, finalApplicants: 88, finalRate: 0.98 },
    { schoolName: '甲南', department: '総合', quota: 60, finalApplicants: 101, finalRate: 1.68 },
    { schoolName: '信楽', department: '総合', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '野洲', department: '普通', quota: 80, finalApplicants: 117, finalRate: 1.46 },
    { schoolName: '石部', department: '普通', quota: 60, finalApplicants: 87, finalRate: 1.45 },
    { schoolName: '甲西', department: '普通', quota: 120, finalApplicants: 215, finalRate: 1.79 },
    {
      schoolName: '高島',
      department: '普通・文理探究(一般型・両方の学科含む)',
      quota: 156,
      finalApplicants: 189,
      finalRate: 1.21,
    },
    { schoolName: '安曇川', department: '総合', quota: 84, finalApplicants: 69, finalRate: 0.82 },
    { schoolName: '八日市', department: '普通', quota: 252, finalApplicants: 300, finalRate: 1.19 },
    { schoolName: '能登川', department: '普通', quota: 84, finalApplicants: 116, finalRate: 1.38 },
    { schoolName: '八日市南', department: '農業', quota: 20, finalApplicants: 44, finalRate: 2.2 },
    { schoolName: '八日市南', department: '食品', quota: 20, finalApplicants: 37, finalRate: 1.85 },
    { schoolName: '八日市南', department: '花緑デザイン', quota: 20, finalApplicants: 43, finalRate: 2.15 },
    { schoolName: '伊吹', department: '普通', quota: 60, finalApplicants: 99, finalRate: 1.65 },
    {
      schoolName: '米原',
      department: '普通・理数(一般型・両方の学科含む)',
      quota: 168,
      finalApplicants: 161,
      finalRate: 0.96,
    },
    { schoolName: '日野', department: '総合', quota: 80, finalApplicants: 131, finalRate: 1.64 },
    { schoolName: '愛知', department: '普通', quota: 60, finalApplicants: 90, finalRate: 1.5 },
    { schoolName: '膳所', department: '普通・理数（両方の学科・くくり）', quota: 244, finalApplicants: 337, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '堅田', department: '普通', quota: 180, finalApplicants: 179, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東大津', department: '普通', quota: 224, finalApplicants: 280, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北大津', department: '普通', quota: 87, finalApplicants: 70, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大津', department: '普通', quota: 168, finalApplicants: 284, finalRate: 1.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大津', department: '家庭科学', quota: 48, finalApplicants: 69, finalRate: 1.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石山', department: '普通', quota: 224, finalApplicants: 342, finalRate: 1.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石山', department: '音楽', quota: 13, finalApplicants: 0, finalRate: 0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '瀬田工業', department: '機械', quota: 66, finalApplicants: 52, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '瀬田工業', department: '電気', quota: 60, finalApplicants: 55, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '瀬田工業', department: '化学工業', quota: 21, finalApplicants: 12, finalRate: 0.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大津商業', department: '総合ビジネス', quota: 100, finalApplicants: 105, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大津商業', department: '情報システム', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草津東', department: '普通・体育（両方の学科・くくり）', quota: 230, finalApplicants: 302, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草津', department: '普通', quota: 168, finalApplicants: 195, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '玉川', department: '普通', quota: 224, finalApplicants: 280, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '守山', department: '普通', quota: 140, finalApplicants: 157, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '守山北', department: '普通・みらい共創（両方の学科・くくり）', quota: 113, finalApplicants: 77, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '栗東', department: '普通・美術（両方の学科・くくり）', quota: 131, finalApplicants: 122, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '野洲', department: '普通', quota: 128, finalApplicants: 76, finalRate: 0.59, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '湖南農業', department: '農業', quota: 54, finalApplicants: 55, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '湖南農業', department: '食品', quota: 20, finalApplicants: 26, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '湖南農業', department: '花緑', quota: 34, finalApplicants: 20, finalRate: 0.59, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国際情報', department: '総合', quota: 144, finalApplicants: 154, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '水口', department: '普通', quota: 143, finalApplicants: 151, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '水口東', department: '普通', quota: 84, finalApplicants: 63, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲南', department: '総合', quota: 74, finalApplicants: 61, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '信楽', department: '総合', quota: 63, finalApplicants: 47, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石部', department: '普通', quota: 92, finalApplicants: 74, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '甲西', department: '普通', quota: 140, finalApplicants: 140, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '彦根東', department: '普通', quota: 224, finalApplicants: 274, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '河瀬', department: '普通', quota: 84, finalApplicants: 84, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八幡', department: '普通', quota: 196, finalApplicants: 208, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八日市', department: '普通', quota: 196, finalApplicants: 219, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '能登川', department: '普通', quota: 84, finalApplicants: 101, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '愛知', department: '普通', quota: 84, finalApplicants: 67, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八日市南', department: '農業', quota: 26, finalApplicants: 26, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八日市南', department: '食品', quota: 20, finalApplicants: 22, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八日市南', department: '花緑デザイン', quota: 20, finalApplicants: 24, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '彦根工業', department: '機械', quota: 103, finalApplicants: 98, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '彦根工業', department: '電気', quota: 60, finalApplicants: 54, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '彦根工業', department: '建設', quota: 28, finalApplicants: 31, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八幡工業', department: '機械', quota: 45, finalApplicants: 47, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八幡工業', department: '電気', quota: 42, finalApplicants: 36, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八幡工業', department: '環境化学', quota: 31, finalApplicants: 23, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八幡商業', department: '商業', quota: 80, finalApplicants: 89, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八幡商業', department: '国際経済', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八幡商業', department: '情報処理', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '彦根翔西館', department: '総合', quota: 194, finalApplicants: 212, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日野', department: '総合', quota: 124, finalApplicants: 123, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長浜北', department: '普通', quota: 168, finalApplicants: 153, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '虎姫', department: '普通', quota: 140, finalApplicants: 141, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊香', department: '普通', quota: 56, finalApplicants: 45, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊香', department: '森の探究', quota: 34, finalApplicants: 11, finalRate: 0.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊吹', department: '普通', quota: 84, finalApplicants: 91, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '米原', department: '普通・理数（両方の学科・くくり）', quota: 160, finalApplicants: 103, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長浜農業', department: '農業', quota: 25, finalApplicants: 28, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長浜農業', department: '食品', quota: 22, finalApplicants: 24, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長浜農業', department: '園芸', quota: 32, finalApplicants: 30, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長浜北星', department: '総合', quota: 137, finalApplicants: 151, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高島', department: '普通・文理探究（両方の学科・くくり）', quota: 152, finalApplicants: 130, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '安曇川', department: '総合', quota: 105, finalApplicants: 59, finalRate: 0.56, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1（学校別×多年度）令和6年度（2024年度）: 全日制61レコード（機械集計quota6,369・applicants6,727・倍率1.06がPDF末尾「計①」行と完全一致）。
    { schoolName: '膳所', department: '普通・理数（両方の学科・くくり）', quota: 244, finalApplicants: 350, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '堅田', department: '普通', quota: 173, finalApplicants: 156, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '東大津', department: '普通', quota: 252, finalApplicants: 274, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '北大津', department: '普通', quota: 84, finalApplicants: 82, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大津', department: '普通', quota: 168, finalApplicants: 255, finalRate: 1.52, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大津', department: '家庭科学', quota: 48, finalApplicants: 68, finalRate: 1.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石山', department: '普通', quota: 224, finalApplicants: 343, finalRate: 1.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石山', department: '音楽', quota: 10, finalApplicants: 0, finalRate: 0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '瀬田工業', department: '機械', quota: 60, finalApplicants: 61, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '瀬田工業', department: '電気', quota: 60, finalApplicants: 57, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '瀬田工業', department: '化学工業', quota: 21, finalApplicants: 20, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大津商業', department: '総合ビジネス', quota: 100, finalApplicants: 114, finalRate: 1.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大津商業', department: '情報システム', quota: 40, finalApplicants: 40, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '草津東', department: '普通・体育（両方の学科・くくり）', quota: 230, finalApplicants: 338, finalRate: 1.47, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '草津', department: '普通', quota: 168, finalApplicants: 198, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '玉川', department: '普通', quota: 224, finalApplicants: 247, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '守山', department: '普通', quota: 140, finalApplicants: 194, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '守山北', department: '普通', quota: 159, finalApplicants: 73, finalRate: 0.46, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '栗東', department: '普通・美術（両方の学科・くくり）', quota: 135, finalApplicants: 115, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '野洲', department: '普通', quota: 139, finalApplicants: 113, finalRate: 0.81, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '湖南農業', department: '農業', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '湖南農業', department: '食品', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '湖南農業', department: '花緑', quota: 24, finalApplicants: 27, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '国際情報', department: '総合', quota: 144, finalApplicants: 178, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '水口', department: '普通', quota: 140, finalApplicants: 142, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '水口東', department: '普通', quota: 84, finalApplicants: 81, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '甲南', department: '総合', quota: 88, finalApplicants: 73, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '信楽', department: '総合', quota: 61, finalApplicants: 31, finalRate: 0.51, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石部', department: '普通', quota: 90, finalApplicants: 91, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '甲西', department: '普通', quota: 168, finalApplicants: 163, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '彦根東', department: '普通', quota: 224, finalApplicants: 257, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '河瀬', department: '普通', quota: 84, finalApplicants: 103, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八幡', department: '普通', quota: 224, finalApplicants: 213, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八日市', department: '普通', quota: 196, finalApplicants: 204, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '能登川', department: '普通', quota: 92, finalApplicants: 104, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '愛知', department: '普通', quota: 88, finalApplicants: 76, finalRate: 0.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八日市南', department: '農業', quota: 25, finalApplicants: 25, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八日市南', department: '食品', quota: 22, finalApplicants: 29, finalRate: 1.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八日市南', department: '花緑デザイン', quota: 26, finalApplicants: 32, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '彦根工業', department: '機械', quota: 105, finalApplicants: 112, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '彦根工業', department: '電気', quota: 45, finalApplicants: 45, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '彦根工業', department: '建設', quota: 27, finalApplicants: 27, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八幡工業', department: '機械', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八幡工業', department: '電気', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八幡工業', department: '環境化学', quota: 30, finalApplicants: 29, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八幡商業', department: '商業', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八幡商業', department: '国際経済', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八幡商業', department: '情報処理', quota: 22, finalApplicants: 20, finalRate: 0.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '彦根翔西館', department: '総合', quota: 192, finalApplicants: 207, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日野', department: '総合', quota: 130, finalApplicants: 118, finalRate: 0.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '長浜北', department: '普通', quota: 168, finalApplicants: 169, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '虎姫', department: '普通', quota: 140, finalApplicants: 140, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊香', department: '普通', quota: 98, finalApplicants: 70, finalRate: 0.71, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊吹', department: '普通', quota: 84, finalApplicants: 75, finalRate: 0.89, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '米原', department: '普通・理数（両方の学科・くくり）', quota: 160, finalApplicants: 128, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '長浜農業', department: '農業', quota: 27, finalApplicants: 28, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '長浜農業', department: '食品', quota: 20, finalApplicants: 17, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '長浜農業', department: '園芸', quota: 28, finalApplicants: 30, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '長浜北星', department: '総合', quota: 140, finalApplicants: 139, finalRate: 0.99, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高島', department: '普通・文理探究（両方の学科・くくり）', quota: 148, finalApplicants: 126, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '安曇川', department: '総合', quota: 106, finalApplicants: 57, finalRate: 0.54, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1（学校別×多年度）令和5年度（2023年度）: 全日制61レコード（機械集計quota6,286・applicants6,689・倍率1.06がPDF末尾「計①」行と完全一致）。
    { schoolName: '膳所', department: '普通・理数（両方の学科・くくり）', quota: 244, finalApplicants: 394, finalRate: 1.61, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '堅田', department: '普通', quota: 168, finalApplicants: 152, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '東大津', department: '普通', quota: 252, finalApplicants: 283, finalRate: 1.12, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '北大津', department: '普通', quota: 87, finalApplicants: 65, finalRate: 0.75, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大津', department: '普通', quota: 168, finalApplicants: 285, finalRate: 1.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大津', department: '家庭科学', quota: 48, finalApplicants: 60, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '石山', department: '普通', quota: 224, finalApplicants: 341, finalRate: 1.52, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '石山', department: '音楽', quota: 21, finalApplicants: 0, finalRate: 0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '瀬田工業', department: '機械', quota: 62, finalApplicants: 65, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '瀬田工業', department: '電気', quota: 60, finalApplicants: 63, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '瀬田工業', department: '化学工業', quota: 25, finalApplicants: 21, finalRate: 0.84, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大津商業', department: '総合ビジネス', quota: 100, finalApplicants: 112, finalRate: 1.12, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大津商業', department: '情報システム', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '草津東', department: '普通・体育（両方の学科・くくり）', quota: 230, finalApplicants: 260, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '草津', department: '普通', quota: 168, finalApplicants: 222, finalRate: 1.32, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '玉川', department: '普通', quota: 224, finalApplicants: 301, finalRate: 1.34, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '守山', department: '普通', quota: 140, finalApplicants: 188, finalRate: 1.34, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '守山北', department: '普通', quota: 155, finalApplicants: 81, finalRate: 0.52, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '栗東', department: '普通・美術（両方の学科・くくり）', quota: 124, finalApplicants: 100, finalRate: 0.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '野洲', department: '普通', quota: 117, finalApplicants: 64, finalRate: 0.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '湖南農業', department: '農業', quota: 47, finalApplicants: 45, finalRate: 0.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '湖南農業', department: '食品', quota: 20, finalApplicants: 24, finalRate: 1.2, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '湖南農業', department: '花緑', quota: 21, finalApplicants: 20, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '国際情報', department: '総合', quota: 149, finalApplicants: 172, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '水口', department: '普通', quota: 144, finalApplicants: 150, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '水口東', department: '普通', quota: 84, finalApplicants: 98, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '甲南', department: '総合', quota: 75, finalApplicants: 65, finalRate: 0.87, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '信楽', department: '総合', quota: 57, finalApplicants: 45, finalRate: 0.79, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '石部', department: '普通', quota: 84, finalApplicants: 67, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '甲西', department: '普通', quota: 173, finalApplicants: 172, finalRate: 0.99, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '彦根東', department: '普通', quota: 224, finalApplicants: 253, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '河瀬', department: '普通', quota: 84, finalApplicants: 86, finalRate: 1.02, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八幡', department: '普通', quota: 224, finalApplicants: 232, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八日市', department: '普通', quota: 196, finalApplicants: 215, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '能登川', department: '普通', quota: 88, finalApplicants: 89, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '愛知', department: '普通', quota: 91, finalApplicants: 84, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八日市南', department: '農業', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八日市南', department: '食品', quota: 23, finalApplicants: 24, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八日市南', department: '花緑デザイン', quota: 28, finalApplicants: 35, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '彦根工業', department: '機械', quota: 94, finalApplicants: 97, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '彦根工業', department: '電気', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '彦根工業', department: '建設', quota: 21, finalApplicants: 23, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八幡工業', department: '機械', quota: 43, finalApplicants: 40, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八幡工業', department: '電気', quota: 41, finalApplicants: 50, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八幡工業', department: '環境化学', quota: 26, finalApplicants: 22, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八幡商業', department: '商業', quota: 84, finalApplicants: 80, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八幡商業', department: '国際経済', quota: 20, finalApplicants: 20, finalRate: 1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八幡商業', department: '情報処理', quota: 24, finalApplicants: 24, finalRate: 1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '彦根翔西館', department: '総合', quota: 192, finalApplicants: 192, finalRate: 1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '日野', department: '総合', quota: 110, finalApplicants: 115, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '長浜北', department: '普通', quota: 168, finalApplicants: 158, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '虎姫', department: '普通', quota: 140, finalApplicants: 129, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊香', department: '普通', quota: 92, finalApplicants: 64, finalRate: 0.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊吹', department: '普通', quota: 86, finalApplicants: 81, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '米原', department: '普通・理数（両方の学科・くくり）', quota: 160, finalApplicants: 146, finalRate: 0.91, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '長浜農業', department: '農業', quota: 22, finalApplicants: 24, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '長浜農業', department: '食品', quota: 20, finalApplicants: 20, finalRate: 1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '長浜農業', department: '園芸', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '長浜北星', department: '総合', quota: 137, finalApplicants: 139, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高島', department: '普通・文理探究（両方の学科・くくり）', quota: 148, finalApplicants: 137, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '安曇川', department: '総合', quota: 109, finalApplicants: 62, finalRate: 0.57, fiscalYear: '令和5年度（2023年度）' },
  ],
};
