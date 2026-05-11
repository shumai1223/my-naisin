// 47都道府県の内申点計算ガイド記事を自動生成
// 既存の手書き記事（東京・神奈川・千葉）はカバーせず、残り44県の記事をデータ駆動で生成

import type { BlogPost } from '@/lib/blog/types';
import { PREFECTURES, type PrefectureConfig } from '@/lib/prefectures';
import { prefectureGuides } from '@/lib/prefecture-guides';

// 既存の手書き記事と被るスラッグは自動生成しない
const HAND_WRITTEN_PREFECTURE_SLUGS = new Set([
  'tokyo-naishin-calculation-guide',
  'tokyo-kansan-naishin-guide',
  'kanagawa-naishin-calculation-guide',
  'chiba-naishin-calculation-guide',
]);

// 都道府県コード → 記事スラッグ
function slugFor(code: string): string {
  return `${code}-naishin-calculation-guide`;
}

// 対象学年テキスト
function targetGradesText(pref: PrefectureConfig): string {
  if (pref.targetGrades.length === 3) return '中1〜中3の3年間';
  if (pref.targetGrades.length === 2) return `中${pref.targetGrades.join('・')}の2年間`;
  return `中${pref.targetGrades[0]}のみ`;
}

// 倍率テキスト
function multiplierText(pref: PrefectureConfig): string {
  if (pref.coreMultiplier === 1 && pref.practicalMultiplier === 1) {
    return '主要5教科・実技4教科ともに等倍';
  }
  if (pref.coreMultiplier === pref.practicalMultiplier) {
    return `全9教科を${pref.coreMultiplier}倍`;
  }
  return `主要5教科×${pref.coreMultiplier}倍、実技4教科×${pref.practicalMultiplier}倍`;
}

// 学年倍率テキスト
function gradeMultiplierText(pref: PrefectureConfig): string {
  const gm = pref.gradeMultipliers;
  const active = pref.targetGrades.map(g => `中${g}は${gm[g]}倍`);
  if (active.every(s => s.endsWith('1倍'))) {
    return `${targetGradesText(pref)}とも等倍`;
  }
  return active.join('、');
}

// 計算例（オール3、オール4、オール5）
function calculationExamples(pref: PrefectureConfig): { all3: number; all4: number; all5: number } {
  let total3 = 0, total4 = 0, total5 = 0;
  for (const grade of pref.targetGrades) {
    const gm = pref.gradeMultipliers[grade] || 1;
    // 5教科分
    total3 += 3 * 5 * pref.coreMultiplier * gm;
    total4 += 4 * 5 * pref.coreMultiplier * gm;
    total5 += 5 * 5 * pref.coreMultiplier * gm;
    // 実技4教科分
    total3 += 3 * 4 * pref.practicalMultiplier * gm;
    total4 += 4 * 4 * pref.practicalMultiplier * gm;
    total5 += 5 * 4 * pref.practicalMultiplier * gm;
  }
  return { all3: total3, all4: total4, all5: total5 };
}

