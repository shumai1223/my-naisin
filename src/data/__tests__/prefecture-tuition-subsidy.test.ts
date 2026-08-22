// Y-9(就学支援金・自治体上乗せDB)αバッチの不変条件テスト。
// interim-rate-bulletin-registry.test.tsと同型の設計思想: 未確認は無理に埋めない・
// 出典URLは.go.jp/.lg.jpの一次ソースのみ・statusとconfidence/sourceの整合性を機械検証する。

import { PREFECTURE_TUITION_SUBSIDY_REGISTRY, PrefectureTuitionSubsidyEntry } from '../prefecture-tuition-subsidy';

const ALPHA_PREFECTURES = ['tokyo', 'kanagawa', 'osaka', 'chiba', 'saitama', 'aichi', 'fukuoka', 'hokkaido', 'hyogo', 'shizuoka'];

describe('PREFECTURE_TUITION_SUBSIDY_REGISTRY（Y-9αバッチ・10県）', () => {
  it('αバッチ対象の10県すべてが登録されている', () => {
    const codes = PREFECTURE_TUITION_SUBSIDY_REGISTRY.map((e) => e.prefectureCode).sort();
    expect(codes).toEqual([...ALPHA_PREFECTURES].sort());
  });

  it('prefectureCodeに重複が無い', () => {
    const codes = PREFECTURE_TUITION_SUBSIDY_REGISTRY.map((e) => e.prefectureCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("status='confirmed'のエントリは必ずsourceを持ち、URLは.go.jpまたは.lg.jpドメイン（都道府県公式サイト）を指す", () => {
    const confirmed = PREFECTURE_TUITION_SUBSIDY_REGISTRY.filter((e) => e.status === 'confirmed');
    expect(confirmed.length).toBeGreaterThan(0);
    for (const e of confirmed) {
      expect(e.source).toBeDefined();
      expect(e.source!.url.startsWith('https://')).toBe(true);
      expect(e.source!.url).toMatch(/\.(go|lg)\.jp|pref\.[a-z]+\.jp|metro\.tokyo\.lg\.jp/);
      expect(e.source!.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.confidence).toBeDefined();
    }
  });

  it("status='unconfirmed'のエントリはsourceを持たず、programName/subsidyAmountNoteで断定しない（捏造ゼロ）", () => {
    const unconfirmed = PREFECTURE_TUITION_SUBSIDY_REGISTRY.filter((e) => e.status === 'unconfirmed');
    expect(unconfirmed.length).toBeGreaterThan(0);
    for (const e of unconfirmed) {
      expect(e.source).toBeUndefined();
      expect(e.programName).toBeUndefined();
      expect(e.subsidyAmountNote).toBeUndefined();
      expect(e.note.length).toBeGreaterThan(0);
    }
  });

  it('全エントリでnote・investigatedAtが空でない', () => {
    for (const e of PREFECTURE_TUITION_SUBSIDY_REGISTRY) {
      expect(e.note.length).toBeGreaterThan(0);
      expect(e.investigatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('type未確認のエントリを勝手にgrant/loanで断定していない（typeはconfirmedエントリのみ設定）', () => {
    for (const e of PREFECTURE_TUITION_SUBSIDY_REGISTRY) {
      if (e.status !== 'confirmed') {
        expect(e.type).toBeUndefined();
      }
    }
  });

  it('愛知県は金額表を公式ページから直接確認できたためsubsidyAmountNoteに具体的な円額を含む', () => {
    const aichi = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'aichi') as PrefectureTuitionSubsidyEntry;
    expect(aichi.status).toBe('confirmed');
    expect(aichi.subsidyAmountNote).toMatch(/\d{3},\d{3}円/);
  });

  it('兵庫県は制度の実在はconfirmedだが金額は一次ソース未直接確認のためconfidence:mediumに留めている', () => {
    const hyogo = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'hyogo') as PrefectureTuitionSubsidyEntry;
    expect(hyogo.status).toBe('confirmed');
    expect(hyogo.confidence).toBe('medium');
  });
});
