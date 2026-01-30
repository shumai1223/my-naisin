export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  content: string;
  // SEO・信頼性向上用メタデータ
  lastUpdated?: string;
  author?: string;
  supervisor?: string;
  sources?: { name: string; url: string }[];
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
    lastUpdated: '2026-01-30',
    author: 'My Naishin編集部',
    supervisor: '元公立中学校教員（指導歴10年以上）',
    sources: [
      { name: '東京都教育委員会', url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/' },
      { name: '神奈川県教育委員会', url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen.html' },
      { name: '大阪府教育庁', url: 'https://www.pref.osaka.lg.jp/kotogakko/gakuji-g3/' }
    ],
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

さらに、都立一般入試では **ESAT-J（英語スピーキングテスト）** の結果20点を加えて **1020点満点** として扱う説明も一般的です。ESAT-JはA〜Fの6段階評価で、それぞれ20点・16点・12点・8点・4点・0点に換算されます。

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
<p>My Naishinなら、あなたの地域に合わせた内申点が簡単に計算できます。目標との差も一目でわかる！</p>
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
<p>My Naishinで現在の内申点を計算し、目標との差を確認しましょう。具体的な数字があると、モチベーションが上がります！</p>
</div>
    `
  },
  {
    slug: 'naishin-evaluation-criteria-3-points',
    title: '内申点は3観点で決まる！通知表の評価基準をわかりやすく整理',
    description: '「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」の3観点を理解して、内申点の伸ばし方を具体化しよう。',
    date: '2025-01-20',
    category: '内申点の基礎',
    readTime: '12分',
    tags: ['内申点', '評価基準', '通知表'],
    content: `
<div class="lead">
内申点はテストの点数だけで決まるわけではありません。現在の評価は<strong>3つの観点</strong>を総合して判断されるため、日々の取り組みを変えるだけでも評価を伸ばせます。
</div>

<div class="toc">
<h3>📋 この記事でわかること</h3>
<ul>
<li>内申点を決める3観点の意味</li>
<li>観点別評価から評定が決まる流れ</li>
<li>今日からできる改善ポイント</li>
</ul>
</div>

---

## 📘 内申点は「3観点」で決まる

学習指導要領では、評価の軸が次の3つに整理されています。どれか1つが高くても、他が弱いと評定が上がりにくくなるのでバランスが重要です。

<div class="card-grid">
<div class="card">
<h4>知識・技能</h4>
<p>定期テスト、小テスト、基礎知識の定着度。丸暗記だけでなく理解も見られます。</p>
</div>
<div class="card">
<h4>思考・判断・表現</h4>
<p>説明できる力、記述や発表、レポートなどで評価。理由づけが大切です。</p>
</div>
<div class="card">
<h4>主体的に学習に取り組む態度</h4>
<p>提出物、授業態度、振り返りなど日々の行動。最も改善しやすい領域です。</p>
</div>
</div>

<!-- AD_PLACEHOLDER -->

---

## 🔍 観点別評価から評定が決まる流れ

<div class="step-box">
<h4>評価の流れ</h4>
<ol>
<li>日々のテスト・提出物・授業態度を記録</li>
<li>3観点それぞれでA/B/Cの評価がつく</li>
<li>3観点の結果を総合して評定1〜5が決定</li>
</ol>
</div>

<div class="point-box blue">
<h4>💡 ここがポイント</h4>
<p>学校ごとに総合方法は異なりますが、<strong>観点評価の積み重ね</strong>が評定の土台です。通知表の所見欄や提出物のコメントも評価材料になります。</p>
</div>

---

## ✅ 観点別に点を伸ばす具体策

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>知識・技能</h4>
<p>小テスト満点を狙い、テスト範囲ワークは最低2周。間違い直しまで提出。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>思考・判断・表現</h4>
<p>授業ノートに理由や根拠を書く。記述問題は「なぜ？」を言葉にする。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>主体的に学習に取り組む態度</h4>
<p>期限厳守、質問、振り返りの一言コメントを徹底。授業前の準備も評価対象。</p>
</div>
</div>
</div>

---

## 🧭 通知表で確認すべきチェックポイント

<ul>
<li>所見欄に「積極的」「丁寧」などの言葉があるか</li>
<li>提出物の評価コメントが安定して良いか</li>
<li>観点別評価のバランスが崩れていないか</li>
</ul>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>内申点は3観点の総合評価で決まる</li>
<li>日々の提出物・授業態度が評定に直結する</li>
<li>バランスよく取り組むことが最短ルート</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 観点別の改善ポイントを決めよう</h3>
<p>My Naishinで現在の内申点を確認し、どの観点を伸ばすべきか整理しましょう。</p>
</div>
    `
  },
  {
    slug: 'tokyo-naishin-calculation-guide',
    title: '東京都の内申点計算を完全攻略｜素内申・換算内申・調査書点',
    description: '東京都の内申点は「5教科＋実技4教科×2」で65点満点。換算内申と調査書点の計算手順を具体例つきで解説。',
    date: '2025-01-18',
    category: '都道府県別対策',
    readTime: '13分',
    tags: ['東京都', '内申点', '計算方法'],
    content: `
<div class="lead">
東京都の内申点は、実技4教科が<strong>2倍</strong>になるのが最大の特徴です。素内申・換算内申・調査書点の違いを理解すると、戦略が立てやすくなります。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>素内申と換算内申の違い</li>
<li>換算内申65点の計算方法</li>
<li>調査書点300点への換算</li>
<li>内申点で差がつくポイント</li>
</ul>
</div>

---

## 🧮 素内申と換算内申の違い

<div class="formula-box">
<h4>内申点の流れ</h4>
<p class="formula"><strong>素内申（45点） → 換算内申（65点） → 調査書点（300点）</strong></p>
</div>

<div class="table-container">
<table class="calc-table">
<thead>
<tr><th>区分</th><th>計算</th><th>満点</th></tr>
</thead>
<tbody>
<tr><td>素内申</td><td>9教科の評定合計</td><td>45点</td></tr>
<tr class="highlight"><td>換算内申</td><td>5教科 + 実技4教科×2</td><td>65点</td></tr>
</tbody>
</table>
</div>

<!-- AD_PLACEHOLDER -->

---

## 🧾 調査書点300点への換算

都立一般入試では、換算内申65点を<strong>300点満点</strong>に換算します。

<div class="formula-box">
<p class="formula"><strong>調査書点 ＝ 換算内申 ÷ 65 × 300</strong></p>
</div>

<div class="example-box">
<h4>計算例</h4>
<p>換算内申が52点の場合：</p>
<p><strong>52 ÷ 65 × 300 ＝ 240点</strong></p>
</div>

---

## 🎯 内申点で差がつくポイント

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>実技4教科は2倍</h4>
<p>体育・美術・音楽・技術家庭の評定を1上げると、主要5教科の2倍の効果。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>提出物は減点しない</h4>
<p>期限・丁寧さ・コメントで「主体性」をアピールできる教科が多い。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>定期テストの取りこぼしを減らす</h4>
<p>知識・技能の観点はテスト点が土台。ワークの反復が必須。</p>
</div>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>東京都の換算内申は65点満点</li>
<li>実技4教科が2倍で計算される</li>
<li>調査書点は換算内申を300点に換算</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 自分の内申点を試算しよう</h3>
<p>My Naishinなら、9教科の評定を入力するだけで東京都式の内申点がわかります。</p>
</div>
    `
  },
  {
    slug: 'kanagawa-naishin-calculation-guide',
    title: '神奈川県の内申点は中2＋中3で135点満点！計算方法と攻略ポイント',
    description: '神奈川県の内申点は中学2年＋中学3年（2倍）の合計で135点満点。入試のA値の考え方と対策を整理。',
    date: '2025-01-17',
    category: '都道府県別対策',
    readTime: '12分',
    tags: ['神奈川県', '内申点', '計算方法'],
    content: `
<div class="lead">
神奈川県の内申点は<strong>中学2年＋中学3年（2倍）</strong>の成績で決まります。中3の比重が大きいため、早めに戦略を立てることが重要です。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>神奈川県の内申点（A値）の計算方法</li>
<li>具体例で理解する計算手順</li>
<li>入試の評価項目と対策</li>
</ul>
</div>

---

## 🧮 神奈川県の内申点計算方法

<div class="table-container">
<table class="calc-table">
<thead>
<tr><th>学年</th><th>計算</th><th>満点</th></tr>
</thead>
<tbody>
<tr><td>中学2年</td><td>9教科×5段階</td><td>45点</td></tr>
<tr class="highlight"><td>中学3年</td><td>9教科×5段階×2倍</td><td>90点</td></tr>
</tbody>
<tfoot>
<tr><td colspan="2"><strong>合計</strong></td><td><strong>135点</strong></td></tr>
</tfoot>
</table>
</div>

<div class="point-box red">
<h4>⚠️ 中3が2倍</h4>
<p>中3の評定を1上げると<strong>2点分</strong>動きます。中2から基礎固めを進めつつ、中3で一気に伸ばすのが定番戦略です。</p>
</div>

<!-- AD_PLACEHOLDER -->

---

## ✍️ 計算例でイメージをつかむ

<div class="example-box">
<h4>例：中2がオール3、中3がオール4の場合</h4>
<p>中2：3×9＝27点</p>
<p>中3：4×9×2＝72点</p>
<p><strong>合計：99点（135点満点）</strong></p>
</div>

---

## 🎯 入試評価の考え方と対策

神奈川県は「内申点（A値）」に加えて、学力検査（B値）や主体性（C値）が組み合わされるケースがあります。学校によって比率は異なるため、以下の3点を意識しましょう。

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>中3の評定を最優先</h4>
<p>副教科も含めて評定を上げる。提出物と授業態度で取りこぼさない。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>学力検査は5教科の安定が鍵</h4>
<p>教科ごとのムラを減らし、平均点を底上げする。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>主体性の評価も意識</h4>
<p>ノート・振り返り・提出物の丁寧さが評価材料になる。</p>
</div>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>神奈川県の内申点は中2＋中3（2倍）で135点満点</li>
<li>中3の評定が合否を大きく左右する</li>
<li>提出物と授業態度で「主体性」を積み上げる</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 目標点を逆算しよう</h3>
<p>My Naishinで現在の内申点を確認し、志望校までの差を逆算してみましょう。</p>
</div>
    `
  },
  {
    slug: 'chiba-naishin-calculation-guide',
    title: '千葉県の内申点は3年間で決まる！K値の仕組みと計算手順',
    description: '千葉県は中1〜中3の9教科合計（135点満点）をK値で換算。調査書点の考え方を整理します。',
    date: '2025-01-16',
    category: '都道府県別対策',
    readTime: '11分',
    tags: ['千葉県', '内申点', 'K値'],
    content: `
<div class="lead">
千葉県の内申点は<strong>中1〜中3の3年間</strong>すべてが対象です。さらに高校ごとに設定される<strong>K値</strong>で換算されるため、早期の積み上げが重要になります。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>千葉県の内申点の計算方法</li>
<li>K値とは何か</li>
<li>具体例と対策ポイント</li>
</ul>
</div>

---

## 🧮 千葉県の内申点の基本

<div class="formula-box">
<p class="formula"><strong>9教科の評定合計（3年分）× K値</strong></p>
</div>

<ul>
<li>中1〜中3の評定（9教科×5段階）を合計</li>
<li>合計は135点満点（45点×3年）</li>
<li>K値は<strong>0.5〜2</strong>の範囲で高校が設定</li>
</ul>

<!-- AD_PLACEHOLDER -->

---

## 📘 計算例で理解する

<div class="example-box">
<h4>例：3年間オール4の場合</h4>
<p>4点×9教科×3年＝108点</p>
<p>もしK値が1.0なら<strong>108点</strong>、K値が1.5なら<strong>162点</strong>として換算されます。</p>
</div>

<div class="point-box blue">
<h4>💡 K値の意味</h4>
<p>高校ごとに内申点の重みを調整する係数です。志望校のK値を必ずチェックしましょう。</p>
</div>

---

## 🎯 千葉県で内申点を伸ばすコツ

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>中1から積み上げる</h4>
<p>3年間の評定が使われるため、早期の積み上げが最も重要。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>副教科も同じ重み</h4>
<p>実技4教科も5教科と同じ1点。油断せず丁寧に取り組む。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>提出物と振り返りを徹底</h4>
<p>観点別評価の「主体性」を上げると評定が伸びやすい。</p>
</div>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>千葉県は中1〜中3の成績を合計して評価</li>
<li>K値によって内申点の重みが変わる</li>
<li>副教科含めた総合力が重要</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 志望校のK値を調べよう</h3>
<p>内申点を試算し、志望校のK値に合わせて戦略を立てましょう。</p>
</div>
    `
  },
  {
    slug: 'practical-subjects-naishin-strategy',
    title: '実技4教科で内申点を伸ばすコツ｜体育・美術・音楽・技術家庭の攻略法',
    description: '実技教科は才能より「取り組み方」で評価が変わる。体育・美術・音楽・技術家庭の評価ポイントと対策を整理。',
    date: '2025-01-14',
    category: '副教科対策',
    readTime: '14分',
    tags: ['実技4教科', '内申点', '対策'],
    content: `
<div class="lead">
実技4教科は「得意・不得意」で決まると思われがちですが、実際は<strong>授業への取り組み方</strong>が評価に大きく影響します。点数アップのポイントを科目別に整理します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>実技教科で評価される観点</li>
<li>科目別の具体的な対策</li>
<li>内申点につながる行動チェック</li>
</ul>
</div>

---

## 📌 実技教科で見られるポイント

<div class="card-grid">
<div class="card">
<h4>主体性・協調性</h4>
<p>準備や片付け、チームへの声掛けなど「姿勢」が高評価に。</p>
</div>
<div class="card">
<h4>思考・表現</h4>
<p>作品の意図や工夫、振り返りの言語化が評価されやすい。</p>
</div>
<div class="card">
<h4>知識・技能</h4>
<p>基本技術の定着と改善の努力が重視される。</p>
</div>
</div>

<!-- AD_PLACEHOLDER -->

---

## 🎨 科目別の攻略ポイント

<div class="subject-grid">
<div class="subject-card">
<h4>体育</h4>
<ul>
<li>準備運動・片付けは誰よりも早く</li>
<li>苦手競技でも改善ポイントを記録する</li>
<li>チームへの声掛けで主体性を示す</li>
</ul>
</div>
<div class="subject-card">
<h4>美術</h4>
<ul>
<li>「なぜその表現か」をメモする</li>
<li>制作過程の試行錯誤を残す</li>
<li>提出物の仕上げを丁寧に</li>
</ul>
</div>
<div class="subject-card">
<h4>音楽</h4>
<ul>
<li>鑑賞で感じた特徴を言葉にする</li>
<li>合唱や合奏は協調的な姿勢を見せる</li>
<li>演奏は練習記録を残して努力を可視化</li>
</ul>
</div>
<div class="subject-card">
<h4>技術家庭</h4>
<ul>
<li>作業手順を正確に守る</li>
<li>失敗したときの改善点を記録する</li>
<li>生活への活用アイデアを書き足す</li>
</ul>
</div>
</div>

---

## ✅ 内申点につながる行動チェック

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>授業の準備は必ず先に行う</h4>
<p>教具の準備・片付けが早いと評価が上がりやすい。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>振り返りコメントを丁寧に</h4>
<p>「どこが難しかったか」「次にどうするか」を言語化。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>提出物は期限より早く</h4>
<p>主体性と計画性をアピールできる最大のチャンス。</p>
</div>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>実技教科は「取り組み方」で評価が変わる</li>
<li>過程や工夫を言葉で残すことが重要</li>
<li>主体性と協調性を見える形で示す</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 副教科の点数を試算しよう</h3>
<p>My Naishinで9教科を入力し、副教科を上げたときの変化を確認してみましょう。</p>
</div>
    `
  },
  {
    slug: 'tokyo-kansan-naishin-guide',
    title: '【東京都】換算内申の計算方法と都立高校入試の完全ガイド',
    description: '東京都立高校入試で使われる「換算内申」の仕組みを徹底解説。実技4教科が2倍になる理由と、65点満点の計算方法を具体例で紹介します。',
    date: '2025-01-18',
    category: '都道府県別対策',
    readTime: '10分',
    tags: ['東京都', '換算内申', '都立高校', '入試'],
    lastUpdated: '2026-01-30',
    author: 'My Naishin編集部',
    supervisor: '元公立中学校教員（指導歴10年以上）',
    sources: [
      { name: '東京都教育委員会 入学者選抜', url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/' },
      { name: '令和8年度入学者選抜実施要綱', url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20240913_01.html' }
    ],
    content: `
<div class="lead">
東京都立高校の入試では、一般的な「素内申」ではなく<strong>「換算内申」</strong>という独自の計算方法が使われます。この記事では、換算内申の仕組みと、なぜ実技4教科が重要なのかを詳しく解説します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>換算内申とは何か</li>
<li>65点満点の計算方法</li>
<li>実技4教科が2倍になる理由</li>
<li>内申点と当日点の比率</li>
<li>換算内申を上げるコツ</li>
</ul>
</div>

---

## 🗼 換算内申とは？

**換算内申**とは、東京都立高校入試で使われる内申点の計算方法です。中学3年生の成績のみを使用し、**実技4教科の評定を2倍**にして計算します。

<div class="point-box blue">
<h4>💡 ポイント</h4>
<p>東京都では「素内申（45点満点）」ではなく「換算内申（65点満点）」が入試で使われます。これは全国的にも珍しい制度です。</p>
</div>

---

## 🧮 65点満点の計算方法

<div class="table-container">
<table class="calc-table">
<thead>
<tr><th>教科区分</th><th>教科</th><th>評定</th><th>倍率</th><th>最大点</th></tr>
</thead>
<tbody>
<tr><td rowspan="5">5教科</td><td>国語</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>数学</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>英語</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>理科</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr><td>社会</td><td>5段階</td><td>×1</td><td>5点</td></tr>
<tr class="highlight"><td rowspan="4">実技4教科</td><td>音楽</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
<tr class="highlight"><td>美術</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
<tr class="highlight"><td>保健体育</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
<tr class="highlight"><td>技術家庭</td><td>5段階</td><td><strong>×2</strong></td><td>10点</td></tr>
</tbody>
<tfoot>
<tr><td colspan="4"><strong>合計</strong></td><td><strong>65点満点</strong></td></tr>
</tfoot>
</table>
</div>

<div class="formula-box">
<h4>計算式</h4>
<p class="formula"><strong>5教科の合計 ＋ (実技4教科の合計 × 2) ＝ 換算内申</strong></p>
</div>

---

## 🎯 なぜ実技4教科が2倍なのか？

東京都教育委員会は、実技教科の重要性を高めるためにこの制度を採用しています。

<div class="card-grid">
<div class="card">
<h4>理由① バランスの取れた学力</h4>
<p>5教科だけでなく、芸術・体育・技術の分野も重視することで、バランスの取れた生徒を育てる狙いがあります。</p>
</div>
<div class="card">
<h4>理由② 努力が反映されやすい</h4>
<p>実技教科は「主体的な態度」が評価されやすく、努力次第で成績を上げやすい特徴があります。</p>
</div>
</div>

<div class="point-box red">
<h4>⚠️ 実技教科を軽視すると大損！</h4>
<p>例：音楽を「3→4」に上げると<strong>+2点</strong>、英語を「3→4」に上げても<strong>+1点</strong><br>
同じ努力なら、実技教科を上げた方が2倍お得です！</p>
</div>

---

## 📊 内申点と当日点の比率

都立高校の一般入試では、内申点と当日の学力検査を**1000点満点**（7:3換算）で判定します。さらに、**ESAT-J（英語スピーキングテスト）** の結果20点を加えて **1020点満点** として扱う説明も一般的です。

<div class="table-container">
<table class="calc-table">
<thead>
<tr><th>項目</th><th>満点</th><th>換算後</th><th>比率</th></tr>
</thead>
<tbody>
<tr><td>換算内申</td><td>65点</td><td>300点</td><td>約29%</td></tr>
<tr><td>学力検査</td><td>500点</td><td>700点</td><td>約69%</td></tr>
<tr><td>ESAT-J</td><td>A〜F</td><td>0〜20点</td><td>約2%</td></tr>
</tbody>
<tfoot>
<tr><td colspan="2"><strong>合計</strong></td><td><strong>1020点</strong></td><td>100%</td></tr>
</tfoot>
</table>
</div>

<div class="point-box green">
<h4>✅ 内申点300点の価値</h4>
<ul>
<li>換算内申1点 ＝ 約4.6点（300÷65）</li>
<li>学力検査1点 ＝ 1.4点（700÷500）</li>
<li>つまり内申点1点は、当日点の約3.3点分の価値！</li>
</ul>
</div>

---

## 📝 換算内申を上げる5つのコツ

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>実技4教科を最優先で上げる</h4>
<p>2倍で計算されるため、1点上げるだけで2点分の効果があります。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>提出物は完璧に仕上げる</h4>
<p>実技教科の評価で「主体的な態度」は大きなウェイトを占めます。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>授業態度を見直す</h4>
<p>準備・片付けを率先して行い、積極的に参加する姿勢を見せましょう。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">4</span>
<div>
<h4>実技テストの対策も忘れずに</h4>
<p>音楽や美術の筆記テストは勉強すれば点が取れます。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">5</span>
<div>
<h4>中3の1学期から本気で取り組む</h4>
<p>東京都は中3の成績のみ使用。1学期の成績から気を抜かないこと！</p>
</div>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>東京都立高校は「換算内申」65点満点で評価</li>
<li>実技4教科は2倍で計算される</li>
<li>内申点1点は当日点約3.3点分の価値</li>
<li>実技教科を上げることが最も効率的</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 換算内申を計算してみよう！</h3>
<p>My Naishinの「東京都モード」で、あなたの換算内申をすぐに確認できます。</p>
</div>
    `
  },
  {
    slug: 'practical-subjects-tips',
    title: '【副教科攻略】音楽・美術・体育・技家の内申点を確実に上げる方法',
    description: '実技が苦手でも内申点は上げられる！副教科4教科の評価ポイントと、先生が見ているところを現役教師が解説します。',
    date: '2025-01-19',
    category: '副教科対策',
    readTime: '12分',
    tags: ['副教科', '実技教科', '内申点', '音楽', '美術', '体育', '技術家庭'],
    content: `
<div class="lead">
「実技が苦手だから副教科の内申点は上がらない…」と諦めていませんか？実は、副教科の評価は<strong>技術よりも「取り組み方」</strong>が重視されます。この記事では、教科別の具体的な対策を紹介します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>副教科の評価基準を理解する</li>
<li>音楽の内申点を上げる方法</li>
<li>美術の内申点を上げる方法</li>
<li>保健体育の内申点を上げる方法</li>
<li>技術家庭の内申点を上げる方法</li>
<li>共通する最強テクニック</li>
</ul>
</div>

---

## 🎯 副教科の評価基準を理解しよう

2021年度から、全教科共通で以下の3観点で評価されています。

<div class="three-columns">
<div class="column">
<h4>📚 知識・技能</h4>
<p>基本的な技術や知識の習得度。筆記テストや実技テストで評価。</p>
</div>
<div class="column">
<h4>💭 思考・判断・表現</h4>
<p>工夫や創意、自分なりの表現。作品やレポートで評価。</p>
</div>
<div class="column">
<h4>🔥 主体的に学習に取り組む態度</h4>
<p>授業態度、準備、提出物。<strong>ここが最も上げやすい！</strong></p>
</div>
</div>

<div class="point-box green">
<h4>✅ 副教科の特徴</h4>
<p>副教科は「主体的な態度」の比重が高い！つまり、<strong>実技が苦手でも、態度と提出物で十分カバーできます</strong>。</p>
</div>

---

## 🎵 音楽の内申点を上げる方法

<div class="subject-detail">
<h4>評価されるポイント</h4>
<ul>
<li>歌唱・器楽の技術と表現</li>
<li>鑑賞レポートの内容</li>
<li>授業への参加態度</li>
<li>筆記テストの点数</li>
</ul>
</div>

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>鑑賞レポートは「感想＋分析」で書く</h4>
<p>「きれいだった」だけでなく、「なぜそう感じたか」「どの楽器が印象的か」など具体的に書く。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>合唱は大きな声で歌う</h4>
<p>上手い・下手より、一生懸命歌っているかが評価される。口を大きく開けて！</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>筆記テストは覚えれば取れる</h4>
<p>音楽記号、作曲家、楽器の名前など、暗記項目は確実に覚える。</p>
</div>
</div>
</div>

---

## 🎨 美術の内申点を上げる方法

<div class="subject-detail">
<h4>評価されるポイント</h4>
<ul>
<li>作品の完成度と工夫</li>
<li>制作過程（アイデアスケッチ）</li>
<li>鑑賞レポートの内容</li>
<li>授業態度と片付け</li>
</ul>
</div>

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>アイデアスケッチを丁寧に描く</h4>
<p>最終作品より、「どう考えたか」のプロセスが重視される。複数案を出すと高評価。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>作品は必ず「完成」させる</h4>
<p>未完成は大幅減点。時間内に終わらせることを最優先に。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>片付けを率先して行う</h4>
<p>道具の片付け、掃除を積極的にやると「態度」の評価がUP。</p>
</div>
</div>
</div>

---

## 🏃 保健体育の内申点を上げる方法

<div class="subject-detail">
<h4>評価されるポイント</h4>
<ul>
<li>実技テストの記録・技術</li>
<li>授業への取り組み姿勢</li>
<li>保健分野の筆記テスト</li>
<li>チームワーク・協力</li>
</ul>
</div>

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>準備運動を誰よりも早く始める</h4>
<p>チャイムが鳴る前に準備完了。これだけで態度の評価が変わる。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>苦手競技でも全力で取り組む</h4>
<p>記録より「一生懸命やっているか」が見られている。諦めない姿勢を見せる。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>保健の筆記テストで稼ぐ</h4>
<p>実技が苦手なら、筆記テストで挽回。教科書をしっかり読み込む。</p>
</div>
</div>
</div>

---

## 🔧 技術家庭の内申点を上げる方法

<div class="subject-detail">
<h4>評価されるポイント</h4>
<ul>
<li>作品の完成度</li>
<li>作業の正確さ・安全性</li>
<li>レポート・振り返りの内容</li>
<li>筆記テストの点数</li>
</ul>
</div>

<div class="tips-list">
<div class="tip">
<span class="tip-num">1</span>
<div>
<h4>手順書を必ず確認してから作業</h4>
<p>失敗を防ぎ、安全に作業することが高評価につながる。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">2</span>
<div>
<h4>振り返りシートは具体的に書く</h4>
<p>「難しかった」ではなく「〇〇の工程で△△が難しく、□□で解決した」と詳しく。</p>
</div>
</div>
<div class="tip">
<span class="tip-num">3</span>
<div>
<h4>生活への活用を考える</h4>
<p>「この技術を家でどう使えるか」を書くと、思考・判断の評価が上がる。</p>
</div>
</div>
</div>

---

## ⭐ 全教科共通の最強テクニック

<div class="point-box blue">
<h4>💡 これだけで評価が変わる3つの行動</h4>
<ol>
<li><strong>提出物は期限の1日前に出す</strong> → 主体性のアピール</li>
<li><strong>授業後に先生に質問する</strong> → 意欲の証明</li>
<li><strong>振り返りは「次にどうするか」まで書く</strong> → 思考力の証明</li>
</ol>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>副教科は「技術」より「取り組み方」が重視される</li>
<li>提出物と授業態度で大きく差がつく</li>
<li>筆記テストは覚えれば点が取れる</li>
<li>苦手でも「一生懸命さ」を見せることが大切</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 副教科を上げたときの効果を確認しよう！</h3>
<p>My Naishinで副教科の点数を変えてシミュレーション。東京都モードなら2倍の効果を実感できます。</p>
</div>
    `
  },
  {
    slug: 'kansan-naishin-vs-su-naishin',
    title: '【図解】換算内申と素内申の違いとは？東京都の計算を例に解説',
    description: '「素内申」と「換算内申」の違いを徹底解説。東京都の65点満点の計算方法、調査書点への変換まで具体例で分かりやすく説明します。',
    date: '2026-01-28',
    category: '内申点の基礎',
    readTime: '10分',
    tags: ['換算内申', '素内申', '東京都', '計算方法'],
    lastUpdated: '2026-01-30',
    author: 'My Naishin編集部',
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

| 教科 | 評定 | 換算後 |
|------|------|--------|
| 国語 | 4 | 4点 |
| 数学 | 3 | 3点 |
| 英語 | 4 | 4点 |
| 理科 | 4 | 4点 |
| 社会 | 3 | 3点 |
| 音楽 | 4 | 8点（×2）|
| 美術 | 3 | 6点（×2）|
| 保体 | 5 | 10点（×2）|
| 技家 | 4 | 8点（×2）|
| **合計** | - | **50点/65点** |

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
<p>A. いいえ。兵庫県（実技2.5倍）など、他の府県でも独自の換算方式があります。都道府県ごとに確認が必要です。</p>
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
  },
  {
    slug: 'suisen-vs-ippan-naishin',
    title: '【完全ガイド】推薦入試と一般入試で内申点の扱いはどう違う？',
    description: '推薦入試と一般入試では内申点の重要度が全く違います。推薦の内申基準、一般での配点比率、どちらを狙うべきかを詳しく解説。',
    date: '2026-01-25',
    category: '入試制度',
    readTime: '12分',
    tags: ['推薦入試', '一般入試', '内申点', '入試制度'],
    lastUpdated: '2026-01-30',
    author: 'My Naishin編集部',
    sources: [
      { name: '東京都教育委員会', url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/' },
      { name: '文部科学省', url: 'https://www.mext.go.jp/' }
    ],
    content: `
<div class="lead">
高校入試には「<strong>推薦入試</strong>」と「<strong>一般入試</strong>」があり、内申点の扱いが大きく異なります。この記事では、それぞれの特徴と内申点の重要度を詳しく解説します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>推薦入試の内申点の扱い</li>
<li>一般入試の内申点の扱い</li>
<li>私立高校の推薦・併願優遇</li>
<li>あなたはどちらを狙うべき？</li>
</ul>
</div>

---

## 🎓 推薦入試の内申点

### 推薦入試とは？

推薦入試は、学力検査を行わず、**内申点・面接・作文（小論文）**などで合否を決める入試です。

<div class="point-box blue">
<h4>💡 推薦入試の特徴</h4>
<ul>
<li>出願に内申点の「基準」がある</li>
<li>学力検査がない（または比重が低い）</li>
<li>面接・作文・実技などで評価</li>
<li>一般入試より早い時期に実施</li>
</ul>
</div>

### 推薦入試の内申基準（例）

| 高校タイプ | 内申基準の目安 |
|------------|----------------|
| 都立トップ校 | 換算内申60以上（65点中）|
| 都立中堅校 | 換算内申50前後 |
| 私立上位校 | 素内申38〜42（45点中）|
| 私立中堅校 | 素内申32〜36 |

<div class="warning-box">
<h4>⚠️ 注意</h4>
<p>内申基準を満たしていないと、そもそも<strong>出願すらできません</strong>。推薦を狙うなら、早い段階から内申点を意識しましょう。</p>
</div>

---

## 📝 一般入試の内申点

### 一般入試とは？

一般入試は、**学力検査（入試当日のテスト）と内申点**の合計で合否を決める入試です。

<div class="point-box green">
<h4>💡 一般入試の特徴</h4>
<ul>
<li>内申点の「基準」はない（誰でも受験可能）</li>
<li>学力検査の比重が高い</li>
<li>内申点が低くても当日の点数で挽回可能</li>
<li>推薦より募集人数が多い</li>
</ul>
</div>

### 内申点と学力検査の比率（例）

| 都道府県 | 内申点 | 学力検査 |
|----------|--------|----------|
| 東京都 | 300点（約30%）| 700点（約70%）|
| 神奈川県 | 学校により異なる | 学校により異なる |
| 大阪府 | 450点（約40%）| 学校により異なる |
| 愛知県（Ⅲ型）| 90点（約30%）| 210点（約70%）|

---

## 🏫 私立高校の推薦・併願優遇

私立高校には「単願推薦」「併願優遇」という制度があります。

### 単願推薦
- その高校を第一志望にする場合
- 内申基準を満たせば**ほぼ合格**
- 合格したら必ず入学する約束

### 併願優遇
- 公立高校と併願する場合
- 内申基準を満たせば**加点**される
- 公立に落ちた場合のすべり止め

<div class="comparison-table">
<h4>推薦・併願優遇の内申基準例（私立A高校）</h4>
<table>
<tr><th>制度</th><th>内申基準</th><th>特典</th></tr>
<tr><td>単願推薦</td><td>素内申32以上</td><td>ほぼ合格</td></tr>
<tr><td>併願優遇</td><td>素内申34以上</td><td>20点加点</td></tr>
<tr><td>一般入試</td><td>基準なし</td><td>なし</td></tr>
</table>
</div>

---

## 🤔 あなたはどちらを狙うべき？

<div class="card-grid">
<div class="card">
<h4>推薦入試向きの人</h4>
<ul>
<li>内申点が高い（オール4以上）</li>
<li>面接や作文が得意</li>
<li>早めに進路を決めたい</li>
<li>本番のプレッシャーに弱い</li>
</ul>
</div>
<div class="card">
<h4>一般入試向きの人</h4>
<ul>
<li>学力検査で勝負したい</li>
<li>内申点にムラがある</li>
<li>部活を最後まで頑張りたい</li>
<li>直前期に伸びるタイプ</li>
</ul>
</div>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>推薦入試：内申点が「出願条件」になる</li>
<li>一般入試：内申点と学力検査の合計で判定</li>
<li>私立の推薦・併願優遇は内申基準が必須</li>
<li>自分のタイプに合った入試方式を選ぼう</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 推薦基準に届いているかチェック！</h3>
<p>My Naishinで今の内申点を計算して、志望校の推薦基準と比較してみましょう。</p>
</div>
    `
  },
  {
    slug: 'jitsugi-kyoka-prefecture-comparison',
    title: '【一覧】実技4教科（副教科）が有利な県・不利な県を徹底比較！',
    description: '実技教科の内申点が2倍になる県、等倍の県を一覧で比較。副教科が得意な人・苦手な人、それぞれに有利な都道府県を解説します。',
    date: '2026-01-22',
    category: '都道府県別',
    readTime: '8分',
    tags: ['実技教科', '副教科', '都道府県比較', '傾斜配点'],
    lastUpdated: '2026-01-30',
    author: 'My Naishin編集部',
    sources: [
      { name: '各都道府県教育委員会公式サイト', url: '#' }
    ],
    content: `
<div class="lead">
実技4教科（音楽・美術・保健体育・技術家庭）の内申点は、都道府県によって<strong>配点が大きく異なります</strong>。この記事では、実技教科が有利な県・不利な県を一覧で比較します。
</div>

<div class="toc">
<h3>📋 この記事の内容</h3>
<ul>
<li>実技教科の傾斜配点とは？</li>
<li>実技が有利な県（2倍以上）</li>
<li>実技が等倍の県</li>
<li>タイプ別おすすめ戦略</li>
</ul>
</div>

---

## 🎨 実技教科の傾斜配点とは？

**傾斜配点**とは、特定の教科の点数を2倍や1.5倍にして計算する方式です。

<div class="point-box blue">
<h4>💡 なぜ実技教科を重視する県があるの？</h4>
<p>入試当日の学力検査は5教科のみ。実技教科は学力検査で測れないため、内申点で重視することでバランスを取っています。</p>
</div>

---

## 📊 実技教科が有利な県（2倍以上）

実技4教科の評定が**2倍以上**で計算される主な都道府県です。

<div class="table-responsive">
<table>
<tr><th>都道府県</th><th>実技の倍率</th><th>満点</th><th>備考</th></tr>
<tr><td><strong>兵庫県</strong></td><td>2.5倍</td><td>250点</td><td>実技の比重が最も高い</td></tr>
<tr><td><strong>東京都</strong></td><td>2倍</td><td>65点</td><td>中3のみ対象</td></tr>
<tr><td><strong>宮城県</strong></td><td>2倍</td><td>195点</td><td>3年間対象</td></tr>
<tr><td><strong>秋田県</strong></td><td>2倍</td><td>195点</td><td>3年間対象</td></tr>
<tr><td><strong>福島県</strong></td><td>2倍</td><td>195点</td><td>3年間対象</td></tr>
<tr><td><strong>岩手県</strong></td><td>3倍（5教科2倍）</td><td>440点</td><td>特殊な計算方式</td></tr>
<tr><td><strong>京都府</strong></td><td>2倍</td><td>195点</td><td>3年間対象</td></tr>
</table>
</div>

<div class="point-box green">
<h4>🎯 実技が得意な人へ</h4>
<p>これらの県では、実技教科で5を取ると大きなアドバンテージになります。特に兵庫県は2.5倍なので、実技1点アップ＝5教科2.5点分の価値があります！</p>
</div>

---

## 📋 実技教科が等倍の県

実技4教科と5教科が**同じ配点**で計算される主な都道府県です。

<div class="table-responsive">
<table>
<tr><th>都道府県</th><th>計算方式</th><th>満点</th><th>備考</th></tr>
<tr><td>大阪府</td><td>全教科等倍</td><td>450点</td><td>学年比1:2:6</td></tr>
<tr><td>愛知県</td><td>全教科等倍</td><td>45点</td><td>中3のみ</td></tr>
<tr><td>神奈川県</td><td>全教科等倍</td><td>135点</td><td>中2・中3対象</td></tr>
<tr><td>埼玉県</td><td>全教科等倍</td><td>180点</td><td>学年比は学校による</td></tr>
<tr><td>千葉県</td><td>全教科等倍</td><td>135点</td><td>3年間対象</td></tr>
<tr><td>北海道</td><td>全教科等倍</td><td>315点</td><td>学年比2:2:3</td></tr>
<tr><td>福岡県</td><td>全教科等倍</td><td>135点</td><td>3年間対象</td></tr>
</table>
</div>

<div class="point-box yellow">
<h4>💡 5教科が得意な人へ</h4>
<p>これらの県では、5教科と実技教科が同じ価値です。5教科が得意なら、そこで稼ぐ戦略が有効です。</p>
</div>

---

## 🎯 タイプ別おすすめ戦略

<div class="card-grid">
<div class="card">
<h4>実技が得意な人</h4>
<ul>
<li>東京都・兵庫県・宮城県などが有利</li>
<li>実技で5を狙い、5教科は4キープ</li>
<li>推薦入試も視野に入れる</li>
</ul>
</div>
<div class="card">
<h4>5教科が得意な人</h4>
<ul>
<li>大阪府・愛知県・神奈川県などが有利</li>
<li>5教科で稼ぎ、実技は3〜4でOK</li>
<li>一般入試の学力検査で勝負</li>
</ul>
</div>
</div>

---

## 📍 実技教科の1点の価値比較

実技教科で1点上げたときの効果を比較してみましょう。

<div class="comparison-table">
<table>
<tr><th>都道府県</th><th>実技1点の価値</th><th>5教科換算</th></tr>
<tr><td>兵庫県</td><td>2.5点</td><td>5教科2.5点分</td></tr>
<tr><td>東京都</td><td>2点</td><td>5教科2点分</td></tr>
<tr><td>岩手県</td><td>3点</td><td>5教科1.5点分</td></tr>
<tr><td>大阪府</td><td>1点</td><td>5教科1点分</td></tr>
<tr><td>愛知県</td><td>1点</td><td>5教科1点分</td></tr>
</table>
</div>

---

## まとめ

<div class="summary-box">
<h3>📌 この記事のまとめ</h3>
<ul>
<li>実技2倍以上：東京・兵庫・宮城・秋田・福島・京都など</li>
<li>実技等倍：大阪・愛知・神奈川・埼玉・千葉・北海道など</li>
<li>兵庫県は2.5倍で実技の価値が最も高い</li>
<li>自分の得意分野に合った戦略を立てよう</li>
</ul>
</div>

<div class="cta-box">
<h3>🎯 あなたの県での内申点をシミュレーション！</h3>
<p>My Naishinなら、都道府県を選ぶだけで実技の傾斜配点が自動適用されます。実技を1点上げたらどうなるか試してみよう！</p>
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
