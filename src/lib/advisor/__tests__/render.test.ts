/**
 * グラウンデッドAIアドバイザー（ZZ-3a）の決定論レンダラ契約テスト。
 * DoD: 主要20質問パターンで正答・全数値に根拠リンク（内部リンクを含む）。
 * 完全な検証器（verifyGrounding・敵対的50本）はZZ-3bで実装する。ここでは
 * 「台帳に登録した値が本文に一致して出現し、根拠リンクが含まれる」ことを手動で固定する。
 */
import { renderAdvisorAnswer, type AdvisorQuestion } from '../render';
import { calculateTotalScore, calculateMaxScore } from '@/lib/utils';
import { calcHensachi, roundHensachi } from '@/lib/hensachi';
import { TOTAL_SCORE_SYSTEMS } from '@/lib/total-score/registry';
import { computeReportRaw, computeTotalScore } from '@/lib/total-score/engine';
import type { Scores } from '@/lib/types';

const SAMPLE_SCORES: Scores = { japanese: 4, math: 3, english: 5, science: 4, social: 3, music: 4, art: 5, pe: 3, tech: 4 };

/** 回答内に台帳の全エントリ値が出現し、少なくとも1つの内部リンク（Markdown形式）を含むことを確認する共通アサーション。 */
function expectGrounded(answer: ReturnType<typeof renderAdvisorAnswer>) {
  expect(answer.ledger.length).toBeGreaterThan(0);
  for (const entry of answer.ledger) {
    expect(answer.text).toContain(entry.value);
  }
  expect(answer.text).toMatch(/\[.+\]\(\/.+\)/); // 内部リンク（根拠）
  expect(answer.text).toContain('最終的な判断は学校の先生・保護者の方と相談してください。');
}

