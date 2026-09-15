# T-Y14 47都道府県「学校・学科別入学者選抜評価方法」構造化一覧の存在調査（台帳・進行中）

- 目的: `ops/tasks/T-Y14-nyuushi-hyoka-hoho-db.md` §「作業の順序」ステップ2（47都道府県で
  構造化一覧の有無を探索し台帳化）の実行記録。
- ⚠️これは**存在確認パス**（WebSearchの要約・検索結果タイトルからの一次判定）であり、
  PDF本文の内容確認（pdftoppm目視・具体的な数値抽出）はまだ行っていない。データ層実装
  （`src/data/school-selection-methods/<pref>.ts`）に進む前に、各県ごとに改めて一次資料へ
  WebFetch/pdftoppmで当たり直すこと（Y-0「1データ点1出典」は要約ではなく本文確認を要求する）。
- 判定区分:
  - **structured**: 学校別（または学科別）の評価方法・比率・傾斜配点を一覧できる county-wide
    の公式資料（PDF・専用ページ）が存在すると確認できた
  - **individual**: 学校ごとのページを個別に開かないと分からない（＝47都道府県×数百校の
    巡回コストが発生する）
  - **uncertain**: 公式ページ・要項の存在は確認できたが、学校別一覧の構造まではこの回の
    検索で確認しきれなかった（次回、要項PDF自体を直接確認する）

## 台帳（2026-09-15時点・8/47県）

