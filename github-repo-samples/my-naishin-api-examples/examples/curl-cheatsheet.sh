#!/bin/sh
# My Naishin API curlチートシート（認証不要・そのまま実行可能）
set -e

BASE_URL="https://my-naishin.com"

echo "=== 1) 全47都道府県の一覧 ==="
curl -s "$BASE_URL/api/naishin" | head -c 500
echo "\n"

echo "=== 2) 東京都の詳細（計算式・確定値の計算例つき） ==="
curl -s "$BASE_URL/api/naishin/tokyo" | head -c 500
echo "\n"

echo "=== 3) APIの死活監視（認証不要） ==="
curl -s "$BASE_URL/api/status"
echo "\n"

echo "=== 4) 目標内申から逆算（必要評定平均＋効率の良い教科） ==="
curl -s "$BASE_URL/api/naishin/tokyo?target=240"
echo "\n"

echo "=== 5) 複数都道府県を同じ評定で横並び比較 ==="
curl -s "$BASE_URL/api/naishin/compare?codes=tokyo,osaka,hyogo&grade=4"
echo "\n"

echo "=== 6) MCP経由: 生徒の評定から内申点を計算（全47都道府県対応） ==="
curl -s -X POST "$BASE_URL/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"calculate_naishin","arguments":{"prefectureCode":"hyogo","scores":{"japanese":4,"math":4,"english":5,"science":3,"social":4,"music":4,"art":3,"pe":4,"tech":3}}}}'
echo "\n"

echo "=== 7) 内申点×当日点の総合得点（対応5県のみ・非対応県は404） ==="
curl -s "$BASE_URL/api/total-score/hyogo?academicRaw=420&reportRaw=200"
echo "\n"

echo "=== 8) MCPツール一覧の取得（25ツール） ==="
curl -s -X POST "$BASE_URL/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | head -c 500
echo "\n"
