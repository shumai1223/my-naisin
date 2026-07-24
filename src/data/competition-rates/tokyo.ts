/**
 * 東京都 公立高等学校 倍率パイプラインα（Y-2・先行8県の1県目・型化担当）。
 *
 * 一次ソース: 東京都教育委員会「令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）」
 * https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/past/first_application/20260213_ichiji_final
 * 個票（普通科・コース/単位制以外）:
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182440-757
 * 総括表:
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/01-v2
 * 公表日: 2026-02-13（令和8年度・最終応募状況）
 *
 * 個票（普通科・コース制/単位制/海外帰国生徒対象）:
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182442-923
 *
 * ⚠️取り込み範囲は部分的（coverage参照）。全日制167校のうち普通科119校は完了（区部57＋
 * 多摩部44＋島しょ6＋単位制12＋コース制/海外帰国生徒対象は既存校への追加学科として計上）。
 * 残り48校（専門学科38・総合学科10）は別の公表資料（専門学科・定時制の個票）からの
 * 取り込みが必要で、次回以降のY-2続きで対応する。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const TOKYO_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tokyo',
  sources: [
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182440-757',
      docTitle:
        '東京都教育委員会 令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）1[普通科（コース、単位制以外の学校）]・2[普通科（島しょの学校）]',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182442-923',
      docTitle:
        '東京都教育委員会 令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）3[普通科（コース制の学校）]・4[普通科（単位制の学校）]・5[普通科（海外帰国生徒対象）]',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '普通科（コース・単位制・海外帰国生徒対象・専門学科・総合学科以外）',
      '普通科（島しょの学校）',
      '普通科（コース制の学校）',
      '普通科（単位制の学校）',
      '普通科（海外帰国生徒対象）',
    ],
    pendingDepartments: ['専門学科（商業科・工業科・農業科等13学科）', '総合学科'],
    note:
      '全日制167校中普通科119校は完了。残り48校（専門学科・総合学科）は別文書（専門学科・定時制の個票PDF）からの追加取り込みが必要（次回以降のY-2続き）。',
  },
  officialSubtotals: [
    { label: '区部計', schoolCount: 57, quota: 12088, finalApplicants: 16926, finalRate: 1.4 },
    { label: '多摩部計', schoolCount: 44, quota: 9344, finalApplicants: 11630, finalRate: 1.24 },
    { label: '島しょ計', schoolCount: 6, quota: 310, finalApplicants: 100, finalRate: 0.32 },
    { label: 'コース、単位制以外計（区部+多摩部）', schoolCount: 101, quota: 21432, finalApplicants: 28556, finalRate: 1.33 },
    {
      label: '普通科（コース、単位制、海外帰国生徒対象以外）計＋普通科（島しょ）計',
      schoolCount: 107,
      quota: 21742,
      finalApplicants: 28656,
      finalRate: 1.32,
    },
    { label: 'コース制計', schoolCount: 4, quota: 224, finalApplicants: 279, finalRate: 1.25 },
    { label: '単位制計', schoolCount: 12, quota: 2276, finalApplicants: 2948, finalRate: 1.3 },
    { label: '帰国対象計', schoolCount: 3, quota: 44, finalApplicants: 67, finalRate: 1.52 },
    { label: '引揚対象計', schoolCount: 3, quota: 18, finalApplicants: 0, finalRate: 0 },
    { label: '海外帰国生徒対象計', schoolCount: 6, quota: 62, finalApplicants: 67, finalRate: 1.08 },
    { label: '普通科計', schoolCount: 119, quota: 24304, finalApplicants: 31950, finalRate: 1.31 },
  ],
  records: [
    // ===== 区部（57校） =====
    { schoolName: '日比谷', area: '千代田', department: '普通科', quota: 253, finalApplicants: 520, finalRate: 2.06 },
    { schoolName: '三田', area: '港', department: '普通科', quota: 236, finalApplicants: 343, finalRate: 1.45 },
    { schoolName: '戸山', area: '新宿', department: '普通科', quota: 252, finalApplicants: 474, finalRate: 1.88 },
    { schoolName: '竹早', area: '文京', department: '普通科', quota: 177, finalApplicants: 293, finalRate: 1.66 },
    { schoolName: '向丘', area: '文京', department: '普通科', quota: 220, finalApplicants: 345, finalRate: 1.57 },
    { schoolName: '上野', area: '台東', department: '普通科', quota: 252, finalApplicants: 471, finalRate: 1.87 },
    { schoolName: '日本橋', area: '墨田', department: '普通科', quota: 189, finalApplicants: 204, finalRate: 1.08 },
    { schoolName: '本所', area: '墨田', department: '普通科', quota: 189, finalApplicants: 273, finalRate: 1.44 },
    { schoolName: '城東', area: '江東', department: '普通科', quota: 252, finalApplicants: 413, finalRate: 1.64 },
    { schoolName: '東', area: '江東', department: '普通科', quota: 189, finalApplicants: 298, finalRate: 1.58 },
    { schoolName: '深川', area: '江東', department: '普通科', quota: 185, finalApplicants: 265, finalRate: 1.43 },
    { schoolName: '大崎', area: '品川', department: '普通科', quota: 221, finalApplicants: 349, finalRate: 1.58 },
    { schoolName: '小山台', area: '品川', department: '普通科', quota: 252, finalApplicants: 412, finalRate: 1.63 },
    { schoolName: '八潮', area: '品川', department: '普通科', quota: 188, finalApplicants: 131, finalRate: 0.7 },
    { schoolName: '駒場', area: '目黒', department: '普通科', quota: 220, finalApplicants: 458, finalRate: 2.08 },
    { schoolName: '目黒', area: '目黒', department: '普通科', quota: 189, finalApplicants: 395, finalRate: 2.09 },
    { schoolName: '大森', area: '大田', department: '普通科', quota: 127, finalApplicants: 64, finalRate: 0.5 },
    { schoolName: '蒲田', area: '大田', department: '普通科', quota: 109, finalApplicants: 99, finalRate: 0.91 },
    { schoolName: '田園調布', area: '大田', department: '普通科', quota: 188, finalApplicants: 306, finalRate: 1.63 },
    { schoolName: '雪谷', area: '大田', department: '普通科', quota: 221, finalApplicants: 359, finalRate: 1.62 },
    { schoolName: '桜町', area: '世田谷', department: '普通科', quota: 252, finalApplicants: 286, finalRate: 1.13 },
    { schoolName: '千歳丘', area: '世田谷', department: '普通科', quota: 221, finalApplicants: 287, finalRate: 1.3 },
    { schoolName: '松原', area: '世田谷', department: '普通科', quota: 156, finalApplicants: 246, finalRate: 1.58 },
    { schoolName: '青山', area: '渋谷', department: '普通科', quota: 221, finalApplicants: 455, finalRate: 2.06 },
    { schoolName: '広尾', area: '渋谷', department: '普通科', quota: 154, finalApplicants: 280, finalRate: 1.82 },
    { schoolName: '鷺宮', area: '中野', department: '普通科', quota: 220, finalApplicants: 403, finalRate: 1.83 },
    { schoolName: '武蔵丘', area: '中野', department: '普通科', quota: 253, finalApplicants: 319, finalRate: 1.26 },
    { schoolName: '杉並', area: '杉並', department: '普通科', quota: 253, finalApplicants: 357, finalRate: 1.41 },
    { schoolName: '豊多摩', area: '杉並', department: '普通科', quota: 252, finalApplicants: 419, finalRate: 1.66 },
    { schoolName: '西', area: '杉並', department: '普通科', quota: 252, finalApplicants: 383, finalRate: 1.52 },
    { schoolName: '豊島', area: '豊島', department: '普通科', quota: 252, finalApplicants: 535, finalRate: 2.12 },
    { schoolName: '文京', area: '豊島', department: '普通科', quota: 284, finalApplicants: 381, finalRate: 1.34 },
    { schoolName: '竹台', area: '荒川', department: '普通科', quota: 171, finalApplicants: 238, finalRate: 1.39 },
    { schoolName: '板橋', area: '板橋', department: '普通科', quota: 221, finalApplicants: 346, finalRate: 1.57 },
    { schoolName: '大山', area: '板橋', department: '普通科', quota: 157, finalApplicants: 72, finalRate: 0.46 },
    { schoolName: '北園', area: '板橋', department: '普通科', quota: 253, finalApplicants: 421, finalRate: 1.66 },
    { schoolName: '高島', area: '板橋', department: '普通科', quota: 252, finalApplicants: 282, finalRate: 1.12 },
    { schoolName: '井草', area: '練馬', department: '普通科', quota: 221, finalApplicants: 274, finalRate: 1.24 },
    { schoolName: '石神井', area: '練馬', department: '普通科', quota: 252, finalApplicants: 417, finalRate: 1.65 },
    { schoolName: '田柄', area: '練馬', department: '普通科', quota: 152, finalApplicants: 74, finalRate: 0.49 },
    { schoolName: '練馬', area: '練馬', department: '普通科', quota: 189, finalApplicants: 213, finalRate: 1.13 },
    { schoolName: '光丘', area: '練馬', department: '普通科', quota: 185, finalApplicants: 137, finalRate: 0.74 },
    { schoolName: '青井', area: '足立', department: '普通科', quota: 164, finalApplicants: 67, finalRate: 0.41 },
    { schoolName: '足立', area: '足立', department: '普通科', quota: 220, finalApplicants: 299, finalRate: 1.36 },
    { schoolName: '足立新田', area: '足立', department: '普通科', quota: 222, finalApplicants: 231, finalRate: 1.04 },
    { schoolName: '足立西', area: '足立', department: '普通科', quota: 156, finalApplicants: 162, finalRate: 1.04 },
    { schoolName: '足立東', area: '足立', department: '普通科', quota: 138, finalApplicants: 117, finalRate: 0.85 },
    { schoolName: '江北', area: '足立', department: '普通科', quota: 252, finalApplicants: 421, finalRate: 1.67 },
    { schoolName: '淵江', area: '足立', department: '普通科', quota: 189, finalApplicants: 177, finalRate: 0.94 },
    { schoolName: '葛飾野', area: '葛飾', department: '普通科', quota: 253, finalApplicants: 285, finalRate: 1.13 },
    { schoolName: '南葛飾', area: '葛飾', department: '普通科', quota: 171, finalApplicants: 216, finalRate: 1.26 },
    { schoolName: '江戸川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 393, finalRate: 1.55 },
    { schoolName: '葛西南', area: '江戸川', department: '普通科', quota: 190, finalApplicants: 150, finalRate: 0.79 },
    { schoolName: '小岩', area: '江戸川', department: '普通科', quota: 284, finalApplicants: 390, finalRate: 1.37 },
    { schoolName: '小松川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 297, finalRate: 1.17 },
    { schoolName: '篠崎', area: '江戸川', department: '普通科', quota: 222, finalApplicants: 198, finalRate: 0.89 },
    { schoolName: '紅葉川', area: '江戸川', department: '普通科', quota: 189, finalApplicants: 226, finalRate: 1.2 },

    // ===== 多摩部（44校） =====
    { schoolName: '片倉', area: '八王子', department: '普通科', quota: 189, finalApplicants: 232, finalRate: 1.23 },
    { schoolName: '八王子北', area: '八王子', department: '普通科', quota: 158, finalApplicants: 178, finalRate: 1.13 },
    { schoolName: '八王子東', area: '八王子', department: '普通科', quota: 252, finalApplicants: 308, finalRate: 1.22 },
    { schoolName: '富士森', area: '八王子', department: '普通科', quota: 249, finalApplicants: 320, finalRate: 1.29 },
    { schoolName: '松が谷', area: '八王子', department: '普通科', quota: 188, finalApplicants: 265, finalRate: 1.41 },
    { schoolName: '立川', area: '立川', department: '普通科', quota: 220, finalApplicants: 323, finalRate: 1.47 },
    { schoolName: '武蔵野北', area: '武蔵野', department: '普通科', quota: 189, finalApplicants: 281, finalRate: 1.49 },
    { schoolName: '多摩', area: '青梅', department: '普通科', quota: 163, finalApplicants: 52, finalRate: 0.32 },
    { schoolName: '府中', area: '府中', department: '普通科', quota: 252, finalApplicants: 410, finalRate: 1.63 },
    { schoolName: '府中西', area: '府中', department: '普通科', quota: 235, finalApplicants: 267, finalRate: 1.14 },
    { schoolName: '府中東', area: '府中', department: '普通科', quota: 253, finalApplicants: 328, finalRate: 1.3 },
    { schoolName: '昭和', area: '昭島', department: '普通科', quota: 252, finalApplicants: 472, finalRate: 1.87 },
    { schoolName: '拝島', area: '昭島', department: '普通科', quota: 221, finalApplicants: 213, finalRate: 0.96 },
    { schoolName: '神代', area: '調布', department: '普通科', quota: 252, finalApplicants: 424, finalRate: 1.68 },
    { schoolName: '調布北', area: '調布', department: '普通科', quota: 188, finalApplicants: 326, finalRate: 1.73 },
    { schoolName: '調布南', area: '調布', department: '普通科', quota: 189, finalApplicants: 281, finalRate: 1.49 },
    { schoolName: '小川', area: '町田', department: '普通科', quota: 252, finalApplicants: 285, finalRate: 1.13 },
    { schoolName: '成瀬', area: '町田', department: '普通科', quota: 221, finalApplicants: 269, finalRate: 1.22 },
    { schoolName: '野津田', area: '町田', department: '普通科', quota: 95, finalApplicants: 36, finalRate: 0.38 },
    { schoolName: '町田', area: '町田', department: '普通科', quota: 253, finalApplicants: 306, finalRate: 1.21 },
    { schoolName: '山崎', area: '町田', department: '普通科', quota: 166, finalApplicants: 62, finalRate: 0.37 },
    { schoolName: '小金井北', area: '小金井', department: '普通科', quota: 189, finalApplicants: 307, finalRate: 1.62 },
    { schoolName: '小平', area: '小平', department: '普通科', quota: 157, finalApplicants: 235, finalRate: 1.5 },
    { schoolName: '小平西', area: '小平', department: '普通科', quota: 222, finalApplicants: 256, finalRate: 1.15 },
    { schoolName: '小平南', area: '小平', department: '普通科', quota: 221, finalApplicants: 317, finalRate: 1.43 },
    { schoolName: '日野', area: '日野', department: '普通科', quota: 253, finalApplicants: 459, finalRate: 1.81 },
    { schoolName: '日野台', area: '日野', department: '普通科', quota: 241, finalApplicants: 353, finalRate: 1.46 },
    { schoolName: '南平', area: '日野', department: '普通科', quota: 253, finalApplicants: 329, finalRate: 1.3 },
    { schoolName: '東村山', area: '東村山', department: '普通科', quota: 136, finalApplicants: 133, finalRate: 0.98 },
    { schoolName: '東村山西', area: '東村山', department: '普通科', quota: 189, finalApplicants: 130, finalRate: 0.69 },
    { schoolName: '国立', area: '国立', department: '普通科', quota: 252, finalApplicants: 330, finalRate: 1.31 },
    { schoolName: '福生', area: '福生', department: '普通科', quota: 221, finalApplicants: 242, finalRate: 1.1 },
    { schoolName: '狛江', area: '狛江', department: '普通科', quota: 253, finalApplicants: 425, finalRate: 1.68 },
    { schoolName: '東大和', area: '東大和', department: '普通科', quota: 221, finalApplicants: 277, finalRate: 1.25 },
    { schoolName: '東大和南', area: '東大和', department: '普通科', quota: 220, finalApplicants: 367, finalRate: 1.67 },
    { schoolName: '清瀬', area: '清瀬', department: '普通科', quota: 220, finalApplicants: 264, finalRate: 1.2 },
    { schoolName: '久留米西', area: '東久留米', department: '普通科', quota: 188, finalApplicants: 169, finalRate: 0.9 },
    { schoolName: '武蔵村山', area: '武蔵村山', department: '普通科', quota: 221, finalApplicants: 227, finalRate: 1.03 },
    { schoolName: '永山', area: '多摩', department: '普通科', quota: 246, finalApplicants: 234, finalRate: 0.95 },
    { schoolName: '羽村', area: '羽村', department: '普通科', quota: 204, finalApplicants: 71, finalRate: 0.35 },
    { schoolName: '秋留台', area: 'あきる野', department: '普通科', quota: 166, finalApplicants: 151, finalRate: 0.91 },
    { schoolName: '五日市', area: 'あきる野', department: '普通科', quota: 129, finalApplicants: 53, finalRate: 0.41 },
    { schoolName: '田無', area: '西東京', department: '普通科', quota: 252, finalApplicants: 299, finalRate: 1.19 },
    { schoolName: '保谷', area: '西東京', department: '普通科', quota: 253, finalApplicants: 364, finalRate: 1.44 },

    // ===== 島しょ（6校） =====
    { schoolName: '大島', area: '大島', department: '普通科', quota: 80, finalApplicants: 27, finalRate: 0.34 },
    { schoolName: '新島', area: '新島', department: '普通科', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '神津', area: '神津島', department: '普通科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '三宅', area: '三宅', department: '普通科', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '八丈', area: '八丈', department: '普通科', quota: 80, finalApplicants: 29, finalRate: 0.36 },
    { schoolName: '小笠原', area: '小笠原', department: '普通科', quota: 30, finalApplicants: 16, finalRate: 0.53 },

    // ===== 普通科（コース制の学校）（4校・既存校への追加学科・延べ校数は既存107校に含まれるため校数への計上は0） =====
    { schoolName: '深川', area: '江東', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 79, finalRate: 1.41 },
    { schoolName: '片倉', area: '八王子', department: '普通科（コース制・造形美術）', quota: 56, finalApplicants: 37, finalRate: 0.66 },
    { schoolName: '松が谷', area: '八王子', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 82, finalRate: 1.46 },
    { schoolName: '小平', area: '小平', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 81, finalRate: 1.45 },

    // ===== 普通科（単位制の学校）（12校・新規校） =====
    { schoolName: '新宿', area: '新宿', department: '普通科（単位制）', quota: 284, finalApplicants: 629, finalRate: 2.21 },
    { schoolName: '忍岡', area: '台東', department: '普通科（単位制）', quota: 124, finalApplicants: 134, finalRate: 1.08 },
    { schoolName: '墨田川', area: '墨田', department: '普通科（単位制）', quota: 252, finalApplicants: 296, finalRate: 1.17 },
    { schoolName: '美原', area: '大田', department: '普通科（単位制）', quota: 156, finalApplicants: 115, finalRate: 0.74 },
    { schoolName: '深沢', area: '世田谷', department: '普通科（単位制）', quota: 130, finalApplicants: 82, finalRate: 0.63 },
    { schoolName: '芦花', area: '世田谷', department: '普通科（単位制）', quota: 220, finalApplicants: 322, finalRate: 1.46 },
    { schoolName: '飛鳥', area: '北', department: '普通科（単位制）', quota: 170, finalApplicants: 196, finalRate: 1.15 },
    { schoolName: '板橋有徳', area: '板橋', department: '普通科（単位制）', quota: 156, finalApplicants: 155, finalRate: 0.99 },
    { schoolName: '大泉桜', area: '練馬', department: '普通科（単位制）', quota: 156, finalApplicants: 150, finalRate: 0.96 },
    { schoolName: '翔陽', area: '八王子', department: '普通科（単位制）', quota: 188, finalApplicants: 181, finalRate: 0.96 },
    { schoolName: '国分寺', area: '国分寺', department: '普通科（単位制）', quota: 252, finalApplicants: 409, finalRate: 1.62 },
    { schoolName: '上水', area: '武蔵村山', department: '普通科（単位制）', quota: 188, finalApplicants: 279, finalRate: 1.48 },

    // ===== 普通科（海外帰国生徒対象）（6校・既存校への追加学科・帰国生3+引揚者3） =====
    { schoolName: '三田', area: '港', department: '普通科（海外帰国生徒対象・帰国生）', quota: 18, finalApplicants: 24, finalRate: 1.33 },
    { schoolName: '竹早', area: '文京', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 24, finalRate: 1.85 },
    { schoolName: '日野台', area: '日野', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 19, finalRate: 1.46 },
    { schoolName: '深川', area: '江東', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0 },
    { schoolName: '光丘', area: '練馬', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0 },
    { schoolName: '富士森', area: '八王子', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0 },
  ],
};
