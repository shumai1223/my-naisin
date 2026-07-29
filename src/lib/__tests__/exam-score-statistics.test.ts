import { isPlausibleSubjectSum, type ExamScoreYearEntry } from '@/lib/exam-score-statistics';
import { EXAM_SCORE_STATISTICS_KOCHI } from '@/data/exam-score-statistics/kochi';
import { EXAM_SCORE_STATISTICS_SAITAMA } from '@/data/exam-score-statistics/saitama';
import { EXAM_SCORE_STATISTICS_CHIBA } from '@/data/exam-score-statistics/chiba';
import { EXAM_SCORE_STATISTICS_TOKYO } from '@/data/exam-score-statistics/tokyo';
import { EXAM_SCORE_STATISTICS_NARA } from '@/data/exam-score-statistics/nara';
import { EXAM_SCORE_STATISTICS_HYOGO } from '@/data/exam-score-statistics/hyogo';
import { EXAM_SCORE_STATISTICS_BY_PREFECTURE, EXAM_SCORE_STATISTICS_FILES } from '@/data/exam-score-statistics';

describe('isPlausibleSubjectSum', () => {
  const base: ExamScoreYearEntry = {
    fiscalYearLabel: '令和6年度',
    averageType: 'test-takers',
    subjects: [
      { subject: '国語', averageScore: 20, maxScore: 50 },
      { subject: '数学', averageScore: 20, maxScore: 50 },
    ],
    totalAverage: 40,
    totalMaxScore: 100,
  };

  it('教科合計とtotalAverageが完全一致すればtrue', () => {
    expect(isPlausibleSubjectSum(base)).toBe(true);
  });

  it('丸め誤差程度の差(0.2点)は許容してtrue', () => {
    expect(isPlausibleSubjectSum({ ...base, totalAverage: 40.2 })).toBe(true);
  });

  it('明らかにかけ離れた差(10点)はfalse', () => {
    expect(isPlausibleSubjectSum({ ...base, totalAverage: 50 })).toBe(false);
  });

  it('totalAverageが未設定(一次ソースが合計を明記しない場合)は常にtrue', () => {
    const { totalAverage, totalMaxScore, ...rest } = base;
    expect(isPlausibleSubjectSum(rest)).toBe(true);
  });

  it('教科別内訳が空でtotalAverageのみ公表されている場合もtrue(奈良県の合格者平均のパターン)', () => {
    expect(isPlausibleSubjectSum({ ...base, subjects: [], totalAverage: 160.4 })).toBe(true);
  });
});

describe('EXAM_SCORE_STATISTICS_KOCHI(パイロット実データ)', () => {
  it('5年度分(令和2〜6年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_KOCHI.years).toHaveLength(5);
  });

  it('全年度でaverageTypeがtest-takers(全受検者平均)に統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_KOCHI.years) {
      expect(year.averageType).toBe('test-takers');
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_KOCHI.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('全年度で5教科(国語・社会・数学・理科・英語)が揃っている', () => {
    for (const year of EXAM_SCORE_STATISTICS_KOCHI.years) {
      expect(year.subjects.map((s) => s.subject).sort()).toEqual(
        ['国語', '社会', '数学', '理科', '英語'].sort()
      );
    }
  });
});

describe('EXAM_SCORE_STATISTICS_SAITAMA(パイロット実データ)', () => {
  it('5年度分(平成30〜令和4年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_SAITAMA.years).toHaveLength(5);
  });

  it('各教科は100点満点(高知県の50点満点と異なる)', () => {
    for (const year of EXAM_SCORE_STATISTICS_SAITAMA.years) {
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('一次ソースが合計点を明記していないためtotalAverageは未設定', () => {
    for (const year of EXAM_SCORE_STATISTICS_SAITAMA.years) {
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_CHIBA(パイロット実データ)', () => {
  it('4年度分(令和2年度前期・後期・令和3年度・令和4年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_CHIBA.years).toHaveLength(4);
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する（内部矛盾のあった追検査行は除外済み）', () => {
    for (const year of EXAM_SCORE_STATISTICS_CHIBA.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_TOKYO(パイロット実データ)', () => {
  it('3年度分(令和6〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_TOKYO.years).toHaveLength(3);
  });

  it('全年度で5教科が100点満点・totalAverageは未設定(合計を明記しない一次ソースのため)', () => {
    for (const year of EXAM_SCORE_STATISTICS_TOKYO.years) {
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
      expect(year.totalAverage).toBeUndefined();
    }
  });
});

describe('EXAM_SCORE_STATISTICS_NARA(パイロット実データ)', () => {
  it('3年度分×2区分(全受検者/合格者)=6エントリが収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_NARA.years).toHaveLength(6);
  });

  it('全エントリで教科別合計とtotalAverageが妥当な範囲で一致する(合格者側はsubjects空でも自動true)', () => {
    for (const year of EXAM_SCORE_STATISTICS_NARA.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('test-takersは5教科の内訳を持ち、passersは内訳を持たない(合計のみ公表)', () => {
    for (const year of EXAM_SCORE_STATISTICS_NARA.years) {
      if (year.averageType === 'test-takers') {
        expect(year.subjects).toHaveLength(5);
      } else {
        expect(year.subjects).toHaveLength(0);
        expect(year.totalAverage).toBeDefined();
      }
    }
  });
});

describe('EXAM_SCORE_STATISTICS_HYOGO(パイロット実データ)', () => {
  it('2年度分(令和6〜7年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_HYOGO.years).toHaveLength(2);
  });

  it('教科別内訳は公表されていないためsubjects=[]・totalAverageのみ記録', () => {
    for (const year of EXAM_SCORE_STATISTICS_HYOGO.years) {
      expect(year.subjects).toHaveLength(0);
      expect(year.totalAverage).toBeDefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('exam-score-statistics index', () => {
  it('kochi/saitama/chiba/tokyo/nara/hyogoの6県が集約されている', () => {
    expect(Object.keys(EXAM_SCORE_STATISTICS_BY_PREFECTURE).sort()).toEqual([
      'chiba',
      'hyogo',
      'kochi',
      'nara',
      'saitama',
      'tokyo',
    ]);
    expect(EXAM_SCORE_STATISTICS_FILES).toHaveLength(6);
  });
});
