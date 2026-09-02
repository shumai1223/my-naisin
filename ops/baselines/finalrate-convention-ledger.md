# T-Y11C: finalRate 公表流儀の台帳（2026-09-02）

## 検算の再現結果（loop が独立に数え直した値）

対話セッション側の一次報告（21,875件・境界値3,181件）を、loop が `src/lib/finalrate-convention.ts`
（BigInt整数演算のみ・`toFixed`/`Math.round(x*100)/100`は不使用）で独立に再現した。

```
実レコード数（officialSubtotals集計行166件を除く）  21,739件
四捨五入の境界値（x.xx5、round2とtrunc2が割れる）      3,172件（14.6%）
round2/round1/trunc2のいずれとも一致しない            27件
```

⚠️ 対話セッションの21,875件は`officialSubtotals`（県教委公表の集計行・`label`/`schoolCount`を
持つ）を含めて数えていた可能性が高い（`quota:`の総出現数は21,906件・`officialSubtotals`相当の
`label:`エントリは166件・21,906-166=21,740で、loopの21,739とほぼ一致）。**「不明とも一致しない
27件」という最重要の結論は対話セッションの内訳（yamanashi20/yamaguchi5/aichi1/hokkaido1=27）と
完全に一致しており、この部分の分析は信頼できる。**

## 判定モデル

各レコードの`finalRate`（格納値）は、以下3方式のいずれかに一致すれば「説明可能」とする
（`classifyStoredRate()`が返す`matches`配列）。3つとも一致しない27件のみが真に未解明。

| 方式 | 内容 | 主な該当パターン |
|---|---|---|
| `round2` | `applicants/quota`を小数第2位に四捨五入 | 47県のほぼ全ての基本形（多数派） |
| `round1` | `applicants/quota`を小数第1位に四捨五入（末尾ゼロを省いた表記） | yamaguchi(484/522件が該当)・nagasaki(435/465件)が突出して多い。他は小規模schoolの偶然一致が主 |
| `trunc2` | `applicants/quota`を小数第2位で切り捨て | 境界値（3,172件）のうち、県が切り捨て公表 or 既知の`toFixed`丸めバグのいずれか（算術だけでは区別不能） |

**境界値（round2とtrunc2が異なる3,172件）は、切り捨て公表か丸めバグかを算術だけでは判定できない**
（[[fable5-loop-protocol]]参照）。miyagiの7件はPDF実測で丸めバグと確定できたため`miyagi.ts`本体を
訂正済み。残りの境界値レコードは、その県のパーサが完成しPDFを実際に読むまで**判定を保留する**
（Y11C-3の不変条件テストはround2/round1/trunc2のいずれかに一致すれば通すため、境界値の判定保留は
テストの合否に影響しない）。

## 確定（PDFを読んだ実績あり）と推定の区別

| 区分 | 県 | 根拠 |
|---|---|---|
| **確定**（7県） | ibaraki, tochigi, akita, tokushima, ishikawa, miyagi, gunma | T-Y11B段階2-bでR8のPDFを実際に読み、パーサ出力が既存データとレコード単位で完全一致することを確認済み。miyagi/gunmaは検証中に既存データの誤り（miyagiの丸めバグ7件・データ側修正済み）も発見している |
| **推定**（40県） | 残り40県 | `finalRate`が3方式のいずれかに一致することを機械確認しただけで、PDF一次ソースによる転記の正しさそのものは未検証（今後T-Y11B段階2-bで県ごとに確定していく） |

## 既知の未説明27件

`src/data/competition-rates/__tests__/finalrate-invariant.test.ts`の
`KNOWN_UNEXPLAINED_EXCEPTIONS`に県・学校名・quota・applicants・格納値を明記して固定件数
アサートしている。内訳: yamanashi 20件（`quota×stored`が`finalApplicants`よりわずかに小さい
値になる規則性があり「finalRateとfinalApplicantsが別時点のスナップショットではないか」という
未確認の仮説がある）・yamaguchi 5件・aichi 1件（744/300=2.48だが格納値2.49）・hokkaido 1件
（0.815という小数第3位まである異物データ）。**いずれもPDFで確認できるまで書き換えない**
（Y-0憲法）。

## 関連ファイル

- `src/lib/finalrate-convention.ts` — 純関数（round2/round1/trunc2・BigInt整数演算）
- `src/lib/__tests__/finalrate-convention.test.ts` — 純関数のユニットテスト
- `src/data/competition-rates/__tests__/finalrate-invariant.test.ts` — 47県横断のfail-closed不変条件テスト
- `ops/tasks/T-Y11C-finalrate-invariant.md` — 起票元タスク（対話セッション作成・2026-09-02）
