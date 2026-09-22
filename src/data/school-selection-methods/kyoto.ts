// 京都府: 令和9年度京都府公立高等学校入学者選抜「前期選抜独自枠等募集要項」(前半・79頁)。
// 令和9年度から前期選抜のみに一本化され、学校ごとに「独自枠」(学校・学科の特色に応じた
// 検査)を設定できる制度になった(共通枠は別文書)。頁14-18「前期選抜独自枠の検査項目と
// 配点」が県内全校を1つの表にまとめた一覧表だが、「学校名」列が32行にまたがる結合
// セルのため、単純な中点分割では隣接校の行を取り違えるリスクがあった(詳細は
// `ops/baselines/t-y14-selection-method-survey-2026-09.md`のkyoto行)。
//
// 本ファイルは「京都市・乙訓」学区の13校について、①一覧表(find_tables()でセルbbox検出
// →page.get_text(clip=bbox)で再抽出)と②個別学校ページ(頁21〜51・1選抜型=1頁・各頁に
// 学校名が明記される曖昧性のない情報源)を独立に突合し、両者が完全一致することを確認した
// 学校のみを収録する(嵯峨野の「京都こすもす科」は個別ページで自然科学系統80人+文理科学
// 系統240人の内訳と選抜方法が直接確認できた)。他学区(城陽・京都市中心部の残り等)は
// 後半PDF・未突合分を含み今回は未収録。
//
// selectionCategoryは資料の「選抜方式・型」表記(A1/A2/B/C等)をそのまま使用。noteの
// 「独自枠募集人員」は当該型で独自枠から選抜される人数(学科全体の募集定員とは別の数値)。
// 配点の詳細な算出式(判定Ⅰ〜Ⅲ等の複雑な多段階選抜を持つ学校がある)までは転記せず、
// 学校・学科・選抜型・人数構造の転記にとどめる(ratioTypeは設定しない)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const KYOTO_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'kyoto',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    '「京都市・乙訓」学区の13校(全31レコード=学校×学科×選抜型)のみ収録。一覧表(頁14-18)と個別学校ページ(頁21-51)の両方で行の帰属を突合できた学校に限定(結合セルの帰属が一意に確定できない他学区は今回見送り)。清明高校は単位制による定時制(昼間二部)課程のため本表の対象外(定時制は別掲)',
  source: {
    url: 'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2026/09/前期選抜独自枠等募集要項（1前半）.pdf',
    docTitle: '京都府教育委員会「令和9年度京都府公立高等学校入学者選抜 前期選抜独自枠等募集要項」頁14-18・頁21-51',
    lastChecked: '2026-09-23',
  },
  note:
    '「独自枠募集人員」は学科全体の募集定員(quota)のうち独自枠選抜に配分される人数。選抜型(A1/A2/B/C等)は同一学科内の複数日程・複数方式を示す資料の表記をそのまま転記。令和9年度から前期・中期選抜が「早期選抜」(独自枠/共通枠)に一本化された制度改定の影響を受けている',
  schools: [
    {
      schoolName: '京都府立山城高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員320人。独自枠募集人員112人',
    },
    {
      schoolName: '京都府立山城高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員320人。独自枠募集人員48人',
    },
    {
      schoolName: '京都府立山城高等学校',
      department: '文理総合科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員40人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鴨沂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員240人。独自枠募集人員96人',
    },
    {
      schoolName: '京都府立鴨沂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員240人。独自枠募集人員24人',
    },
    {
      schoolName: '京都府立洛北高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員160人。独自枠募集人員56人',
    },
    {
      schoolName: '京都府立洛北高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員160人。独自枠募集人員24人',
    },
    {
      schoolName: '京都府立洛北高等学校',
      department: '普通科（単位制）＜スポーツ総合専攻＞',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '学科募集定員40人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立北稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。独自枠募集人員100人',
    },
    {
      schoolName: '京都府立北稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員240人。独自枠募集人員20人',
    },
    {
      schoolName: '京都府立朱雀高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員200人。独自枠募集人員75人',
    },
    {
      schoolName: '京都府立朱雀高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員200人。独自枠募集人員25人',
    },
    {
      schoolName: '京都府立洛東高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。独自枠募集人員84人',
    },
    {
      schoolName: '京都府立洛東高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員240人。独自枠募集人員36人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員160人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員160人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: '普通科（単位制）＜スポーツ総合専攻＞',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '学科募集定員40人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: 'グローバル科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員80人。独自枠募集人員80人',
    },
    {
      schoolName: '京都府立嵯峨野高等学校',
      department: '京都こすもす科（自然科学系統）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員80人。判定Ⅰで自然科学系統80名を第1希望者から決定',
    },
    {
      schoolName: '京都府立嵯峨野高等学校',
      department: '京都こすもす科（文理科学系統）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。判定Ⅱ・判定Ⅲの2段階(各120名)で決定・共通枠の募集なし',
    },
    {
      schoolName: '京都府立北嵯峨高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員280人。独自枠募集人員92人',
    },
    {
      schoolName: '京都府立北嵯峨高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員280人。独自枠募集人員48人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員280人。独自枠募集人員84人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員280人。独自枠募集人員56人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '植物クリエイト科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員40人。独自枠募集人員20人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '園芸ビジネス科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員40人。独自枠募集人員20人',
    },
    {
      schoolName: '京都府立洛西高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。独自枠募集人員120人',
    },
    {
      schoolName: '京都府立桃山高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員280人',
    },
    {
      schoolName: '京都府立桃山高等学校',
      department: '自然科学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員80人',
    },
    {
      schoolName: '京都府立東稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員200人。独自枠募集人員73人',
    },
    {
      schoolName: '京都府立東稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員200人。独自枠募集人員27人',
    },
  ],
};
