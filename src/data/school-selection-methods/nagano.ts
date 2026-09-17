// 長野県: 令和8年度長野県公立高等学校「前期選抜」における評価方法一覧(全日制課程)。
// 学校ごとに「調査書」「面接」「学力検査」「作文(小論文)」「実技検査」の5資料の比重(%)と、
// それぞれの資料で重視する項目(項目等)が定められている。長野県公式には比重は「合否を決める
// 得点配分」ではなく「総合判定における重視度の目安」と明記されている点に注意。
//
// 一次ソース: 長野県教育委員会「令和8年度公立高等学校入学者選抜情報」ページ
// (`pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/r8naiyo.html`)からリンクされる
// PDF「1 全日制課程(表の見方)」(`pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/
// documents/r8-2-01.pdf`・全3頁・2026-09-17 curl+pdftoppm(150dpi)でビジョン確認。
// ToUnicode CMap欠落でpdftotextが文字化けする既知パターン)。
//
// ★長野県公式ページには通学区(全6区)ごとに`r8-2-01.pdf`〜`r8-2-06.pdf`の計6ファイルが
// 分割公開されている。本ファイルは1本目(r8-2-01.pdf＝第1通学区・北信地区)のみを収録し、
// 第2〜6通学区(r8-2-02〜06.pdf)は未収録(Y-0: 収録範囲の限定を正直に開示)。
//
// ratioTypeは「調査書X%:面接Y%:学力検査Z%」を基本形とし、作文(小論文)・実技検査が
// 0でない学校のみ「:作文W%」「:実技検査V%」を追記する(gunma/yamanashiと同型の
// コロン区切り運用)。全レコードで5項目の合計が100%になることを自己検算済み。
// selectionCategoryは「前期選抜」固定(本PDFの対象が前期選抜のみのため)。同一学科内で
// 「観点別」①②の区分がある学校(長野商業・長野東)はselectionCategoryに①②を付記する。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const NAGANO_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'nagano',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '第1通学区(北信地区)のみ完全収録(20校38レコード・r8-2-01.pdf全3頁)。第2〜6通学区(r8-2-02〜06.pdf)は未収録。全日制「前期選抜」のみが対象で、後期選抜・定時制・通信制は本PDFの対象外',
  source: {
    url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/r8-2-01.pdf',
    docTitle: '令和8年度長野県公立高等学校「前期選抜」における評価方法一覧(第1通学区・全日制課程)',
    lastChecked: '2026-09-17',
  },
  note: '通学区(全6区)ごとにr8-2-01.pdf〜r8-2-06.pdfの計6ファイルに分割公開されている資料の1本目(第1通学区・北信地区)のみを収録。ratioTypeは調査書:面接:学力検査を基本形とし、作文・実技検査が0でない学校のみ追記(全レコードで5項目合計100%を自己検算済み)',
  schools: [
    { schoolName: '飯山', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '志望動機・意欲・目的意識・理解力・表現力・資質・態度を重視' },
    { schoolName: '飯山', department: '自然科学探究', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '国語・社会・数学・理科・英語を中心に評価。面接で自然科学・人文科学への興味・関心や探究的意欲も確認' },
    { schoolName: '飯山', department: '人文科学探究', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '国語・社会・数学・理科・英語を中心に評価。面接で自然科学・人文科学への興味・関心や探究的意欲も確認' },
    { schoolName: '飯山', department: 'スポーツ科学', selectionCategory: '前期選抜', interviewRequired: false, ratioType: '調査書40%:学力検査10%:実技検査50%', note: '実技検査を重視しながら競技実績を加味。募集人員はスキーが半数程度、野球・剣道・陸上競技が半数程度' },
    { schoolName: '下高井農林', department: '地域創造農学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書・学力検査・面接により総合的に判断' },
    { schoolName: '中野立志館', department: '総合', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '学習成績・基本的生活習慣・特別活動等の記録を重視' },
    { schoolName: '中野西', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '学習成績、文化的・体育的活動などの実績等を重視' },
    { schoolName: '須坂東', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '学習状況、中学校時代の部活動・社会体育・生徒会活動、学級活動の顕著な実績を重視' },
    { schoolName: '須坂創成', department: '園芸農学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書55%:面接25%:学力検査20%', note: '農業(園芸農学・食品科学・環境造園)・工業(創造工学)・商業(商業)の全学科共通の評価方法。3年次の学習成績に著しく低い評定がないことが望ましいとの条件あり' },
    { schoolName: '須坂創成', department: '食品科学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書55%:面接25%:学力検査20%', note: '農業(園芸農学・食品科学・環境造園)・工業(創造工学)・商業(商業)の全学科共通の評価方法' },
    { schoolName: '須坂創成', department: '環境造園', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書55%:面接25%:学力検査20%', note: '農業(園芸農学・食品科学・環境造園)・工業(創造工学)・商業(商業)の全学科共通の評価方法' },
    { schoolName: '須坂創成', department: '創造工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書55%:面接25%:学力検査20%', note: '農業(園芸農学・食品科学・環境造園)・工業(創造工学)・商業(商業)の全学科共通の評価方法' },
    { schoolName: '須坂創成', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書55%:面接25%:学力検査20%', note: '農業(園芸農学・食品科学・環境造園)・工業(創造工学)・商業(商業)の全学科共通の評価方法' },
    { schoolName: '北部', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書35%:面接35%:学力検査30%', note: '調査書、面接、学力検査により総合的に判断' },
    { schoolName: '長野西', department: '国際教養', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書40%:面接20%:学力検査10%:作文30%', note: '学習成績を重視。英語は特に優れていることが望ましい。部活動・特別活動及び資格取得も考慮。作文(小論文)は論理的思考力・情報分析能力・英語での表現力(読む・聞く・話す)を評価' },
    { schoolName: '長野商業', department: '商業', selectionCategory: '前期選抜①', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '学習成績重視。学習成績および取り組み状況を評価' },
    { schoolName: '長野商業', department: '会計', selectionCategory: '前期選抜②', interviewRequired: true, ratioType: '調査書60%:面接30%:学力検査10%', note: '部活動・生徒会・校外活動・地域活動等の実績重視' },
    { schoolName: '長野東', department: '普通', selectionCategory: '前期選抜①', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書、面接、学力検査により総合的に判断' },
    { schoolName: '長野東', department: '普通', selectionCategory: '前期選抜②', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書、面接、学力検査により総合的に判断。本校にある部活動の実績も評価対象に追加' },
    { schoolName: '長野工業', department: '機械工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '機械工学・電気電子工学・物質化学・情報工学・土木工学・建築学の全学科共通の評価方法。学習成績・特別活動・総合所見(学校外の活動も評価)を重視' },
    { schoolName: '長野工業', department: '電気電子工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の評価方法' },
    { schoolName: '長野工業', department: '物質化学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の評価方法' },
    { schoolName: '長野工業', department: '情報工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の評価方法' },
    { schoolName: '長野工業', department: '土木工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の評価方法' },
    { schoolName: '長野工業', department: '建築学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の評価方法' },
    { schoolName: '長野西中条校', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書35%:面接35%:学力検査30%', note: '総合的に判断' },
    { schoolName: '篠ノ井犀峡校', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書40%:面接40%:学力検査20%', note: '中学時の学習状況や活動実績を重視' },
    { schoolName: '市立長野', department: '総合', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接30%:学力検査10%', note: '調査書、面接、学力検査を総合的に判断。長野市立(県立ではない)' },
    { schoolName: '長野南', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書、面接、学力検査により総合的に判断' },
    { schoolName: '更級農業', department: '地域園芸', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '地域園芸・植物活用・食農科学の全学科共通の評価方法。調査書、面接、学力検査の評価を総合的に判断' },
    { schoolName: '更級農業', department: '植物活用', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の評価方法' },
    { schoolName: '更級農業', department: '食農科学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の評価方法' },
    { schoolName: '松代', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書65%:面接20%:学力検査15%', note: '基本的生活習慣および基礎的な学力が身についていることを重視' },
    { schoolName: '松代', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書65%:面接20%:学力検査15%', note: '基本的生活習慣および基礎的な学力が身についていることを重視' },
    { schoolName: '屋代', department: '理数', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '志望理由書の内容(志望動機・入学後の抱負・理数分野への関心)を面接で確認' },
    { schoolName: '屋代南', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書35%:面接35%:学力検査30%', note: '学習の記録及び総合所見を重視' },
    { schoolName: '屋代南', department: 'ライフデザイン', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書35%:面接35%:学力検査30%', note: '家庭科。学習の記録(特に技術・家庭科)及び総合所見を重視' },
    { schoolName: '坂城', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接40%:学力検査10%', note: '学習成績、学校生活や地域等での活動状況を重視' },
  ],
};
