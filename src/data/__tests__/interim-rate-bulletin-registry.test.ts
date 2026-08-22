import { INTERIM_BULLETIN_REGISTRY } from '../interim-rate-bulletin-registry';

describe('冬の倍率速報体制（Y-11フェーズ1）台帳の不変条件', () => {
  it('2026-08-22調査分の8県を収録している', () => {
    expect(INTERIM_BULLETIN_REGISTRY).toHaveLength(8);
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
});
