/**
 * 埋め込みウィジェット本体（被リンクエンジン）。
 *
 * 他サイトが <iframe src="https://my-naishin.com/embed/naishin"> で貼れる、
 * 完全に自己完結したHTMLを返す。グローバルLayout（Header/Footer/AdSense）を一切通さず、
 * フレーム許可ヘッダを自前で付与する。中身は全国共通で常に正確な
 * 「素内申（9教科合計・45点満点）＋評定平均」の計算機＋本家への出典リンク。
 *
 * UI: 本家favicon.svgのロゴ＋1〜5のセグメント型ピルボタン（モダンUI）。
 * 計算は素内申＝合計・評定平均＝平均のみ（全都道府県で正しい単純式）。
 * 県別の「換算内申」はCTAから本家サイトへ誘導する設計（正確性も担保）。
 */
import { extractExternalDomain, persistAdoptionHit } from '@/lib/adoption-radar-db';

const HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>内申点（素内申）・評定平均 計算ツール | My Naishin</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;background:#fff;color:#17231d;-webkit-text-size-adjust:100%}
  .wrap{max-width:480px;margin:0 auto;padding:12px 16px}
  .hd{display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .logo{width:34px;height:34px;border-radius:6px;display:block;flex:0 0 auto}
  .ttl{font-size:14px;font-weight:700;line-height:1.3;color:#17231d}
  .sub{font-size:12px;color:#4f6158;margin-top:2px}
  .list{border:1px solid #cddad3;border-radius:8px;overflow:hidden}
  .row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 12px}
  .row+.row{border-top:1px solid #e9efeb}
  .row:nth-child(even){background:#f4f7f5}
  .lab{font-size:13px;font-weight:700;color:#17231d;white-space:nowrap}
  .seg{display:inline-flex;gap:4px}
  .seg button{position:relative;width:30px;height:30px;border-radius:6px;border:1px solid #cddad3;background:#fff;color:#4f6158;font-weight:700;font-size:13px;cursor:pointer;-webkit-appearance:none;appearance:none;transition:background .12s,color .12s,border-color .12s,box-shadow .12s}
  .seg button::before{content:"";position:absolute;top:-7px;bottom:-7px;left:-2px;right:-2px}
  .seg button:hover{border-color:#cddad3;color:#17543e}
  .seg button:focus-visible{outline:2px solid #17543e;outline-offset:2px}
  .seg button.on{background:#17543e;border-color:transparent;color:#fff;}
  .out{margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .card{border-radius:8px;padding:11px 13px;text-align:center}
  .c1{background:#f0f6f3;border:1px solid #cddad3}
  .c2{background:#fff;border:1px solid #cddad3}
  .num{font-size:30px;font-weight:700;line-height:1}
  .c1 .num{color:#17543e}
  .c2 .num{color:#17231d}
  .lbl{font-size:12px;font-weight:700;margin-top:4px;color:#4f6158}
  .cta{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:10px;text-align:center;background:#17543e;color:#fff;text-decoration:none;padding:12px;border-radius:8px;font-weight:700;font-size:13px;}
  .cta:hover{background:#123f2f}
  .pw{margin-top:13px;text-align:center;font-size:12px;color:#4f6158}
  .pw a{display:inline-block;margin:-13px 0;padding:13px 4px;color:#17543e;text-decoration:none;font-weight:700}
</style>
</head>
<body>
<div class="wrap">
  <div class="hd">
    <img class="logo" src="https://my-naishin.com/favicon.svg" alt="My Naishin" width="34" height="34">
    <div>
      <div class="ttl">内申点（素内申）・評定平均 計算ツール</div>
      <div class="sub">9教科の評定（1〜5）をタップするだけ・無料</div>
    </div>
  </div>
  <div class="list" id="inputs"></div>
  <div class="out">
    <div class="card c1"><div class="num"><span id="sum">27</span><span style="font-size:15px">/45</span></div><div class="lbl">素内申（9教科合計）</div></div>
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
    var grades=[3,3,3,3,3,3,3,3,3];
    var box=document.getElementById("inputs");
    for(var i=0;i<subjects.length;i++){
      (function(idx){
        var row=document.createElement("div");row.className="row";
        var lab=document.createElement("span");lab.className="lab";lab.textContent=subjects[idx];
        var seg=document.createElement("div");seg.className="seg";
        for(var v=1;v<=5;v++){
          (function(val){
            var b=document.createElement("button");b.type="button";b.textContent=String(val);
            if(val===3){b.className="on";}
            b.onclick=function(){
              grades[idx]=val;
              var btns=seg.children;
              for(var k=0;k<btns.length;k++){btns[k].className=(k+1===val)?"on":"";}
              calc();
            };
            seg.appendChild(b);
          })(v);
        }
        row.appendChild(lab);row.appendChild(seg);box.appendChild(row);
      })(i);
    }
    function calc(){
      var sum=0;for(var i=0;i<grades.length;i++){sum+=grades[i];}
      document.getElementById("sum").textContent=String(sum);
      document.getElementById("avg").textContent=(sum/9).toFixed(1);
    }
    calc();
  })();
</script>
</body>
</html>`;

export async function GET(request: Request) {
  // 採用レーダー（ZZ-6e）: どの外部サイトがこのiframeを貼っているかをRefererドメインから検出。
  // fire-and-forget（await しない）＝レスポンスを一切遅延させない。生IPは扱わない。
  void persistAdoptionHit({
    domain: extractExternalDomain(request.headers.get('referer')),
    source: 'embed_naishin',
  });
  return new Response(HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // 他サイトからの iframe 埋め込みを許可（X-Frame-Options は付けない）
      'Content-Security-Policy': 'frame-ancestors *',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
