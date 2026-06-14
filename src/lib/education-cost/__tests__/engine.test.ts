import {
  annualLearningCost,
  formatYen,
  highSchoolRealCost,
  highSchoolSupportOver3Years,
  highSchoolTotal,
  juniorRemainingCost,
  jukuCost,
  shugakuShienAnnual,
  simulateEducationCost,
  toManYen,
} from '../engine';
import {
  HIGH_SCHOOL_INITIAL_COST,
  LEARNING_COST_ANNUAL,
  JUKU_RATES,
  SHUGAKU_SHIEN_TIERS,
} from '../data';

describe('education-cost data', () => {
  it('私立は同段階の公立より高い（学習費総額の単調性）', () => {
    (['shougakkou', 'chuugakkou', 'koukou'] as const).forEach((stage) => {
      expect(LEARNING_COST_ANNUAL[stage].private).toBeGreaterThan(LEARNING_COST_ANNUAL[stage].public);
    });
  });

  it('就学支援金の私立支援は年収が低い区分ほど手厚い（単調性）', () => {
    const u590 = SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === 'under590')!;
    const u910 = SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === 'under910')!;
    const o910 = SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === 'over910')!;
    expect(u590.privateAnnual).toBeGreaterThanOrEqual(u910.privateAnnual);
    expect(u910.privateAnnual).toBeGreaterThanOrEqual(o910.privateAnnual);
  });
});

describe('formatYen / toManYen', () => {
  it('カンマ区切りの円表記', () => {
    expect(formatYen(1234567)).toBe('¥1,234,567');
  });
  it('負値は0に丸める', () => {
    expect(formatYen(-100)).toBe('¥0');
  });
  it('万円表記', () => {
    expect(toManYen(1054444)).toBe('約105万円');
    expect(toManYen(512971)).toBe('約51万円');
  });
});

describe('annualLearningCost / highSchoolTotal', () => {
  it('段階×課程の年間費用を返す', () => {
    expect(annualLearningCost('koukou', 'public')).toBe(512971);
    expect(annualLearningCost('koukou', 'private')).toBe(1054444);
  });
  it('高校3年間＝年間×3＋準備費', () => {
    expect(highSchoolTotal('public')).toBe(512971 * 3 + HIGH_SCHOOL_INITIAL_COST.public);
    expect(highSchoolTotal('private')).toBe(1054444 * 3 + HIGH_SCHOOL_INITIAL_COST.private);
  });
});

describe('juniorRemainingCost', () => {
  it('中1は3年分、中3は1年分', () => {
    expect(juniorRemainingCost(1, 'public')).toBe(538799 * 3);
    expect(juniorRemainingCost(2, 'public')).toBe(538799 * 2);
    expect(juniorRemainingCost(3, 'public')).toBe(538799 * 1);
  });
});

describe('jukuCost', () => {
  it('塾なしは0', () => {
    expect(jukuCost(1, 'none')).toBe(0);
  });
  it('中3だけは1年分（係数1.3）', () => {
    const r = JUKU_RATES.kobetsu;
    expect(jukuCost(3, 'kobetsu')).toBe(Math.round(r.monthly * 1.3 * 12 + r.seasonal));
  });
  it('中1から通うほど総額が増える（単調性）', () => {
    expect(jukuCost(1, 'kobetsu')).toBeGreaterThan(jukuCost(2, 'kobetsu'));
    expect(jukuCost(2, 'kobetsu')).toBeGreaterThan(jukuCost(3, 'kobetsu'));
  });
});

describe('simulateEducationCost', () => {
  it('内訳の合計が total と一致する', () => {
    const r = simulateEducationCost({ currentGrade: 1, juniorCourse: 'public', highCourse: 'private', jukuType: 'kobetsu' });
    expect(r.total).toBe(r.juniorRemaining + r.highSchool + r.juku);
    expect(r.juniorRemainingYears).toBe(3);
  });
  it('私立高校は公立高校より総額が高い', () => {
    const base = { currentGrade: 2, juniorCourse: 'public', jukuType: 'none' } as const;
    const pub = simulateEducationCost({ ...base, highCourse: 'public' });
    const pri = simulateEducationCost({ ...base, highCourse: 'private' });
    expect(pri.total).toBeGreaterThan(pub.total);
  });
  it('塾ありは塾なしより総額が高い', () => {
    const base = { currentGrade: 1, juniorCourse: 'public', highCourse: 'public' } as const;
    expect(simulateEducationCost({ ...base, jukuType: 'kobetsu' }).total).toBeGreaterThan(
      simulateEducationCost({ ...base, jukuType: 'none' }).total,
    );
  });
});

describe('就学支援金', () => {
  it('公立は授業料相当が支援され、年収高区分は0', () => {
    expect(shugakuShienAnnual('public', 'under590')).toBe(118800);
    expect(shugakuShienAnnual('public', 'over910')).toBe(0);
  });
  it('私立の低所得区分は上限39.6万円', () => {
    expect(shugakuShienAnnual('private', 'under590')).toBe(396000);
  });
  it('3年分の軽減目安は年額×3', () => {
    expect(highSchoolSupportOver3Years('private', 'under590')).toBe(396000 * 3);
  });
});

describe('highSchoolRealCost（就学支援金を差し引いた実質負担）', () => {
  it('= 学習費総額 − 支援額（3年）', () => {
    expect(highSchoolRealCost('private', 'under590')).toBe(highSchoolTotal('private') - 396000 * 3);
    expect(highSchoolRealCost('public', 'under590')).toBe(highSchoolTotal('public') - 118800 * 3);
  });
  it('高所得区分（支援なし）は実質負担＝総額', () => {
    expect(highSchoolRealCost('private', 'over910')).toBe(highSchoolTotal('private'));
  });
  it('低所得区分では私立の実質負担が総額より大きく下がる', () => {
    expect(highSchoolRealCost('private', 'under590')).toBeLessThan(highSchoolTotal('private'));
  });
  it('実質負担は0未満にならない', () => {
    expect(highSchoolRealCost('public', 'under590')).toBeGreaterThanOrEqual(0);
  });
});
