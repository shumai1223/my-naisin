# my-naishin 学校別入試競争率データ 形式仕様（PoC v0）

生成日時: 2026-09-11T18:20:34.304Z

## 収録範囲

- 対象: 公立高等学校 入学者選抜（一般選抜・全日制課程）の学校×学科別 募集人員・最終応募者数・倍率
- 都道府県数: 47／47
- レコード数（配布可能分のみ）: 23,273件
- 学校数（延べ・都道府県×学校名の組で重複排除）: 3,277校
- 出典: 各都道府県教育委員会が公表する一次資料（PDF/xlsx/HTML）。1レコード=1出典を厳守（Y-0憲法）
- 除外: 商用第三者資料のみを唯一の出典とするレコード（`commercialSourceOnly: true`）は
  無断再配布を避けるため本パッケージから機械的に除外済み

## ファイル構成

| ファイル | 内容 |
|---|---|
| `r8-full.json` / `.csv` | 配布可能な全23,273レコード |
| `r7-r8-diff.json` | 令和7年度→令和8年度の学校×学科別倍率差分（5,245件・47都道府県で両年度収録済み） |
| `chiba-sample.json` / `.csv` | 千葉県のみの抜粋（多年度データの構造見本） |

## 列定義（r8-full.json / .csv）

| 列名 | 型 | 説明 |
|---|---|---|
| prefectureCode | string | 都道府県コード（例: 'chiba'） |
| prefectureName | string | 都道府県名（例: '千葉県'） |
| schoolName | string | 学校名（公表資料の記載どおり） |
| area | string | 区市町村等のグルーピング単位（資料に無ければ空文字） |
| department | string | 学科名 |
| fiscalYear | string | 年度（例: '令和8年度（2026年度）'） |
| quota | number | 募集人員 |
| finalApplicants | number | 最終応募人員 |
| finalRate | number | 最終応募倍率（公表値をそのまま転記。独自計算はしない） |
| sourceUrl | string | 一次資料のURL（出典が一意に解決できない場合は空文字） |
| docTitle | string | 一次資料のタイトル |
| fetchedAt | string | 取得日 |

## 列定義（r7-r8-diff.json）

| 列名 | 型 | 説明 |
|---|---|---|
| prefectureCode / schoolName / department | string | 対象の特定 |
| previousFiscalYear / currentFiscalYear | string | 比較対象年度 |
| previousRate / currentRate | number | 各年度の最終応募倍率（公表値） |
| rateDelta | number | currentRate − previousRate（符号付き） |
| direction | 'up' \| 'down' \| 'unchanged' | 倍率の変動方向 |
| previousSourceUrl / currentSourceUrl | string \| null | 各年度の一次資料URL |

## 利用条件（案・価格等は👤が別途提示）

- Y-0憲法「公表値のみ」を厳守: 学校別偏差値・ボーダーの独自推定は一切含まない
- 1データ点=1出典: 全レコードがsourceUrl/docTitle/fetchedAtで出典を追跡可能
- 商用第三者資料のみを出典とするレコードは配布対象外（上記「除外」参照）
- 本ファイル自体は非公開ディレクトリで管理し、対外送信・公開URL化は👤の判断を待つ
