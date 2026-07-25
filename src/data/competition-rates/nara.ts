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
    { schoolName: '奈良商工', department: '機械工学', quota: 74, finalApplicants: 64, finalRate: 0.86 },
    { schoolName: '奈良商工', department: '情報工学', quota: 37, finalApplicants: 39, finalRate: 1.05 },
    { schoolName: '奈良商工', department: '建築工学', quota: 37, finalApplicants: 27, finalRate: 0.73 },
    { schoolName: '奈良商工', department: '総合ビジネス', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '奈良商工', department: '情報ビジネス', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '奈良商工', department: '観光', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '国際', department: '国際(LI)', quota: 32, finalApplicants: 34, finalRate: 1.06 },
    { schoolName: '奈良', department: '普通', quota: 360, finalApplicants: 432, finalRate: 1.2 },
    { schoolName: '山辺', department: '農業探究', quota: 20, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '山辺', department: '自立支援農業', quota: 20, finalApplicants: 20, finalRate: 1.0 },
    { schoolName: '山辺', department: '総合', quota: 38, finalApplicants: 8, finalRate: 0.21 },
    { schoolName: '高円芸術', department: '普通', quota: 120, finalApplicants: 102, finalRate: 0.85 },
    { schoolName: '高円芸術', department: '音楽', quota: 35, finalApplicants: 15, finalRate: 0.43 },
    { schoolName: '高円芸術', department: '美術', quota: 35, finalApplicants: 18, finalRate: 0.51 },
    { schoolName: '高円芸術', department: 'デザイン', quota: 35, finalApplicants: 26, finalRate: 0.74 },
    { schoolName: '高田', department: '普通', quota: 360, finalApplicants: 400, finalRate: 1.11 },
    { schoolName: '郡山', department: '普通', quota: 360, finalApplicants: 456, finalRate: 1.27 },
    { schoolName: '添上', department: '普通(人文探究)', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '添上', department: '普通(人文探究以外)', quota: 160, finalApplicants: 132, finalRate: 0.83 },
    { schoolName: '添上', department: 'スポーツサイエンス', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '二階堂', department: 'キャリアデザイン', quota: 160, finalApplicants: 81, finalRate: 0.51 },
    { schoolName: '橿原', department: '普通', quota: 320, finalApplicants: 283, finalRate: 0.88 },
    { schoolName: '畝傍', department: '普通', quota: 360, finalApplicants: 398, finalRate: 1.11 },
    {
      schoolName: '商業',
      department: '会計・情報ビジネス・経営ビジネス・総合ビジネス(くくり募集)',
      quota: 200,
      finalApplicants: 186,
      finalRate: 0.93,
    },
    { schoolName: '桜井', department: '普通(書芸)', quota: 35, finalApplicants: 15, finalRate: 0.43 },
    { schoolName: '桜井', department: '普通(書芸以外)', quota: 280, finalApplicants: 310, finalRate: 1.11 },
    { schoolName: '五條', department: '普通', quota: 240, finalApplicants: 202, finalRate: 0.84 },
    { schoolName: '五條', department: '商業', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '御所実業', department: '環境緑地', quota: 32, finalApplicants: 11, finalRate: 0.34 },
    { schoolName: '御所実業', department: '機械工学', quota: 63, finalApplicants: 44, finalRate: 0.7 },
    { schoolName: '御所実業', department: '電気工学', quota: 32, finalApplicants: 13, finalRate: 0.41 },
    { schoolName: '御所実業', department: '都市工学', quota: 32, finalApplicants: 14, finalRate: 0.44 },
    { schoolName: '御所実業', department: '薬品科学', quota: 28, finalApplicants: 16, finalRate: 0.57 },
    { schoolName: '生駒', department: '普通', quota: 320, finalApplicants: 363, finalRate: 1.13 },
    { schoolName: '奈良北', department: '普通', quota: 280, finalApplicants: 281, finalRate: 1.0 },
    { schoolName: '奈良北', department: '数理情報', quota: 80, finalApplicants: 64, finalRate: 0.8 },
    { schoolName: '香芝', department: '普通(表現探究)', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '香芝', department: '普通(表現探究以外)', quota: 280, finalApplicants: 295, finalRate: 1.05 },
    { schoolName: '宇陀', department: '普通', quota: 80, finalApplicants: 51, finalRate: 0.64 },
    { schoolName: '宇陀', department: '情報科学', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '宇陀', department: 'こども・福祉', quota: 80, finalApplicants: 25, finalRate: 0.31 },
    { schoolName: '西和清陵', department: '普通', quota: 160, finalApplicants: 95, finalRate: 0.59 },
    { schoolName: '法隆寺国際', department: '普通', quota: 200, finalApplicants: 225, finalRate: 1.13 },
    { schoolName: '法隆寺国際', department: '歴史文化', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '法隆寺国際', department: '総合英語', quota: 75, finalApplicants: 30, finalRate: 0.4 },
    { schoolName: '磯城野', department: '農業科学(食料生産)', quota: 18, finalApplicants: 16, finalRate: 0.89 },
    { schoolName: '磯城野', department: '農業科学(動物活用)', quota: 19, finalApplicants: 20, finalRate: 1.05 },
    { schoolName: '磯城野', department: '施設園芸(施設野菜)', quota: 19, finalApplicants: 18, finalRate: 0.95 },
    { schoolName: '磯城野', department: '施設園芸(施設草花)', quota: 18, finalApplicants: 9, finalRate: 0.5 },
    { schoolName: '磯城野', department: 'バイオ技術(生物未来)', quota: 18, finalApplicants: 9, finalRate: 0.5 },
    { schoolName: '磯城野', department: 'バイオ技術(食品科学)', quota: 19, finalApplicants: 18, finalRate: 0.95 },
    { schoolName: '磯城野', department: '環境デザイン(造園緑化)', quota: 19, finalApplicants: 8, finalRate: 0.42 },
    { schoolName: '磯城野', department: '環境デザイン(緑化デザイン)', quota: 18, finalApplicants: 7, finalRate: 0.39 },
    { schoolName: '磯城野', department: 'フードデザイン(シェフ)', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '磯城野', department: 'フードデザイン(パティシエ)', quota: 20, finalApplicants: 31, finalRate: 1.55 },
    { schoolName: '磯城野', department: 'ファッションクリエイト', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '磯城野', department: 'ヒューマンライフ', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '高取国際', department: '普通', quota: 120, finalApplicants: 135, finalRate: 1.13 },
    { schoolName: '高取国際', department: '国際英語', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '高取国際', department: '国際コミュニケーション', quota: 75, finalApplicants: 26, finalRate: 0.35 },
    { schoolName: '王寺工業', department: '機械工学', quota: 74, finalApplicants: 63, finalRate: 0.85 },
    { schoolName: '王寺工業', department: '電気工学', quota: 72, finalApplicants: 60, finalRate: 0.83 },
    { schoolName: '王寺工業', department: '情報電子工学', quota: 74, finalApplicants: 41, finalRate: 0.55 },
    { schoolName: '大和広陵', department: '普通', quota: 80, finalApplicants: 65, finalRate: 0.81 },
    { schoolName: '大和広陵', department: '生涯スポーツ', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '奈良南', department: '普通', quota: 80, finalApplicants: 44, finalRate: 0.55 },
    { schoolName: '奈良南', department: '伝統建築', quota: 37, finalApplicants: 6, finalRate: 0.16 },
    { schoolName: '奈良南', department: '情報科学', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '十津川', department: '総合', quota: 39, finalApplicants: 21, finalRate: 0.54 },
    { schoolName: '一条', department: '普通', quota: 200, finalApplicants: 302, finalRate: 1.51 },
    { schoolName: '高田商業', department: '商業', quota: 197, finalApplicants: 191, finalRate: 0.97 },
  ],
};
