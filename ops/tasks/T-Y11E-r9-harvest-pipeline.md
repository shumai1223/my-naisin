# T-Y11E R9収穫パイプライン（★不在期間の予備主食・👤の判断を一切要さない）

**着手条件: 以下のどれかが起きたら、👤に聞かずに即このタスクへ移ってよい。**

```
① T-P1 が反証条件（数値で返せる県10県未満）で止まった
② T-Y11B 段階2-b が「これ以上は逓減」に達した
③ 9/8〜9/22 の不在期間に、他の主食が払底した
```

**⚠️ 監視モードに落ちる前に必ずここへ来ること。** これは事前承認済みで、👤の確認は要らない。

---

## なぜこれが予備でなく本命級なのか

```
scripts/bairitsu-ingest/  →  extract-pdf-geometry.py  ただ1本
段階3「冬の運用手順書」   →  ops/BAIRITSU-INGEST-RUNBOOK.md ＝ 文書のみ
30本以上のパーサ          →  jestテストの中・凍結フィクスチャ相手にしか動かない
```

**パーサは「正しいと証明されている」だけで、2月に走らせられない。**
教委がR9を公表してから、サイトに載るまでを繋ぐものが何も無い。

そして 2026-09-06 に旺文社へ出す提案書の第3章に、こう書いて送る。

> **年度更新**：各県の公表に追随します。公表が集中する1月中旬〜2月下旬は、**検知した順に随時**。

**これは現時点で守れない約束。** 手作業でならできるが、47県を「検知した順に随時」は無理。
**契約の履行能力そのものがこのタスク。**

加えて `高校 倍率` は Trends 実測で 112.5（2位の `不登校` 72.0 の1.6倍・`内申点` 30.6 の3.7倍）、
2月は8月の **24.14倍**、`2/07週` がピーク。**公表から受験までは数日で、1週間遅れれば
ピークのピークを丸ごと落とす。**

---

## E-1 パーサを「走らせられる形」に出す（★量はここ・最優先）

**いま30本以上のパーサが `src/lib/bairitsu-ingest/__tests__/*.test.ts` の中にある。
テストから呼ばれる形でしか存在せず、外から県コードで呼べない。**

- [x] 県コード → パーサ関数 のレジストリを作る（`src/lib/bairitsu-ingest/registry.ts` 等）
      ✅2026-09-05実装（`src/lib/bairitsu-ingest/registry.ts`・`PREFECTURE_PARSER_REGISTRY: Partial<Record<string, PrefectureParser>>`
      ＋`getPrefectureParser(code)`）。着手条件②（T-Y11B段階2-bが「これ以上は逓減」に達した・
      本文書冒頭の着手条件を参照）が満たされたため本タスクへ移行した
- [x] 各県のパーサをテストファイルから**純関数として抽出**し、レジストリに登録する
      ✅2026-09-06完了。当初対象の31/31県（toyama/aomori/iwate/fukui/kagawa/ehime/chiba/
      yamanashi/miyagi/nagasaki/saitama/gunma/shimane/nara/kyoto/hiroshima/wakayama/okinawa/
      gifu/niigata/saga/tottori/kagoshima/shizuoka/oita/kumamoto/shiga/kochi/yamagata/fukuoka/
      nagano）に加え、E-6リプレイ検証中に発見した「fixtureは存在するが未登録だった5県」
      （tochigi/ibaraki/akita/ishikawa/tokushima・generic関数の基準実装として別テストに
      埋もれていた）も追加登録し、**計36/47県**を`src/lib/bairitsu-ingest/parsers/<pref>.ts`の
      純関数として抽出し`registry.ts`に登録完了。各県の抽出時に既存テストをレジストリ経由の
      呼び出しへ書き換え・回帰なしを確認済み。tottori/naganoはarea(地区)フィールドを持つ拡張型
      として構造的部分型で登録。残り11県（aichi/fukushima/hokkaido/hyogo/kanagawa/mie/
      miyazaki/okayama/osaka/tokyo/yamaguchi）はxlsx直接パース等の別方式のため対象外。
      tsc実exit0・フルスイート486suites7112tests green（最終確認時点）
