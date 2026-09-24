# 下書きの使い方（価格が決まったら）

**現在、価格は未確定です（`src/data/nendomatsu-pack-pricing.json` の status が "pending"）。Gmail下書きは1件も置かないでください。**
価格が確定するまで、このフォルダの各ファイルには価格の差し込み口 `{{PRICE}}` が残っています。

## 価格が決まったらやること（この順番）

1. **価格を1か所だけ直す**: `src/data/nendomatsu-pack-pricing.json` を開き、`"status": "confirmed"`、`"confirmedYenTaxIncluded": <税込の整数>` にする（例: 250000）。ほかは何も直さない。
2. **1枚資料・見積書/請求書ひな形・商品ページを再生成**: `npm run td1:build-kit`（ONE-PAGER.html などの価格が同じ定数から変わる）。続けて PDF 化（ONE-PAGER・SPEC・TERMS）: 下の「PDFにする」。
3. **下書きの `{{PRICE}}` を一括置換**: `node scripts/td1-fill-price.mjs`（`--dry-run` で先に確認できる）。**未確定なら何もせず終了／置換漏れが1件でもあれば1ファイルも書き換えず止まる。**
4. **メール窓口の相手だけ Gmail下書きを設置**: 既接触は `gmail_create_reply_draft`（threadId は各ファイルに記載）、新規は `gmail_create_draft`。**1晩10〜15社まで。** 設置したら `INDEX.md` の状態を `設置済み draftId <id>` に書き換える。
5. **フォーム窓口の相手**: `ops/cowork/COWORK-TASK-td1-nendomatsu-forms.md` を Cowork に渡す（各ファイルの「本文」を貼り、確認画面で停止）。
6. **送信は👤だけ。** loopは送りません。送ったら `ops/baselines/td1-funnel-2026-10.md` に1行足す。

## PDFにする（Edge headless）

```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --no-pdf-header-footer ^
  --print-to-pdf="ops\deliverables\nendomatsu-pack-sample\ONE-PAGER.pdf" "file:///C:/Users/E24054/my-naisin/ops/deliverables/nendomatsu-pack-sample/ONE-PAGER.html"
```

SPEC.html / TERMS.html も同じ要領で SPEC.pdf / TERMS.pdf にする。ONE-PAGER は A4・1枚に収まることを `pdfinfo` で確認する（Pages: 1）。

## 作り直したいとき

文面や送り先を直す場合は `drafts-source.json` を編集して `npx tsx scripts/td1-build-drafts.ts` で再生成する（`drafts/*.md` は生成物・手で直すと次の再生成で消える）。⚠️ 価格置換後に再生成すると `{{PRICE}}` が戻るので、置換前に行うこと。
