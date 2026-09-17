// 岡山県: 令和8年度岡山県立高等学校入学者選抜における「学校別実施内容一覧」(別表1)の
// 学校・学科別評価方法(頁1のみ・全7頁中1頁目)。
//
// 一次ソース: 岡山県教育委員会「令和8年度岡山県立高等学校入学者選抜における学校別実施内容一覧」PDF
// (`https://www.pref.okayama.jp/uploaded/life/1054600_10219031_misc.pdf`・全7頁・
// 2026-09-18 curl+pdftoppm(150dpi)で目視確認)。ページ一覧はWebFetch経由で
// `https://www.pref.okayama.jp/site/16/913706.html`から特定した(令和7/8/9年度の3年度分が
// 別ファイルで公開されている多年度追跡可能な定型資料)。
//
// 表の構成(他県と異なる岡山県固有の型): 「特別入学者選抜」(募集人員%・検査概要・面接・
// 重視する実績を示した選抜[募集人員/重視する実績])と「一般入学者選抜」(くくり募集・傾斜配点・
// 面接・調査書及び面接等の結果を重視した選抜[比率%/重視する事項])の2ブロックが学校・学科ごとに
// 横並びで記載される。selectionCategoryは'特別入学者選抜'/'一般入学者選抜'の2区分として転記し、
// どちらかの列が全て「-」(未実施)の学校・学科はそのレコードを作らない。
// ratioTypeには「調査書及び面接等の結果を重視した選抜」欄の比率(%)を'調査書及び面接等XX%'の
// 形で転記する(他県のI〜V型倍率とは表記の性質が異なる点に注意)。
// 表冒頭の「割合(%)」欄(学区外からの受入枠の割合)は学区制度(T-Y15)の領域であり、本DB
// (T-Y14・評価方法)の対象外のため転記しない。
//
// ⚠️頁1のうち岡山一宮・岡山城東・西大寺の3校は「くくり募集」(◎/第1・第2志望の組合せ募集)や
// 学科をまたぐ結合セルが多く、目視だけでは行の対応関係を確定できなかったため今回は未収録
// (次回セッションが高解像度で再確認すること)。頁2〜7(西大寺の一部以降)も未収録。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const OKAYAMA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'okayama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '全7頁のうち頁1の一部(岡山朝日/岡山操山/岡山芳泉/瀬戸/高松農業の5校)のみ収録。岡山一宮・岡山城東・西大寺は結合セル(くくり募集の◎等)の対応関係が目視で確定できず未収録。頁2〜7は未着手',
  schools: [
    {
      schoolName: '岡山朝日',
      department: '普通',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:生徒会活動、ボランティア活動、芸術・体育・科学・文化等の分野における活動成果及び興味・関心の状況。特別入学者選抜の実施なし(該当欄は全て「-」)。面接は集団(表記「集」)',
    },
    {
      schoolName: '岡山操山',
      department: '普通',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等5%',
      note: '重視する事項:部活動、学級活動、生徒会活動、スポーツ・芸術・文化・科学の分野における実績。特別入学者選抜の実施なし。面接は集団',
    },
    {
      schoolName: '岡山芳泉',
      department: '普通',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:科学・文化・スポーツにおける活動および生徒会活動の実績、海外体験など国際的な活動の実績。特別入学者選抜の実施なし。面接は集団',
    },
    {
      schoolName: '瀬戸',
      department: '普通',
      selectionCategory: '特別入学者選抜',
      interviewRequired: true,
      note: '検査概要:作文(与えられた課題について600字程度で作文する)。募集人員8人程度。重視する実績:ホッケー。面接は集団',
    },
    {
      schoolName: '瀬戸',
      department: '普通',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:生徒会活動、部活動、スポーツ・芸術・文化・科学の分野における活動、地域貢献活動の実績。面接は集団',
    },
    {
      schoolName: '高松農業',
      department: '農業科学',
      selectionCategory: '特別入学者選抜',
      interviewRequired: true,
      note: '検査概要:口頭試問(与えられた課題について、質問に答えたり自分の考えを述べたりする)。この行には募集人員・重視する実績の数値記載なし(表内では畜産科学の行にのみ「10人程度」「レスリング(男子・女子)又は陸上競技(男子・女子)」の記載があり、5学科の結合セルで畜産科学のみに適用される可能性と5学科共通の可能性の両方があり要再確認)。面接は集団',
    },
    {
      schoolName: '高松農業',
      department: '農業科学',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:生徒会活動、部活動、校外におけるスポーツ・文化活動の実績。面接は個別',
    },
    {
      schoolName: '高松農業',
      department: '園芸科学',
      selectionCategory: '特別入学者選抜',
      interviewRequired: true,
      note: '検査概要:口頭試問(与えられた課題について、質問に答えたり自分の考えを述べたりする)。募集人員・重視する実績の数値はこの行に記載なし(高松農業の欄注記を参照)。面接は集団',
    },
    {
      schoolName: '高松農業',
      department: '園芸科学',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:生徒会活動、部活動、校外における文化活動の実績。面接は個別',
    },
    {
      schoolName: '高松農業',
      department: '畜産科学',
      selectionCategory: '特別入学者選抜',
      interviewRequired: true,
      note: '検査概要:口頭試問(与えられた課題について、質問に答えたり自分の考えを述べたりする)。募集人員10人程度。重視する実績:レスリング(男子・女子)又は陸上競技(男子・女子)。面接は集団',
    },
    {
      schoolName: '高松農業',
      department: '畜産科学',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:生徒会活動、部活動、校外におけるスポーツ・文化活動の実績。面接は個別',
    },
    {
      schoolName: '高松農業',
      department: '農業土木',
      selectionCategory: '特別入学者選抜',
      interviewRequired: true,
      note: '検査概要:口頭試問(与えられた課題について、質問に答えたり自分の考えを述べたりする)。募集人員・重視する実績の数値はこの行に記載なし(高松農業の欄注記を参照)。面接は集団',
    },
    {
      schoolName: '高松農業',
      department: '農業土木',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:生徒会活動、部活動、校外におけるスポーツ・文化活動の実績。面接は個別',
    },
    {
      schoolName: '高松農業',
      department: '食品科学',
      selectionCategory: '特別入学者選抜',
      interviewRequired: true,
      note: '検査概要:口頭試問(与えられた課題について、質問に答えたり自分の考えを述べたりする)。募集人員・重視する実績の数値はこの行に記載なし(高松農業の欄注記を参照)。面接は集団',
    },
    {
      schoolName: '高松農業',
      department: '食品科学',
      selectionCategory: '一般入学者選抜',
      interviewRequired: true,
      ratioType: '調査書及び面接等10%',
      note: '重視する事項:生徒会活動、部活動、校外におけるスポーツ・文化活動の実績。面接は個別',
    },
  ],
  source: {
    url: 'https://www.pref.okayama.jp/uploaded/life/1054600_10219031_misc.pdf',
    docTitle: '令和8年度岡山県立高等学校入学者選抜における学校別実施内容一覧(別表1)',
    lastChecked: '2026-09-18',
  },
  note: '全7頁のうち頁1の一部(5校・15レコード)のみ収録。「割合(%)」欄(学区外受入枠)はT-Y15(学区DB)の領域のため本DBでは転記しない。岡山一宮・岡山城東・西大寺は「くくり募集」の結合セルの対応関係が確定できず未収録。ratioTypeは「調査書及び面接等の結果を重視した選抜」欄の比率をそのまま転記(他県のI〜V型倍率とは異なる表記)',
};
