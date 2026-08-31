# 2024-r6 スナップショット（令和6年度・**2026-09-01 着手・収集中**）

T-Y11 Task C（`ops/tasks/T-Y11-winter-bairitsu-pipeline.md`）で収集する前々年度（令和6年度）の
制度データ。[[2025-r7]]・[[2026-r8]]と同じ正規形で47都道府県を目指す。N1-2（2025-r7）と全く
同じ収集方針・型を引き継ぐ（新しい型を発明しない）。

## 進捗状況（2026-09-01）

- **entries 2件**（osaka・chiba）
- **unavailable 0件**（今のところ「取得不能」と確定した県は無い）
- 残り45県は未着手

## 収集方針（2025-r7から継承・Y-0を継承）

- **推測で埋めない**。現存する教委サイトに令和6年度版のページ/PDFが残っていればそれを使う。
  残っていない県は Wayback Machine の CDX API で探す。それでも見つからない県は `entries` に
  加えず、`meta.unavailable` に「取得不能」として理由付きで記録する。2値化しない。
- 各エントリの `diffFromCurrentYear` は自由記述のメモで、現行年度（2026-r8）・前年度（2025-r7）
  と比較して制度上の変更があったかを一次ソース確認の時点でその場に書き残す。
- 大市場県（tokyo/kanagawa/aichi/osaka/saitama/chiba/hyogo/fukuoka）から着手する
  （2025-r7と同じ優先順位）。

## ⚠️2026-09-01時点の既知の制約: Internet Archive（Wayback Machine）がサービス一時停止中

このセッション中、複数の都道府県・複数のURLに対してWaybackへアクセスを試みたが、
CDX API自体は正常に応答する一方、実際のページ取得（`web.archive.org/web/<timestamp>/...`）は
毎回`Internet Archive: Temporarily Offline`（HTTP 503）で失敗した（`id_`修飾子を付けた
生バイト取得も同様に失敗）。**現行サイトに一次資料が残っている県から優先的に着手し、
Wayback依存が必要な県は後回しにする**運用が現実的（2025-r7収集時点でも同様の一時停止が
散発していたが、今回は複数回・複数URLで再現したため、より広範囲の一時的な障害の可能性がある）。
次に触れるセッションはまずWaybackの復旧を確認してから、現行サイトに資料が残っていない県
（tokyo等）に着手するとよい。

## 進捗（時系列の一次ソース確認記録）

- 2026-09-01: osaka 1件目。令和6年度実施要項「第7 一般入学者選抜」PDF
  （`https://www.pref.osaka.lg.jp/documents/33542/21_r6_ippan.pdf`・現行ページに掲載されたまま
  現存・curl直叩きで取得成功）p.55「3 入学者の選抜」(3)イ・ウを確認。「調査書中の各教科の評定を
  合計する。その際、第3学年の評定を6倍、第1、2学年の評定を2倍する。（450点満点）」「学力検査
  450点満点との比率をI〜Vの5タイプ(1.4:0.6〜0.6:1.4)から各校が選択」を確認（令和7・8年度分と
  完全一致・変更なし）。
- 2026-09-01: tokyoを試みたが、令和6年度実施要綱の告知ページ
  （`kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20230928_01.html`）が現行サイトで
  404、Wayback CDXでは複数スナップショットが確認できたが本文取得はInternet Archiveの一時停止で
  失敗（上記「既知の制約」参照）。次回はWayback復旧後に再試行するか、現行サイトに残っている他の
  大市場県（kanagawa/aichi/hyogo/fukuoka）から先に着手するとよい。
- 2026-09-01: chiba 2件目。令和6年度実施要項本体（`documents/02r6ippan.pdf`・現行サイトに
  掲載されたまま現存・WebSearchでURL特定後curl直叩きで取得成功）p.8「第9 選抜方法」4(1)アを
  直接確認。「調査書の教科(9教科)の評定の全学年合計値に各高等学校が定めるK(原則1・学科ごとに
  0.5以上2以下の範囲で別定)を乗じて調査書の得点とする」を確認（K=1の代表値で135点満点・
  令和7・8年度分と完全一致・変更なし）。saitamaも試みたが、R7で使われた文書ID
  （`documents/254997/52senbatsuyoryo_r7.pdf`）に対応するR6の文書ID
  （検索で見つけた`documents/238245/97_jisshiyoko_r6.pdf`）が404で、Wayback CDX API自体も
  タイムアウトしたため保留（Internet Archiveの不調がCDX検索にも及んでいる可能性）。
- 2026-09-01: hyogoも試みたが、WebSearchが提示した令和6年度専用ページ
  （`hpe/koko/contents/nyuushi/senbatsuyoukou_r6/`）自体が現行サイト・WebFetchとも404だった
  （兵庫県教育委員会サイトはPDF直URLが`hpe/uploads/sites/10/<年>/<月>/`配下で年度ごとに変動する
  ため、検索結果のタイトルだけでは実URLを特定できなかった）。次回は同じくWebSearchで見つかった
  別候補ページ（`hpe/koko/nyuushi/senbatsu2024/`）から辿るか、Wayback復旧後にCDX検索するとよい。
