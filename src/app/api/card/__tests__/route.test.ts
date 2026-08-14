/**
 * @jest-environment node
 *
 * 成績レポート画像カード(/api/card)の契約テスト。
 * decodeSharePayload(share.ts)は型を強制するが、buildCard内のesc()自体は独立実装(esp.ts/
 * newsletter.tsとは別コピー)のため、SVGへ埋め込む文字列が正しくエスケープされることを直接検証する
 * (このルートは未認証で誰でも叩けるためXSS/SVGインジェクションの実在する攻撃対象面)。
 */
import { encodeSharePayload } from '@/lib/share';
import { GET } from '../route';

function cardReq(query: string) {
  return new Request(`https://my-naishin.com/api/card${query}`);
}

async function svgOf(query: string): Promise<string> {
  const res = await GET(cardReq(query));
  expect(res.status).toBe(200);
  expect(res.headers.get('Content-Type')).toContain('image/svg+xml');
  return res.text();
}

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
  });

  it('ratio=squareで1080x1080、既定は1200x630になる', async () => {
    const og = await svgOf('');
    const square = await svgOf('?ratio=square');
    expect(og).toContain('width="1200" height="630"');
    expect(square).toContain('width="1080" height="1080"');
  });
});

describe('/api/card XSS/SVGインジェクション防止', () => {
  it('prefectureNameに<script>を仕込んだ共有ペイロードでも生のタグは出力されない', async () => {
    const payload = encodeSharePayload({
      prefectureName: '<script>alert(1)</script>',
      score: 350,
      max: 450,
    });
    const svg = await svgOf(`?d=${payload}`);
    expect(svg).not.toContain('<script>alert(1)</script>');
    expect(svg).toContain('&lt;script&gt;');
  });

  it('metricLabelに"を仕込んでもSVG属性を閉じて抜け出せない(属性エスケープ)', async () => {
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

  it('percentileがあれば「上位N%」チップが表示される(100-percentile、1未満には切り下げない)', async () => {
    const svg = await svgOf(`?d=${encodeSharePayload({ score: 300, max: 450, percentile: 90, percentileScope: 'national' })}`);
    expect(svg).toContain('上位 10%');
  });
});
