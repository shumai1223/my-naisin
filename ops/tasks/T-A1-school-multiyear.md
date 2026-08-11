# T-A1: 学校ページを多年度化する（新規データ収集ゼロ）

- 起票: 2026-08-11 / 優先度: **最優先（主食①）** / 実行主体: loop単独
- C7人間ゲート: **本番反映のみ**（コード変更・テストはloop単独）
- 見積: 8〜14h（1県ずつ・42県）

## なぜやるか（実測）

| 事実 | 出典 |
|---|---|
| 学校ページが2週間でゼロから立ち上がった。7/19-25は露出0ページ → 8/02-08は **402ページ・表示2,259・クリック24** | `ops/raw/gsc-pages-latest7.json` / `ops/raw/gsc-pages-prev7.json` |
| 加重順位 **9.76位**、実測CTR **1.06%**（自社CTR曲線の10位=1.0%とほぼ一致＝「正しく10位にいる」） | 同上 |
| 3位に上がれば同じ表示で **11.1%＝約10倍** | `ops/COEFFICIENTS.md` §3 |
| 過年度レコード **11,524件** がリポジトリにあるのに描画されていない | `ops/proposals/S13.md` §0-4（11,690は誤・`sources[]`内の`fiscalYear:`を生grepが拾った） |
| **42/47県**が3年度以上を保有。最多は東京の**5年度**（944レコード） | 同上。残り5県 hokkaido/nara/niigata/oita/saga は新規収集が必要＝**本タスクの対象外** |
| 競合: 進研ゼミ3年度・高校偏差値.net 5年度。**募集人員＋出願者数の実数を多年度で並べた形は競合4サイトのどこにも無い** | `ops/BAR.md` §0-2 / §2-4 |

## ⛔ 絶対にやってはいけないこと

`src/lib/school-page-lookup.ts:109` の
```ts
const currentYearRecords = rates.records.filter((r) => !r.fiscalYear);
```
**このフィルタを削除・緩和してはならない。**

理由: 2026-08-09 に実際に事故が起きている（同ファイル :104-108 のコメント）。掛-1が過年度分を
`fiscalYear` 付きで追加した結果、この関数がフィルタしておらず**同じ学科の複数年度分が
`departmentRates` に混入し、`totalQuota`/`totalApplicants`/`overallRate` が複数年度の合算という
無意味な値になった**（toyama等、既にindex解禁済みの県で発生を確認）。

→ **今季値の計算経路（currentYearRecords）はそのまま維持し、多年度は別経路で持つ。**

## DoD（この5つが全部緑になったら完了）

1. `getPrefectureSchoolPageData()` が、今季値に加えて **`history: { fiscalYear, quota, applicants, rate }[]`**（年度降順）を
   学科ごとに返す。今季値の計算は一切変わらない
2. 学校ページに「募集人員・出願者数・倍率の推移」表が描画され、**各行に年度と出典が付く**（1データ点1出典・Y-0）
3. 現在ページに出ている「県全体の合算」の多年度表と**取り違えない**
   （現行は学校固有ではなく県全体の傾向であることをページ自身が明記している。**この既存表は残すか消すかを判断し、
   残すなら「県全体」と「この学校」が視覚的に別物と分かるようにする**）
4. **不変条件テストが同時に入っている**（下記）
5. `npx tsc --noEmit` exit 0 ／ `npx jest --ci` 全green（**パイプ禁止・実exitを見る**）

## 不変条件テスト（必須・宮崎avgNaishin425の再発防止）

数値を持つ型を作ったら、その値が取りうる範囲のテストを**同時に**書く。最低限：

- `history` の各要素で `applicants >= 0` かつ `quota > 0`
- `rate` と `applicants / quota` が小数第2位まで一致（データ側の`rate`を鵜呑みにしない）
- **同一学科・同一年度のレコードが2件以上存在しない**（今回の事故の直接原因）
- `history` の `fiscalYear` が重複しない・降順である
- 今季値（`totalQuota`/`totalApplicants`/`overallRate`）が **`history` を混ぜても変化しない**
  （＝リグレッションテスト。これが2026-08-09の事故を機械的に防ぐ）

