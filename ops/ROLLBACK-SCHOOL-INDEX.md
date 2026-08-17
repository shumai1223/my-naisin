# 学校ページ index 切り戻し手順（TH-3対応・2026-08-17新設）

`ops/THREATS.md` 脅威5（TH-3・Googleの手動対策）の「回復」欄が「ロールバック手順が
本ファイル執筆時点で存在しない（未整備）」と指摘していたため、本ファイルを新設した。
**コード側の切り替え機構自体は既に存在する**（1配列を編集するだけ）。無かったのは
「危機発生時に迷わず実行できる手順書」の方だった。

## いつ使うか

GSC「セキュリティと手動対策」ページ（**API取得不可・👤が管理画面を開いて見るしかない**）で、
学校ページ群（`/pref/[code]/school/[schoolCode]`、2026-08-17時点で47/47県3,089枚）に対する
「scaled content abuse」等の手動対策を検知した場合。

**トリガーの判断（C7）は必ず👤**。loopはGSC管理画面を見られないため、この判断はできない。
👤が「切り戻して」と指示したら、以下をloopが即座に実行する。

## 切り替え機構（単一ソース）

`src/lib/school-page-lookup.ts` の `INDEXED_SCHOOL_PAGE_PREFECTURE_CODES` 配列（現在47県）が
以下2箇所の唯一の判定ソース:

- `src/app/pref/[code]/school/[schoolCode]/page.tsx`: この配列に載っている県コードのみ
  `robots: { index: true, follow: true }`（載っていない県は`isIndexed=false`でnoindex・
  ページ自体は描画される＝データが消えるわけではない、安全側の設計）
- `src/app/sitemap.ts`: この配列に載っている県の学校ページのみsitemapに含める

## 全面ロールバック手順（手動対策を検知した直後・最優先）

1. `src/lib/school-page-lookup.ts` を開き、`INDEXED_SCHOOL_PAGE_PREFECTURE_CODES` の中身を
   空配列 `[]` にする（**配列定義のコメント（wave1〜wave7の解禁履歴）は消さずに残す**——
   復旧時にどの県から戻すかの唯一の記録になるため）。
2. `NODE_OPTIONS=--max-old-space-size=8192 npx tsc --noEmit` と `npx jest` で green を確認
   （school-page系のテストが`INDEXED_SCHOOL_PAGE_PREFECTURE_CODES`の中身に依存している場合、
   空配列によって失敗するテストがあれば内容を確認のうえ調整する）。
3. `git commit`（例: `fix(school-index): 手動対策検知のため学校ページを全県noindexへ緊急ロールバック`）
   → 即座に `git push`（src/変更なので通常運用どおり即push＝自動デプロイ）。
4. デプロイ後、任意の学校ページ（例: `/pref/tokyo/school/<既存のschoolCode>`）をcurlし、
   レスポンスヘッダまたはHTML内の`<meta name="robots"`が`noindex`になっていることを確認する。
5. 👤へ完了報告し、GSCの「URL削除（一時的）」ツール（管理画面のみ・👤専用）の利用も検討候補として伝える
   （即時除去したい場合はこちらの方が速いが、loopからは実行できない）。

## 部分ロールバック（特定県のみ疑わしい場合）

全県ではなく特定の県だけを疑う場合は、該当県コードのみを配列から削除する（配列は保持し、
該当県のstring要素だけを取り除く）。tsc/jest確認・commit/push手順は上記と同じ。

## 復旧手順（手動対策解除後）

配列コメントに残したwave1〜wave7の履歴を参照し、該当する県コードを配列へ戻す
（`git revert`で切り戻しコミット自体を打ち消す方法でもよいが、部分復旧したい場合は
手動で県コードを追記する方が柔軟）。復旧後もsitemap再送信や再クロール依頼はGSC管理画面
経由（👤専用）。

## この手順の限界

- **配列を空にしても、Googleが既にインデックス済みのページは即座には消えない**（再クロールを
  待つ必要がある）。緊急性が高い場合はGSCの「URL削除」ツール（👤専用）と併用する。
- 本手順はコードレベルの切り戻しのみ。手動対策の**原因調査**（どのページ群が引き金だったか）は
  別途GSC管理画面での確認が必要（`ops/THREATS.md`脅威5の「早期警戒指標」①を参照）。
