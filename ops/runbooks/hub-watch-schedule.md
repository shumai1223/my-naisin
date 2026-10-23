# ハブ監視を毎日動かす(👤が1回だけ登録する・1枚)

作成: 2026-10-23(T-PV2 A-5)。**登録は👤**(loopはタスクスケジューラに登録しない)。

## なぜ必要か
毎朝7:45の `MyNaishin-CompetitionUpdateCheck`(`npm run check:competition-updates`)は、**令和8年度の資料のURLしか見ていない**。令和9年度の倍率PDFは多くの県で**別のURL**に出る(年度がURLに入る県が22県・添付IDが年度ごとに変わる県)ので、このチェックでは永久に「変化なし」のまま見逃す。
令和9年度の資料の出現を拾えるのは、県の**入試ハブページ**を見て新しいリンクを探す `watch-hubs.mjs` だけ。

## いまの範囲(限界)
- 監視できるのは**6県**(千葉・群馬・鹿児島・宮城・埼玉・滋賀)。残り41県は `src/data/publication-hubs.ts` の `hubUrl` が未特定(null)で、見ていない。推測でURLを作らない方針(Y-0)。
- 2026-10-23に1回手動で回した。群馬・滋賀は初回観測で新規リンクが大量に出た(基準作り。令和9年度の倍率PDFではない)。**毎日回し始めて基準を作っておけば、2月に出る「本当に新しい1本」だけが目立つ。**

## 登録(PowerShell。1回だけ)
```
schtasks /Create /SC DAILY /ST 07:50 /TN "MyNaishin-HubWatch" /TR "C:\Users\E24054\my-naisin\scripts\bairitsu-ingest\hub-watch-daily.bat"
```
- 7:45の既存タスクの5分後。同じ端末・同じユーザーで動く。通常の権限で登録できる(管理者不要)。
- 負荷: 1日1回・6県に1アクセスずつ(robots.txtを尊重・UA明示)。
- 一時停止: `schtasks /Change /TN "MyNaishin-HubWatch" /DISABLE`／削除: `schtasks /Delete /TN "MyNaishin-HubWatch" /F`。

## 結果の見方
1. `docs/daily-brief.md` の「倍率公表資料の更新監視」(毎朝7:30のブリーフィング)。
2. `ops/state/hub-events.json` の末尾(`text` に「令和9年度」を含むリンクが新規に出たら、その県の公表が近い合図)。
3. ログ: `C:\Users\E24054\hub-watch.log`(文字化けするときは `Get-Content -Encoding UTF8`)。

## 動いたかの確認
翌朝7:50以降に `hub-watch.log` の末尾が `hub-watch exit=0` で、`ops/state/hub-links/*.json` の更新日時が当日になっていること。
(このPCが7:50にスリープ・電源オフだと実行されない。スケジューラの「ログオン時/起動時に実行」ではなく通常の毎日実行なので、取りこぼした日は次の日に回る。)

## 増やすには(A-2・loop側の作業)
ハブURLが特定できた県から `publication-hubs.ts` に実際に開いて確認したURLを登録する。登録すれば、このタスクが自動で見に行く。
