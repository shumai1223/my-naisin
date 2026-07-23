# 内申点・総合得点 計算ロジック検証ガイド（2026年度）

My Naishin（https://my-naishin.com）が使用する内申点・総合得点の計算式を、コード実装と各都道府県
教育委員会の一次ソースとの対応関係を明示する形でまとめた技術文書です。「この計算、本当に正しいの？」
という監査・デューデリジェンスの問いに、実装コードの該当箇所と一次ソースURLを直接示すことで応えます。

[[fable5-fullaccel-backlog-2026-07]] TIER X - X-22 Phase1。個人情報を含まない純粋な計算式部分のみを
対象とします。

## アーキテクチャ

計算ロジックは2階層に分かれています。

### 第1層: 汎用エンジン（`src/lib/total-score/engine.ts`）

「内申・学力をそれぞれ換算満点へ線形換算し、選んだ比率オプションのもとで合算する」という単一モデルで
表現できる県は、共通のエンジン関数（`computeTotalScore` / `computeReportRaw`）で処理します。固定比率
（1つの比率オプションのみ）の県も、選択比率式（高校ごとに複数の比率から選ぶ）の県も、比率オプションの
違いだけで同じコードパスを通ります。

このエンジンで処理されているのは以下の5県です（`src/lib/total-score/registry.ts`の
`TOTAL_SCORE_SYSTEMS`に登録されたallowlist）。

