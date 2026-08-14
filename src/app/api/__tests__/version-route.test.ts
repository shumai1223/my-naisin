/**
 * @jest-environment node
 *
 * /api/version(2026-08-12・DW-2で新設された「今本番に配信されているのはどのコードか」を
 * 外から確認するための窓口)が無テストだった。デプロイ確認の切り分け手段として実際に
 * 使われた実績のあるエンドポイントであり、marker/noteの型・no-storeキャッシュヘッダ
 * (キャッシュされて古い版を返し続けると本来の目的=デプロイ確認自体が壊れる)を固定する。
 */
import { GET } from '@/app/api/version/route';

describe('/api/version', () => {
  it('markerは数値・noteは非空文字列を返す', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.marker).toBe('number');
    expect(json.note.length).toBeGreaterThan(0);
  });

  it('cache-control: no-storeを返す(キャッシュされるとデプロイ確認という目的自体が壊れる)', async () => {
    const res = await GET();
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('コミットSHA等の秘密情報を含まない(単調増加するmarkerと説明のみ)', async () => {
    const res = await GET();
    const json = await res.json();
    const keys = Object.keys(json).sort();
    expect(keys).toEqual(['marker', 'note']);
  });
});
