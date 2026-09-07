import { validateInterimSubmission, type InterimRateRecord } from '../interim-rate';
import type { CompetitionRateRecord } from '../competition-rate';

const confirmed: CompetitionRateRecord[] = [
  { schoolName: '日比谷', department: '普通科', quota: 280, finalApplicants: 403, finalRate: 1.44 },
  { schoolName: '戸山', department: '普通科', quota: 316, finalApplicants: 496, finalRate: 1.57 },
  { schoolName: '駒場', department: '普通科', quota: 316, finalApplicants: 641, finalRate: 2.03 },
];

describe('validateInterimSubmission', () => {
  it('学校×学科が全一致・quota一致・出願者数が変更幅内なら合格', () => {
    const interim: InterimRateRecord[] = [
      { schoolName: '日比谷', department: '普通科', quota: 280, interimApplicants: 390, interimRate: 1.39 },
      { schoolName: '戸山', department: '普通科', quota: 316, interimApplicants: 480, interimRate: 1.52 },
      { schoolName: '駒場', department: '普通科', quota: 316, interimApplicants: 630, interimRate: 1.99 },
    ];
    const result = validateInterimSubmission(interim, confirmed, 20);
    expect(result.matchRatio).toBe(1);
    expect(result.issues).toEqual([]);
    expect(result.passed).toBe(true);
  });

  it('倍率非公表の県（熊本型）はinterimRate=nullのままでも構造照合だけなら合格できる', () => {
    const interim: InterimRateRecord[] = [
      { schoolName: '日比谷', department: '普通科', quota: 280, interimApplicants: 390, interimRate: null },
    ];
    const result = validateInterimSubmission(interim, confirmed, 20);
    expect(result.passed).toBe(true);
  });

  it('確定に存在しない学校×学科はmissing-in-confirmedとして記録され不合格になる', () => {
    const interim: InterimRateRecord[] = [
      { schoolName: '日比谷', department: '普通科', quota: 280, interimApplicants: 390, interimRate: 1.39 },
      { schoolName: '架空高校', department: '普通科', quota: 200, interimApplicants: 100, interimRate: 0.5 },
    ];
    const result = validateInterimSubmission(interim, confirmed, 20);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ schoolName: '架空高校', kind: 'missing-in-confirmed' })
    );
    expect(result.passed).toBe(false);
  });

  it('quotaが確定と異なる場合はquota-mismatchとして記録される（募集人員は志願変更で変わらない前提）', () => {
    const interim: InterimRateRecord[] = [
      { schoolName: '日比谷', department: '普通科', quota: 275, interimApplicants: 390, interimRate: 1.42 },
    ];
    const result = validateInterimSubmission(interim, confirmed, 20);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ schoolName: '日比谷', kind: 'quota-mismatch' })
    );
    expect(result.passed).toBe(false);
  });

  it('速報出願者数が確定+変更幅を超えるとapplicants-exceeds-marginとして記録される', () => {
    const interim: InterimRateRecord[] = [
      // 確定403人+変更幅20人=423人の上限を超える450人
      { schoolName: '日比谷', department: '普通科', quota: 280, interimApplicants: 450, interimRate: 1.61 },
    ];
    const result = validateInterimSubmission(interim, confirmed, 20);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ schoolName: '日比谷', kind: 'applicants-exceeds-margin' })
    );
    expect(result.passed).toBe(false);
  });

  it('学校×学科の一致率が95%未満なら不合格（例: 21件中1件しか確定に無い）', () => {
    const manyInterim: InterimRateRecord[] = Array.from({ length: 20 }, (_, i) => ({
      schoolName: `未知校${i}`,
      department: '普通科',
      quota: 100,
      interimApplicants: 90,
      interimRate: 0.9,
    }));
    manyInterim.push({ schoolName: '日比谷', department: '普通科', quota: 280, interimApplicants: 390, interimRate: 1.39 });
    const result = validateInterimSubmission(manyInterim, confirmed, 20);
    expect(result.matchRatio).toBeLessThan(0.95);
    expect(result.passed).toBe(false);
  });

  it('interimRecordsが空配列ならmatchRatio=0で不合格', () => {
    const result = validateInterimSubmission([], confirmed, 20);
    expect(result.matchRatio).toBe(0);
    expect(result.passed).toBe(false);
  });
});
