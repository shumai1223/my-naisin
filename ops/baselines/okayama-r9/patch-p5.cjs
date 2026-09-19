// 岡山 R9 頁5のパッチ(R8 okayama.ts → R9)。1置換ごとに『ちょうど1件一致』を検証する。
const fs = require('fs');
const f = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/okayama.ts';
let s = fs.readFileSync(f, 'utf8');
const eol = s.includes('\r\n') ? '\r\n' : '\n';
const rep = (from, to, expect = 1) => {
  const n = s.split(from).length - 1;
  if (n !== expect) throw new Error(`一致数 ${n} != ${expect}: ${from.slice(0, 60)}`);
  s = s.split(from).join(to);
};
// 1) 津山工業 工業化学: 検査概要の文言
rep("検査概要:実技。与えられた課題について、条件に従って、作業を行う。募集人員70%", "検査概要:実技。与えられた課題について、条件に従って、作業や作図・スケッチなどを行う。募集人員70%");
// 2) 津山商業(2学科共通): 重視する実績からソフトボール(女子)を削除
rep("重視する実績:野球(男子)、ソフトボール(女子)、陸上競技、バスケットボール、空手道又は珠算(2学科で共通)", "重視する実績:野球(男子)、陸上競技、バスケットボール、空手道又は珠算(2学科で共通)", 2);
// 3) 井原 普通 一般: 重視する事項の文言(『部活動を含む校内外に』→『部活動、校外に』)
rep("重視する事項:生徒会活動、部活動を含む校内外におけるスポーツ・芸術・文化・科学・ボランティアの分野における活動の実績。面接は集団", "重視する事項:生徒会活動、部活動、校外におけるスポーツ・芸術・文化・科学・ボランティアの分野における活動の実績。面接は集団");
// 4) 玉野 普通: 特別入学者選抜を新設(R8は全欄『ー』で一般のみ)+一般のnote
const tamaOld = [
  "      schoolName: '玉野',",
  "      department: '普通',",
  "      selectionCategory: '一般入学者選抜',",
].join(eol);
const tamaNew = [
  "      schoolName: '玉野',",
  "      department: '普通',",
  "      selectionCategory: '特別入学者選抜',",
  "      interviewRequired: true,",
  "      note: '【頁5】検査概要:口頭試問。与えられた文章や資料について、質問に答えたり、自分の考えをまとめて表現したりする。募集人員50%。重視する実績を示した選抜の募集人員は10人程度。重視する実績:英語検定準2級以上合格、野球(男子)又はサッカー(男子)。面接は集団',",
  "    },",
  "    {",
  "      schoolName: '玉野',",
  "      department: '普通',",
  "      selectionCategory: '一般入学者選抜',",
].join(eol);
rep(tamaOld, tamaNew);
rep("【頁5】ページ上の特別入学者選抜の欄は全て「ー」のため特別入学者選抜のレコードは作らず一般入学者選抜のみ収録(玉島・津山の普通科と同型)。くくり募集・傾斜配点の欄は「ー」。重視する事項:生徒会活動、部活動、スポーツ・科学研究の分野における活動の実績。面接は集団", "【頁5】くくり募集・傾斜配点の欄は「ー」。重視する事項:生徒会活動、部活動、スポーツ・科学研究の分野における活動の実績。面接は集団");
// 5) 笠岡 普通: 特別入学者選抜を新設+一般のnote
const kasaOld = [
  "      schoolName: '笠岡',",
  "      department: '普通',",
  "      selectionCategory: '一般入学者選抜',",
].join(eol);
const kasaNew = [
  "      schoolName: '笠岡',",
  "      department: '普通',",
  "      selectionCategory: '特別入学者選抜',",
  "      interviewRequired: true,",
  "      note: '【頁5】検査概要:作文。与えられた課題について、600字程度で作文する。募集人員50%。重視する実績を示した選抜の募集人員は8人程度。重視する実績:英語検定準2級以上又は数学検定準2級以上合格。その他の選抜等:全(全国募集)。面接は集団',",
  "    },",
  "    {",
  "      schoolName: '笠岡',",
  "      department: '普通',",
  "      selectionCategory: '一般入学者選抜',",
].join(eol);
rep(kasaOld, kasaNew);
rep("【頁5】ページ上の特別入学者選抜の欄は全て「ー」のため一般入学者選抜のみ収録。その他の選抜等:全(全国募集)。", "【頁5】その他の選抜等:全(全国募集)。");
fs.writeFileSync(f, s);
console.log('patched p5');
