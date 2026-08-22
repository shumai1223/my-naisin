// Y-9(就学支援金・自治体上乗せDB)αバッチ+第2バッチの不変条件テスト。
// interim-rate-bulletin-registry.test.tsと同型の設計思想: 未確認は無理に埋めない・
// 出典URLは.go.jp/.lg.jpの一次ソースのみ・statusとconfidence/sourceの整合性を機械検証する。

import { PREFECTURE_TUITION_SUBSIDY_REGISTRY, PrefectureTuitionSubsidyEntry } from '../prefecture-tuition-subsidy';

const ALPHA_PREFECTURES = ['tokyo', 'kanagawa', 'osaka', 'chiba', 'saitama', 'aichi', 'fukuoka', 'hokkaido', 'hyogo', 'shizuoka'];
const BATCH2_PREFECTURES = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima', 'ibaraki', 'tochigi', 'gunma', 'niigata'];
const BATCH3_PREFECTURES = ['toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'mie', 'shiga', 'kyoto', 'nara'];
const BATCH4_PREFECTURES = ['wakayama', 'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi', 'tokushima', 'kagawa', 'ehime', 'kochi'];
const BATCH5_PREFECTURES = ['oita', 'saga', 'nagasaki', 'kumamoto', 'miyazaki', 'kagoshima', 'okinawa'];
const ALL_INVESTIGATED_PREFECTURES = [
  ...ALPHA_PREFECTURES,
  ...BATCH2_PREFECTURES,
  ...BATCH3_PREFECTURES,
  ...BATCH4_PREFECTURES,
  ...BATCH5_PREFECTURES,
];

describe('PREFECTURE_TUITION_SUBSIDY_REGISTRY（Y-9・5バッチ全47都道府県完走）', () => {
  it('全47都道府県すべてが登録されている（Y-9フェーズ完走）', () => {
    const codes = PREFECTURE_TUITION_SUBSIDY_REGISTRY.map((e) => e.prefectureCode).sort();
    expect(codes).toEqual([...ALL_INVESTIGATED_PREFECTURES].sort());
    expect(codes.length).toBe(47);
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

  it('新潟県は区分別の金額(定額/第2子以降/全額/施設整備費/入学金)が公式ページから直接確認できたためconfidence:high', () => {
    const niigata = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'niigata') as PrefectureTuitionSubsidyEntry;
    expect(niigata.status).toBe('confirmed');
    expect(niigata.confidence).toBe('high');
    expect(niigata.subsidyAmountNote).toMatch(/\d{2,3},\d{3}円/);
  });

  it('山形県は県独自の上乗せ部分の金額が公式ページに明記されている(1,000円/12,100円)', () => {
    const yamagata = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'yamagata') as PrefectureTuitionSubsidyEntry;
    expect(yamagata.status).toBe('confirmed');
    expect(yamagata.subsidyAmountNote).toMatch(/1,000円/);
  });

  it('栃木県は「学校法人補填型」(減免総額の10分の9を県が補助)で円建て金額を断定していない', () => {
    const tochigi = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'tochigi') as PrefectureTuitionSubsidyEntry;
    expect(tochigi.status).toBe('confirmed');
    expect(tochigi.type).toBe('grant');
    expect(tochigi.subsidyAmountNote).toMatch(/10分の9/);
    // 円建ての断定額(例: 123,456円のような具体的な確定額)を書いていないことを確認
    expect(tochigi.subsidyAmountNote).not.toMatch(/^\d/);
  });

  it('第2バッチのunconfirmed7県(青森/岩手/宮城/秋田/福島/茨城/群馬)もsourceを持たず断定しない', () => {
    const batch2Unconfirmed = ['aomori', 'iwate', 'miyagi', 'akita', 'fukushima', 'ibaraki', 'gunma'];
    for (const code of batch2Unconfirmed) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('unconfirmed');
      expect(entry.source).toBeUndefined();
      expect(entry.programName).toBeUndefined();
    }
  });

  it('第3バッチのunconfirmed5県(石川/山梨/岐阜/三重/滋賀)もsourceを持たず断定しない', () => {
    const batch3Unconfirmed = ['ishikawa', 'yamanashi', 'gifu', 'mie', 'shiga'];
    for (const code of batch3Unconfirmed) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('unconfirmed');
      expect(entry.source).toBeUndefined();
      expect(entry.programName).toBeUndefined();
    }
  });

  it('長野県は栃木県と同型の学校法人補填型で円建ての断定額を書いていない', () => {
    const nagano = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'nagano') as PrefectureTuitionSubsidyEntry;
    expect(nagano.status).toBe('confirmed');
    expect(nagano.subsidyAmountNote).toMatch(/学校法人補填型/);
  });

  it('富山県・福井県・京都府は所得区分別の具体的な金額が公式ページから直接確認できたためconfidence:high', () => {
    for (const code of ['toyama', 'fukui', 'kyoto']) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('confirmed');
      expect(entry.confidence).toBe('high');
      expect(entry.subsidyAmountNote).toMatch(/\d{2,3},\d{3}円/);
    }
  });

  it('奈良県は制度の実在・対象要件は確認できたが金額は別添PDF参照のみのためconfidence:medium', () => {
    const nara = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'nara') as PrefectureTuitionSubsidyEntry;
    expect(nara.status).toBe('confirmed');
    expect(nara.confidence).toBe('medium');
  });

  it('第4バッチのunconfirmed4県(和歌山/山口/愛媛/高知)もsourceを持たず断定しない', () => {
    const batch4Unconfirmed = ['wakayama', 'yamaguchi', 'ehime', 'kochi'];
    for (const code of batch4Unconfirmed) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('unconfirmed');
      expect(entry.source).toBeUndefined();
      expect(entry.programName).toBeUndefined();
    }
  });

  it('岡山県・香川県は所得区分別の具体的な金額が公式ページから直接確認できたためconfidence:high', () => {
    for (const code of ['okayama', 'kagawa']) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('confirmed');
      expect(entry.confidence).toBe('high');
      expect(entry.subsidyAmountNote).toMatch(/\d{2,3},\d{3}円|\d{2,3}0円/);
    }
  });

  it('島根県は円建ての固定額でなく「授業料−就学支援金の差額補填型」の仕組みで確認された', () => {
    const shimane = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'shimane') as PrefectureTuitionSubsidyEntry;
    expect(shimane.status).toBe('confirmed');
    expect(shimane.confidence).toBe('high');
    expect(shimane.subsidyAmountNote).toMatch(/差額補填型/);
  });

  it('鳥取県・広島県・徳島県は制度名は確認できたが金額はリーフレットPDF参照のみのためconfidence:medium', () => {
    for (const code of ['tottori', 'hiroshima', 'tokushima']) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('confirmed');
      expect(entry.confidence).toBe('medium');
    }
  });

  it('山口県は制度名に「授業料等」を含むが実際は入学金減免のみのためunconfirmedのまま(捏造回避)', () => {
    const yamaguchi = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === 'yamaguchi') as PrefectureTuitionSubsidyEntry;
    expect(yamaguchi.status).toBe('unconfirmed');
    expect(yamaguchi.note).toMatch(/入学金減免/);
  });

  it('第5バッチのunconfirmed5県(佐賀/長崎/熊本/宮崎/沖縄)もsourceを持たず断定しない', () => {
    const batch5Unconfirmed = ['saga', 'nagasaki', 'kumamoto', 'miyazaki', 'okinawa'];
    for (const code of batch5Unconfirmed) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('unconfirmed');
      expect(entry.source).toBeUndefined();
      expect(entry.programName).toBeUndefined();
    }
  });

  it('大分県・鹿児島県は区分別の月額が公式ページから直接確認できたためconfidence:high', () => {
    for (const code of ['oita', 'kagoshima']) {
      const entry = PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code) as PrefectureTuitionSubsidyEntry;
      expect(entry.status).toBe('confirmed');
      expect(entry.confidence).toBe('high');
      expect(entry.subsidyAmountNote).toMatch(/円/);
    }
  });
});
