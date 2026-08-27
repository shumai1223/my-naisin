/**
 * 埋め込みウィジェット（T-C7）— 学習成績の状況（大学受験の評定平均）計算ツール。
 *
 * embed/naishin・embed/hensachiと同じ設計方針: 他サイトが
 * <iframe src="https://my-naishin.com/embed/gakushu-seiseki"> で貼れる、完全に自己完結した
 * HTMLを返す。グローバルLayoutを一切通さず、フレーム許可ヘッダを自前で付与する。
 *
 * ★クレジット表記「Powered by My Naishin」はサーバー側でHTMLに焼き込んでおり、
 * 埋め込み側から編集・削除できない（widget本体と不可分＝「外せない実装」）。
 *
 * ★ドメイン制限（T-C7 DoD）: ?domains=example.com,partner.jp のように許可ドメインを
 * 指定したURLを発行すると、そのドメイン以外のRefererからの表示時に案内画面へフォールバックする。
 * パラメータを付けない場合は既存2ウィジェットと同じく無制限（オープン埋め込み）のまま。
 * APIキー発行への正式な紐付け（DB管理）は将来の拡張候補として ops/tasks/T-C7-embed-widget.md に記録。
 */
import { extractExternalDomain, persistAdoptionHit } from '@/lib/adoption-radar-db';

