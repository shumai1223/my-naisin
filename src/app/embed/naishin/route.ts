/**
 * 埋め込みウィジェット本体（被リンクエンジン）。
 *
 * 他サイトが <iframe src="https://my-naishin.com/embed/naishin"> で貼れる、
 * 完全に自己完結したHTMLを返す。グローバルLayout（Header/Footer/AdSense）を一切通さず、
 * フレーム許可ヘッダを自前で付与する。中身は全国共通で常に正確な
 * 「素内申（9教科合計・45点満点）＋評定平均」の計算機＋本家への出典リンク。
 * 貼られるたびに my-naishin.com への被リンク（CTA＋Powered by）が増える。
 *
 * 計算は素内申＝合計・評定平均＝平均のみ（全都道府県で正しい単純式）。
 * 県別の「換算内申」はCTAから本家サイトへ誘導する設計（正確性も担保）。
 */

const HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>内申点（素内申）・評定平均 計算ツール | My Naishin</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;background:#fff;color:#0f172a;-webkit-text-size-adjust:100%}
  .wrap{max-width:480px;margin:0 auto;padding:16px}
  .hd{display:flex;align-items:center;gap:8px;margin-bottom:12px}
  .badge{background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;font-weight:800;font-size:15px;flex:0 0 auto}
  .ttl{font-size:14px;font-weight:800;line-height:1.3}
  .sub{font-size:11px;color:#64748b;margin-top:2px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .row{display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:7px 10px}
  .row label{font-size:13px;font-weight:600}
  .row select{font-size:14px;padding:4px 8px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;color:#0f172a}
  .out{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .card{border-radius:12px;padding:12px;text-align:center}
  .c1{background:#eff6ff;border:1px solid #bfdbfe}
  .c2{background:#f0fdf4;border:1px solid #bbf7d0}
  .num{font-size:28px;font-weight:900;line-height:1}
  .c1 .num{color:#1d4ed8}
  .c2 .num{color:#15803d}
  .lbl{font-size:11px;font-weight:700;margin-top:5px;color:#475569}
  .cta{display:block;margin-top:14px;text-align:center;background:#0f172a;color:#fff;text-decoration:none;padding:11px;border-radius:12px;font-weight:800;font-size:13px}
  .pw{margin-top:10px;text-align:center;font-size:11px;color:#94a3b8}
  .pw a{color:#2563eb;text-decoration:none;font-weight:700}
</style>
</head>
<body>
<div class="wrap">
  <div class="hd">
    <div class="badge">内</div>
    <div>
      <div class="ttl">内申点（素内申）・評定平均 計算ツール</div>
      <div class="sub">9教科の評定（1〜5）を選ぶだけ・無料</div>
    </div>
  </div>
  <div class="grid" id="inputs"></div>
  <div class="out">
    <div class="card c1"><div class="num"><span id="sum">27</span><span style="font-size:14px">/45</span></div><div class="lbl">素内申（9教科合計）</div></div>
    <div class="card c2"><div class="num" id="avg">3.0</div><div class="lbl">評定平均</div></div>
  </div>
  <a class="cta" href="https://my-naishin.com/" target="_blank" rel="noopener">
    あなたの都道府県の「換算内申」を正確に計算する →
  </a>
  <div class="pw">Powered by <a href="https://my-naishin.com/" target="_blank" rel="noopener">My Naishin｜内申点 計算サイト</a></div>
</div>
<script>
  (function(){
    var subjects=["国語","数学","英語","理科","社会","音楽","美術","保健体育","技術家庭"];
    var box=document.getElementById("inputs");
    for(var i=0;i<subjects.length;i++){
      var row=document.createElement("div");row.className="row";
      var lab=document.createElement("label");lab.textContent=subjects[i];
      var sel=document.createElement("select");
      for(var v=5;v>=1;v--){var o=document.createElement("option");o.value=String(v);o.textContent=String(v);if(v===3){o.selected=true;}sel.appendChild(o);}
      sel.onchange=calc;
      row.appendChild(lab);row.appendChild(sel);box.appendChild(row);
    }
    function calc(){
      var sels=box.getElementsByTagName("select");var sum=0;
      for(var i=0;i<sels.length;i++){sum+=parseInt(sels[i].value,10);}
      document.getElementById("sum").textContent=String(sum);
      document.getElementById("avg").textContent=(sum/9).toFixed(1);
    }
    calc();
  })();
</script>
</body>
</html>`;

export async function GET() {
  return new Response(HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // 他サイトからの iframe 埋め込みを許可（X-Frame-Options は付けない）
      'Content-Security-Policy': 'frame-ancestors *',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
