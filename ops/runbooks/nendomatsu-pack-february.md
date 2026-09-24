# 2月の運用手順書: 令和9年度 倍率速報「年度末パック」を県の公表後に納品する

**これが無いと、売れても納品できない。** 10月以降 loop は常駐しない（Claude Max → Pro）。2月の当日納品は **👤が Pro セッションを開いて回す**。
このファイルは「その日、何を押すか」をコピペで動く形で書いたもの。作成: 2026-09-24（TD-9）。

## 0. 先に読む（約束できる範囲）

- **納品対象は9県だけ**（許諾ok かつ 確定パーサあり）: 秋田・茨城・栃木・千葉・石川・長野・岐阜・香川・沖縄。根拠 `ops/baselines/td1-delivery-capability-2026-09.md`。
  許諾が増えたら `npx tsx scripts/td1-delivery-ledger.ts` を再実行して台帳を作り直す（県が増えると `src/lib/nendomatsu-pack.ts` の納品対象も自動で増える）。
- **平日の日中は👤が学校にいる。** 機械の作業は数分で終わるが、Proセッションを回すのは学校が終わってから。
  したがって売り文句として約束できるのは **「県の公表の翌営業日中（A県=千葉）／県の公表から3営業日以内（B県）」**（=`src/lib/nendomatsu-pack.ts` の `deliveryPromise`・案）。
  **「当日中」とは約束していない**。公表が金曜の夕方なら、納品は月曜になりうる。**この文言を確定するのは👤**（質問ノートの「👤がやること」参照）。
- **1県あたりの所要時間: 未測定。** 令和9年度の実PDFでの通しは未実施（公表前のため）。参考値: 機械の部分（`td1-build-delivery.ts`）は令和8年度で通して約4秒（実測・秋田）。
  人手が入る部分（PDFの特定・表のページ指定・検算NGの切り分け）は未測定。**最初の1県目で時間を測って、この行を書き換えること。**
- 検算が通らない県は**納品しない／遅らせる**（数字を合わせにいかない・Y-0）。相手には「検算が通らず確認中」と正直に連絡する。

## 1. 公表を検知する（毎日・1〜3月）

⚠️ **現状の毎日の検知器は、令和9年度の新しい資料を検知できない。** `MyNaishin-CompetitionUpdateCheck`（毎朝7:45・`npm run check:competition-updates`）は
**令和8年度の資料のURL**をHEADで見ているだけで、令和9年度は別のURLで出る（T-Y11F F-1〜F-3の実測）。使えるのは次の3つ:

1. **基準日カレンダー**（下の表）: 令和9年度の志願変更（出願）の締切日。**県は例年、この日の当日〜数日後に確定の出願状況を公表**する（令和8年度の公表日は表の「令和8年度の公表日」）。基準日の翌日から3日間は毎朝チェックする。
2. **県の入試ハブページ**を毎朝開く（下の表の「前年の置き場」＝令和8年度の資料のURL。同じ階層に令和9年度が並ぶ。千葉は `watch-hubs.mjs` が使える）。
3. 地方紙・教育委員会の報道発表（記事が出た日＝公表日の目安）。

**推奨（👤の判断・未登録）**: 1/25〜3/20 は `node scripts/bairitsu-ingest/watch-hubs.mjs`（ハブ判明県のみ・現在は千葉）を毎朝回す。タスクスケジューラへの登録は👤が行う:
`schtasks /Create /SC DAILY /ST 07:50 /TN "MyNaishin-HubWatch" /TR "cmd /c cd /d C:\Users\E24054\my-naisin && set NODE_TLS_REJECT_UNAUTHORIZED=0 && node scripts\bairitsu-ingest\watch-hubs.mjs"`（**loopは登録していない**）。
通知の見方: `docs/daily-brief.md` の「倍率公表資料の更新監視」節（毎朝7:30の朝ブリーフィングが更新）／`C:\Users\E24054\competition-updates-check.log`（文字化けするときは `Get-Content -Encoding UTF8`）／`ops/state/hub-events.json`（`watch-hubs.mjs` の新規リンク）。

### 9県の確認表（`npx tsx scripts/td1-delivery-ledger.ts` の元データから）

