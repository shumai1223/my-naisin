import { BlogPost } from '@/lib/blog/types';

export const post: BlogPost = {
  slug: 'kanagawa-naishin-calculation-guide',
  title: '【2026年最新】神奈川県公立高校入試の内申点計算｜中2・中3の成績が合否を決める',
  description: '神奈川県の公立高校入試で使われる内申点の計算方法を徹底解説。中2・中3の成績が135点満点にどう換算されるか、S1値・S2値の仕組み、傾斜配点まで具体的な数字でわかりやすく説明します。',
  date: '2026-04-30',
  lastUpdated: '2026-04-30',
  category: '神奈川の内申点',
  readTime: '8分',
  author: '運営者（My Naishin）',
  tags: ['神奈川県', '内申点計算', '公立高校入試', 'S値', '傾斜配点', '中2内申', '中3内申'],
  sources: [
    { name: '神奈川県教育委員会｜令和8年度公立高等学校入学者選抜選考基準', url: 'https://www.pref.kanagawa.jp/docs/dc4/prs/r9127472.html' },
    { name: '湘南ゼミナール｜神奈川県公立高校入試を解説', url: 'https://www.shozemi.com/column/highexam/16071/' },
    { name: '学習塾ステップ｜神奈川県公立高校入試の仕組み', url: 'https://www.stepnet.co.jp/beginner/kanagawa-koritsu.html' },
  ],
  content: `
<div class="lead">
  神奈川県の公立高校入試で合否を左右するのが<strong>内申点</strong>。しかし「どの学年の成績が使われるの？」「135点満点ってどう計算するの？」と疑問を持つ人は多い。この記事では計算式から選考の仕組み・傾斜配点まで、神奈川の内申点のすべてをわかりやすく解説する。
</div>

<div class="toc">
  <h3>この記事の内容</h3>
  <ul>
    <li><a href="#what-is-naishin">神奈川の内申点とは</a></li>
    <li><a href="#calculation">内申点の計算方法（135点満点）</a></li>
    <li><a href="#subjects">対象学年・教科・時期</a></li>
    <li><a href="#s-value">S1値・S2値の仕組み</a></li>
    <li><a href="#ratio">内申と学力検査の比率</a></li>
    <li><a href="#keisha">傾斜配点（重点化）とは</a></li>
    <li><a href="#tips">内申点を上げるための対策</a></li>
    <li><a href="#summary">まとめ</a></li>
  </ul>
</div>

<hr>
<h2 id="what-is-naishin">神奈川の内申点とは</h2>
<p>内申点とは、学校の通知表の評定（5段階）を数値化したものだ。神奈川県の公立高校入試では、入試当日の学力検査の点数と合わせて合否判定に使われる。</p>
<p>他の都道府県と大きく異なるのは、<strong>中学1年生の成績が一切使われない</strong>という点。神奈川では中学2年生と中学3年生の成績だけが内申点の対象になっている。つまり「中1の成績が悪かった」という場合でも、中2・中3でしっかり取り組めば挽回できる仕組みになっている。</p>

<div class="point-box">
  <h4>神奈川の内申点の基本</h4>
  <ul>
    <li>対象学年：<strong>中学2年生・中学3年生のみ</strong>（中1は不使用）</li>
    <li>対象教科：9教科（国語・数学・社会・理科・英語・音楽・美術・保健体育・技術家庭）</li>
    <li>評定：各教科5段階（1〜5）</li>
    <li>満点：<strong>135点満点</strong></li>
  </ul>
</div>

<hr>
<h2 id="calculation">内申点の計算方法（135点満点）</h2>
<p>神奈川の内申点は次の式で計算される。</p>

<div class="point-box">
  <h4>内申点の計算式</h4>
  <p>（中2の9教科評定合計）×1 ＋ （中3の9教科評定合計）×2 ＝ 内申点（135点満点）</p>
</div>

<p>中2の成績は1倍、中3の成績は2倍で計算されるため、<strong>中3の1点は中2の1点より2倍重い</strong>。オール5の場合で確認してみよう。</p>

<div class="table-container">
  <table>
    <thead>
      <tr><th>評定</th><th>中2（×1）</th><th>中3（×2）</th><th>合計（内申点）</th></tr>
    </thead>
    <tbody>
      <tr><td>オール5</td><td>45点</td><td>90点</td><td><strong>135点</strong></td></tr>
      <tr><td>オール4</td><td>36点</td><td>72点</td><td><strong>108点</strong></td></tr>
      <tr><td>オール3</td><td>27点</td><td>54点</td><td><strong>81点</strong></td></tr>
      <tr><td>オール2</td><td>18点</td><td>36点</td><td><strong>54点</strong></td></tr>
    </tbody>
  </table>
</div>

<p>例えば中2がオール4（36点）、中3がオール4（72点）であれば内申点は108点。同じオール4でも中3の2倍計算が効いていることがよくわかる。</p>

<hr>
<h2 id="subjects">対象学年・教科・時期</h2>
<h3>いつの成績が使われるか</h3>
<p>内申点に使われるのは、次のタイミングの成績だ。</p>

<div class="card-grid">
  <div class="card">
    <h4>中学2年生</h4>
    <p>学年末（年間を通じた最終評定）の9教科の成績。前期・後期ともに含む。</p>
  </div>
  <div class="card">
    <h4>中学3年生</h4>
    <p>2学期末（3学期制）または後期中間（2学期制）までの成績。12月ごろに確定する。</p>
  </div>
</div>

<p>中3の成績は12月までが対象なので、<strong>3年生の2学期（後期中間）まで気を抜けない</strong>。入試直前の1月以降に頑張っても内申点には間に合わないことに注意しよう。</p>

<h3>9教科の内訳</h3>
<div class="table-container">
  <table>
    <thead>
      <tr><th>区分</th><th>教科</th><th>満点（中2）</th><th>満点（中3）</th></tr>
    </thead>
    <tbody>
      <tr><td>主要5教科</td><td>国語・数学・社会・理科・英語</td><td>25点</td><td>50点</td></tr>
      <tr><td>実技4教科</td><td>音楽・美術・保健体育・技術家庭</td><td>20点</td><td>40点</td></tr>
      <tr><td><strong>合計</strong></td><td>9教科</td><td><strong>45点</strong></td><td><strong>90点</strong></td></tr>
    </tbody>
  </table>
</div>

<p>実技教科（音楽・美術・保健体育・技術家庭）も主要教科と同じ5段階評定で評価され、内申点に含まれる。テストの点数だけでなく、授業への参加態度や実技の出来も評価されるため、<strong>実技4教科を軽視することは大きなリスク</strong>になる。</p>

<hr>
<h2 id="s-value">S1値・S2値の仕組み</h2>
<p>神奈川の公立高校入試は、「第1次選考」と「第2次選考」の2段階で合否が決まる。それぞれで使われるスコアが<strong>S1値</strong>と<strong>S2値</strong>だ。</p>

<h3>第1次選考（定員の90%）</h3>
<p>S1値 = 内申点（A値）× a ＋ 学力検査点（B値）× b ＋ 特色検査点（D値）× d</p>
<p>内申点・学力検査・特色検査（実施校のみ）の3要素を、各高校が定めた比率で合計したものがS1値。得点の高い順に定員の90%が合格する。</p>

<div class="point-box">
  <h4>各要素の換算方法</h4>
  <div class="tips-list">
    <div class="tip">
      <div class="tip-num">A</div>
      <div>
        <strong>内申点（135点満点 → 100点換算）</strong><br>
        例：内申117点 ÷ 135点 × 100 = 86点
      </div>
    </div>
    <div class="tip">
      <div class="tip-num">B</div>
      <div>
        <strong>学力検査（500点満点 → 100点換算）</strong><br>
        例：合計365点 ÷ 500点 × 100 = 73点
      </div>
    </div>
    <div class="tip">
      <div class="tip-num">D</div>
      <div>
        <strong>特色検査（実施校のみ・高校ごとに満点が異なる）</strong><br>
        横浜翠嵐・湘南・柏陽などトップ校で実施。
      </div>
    </div>
  </div>
</div>

<h3>第2次選考（定員の10%）</h3>
<p>第2次選考の最大の特徴は、<strong>内申点が使われない</strong>点だ。代わりに「主体的に学習に取り組む態度」（観点別評価）が使われる。</p>

<div class="point-box">
  <h4>主体的に学習に取り組む態度（C値）</h4>
  <p>中学3年生の12月の成績のみ対象。9教科それぞれの観点別評価を次のように点数化する。</p>
  <ul>
    <li>A評価 = 3点</li>
    <li>B評価 = 2点</li>
    <li>C評価 = 1点</li>
  </ul>
  <p>9教科 × 最大3点 = <strong>27点満点</strong></p>
</div>

<p>中2の内申があまり良くなかった受験生も、第2次選考では内申点が評価されないため、当日の学力検査で逆転合格を狙えるチャンスがある。</p>

<hr>
<h2 id="ratio">内申と学力検査の比率</h2>
<p>S1値の計算で使われる「内申：学力検査」の比率は高校ごとに異なる。比率の合計は10になるよう設定されており、大きく3タイプに分かれる。</p>

<div class="table-container">
  <table>
    <thead>
      <tr><th>タイプ</th><th>内申（a）</th><th>学力検査（b）</th><th>特徴</th></tr>
    </thead>
    <tbody>
      <tr><td>内申重視型</td><td>5〜7</td><td>3〜5</td><td>日頃の成績が合否に直結しやすい</td></tr>
      <tr><td>バランス型</td><td>4</td><td>6</td><td>最も多いスタンダードな設定</td></tr>
      <tr><td>学力重視型</td><td>2〜3</td><td>7〜8</td><td>入試当日の点数勝負になりやすい</td></tr>
    </tbody>
  </table>
</div>

<p>例えば横浜翠嵐は「内申2：学力6：特色検査2」と学力・特色検査重視。一方で内申7：学力3などの設定をとる高校では、日頃の積み重ねがそのまま有利に働く。<strong>志望校を選ぶ際は必ず各高校の選考基準を確認しよう。</strong></p>

<hr>
<h2 id="keisha">傾斜配点（重点化）とは</h2>
<p>一部の高校では、特定の教科の内申点や学力検査の点数を通常より大きく評価する「傾斜配点（重点化）」が行われる。</p>

<div class="point-box">
  <h4>傾斜配点のルール</h4>
  <ul>
    <li>内申点：<strong>3教科以内、各2倍以内</strong>の範囲で重点化可能</li>
    <li>学力検査：<strong>2教科以内、各2倍以内</strong>の範囲で重点化可能</li>
    <li>設定するかどうか・どの教科かは各高校が独自に決める</li>
  </ul>
</div>

<p>傾斜配点の具体例としては、横須賀高校が英語・国語・数学の内申を2倍、横浜サイエンスフロンティアが英語・数学・理科の内申と数学・理科の学力検査を2倍にして計算している。こうした高校では、得意教科を持つ受験生が有利になる設計になっている。</p>

<hr>
<h2 id="tips">内申点を上げるための対策</h2>
<p>内申点は定期テストの点数だけでなく、授業態度・提出物・実技の取り組みも総合的に評価される。以下の3点を意識することが内申点アップの基本だ。</p>

<div class="tips-list">
  <div class="tip">
    <div class="tip-num">①</div>
    <div>
      <strong>定期テストで高得点を取る</strong><br>
      主要5教科はもちろん、実技4教科のペーパーテストも手を抜かないことが重要。
    </div>
  </div>
  <div class="tip">
    <div class="tip-num">②</div>
    <div>
      <strong>提出物を期限通りに出す</strong><br>
      ノート・ワーク・レポートなどの提出物は観点別評価に直結する。内容の丁寧さも評価される。
    </div>
  </div>
  <div class="tip">
    <div class="tip-num">③</div>
    <div>
      <strong>実技教科の授業態度を意識する</strong><br>
      音楽・美術・保健体育・技術家庭は実技そのものの出来に加え、参加への積極性も評価される。
    </div>
  </div>
  <div class="tip">
    <div class="tip-num">④</div>
    <div>
      <strong>中2の春から意識を高く持つ</strong><br>
      中2の成績は年間を通じて積み上げるもの。2学期から急に頑張っても前期の評定は変わらない。
    </div>
  </div>
</div>

<hr>
<h2 id="summary">まとめ</h2>
<div class="summary-box">
  <h3>この記事で押さえたいポイント</h3>
  <ul>
    <li>神奈川の内申点は<strong>中2・中3の9教科</strong>が対象。中1は使われない</li>
    <li>計算式は「中2評定合計×1 ＋ 中3評定合計×2 ＝ 135点満点」</li>
    <li>中3の成績は2倍計算のため、中2より大きく合否に影響する</li>
    <li>中3の内申は<strong>12月（2学期末・後期中間）</strong>までで確定する</li>
    <li>第1次選考（定員の90%）はS1値（内申＋学力検査）で決まる</li>
    <li>第2次選考（定員の10%）は内申不使用・「主体的な態度」＋学力検査で決まる</li>
    <li>内申と学力検査の比率・傾斜配点は高校ごとに異なるため必ず確認する</li>
    <li>実技4教科も評定に含まれるため、軽視しないことが重要</li>
  </ul>
</div>

<p>神奈川の内申点は計算式がシンプルな一方で、高校ごとの比率・傾斜配点の違いによって戦略が大きく変わる。まずは自分の内申点を正確に把握し、志望校の選考基準と照らし合わせながら受験対策を進めよう。</p>

<div class="cta-box">
  <h3>自分の内申点をすぐに計算しよう</h3>
  <p>My Naishinの内申点計算ツールなら、中2・中3の評定を入力するだけで内申点・S値の目安を自動で算出できる。志望校選びや学習計画にぜひ活用してほしい。</p>
  <a href="/">内申点を計算してみる</a>
</div>
  `,
};