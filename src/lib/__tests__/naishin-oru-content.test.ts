/**
 * 「オール3/4/5」内申点計算例(O-1)の契約テスト。calculateAllNScoreはn(評定)に対して線形
 * (score(n) = n × 定数)であるはずという計算式由来の不変条件と、GSCハイライト県コードが
 * 実在する都道府県であることを固定する。
 */
import { PREFECTURES } from '@/lib/prefectures';
import {
  ORU_GRADES,
  parseOruGrade,
  getOruExamples,
  ORU_HIGHLIGHT_CODES,
  ORU_GRADE_LABEL,
} from '../naishin-oru-content';

describe('parseOruGrade', () => {
  it('3/4/5は有効な評定として解釈される', () => {
    expect(parseOruGrade('3')).toBe(3);
    expect(parseOruGrade('4')).toBe(4);
    expect(parseOruGrade('5')).toBe(5);
  });

  it('範囲外の数値・数値でない文字列はnull', () => {
    expect(parseOruGrade('0')).toBeNull();
    expect(parseOruGrade('1')).toBeNull();
    expect(parseOruGrade('2')).toBeNull();
    expect(parseOruGrade('6')).toBeNull();
    expect(parseOruGrade('abc')).toBeNull();
    expect(parseOruGrade('')).toBeNull();
  });
});

describe('getOruExamples', () => {
  it('47都道府県すべての計算例を返す', () => {
    for (const grade of ORU_GRADES) {
      expect(getOruExamples(grade)).toHaveLength(47);
    }
  });

  it('score/maxScore/percentageは全て正の値', () => {
    for (const grade of ORU_GRADES) {
      for (const ex of getOruExamples(grade)) {
        expect(ex.score).toBeGreaterThan(0);
        expect(ex.maxScore).toBeGreaterThan(0);
        expect(ex.percentage).toBeGreaterThan(0);
      }
    }
  });

  it('percentageは概ね100%以下(オール5が実質的な上限のため)', () => {
    for (const ex of getOruExamples(5)) {
      // 丸め誤差を許容し100.5%までは許す
      expect(ex.percentage).toBeLessThanOrEqual(100.5);
    }
  });

  it('同一県ではオール5の点数がオール4より高く、オール4がオール3より高い(評定が上がるほど内申点も上がる)', () => {
    const g3 = getOruExamples(3);
    const g4 = getOruExamples(4);
    const g5 = getOruExamples(5);
    for (let i = 0; i < g3.length; i++) {
      expect(g3[i].code).toBe(g4[i].code);
      expect(g4[i].code).toBe(g5[i].code);
      expect(g5[i].score).toBeGreaterThan(g4[i].score);
      expect(g4[i].score).toBeGreaterThan(g3[i].score);
    }
  });

  it('score(n)はnに対してほぼ線形(score(5)/score(3)≈5/3、丸め誤差のみ許容)', () => {
    const g3 = getOruExamples(3);
    const g5 = getOruExamples(5);
    for (let i = 0; i < g3.length; i++) {
      if (g3[i].score === 0) continue;
      const ratio = g5[i].score / g3[i].score;
      expect(ratio).toBeCloseTo(5 / 3, 1);
    }
  });
});

describe('ORU_HIGHLIGHT_CODES', () => {
  it('全てのハイライト県コードが実在する都道府県を指す', () => {
    const validCodes = new Set(PREFECTURES.map((p) => p.code));
    for (const code of ORU_HIGHLIGHT_CODES) {
      expect(validCodes.has(code)).toBe(true);
    }
  });

  it('重複が無い', () => {
    expect(new Set(ORU_HIGHLIGHT_CODES).size).toBe(ORU_HIGHLIGHT_CODES.length);
  });
});

describe('ORU_GRADE_LABEL', () => {
  it('ORU_GRADESの全ての値にラベルが存在する', () => {
    for (const grade of ORU_GRADES) {
      expect(ORU_GRADE_LABEL[grade]).toBeTruthy();
      expect(ORU_GRADE_LABEL[grade]).toContain(String(grade));
    }
  });
});
