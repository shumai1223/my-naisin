/**
 * 冬窓（11/15-12/25）配信カレンダー事前組込＋コピーA/Bのテスト（C-1）。
 * 凍結後（11/15以降）に新規コピーを書く余地が無いため、今のうちに構造が揃っていることを固定する。
 */
import { WINTER_WINDOW_SCHEDULE, getWinterBroadcast, getWinterMessage } from '../broadcast-templates';

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