- [x] ⚠️ **既存のテストを壊さない。** テストはレジストリ経由で同じ結果を出すこと
      ✅toyama/aomori/iwate/fukui/kagawa/ehime/chiba: 7テストいずれもレジストリの各`parseXxx()`呼び出しに
      置き換え・結果は無回帰（ehime=99件/8,370/7,468も既存データと一致・1ページ2段組の
      LEFT/RIGHTレイアウトも純関数化して問題なし。chiba=188件・県立121+市立12校・
      quota28,880/applicants32,008の機械集計も一致・最も単純な部類でオーバーライド不要）。
      `__tests__/registry.test.ts`にehime/chibaの検証も追加
- [x] ⚠️ 1県ずつやる。**まとめて動かして壊すより、1県ずつ緑を確認する**
      ✅toyama→aomori→iwate→fukui→kagawa→ehime→chiba→yamanashi→miyagi→nagasaki→saitama→
      gunma→shimane→nara→kyoto→hiroshima→wakayama→okinawa→gifu→niigata→saga→tottori→
      kagoshima→shizuoka→oita→kumamoto→shiga→kochi→yamagata→fukuoka→naganoの順で
      31県すべてを1県ずつ移設完了（2026-09-06）。毎回`src/lib/bairitsu-ingest`配下のtsc実exit0・
      jestスコープgreenを確認後、フルスイートgreen(`--maxWorkers=2`)も確認。
      バックグラウンド実行(`run_in_background`)でシステムメモリ逼迫によりtsc/jestがkillされる
      環境問題が判明し、フォアグラウンド+`timeout: 300000`実行に切り替えて解決した
      （詳細は`memory/fable5-loop-protocol`参照）

## E-2 取得層（丁寧に取る）

- [x] 47県の公表ページを取得する薄いスクリプトを書く
      🔶第一歩完了(2026-09-06): `scripts/bairitsu-ingest/build-source-url-manifest.mjs`。
      各県の`src/data/competition-rates/<pref>.ts`が既に持つ`sources`配列（Y-2/T-Y11B作業の
      副産物）から令和8年度分のURLをネットワークに一切触れず機械抽出し
      `ops/raw/bairitsu-r8-source-urls.json`へマニフェスト化（47/47県で解決・欠落0件）。
      これを起点に、次段階で実際の定期取得（HTTP GET・PDF保存・変化検知）を実装する。
      ⚠️このマニフェストのURLは「前回取得時点」のものであり、R9公表時には変わっている
      可能性が高い（ページ自体は固定でもファイル名にr8/r9等の年度が入るパターンが多数）。
      実取得時はURLをそのまま叩くのではなく、まずページ側（docTitleに記載のハブページ等）を
      確認してから該当年度のPDFリンクを探す設計にすること
- [x] 変化検知 → 実取得 → PDF保存 の一連を実装する
      ✅2026-09-06完了。変化検知自体はT-Y11 A-2（`scripts/check-competition-rate-updates.mjs`・
      2026-09-01実装済み・HEADのみでヘッダフィンガープリント比較・追加のネットワーク負荷なし）が
      既に担っている。E-2の残りだった「実際にPDF本文を保存する」部分を
      `scripts/bairitsu-ingest/archive-changed-pdfs.mjs`として新設し、A-2の`changed`判定に
      相乗りする形にした（**追加のポーリングは一切行わない**＝相手サーバへの負荷は増えない）。
      純関数は`src/lib/bairitsu-pdf-archive.ts`に分離しjest7件で検証済み。ドライラン実施し
      changed該当県0件（現時点でR9未公表のため正常）でネットワーク呼び出しが発生しないことを
      確認済み。実際の保存が発火するのはR9公表後（1〜2月頃）にA-2が変化を検知した時点
- [x] ⚠️ **間隔900ms以上・UAを名乗る・robots.txtを尊重**（hyogoは既知の拒否県＝対象外）
      ✅archive-changed-pdfs.mjsもA-2と同じ作法（REQUEST_INTERVAL_MS=900・UA明記・
      robots.txt再確認）を踏襲
