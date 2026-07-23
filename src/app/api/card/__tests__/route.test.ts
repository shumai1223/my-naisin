/**
 * @jest-environment node
 *
 * 結果カード（/api/card）の契約テスト（ZZ-5a）。
 * 既定og比率(1200x630)・LINE/X最適比率(square=1080x1080)の切替と、
 * 立ち位置（percentile）チップがpayload由来の値のみで表示されることを固定する。
 */
import { GET } from '@/app/api/card/route';
import { encodeSharePayload } from '@/lib/share';

function cardReq(query: string) {
  return new Request(`https://my-naishin.com/api/card${query}`);
}

describe('/api/card ratio切替（ZZ-5a）', () => {
  test('既定はog比率(1200x630)', async () => {
    const res = await GET(cardReq(''));
    const svg = await res.text();
    expect(svg).toContain('width="1200" height="630"');
    expect(res.headers.get('Content-Type')).toContain('image/svg+xml');
  });

  test('?ratio=squareは1080x1080', async () => {
    const res = await GET(cardReq('?ratio=square'));
    const svg = await res.text();
    expect(svg).toContain('width="1080" height="1080"');
  });

  test('未知のratio値はog比率にフォールバック', async () => {
    const res = await GET(cardReq('?ratio=vertical'));
    const svg = await res.text();
    expect(svg).toContain('width="1200" height="630"');
  });
});

describe('/api/card 立ち位置チップ（ZZ-5a・カード内数値は全てエンジン由来）', () => {
  test('percentileがpayloadにあれば「上位◯%」チップを表示する', async () => {
    const d = encodeSharePayload({ score: 40, max: 65, percentile: 82, percentileScope: 'prefecture', prefectureName: '東京都' });
    const res = await GET(cardReq(`?d=${d}`));
    const svg = await res.text();
    expect(svg).toContain('上位 18%'); // 100-82
    expect(svg).toContain('東京都の協力者内で');
  });

  test('全国percentileはscope表示が「全国」になる', async () => {
    const d = encodeSharePayload({ score: 40, max: 65, percentile: 60, percentileScope: 'national' });
    const res = await GET(cardReq(`?d=${d}`));
    const svg = await res.text();
    expect(svg).toContain('全国の協力者内で');
    expect(svg).toContain('上位 40%');
  });

  test('percentile未指定ならチップを出さない（見せかけ禁止）', async () => {
    const d = encodeSharePayload({ score: 40, max: 65 });
    const res = await GET(cardReq(`?d=${d}`));
    const svg = await res.text();
    expect(svg).not.toContain('の協力者内で');
  });

  test('payload無し（既定カード）でもエラーにならない', async () => {
    const res = await GET(cardReq(''));
    expect(res.status).toBe(200);
    const svg = await res.text();
    expect(svg).toContain('<svg');
    expect(svg).not.toContain('の協力者内で');
  });
});
