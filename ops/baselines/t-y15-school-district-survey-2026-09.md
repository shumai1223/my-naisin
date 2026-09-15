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
| fukushima | structured | 公式PDF「福島県立高等学校の通学区域に関する規則」(`pref.fukushima.lg.jp/uploaded/attachment/653878.pdf`)を直接発見。普通科8学区・学区外進学20%上限・専門/総合/定通は県内全域という学区外条件、隣接県協定の存在も判明 |
| ibaraki | structured | 2006年度入試から旧5学区制を廃止し全県1学区へ移行済みと判明（複数の三次情報で一致）。千葉・埼玉との隣接学区出願協定の存在も判明。★次回、茨城県教育委員会一次資料で「制度なし」の直接記述を確認する |
| tochigi | structured | 公式PDF「栃木県立高等学校の通学区域に関する規則は平成26年4月1日付けで廃止されました」(`pref.tochigi.lg.jp/m01/education/kyouikuzenpan/keikaku/documents/documents/kyuugakku.pdf`)を直接発見。廃止前の旧学区制度（普通科・総合学科のみ学区制、専門学科等は県内全域）の詳細も含む一次資料 |
| gunma | structured(見込み) | 2021年度入試から普通科を含む全学科が全県一学区になったと複数の三次情報で一致。★次回、群馬県教育委員会一次資料で公式の制度改正発表を確認する |
| niigata | uncertain | 「学区制は廃止されており、近隣市町村からも生徒を集めるようになった」という記述はあるが、廃止年度・一次資料とも今回未確認（検索結果の大半が新潟市立小中学校の学区情報でノイズが多かった）。★次回`pref.niigata.lg.jp/sec/kotogakko/`で一次資料を確認する |
| toyama | structured | 公式ページ「富山県／県立高校の通学区域（学区）について」(`pref.toyama.jp/3003/tsugakukuiki.html`)を直接発見。令和6年度入学生から県下一円(学区制限なし)に移行・移行前は新川/富山/高岡/砺波の4学区制だった経緯も明記（専門学科等は従来から県内一学区）。令和5年7月10日の県教委議決日まで判明する高精度な一次資料 |
| ishikawa | structured | 平成17年(2005年)4月から通学区域の制限を廃止し県内全域から出願可能になったと確認（`pref.ishikawa.lg.jp/kyoiku/gakkou/k-gakkou/gakkoushidou_02.html`）。旧3学区制だった経緯・県外居住者の入学志願特別事情具申書という学区外(県外)就学条件も判明 |
| fukui | uncertain | 検索結果が福岡県教育委員会・福井市立小中学校の情報とノイズ混在し、福井県立高校の学区制度に関する一次資料は今回発見できなかった。★次回`pref.fukui.lg.jp/doc/koukou/`で一次資料を確認する |
| yamanashi | uncertain | 検索結果が甲府市等の市町村立小中学校の学区情報中心で、山梨県立高校の学区制度に関する一次資料は今回発見できなかった。★次回`pref.yamanashi.jp/koukoukyo/`で一次資料を確認する |
| nagano | structured | 公式ページ「長野県立高校の通学区について」(`pref.nagano.lg.jp/kyoiku/koko/jukense/nintei/ko-tsugakuku.html`)を直接発見。2004年度に12学区→4学区(北信/東信/南信/中信)に再編、2020年度から他学区への志願も可能になり実質「全県1学区」化したという多年度の変遷が判明。規則改正のH30県議会提出資料PDFも発見 |
| gifu | structured(見込み) | 全県一学区制だが2017年入試までは全日制普通科が岐阜/西濃/美濃/加茂/東濃/飛騨の6学区に分かれていたと判明（市区町村単位の区割りまで具体的）。★次回、岐阜県教育委員会一次資料で制度移行年・現行の「制度なし」明記を確認する |
| shizuoka | structured | 現行は全県学区制(制限なし)・2008年までは全日制普通科で10学区制(第1学区=賀茂〜第10学区=西遠)だったと判明。県教委公式PDF「ふじのくに魅力ある学校づくり推進計画」(`pref.shizuoka.jp/_res/projects/.../keikaku.pdf`)等の長期計画資料で裏付け |
| mie | structured | 公式PDF「（付）三重県立高等学校通学区域に関する規則（抜粋）」(`pref.mie.lg.jp/common/content/001039271.pdf`)を直接発見。普通科(スポーツ科学コース除く)・理数科(松阪高除く)のみ北部/中部/南部の3学区制、他学科・定通・スポーツ特別枠は全県から出願可という学区外条件も判明 |
| shiga | structured | 公式ページ「県立高校通学区域｜滋賀県教育委員会」(`pref.shiga.lg.jp/edu/nyuushi/high/305672/305698.html`)を直接発見。2006年度から全県一区・信楽高校のみ全国募集という特例も判明。T-Y14調査時の「リンク一覧」という印象とは異なり、学区制度そのものについては明確な一次資料が存在した |
| kyoto | structured | 公式規則ページ「京都府立の中学校及び高等学校の通学区域に関する規則」(`pref.kyoto.jp/reiki/reiki_honbun/a300RG00000843.html`)を直接発見（昭和59年制定）。亀岡・宮津天橋・丹後緑風高校等で学区外(京都市等)からの入学者を定員30%以内に制限という具体的な学区外条件も判明 |
| miyagi | structured | 公式ページ「県立高校の全県一学区化について」(`pref.miyagi.jp/soshiki/kyou-kikaku/gakku.html`)を直接発見。平成22年度(2010年度)に全日制普通科の学区を撤廃し全課程・全学科で全県一学区化と判明。Wikipedia「宮城県立高等学校学区制度」記事に旧制度(2009年まで)の詳細な変遷も掲載 |
| kanagawa | structured | 2005年(平成17年)に県立高校の学区を撤廃済みと確認（`pen-kanagawa.ed.jp`＝神奈川県教育委員会公式サイト）。1950年19学区制発足→1963/1981/1990年に段階的縮小という変遷史も判明。★横浜市立・川崎市立高校は別途「学区外受検」制度が残る(市立は都道府県立と別扱い・osaka/shigaと同型の府省市区別パターン) |
| nara | structured(見込み) | 北部学区・南部学区(十津川村等の一部地域のみ小学区制)の2学区制と判明。「通学区域の設定を各高校を所管する教育委員会の判断に委ねる」という規制緩和方針も判明。★次回、奈良県教育委員会一次資料(`pref.nara.lg.jp`)で現行制度の直接確認が必要（今回の情報源の質はやや低い） |
| wakayama | structured | 公式ページ群(`pref.wakayama.lg.jp/prefg/500200/`配下に年度別入学者選抜ページ多数)経由で「全県一学区」（学区の定めなし）と確認 |
| shimane | structured | 公式ページ「通学区域 - 高校教育」(`pref.shimane.lg.jp/education/kyoiku/koukou/saihen/tuugaku.html`)で「島根県教育委員会では島根県立高校の通学区域は定めておりません」と直接明記。例外として松江市内普通科3校のみ小学区制という具体的な例外も判明。「県立高等学校通学区域検討委員会」答申PDFという制度検討の歴史資料も発見 |
| okayama | structured | 公式ページ「県立高校の学区について｜おかやま県立高校情報ナビ」(`okayama-kenritsukoukou.jp/news/4268/`)を直接発見。6学区・学区外合格者数上限5〜20%・全県学区の15校を具体的に列挙・2024年春に6校が全県学区へ追加という制度変遷まで判明 |
| hiroshima | structured | 公式ページ「県立高等学校の通学区域全県一円化について」(`pref.hiroshima.lg.jp/site/kyouiku/06senior-plan-tsuugakukuiki-index.html`)を直接発見。全日制は全県一円・定通は全県1区、学区外就学は教育委員会許可制という条件も判明 |
| yamaguchi | structured | 2016年度(平成28年度)入試から全県1学区制と判明。★珍しい逆パターン: 周防大島高校普通科・地域創生科は**県外から**募集し、県外からの入学者を定員30%以内に制限（他県が「学区外流入を制限」するのと逆に「県外流入自体を歓迎しつつ上限を設ける」構造）。学区外条件のバリエーションとして貴重 |
| tokushima | structured | 公式PDF群を複数直接発見（`pref.tokushima.lg.jp/file/attachment/929243.pdf`＝現行3学区の区割り表・`973309.pdf`＝令和7年の見直し報告書素案）。現行3学区・育成型選抜の学区外上限2〜3%・「全県学区化＋上限撤廃」への見直し方針という進行中の制度改革まで判明。T-Y14/T-Y15通じて最も充実した一次資料群 |
| kagawa | structured | 公式ページ「香川県立高等学校の学区制」(`pref.kagawa.lg.jp/kenkyoui/koko/examination02_1.html`)を直接発見。普通科・理数科(小豆島中央高除く)のみ第1/第2学区制、令和5年度から自己推薦選抜に限り他学区枠5%を新設、他学科・定通は県内全域という学区外条件も判明 |

## 次回の続き

残り9県（未着手・38/47完了・残りはehime・kochi・fukuoka・nagasaki・kumamoto・oita・
miyazaki・kagoshima・okinawa）。
akita/niigata/fukui/yamanashiは今回もuncertainのまま（県立高校学区の一次資料が未発見）。