| 県 | 方式 | 内申満点 | 学力満点 | ソース |
|---|---|---|---|---|
| 兵庫県 | 固定1:1（判定資料A:C） | 250点（中3のみ・実技×7.5） | 250点 | [要綱](https://www2.hyogo-c.ed.jp/hpe/koko/nyuushi/senbatsuyoukou_r8/) |
| 京都府（中期選抜） | 固定ほぼ1:1 | 195点（中1〜3・実技×2） | 200点 | [要項](https://www.kyoto-be.ne.jp/koukyou/cms/?p=7836) |
| 栃木県 | 選択比率9:1〜5:5 | 135点→比率換算 | 500点→比率換算 | [お知らせ](https://www.pref.tochigi.lg.jp/m04/r08/r08_kennritukoutougakkounyuugakushasennbatunikannsuruosirase.html) |
| 新潟県 | 選択比率7:3〜3:7 | 135点→1000点換算 | 500点→1000点換算 | [要項PDF](https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf) |
| 鳥取県 | 高校別倍率α=2〜4 | 65点×α（130〜260点） | 250点 | [鳥取県教委](https://www.pref.tottori.lg.jp/) |

各県の詳細な計算ステップ・出典の確認日は `src/lib/total-score/registry.ts` 内の該当オブジェクト
（`computeSteps` / `source` フィールド）に、条文の該当箇所まで含めて記述されています。

### 第2層: 個別実装（県固有ファイル）

一部の県は、選択比率モデルでは表現できない固有の構造（型選択制・段階的圧縮変換・複合加点等）を持つため、
専用ファイルで個別に実装しています。

| 県 | ファイル | 固有の構造 |
|---|---|---|
| 東京都 | `src/lib/total-score/tokyo.ts` | 内申300点＋学力700点＋ESAT-J20点＝1020点満点の複合設計 |
| 神奈川県 | `src/lib/total-score/kanagawa.ts` | S値・A値を6段階比率パターンから選択し1000点に変換 |
| 大阪府 | `src/lib/total-score/osaka.ts` | タイプⅠ〜Ⅴの5段階選択制（内申倍率0.6〜1.4） |
| 愛知県 | `src/lib/total-score/aichi.ts` | 評価方法Ⅰ〜Ⅴの5段階選択制 |
| 千葉県 | `src/lib/total-score/chiba.ts` | K値（0.5〜2の連続係数） |
| 埼玉県 | `src/lib/total-score/saitama.ts` | 学年比率が高校ごとに複数パターン＋相関表方式 |
| 福岡県 | `src/lib/total-score/fukuoka.ts` | A群・B群による2段階選抜 |
| 北海道 | `src/lib/total-score/hokkaido.ts` | 内申点を20点刻みでA〜M13段階の「内申ランク」に変換 |

### 未検証県（第2層に未登録）

上記13県（第1層5県＋第2層8県）以外の都道府県は `TOTAL_SCORE_SYSTEMS` に未登録のため、
`/[prefecture]/total-score` の総合得点計算機は404を返します（未検証データを断定的に見せない
「信頼の堀」設計）。ただし、内申点単体の計算（学年別倍率・実技倍率等、`src/lib/prefectures.ts`）は
全47都道府県で提供しています。

### 内申点単体計算（47都道府県共通・`src/lib/prefectures.ts`）

総合得点計算機（第1層・第2層）とは別に、内申点単体の計算（学年別倍率・5教科/実技倍率・満点）は
`src/lib/prefectures.ts`の`PREFECTURES`配列で全47都道府県分を提供しています。この計算は2つの軸を
掛け合わせます——①学年ごとの重み（`gradeMultipliers`。例: 北海道は中1・中2×2倍、中3×3倍）と
②5教科と実技4教科（音楽・美術・保体・技家）の間の重み（下表の「5教科倍率」「実技倍率」＝
`coreMultiplier`/`practicalMultiplier`）。下表は②のみを示すため、学年別の詳細な重みは
各県の`description`/`gradeMultipliers`フィールドも合わせてご確認ください。実選抜での換算満点が
ツール内部値と異なる県（岡山・香川・大分）は二段表記にしています。

| 県 | 5教科倍率 | 実技倍率 | 内申点満点 | 出典 |
|---|---|---|---|---|
| 北海道 | 1 | 1 | 315点 | [北海道教育委員会 入学者選抜](https://www.dokyoi.pref.hokkaido.lg.jp/hk/kki/) |
| 青森県 | 1 | 1 | 135点 | [青森県教育委員会 入学者選抜](https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/nyuushi.html) |
| 岩手県 | 2 | 3 | 660点 | [岩手県教育委員会 入学者選抜実施概要](https://www.pref.iwate.jp/kyouikubunka/kyouiku/gakkou/senbatsu/1091420.html) |
| 宮城県 | 1 | 2 | 195点 | [宮城県教育委員会 入試・入学関連](https://www.pref.miyagi.jp/site/sub-jigyou/list680.html) |
| 秋田県 | 1 | 2 | 195点 | [秋田県 公立高等学校入学者選抜実施要項](https://www.pref.akita.lg.jp/pages/archive/91551) |
| 山形県 | 1 | 1 | 45点 | [山形県教育委員会 入学者選抜](https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf) |
| 福島県 | 1 | 2 | 195点 | [福島県 県立高等学校入学者選抜実施要綱](https://www.pref.fukushima.lg.jp/uploaded/attachment/709972.pdf) |
| 茨城県 | 1 | 1 | 135点 | [茨城県教育委員会 入学者選抜実施要項](https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/youkou2026/) |
| 栃木県 | 1 | 1 | 135点 | [栃木県教育委員会 入学者選抜実施細則](https://www.pref.tochigi.lg.jp/m04/r08/documents/20250910185058.pdf) |
| 群馬県 | 1 | 1 | 135点 | [群馬県教育委員会 入学者選抜実施要項](https://www.pref.gunma.jp/site/kyouiku/715449.html) |
| 埼玉県 | 1 | 1 | 180点 | [埼玉県教育委員会 入試情報](https://www.pref.saitama.lg.jp/f2208/r8nyuushi-jissiyoukou.html) |
| 千葉県 | 1 | 1 | 135点 | [千葉県教育委員会 入試情報](https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/r8jissiyoko.html) |
| 東京都 | 1 | 2 | 65点 | [東京都教育委員会「令和8年度入学者選抜実施要綱」](https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html) |
| 神奈川県 | 1 | 1 | 135点 | [神奈川県教育委員会 入試情報](https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html) |
| 新潟県 | 1 | 1 | 135点 | [新潟県 公立高等学校入学者選抜要項](https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf) |
| 富山県 | 1 | 1 | 135点 | [富山県 県立高等学校入学者選抜](https://www.pref.toyama.jp/300201/kyouiku/kenritsukoukou/08senbatsu.html) |
| 石川県 | 1 | 1 | 135点 | [石川県教育委員会 公立高等学校入学者募集要綱](https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/documents/r8bosyuyoko.pdf) |
| 福井県 | 1 | 1 | 45点 | [福井県教育委員会 入学者選抜](https://www.pref.fukui.lg.jp/doc/koukou/) |
| 山梨県 | 2 | 3 | 330点 | [山梨県 高校入試情報](https://www.pref.yamanashi.jp/kyouiku-kikaku/nyuusi/nyusitop.html) |
| 長野県 | 1 | 1 | 45点 | [長野県教育委員会 公立高等学校入学者選抜情報](https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/r8konyushi.html) |
| 岐阜県 | 1 | 1 | 180点 | [岐阜県 県立高等学校入学者選抜](https://www.pref.gifu.lg.jp/site/edu/61428.html) |
| 静岡県 | 1 | 1 | 45点 | [静岡県 公立高等学校入学者選抜関係資料](https://www.pref.shizuoka.jp/kodomokyoiku/school/kyoiku/1003764/1003891/index.html) |
| 愛知県 | 1 | 1 | 90点 | [愛知県教育委員会 入学者選抜](https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html) |
| 三重県 | 1 | 1 | 45点 | [三重県 県立高等学校入学者選抜実施要項](https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200379.htm) |
| 滋賀県 | 1 | 1 | 135点 | [滋賀県教育委員会 県立高等学校入学者選抜](https://www.pref.shiga.lg.jp/edu/nyuushi/high/senbatsu/105597.html) |
| 京都府 | 1 | 2 | 195点 | [京都府教育委員会 公立高等学校入学者選抜](https://www.kyoto-be.ne.jp/koukyou/cms/?p=6024) |
| 大阪府 | 1 | 1 | 450点 | [大阪府教育庁 入試情報](https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_kokosenbatsu.html) |
| 兵庫県 | 4 | 7.5 | 250点 | [兵庫県教育委員会 入学者選抜](https://www.hyogo-c.ed.jp/~koko-bo/) |
| 奈良県 | 1 | 1 | 144点 | [奈良県 高校入試（入学者選抜）](https://www.pref.nara.lg.jp/n167/66542.html) |
| 和歌山県 | 1 | 1 | 180点 | [和歌山県教育委員会 県立高等学校入学者選抜実施要項](https://www.pref.wakayama.lg.jp/prefg/500200/d00220765.html) |
| 鳥取県 | 1 | 2 | 65点 | [鳥取県教育委員会 入学者選抜](https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html) |
| 島根県 | 1 | 1 | 180点 | [島根県 高校入学者選抜関連情報](https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/) |
| 岡山県 | 1 | 2 | 195点（実選抜換算200点） | [岡山県 県立高等学校の入学者選抜](https://www.pref.okayama.jp/site/16/913706.html) |
| 広島県 | 1 | 1 | 225点 | [広島県教育委員会 公立高等学校入学者選抜実施要項](https://www.pref.hiroshima.lg.jp/site/kyouiku/07senior-2nd-r07-nyuushi-r07-kou-r07-youkou-r07kou-youkou.html) |
| 山口県 | 1 | 1 | 135点 | [山口県 公立高等学校入学者選抜実施大綱](https://www.pref.yamaguchi.lg.jp/site/kyouiku/310448.html) |
| 徳島県 | 1 | 2 | 195点 | [徳島県教育委員会 公立高等学校生徒募集選抜要項](https://www.pref.tokushima.lg.jp/file/attachment/937096.pdf) |
| 香川県 | 2 | 4 | 390点（実選抜換算220点） | [香川県教育委員会 公立高校入試](https://www.pref.kagawa.lg.jp/kenkyoui/kokokyoiku/nyushi/chugaku-koko/examination02.html) |
| 愛媛県 | 1 | 1 | 135点 | [愛媛県教育委員会 県立学校入学者選抜等関連情報](https://ehime-kyoiku.esnet.ed.jp/koukou/nyuusi/r08nyuusi) |
| 高知県 | 1 | 2 | 195点 | [高知県 公立高等学校入学者選抜](https://www.pref.kochi.lg.jp/doc/r8_koukounyushi_main/) |
| 福岡県 | 1 | 1 | 45点 | [福岡県教育委員会 入学者選抜](https://www.pref.fukuoka.lg.jp/kyouiku/) |
| 佐賀県 | 1 | 1 | 135点 | [佐賀県 県立高等学校入学者選抜実施要項](https://www.pref.saga.lg.jp/kyouiku/kiji003115881/index.html) |
| 長崎県 | 1 | 1 | 135点 | [長崎県 公立高等学校入学者選抜実施要領](https://www.pref.nagasaki.jp/doc/page-746842.html) |
| 熊本県 | 1 | 1 | 180点 | [熊本県 県立高等学校入学者選抜要項](https://www.pref.kumamoto.jp/site/kyouiku/244675.html) |
| 大分県 | 2 | 4 | 520点（実選抜換算260点） | [大分県 県立高等学校入学者選抜実施要項](https://www.pref.oita.jp/site/kyoiku/r08koukounyushi.html) |
| 宮崎県 | 1 | 1 | 135点 | [宮崎県 県立高等学校生徒募集（入学者選抜）](https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20250618193442.html) |
| 鹿児島県 | 2 | 20 | 450点 | [鹿児島県教育委員会 入学者選抜](https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/) |
| 沖縄県 | 1 | 1.5 | 165点 | [沖縄県 県立高等学校入試関連情報](https://www.pref.okinawa.lg.jp/kyoiku/gakko/1008883/1008887/1035054.html) |

対応関係の抽出は転記ミスを避けるため`src/lib/prefectures.ts`を正規表現で機械抽出して生成しています
（手動転記は誤記リスクが高いため不採用。前回セッションで試みた`tsx`経由のTS ESモジュールimportは
このloop環境で`export const`が認識されない既知の不具合があり断念し、[[fable5-loop-protocol]]記載の
grep/正規表現ベースの抽出に切り替えて解決しました）。

## 検証可能性を担保するテスト群

- `src/lib/total-score/__tests__/*.test.ts`（県別）: 各県の計算式が既知の入力に対して期待通りの
  出力を返すことを検証。
- `src/lib/total-score/__tests__/uniqueness.test.ts`: 47都道府県のコンテンツ・計算式が使い回し
  （テンプレートの機械的な複製）になっていないことを検証（scaled-content検出）。
- `src/lib/total-score/__tests__/prefecture-consistency.test.ts`: `prefectures.ts`（内申点単体）と
  `total-score/registry.ts`（総合得点）の間でデータの矛盾がないことを検証。

すべてのテストはリポジトリ内で公開されており、`npx jest src/lib/total-score` で第三者が再現・検証
できます。

## 出典の一次性について

各県の `source.url` は都道府県教育委員会が公式に公表する入学者選抜実施要項・要綱のURLです
（`src/lib/prefectures.ts` の `sourceUrl` / `sourceTitle` / `lastVerified` フィールドに全47県分を
記録）。二次情報（学習塾・報道機関の解説記事等）のみで確認済みの県は、確定するまで総合得点計算機
（第1層・第2層）には掲載しません。

## フィードバック・指摘

計算式・出典の誤りを発見された場合は、[お問い合わせ](https://my-naishin.com/contact)よりご連絡
ください。教育委員会の制度改定に伴う更新は `lastVerified` / `lastChecked` の日付を確認のうえ、
最新の公式要項と照合してください。