- [x] ⚠️ **1県1日1回まで。** 教委のサーバに負荷をかけない
      ✅新規ポーリングを追加せずA-2の既存24時間サイクルに相乗りする設計のため自動的に満たす
- [x] 取得したPDFを**保存する**（★教委は旧年度を消す。18パターン全404の実績あり）
      ✅`ops/raw/bairitsu-pdf-archive/<pref>/<sha256>.pdf`に保存（.gitignore登録・
      台帳`ops/raw/bairitsu-pdf-archive-manifest.json`のみコミット。詳細は上記1項目目）

## E-3 変化検知

- [x] `pdfHash`（SHA-256）で前回取得との差分を見る
      ✅2026-09-07完了（T-C1梯子が払底し文書冒頭の着手条件に従い移行）。T-Y11 A-2は
      HTTPヘッダの`fingerprint`だけを見る一次シグナルに過ぎず、PDFの中身（バイト列）が
      変わったかまでは確認しないという設計上の隙間を発見。`src/lib/bairitsu-ingest/
      pdf-hash-diff.ts`を新設し、実際にダウンロードしたPDFのSHA-256（`bairitsu-pdf-
      archive.ts`の`ArchiveEntry.sha256`）を、T-N1-1が凍結した基準スナップショット
      （`src/data/snapshots/<year>/exam-system.json`のpdfHash）と突き合わせて本当に
      中身が変わったかを確定させる`comparePdfHashToBaseline()`を実装。基準ハッシュが
      未収集(null)またはレコード自体が無い場合は変化あり/なしに丸めず`unknown`を返す
      fail-closed設計（Y-0と同じ思想）。2026-r8スナップショットの実データ（47/47県
      pdfHash収集済み）に対する検証テストも追加。tsc実exit0・7テストgreen・フルスイート
      490suites7150tests green・push(`57c2f48`)
- [ ] ⚠️ **令和7年度・令和6年度のスナップショットにはハッシュが無い**（対話セッションが
      2026-09-03に確認・R8のみ47/47）。ここで過去年度分にもハッシュを入れられる
      → **未対応（意図的に見送り）**: これは47県分のR7/R6版PDFを再取得する大規模な一次
      資料収集労働であり、コード実装ではない。しかも教委は旧年度PDFを予告なく削除する
      前科が既に18パターン全404と記録されている（本文書E-2節参照）ため、多くの県で
      R7/R6のPDFが既に取得不能な可能性が高い。実施する場合はarchive.org Waybackでの
      個別調査が前提になり1県あたりの手間がT-W1の一次ソース調査と同等以上になる見込み。
      次回この項目に戻る際は、まず数県で試掘し（Wayback到達率）を実測してから、続行するか
      正式に見送るかを判断すること（無理に着手して中途半端に終わらせない）

## E-4 検算をパイプラインに繋ぐ

**バラバラに存在する検算を1本の関門にする。**

- [x] グランドトータル照合（45県・gunma/hokkaidoは空）
      ✅`src/lib/bairitsu-ingest/validate-parsed-records.ts`の`checkGrandTotal`（単独一致→
      「合計」ラベル行の和でのフォールバック一致の2段構成・fukuoka/chiba型を吸収）
- [x] `finalrate-convention.ts` の3方式判定（T-Y11Cで実装済み）
      ✅`checkFinalRateConvention`が`classifyStoredRate`を全レコードに適用。yamanashi
      （帰国生徒等特別措置の適用者を最終志願者数の内数に含めつつ倍率算定からは除外する公表方式・
      ヘッダコメント/`yamanashi.test.ts`で許容誤差0.07として個別検証済み）のみ、
      `finalRateToleranceOverride`で例外許容を明示的に渡す設計とし、無条件緩和はしない
- [x] レコード件数の妥当性
      ✅`checkRecordCount`（0件検知＋`expectedRecordCount`との突合）
