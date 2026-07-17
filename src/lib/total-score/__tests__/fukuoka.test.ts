import { computeFukuokaScore, FUKUOKA_MAX_NAISHIN, FUKUOKA_MAX_GAKURYOKU, FUKUOKA_MAX_TOTAL } from '@/lib/total-score/fukuoka';

describe('computeFukuokaScore（福岡県：内申点+学力検査点の単純合算・目安）', () => {
  it('満点入力（内申45/学力300）は満点345点', () => {
    const result = computeFukuokaScore({ naishinRaw: FUKUOKA_MAX_NAISHIN, gakuryokuRaw: FUKUOKA_MAX_GAKURYOKU });
    expect(result.total).toBe(345);
    expect(result.max).toBe(FUKUOKA_MAX_TOTAL);
    expect(result.percent).toBe(100);
  });

  it('0点入力は0点', () => {
    const result = computeFukuokaScore({ naishinRaw: 0, gakuryokuRaw: 0 });
    expect(result.total).toBe(0);
    expect(result.percent).toBe(0);
  });

  it('FUKUOKA_MAX_TOTALは内申満点+学力満点の和', () => {
    expect(FUKUOKA_MAX_TOTAL).toBe(FUKUOKA_MAX_NAISHIN + FUKUOKA_MAX_GAKURYOKU);
  });

  it('満点を大幅に超える入力は満点にクランプされる', () => {
    const result = computeFukuokaScore({ naishinRaw: 1e30, gakuryokuRaw: 1e30 });
    expect(result.total).toBe(FUKUOKA_MAX_TOTAL);
    expect(result.percent).toBe(100);
  });

  it('負の入力は0にクランプされる', () => {
    const result = computeFukuokaScore({ naishinRaw: -45, gakuryokuRaw: -300 });
    expect(result.total).toBe(0);
  });
});
