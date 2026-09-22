# 2023-r5 スナップショット（令和5年度・**2026-09-22 着手・収集中**）

T-Y11 Task C（`ops/tasks/T-Y11-winter-bairitsu-pipeline.md`）で収集する、2024-r6よりさらに1年
遡ったスナップショット。[[2024-r6]]・[[2025-r7]]・[[2026-r8]]と同じ正規形で47都道府県を目指す。
収集方針・型は全て継承する（新しい型を発明しない）。

## なぜ着手したか

Task Cの本文に「2023-r5は未着手」と明記されたまま長期間残っていた（2024-r6は2026-09-15に
47/47=frozen済み）。T-Y13/T-Y14/T-Y15など今期優先の主食タスクが払底判定に近づいたため、
バックログの中で「明示的に未着手」と記録された残作業として着手した。

## 進捗状況（2026-09-22）

- **entries 8件**（ehime・kochi・yamanashi・osaka・chiba・tochigi・wakayama・ibaraki）。
- ehime/kochi/yamanashiは2024-r6のURLパターン（`r06`→`r05`等の年度部分の置換）で
  直接発見でき、pdftotextはCJKテキスト抽出不可（他県と同型の既知の制約。yamanashiは
  通常の空白でなく文字コードがシフトされたグリフのmojibakeという別パターン）だったため
  PyMuPDFでページをPNGにレンダリングしてビジョン解析した。
- **osaka/chiba/tochigi/wakayama/ibarakiは単純なURL置換では404だったが、「県教委
  サイトの年度別実施要項案内ページ」をWebSearchで見つけてから辿ると発見できた**。
  これが今回確立した主要手法。ページID・フォルダ番号・ファイル名の枝番・
  WordPressのpost slugはいずれも年度で不規則に変わる（wakayamaは年度ごとにページID
  自体が別・tochigiはR5だけフォルダ番号が初回作成時のまま・ibarakiはslugが
  `bylaws/`→`page-26505/`のように付け替わる）ため、機械的な数字置換だけに頼らないこと。
- 8県とも2024-r6・2025-r7・2026-r8と数値が完全一致（変更なし）。
- **nagano/toyama/iwate/shimane/aomoriは全て試行済みだが、WebSearchが提示した
  URLがいずれも実際には404だった、または索引ページの現行版が古い年度のPDFへの
  リンクを既に削除していた**（WebSearch要約の作話パターン・既知のリスクを複数回
  再確認。nagano/toyamaは`archive.org/wayback/available`APIでもスナップショット
  なしと確認済み）。Wayback CDX APIは2026-09-22時点で断続的に「Temporarily
  Offline」または429レート制限のため、この5県は裏取り不能で保留中。osaka/chiba/
  tochigi/kanagawa等のWayback依存県も同じ理由で復旧待ち。

## 収集方針（2024-r6から継承・Y-0を継承）

- **推測で埋めない**。現存する教委サイトに令和5年度版のページ/PDFが残っていればそれを使う。
  残っていない県は Wayback Machine の CDX API で探す。それでも見つからない県は `entries` に
  加えず、`meta.unavailable` に「取得不能」として理由付きで記録する。2値化しない。
- 各エントリの `diffFromCurrentYear` は自由記述のメモで、現行年度（2026-r8）・前年度（2025-r7）・
  前々年度（2024-r6）と比較して制度上の変更があったかを一次ソース確認の時点でその場に書き残す。
- **優先度は低い**（Task C本文に明記: 提案書9/6には間に合わず今期の収益への寄与は間接的）。
  T-Y13/T-Y14/T-Y15/T-S13A等の今期主食が払底した時の隙間タスクとして進める。

## 次にやること

未試行の県から、まず現行サイト直接型（`src/data/snapshots/2024-r6/exam-system.json`の
sourceUrlで`web.archive.org`を含まない県）を優先し、osaka/chiba/tochigi/wakayama/ibaraki
と同じ「県教委サイトの年度別実施要項案内ページをWebSearchで探す」型を試す。
nagano/toyama/iwate/shimane/aomoriは今回このセッションで試行済みだが解決できなかった
（詳細は上記「進捗状況」参照）ので、次回は同じ検索を繰り返すより先にWayback CDX APIの
復旧（`archive.org/wayback/available`で確認可能）を待つか、県サイト内を直接クロールして
索引ページを探す（トップページ→教育委員会→高校入試の階層を辿る）方式に切り替えると
よい。大市場県のうちkanagawa/aichi/saitama/hyogo/fukuokaはR6時点でWayback依存だった
ため、同じくWayback復旧待ち。
