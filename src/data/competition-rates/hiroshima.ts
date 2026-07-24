/**
 * 広島県 公立高等学校 倍率パイプラインα（Y-6・3県目）。
 *
 * 一次ソース: 広島県教育委員会「令和8年度広島県公立高等学校入学者選抜一次選抜、帰国生徒及び
 * 外国人生徒等の特別入学に関する選抜の志願状況」（令和8年2月18日確定・志願変更後の最終志願者数）。
 *
 * ⚠️広島県のPDFはテキスト埋め込み型（他県のような画像スキャンではない）で、pdftotext -layout
 * によるテキスト抽出が正確に機能した（OCR誤読のリスクなし・Osaka県のxlsx解析に次ぐ高信頼度技法）。
 * 全日制本校（84校142学科・コース）＋全日制分校（1校1学科）の全レコードを完全収録し、機械集計
 * （quota14,703・applicants13,759・倍率0.94）が公式資料の小計（全日制本校14,673/13,737/0.94＋
 * 全日制分校30/22/0.73）の合算と完全一致した。
 *
 * ⚠️「うち調整」列（学校裁量枠等の調整数）は他県の内訳枠（Ⅰ/Ⅱ/Ⅲ等）と同様に対象外（総定員・
 * 総志願者数のみを採用）。
 *
 * ⚠️一部の学科は「くくり募集」（複数の学科・コースが1つの定員枠を共有し、PDF上で括弧書きに
 * よって束ねられている）であり、学校単位の複数レコードに分解できないため学科名を連結した単一
 * レコードとして記録した（呉工業「機械・材料工学」「電気・電子機械」／福山工業「工業化学・
 * 染織システム」／宮島工業「電気・情報技術」「建築・インテリア」の計5組）。これによりレコード数
 * （137+1=138）はPDF記載の学科・コース数（142+1=143）より少ないが、金額（quota/applicants）は
 * 一致するため他県のくくり募集パターン（福岡県小倉商業等）と同型の扱いとして正当。
 *
 * 定時制・フレキシブル課程は東京都・神奈川県・千葉県・埼玉県・福岡県・兵庫県・静岡県と同じ理由で
 * スコープ外（全日制の外側の別課程のため対象外として明示的に除外）。帰国生徒・外国人生徒等の
 * 特別入学に関する選抜（27名程度の枠）も全日制本校の各校別定員に含まれないため対象外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const HIROSHIMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'hiroshima',
  sources: [
    {
      url: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/655351.pdf',
      docTitle:
        '広島県教育委員会 令和8年度広島県公立高等学校入学者選抜一次選抜、帰国生徒及び外国人生徒等の特別入学に関する選抜の志願状況（最終志願状況）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（本校84校＋分校1校＝85校・完全収録）'],
    pendingDepartments: [
      '定時制・フレキシブル課程（全日制の外側の別課程のため東京都・神奈川県・千葉県・埼玉県・福岡県・兵庫県・静岡県と同じ理由で意図的にスコープ外）',
    ],
    note:
      '全日制本校（84校142学科・コース）＋全日制分校（1校1学科）の全レコードを完全収録し、' +
      '機械集計（quota14,703・applicants13,759・倍率0.94）が公式資料の小計合算と完全一致した。' +
      'くくり募集（5組）は学科名を連結した単一レコードとして記録したためレコード数は学科数より少ない。',
  },
  officialSubtotals: [
    { label: '全日制（本校＋分校）', quota: 14703, finalApplicants: 13759, finalRate: 0.94 },
  ],
  records: [
    { schoolName: '広島国泰寺', department: '普通', quota: 240, finalApplicants: 376, finalRate: 1.57 },
    { schoolName: '広島国泰寺', department: '普通【理数】', quota: 80, finalApplicants: 72, finalRate: 0.9 },
    { schoolName: '広島市立基町', department: '普通', quota: 320, finalApplicants: 433, finalRate: 1.35 },
    { schoolName: '広島市立基町', department: '普通【創造表現】', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '広島市立舟入', department: '普通', quota: 280, finalApplicants: 323, finalRate: 1.15 },
    { schoolName: '広島市立舟入', department: '普通【国際コミュニケーション】', quota: 40, finalApplicants: 62, finalRate: 1.55 },
    { schoolName: '広島商業', department: '情報ビジネス', quota: 320, finalApplicants: 317, finalRate: 0.99 },
    { schoolName: '広島市立広島商業', department: 'みらい商業', quota: 240, finalApplicants: 182, finalRate: 0.76 },
    { schoolName: '広島皆実', department: '普通', quota: 240, finalApplicants: 355, finalRate: 1.48 },
    { schoolName: '広島皆実', department: '衛生看護', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '広島皆実', department: '体育', quota: 40, finalApplicants: 40, finalRate: 1 },
    { schoolName: '広島工業', department: '機械', quota: 80, finalApplicants: 57, finalRate: 0.71 },
    { schoolName: '広島工業', department: '電気', quota: 80, finalApplicants: 68, finalRate: 0.85 },
    { schoolName: '広島工業', department: '建築', quota: 80, finalApplicants: 49, finalRate: 0.61 },
    { schoolName: '広島工業', department: '土木', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '広島工業', department: '化学工学', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '広島市立広島工業', department: '機械', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '広島市立広島工業', department: '自動車', quota: 40, finalApplicants: 70, finalRate: 1.75 },
    { schoolName: '広島市立広島工業', department: '電気', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '広島市立広島工業', department: '情報電子', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '広島市立広島工業', department: '建築', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '広島市立広島工業', department: '環境設備', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '広島井口', department: '普通', quota: 320, finalApplicants: 439, finalRate: 1.37 },
    { schoolName: '広島観音', department: '総合学科', quota: 280, finalApplicants: 360, finalRate: 1.29 },
    { schoolName: '安古市', department: '普通', quota: 320, finalApplicants: 390, finalRate: 1.22 },
    { schoolName: '安西', department: '普通', quota: 80, finalApplicants: 56, finalRate: 0.7 },
    { schoolName: '祇園北', department: '普通', quota: 280, finalApplicants: 326, finalRate: 1.16 },
    { schoolName: '祇園北', department: '普通【理数】', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '広島市立沼田', department: '普通', quota: 240, finalApplicants: 242, finalRate: 1.01 },
    { schoolName: '広島市立沼田', department: '普通【体育】', quota: 80, finalApplicants: 88, finalRate: 1.1 },
    { schoolName: '可部', department: '普通', quota: 240, finalApplicants: 177, finalRate: 0.74 },
    { schoolName: '高陽', department: '普通', quota: 240, finalApplicants: 218, finalRate: 0.91 },
    { schoolName: '高陽東', department: '総合学科', quota: 240, finalApplicants: 282, finalRate: 1.18 },
    { schoolName: '安芸南', department: '普通', quota: 200, finalApplicants: 202, finalRate: 1.01 },
    { schoolName: '五日市', department: '普通', quota: 240, finalApplicants: 252, finalRate: 1.05 },
    { schoolName: '湯来南', department: '普通', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '広島市立美鈴が丘', department: 'グローカル探究', quota: 240, finalApplicants: 211, finalRate: 0.88 },
    { schoolName: '広', department: '普通', quota: 200, finalApplicants: 162, finalRate: 0.81 },
    { schoolName: '呉宮原', department: '普通', quota: 200, finalApplicants: 189, finalRate: 0.95 },
    { schoolName: '呉三津田', department: '普通', quota: 200, finalApplicants: 200, finalRate: 1 },
    { schoolName: '音戸', department: '普通', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '呉工業', department: '機械・材料工学', quota: 80, finalApplicants: 29, finalRate: 0.36 },
    { schoolName: '呉工業', department: '電気・電子機械', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '呉商業', department: '情報ビジネス', quota: 160, finalApplicants: 135, finalRate: 0.84 },
    { schoolName: '呉市立呉', department: '総合学科', quota: 160, finalApplicants: 158, finalRate: 0.99 },
    { schoolName: '竹原', department: '普通', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '竹原', department: '商業', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '忠海', department: '普通', quota: 80, finalApplicants: 21, finalRate: 0.26 },
    { schoolName: '三原', department: '普通', quota: 160, finalApplicants: 153, finalRate: 0.96 },
    { schoolName: '三原東', department: '普通', quota: 80, finalApplicants: 35, finalRate: 0.44 },
    { schoolName: '総合技術', department: '電子機械', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '総合技術', department: '情報技術', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '総合技術', department: '環境設備', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '総合技術', department: '現代ビジネス', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '総合技術', department: '人間福祉', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '総合技術', department: '食デザイン', quota: 40, finalApplicants: 40, finalRate: 1 },
    { schoolName: '尾道東', department: '普通', quota: 120, finalApplicants: 126, finalRate: 1.05 },
    { schoolName: '尾道東', department: '普通【国際教養】', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '御調', department: '普通', quota: 69, finalApplicants: 14, finalRate: 0.2 },
    { schoolName: '瀬戸田', department: '普通', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '尾道商業', department: '情報ビジネス', quota: 200, finalApplicants: 171, finalRate: 0.86 },
    { schoolName: '尾道北', department: '総合学科', quota: 200, finalApplicants: 194, finalRate: 0.97 },
    { schoolName: '因島', department: '総合学科', quota: 80, finalApplicants: 42, finalRate: 0.53 },
    { schoolName: '福山葦陽', department: '普通', quota: 320, finalApplicants: 352, finalRate: 1.1 },
    { schoolName: '沼南', department: '家政', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '沼南', department: '園芸デザイン', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '大門', department: '普通', quota: 200, finalApplicants: 214, finalRate: 1.07 },
    { schoolName: '大門', department: '普通【理数】', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '福山明王台', department: '普通', quota: 280, finalApplicants: 234, finalRate: 0.84 },
    { schoolName: '神辺旭', department: '普通', quota: 200, finalApplicants: 182, finalRate: 0.91 },
    { schoolName: '神辺旭', department: '体育', quota: 40, finalApplicants: 40, finalRate: 1 },
    { schoolName: '福山市立福山', department: '普通', quota: 88, finalApplicants: 112, finalRate: 1.27 },
    { schoolName: '福山工業', department: '機械', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '福山工業', department: '電気', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '福山工業', department: '建築', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '福山工業', department: '工業化学・染織システム', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '福山工業', department: '電子機械', quota: 80, finalApplicants: 68, finalRate: 0.85 },
    { schoolName: '福山商業', department: '情報ビジネス', quota: 160, finalApplicants: 74, finalRate: 0.46 },
    { schoolName: '福山誠之館', department: '総合学科', quota: 320, finalApplicants: 428, finalRate: 1.34 },
    { schoolName: '松永', department: '総合学科', quota: 160, finalApplicants: 81, finalRate: 0.51 },
    { schoolName: '神辺', department: '総合学科', quota: 200, finalApplicants: 218, finalRate: 1.09 },
    { schoolName: '戸手', department: '総合学科', quota: 200, finalApplicants: 196, finalRate: 0.98 },
    { schoolName: '府中', department: '普通', quota: 200, finalApplicants: 194, finalRate: 0.97 },
    { schoolName: '上下', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '府中東', department: '普通', quota: 80, finalApplicants: 64, finalRate: 0.8 },
    { schoolName: '府中東', department: 'インテリア', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '府中東', department: '都市システム', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '三次', department: '普通', quota: 126, finalApplicants: 130, finalRate: 1.03 },
    { schoolName: '日彰館', department: '普通', quota: 80, finalApplicants: 44, finalRate: 0.55 },
    { schoolName: '三次青陵', department: '総合学科', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '庄原格致', department: '普通', quota: 80, finalApplicants: 63, finalRate: 0.79 },
    { schoolName: '庄原格致', department: '普通【医療・教職】', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '東城', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '西城紫水', department: '普通', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '庄原実業', department: '生物生産学', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '庄原実業', department: '環境工学', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '庄原実業', department: '食品工学', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '庄原実業', department: '生活科学', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '大竹', department: '総合学科', quota: 160, finalApplicants: 61, finalRate: 0.38 },
    { schoolName: '賀茂', department: '普通', quota: 240, finalApplicants: 262, finalRate: 1.09 },
    { schoolName: '賀茂北', department: '普通', quota: 35, finalApplicants: 23, finalRate: 0.66 },
    { schoolName: '黒瀬', department: '普通', quota: 80, finalApplicants: 44, finalRate: 0.55 },
    { schoolName: '黒瀬', department: '福祉', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '河内', department: '普通', quota: 80, finalApplicants: 43, finalRate: 0.54 },
    { schoolName: '豊田', department: '普通', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '広島', department: '普通', quota: 84, finalApplicants: 62, finalRate: 0.74 },
    { schoolName: '西条農業', department: '園芸', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '西条農業', department: '畜産', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '西条農業', department: '生活', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '西条農業', department: '農業機械', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '西条農業', department: '緑地土木', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '西条農業', department: '生物工学', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '西条農業', department: '食品科学', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '廿日市', department: '普通', quota: 280, finalApplicants: 328, finalRate: 1.17 },
    { schoolName: '佐伯', department: '普通', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '廿日市西', department: '普通', quota: 160, finalApplicants: 163, finalRate: 1.02 },
    { schoolName: '宮島工業', department: '機械', quota: 80, finalApplicants: 46, finalRate: 0.58 },
    { schoolName: '宮島工業', department: '電気・情報技術', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '宮島工業', department: '建築・インテリア', quota: 80, finalApplicants: 52, finalRate: 0.65 },
    { schoolName: '宮島工業', department: '素材システム', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '吉田', department: '探究', quota: 120, finalApplicants: 87, finalRate: 0.73 },
    { schoolName: '吉田', department: 'アグリビジネス', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '向原', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '大柿', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '安芸府中', department: '普通', quota: 200, finalApplicants: 148, finalRate: 0.74 },
    { schoolName: '安芸府中', department: '国際', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '海田', department: '普通', quota: 200, finalApplicants: 286, finalRate: 1.43 },
    { schoolName: '海田', department: '家政', quota: 80, finalApplicants: 64, finalRate: 0.8 },
    { schoolName: '熊野', department: '普通', quota: 160, finalApplicants: 131, finalRate: 0.82 },
    { schoolName: '加計', department: '普通', quota: 22, finalApplicants: 29, finalRate: 1.32 },
    { schoolName: '千代田', department: '普通', quota: 80, finalApplicants: 58, finalRate: 0.73 },
    { schoolName: '大崎海星', department: '普通', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '世羅', department: '普通', quota: 80, finalApplicants: 58, finalRate: 0.73 },
    { schoolName: '世羅', department: '生活福祉', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '世羅', department: '農業経営', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '油木', department: '普通', quota: 20, finalApplicants: 15, finalRate: 0.75 },
    { schoolName: '油木', department: '産業ビジネス', quota: 29, finalApplicants: 10, finalRate: 0.34 },
    { schoolName: '加計・芸北', department: '普通', quota: 30, finalApplicants: 22, finalRate: 0.73 },
  ],
};
