import { BlogPost } from '@/lib/blog/types';

export const post: BlogPost = {
  slug:        'chiba-naishin-calculation-guide',
  title:       '千葉県の内申点は3年間で決まる！K値の仕組みと計算手順',
  description: '千葉県公立高校入試の内申点は中1〜中3の9教科・3年間の成績が対象。135点満点の評定合計値にK値を掛けて調査書得点が決まる仕組みを、計算例・高校別K値一覧とともにわかりやすく解説します。',
  date:        '2026-04-30',
  lastUpdated: '2026-04-30',
  category:    '千葉県の内申点',
  readTime:    '8分',
  author:      '運営者（My Naishin）',
  tags:        ['千葉県', '内申点', 'K値', '公立高校入試', '調査書', '計算方法'],
  sources: [
    { name: '千葉県教育委員会 令和7年度公立高等学校入学者選抜実施要項', url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/r7/index.html' },
    { name: '進研ゼミ 高校入試情報サイト（千葉県）', url: 'https://czemi.benesse.ne.jp/open/nyushi/article/12/feature/0012.html' },
    { name: '市進 高校受験情報ナビ 2026年度変更点', url: 'https://www.ko-jukennavi.net/nyushi/kawaru/chiba/' },
    { name: 'エソー個伸塾 千葉県公立高校入試の仕組み', url: 'https://esoh-group.com/entrance-system-chiba-high-school/' },
  ],
  content: `
<div class="lead">
  <strong>千葉県の公立高校入試では、中学1年から3年までの3年間すべての成績が内申点の対象</strong>になります。他県では中3のみが対象のところも多い中、千葉県は早い段階から取り組みを積み重ねることが合否を左右します。この記事では、評定合計値の出し方・K値の意味・調査書得点の計算手順を具体例とともに丁寧に解説します。
</div>

<div class="toc">
  <h3>この記事の内容</h3>
  <ul>
    <li><a href="#what-is-naishin">内申点とは何か</a></li>
    <li><a href="#how-to-calc">評定合計値の計算方法</a></li>
    <li><a href="#k-value">K値の仕組み</a></li>
    <li><a href="#k-value-list">高校別K値の目安一覧</a></li>
    <li><a href="#other-points">加点（その他の記載事項）について</a></li>
    <li><a href="#strategy">千葉県の内申点対策の考え方</a></li>
    <li><a href="#summary">まとめ</a></li>
  </ul>
</div>

<hr>
<h2 id="what-is-naishin">内申点とは何か</h2>
<p>
  内申点とは、高校入試で合否判定に使われる<strong>中学校の成績を点数化したもの</strong>です。正式には「調査書（内申書）」に記載された評定をもとに算出されます。千葉県の公立高校入試では、当日の学力検査（500点満点）・各学校が定める検査・調査書の3つを組み合わせて合否が判定されます。
</p>
<p>
  調査書には教科の成績だけでなく、部活動・ボランティア・資格取得などの記録も書かれます。ただし合否に最も大きく影響するのは<strong>教科の評定（内申点）</strong>です。
</p>
<h3>対象教科は9教科</h3>
<p>
  千葉県では5教科（英語・数学・国語・理科・社会）だけでなく、実技4教科（音楽・美術・保健体育・技術家庭）も評価の対象です。実技教科も同等に扱われるため、どの教科も手を抜くことができません。
</p>

<hr>
<h2 id="how-to-calc">評定合計値の計算方法</h2>
<p>
  千葉県の内申点の基礎となる「評定合計値」は、次のシンプルな計算式で求められます。
</p>
<div class="point-box">
  <h4>評定合計値の計算式</h4>
  <p>
    <strong>5段階評価 × 9教科 × 3学年 ＝ 最大135点</strong><br>
    各学年45点満点（9教科 × 最高5）× 3学年 ＝ <em>135点満点</em>
  </p>
</div>
<p>
  通知表の数字がそのまま使われます。中1・中2・中3の3年間の評定がすべて等しく扱われる点が、千葉県の大きな特徴です。
</p>
<h3>具体的な計算例</h3>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>学年</th>
        <th>国語</th>
        <th>社会</th>
        <th>数学</th>
        <th>理科</th>
        <th>英語</th>
        <th>音楽</th>
        <th>美術</th>
        <th>保体</th>
        <th>技家</th>
        <th>小計</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>中1</td>
        <td>4</td>
        <td>3</td>
        <td>5</td>
        <td>4</td>
        <td>4</td>
        <td>3</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td><strong>35</strong></td>
      </tr>
      <tr>
        <td>中2</td>
        <td>4</td>
        <td>3</td>
        <td>5</td>
        <td>4</td>
        <td>5</td>
        <td>3</td>
        <td>3</td>
        <td>4</td>
        <td>4</td>
        <td><strong>35</strong></td>
      </tr>
      <tr>
        <td>中3</td>
        <td>4</td>
        <td>4</td>
        <td>5</td>
        <td>5</td>
        <td>5</td>
        <td>3</td>
        <td>4</td>
        <td>4</td>
        <td>4</td>
        <td><strong>38</strong></td>
      </tr>
      <tr>
        <td><strong>合計</strong></td>
        <td colspan="9"></td>
        <td><strong>108点</strong></td>
      </tr>
    </tbody>
  </table>
</div>
<p>
  この例では評定合計値は<strong>108点</strong>（135点満点）となります。この数値に、各高校が定める「K値」を掛けたものが調査書の得点になります。
</p>

<hr>
<h2 id="k-value">K値の仕組み</h2>
<p>
  千葉県の内申点計算で最も重要なのが「<strong>K値（ケー値）</strong>」です。各公立高校が独自に設定する係数で、内申点をどの程度入試で重視するかを表します。
</p>
<div class="point-box">
  <h4>調査書得点の計算式</h4>
  <p>
    <strong>調査書得点 ＝ 評定合計値（135点満点）× K値</strong><br>
    K値の範囲：<em>0.5以上2以下</em>（原則は1）
  </p>
</div>
<p>
  K値が小さいほど内申点の比重が下がり「<strong>学力重視</strong>」、K値が大きいほど内申点の比重が上がり「<strong>内申重視</strong>」の選抜になります。
</p>
<div class="card-grid">
  <div class="card">
    <h4>K値 = 0.5（学力重視）</h4>
    <p>調査書の満点は 135 × 0.5 ＝ <strong>67.5点</strong>。当日の学力検査（500点）に比べて内申の影響が小さい。偏差値の高い進学校に多い設定。</p>
  </div>
  <div class="card">
    <h4>K値 = 1（標準）</h4>
    <p>調査書の満点は 135 × 1 ＝ <strong>135点</strong>。内申と学力をバランスよく評価する一般的な設定。</p>
  </div>
  <div class="card">
    <h4>K値 = 2（内申重視）</h4>
    <p>調査書の満点は 135 × 2 ＝ <strong>270点</strong>。内申の影響が非常に大きく、コツコツ型の生徒が有利になる設定。</p>
  </div>
</div>
<h3>2段階選抜とK値の変化</h3>
<p>
  千葉県の多くの公立高校では「<strong>選抜方法Ⅰ（定員の80%）</strong>」と「<strong>選抜方法Ⅱ（残り20%）</strong>」の2段階で選抜を行っています。選抜Ⅱでは高校が独自にK値を変更できるため、第1段階では学力重視（K=0.5）の高校でも、第2段階では内申をより重く評価することがあります。志望校の両段階のK値を必ず確認しましょう。
</p>

<hr>
<h2 id="k-value-list">高校別K値の目安一覧</h2>
<p>
  以下は代表的な千葉県公立高校のK値の目安です。K値は年度・学科によって変わる場合があるため、必ず<strong>最新の選抜要項や各高校のホームページ</strong>で確認してください。
</p>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>K値</th>
        <th>高校名（例）</th>
        <th>調査書満点</th>
        <th>特徴</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>0.5</strong></td>
        <td>県立千葉・県立船橋・千葉東・東葛飾・小金・佐倉（普通/理数）</td>
        <td>67.5点</td>
        <td>学力検査を最重視</td>
      </tr>
      <tr>
        <td><strong>1.0</strong></td>
        <td>多くの標準的な公立高校</td>
        <td>135点</td>
        <td>バランス型</td>
      </tr>
      <tr>
        <td><strong>2.0</strong></td>
        <td>犢橋・八千代東・船橋東・船橋啓明・船橋二和・船橋北・浦安南・鎌ヶ谷西・沼南・沼南高柳・四街道北・佐倉東（普通/調理国際/服飾デザイン）</td>
        <td>270点</td>
        <td>内申点を最重視</td>
      </tr>
    </tbody>
  </table>
</div>
<p>
  上記はあくまでも目安です。学科ごとに異なるケースもあります。
</p>

<hr>
<h2 id="other-points">加点（その他の記載事項）について</h2>
<p>
  調査書の得点は「評定合計値 × K値」だけではありません。各高校は<strong>最大50点を上限</strong>として、教科の評定以外の記載事項に対して加点できます。
</p>
<div class="point-box">
  <h4>加点の対象となる主な記載事項</h4>
  <ul>
    <li>英検・漢検・数検などの資格・検定</li>
    <li>学校内外での奉仕・ボランティア活動</li>
    <li>表彰された活動・行為</li>
    <li>スポーツの大会記録・運動能力検定</li>
  </ul>
</div>
<p>
  加点の基準と点数は高校ごとに異なります。資格取得や課外活動で差をつけたい場合は、志望校の選抜資料を早めに確認しておきましょう。
</p>

<hr>
<h2 id="strategy">千葉県の内申点対策の考え方</h2>
<p>
  千葉県の内申点は中1から3年間すべてが対象のため、「中3から頑張ればいい」は通用しません。ここでは効果的な対策の考え方を整理します。
</p>
<div class="tips-list">
  <div class="tip">
    <div class="tip-num">①</div>
    <div>
      <strong>定期テストで1点でも多く取る</strong><br>
      内申点は定期テストの得点が大きく影響します。特に主要5教科は、テスト前2週間から計画的に対策することが基本です。
    </div>
  </div>
  <div class="tip">
    <div class="tip-num">②</div>
    <div>
      <strong>実技4教科を軽視しない</strong><br>
      音楽・美術・保健体育・技術家庭も5教科と同じ配点です。授業態度・提出物・実技テストをおろそかにしないことが大切です。
    </div>
  </div>
  <div class="tip">
    <div class="tip-num">③</div>
    <div>
      <strong>提出物・授業態度を継続する</strong><br>
      評定は定期テストだけでなく「主体的に学習に取り組む態度」も評価されます。ノート提出・授業への参加姿勢を日頃から意識しましょう。
    </div>
  </div>
  <div class="tip">
    <div class="tip-num">④</div>
    <div>
      <strong>志望校のK値を早めに把握する</strong><br>
      K値によって内申点の重要度が大きく変わります。中1の段階から志望校のK値を意識して、内申と学力の両面をどのバランスで鍛えるかを考えましょう。
    </div>
  </div>
  <div class="tip">
    <div class="tip-num">⑤</div>
    <div>
      <strong>資格・課外活動も戦略的に</strong><br>
      英検・漢検などは加点対象になる高校があります。挑戦する資格の級と志望校の選抜資料を照らし合わせて計画を立てると効果的です。
    </div>
  </div>
</div>
<h3>千葉県の内申インフレに注意</h3>
<p>
  2021年度から内申調整（学校平均による加減点）が廃止された影響で、千葉県全体の内申点は年々高騰しています。2023年度末の中3生データでは、評定「5」または「4」をもらった生徒の割合が約50%に達しており、全国的に見ても高い水準です。つまり<strong>「内申点が高くても他の受験生と差がつきにくい状況」</strong>になっています。K値が低い進学校では特に、当日の学力検査での得点力が合否を分ける要因になります。
</p>

<hr>
<h2 id="summary">まとめ</h2>
<div class="summary-box">
  <h3>この記事で押さえたいポイント</h3>
  <ul>
    <li>千葉県の内申点は<strong>9教科 × 5段階 × 3学年 ＝ 135点満点</strong>の評定合計値が基礎</li>
    <li>各高校が設定する<strong>K値（0.5〜2）</strong>を掛けた値が調査書得点になる</li>
    <li>K値が低い（0.5）高校は学力重視、高い（2）高校は内申重視の選抜</li>
    <li>教科の評定以外に<strong>最大50点の加点</strong>（資格・表彰・ボランティア等）がある</li>
    <li>2段階選抜（Ⅰ：80% / Ⅱ：20%）でK値が変わる高校があるため、両方の確認が必要</li>
    <li>中1から全学年が対象なので、早い時期からコツコツ積み上げることが最大の対策</li>
    <li>千葉県は内申インフレが続いているため、進学校では学力検査の対策も欠かせない</li>
    <li>K値や加点基準は年度・学科ごとに変わるため、必ず<strong>最新の選抜要項</strong>で確認すること</li>
  </ul>
</div>
<p>
  千葉県の内申点は「3年間の積み重ね」が直接数字になって入試に反映される仕組みです。志望校のK値を早めに把握し、学力検査と内申のバランスを意識した対策を始めることが、合格への近道です。
</p>

<div class="cta-box">
  <h3>自分の内申点をすぐに計算しよう</h3>
  <p>My Naishinの内申点かんたん計算ツールなら、通知表の数字を入力するだけで評定合計値・調査書得点を自動で算出できます。志望校のK値を入力して、今の自分の立ち位置を確認してみましょう。</p>
  <a href="/">内申点を計算してみる</a>
</div>
  `,
};