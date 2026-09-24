# AdSense 配置の2週間後の見直し手順（T-ADS1 §6）

点火（手動ユニットが実際に出始めた日）から2週間後に、👤（Proセッション）が上から順に実施する。

## 0. 前提: 何がどこに出ているか

- ユニットは4種（`src/lib/ad-units.ts`）。AdSense管理画面の名前 = `mn-result-below` / `mn-in-content` / `mn-in-article` / `mn-page-bottom`
- 置き場所の契約は `src/lib/__tests__/ad-placement.test.ts`（除外ルート・1ページ3枠以内・CTAより下）。位置を変えるときはこのテストも見る
- 面ごとの枠: 学校ページ=IN_CONTENT×2＋PAGE_BOTTOM／ブログ=IN_ARTICLE×最大2＋PAGE_BOTTOM／
  計算機・換算系=RESULT_BELOW（結果が出た後だけ）＋IN_CONTENT＋PAGE_BOTTOM／トップ=RESULT_BELOW＋PAGE_BOTTOM

## 1. 収益（AdSense「広告ユニット別」レポート）

4ユニットの表示回数・RPM・クリック率を比べる。RPM が最下位のユニットは、その位置を疑う（置き場所か枚数か）。

## 2. SEOが落ちていないか（ここが最優先）

- `node scripts/w9-weighted-rank.mjs` の前週比: **上位20クエリの加重順位が +0.5位以上悪化**していたら `IN_CONTENT` を外す
- Search Console の Core Web Vitals（CLS）が「不良」になったら同じく `IN_CONTENT` から外す（次に `PAGE_BOTTOM`）
- 外し方: 該当の `<AdUnit unit="IN_CONTENT" />` を消すだけ。テスト（ad-placement）は枠数の上限しか見ないので通る

## 3. 保護者CTAが減っていないか

D1 の `/go` クリックログを、点火前の2週間と比べる。明らかに減っていたら `RESULT_BELOW` を1段下げる
（`*ResultFlow.tsx` の末尾 → ページ本文の下の方へ）。

## 4. 学校ページ（3,400枚）だけ別に見る

学校ページはデータが主役（Y-0）で、量産テンプレとして評価されやすい面。学校ページ群のインデックス数・クリックが
点火後に落ちたら、学校ページの広告だけ外す（`src/app/pref/[code]/school/[schoolCode]/page.tsx` の `<AdUnit` 3箇所）。