| 県 | 区分 | 令和9年度の基準日(県の日程DB) | 令和8年度の公表日 | ハブ | 令和9年度の掲載位置 | 前年の置き場（令和8年度の資料URL） |
|---|---|---|---|---|---|---|
| 秋田県 | B | R9日程が未公表（公表後に日程DBを更新） | 令和8年2月12日 | (未特定) | (未特定) | https://www.pref.akita.lg.jp/uploads/public/archive_0000093860_00/20260212_%EF%BC%91%E6%AC%A1%E5%8B%9F%E9%9B%86%E3%80%80%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%88%E5%BF%97%E9%A1%98%E5%85%88%E5%A4%89%E6%9B%B4%E5%BE%8C%EF%BC%89%EF%BC%88%E5%85%AC%E2%80%95%EF%BC%92%EF%BC%89.pdf |
| 茨城県 | B | R9日程が未公表 | 2月18日 | (未特定) | (未特定) | https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/02/shigansha20260218.pdf |
| 栃木県 | B | 2027-02-12（出願変更期間の締切） | 2月25日（変更後確定値） | (未特定) | (未特定) | https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippansenbatsusyutsuganhenkojokyo.pdf |
| 千葉県 | **A** | R9日程が未公表 | 令和8年2月13日 | https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/index.html | https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r9/index.html | https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/r8kakuteiippan.pdf |
| 石川県 | B | 2027-03-01（一般入学 志願変更期間の締切）＝**3月** | 2月24日 | (未特定) | (未特定) | https://www.pref.ishikawa.lg.jp/kisya/r7kyoui/documents/20260224.pdf |
| 長野県 | B | 2027-03-03（後期選抜 志望変更受付期間の締切）＝**3月** | 3月5日 | (未特定) | (未特定) | https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/20260305web-teisei.pdf |
| 岐阜県 | B | 2027-02-16（第一次選抜の変更期間の締切） | 令和8年2月17日 | (未特定) | (未特定) | https://www.pref.gifu.lg.jp/uploaded/attachment/485854.pdf |
| 香川県 | B | R9日程に該当の締切なし | 2月24日（志願変更締切後） | (未特定) | (未特定) | https://www.pref.kagawa.lg.jp/documents/15096/syutugan8-3-2.pdf |
| 沖縄県 | B | 2027-02-16（志願変更取り下げ・再出願の締切） | 令和8年2月17日 | (未特定) | (未特定) | https://www.pref.okinawa.jp/_res/projects/default_project/_page_/001/038/168/r07saisyu.pdf |

- 基準日が未公表の県（秋田・茨城・千葉・香川）は、**県が令和9年度の日程を公表したら `src/data/exam-schedules/<県>.ts` を更新**し、`npx tsx scripts/td1-delivery-ledger.ts` を再実行する（10月以降・T-Y14と同じ運用）。
- ⚠️ **石川・長野は基準日が3月**。「2月に届く」とは書けない。

## 2. 取得

```
# 保存先は .gitignore 済みの ops/raw/bairitsu-pdf-archive/ 配下（PDFをgitに入れない）
mkdir -p ops/raw/bairitsu-pdf-archive/td1-r9/<県コード>
curl -k -L -A "Mozilla/5.0 MyNaishinBot/1.0 (+https://my-naishin.com)" -o ops/raw/bairitsu-pdf-archive/td1-r9/<県コード>/r9-<公表日>.pdf "<公表PDFのURL>"
sha256sum ops/raw/bairitsu-pdf-archive/td1-r9/<県コード>/r9-<公表日>.pdf
```

- 相手サーバに負荷をかけない（1県1回・UAを名乗る）。`-k` は会社PCのTLS傍受を避けるため。
- **公表資料の「公表日」を確認して控える**（記者発表資料・ページの掲載日。確認できなければ Last-Modified ではなく空欄にして、納品メールに「公表日: 確認中」と書く）。

## 3. パース→検算（1本のコマンド）

```
# 表のあるページ(0始まり・カンマ区切り)を指定。令和8年度の表のページ数は 千葉5・岐阜5・長野4・沖縄4・茨城3・栃木3・秋田2・石川2・香川1（表紙・注記ページは除く）
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/bairitsu-ingest/harvest-prefecture.ts <県コード> ops/raw/bairitsu-pdf-archive/td1-r9/<県コード>/r9-<公表日>.pdf 0,1,2 --emit ops/raw/bairitsu-pdf-archive/td1-r9/<県コード>/parsed.json
```

- 出力 `✅ <県>: N件抽出・検算OK` なら次へ。`❌ ... 検算NG` なら **数字を合わせにいかず**、`ops/BAIRITSU-INGEST-RUNBOOK.md`「検算が落ちたときに何を人間に上げるか」に従う。原因が特定できないときは**その県は納品を遅らせ**、相手に連絡する。
- PDFの列構成が前年と違うと、パーサが通らない／件数が大きくずれる。**件数が令和8年度と大きく違う場合は、県の制度変更（学校の統廃合・募集停止）か、パーサの取りこぼしかを、公表PDFの原本で確認する。**
- 会社PCのメモリが少ないときは `tsx` が強制終了することがある。その場合は `timeout` を長くしてフォアグラウンドで再実行（`ops/` の既知の罠参照）。

## 4. 納品ファイルを作る

```
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/td1-build-delivery.ts <県コード> 令和9年度 令和8年度 <公表日YYYY-MM-DD> \
  --parsed ops/raw/bairitsu-pdf-archive/td1-r9/<県コード>/parsed.json \
  --source-url "<公表PDFのURL>" --doc-title "<資料名（志願変更後 など区分が分かる語を含める）>" \
  --scope-note "<収録範囲 例: 全日制の一般選抜(県立・市立)。定時制は含まない>"
```