function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>学習成績の状況（大学受験の評定平均）計算ツール | My Naishin</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;background:#fff;color:#0f172a;-webkit-text-size-adjust:100%}
  .wrap{max-width:480px;margin:0 auto;padding:16px}
  .hd{display:flex;align-items:center;gap:10px;margin-bottom:14px}
  .logo{width:34px;height:34px;border-radius:8px;display:block;box-shadow:0 1px 3px rgba(15,23,42,.15);flex:0 0 auto}
  .ttl{font-size:13px;font-weight:800;line-height:1.3;color:#0f172a}
  .sub{font-size:11px;color:#64748b;margin-top:2px}
  .list{border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}
  .row{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 10px}
  .row+.row{border-top:1px solid #f1f5f9}
  .row:nth-child(even){background:#f8fafc}
  .lab{font-size:11px;font-weight:600;color:#334155}
  .seg{display:inline-flex;gap:3px}
  .seg button{width:26px;height:26px;border-radius:7px;border:1px solid #e2e8f0;background:#fff;color:#64748b;font-weight:700;font-size:12px;cursor:pointer;-webkit-appearance:none;appearance:none;transition:background .12s,color .12s,border-color .12s,box-shadow .12s}
  .seg button:hover{border-color:#6ee7b7;color:#059669}
  .seg button.on{background:linear-gradient(135deg,#059669,#0d9488);border-color:transparent;color:#fff;box-shadow:0 2px 6px rgba(5,150,105,.35)}
  .out{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .card{border-radius:14px;padding:13px;text-align:center}
  .c1{background:#ecfdf5;border:1px solid #a7f3d0}
  .c2{background:#eff6ff;border:1px solid #bfdbfe}
  .num{font-size:28px;font-weight:900;line-height:1}
  .c1 .num{color:#047857}
  .c2 .num{color:#1d4ed8}
  .lbl{font-size:10px;font-weight:700;margin-top:6px;color:#475569}
  .cta{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:14px;text-align:center;background:linear-gradient(135deg,#059669,#0d9488);color:#fff;text-decoration:none;padding:12px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 4px 12px rgba(5,150,105,.3)}
  .cta:hover{filter:brightness(1.05)}
  .pw{margin-top:10px;text-align:center;font-size:11px;color:#94a3b8}
  .pw a{color:#059669;text-decoration:none;font-weight:700}
  .note{margin-top:8px;text-align:center;font-size:10px;color:#94a3b8;line-height:1.5}
</style>
</head>
<body>
<div class="wrap">
  <div class="hd">
    <img class="logo" src="https://my-naishin.com/favicon.svg" alt="My Naishin" width="34" height="34">
    <div>
      <div class="ttl">学習成績の状況（大学受験の評定平均）</div>
      <div class="sub">科目の評定（1〜5）をタップするだけ・無料</div>
    </div>
  </div>
  <div class="list" id="inputs"></div>
  <div class="out">
    <div class="card c1"><div class="num" id="overall">3.0</div><div class="lbl">全体の学習成績の状況</div></div>
    <div class="card c2"><div class="num" id="gaihyou">C</div><div class="lbl">学習成績概評</div></div>
  </div>
  <a class="cta" href="https://my-naishin.com/hyotei-heikin/gakushu-seiseki" target="_blank" rel="noopener">
    教科別・調査書シミュレーターで詳しく計算する →
  </a>
  <div class="pw">Powered by <a href="https://my-naishin.com/" target="_blank" rel="noopener">My Naishin｜内申点 計算サイト</a></div>
  <div class="note">修得単位数は計算に使用しません（文部科学省の公式計算方法に準拠）</div>
</div>
<script>
  (function(){
    var count=8;
    var grades=[];
    for(var i=0;i<count;i++){grades.push(3);}
    var box=document.getElementById("inputs");
    for(var i=0;i<count;i++){
      (function(idx){
        var row=document.createElement("div");row.className="row";
        var lab=document.createElement("span");lab.className="lab";lab.textContent="科目"+(idx+1);
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
    function round1(v){return Math.round(v*10+1e-9)/10;}
    function toGaihyou(v){
      if(v>=4.3)return "A";
      if(v>=3.5)return "B";
      if(v>=2.7)return "C";
      if(v>=1.9)return "D";
      return "E";
    }
    function calc(){
      var sum=0;for(var i=0;i<grades.length;i++){sum+=grades[i];}
      var overall=round1(sum/grades.length);
      document.getElementById("overall").textContent=overall.toFixed(1);
      document.getElementById("gaihyou").textContent=toGaihyou(overall);
    }
    calc();
  })();
</script>
</body>
</html>`;
}

function buildBlockedHtml(allowedDomains: string[]): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>My Naishin 埋め込みウィジェット</title>
<style>body{margin:0;font-family:sans-serif;padding:24px;text-align:center;color:#475569}</style>
</head>
<body>
  <p>このウィジェットは指定のドメイン（${allowedDomains.join(', ')}）専用に発行されています。</p>
  <p style="font-size:12px;color:#94a3b8">ご利用については <a href="https://my-naishin.com/contact?topic=embed">お問い合わせ</a> ください。</p>
</body>
</html>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const domainsParam = url.searchParams.get('domains');
  const referer = request.headers.get('referer');
  const refererDomain = extractExternalDomain(referer);

  if (domainsParam) {
    const allowedDomains = domainsParam
      .split(',')
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    // Refererが取得できた場合のみ照合する（直接アクセスでの動作確認は妨げない）。
    if (refererDomain && !allowedDomains.some((d) => refererDomain === d || refererDomain.endsWith(`.${d}`))) {
      return new Response(buildBlockedHtml(allowedDomains), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Security-Policy': 'frame-ancestors *',
          'Cache-Control': 'private, no-store',
        },
      });
    }
  }

  // 採用レーダー（ZZ-6e）: どの外部サイトがこのiframeを貼っているかをRefererドメインから検出。
  // fire-and-forget（await しない）＝レスポンスを一切遅延させない。生IPは扱わない。
  void persistAdoptionHit({ domain: refererDomain, source: 'embed_gakushu_seiseki' });

  return new Response(buildHtml(), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // 他サイトからの iframe 埋め込みを許可（X-Frame-Options は付けない）
      'Content-Security-Policy': 'frame-ancestors *',
      // ★domainsパラメータ付きURLはRefererによってレスポンス内容が変わるため共有キャッシュに
      // 乗せない（no-store）。パラメータ無しの通常URLのみ内容が一定なので公開キャッシュ可。
      'Cache-Control': domainsParam ? 'private, no-store' : 'public, max-age=3600, s-maxage=86400',
    },
  });
}
