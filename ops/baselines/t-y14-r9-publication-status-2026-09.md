# T-Y14 令和9年度(R9)選抜方法資料の公表状況台帳(2026-09-20時点)

T-Y14のDBのうちR8のまま残る県について、R9資料の公表有無を確認した記録。**URLが200でも公表済みとは限らない**(福岡は200だが『10月下旬に公表予定』)。
確認方法: 各県のR8ソースがHTMLページの県はそのページを取得し『令和9年度』リンクを抽出。PDF直リンクの県は年度文字列の置換(r8→r9)を試したが多くは404(=命名規則が違うだけで未公表の証拠ではない)。

## R9へ更新済み(13県)
aichi / chiba / ehime / fukui / gifu / kanagawa / miyagi / nagano / niigata / okinawa / shimane / shizuoka / yamanashi

## R9公表を確認したがDB未更新
| 県 | R9資料 | 備考 |
|---|---|---|
| nara | `https://www.pref.nara.lg.jp/n167/p122015.html`(令和9年度入学者選抜概要・更新2026-07-07)。一次選抜一覧【第1希望校】`documents/24281/31_r9gaiyou_ichiji_ichiran_dai1.pdf`(5頁)・【第2希望校】`32_..._dai2.pdf`(3頁)・二次選抜一覧`33_r9gaiyou_niji_ichiran.pdf`(3頁)・調査書の取扱い`24_r9gaiyou_chousasho.pdf` | R8は238レコード(ops/baselines/nara-transcription)。R9は**口頭試問の列が追加**されており、行内の学科(コース)が縦に並ぶ複雑な表=pdftotext -layoutのトークン突合(LCS)は失敗(R8の全フィールド展開とR9の可視トークンが対応しない)。**bbox座標抽出(ehime-r9と同手法)で列を確定してから突合する**。合格人数枠は『10月頃に発表する正式な募集人員で変更の可能性』と注記あり |
| iwate | R8ページ内に『令和9年度入学者選抜日程』(日程のみ)。選抜方法資料は未確認 | 日程ページのみ |
| mie | R8ページに『令和9年度入学者選抜』リンク `/common/04/ci600017179.htm` | 未取得 |
| miyazaki | 『令和9年度県立高等学校生徒募集(令和9年春入学生)について』`/kokokyoiku/kyoikukosodate/kyoiku/20260519170532.html` | 未取得(R8のURLは20250618の日付ページ) |

## 未公表(確認済み)
- fukuoka: `https://www.pref.fukuoka.lg.jp/site/kyouiku/09youkou.html`(令和９年度福岡県立高等学校入学者選抜要項)は200だが本文は『**10月下旬に公表予定です**』のみ(更新2026-06-26)。**10月下旬以降に再確認**。

## 未確認(ハブ調査が必要)
PDF直リンクの県: aomori / fukushima / gunma / hiroshima / hokkaido / ibaraki / kagoshima / kochi / okayama / osaka / tochigi / toyama / yamagata / yamaguchi(r8→r9置換は aomori/kagoshima/kochi/osaka/tochigi/toyama/yamagata で404)。
HTMLだがR9言及なし: nagasaki / oita / saga / saitama / tokushima / tokyo / tottori / wakayama(各R8ページに令和9年度へのリンクが無い=別ページで公表される可能性。県の入試トップから辿る)。
