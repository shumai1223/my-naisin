# T-M2: botを「検知」から「遮断」へ

- 起票: 2026-08-29（👤指示「投げる」・`memory/loop-question-note.md`にのみ記録されタスクファイルが
  存在しなかったため、2026-08-30に👤指示の見落とし是正の一環でloopが本ファイルを新設し追記）
- 位置づけ: **A群**。T-M1（クリック率）・T-N1-N4（¥300万の壁）と並ぶ今季3系統の1つ
  （`memory/loop-question-note.md` 2026-08-30「主食の全体像」参照）
- 主体: loop（実装）／本番反映は👤ゲート

## なぜ必要か

botは止まっていない。8/27に手口を変えて今も来ている。

| 波 | 時期 | 件数 | 手口 |
|---|---|---|---|
| 第1波 | 08-13〜15 | 835 | 8〜30秒間隔・偽装した内部referer(パス付き) |
| 第2波 | 全履歴 | 114 | プロキシ回転バースト |
| 第3波 | 08-27〜（継続中） | 222 | 2〜15分に減速・refererをオリジンのみ(末尾スラッシュ無し)に変更 |
| 第4波 | 人間判定内に混入 | 13 | Chrome142-145のデスクトップ |

第3波は既存の検知器（120秒窓・内部refererのみ検査）に合わせて調整されている。

`persistClick()`が先に走るためbotのクリックもD1に記録される設計のまま。AdSense等の広告面を
将来的に検討する場合は、ページを見せる前に止める必要がある（現状はAdSense撤退済みだが、
このハードニング自体はASPアカウント停止リスク対策として独立して価値がある）。

## やること

### M2-1 現状の防御を棚卸しする（実装より先に）— ✅2026-08-30調査完了(loop)

- [x] `src/lib/bot-filter.ts`の各関数がどの経路で・どの順に呼ばれているか確認 →
      `isBotUserAgent`/`isPrefetchRequest`/`isInternalReferer`/`hasSameOriginNavigation`は
      `/go/[id]/route.ts`でのみ使用。`isRootOnlyReferer`/`isPlacementConsistentWithReferer`は
      `classifyClick()`経由でダッシュボード集計時に使用（書き込み時ではなく読み取り時の分類）