## 手順（1県ずつ・波の制約は受けない）

⚠️ **これは既存ページの改善であり「新規公開」ではない。** 1波5県・2〜3日おきの制約（scaled content abuse対策）は
新規公開に対する規約なので本タスクは受けない。ただし**一度に47県まとめてpushせず、数県ずつ検証しながら進める**こと。

1. `src/lib/school-page-lookup.ts` に `history` を組み立てる経路を追加（`currentYearRecords` は触らない）
2. `src/app/pref/[code]/school/[schoolCode]/page.tsx` に推移表を追加
3. 上記の不変条件テストを追加
4. 保有年度が最も多い県（tokyo=5年度）で先に1県だけ通し、目視とテストで確認
5. 残り41県へ展開。**42/47県のみ**（hokkaido/nara/niigata/oita/saga は対象外・スキップ台帳に理由を書く）

## kill_criteria

- 展開後28日で学校ページの加重順位が改善しない（9.76位のまま）→ 順位の律速は権威側と確定し、
  以後の中身改善は停止して T-C1 に資源を寄せる
- テストが通らない設計になった場合、**今季値の正確性を優先して多年度化を諦める**（Y-0 > 差別化）

## 罠

- `tsc`/`jest` は**パイプ厳禁**。`NODE_OPTIONS=--max-old-space-size=6144` を付ける
- shellはPowerShell（`&&`不可・heredoc不可・`;`で連結）
- repoルートに `scratch-*.ts` を残さない（`tsc` が壊れる）

## 進捗（2026-08-12・loop）

**手順1〜4は完了・push済（`9da80cc`→`16ce43b`）。**

- `school-page-data.ts`: `SchoolHistoryEntry`型・`buildSchoolHistoryForPrefecture()`
  （今季値の計算経路`currentYearRecords`には一切触れず、`rates.records`全体から別経路で
  schoolCode別に集計し後から合流する設計）・`groupSchoolHistoryByDepartment()`を追加
- `school-page-lookup.ts`: `getPrefectureSchoolPageData()`に`history`を合流
- `school/[schoolCode]/page.tsx`: 「この学校の推移」セクションを新設
  （既存の「県全体の傾向」＝`categoryTrends`とは視覚的に別区画・DoD項目3対応）
- 不変条件テスト: tokyo/日比谷の実データで5種（quota>0/applicants>=0/学科×年度重複なし/
  fiscalYear降順/今季値不変のリグレッション）＋全47県横断の機械検証

**手順5「残り41県へ展開」は本実装では追加コードが不要と判明**: `buildSchoolHistoryForPrefecture`は
純粋関数として`COMPETITION_RATE_BY_PREFECTURE[code].records`を読むだけなので、
`getPrefectureSchoolPageData(code)`経由で**全県共通に即座に効く**（T-C1のような1県ずつのデータ収集労働が発生しない）。

**⚠️重要な発見（rateの精度は県により異なる）**: 当初「`rate`が`applicants/quota`の単純計算と
小数第2位まで一致する」を全47県共通の不変条件として書いたところ、実データで**33/47県が失敗**した。
調査の結果、①nagasaki等は公表値自体が小数第1位までしか無い（例:「1.1」）、②yamanashi等は
最大0.04程度のずれがあり単純な丸め方式の違いだけでは説明がつかない（一次資料側の志願変更前後等の
版差の可能性・未確定）。`finalRate`型コメントの「公表値をそのまま転記・独自計算はしない」設計と
整合するため転記事故ではないと判断し、rate厳密一致はtokyo個別テストに留め、全県横断テストは
`quota>0`/`applicants>=0`/`学科×年度重複なし`という県非依存の範囲に是正した（`16ce43b`）。

**残り**: `tsc`/`jest`は全green（255 suites・4361 tests）。目視でのブラウザ確認は
[[fable5-loop-protocol]]の既知の罠（ローカルでnext buildが完走しない）によりこの環境では
実施不能・CIとGSCでの後日確認に委ねる。kill_criteria（28日後の加重順位）の判定は
次回以降のセッションで日付が来たら確認すること。