- [x] ⚠️ **落ちたら止める（fail-closed）。** 通り抜けさせない
      ✅`validateParsedRecords`は1つでもissueがあれば`ok: false`（部分的に通す設計にしない）。
      実行可能な入口は`scripts/bairitsu-ingest/validate-all-registered.ts`
      （`npx tsx`で実行・1県でも検算NGならexit 1）。2026-09-06時点で36/36県が検算OK
      （初回実行でyamanashiのみ検算NGを検出→上記の個別検証済み例外を追加して解消。
      3方式チェック自体は他35県に対して無条件のまま=fail-closed維持）

## E-5 差分と失敗の切り分け

- [x] 前年度からの変化を人が読める形で出す
      ✅`src/lib/bairitsu-ingest/diff-parsed-records.ts`の`diffParsedRecords`（学校名+学科名を
      キーに新設/廃止/数値変化/変化なしを分類）＋`formatDiffReport`（日本語の人が読めるレポート・
      空セクションは出力しない）
- [x] `ops/BAIRITSU-INGEST-RUNBOOK.md`に書いてある方針をコードにする
      （転記ミスが特定できる場合は自己修正／原因不明は未解明差分として記録／
      同じ県で3回連続失敗なら質問ノートへ「構造変化の疑い」）
      ✅「転記ミスの自己修正」「未解明差分として記録」は資料の内容を読んで判断する人間/loopの
      個別判断が本質のため自動化の対象外（RUNBOOKの記述を維持）。**機械判定できる部分＝
      「同じ県で3回連続失敗」の検出**を`src/lib/bairitsu-ingest/validation-failure-tracker.ts`の
      `recordValidationOutcome`として実装（県別の連続失敗数を台帳で追跡・3回目に達した回だけ
      `shouldEscalate: true`を返し4回目以降は再エスカレーションしない設計＝質問ノートを毎回
      同じ内容で埋めない）。台帳の永続化は呼び出し側の責務（実際の呼び出しはR9公表後の運用時に
      行う・現時点でR9データが存在しないため実データでの結線は次段階）

## E-6 ★R8全県リプレイ（これが最強の検証）

**2月を待たずに「動く」と言い切れるようにする。**

- [x] 保存済みのR8 PDFを**パイプラインの入口から通し**、いまの `competition-rates/*.ts` を
      **1件違わず再現できるか**を検証する
      ✅2026-09-06完了。`registry.test.ts`で全登録県が既存データと完全一致（または多重集合
      一致・fukuoka/nagano/ishikawa/tokushimaは既存データの編集履歴・幾何学的曖昧性を理由に
      順不同比較が正しい検証方法と各県のヘッダコメントに明記済み）することを機械検証済み
- [x] ⚠️ 再現できない県は「できない」と記録する。**数を合わせるために例外を積まない**
      ✅未パイプライン化の11県（xlsx直接パース等の別方式）は無理に統一せず対象外として
      `ops/BAIRITSU-INGEST-RUNBOOK.md`のE-6節に明記
- [x] 再現できた県数を `ops/` に記録する。**これが冬に自動で回せる県の数**
      ✅`ops/BAIRITSU-INGEST-RUNBOOK.md`「T-Y11E E-6: R8全県リプレイ結果」節に36/47県・
      内訳表・残り11県の理由を記録済み

---

## DoD

- [ ] `県コード → PDF → レコード` が1本のコマンドで通る
- [ ] R8全県リプレイの再現率が記録されている
- [ ] 検算が落ちたら止まる（通り抜けない）
- [ ] 取得したPDFが保存されている
- [ ] `tsc` 実exit 0 / jest green
- [ ] ⚠️ **本番反映・デプロイはしない。** ステージングまで（👤は9/22まで不在）

## 守ること

- ⚠️ **取得は丁寧に。** 900ms以上・UA明示・1県1日1回・robots.txt尊重
- ⚠️ **既存のテストとデータを壊さない**
- ⚠️ **数を合わせるために例外を積まない**（Y-0）
- ⚠️ **本番に出さない**
