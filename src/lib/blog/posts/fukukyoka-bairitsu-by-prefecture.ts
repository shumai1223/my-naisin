import { PREFECTURES } from '@/lib/prefectures';
import { BlogPost } from '@/lib/blog/types';

export const post: BlogPost = {
    slug: 'fukukyoka-bairitsu-by-prefecture',
    title: '【都道府県別】副教科の倍率まとめ｜2倍？3倍？等倍？',
    description: '実技4教科（音楽・美術・保体・技家）の倍率は都道府県で異なります。2倍・3倍・等倍の県を一覧で比較し、副教科が内申に与える影響を解説。',
    date: '2026-04-20',
    category: '都道府県別ガイド',
    readTime: '12分',
    tags: ['内申点', '副教科', '実技教科', '倍率', '都道府県別'],
    author: '運営者（My Naishin）',
    sources: [
      { name: '東京都教育委員会', url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/' },
      { name: '兵庫県教育委員会', url: 'https://www.hyogo-c.ed.jp/~gakuji-bo/senbatsu.html' },
    ],
    faqs: [
      { question: '副教科の倍率が一番高い県はどこですか？', answer: '兵庫県が全国最高で、実技4教科に7.5倍の倍率がかかります。5教科は4倍で、250点満点中150点が実技教科の配点です。' },
      { question: '副教科が等倍の県では実技教科は重要ではないですか？', answer: 'いいえ、等倍でも実技4教科は全9教科のうち4教科を占めるため重要です。むしろ等倍の県では全教科バランスよく取ることが大切で、苦手教科を作らないことが最重要です。' },
      { question: '実技教科の評定を上げるにはどうすればいいですか？', answer: '授業態度（積極的な姿勢）、提出物の質と期限厳守、実技テスト対策の3つが鍵です。才能よりも「取り組む姿勢」が評価に直結します。' },
    ],
    content: `
<div class="lead">
<p>高校入試の内申点計算で、実技4教科（音楽・美術・保健体育・技術家庭）に<strong>特別な倍率</strong>をかける都道府県があります。この「傾斜配点」を知っているかどうかで、内申対策の優先順位が大きく変わります。</p>
</div>

<div class="toc">
<h3>この記事の内容</h3>
<ul>
<li><a href="#what">副教科の倍率（傾斜配点）とは？</a></li>
<li><a href="#double">実技2倍の県</a></li>
<li><a href="#triple">実技3倍の県</a></li>
<li><a href="#hyogo">実技7.5倍の県（兵庫県）</a></li>
<li><a href="#equal">実技等倍（傾斜なし）の県</a></li>
<li><a href="#impact">倍率が内申点に与える影響シミュレーション</a></li>
<li><a href="#strategy">倍率パターン別の対策戦略</a></li>
<li><a href="#tips">副教科の評定を上げるコツ</a></li>
<li><a href="#summary">まとめ</a></li>
</ul>
</div>

<h2 id="what">副教科の倍率（傾斜配点）とは？</h2>
<p>内申点の計算で、5教科（国・数・英・理・社）と実技4教科（音・美・体・技家）に<strong>異なる係数</strong>をかけるルールを「傾斜配点」と呼びます。多くの都道府県で実技教科の倍率が高く設定されており、その理由は次のとおりです。</p>

<div class="point-box blue">
<h4>なぜ実技教科に高い倍率がかかるのか？</h4>
<ul>
<li><strong>学力検査で測れない：</strong>入試当日の筆記試験は5教科のみ。実技教科は内申でしか評価できない</li>
<li><strong>公平性の確保：</strong>5教科は当日点で差がつくが、実技は内申でしか差をつけられない</li>
<li><strong>バランスの取れた教育：</strong>実技教科の軽視を防ぎ、総合的な学力を評価する</li>
</ul>
</div>

<h2 id="double">実技2倍の県</h2>
<p>最もメジャーな傾斜配点パターンです。5教科はそのまま、実技4教科を2倍で計算します。</p>
<p><strong>該当する主な都道府県：</strong>${PREFECTURES.filter(p => p.practicalMultiplier === 2 && p.coreMultiplier === 1).map(p => p.name).join('・')}</p>

<div class="formula-box">
<h4>東京都の計算例</h4>
<p class="formula">5教科×5点＝25点 ＋ 4教科×5点×2＝40点 ＝ 65点満点</p>
<p>実技でオール5を取ると40点分（全体の61.5%）を占めるため、実技の影響力は非常に大きいです。</p>
</div>

<div class="example-box">
<h4>具体例：実技を1点上げた場合</h4>
<p>美術が3→4に上がると：<strong>内申点が2点アップ</strong>（2倍のため）</p>
<p>5教科の英語が3→4に上がると：<strong>内申点が1点アップ</strong></p>
<p>つまり、<strong>実技1点 = 5教科2点分の価値</strong>があります！</p>
</div>

<h2 id="triple">実技3倍の県</h2>
<p><strong>該当する主な都道府県：</strong>${PREFECTURES.filter(p => p.practicalMultiplier === 3).map(p => p.name).join('・')}</p>
<p>岩手県は5教科にも2倍の傾斜がかかりますが、実技は3倍とさらに高い倍率が設定されています（学校により異なる場合あり）。</p>

<div class="point-box orange">
<h4>3倍の県での影響</h4>
<p>実技1教科の評定が1点上がると、内申点が<strong>3点</strong>上がります。4教科すべてを1点上げれば<strong>12点</strong>のアップ。5教科をすべて1点上げた場合の<strong>10点</strong>よりも大きいです。</p>
</div>

<h2 id="hyogo">実技7.5倍の県（兵庫県）</h2>
<p>全国で最も実技の価値が高いのは兵庫県です。</p>
<p><strong>該当する都道府県：</strong>${PREFECTURES.filter(p => p.practicalMultiplier === 7.5).map(p => p.name).join('・')}</p>

<div class="formula-box">
<h4>兵庫県の計算式</h4>
<p class="formula">5教科×5点×4倍＋4教科×5点×7.5倍 ＝ 250点満点</p>
<p>実技4教科だけで150点（全体の60%）を占めます。実技が得意な生徒には非常に有利な制度です。</p>
</div>

<div class="example-box">
<h4>兵庫県で実技オール5の威力</h4>
<p>実技4教科オール5：4×5×7.5 = <strong>150点</strong></p>
<p>5教科オール5：5×5×4 = <strong>100点</strong></p>
<p>実技オール5なら、5教科がオール3（60点）でも合計<strong>210点/250点（84%）</strong>に！</p>
</div>

<h2 id="equal">実技等倍（傾斜なし）の県</h2>
<p>5教科も実技4教科も同じ扱いで計算する県です。</p>
<p><strong>該当する主な都道府県：</strong>${PREFECTURES.filter(p => p.practicalMultiplier === 1 && p.coreMultiplier === 1).map(p => p.name).slice(0, 10).join('・')}など</p>
<p>等倍の県では、各教科が同じ価値を持つため、特定の教科に偏らないバランスの良い成績が重要です（主な傾向）。</p>

<h2 id="impact">倍率が内申点に与える影響シミュレーション</h2>
<p>同じ成績でも、県の倍率によって内申点の評価が大きく変わります。以下のシミュレーションで確認してみましょう。</p>

<div class="table-container">
<table class="calc-table">
<thead>
<tr><th>倍率タイプ</th><th>5教科オール4+実技オール3</th><th>5教科オール3+実技オール4</th><th>差</th></tr>
</thead>
<tbody>
<tr><td>等倍（45点満点）</td><td>32点</td><td>32点</td><td>0点</td></tr>
<tr><td>実技2倍（65点満点）</td><td>44点</td><td>47点</td><td class="highlight">+3点</td></tr>
<tr><td>実技3倍（75点満点）</td><td>48点</td><td>51点</td><td class="highlight">+3点</td></tr>
<tr><td>兵庫（250点満点）</td><td>170点</td><td>190点</td><td class="highlight">+20点</td></tr>
</tbody>
</table>
</div>

<p>倍率が高い県ほど、<strong>実技が得意な生徒が有利</strong>になることがわかります。</p>

<h2 id="strategy">倍率パターン別の対策戦略</h2>

<div class="card-grid">
<div class="card">
<h4>実技2倍以上の県</h4>
<ul>
<li>実技教科を最優先で対策</li>
<li>実技1点 = 5教科2点以上の価値</li>
<li>授業態度・提出物で確実に評定を稼ぐ</li>
</ul>
</div>
<div class="card">
<h4>等倍の県</h4>
<ul>
<li>9教科バランスよく対策</li>
<li>苦手教科を作らないことが最重要</li>
<li>得意教科を5にするより苦手を3→4に</li>
</ul>
</div>
</div>

<h2 id="tips">副教科の評定を上げるコツ</h2>

<div class="tips-list">
<div class="tip">
<div class="tip-num">1</div>
<div>
<h4>授業態度を最優先に</h4>
<p>実技の上手さよりも「積極的に取り組む姿勢」が評価されます。声を出す、準備・片付けを率先する。</p>
</div>
</div>
<div class="tip">
<div class="tip-num">2</div>
<div>
<h4>提出物は質を上げる</h4>
<p>レポートやワークシートは「丁寧さ」と「自分の考え」を加えると評価アップ。</p>
</div>
</div>
<div class="tip">
<div class="tip-num">3</div>
<div>
<h4>実技テストの対策を忘れない</h4>
<p>筆記テスト（保健体育の座学テストなど）は確実に点を取れる部分。教科書を読み込む。</p>
</div>
</div>
<div class="tip">
<div class="tip-num">4</div>
<div>
<h4>「主体的に学習に取り組む態度」を意識</h4>
<p>3観点のうちこの項目は授業態度で決まる。先生の話を聞く、質問する、工夫する姿勢を見せる。</p>
</div>
</div>
</div>

<h2 id="summary">まとめ</h2>
<div class="summary-box">
<h3>この記事のポイント</h3>
<ul>
<li><strong>実技2倍の県が最多</strong>：東京都など。実技1点＝5教科2点分の価値</li>
<li><strong>兵庫県は7.5倍</strong>：全国最高の実技重視。実技だけで150点/250点</li>
<li><strong>等倍の県</strong>：9教科バランスが重要。苦手教科を作らない</li>
<li><strong>倍率が高い県</strong>：実技教科を最優先で対策すべき</li>
<li><strong>実技の評定アップ</strong>：授業態度・提出物・実技テストの3つが鍵</li>
</ul>
</div>

<div class="cta-box">
<h3>副教科の倍率を自動で計算！</h3>
<p>My Naishinなら、都道府県を選ぶだけで副教科の傾斜配点が自動適用されます。実技を1点上げたらどうなるか試してみよう！</p>
<a href="/">内申点を計算する</a>
</div>
    `
  };
