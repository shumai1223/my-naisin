// classifyQuestion(): グラウンデッドAIアドバイザー(ZZ-3a)の決定論的質問分類器。
// 準拠必須仕様(docs/zz-specs/zz3-grounded-advisor-spec.md §1)により「決定論・AI不使用」が
// 前提のため、判定順序自体が正しさの根幹(コメントに明記された優先順位)。無テストだったので
// 各分類とその優先順位を固定する。

import { classifyQuestion } from '../classify';

describe('classifyQuestion', () => {
  it('都道府県2つ以上+比較語で prefecture-compare', () => {
    const result = classifyQuestion('東京都と大阪府どっちが内申点高い？');
    expect(result.type).toBe('prefecture-compare');
    expect(result.mentionedPrefectureCodes).toEqual(expect.arrayContaining(['tokyo', 'osaka']));
  });

  it('都道府県が1つだけだと比較語があってもprefecture-compareにならない', () => {
    const result = classifyQuestion('東京都は違いが大きいですか？');
    expect(result.type).not.toBe('prefecture-compare');
    expect(result.mentionedPrefectureCodes).toEqual(['tokyo']);
  });

  it('都道府県2つ以上でも比較語が無ければprefecture-compareにならない', () => {
    const result = classifyQuestion('東京都と大阪府の内申点を教えて');
    expect(result.type).not.toBe('prefecture-compare');
  });

  it('逆算キーワードで reverse', () => {
    expect(classifyQuestion('偏差値60まであと何点必要ですか？').type).toBe('reverse');
    expect(classifyQuestion('目標に足りない点数を知りたい').type).toBe('reverse');
  });

  it('総合得点キーワードで total-score', () => {
    expect(classifyQuestion('総合得点はどう計算しますか？').type).toBe('total-score');
    expect(classifyQuestion('当日点と内申の合計点を知りたい').type).toBe('total-score');
  });

  it('偏差値キーワードで hensachi', () => {
    expect(classifyQuestion('偏差値を教えてください').type).toBe('hensachi');
  });

  it('制度・仕組みキーワードで system-explain（内申点キーワードより優先）', () => {
    const result = classifyQuestion('内申点の仕組みを教えて');
    expect(result.type).toBe('system-explain');
  });

  it('倍率・方式・とはキーワードも system-explain', () => {
    expect(classifyQuestion('実技教科の倍率とは何ですか？').type).toBe('system-explain');
    expect(classifyQuestion('内申点の計算方式とは').type).toBe('system-explain');
  });

  it('内申点+計算系キーワード（制度語なし）で naishin-calc', () => {
    expect(classifyQuestion('内申点を計算してください').type).toBe('naishin-calc');
    expect(classifyQuestion('内申点は何点になりますか').type).toBe('naishin-calc');
  });

  it('内申点キーワードだけで計算系動詞が無ければnaishin-calcにならない', () => {
    const result = classifyQuestion('内申点');
    expect(result.type).not.toBe('naishin-calc');
  });

  it('どのキーワードにも一致しない質問は out-of-scope', () => {
    expect(classifyQuestion('今日の天気を教えて').type).toBe('out-of-scope');
    expect(classifyQuestion('').type).toBe('out-of-scope');
  });

  it('優先順位: reverseはtotal-scoreより先に判定される', () => {
    // 「総合得点」と「あと何点」の両方を含む質問はreverseとして扱われる
    const result = classifyQuestion('目標の総合得点まであと何点ですか');
    expect(result.type).toBe('reverse');
  });

  it('都道府県名の抽出はどの分類タイプでも共通して動作する', () => {
    const result = classifyQuestion('神奈川県の偏差値を教えて');
    expect(result.type).toBe('hensachi');
    expect(result.mentionedPrefectureCodes).toEqual(['kanagawa']);
  });

  it('都道府県名が含まれない質問はmentionedPrefectureCodesが空配列', () => {
    const result = classifyQuestion('偏差値を教えて');
    expect(result.mentionedPrefectureCodes).toEqual([]);
  });
});
