import { getAnnualUpdateExamples, ANNUAL_UPDATE_EXAMPLES } from '../annual-update-examples';
import { getSourceHistory } from '../source-history';

describe('getAnnualUpdateExamples（T-C9・年次更新実績の実例・捏造防止ガード）', () => {
  it('登録された全エントリがsource-history.tsに実在する日付を指している', () => {
    expect(() => getAnnualUpdateExamples()).not.toThrow();
  });

  it('各エントリのprefecture+dateがgetSourceHistory()の実データと一致する', () => {
    for (const ex of ANNUAL_UPDATE_EXAMPLES) {
      const history = getSourceHistory(ex.prefecture);
      expect(history.some((snap) => snap.date === ex.date)).toBe(true);
    }
  });

  it('架空のprefecture/dateを追加すると例外を投げる（fail-closed）', () => {
    const original = [...ANNUAL_UPDATE_EXAMPLES];
    ANNUAL_UPDATE_EXAMPLES.push({ prefecture: 'tokyo', date: '2099-01-01', summary: '架空の実績（テスト用）' });
    expect(() => getAnnualUpdateExamples()).toThrow();
    ANNUAL_UPDATE_EXAMPLES.length = 0;
    ANNUAL_UPDATE_EXAMPLES.push(...original);
  });

  it('公開ビューにprefectureNameが補完される', () => {
    const views = getAnnualUpdateExamples();
    for (const v of views) {
      expect(v.prefectureName).toBeTruthy();
      expect(v.prefectureName).not.toBe(v.prefecture);
    }
  });
});