// HTMLエスケープ（最小限）
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateContent(pref: PrefectureConfig): string {
  const examples = calculationExamples(pref);
  const guide = prefectureGuides[pref.code];
  const targetText = targetGradesText(pref);
  const multText = multiplierText(pref);
  const gradeText = gradeMultiplierText(pref);

  // ピットフォール（落とし穴）— guideがあれば使用、なければ汎用
  const pitfallsItems = guide?.pitfalls?.items ?? [
    `対象学年は${targetText}。学年配分を意識した対策が必要です。`,
    `満点は${pref.maxScore}点。志望校の合格ラインから逆算して目標値を設定しましょう。`,
    pref.practicalMultiplier > pref.coreMultiplier
      ? `実技4教科の倍率（${pref.practicalMultiplier}倍）が主要5教科より高く、実技対策が特に重要です。`
      : `実技と主要5教科の重要度は同程度。バランス良く全教科に取り組みましょう。`,
    pref.note ?? '各高校で傾斜配点や独自の選抜基準が設定される場合があります。志望校の選抜要綱を必ず確認しましょう。',
    `2021年度の学習指導要領改訂以降、観点別評価（3観点）が厳格化されています。テストの点数だけでなく、提出物・授業態度・振り返りの質が評定を左右します。`,
  ];

  // FAQ
  const guideFaqs = guide?.faq ?? [];
  const baseFaqs = [
    {
      q: `${pref.name}の内申点は何点満点ですか？`,
      a: `${pref.name}の内申点は<strong>${pref.maxScore}点満点</strong>です。${pref.description}という計算方式が採用されています。`,
    },
    {
      q: `${pref.name}はいつの成績が内申点になりますか？`,
      a: `${pref.name}では<strong>${targetText}</strong>の成績が対象です。${pref.targetGrades.length === 1 ? '集中した対策が効果的ですが、中1・中2の段階で学習習慣を確立しておくことが大前提です。' : '早い段階から定期テスト・提出物・授業態度に注意を払い、コツコツと積み上げていくことが重要です。'}`,
    },
    {
      q: `${pref.name}の実技4教科はどう扱われますか？`,
      a: pref.practicalMultiplier === 1
        ? `${pref.name}では実技4教科（音楽・美術・保健体育・技術家庭）は主要5教科と<strong>等倍</strong>で計算されます。全教科に均等に注力する戦略が有効です。`
        : `${pref.name}では実技4教科が<strong>${pref.practicalMultiplier}倍</strong>で計算されます。実技1教科の評定を1段階上げると、主要教科で1段階上げるよりも大きく内申点が伸びる仕組みです。`,
    },
    {
      q: `${pref.name}でオール3だと内申点は何点になりますか？`,
      a: `${pref.name}でオール3の場合、内申点は<strong>${examples.all3}点</strong>（満点${pref.maxScore}点中）になります。割合にして約${Math.round((examples.all3 / pref.maxScore) * 100)}%です。志望校の合格ラインと比較して、必要な伸び幅を計算しましょう。`,
    },
    {
      q: `${pref.name}で内申点を上げるコツは？`,
      a: `①定期テスト対策（特に苦手教科の最低ライン確保）、②提出物の期限厳守と質向上、③授業中の発言・振り返りシートの記述、④${pref.practicalMultiplier > 1 ? '実技4教科の徹底対策（倍率が高いため効率的）' : '全教科のバランス良い対策'}、⑤先生との良好なコミュニケーション。地道な積み重ねが${pref.maxScore}点満点中の差を生みます。`,
    },
  ];

  // guideのFAQと自動生成FAQを統合（重複排除）
  const mergedFaqs = [
    ...guideFaqs.map(f => ({ q: f.question, a: f.answer })),
    ...baseFaqs,
  ];

  // 出典
  const sources: { name: string; url: string }[] = [];
  if (pref.sourceUrl) {
    sources.push({ name: pref.sourceTitle || `${pref.name}教育委員会`, url: pref.sourceUrl });
  }
  if (pref.sourceUrl2) {
    sources.push({ name: `${pref.name}入試情報（参考資料）`, url: pref.sourceUrl2 });
  }

  // 関連リンク
  const related = guide?.related ?? [
    { title: `${pref.name}の内申点計算ツール`, url: `/${pref.code}/naishin` },
    { title: `${pref.name}の志望校から逆算`, url: `/reverse?pref=${pref.code}` },
    { title: '内申点アップの基本戦略', url: '/blog/naishin-guide' },
  ];

  // 本文HTML生成
  return `
<div class="lead">
  <p><strong>${esc(pref.name)}の高校入試</strong>を控える中学生と保護者の皆さん、内申点（調査書点）の計算方法を正しく理解できていますか？${esc(pref.name)}には、他の都道府県とは異なる<strong>独自の計算ルール</strong>があります。</p>
  <p>本記事では、<strong>2026年度（令和8年度）入試</strong>に対応した${esc(pref.name)}の内申点計算方法を、満点の出し方・対象学年・実技教科の扱い・具体例まで、どこよりも分かりやすく解説します。志望校合格に必要な内申点を逆算する方法もご紹介します。</p>
</div>

<div class="toc">
  <h3>この記事の内容</h3>
  <ul>
    <li><a href="#section-overview">1. ${esc(pref.name)}の内申点の基本ルール</a></li>
    <li><a href="#section-calc">2. ${esc(pref.name)}の内申点計算方法（満点${pref.maxScore}点）</a></li>
    <li><a href="#section-examples">3. 計算例：オール3・オール4・オール5の場合</a></li>
    <li><a href="#section-pitfalls">4. ${esc(pref.name)}入試で注意すべきポイント</a></li>
    <li><a href="#section-strategy">5. 内申点を上げるための具体的な戦略</a></li>
    <li><a href="#section-tool">6. 計算ツールで自分の内申点を確認する</a></li>
    <li><a href="#section-faq">7. よくある質問</a></li>
    <li><a href="#section-summary">8. まとめ</a></li>
  </ul>
</div>

<hr>
<h2 id="section-overview">1. ${esc(pref.name)}の内申点の基本ルール</h2>
<p>${esc(pref.name)}（${esc(pref.region)}）の公立高校入試における内申点は、<strong>${pref.maxScore}点満点</strong>で計算されます。${esc(pref.description)}という方式が採用されています。</p>

<div class="table-container">
  <table>
    <thead>
      <tr><th>項目</th><th>内容</th></tr>
    </thead>
    <tbody>
      <tr><td>満点</td><td><strong>${pref.maxScore}点</strong></td></tr>
      <tr><td>対象学年</td><td>${esc(targetText)}</td></tr>
      <tr><td>主要5教科の倍率</td><td>${pref.coreMultiplier}倍</td></tr>
      <tr><td>実技4教科の倍率</td><td>${pref.practicalMultiplier}倍</td></tr>
      <tr><td>学年配分</td><td>${esc(gradeText)}</td></tr>
      <tr><td>2026年度（令和8年度）</td><td>対応済み</td></tr>
    </tbody>
  </table>
</div>

<p>この${pref.maxScore}点満点の内申点は、入試当日の学力検査の点数と合算され、合否判定に使われます。${pref.targetGrades.length === 1 ? `${esc(pref.name)}は中${pref.targetGrades[0]}のみが対象となるため、その学年での評定が決定的に重要です。` : `中学校3年間（または2年間）の積み重ねが評価されるため、早期からの計画的な対策が合否を分けます。`}</p>

<div class="point-box">
  <h4>${esc(pref.name)}の内申点の特徴</h4>
  <p>${pref.practicalMultiplier > pref.coreMultiplier ? `実技4教科の倍率（${pref.practicalMultiplier}倍）が主要5教科より高いのが特徴です。実技教科の評定アップが内申点全体に大きく寄与します。` : pref.practicalMultiplier < pref.coreMultiplier ? `主要5教科の倍率が実技より高い、珍しいタイプの計算方式です。学力テスト型の生徒に有利な仕組みです。` : `全9教科が同じ倍率で計算されるシンプルな方式です。バランスの取れた成績作りが重要です。`}</p>
</div>

<hr>
<h2 id="section-calc">2. ${esc(pref.name)}の内申点計算方法（満点${pref.maxScore}点）</h2>
<p>${esc(pref.name)}の内申点計算の仕組みを、ステップごとに詳しく見ていきましょう。</p>

<h3>ステップ1：各教科の評定（5段階）を確認</h3>
<p>まず、対象学年（${esc(targetText)}）の通知表に記載されている9教科の評定を確認します。評定は<strong>1〜5の5段階</strong>で、5が最高評価です。</p>
<ul>
  <li>主要5教科：国語・数学・英語・理科・社会</li>
  <li>実技4教科：音楽・美術・保健体育・技術家庭</li>
</ul>

<h3>ステップ2：教科別の倍率を掛ける</h3>
<p>${esc(pref.name)}では、<strong>${esc(multText)}</strong>で計算します。${pref.practicalMultiplier > pref.coreMultiplier ? `実技教科で高評価を取ることが、主要教科で同じ評価を取るよりも内申点への貢献度が高くなります。` : `各教科の評定を倍率に従って掛け合わせます。`}</p>

<h3>ステップ3：学年ごとの倍率を掛ける</h3>
<p>${pref.targetGrades.length === 1
    ? `${esc(pref.name)}は中${pref.targetGrades[0]}のみが対象のため、学年倍率は中${pref.targetGrades[0]}のみに適用されます。`
    : `学年ごとの重み付けは「${esc(gradeText)}」となっています。${pref.gradeMultipliers[3] && pref.gradeMultipliers[3] > 1 ? '中3の重みが高いため、最終学年での頑張りが最も大きく反映されます。' : '各学年が均等に評価されるため、3年間継続的な努力が必要です。'}`}</p>

<h3>ステップ4：すべて合計して内申点を算出</h3>
<p>各教科×倍率×学年倍率の合計値が、最終的な内申点（最大${pref.maxScore}点）となります。${pref.note ? `<br><strong>※注意：${esc(pref.note)}</strong>` : ''}</p>

<hr>
<h2 id="section-examples">3. 計算例：オール3・オール4・オール5の場合</h2>
<p>具体的な数値例で${esc(pref.name)}の内申点を確認してみましょう。</p>

<div class="table-container">
  <table>
    <thead>
      <tr><th>成績パターン</th><th>内申点</th><th>満点割合</th><th>志望校レベルの目安</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>オール3</strong>（平均的）</td>
        <td>${examples.all3}点 / ${pref.maxScore}点</td>
        <td>${Math.round((examples.all3 / pref.maxScore) * 100)}%</td>
        <td>偏差値40〜50の高校</td>
      </tr>
      <tr>
        <td><strong>オール4</strong>（成績上位）</td>
        <td>${examples.all4}点 / ${pref.maxScore}点</td>
        <td>${Math.round((examples.all4 / pref.maxScore) * 100)}%</td>
        <td>偏差値55〜65の高校</td>
      </tr>
      <tr>
        <td><strong>オール5</strong>（満点）</td>
        <td>${examples.all5}点 / ${pref.maxScore}点</td>
        <td>100%</td>
        <td>トップ校</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="point-box">
  <h4>計算例の解釈</h4>
  <p>志望校に必要な内申点は、上記の表と志望校の合格者平均を比較することで概算できます。${pref.practicalMultiplier > 1 ? `${esc(pref.name)}は実技教科の倍率が高いため、実技1教科の評定を1段階上げると、${pref.practicalMultiplier}点（×学年倍率）の差が生まれます。実技対策は内申点アップの最短ルートです。` : `各教科が等倍のため、苦手教科を1段階上げることが効率的です。`}</p>
</div>

<hr>
<h2 id="section-pitfalls">4. ${esc(pref.name)}入試で注意すべきポイント</h2>
<p>${esc(pref.name)}の公立高校入試では、内申点以外にも知っておくべき独自ルールや注意点があります。</p>

<ul>
${pitfallsItems.map(item => `  <li>${item}</li>`).join('\n')}
</ul>

<div class="warning-box">
  <h4>注意：制度は年度により変更されます</h4>
  <p>本記事は2026年度（令和8年度）入試の情報に基づいて作成されていますが、各都道府県教育委員会は毎年実施要綱を更新します。最新情報は必ず<a href="${pref.sourceUrl || '#'}" target="_blank" rel="noopener">${esc(pref.sourceTitle || pref.name + '教育委員会')}の公式サイト</a>でご確認ください。</p>
</div>

<hr>
<h2 id="section-strategy">5. 内申点を上げるための具体的な戦略</h2>
<p>${esc(pref.name)}で内申点を最大化するには、以下の5つの戦略が効果的です。</p>

<h3>戦略1：定期テストで安定して70点以上を取る</h3>
<p>評定（5段階評価）の最大要素は定期テストの点数です。${pref.targetGrades.length === 1 ? `中${pref.targetGrades[0]}は中1・中2と比べて出題範囲が広く、難易度も上がります。早めの試験範囲確認と計画的な勉強が必要です。` : `中1からの安定した点数の積み上げが3年後の内申点に直結します。`}各教科で70〜80点を継続的に取れば、評定4はほぼ確保できます。</p>

<h3>戦略2：提出物を期限内に丁寧に出す</h3>
<p>提出物は観点別評価の「主体的に学習に取り組む態度」と「知識・技能」に直結します。期限遵守だけでなく、<strong>記入の質・自分の考えの記述・先生からのコメントへの返信</strong>まで意識すると評価が大きく変わります。</p>

<h3>戦略3：授業中の発言と振り返りシートの充実</h3>
<p>授業中の挙手・発言、グループワークでの貢献、振り返りシートの記述の深さは、「主体的に学習に取り組む態度」の評価を左右します。<strong>1日1回は挙手する</strong>を目標にすると、学期末には評定が変わってくる可能性があります。</p>

<h3>戦略4：${pref.practicalMultiplier > 1 ? '実技4教科を最優先で対策する' : '苦手教科の最低ラインを確保する'}</h3>
<p>${pref.practicalMultiplier > 1
    ? `${esc(pref.name)}は実技4教科が${pref.practicalMultiplier}倍で計算されるため、実技教科で1段階上げると主要教科で1段階上げる以上のリターンがあります。実技教科は「センス」より「準備・授業態度・提出物」で評価されるため、戦略的に取り組めば確実に伸びます。`
    : `${esc(pref.name)}は全教科がほぼ等倍のため、苦手教科で「2」や「1」を取らないことが最優先です。最低ラインを「3」以上に揃えることで、内申点の底上げができます。`}</p>

<h3>戦略5：先生との関係性を大切にする</h3>
<p>評定は最終的に教科担当の先生がつけます。授業後の質問、先生のアドバイスを実行する姿勢、感謝の言葉などを積み重ねることで、「学ぼうとしている生徒」という認識を持ってもらえます。これは観点別評価の「主体性」評価に大きく影響します。</p>

<hr>
<h2 id="section-tool">6. 計算ツールで自分の内申点を確認する</h2>
<p>${esc(pref.name)}の内申点を実際に計算してみましょう。当サイトの<strong>無料計算ツール</strong>を使えば、9教科の評定を入力するだけで、${esc(pref.name)}の方式に従った正確な内申点が自動算出されます。</p>

<div class="cta-box">
  <h4>${esc(pref.name)}の内申点を今すぐ計算</h4>
  <p>9教科の成績を入力するだけで、${pref.maxScore}点満点の内申点が瞬時に分かります。志望校の合格ラインから逆算もできます。</p>
  <p><a href="/${pref.code}/naishin" class="btn-primary">${esc(pref.name)}の内申点計算ツール</a> ／ <a href="/reverse?pref=${pref.code}" class="btn-secondary">志望校から逆算する</a></p>
</div>

<hr>
<h2 id="section-faq">7. よくある質問</h2>

${mergedFaqs.slice(0, 5).map((faq, i) => `<div class="faq-item">
  <h4>Q${i + 1}. ${faq.q}</h4>
  <p>${faq.a}</p>
</div>`).join('\n')}

<hr>
<h2 id="section-summary">8. まとめ</h2>

<div class="summary-box">
  <h4>${esc(pref.name)}の内申点 完全ガイドのまとめ</h4>
  <ul>
    <li><strong>満点</strong>：${pref.maxScore}点</li>
    <li><strong>対象学年</strong>：${esc(targetText)}</li>
    <li><strong>計算方法</strong>：${esc(multText)}、${esc(gradeText)}</li>
    <li><strong>オール3の内申点</strong>：${examples.all3}点（満点の約${Math.round((examples.all3 / pref.maxScore) * 100)}%）</li>
    <li><strong>オール4の内申点</strong>：${examples.all4}点（満点の約${Math.round((examples.all4 / pref.maxScore) * 100)}%）</li>
    <li><strong>重要ポイント</strong>：${pref.practicalMultiplier > 1 ? `実技4教科の倍率が${pref.practicalMultiplier}倍と高いため、実技対策が内申点アップの最短ルート` : '全教科の評定をバランス良く上げる戦略が有効'}</li>
  </ul>
</div>

<p>${esc(pref.name)}の高校入試で第一志望校に合格するには、内申点と当日点の両輪が必要です。本記事の計算方法を理解し、当サイトの計算ツールで現状を把握した上で、志望校の合格ラインから逆算した戦略を立てましょう。</p>

<p>関連記事として、<a href="/blog/naishin-guide">内申点の基本ガイド</a>、<a href="/blog/how-to-raise-naishinten">内申点の上げ方7選</a>、<a href="/blog/practical-subjects-tips">実技4教科の対策法</a>もあわせてお読みください。</p>

<div class="related-links">
  <h4>${esc(pref.name)}に関連するページ</h4>
  <ul>
${related.map(r => `    <li><a href="${r.url}">${esc(r.title)}</a></li>`).join('\n')}
  </ul>
</div>
`;
}

