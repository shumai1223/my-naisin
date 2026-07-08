# チュートリアル1: 1人分の総合得点判定（P-6）

生徒1人の学力検査の素点・内申素点から、総合得点を実際に計算する例。`GET /api/total-score/{code}` に
`academicRaw`（学力検査の素点）・`reportRaw`（内申の素点）をクエリで渡すと、その場で計算した結果が返る。

以下の値は `src/lib/total-score/engine.ts` の `computeTotalScore()` を実際に実行して取得した値（架空の数値ではない）。

## curl

```bash
curl "https://my-naishin.com/api/total-score/hyogo?academicRaw=350&reportRaw=200"
```

レスポンス:

```json
{
  "mode": "compute",
  "code": "hyogo",
  "name": "兵庫県",
  "academic": 175,
  "report": 200,
  "total": 375,
  "totalMax": 500,
  "option": {
    "id": "standard",
    "label": "判定資料A・C 同等（内申250：学力250）",
    "reportMax": 250,
    "academicMax": 250
  }
}
```

## Python（標準ライブラリのみ・追加依存なし）

```python
import json
import urllib.request

url = "https://my-naishin.com/api/total-score/hyogo?academicRaw=350&reportRaw=200"
with urllib.request.urlopen(url) as res:
    data = json.load(res)

print(f"{data['name']}: {data['total']} / {data['totalMax']}点")
# => 兵庫県: 375 / 500点
```

## JavaScript（fetch）

```javascript
const res = await fetch('https://my-naishin.com/api/total-score/hyogo?academicRaw=350&reportRaw=200');
const data = await res.json();
console.log(`${data.name}: ${data.total} / ${data.totalMax}点`);
// => 兵庫県: 375 / 500点
```

## 逆算モード（目標総合得点から必要な学力検査点を計算）

`targetTotal`・`reportRaw` を渡すと、目標に必要な学力検査の素点を逆算できる（`requiredAcademicRaw()`）。

```bash
curl "https://my-naishin.com/api/total-score/hyogo?targetTotal=420&reportRaw=200"
```

## 対応都道府県

`GET /api/total-score` で総合得点システムに対応した都道府県コード一覧が取得できる。内申点単体の判定（都道府県の
換算方式に沿った内申点計算）は `GET /api/naishin/{code}?target=180` を使う（詳細は `/developers`）。

---
関連: [チュートリアル2: 一括処理](./02-batch-processing.md) / [チュートリアル3: ダッシュボード構築](./03-dashboard-building.md)