- 出力: `ops/deliverables/nendomatsu-pack-deliveries/R9-<県>-<kakutei|sokuho>-<公表日>.{csv,json,scope.txt}`。
- **納品対象県以外（許諾ok かつ A+B 以外）は作れない**（fail-closed）。区分を資料名から判別できないときは `--stage 確定`（または `速報`）を付ける。
- **目視チェック（必須・2分）**: ①行数が令和8年度と大きく違わないか ②倍率の空欄が無いか（県が非公表なら空欄でよいが理由を確認）③公表PDFの原本で**2〜3校をランダムに選び**、CSVの募集人員・出願者数・倍率が一致するか ④`scope.txt`の収録範囲が実態と合っているか。
- **令和8年度で通しの検証（練習）**: `npx tsx scripts/td1-build-delivery.ts chiba 令和8年度 令和7年度 2026-02-13 --out <一時フォルダ>`（サンプルと同一のCSVができる）。

## 5. 納品する（送るのは👤）

- 方法: **メール添付**（CSV・JSON・scope.txt）。共有リンクは使わない。宛先は契約時のご担当者。
- 件名: `【令和9年度 公立高校 倍率データ】<県名> <確定|速報>（公表日 <日付>）納品`
- 本文（コピペ）: 「お世話になっております。My Naishin 運営（契約名義人: 國井）です。<県名>の令和9年度 公立高校 <確定|速報> の出願状況を、県教育委員会の公表資料（<資料名>・公表日 <日付>）から転記し、CSV/JSONで納品いたします。収録範囲は同梱の scope.txt をご確認ください。転記誤り等がございましたら、無償で訂正・再納品いたします。出典として県教育委員会をご明記のうえご利用ください。」
- 納品後に `ops/deliverables/nendomatsu-pack-deliveries/DELIVERY-LOG.md` に1行追記（日付・県・区分・公表日・納品先・件数・所要メモ）。**1県目は所要時間を測って上の「未測定」を書き換える。**
- 請求書: 全県の納品が済んだら（または契約どおりのタイミングで）`ops/deliverables/nendomatsu-pack-sample/templates/seikyusho.html` をコピーして宛名・日付・書類番号・振込先を記入。支払期限 2027年3月31日。

## 6. 訂正が出たとき

県が公表資料を訂正した場合（訂正版の公表）:

1. 訂正版PDFを取得し、手順3を `parsed-teisei.json` として再実行（`--emit .../parsed-teisei.json`）。
2. 訂正履歴を作る: `node scripts/td1-correction-diff.mjs ops/raw/bairitsu-pdf-archive/td1-r9/<県>/parsed.json ops/raw/bairitsu-pdf-archive/td1-r9/<県>/parsed-teisei.json --out ops/deliverables/nendomatsu-pack-deliveries/<県>-訂正履歴-<日付>.csv`（変更なしなら再納品不要）。
3. 手順4を訂正版で実行（公表日は訂正版の公表日・区分は同じ）。ファイル名の末尾に `-teisei` を付けて再納品し、**訂正履歴CSVを添付**する。
4. 当方の転記誤りだった場合も同じ手順で無償訂正（`DELIVERY-LOG.md` に理由を書く）。

## 7. 納品後（急がない）

- 令和9年度の値を `src/data/competition-rates/<県>.ts` に取り込む（`ops/BAIRITSU-INGEST-RUNBOOK.md` 手順5）。取り込むと `td1-build-delivery.ts` を `--parsed` 無しで実行できる。
- 県の公表日・資料名を `src/lib/competition-rate-publication-notes.ts` に記録する（来年の基準日になる）。

## 8. 価格が確定したあとの一括更新（売り込みが動き出す前に）

1. `src/data/nendomatsu-pack-pricing.json` の `status` を `"confirmed"`、`confirmedYenTaxIncluded` に税込の整数を入れる（**この1か所だけ**）。
2. `npm run td1:build-kit`（1枚資料・見積書/請求書ひな形を再生成）→ `npx tsx scripts/td1-build-drafts.ts` を**置換前に**実行（下書きを作り直す場合のみ）→ `node scripts/td1-fill-price.mjs`（下書きの`{{PRICE}}`を一括置換・置換漏れがあれば止まる）。
3. テスト: `NODE_OPTIONS=--max-old-space-size=4096 npx jest src/lib/__tests__/nendomatsu-pack.test.ts src/app/nendomatsu-pack`（価格が1か所であること・未確定なら何も置換しないこと）。
4. ONE-PAGER・SPEC・TERMS を PDF 化（`ops/deliverables/nendomatsu-pack-sample/drafts/README.md` の「PDFにする」）。ONE-PAGER は `pdfinfo` で Pages: 1 を確認。
5. フォーム窓口: `ops/cowork/COWORK-TASK-td1-nendomatsu-forms.md` を Cowork へ。メール窓口: `drafts/README.md` の手順4（1晩10〜15社まで）。**送信は👤。**
