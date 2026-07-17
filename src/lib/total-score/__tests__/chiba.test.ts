import { computeChibaKValue, CHIBA_K_PRESETS } from '@/lib/total-score/chiba';

describe('computeChibaKValue（千葉県：学力検査+評定合計×K値+任意項目）', () => {
  it('K=1.0・その他/学校設定検査なしで満点(評定135+学力500=635)入力は635点', () => {
    const result = computeChibaKValue({ hyoteiRaw: 135, gakuryokuRaw: 500, kValue: 1.0 });
    expect(result.reportScore).toBe(135);
    expect(result.total).toBe(635);
    expect(result.max).toBe(635); // 500 + 135*1.0
  });

  it('kValue未指定は既定1.0を使う', () => {
    const withK = computeChibaKValue({ hyoteiRaw: 100, gakuryokuRaw: 400, kValue: 1.0 });
    const withoutK = computeChibaKValue({ hyoteiRaw: 100, gakuryokuRaw: 400 });
    expect(withoutK.total).toBe(withK.total);
  });

  it('K=2.0は調査書点への寄与が2倍になる', () => {
    const result = computeChibaKValue({ hyoteiRaw: 100, gakuryokuRaw: 0, kValue: 2.0 });
    expect(result.reportScore).toBe(200);
  });

  it('includeOthers=falseならothersRawを渡しても加算されない（未入力扱い）。満点は評定満点135を基準に算出', () => {
    const result = computeChibaKValue({ hyoteiRaw: 100, gakuryokuRaw: 400, kValue: 1.0, othersRaw: 30, includeOthers: false });
    expect(result.total).toBe(500); // 400 + 100*1.0（othersは無視）
    expect(result.max).toBe(635); // 500 + 135*1.0（othersは未計上のため+50は無し）
  });

  it('includeOthers=trueならothersRawが満点にも加算にも反映される', () => {
    const result = computeChibaKValue({ hyoteiRaw: 100, gakuryokuRaw: 400, kValue: 1.0, othersRaw: 30, includeOthers: true });
    expect(result.total).toBe(530); // 400 + 100 + 30
    expect(result.max).toBe(685); // 500 + 135*1.0 + 50
  });

  it('includeSchoolExam=trueなら学校設定検査が満点にも加算にも反映される', () => {
    const result = computeChibaKValue({
      hyoteiRaw: 100,
      gakuryokuRaw: 400,
      kValue: 1.0,
      schoolExamRaw: 80,
      includeSchoolExam: true,
    });
    expect(result.total).toBe(580); // 400 + 100 + 80
    expect(result.max).toBe(785); // 500 + 135*1.0 + 150
  });

  it('CHIBA_K_PRESETSは0.5/1.0/1.5/2.0の4段階', () => {
    expect(CHIBA_K_PRESETS).toEqual([0.5, 1.0, 1.5, 2.0]);
  });

  it('満点を大幅に超える入力（K値含む）はクランプされ異常値にならない', () => {
    const result = computeChibaKValue({
      hyoteiRaw: 1e30,
      gakuryokuRaw: 1e30,
      kValue: 1e30,
      othersRaw: 1e30,
      includeOthers: true,
      schoolExamRaw: 1e30,
      includeSchoolExam: true,
    });
    expect(Number.isFinite(result.total)).toBe(true);
    expect(Number.isFinite(result.max)).toBe(true);
    expect(result.total).toBe(500 + 135 * 5 + 50 + 150); // K値は0-5にクランプ
  });

  it('負の入力は0にクランプされる', () => {
    const result = computeChibaKValue({ hyoteiRaw: -100, gakuryokuRaw: -400, kValue: -1 });
    expect(result.total).toBe(0);
  });
});
