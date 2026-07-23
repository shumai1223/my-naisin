<?php
/**
 * Plugin Name: My Naishin 内申点・偏差値 計算ウィジェット
 * Plugin URI: https://my-naishin.com/embed
 * Description: ショートコード [my_naishin] を使って、内申点（素内申・評定平均）または偏差値（5教科）の計算ツールを記事・固定ページに埋め込めます。無料・登録不要。X-28（超弩級・被リンク獲得施策）の一環として提供する汎用配布版です。
 * Version: 1.0.0
 * Author: My Naishin
 * Author URI: https://my-naishin.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: my-naishin-calculator
 *
 * このプラグインは https://my-naishin.com/embed/naishin および
 * https://my-naishin.com/embed/hensachi を iframe で埋め込むだけの薄いラッパーです。
 * 計算ロジック自体はサーバー側（my-naishin.com）に存在し、このプラグインは更新不要で
 * 常に最新の計算式を表示します。ページ内のクレジット表記（Powered by My Naishin）は
 * ショートコードの出力に含まれる必須要素であり、削除しないようお願いしています
 * （/embed ページの「ご利用にあたってのお願い」と同じ条件）。
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセス禁止。
}

/**
 * [my_naishin type="naishin|hensachi" height="640"] ショートコード。
 *
 * @param array $atts ショートコード属性。
 * @return string 埋め込み用HTML。
 */
function my_naishin_calculator_shortcode( $atts ) {
	$widgets = array(
		'naishin'  => array(
			'path'  => '/embed/naishin',
			'title' => '内申点・評定平均 計算ツール｜My Naishin',
			'label' => '内申点・評定平均',
		),
		'hensachi' => array(
			'path'  => '/embed/hensachi',
			'title' => '偏差値 計算ツール｜My Naishin',
			'label' => '偏差値（5教科）',
		),
	);

	$atts = shortcode_atts(
		array(
			'type'   => 'naishin',
			'height' => '640',
		),
		$atts,
		'my_naishin'
	);

	$type = isset( $widgets[ $atts['type'] ] ) ? $atts['type'] : 'naishin';
	$w    = $widgets[ $type ];

	$height = absint( $atts['height'] );
	if ( $height <= 0 ) {
		$height = 640;
	}

	$src = 'https://my-naishin.com' . $w['path'];

	$html  = '<iframe src="' . esc_url( $src ) . '" width="100%" height="' . esc_attr( $height ) . '" ';
	$html .= 'style="border:1px solid #e5e7eb;border-radius:16px;max-width:480px" ';
	$html .= 'title="' . esc_attr( $w['title'] ) . '" loading="lazy"></iframe>';
	$html .= '<p style="max-width:480px;margin:6px auto 0;font-size:12px;color:#64748b;text-align:center">';
	$html .= esc_html( $w['label'] ) . ' 計算ツール by <a href="https://my-naishin.com/" target="_blank" rel="noopener">';
	$html .= 'My Naishin（内申点 計算サイト）</a></p>';

	return $html;
}
add_shortcode( 'my_naishin', 'my_naishin_calculator_shortcode' );
