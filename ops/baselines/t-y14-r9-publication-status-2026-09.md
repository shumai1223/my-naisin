# T-Y14 令和9年度(R9)選抜方法資料の公表状況台帳(2026-09-20時点)

T-Y14のDBのうちR8のまま残る県について、R9資料の公表有無を確認した記録。**URLが200でも公表済みとは限らない**(福岡は200だが『10月下旬に公表予定』)。
確認方法: 各県のR8ソースがHTMLページの県はそのページを取得し『令和9年度』リンクを抽出。PDF直リンクの県は年度文字列の置換(r8→r9)を試したが多くは404(=命名規則が違うだけで未公表の証拠ではない)。

## R9へ更新済み(18県・2026-09-20時点。chiba/ehime/nagano/naraは同日更新)
aichi / chiba / ehime / fukui / gifu / kanagawa / miyagi / nagano / saitama(2026-09-20更新・全面再構築) / oita(2026-09-20更新・推薦のみ・欄空き0) / okayama(2026-09-20更新・差分パッチ) / hiroshima(2026-09-20更新・頁3のみ) / tochigi(2026-09-20更新・全面置換) / miyazaki(2026-09-20更新) / mie(2026-09-20更新) / nara(2026-09-20更新) / niigata / okinawa / shimane / shizuoka / yamanashi

## R9公表を確認したがDB未更新
| 県 | R9資料 | 備考 |
|---|---|---|
| ~~nara~~(更新済み・追記90) | `https://www.pref.nara.lg.jp/n167/p122015.html`(令和9年度入学者選抜概要・更新2026-07-07)。一次選抜一覧【第1希望校】`documents/24281/31_r9gaiyou_ichiji_ichiran_dai1.pdf`(5頁)・【第2希望校】`32_..._dai2.pdf`(3頁)・二次選抜一覧`33_r9gaiyou_niji_ichiran.pdf`(3頁)・調査書の取扱い`24_r9gaiyou_chousasho.pdf` | R8は238レコード(ops/baselines/nara-transcription)。R9は**口頭試問の列が追加**されており、行内の学科(コース)が縦に並ぶ複雑な表=pdftotext -layoutのトークン突合(LCS)は失敗(R8の全フィールド展開とR9の可視トークンが対応しない)。**bbox座標抽出(ehime-r9と同手法)で列を確定してから突合する**。合格人数枠は『10月頃に発表する正式な募集人員で変更の可能性』と注記あり |
| iwate | `.../senbatsu/1086539.html`(令和9年度入学者選抜日程・更新2026-06-15)のみ。**実施概要は未公表**(R8概要は令和7年10月24日更新=R9も10月頃の見込み) | 10月以降に再確認 |
| ~~saitama~~(更新済み・追記95) | **公表済み(制度が変わった)**: `https://www.pref.saitama.lg.jp/f2208/r9nyuushi-senbatsuzisshinaiyou.html`(令和9年度 各高等学校の選抜実施内容・確定版・2026-05-29掲載)。概要一覧: `documents/277139/1_r9_kyoutsuu.pdf`(共通選抜のみ・8頁)/`2_r9_tokusyoku.pdf`(特色選抜のみ・5頁)/`3_r9_tokusyoku_kyoutsuu.pdf`(両方・1頁)+学校別個票約165PDF | R8(`saitama.ts`・159レコード・第1〜3次選抜の割合+調査書基本方針)とは表の構成が別物(全校で面接・第1次/第2次の選抜資料配点・第2志望・学校選択問題)=**新スキーマで作り直す**。概要一覧はpdftotextで読める |
| ~~mie~~(更新済み・追記91) | `/common/04/ci600017179.htm`→資料6(別表4)`001264584.pdf`・資料7(別表5)`001264585.pdf` | R8→R9の実差分6点 |
| ~~miyazaki~~(更新済み・追記93) | 『令和9年度県立高等学校生徒募集(令和9年春入学生)について』`/kokokyoiku/kyoikukosodate/kyoiku/20260519170532.html` | 未取得(R8のURLは20250618の日付ページ) |

| ~~oita~~(更新済み・追記99・推薦のみ) | **公表済み**: 推薦入学者選抜【第2期公表分】`https://www.pref.oita.jp/site/gakkokyoiku/r09suisen2.html`(2026-08-31更新・学校学科別PDF88本・`/uploaded/life/2352031_*_misc.pdf`・一覧はops/baselines/oita-r9/pdf-list.tsv)。第1期公表分`r09suisen1.html`は取得時404(掲載変更の可能性)。`r09suisen.html`(2026-05-22)は『推薦入試の内容を一部変更』の告知 | R8と同数の88本(2頁・pdftotextで読める)だが**推薦入試の内容が変更**されており(調査書点基準・募集人員に『内地域活性化枠』等)、縦書きラベルが混ざるため-layoutの単純抽出は失敗(比重合計が100にならない行が27)。bbox座標抽出で再構築する |
| tokyo | **公表済み(直近)**: 令和9年度東京都立高等学校入学者選抜実施要綱・同細目(発表2026-09-17)`https://www.kyoiku.metro.tokyo.lg.jp/information/press/2026/09/2026091703`。R8は`20250925_n2_10`(2025-09-25) | 未取得。R8→R9差分の確認が必要 |

