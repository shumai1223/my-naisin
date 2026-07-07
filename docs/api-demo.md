# API/MCP デモ資料（B2B営業用・E-1）

My Naishin の内申点データAPI・MCPを、送客先候補（塾SaaS・受験アプリ・教育メディア）に見せるための実行例集。
すべて実装済みのロジックから実際に生成した値（架空の数値ではない）。

## 1. REST API（curl 3行）

```bash
# 1) 全47都道府県の一覧（対象学年・倍率・満点・出典）
curl https://my-naishin.com/api/naishin

# 2) 東京都の詳細（計算式・確定値の計算例つき）
curl https://my-naishin.com/api/naishin/tokyo

# 3) APIが生きているか確認（認証不要）
curl https://my-naishin.com/api/status
```

`GET /api/naishin/tokyo` の実際のレスポンス例（`src/lib/naishin-dataset.ts` の `buildPrefectureDetail('tokyo')` を実行して取得。値は本番と同じ計算ロジック）:

```json
{
  "code": "tokyo",
  "name": "東京都",
  "region": "関東",
  "targetGrades": [3],
  "maxScore": 65,
  "description": "中3のみ：5教科×1倍＋実技4教科×2倍（65点満点）",
  "source": {
    "title": "東京都教育委員会「令和8年度入学者選抜実施要綱」",
    "url": "https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html",
    "lastVerified": "2026-04-22"
  },
  "formula": {
    "summary": "各学年で「主要5教科の評定×1 + 実技4教科の評定×2」を求め、対象学年（中3（×1））の倍率をかけて合計します。満点は65点。",
    "coreSubjects": ["国語", "数学", "英語", "理科", "社会"],
    "practicalSubjects": ["音楽", "美術", "保健体育", "技術家庭"]
  },
  "examples": [
    { "label": "オール3", "eachSubjectGrade": 3, "total": 39, "max": 65, "percent": 60 },
    { "label": "オール4", "eachSubjectGrade": 4, "total": 52, "max": 65, "percent": 80 },
    { "label": "オール5", "eachSubjectGrade": 5, "total": 65, "max": 65, "percent": 100 }
  ]
}
```

出典・最終検証日が都道府県ごとに付与されるため、AIエージェント経由でも「一次情報に基づく確定値」を提示できる。

## 2. MCP（AIエージェント向け・JSON-RPC 2.0）

ツール一覧: `list_prefectures` / `get_prefecture` / `calculate_naishin`（他に比較・逆算等あり。詳細は `/developers`）。

`calculate_naishin` の実行例（9教科の評定 → 東京都方式で厳密計算。`src/lib/naishin-dataset.ts` の `calculateNaishin()` を実行して取得した実際の値）:

入力:
```json
{ "prefectureCode": "tokyo", "scores": { "japanese": 4, "math": 4, "english": 5, "science": 4, "social": 3, "music": 4, "art": 4, "pe": 4, "tech": 4 } }
```

出力:
```json
{
  "prefectureCode": "tokyo",
  "prefectureName": "東京都",
  "total": 52,
  "max": 65,
  "percent": 80,
  "validGradeRange": "1〜5",
  "toolUrl": "https://my-naishin.com/tokyo/naishin",
  "note": "正確な配点・特例は各都道府県の選抜要綱をご確認ください。出典: My Naishin（https://my-naishin.com）"
}
```

「概算」ではなく、都道府県ごとに異なる計算式（倍率・満点・対象学年）を反映した確定値が返る点がポイント。塾SaaS・受験アプリ側で自前実装する場合、47都道府県分の入試制度変更を継続的に追従するコストが発生するが、このAPI/MCPを組み込めば追従コストを肩代わりできる。

## 3. 料金・利用条件

`/developers` に無料（匿名/free）〜有償（pro/scale）のティア表と発行UIあり。最初の1社は条件を個別相談可能。
