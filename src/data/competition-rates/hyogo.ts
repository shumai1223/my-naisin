/**
 * 兵庫県 公立高等学校 倍率パイプラインα（Y-2・Y-6先行着手）。
 *
 * 一次ソース: 兵庫県教育委員会「令和8年度兵庫県公立高等学校入学者選抜出願状況（特別出願後確定数）」
 * （令和8年3月5日確定・全10ページのPDF・県立/市立を区別せず1つの表に混在収録）。
 *
 * ⚠️2026-07-25判明: Y-2先行8県のうちhokkaido（一次ソースPDFページが404・Wayback Machine
 * もこの環境から到達不可）とaichi（学校別「別紙」が公式サイト上に見当たらず👤確認待ち）が
 * 外部要因でブロック中のため、Y-6（残り39県）に前倒しで着手した1県目として兵庫県を選定した
 * （google-trends記録で新規開拓ROI④位・prefecture-exam-systems-verifiedに総合得点方式の
 * 記載済みで一定の下地あり）。
 *
 * ⚠️対象範囲=現時点でPDF2ページ目（東灘〜宝塚東、43校）＋3ページ目（宝塚北〜北条、41校）の
 * 計84校を高い確信度で確定済み。全体は10ページ・全日制127校（県立115校・市立12校）＋定時制
 * 19校（県立15校・市立4校）の大規模資料と判明済み（1ページ目のグランドトータルで確認:
 * 全日制定員21,150・確定志願者20,567・倍率0.97）。残り7ページ（4〜10ページ目）は未転記の
 * まま次回に持ち越し。
 *
 * 「普通（単）」と備考欄「単」の学校・学科は単位制課程を意味すると判断し、department名に
 * 「（単位制）」を付記して区別した（定時制ではなく全日制の枠内の記載のため対象内）。
 * 兵庫工業・洲本実業・市科学技術・市神港橘の専門学科は、学科名をそのまま採用し、学校単位の
 * 「計」行がPDF上に無いため officialSubtotals には計上していない（学校単位での内部整合性は
 * 検証しようがないため、個別レコードの quota×rate≈applicants 概算チェックのみに依拠）。
 *
 * 定時制は東京都・神奈川県・千葉県・埼玉県・福岡県と同じ理由でスコープ外（全日制の外側の
 * 別課程のため対象外として明示的に除外）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const HYOGO_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'hyogo',
  sources: [
    {
      url: 'https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2026/03/【確定】修正_03-R8_３月選抜志願者数.pdf',
      docTitle: '兵庫県教育委員会 令和8年度兵庫県公立高等学校入学者選抜出願状況（特別出願後確定数）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['全日制（PDF2〜3ページ目・東灘〜北条の84校）'],
    pendingDepartments: [
      '全日制（PDF4〜10ページ目、残り約43校。127校中84校のみ着手済み）',
      '定時制（全日制の外側の別課程のため東京都・神奈川県・千葉県・埼玉県・福岡県と同じ理由で意図的にスコープ外）',
    ],
    note:
      '兵庫県は全日制127校（県立115校・市立12校）が県立/市立を区別せず1つのPDF（全10ページ）に' +
      '収録されている大規模資料。今回はPDF2〜3ページ目の84校のみを高確信度で確定（1ページ目の' +
      'グランドトータル: 全日制定員21,150・確定志願者20,567・倍率0.97は確認済みだが、84校のみでの' +
      '部分突合はまだ行っていない）。残り7ページは次回以降のセッションで継続する。',
  },
  officialSubtotals: [],
  records: [
    { schoolName: '東灘', department: '普通科', quota: 200, finalApplicants: 135, finalRate: 0.68 },
    { schoolName: '御影', department: '普通科', quota: 280, finalApplicants: 220, finalRate: 0.79 },
    { schoolName: '神戸', department: '普通科', quota: 320, finalApplicants: 385, finalRate: 1.2 },
    { schoolName: '夢野台', department: '普通科', quota: 240, finalApplicants: 295, finalRate: 1.23 },
    { schoolName: '兵庫', department: '普通科', quota: 280, finalApplicants: 343, finalRate: 1.23 },
    { schoolName: '神戸鈴蘭台', department: '普通科', quota: 240, finalApplicants: 227, finalRate: 0.95 },
    { schoolName: '長田', department: '普通科', quota: 280, finalApplicants: 277, finalRate: 0.99 },
    { schoolName: '須磨東', department: '普通科', quota: 216, finalApplicants: 201, finalRate: 0.93 },
    { schoolName: '星陵', department: '普通科', quota: 240, finalApplicants: 314, finalRate: 1.31 },
    { schoolName: '舞子', department: '普通科', quota: 190, finalApplicants: 214, finalRate: 1.13 },
    { schoolName: '神戸学園都市', department: '普通科', quota: 280, finalApplicants: 226, finalRate: 0.81 },
    { schoolName: '神戸高塚', department: '普通科', quota: 170, finalApplicants: 155, finalRate: 0.91 },
    { schoolName: '洲本', department: '普通科', quota: 216, finalApplicants: 206, finalRate: 0.95 },
    { schoolName: '津名', department: '普通科', quota: 120, finalApplicants: 98, finalRate: 0.82 },
    { schoolName: '淡路三原', department: '普通科', quota: 160, finalApplicants: 151, finalRate: 0.94 },
    { schoolName: '市葺合', department: '普通科', quota: 280, finalApplicants: 339, finalRate: 1.21 },
    { schoolName: '北須磨', department: '普通科（単位制）', quota: 140, finalApplicants: 121, finalRate: 0.86 },
    { schoolName: '芦屋', department: '普通科（単位制）', quota: 140, finalApplicants: 186, finalRate: 1.33 },
    { schoolName: '市六甲アイランド', department: '普通科（単位制）', quota: 180, finalApplicants: 280, finalRate: 1.56 },
    { schoolName: '北神戸総合', department: '総合学科', quota: 231, finalApplicants: 130, finalRate: 0.56 },
    { schoolName: '須磨友が丘', department: '総合学科', quota: 120, finalApplicants: 132, finalRate: 1.1 },
    { schoolName: '淡路', department: '総合学科', quota: 60, finalApplicants: 51, finalRate: 0.85 },
    { schoolName: '市須磨翔風', department: '総合学科', quota: 140, finalApplicants: 202, finalRate: 1.44 },
    { schoolName: '兵庫工業', department: '建築', quota: 26, finalApplicants: 18, finalRate: 0.69 },
    { schoolName: '兵庫工業', department: '都市環境工学', quota: 21, finalApplicants: 20, finalRate: 0.95 },
    { schoolName: '兵庫工業', department: 'デザイン', quota: 20, finalApplicants: 24, finalRate: 1.2 },
    { schoolName: '兵庫工業', department: '総合理化学', quota: 31, finalApplicants: 11, finalRate: 0.35 },
    { schoolName: '兵庫工業', department: '機械工学', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '兵庫工業', department: '電気工学', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '兵庫工業', department: '情報技術', quota: 20, finalApplicants: 24, finalRate: 1.2 },
    { schoolName: '洲本実業', department: '工業（機械、電気）', quota: 47, finalApplicants: 46, finalRate: 0.98 },
    { schoolName: '洲本実業', department: '地域商業', quota: 20, finalApplicants: 20, finalRate: 1.0 },
    { schoolName: '神戸商業', department: '商業', quota: 123, finalApplicants: 90, finalRate: 0.73 },
    { schoolName: '市科学技術', department: '機械工学', quota: 60, finalApplicants: 72, finalRate: 1.2 },
    { schoolName: '市科学技術', department: '電気情報工学', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '市科学技術', department: '都市工学', quota: 40, finalApplicants: 54, finalRate: 1.35 },
    { schoolName: '市科学技術', department: '科学工学', quota: 40, finalApplicants: 60, finalRate: 1.5 },
    { schoolName: '市神港橘', department: 'みらい商学', quota: 160, finalApplicants: 159, finalRate: 0.99 },
    { schoolName: '尼崎小田', department: '普通科', quota: 160, finalApplicants: 225, finalRate: 1.41 },
    { schoolName: '尼崎', department: '普通科', quota: 200, finalApplicants: 152, finalRate: 0.76 },
    { schoolName: '尼崎北', department: '普通科', quota: 240, finalApplicants: 258, finalRate: 1.08 },
    { schoolName: '尼崎西', department: '普通科', quota: 170, finalApplicants: 168, finalRate: 0.99 },
    { schoolName: '伊丹', department: '普通科', quota: 280, finalApplicants: 268, finalRate: 0.96 },
    { schoolName: '伊丹西', department: '普通科', quota: 252, finalApplicants: 274, finalRate: 1.09 },
    { schoolName: '川西緑台', department: '普通科', quota: 240, finalApplicants: 179, finalRate: 0.75 },
    { schoolName: '川西明峰', department: '普通科', quota: 237, finalApplicants: 107, finalRate: 0.45 },
    { schoolName: '川西北陵', department: '普通科', quota: 160, finalApplicants: 194, finalRate: 1.21 },
    { schoolName: '猪名川', department: '普通科', quota: 141, finalApplicants: 105, finalRate: 0.74 },
    { schoolName: '鳴尾', department: '普通科', quota: 200, finalApplicants: 233, finalRate: 1.17 },
    { schoolName: '西宮苦楽園', department: '普通科', quota: 240, finalApplicants: 143, finalRate: 0.6 },
    { schoolName: '西宮南', department: '普通科', quota: 216, finalApplicants: 139, finalRate: 0.64 },
    { schoolName: '宝塚', department: '普通科', quota: 216, finalApplicants: 126, finalRate: 0.58 },
    { schoolName: '宝塚東', department: '普通科', quota: 225, finalApplicants: 100, finalRate: 0.44 },
    { schoolName: '宝塚北', department: '普通科', quota: 200, finalApplicants: 214, finalRate: 1.07 },
    { schoolName: '宝塚西', department: '普通科', quota: 201, finalApplicants: 228, finalRate: 1.13 },
    { schoolName: '北摂三田', department: '普通科', quota: 200, finalApplicants: 193, finalRate: 0.97 },
    { schoolName: '三田西陵', department: '普通科', quota: 133, finalApplicants: 146, finalRate: 1.1 },
    { schoolName: '柏原', department: '普通科', quota: 160, finalApplicants: 164, finalRate: 1.03 },
    { schoolName: '篠山鳳鳴', department: '普通科（単位制）', quota: 120, finalApplicants: 88, finalRate: 0.73 },
    { schoolName: '市尼崎', department: '普通科', quota: 204, finalApplicants: 262, finalRate: 1.28 },
    { schoolName: '市尼崎双星', department: '普通科', quota: 170, finalApplicants: 242, finalRate: 1.42 },
    { schoolName: '市伊丹', department: '普通科', quota: 160, finalApplicants: 200, finalRate: 1.25 },
    { schoolName: '市西宮', department: '普通科', quota: 240, finalApplicants: 328, finalRate: 1.37 },
    { schoolName: '市西宮東', department: '普通科', quota: 200, finalApplicants: 274, finalRate: 1.37 },
    { schoolName: '尼崎稲園', department: '普通科（単位制）', quota: 140, finalApplicants: 208, finalRate: 1.49 },
    { schoolName: '西宮', department: '普通科（単位制）', quota: 140, finalApplicants: 264, finalRate: 1.89 },
    { schoolName: '三田祥雲館', department: '普通科（単位制）', quota: 122, finalApplicants: 99, finalRate: 0.81 },
    { schoolName: '武庫荘総合', department: '総合学科', quota: 140, finalApplicants: 133, finalRate: 0.95 },
    { schoolName: '伊丹北', department: '総合学科', quota: 140, finalApplicants: 135, finalRate: 0.96 },
    { schoolName: '西宮今津', department: '総合学科', quota: 120, finalApplicants: 95, finalRate: 0.79 },
    { schoolName: '有馬', department: '総合学科', quota: 100, finalApplicants: 125, finalRate: 1.25 },
    { schoolName: '有馬', department: '人と自然', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '氷上', department: '生産ビジネス', quota: 27, finalApplicants: 15, finalRate: 0.56 },
    { schoolName: '氷上', department: '食品ビジネス', quota: 20, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '氷上', department: '生活ビジネス', quota: 20, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '篠山東雲', department: '地域農業', quota: 28, finalApplicants: 19, finalRate: 0.68 },
    { schoolName: '尼崎工業', department: '機械', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '尼崎工業', department: '電気', quota: 20, finalApplicants: 16, finalRate: 0.8 },
    { schoolName: '尼崎工業', department: '電子', quota: 25, finalApplicants: 12, finalRate: 0.48 },
    { schoolName: '尼崎工業', department: '建築', quota: 20, finalApplicants: 16, finalRate: 0.8 },
    { schoolName: '篠山産業', department: '農と食', quota: 20, finalApplicants: 12, finalRate: 0.6 },
    { schoolName: '篠山産業', department: '機械工学', quota: 20, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '篠山産業', department: '電気建設工学', quota: 22, finalApplicants: 21, finalRate: 0.95 },
    { schoolName: '篠山産業', department: '総合ビジネス', quota: 20, finalApplicants: 12, finalRate: 0.6 },
    { schoolName: '市尼崎双星', department: 'ものづくり機械', quota: 20, finalApplicants: 26, finalRate: 1.3 },
    { schoolName: '市尼崎双星', department: '電気情報', quota: 20, finalApplicants: 21, finalRate: 1.05 },
    { schoolName: '市尼崎双星', department: '商業学', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '市伊丹', department: '商業', quota: 20, finalApplicants: 26, finalRate: 1.3 },
    { schoolName: '氷上西', department: '普通科', quota: 10, finalApplicants: 11, finalRate: 1.1 },
    { schoolName: '明石', department: '普通科（単位制）', quota: 240, finalApplicants: 267, finalRate: 1.11 },
    { schoolName: '明石北', department: '普通科', quota: 280, finalApplicants: 323, finalRate: 1.15 },
    { schoolName: '明石城西', department: '普通科', quota: 280, finalApplicants: 302, finalRate: 1.08 },
    { schoolName: '明石清水', department: '普通科', quota: 280, finalApplicants: 253, finalRate: 0.9 },
    { schoolName: '明石西', department: '普通科', quota: 240, finalApplicants: 227, finalRate: 0.95 },
    { schoolName: '加古川東', department: '普通科', quota: 280, finalApplicants: 303, finalRate: 1.08 },
    { schoolName: '加古川西', department: '普通科', quota: 244, finalApplicants: 245, finalRate: 1.0 },
    { schoolName: '高砂', department: '普通科', quota: 160, finalApplicants: 184, finalRate: 1.15 },
    { schoolName: '高砂南', department: '普通科', quota: 200, finalApplicants: 200, finalRate: 1.0 },
    { schoolName: '松陽', department: '普通科', quota: 102, finalApplicants: 102, finalRate: 1.0 },
    { schoolName: '東播磨', department: '普通科', quota: 160, finalApplicants: 150, finalRate: 0.94 },
    { schoolName: '播磨南', department: '普通科', quota: 136, finalApplicants: 130, finalRate: 0.96 },
    { schoolName: '西脇', department: '普通科', quota: 180, finalApplicants: 155, finalRate: 0.86 },
    { schoolName: '三木', department: '普通科', quota: 240, finalApplicants: 206, finalRate: 0.86 },
    { schoolName: '小野', department: '普通科', quota: 160, finalApplicants: 167, finalRate: 1.04 },
    { schoolName: '社', department: '普通科', quota: 136, finalApplicants: 133, finalRate: 0.98 },
    { schoolName: '多可', department: '普通科', quota: 76, finalApplicants: 26, finalRate: 0.34 },
    { schoolName: '北条', department: '普通科（単位制）', quota: 80, finalApplicants: 77, finalRate: 0.96 },
  ],
};