| 県 | 判定 | 根拠 |
|---|---|---|
| tokyo | structured | 着手前ゲートで確認済み。press releaseページ添付の複数PDF（別表4/5/6相当）で学校別実技検査内容・特別推薦選抜方法を公表（`kyoiku.metro.tokyo.lg.jp/information/press/2025/09/2025092502`） |
| osaka | structured | 着手前ゲートで確認済み。単一PDF「アドミッションポリシー並びに学力検査問題の種類並びに学力検査の成績及び調査書の評定にかける倍率のタイプ」で全府立高校を一覧（`pref.osaka.lg.jp/documents/106331/r08_admission_koukou.pdf`・R6〜R8の複数年度分あり） |
| akita | individual | 着手前ゲートで確認済み。県単位一覧なし。各校が「求める生徒の姿及び選抜方法」を9月30日までに個別公表（`pref.akita.lg.jp/pages/genre/15415`） |
| kanagawa | structured(見込み) | 県公式ページ「令和９年度神奈川県公立高等学校入学者選抜選考基準及び特色検査の概要」(`pref.kanagawa.jp/docs/dc4/nyusen/nyusen/senko_kijun.html`)というタイトル自体が学校ごとの選考基準を指しており構造化の可能性が高い。★次回PDF本文で学校別配点の実例を確認すること |
| saitama | structured(見込み) | 県公式ページ「令和８年度埼玉県公立高等学校入学者選抜における各高等学校の選抜基準」(`pref.saitama.lg.jp/f2208/r8senbatsu-kijun.html`)というタイトルが「各高等学校の」選抜基準と明記＝学校別一覧が強く示唆される。★次回本文確認 |
| chiba | structured(見込み) | 県公式ページ「令和8年度千葉県公立高等学校「一般入学者選抜」の検査の内容等」(`pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/r8zennichi.html`)＋「学校設定検査の内容等」PDFで、傾斜配点を用いる学校（船橋理数・柏理数等8校8学科）を具体的に列挙できている（リセマム記事で二次確認済み）。★次回一次PDF本文確認 |
| hyogo | uncertain→individual(見込み) | `www2.hyogo-c.ed.jp/hpe/koko/nyuushi`をWebFetchで確認したが学校別選抜方法の一覧・PDFへのリンクは見当たらなかった。「各県立学校一覧のページや個別学校のホームページで確認する必要がある」との示唆。★次回、要綱本体PDF内部（別表相当）まで確認してから最終判定する |
| fukuoka | uncertain | 「令和8年度福岡県立高等学校入学者選抜要項」PDF(`pref.fukuoka.lg.jp/uploaded/attachment/268332.pdf`・1.6MB)を確認したがWebFetchではテキスト抽出不能（暗号化）。69〜74頁に「入学定員等一覧表」はあるが傾斜配点・面接実施の一覧の有無は確認できていない。★次回pdftoppmで該当ページを目視確認する（ページ数が多いため範囲指定が必要） |
| hokkaido | structured | 北海道教育委員会が2026-06-15に「学校裁量についての実施予定一覧表」を公表（リセマム記事で二次確認・傾斜配点実施12校12学科の具体例=札幌北(数学・英語×2.0)等を列挙）。県単位で毎年公表される定型の一覧と判明。★次回一次PDFのURLを確認 |
| aomori | structured | 公式ページ`pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/R08motomeru.html`が「令和8年度青森県立高等学校入学者選抜における求める生徒像・選抜方法等一覧」を掲載。R06版PDF(`files/R06motomeru.pdf`)の存在も確認＝毎年更新される定型一覧で多年度追跡可能 |
| miyagi | structured | 公式ページ`pref.miyagi.jp/site/sub-jigyou/kyo-r9-senbatsuhouhoutou.html`「選抜方法等一覧」が地区別（刈田柴田・伊具・仙台南等）に整理され学校名から個別選抜方法へリンクする構造。県単位で一覧化されたポータルとして構造化ありと判定 |
| ibaraki | structured | 「令和7年度茨城県立高等学校入学者選抜実施細則」に別表1「高等学校別入学者選抜実施方法」・別表4「実技検査課題等」が掲載と確認（`kyoiku.pref.ibaraki.jp`）。別表番号まで明示された学校別一覧 |
| tochigi | structured(見込み) | 学力検査:調査書比率が9:1〜5:5と学校ごとに異なり、宇都宮高・宇都宮女子高・栃木高の傾斜配点教科まで具体的に判明（三次情報だが具体性が高い）。★次回、栃木県教育委員会一次資料で学校別一覧の形式を確認する |
| iwate | structured(見込み) | 「岩手県立高等学校入学者選抜」公式ポータル(`www2.iwate-ed.jp/sed/`)があり、傾斜配点実施校（盛岡第四・南昌みらい・盛岡商業・水沢農業・水沢商業等）が具体的に判明。★次回、同ポータル内の一覧PDFの所在を確認する |
| yamagata | structured(見込み) | 山形県教育委員会の「実施要項」PDF（R04版・R08版とも公式URL確認済み・`pref.yamagata.jp/documents/...`）に「各教科の評定と学力検査の成績の比率」が記載されると判明。多年度分（R4/R8）のPDFが既に見つかっており継続入手性は高い。★次回、要項PDF内部が学校別一覧形式かpdftoppmで確認する |
| fukushima | structured | 福島県教育委員会が「令和9年度 各高等学校の選抜方法一覧」という名称そのものの資料を公開（塾選ジャーナル記事で確認・`pref.fukushima.lg.jp/site/edu/r7koukounyushi.html`等の公式年度別ページも存在）。前期/後期/連携型/外国人特別枠まで区分された県内全校の一覧と判明 |
| gunma | structured | 群馬県教育委員会が「令和8年度群馬県公立高等学校入学者選抜における各高等学校の「選抜方法等」について」を公式公開（PDF3.84MB・`pref.gunma.jp/site/kyouiku/714649.html`）。R6/R7/R8の3年度分のページが存在し多年度追跡可能。タイトルに「各高等学校の」と明記 |
| niigata | structured(見込み) | 新潟県教育委員会の入学者選抜情報ページ(`pref.niigata.lg.jp/sec/kotogakko/nyugakushasenbatsu.html`)経由で、傾斜配点実施9学科・調査書:学力検査比率7:3〜3:7が学校学科ごとに設定と判明する程度の具体性。★次回、一次PDF(`uploaded/attachment/407217.pdf`等)で学校別一覧の形式を確認する |
| toyama | structured(見込み) | 富山県教育委員会公式サイト(`kengaku.tym.ed.jp/archives/category/exam-release`)にR6/R7/R8のPDF発表資料あり。傾斜配点実施校（富山北部・呉羽の2校）が具体的に判明。★次回一次PDFの一覧形式を確認する |
| ishikawa | structured(見込み) | 「令和８年度石川県公立高等学校入学者募集要綱」PDF(`pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/documents/r8bosyuyoko.pdf`)を確認。2教科まで傾斜配点可能な高校・学科があると判明。★次回、要綱内の学校別一覧部分をpdftoppmで確認する |
| fukui | structured(見込み) | 公式ポータル`pref.fukui.lg.jp/doc/koukou/nyugaku/koukounyushi.html`から、学力検査の選択問題(A/B)や面接実施校が学校ごとに公表されると判明（「福井県教育委員会のWebサイトでご確認ください」という誘導文言の存在が一覧ページの存在を示唆）。★次回、具体的な一覧ページ・PDFのURLを特定する |
| yamanashi | structured | 直接発見した公式PDF「令和５年度山梨県公立高等学校入学者選抜における前期募集選抜方法等一覧」(`pref.yamanashi.jp/documents/7061/r5zenki_ichiran.pdf`)が、学科・特色適性検査の比率[%]・個別/集団面接時間・調査書の列を持つ表形式そのもの。タイトルに「一覧」と明記された最も強い部類の構造化資料 |
| nagano | structured | 公式ページ「令和８年度長野県公立高等学校入学者選抜における学校別実施内容」(`pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/r8naiyo.html`)が、学校・学科別の面接種類・傾斜配点教科と倍率を掲載。R7/R8の年度別ページが確認済みで多年度追跡可能。タイトルに「学校別実施内容」と明記 |
| gifu | structured | 「各高等学校の実施概要一覧」という名称の資料が例年6〜7月ごろに公式公開されると判明（岐阜県教育委員会公式サイト`pref.gifu.lg.jp/site/edu/`配下）。加納高校音楽科・美術科のみ実技試験等、具体例も判明。タイトルに「一覧」と明記 |
| shizuoka | structured | 「学校裁量枠において重視する観点及び選抜方法の概要等」という名称の資料で一覧表が公式提供されると確認（静岡県公式サイト`pref.shizuoka.jp`）。学校裁量枠(定員の50%以内)の重視観点・独自検査内容が学校ごとに一覧化されている |
| mie | uncertain | 「令和７年度三重県立高等学校入学者選抜学力検査問題等」等の年度別公式ページ(`pref.mie.lg.jp/KOKOKYO/HP/...`)は存在するが、学校別の傾斜配点・検査内容の一覧構造は今回の検索では確認できなかった。★次回、該当ページ内部を確認する |
| shiga | individual(見込み) | 公式ページ「県立高校入試情報」(`pref.shiga.lg.jp/edu/nyuushi/high/`)は「各高校のウェブサイトへのリンク一覧」という説明のされ方であり、県単位の集約表ではなく学校ごとのページへの入口である可能性が高い。★次回、実際にリンク一覧のページを開いて集約表の有無を確認する |
| kyoto | structured(見込み) | 「高校・学科ごとの検査項目と配点比率は事前に公表される」（令和7年度で傾斜配点30%の具体例あり）という記述から県単位の公表資料が存在すると推定。★次回、`kyoto-be.ne.jp`で該当PDFを特定する |

## 次回の続き

残り19県（未着手・28/47完了）。次回セッションは残りの都道府県（
愛知・奈良・和歌山・鳥取・島根・
岡山・広島・山口・徳島・香川・愛媛・高知・佐賀・長崎・熊本・大分・宮崎・鹿児島・沖縄）を
バッチで進める。hyogo/fukuoka/mie/shigaは一次資料の追加確認がまだ残っている
（mie/shigaは今回uncertain/individual見込みで新規に追加）。

## 中間集計（15/47県時点）

structured(見込み含む) = tokyo/osaka/kanagawa/saitama/chiba/hokkaido/aomori/miyagi/ibaraki/tochigi
の10県。individual = akita/hyogo(見込み)の2県。uncertain = fukuokaの1県。
**現時点でstructuredの比率が高く（10/13確定分）、47都道府県横断でも「県単位の構造化一覧」が
標準的なパターンである可能性が高いという傾向が見えてきた**（T-Y14着手前ゲートの想定より
好感触）。ただし全て見込み・要約段階の判定であり、データ層実装前に一次資料本文の確認が必須。
