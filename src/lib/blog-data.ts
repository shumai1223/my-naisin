export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'naishinten-calculation-by-prefecture',
    title: '【完全保存版】内申点の計算方法を都道府県別に徹底解説！',
    description: '内申点の計算方法は都道府県によって全く違う！東京都65点満点、神奈川県135点満点など主要地域の最新計算方法を図解で詳しく解説します。',
    date: '2025-01-15',
    category: '内申点の基礎',
    readTime: '15分',
    tags: ['内申点', '計算方法', '都道府県別'],
    content: `
<div class="lead">
内申点の計算方法は<strong>都道府県によって全く異なります</strong>。この記事では、東京都・神奈川県・大阪府など主要地域の計算方法を、図や表を使って分かりやすく解説します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>内申点とは？なぜ重要なのか</li>
<li>東京都の計算方法（65点満点）</li>
<li>神奈川県の計算方法（135点満点）</li>
<li>大阪府の計算方法</li>
<li>その他の主要都道府県</li>
<li>内申点を上げるコツ</li>
</ul>
</div>

---

## 🎯 内申点とは？

**内申点**とは、中学校での成績を数値化したものです。正式には「調査書点」と呼ばれます。

<div class="point-box blue">
<h4>💡 ポイント</h4>
<p>公立高校入試では「<strong>内申点 ＋ 当日の学力検査</strong>」の合計で合否が決まります。内申点が高いほど、当日の試験で有利になります！</p>
</div>

### 内申点が重要な3つの理由

<div class="card-grid">
<div class="card">
<h4>1️⃣ 合否に直結する</h4>
<p>多くの公立高校で、内申点は合否判定の30〜50%を占めます。</p>
</div>
<div class="card">
<h4>2️⃣ 推薦入試の条件</h4>
<p>推薦入試や私立の併願優遇は、内申点が基準を満たさないと出願できません。</p>
</div>
<div class="card">
<h4>3️⃣ 心の余裕</h4>
<p>内申点が高ければ、当日多少失敗しても挽回できるため、精神的に楽になります。</p>
</div>
</div>

<!-- AD_PLACEHOLDER -->

---

## 🗼 東京都の内申点計算方法

東京都立高校の一般入試では、**中学3年生の成績のみ**を使用します。

<div class="table-container">
<table class="calc-table">
<thead>
<tr><th>教科</th><th>評定</th><th>倍率</th><th>最大点</th></tr>
</thead>
<tbody>
<tr><td>国語</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>数学</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>英語</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>理科</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>社会</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr class="highlight"><td>音楽</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
<tr class="highlight"><td>美術</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
<tr class="highlight"><td>保健体育</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
<tr class="highlight"><td>技術家庭</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
</tbody>
<tfoot>
<tr><td colspan="3"><strong>合計</strong></td><td><strong>65点満点</strong></td></tr>
</tfoot>
</table>
</div>

<div class="point-box red">
<h4>⚠️ 超重要ポイント</h4>
<p><strong>実技4教科が2倍</strong>で計算されます！<br>
例：音楽を「4→5」に上げると<strong>+2点</strong>、数学を「4→5」に上げても<strong>+1点</strong><br>
副教科を軽視すると大損します！</p>
</div>

### 東京都の内申点と当日点の比率

基本は **内申点：当日点 ＝ 3：7** です。

1000点満点に換算すると：
- 内申点（65点満点）→ 300点に換算
- 当日点（500点満点）→ 700点に換算

---

## 🌊 神奈川県の内申点計算方法

神奈川県では、**中学2年と3年の成績**を使用します。

<div class="table-container">
<table class="calc-table">
<thead>
<tr><th>学年</th><th>計算方法</th><th>満点</th></tr>
</thead>
<tbody>
<tr><td>中学2年</td><td>9教科 × 5段階</td><td>45点</td></tr>
<tr class="highlight"><td>中学3年</td><td>9教科 × 5段階 × <strong>2倍</strong></td><td>90点</td></tr>
</tbody>
<tfoot>
<tr><td colspan="2"><strong>合計</strong></td><td><strong>135点満点</strong></td></tr>
</tfoot>
</table>
</div>

<div class="point-box green">
<h4>✅ 神奈川県のポイント</h4>
<ul>
<li><strong>中3の成績が2倍</strong>で計算される</li>
<li>中1の成績は使われない（ただし基礎力として重要）</li>
<li>学校によって内申点と当日点の比率が異なる（2:8〜8:2）</li>
</ul>
</div>

<!-- AD_PLACEHOLDER -->

---

## 🏯 大阪府の内申点計算方法

大阪府は**中学1年から3年まで全学年の成績**を使用します。

<div class="formula-box">
<h4>学年の比重</h4>
<p class="formula"><strong>中1 : 中2 : 中3 ＝ 2 : 2 : 6</strong></p>
</div>

<div class="point-box orange">
<h4>🔥 大阪府の超重要ポイント</h4>
<p>中1・中2の成績が<strong>内申点の40%</strong>を占める！<br>
中3から頑張り始めても間に合わない可能性があります。<strong>中1からコツコツ</strong>が合格への近道です！</p>
</div>

---

## 📍 その他の主要都道府県

### 埼玉県
- **全学年の成績**を使用
- 学年比率は学校により異なる（1:1:2、1:1:3など）
- 中3重視の学校が多い

### 千葉県（135点満点）
- 中1〜中3の全成績を合計
- 高校ごとの係数（K値：0.5〜2）を乗じる

### 北海道（315点満点）
- 全国トップクラスの満点設定
- 中1・中2：各90点（×2倍）
- 中3：135点（×3倍）

---

## 📝 内申点を上げる5つのコツ

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>定期テストで高得点を取る</h4>
<p>内申点に最も影響するのは定期テストの点数です。計画的に勉強しましょう。</p>
</div>
</div>

<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>提出物は期限厳守＋丁寧に</h4>
<p>期限を守るのは当たり前。さらに丁寧に、工夫を加えて提出しましょう。</p>
</div>
</div>

<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>授業態度を見直す</h4>
<p>先生の目を見て話を聞く、積極的に発言するなど、意識を変えましょう。</p>
</div>
</div>

<div class="tip">
<span class="tip-num">4</span>
<div>
<h4>副教科も手を抜かない</h4>
<p>東京都など2倍で計算される地域は特に重要。筆記テスト対策も忘れずに。</p>
</div>
</div>

<div class="tip">
<span class="tip-num">5</span>
<div>
<h4>先生に質問・相談する</h4>
<p>「主体的に学習に取り組む態度」のアピールにもなります。</p>
</div>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li><strong>東京都</strong>：65点満点、中3のみ、実技4教科が2倍</li>
<li><strong>神奈川県</strong>：135点満点、中2・中3、中3が2倍</li>
<li><strong>大阪府</strong>：中1〜中3全部、比率は2:2:6</li>
<li>自分の地域のルールを早めに確認することが大切！</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 今すぐ内申点を計算してみよう！</h3>
<p>My naisinなら、あなたの地域に合わせた内申点が簡単に計算できます。目標との差も一目でわかる！</p>
</div>
    `
  },
  {
    slug: 'improve-grades-from-all-3',
    title: '【現役教師が教える】オール3から内申点を上げる方法15選',
    description: 'オール3から内申点を上げたい中学生必見！現役の先生から聞いた、提出物・授業態度・定期テストの具体的な改善方法を徹底解説します。',
    date: '2025-01-10',
    category: '成績アップ術',
    readTime: '18分',
    tags: ['内申点', 'オール3', '成績アップ', '勉強法'],
    content: `
<div class="lead">
「オール3」は決して悪い成績ではありません。むしろ<strong>伸びしろがたくさんある</strong>ということ！この記事では、現役の中学校教師から聞いた「内申点を上げる具体的な方法」を15個紹介します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>内申点の評価基準を理解しよう</li>
<li>【提出物編】クオリティを爆上げする5つの方法</li>
<li>【授業態度編】先生目線で好印象を与える5つの方法</li>
<li>【定期テスト編】確実に点を取る5つの方法</li>
<li>教科別のワンポイントアドバイス</li>
</ul>
</div>

---

## 🎯 まず知っておくべき！内申点の評価基準

2021年度から、内申点の評価基準が変わりました。現在は以下の**3つの観点**で評価されています。

<div class="three-columns">
<div class="column">
<h4>📚 知識・技能</h4>
<p>定期テストの点数が大きく影響。暗記だけでなく、理解も問われる。</p>
<p class="tag">主に定期テスト</p>
</div>
<div class="column">
<h4>💭 思考・判断・表現</h4>
<p>知識を活用する力。レポート、発表、論述問題などで評価。</p>
<p class="tag">テスト＋発表等</p>
</div>
<div class="column">
<h4>🔥 主体的に学習に取り組む態度</h4>
<p>授業態度、提出物、学習意欲。<strong>最も改善しやすい！</strong></p>
<p class="tag">日々の取り組み</p>
</div>
</div>

<div class="point-box green">
<h4>✅ ここがポイント！</h4>
<p>「主体的に学習に取り組む態度」は<strong>テストの点数に関係なく</strong>上げることができます！つまり、今日から行動を変えれば、次の通知表で結果が出る可能性があります！</p>
</div>

<!-- AD_PLACEHOLDER -->

---

## 📝 【提出物編】クオリティを爆上げする5つの方法

### 方法① 字を「キレイに見せる」テクニック

字が下手でも大丈夫！**キレイに見せる方法**があります。

<div class="step-box">
<h4>すぐできる3つのコツ</h4>
<ol>
<li><strong>鉛筆（BまたはB2）で濃く書く</strong> - シャーペンより読みやすい</li>
<li><strong>角をカクカク書く</strong> - 「止め」「払い」を意識するだけで印象UP</li>
<li><strong>ゆっくり丁寧に書く</strong> - 雑に書くと即減点対象</li>
</ol>
</div>

### 方法② ワークは「色分け」で全部埋める

空白があると「やる気がない」と見られます。色分けで工夫しましょう。

<div class="color-guide">
<div class="color-item">
<span class="color-circle black"></span>
<div>
<strong>鉛筆（黒）</strong>
<p>自力で解いた答え</p>
</div>
</div>
<div class="color-item">
<span class="color-circle red"></span>
<div>
<strong>赤ペン</strong>
<p>丸つけと間違いの修正</p>
</div>
</div>
<div class="color-item">
<span class="color-circle blue"></span>
<div>
<strong>青ペン</strong>
<p>答えを見て写したところ（解説も一緒に）</p>
</div>
</div>
</div>

<div class="point-box blue">
<h4>💡 先生はここを見ている！</h4>
<p>答えを写すこと自体は悪くありません。大切なのは「<strong>わからないところをわかるようにしようとした努力</strong>」が見えること。解説も一緒に青ペンで写しましょう！</p>
</div>

### 方法③ 日付と所要時間を書く

ワークの隅に「5/10（火）30分」のように記録を書きましょう。

これだけで「計画性がある」「自己管理ができる」生徒だと認識されます。

### 方法④ 期限の「2日前」に提出する

ギリギリ提出は印象が悪いです。2日前を目標にすれば、万が一の修正にも対応できます。

### 方法⑤ 先生へのコメントを書く

最強のテクニックです！ワークの最後に一言コメントを書きましょう。

<div class="example-box">
<h4>コメント例</h4>
<ul>
<li>「〇〇が苦手なのでもっと頑張ります！」</li>
<li>「〇〇の授業が分かりやすかったです！」</li>
<li>「次のテストは〇〇点以上が目標です！」</li>
</ul>
</div>

<!-- AD_PLACEHOLDER -->

---

## 🏫 【授業態度編】先生目線で好印象を与える5つの方法

### 方法⑥ 授業前に教科書を開いておく

先生が教室に入る前に、**今日習うページを開いて**おきましょう。

<div class="point-box green">
<h4>✅ なぜ効果的？</h4>
<p>「前回の授業の続きのページを開いている」ということは、授業内容を覚えている証拠。<strong>主体的に学習に取り組む態度</strong>として高評価されます！</p>
</div>

### 方法⑦ 先生の目を見て、うなずきながら聞く

先生は教壇から**生徒一人ひとりの様子がよく見えています**。

- 目線は「先生・黒板・教科書・ノート」だけに
- 説明中は小さくうなずく
- 絶対に窓の外を見たり、机の下を見たりしない

### 方法⑧ 週に1回は発言する

恥ずかしくても、週1回の発言を目標にしましょう。

答えに自信がなくても大丈夫。「〇〇だと思います」と自分の考えを述べることが大切です。

### 方法⑨ わからないところは授業後に質問する

<div class="dialogue-box">
<p class="student">「先生、さっきの〇〇がよくわからなかったのですが…」</p>
<p class="teacher">「いい質問だね！ここはこういうことで…」</p>
</div>

先生は質問されると嬉しいものです。これも「主体的に学習に取り組む態度」の高評価につながります。

### 方法⑩ グループワークでは役割を持つ

- 書記
- 発表者
- 司会

何でもいいので、積極的に役割を引き受けましょう。「何もしない人」という印象は避けたいです。

---

## 📖 【定期テスト編】確実に点を取る5つの方法

### 方法⑪ 2週間前から計画を立てる

一夜漬けでは「知識・技能」の評価は上がりません。

<div class="schedule-box">
<h4>おすすめスケジュール</h4>
<table>
<tr><td><strong>2週間前</strong></td><td>テスト範囲を確認、計画を立てる</td></tr>
<tr><td><strong>10日前</strong></td><td>ワーク1周目（わからないところをチェック）</td></tr>
<tr><td><strong>1週間前</strong></td><td>ワーク2周目（間違えたところを重点的に）</td></tr>
<tr><td><strong>3日前</strong></td><td>ワーク3周目＋暗記項目の総復習</td></tr>
<tr><td><strong>前日</strong></td><td>軽い復習のみ、早めに寝る</td></tr>
</table>
</div>

### 方法⑫ ワークを3周する

<div class="point-box red">
<h4>⚠️ これが最重要！</h4>
<p>定期テストの問題は<strong>ワークから出ることがほとんど</strong>。ワークを3周すれば、テスト範囲の8割はカバーできます！</p>
</div>

### 方法⑬ 小テストは満点を狙う

小テストも内申点に影響します。範囲が狭いので、満点を狙いましょう。

### 方法⑭ 間違いノートを作る

間違えた問題だけを集めたノートを作ると、効率的に復習できます。

### 方法⑮ 苦手教科こそ真剣に取り組む

苦手な教科でも、授業態度を改善すれば「主体的に学習に取り組む態度」の評価は上がります。

---

## 📚 教科別ワンポイントアドバイス

<div class="subject-grid">
<div class="subject-card">
<h4>国語</h4>
<ul>
<li>音読は積極的に手を挙げる</li>
<li>漢字の小テストは満点を目指す</li>
<li>作文・感想文は早めに取り組む</li>
</ul>
</div>
<div class="subject-card">
<h4>数学</h4>
<ul>
<li>途中式をしっかり書く</li>
<li>わからない問題は必ず質問</li>
<li>宿題は必ず自力で解く</li>
</ul>
</div>
<div class="subject-card">
<h4>英語</h4>
<ul>
<li>発音練習は声を出す</li>
<li>単語テストは事前に準備</li>
<li>ALTには積極的に話しかける</li>
</ul>
</div>
<div class="subject-card">
<h4>理科・社会</h4>
<ul>
<li>実験・資料読み取りで意見を述べる</li>
<li>ノートに図やイラストを加える</li>
<li>興味を持った内容は調べ学習</li>
</ul>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 今日からできること</h3>
<ol>
<li>提出物は<strong>期限2日前</strong>に、<strong>色分け</strong>して提出</li>
<li>授業前に<strong>教科書を開いておく</strong></li>
<li><strong>週1回</strong>は発言する</li>
<li>定期テストは<strong>2週間前から</strong>、ワーク<strong>3周</strong></li>
<li>わからないことは<strong>先生に質問</strong></li>
</ol>
</div>

<div class="cta-box">
<h3>🎯 目標の内申点を設定しよう！</h3>
<p>My naisinで現在の内申点を計算し、目標との差を確認しましょう。具体的な数字があると、モチベーションが上がります！</p>
</div>
    `
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
