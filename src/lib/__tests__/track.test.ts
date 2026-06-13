/**
 * AI送客（GEO）判定 classifyAiReferrer のユニットテスト（純粋関数）。
 * 誤検知（通常のGoogle/直リンクをAI扱いしない）と取りこぼし（referrer欠落時のutm拾い）の両方を担保する。
 */
import { classifyAiReferrer } from '../track';

describe('classifyAiReferrer', () => {
  test('referrer のホスト名でAI送客元を判定する', () => {
    expect(classifyAiReferrer('https://chatgpt.com/')).toBe('chatgpt');
    expect(classifyAiReferrer('https://www.perplexity.ai/search?q=x')).toBe('perplexity');
    expect(classifyAiReferrer('https://copilot.microsoft.com/')).toBe('copilot');
    expect(classifyAiReferrer('https://gemini.google.com/app')).toBe('gemini');
  });

  test('referrerが空でも utm_source/ref パラメータで拾う（AIアプリ内ブラウザ対策）', () => {
    expect(classifyAiReferrer('', '?utm_source=chatgpt.com')).toBe('chatgpt');
    expect(classifyAiReferrer('', '?ref=perplexity')).toBe('perplexity');
  });

  test('通常の検索/直リンクはAI扱いしない（誤検知ゼロ）', () => {
    expect(classifyAiReferrer('https://www.google.com/')).toBeNull();
    expect(classifyAiReferrer('https://my-naishin.com/hensachi')).toBeNull();
    expect(classifyAiReferrer('')).toBeNull();
    expect(classifyAiReferrer('not a url')).toBeNull();
  });
});
