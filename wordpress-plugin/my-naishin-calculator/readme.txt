=== My Naishin 内申点・偏差値 計算ウィジェット ===
Contributors: myNaishin
Tags: education, calculator, japan, high-school, widget
Requires at least: 5.0
Tested up to: 6.6
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

ショートコード1つで、無料の内申点・偏差値計算ツールをブログに埋め込めます。

== Description ==

塾・教育ブログ・受験情報サイトの運営者向けに、読者がその場で「内申点（素内申・評定平均）」または
「偏差値（5教科）」を計算できるツールを、ショートコード1つで設置できるプラグインです。

* 完全無料・登録不要
* 計算ロジックはMy Naishin（https://my-naishin.com）側で提供・常に最新
* 入力データは利用者の端末内のみで処理され、外部送信されません

== Installation ==

1. `my-naishin-calculator.php` をWordPressの `wp-content/plugins/my-naishin-calculator/` に配置します
2. 管理画面の「プラグイン」から有効化します
3. 投稿・固定ページの本文に以下のショートコードを挿入します

`[my_naishin type="naishin"]`

偏差値ツールを埋め込む場合:

`[my_naishin type="hensachi"]`

高さを変更したい場合（既定640px）:

`[my_naishin type="naishin" height="700"]`

== Frequently Asked Questions ==

= クレジット表記は削除してもいいですか？ =

「Powered by My Naishin」のクレジットリンクは、無料で提供を続けるための唯一のお願いとして、
削除しないようお願いしています（枠の色など外側のスタイル調整は自由です）。

= 複数の都道府県別の計算に対応していますか？ =

このショートコードは全国共通の簡易計算（素内申・偏差値）です。都道府県別の正確な換算内申は
https://my-naishin.com 本体でご案内しています。

== Changelog ==

= 1.0.0 =
* 初版リリース。[my_naishin] ショートコード（naishin/hensachi）に対応。
