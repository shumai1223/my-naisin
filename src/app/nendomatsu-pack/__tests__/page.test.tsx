/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

jest.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

import NendomatsuPackPage, { metadata } from '../page';
import { SITEMAP_EXCLUDED_ROUTES } from '@/lib/page-registry';

describe('/nendomatsu-pack（T-TD1 TD-8・build-not-launch）', () => {
  const OLD = process.env.NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED;
  afterEach(() => {
    if (OLD === undefined) delete process.env.NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED;
    else process.env.NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED = OLD;
  });

  it('フラグoff(既定)では描画されない(notFound)', () => {
    delete process.env.NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED;
    expect(() => NendomatsuPackPage()).toThrow('NEXT_NOT_FOUND');
    process.env.NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED = '0';
    expect(() => NendomatsuPackPage()).toThrow('NEXT_NOT_FOUND');
  });

  it('noindex/nofollowが付く', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('sitemap除外ルートに登録されている', () => {
    expect(SITEMAP_EXCLUDED_ROUTES as readonly string[]).toContain('/nendomatsu-pack');
  });

  it('フラグonでは9県の納品予定表と「確定待ち」の価格が出る(価格が未確定の間は確定価格を出さない)', () => {
    process.env.NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED = '1';
    const html = renderToStaticMarkup(React.createElement(() => NendomatsuPackPage()));
    expect((html.match(/data-testid="delivery-row"/g) ?? []).length).toBe(9);
    expect(html).toContain('確定待ち');
    expect(html).toContain('適格請求書発行事業者ではありません');
    expect(html).not.toMatch(/¥\d{3},\d{3}（税込）（1式/); // 確定価格の書式は出ない
  });

  it('価格は定数ファイル1か所から差し込まれる(ページ内に金額の直書きが無い)', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/nendomatsu-pack/page.tsx'), 'utf8');
    expect(src).not.toMatch(/¥\s?\d{2,3},\d{3}/);
    expect(src).not.toMatch(/\d{3},000円/);
    expect(src).toContain('displayPriceLabel');
  });
});
