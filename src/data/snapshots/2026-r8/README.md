# 2026-r8 スナップショット（令和8年度・凍結済み）

T-N1-1（`ops/tasks/T-N1-N4-revenue-ceiling.md`）で生成した、来年度以降の制度変更差分を取るための基準点。

- 生成日: 2026-08-30
- 生成方法: `npx tsx scripts/freeze-exam-snapshot.ts`（`src/lib/prefectures.ts` を機械比較可能な正規形へ変換）
- **このディレクトリは生成後に書き換え禁止。** `prefectures.ts` が後日修正・訂正されても、このファイルは追随させない。
  来年度分は新しいディレクトリ（例: `2027-r9/`）を作って比較する。

## 既知の未完了（正直な明記・N1-0の方針どおり）

- `pdfHash` は**47件中6件のみ取得済み**（2026-08-30追加。`sourceUrl` が直接PDFリンクだった
  yamagata/fukushima/tochigi/niigata/ishikawa/tokushimaの6県。`curl --ssl-no-revoke` で取得し
  Node `crypto.createHash('sha256')` で計算）。残り41件は `null` のまま。
- 残り41件は `sourceUrl` が教育委員会のポータル/HTMLページであり、実際の一次ソースPDFのURLを
  個別に特定する作業が必要（N1-2の前年度収集と同種の重い作業）。**9/08〜9/22の👤不在期間に
  N1-2と合わせて着手する予定**。架空の値を入れることは捏造にあたるため、それまでは`null`のまま
  正直に残す。

## 使い方

- 完全性は `src/lib/__tests__/exam-system-snapshot.test.ts` が固定している
  （47件・各県に `sourceUrl`・`fiscalYear` が存在すること等）。
- 差分エンジン（N1-3・未実装）はこのファイルと将来のスナップショットを比較する。
