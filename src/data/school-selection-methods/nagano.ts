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
// ★長野県公式ページには`r8-2-01.pdf`〜`r8-2-06.pdf`の計6ファイルが分割公開されている
// (01〜04=全日制の4通学区・05=定時制課程・06=定時制(多部制・単位制)。2026-09-19に05/06を
// 実画像で確認し、以前の「通学区全6区」という記述は誤りだったため訂正した=第5・第6通学区は存在しない)。
// 本ファイルは6本すべてを収録している。1本目(r8-2-01.pdf＝第1通学区・北信地区)と2本目
// (r8-2-02.pdf＝第2通学区・東信地区・全2頁・2026-09-19 pdftoppm 110dpiで実画像を目視転記)と
// 3本目(r8-2-03.pdf＝第3通学区・南信地区・全3頁・同日同方法)と4本目(r8-2-04.pdf＝
// 第4通学区・中信地区・全2頁・同日同方法)と、5本目(r8-2-05.pdf＝定時制課程・1頁・8校9レコード)と6本目(r8-2-06.pdf＝定時制(多部制・単位制)・
// 1頁・3校8レコード)を収録。定時制は同名の全日制と区別するためselectionCategoryを「前期選抜(定時制)」とする。
// 第3通学区の岡谷工業・上伊那農業は令和8年度から学科改編予定で資料は新しい学科名を示している。
// 第2通学区の小諸義塾(94)は「令和8年度に開校する小諸義塾高等学校(仮称)」で学科名も仮称。
// 上田染谷丘(国際教養)は面接と実技検査が「併せて40」の1セル(内訳は資料に無い)。
//
// ratioTypeは「調査書X%:面接Y%:学力検査Z%」を基本形とし、作文(小論文)・実技検査が
// 0でない学校のみ「:作文W%」「:実技検査V%」を追記する(gunma/yamanashiと同型の
// コロン区切り運用)。全レコードで5項目の合計が100%になることを自己検算済み。
// selectionCategoryは全日制が「前期選抜」・定時制が「前期選抜(定時制)」(本PDFの対象が前期選抜のみのため)。同一学科内で
// 「観点別」①②の区分がある学校(長野商業・長野東)はselectionCategoryに①②を付記する。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const NAGANO_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'nagano',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '第1通学区(北信地区・20校38レコード・r8-2-01.pdf全3頁)と第2通学区(東信地区・9校22レコード・r8-2-02.pdf全2頁)と第3通学区(南信地区・19校37レコード・r8-2-03.pdf全3頁)と第4通学区(中信地区・13校24レコード・r8-2-04.pdf全2頁)と定時制課程(r8-2-05/06.pdf・11校17レコード・selectionCategory「前期選抜(定時制)」)を完全収録(計138レコード)。全日制4通学区+定時制で公表6ファイルすべてを収録済み。「前期選抜」のみが対象で、後期選抜・通信制は本PDFの対象外',
  source: {
    url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/r8-2-01.pdf',
    docTitle: '令和8年度長野県公立高等学校「前期選抜」における評価方法一覧(全日制課程4通学区+定時制課程。本urlは第1通学区のr8-2-01.pdf・r8-2-02〜06.pdfは同ディレクトリ)',
    lastChecked: '2026-09-19',
  },
  note: 'r8-2-01.pdf〜r8-2-06.pdfの計6ファイル(全日制4通学区+定時制2表)に分割公開されている資料の1本目(第1通学区・北信地区)と2本目(第2通学区・東信地区・https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/r8-2-02.pdf)と3本目(第3通学区・南信地区・https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/r8-2-03.pdf)と4本目(第4通学区・中信地区・https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/r8-2-04.pdf)と5・6本目(定時制課程・r8-2-05.pdf/r8-2-06.pdf)を収録(6本すべて)。ratioTypeは調査書:面接:学力検査を基本形とし、作文・実技検査が0でない学校のみ追記(全レコードで5項目合計100%を自己検算済み)',
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
    // ---- 第2通学区(東信地区・r8-2-02.pdf) ----
    { schoolName: '上田千曲', department: 'メカニカル工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の比重。工業。調査書は数学・理科・技術家庭の成績を重視。面接は志望動機・意欲・自己PR・専門科で学ぶ適性・表現力・態度。学習成績を重視し3年次の学習成績に著しい成績不振教科がないことが望ましい。特別活動・部活動等で実績のある者を考慮' },
    { schoolName: '上田千曲', department: '電気', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の比重。工業。調査書は数学・理科・技術家庭の成績を重視' },
    { schoolName: '上田千曲', department: '建築', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の比重。工業。調査書は数学・理科・技術家庭の成績を重視' },
    { schoolName: '上田千曲', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の比重。商業。調査書は国語・数学・英語の成績を重視' },
    { schoolName: '上田千曲', department: '生活福祉', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の比重。家庭。調査書は国語・数学・英語の成績を重視' },
    { schoolName: '上田千曲', department: '食物栄養', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '全学科共通の比重。家庭。調査書は国語・数学・技術家庭の成績を重視' },
    { schoolName: '上田染谷丘', department: '国際教養', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書40%:面接・実技検査(併せて)40%:学力検査20%', note: '面接と実技検査は資料上「併せて40」の1セルで内訳の記載なし。調査書は学習成績・特に英語と国語を重視。面接は志願理由書の記載に基づき本校の募集の観点に沿った人物であるか総合的に判断。実技検査は英語を理解する力・論理的に表現する力を問う(英語による口頭試問10分程度)' },
    { schoolName: '丸子修学館', department: '総合', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書55%:面接25%:学力検査20%', note: '各教科の学習の記録と特別活動の記録並びに総合所見及び特記事項等を総合して選抜。3年次の学習成績に著しい成績不振教科がないことが望ましい。面接は志望動機・意欲・態度・表現力・理解力・判断力・対応力などを見る' },
    { schoolName: '蓼科', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '各教科や総合的な学習の時間、特別活動等の学習状況を重視。面接は志望動機・学校生活への意欲・募集の観点・自己表現力・態度。備考欄に「調査書と面接及び学力検査により総合的に判断する」とあり' },
    { schoolName: '小諸義塾', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書55%:面接25%:学力検査20%', note: '令和8年度に開校する小諸義塾高等学校(仮称)で学科名も仮称。学習状況及び特別活動等の実績を重視。面接は志願理由・生徒会活動・部活動・自主活動等の活動状況・本校入学後の活動に対する意欲・基本的生活習慣等' },
    { schoolName: '小諸義塾', department: 'ビジネス', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '令和8年度に開校する小諸義塾高等学校(仮称)で学科名も仮称(商業系)。学習状況及び特別活動等の実績を重視。面接は志願理由・生徒会活動・部活動・自主活動等の活動状況・本校入学後の活動に対する意欲・基本的生活習慣等' },
    { schoolName: '小諸義塾', department: '音楽', selectionCategory: '前期選抜A', interviewRequired: true, ratioType: '調査書35%:面接10%:学力検査5%:実技検査50%', note: '令和8年度に開校する小諸義塾高等学校(仮称)で学科名も仮称。観点別の区分Aとして資料に記載(区分の意味の説明は当該頁に無い)。調査書は基礎学力・音楽については高度な知識があることが望ましい。実技検査は音楽の基礎知識・音楽の基本的な能力・十分な演奏技術' },
    { schoolName: '小諸義塾', department: '音楽', selectionCategory: '前期選抜B', interviewRequired: true, ratioType: '調査書50%:面接15%:学力検査10%:実技検査25%', note: '令和8年度に開校する小諸義塾高等学校(仮称)で学科名も仮称。観点別の区分Bとして資料に記載(区分の意味の説明は当該頁に無い)。調査書は基礎学力・音楽については十分な知識があることが望ましい。実技検査は基本的な演奏技術' },
    { schoolName: '軽井沢', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '各教科の学習の記録(3年次の成績に著しく低い評定の教科がないことが望ましい)と特別活動の記録を重視。面接は志望動機・中学校時代の学習・諸活動等・高校生活への適性・未来への意欲・理解力・表現力・態度・身だしなみ' },
    { schoolName: '佐久平総合技術', department: '食料マネジメント', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業系。学習状況・部活動・特別活動等を総合的に評価。面接は志望動機・意欲・態度・探究心・適性' },
    { schoolName: '佐久平総合技術', department: '生物サービス', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業系。評価方法は食料マネジメント・食農クリエイトと共通' },
    { schoolName: '佐久平総合技術', department: '食農クリエイト', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業系。評価方法は食料マネジメント・生物サービスと共通' },
    { schoolName: '佐久平総合技術', department: '機械システム', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '工業系。学習状況・部活動・特別活動等を総合的に評価。面接は志望動機・意欲・態度・探究心・適性' },
    { schoolName: '佐久平総合技術', department: '電気情報', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '工業系。評価方法は機械システムと共通' },
    { schoolName: '佐久平総合技術', department: '創造実践', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '学習状況・部活動・特別活動等を総合的に評価。面接は志望動機・意欲・態度・探究心・適性' },
    { schoolName: '野沢北', department: '理数', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '中学校での学習状況を重視(国語・社会・数学・理科・英語の5教科の評定値を重視)。面接は志願理由書(志願理由・入学後の抱負・将来への展望・自己PR)を志願者本人が事前に書いて提出し、募集の観点に沿う志願者であるか様々な質問を通して多角的に審査' },
    { schoolName: '小海', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '記載事項を総合的に判断。3年次の学習成績に著しい成績不振教科がないことが望ましい。面接は志望動機・意欲・基本的生活習慣・理解力・表現力・志願理由書の自己PR' },
    // ---- 第3通学区(南信地区・r8-2-03.pdf) ----
    { schoolName: '富士見', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は学習状況。面接は志望動機・高校生活に対する意欲・中学校での生活や学習状況・態度。備考「調査書、面接、学力検査の結果を総合的に判断する」' },
    { schoolName: '富士見', department: '園芸', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。評価方法は普通科と共通(調査書は学習状況・面接は志望動機・高校生活に対する意欲・中学校での生活や学習状況・態度)' },
    { schoolName: '茅野', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は基本的生活態度・学習状況・活動実績を重視し3年次に著しい成績不振教科のないことが望ましい。面接は志望動機・生活態度・学習状況・活動実績・関心・理解力・意欲・態度。備考「調査書、面接および学力検査により総合的に判断し、選抜する」' },
    { schoolName: '諏訪実業', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書65%:面接20%:学力検査15%', note: '商業・会計情報・服飾(家庭)の全学科共通の比重。調査書は各教科の学習の記録・特別活動の記録・総合所見及び特記事項等を重視。面接は明確な志望動機・意欲・態度・中学校生活の状況・基本的生活習慣等' },
    { schoolName: '諏訪実業', department: '会計情報', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書65%:面接20%:学力検査15%', note: '商業。商業・会計情報・服飾(家庭)の全学科共通の比重' },
    { schoolName: '諏訪実業', department: '服飾', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書65%:面接20%:学力検査15%', note: '家庭。商業・会計情報・服飾の全学科共通の比重' },
    { schoolName: '下諏訪向陽', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は学習成績・生徒会活動・部活動・校外活動等の活動実績。面接は入学後の抱負・生徒会活動・部活動等の活動状況など(志願理由書をもとに)・表現力・意欲・態度' },
    { schoolName: '岡谷東', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は基本的な学力を有すること。面接は志願理由・基本的生活習慣・意欲・理解力・態度・生徒会・部活動実績。備考「調査書、面接、学力検査により総合的に判断し選抜する」' },
    { schoolName: '岡谷工業', department: '機械工学', selectionCategory: '前期選抜①', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '令和8年度から学科改編予定で新しい学科名を示している。観点別①(機械工学・電気工学)。調査書は各教科の学習の記録・特別活動の記録・総合所見及び特記事項を重視し、特に数学・理科・英語の学習成績を重視。面接は志望動機・生活習慣・表現力・意欲・態度・適性等' },
    { schoolName: '岡谷工業', department: '電気工学', selectionCategory: '前期選抜①', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '令和8年度から学科改編予定で新しい学科名を示している。観点別①(機械工学・電気工学)' },
    { schoolName: '岡谷工業', department: '電子機械', selectionCategory: '前期選抜②', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '令和8年度から学科改編予定で新しい学科名を示している。観点別②(電子機械・情報技術)。調査書は各教科の学習の記録・特別活動の記録・総合所見及び特記事項を重視し、活動実績は中学校時代の部活動・社会体育活動等' },
    { schoolName: '岡谷工業', department: '情報技術', selectionCategory: '前期選抜②', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '令和8年度から学科改編予定で新しい学科名を示している。観点別②(電子機械・情報技術)' },
    { schoolName: '辰野', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書は学習成績と活動実績(①〜④)を総合的に判断。面接は志望動機・学習意欲・活動実績・態度' },
    { schoolName: '辰野', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書は学習成績と活動実績(①〜④)を総合的に判断。面接は志望動機・学習意欲・活動実績・態度' },
    { schoolName: '上伊那農業', department: 'つくるマネジメント', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。令和8年度から学科改編予定で新しい学科名を示している。調査書は高校での学びを深めるために必要な基礎的な学力が身についていること・特別活動・部活動等への取り組みや実績。面接は志望動機・中学での生活や学習状況・農業や産業に対する興味・関心・高校入学後の学習、部活動、特別活動、地域活動などへの意欲・態度・適性・リーダーシップ等' },
    { schoolName: '上伊那農業', department: '流通マネジメント', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。令和8年度から学科改編予定で新しい学科名を示している。評価方法は3学科共通' },
    { schoolName: '上伊那農業', department: 'くらしマネジメント', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。令和8年度から学科改編予定で新しい学科名を示している。評価方法は3学科共通' },
    { schoolName: '高遠', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接30%:学力検査10%', note: '調査書は学習成績と活動実績を総合的に判断。面接は志望動機・自己PR・意欲・態度' },
    { schoolName: '伊那北', department: '理数', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書は国語・社会・数学・理科・英語の5教科の評定値を重視し、特に数学・理科を重視。面接は志望動機・意欲・態度・表現力・人間性・自然科学分野に関する興味・関心' },
    { schoolName: '赤穂', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は学習およびその他諸活動への取り組み状況を重視。面接は志望動機・意欲・態度・自己PR。備考「優れた活動実績には配慮する」' },
    { schoolName: '駒ヶ根工業', department: '機械', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書45%:面接30%:学力検査25%', note: '工業。機械・電気・情報技術の3学科共通の比重。調査書は学習成績・部活動・特別活動・資格・検定等に加え基本的生活習慣を含め総合的に評価し、各教科において基礎学力が定着していること・提出物がしっかり出されていることが望ましい。面接は志望動機・意欲・自己PR・基本的生活習慣・態度・みだしなみ' },
    { schoolName: '駒ヶ根工業', department: '電気', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書45%:面接30%:学力検査25%', note: '工業。機械・電気・情報技術の3学科共通の比重' },
    { schoolName: '駒ヶ根工業', department: '情報技術', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書45%:面接30%:学力検査25%', note: '工業。機械・電気・情報技術の3学科共通の比重' },
    { schoolName: '松川', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は各教科の学習の記録・総合的な学習の時間の記録・総合所見及び特記事項・部活動、特別活動の記録。面接は志望動機・中学時代の取り組み・高校入学後の意欲・学習、学校生活に対する姿勢・態度、身だしなみ、表現力・自己PR' },
    { schoolName: '飯田', department: '理数', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書は学習成績を重視(特に国語・社会・数学・理科・英語の評定)。面接は志望動機・目的意識・意欲・関心・探究心(理数分野に関して)・社会性・理解力・表現力' },
    { schoolName: '飯田風越', department: '国際教養', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書は学習成績、特に英語の評定を重視し、英語検定・漢字検定の資格も評価する。面接は志望動機・意欲・態度・英語による基礎的なコミュニケーション能力' },
    { schoolName: '飯田OIDE長姫', department: '機械工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '工業。工業5学科・商業の全学科共通の比重。調査書は学習の記録・特別活動や部活動の記録・総合所見等。面接は志望動機・興味・関心・意欲・態度・表現力・学科への適性等' },
    { schoolName: '飯田OIDE長姫', department: '電子機械工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '工業。全学科共通の比重' },
    { schoolName: '飯田OIDE長姫', department: '電気電子工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '工業。全学科共通の比重。面接の項目等に口頭試問が明記されているのはこの学科のみ' },
    { schoolName: '飯田OIDE長姫', department: '社会基盤工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '工業。全学科共通の比重' },
    { schoolName: '飯田OIDE長姫', department: '建築学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '工業。全学科共通の比重' },
    { schoolName: '飯田OIDE長姫', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '商業。全学科共通の比重' },
    { schoolName: '下伊那農業', department: '栽培科学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。栽培科学・地域資源・生物活用の3学科共通の比重。調査書は学習の記録・特別活動の記録・総合所見を総合的に判断。面接は志望動機・中学校での学習状況及び専門分野への学習意欲・生徒会、部活動、校外活動等の実績と意欲・態度及び表現力' },
    { schoolName: '下伊那農業', department: '地域資源', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。3学科共通の比重' },
    { schoolName: '下伊那農業', department: '生物活用', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。3学科共通の比重' },
    { schoolName: '阿智', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は学習成績を重視し、部活動、特別活動等の活動実績。面接は志望動機・意欲・態度・表現力' },
    { schoolName: '阿南', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は学習成績、部活動・特別活動の実績、総合所見等。面接は志願理由書の内容を中心に志望動機・生徒会・部活動の実績・高校卒業後の進路希望等' },
    // ---- 第4通学区(中信地区・r8-2-04.pdf) ----
    { schoolName: '蘇南', department: '総合', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書65%:面接20%:学力検査15%', note: '調査書は各教科の学習の記録・特別活動等の記録・総合所見。面接は志望動機・意欲・探究・創造力・理解・表現力・態度' },
    { schoolName: '木曽青峰', department: '森林環境', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '農業。調査書は中学校での学習成績(国語・数学・理科・技術・家庭の成績)を重視し、生徒会活動・部活動・その他の諸活動(ボランティア活動・資格取得等)の成果や実績も評価。面接は志望動機・意欲・態度・表現力・基本的生活習慣等' },
    { schoolName: '木曽青峰', department: 'インテリア', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '工業。調査書は中学校での学習成績(国語・数学・美術・技術・家庭の成績)を重視し、生徒会活動・部活動・その他の諸活動の成果や実績も評価。面接は志望動機・意欲・態度・表現力・基本的生活習慣等' },
    { schoolName: '木曽青峰', department: '理数', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書75%:面接15%:学力検査10%', note: '調査書は中学校での学習成績(国語・社会・数学・理科・英語の成績)を重視。面接は志望動機・意欲・態度・表現力' },
    { schoolName: '塩尻志学館', department: '総合', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書65%:面接20%:学力検査15%', note: '調査書の内容を総合的に評価。面接は志望動機・意欲・発想力・表現力・態度' },
    { schoolName: '田川', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接25%:学力検査15%', note: '調査書は学習の記録(特に3年次の学習成績は良好であることが望ましい)・特別活動の記録・総合所見及び特記事項等を総合的に判断。面接は志望動機・意欲・表現力・態度' },
    { schoolName: '梓川', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は学習状況と部活動・特別活動・校外活動の状況や内容。面接は志望動機・意欲・態度' },
    { schoolName: '松本工業', department: '機械', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接30%:学力検査10%', note: '工業。機械・電気・電子工業の3学科共通の比重。調査書は学習成績を重視し総合的に評価。面接は志望動機・興味関心・態度・意欲・自己理解・表現力' },
    { schoolName: '松本工業', department: '電気', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接30%:学力検査10%', note: '工業。機械・電気・電子工業の3学科共通の比重' },
    { schoolName: '松本工業', department: '電子工業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書60%:面接30%:学力検査10%', note: '工業。機械・電気・電子工業の3学科共通の比重' },
    { schoolName: '松本県ケ丘', department: '自然探究', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書45%:面接15%:学力検査10%:作文30%', note: '自然探究・国際探究の2学科共通の比重。調査書は各教科の学習の記録(特に国語・社会・数学・理科・英語)を中心に総合所見等を総合的に評価。面接は志望動機・意欲・態度・自然科学・人文科学・社会科学などに対する興味・関心等。作文(小論文)は課題理解力・批判的思考力・創造的思考力・表現力等' },
    { schoolName: '松本県ケ丘', department: '国際探究', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書45%:面接15%:学力検査10%:作文30%', note: '自然探究・国際探究の2学科共通の比重。作文(小論文)は課題理解力・批判的思考力・創造的思考力・表現力等' },
    { schoolName: '明科', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は各教科の学習の記録・清掃への取り組み・生活のきまりの遵守を重視。個人面接は志望動機・意欲の強さ・基本的生活習慣を見る。備考「調査書、個人面接、および学力検査の結果を総合的に判断して選抜する」' },
    { schoolName: '南安曇農業', department: 'グリーンサイエンス', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。グリーンサイエンス・環境クリエイト・生物工学の3学科共通の比重。調査書は学習成績・部活動・特別活動等における特筆すべき点。面接は志願理由書に記載された内容をもとに、募集の観点に沿う人物であるか、基本的な生活習慣(あいさつ・時間を守る・ルールを守る)が身についているかを総合的に審査' },
    { schoolName: '南安曇農業', department: '環境クリエイト', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。3学科共通の比重' },
    { schoolName: '南安曇農業', department: '生物工学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '農業。3学科共通の比重' },
    { schoolName: '穂高商業', department: '商業', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '商業。商業・情報マネジメントの2学科共通の比重。調査書は学習活動・特別活動等を総合的に評価。面接は志望動機・意欲・態度・理解力・表現力' },
    { schoolName: '穂高商業', department: '情報マネジメント', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '商業。商業・情報マネジメントの2学科共通の比重' },
    { schoolName: '池田工業', department: '機械・電気学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '工業。機械・電気学と建築学の2学科共通の比重。調査書は各教科の学習の記録・特別活動の記録並びに総合所見等を総合的に評価。面接は志望動機・意欲・態度・表現力' },
    { schoolName: '池田工業', department: '建築学', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '工業。機械・電気学と建築学の2学科共通の比重' },
    { schoolName: '大町岳陽', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書75%:面接15%:学力検査10%', note: '調査書は中学校での生徒会活動・部活動において顕著な活躍を評価し、学習の記録・特別活動の記録・総合所見を中心に総合的に判断。面接は部活動・生徒会活動やボランティア活動に対する意欲・関心・面接態度・高校生活への意欲' },
    { schoolName: '大町岳陽', department: '学究', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書75%:面接15%:学力検査10%', note: '調査書は中学3年次の学習成績を重視し、国語・社会・数学・理科・英語の成績を重視。面接は学習意欲・自然科学分野や人文科学分野に対する意欲・関心・面接態度' },
    { schoolName: '白馬', department: '普通', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書70%:面接20%:学力検査10%', note: '調査書は各教科の学習成績・部活動・特別活動の状況等。面接は志望動機・高校生活への目的意識・学習意欲・将来への展望・態度・姿勢・表現の明確さ' },
    { schoolName: '白馬', department: '国際観光', selectionCategory: '前期選抜', interviewRequired: true, ratioType: '調査書50%:面接30%:学力検査20%', note: '調査書は各教科の学習成績・部活動・特別活動の状況等。面接は志望動機・高校生活への目的意識・学習意欲・将来への展望・態度・姿勢・理解力・表現力・コミュニケーション力' },
    // ---- 定時制課程(r8-2-05.pdf) ----
    { schoolName: '中野立志館', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接50%:学力検査20%', note: '定時制課程。面接は志望動機・学習意欲・公共心・協調性・表現力・態度' },
    { schoolName: '長野', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接50%:学力検査20%', note: '定時制課程。調査書の内容を総合的に評価。面接は志望動機・学習意欲・将来の希望・態度・協調性' },
    { schoolName: '長野商業', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接50%:学力検査20%', note: '定時制課程。面接は志望の動機・学習の意欲・単位制の理解・態度・将来の希望' },
    { schoolName: '長野工業', department: '基礎工学', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接40%:学力検査10%:作文20%', note: '定時制課程(工業)。基礎工学・建築の2学科共通の比重。面接は志望動機・意欲・態度・表現力。作文(小論文)は理解力・表現力・字数' },
    { schoolName: '長野工業', department: '建築', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接40%:学力検査10%:作文20%', note: '定時制課程(工業)。基礎工学・建築の2学科共通の比重' },
    { schoolName: '上田', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接45%:学力検査25%', note: '定時制課程。調査書は学習に関する態度を重視し内容を総合的に評価。面接は志望動機・意欲・自己表現力・態度' },
    { schoolName: '諏訪実業', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書25%:面接30%:学力検査20%:作文25%', note: '定時制課程。調査書の内容を総合的に評価。面接は志望動機・意欲・態度・表現力・就労状況・基本的生活習慣。作文(小論文)は論理性・積極性・具体性・内容の適正さ・表現力。備考「中学校の指導要録保存期間を過ぎている等の理由により調査書の発行が不可能な場合には、比重について別途考慮する」' },
    { schoolName: '木曽青峰', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書40%:面接50%:学力検査10%', note: '定時制課程。調査書の内容を総合的に評価。面接は志望動機・意欲・態度' },
    { schoolName: '池田工業', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接50%:学力検査20%', note: '定時制課程。調査書は各教科の学習の記録・総合所見及び特記事項等を重視。面接は志望動機・意欲・態度' },
    // ---- 定時制課程(多部制・単位制)(r8-2-06.pdf) ----
    { schoolName: '東御清翔', department: '普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書40%:面接40%:学力検査20%', note: '定時制課程(多部制・単位制)。調査書の内容から総合的に判断。面接は志望動機・意欲・興味・関心・自己理解・態度・理解力・表現力・社会性' },
    { schoolName: '箕輪進修', department: 'Ⅰ部・普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書35%:面接35%:学力検査30%', note: '定時制課程(多部制・単位制)。面接は志望動機・興味・関心・意欲・態度・表現力。備考「調査書内容、面接の結果、および学力検査の内容から総合的に判断する」' },
    { schoolName: '箕輪進修', department: 'Ⅱ部・普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書35%:面接35%:学力検査30%', note: '定時制課程(多部制・単位制)。Ⅰ部・普通と同じ比重' },
    { schoolName: '箕輪進修', department: 'Ⅲ部・普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書30%:面接45%:学力検査25%', note: '定時制課程(多部制・単位制)。Ⅰ・Ⅱ部より面接の比重が高い' },
    { schoolName: '箕輪進修', department: 'Ⅰ部・工業', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書35%:面接35%:学力検査30%', note: '定時制課程(多部制・単位制)。Ⅰ部・普通と同じ比重' },
    { schoolName: '松本筑摩', department: '午前・普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書40%:面接40%:学力検査20%', note: '定時制課程(多部制・単位制)。調査書の内容を総合的に評価。面接は志望動機・意欲・態度・適性' },
    { schoolName: '松本筑摩', department: '午後・普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書40%:面接40%:学力検査20%', note: '定時制課程(多部制・単位制)。午前・普通と同じ比重' },
    { schoolName: '松本筑摩', department: '夜間・普通', selectionCategory: '前期選抜(定時制)', interviewRequired: true, ratioType: '調査書40%:面接40%:学力検査20%', note: '定時制課程(多部制・単位制)。面接は志望動機・意欲・態度・理解力・協調性・公共心・仕事に対する考え方' },
  ],
};
