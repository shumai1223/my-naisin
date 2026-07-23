/**
 * @jest-environment node
 *
 * 埋め込みウィジェット(/embed/naishin・/embed/hensachi)の契約テスト(X-25/X-28)。
 * 他サイトのiframeから読み込まれるため、①埋め込みを許可するCSPヘッダ ②被リンクの生命線である
 * 「Powered by My Naishin」クレジットリンクがHTML内に構造的に埋め込まれている ③各ツールの計算式が
 * 意図通りである、の3点を固定する回帰ガード。既存テストが存在しなかったため新設。
 */
import { GET as naishinGET } from '@/app/embed/naishin/route';
import { GET as hensachiGET } from '@/app/embed/hensachi/route';

describe('/embed/naishin', () => {
  test('埋め込みを許可するCSP(frame-ancestors *)とtext/htmlを返す', async () => {
    const res = await naishinGET();
    expect(res.headers.get('Content-Type')).toContain('text/html');
    expect(res.headers.get('Content-Security-Policy')).toBe('frame-ancestors *');
  });

  test('Powered by My Naishinのクレジットリンクが本文に含まれる', async () => {
    const res = await naishinGET();
    const html = await res.text();
    expect(html).toContain('Powered by');
    expect(html).toContain('https://my-naishin.com/');
    expect(html).toContain('>My Naishin');
  });

  test('素内申(9教科合計・45点満点)の初期値と評定平均の計算式が意図通り', async () => {
    const res = await naishinGET();
    const html = await res.text();
    // 初期値は全教科3(既定の中央値)=素内申27・評定平均3.0
    expect(html).toContain('id="sum">27<');
    expect(html).toContain('id="avg">3.0<');
    // 平均=合計/9教科(小数第1位)というロジックが式として存在する
    expect(html).toContain('sum/9).toFixed(1)');
  });
});

describe('/embed/hensachi', () => {
  test('埋め込みを許可するCSP(frame-ancestors *)とtext/htmlを返す', async () => {
    const res = await hensachiGET();
    expect(res.headers.get('Content-Type')).toContain('text/html');
    expect(res.headers.get('Content-Security-Policy')).toBe('frame-ancestors *');
  });

  test('Powered by My Naishinのクレジットリンクが本文に含まれる', async () => {
    const res = await hensachiGET();
    const html = await res.text();
    expect(html).toContain('Powered by');
    expect(html).toContain('https://my-naishin.com/hensachi');
    expect(html).toContain('>My Naishin');
  });

  test('偏差値=50+10×(点数-平均点)/15(標準偏差15固定の簡易版)という式が本家lib/hensachi.tsと同じ定数を使っている', async () => {
    const res = await hensachiGET();
    const html = await res.text();
    // 50+10*(scores[i]-averages[i])/15 という式そのものが埋め込まれている
    expect(html).toContain('50+10*(scores[i]-averages[i])/15');
  });
});
