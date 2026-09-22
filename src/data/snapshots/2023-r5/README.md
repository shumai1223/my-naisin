# 2023-r5 スナップショット（令和5年度・**2026-09-22 着手・収集中**）

T-Y11 Task C（`ops/tasks/T-Y11-winter-bairitsu-pipeline.md`）で収集する、2024-r6よりさらに1年
遡ったスナップショット。[[2024-r6]]・[[2025-r7]]・[[2026-r8]]と同じ正規形で47都道府県を目指す。
収集方針・型は全て継承する（新しい型を発明しない）。

## なぜ着手したか

Task Cの本文に「2023-r5は未着手」と明記されたまま長期間残っていた（2024-r6は2026-09-15に
47/47=frozen済み）。T-Y13/T-Y14/T-Y15など今期優先の主食タスクが払底判定に近づいたため、
バックログの中で「明示的に未着手」と記録された残作業として着手した。

## 進捗状況（2026-09-22）

- **entries 3件**（ehime・kochi・yamanashi）。全て2024-r6のURLパターン（`r06`→`r05`等の
  年度部分の置換）で直接発見でき、pdftotextはCJKテキスト抽出不可（他県と同型の既知の制約。
  yamanashiは通常の空白でなく文字コードがシフトされたグリフのmojibakeという別パターン）
  だったためPyMuPDFでページをPNGにレンダリングしてビジョン解析した。
- 3県とも2024-r6・2025-r7・2026-r8と数値が完全一致（変更なし）。yamanashiはR6と同じ
  PDFページ位置（18枚目/印刷頁13）に同じ章番号（第9選抜方法）があり、章構成そのものも
  年度間で変わっていないことが分かった。
- **Wayback Machine（Internet Archive）は2026-09-22時点で「Temporarily Offline」を再確認**
  （複数のCDX APIクエリが全てこのエラーページを返した）。osaka/chiba/tochigi/kanagaw等の
  Wayback依存県はこの復旧待ち。現行サイトに直接残っている県を優先して着手すること。

## 収集方針（2024-r6から継承・Y-0を継承）

- **推測で埋めない**。現存する教委サイトに令和5年度版のページ/PDFが残っていればそれを使う。
  残っていない県は Wayback Machine の CDX API で探す。それでも見つからない県は `entries` に
  加えず、`meta.unavailable` に「取得不能」として理由付きで記録する。2値化しない。
- 各エントリの `diffFromCurrentYear` は自由記述のメモで、現行年度（2026-r8）・前年度（2025-r7）・
  前々年度（2024-r6）と比較して制度上の変更があったかを一次ソース確認の時点でその場に書き残す。
- **優先度は低い**（Task C本文に明記: 提案書9/6には間に合わず今期の収益への寄与は間接的）。
  T-Y13/T-Y14/T-Y15/T-S13A等の今期主食が払底した時の隙間タスクとして進める。

## 次にやること

大市場県（tokyo/kanagawa/aichi/osaka/saitama/chiba/hyogo/fukuoka）は軒並みR6時点で
Wayback依存だったため、Wayback復旧まで後回しにするのが効率的。次に着手すべきは
2024-r6で**現行サイトに直接PDFが残っていた県**（iwate/nagano/wakayama/shimane/toyama/
aomori等・`git log`でなく`src/data/snapshots/2024-r6/exam-system.json`のsourceUrlで
`web.archive.org`を含まない県を機械的に絞り込める）から、`r6`→`r5`のような単純な
年度部分置換をまず試し、404ならWebSearchでR5版のURL（document IDが年度で変わることが
多い）を探す。今回試して404だった県（tochigi/toyama/iwate/nagano/wakayama/shimane/
aomori）は単純置換では見つからなかったので、次回はWebSearchでの再挑戦から。
