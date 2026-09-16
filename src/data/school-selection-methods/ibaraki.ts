// 茨城県: 令和8年度茨城県立高等学校（全日制課程）入学者選抜における学校・学科別
// 「特色選抜の実施及び選抜資料」「学力検査重視の選抜と調査書重視の選抜で合格する人数の比率」。
//
// 一次ソース: 茨城県教育委員会「令和8年度茨城県立高等学校（全日制・定時制）入学者選抜実施細則」
// （令和7年10月改正）PDF別表1「高等学校別入学者選抜実施方法」
// (`kyoiku.pref.ibaraki.jp/wp-content/uploads/2025/10/saisoku.pdf`・印刷頁65〜66・
// 2026-09-17 curl+pdftoppmで目視確認)。
//
// 茨城県の「倍率のタイプ」は大阪府・愛知県のような記号(A/B/C・I〜V)ではなく、共通選抜における
// 「学力検査重視の選抜」と「調査書重視の選抜」で合格者を振り分ける人数比率を直接パーセント表記
// する方式（例: 80:20）。ratioTypeフィールドにはこの比率をそのまま'80:20'の形式で転記する。
// 共通選抜そのものの合否判定方式（A群/B群の振り分けルール）は全校共通のため個別レコードには
// 含めず、本ファイル冒頭のコメントに一度だけ記載する:
//   共通選抜では、学力検査(得点合計)の順位が募集定員から特例入学者選抜枠及び特色選抜枠の
//   合格者数を引いた数の80%以内、かつ、調査書(3年間の評定合計)の順位が募集定員から特例
//   入学者選抜枠及び特色選抜枠の合格者数を引いた数以内の場合、A群として原則合格とする。
//   B群は、受検者全体からA群での合格者を除いた残りとし、上記の学力検査重視:調査書重視の
//   比率で振り分けて合格者を決定する。
//
// interviewRequiredフィールドは特色選抜における面接実施の有無を表す（○＝実施）。
//
// ⚠️収録範囲: 別表1全体（印刷頁65〜71）のうち65〜68頁（全日制課程・高萩清松〜江戸崎総合）を
// 完全収録。69〜71頁（残りの学校）は未収録。定時制課程の別表2・連携型高等学校の別表3は対象外
// （T-Y14は全日制課程の「一般」相当選抜を対象とするため）。★茨城東(30:70)は調査書重視の比率が
// 学力検査を上回る珍しい配分。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const IBARAKI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'ibaraki',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '別表1(印刷頁65〜71)のうち65〜68頁(高萩清松〜江戸崎総合)を完全収録。ratioTypeは学力検査重視:調査書重視の比率(例80:20・茨城東は30:70で調査書重視が逆転)。69頁以降・定時制(別表2)・連携型(別表3)は未収録',
  schools: [
    { schoolName: '高萩清松', department: '総合学科', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない。単位制' },
    { schoolName: '日立第一', department: '普通・サイエンス', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '普通科とサイエンス科はくくり募集。特色選抜は学力検査・調査書・面接(体育分野は実技、文化分野はプレゼンテーション)を実施。単位制' },
    { schoolName: '日立第二', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '日立工業', department: '機械・工業化学', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '日立工業', department: '電気', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '日立工業', department: '情報電子', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '多賀', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '日立商業', department: '商業', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '日立商業', department: '情報処理', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '日立北', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '磯原郷英', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '太田第一', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施。単位制' },
    { schoolName: '太田西山', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '大子清流', department: '農林科学', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '大子清流', department: '総合学科', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない。単位制' },
    { schoolName: '小瀬', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '常陸大宮', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '常陸大宮', department: '機械・情報技術', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '常陸大宮', department: '商業', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '水戸第一', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '水戸第二', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '水戸第三', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸第三', department: '家政', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '水戸第三', department: '音楽', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '緑岡', department: '普通・理数', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '普通科と理数科はくくり募集。特色選抜は実施しない' },
    { schoolName: '水戸農業', department: '農業', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施(全日制課程)' },
    { schoolName: '水戸農業', department: '園芸', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸農業', department: '畜産', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸農業', department: '食品化学', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸農業', department: '農業土木', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸農業', department: '生活科学', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸農業', department: '農業経済', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸工業', department: '機械', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸工業', department: '電気', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸工業', department: '情報技術', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸工業', department: '建築', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸工業', department: '土木', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸工業', department: '工業化学', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸商業', department: '商業', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸商業', department: '情報ビジネス', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸商業', department: '国際ビジネス', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸桜ノ牧', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '水戸桜ノ牧常北校', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '勝田工業', department: '総合工学', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施。単位制' },
    { schoolName: '佐和', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '那珂湊', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '那珂湊', department: '商業に関する学科', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '起業ビジネス科・情報ビジネス科はくくり募集。特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '海洋', department: '海洋技術', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない。水産に関する学科はくくり募集' },
    { schoolName: '海洋', department: '海洋食品', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '海洋', department: '海洋産業', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '笠間', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '笠間', department: '美術', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '笠間', department: 'メディア芸術', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '大洗', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '大洗', department: '普通(音楽コース)', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接・実技検査を実施。同一校の普通科を第2志望として志願可能' },
    { schoolName: '東海', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '茨城東', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '30:70', note: '特色選抜は学力検査・調査書・面接を実施。調査書重視の比率が学力検査を上回る珍しい配分。単位制' },
    { schoolName: '那珂', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '鉾田第一', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施。単位制' },
    { schoolName: '鉾田第二', department: '総合学科', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施。単位制' },
    { schoolName: '鉾田第二', department: '農業', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施。農業に関する学科はくくり募集' },
    { schoolName: '鉾田第二', department: '食品技術', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '玉造工業', department: '工業に関する学科', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '麻生', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '潮来', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '潮来', department: '地域ビジネス', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '潮来', department: '人間科学', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '鹿島', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施。単位制' },
    { schoolName: '神栖', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '60:40', note: '特色選抜は実施しない' },
    { schoolName: '波崎', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '波崎', department: '機械', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '波崎', department: '電気', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '波崎', department: '工業化学・情報', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '波崎柳川', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '70:30', note: '特色選抜は実施しない' },
    { schoolName: '土浦第一', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない。単位制' },
    { schoolName: '土浦第二', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '80:20', note: '特色選抜は実施しない' },
    { schoolName: '土浦第三', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '土浦第三', department: '商業に関する学科', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '商業科・会計ビジネス科・情報処理科はくくり募集。特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '土浦工業', department: '機械', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '土浦工業', department: '電気', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '土浦工業', department: '情報技術', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '土浦工業', department: '建築', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '土浦工業', department: '土木', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '土浦湖北', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '石岡第一', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '石岡第一', department: '園芸', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施。農業に関する学科はくくり募集' },
    { schoolName: '石岡第一', department: '造園', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '石岡第二', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '石岡第二', department: '生活デザイン', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '石岡商業', department: '商業', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '石岡商業', department: '情報処理', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '中央', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '中央', department: '普通(スポーツ科学コース)', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接・実技検査を実施。同一校の普通科を第2志望として志願可能' },
    { schoolName: '竜ヶ崎第一', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '80:20', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '竜ヶ崎第二', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '竜ヶ崎第二', department: '商業', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '竜ヶ崎第二', department: '人間文化', selectionCategory: '一般', interviewRequired: true, ratioType: '70:30', note: '特色選抜は学力検査・調査書・面接を実施' },
    { schoolName: '竜ヶ崎南', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: '50:50', note: '特色選抜は実施しない' },
    { schoolName: '江戸崎総合', department: '総合学科', selectionCategory: '一般', interviewRequired: true, ratioType: '50:50', note: '特色選抜は学力検査・調査書・面接を実施。単位制' },
  ],
  source: {
    url: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2025/10/saisoku.pdf',
    docTitle: '令和8年度茨城県立高等学校（全日制・定時制）入学者選抜実施細則 別表1「高等学校別入学者選抜実施方法」',
    lastChecked: '2026-09-17',
  },
};
