/**
 * @jest-environment node
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  NENDOMATSU_PACK,
  confirmedPriceLabel,
  displayPriceLabel,
  fillPricePlaceholders,
  getCoverage,
  getDeliverablePrefectures,
  getPricing,
  isPriceConfirmed,
  type NendomatsuPricing,
} from '../nendomatsu-pack';

const pending: NendomatsuPricing = { status: 'pending', provisionalRangeYenTaxIncluded: [240000, 300000], confirmedYenTaxIncluded: null };
const confirmed: NendomatsuPricing = { status: 'confirmed', provisionalRangeYenTaxIncluded: [240000, 300000], confirmedYenTaxIncluded: 250000 };

describe('価格の単一の出所(T-TD1)', () => {
  it('リポジトリの価格定数は現時点で未確定(👤の確定待ち・C7ゲート)', () => {
    expect(getPricing().status).toBe('pending');
    expect(getPricing().confirmedYenTaxIncluded).toBeNull();
    expect(isPriceConfirmed()).toBe(false);
  });

  it('未確定なら確定価格ラベルはnull・表示には「確定待ち」が明示される', () => {
    expect(confirmedPriceLabel(pending)).toBeNull();
    expect(displayPriceLabel(pending)).toContain('確定待ち');
    expect(displayPriceLabel(pending)).toContain('¥240,000');
    expect(displayPriceLabel(pending)).toContain('¥300,000');
  });

  it('statusがconfirmedでも金額が無ければ確定扱いにしない(片方だけでは通さない)', () => {
    expect(isPriceConfirmed({ ...confirmed, confirmedYenTaxIncluded: null })).toBe(false);
    expect(isPriceConfirmed({ ...pending, confirmedYenTaxIncluded: 250000 })).toBe(false);
    expect(isPriceConfirmed({ ...confirmed, confirmedYenTaxIncluded: 250000.5 })).toBe(false);
  });

  it('確定すると1か所の値が表示・置換の両方に反映される', () => {
    expect(confirmedPriceLabel(confirmed)).toBe('¥250,000（税込）');
    expect(displayPriceLabel(confirmed)).toBe('¥250,000（税込）');
    expect(fillPricePlaceholders('価格は{{PRICE}}です。{{PRICE}}', confirmed)).toBe('価格は¥250,000（税込）です。¥250,000（税込）');
  });

  it('未確定のまま{{PRICE}}を置換しようとすると例外(下書きに仮価格が漏れない)', () => {
    expect(() => fillPricePlaceholders('{{PRICE}}', pending)).toThrow();
  });
});

describe('納品対象県は実データから導出される', () => {
  it('47県すべてにA/B/Cと許諾状況が付く', () => {
    const c = getCoverage();
    expect(c).toHaveLength(47);
    expect(c.every((r) => ['A', 'B', 'C'].includes(r.deliveryClass))).toBe(true);
  });

  it('納品対象は「C以外かつ許諾ok」だけ(fail-closed・TD-0台帳の9県)', () => {
    const d = getDeliverablePrefectures();
    expect(d.every((r) => r.deliveryClass !== 'C' && r.license === 'ok')).toBe(true);
    expect(d.map((r) => r.code).sort()).toEqual(['akita', 'chiba', 'gifu', 'ibaraki', 'ishikawa', 'kagawa', 'nagano', 'okinawa', 'tochigi']);
  });

  it('インボイス非登録の一文と税込表示の注記が定数にある(隠すと経理で止まる)', () => {
    expect(NENDOMATSU_PACK.invoiceNotice).toContain('適格請求書発行事業者ではありません');
    expect(NENDOMATSU_PACK.invoiceNotice).toContain('税込');
  });
});

describe('scripts/td1-fill-price.mjs（実CLIを一時ディレクトリで実行）', () => {
  const script = path.join(process.cwd(), 'scripts', 'td1-fill-price.mjs');
  function setup(pricing: object, drafts: Record<string, string>) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'td1-'));
    const dd = path.join(dir, 'drafts');
    fs.mkdirSync(dd);
    for (const [f, t] of Object.entries(drafts)) fs.writeFileSync(path.join(dd, f), t, 'utf8');
    const pj = path.join(dir, 'pricing.json');
    fs.writeFileSync(pj, JSON.stringify(pricing), 'utf8');
    return { dd, pj };
  }
  const run = (dd: string, pj: string) => {
    try {
      const out = execFileSync('node', [script, '--drafts', dd, '--pricing', pj], { encoding: 'utf8' });
      return { code: 0, out };
    } catch (e) {
      const err = e as { status: number; stdout: string; stderr: string };
      return { code: err.status, out: err.stdout + err.stderr };
    }
  };

  it('価格未確定なら何もせず終了(ファイルは1バイトも変わらない・exit 0)', () => {
    const { dd, pj } = setup(pending, { '01-a.md': '価格 {{PRICE}}' });
    const r = run(dd, pj);
    expect(r.code).toBe(0);
    expect(r.out).toContain('未確定');
    expect(fs.readFileSync(path.join(dd, '01-a.md'), 'utf8')).toBe('価格 {{PRICE}}');
  });

  it('価格確定なら全ファイルの{{PRICE}}を置換する', () => {
    const { dd, pj } = setup(confirmed, { '01-a.md': '価格 {{PRICE}}', '02-b.md': '{{PRICE}} と {{PRICE}}', 'README.md': '{{PRICE}}はここに書く' });
    const r = run(dd, pj);
    expect(r.code).toBe(0);
    expect(fs.readFileSync(path.join(dd, '01-a.md'), 'utf8')).toBe('価格 ¥250,000（税込）');
    expect(fs.readFileSync(path.join(dd, '02-b.md'), 'utf8')).toBe('¥250,000（税込） と ¥250,000（税込）');
    expect(fs.readFileSync(path.join(dd, 'README.md'), 'utf8')).toBe('{{PRICE}}はここに書く'); // 手順書は対象外
  });

  it('置換漏れ({{PRICE}}以外の差し込み口)が1つでもあれば、1ファイルも書き換えず止まる(exit 1)', () => {
    const { dd, pj } = setup(confirmed, { '01-a.md': '価格 {{PRICE}}', '02-b.md': '宛先 {{TODO_NAME}} {{PRICE}}' });
    const r = run(dd, pj);
    expect(r.code).toBe(1);
    expect(r.out).toContain('TODO_NAME');
    expect(fs.readFileSync(path.join(dd, '01-a.md'), 'utf8')).toBe('価格 {{PRICE}}');
  });
});
