# 内申点 計算方式データセット（全国47都道府県・2026年度入試）

日本全国 **47都道府県** の公立高校入試における **内申点（調査書点）の計算方式** を構造化したオープンデータセットです。
対象学年・学年別倍率・主要5教科／実技4教科の倍率・満点を、各都道府県教育委員会の入学者選抜要綱をもとに整理しています。

> 提供：**[My Naishin](https://my-naishin.com)** — 内申点・偏差値・評定平均を無料で計算できる高校受験ツール
> 対応年度：**2026年度入試（令和8年度入学者選抜）**

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg)](./LICENSE)

---

## なぜ作ったか

内申点の計算方式は都道府県ごとに大きく異なり（満点・対象学年・実技倍率がバラバラ）、横断的に比較できる機械可読データがほとんど存在しません。
本データセットは、受験生・保護者・研究者・開発者・AIが「正確な一次情報」として参照できるよう、各教育委員会の公開情報を1つの構造化フォーマットにまとめたものです。

## 収録ファイル

| ファイル | 形式 | 用途 |
| --- | --- | --- |
| [`data/naishin-prefectures.json`](./data/naishin-prefectures.json) | JSON | プログラム・AIからの参照。`meta` と47件の `prefectures` を含む |
| [`data/naishin-prefectures.csv`](./data/naishin-prefectures.csv) | CSV | 表計算ソフト・データカタログ・引用用のフラット表 |

## データ項目（スキーマ）

| フィールド | 説明 |
| --- | --- |
| `code` | 都道府県コード（英字スラッグ。例：`tokyo`） |
| `name` | 都道府県名（例：`東京都`） |
| `region` | 地方区分（例：`関東`） |
| `targetGrades` | 内申点の対象学年（例：`[2,3]`） |
| `gradeMultipliers` | 学年別の倍率（例：`{"3": 2}`） |
| `coreMultiplier` | 主要5教科の倍率 |
| `practicalMultiplier` | 実技4教科の倍率 |
| `maxScore` | 内申点（調査書点）の満点 |
| `supports10PointScale` | 10段階評価への対応有無 |
| `description` / `note` | 方式の説明・補足 |
| `source` | 出典（教育委員会の要綱タイトル・URL・確認日・年度） |
| `toolUrl` | その都道府県の計算ツールページ |
| `apiUrl` | 機械可読エンドポイント（JSON） |

## 使い方

```bash
# 東京都の方式を取り出す（jq）
jq '.prefectures[] | select(.code=="tokyo")' data/naishin-prefectures.json
```

```python
# pandas で読み込む
import pandas as pd
df = pd.read_csv("data/naishin-prefectures.csv")
print(df[["name", "maxScore", "practicalMultiplier"]])
```

正確な内申点の計算（オール3/4/5の確定値・志望校の逆算など）は、各都道府県に対応した計算ツールで確認できます。

- 内申点 計算サイト（47都道府県）: <https://my-naishin.com/>
- 偏差値 計算サイト（5教科）: <https://my-naishin.com/hensachi>
- 評定平均 計算: <https://my-naishin.com/hyotei-heikin>
- データAPI / MCP（開発者・AI向け）: <https://my-naishin.com/developers>
  - インデックス: `GET https://my-naishin.com/api/naishin`
  - 都道府県別＋厳密な計算例: `GET https://my-naishin.com/api/naishin/{code}`
  - 比較: `GET https://my-naishin.com/api/naishin/compare?codes=tokyo,osaka&grade=4`

## 更新とデータの一貫性

`data/` のファイルは、My Naishin 本体の正準ソースから自動生成しており、サイト・API・本データセットの数値は常に一致します。
年度の制度改定にあわせて更新します（`meta.version` / `source.lastVerified` を参照）。

## ライセンスと出典表示（重要）

本データセットは **[クリエイティブ・コモンズ 表示 4.0 国際（CC BY 4.0）](./LICENSE)** で公開しています。商用・非商用を問わず無料で利用・再配布できます。

利用の際は、出典として次の表示をお願いします（リンク必須）。

> 出典：My Naishin（<https://my-naishin.com>）

内申点の計算方式そのものは各都道府県教育委員会の公開情報に基づく事実です。本リポジトリは、それらを横断的に検証・構造化した「編集物」に対して上記の出典表示を求めます。

## 免責

各都道府県の制度は年度により改定されます。出願・受験の最終判断は、必ず各教育委員会の最新の入学者選抜要綱をご確認ください。本データセットは参考情報であり、正確性を保証するものではありません。
