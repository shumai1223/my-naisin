import { INTERIM_BULLETIN_REGISTRY } from '../interim-rate-bulletin-registry';

describe('冬の倍率速報体制（Y-11フェーズ1）台帳の不変条件', () => {
  it('2026-08-22調査分の38県(第1弾8県+第2弾10県+第3弾10県+第4弾10県)を収録している', () => {
    expect(INTERIM_BULLETIN_REGISTRY).toHaveLength(38);
  });

  it('prefectureCodeに重複が無い', () => {
    const codes = INTERIM_BULLETIN_REGISTRY.map((e) => e.prefectureCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('全エントリがnote（所見）とinvestigatedAtを持つ（空文字禁止）', () => {
    for (const entry of INTERIM_BULLETIN_REGISTRY) {
      expect(entry.note.length).toBeGreaterThan(0);
      expect(entry.investigatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('statusが\'not-investigated\'以外のエントリはconfidenceを持つ', () => {
    for (const entry of INTERIM_BULLETIN_REGISTRY) {
      if (entry.status !== 'not-investigated') {
        expect(entry.confidence).toBeDefined();
      }
    }
  });

  it('confirmed-multistageまたはpresumed-multistageの県が過半数を占める（仮説が支持された調査結果を反映）', () => {
    const multistage = INTERIM_BULLETIN_REGISTRY.filter(
      (e) => e.status === 'confirmed-multistage' || e.status === 'presumed-multistage'
    );
    expect(multistage.length).toBeGreaterThanOrEqual(6);
  });

  it('kumamotoは速報段階で倍率非公表(出願者数のみ)と明記されている（速報面の設計上の重要な制約）', () => {
    const kumamoto = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'kumamoto');
    expect(kumamoto).toBeDefined();
    expect(kumamoto?.interimIncludesRate).toBe(false);
  });

  it('第2バッチ(2026-08-22)の10県を収録している', () => {
    const batch2 = ['chiba', 'saitama', 'kanagawa', 'aichi', 'osaka', 'hyogo', 'hiroshima', 'fukushima', 'hokkaido', 'aomori'];
    const codes = new Set(INTERIM_BULLETIN_REGISTRY.map((e) => e.prefectureCode));
    for (const code of batch2) {
      expect(codes.has(code)).toBe(true);
    }
  });

  it('hokkaidoは4段階以上の多段階公表構造(石川・東京と同型)と明記されている', () => {
    const hokkaido = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'hokkaido');
    expect(hokkaido).toBeDefined();
    expect(hokkaido?.status).toBe('confirmed-multistage');
    expect(hokkaido?.interimIncludesRate).toBe(true);
  });

  it('aomoriは先行速報の実在を断定できず正直にunconfirmedとしている(捏造ゼロ原則)', () => {
    const aomori = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'aomori');
    expect(aomori).toBeDefined();
    expect(aomori?.status).toBe('unconfirmed');
  });

  it('第3バッチ(2026-08-22)の10県を収録している', () => {
    const batch3 = ['iwate', 'miyagi', 'akita', 'yamagata', 'ibaraki', 'gunma', 'niigata', 'toyama', 'fukui', 'yamanashi'];
    const codes = new Set(INTERIM_BULLETIN_REGISTRY.map((e) => e.prefectureCode));
    for (const code of batch3) {
      expect(codes.has(code)).toBe(true);
    }
  });

  it('miyagiは他県と異なり志願変更前/後の別記事構成が確認できず正直にunconfirmedとしている(捏造ゼロ原則)', () => {
    const miyagi = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'miyagi');
    expect(miyagi).toBeDefined();
    expect(miyagi?.status).toBe('unconfirmed');
  });

  it('akitaは速報段階(1次締切2/5時点)で学校別倍率まで公表されると明記されている', () => {
    const akita = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'akita');
    expect(akita).toBeDefined();
    expect(akita?.interimIncludesRate).toBe(true);
  });

  it('第4バッチ(2026-08-22)の10県を収録している', () => {
    const batch4 = ['nagano', 'gifu', 'shizuoka', 'mie', 'shiga', 'kyoto', 'nara', 'wakayama', 'tottori', 'okayama'];
    const codes = new Set(INTERIM_BULLETIN_REGISTRY.map((e) => e.prefectureCode));
    for (const code of batch4) {
      expect(codes.has(code)).toBe(true);
    }
  });

  it('okayamaは志願変更前後の別記事構成が確認できず正直にunconfirmedとしている(捏造ゼロ原則)', () => {
    const okayama = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'okayama');
    expect(okayama).toBeDefined();
    expect(okayama?.status).toBe('unconfirmed');
  });

  it('shigaは2026年度の制度改編(学校独自選抜+一般選抜→一次募集)による構造変化がnoteに明記されている', () => {
    const shiga = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'shiga');
    expect(shiga).toBeDefined();
    expect(shiga?.note).toContain('制度改編');
  });
});
