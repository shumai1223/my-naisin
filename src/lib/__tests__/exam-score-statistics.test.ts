import { isPlausibleSubjectSum, type ExamScoreYearEntry } from '@/lib/exam-score-statistics';
import { EXAM_SCORE_STATISTICS_KOCHI } from '@/data/exam-score-statistics/kochi';
import { EXAM_SCORE_STATISTICS_SAITAMA } from '@/data/exam-score-statistics/saitama';
import { EXAM_SCORE_STATISTICS_CHIBA } from '@/data/exam-score-statistics/chiba';
import { EXAM_SCORE_STATISTICS_TOKYO } from '@/data/exam-score-statistics/tokyo';
import { EXAM_SCORE_STATISTICS_NARA } from '@/data/exam-score-statistics/nara';
import { EXAM_SCORE_STATISTICS_HYOGO } from '@/data/exam-score-statistics/hyogo';
import { EXAM_SCORE_STATISTICS_NIIGATA } from '@/data/exam-score-statistics/niigata';
import { EXAM_SCORE_STATISTICS_GUNMA } from '@/data/exam-score-statistics/gunma';
import { EXAM_SCORE_STATISTICS_MIYAGI } from '@/data/exam-score-statistics/miyagi';
import { EXAM_SCORE_STATISTICS_HOKKAIDO } from '@/data/exam-score-statistics/hokkaido';
import { EXAM_SCORE_STATISTICS_FUKUSHIMA } from '@/data/exam-score-statistics/fukushima';
import { EXAM_SCORE_STATISTICS_AOMORI } from '@/data/exam-score-statistics/aomori';
import { EXAM_SCORE_STATISTICS_IWATE } from '@/data/exam-score-statistics/iwate';
import { EXAM_SCORE_STATISTICS_AKITA } from '@/data/exam-score-statistics/akita';
import { EXAM_SCORE_STATISTICS_NAGANO } from '@/data/exam-score-statistics/nagano';
import { EXAM_SCORE_STATISTICS_SHIZUOKA } from '@/data/exam-score-statistics/shizuoka';
import { EXAM_SCORE_STATISTICS_FUKUOKA } from '@/data/exam-score-statistics/fukuoka';
import { EXAM_SCORE_STATISTICS_HIROSHIMA } from '@/data/exam-score-statistics/hiroshima';
import { EXAM_SCORE_STATISTICS_AICHI } from '@/data/exam-score-statistics/aichi';
import { EXAM_SCORE_STATISTICS_KANAGAWA } from '@/data/exam-score-statistics/kanagawa';
import { EXAM_SCORE_STATISTICS_IBARAKI } from '@/data/exam-score-statistics/ibaraki';
import { EXAM_SCORE_STATISTICS_GIFU } from '@/data/exam-score-statistics/gifu';
import { EXAM_SCORE_STATISTICS_MIE } from '@/data/exam-score-statistics/mie';
import { EXAM_SCORE_STATISTICS_WAKAYAMA } from '@/data/exam-score-statistics/wakayama';
import { EXAM_SCORE_STATISTICS_SHIGA } from '@/data/exam-score-statistics/shiga';
import { EXAM_SCORE_STATISTICS_OKAYAMA } from '@/data/exam-score-statistics/okayama';
import { EXAM_SCORE_STATISTICS_YAMAGUCHI } from '@/data/exam-score-statistics/yamaguchi';
import { EXAM_SCORE_STATISTICS_KAGAWA } from '@/data/exam-score-statistics/kagawa';
import { EXAM_SCORE_STATISTICS_EHIME } from '@/data/exam-score-statistics/ehime';
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

