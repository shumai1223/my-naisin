# T-Y11B 段階2-a: 47県 R8(令和8年度)公表PDFの機械パース可否台帳（2026-09-02）

## ★最重要の訂正: 2026-09-01着手前ゲートの「75%が要ビジョン解析」は測定バグだった

2026-09-01の着手前ゲート（`ops/tasks/T-Y11B-bairitsu-ingest-parsers.md`）は、ibaraki/nagano/kagoshima
の8県年を検証し「8県年中2県年（25%）のみ機械パース可能・残り75%はToUnicodeマッピング欠落でビジョン
解析必須」と結論していた。

**この結論は誤りだった。** 原因は`pdftotext`の呼び出しに`-enc UTF-8`を付けていなかったこと。
`pdftotext -layout`のデフォルト出力エンコーディングはUTF-8ではないため、日本語（学校名・学科名）が
**すべて空白として出力される**（数字は影響を受けない）。これが「数字のみ抽出できる＝ToUnicode
マッピング欠落」という誤診断を生んでいた。

2026-09-02に`-enc UTF-8`を付けて同じ8県年を再検証した結果、**8県年すべて（100%）が実際は
機械抽出可能**と判明した:

| 県年 | 旧判定(-enc無し) | 新判定(-enc UTF-8) |
|---|---|---|
| ibaraki R8 | ✅usable | ✅usable(変化なし) |
| ibaraki R7 | ❌needs-vision | ✅**usable**(訂正) |
| ibaraki R6 | ❌needs-vision | ✅**usable**(訂正) |
| ibaraki R5 | ❌needs-vision | ✅**usable**(訂正) |
| nagano R8 | ✅usable | ✅usable(変化なし) |
| nagano R7 | ❌needs-vision | ✅**usable**(訂正) |
| kagoshima R8 | ❌needs-vision | ✅**usable**(訂正) |
| kagoshima R7 | ❌needs-vision | ✅**usable**(訂正) |

**したがってT-Y11B段階2の「ハイブリッド設計（pdftotext失敗→pdftoppmビジョン解析へフォールバック）」
という前提自体が過剰設計だった可能性が高い。** `pdftotext -layout -enc UTF-8`を正しく呼べば、
少なくとも今回検証した47県中43県（91%）でR8データがそのまま機械抽出できる（詳細は下表）。

判定ロジック自体（`src/lib/competition-rate-parse-quality.ts`の`assessPdfTextExtraction()`）は
正しく機能している。バグは入力（pdftotextの呼び出し方）側にあった。

## 47県 R8 機械パース可否 一覧（2026-09-02実測・`-enc UTF-8`使用）

再利用可能なスクリプト: `scripts/check-r8-pdf-parse-quality.mjs`

| 判定 | 件数 | 県 |
|---|---|---|
| ✅ usable | 43 | aichi, akita, aomori, chiba, ehime, fukui, fukuoka, gifu, gunma, hiroshima, hokkaido, ibaraki, ishikawa, iwate, kagawa, kagoshima, kanagawa, kochi, kumamoto, kyoto, mie, miyagi, miyazaki, nagano, nagasaki, nara, niigata, oita, okinawa, saga, saitama, shiga, shimane, shizuoka, tochigi, tokushima, tokyo, tottori, toyama, wakayama, yamagata, yamaguchi, yamanashi |
| ❓ inconclusive（スキャン画像PDF・真にビジョン解析が必要） | 1 | fukushima（Creator=Apeos複合機・pdftotext出力は空白2ページのみ＝スキャン画像そのもの。これは測定バグでなく実際に文字層が存在しない） |
| 🚫 skipped（robots.txt遵守） | 1 | hyogo（www2.hyogo-c.ed.jp・再取得せず。R5-R7は2026-09-02に`-enc UTF-8`で再検証しibaraki/nagano/kagoshimaと同様「usable」と判明したため、hyogoのR8も同様の可能性が高いが未確認） |
| 🔁 fetch-error（URL変更の可能性・要再調査） | 1 | okayama（2026-07-25時点は取得成功していたsourceUrlが現在404。ページ移動または削除の可能性。推測で埋めず要再確認のまま記録） |
| 📊 non-pdf（xlsx形式） | 1 | osaka（PDFではなくxlsx配布。pdftotextの対象外・別途xlsx読解が必要） |

**fukuoka**は`sources[]`のurlがHTMLハブページ（`nyushi8.html`）だったため、既存のdocTitleコメントに
記載された実PDFパス（`uploaded/life/806459_62802786_misc.pdf`）を復元して検証した。usable。

生データ: `ops/baselines/r8-pdf-parse-quality-2026-09-02.json`（cjkCharCount/numericRunCount/cjkRatio
を全県分収録）。ダウンロードしたPDF/txtはscratchpad（一時ディレクトリ）に保存しリポジトリにはコミット
しない。

## 段階2への示唆

- **段階2-b（パーサ実装）は、まず「pdftotext -layout -enc UTF-8 → 既存quota定義で列同定」という
  単純な経路を第一候補にしてよい。** ビジョン解析フォールバックは「本当に文字層が存在しない
  スキャン画像PDF」（fukushimaのような例）だけの少数派対応に縮小できる見込み。
- ただし**年ごとにPDF生成方式が変わりうる**という2026-09-01の発見（同一県でも年によって文字層の
  有無が変わる）自体は否定されていない。**測定方法（-enc UTF-8を付けたか）の誤りが「変化」の
  大半を説明していた**というのが今回の訂正であり、「毎年同じ結果になる保証がない」という慎重な
  前提そのものは引き続き妥当（fukushimaのようなスキャン画像PDFは実際に今後も起こりうる）。
- okayamaのURL切れ・osakaのxlsx形式・hyogoのrobots.txt遵守は、それぞれ個別の実装対応が必要
  （段階2-b着手時に県ごとの例外として扱う）。
