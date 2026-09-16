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
// ⚠️収録範囲: 全5頁のうち3頁目（別紙・一般選抜）の左列・右列（旭丘～豊田東・106レコード、
// 複数学科を持つ学校は学科ごとに別レコード）を完全収録。4〜5頁目（推薦選抜等の別表があれば）は未収録。「令和9年度から校内順位の決定方式を
// 変更する学校・学科」の情報（2頁目）から、春日井工科・一宮工科・稲沢緑風館(普通/農業)・常滑・
// 豊田南・三谷水産の7件は令和8年度と令和9年度で方式が異なることが判明しており、3頁目に
// 掲載されている該当校（春日井工科・一宮工科・稲沢緑風館・常滑）は変更前の値もnoteに記録した
// （豊田南・三谷水産は3頁目に掲載が無いため未収録）。fiscalYearは令和9年度（本資料の時点）を
// 基準とする。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const AICHI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'aichi',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    '全5頁中3頁目（旭丘〜豊田東・106レコード）を完全収録。校内順位の決定方式はI〜Vの計算式定義参照(docTitle横のコメント)。4〜5頁目は未収録',
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
    { schoolName: '小牧南', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '小牧工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '岩倉総合', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '新川', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '西春', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '丹羽', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '一宮', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '一宮', department: 'ファッション創造', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '一宮西', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '一宮北', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '一宮南', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '一宮興道', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '木曽川', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '木曽川', department: '総合ビジネス', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '一宮工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV', note: '令和8年度はI(令和9年度からIVへ変更)' },
    { schoolName: '一宮起工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '一宮商業', department: '商業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '津島', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '津島', department: '国際探究', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '津島東', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '津島北翔', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '津島北翔', department: '商業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '津島北翔', department: '福祉', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '稲沢緑風館', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV', note: '令和8年度はIII(令和9年度からIVへ変更)' },
    { schoolName: '稲沢緑風館', department: '農業', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV', note: '令和8年度はI(令和9年度からIVへ変更)' },
    { schoolName: '杏和', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '佐屋', department: '農業', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '佐屋', department: '家庭', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '愛西工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '美和', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III', note: '地域探究科を含む' },
    { schoolName: '五条', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '半田', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '半田東', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '半田工科', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '半田農業', department: '農業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '半田商業', department: '商業', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '常滑', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I', note: '令和8年度はIII(令和9年度からIへ変更)' },
    { schoolName: '常滑', department: '工業', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '横須賀', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '東海南', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '東海樟風', department: '総合情報', selectionCategory: '一般', interviewRequired: false, ratioType: 'IV' },
    { schoolName: '大府', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'III' },
    { schoolName: '大府', department: '生活文化', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '大府東', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '桃陵', department: 'ヒューマンケア', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '桃陵', department: '衛生看護', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '知多翔洋', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '阿久比', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '東浦', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '内海', department: '普通', selectionCategory: '一般', interviewRequired: true, ratioType: 'I' },
    { schoolName: '武豊', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
    { schoolName: '豊田西', department: '普通', selectionCategory: '一般', interviewRequired: false, ratioType: 'V' },
    { schoolName: '豊田東', department: '総合', selectionCategory: '一般', interviewRequired: false, ratioType: 'I' },
  ],
  source: {
    url: 'https://www.pref.aichi.jp/uploaded/attachment/623173.pdf',
    docTitle:
      '令和9年度愛知県公立高等学校入学者選抜（全日制課程）一般選抜における各高等学校の面接実施の有無及び校内順位の決定方式について',
    lastChecked: '2026-09-17',
  },
};
