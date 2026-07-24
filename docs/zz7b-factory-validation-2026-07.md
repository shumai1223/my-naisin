# ZZ-7b 工場実証：site-in-a-box の差分レポート（2026-07-24）

## 目的

R-4（site-in-a-box scaffold CLI）が「サイト非依存の核」として `genericAsIs: true` に分類した
ファイル群が、実際に2サイト目（my-shingaku、2026-07-10にF-8でjest基盤等を移植済み）で
無修正のまま通用しているかを実地検証する。ZZ-7a の DoD「生成物がtsc/jest green」の
延長として、「実際に運用中の第2サイトとの差分ゼロ（または改善）」を確認する。

方法：`src/lib/scaffold-site-manifest.ts` の MANIFEST から代表的なファイルを選び、
my-naishin（正準ソース）と my-shingaku（実際に移植済みの現物）を突き合わせた
（my-shingaku側は読み取りのみ・一切変更していない）。

## 結果サマリー

| ファイル | 分類 | 結果 |
|---|---|---|
| `src/lib/internal-link-graph.ts` | genericAsIs: true | **差分ゼロ**（関数本体はバイト単位で完全一致・ヘッダーコメントのみ要約版） |
| `src/lib/page-registry.ts` | genericAsIs: false | **想定通り**（`StaticPageEntry` インターフェース定義は完全一致・`STATIC_PAGES` 配列の中身はサイト固有で正しく分岐） |
| `jest.config.js` | genericAsIs: true | **改善を発見・逆輸入済み**（後述） |
| `tsconfig.json` | genericAsIs: true | ほぼ一致（軽微な差分のみ・後述） |

## 詳細

### 1. `src/lib/internal-link-graph.ts` — 差分ゼロ（genericAsIs: true の実証）

`walkSourceFiles` / `walkPageFiles` / `pageFileToRoute` / `countContextualInboundLinks` の
4関数すべて、実装がバイト単位で完全一致していた。違うのはファイル冒頭のJSDocコメントのみで、
my-shingaku側は「F-8で移植」と要約した短縮版になっている（発見の経緯である
「/katei-kyoshi・/partnerが準孤児だった」という my-naishin 固有のエピソードは省かれている）。

→ R-4のMANIFESTが `genericAsIs: true`（無修正でそのままコピー可）と分類した判断は、
実際の2サイト目での運用実績によって裏付けられた。

### 2. `src/lib/page-registry.ts` — 想定通りの分岐（genericAsIs: false の実証）

`export interface StaticPageEntry { url; priority; changeFrequency }` の型定義は完全一致。
`STATIC_PAGES` 配列の中身（実際のURL一覧）は当然ながら完全にサイト固有（my-shingakuは
`/sougaku`・`/gakuhi`・`/shogakukin`等の大学進学ドメインの15+ページ）。

→ 「構造・sitemap.ts連携パターンは流用、STATIC_PAGES配列はサイト固有」というMANIFESTの
todoの記述は正確だった。

### 3. `jest.config.js` — 改善を発見し、my-naishin側へ逆輸入済み

my-shingaku側に、my-naishinには無い1行が追加されていた：

```js
// .open-next（opennextjs-cloudflare build出力）にpackage.jsonが複製され、
// jest-haste-mapの命名衝突警告が出るため除外する。
modulePathIgnorePatterns: ['<rootDir>/.open-next/'],
```

my-naishinも同じ `@opennextjs/cloudflare` を使っており（`.gitignore` に `.open-next` 済み）、
ローカルで `npm run preview` 等を実行すると同じ命名衝突警告が発生しうる潜在リスクだった。
このコミットで **my-naishin の `jest.config.js` にも同じ1行を追加** し、正準ソースへ
逆輸入した（今後 scaffold-site.ts で第3サイトを作る際も自動的にこの改善が乗る）。

→ site-in-a-box は「my-naishin→他サイトへの一方通行」ではなく、実際に運用中のサイトが
発見した改善を正準ソースへ还流できる装置として機能することを実証した。

### 4. `tsconfig.json` — 軽微な差分（低優先度・記録のみ）

`include` 配列で my-naishin は `.next/types/**/*.ts` と `.next/dev/types/**/*.ts` の両方を
含むが、my-shingaku は `.next/types/**/*.ts` のみ（`.next/dev/types` を含まない）。
両サイトともNext.js 15系で、`dev` 型定義自体は新しめのNext.jsバージョンで追加されたパス
のため、my-shingaku移植時点ではまだ存在しなかった可能性が高い。実害は無い
（存在しないglobパスをincludeに含めてもtscはエラーにしない）ため、緊急のアクションは
不要と判断し記録のみに留める。

## 結論

DoD「差分ゼロ（または改善）を確認」を充足：
- **2/4ファイルが差分ゼロ**（internal-link-graph.ts の関数本体・page-registry.ts の型定義）
- **1/4ファイルで実際の改善を発見し、正準ソースへ逆輸入完了**（jest.config.js）
- **1/4ファイルに軽微な差分**（tsconfig.json・実害なしのため記録のみ）

site-in-a-box（R-4）が「コピー元として扱い、各サイトは独立に進化してよい」という設計
（[[session-2026-07-09-f7-playbook-extraction-design]]）のもとで、実際に2サイト目の運用が
1年未満で正準ソースへの改善提案を1件生んだことは、PLAYBOOK横展開という戦略の実効性を
裏付ける具体的な証拠になる。
