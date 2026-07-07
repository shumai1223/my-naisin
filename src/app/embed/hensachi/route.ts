/**
 * 埋め込みウィジェット本体（偏差値版・E-7）。
 *
 * 他サイトが <iframe src="https://my-naishin.com/embed/hensachi"> で貼れる、
 * 完全に自己完結したHTMLを返す。中身は5教科の「点数・平均点」入力→偏差値を
 * その場で算出する計算機（式は lib/hensachi.ts の calcHensachi と同一：
 * 偏差値 = 50 + 10 ×（点数 − 平均点）÷ 標準偏差。標準偏差は既定15固定の簡易版）。
 * naishin版と同じ構造（自己完結HTML・Powered byクレジット・本家CTA）を踏襲。
 */

const HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>偏差値 計算ツール | My Naishin</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;background:#fff;color:#0f172a;-webkit-text-size-adjust:100%}
  .wrap{max-width:480px;margin:0 auto;padding:16px}
  .hd{display:flex;align-items:center;gap:10px;margin-bottom:14px}
  .logo{width:34px;height:34px;border-radius:8px;display:block;box-shadow:0 1px 3px rgba(15,23,42,.15);flex:0 0 auto}
  .ttl{font-size:14px;font-weight:800;line-height:1.3;color:#0f172a}
  .sub{font-size:11px;color:#64748b;margin-top:2px}
  .list{border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}
  .row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 12px}
  .row+.row{border-top:1px solid #f1f5f9}
  .row:nth-child(even){background:#f8fafc}
  .lab{font-size:13px;font-weight:600;color:#334155;white-space:nowrap;flex:0 0 auto}
  .inputs{display:flex;gap:6px}
  .inputs input{width:56px;height:30px;border-radius:8px;border:1px solid #e2e8f0;color:#334155;font-weight:700;font-size:13px;text-align:center;-webkit-appearance:none;appearance:none}
  .inputs input:focus{outline:none;border-color:#a78bfa;box-shadow:0 0 0 2px rgba(167,139,250,.25)}
  .ph{font-size:9px;color:#94a3b8;text-align:center;margin-top:1px}
  .out{margin-top:14px;text-align:center;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:14px;padding:16px}
  .num{font-size:38px;font-weight:900;line-height:1;color:#6d28d9}
  .lbl{font-size:11px;font-weight:700;margin-top:6px;color:#475569}
  .cta{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:14px;text-align:center;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;padding:12px;border-radius:12px;font-weight:800;font-size:13px;box-shadow:0 4px 12px rgba(124,58,237,.3)}
  .cta:hover{filter:brightness(1.05)}
  .pw{margin-top:10px;text-align:center;font-size:11px;color:#94a3b8}
  .pw a{color:#7c3aed;text-decoration:none;font-weight:700}
</style>
</head>
<body>
<div class="wrap">
  <div class="hd">
    <img class="logo" src="https://my-naishin.com/favicon.svg" alt="My Naishin" width="34" height="34">
    <div>
      <div class="ttl">偏差値 計算ツール（5教科）</div>
      <div class="sub">点数と平均点を入れるだけ・無料</div>
    </div>
  </div>
  <div class="list" id="inputs"></div>
  <div class="out"><div class="num" id="result">--</div><div class="lbl">5教科の平均偏差値</div></div>
  <a class="cta" href="https://my-naishin.com/hensachi" target="_blank" rel="noopener">
    標準偏差まで指定して正確に計算する →
  </a>
  <div class="pw">Powered by <a href="https://my-naishin.com/hensachi" target="_blank" rel="noopener">My Naishin｜偏差値 計算サイト</a></div>
</div>
<script>
  (function(){
    var subjects=["国語","数学","英語","理科","社会"];
    var scores=[null,null,null,null,null];
    var averages=[null,null,null,null,null];
    var box=document.getElementById("inputs");
    for(var i=0;i<subjects.length;i++){
      (function(idx){
        var row=document.createElement("div");row.className="row";
        var lab=document.createElement("span");lab.className="lab";lab.textContent=subjects[idx];
        var wrap=document.createElement("div");wrap.className="inputs";
        var s=document.createElement("input");s.type="number";s.placeholder="点数";s.min="0";
        var a=document.createElement("input");a.type="number";a.placeholder="平均";a.min="0";
        s.oninput=function(){scores[idx]=s.value===""?null:Number(s.value);calc();};
        a.oninput=function(){averages[idx]=a.value===""?null:Number(a.value);calc();};
        wrap.appendChild(s);wrap.appendChild(a);
        row.appendChild(lab);row.appendChild(wrap);box.appendChild(row);
      })(i);
    }
    function calc(){
      var vals=[];
      for(var i=0;i<subjects.length;i++){
        if(scores[i]===null||averages[i]===null)continue;
        var h=50+10*(scores[i]-averages[i])/15;
        vals.push(h);
      }
      var out=document.getElementById("result");
      if(vals.length===0){out.textContent="--";return;}
      var sum=0;for(var j=0;j<vals.length;j++){sum+=vals[j];}
      out.textContent=(sum/vals.length).toFixed(1);
    }
  })();
</script>
</body>
</html>`;

export async function GET() {
  return new Response(HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': 'frame-ancestors *',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
