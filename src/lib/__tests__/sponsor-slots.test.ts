import { getSponsorForSlot } from '../sponsor-slots';

describe('getSponsorForSlot', () => {
  it('未契約の面はnull（描画0）', () => {
    expect(getSponsorForSlot('naishin')).toBeNull();
    expect(getSponsorForSlot('naishin', 'saitama')).toBeNull();
  });

  it('存在しない県コード指定でも面共通枠が無ければnull', () => {
    expect(getSponsorForSlot('does-not-exist', 'tokyo')).toBeNull();
  });
});