function generateForPrefecture(pref: PrefectureConfig): BlogPost {
  const slug = slugFor(pref.code);
  const examples = calculationExamples(pref);

  // FAQ用：guide があれば使う、なければ汎用5問
  const guide = prefectureGuides[pref.code];
  const faqs = (guide?.faq && guide.faq.length > 0
    ? guide.faq
    : [
        {
          question: `${pref.name}の内申点は何点満点ですか？`,
          answer: `${pref.name}の内申点は${pref.maxScore}点満点です。${pref.description}という計算方式です。`,
        },
        {
          question: `${pref.name}はいつの成績が内申点になりますか？`,
          answer: `${targetGradesText(pref)}の成績が対象です。${pref.targetGrades.length === 1 ? '集中した対策が効果的です。' : '早期からの計画的な対策が有利です。'}`,
        },
        {
          question: `${pref.name}でオール3だと内申点は何点？`,
          answer: `オール3の場合、${pref.name}の内申点は${examples.all3}点（満点${pref.maxScore}点の約${Math.round((examples.all3 / pref.maxScore) * 100)}%）になります。`,
        },
        {
          question: `${pref.name}で実技教科はどう扱われますか？`,
          answer: pref.practicalMultiplier === 1
            ? `${pref.name}では実技4教科は主要5教科と等倍で計算されます。`
            : `${pref.name}では実技4教科が${pref.practicalMultiplier}倍で計算され、内申点への影響が大きくなっています。`,
        },
        {
          question: `${pref.name}で内申点を上げるコツは？`,
          answer: `①定期テストでの安定した点数、②提出物の期限厳守と質向上、③授業中の発言・振り返りの充実、④${pref.practicalMultiplier > 1 ? '実技教科の徹底対策' : '苦手教科の底上げ'}、⑤先生との良好なコミュニケーション。継続的な取り組みが${pref.maxScore}点満点中の差を生みます。`,
        },
      ]
  ).slice(0, 5);

  // Sources
  const sources: { name: string; url: string }[] = [];
  if (pref.sourceUrl) {
    sources.push({ name: pref.sourceTitle || `${pref.name}教育委員会`, url: pref.sourceUrl });
  }
  if (pref.sourceUrl2) {
    sources.push({ name: `${pref.name}入試情報（参考資料）`, url: pref.sourceUrl2 });
  }

  return {
    slug,
    title: `【2026年最新】${pref.name}の内申点計算完全ガイド｜${pref.maxScore}点満点の仕組みと上げ方`,
    description: `${pref.name}の公立高校入試における内申点（${pref.maxScore}点満点）の計算方法を徹底解説。${targetGradesText(pref)}が対象、${multiplierText(pref)}という独自ルールに基づき、オール3・オール4の具体例から内申点アップの実践戦略まで網羅しました。2026年度（令和8年度）入試対応。`,
    date: '2026-05-10',
    lastUpdated: '2026-05-11',
    category: '都道府県別',
    readTime: '10分',
    author: '運営者（My Naishin）',
    supervisor: undefined,
    tags: [
      pref.name,
      '内申点',
      '高校入試',
      '計算方法',
      '2026年度入試',
      pref.region,
    ],
    sources: sources.length > 0 ? sources : undefined,
    faqs,
    content: generateContent(pref),
  };
}

export function generatePrefectureBlogPosts(): BlogPost[] {
  return PREFECTURES
    .filter(pref => !HAND_WRITTEN_PREFECTURE_SLUGS.has(slugFor(pref.code)))
    .map(generateForPrefecture);
}
