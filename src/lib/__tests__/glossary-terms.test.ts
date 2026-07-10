/**
 * 用語辞典データ（S-9・用語個別ページエンジン）のテスト。
 */
import { GLOSSARY_TERMS, getGlossaryTerm, shortTermLabel, buildGlossaryTermFaqs } from '../glossary-terms';

describe('GLOSSARY_TERMS', () => {
  it('idはすべて一意', () => {
    const ids = GLOSSARY_TERMS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('用語名はすべて一意（コピペ重複なし）', () => {
    const terms = GLOSSARY_TERMS.map((t) => t.term);
    expect(new Set(terms).size).toBe(terms.length);
  });

  it('description/example/noteはすべて空でない', () => {
    for (const t of GLOSSARY_TERMS) {
      expect(t.description.length).toBeGreaterThan(0);
      expect(t.example.length).toBeGreaterThan(0);
      expect(t.note.length).toBeGreaterThan(0);
    }
  });

  it('getGlossaryTermは存在するidを返し、存在しないidはundefined', () => {
    expect(getGlossaryTerm('su-naishin')?.reading).toBe('すないしん');
    expect(getGlossaryTerm('nonexistent')).toBeUndefined();
  });
});

describe('shortTermLabel', () => {
  it('「（読み）」部分を除いた表記を返す', () => {
    const t = getGlossaryTerm('su-naishin')!;
    expect(shortTermLabel(t)).toBe('素内申');
  });
});

describe('buildGlossaryTermFaqs', () => {
  it('全用語で3件以上のFAQが生成され、質問文が重複しない', () => {
    for (const t of GLOSSARY_TERMS) {
      const faqs = buildGlossaryTermFaqs(t);
      expect(faqs.length).toBeGreaterThanOrEqual(3);
      expect(new Set(faqs.map((f) => f.question)).size).toBe(faqs.length);
      for (const f of faqs) {
        expect(f.answer.length).toBeGreaterThan(0);
      }
    }
  });

  it('relatedPrefecturesがある用語はFAQに都道府県差の質問を含む', () => {
    const withRelated = GLOSSARY_TERMS.find((t) => t.relatedPrefectures);
    expect(withRelated).toBeDefined();
    const faqs = buildGlossaryTermFaqs(withRelated!);
    expect(faqs.some((f) => f.question.includes('都道府県によって違います'))).toBe(true);
  });
});
