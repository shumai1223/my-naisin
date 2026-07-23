# My Naishin API / MCP サンプルコード

[My Naishin](https://my-naishin.com) が公開している、日本の中学生向け内申点（調査書点）計算 REST API と
MCP（Model Context Protocol）サーバーの実行可能なサンプルコード集です。

このリポジトリは中学生エンジニア1人（[@shumai1223](https://github.com/shumai1223)）が個人開発した
教育系Webサービスの一部として、API/MCPの利用例を技術コミュニティに向けて公開する目的で用意しました。

- 公式ドキュメント: https://my-naishin.com/developers
- OpenAPI仕様: https://my-naishin.com/api/openapi
- 対応都道府県: 内申点APIは全47都道府県、総合得点API（学力検査点＋内申点）は兵庫・京都・栃木・新潟・鳥取の5県のみ
  （県ごとに入試制度が大きく異なり、一次ソースで検証できた県のみ計算機を公開しているため）

## 特徴

- **認証不要（匿名/freeティア）**: APIキーなしで即座に試せます（レート制限あり）。
- **一次ソース明記**: すべての都道府県データは教育委員会の公式要項・実施要綱に基づき、出典URLを添えて返します。
- **MCP対応**: Claude Desktop等のMCPクライアントから直接ツールとして呼び出せます（25ツール）。

## クイックスタート（curl）

```bash
# 1) 全47都道府県の一覧（対象学年・倍率・満点・出典）
curl https://my-naishin.com/api/naishin

# 2) 東京都の詳細（計算式・確定値の計算例つき）
curl https://my-naishin.com/api/naishin/tokyo

# 3) APIが生きているか確認（認証不要）
curl https://my-naishin.com/api/status
```

## ディレクトリ構成

```
examples/
  node-fetch-example.mjs   # Node.js（fetch標準API）でREST APIとMCPを呼ぶ例
  python-requests-example.py  # Python（requests）で同等の処理をする例
  curl-cheatsheet.sh       # よく使うcurlコマンド集
```

## 実行方法

```bash
# Node.js 18以降（fetch組み込み）
node examples/node-fetch-example.mjs

# Python 3.8以降（要 pip install requests）
python examples/python-requests-example.py

# curlのチートシート（そのままシェルで実行可能）
bash examples/curl-cheatsheet.sh
```

## MCPサーバーとして使う

Claude Desktop等のMCP対応クライアントの設定に、以下のようなエンドポイントを追加することで
25個の計算ツール（内申点計算・偏差値計算・総合得点計算・逆算・教育費シミュレーション等）を
直接呼び出せます。詳細は https://my-naishin.com/developers を参照してください。

```
POST https://my-naishin.com/api/mcp
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"tools/list"}
```

## ライセンス・利用条件

- サンプルコード自体は自由に改変・再利用いただいて構いません。
- APIから取得したデータを利用・再配布する際は、出典として「My Naishin（https://my-naishin.com）」の
  明記にご協力ください。
- レート制限・利用規約の詳細は https://my-naishin.com/developers を参照してください。

## フィードバック

不具合報告・改善提案は My Naishin の開発者ページ（https://my-naishin.com/developers）に記載の
連絡先までお願いします。
