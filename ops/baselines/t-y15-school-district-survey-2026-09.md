# T-Y15 47都道府県「学区（通学区域）＋学区外就学条件」構造化一覧の存在調査（台帳・進行中）

- 目的: `ops/tasks/T-Y15-gakku-tsugaku-kuiki-db.md` §「作業の順序」ステップ2（47都道府県で
  構造化一覧の有無を探索し台帳化）の実行記録。T-Y14の同種台帳（
  `ops/baselines/t-y14-selection-method-survey-2026-09.md`）と同じ方式。
- ⚠️これは**存在確認パス**（WebSearch要約からの一次判定）であり、PDF本文の内容確認は
  まだ行っていない。データ層実装（`src/data/school-districts/<pref>.ts`）に進む前に、
  各県ごとに改めて一次資料へWebFetch/pdftoppmで当たり直すこと。
- 判定区分は T-Y14 と同一（structured / individual / uncertain）。
- 対象は「学区制度そのもの」と「学区外就学条件」の両方を扱う county-wide 資料の有無。
  全県1学区（学区制度なし）を公式に明記しているだけの県も`structured`として扱ってよい
  （「制度なし確認済み」自体が構造化された1データ点であるため）。

## 台帳（2026-09-16時点・3/47県）

| 県 | 判定 | 根拠 |
|---|---|---|
| saga | structured | 着手前ゲートで確認済み。県教委公式ページ「県立高校の通学区域の変更についてお知らせします」(`pref.saga.lg.jp/kyouiku/kiji00332945/index.html`)で学区再編の経緯・学区外枠20%・特例地域を具体記載。ただし2023年度に全県1区化した後続の報道もあり、実装時は最新版を取り直すこと |
| aichi | structured | 着手前ゲートで確認済み。`aichi-school-navi.aichi-c.ed.jp/school/pdf/list.pdf`が学区/群/グループを校名単位で一覧化＋学区外通学可能校の特例表まで収録。ただし市郡名は令和3年9月現在とやや古い |
| tottori | uncertain | ゲート時は複数の学習塾サイトが「全県一学区」と述べているのみで一次資料未確認（2/3基準に達したため確認を省略していた）。★次回`pref.tottori.lg.jp`で一次資料を確認する |
| tokyo | structured | 2003年度入試から学区制を完全廃止し「全都一学区」（都内どこからでも出願可）と複数の三次情報で一致。★次回、東京都教育委員会一次資料での「制度なし」明記を確認する |
| osaka | structured | 2012年知事指示・2014年に府立高校の学区制度を完全廃止（複数の一次情報で確認・Wikipedia日本語版にも詳細な変遷記事あり）。大阪市立高校は別途「通学区域一覧」PDF(`city.osaka.lg.jp/kyoiku/.../R6tuugakukuiki.pdf`)で市立分は学区運用が残ると判明（府立と市立で扱いが異なる点に注意） |
| saitama | structured | 平成16年度(2004年度)から通学区域を廃止し「全県一学区（実質学区なし）」と判明（埼玉県議会答弁PDF等で経緯記載）。県教委公式ページ`pref.saitama.lg.jp/f2208/nyuushi.html`も確認 |
| chiba | structured | 全日制普通科が第1〜第9学区に分かれ、居住学区+隣接学区から出願可能という制度が公式ページ群（`pref.chiba.lg.jp/kyouiku/seisaku/kaikaku/miryoku/gakku/`配下に学区別の高校一覧ページが多数）で確認。「隣接県協定(学区の特例)」ページ・千葉女子/木更津東の県内全域出願特例も判明。9学区・学区外条件とも極めて構造化された資料群 |
| hyogo | structured | 公式PDF「兵庫県公立高等学校の通学区域」(`hyogo-c.ed.jp/~gakuji-bo/R3tuugakukuiki.pdf`)を直接発見。5学区制・隣接区域出願・専門学科/単位制普通科推薦は県下全域出願可という学区外条件も判明。ただしPDFは「令和３年４月１日現在」とやや古く、実装時は最新版の有無を確認すること |
| hokkaido | structured | 公式PDF「北海道立高等学校通学区域規則」(`dokyoi.pref.hokkaido.lg.jp/fs/9/2/0/4/8/6/9/_/p171-178_R6_...z.pdf`)を直接発見。19学区・学区外受験枠5〜50%・専門学科は道内全域出願可という学区外条件も判明。R6版で多年度追跡の起点になる |
| aomori | structured | 2005年に6学区制から全県1学区へ移行済みと判明（`pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/senbatsuhi.html`は既にT-Y14調査でも確認済みの公式ページ）。隣接県(秋田・岩手)との県境地域向け特例協定も判明（学区外就学条件の具体例として貴重） |
| iwate | structured | 公式規則ページ「岩手県立高等学校の通学区域に関する規則」(`www1.g-reiki.net/pref.iwate/reiki_honbun/c101RG00001491.html`)を直接発見。8学区・盛岡第一高校の学区外枠10%という具体例も判明 |
| akita | uncertain | 検索結果は秋田市等の市町村立小中学校の学区情報ばかりがヒットし、県立高校の学区制度に関する一次資料は今回発見できなかった。★次回、`pref.akita.lg.jp`内で県立高校入学者選抜要項から学区の定めの有無を確認する |
| yamagata | structured | 公式FAQページ「県立高等学校の通学区域については」(`www2.pref.yamagata.jp/bunkyo/kyoiku/qanda/7700013faq_catogory16_4.html`)を直接発見。普通科・理数科・探究科は東/北/南/西の実質3学区、職業学科等は県内全域出願可という学区外条件（学科による適用除外）も判明 |

## 次回の続き

残り34県（未着手・13/47完了）。次回セッションは残りの都道府県を全てバッチで進める。
akitaは今回uncertainのまま（県立高校学区の一次資料が未発見）。
