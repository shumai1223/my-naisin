import { isPlaceholderSlot, isAdSlotEnabled } from '@/components/AdSlot';

describe('isPlaceholderSlot', () => {
  it('未差し替え（空/ゼロ列/数字以外）はプレースホルダ扱い', () => {
    expect(isPlaceholderSlot('')).toBe(true);
    expect(isPlaceholderSlot('   ')).toBe(true);
    expect(isPlaceholderSlot('0000000000')).toBe(true);
    expect(isPlaceholderSlot('0')).toBe(true);
    expect(isPlaceholderSlot('abc123')).toBe(true);
    expect(isPlaceholderSlot('12-34')).toBe(true);
  });

  it('実在しそうな数字IDはプレースホルダではない', () => {
    expect(isPlaceholderSlot('1234567890')).toBe(false);
    expect(isPlaceholderSlot('9876543210')).toBe(false);
  });
});

describe('isAdSlotEnabled（二重ガード：env と スロットID）', () => {
  it('env=1 かつ 実IDのときだけ描画する', () => {
    expect(isAdSlotEnabled('1234567890', '1')).toBe(true);
  });

  it('env未点火なら実IDでも描画しない（審査中は完全休眠）', () => {
    expect(isAdSlotEnabled('1234567890', undefined)).toBe(false);
    expect(isAdSlotEnabled('1234567890', '0')).toBe(false);
    expect(isAdSlotEnabled('1234567890', '')).toBe(false);
  });

  it('env=1 でもスロットIDが未差し替えなら描画しない（空広告事故の防止）', () => {
    expect(isAdSlotEnabled('0000000000', '1')).toBe(false);
    expect(isAdSlotEnabled('', '1')).toBe(false);
  });
});
