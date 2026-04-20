import { BlogPost } from '@/lib/blog/types';

export const post: BlogPost = {
    slug: 'kansan-naishin-vs-su-naishin',
    title: '【図解】換算内申と素内申の違いとは？東京都の計算を例に解説',
    description: '「素内申」と「換算内申」の違いを徹底解説。東京都の65点満点の計算方法、調査書点への変換まで具体例で分かりやすく説明します。',
    date: '2026-04-20',
    category: '内申点の基礎',
    readTime: '10分',
    tags: ['換算内申', '素内申', '東京都', '計算方法'],
    lastUpdated: '2026-04-20',
    author: '運営者（My Naishin）',
    sources: [
      { name: '東京都教育委員会', url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/' }
    ],
    content: `
<div class="lead">
「<strong>素内申</strong>」と「<strong>換算内申</strong>」という言葉を聞いたことがありますか？特に東京都の高校入試では、この2つの違いを理解することが重要です。この記事では、図解を使って分かりやすく解説します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>素内申とは？</li>
<li>換算内申とは？</li>
<li>東京都の計算例</li>
<li>調査書点への変換</li>
<li>よくある誤解</li>
</ul>
</div>

---

## 📊 素内申とは？

**素内申（すないしん）**とは、通知表の評定をそのまま足し合わせた点数です。

<div class="formula-box">
<h4>素内申の計算式</h4>
<p>9教科 × 5点 = <strong>45点満点</strong></p>
</div>

例えば、オール4の生徒の素内申は「4 × 9教科 = 36点」となります。

<div class="point-box blue">
<h4>💡 ポイント</h4>
<p>素内申は全国共通の計算方法です。都道府県に関係なく、通知表の数字を足すだけなので計算が簡単です。</p>
</div>

---

## 🔄 換算内申とは？

**換算内申（かんさんないしん）**とは、特定のルールで計算し直した内申点です。

東京都の場合、**実技4教科を2倍**にして計算します。

<div class="formula-box">
<h4>東京都の換算内申計算式</h4>
<p>5教科 × 5点 + 実技4教科 × 5点 × 2 = <strong>65点満点</strong></p>
</div>

### 計算例

<table class="calc-table">
<thead>
<tr><th>教科</th><th>評定</th><th>換算後</th></tr>
</thead>
<tbody>
<tr><td>国語</td><td>4</td><td>4点</td></tr>
<tr><td>数学</td><td>3</td><td>3点</td></tr>
<tr><td>英語</td><td>4</td><td>4点</td></tr>
<tr><td>理科</td><td>4</td><td>4点</td></tr>
<tr><td>社会</td><td>3</td><td>3点</td></tr>
<tr><td>音楽</td><td>4</td><td>8点（×2）</td></tr>
<tr><td>美術</td><td>3</td><td>6点（×2）</td></tr>
<tr><td>保体</td><td>5</td><td>10点（×2）</td></tr>
<tr><td>技家</td><td>4</td><td>8点（×2）</td></tr>
<tr class="highlight"><td><strong>合計</strong></td><td>-</td><td><strong>50点/65点</strong></td></tr>
</tbody>
</table>

この生徒の場合：
- 素内申：34点/45点
- 換算内申：50点/65点

---

## 📈 調査書点への変換

東京都立高校の一般入試では、換算内申をさらに「調査書点」に変換します。

<div class="formula-box">
<h4>調査書点の計算式</h4>
<p>換算内申 ÷ 65 × 300 = <strong>調査書点（300点満点）</strong></p>
</div>

上の例（換算内申50点）の場合：
- 50 ÷ 65 × 300 ≒ **230点**

<div class="point-box green">
<h4>🎯 都立入試の配点</h4>
<ul>
<li>調査書点：300点</li>
<li>学力検査：700点</li>
<li>ESAT-J：20点</li>
<li><strong>合計：1020点満点</strong></li>
</ul>
</div>

---

## ❓ よくある誤解

<div class="faq-item">
<h4>Q. 素内申と換算内申、どちらが重要？</h4>
<p>A. <strong>換算内申</strong>が実際の入試で使われます。素内申は自分の成績を把握するための目安です。</p>
</div>

<div class="faq-item">
<h4>Q. 換算内申は東京都だけ？</h4>
<p>A. いいえ。兵庫県（実技7.5倍）など、他の府県でも独自の換算方式があります。都道府県ごとに確認が必要です。</p>
</div>

<div class="faq-item">
<h4>Q. 中1・中2の成績は関係ない？</h4>
<p>A. 東京都は<strong>中3のみ</strong>ですが、神奈川県（中2・中3）、埼玉県（中1〜中3）など、地域によって異なります。</p>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>素内申＝通知表をそのまま足した点数（45点満点）</li>
<li>換算内申＝都道府県ルールで計算し直した点数</li>
<li>東京都は実技2倍で65点満点</li>
<li>実際の入試では「調査書点」に変換される</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 あなたの換算内申を計算しよう！</h3>
<p>My Naishinなら、都道府県を選ぶだけで自動的に換算内申が計算されます。東京都以外にも対応！</p>
</div>
    `
  };
