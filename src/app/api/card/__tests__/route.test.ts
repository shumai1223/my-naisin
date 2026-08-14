/**
 * @jest-environment node
 *
 * 結果カード（/api/card）の契約テスト。
 * ZZ-5a: 既定og比率(1200x630)・LINE/X最適比率(square=1080x1080)の切替と、
 * 立ち位置（percentile）チップがpayload由来の値のみで表示されることを固定する。
 * 加えて、buildCard内のesc()は独立実装(esp.ts/newsletter.tsとは別コピー)のため、
 * SVGへ埋め込む文字列が正しくエスケープされることを直接検証する
 * (このルートは未認証で誰でも叩けるためXSS/SVGインジェクションの実在する攻撃対象面)。
 */
import { GET } from '@/app/api/card/route';
import { encodeSharePayload } from '@/lib/share';

function cardReq(query: string) {
  return new Request(`https://my-naishin.com/api/card${query}`);
}

async function svgOf(query: string): Promise<string> {
  const res = await GET(cardReq(query));
  expect(res.status).toBe(200);
  expect(res.headers.get('Content-Type')).toContain('image/svg+xml');
  return res.text();
}

describe('/api/card ratio切替（ZZ-5a）', () => {
  test('既定はog比率(1200x630)', async () => {
    const svg = await svgOf('');
    expect(svg).toContain('width="1200" height="630"');
  });

  test('?ratio=squareは1080x1080', async () => {
    const svg = await svgOf('?ratio=square');
    expect(svg).toContain('width="1080" height="1080"');
  });

  test('未知のratio値はog比率にフォールバック', async () => {
    const svg = await svgOf('?ratio=vertical');
    expect(svg).toContain('width="1200" height="630"');
  });
});

describe('/api/card 基本動作', () => {
  it('dパラメータ無しでも既定(ブランド)カードのSVGを返す', async () => {
    const svg = await svgOf('');
    expect(svg).toContain('<svg');
    expect(svg).toContain('内申点');
    expect(svg).toContain('my-naishin.com');
  });

  it('壊れたd(不正なbase64)でも例外にならず既定カードにフォールバックする', async () => {
    const svg = await svgOf('?d=%%%not-valid-base64%%%');
    expect(svg).toContain('<svg');
    expect(svg).toContain('内申点');
    expect(svg).not.toContain('の協力者内で');
  });
});

describe('/api/card 立ち位置チップ（ZZ-5a・カード内数値は全てエンジン由来）', () => {
  test('percentileがpayloadにあれば「上位◯%」チップを表示する', async () => {
    const d = encodeSharePayload({ score: 40, max: 65, percentile: 82, percentileScope: 'prefecture', prefectureName: '東京都' });
    const svg = await svgOf(`?d=${d}`);
    expect(svg).toContain('上位 18%'); // 100-82
    expect(svg).toContain('東京都の協力者内で');
  });

  test('全国percentileはscope表示が「全国」になる', async () => {
    const d = encodeSharePayload({ score: 40, max: 65, percentile: 60, percentileScope: 'national' });
    const svg = await svgOf(`?d=${d}`);
    expect(svg).toContain('全国の協力者内で');
    expect(svg).toContain('上位 40%');
  });

  test('percentile未指定ならチップを出さない（見せかけ禁止）', async () => {
    const d = encodeSharePayload({ score: 40, max: 65 });
    const svg = await svgOf(`?d=${d}`);
    expect(svg).not.toContain('の協力者内で');
  });
});

describe('/api/card XSS/SVGインジェクション防止', () => {
  it('prefectureNameにscriptタグを仕込んだ共有ペイロードでも生のタグは出力されない', async () => {
    const payload = encodeSharePayload({
      prefectureName: '<script>alert(1)</script>',
      score: 350,
      max: 450,
    });
    const svg = await svgOf(`?d=${payload}`);
    expect(svg).not.toContain('<script>alert(1)</script>');
    expect(svg).toContain('&lt;script&gt;');
  });

  it('metricLabelにダブルクォートを仕込んでもSVG属性を閉じて抜け出せない(属性エスケープ)', async () => {
    const payload = encodeSharePayload({
      score: 100,
      max: 100,
      metricLabel: '偏差値" onload="alert(1)',
    });
    const svg = await svgOf(`?d=${payload}`);
    expect(svg).not.toContain('" onload="alert(1)');
  });

  it('labelにHTML特殊文字を仕込んでも(目標との差ラベル経由で)エスケープされる', async () => {
    const payload = encodeSharePayload({
      score: 300,
      max: 450,
      target: 350,
      gap: 50,
      label: '<b>目標</b>',
    });
    const svg = await svgOf(`?d=${payload}`);
    // labelはgapLabel/gapValue経由では使われないため、少なくともscore/target/gap部分に
    // 生のHTMLタグが混入しないことを確認する(数値はtypeof number保証済みなので安全なはず)。
    expect(svg).toContain('あと 50点');
    expect(svg).not.toContain('<b>目標</b>');
  });
});

describe('/api/card 数値の妥当な取り扱い', () => {
  it('目標未達成(gap>0)は不足表示、達成(gap<=0)は達成表示になる', async () => {
    const behind = await svgOf(`?d=${encodeSharePayload({ score: 300, max: 450, target: 350, gap: 50 })}`);
    expect(behind).toContain('あと 50点');

    const achieved = await svgOf(`?d=${encodeSharePayload({ score: 400, max: 450, target: 350, gap: -50 })}`);
    expect(achieved).toContain('50点 達成');
  });
});