- [x] `/go/[id]/route.ts`で`persistClick()`が判定より前に走っている箇所を特定 →
      bot-UA(①)・prefetch(①')・IPバースト(②)の3判定の**後**・内部referer/Sec-Fetch-Site判定(③④)の
      **前**に位置する。つまり「明確なbot」は記録前に弾けているが、「内部referer無し/実装した
      isImplausibleReferer/Sec-Fetch-Site不一致」による分類結果はpersistClick時点でまだ確定して
      おらず、行には残らない（読み取り時にclassifyClick()で都度再計算する設計）
- [x] 通常のページ表示（`/pref/*`等）にbot判定が一切かかっていないことを確認 →
      grep確認済み。bot-filter.tsを import しているのは`/go`と一部の`/api`(click-hop-complete/
      parent-funnel/school-click/stats-submit/student-funnel)のみで、通常のpage.tsxには一切無い。
      **これは意図的な設計として問題ない**（検索エンジンbotに正規ページを見せないと逆にSEOで損する。
      問題になるのは「アクション」系エンドポイント側でのbot流入であり、そちらは既に対応済み）

### M2-2 第3波の署名を防御に組み込む — ✅2026-08-30完了(loop)

- [x] `isImplausibleReferer()`を新設し`/go`の判定経路に組み込んだ（`bot-filter.ts`・`go/[id]/route.ts`）。
      referer が`https://my-naishin.com`（末尾スラッシュ無し・パス無し＝実ブラウザが生成し得ない形）の
      場合、内部referer無しと同様にJSホップへ回す。⚠️`https://my-naishin.com/`（末尾スラッシュ付き・
      正規のトップページ遷移）を誤検知しないことをテストで固定済み（`bot-filter.test.ts`4件追加）。
      **この関数はloop-question-noteが「08-29に新設済み」と記載していたが実際にはリポジトリに
      存在しなかった（対話セッションの記載を鵜呑みにせず実ファイルで確認したため発覚）**
- [x] `hasSameOriginNavigation()`（Sec-Fetch-Site）を含む信頼度判定を`persistClick()`より**前**に
      移動し、`clicks.trust_class`列（非破壊migration`0023_add_clicks_trust_class.sql`・
      `wrangler d1 execute --remote`で自力適用済み・本番`sqlite_master`で列追加を確認済み）へ
      書き込み時点で'human'/'suspect'を記録するよう`route.ts`/`clicks-db.ts`を改修（`a3e8f0c`の続き）。
      ルーティング判定(JSホップ/即302)とtrust_classの算出は同じ`isSuspect`変数を共有するため、
      記録される分類と実際のルーティング挙動が常に一致する設計

### M2-3 記録の順序を直す — ✅2026-08-30完了(loop・M2-2の実装で同時に対応)

- [x] `persistClick()`を判定の後ろに移す、または判定結果を同じ行に書く →
      **後者を採用**。M2-2の`isSuspect`統一により、判定結果（'human'/'suspect'）を
      `persistClick()`実行と同じタイミングで同じ行に書き込む設計になった
      （送客のリダイレクト自体は変更せずpersistClick失敗時も止めない設計を維持＝下記の
      「迷ったら通す」原則と両立）
- [x] ⚠️判定を厳しくしすぎない。実ユーザーを1人でも弾いたら¥117の損失。迷ったら通す →
      ルーティング条件（302 or JSホップ）は今回変更していない（isImplausibleReferer追加分の
      み拡張）。JSホップは実ブラウザなら数百msで通過するだけで実害が無い既存設計のまま

### M2-4 検知器の自己点検を入れる — 未着手

- [ ] `check:click-fraud`に「直近7日で、モバイル比率が50%を下回った日」を警告として追加する
      （実トラフィックは80%がモバイル。デスクトップに偏った日は無条件に疑う）
- [ ] 日次ブリーフィング（T-R1）にこの警告を載せる

## やってはいけないこと

- ❌ 実ユーザーを弾く可能性のある強い遮断（CAPTCHA・IP帯ブロック等）
- ❌ 判定をpublicly に説明する（THREATS.mdはリポジトリ内なので可。公開ページには書かない）
- ❌ D1の行を消す運用を続ける（分類して残す方式へ移行する）

## DoD

- [ ] 通常ページにbot判定がかかっているか/いないかが文書に書かれている → ✅本ファイルのM2-1で記録済み
- [x] `clicks.trust_class`列が追加され、新規クリックが分類されている → ✅完了(本番D1適用済み)
- [x] `isImplausibleReferer`が判定経路に入っている（末尾スラッシュの誤検知テスト付き） → ✅完了
- [ ] モバイル比率の警告が`check:click-fraud`に入っている → 未着手
- [x] `tsc` exit 0 / jest green（357 suites・6164 tests） → ✅完了
- [x] 本番反映は👤ゲート → コード側は`a3e8f0c`・`dc27d5e`でpush済み(Workers Builds経由で自動デプロイ)。
      D1 migration(`0023`)も`wrangler d1 execute --remote`でloopが自力適用済み(2026-07-28ゲート解禁)。
      残るM2-4完了後、本番での実挙動(誤検知が出ていないか)の確認は次回T-R1週次チェックで見る

## 併せて記録されている既知の不具合（未解決・別イテレーションで調査要）

- 07-17 02:35:48/49/50の三重発火（同一IP・同一案件・1秒間隔）。人間の3連打かイベントの
  二重発火か未特定。発火経路の調査が必要
- A8はJST・D1はUTCで9時間ずれる。今後ASPと突合するときは必ず時差を揃えること