## PDF直リンク県のハブ調査(2026-09-20・1回目=4県)
- ~~okayama~~(**更新済み・追記106**): **公表済み**。`https://www.pref.okayama.jp/site/255/1044713.html`(令和9年度実施大要・2026-08-31更新)。学校別実施内容一覧(別表1・7頁・テキスト層あり)=`/uploaded/life/1054574_10218770_misc.pdf`、実施大要=`/uploaded/life/1054574_10218771_misc.pdf`。DBはR8(259レコード)のまま。R8(`1054600_10219031_misc.pdf`)とR9をpdftotext -rawで比較すると差分は各約60行(玉野普通の特別選抜15%→20%+検査追加・笠岡普通の特別選抜に検査追加・勝間田50%→80%・操山普通の一般選抜◎新設・工学系の実績欄の文言等)=**全面再構築でなく差分レコードのパッチで足りる見込み**。
- ~~hiroshima~~(**頁3を更新済み・追記108**): **公表済み**。目次`https://www.pref.hiroshima.lg.jp/site/kyouiku/09senior-2nd-r9-nyuushi-r9-kou-r9-kou-mokuji-r9-kou-mokuji.html`(更新2026-09-18)から『入学者選抜の実施内容』ページ(`/site/kyouiku/09senior-2nd-r09-nyuushi-r09-kou-r09-kou-jisshinaiyou-r09-kou-jisshinaiyou-mokuji.html`)。DBはR8(90レコード・頁3のみ)のまま。**2026-09-20調査(追記107)**: R8の実施内容一覧表(`646901.pdf`・8頁縦)に相当するR9資料は`https://www.pref.hiroshima.lg.jp/uploaded/attachment/678267.pdf`(8頁・横向き・更新2026-08-17・同じ『実施内容一覧表』)。別に学校別の実施内容シート冊子(全日制広島市ほか=`678268.pdf`(2)-1・福山市ほか=`679531.pdf`(2)-2 等・二次選抜=(2)-4〜)も公表。R8との比較で**頁3のトークン差42種**(広島市立広島工業が『ものづくり探究科(機械・電気・建築)/情報デザイン探究科(情報工学・デザイン工学)/自動車探究科』に再編・二次選抜の欄構成が変わる)=**差分パッチでなく頁3の再抽出が必要**。
- **osaka**: 令和9年度は`https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r09_senbatsu.html`に『入学者選抜方針』等。R8の実施要項は令和7年10月16日公表だったため**R9の実施要項は10月中旬の見込み**=10月に再確認。
- **hokkaido**: 時事通信の『令和9年度試験の実施要領』は**教員採用試験**の記事で無関係。道立高校の令和9年度選抜の手引は未確認(R8の手引は`https://www.dokyoi.pref.hokkaido.lg.jp/hk/gks/201495.html`)=10月以降に再確認。
- 残り(調査済み・詳細は下の2回目): aomori / fukushima / gunma / ibaraki / kagoshima / kochi / tochigi / toyama / yamagata / yamaguchi。

