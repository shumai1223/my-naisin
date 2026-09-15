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

## 次回の続き

残り32県（未着手）。次回セッションは残りの都道府県（岩手・山形・福島・群馬・新潟・
富山・石川・福井・山梨・長野・岐阜・静岡・愛知・三重・滋賀・京都・奈良・和歌山・鳥取・島根・
岡山・広島・山口・徳島・香川・愛媛・高知・佐賀・長崎・熊本・大分・宮崎・鹿児島・沖縄）を
バッチで進める。hyogo/fukuokaは一次PDF本文の目視確認（pdftoppm）がまだ残っている。

## 中間集計（15/47県時点）

structured(見込み含む) = tokyo/osaka/kanagawa/saitama/chiba/hokkaido/aomori/miyagi/ibaraki/tochigi
の10県。individual = akita/hyogo(見込み)の2県。uncertain = fukuokaの1県。
**現時点でstructuredの比率が高く（10/13確定分）、47都道府県横断でも「県単位の構造化一覧」が
標準的なパターンである可能性が高いという傾向が見えてきた**（T-Y14着手前ゲートの想定より
好感触）。ただし全て見込み・要約段階の判定であり、データ層実装前に一次資料本文の確認が必須。
