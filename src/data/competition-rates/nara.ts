/**
 * 奈良県 公立高等学校 倍率パイプラインα（Y-6・30県目・全日制完全達成）。
 *
 * 一次ソース: 奈良県教育委員会「令和8年度奈良県公立高等学校入学者一次選抜等出願状況（第二出願
 * 期間）」（令和8年3月2日発表・全2ページ）。
 *
 * ⚠️奈良県は令和8年度より特色選抜と一般選抜を一本化した「一次選抜」を実施し、志願者は第1希望・
 * 第2希望の2校まで出願できる独自制度を持つ。第1希望は「第一出願期間」に、第2希望は「第二出願
 * 期間」に出願する（第二出願期間に出願できるのは第一出願期間の出願者数が募集人員に満たなかった
 * 学科のみ）。**本データベースは「第一出願期間」の出願者数のみを採用し、「第二出願期間」（未充足
 * 学科への第2希望受付という別プロセス）は他県の「第2志望」と同じ理由で除外した**（罠: 初見では
 * 両期間の数値を単純合算しそうになったが、外部報道（リセモム記事）が「全日制課程一次選抜の募集
 * 人員は6,896人、第一出願期間出願者数は6,276人、競争倍率は0.91倍」「一条高校1.51倍」「郡山高校
 * 1.27倍」「奈良高校1.20倍」と報じている数値が、募集人員(quota)と第一出願期間出願者数(applicants)
 * のみで算出した自前計算値と完全一致することを確認し、第一出願期間のみが実質倍率の基準であると
 * 特定した）。
 *
 * ⚠️資料自体には倍率が印字されていないため、finalRate=第一出願期間出願者数÷募集人員（小数第2位
 * に四捨五入）を自前算出した（他県で倍率非印字の場合と同じ扱い）。商業科（会計・情報ビジネス・
 * 経営ビジネス・総合ビジネスの4学科）は資料上「会計」のみに数値が印字され他3学科は空欄のため、
 * くくり募集として単一レコードで収録した。
 *
 * 機械集計（quota6,896・applicants6,276、29校71レコード）が「合計」行（募集人員6,896・
 * 第一出願期間出願者数6,276）と初回転記で完全一致した（再修正なし）。定時制課程・外国人／帰国
 * 生徒特別選抜は他県の定時制／特別選抜と同じ理由でスコープ外。
 *
 * 【掛-1（学校別×多年度）追加】令和7年度分を追加。一次ソースは奈良県「令和7年度奈良県公立高等学校
 * 入学者一般選抜等合格者数」（令和7年3月18日公表・全2ページ）。⚠️令和7年度は令和8年度の「一次選抜」
 * 一本化制度が導入される前の旧制度（特色選抜と一般選抜の別トラック）で実施されており、資料は
 * 【ア　一般選抜で定員の全て又は一部を募集する学科（コース）】＝募集人員の全部または大半が一般選抜
 * を通る学校・学科と、【イ　特色選抜で合格者数が募集人員に満たなかった学科（コース）】＝特色選抜で
 * 定員充足できず一般選抜へ回った"残り枠"のみを示す学科、の2表に分かれる。**表イの学科（商業・工業・
 * 音楽・美術等の専門学科の大半）は特色選抜で真の需要の大半が吸収された後の残り枠でしかなく、
 * R8の統一「一次選抜」出願者数と比較可能な母数ではないため、本追加では表アに掲載された学校・学科
 * （実質的に普通科系＝一般選抜が定員の全部/大半を占める学校）のみを収録した**（罠: 表イも含めて
 * 全専門学科を収録すると見かけ上のレコード数は増えるが、質的に異なる母集団を同一テーブルに混在
 * させることになり後年度比較の意味が壊れる。奈良商工・二階堂・御所実業・磯城野・王寺工業・奈良南等
 * の専門学科校はR7時点で表イにすら現れず＝特色選抜のみで完全充足しており一般選抜の実質倍率データが
 * 存在しないため、これらの学校は令和7年度分として収録していない）。表アの学校でも音楽/美術/デザイン
 * （高円芸術）・書芸コース（桜井）・人文探究コース（添上）・生涯スポーツ（大和広陵）等の専門コースは
 * 表イ側（特色選抜メイン）に現れるため同様の理由で除外し、普通科相当の主要コースのみを収録した。
 * 機械集計（quota4,400・applicants4,490、17校19レコード）が表アの「合計」行（募集人員4,400・
 * 出願者数4,490）と初回転記で完全一致した（再修正なし）。倍率は資料に印字が無いため自前算出。
 *
 * 【掛-1（学校別×多年度）追加・3年度目】令和6年度分を追加（PHASE0_FINDINGS.md 2章項目7
 * follow-up・3年度以上43/47→44/47への前進）。一次ソースは奈良県「令和6年度奈良県公立高等学校
 * 入学者一般選抜等合格者数」（令和6年3月15日公表・全2ページ）——県公式サイトから現在も直接
 * 取得可能（Waybackを介さず`https://www.pref.nara.lg.jp/documents/5981/`配下で現存）。R7と
 * 同一の資料構成（表ア＝一般選抜が定員の全部/大半を占める学校のみ・表イ＝特色選抜残り枠は
 * 同じ理由で除外）。ToUnicodeマッピング欠落によりpdftoppm 200dpiビジョン解析で全2頁を転記した。
 * 機械集計（quota4,440・applicants4,702、17校19レコード）が表アの「合計」行（募集人員4,440・
 * 出願者数4,702）と初回転記で完全一致した（再修正なし）。R7と学校名・学科構成は完全一致
 * （統廃合・新設なし）。倍率は資料に印字が無いため自前算出（applicants÷quota、小数第2位四捨五入）。
 *
 * 【掛-1（学校別×多年度）追加・5年度目・T-Y11F §11払底時の逃げ場】令和4年度分を追加。
 * ⚠️台帳に記載されていた`61092.htm`/`58695.htm`系列ページ（学校ごとの学力検査・調査書の
 * 配点比率を示す「選抜方法基準」文書へのリンク集）は資料カテゴリが根本的に異なり出願者数
 * データを含まないと判明したため使用しなかった。代わりに`pref.nara.jp/40751.htm`
 * （「公立高校入試出願・実施状況等」・Wayback 2022-10-04クロール）から「令和4年度奈良県
 * 公立高等学校入学者一般選抜等出願状況（最終）」（令和4年3月4日発表・全1頁）を発見した。
 * R6/R7とは異なりこの年度の資料には表ア／表イの区分が無く、専門学科校（御所実業・磯城野・
 * 王寺工業等）も含め全ての学校が1つの表に混在している（特色選抜による吸収度合いは年度に
 * よって変動するため、専門学科校の残り枠が0になるかどうかは年度依存であり、R4時点では
 * まだ若干の残り枠が生じていたことを示す）。後年度（R6/R7）との比較可能性を保つため、
 * R6/R7で確立した「表ア相当」の同一17校19学科（普通科系・数理情報・普通(表現探究)等）
 * のみを抽出し、専門学科の残り枠（御所実業・王寺工業等の1〜8名規模のレコード）は今回も
 * 除外した。本資料は競争倍率が印字済みのため自前算出は不要で、転記した全19行の
 * quota/applicants組から計算した倍率が印字済み倍率と完全一致することを1行ずつ検算した
 * （誤差ゼロ・全行一致）。機械集計はquota4,432・applicants4,864（自己算出・本資料には
 * この17校19学科だけの公式小計行が存在しないため）。R6/R7と学校名・学科構成は完全一致
 * （統廃合・新設なし）。原本ページは現行サイトから削除済みのためWayback Machine経由で取得。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const NARA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'nara',
  sources: [
    {
      url: 'https://www.pref.nara.lg.jp/documents/5981/r8_itijisennbatu_dainisyutugannkikann_syutugannsyasuu.pdf',
      docTitle: '奈良県教育委員会 令和8年度奈良県公立高等学校入学者一次選抜等出願状況（第二出願期間）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
      // T-Y11F §5順序#8: 2026-09-11に再取得して計測。既存の71件のquota/finalApplicants等は書き換えていない
      pdfSha256: '8a56a562abce73287d89e9d47aa2fda18ac5d94b39df57d99095ccd535de4bbf',
    },
    {
      url: 'https://www.pref.nara.lg.jp/documents/5981/r7_ippann_goukakusyasuu.pdf',
      docTitle: '奈良県教育委員会 令和7年度奈良県公立高等学校入学者一般選抜等合格者数',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-09',
    },
    {
      url: 'https://www.pref.nara.lg.jp/documents/5981/r6ippann_goukakusyasuu.pdf',
      docTitle: '奈良県教育委員会 令和6年度奈良県公立高等学校入学者一般選抜等合格者数',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-24',
    },
    {
      url: 'https://www.pref.nara.jp/secure/253381/2022ippan0304%20_.pdf',
      docTitle: '奈良県教育委員会 令和4年度奈良県公立高等学校入学者一般選抜等出願状況（最終・令和4年3月4日）（Wayback Machine経由・原本ページは現行サイトから削除済み）',
      fiscalYear: '令和4年度（2022年度）',
      fetchedAt: '2026-09-12',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程・一次選抜（29校71レコード。第一出願期間の出願者数のみ採用）'],
    pendingDepartments: [
      '第二出願期間（未充足学科への第2希望受付という別プロセスのため他県の第2志望と同じ理由でスコープ外）',
      '定時制課程・外国人／帰国生徒特別選抜（他県の定時制／特別選抜と同じ理由でスコープ外）',
    ],
    note:
      '「合計」行（募集人員6,896・第一出願期間出願者数6,276）と機械集計が完全一致した（初回転記で' +
      '一致・再修正なし）。倍率は資料に印字が無いため自前算出したが、外部報道（一条1.51倍・郡山1.27倍・' +
      '奈良1.20倍・全体0.91倍）と完全に一致することを確認済み。',
  },
  officialSubtotals: [{ label: '合計（第一出願期間）', schoolCount: 29, quota: 6896, finalApplicants: 6276 }],
  records: [
    { schoolName: '奈良商工', department: '機械工学', quota: 74, finalApplicants: 64, finalRate: 0.86, page: 1, rowIndex: 0 },
    { schoolName: '奈良商工', department: '情報工学', quota: 37, finalApplicants: 39, finalRate: 1.05, page: 1, rowIndex: 1 },
    { schoolName: '奈良商工', department: '建築工学', quota: 37, finalApplicants: 27, finalRate: 0.73, page: 1, rowIndex: 2 },
    { schoolName: '奈良商工', department: '総合ビジネス', quota: 80, finalApplicants: 71, finalRate: 0.89, page: 1, rowIndex: 3 },
    { schoolName: '奈良商工', department: '情報ビジネス', quota: 40, finalApplicants: 25, finalRate: 0.63, page: 1, rowIndex: 4 },
    { schoolName: '奈良商工', department: '観光', quota: 40, finalApplicants: 31, finalRate: 0.78, page: 1, rowIndex: 5 },
    { schoolName: '国際', department: '国際(LI)', quota: 32, finalApplicants: 34, finalRate: 1.06, page: 1, rowIndex: 6 },
    { schoolName: '奈良', department: '普通', quota: 360, finalApplicants: 432, finalRate: 1.2, page: 1, rowIndex: 7 },
    { schoolName: '山辺', department: '農業探究', quota: 20, finalApplicants: 2, finalRate: 0.1, page: 1, rowIndex: 8 },
    { schoolName: '山辺', department: '自立支援農業', quota: 20, finalApplicants: 20, finalRate: 1.0, page: 1, rowIndex: 9 },
    { schoolName: '山辺', department: '総合', quota: 38, finalApplicants: 8, finalRate: 0.21, page: 1, rowIndex: 10 },
    { schoolName: '高円芸術', department: '普通', quota: 120, finalApplicants: 102, finalRate: 0.85, page: 1, rowIndex: 11 },
    { schoolName: '高円芸術', department: '音楽', quota: 35, finalApplicants: 15, finalRate: 0.43, page: 1, rowIndex: 12 },
    { schoolName: '高円芸術', department: '美術', quota: 35, finalApplicants: 18, finalRate: 0.51, page: 1, rowIndex: 13 },
    { schoolName: '高円芸術', department: 'デザイン', quota: 35, finalApplicants: 26, finalRate: 0.74, page: 1, rowIndex: 14 },
    { schoolName: '高田', department: '普通', quota: 360, finalApplicants: 400, finalRate: 1.11, page: 1, rowIndex: 15 },
    { schoolName: '郡山', department: '普通', quota: 360, finalApplicants: 456, finalRate: 1.27, page: 1, rowIndex: 16 },
    { schoolName: '添上', department: '普通(人文探究)', quota: 40, finalApplicants: 17, finalRate: 0.43, page: 1, rowIndex: 17 },
    { schoolName: '添上', department: '普通(人文探究以外)', quota: 160, finalApplicants: 132, finalRate: 0.83, page: 1, rowIndex: 18 },
    { schoolName: '添上', department: 'スポーツサイエンス', quota: 40, finalApplicants: 33, finalRate: 0.83, page: 1, rowIndex: 19 },
    { schoolName: '二階堂', department: 'キャリアデザイン', quota: 160, finalApplicants: 81, finalRate: 0.51, page: 1, rowIndex: 20 },
    { schoolName: '橿原', department: '普通', quota: 320, finalApplicants: 283, finalRate: 0.88, page: 1, rowIndex: 21 },
    { schoolName: '畝傍', department: '普通', quota: 360, finalApplicants: 398, finalRate: 1.11, page: 1, rowIndex: 22 },
    {
      schoolName: '商業',
      department: '会計・情報ビジネス・経営ビジネス・総合ビジネス(くくり募集)',
      quota: 200,
      finalApplicants: 186,
      finalRate: 0.93,
      page: 1, rowIndex: 23,
    },
    { schoolName: '桜井', department: '普通(書芸)', quota: 35, finalApplicants: 15, finalRate: 0.43, page: 1, rowIndex: 24 },
    { schoolName: '桜井', department: '普通(書芸以外)', quota: 280, finalApplicants: 310, finalRate: 1.11, page: 1, rowIndex: 25 },
    { schoolName: '五條', department: '普通', quota: 240, finalApplicants: 202, finalRate: 0.84, page: 1, rowIndex: 26 },
    { schoolName: '五條', department: '商業', quota: 40, finalApplicants: 19, finalRate: 0.48, page: 1, rowIndex: 27 },
    { schoolName: '御所実業', department: '環境緑地', quota: 32, finalApplicants: 11, finalRate: 0.34, page: 1, rowIndex: 28 },
    { schoolName: '御所実業', department: '機械工学', quota: 63, finalApplicants: 44, finalRate: 0.7, page: 1, rowIndex: 29 },
    { schoolName: '御所実業', department: '電気工学', quota: 32, finalApplicants: 13, finalRate: 0.41, page: 1, rowIndex: 30 },
    { schoolName: '御所実業', department: '都市工学', quota: 32, finalApplicants: 14, finalRate: 0.44, page: 1, rowIndex: 31 },
    { schoolName: '御所実業', department: '薬品科学', quota: 28, finalApplicants: 16, finalRate: 0.57, page: 1, rowIndex: 32 },
    { schoolName: '生駒', department: '普通', quota: 320, finalApplicants: 363, finalRate: 1.13, page: 1, rowIndex: 33 },
    { schoolName: '奈良北', department: '普通', quota: 280, finalApplicants: 281, finalRate: 1.0, page: 1, rowIndex: 34 },
    { schoolName: '奈良北', department: '数理情報', quota: 80, finalApplicants: 64, finalRate: 0.8, page: 1, rowIndex: 35 },
    { schoolName: '香芝', department: '普通(表現探究)', quota: 40, finalApplicants: 37, finalRate: 0.93, page: 1, rowIndex: 36 },
    { schoolName: '香芝', department: '普通(表現探究以外)', quota: 280, finalApplicants: 295, finalRate: 1.05, page: 1, rowIndex: 37 },
    { schoolName: '宇陀', department: '普通', quota: 80, finalApplicants: 51, finalRate: 0.64, page: 1, rowIndex: 38 },
    { schoolName: '宇陀', department: '情報科学', quota: 40, finalApplicants: 20, finalRate: 0.5, page: 1, rowIndex: 39 },
    { schoolName: '宇陀', department: 'こども・福祉', quota: 80, finalApplicants: 25, finalRate: 0.31, page: 1, rowIndex: 40 },
    { schoolName: '西和清陵', department: '普通', quota: 160, finalApplicants: 95, finalRate: 0.59, page: 1, rowIndex: 41 },
    { schoolName: '法隆寺国際', department: '普通', quota: 200, finalApplicants: 225, finalRate: 1.13, page: 1, rowIndex: 42 },
    { schoolName: '法隆寺国際', department: '歴史文化', quota: 40, finalApplicants: 27, finalRate: 0.68, page: 1, rowIndex: 43 },
    { schoolName: '法隆寺国際', department: '総合英語', quota: 75, finalApplicants: 30, finalRate: 0.4, page: 1, rowIndex: 44 },
    { schoolName: '磯城野', department: '農業科学(食料生産)', quota: 18, finalApplicants: 16, finalRate: 0.89, page: 1, rowIndex: 45 },
    { schoolName: '磯城野', department: '農業科学(動物活用)', quota: 19, finalApplicants: 20, finalRate: 1.05, page: 1, rowIndex: 46 },
    { schoolName: '磯城野', department: '施設園芸(施設野菜)', quota: 19, finalApplicants: 18, finalRate: 0.95, page: 1, rowIndex: 47 },
    { schoolName: '磯城野', department: '施設園芸(施設草花)', quota: 18, finalApplicants: 9, finalRate: 0.5, page: 1, rowIndex: 48 },
    { schoolName: '磯城野', department: 'バイオ技術(生物未来)', quota: 18, finalApplicants: 9, finalRate: 0.5, page: 1, rowIndex: 49 },
    { schoolName: '磯城野', department: 'バイオ技術(食品科学)', quota: 19, finalApplicants: 18, finalRate: 0.95, page: 1, rowIndex: 50 },
    { schoolName: '磯城野', department: '環境デザイン(造園緑化)', quota: 19, finalApplicants: 8, finalRate: 0.42, page: 1, rowIndex: 51 },
    { schoolName: '磯城野', department: '環境デザイン(緑化デザイン)', quota: 18, finalApplicants: 7, finalRate: 0.39, page: 1, rowIndex: 52 },
    { schoolName: '磯城野', department: 'フードデザイン(シェフ)', quota: 20, finalApplicants: 22, finalRate: 1.1, page: 1, rowIndex: 53 },
    { schoolName: '磯城野', department: 'フードデザイン(パティシエ)', quota: 20, finalApplicants: 31, finalRate: 1.55, page: 1, rowIndex: 54 },
    { schoolName: '磯城野', department: 'ファッションクリエイト', quota: 40, finalApplicants: 16, finalRate: 0.4, page: 1, rowIndex: 55 },
    { schoolName: '磯城野', department: 'ヒューマンライフ', quota: 40, finalApplicants: 34, finalRate: 0.85, page: 1, rowIndex: 56 },
    { schoolName: '高取国際', department: '普通', quota: 120, finalApplicants: 135, finalRate: 1.13, page: 2, rowIndex: 0 },
    { schoolName: '高取国際', department: '国際英語', quota: 40, finalApplicants: 11, finalRate: 0.28, page: 2, rowIndex: 1 },
    { schoolName: '高取国際', department: '国際コミュニケーション', quota: 75, finalApplicants: 26, finalRate: 0.35, page: 2, rowIndex: 2 },
    { schoolName: '王寺工業', department: '機械工学', quota: 74, finalApplicants: 63, finalRate: 0.85, page: 2, rowIndex: 3 },
    { schoolName: '王寺工業', department: '電気工学', quota: 72, finalApplicants: 60, finalRate: 0.83, page: 2, rowIndex: 4 },
    { schoolName: '王寺工業', department: '情報電子工学', quota: 74, finalApplicants: 41, finalRate: 0.55, page: 2, rowIndex: 5 },
    { schoolName: '大和広陵', department: '普通', quota: 80, finalApplicants: 65, finalRate: 0.81, page: 2, rowIndex: 6 },
    { schoolName: '大和広陵', department: '生涯スポーツ', quota: 40, finalApplicants: 32, finalRate: 0.8, page: 2, rowIndex: 7 },
    { schoolName: '奈良南', department: '普通', quota: 80, finalApplicants: 44, finalRate: 0.55, page: 2, rowIndex: 8 },
    { schoolName: '奈良南', department: '伝統建築', quota: 37, finalApplicants: 6, finalRate: 0.16, page: 2, rowIndex: 9 },
    { schoolName: '奈良南', department: '情報科学', quota: 40, finalApplicants: 14, finalRate: 0.35, page: 2, rowIndex: 10 },
    { schoolName: '十津川', department: '総合', quota: 39, finalApplicants: 21, finalRate: 0.54, page: 2, rowIndex: 11 },
    { schoolName: '一条', department: '普通', quota: 200, finalApplicants: 302, finalRate: 1.51, page: 2, rowIndex: 12 },
    { schoolName: '高田商業', department: '商業', quota: 197, finalApplicants: 191, finalRate: 0.97, page: 2, rowIndex: 13 },
    { schoolName: '奈良', department: '普通', quota: 360, finalApplicants: 434, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高円芸術', department: '普通', quota: 120, finalApplicants: 102, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高田', department: '普通', quota: 360, finalApplicants: 372, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '郡山', department: '普通', quota: 360, finalApplicants: 453, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '添上', department: '普通(人文探究以外)', quota: 160, finalApplicants: 97, finalRate: 0.61, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '橿原', department: '普通', quota: 320, finalApplicants: 323, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '畝傍', department: '普通', quota: 360, finalApplicants: 368, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桜井', department: '普通(書芸以外)', quota: 280, finalApplicants: 327, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '五條', department: '普通', quota: 240, finalApplicants: 175, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '生駒', department: '普通', quota: 320, finalApplicants: 329, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奈良北', department: '普通', quota: 280, finalApplicants: 293, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奈良北', department: '数理情報', quota: 80, finalApplicants: 59, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '香芝', department: '普通(表現探究)', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '香芝', department: '普通(表現探究以外)', quota: 280, finalApplicants: 327, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '西和清陵', department: '普通', quota: 200, finalApplicants: 128, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '法隆寺国際', department: '普通', quota: 200, finalApplicants: 152, finalRate: 0.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高取国際', department: '普通', quota: 120, finalApplicants: 139, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大和広陵', department: '普通', quota: 120, finalApplicants: 72, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '一条', department: '普通', quota: 200, finalApplicants: 296, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奈良', department: '普通', quota: 360, finalApplicants: 423, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高円芸術', department: '普通', quota: 120, finalApplicants: 149, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高田', department: '普通', quota: 360, finalApplicants: 426, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '郡山', department: '普通', quota: 360, finalApplicants: 428, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '添上', department: '普通(人文探究コース以外)', quota: 160, finalApplicants: 130, finalRate: 0.81, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '橿原', department: '普通', quota: 320, finalApplicants: 324, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '畝傍', department: '普通', quota: 360, finalApplicants: 430, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桜井', department: '普通(一般コース)', quota: 280, finalApplicants: 277, finalRate: 0.99, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '五條', department: '普通', quota: 240, finalApplicants: 183, finalRate: 0.76, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '生駒', department: '普通', quota: 320, finalApplicants: 352, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '奈良北', department: '普通', quota: 280, finalApplicants: 280, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '奈良北', department: '数理情報', quota: 80, finalApplicants: 53, finalRate: 0.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '香芝', department: '普通(表現探究コース)', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '香芝', department: '普通(表現探究コース以外)', quota: 280, finalApplicants: 301, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '西和清陵', department: '普通', quota: 200, finalApplicants: 209, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '法隆寺国際', department: '普通', quota: 200, finalApplicants: 197, finalRate: 0.99, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高取国際', department: '普通', quota: 120, finalApplicants: 125, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大和広陵', department: '普通', quota: 160, finalApplicants: 92, finalRate: 0.57, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '一条', department: '普通', quota: 200, finalApplicants: 291, finalRate: 1.46, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '奈良', department: '普通', quota: 378, finalApplicants: 442, finalRate: 1.17, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '高円芸術', department: '普通', quota: 120, finalApplicants: 141, finalRate: 1.18, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '高田', department: '普通', quota: 378, finalApplicants: 433, finalRate: 1.15, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '郡山', department: '普通', quota: 378, finalApplicants: 504, finalRate: 1.33, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '添上', department: '普通(人文探究コース以外)', quota: 160, finalApplicants: 129, finalRate: 0.81, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '橿原', department: '普通', quota: 320, finalApplicants: 349, finalRate: 1.09, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '畝傍', department: '普通', quota: 378, finalApplicants: 402, finalRate: 1.06, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '桜井', department: '普通(一般コース)', quota: 240, finalApplicants: 236, finalRate: 0.98, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '五條', department: '普通', quota: 200, finalApplicants: 184, finalRate: 0.92, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '生駒', department: '普通', quota: 320, finalApplicants: 384, finalRate: 1.2, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '奈良北', department: '普通', quota: 280, finalApplicants: 304, finalRate: 1.09, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '奈良北', department: '数理情報', quota: 80, finalApplicants: 85, finalRate: 1.06, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '香芝', department: '普通(表現探究コース)', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '香芝', department: '普通(表現探究コース以外)', quota: 280, finalApplicants: 321, finalRate: 1.15, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '西和清陵', department: '普通', quota: 200, finalApplicants: 193, finalRate: 0.97, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '法隆寺国際', department: '普通', quota: 200, finalApplicants: 222, finalRate: 1.11, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '高取国際', department: '普通', quota: 120, finalApplicants: 112, finalRate: 0.93, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '大和広陵', department: '普通', quota: 160, finalApplicants: 66, finalRate: 0.41, fiscalYear: '令和4年度（2022年度）' },
    { schoolName: '一条', department: '普通', quota: 200, finalApplicants: 317, finalRate: 1.59, fiscalYear: '令和4年度（2022年度）' },
  ],
};
