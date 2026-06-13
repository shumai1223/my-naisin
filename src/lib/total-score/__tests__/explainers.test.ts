import { TOTAL_SCORE_EXPLAINERS, EXPLAINER_CODES, getExplainer } from '../explainers';
import { TOTAL_SCORE_SYSTEMS } from '../registry';

describe('total-score explainers (第2層)', () => {
  it('9県が登録されている', () => {
    expect(EXPLAINER_CODES).toHaveLength(9);
  });

  it('必須項目が埋まっている（捏造ゼロ・出典必須）', () => {
    for (const [code, e] of Object.entries(TOTAL_SCORE_EXPLAINERS)) {
      expect(e.code).toBe(code);
      expect(e.name).toBeTruthy();
      expect(e.composition.length).toBeGreaterThan(20);
      expect(e.tier2Reason.length).toBeGreaterThan(10);
      expect(e.source.url).toMatch(/^https?:\/\//);
      expect(e.source.docTitle).toBeTruthy();
      expect(e.fiscalYear).toBe('2026');
      expect(e.report.note).toBeTruthy();
      expect(e.schoolBordersOmitted).toBe(true);
    }
  });

  it('ボリューム項目（overview・flow・faqs）が充実している（索引・GEO対策）', () => {
    for (const e of Object.values(TOTAL_SCORE_EXPLAINERS)) {
      expect(e.overview.length).toBeGreaterThan(60);
      expect(e.flow.length).toBeGreaterThanOrEqual(3);
      expect(e.faqs.length).toBeGreaterThanOrEqual(3);
      for (const f of e.faqs) {
        expect(f.q.length).toBeGreaterThan(8);
        expect(f.a.length).toBeGreaterThan(30);
      }
    }
  });

  it('第1層（計算機）と第2層（解説）は排他＝同じ県が両方に存在しない（ルート分岐の前提）', () => {
    for (const code of EXPLAINER_CODES) {
      expect(TOTAL_SCORE_SYSTEMS[code]).toBeUndefined();
    }
    for (const code of Object.keys(TOTAL_SCORE_SYSTEMS)) {
      expect(TOTAL_SCORE_EXPLAINERS[code]).toBeUndefined();
    }
  });

  it('getExplainer は登録県を返し、未登録は undefined', () => {
    expect(getExplainer('miyagi')?.method).toBe('相関図');
    expect(getExplainer('hyogo')).toBeUndefined(); // 第1層（計算機）
    expect(getExplainer('xxxxx')).toBeUndefined();
  });
});
