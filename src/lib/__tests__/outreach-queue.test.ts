import fs from 'node:fs';
import path from 'node:path';
import { sortQueueByPriority, summarizeQueue, queueReviewTierOf, type QueueEntry } from '../outreach-queue';

function makeEntry(overrides: Partial<QueueEntry>): QueueEntry {
  return {
    id: 'e1',
    org: 'テスト組織',
    lane: 'kyoiku-i',
    channel: 'email',
    status: 'queued',
    sourceDoc: 'docs/test.md',
    addedAt: '2026-08-02',
    ...overrides,
  };
}

describe('sortQueueByPriority', () => {
  it('channel優先(line>email>form)で並べる', () => {
    const entries = [
      makeEntry({ id: 'a', channel: 'form' }),
      makeEntry({ id: 'b', channel: 'line' }),
      makeEntry({ id: 'c', channel: 'email' }),
    ];
    expect(sortQueueByPriority(entries).map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('同一channel内はlane優先(kyoiku-i>b2b-saas>chihoshi>npo>mutual-link)で並べる', () => {
    const entries = [
      makeEntry({ id: 'a', channel: 'email', lane: 'mutual-link' }),
      makeEntry({ id: 'b', channel: 'email', lane: 'kyoiku-i' }),
      makeEntry({ id: 'c', channel: 'email', lane: 'chihoshi' }),
    ];
    expect(sortQueueByPriority(entries).map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('excludedは除外する', () => {
    const entries = [
      makeEntry({ id: 'a', status: 'excluded' }),
      makeEntry({ id: 'b', status: 'queued' }),
    ];
    expect(sortQueueByPriority(entries).map((e) => e.id)).toEqual(['b']);
  });
});

describe('summarizeQueue', () => {
  it('queued/excludedとchannel/laneの内訳を集計する', () => {
    const entries = [
      makeEntry({ id: 'a', channel: 'email', lane: 'kyoiku-i' }),
      makeEntry({ id: 'b', channel: 'form', lane: 'chihoshi' }),
      makeEntry({ id: 'c', status: 'excluded' }),
    ];
    const s = summarizeQueue(entries);
    expect(s.total).toBe(3);
    expect(s.excludedCount).toBe(1);
    expect(s.queuedByChannel).toEqual({ line: 0, email: 1, form: 1 });
    expect(s.queuedByLane).toEqual({ 'kyoiku-i': 1, chihoshi: 1 });
  });
});

describe('queueReviewTierOf', () => {
  it('kyoiku-i/chihoshiはfull-review既定', () => {
    expect(queueReviewTierOf({ lane: 'kyoiku-i' })).toBe('full-review');
    expect(queueReviewTierOf({ lane: 'chihoshi' })).toBe('full-review');
  });

  it('npo/mutual-linkはspot-check既定', () => {
    expect(queueReviewTierOf({ lane: 'npo' })).toBe('spot-check');
    expect(queueReviewTierOf({ lane: 'mutual-link' })).toBe('spot-check');
  });

  it('個別reviewTier指定があればそちらを優先', () => {
    expect(queueReviewTierOf({ lane: 'npo', reviewTier: 'full-review' })).toBe('full-review');
  });
});

describe('data/outreach-queue.json（X\'-1・実データ整合性）', () => {
  const raw = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'outreach-queue.json'), 'utf8')
  ) as { asOf: string; entries: QueueEntry[] };

  it('idが全件ユニーク', () => {
    const ids = raw.entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('queuedの全件がcontactを持つ(送り先未確定のまま送信キューに入れない)', () => {
    for (const e of raw.entries.filter((e) => e.status === 'queued')) {
      expect(e.contact).toBeTruthy();
    }
  });

  it('excludedの全件がexcludeReasonを持つ(理由なき除外を許さない)', () => {
    for (const e of raw.entries.filter((e) => e.status === 'excluded')) {
      expect(e.excludeReason).toBeTruthy();
    }
  });

  it('email channelのcontactはメールアドレス形式', () => {
    for (const e of raw.entries.filter((e) => e.status === 'queued' && e.channel === 'email')) {
      expect(e.contact).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });

  it('form channelのcontactはhttps URL', () => {
    for (const e of raw.entries.filter((e) => e.status === 'queued' && e.channel === 'form')) {
      expect(e.contact).toMatch(/^https:\/\//);
    }
  });

  it('51件がqueued(教委33[email23+form10]+メディアemail9+メディアform5+個人塾line4)', () => {
    expect(raw.entries.filter((e) => e.status === 'queued')).toHaveLength(51);
  });

  it('line channelは個人塾4件のみ・reviewTierはmutual-link既定spot-checkだがプラスジムのみ個別full-review', () => {
    const lineEntries = raw.entries.filter((e) => e.status === 'queued' && e.channel === 'line');
    expect(lineEntries).toHaveLength(4);
    for (const e of lineEntries) expect(e.lane).toBe('mutual-link');
    const plusgym = lineEntries.find((e) => e.id === 'mutual-link-plusgym-line');
    expect(plusgym?.reviewTier).toBe('full-review');
  });
});