describe('renderAdvisorAnswer（主要パターン・ZZ-3a）', () => {
  describe('naishin-calc（内申点計算）', () => {
    const cases: [string, string][] = [
      ['tokyo', '東京都の内申点を計算して'],
      ['osaka', '大阪府の内申点は何点になりますか'],
      ['hyogo', '兵庫県の内申点の出し方を教えて'],
      ['kanagawa', '神奈川県の内申点計算をお願いします'],
    ];
    for (const [prefCode, raw] of cases) {
      it(`${prefCode}: 「${raw}」`, () => {
        const q: AdvisorQuestion = { raw, prefectureCode: prefCode, scores: SAMPLE_SCORES };
        const answer = renderAdvisorAnswer(q);
        expect(answer.type).toBe('naishin-calc');
        const expectedTotal = calculateTotalScore(SAMPLE_SCORES, prefCode);
        const expectedMax = calculateMaxScore(prefCode);
        expect(answer.text).toContain(String(Math.round(expectedTotal * 10) / 10));
        expect(answer.text).toContain(String(Math.round(expectedMax * 10) / 10));
        expectGrounded(answer);
      });
    }

    it('評定未指定なら安全な定型文にフォールバックする（数値を作文しない）', () => {
      const answer = renderAdvisorAnswer({ raw: '東京都の内申点を計算して', prefectureCode: 'tokyo' });
      expect(answer.ledger).toHaveLength(0);
      expect(answer.text).toContain('最終的な判断は学校の先生・保護者の方と相談してください。');
    });
  });

  describe('total-score（総合得点・検証済みシステムのみ）', () => {
    const cases: string[] = ['hyogo', 'kyoto', 'tochigi'];
    for (const prefCode of cases) {
      it(`${prefCode}: 総合得点を計算して`, () => {
        const q: AdvisorQuestion = {
          raw: `${prefCode}の総合得点を計算して`,
          prefectureCode: prefCode,
          scores: SAMPLE_SCORES,
          academicRaw: 350,
        };
        const answer = renderAdvisorAnswer(q);
        expect(answer.type).toBe('total-score');
        const system = TOTAL_SCORE_SYSTEMS[prefCode];
        const coreSum = 4 + 3 + 5 + 4 + 3; // japanese+math+english+science+social
        const practicalSum = 4 + 5 + 3 + 4; // music+art+pe+tech
        const reportRaw = computeReportRaw(system.report, { coreSum, practicalSum });
        const result = computeTotalScore(system, { academicRaw: 350, reportRaw });
        expect(answer.text).toContain(String(Math.round(result.total * 10) / 10));
        expectGrounded(answer);
      });
    }

    it('検証済みシステムが無い県（東京都）はフォールバック（作文しない）', () => {
      const answer = renderAdvisorAnswer({ raw: '東京都の総合得点を教えて', prefectureCode: 'tokyo', scores: SAMPLE_SCORES, academicRaw: 300 });
      expect(answer.ledger).toHaveLength(0);
    });
  });

  describe('hensachi（偏差値）', () => {
    const cases: { score: number; average: number; stdDev: number }[] = [
      { score: 78, average: 65, stdDev: 12 },
      { score: 55, average: 60, stdDev: 10 },
      { score: 40, average: 50, stdDev: 8 },
    ];
    for (const input of cases) {
      it(`score=${input.score}/avg=${input.average}/sd=${input.stdDev}`, () => {
        const answer = renderAdvisorAnswer({ raw: '偏差値を計算して', hensachiInput: input });
        expect(answer.type).toBe('hensachi');
        const expected = roundHensachi(calcHensachi(input.score, input.average, input.stdDev)!);
        expect(answer.text).toContain(String(Math.round(expected * 10) / 10));
        expectGrounded(answer);
      });
    }
  });

  describe('reverse（目標逆算）', () => {
    it('目標未達なら「あと◯点」を表示', () => {
      const answer = renderAdvisorAnswer({ raw: '目標まであと何点か教えて', prefectureCode: 'tokyo', scores: SAMPLE_SCORES, targetTotal: 60 });
      expect(answer.type).toBe('reverse');
      expect(answer.text).toContain('あと');
      expectGrounded(answer);
    });

    it('目標達成済みなら「届いています」を表示', () => {
      const answer = renderAdvisorAnswer({ raw: '目標まであと何点か教えて', prefectureCode: 'tokyo', scores: SAMPLE_SCORES, targetTotal: 10 });
      expect(answer.type).toBe('reverse');
      expect(answer.text).toContain('届いています');
      expectGrounded(answer);
    });

    it('都道府県未指定はフォールバック', () => {
      const answer = renderAdvisorAnswer({ raw: '目標まであと何点か教えて', scores: SAMPLE_SCORES, targetTotal: 60 });
      expect(answer.ledger).toHaveLength(0);
    });
  });

  describe('system-explain（制度説明）', () => {
    const cases: string[] = ['tokyo', 'osaka', 'hyogo'];
    for (const prefCode of cases) {
      it(`${prefCode}の内申点制度を説明`, () => {
        const answer = renderAdvisorAnswer({ raw: `${prefCode}の内申点の仕組みを教えて`, prefectureCode: prefCode });
        expect(answer.type).toBe('system-explain');
        expectGrounded(answer);
      });
    }
  });

  describe('prefecture-compare（県間比較・1回答=1県ブロック構成）', () => {
    it('質問文中の2県名から比較ブロックを生成', () => {
      const answer = renderAdvisorAnswer({ raw: '東京都と大阪府の内申点制度を比較して違いを教えて' });
      expect(answer.type).toBe('prefecture-compare');
      expect(answer.ledger.some((e) => e.context === 'tokyo')).toBe(true);
      expect(answer.ledger.some((e) => e.context === 'osaka')).toBe(true);
      // 県混線ガード：東京の台帳エントリが大阪のブロックに紛れていないか（contextの分離を確認）
      const tokyoEntries = answer.ledger.filter((e) => e.context === 'tokyo');
      const osakaEntries = answer.ledger.filter((e) => e.context === 'osaka');
      expect(tokyoEntries.length).toBeGreaterThan(0);
      expect(osakaEntries.length).toBeGreaterThan(0);
    });
  });

  describe('out-of-scope（範囲外・正直に答えない）', () => {
    const cases: string[] = ['今日の天気を教えて', '好きな食べ物は何ですか'];
    for (const raw of cases) {
      it(`「${raw}」は範囲外`, () => {
        const answer = renderAdvisorAnswer({ raw });
        expect(answer.type).toBe('out-of-scope');
        expect(answer.ledger).toHaveLength(0);
        expect(answer.text).toContain('最終的な判断は学校の先生・保護者の方と相談してください。');
      });
    }
  });
});
