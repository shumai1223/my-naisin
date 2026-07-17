/**
 * 冬窓（11/15-12/25）配信カレンダー事前組込＋コピーA/Bのテスト（C-1）。
 * 凍結後（11/15以降）に新規コピーを書く余地が無いため、今のうちに構造が揃っていることを固定する。
 */
import {
  WINTER_WINDOW_SCHEDULE,
  getWinterBroadcast,
  getWinterMessage,
  PARENT_EMAIL_COURSE,
  getParentCourseStep,
  REFERRAL_BLOCK,
  withReferralBlock,
  isReferralBlockPeakMonth,
  MONTHLY_CALENDAR,
} from '../broadcast-templates';

describe('WINTER_WINDOW_SCHEDULE（冬窓A/B事前組込・C-1）', () => {
  it('open/finalの2チェックポイント×A/Bの2バリアント=4件が揃っている', () => {
    expect(WINTER_WINDOW_SCHEDULE).toHaveLength(4);
    const keys = WINTER_WINDOW_SCHEDULE.map((w) => `${w.checkpoint}-${w.variant}`).sort();
    expect(keys).toEqual(['final-A', 'final-B', 'open-A', 'open-B']);
  });

  it('各エントリはstudent/parent双方の件名・本文・CTAを持つ', () => {
    for (const entry of WINTER_WINDOW_SCHEDULE) {
      for (const audience of ['student', 'parent'] as const) {
        const msg = entry[audience];
        expect(msg.subject.length).toBeGreaterThan(0);
        expect(msg.body.length).toBeGreaterThan(0);
        expect(msg.cta.path.startsWith('/')).toBe(true);
      }
    }
  });

  it('断定的な確定日付（YYYY年M月D日的な表現）を本文に含まない＝捏造ゼロ方針の維持', () => {
    for (const entry of WINTER_WINDOW_SCHEDULE) {
      for (const audience of ['student', 'parent'] as const) {
        expect(entry[audience].body).not.toMatch(/\d{1,2}月\d{1,2}日/);
      }
    }
  });

  it('同一チェックポイント内でA/Bの本文は異なる（純粋な重複でない）', () => {
    for (const checkpoint of ['open', 'final'] as const) {
      const a = getWinterBroadcast(checkpoint, 'A')!;
      const b = getWinterBroadcast(checkpoint, 'B')!;
      expect(a.student.body).not.toBe(b.student.body);
      expect(a.parent.body).not.toBe(b.parent.body);
    }
  });
});

describe('getWinterBroadcast / getWinterMessage', () => {
  it('存在する組み合わせを引ける', () => {
    expect(getWinterBroadcast('open', 'A')).toBeDefined();
    expect(getWinterMessage('final', 'B', 'parent')).toBeDefined();
  });

  it('未知の組み合わせは undefined（型はWinterCheckpoint/CopyVariantで絞られるが実行時ガードも確認）', () => {
    expect(getWinterBroadcast('mid' as never, 'A')).toBeUndefined();
  });

  it('audience違いでCTAのpathが異なる（生徒=行動ツール／保護者=換金面）', () => {
    const entry = getWinterBroadcast('final', 'A')!;
    expect(entry.student.cta.path).not.toBe(entry.parent.cta.path);
  });
});

describe('PARENT_EMAIL_COURSE（保護者メール講座5通・C-7）', () => {
  it('5ステップが揃い、内申仕組み→上げ方→費用→塾選び→窓案内の順でdayOffsetが単調増加する', () => {
    expect(PARENT_EMAIL_COURSE).toHaveLength(5);
    const steps = PARENT_EMAIL_COURSE.map((s) => s.step);
    expect(steps).toEqual([1, 2, 3, 4, 5]);
    const offsets = PARENT_EMAIL_COURSE.map((s) => s.dayOffset);
    expect(offsets).toEqual([...offsets].sort((a, b) => a - b));
    expect(new Set(offsets).size).toBe(offsets.length); // 重複日なし
  });

  it('各ステップは件名・本文・CTAを持つ', () => {
    for (const step of PARENT_EMAIL_COURSE) {
      expect(step.subject.length).toBeGreaterThan(0);
      expect(step.body.length).toBeGreaterThan(0);
      expect(step.cta.path.startsWith('/')).toBe(true);
    }
  });

  it('断定的な確定日付を本文に含まない＝捏造ゼロ方針の維持', () => {
    for (const step of PARENT_EMAIL_COURSE) {
      expect(step.body).not.toMatch(/\d{1,2}月\d{1,2}日/);
    }
  });

  it('getParentCourseStepでステップ番号から引ける・未知の番号はundefined', () => {
    expect(getParentCourseStep(1)?.subject).toContain('内申点');
    expect(getParentCourseStep(99)).toBeUndefined();
  });
});

describe('紹介導線ブロック（W-7・T-1紹介解放機構の配信面への標準搭載）', () => {
  it('student/parent両方にブロック文言がある', () => {
    expect(REFERRAL_BLOCK.student.length).toBeGreaterThan(0);
    expect(REFERRAL_BLOCK.parent.length).toBeGreaterThan(0);
  });

  it('withReferralBlockは元のメッセージを変更せず、本文末尾にブロックを付け足した新しいメッセージを返す', () => {
    const original = { subject: '件名', body: '本文', cta: { label: 'ラベル', path: '/' } };
    const withBlock = withReferralBlock(original, 'student');
    expect(original.body).toBe('本文'); // イミュータブル
    expect(withBlock.body).toBe('本文' + REFERRAL_BLOCK.student);
    expect(withBlock.subject).toBe(original.subject);
    expect(withBlock.cta).toEqual(original.cta);
  });

  it('ブロック文言に断定的な確定日付・¥表記を含まない＝捏造ゼロ方針の維持', () => {
    for (const text of Object.values(REFERRAL_BLOCK)) {
      expect(text).not.toMatch(/\d{1,2}月\d{1,2}日/);
      expect(text).not.toMatch(/¥/);
    }
  });

  it('isReferralBlockPeakMonthはMONTHLY_CALENDARのpriority==="peak"月(8/11/12/2)と一致する', () => {
    for (const entry of MONTHLY_CALENDAR) {
      expect(isReferralBlockPeakMonth(entry.month)).toBe(entry.priority === 'peak');
    }
  });
});
