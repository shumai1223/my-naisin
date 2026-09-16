// 大阪府: 令和8年度大阪府公立高等学校等入学者選抜における学校別「学力検査問題の種類」
// 「学力検査の成績及び調査書の評定にかける倍率のタイプ」。
//
// 一次ソース: 大阪府教育委員会「令和8年度 大阪府公立高等学校等アドミッションポリシー
// （求める生徒像）並びに学力検査問題の種類並びに学力検査の成績及び調査書の評定にかける
// 倍率のタイプ【課程等別、学科別】」PDF（`pref.osaka.lg.jp/documents/106331/...`・
// 2026-09-17 curl+pdftoppmで目視確認）。
//
// 学力検査問題は国語・数学・英語それぞれA（基礎的問題）／B（標準的問題）から所管教育委員会が
// 選択。倍率のタイプは表2（全日制課程）のI〜Vの5区分（IはI=1.4倍学検/0.6倍調査書〜V=0.6倍
// 学検/1.4倍調査書。詳細はPDF3頁）。
//
// ⚠️収録範囲: 全66頁のうち1〜5頁目（全日制課程・普通教育を主とする学科（普通科）の一部19校）
// のみ。掲載されている選抜区分のうち「一般」のみ転記し、「日本語指導を要する生徒に対する特別
// 入学者選抜」等は未収録（倍率のタイプが適用されない別枠のため）。残りの学科・学校は次回以降に
// 順次追加する。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const OSAKA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'osaka',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '全66頁中1〜5頁目（全日制課程・普通科の一部19校）のみ収録。選抜区分は「一般」のみ転記（日本語指導特別選抜等は未収録）',
  schools: [
    {
      schoolName: '東淀川',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'II',
    },
    {
      schoolName: '旭',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'II',
    },
    {
      schoolName: '桜宮',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'III',
      note: '「知的障がい生徒自立支援コース」「人間スポーツ科学科」を併設',
    },
    {
      schoolName: '東',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
      note: '英語科・理数科志望者向けのアドミッションポリシーも同一選抜区分内に記載',
    },
    {
      schoolName: '汎愛',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'III',
      note: '体育科を併設（体育科志望者向けアドミッションポリシーも同一選抜区分内に記載）',
    },
    {
      schoolName: '清水谷',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'C', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
    },
    {
      schoolName: '夕陽丘',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'C', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
      note: '音楽科志望者向けアドミッションポリシーも同一選抜区分内に記載',
    },
    {
      schoolName: '港',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'III',
    },
    {
      schoolName: '阿倍野',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
    },
    {
      schoolName: '東住吉',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
      note: '芸能文化科を併設（芸能文化科志望者向けアドミッションポリシーも同一選抜区分内に記載）',
    },
    {
      schoolName: '阪南',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
    },
    {
      schoolName: '池田',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'C', suugaku: 'C', eigo: 'C' },
      ratioType: 'I',
    },
    {
      schoolName: '渋谷',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'II',
    },
    {
      schoolName: '桜塚',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
    },
    {
      schoolName: '豊島',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'II',
    },
    {
      schoolName: '刀根山',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
    },
    {
      schoolName: '箕面',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'I',
    },
    {
      schoolName: '茨木西',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'II',
    },
    {
      schoolName: '北摂つばさ',
      department: '普通科',
      selectionCategory: '一般',
      examSubjectTypes: { kokugo: 'B', suugaku: 'B', eigo: 'B' },
      ratioType: 'II',
    },
  ],
  source: {
    url: 'https://www.pref.osaka.lg.jp/documents/106331/r08_admission_koukou.pdf',
    docTitle:
      '令和8年度 大阪府公立高等学校等アドミッションポリシー（求める生徒像）並びに学力検査問題の種類並びに学力検査の成績及び調査書の評定にかける倍率のタイプ【課程等別、学科別】',
    lastChecked: '2026-09-17',
  },
};
