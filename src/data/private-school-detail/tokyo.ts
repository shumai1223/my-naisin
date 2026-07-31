/**
 * 東京都私立高等学校の募集定員データ(Λ-5大都市圏5県の最後・北海道除く残り最後の1都)。
 * (株)育伸社「2026年度 国立高校・高専・私立高校 募集要項【東京都】」(2025年11月4日現在)を
 * Read toolでPDF原本を直接解析。参照台帳241校と規模が極めて大きいため複数周回に分けて
 * 処理する方針(千葉/兵庫/大阪/神奈川と同様、東京はさらに規模が大きい)。
 * **重要な発見(2026-07-31)**: このPDFは20頁あり、Read toolに一括で渡すと「too many pages」
 * エラーになるが、pagesパラメータで"1-10"のように範囲指定すると正常に読める(poppler未導入
 * によりpages指定が失敗するという既存の教訓[[fable5-loop-protocol]]は、13頁超のPDF全てに
 * 一律に適用されるわけではないと判明。少なくともこのPDFでは10頁単位のchunk読み込みが機能した)。
 * これにより東京都の20頁PDFも複数回のchunk読み込みで最終的に全頁処理できる見込み。
 * 1頁目は明確に読み取れた2校のみを収録(愛国・青山学院)。国立
 * (筑波大学附属駒場・お茶の水女子大学附属・東京藝術大学附属音楽・東京科学大学附属科学技術・
 * 筑波大学附属・東京学芸大学附属)・高専(東京工業高専・都立産業技術高専・私立サレジオ工業高専)
 * は私立高校マスターに含まれないため対象外。足立学園・安部学院は「推薦」ブロックと「一般」
 * ブロックが別枠なのか同一クォータの共有(↓)なのか原資料のみでは確証が持てず(愛国のような
 * 単一ブロック内の↓共有と、ブロック跨ぎの再掲が混在しているように見えるため)、誤帰属を避け
 * るため今回は見送り、次回別途官報方式で確認する。
 * **2頁目(2026-07-31追記)**: 岩倉(7限制100+6限制200+運輸120=420)・英明フロンティア
 * (αコース10+フロンティアコース120=130)・江戸川女子(Ⅱ類50+Ⅲ類50+国際英語25=125、帰国は
 * いずれも若干名のため未算入)の3校は単一の↓共有クォータブロックで明瞭だったため収録。
 * 郁文館・郁文館グローバルは「単願推薦60(shared)」とは別に「国立選抜・iP計20」「オープン10」
 * のように同一ラベルで異なる数値が並ぶ、または特進クラス/進学クラスの2コースにまたがって
 * 併優一般枠の数値ラベルが重複する(=学校またぎの共有クォータの可能性)複雑な構造で、原資料の
 * 解像度だけでは合算方法の確証が持てないため今回は見送り。上野学園は特別進学コースα/β・総合
 * 進学コースの3コース(10+15+25=50)は明瞭だが、音楽コースは推薦・一般で異なる数値が並び
 * かつ器楽/声楽/演奏家で細分されており構造が読み切れないため、学校単位の総定員を歪めない
 * よう学校ごと保留(1コースだけ収録すると総定員を過小表示するリスクがあるため)。
 * **3頁目(2026-07-31追記)**: 桜美林(国公立20+特別進学30+進学130=180)・大森学園(特選20+
 * 選抜40+総進80+工業40=180)・開成(男、一般のみ100)・かえつ有明(一般10)・科学技術学園
 * (総合60+特進20=80)・学習院高等科(男、一般のみ約20)・神田女学園(グローバル25+アドバンスト
 * 25+キャリアデザイン50=100)・関東国際(普通60+外国語120=180)の8校は単一の↓共有クォータ
 * ブロックで明瞭だったため収録。川村は「A推薦20」「B推薦①10・B推薦②↓」「一般・併優①
 * 一般15・併優15」という3つの異なるブロックが並び、A/B推薦の加算可否および「一般15・併優15」
 * が別建て30なのか併願優遇が一般15の内数(合計15)なのかの解釈で2つの独立した曖昧さが重なり
 * 確証が持てないため今回は見送り。
 * **4頁目(2026-07-31追記)**: 解釈ルールを確立=「推薦ブロック(A/B推薦等が↓で内部共有)」の後に
 * 続けて「一般ブロック(一般①/②等が↓で内部共有)」が別の数値(または偶然同じ数値)で始まる場合、
 * 一般側は推薦側とは独立の加算対象クォータである(合算して学校/コースの総定員とする)。この解釈は
 * 錦城学園高等学校で「令和7年度=推薦120名・一般120名の合計240名」というWebSearch独立情報源
 * (3頁目時点では未反映)と本頁のikushinデータ(A推薦120・一般①120)が構造的に一致することで
 * 検証できた。この解釈ルールに基づき関東第一(ハイパー80+アドバンスト240+アグレッシブ200+
 * アスリート80=600)・北里大学附属順天(旧順天、理数25+英語25+特進40=90)・北豊島(女、
 * インスパイアリング40+グローバル50+バリュアブル50=140)・共栄学園(未来探究15+国際共生15+
 * 理数創造15+探究特進35+探究進学80=160)・共立女子第二(女、特別進学35+総合進学80+英語15=130)・
 * 錦城(特進120は一般のみ掲載+進学330=推薦130+一般200=450)・錦城学園(推薦120+一般120=240)の
 * 7校を新たに収録。このルール確立により、3頁目で見送った川村は次回この解釈で再訪する価値がある。
 * **5頁目(2026-07-31追記)**: ★解釈ルールをさらに精緻化=推薦/一般の行に「全コース計X」「進学・
 * 特進計X」のように**同一の「○○計X」ラベルが複数行(または複数コース)にわたって繰り返される
 * 場合はそれ自体が共有クォータの宣言であり合算しない**(佼成学園の3コースいずれも「全コース計50」
 * と表記され学校全体で50が正しい・国本女子/京華の進学特進コースも同様)。一方、ラベルの繰り返しが
 * 無く単に「推薦」「一般」という見出しに独立した数値が並ぶだけの場合(4頁目で確立した基本ルール)
 * は加算対象。この2つの判別ルールを適用し10校を新たに収録: 国立音楽大学附属(普通60+音楽80=140、
 * 大学名の「国立」は地名由来で私立大学であり国立学校ではない)・国本女子(総合進学75+ダブル
 * ディプロマ75=150、共有クォータ)・慶應義塾女子(推薦30+一般70=100)・京華(進学・特進コース計
 * 50[共有]+S特進25[推薦10+一般15]=75)・京華商業(70+80=150)・啓明学園(40+50=90)・
 * 小石川淑徳学園(特別選抜40+選抜40=80、単一ブロック内の2ラベル併記で両方とも共有)・
 * 工学院大学附属(先進文理70+文理70+インターナショナル20=160)・麹町学園女子(40+30=70)・
 * 佼成学園(全コース計50=50、3コースで共有)。京華女子は特進/進学クラスとも複数の異なる数値
 * (クラブ特待15/推薦特待10・普通科計30/B推薦特待5・普通科計15/一般①特待10・普通科計50等)が
 * 入り組み構造が読み切れないため今回も見送り。
 * **6頁目(2026-07-31追記)**: 駒込(理系先進/国際教養/特Sコース/Sコースの4コース全てで「普通科計
 * 120」が繰り返される)・駒場学園(特別進学/国際/進学の3コース全てで「普通科計160」が繰り返される)
 * の2校は、同一ラベルが3〜4コースにまたがって反復される強い証拠に基づき「学校全体で1つの共有
 * クォータ」と判断(佼成学園の全コース計50と同型)。国士舘(選抜クラス/進学クラスの2コースで
 * 「普通科計130」が反復)も同様の解釈を適用したが、2コースのみでの反復は4頁目で確立した「異なる
 * 推薦/一般ラベルに同数値が来る場合は加算」ケースとの区別が本来難しく、駒込での4コース反復という
 * より強い証拠が得られたことで初めて確信を持てた。国学院大学久我山は男女別学で推薦(男女共通枠50)
 * と一般(男約60・女約35)が別ブロックのため加算(145)。國學院は推薦130+一般250=380(4頁目の基本
 * ルール)。佼成学園女子(留学・SG15+特進35+進学30=80)・駒沢学園女子(進学120+特進100+英語100
 * =320、いずれも一般②の「全クラス計20」という異なる数値は2次募集の補充枠と判断し未算入)・
 * 駒澤大学(単一ブロック250)も収録。国際基督教大学は帰国生入試(推薦・書類選考・学力試験の複数
 * ルート)が主体で一般枠も含め加算方法が特殊すぎるため今回は見送り。
 * **7頁目(2026-07-31追記)**: 実践学園は特別進学・リベラルアーツ&サイエンス・文理進学・
 * スポーツサイエンスの4コース全てで「推薦=普通科計130・一般=普通科計140」という2つの数値が
 * 完全一致で反復されており、駒込(4コース反復)と同型の強い証拠のため学校全体で推薦130+一般140
 * =270の共有クォータと判断。桜丘・サレジアン国際学園(北区、育伸社PDFのOCR誤読で「サレジオ」と
 * 見えたが正しくは学校コード一覧上「サレジアン国際学園高等学校」)・品川エトワール女子・
 * 品川翔英は単一の↓共有クォータブロックで明瞭だったため収録(105/40/150/160)。品川学藝は
 * 普通/音楽の2つの独立した課程がそれぞれ単一ブロックで50ずつ(=100、両者は別課程なので加算)。
 * 芝浦工業大学附属は推薦25+一般25=50(4頁目の基本ルール)。芝国際は最難関選抜コース(推薦・一般
 * 共通枠5、帰国生1・2回は若干のため未算入)+国際コース(推薦15+一般10=25、帰国生1回は若干でない
 * 明示数値5があったが国際系学校の帰国生ルートは主要選抜として扱いが特殊なため一貫して未算入とし
 * 一般化)=30。
 * **8頁目(2026-07-31追記)**: 下北沢成徳(女、GL/BRセレクト/BRの3コース全てで「普通科計100」が
 * 反復=駒込・実践学園と同型のため学校全体で100の共有クォータ)・十文字(女、リベラルアーツ/特選
 * (人文・理数)/自己発信の3コース全てで「全コース計80」が反復=十文字全体で80の共有クォータ)の
 * 2校は複数コースにまたがる同一ラベル反復のパターンを適用。自由ヶ丘学園(25+50+60=135、各コース
 * 独立の数値で計Xラベルなし)・自由学園(推薦60+一般60=120、いずれも内部進学を含む)・修徳(特進
 * 50+文理進学80=130)・淑徳(スーパー特進20+特進選抜50+留学20=90、留学コースは単願推薦のみ掲載)・
 * 淑徳巣鴨(アルティメット38+プレミアム37+選抜80+特進80=235、4コースとも独立の数値で計Xラベル
 * なし)は通常の複数コース加算パターンとして収録。
 * **9頁目(2026-07-31追記)**: 聖徳学園は難関国公立型・文理進学型の2コースで「難関国公立・文理計」
 * ラベルが推薦30・一般75の両方とも一致して反復されており(実践学園と同型)2コース分を推薦30+
 * 一般75=105の共有クォータとし、別枠のデータサイエンスコース25と合算し130。昭和第一学園は
 * 総合進学コース(文理進学)・(探究)の2サブコースで「総合進学コース計200」が一致して反復され
 * 200の共有クォータ、英語14+選抜進学60+総合進学200+デザイン14=288。松蔭大学附属松蔭(推薦の
 * 特待10・一般クラブ70という2つの内訳を合算し80)・城北(男、推薦約20+一般約65=85)・昭和第一
 * (特進20+進学120=140、コース間で計Xラベルの反復なし)・昭和鉄道(単一ブロック100)・女子美術
 * 大学付属(女、推薦32+一般33=65)も収録。順天堂大学系属理数インターは参照台帳(schools-private/
 * tokyo.ts)に該当する学校コードが見当たらず(新設校または名称表記の相違の可能性)コード特定でき
 * ないため見送り。潤徳女子は特進コースのみ推薦A17・推薦B①18と数値が食い違い(進学・美術の他
 * 2コースはA/Bで完全一致)、学校全体の総定員を誤って表示するリスクを避けるため学校ごと保留。
 * 城西大学附属城西は単願65+CS10・一般①35(AC専用)・一般②AC35+CS30という多段階で対象学科が
 * 回替わる複雑な構造のため今回も保留。
 * **10頁目(2026-07-31追記)**: 大量16校を収録。杉並学院・駿台学園・成立学園・白梅学園の一部
 * コースは複数コースにまたがる「○○計X」ラベル反復(実践学園・聖徳学園と同型)を確認: 杉並学院
 * (特別進学・総合進学の2コースで推薦120+一般280が両方一致反復=合計400)・駿台学園(特選・進学の
 * 2コースで推薦110+一般130が両方一致反復=240、別枠スペシャリストコース60と合算し300)・
 * 成立学園(特進・総合の2コースで「特進・進学計130」が推薦一般問わず完全一致=130、130+130でなく
 * 130のみ)・白梅学園(特選国公立系・特選文理系の2つの特別選抜サブコースで「特別選抜コース計50」
 * が一致反復=50、選抜35・進学55は独立で加算し140)。正則は推薦A・B共通枠160+一般①120=280
 * (一般②の40は一般①からの独立した追加数値の可能性があるが2次募集の補充枠の疑いが強く駒沢学園
 * 女子と同様の理由で未算入)。その他は通常の複数コース/推薦一般加算パターン: 巣鴨70(男、一般
 * のみ)・聖学院15・成蹊85・成女50・成城学園60・正則学園125・聖パウロ学園80・青稜130(帰国は
 * 若干のため未算入)・世田谷学園25・専修大学附属400(推薦200+一般200、コース間の計Xラベルなし
 * だが4頁目の基本ルールで加算)・創価135。
 * **11頁目(2026-07-31追記)**: 瀧野川女子学園(女、特進選抜クラス・特進コース・進学コースの3
 * コース全てで「普通科計135」が反復=135の共有クォータ、駒込型)・大東文化大学第一(選抜進学
 * クラス・進学クラスの2コースで「選抜・進学計155(推薦)」「選抜・進学計160(一般)」が両方一致
 * 反復=315の共有、特別進学クラスは独立35と合算し350)は複数コース反復パターンを適用。大成は
 * 特別進学・文理進学・情報進学の3コースそれぞれで推薦/一般①/一般②の3段階が全て異なる明示数値
 * (計Xラベルなし)のため全て加算し405(単一学校としては大きめの値だが原資料の構造をそのまま反映)。
 * その他は通常の複数コース/推薦一般加算: 大東学園270(推薦135+公立併願優遇一般共通枠135)・
 * 拓殖大学第一400(特進[推薦40+一般60]+進学[推薦120+一般180])・立川女子300(総合[推薦125+一般
 * 125]+特別進学[推薦25+一般25]、いずれもコース間の計Xラベルなしだが4頁目の基本ルールで加算)・
 * 玉川学園80(単一ブロック)・玉川聖学院120(推薦40+一般Ⅰ〜Ⅳ共通枠80)・多摩大学附属聖ケ丘20
 * (一般のみ掲載)・多摩大学目黒150(推薦30+一般120)・中央学院大学中央50(普通25+商業25、別課程の
 * ため加算)・中央大学(昼間定時制)95(推薦25+一般70、男女共通枠)・中央大学杉並300(一般公募推薦
 * 130+帰国20+一般150、帰国は明示数値のため国際系学校とは異なり通常の校と同様に算入)。
 * 残り7校はWebSearchで個別調査し完全中高一貫(高校からの外部募集なし)と確認できたためスキップ:
 * 暁星・大妻・雙葉・共立女子(2006年度に高校募集停止)・三輪田学園・女子学院・白百合学園。
 * いずれも「女子御三家(女子学院・雙葉)」「男子伝統校(暁星)」等の著名中高一貫校で、
 * 兵庫/京都/神奈川で確立した「難関進学校ほど高校募集を廃止している」パターンが東京でも
 * 強く再現している。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_TOKYO_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03913.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【東京都】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_TOKYO: PrivateSchoolDetailFile = {
  prefectureCode: 'tokyo',
  schools: [
    {
      schoolCode: 'D113312300011',
      schoolName: '愛国高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(A推薦・B/C推薦・一般共通枠)', capacity: 80 },
        { courseName: '商業(A推薦・B/C推薦・一般共通枠)', capacity: 40 },
        { courseName: '家政(A推薦・B/C推薦・一般共通枠)', capacity: 40 },
        { courseName: '衛生看護(A推薦・B/C推薦・一般共通枠)', capacity: 20 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311300013',
      schoolName: '青山学院高等部',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、約)', capacity: 65 },
        { courseName: '普通(帰国、約)', capacity: 25 },
        { courseName: '普通(一般、約)', capacity: 70 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310600012',
      schoolName: '岩倉高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '7限制(A推薦・B推薦・一般①・一般②共通枠)', capacity: 100 },
        { courseName: '6限制(A推薦・B推薦・一般①・一般②共通枠)', capacity: 200 },
        { courseName: '運輸(A推薦・B推薦・一般①・一般②共通枠)', capacity: 120 },
      ],
      totalCapacity: 420,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312000023',
      schoolName: '英明フロンティア高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'フロンティアαコース(単願推薦・併願推薦・併優・一般共通枠)', capacity: 10 },
        { courseName: 'フロンティアコース(単願推薦・併願推薦・併優・一般共通枠)', capacity: 120 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312300020',
      schoolName: '江戸川女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Ⅱ類(A推薦・B推薦・一般①・一般②共通枠、普通科計。帰国は若干のため未算入)', capacity: 50 },
        { courseName: 'Ⅲ類(A推薦・B推薦・一般①・一般②共通枠、普通科計。帰国は若干のため未算入)', capacity: 50 },
        { courseName: '国際英語(A推薦・B推薦・一般①・一般②共通枠。帰国は若干のため未算入)', capacity: 25 },
      ],
      totalCapacity: 125,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320900036',
      schoolName: '桜美林高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '国公立コース(推薦・併優・オープン共通枠)', capacity: 20 },
        { courseName: '特別進学コース(推薦・併優・オープン共通枠)', capacity: 30 },
        { courseName: '進学コース(推薦・併優・オープン共通枠)', capacity: 130 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311100024',
      schoolName: '大森学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特選コース(推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 20 },
        { courseName: '選抜コース(推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 40 },
        { courseName: '総進コース(推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 80 },
        { courseName: '工業(男、推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 40 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311800018',
      schoolName: '開成高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般のみ掲載)', capacity: 100 }],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310800010',
      schoolName: 'かえつ有明高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(一般、帰国生を含む)', capacity: 10 }],
      totalCapacity: 10,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200274',
      schoolName: '科学技術学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '総合コース(男、推薦・一般A日程①②・B日程共通枠)', capacity: 60 },
        { courseName: '特進コース(男、推薦・一般A日程・B日程共通枠)', capacity: 20 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311600010',
      schoolName: '学習院高等科',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般のみ掲載、約)', capacity: 20 }],
      totalCapacity: 20,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310100026',
      schoolName: '神田女学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'グローバルコース(単願推薦・併願推薦・併願優遇・一般共通枠)', capacity: 25 },
        { courseName: 'アドバンストコース(単願推薦・併願推薦・併願優遇・一般共通枠)', capacity: 25 },
        { courseName: 'キャリアデザインコース(単願推薦・併願推薦・併願優遇・一般共通枠)', capacity: 50 },
      ],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311300022',
      schoolName: '関東国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦・一般①②③共通枠、一般③は外国人生徒を含む)', capacity: 60 },
        { courseName: '外国語(推薦・一般①②③共通枠)', capacity: 120 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312300039',
      schoolName: '関東第一高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'ハイパーコース(A推薦・B推薦・一般①②共通枠)', capacity: 80 },
        { courseName: 'アドバンストコース(A推薦・B推薦・一般①②共通枠)', capacity: 240 },
        { courseName: 'アグレッシブコース(A・C推薦・B推薦・一般①②共通枠)', capacity: 200 },
        { courseName: 'アスリートコース(男、A・C推薦のみ掲載)', capacity: 80 },
      ],
      totalCapacity: 600,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700037',
      schoolName: '北里大学附属順天高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '理数選抜類型(推薦Ⅰ・Ⅱ共通枠。帰国①②は若干のため未算入)', capacity: 10 },
        { courseName: '理数選抜類型(一般①・②共通枠)', capacity: 15 },
        { courseName: '英語選抜類型(推薦Ⅰ・Ⅱ共通枠。帰国①②は若干のため未算入)', capacity: 10 },
        { courseName: '英語選抜類型(一般①・②共通枠)', capacity: 15 },
        { courseName: '特進選抜類型(推薦Ⅰ・Ⅱ共通枠。帰国①②は若干のため未算入)', capacity: 10 },
        { courseName: '特進選抜類型(一般①・②共通枠)', capacity: 30 },
      ],
      totalCapacity: 90,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311800027',
      schoolName: '北豊島高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'インスパイアリング・プログラム(女、推薦A・B共通枠)', capacity: 20 },
        { courseName: 'インスパイアリング・プログラム(女、一般)', capacity: 20 },
        { courseName: 'グローバル・プログラム(女、推薦A・B共通枠)', capacity: 25 },
        { courseName: 'グローバル・プログラム(女、一般)', capacity: 25 },
        { courseName: 'バリュアブル・プログラム(女、推薦A・B共通枠)', capacity: 25 },
        { courseName: 'バリュアブル・プログラム(女、一般)', capacity: 25 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312200012',
      schoolName: '共栄学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '未来探究コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 15 },
        { courseName: '国際共生コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 15 },
        { courseName: '理数創造コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 15 },
        { courseName: '探究特進コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 35 },
        { courseName: '探究進学コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 80 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320100089',
      schoolName: '共立女子第二高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース(女、推薦)', capacity: 20 },
        { courseName: '特別進学コース(女、一般①・②共通枠)', capacity: 15 },
        { courseName: '総合進学コース(女、推薦)', capacity: 50 },
        { courseName: '総合進学コース(女、一般①・②共通枠)', capacity: 30 },
        { courseName: '英語コース(女、推薦)', capacity: 10 },
        { courseName: '英語コース(女、一般①・②共通枠)', capacity: 5 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113321100014',
      schoolName: '錦城高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(一般①・②共通枠、推薦の掲載なし)', capacity: 120 },
        { courseName: '進学コース(推薦)', capacity: 130 },
        { courseName: '進学コース(一般)', capacity: 200 },
      ],
      totalCapacity: 450,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310100053',
      schoolName: '錦城学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(A推薦・B推薦共通枠)', capacity: 120 },
        { courseName: '普通(一般①・②共通枠)', capacity: 120 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113321500010',
      schoolName: '国立音楽大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、約)', capacity: 30 },
        { courseName: '普通(一般①、約)', capacity: 30 },
        { courseName: '音楽(推薦、約)', capacity: 40 },
        { courseName: '音楽(一般①、約)', capacity: 40 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200041',
      schoolName: '国本女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '総合進学コース(女、A推薦・B推薦・一般オープン①②共通枠、全コース計)', capacity: 75 },
        { courseName: 'ダブルディプロマコース(女、A推薦・B推薦・一般オープン①②共通枠、全コース計)', capacity: 75 },
      ],
      totalCapacity: 150,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310300024',
      schoolName: '慶應義塾女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(女、推薦、約)', capacity: 30 },
        { courseName: '普通(女、一般、約)', capacity: 70 },
      ],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310500068',
      schoolName: '京華高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学コース・特進コース(男、A推薦・B推薦・一般①②共通枠、進学・特進計)', capacity: 50 },
        { courseName: 'S特進コース(男、A推薦・B推薦共通枠)', capacity: 10 },
        { courseName: 'S特進コース(男、一般①・②共通枠、帰国生を含む)', capacity: 15 },
      ],
      totalCapacity: 75,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310500086',
      schoolName: '京華商業高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '商業(A推薦・得意技能特待・B推薦共通枠)', capacity: 70 },
        { courseName: '商業(一般①・②共通枠)', capacity: 80 },
      ],
      totalCapacity: 150,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320700010',
      schoolName: '啓明学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦特待・単願推薦・併願推薦共通枠)', capacity: 40 },
        { courseName: '普通(一般①・②共通枠)', capacity: 50 },
      ],
      totalCapacity: 90,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310500120',
      schoolName: '小石川淑徳学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別選抜コース(女、A・C推薦・B推薦・一般①②共通枠)', capacity: 40 },
        { courseName: '選抜コース(女、A・C推薦・B推薦・一般①②共通枠)', capacity: 40 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320100043',
      schoolName: '工学院大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '先進文理コース(推薦)', capacity: 30 },
        { courseName: '先進文理コース(併優・一般①②共通枠)', capacity: 40 },
        { courseName: '文理コース(推薦)', capacity: 40 },
        { courseName: '文理コース(併優・一般①②共通枠)', capacity: 30 },
        { courseName: 'インターナショナルコース(推薦)', capacity: 10 },
        { courseName: 'インターナショナルコース(併優・一般①②共通枠)', capacity: 10 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310100062',
      schoolName: '麹町学園女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '東洋大学グローバルコース(女、推薦A・B共通枠)', capacity: 40 },
        { courseName: '東洋大学グローバルコース(女、一般3教科・英語1教科共通枠)', capacity: 30 },
      ],
      totalCapacity: 70,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311500039',
      schoolName: '佼成学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '難関国公立コース・グローバルコース・総合進学コース(男、推薦・一般①②共通枠、全コース計)',
          capacity: 50,
        },
      ],
      totalCapacity: 50,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200069',
      schoolName: '佼成学園女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '留学コース・スーパーグローバルコース(女、推薦・一般①②共通枠、留学10+スーパーグローバル5)', capacity: 15 },
        { courseName: '特進コース(女、推薦・一般①②共通枠)', capacity: 35 },
        { courseName: '進学コース(女、推薦・一般①②共通枠)', capacity: 30 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311300031',
      schoolName: '國學院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦)', capacity: 130 },
        { courseName: '普通(一般①②③共通枠)', capacity: 250 },
      ],
      totalCapacity: 380,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311500048',
      schoolName: '國學院大學久我山高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、男女共通枠)', capacity: 50 },
        { courseName: '普通(一般、男、約)', capacity: 60 },
        { courseName: '普通(一般、女、約)', capacity: 35 },
      ],
      totalCapacity: 145,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200078',
      schoolName: '国士舘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '選抜クラス・進学クラス(推薦・一般①②共通枠、普通科計)', capacity: 130 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310500111',
      schoolName: '駒込高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '理系先進コース・国際教養コース・特Sコース・Sコース(推薦Ⅰ・Ⅱ・併優・一般共通枠、普通科計)',
          capacity: 120,
        },
      ],
      totalCapacity: 120,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113322500018',
      schoolName: '駒沢学園女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学クラス(女、推薦・一般①共通枠、全クラス計。一般②の若干枠は未算入)', capacity: 120 },
        { courseName: '特進クラス(女、推薦・学特・一般①共通枠、全クラス計。一般②の若干枠は未算入)', capacity: 100 },
        { courseName: '英語クラス(女、推薦・学特・一般①共通枠、全クラス計。一般②の若干枠は未算入)', capacity: 100 },
      ],
      totalCapacity: 320,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200087',
      schoolName: '駒澤大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦・併優・一般共通枠)', capacity: 250 }],
      totalCapacity: 250,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200096',
      schoolName: '駒場学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '特別進学コース・国際コース・進学コース(推薦・一般・併優共通枠、普通科計)',
          capacity: 160,
        },
        { courseName: '食物調理(推薦・一般①②共通枠)', capacity: 20 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700028',
      schoolName: '桜丘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'S(スーパーアカデミック)コース(単願推薦・併願推薦Ⅰ・Ⅱ共通枠)', capacity: 10 },
        { courseName: 'K(インターナショナルリベラルアーツ)コース(単願推薦・併願推薦Ⅰ・Ⅱ共通枠)', capacity: 10 },
        { courseName: 'A(アカデミック)コース(単願推薦・併願推薦Ⅰ・Ⅱ共通枠)', capacity: 85 },
      ],
      totalCapacity: 105,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700073',
      schoolName: 'サレジアン国際学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '本科コース(A推薦・B推薦・併優一般共通枠)', capacity: 10 },
        { courseName: 'インターナショナルコース(SG)(A推薦・B推薦・併優一般共通枠)', capacity: 10 },
        { courseName: 'インターナショナルコース(AG)(A推薦・B推薦・併優一般共通枠)', capacity: 20 },
      ],
      totalCapacity: 40,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311400012',
      schoolName: '実践学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '特別進学・リベラルアーツ&サイエンス・文理進学・スポーツサイエンスの4コース(推薦共通枠、普通科計)',
          capacity: 130,
        },
        {
          courseName: '特別進学・リベラルアーツ&サイエンス・文理進学・スポーツサイエンスの4コース(一般①②共通枠、普通科計)',
          capacity: 140,
        },
      ],
      totalCapacity: 270,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310900082',
      schoolName: '品川エトワール女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '国際キャリアコース(女、A・C推薦・一般①②共通枠)', capacity: 25 },
        { courseName: 'マルチメディア表現コース(女、A・C推薦・一般①②共通枠)', capacity: 30 },
        { courseName: '保育コース(女、A・C推薦・一般①②共通枠)', capacity: 20 },
        { courseName: 'キャリアデザインコース(女、A・C推薦・一般①②共通枠)', capacity: 75 },
      ],
      totalCapacity: 150,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310900073',
      schoolName: '品川学藝高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(A推薦・B推薦・一般併優共通枠)', capacity: 50 },
        { courseName: '音楽(A推薦・B推薦・一般併優共通枠)', capacity: 50 },
      ],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310900019',
      schoolName: '品川翔英高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '難関進学コース(推薦・一般①②共通枠)', capacity: 20 },
        { courseName: '国際ADVANCEDコース・国際STANDARDコース(推薦・一般①②共通枠)', capacity: 20 },
        { courseName: '特別進学コース(推薦・一般①②共通枠)', capacity: 70 },
        { courseName: '総合進学コース(推薦・一般①②共通枠)', capacity: 50 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310800047',
      schoolName: '芝浦工業大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦)', capacity: 25 },
        { courseName: '普通(一般)', capacity: 25 },
      ],
      totalCapacity: 50,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310300104',
      schoolName: '芝国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '最難関選抜コース(推薦・一般共通枠。帰国生1回・2回は若干のため未算入)', capacity: 5 },
        { courseName: '国際コース(推薦。帰国生1回・2回は別枠のため未算入)', capacity: 15 },
        { courseName: '国際コース(一般。帰国生1回・2回は別枠のため未算入)', capacity: 10 },
      ],
      totalCapacity: 30,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200130',
      schoolName: '下北沢成徳高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: 'GL(グローバルエデュケーション)コース・BR(ブロードエデュケーション)コースセレクトクラス・BR(ブロードエデュケーション)コース(女、単願推薦・併願推薦・一般オープン①②共通枠、普通科計)',
          capacity: 100,
        },
      ],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311000016',
      schoolName: '自由ヶ丘学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'プログレスコース(推薦・A日程併優・B日程併優・A日程一般・B日程一般共通枠)', capacity: 25 },
        { courseName: 'アドバンスコース(推薦・A日程併優・B日程併優・A日程一般・B日程一般共通枠)', capacity: 50 },
        { courseName: 'アカデミックコース(推薦・A日程併優・B日程併優・A日程一般・B日程一般共通枠)', capacity: 60 },
      ],
      totalCapacity: 135,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113322200011',
      schoolName: '自由学園高等部',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、内部進学を含む)', capacity: 60 },
        { courseName: '普通(一般、内部進学を含む)', capacity: 60 },
      ],
      totalCapacity: 120,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312200021',
      schoolName: '修徳高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進クラス(A推薦・B推薦・一般①②共通枠)', capacity: 50 },
        { courseName: '文理進学クラス(A推薦・B推薦・一般①共通枠)', capacity: 80 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311600038',
      schoolName: '十文字高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: 'リベラルアーツコース・特選コース(人文・理数)・自己発信コース(女、A推薦・B推薦・一般①②共通枠、全コース計)',
          capacity: 80,
        },
      ],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311900017',
      schoolName: '淑徳高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'スーパー特進コース(単願推薦・併願推薦①②・一般①②共通枠)', capacity: 20 },
        { courseName: '特進選抜コース(単願推薦・併願推薦①②・一般①②共通枠)', capacity: 50 },
        { courseName: '留学コース(単願推薦のみ掲載)', capacity: 20 },
      ],
      totalCapacity: 90,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311600083',
      schoolName: '淑徳巣鴨高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '選抜コース(アルティメット)(A推薦・B推薦・一般Ⅰ期・Ⅱ期共通枠)', capacity: 38 },
        { courseName: '選抜コース(プレミアム)(A推薦・B推薦・一般Ⅰ期・Ⅱ期共通枠)', capacity: 37 },
        { courseName: '選抜コース(選抜)(A推薦・B推薦・一般Ⅰ期・Ⅱ期共通枠)', capacity: 80 },
        { courseName: '特進コース(特進)(A推薦・B推薦・一般Ⅰ期・Ⅱ期共通枠)', capacity: 80 },
      ],
      totalCapacity: 235,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200103',
      schoolName: '松蔭大学附属松蔭高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、特待10・一般クラブ70)', capacity: 80 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320300014',
      schoolName: '聖徳学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '難関国公立型・文理進学型(推薦共通枠、難関国公立・文理計)',
          capacity: 30,
        },
        {
          courseName: '難関国公立型・文理進学型(一般・併優①②共通枠、難関国公立・文理計)',
          capacity: 75,
        },
        { courseName: 'データサイエンスコース(推薦・一般①②共通枠)', capacity: 25 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311900026',
      schoolName: '城北高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(男、推薦、約)', capacity: 20 },
        { courseName: '普通(男、一般、約)', capacity: 65 },
      ],
      totalCapacity: 85,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310500139',
      schoolName: '昭和第一高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(推薦Ⅰ・Ⅱ・併優・一般Ⅰ・Ⅱ共通枠)', capacity: 20 },
        { courseName: '進学コース(推薦Ⅰ・Ⅱ・併優・一般Ⅰ・Ⅱ共通枠)', capacity: 120 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320200015',
      schoolName: '昭和第一学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '英語コース(推薦・一般①②共通枠)', capacity: 14 },
        { courseName: '選抜進学コース(推薦・一般①②共通枠)', capacity: 60 },
        {
          courseName: '総合進学コース(文理進学)・総合進学コース(探究)(推薦・一般①②共通枠、総合進学コース計)',
          capacity: 200,
        },
        { courseName: 'デザインコース(推薦・一般①②共通枠)', capacity: 14 },
      ],
      totalCapacity: 288,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311600056',
      schoolName: '昭和鉄道高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '鉄道科(A・C推薦・B併願・2月併優一般共通枠)', capacity: 100 }],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311500066',
      schoolName: '女子美術大学付属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(女、推薦)', capacity: 32 },
        { courseName: '普通(女、一般)', capacity: 33 },
      ],
      totalCapacity: 65,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113321100023',
      schoolName: '白梅学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '特別選抜コース(特選国公立系)・特別選抜コース(特選文理系)(女、A推薦・B推薦・一般①②共通枠、特別選抜コース計)',
          capacity: 50,
        },
        { courseName: '選抜コース(選抜文理系)(女、A推薦・B推薦・一般①②共通枠)', capacity: 35 },
        { courseName: '進学コース(進学文理系・保育教育系)(女、A推薦・B推薦・一般①②共通枠)', capacity: 55 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311600065',
      schoolName: '巣鴨高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般のみ掲載、約)', capacity: 70 }],
      totalCapacity: 70,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311500011',
      schoolName: '杉並学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '特別進学コース・総合進学コース(推薦共通枠、特別・総合計)',
          capacity: 120,
        },
        {
          courseName: '特別進学コース・総合進学コース(一般①②共通枠、特別・総合計)',
          capacity: 280,
        },
      ],
      totalCapacity: 400,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700055',
      schoolName: '駿台学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '特選コース・進学コース(推薦A・併願推薦B共通枠、特選・進学計)',
          capacity: 110,
        },
        {
          courseName: '特選コース・進学コース(併優・一般①②③共通枠、特選・進学計)',
          capacity: 130,
        },
        { courseName: 'スペシャリストコース(ハイブリッド・オリジナル)(推薦)', capacity: 40 },
        { courseName: 'スペシャリストコース(ハイブリッド・オリジナル)(一般)', capacity: 20 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700064',
      schoolName: '聖学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'グローバルイノベーションクラス(男、推薦)', capacity: 5 },
        { courseName: 'グローバルイノベーションクラス(男、一般、内併願優遇5)', capacity: 10 },
      ],
      totalCapacity: 15,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320300032',
      schoolName: '成蹊高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、単願、約)', capacity: 25 },
        { courseName: '普通(一般、約)', capacity: 60 },
      ],
      totalCapacity: 85,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310400032',
      schoolName: '成女高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(女、推薦特待・A・B・一般①②共通枠)', capacity: 50 },
      ],
      totalCapacity: 50,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200121',
      schoolName: '成城学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、約)', capacity: 20 },
        { courseName: '普通(一般、約)', capacity: 40 },
      ],
      totalCapacity: 60,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310300060',
      schoolName: '正則高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦A・B共通枠)', capacity: 160 },
        { courseName: '普通(一般①)', capacity: 120 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310100071',
      schoolName: '正則学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、A推薦・B推薦・一般共通枠)', capacity: 125 }],
      totalCapacity: 125,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320100016',
      schoolName: '聖パウロ学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(グローバル・セレクティブクラス、推薦)', capacity: 30 },
        { courseName: '普通(グローバル・セレクティブクラス、一般①②共通枠)', capacity: 50 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700082',
      schoolName: '成立学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '特進コース・総合コース(推薦単願・併願・一般共通枠、特進・進学計)',
          capacity: 130,
        },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310900046',
      schoolName: '青稜高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(一般A[オープン]・一般B[併優]共通枠。帰国11月・1月は若干のため未算入)', capacity: 130 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200149',
      schoolName: '世田谷学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(男、推薦[スポーツ])', capacity: 12 },
        { courseName: '普通(男、一般[スポーツ])', capacity: 13 },
      ],
      totalCapacity: 25,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311500075',
      schoolName: '専修大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦)', capacity: 200 },
        { courseName: '普通(一般)', capacity: 200 },
      ],
      totalCapacity: 400,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113321100032',
      schoolName: '創価高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、約)', capacity: 65 },
        { courseName: '普通(一般、約)', capacity: 70 },
      ],
      totalCapacity: 135,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320400022',
      schoolName: '大成高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース(推薦)', capacity: 5 },
        { courseName: '特別進学コース(一般①)', capacity: 60 },
        { courseName: '特別進学コース(一般②)', capacity: 10 },
        { courseName: '文理進学コース(推薦)', capacity: 110 },
        { courseName: '文理進学コース(一般①)', capacity: 130 },
        { courseName: '文理進学コース(一般②)', capacity: 50 },
        { courseName: '情報進学コース(推薦)', capacity: 10 },
        { courseName: '情報進学コース(一般①)', capacity: 20 },
        { courseName: '情報進学コース(一般②)', capacity: 10 },
      ],
      totalCapacity: 405,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200167',
      schoolName: '大東学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦)', capacity: 135 },
        { courseName: '普通(公立併願優遇・一般①②共通枠)', capacity: 135 },
      ],
      totalCapacity: 270,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311900035',
      schoolName: '大東文化大学第一高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学クラス(推薦A・B・C共通枠)', capacity: 20 },
        { courseName: '特別進学クラス(一般①・②共通枠)', capacity: 15 },
        {
          courseName: '選抜進学クラス・進学クラス(推薦A・B・C共通枠、選抜・進学計)',
          capacity: 155,
        },
        {
          courseName: '選抜進学クラス・進学クラス(一般①・②共通枠、選抜・進学計)',
          capacity: 160,
        },
      ],
      totalCapacity: 350,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700091',
      schoolName: '瀧野川女子学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '特進選抜クラス・特進コース・進学コース(女、A推薦・B推薦・一般併優共通枠、普通科計)',
          capacity: 135,
        },
      ],
      totalCapacity: 135,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113322300010',
      schoolName: '拓殖大学第一高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(推薦Ⅰ・Ⅱ共通枠)', capacity: 40 },
        { courseName: '特進コース(一般Ⅰ・Ⅱ共通枠)', capacity: 60 },
        { courseName: '進学コース(推薦Ⅰ・Ⅱ共通枠)', capacity: 120 },
        { courseName: '進学コース(一般Ⅰ・Ⅱ共通枠)', capacity: 180 },
      ],
      totalCapacity: 400,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320200024',
      schoolName: '立川女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '総合コース(女、推薦)', capacity: 125 },
        { courseName: '総合コース(女、一般)', capacity: 125 },
        { courseName: '特別進学コース(女、推薦)', capacity: 25 },
        { courseName: '特別進学コース(女、一般)', capacity: 25 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320900045',
      schoolName: '玉川学園高等部',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '一般クラス(専願優遇・併願優遇・オープン共通枠、程度)', capacity: 80 }],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200176',
      schoolName: '玉川聖学院高等部',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(女、推薦、約)', capacity: 40 },
        {
          courseName: '普通(女、一般Ⅰ・Ⅱ・Ⅲ①②・Ⅳ①②共通枠、約)',
          capacity: 80,
        },
      ],
      totalCapacity: 120,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113322400028',
      schoolName: '多摩大学附属聖ケ丘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(一般のみ掲載、約)', capacity: 20 }],
      totalCapacity: 20,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311000061',
      schoolName: '多摩大学目黒高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦)', capacity: 30 },
        { courseName: '普通(一般①・②共通枠)', capacity: 120 },
      ],
      totalCapacity: 150,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310800029',
      schoolName: '中央学院大学中央高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦・併優一般共通枠)', capacity: 25 },
        { courseName: '商業(推薦・併優一般共通枠)', capacity: 25 },
      ],
      totalCapacity: 50,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310500013',
      schoolName: '中央大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(昼間定時制、推薦、男女共通枠)', capacity: 25 },
        { courseName: '普通(昼間定時制、一般、男女共通枠)', capacity: 70 },
      ],
      totalCapacity: 95,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311500084',
      schoolName: '中央大学杉並高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(一般公募推薦)', capacity: 130 },
        { courseName: '普通(帰国)', capacity: 20 },
        { courseName: '普通(一般)', capacity: 150 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_TOKYO_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D113310100035',
      schoolName: '暁星高等学校',
      reason: '完全中高一貫校で高校からの外部募集を実施していないため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100017',
      schoolName: '大妻高等学校',
      reason: '完全中高一貫校で高校段階での外部からの入学募集を実施していないため(Wikipedia等の確認)',
    },
    {
      schoolCode: 'D113310100124',
      schoolName: '雙葉高等学校',
      reason: '女子御三家の一角で高校では生徒を募集しない完全中高一貫方式のため(Wikipedia等の確認)',
    },
    {
      schoolCode: 'D113310100044',
      schoolName: '共立女子高等学校',
      reason: '2006年度(平成18年度)に高校募集を停止し中高完全一貫としているため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100133',
      schoolName: '三輪田学園高等学校',
      reason: '高校からの外部募集を実施していないため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100151',
      schoolName: '女子学院高等学校',
      reason: '女子御三家の一角で完全中高一貫校のため高校からの入学を受け付けていないため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100160',
      schoolName: '白百合学園高等学校',
      reason: '高校からの外部募集は行われておらず中学からの内進生のみのため(WebSearch要約による確認)',
    },
  ],
};
