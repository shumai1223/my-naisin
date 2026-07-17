import { computeSaitamaTotalScore, SAITAMA_MAX_GAKURYOKU, SAITAMA_ASSUMED_TOTAL_CEILING } from '@/lib/total-score/saitama';

describe('computeSaitamaTotalScore（埼玉県：学力検査+調査書点(自己申告)の単純合算・目安）', () => {
  it('学力検査と調査書点を単純合算する', () => {
    const result = computeSaitamaTotalScore({ gakuryokuRaw: 380, chosashoRaw: 260 });
    expect(result.total).toBe(640);
    expect(result.max).toBe(SAITAMA_ASSUMED_TOTAL_CEILING);
  });

  it('0点入力は0点', () => {
    const result = computeSaitamaTotalScore({ gakuryokuRaw: 0, chosashoRaw: 0 });
    expect(result.total).toBe(0);
  });

  it('SAITAMA_ASSUMED_TOTAL_CEILINGは学力検査満点+仮定調査書満点の和', () => {
    expect(SAITAMA_ASSUMED_TOTAL_CEILING).toBe(SAITAMA_MAX_GAKURYOKU + 400);
  });

  it('極端に大きい入力はクランプされ異常値にならない', () => {
    const result = computeSaitamaTotalScore({ gakuryokuRaw: 1e30, chosashoRaw: 1e30 });
    expect(result.total).toBe(SAITAMA_MAX_GAKURYOKU + 1000);
  });

  it('負の入力は0にクランプされる', () => {
    const result = computeSaitamaTotalScore({ gakuryokuRaw: -500, chosashoRaw: -400 });
    expect(result.total).toBe(0);
  });
});
