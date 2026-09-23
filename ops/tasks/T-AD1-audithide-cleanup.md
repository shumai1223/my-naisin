# T-AD1 `auditHide` の残骸を消す（AdSense申請の前準備・コード整理）

**起票: 2026-09-23（👤の指示）。優先度: 中。半日以内。**

---

## 前提の訂正（先に読むこと）

対話セッションは当初「`auditHide` がまだ生きていて、AdSense審査中に保護者リードCTAを
隠してしまう」と報告したが、**これは誤りだった。**実装を読んだところ、

```ts
// src/components/Affiliate/AffiliateAd.tsx:36
// AdSense撤退（2026-07）で審査モードは廃止。auditHide は後方互換で受けるが、もう隠さない。
void auditHide;
```

`ParentLeadCTA.tsx` も同じ形で、**既に無効化済み（no-op）**。
**したがってこのタスクは「危険の除去」ではなく「死んだコードの掃除」である。**
急がなくてよいが、AdSense申請の前に消しておくと、審査中に誤って復活させる余地が無くなる。

---

## いま残っているもの（2026-09-23 実測・27箇所）

```
src/components/Affiliate/AffiliateAd.tsx          5   ← 定義側（prop + void + コメント）
src/components/ParentLeadCTA.tsx                  4   ← 定義側
src/components/ParentLeadCTAExperiment.tsx        3   ← 中継（受けて下へ渡しているだけ）
src/components/ParentLeadCTAPositionSlot.tsx      3   ← 中継
src/components/SaveResultCTA.tsx                  1
src/app/HomeClient.tsx                            3   ← 呼び出し側
src/app/hogosha/page.tsx                          2   ← 呼び出し側
src/app/[prefecture]/naishin/page.tsx             2   ← 呼び出し側
src/app/koukou-hiyou/page.tsx                     1   ← 呼び出し側
src/app/reverse/ReverseClient.tsx                 1   ← 呼び出し側
src/lib/changelog-data.ts                         1   ← ⚠️履歴の記述。消さない
src/lib/daily-brief-health.ts                     1   ← ⚠️中身を見てから判断
```

## AD1-1 呼び出し側から消す

- [ ] `HomeClient.tsx` / `hogosha` / `[prefecture]/naishin` / `koukou-hiyou` / `reverse` の
      **JSXに書かれた `auditHide` 属性を削除する**（9箇所）
- [ ] 削除後、そのコンポーネントが**画面上で見た目も挙動も変わらない**ことを確認する
      （no-opなので変わらないはずだが、`hideLabel` 等と取り違えて消していないかを見る）

## AD1-2 中継コンポーネントから消す

- [ ] `ParentLeadCTAExperiment.tsx` / `ParentLeadCTAPositionSlot.tsx` の
      **props定義・分割代入・下流への受け渡しを削除する**
- [ ] `SaveResultCTA.tsx` も同様

## AD1-3 定義側から消す

- [ ] `AffiliateAd.tsx` / `ParentLeadCTA.tsx` の
      **`auditHide?: boolean` の型・デフォルト値・`void auditHide;` の行・コメントを削除する**
- [ ] ⚠️ **最後にやること。** 先に定義を消すと呼び出し側が一斉に型エラーになり、
      「どこを直したか」が分からなくなる

## AD1-4 残す2件の判断

- [ ] `src/lib/changelog-data.ts` の1件 → **これは更新履歴の本文。消さない。**
      （過去に何をしたかの記録であり、生きたコードではない）
- [ ] `src/lib/daily-brief-health.ts` の1件 → **中身を読んでから判断する。**
      監視項目として「auditHideが残っていないか」を数えている類なら、
      このタスク完了後は常に0になるので、**項目ごと削除してよい**。
      別の意味で使っているなら残す。⚠️ 読まずに消さない

## DoD

- [ ] `grep -rn "auditHide" src/` の結果が **`changelog-data.ts` の1件のみ**（または0件）
- [ ] `tsc` 実exit0（⚠️パイプに繋がない。`NODE_OPTIONS=--max-old-space-size=4096`）
- [ ] jest フルスイート green
- [ ] ⚠️ **push は火曜/金曜のみ**（`ops/LOOP_CONTRACT.md` 冒頭の 2026-09-23 改定に従う）

## 守ること

- ⚠️ **これは見た目を1ピクセルも変えない変更であるべき。** 削除の過程で
  保護者リードCTAやアフィリ枠が消えたら、それは事故。2026-07-04 に
  「AdSense審査のために保護者リードCTAを全部隠していた」自傷があり、その残骸を掃除する作業で
  同じことを起こしては本末転倒
- ⚠️ **`hideLabel` `trackView` `centered` など似た名前のpropを巻き込まない**
