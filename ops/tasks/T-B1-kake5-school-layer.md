# T-B1: 掛-5改 — 学校ページ層に換金の受け皿を作る

- 起票: 2026-08-11 / 優先度: **高（主食②）** / 実行主体: loop単独
- C7人間ゲート: **本番反映のみ**
- 見積: 3〜5h

## ✅ 2026-08-13 訂正: 「学校ページに収益コード0件」という前提は誤りだった

LOOP_CONTRACT.md §0は本タスクを「降格・未着手」と記載しているが、**実際には
`SchoolPageConvertCTA`（自身のコメントで「換金導線＝主食②-1」と明記・別タスクの
コミット`51af7ac`で導入）が学校ページに既に実装済み**だった（`school_page_clicks`
D1テーブルに27件の実クリックあり）。ただし**G7に違反する順序（SchoolPageParentBridge
より上に配置）だったため2026-08-13に是正**（`SchoolPageParentBridge`を先に配置し直し、
`src/app/__tests__/school-page-cta-order.test.ts`で回帰防止）。
⚠️ ただしDoD項目3（`placement`をselectSecondaryLeadOfferへ渡す）は満たしていない
（SchoolPageConvertCTAは静的リンクのみでlead-config経由の副オファー選択をしていない）。
**降格判断自体（新たにaffiliateAd等を追加投資する価値は無い）は覆さないが、
「収益導線が0件」という前提は誤りだったため記録を訂正する。**

## ⚠️ 掛-5 は「対象が変わった」タスクである

元の掛-5（収益距離の全面短縮）は**もう終わっている**。`ops/DISTANCE.md` の実測:
- **∞ページ = 0枚**。611ページ中 **530枚（クリックの99.3%）が既に距離1**
- 距離軸で買える円は施策1本あたり月¥264〜1,588・4本合計でも約¥3,300

→ **既存ページの距離短縮に価値は残っていない。**

**しかし2026-08上旬に、掛-5が想定していなかった新しい面が出現した。**

| 事実 | 出典 |
|---|---|
| 学校ページ 402枚が2週間でGSC露出（7/19-25は0枚）。sitemap掲載は3,089枚 | `ops/raw/gsc-pages-latest7.json` |
| **学校ページ233枚＋県別まとめ47枚に換金コードが1行も無い**（grep 0ヒット） | `ops/MONEY.md` §4-b |
| 「〇〇高校 倍率」は300クエリ・**加重6.00位・43%が3位以内**（クエリ次元・最深オフシーズン） | `ops/raw/gsc-bairitsu-28d.json` |
| 冬のピークは12〜2月（山は2月）。**倍率の公表期に需要が集中する** | `ops/CLOCK.md` |

→ **冬の最大の需要面に、受け皿が1つも無い。** これが新しい掛-5の対象。

## ⛔ G7（保護者到達を押し下げない）— これを破ったら自動的に不採用

`src/components/ResultSection.tsx:295-298` に**プロジェクト自身の規約**がある:
> 「保護者共有導線（橋①GapToTarget・橋②送るボタン・ParentCostBridge）より必ず下に置くこと（収益の主導線を押し下げない）」

学校ページは `SchoolPageParentBridge` を描画する面である。**収益CTAは必ずこれより下に置く。**

## DoD

1. 学校ページ（`src/app/pref/[code]/school/[schoolCode]/page.tsx`）に収益導線が1つ以上あり、
   **`SchoolPageParentBridge` より下**に配置されている
2. 県別まとめ（`src/app/pref/[code]/page.tsx`）にも同様
3. **`placement` を必ず渡している**（下記・これが無いと副オファーが消え、面別集計もできない）
4. `npx tsc --noEmit` exit 0 ／ `npx jest --ci` 全green
5. 配置後、`node scripts/d1q.mjs` で `placement` が正しく記録されることを実測確認

## ★ placement を必ず渡すこと（今回の測定事故の直接の教訓）

- `selectSecondaryLeadOffer` は `if (!placement) return null`（`src/lib/lead-config.ts:419`）。
  **placement を渡さないと副オファーが必ず消える**（現状22箇所でこれが起きている）
- placement が無いと `/go` が referer のパスで代替するため、`hensachi` と `/hensachi` の**表記ゆれが発生し
  面別集計が二重化**する（`ops/MONEY.md` §2-c(4)）
- **placement と referer のパスが矛盾する行は bot と機械判定できる**（`ops/CORRECTIONS.md` §2）。
  placement を全箇所に付けるほど、この判別軸の精度が上がる

→ 本タスクで追加する全CTAに、`placement="school"`（または県別は `placement="pref"`）を必ず渡す。

## どのオファーを置くか

`src/lib/lead-config.ts` の面設計に `school` / `pref` を**追加**する（コンポーネント側でaffiliateIdを直書きしない）。
オファーの選定は `rankLiveOffersByEV()` に委ねる。⚠️ **季節スワップが `prefecture` 面の主オファーを
6/15〜8/10 不出にしていた前科がある**（`src/lib/seasonal.ts:82`）ので、`school` 面が季節で消えないことを確認する。

## kill_criteria

- 配置後28日で `placement='school'` の**内部referer付き**クリックが0件 → 学校ページからの換金は成立しないと判定し、
  冬の受け皿としては撤去して T-C1（権威）に資源を寄せる
- ⚠️ **bot込みのクリック数で判定しないこと。** D1 clicks の88%はbotである（`ops/COEFFICIENTS.md` §1）。
  必ず `referer LIKE 'https://my-naishin.com/_%'` で絞って数える

## 罠

- 学校ページは冬に需要が来る面なので、**11/15のピークフリーズ前に配置を終える**こと
  （フリーズ中に触れるのは導線・CTA・比較表・価格のみなので、CTAの調整自体は可能だが、構造変更は不可）
