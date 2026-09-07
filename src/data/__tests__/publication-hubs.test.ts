import { PUBLICATION_HUBS } from '../publication-hubs';

describe('PUBLICATION_HUBS', () => {
  it('47都道府県すべて1件ずつ持つ（重複・欠落なし）', () => {
    expect(PUBLICATION_HUBS).toHaveLength(47);
    const prefs = PUBLICATION_HUBS.map((h) => h.prefecture);
    expect(new Set(prefs).size).toBe(47);
  });

  it('r8Evidenceは全件httpから始まる非空文字列', () => {
    for (const hub of PUBLICATION_HUBS) {
      expect(hub.r8Evidence).toMatch(/^https?:\/\//);
    }
  });

  it('hubUrlがnullの県はhubKindがunknown・r9Url/lastVerifiedAtもnull（Y-0: 推測でURLを作らない）', () => {
    for (const hub of PUBLICATION_HUBS) {
      if (hub.hubUrl === null) {
        expect(hub.hubKind).toBe('unknown');
        expect(hub.r9Url).toBeNull();
        expect(hub.lastVerifiedAt).toBeNull();
      }
    }
  });

  it('hubUrlが判明している県はhubKindがunknown以外・httpから始まる', () => {
    for (const hub of PUBLICATION_HUBS) {
      if (hub.hubUrl !== null) {
        expect(hub.hubKind).not.toBe('unknown');
        expect(hub.hubUrl).toMatch(/^https?:\/\//);
      }
    }
  });

  it('F-2/F-3で判明済みの6県（chiba/saitama/kagoshima/miyagi/gunma/shiga）はhubUrl/r9Urlとも判明済み', () => {
    for (const pref of ['chiba', 'saitama', 'kagoshima', 'miyagi', 'gunma', 'shiga']) {
      const hub = PUBLICATION_HUBS.find((h) => h.prefecture === pref);
      expect(hub?.hubUrl).not.toBeNull();
      expect(hub?.r9Url).not.toBeNull();
      expect(hub?.lastVerifiedAt).toBe('2026-09-07');
    }
  });
});
