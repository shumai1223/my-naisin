import { findTotalLineMatch, prefectureOfDeliveryFile, sumRows, verifyNewYear, type VerifyNewYearInput } from '../verify-new-year';

// 千葉県 令和8年度PDF(pdftotext -layout)の実際の合計行（2026-10-23の予行で取得）
const CHIBA_TEXT = [
  '県立全日制   合計   27,120   26,960   29,594   1.10',
  '市立全日制   合計    1,920    1,920    2,414   1.26',
  '公立全日制   合計   29,040   28,880   32,008   1.11',
  '県立定時制       合計    1,360    1,237      821   0.66',
].join('\n');

const rows = [
  { schoolName: 'A', department: '普通科', quota: 28880, finalApplicants: 32008, finalRate: 1.11 },
];

function baseInput(over: Partial<VerifyNewYearInput> = {}): VerifyNewYearInput {
  return {
    prefectureCode: 'chiba',
    rows,
    pdfText: CHIBA_TEXT,
    isRefused: (c) => c === 'wakayama',
    deliveryFileNames: [],
    deliveryYearPrefix: 'R9',
    packSalesApproved: new Set(['chiba', 'fukuoka']),
    filesWithNewYearLabel: [],
    prefecturesWithNewYearData: new Set(),
    rateConventionIssue: null,
    ...over,
  };
}

describe('findTotalLineMatch', () => {
  it('機械集計の2数値が同じ「合計」行に現れれば一致する（カンマ区切りを読む）', () => {
    const m = findTotalLineMatch(CHIBA_TEXT, { quota: 28880, finalApplicants: 32008 });
    expect(m?.lineNo).toBe(3);
    expect(m?.line).toContain('公立全日制 合計');
  });

  it('片方の数値しか無い・別々の行にある場合は一致しない', () => {
    expect(findTotalLineMatch(CHIBA_TEXT, { quota: 28880, finalApplicants: 29594 })).toBeNull();
    expect(findTotalLineMatch(CHIBA_TEXT, { quota: 28881, finalApplicants: 32008 })).toBeNull();
  });

  it('「合計」「総計」を含まない行の偶然の一致は拾わない', () => {
    expect(findTotalLineMatch('千葉   普通科   240   331   1.38\n', { quota: 240, finalApplicants: 331 })).toBeNull();
  });

  it('倍率の小数部分を整数として拾わない', () => {
    expect(findTotalLineMatch('公立 合計 100 110 1.10', { quota: 100, finalApplicants: 10 })).toBeNull();
  });

  it('全角数字・全角スペースの合計行も読む', () => {
    const m = findTotalLineMatch('全日制　合計　１，２００　１，３４５', { quota: 1200, finalApplicants: 1345 });
    expect(m).not.toBeNull();
  });
});

describe('verifyNewYear', () => {
  it('全て満たせば ok', () => {
    const r = verifyNewYear(baseInput());
    expect(r.ok).toBe(true);
    expect(r.checks.map((c) => c.name).sort()).toEqual(['pack-license', 'rate-convention', 'refused', 'title-year', 'total-line']);
  });

  it('合計行に一致しなければ落ちる（数字を合わせにいかない）', () => {
    const r = verifyNewYear(baseInput({ rows: [{ ...rows[0], finalApplicants: 32009 }] }));
    expect(r.ok).toBe(false);
    expect(r.checks.find((c) => c.name === 'total-line')?.ok).toBe(false);
  });

  it('0件は落ちる', () => {
    expect(verifyNewYear(baseInput({ rows: [] })).ok).toBe(false);
  });

  it('掲載を断られた県は落ちる', () => {
    const r = verifyNewYear(baseInput({ prefectureCode: 'wakayama' }));
    expect(r.checks.find((c) => c.name === 'refused')?.ok).toBe(false);
    expect(r.ok).toBe(false);
  });

  it('許諾のない県の納品ファイルがあれば落ちる／許諾済み県だけなら通る', () => {
    const bad = verifyNewYear(baseInput({ deliveryFileNames: ['R9-chiba-kakutei-2027-02-13.csv', 'R9-tokyo-kakutei-2027-02-13.csv'] }));
    expect(bad.checks.find((c) => c.name === 'pack-license')?.ok).toBe(false);
    expect(bad.checks.find((c) => c.name === 'pack-license')?.detail).toContain('tokyo');
    const good = verifyNewYear(baseInput({ deliveryFileNames: ['R9-chiba-kakutei-2027-02-13.csv', 'R8-tokyo-kakutei-2026-02-13.csv'] }));
    expect(good.checks.find((c) => c.name === 'pack-license')?.ok).toBe(true);
  });

  it('許諾済みでも掲載拒否県の納品ファイルがあれば落ちる', () => {
    const r = verifyNewYear(baseInput({ packSalesApproved: new Set(['wakayama']), deliveryFileNames: ['R9-wakayama-sokuho-2027-02-13.csv'] }));
    expect(r.checks.find((c) => c.name === 'pack-license')?.ok).toBe(false);
  });

  it('「令和9年度」を書いた公開面があり、その県が新年度データ未登録なら落ちる', () => {
    const r = verifyNewYear(baseInput({ filesWithNewYearLabel: ['src/app/pref/[code]/page.tsx'] }));
    expect(r.checks.find((c) => c.name === 'title-year')?.ok).toBe(false);
    const ok = verifyNewYear(baseInput({ filesWithNewYearLabel: ['x'], prefecturesWithNewYearData: new Set(['chiba']) }));
    expect(ok.checks.find((c) => c.name === 'title-year')?.ok).toBe(true);
  });

  it('finalRateが3方式で説明できなければ落ちる', () => {
    const r = verifyNewYear(baseInput({ rateConventionIssue: '1件のfinalRateが既知の3方式のいずれとも一致しない' }));
    expect(r.ok).toBe(false);
  });

  it('前年から1割超の件数変動は警告のみ（NGにしない）', () => {
    const r = verifyNewYear(baseInput({ previousRecordCount: 188 }));
    expect(r.ok).toBe(true);
    expect(r.warnings).toHaveLength(1);
    expect(verifyNewYear(baseInput({ previousRecordCount: 1 })).warnings).toHaveLength(0);
  });
});

describe('補助関数', () => {
  it('sumRows', () => {
    expect(sumRows([{ quota: 1, finalApplicants: 2 }, { quota: 3, finalApplicants: 4 }])).toEqual({ quota: 4, finalApplicants: 6 });
  });
  it('prefectureOfDeliveryFile', () => {
    expect(prefectureOfDeliveryFile('R9-chiba-kakutei-2027-02-13.csv', 'R9')).toBe('chiba');
    expect(prefectureOfDeliveryFile('R9-fukuoka-sokuho-2027-02-13.scope.txt', 'R9')).toBe('fukuoka');
    expect(prefectureOfDeliveryFile('R8-chiba-kakutei-2026-02-13.csv', 'R9')).toBeNull();
    expect(prefectureOfDeliveryFile('DELIVERY-LOG.md', 'R9')).toBeNull();
  });
});
