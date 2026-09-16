// 愛知県: 令和9年度愛知県公立高等学校入学者選抜（全日制課程）一般選抜における学校・学科別
// 「面接実施の有無」及び「校内順位の決定方式」。
//
// 一次ソース: 愛知県教育委員会「令和9年度愛知県公立高等学校入学者選抜（全日制課程）一般選抜に
// おける各高等学校の面接実施の有無及び校内順位の決定方式について」PDF
// （`pref.aichi.jp/uploaded/attachment/623173.pdf`・2026-09-17 curl+pdftoppmで目視確認）。
//
// 校内順位の決定方式（ratioType）はI〜Vの5区分で、大阪府とは異なる愛知県独自の計算式:
//   I   評定得点 + 学力検査合計得点（等倍）
//   II  評定得点×1.5 + 学力検査合計得点（内申やや重視）
//   III 評定得点 + 学力検査合計得点×1.5（学力やや重視）
//   IV  評定得点×2 + 学力検査合計得点（内申重視）
//   V   評定得点 + 学力検査合計得点×2（学力重視）
// 評定得点=調査書「学習の記録」の評定合計×2（満点90点）、学力検査合計得点=国数社理英5教科
// の得点合計（満点110点）。
//
// ⚠️収録範囲: 全5頁のうち3頁目（別紙・一般選抜）の左列に掲載された学校の一部（旭丘～小牧、
// 約30校）のみ収録。右列（小牧南～豊田東）・4〜5頁目（推薦選抜等の別表があれば）は未収録。
// 「令和9年度から校内順位の決定方式を変更する学校・学科」の情報（2頁目）から、春日井工科・
// 一宮工科・稲沢緑風館・常滑・豊田南・三谷水産の6校は令和8年度と令和9年度で方式が異なる
// ことが判明しているため、fiscalYearは令和9年度（本資料の時点）を基準とする。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const AICHI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'aichi',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    '全5頁中3頁目左列（旭丘〜小牧・約30校）のみ収録。校内順位の決定方式はI〜Vの計算式定義参照(docTitle横のコメント)。右列・他頁は未収録',
  schools: [
    { schoolName: '旭丘', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '旭丘', department: '美術', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '明和', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '明和', department: '音楽', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '千種', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '千種', department: '国際教養', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '守山', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: 'I' },
    { schoolName: '緑丘', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '愛知総合工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '愛知商業', department: '商業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '瑞陵', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '瑞陵', department: '食物', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '瑞陵', department: '理数', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    {
      schoolName: '惟信',
      department: '普通',
      selectionCategory: '一般',
      interviewRequired: false,
      ratioType: 'III',
      note: '未来探究科を含む',
    },
    { schoolName: '松蔭', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '昭和', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '名古屋西', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '熱田', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '中村', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '南陽', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '鳴海', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '天白', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '名古屋南', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '名古屋工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '中川青和', department: 'キャリアビジネス', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '瀬戸', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '瀬戸西', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '瀬戸北総合', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '瀬戸工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '春日井', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '春日井西', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '春日井東', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '高蔵寺', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '春日井南', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    {
      schoolName: '春日井工科',
      department: '工業',
      selectionCategory: '一般',
      interviewRequired: true,
      ratioType: 'IV',
      note: '令和8年度はI(令和9年度からIVへ変更)',
    },
    { schoolName: '春日井泉', department: '商業', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '春日井泉', department: '生活文化', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '旭野', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '豊明', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '日進', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: 'II' },
    { schoolName: '日進西', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '長久手', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '東郷', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '犬山', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '犬山', department: '総合ビジネス', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '犬山総合', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '尾北', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '尾北', department: '国際教養', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '江南', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '古知野', department: '商業', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '古知野', department: '生活文化', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '古知野', department: '福祉', selectionCategory: '一般', interviewRequired: false, ratioType: 'II' },
    { schoolName: '小牧', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
  ],
  source: {
    url: 'https://www.pref.aichi.jp/uploaded/attachment/623173.pdf',
    docTitle:
      '令和9年度愛知県公立高等学校入学者選抜（全日制課程）一般選抜における各高等学校の面接実施の有無及び校内順位の決定方式について',
    lastChecked: '2026-09-17',
  },
};
