# T-UI1 アイコンを lucide から Phosphor(regular) に置き換える

- 起票: 2026-10-12（👤が見本を見て「Phosphor regular」に決定）
- 見本: `ops/deliverables/icon-sample/index.html`（③④が整理版・④が採用）／`preview.png`
- 担当: **loop ではなく別の対話セッションに渡す**（loop は T-PV1 が主食）。着手は **10/17 以降**（試験週は何もしない）。
- 目的: 絵文字・lucide・グラデーション等で出ていたAI感のうち、**アイコンと絵文字を置き換える**。グラデーション・`rounded-2xl` の整理は別タスク（本タスクに混ぜない）。

## 👤の決定（変えない）

- 既定のウェイトは **regular**。大きく見せる場所（24px以上の見出しの飾り）だけ `light` にしてよい。
- **色は今のまま Tailwind の `text-*` で指定する**（Phosphor は `currentColor`）。色の変更は不要。
- 絵文字は **置き換える**（下の方針）。パンダのイラストは今回やらない（素材が無い）。
- push は **1回にまとめる**（ビルド約14分・¥11。1日1回の枠）。

## 現状の数字（2026-10-12に実測）

- lucide を import しているのは 277ファイル、アイコン164種、import 1,516回。
- **自動で対応が付いたのは113種**（`ops/deliverables/icon-sample/map-auto-113.json`: `[lucide名, Phosphor名, 使用回数]`）。**残り51種は手で割り当てる**（`map-manual-51.json`: `[lucide名, 使用回数]`）。
- アイコンを値として渡している箇所（`icon: Zap` など）が237。`strokeWidth=` が25か所。`LucideIcon` 型は `src/components/CaseStudyCard.tsx` のみ。`fill-*` クラスつきのアイコンが3か所。
- Phosphor は `@phosphor-icons/react` **2.1.10**（React 19対応・Next 15）。**サーバーコンポーネントでも使えるよう `@phosphor-icons/react/dist/ssr` から import する。**

## 進め方（この順）

1. **依存を追加**: `@phosphor-icons/react@2.1.10`。社内ネットで失敗したら `NODE_TLS_REJECT_UNAUTHORIZED=0`（`memory/wrangler-corporate-network-workaround`）。**lucide-react は最後まで消さない。**
2. **ラッパーを作る** `src/components/icons/index.tsx`:
   - lucide と同じ名前で再エクスポートする（`export const Home = wrap(House)` のように）。
   - 既定 `weight="regular"`。`className` と `aria-hidden` を通す。
   - **サイズ**: lucide は何も指定しないと 24px。Phosphor は `1em`。**ラッパーで `size` の既定を 24 にして見た目を変えない**（`className="h-4 w-4"` はそのまま効く）。
   - `strokeWidth` は受け取って無視する（25か所）。
   - `fill-*` クラスを付けている3か所は、見た目を見て `weight="fill"` にする。
   - `LucideIcon` 型の代わりに、同じ形の型 `AppIcon` を export する。
3. **割り当て表を完成させる**: 51種を手で決める。**Phosphor に対応が無い／意味が変わるものは、無理に似たものを当てず、一覧にして👤に聞く**（例: `PartyPopper` `Dumbbell` `Github` `Twitter`）。
4. **コードモッド**: `from 'lucide-react'` を `from '@/components/icons'` に一括置換。別名 import（`as`）と `type` import を壊さない。
5. **絵文字の置き換え**（下の方針）。**コメント内の絵文字は触らない**（画面に出るものだけ）。
6. 確認（下）。通ったら **push 1回**。

## 絵文字の置き換え方針

- `✓` `⚠` `★` などの記号 → Phosphor の `Check` / `Warning` / `Star`（weight=regular）を文字色と同じ色で。サイズは文字に合わせる。
- `💡` `📌` などの見出し飾り → 絵文字を消し、必要なら小さなタグ（枠線のみの「ポイント」「注意」）。**アイコンを足す場合も1つまで**。
- `🎉` `💪` `🏆` `🔥` などの達成表示 → いまは絵文字を消すだけにする（パンダ素材ができたら差し替え）。文が成り立たなくなる箇所は文言を直す。
- `👤` はコード内ではコメントのみ（画面には出ない）。触らない。
- `StudyStreakCard.tsx` の `getStreakEmoji()`（🏆🔥⭐✨💪🌱）は、見本の③④のとおり「絵文字なし」に変える。

## 確認（全部通ってから push）

- `npx tsc --noEmit` の**実exit**（パイプしない・`NODE_OPTIONS=--max-old-space-size=6144` が要る）。
- `npx jest` 全件。
- **画面確認**: Playwright で、結果ページ・トップ・`/hensachi`・`/pref/tokyo/school/<ID>`・`/koukou-bairitsu`・`/privacy` を 390px と 1280px で撮り、アイコンの欠け・大きさのずれ・色抜けを見る。`StudyStreakCard` は見本と見比べる。
- 絵文字の残りを数える（画面に出るもの。コメントを除く）。結果を worklog に書く。
- `lucide-react` の import が **0** になったことを確認してから、`package.json` から外す（外すのは最後。ビルドが通ることを確認）。

## やらないこと

- グラデーション・`rounded-2xl`・色違いのバッジの整理（別タスク）。
- パンダのイラスト作成。
- 文言・料金・データの変更。
- push の1日複数回。

## 渡すときの依頼文（別セッションにそのまま貼る）

> `ops/tasks/T-UI1-icon-migration-phosphor.md` を最初から読んで、その順に進めてください。
> 見本は `ops/deliverables/icon-sample/index.html`。ウェイトは regular、色は今の Tailwind 指定のまま。
> 着手は10/17以降。pushは最後に1回。迷ったら止めて質問してください（アイコンの対応が無いものは勝手に決めない）。

## 記録

- 2026-10-12: 見本作成・regular に決定・本タスク起票。
