# チュートリアル2: 複数生徒・複数都道府県の一括処理（P-6）

塾SaaS・進路指導システムなど「多数の生徒」「複数都道府県」をまとめて処理したいケース向け。
2つのパターンがある：①47都道府県の参照データを一括取得する（CSV）、②多数の生徒の判定をループで処理する。

## パターン①: 47都道府県の参照データを一括取得（CSV）

内申点の計算方式（満点・対象学年・実技倍率・出典）を47都道府県分まとめて取得できる。

```bash
curl -o prefectures.csv "https://my-naishin.com/api/naishin/csv"
```

Python（標準ライブラリの `csv` のみ・pandas等の追加依存なし）:

```python
import csv
import urllib.request

url = "https://my-naishin.com/api/naishin/csv"
with urllib.request.urlopen(url) as res:
    text = res.read().decode("utf-8-sig")  # BOM付きUTF-8

reader = csv.DictReader(text.splitlines())
rows = list(reader)
print(f"{len(rows)}件の都道府県データを取得")
for row in rows[:3]:
    print(row["code"], row["name"], row["maxScore"])
```

同じ正準ソース（`src/lib/naishin-dataset.ts`）から生成されるため、`GET /api/naishin`（JSON）と数値は完全に一致する。

## パターン②: 複数都道府県の横並び比較（同一評定）

同じ評定でも都道府県ごとに満点・倍率設計が異なる点を横並びで確認できる（`GET /api/naishin/compare`）。

```bash
curl "https://my-naishin.com/api/naishin/compare?codes=tokyo,osaka,hyogo&grade=4"
```

実際のレスポンス（`comparePrefectures()` を実行して取得。オール4のときの内申点）:

```json
{
  "grade": 4,
  "note": "全教科オール4のときの各県の内申点（調査書点）。満点と倍率設計の違いで素点が同じでも内申は変わります。出典: My Naishin（https://my-naishin.com）",
  "count": 3,
  "results": [
    { "code": "tokyo", "name": "東京都", "region": "関東", "maxScore": 65, "total": 52, "max": 65, "percent": 80, "toolUrl": "https://my-naishin.com/tokyo/naishin" },
    { "code": "osaka", "name": "大阪府", "region": "近畿", "maxScore": 450, "total": 360, "max": 450, "percent": 80, "toolUrl": "https://my-naishin.com/osaka/naishin" },
    { "code": "hyogo", "name": "兵庫県", "region": "近畿", "maxScore": 250, "total": 200, "max": 250, "percent": 80, "toolUrl": "https://my-naishin.com/hyogo/naishin" }
  ]
}
```

同一評定でも達成率（`percent`）は都道府県間でほぼ揃う設計だが、満点・素点は大きく異なる点に注意（生徒への説明にそのまま使える）。

## パターン③: 多数の生徒の判定（ループ処理）

生徒ごとに異なる素点を判定する専用の一括エンドポイントは無いため、チュートリアル1の単一判定
（`GET /api/total-score/{code}?academicRaw=&reportRaw=`）を生徒数分ループする。

```python
import json
import time
import urllib.request

students = [
    {"name": "Aさん", "academicRaw": 350, "reportRaw": 200},
    {"name": "Bさん", "academicRaw": 410, "reportRaw": 230},
    {"name": "Cさん", "academicRaw": 280, "reportRaw": 180},
]

results = []
for s in students:
    url = f"https://my-naishin.com/api/total-score/hyogo?academicRaw={s['academicRaw']}&reportRaw={s['reportRaw']}"
    with urllib.request.urlopen(url) as res:
        data = json.load(res)
    results.append({"name": s["name"], "total": data["total"], "totalMax": data["totalMax"]})
    time.sleep(0.1)  # レート上限に配慮（下記参照）

for r in results:
    print(f"{r['name']}: {r['total']} / {r['totalMax']}点")
```

### レート上限の目安

| ティア | 1分あたりリクエスト数 | 月間クォータ |
|---|--:|--:|
| Anonymous（キー無し） | 30 | カウントしない（IP単位の窓のみ） |
| Free（登録キー） | 120 | 10,000 |
| Pro | 600 | 200,000 |
| Scale | 3,000 | 個別契約 |

数百〜数千人規模を定期処理する場合はFree以上のキー発行（`/developers`で無料発行）を推奨。上限に達すると `429`
が返るため、上表を目安にリクエスト間隔を調整するか、Scale（データライセンス・CSV/JSON定期更新フィード）を検討する。

---
関連: [チュートリアル1: 単一判定](./01-single-judgment.md) / [チュートリアル3: ダッシュボード構築](./03-dashboard-building.md)
