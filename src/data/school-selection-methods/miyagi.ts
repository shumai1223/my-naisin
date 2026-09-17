// 宮城県: 「令和9年度宮城県公立高等学校入学者選抜 選抜方法等一覧」(令和8年5月・宮城県教育委員会/
// 仙台市教育委員会/石巻市教育委員会)。学校・学科(コース・部)ごとに1頁の表形式で、選抜順序
// (共通選抜→特色選抜)・各選抜の募集人数(募集定員に対する%)・学力検査:調査書の比重(共通選抜)
// または配点内訳(特色選抜・第二次募集)・面接等の実施有無が掲載されている。
//
// 一次ソース: 宮城県公式ページ(`pref.miyagi.jp/site/sub-jigyou/kyo-r9-senbatsuhouhoutou.html`)
// からリンクされる一括ダウンロードPDF
// (`pref.miyagi.jp/documents/65121/r9_senbatsuhouhoutou.pdf`・全316頁・2026-09-17
// curl+pdftoppm(150dpi)でビジョン確認。pdftotextはToUnicode CMap欠落で文字化けする既知パターン)。
//
// ★選抜方法データの頁と学校の「スクール・ミッション/ポリシー」頁が交互に配置されている
// (奇数頁=選抜方法データ、偶数頁=ポリシー頁で本DBの対象外)。全316頁のうち頁13〜25の3校分
// (白石・白石蔵王キャンパス・白石工業の全5学科)のみ収録し、残りは今後の拡充対象(coverageNote参照)。
//
// ratioTypeの運用:
//  - 共通選抜: 学力検査:調査書の比重をそのまま転記(例'学力検査6:調査書4')
//  - 特色選抜・第二次募集: 配点内訳(調査書○点:学力検査○点:面接○点)をコロン区切りで転記
//    (面接が段階評価のみで配点が明示されない場合は「面接(3段階評価A〜C)」等と記述)
// selectionCategoryは「共通選抜」「特色選抜」「第二次募集」の3区分。社会人特別選抜は
// 収録3校とも「無」だったため記録対象なし(該当時は別途selectionCategoryを追加する)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const MIYAGI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'miyagi',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    '全316頁(1校1頁・偶数頁は選抜方法データではなくスクール・ミッション/ポリシー頁で対象外)のうち、頁13(白石・看護科)・15(白石蔵王キャンパス・普通科)・17〜25(白石工業・機械科/電気科/工業化学科/建築科/設備工業科の全5学科)の3校21レコードのみ収録。社会人特別選抜は収録3校とも「無」',
  source: {
    url: 'https://www.pref.miyagi.jp/documents/65121/r9_senbatsuhouhoutou.pdf',
    docTitle: '令和9年度宮城県公立高等学校入学者選抜 選抜方法等一覧',
    lastChecked: '2026-09-17',
  },
  schools: [
    {
      schoolName: '白石',
      department: '看護科',
      selectionCategory: '共通選抜',
      interviewRequired: false,
      ratioType: '学力検査7:調査書3',
      note: '募集人数28人(募集定員40人の70%)。学力検査点(500点満点)と調査書点(195点満点)の満点を原点とした相関図を用いて選抜',
    },
    {
      schoolName: '白石',
      department: '看護科',
      selectionCategory: '特色選抜',
      interviewRequired: true,
      ratioType: '調査書270点:学力検査500点:面接(3段階評価A〜C)',
      note: '募集人数12人(30%)・合計770点。審査対象は学力検査点+調査書点の合計上位120%(14人)。面接は集団面接15分程度(志望動機・看護師について等)',
    },
    {
      schoolName: '白石',
      department: '看護科',
      selectionCategory: '第二次募集',
      interviewRequired: true,
      ratioType: '調査書225点:学力検査300点:面接(3段階評価A〜C)',
      note: '合計525点。面接は個人面接10分程度(志望動機等)',
    },
    {
      schoolName: '白石蔵王キャンパス',
      department: '普通科',
      selectionCategory: '共通選抜',
      interviewRequired: false,
      ratioType: '学力検査4:調査書6',
      note: '募集人数20人(募集定員40人の50%)。第2志望とすることができる学科・コースはなし',
    },
    {
      schoolName: '白石蔵王キャンパス',
      department: '普通科',
      selectionCategory: '特色選抜',
      interviewRequired: true,
      ratioType: '調査書270点:学力検査500点:面接100点',
      note: '募集人数20人(50%)・合計870点。審査対象は学力検査点+調査書点+面接得点の合計上位120%(24人)。面接は個人面接10分程度・観点は態度10点/表現力等90点',
    },
    {
      schoolName: '白石蔵王キャンパス',
      department: '普通科',
      selectionCategory: '第二次募集',
      interviewRequired: true,
      ratioType: '調査書195点:学力検査300点:面接100点',
      note: '合計595点。面接内容・観点は第一次募集(特色選抜)と同じ',
    },
    {
      schoolName: '白石工業',
      department: '機械科',
      selectionCategory: '共通選抜',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4',
      note: '募集人数48人(募集定員80人の60%)。第2志望は電気科・工業化学科・建築科・設備工業科',
    },
    {
      schoolName: '白石工業',
      department: '機械科',
      selectionCategory: '特色選抜',
      interviewRequired: false,
      ratioType: '調査書390点:学力検査500点',
      note: '募集人数32人(40%)・合計890点。面接・実技・作文はいずれも実施しない(白石工業高校の全5学科共通パターン。他2校は面接あり)。審査対象は合計上位150%(48人)',
    },
    {
      schoolName: '白石工業',
      department: '機械科',
      selectionCategory: '第二次募集',
      interviewRequired: true,
      ratioType: '調査書135点:学力検査300点:面接(4段階評価A〜D)',
      note: '合計435点。面接は個人面接10分程度(志望動機等)。評価が4段階(A〜D)である点が他校(3段階A〜C)と異なる',
    },
    {
      schoolName: '白石工業',
      department: '電気科',
      selectionCategory: '共通選抜',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4',
      note: '募集定員40人・募集人数24人(60%)。機械科(募集定員80人)より定員が小さいが共通選抜/特色選抜の比重・配点は同一',
    },
    {
      schoolName: '白石工業',
      department: '電気科',
      selectionCategory: '特色選抜',
      interviewRequired: false,
      ratioType: '調査書390点:学力検査500点',
      note: '募集人数16人(40%)・合計890点。面接・実技・作文なし。審査対象は合計上位150%(24人)',
    },
    {
      schoolName: '白石工業',
      department: '電気科',
      selectionCategory: '第二次募集',
      interviewRequired: true,
      ratioType: '調査書135点:学力検査300点:面接(4段階評価A〜D)',
      note: '合計435点。面接は個人面接10分程度(志望動機等)',
    },
    {
      schoolName: '白石工業',
      department: '工業化学科',
      selectionCategory: '共通選抜',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4',
      note: '募集定員40人・募集人数24人(60%)',
    },
    {
      schoolName: '白石工業',
      department: '工業化学科',
      selectionCategory: '特色選抜',
      interviewRequired: false,
      ratioType: '調査書390点:学力検査500点',
      note: '募集人数16人(40%)・合計890点。面接・実技・作文なし。審査対象は合計上位150%(24人)',
    },
    {
      schoolName: '白石工業',
      department: '工業化学科',
      selectionCategory: '第二次募集',
      interviewRequired: true,
      ratioType: '調査書135点:学力検査300点:面接(4段階評価A〜D)',
      note: '合計435点。面接は個人面接10分程度(志望動機等)',
    },
    {
      schoolName: '白石工業',
      department: '建築科',
      selectionCategory: '共通選抜',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4',
      note: '募集定員40人・募集人数24人(60%)',
    },
    {
      schoolName: '白石工業',
      department: '建築科',
      selectionCategory: '特色選抜',
      interviewRequired: false,
      ratioType: '調査書390点:学力検査500点',
      note: '募集人数16人(40%)・合計890点。面接・実技・作文なし。審査対象は合計上位150%(24人)',
    },
    {
      schoolName: '白石工業',
      department: '建築科',
      selectionCategory: '第二次募集',
      interviewRequired: true,
      ratioType: '調査書135点:学力検査300点:面接(4段階評価A〜D)',
      note: '合計435点。面接は個人面接10分程度(志望動機等)',
    },
    {
      schoolName: '白石工業',
      department: '設備工業科',
      selectionCategory: '共通選抜',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4',
      note: '募集定員40人・募集人数24人(60%)',
    },
    {
      schoolName: '白石工業',
      department: '設備工業科',
      selectionCategory: '特色選抜',
      interviewRequired: false,
      ratioType: '調査書390点:学力検査500点',
      note: '募集人数16人(40%)・合計890点。面接・実技・作文なし。審査対象は合計上位150%(24人)',
    },
    {
      schoolName: '白石工業',
      department: '設備工業科',
      selectionCategory: '第二次募集',
      interviewRequired: true,
      ratioType: '調査書135点:学力検査300点:面接(4段階評価A〜D)',
      note: '合計435点。面接は個人面接10分程度(志望動機等)',
    },
  ],
};
