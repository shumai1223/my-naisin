# チュートリアル3: 生徒向けダッシュボードの構築例（P-6）

複数のエンドポイントを組み合わせて、「内申点」「総合得点」「偏差値の立ち位置」を1画面で見せる
簡易ダッシュボードを作る例。外部の可視化ライブラリを使わず、素のHTML/CSSで棒グラフを描く（依存ゼロ）。

## 使うエンドポイント

| 用途 | エンドポイント |
|---|---|
| 都道府県別の内申点計算方式・厳密な計算例 | `GET /api/naishin/{code}` |
| 総合得点の実測値（学力検査点・内申素点から計算） | `GET /api/total-score/{code}?academicRaw=&reportRaw=` |
| 偏差値→上位%・順位の対応表 | `GET /api/hensachi/percentile-table?values=` |

## 1. APIキーの発行（Pro以上を組み込む場合）

匿名（キー無し）でも動くが、本番組み込み・高頻度アクセスにはキー発行を推奨（`/developers` で無料発行）。

```bash
curl -X POST https://my-naishin.com/api/keys -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
```

発行されたキーはリクエストヘッダで渡す:

```javascript
const headers = { Authorization: 'Bearer YOUR_API_KEY' };
```

## 2. 3つのAPIをまとめて取得する

```javascript
async function loadDashboardData(prefectureCode, academicRaw, reportRaw, hensachiValues) {
  const headers = { Authorization: 'Bearer YOUR_API_KEY' };

  const [naishin, totalScore, percentile] = await Promise.all([
    fetch(`https://my-naishin.com/api/naishin/${prefectureCode}`, { headers }).then((r) => r.json()),
    fetch(`https://my-naishin.com/api/total-score/${prefectureCode}?academicRaw=${academicRaw}&reportRaw=${reportRaw}`, { headers }).then((r) => r.json()),
    fetch(`https://my-naishin.com/api/hensachi/percentile-table?values=${hensachiValues.join(',')}`, { headers }).then((r) => r.json()),
  ]);

  return { naishin, totalScore, percentile };
}
```

## 3. 依存ゼロの棒グラフ（HTML/CSSのみ）

`totalScore.percent`（達成率%）をそのまま棒の幅に使うだけで、ライブラリなしで簡易バーが描ける。

```javascript
function renderTotalScoreBar(containerEl, totalScore) {
  containerEl.innerHTML = `
    <div style="font-size:14px;font-weight:bold;">${totalScore.name} 総合得点</div>
    <div style="background:#e2e8f0;border-radius:8px;overflow:hidden;height:24px;margin-top:4px;">
      <div style="background:#2563eb;height:100%;width:${(totalScore.total / totalScore.totalMax) * 100}%;"></div>
    </div>
    <div style="font-size:12px;color:#64748b;margin-top:2px;">${totalScore.total} / ${totalScore.totalMax}点</div>
  `;
}
```

## 4. 偏差値の立ち位置テーブル

`percentile-table` の結果をそのままテーブル表示すれば「偏差値60=上位15.9%・1000人中159位」のような
立ち位置を数値で見せられる（正規分布から算出した数学的な目安・実際の母集団分布とは異なる場合がある旨を明記する）。

```javascript
function renderPercentileTable(containerEl, percentileData) {
  const rows = percentileData.table
    .map((row) => `<tr><td>${row.h}</td><td>上位${row.upperPercent.toFixed(1)}%</td><td>${row.rank1000}位/1000人中</td></tr>`)
    .join('');
  containerEl.innerHTML = `<table><thead><tr><th>偏差値</th><th>上位%</th><th>順位目安</th></tr></thead><tbody>${rows}</tbody></table>`;
}
```

## まとめ

このパターンで「内申点の仕組み解説」「今の総合得点」「偏差値の立ち位置」の3点を1画面にまとめられる。
可視化ライブラリ（Chart.js等）を使う場合は、上記のJSONレスポンスをそのままデータソースとして渡せる。

---
関連: [チュートリアル1: 単一判定](./01-single-judgment.md) / [チュートリアル2: 一括処理](./02-batch-processing.md)