describe('EXAM_SCORE_STATISTICS_NIIGATA(パイロット実データ)', () => {
  it('5年度分(令和4〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_NIIGATA.years).toHaveLength(5);
  });

  it('各教科100点満点・totalAverageは未設定(原資料の合計値は合計でなく平均のため意図的に格納しない)', () => {
    for (const year of EXAM_SCORE_STATISTICS_NIIGATA.years) {
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_GUNMA(パイロット実データ・既知の構造的不一致あり)', () => {
  it('2年度分×2区分(全受検者/合格者)=4エントリが収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_GUNMA.years).toHaveLength(4);
  });

  it('test-takersは5教科の内訳を持ち、傾斜配点の影響でtotalAverageとの単純合計は一致しない(既知の構造的差異)', () => {
    const testTakerYears = EXAM_SCORE_STATISTICS_GUNMA.years.filter((y) => y.averageType === 'test-takers');
    expect(testTakerYears).toHaveLength(2);
    for (const year of testTakerYears) {
      expect(year.subjects).toHaveLength(5);
      // 傾斜配点の影響で意図的にfalseになる(バグではない・ファイル冒頭コメント参照)
      expect(isPlausibleSubjectSum(year)).toBe(false);
    }
  });

  it('passersはsubjects=[]で合計のみ記録', () => {
    const passerYears = EXAM_SCORE_STATISTICS_GUNMA.years.filter((y) => y.averageType === 'passers');
    expect(passerYears).toHaveLength(2);
    for (const year of passerYears) {
      expect(year.subjects).toHaveLength(0);
      expect(year.totalAverage).toBeDefined();
    }
  });
});

describe('EXAM_SCORE_STATISTICS_MIYAGI(パイロット実データ・年度別に出典が異なる)', () => {
  it('5年度分(令和4〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_MIYAGI.years).toHaveLength(5);
  });

  it('各教科100点満点・5教科の内訳を持つ', () => {
    for (const year of EXAM_SCORE_STATISTICS_MIYAGI.years) {
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_MIYAGI.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('年度ごとに個別のsourceを持つ(年度別ページが別URLのため)', () => {
    for (const year of EXAM_SCORE_STATISTICS_MIYAGI.years) {
      expect(year.source?.url).toBeTruthy();
    }
  });
});

describe('EXAM_SCORE_STATISTICS_HOKKAIDO(パイロット実データ・2つの公式PDFで年度が重複検証済み)', () => {
  it('3年度分×2区分(全受検者/合格者)=6エントリが収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_HOKKAIDO.years).toHaveLength(6);
  });

  it('各教科100点満点・5教科の内訳を持つ', () => {
    for (const year of EXAM_SCORE_STATISTICS_HOKKAIDO.years) {
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('全エントリで教科別合計とtotalAverageが妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_HOKKAIDO.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和7年度分は2つの公式PDF双方に現れる年度だが、数値が完全一致する', () => {
    const r7Years = EXAM_SCORE_STATISTICS_HOKKAIDO.years.filter((y) => y.fiscalYearLabel === '令和7年度');
    expect(r7Years).toHaveLength(2);
  });
});

describe('EXAM_SCORE_STATISTICS_FUKUSHIMA(パイロット実データ・前期選抜合格者平均)', () => {
  it('6年度分(令和3〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_FUKUSHIMA.years).toHaveLength(6);
  });

  it('各教科50点満点(福島は250点満点体系)・全年度passersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_FUKUSHIMA.years) {
      expect(year.averageType).toBe('passers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(50);
      expect(year.totalMaxScore).toBe(250);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_FUKUSHIMA.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_AOMORI(パイロット実データ・複数記事間クロス検証済み)', () => {
  it('3年度分(令和6〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_AOMORI.years).toHaveLength(3);
  });

  it('各教科100点満点・5教科の内訳を持ちtest-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_AOMORI.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_AOMORI.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_IWATE(パイロット実データ・令和8年度は一次PDF直読み)', () => {
  it('4エントリ(令和6年度×test-takers、令和7年度×test-takers、令和8年度×test-takers/passers)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_IWATE.years).toHaveLength(4);
  });

  it('各教科100点満点・5教科の内訳を持つ', () => {
    for (const year of EXAM_SCORE_STATISTICS_IWATE.years) {
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('令和6年度分は一次資料が合計を明記していないためtotalAverageは未設定', () => {
    const r6 = EXAM_SCORE_STATISTICS_IWATE.years.find((y) => y.fiscalYearLabel === '令和6年度');
    expect(r6?.totalAverage).toBeUndefined();
  });

  it('全エントリで教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_IWATE.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_AKITA(パイロット実データ・8%抽出調査)', () => {
  it('3年度分(令和6〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_AKITA.years).toHaveLength(3);
  });

  it('各教科100点満点・5教科の内訳を持ちtest-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_AKITA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと完全一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_AKITA.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_NAGANO(パイロット実データ・2つの公式PDFで令和6年度が重複検証済み)', () => {
  it('3年度分(令和5〜7年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_NAGANO.years).toHaveLength(3);
  });

  it('各教科100点満点・5教科の内訳を持ちtest-takersで統一されている(前期選抜は構造が異なるため収録対象外)', () => {
    for (const year of EXAM_SCORE_STATISTICS_NAGANO.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('一次ソースが5教科合計を明記していないためtotalAverageは未設定', () => {
    for (const year of EXAM_SCORE_STATISTICS_NAGANO.years) {
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_SHIZUOKA(パイロット実データ・3つの公式PDFで令和6・7年度が重複検証済み)', () => {
  it('4年度分(令和5〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_SHIZUOKA.years).toHaveLength(4);
  });

  it('各教科50点満点(5教科合計250点満点体系)・test-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_SHIZUOKA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(50);
    }
  });

  it('一次ソースが5教科合計を明記していないためtotalAverageは未設定', () => {
    for (const year of EXAM_SCORE_STATISTICS_SHIZUOKA.years) {
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和6・7年度分はそれぞれ2つの公式PDFに現れる年度だが、同一のtestTakerCountで一致する', () => {
    const r6 = EXAM_SCORE_STATISTICS_SHIZUOKA.years.find((y) => y.fiscalYearLabel === '令和6年度');
    const r7 = EXAM_SCORE_STATISTICS_SHIZUOKA.years.find((y) => y.fiscalYearLabel === '令和7年度');
    expect(r6?.testTakerCount).toBe(18605);
    expect(r7?.testTakerCount).toBe(18104);
  });
});

describe('EXAM_SCORE_STATISTICS_FUKUOKA(パイロット実データ・60点満点の特有配点・令和7年度は内部矛盾検知で見送り)', () => {
  it('2年度分(令和5〜6年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_FUKUOKA.years).toHaveLength(2);
  });

  it('各教科60点満点(他県の100点満点/50点満点と異なる特有の配点)・test-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_FUKUOKA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(60);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する(令和6年度はtotalAverage未設定)', () => {
    for (const year of EXAM_SCORE_STATISTICS_FUKUOKA.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_HIROSHIMA(パイロット実データ・2つの公式PDFで令和7年度が重複検証済み)', () => {
  it('3年度分(令和6〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_HIROSHIMA.years).toHaveLength(3);
  });

  it('各教科50点満点(5教科合計250点満点体系)・test-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_HIROSHIMA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(50);
    }
  });

  it('原資料の「5教科平均」は相加平均(合計ではない)のためtotalAverageは未設定', () => {
    for (const year of EXAM_SCORE_STATISTICS_HIROSHIMA.years) {
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_AICHI(パイロット実データ・22点満点の特有配点・令和7/8年度は複数媒体で重複検証済み)', () => {
  it('4年度分(令和5〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_AICHI.years).toHaveLength(4);
  });

  it('各教科22点満点(他県の100点満点/50点満点/福岡の60点満点と異なる特有の配点)・test-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_AICHI.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(22);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと完全一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_AICHI.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_KANAGAWA(パイロット実データ・合格者平均点のtest-takersと異なる区分)', () => {
  it('3年度分(令和6〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_KANAGAWA.years).toHaveLength(3);
  });

  it('各教科100点満点・全年度passersで統一されている(他県のtest-takers平均と混同しない)', () => {
    for (const year of EXAM_SCORE_STATISTICS_KANAGAWA.years) {
      expect(year.averageType).toBe('passers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('年度ごとに個別のsourceを持つ(年度別PDFのため)', () => {
    for (const year of EXAM_SCORE_STATISTICS_KANAGAWA.years) {
      expect(year.source?.url).toBeTruthy();
    }
  });
});

describe('EXAM_SCORE_STATISTICS_IBARAKI(パイロット実データ・令和7年度のみ全受検者/合格者の両区分)', () => {
  it('4エントリ(令和4年度×test-takers、令和6年度×test-takers、令和7年度×test-takers/passers)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_IBARAKI.years).toHaveLength(4);
  });

  it('各教科100点満点(5教科合計500点満点体系)・5教科の内訳を持つ', () => {
    for (const year of EXAM_SCORE_STATISTICS_IBARAKI.years) {
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
      expect(year.totalMaxScore).toBe(500);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_IBARAKI.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和4年度・令和6年度はtest-takersのみ(合格者区分の掲載が原資料に無い)、令和7年度のみ両区分が揃う', () => {
    const r7 = EXAM_SCORE_STATISTICS_IBARAKI.years.filter((y) => y.fiscalYearLabel === '令和7年度');
    expect(r7).toHaveLength(2);
    expect(r7.map((y) => y.averageType).sort()).toEqual(['passers', 'test-takers']);
  });
});

describe('EXAM_SCORE_STATISTICS_GIFU(パイロット実データ・教科別平均点と総点平均で算出母集団が異なる)', () => {
  it('4年度分(令和4〜7年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_GIFU.years).toHaveLength(4);
  });

  it('各教科100点満点・5教科の内訳を持ちtest-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_GIFU.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('教科別平均点(20分の1抽出)と総点平均(全数)は算出母集団が異なり単純合計が一致しない(意図的にfalse)', () => {
    const withTotal = EXAM_SCORE_STATISTICS_GIFU.years.filter((y) => y.totalAverage !== undefined);
    expect(withTotal.length).toBeGreaterThan(0);
    for (const year of withTotal) {
      expect(isPlausibleSubjectSum(year)).toBe(false);
    }
  });

  it('令和6年度分は総点平均が原資料に見当たらずtotalAverage未設定', () => {
    const r6 = EXAM_SCORE_STATISTICS_GIFU.years.find((y) => y.fiscalYearLabel === '令和6年度');
    expect(r6?.totalAverage).toBeUndefined();
  });
});

describe('EXAM_SCORE_STATISTICS_MIE(パイロット実データ・後期選抜合格者平均をページ本文から直接取得)', () => {
  it('3年度分(令和5〜7年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_MIE.years).toHaveLength(3);
  });

  it('各教科50点満点(5教科合計250点満点体系)・全年度passersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_MIE.years) {
      expect(year.averageType).toBe('passers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(50);
      expect(year.totalMaxScore).toBe(250);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと完全一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_MIE.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和5・6年度分は年度別ページのsourceを持つ(令和7年度はファイル側のsourceを流用)', () => {
    const r5 = EXAM_SCORE_STATISTICS_MIE.years.find((y) => y.fiscalYearLabel === '令和5年度');
    const r6 = EXAM_SCORE_STATISTICS_MIE.years.find((y) => y.fiscalYearLabel === '令和6年度');
    expect(r5?.source?.url).toBeTruthy();
    expect(r6?.source?.url).toBeTruthy();
  });
});

describe('EXAM_SCORE_STATISTICS_WAKAYAMA(パイロット実データ・一般選抜区分)', () => {
  it('2年度分(令和6〜7年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_WAKAYAMA.years).toHaveLength(2);
  });

  it('各教科100点満点・5教科の内訳を持ちtest-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_WAKAYAMA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('一次ソースが5教科合計を明記していないためtotalAverageは未設定', () => {
    for (const year of EXAM_SCORE_STATISTICS_WAKAYAMA.years) {
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('調査人数の母集団が年度によって大きく異なり不明瞭なためtestTakerCountは記録しない', () => {
    for (const year of EXAM_SCORE_STATISTICS_WAKAYAMA.years) {
      expect(year.testTakerCount).toBeUndefined();
    }
  });
});

describe('EXAM_SCORE_STATISTICS_SHIGA(パイロット実データ・2つの独立PDFで令和7年度が重複検証済み)', () => {
  it('2年度分(令和7〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_SHIGA.years).toHaveLength(2);
  });

  it('各教科100点満点・5教科の内訳を持ちtest-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_SHIGA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('一次ソースが「学校ごとに満点値が異なるためまとめは行わなかった」と明記しているためtotalAverageは未設定', () => {
    for (const year of EXAM_SCORE_STATISTICS_SHIGA.years) {
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });
});

describe('EXAM_SCORE_STATISTICS_OKAYAMA(パイロット実データ・1PDFの参考表で6年度分を一括取得)', () => {
  it('6年度分(令和3〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_OKAYAMA.years).toHaveLength(6);
  });

  it('各教科100点法換算(100点満点)・5教科の内訳を持ちtest-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_OKAYAMA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(100);
    }
  });

  it('一次ソースが5教科合計を明記していないためtotalAverageは未設定', () => {
    for (const year of EXAM_SCORE_STATISTICS_OKAYAMA.years) {
      expect(year.totalAverage).toBeUndefined();
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和8年度分のみ受検者数(5,586人)が明記されている', () => {
    const r8 = EXAM_SCORE_STATISTICS_OKAYAMA.years.find((y) => y.fiscalYearLabel === '令和8年度');
    expect(r8?.testTakerCount).toBe(5586);
    const others = EXAM_SCORE_STATISTICS_OKAYAMA.years.filter((y) => y.fiscalYearLabel !== '令和8年度');
    for (const year of others) expect(year.testTakerCount).toBeUndefined();
  });
});

describe('EXAM_SCORE_STATISTICS_YAMAGUCHI(パイロット実データ・R7 PDFにR6比較列が併記されクロス検証済み)', () => {
  it('4年度分(令和4〜7年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_YAMAGUCHI.years).toHaveLength(4);
  });

  it('各教科50点満点(5教科合計250点満点体系)・test-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_YAMAGUCHI.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(50);
      expect(year.totalMaxScore).toBe(250);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_YAMAGUCHI.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和6・7年度分のみ受検者数が明記されている', () => {
    const r6 = EXAM_SCORE_STATISTICS_YAMAGUCHI.years.find((y) => y.fiscalYearLabel === '令和6年度');
    const r7 = EXAM_SCORE_STATISTICS_YAMAGUCHI.years.find((y) => y.fiscalYearLabel === '令和7年度');
    expect(r6?.testTakerCount).toBe(5790);
    expect(r7?.testTakerCount).toBe(5618);
  });
});

describe('EXAM_SCORE_STATISTICS_KAGAWA(パイロット実データ・2つのPDFで令和5年度が重複検証済み・最多7年度分)', () => {
  it('7年度分(令和2〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_KAGAWA.years).toHaveLength(7);
  });

  it('各教科50点満点(5教科合計250点満点体系)・test-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_KAGAWA.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(50);
      expect(year.totalMaxScore).toBe(250);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_KAGAWA.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和5年度分は2つの独立PDF(令和5年度版本体・令和8年度版の比較列)に現れるが数値が完全一致する', () => {
    const r5 = EXAM_SCORE_STATISTICS_KAGAWA.years.find((y) => y.fiscalYearLabel === '令和5年度');
    expect(r5?.totalAverage).toBe(143.6);
    expect(r5?.testTakerCount).toBe(5191);
  });
});

describe('EXAM_SCORE_STATISTICS_EHIME(パイロット実データ・単一ソース+独立記事1年でクロス検証)', () => {
  it('5年度分(令和4〜8年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_EHIME.years).toHaveLength(5);
  });

  it('各教科50点満点(5教科合計250点満点体系)・test-takersで統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_EHIME.years) {
      expect(year.averageType).toBe('test-takers');
      expect(year.subjects).toHaveLength(5);
      for (const s of year.subjects) expect(s.maxScore).toBe(50);
      expect(year.totalMaxScore).toBe(250);
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと完全一致する(丸め誤差ゼロ)', () => {
    for (const year of EXAM_SCORE_STATISTICS_EHIME.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('令和6年度分のみ独立した別記事のsourceを持つ(クロス検証済みの印)', () => {
    const r6 = EXAM_SCORE_STATISTICS_EHIME.years.find((y) => y.fiscalYearLabel === '令和6年度');
    expect(r6?.source?.url).toBe('https://keep-smiling8.com/ehime-hsexam/');
  });
});

describe('exam-score-statistics index', () => {
  it('kochi/saitama/chiba/tokyo/nara/hyogo/niigata/gunma/miyagi/hokkaido/fukushima/aomori/iwate/akita/nagano/shizuoka/fukuoka/hiroshima/aichi/kanagawa/ibaraki/gifu/mie/wakayama/shiga/okayama/yamaguchi/kagawa/ehimeの29県が集約されている', () => {
    expect(Object.keys(EXAM_SCORE_STATISTICS_BY_PREFECTURE).sort()).toEqual([
      'aichi',
      'akita',
      'aomori',
      'chiba',
      'ehime',
      'fukuoka',
      'fukushima',
      'gifu',
      'gunma',
      'hiroshima',
      'hokkaido',
      'hyogo',
      'ibaraki',
      'iwate',
      'kagawa',
      'kanagawa',
      'kochi',
      'mie',
      'miyagi',
      'nagano',
      'nara',
      'niigata',
      'okayama',
      'saitama',
      'shiga',
      'shizuoka',
      'tokyo',
      'wakayama',
      'yamaguchi',
    ]);
    expect(EXAM_SCORE_STATISTICS_FILES).toHaveLength(29);
  });
});
