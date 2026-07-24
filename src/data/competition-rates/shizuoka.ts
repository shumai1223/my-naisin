/**
 * 静岡県 公立高等学校 倍率パイプラインα（Y-6・2県目）。
 *
 * 一次ソース: 静岡県教育委員会「令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）」
 * （令和8年2月26日確定・志願変更後の最終確定数）。
 *
 * ⚠️静岡県の資料は他県と異なる独自の表構造を持つ。各学科の募集定員の下に、
 * 「Ⅰ（13%程度）」「Ⅱ（20%程度）」等の**選抜枠（特色選抜・連携型選抜等）の割合ベースの
 * 内訳行**が付随するが、これらは学科の総募集定員の一部を占める「選抜方法別の内訳」であり、
 * 別の学科や別の募集枠を意味しない（例: 下田高校普通科は総定員120に対し、Ⅰ枠16・Ⅱ枠24という
 * 内訳が付くが16+24=40は120の一部に過ぎず、合算しても総定員と一致しない）。本データベースは
 * 学科単位の総定員・総志願者数・総志願倍率（インデントの無い最上位行）のみを1レコードとして
 * 採用し、Ⅰ/Ⅱ/Ⅲの内訳行は取り込まない（他県で推薦入学等の内訳を集計に含めているのと
 * 実質的に同じ扱い）。
 *
 * また「連携（定めない）」「海外（若干名）」「長期（若干名）」「県外（若干名）」等、募集定員が
 * 数値ではなく「−」（未定・若干名）と記載される特殊枠は、quota:numberという型上正直に
 * 表現できないため記録しない（Y-0憲法③「機械可読不能は正直にスキップ」の精神を適用）。
 *
 * ⚠️対象範囲=現時点でPDF1ページ目（下田〜三島北、13校19レコード）＋2ページ目（御殿場〜富士、
 * 13校20レコード）＋3ページ目（富士東〜静岡城北、12校20レコード）＋4ページ目（静岡東〜
 * 焼津中央、8校19レコード）＋5ページ目（焼津水産〜掛川西、13校21レコード）＋6ページ目
 * （掛川工業〜磐田農業、10校19レコード）＋7ページ目（磐田西〜浜松東、10校19レコード）
 * の計79校137レコードを高い確信度で確定済み。全体のページ数・総校数は未確認（次回
 * セッションで残りページを確認しながら継続する）。
 *
 * ⚠️会場番号が100番台（他校は連番14〜25等）の学校（沼津市立沼津=100・富士市立=101・
 * 静岡市立清水桜が丘=102）は市立高校を意味すると判明した（3例とも「○○市立」を含む校名）。
 * また沼津市立沼津・清水南（会場番号33・市立ではない）の2校では募集定員が「(132)」「(34)」
 * のように括弧書きされている（他校は括弧無しの数値）。市立か否かに関わらず出現しており
 * 原因は未確定だが、括弧を外した数値をそのままquotaとして採用した（浜松西「(105)」も含め
 * 4例観測され再現性のあるパターンと判明・他の記録方法が見つかった場合は要再確認）。
 *
 * 定時制は東京都・神奈川県・千葉県・埼玉県・福岡県・兵庫県と同じ理由でスコープ外（全日制の
 * 外側の別課程のため対象外として明示的に除外）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const SHIZUOKA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'shizuoka',
  sources: [
    {
      url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8shigansyasuusiganhennkougo1.pdf',
      docTitle: '静岡県教育委員会 令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['全日制（PDF1〜7ページ目・下田〜浜松東の79校）'],
    pendingDepartments: [
      '全日制（PDF8ページ目以降、総ページ数・総校数とも未確認）',
      '定時制（全日制の外側の別課程のため東京都・神奈川県・千葉県・埼玉県・福岡県・兵庫県と同じ理由で意図的にスコープ外）',
    ],
    note:
      '静岡県は学科ごとに選抜枠（Ⅰ/Ⅱ/Ⅲ・特色選抜等）の割合内訳が付随する独自の表構造を持つ。' +
      '今回はPDF1〜7ページ目の79校137レコード（学科の総定員行のみ）を高確信度で確定。「連携（定めない）」' +
      '等の募集定員が数値化できない特殊枠は記録から除外した。総ページ数・県レベルのグランドトータルは' +
      'まだ確認できていない（残りページを継続する中で確認する）。',
  },
  officialSubtotals: [],
  records: [
    { schoolName: '下田', department: '普通科', quota: 120, finalApplicants: 120, finalRate: 1.0 },
    { schoolName: '下田', department: '理数科', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '南伊豆分校', department: '園芸', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '松崎', department: '普通科', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '稲取', department: '普通科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '伊豆伊東', department: '普通科', quota: 160, finalApplicants: 145, finalRate: 0.91 },
    { schoolName: '伊豆伊東', department: 'ビジネスマネジメント', quota: 80, finalApplicants: 65, finalRate: 0.81 },
    { schoolName: '熱海', department: '普通科', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '伊豆総合', department: '工業', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '伊豆総合', department: '総合', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '土肥分校', department: '普通科', quota: 35, finalApplicants: 21, finalRate: 0.6 },
    { schoolName: '韮山', department: '普通科', quota: 240, finalApplicants: 223, finalRate: 0.93 },
    { schoolName: '韮山', department: '理数科', quota: 40, finalApplicants: 70, finalRate: 1.75 },
    { schoolName: '伊豆中央', department: '普通科', quota: 120, finalApplicants: 92, finalRate: 0.77 },
    { schoolName: '田方農業', department: '生産科学・園芸デザイン', quota: 80, finalApplicants: 64, finalRate: 0.8 },
    { schoolName: '田方農業', department: '動物科学', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '田方農業', department: '食品科学・ライフデザイン', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '三島南', department: '普通科', quota: 200, finalApplicants: 226, finalRate: 1.13 },
    { schoolName: '三島北', department: '普通科', quota: 280, finalApplicants: 332, finalRate: 1.19 },
    { schoolName: '御殿場', department: '創造工学', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '御殿場', department: '創造ビジネス', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '御殿場', department: '生活創造デザイン', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '御殿場南', department: '普通科', quota: 160, finalApplicants: 126, finalRate: 0.79 },
    { schoolName: '小山', department: '普通科', quota: 80, finalApplicants: 64, finalRate: 0.8 },
    { schoolName: '裾野', department: '総合', quota: 80, finalApplicants: 68, finalRate: 0.85 },
    { schoolName: '沼津東', department: '普通科', quota: 240, finalApplicants: 229, finalRate: 0.95 },
    { schoolName: '沼津東', department: '理数科', quota: 40, finalApplicants: 55, finalRate: 1.38 },
    { schoolName: '沼津西', department: '普通科', quota: 120, finalApplicants: 131, finalRate: 1.09 },
    { schoolName: '沼津西', department: '芸術', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '沼津城北', department: '普通科', quota: 80, finalApplicants: 52, finalRate: 0.65 },
    { schoolName: '沼津工業', department: '機械・電気・電子ロボット・建設デザイン', quota: 160, finalApplicants: 163, finalRate: 1.02 },
    { schoolName: '沼津商業', department: '総合ビジネス', quota: 80, finalApplicants: 103, finalRate: 1.29 },
    { schoolName: '沼津商業', department: '情報ビジネス', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '沼津市立沼津', department: '普通科', quota: 132, finalApplicants: 114, finalRate: 0.86 },
    { schoolName: '吉原', department: '普通科', quota: 120, finalApplicants: 115, finalRate: 0.96 },
    { schoolName: '吉原', department: '国際', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '吉原工業', department: '機械工学・ロボット工学・電気機器工学・理数化学', quota: 160, finalApplicants: 140, finalRate: 0.88 },
    { schoolName: '富士', department: '普通科', quota: 200, finalApplicants: 224, finalRate: 1.12 },
    { schoolName: '富士', department: '理数科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '富士東', department: '普通科', quota: 160, finalApplicants: 160, finalRate: 1.0 },
    { schoolName: '富士宮東', department: '普通科', quota: 120, finalApplicants: 99, finalRate: 0.83 },
    { schoolName: '富士宮東', department: '福祉', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '富士宮北', department: '普通科', quota: 120, finalApplicants: 135, finalRate: 1.13 },
    { schoolName: '富士宮北', department: '商業', quota: 80, finalApplicants: 73, finalRate: 0.91 },
    { schoolName: '富士宮西', department: '普通科', quota: 160, finalApplicants: 114, finalRate: 0.71 },
    { schoolName: '富岳館', department: '総合', quota: 200, finalApplicants: 171, finalRate: 0.86 },
    { schoolName: '富士市立', department: 'ビジネス探究', quota: 80, finalApplicants: 57, finalRate: 0.71 },
    { schoolName: '富士市立', department: 'スポーツ探究', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '富士市立', department: '総合探究', quota: 120, finalApplicants: 106, finalRate: 0.88 },
    { schoolName: '清水東', department: '普通科', quota: 240, finalApplicants: 231, finalRate: 0.96 },
    { schoolName: '清水東', department: '理数科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '清水西', department: '普通科', quota: 160, finalApplicants: 143, finalRate: 0.89 },
    { schoolName: '清水南', department: '普通科', quota: 34, finalApplicants: 4, finalRate: 0.12 },
    { schoolName: '清水南', department: '芸術', quota: 33, finalApplicants: 20, finalRate: 0.61 },
    { schoolName: '静岡市立清水桜が丘', department: '普通科', quota: 120, finalApplicants: 126, finalRate: 1.05 },
    { schoolName: '静岡市立清水桜が丘', department: '商業', quota: 120, finalApplicants: 129, finalRate: 1.08 },
    { schoolName: '静岡', department: '普通科', quota: 320, finalApplicants: 419, finalRate: 1.31 },
    { schoolName: '静岡城北', department: '普通科', quota: 200, finalApplicants: 191, finalRate: 0.96 },
    { schoolName: '静岡城北', department: 'グローバル', quota: 40, finalApplicants: 55, finalRate: 1.38 },
    { schoolName: '静岡東', department: '普通科', quota: 280, finalApplicants: 308, finalRate: 1.1 },
    { schoolName: '静岡西', department: '普通科', quota: 80, finalApplicants: 70, finalRate: 0.88 },
    { schoolName: '駿河総合', department: '総合', quota: 200, finalApplicants: 197, finalRate: 0.99 },
    { schoolName: '静岡農業', department: '生物生産・生産流通', quota: 80, finalApplicants: 68, finalRate: 0.85 },
    { schoolName: '静岡農業', department: '環境科学', quota: 40, finalApplicants: 54, finalRate: 1.35 },
    { schoolName: '静岡農業', department: '食品科学・生活科学', quota: 80, finalApplicants: 90, finalRate: 1.13 },
    { schoolName: '科学技術', department: '機械工学', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '科学技術', department: 'ロボット工学', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '科学技術', department: '電気工学', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '科学技術', department: '情報システム', quota: 40, finalApplicants: 75, finalRate: 1.88 },
    { schoolName: '科学技術', department: '建築デザイン', quota: 40, finalApplicants: 58, finalRate: 1.45 },
    { schoolName: '科学技術', department: '都市基盤工学', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '科学技術', department: '電子物質工学', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '科学技術', department: '理工', quota: 40, finalApplicants: 55, finalRate: 1.38 },
    { schoolName: '静岡商業', department: '商業', quota: 160, finalApplicants: 169, finalRate: 1.06 },
    { schoolName: '静岡商業', department: '情報処理', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '静岡市立', department: '普通科', quota: 280, finalApplicants: 311, finalRate: 1.11 },
    { schoolName: '静岡市立', department: '科学探究', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '焼津中央', department: '普通科', quota: 280, finalApplicants: 291, finalRate: 1.04 },
    { schoolName: '焼津水産', department: '海洋科学', quota: 80, finalApplicants: 84, finalRate: 1.05 },
    { schoolName: '焼津水産', department: '栽培漁業', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '焼津水産', department: '食品科学', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '焼津水産', department: '流通情報', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '清流館', department: '普通科', quota: 160, finalApplicants: 168, finalRate: 1.05 },
    { schoolName: '清流館', department: '福祉', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '藤枝東', department: '普通科', quota: 280, finalApplicants: 335, finalRate: 1.2 },
    { schoolName: '藤枝西', department: '普通科', quota: 160, finalApplicants: 172, finalRate: 1.08 },
    { schoolName: '藤枝北', department: '総合', quota: 160, finalApplicants: 170, finalRate: 1.06 },
    { schoolName: '島田', department: '普通科', quota: 160, finalApplicants: 156, finalRate: 0.98 },
    { schoolName: '島田工業', department: '機械・電気・情報電子【Ⅰ類】', quota: 120, finalApplicants: 104, finalRate: 0.87 },
    { schoolName: '島田工業', department: '建築・都市工学【Ⅱ類】', quota: 80, finalApplicants: 50, finalRate: 0.63 },
    { schoolName: '島田商業', department: '商業', quota: 160, finalApplicants: 170, finalRate: 1.06 },
    { schoolName: '川根', department: '普通科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '榛原', department: '普通科', quota: 120, finalApplicants: 101, finalRate: 0.84 },
    { schoolName: '榛原', department: '理数科', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '相良', department: '普通科', quota: 80, finalApplicants: 85, finalRate: 1.06 },
    { schoolName: '相良', department: '商業', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '掛川東', department: '普通科', quota: 200, finalApplicants: 257, finalRate: 1.29 },
    { schoolName: '掛川西', department: '普通科', quota: 280, finalApplicants: 315, finalRate: 1.13 },
    { schoolName: '掛川西', department: '理数科', quota: 40, finalApplicants: 55, finalRate: 1.38 },
    { schoolName: '掛川工業', department: '機械工学', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '掛川工業', department: '電気電子工学', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '掛川工業', department: '情報工学', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '掛川工業', department: '建築設備工学', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '横須賀', department: '普通科', quota: 120, finalApplicants: 113, finalRate: 0.94 },
    { schoolName: '池新田', department: '普通科', quota: 120, finalApplicants: 84, finalRate: 0.7 },
    { schoolName: '小笠', department: '総合', quota: 200, finalApplicants: 202, finalRate: 1.01 },
    { schoolName: '遠江総合', department: '総合', quota: 160, finalApplicants: 141, finalRate: 0.88 },
    { schoolName: '袋井', department: '普通科', quota: 240, finalApplicants: 254, finalRate: 1.06 },
    { schoolName: '袋井商業', department: '商業', quota: 120, finalApplicants: 85, finalRate: 0.71 },
    { schoolName: '磐田南', department: '普通科', quota: 280, finalApplicants: 283, finalRate: 1.01 },
    { schoolName: '磐田南', department: '理数科', quota: 40, finalApplicants: 75, finalRate: 1.88 },
    { schoolName: '磐田北', department: '普通科', quota: 160, finalApplicants: 144, finalRate: 0.9 },
    { schoolName: '磐田北', department: '福祉', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '磐田農業', department: '生産科学', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '磐田農業', department: '生産流通', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '磐田農業', department: '環境科学', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '磐田農業', department: '食品科学', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '磐田農業', department: '生活科学', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '磐田西', department: '普通科', quota: 120, finalApplicants: 133, finalRate: 1.11 },
    { schoolName: '磐田西', department: '総合ビジネス', quota: 80, finalApplicants: 74, finalRate: 0.93 },
    { schoolName: '天竜', department: '森林・環境', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '天竜', department: '福祉', quota: 20, finalApplicants: 6, finalRate: 0.3 },
    { schoolName: '天竜', department: '総合', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '春野校舎', department: '普通科', quota: 35, finalApplicants: 19, finalRate: 0.54 },
    { schoolName: '浜松北', department: '普通科', quota: 320, finalApplicants: 408, finalRate: 1.28 },
    { schoolName: '浜松北', department: '国際', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '浜松西', department: '普通科', quota: 105, finalApplicants: 118, finalRate: 1.12 },
    { schoolName: '浜松南', department: '普通科', quota: 280, finalApplicants: 374, finalRate: 1.34 },
    { schoolName: '浜松南', department: '理数科', quota: 40, finalApplicants: 71, finalRate: 1.78 },
    { schoolName: '浜松湖東', department: '普通科', quota: 240, finalApplicants: 228, finalRate: 0.95 },
    { schoolName: '浜松湖南', department: '普通科', quota: 280, finalApplicants: 263, finalRate: 0.94 },
    { schoolName: '浜松湖南', department: '英語', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '浜松江之島', department: '普通科', quota: 120, finalApplicants: 133, finalRate: 1.11 },
    { schoolName: '浜松江之島', department: '芸術', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '浜松東', department: '普通科', quota: 120, finalApplicants: 125, finalRate: 1.04 },
    { schoolName: '浜松東', department: '総合ビジネス', quota: 80, finalApplicants: 80, finalRate: 1.0 },
    { schoolName: '浜松東', department: '情報ビジネス', quota: 40, finalApplicants: 33, finalRate: 0.83 },
  ],
};
