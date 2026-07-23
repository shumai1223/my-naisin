/**
 * 内申点タイプ診断（ZZ-5c）の決定論マッピング契約テスト。
 * タイプ間に優劣が無い（ラベル・basisに順位語彙が無い）ことも固定する。
 */
import { diagnoseNaishinType, NAISHIN_TYPES } from '../naishin-type-diagnosis';
import type { Scores } from '../types';

const ALL_THREE: Scores = { japanese: 3, math: 3, english: 3, science: 3, social: 3, music: 3, art: 3, pe: 3, tech: 3 };

describe('diagnoseNaishinType（決定論マッピング）', () => {
  it('全教科同一評定はbalanced', () => {
    const r = diagnoseNaishinType(ALL_THREE);
    expect(r.type.id).toBe('balanced');
    expect(r.coreAverage).toBe(3);
    expect(r.practicalAverage).toBe(3);
    expect(r.spread).toBe(0);
  });

  it('実技教科の平均が主要教科より0.5以上高いとpractical-lean', () => {
    const scores: Scores = { ...ALL_THREE, music: 4, art: 4, pe: 4, tech: 4 }; // core avg 3, practical avg 4, spread=1(uneven閾値未満)
    const r = diagnoseNaishinType(scores);
    expect(r.type.id).toBe('practical-lean');
  });

  it('主要教科の平均が実技教科より0.5以上高いとcore-lean', () => {
    const scores: Scores = { ...ALL_THREE, japanese: 4, math: 4, english: 4, science: 4, social: 4 }; // core avg 4, practical avg 3, spread=1(uneven閾値未満)
    const r = diagnoseNaishinType(scores);
    expect(r.type.id).toBe('core-lean');
  });

  it('最高評定と最低評定の差が2以上ならuneven(lean判定より優先)', () => {
    const scores: Scores = { ...ALL_THREE, japanese: 5, math: 3 }; // spread=2, coreAvg/practicalAvgの差は僅か
    const r = diagnoseNaishinType(scores);
    expect(r.type.id).toBe('uneven');
    expect(r.spread).toBe(2);
  });

  it('都道府県コード未指定ならprefectureNoteはnull', () => {
    const r = diagnoseNaishinType(ALL_THREE);
    expect(r.prefectureNote).toBeNull();
  });

  it('東京都(practicalMultiplier2>coreMultiplier1)でpractical-leanなら反映が強まる旨を記述', () => {
    const scores: Scores = { ...ALL_THREE, music: 4, art: 4, pe: 4, tech: 4 };
    const r = diagnoseNaishinType(scores, 'tokyo');
    expect(r.type.id).toBe('practical-lean');
    expect(r.prefectureNote).toContain('東京都');
    expect(r.prefectureNote).toContain('強く反映');
  });

  it('未知の都道府県コードはprefectureNote=null(エラーにならない)', () => {
    const r = diagnoseNaishinType(ALL_THREE, 'not-a-real-pref');
    expect(r.prefectureNote).toBeNull();
  });

  it('全タイプのlabel/basisに優劣を示す語彙(優/劣/良/悪/おすすめ/最高/最低)を含まない', () => {
    const forbidden = ['優', '劣', '良い', '悪い', 'おすすめ', '最高', '最低', 'ランク'];
    for (const def of Object.values(NAISHIN_TYPES)) {
      for (const word of forbidden) {
        expect(def.label).not.toContain(word);
        expect(def.basis).not.toContain(word);
      }
    }
  });
});