## PDF直リンク県のハブ調査(2026-09-20・2回目=残り10県。WebSearchでURL特定→◎はページ取得で裏取り済み・○は検索結果のみ)
- ◎**aomori**: **公表済み**。『令和9年度青森県立高等学校入学者選抜における求める生徒像・選抜方法等一覧』`https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/R09motomeru.html`(更新2026-07-09・全県版PDF約1.4MB+6地区版)。DBはR9へ更新済み(2026-09-20・177レコード・追記111)。
- ◎**fukushima**: **公表済み**。`https://www.pref.fukushima.lg.jp/site/edu/r9koukounyushi.html`に『各高等学校の選抜方法一覧』(2026-07-14)=`/uploaded/attachment/763363.pdf`・資料の見方=`760972.pdf`・基本方針(2026-09-11)=`762203.pdf`。DBはR9へ更新済み(2026-09-20・444レコード・追記112)。
- ○**yamagata**: 公表済みとみられる。`https://www.pref.yamagata.jp/700013/koko/r9nyuugakusyasennbatsu.html`(令和9年度入学者選抜情報)+前期(特色)選抜の各校概要(例: 東学区`2026r9nyuugakusyajouhoueast.html`)。DBはR9へ更新済み(2026-09-20・138レコード・追記116)。
- ○**yamaguchi**: 実施大綱が公表済み(`https://www.pref.yamaguchi.lg.jp/site/kyouiku/353652.html`・2026-07-07)。各校の選抜方法・特色選抜の要件・くくり募集の概要を含むとの記載。DBはR9へ更新済み(2026-09-20・193レコード・追記113)。
- ○**gunma**: 実施大綱`https://www.pref.gunma.jp/site/kyouiku/754234.html`(更新2026-05-01)と『各校の選抜方法等』(検索要約では2026-08-03公開・URL未特定)。DBはR9へ更新済み(2026-09-20・158レコード・追記115)。各校の選抜方法等=766806.html→708864.pdf。
- ~~tochigi~~(**更新済み・追記110**): 『令和9(2027)年度栃木県立高等学校入学者選抜要項』`https://www.pref.tochigi.lg.jp/m04/r08/r9nyuugakusyasennbatsusyoukou.html`(2026-04-02決定)。**制度変更あり: 特色選抜の割合上限が現行30%程度→50%に引き上げ・学力検査と独自検査の実施**=R8のDB(216レコード)の特色選抜レコードに影響。実施細則の確定版は8月下旬公表予定(要確認)・各校特色選抜の一覧`tochigi-edu.ed.jp/.../7421`(入試情報)は学校側。**優先度高(制度変更のため)**。
- ×**ibaraki**: R9は日程・リーフレット(`https://kyoiku.pref.ibaraki.jp/post-40694/`)のみ。実施要項はR8が`youkou2026`=R9の要項は未確認(10月頃の見込み)。
- ×**kagoshima**: R9は日程(`.../r9nittei.html`)と入試情報ページ(`koukou02.html`)のみ。実施要綱は未確認(R8は`r7/r8youkou.html`=前年度中に公表された前例あり・要再確認)。
- ×**kochi**: R9ページ`https://www.pref.kochi.lg.jp/doc/2026011400217/`は日程・定員・出題方針。選抜方法(取扱要項)は未確認。
- ×**toyama**: R9は日程の発表資料(`https://www.kengaku.tym.ed.jp/archives/1917`)のみ。実施要領は未確認。



## 探索結果(2026-09-20・WebSearchでURL特定→ページ取得で裏取り。検索要約は根拠にしない)
- **nagasaki**: 入試ハブ(`.../koko-nyushi/`)に令和9年度リンク無し。令和9年度『入学者選抜の基本方針』PDF(`/fs/1/5/3/2/2/_/R9______________.pdf`)のみ確認=**実施要領は未公表**。
- **saga**: 令和9年度は選抜実施日程のみ(`kiji003119218`)。新制度は令和10年度から(リーフレット掲載済み)=**R9の実施要項は未確認**。
- **tottori**: ハブ(`76404.htm`)に令和9年度の高校ガイド(`R09_koukou_guide.pdf`)と県外生徒募集の案内のみ=**選抜実施要項は未確認**。
- **wakayama**: 令和8年度までの実施要項ページのみ(検索・ハブとも令和9年度なし)=**未公表**。
- **tokushima**: 検索では令和8年度以前のみ=**未確認**(入試情報サイト`nyuushi.tokushima-ec.ed.jp`の令和9年度ページは未特定)。
- **tokyo**: 実施要綱・同細目2026-09-17発表(別表`20260916_r9_10〜17`)=公表済み。R8 tokyo.tsは別表10・11・12・13・14・16(39頁の文化・スポーツ等特別推薦)・17まで収録した1104レコード級=**全表の突合が必要な重量級**(別表10は推薦枠割合9校で20→22%を確認済み・追記97)。

## 未公表(確認済み)
- fukuoka: `https://www.pref.fukuoka.lg.jp/site/kyouiku/09youkou.html`(令和９年度福岡県立高等学校入学者選抜要項)は200だが本文は『**10月下旬に公表予定です**』のみ(更新2026-06-26)。**10月下旬以降に再確認**。

## 未確認(ハブ調査が必要)
PDF直リンクの県: aomori / fukushima / gunma / hiroshima / hokkaido / ibaraki / kagoshima / kochi / okayama / osaka / tochigi / toyama / yamagata / yamaguchi(r8→r9置換は aomori/kagoshima/kochi/osaka/tochigi/toyama/yamagata で404)。
HTMLだがR9言及なし: nagasaki / oita / saga / saitama / tokushima / tokyo / tottori / wakayama(各R8ページに令和9年度へのリンクが無い=別ページで公表される可能性。県の入試トップから辿る)。
