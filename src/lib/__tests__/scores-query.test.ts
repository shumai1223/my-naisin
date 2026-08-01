/**
 * 2026-08-01 Cowork実地UXテスト是正: 都道府県別計算機→トップページの「詳細な分析はこちら」で
 * 県別設定・入力済みの評定を引き継ぐURLエンコード/デコードを固定する
 * （[[fable5-fullaccel-backlog-2026-07]]のΛ+2）。
 */
import { encodeScoresQuery, decodeScoresQuery } from '../utils';
import { DEFAULT_SCORES, SUBJECTS } from '../constants';
import type { Scores } from '../types';

describe('encodeScoresQuery / decodeScoresQuery', () => {
  it('往復（encode→decode）で元のScoresと一致する', () => {
    const scores: Scores = { ...DEFAULT_SCORES, japanese: 5, math: 2, pe: 4 };
    const encoded = encodeScoresQuery(scores);
    const decoded = decodeScoresQuery(encoded);
    expect(decoded).toEqual(scores);
  });

  it('SUBJECTS順のカンマ区切り数値であること', () => {
    const scores: Scores = { ...DEFAULT_SCORES };
    const encoded = encodeScoresQuery(scores);
    expect(encoded.split(',')).toHaveLength(SUBJECTS.length);
  });

  it('null/undefined/空文字はnullを返す（例外を投げない）', () => {
    expect(decodeScoresQuery(null)).toBeNull();
    expect(decodeScoresQuery(undefined)).toBeNull();
    expect(decodeScoresQuery('')).toBeNull();
  });

  it('教科数が合わない壊れた入力はnullを返す', () => {
    expect(decodeScoresQuery('3,4,5')).toBeNull();
    expect(decodeScoresQuery(Array(SUBJECTS.length + 1).fill('3').join(','))).toBeNull();
  });

  it('数値でない要素を含む壊れた入力はnullを返す（外部入力を信用しない）', () => {
    const broken = SUBJECTS.map(() => '3').join(',').replace('3', 'abc');
    expect(decodeScoresQuery(broken)).toBeNull();
  });

  it('範囲外の値は1〜10にクランプする', () => {
    const outOfRange = SUBJECTS.map(() => '99').join(',');
    const decoded = decodeScoresQuery(outOfRange);
    expect(decoded).not.toBeNull();
    expect(Object.values(decoded as Scores).every((v) => v === 10)).toBe(true);
  });
});
