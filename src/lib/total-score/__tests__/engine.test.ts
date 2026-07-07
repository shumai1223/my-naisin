import { computeReportRaw, computeTotalScore, reportRawAtFullMarks, scaleScore, requiredAcademicRaw } from '../engine';
import { TOTAL_SCORE_SYSTEMS, getTotalScoreSystem, isVerifiedTotalScore } from '../registry';

describe('total-score engine', () => {
  // --- データ整合ゲート（捏造・転記ミスを機械で弾く） ---
  describe('invariant: report.rawMax は評定満点から再計算できる', () => {
    for (const [code, system] of Object.entries(TOTAL_SCORE_SYSTEMS)) {
      it(`${code}: 評定満点での内申換算 === report.rawMax`, () => {
        expect(reportRawAtFullMarks(system.report)).toBe(system.report.rawMax);
      });
    }
  });

  describe('invariant: 各比率オプションで「満点入力 → 総合得点=満点」になる', () => {
    for (const [code, system] of Object.entries(TOTAL_SCORE_SYSTEMS)) {
      for (const option of system.ratioOptions) {
        it(`${code} / ${option.id}: 満点入力で total === totalMax`, () => {
          const r = computeTotalScore(system, {
            academicRaw: system.academic.rawMax,
            reportRaw: system.report.rawMax,
            ratioOptionId: option.id,
          });
          expect(r.total).toBe(option.academicMax + option.reportMax);
          expect(r.total).toBe(r.totalMax);
        });
      }
    }
  });

  describe('invariant: 0点入力 → 総合0点', () => {
    for (const [code, system] of Object.entries(TOTAL_SCORE_SYSTEMS)) {
      it(`${code}: 0入力で total === 0`, () => {
        const r = computeTotalScore(system, { academicRaw: 0, reportRaw: 0 });
        expect(r.total).toBe(0);
      });
    }
  });

  describe('invariant: ボリューム項目（overview・computeSteps・faqs）が充実', () => {
    for (const [code, system] of Object.entries(TOTAL_SCORE_SYSTEMS)) {
      it(`${code}: overview・手順・FAQが揃っている`, () => {
        expect(system.overview.length).toBeGreaterThan(60);
        expect(system.computeSteps.length).toBeGreaterThanOrEqual(3);
        expect(system.faqs.length).toBeGreaterThanOrEqual(3);
        for (const f of system.faqs) {
          expect(f.a.length).toBeGreaterThan(30);
        }
      });
    }
  });

  describe('invariant: 計算例（examples）は engine と整合し満点を超えない', () => {
    for (const [code, system] of Object.entries(TOTAL_SCORE_SYSTEMS)) {
      for (const ex of system.examples ?? []) {
        it(`${code}: ${ex.label} の総合得点が満点以内`, () => {
          const r = computeTotalScore(system, {
            academicRaw: ex.academicRaw,
            reportRaw: ex.reportRaw,
            ratioOptionId: ex.ratioOptionId,
          });
          expect(r.total).toBeLessThanOrEqual(r.totalMax);
          expect(r.total).toBeGreaterThanOrEqual(0);
        });
      }
    }
  });

  // --- 兵庫（固定1:1・総合500） ---
  describe('兵庫', () => {
    const hyogo = getTotalScoreSystem('hyogo')!;

    it('評定満点 → 判定資料A 250点（5教科和25×4 + 実技和20×7.5）', () => {
      expect(computeReportRaw(hyogo.report, { coreSum: 25, practicalSum: 20 })).toBe(250);
    });

    it('満点（学力500・内申250）→ 総合500', () => {
      const r = computeTotalScore(hyogo, { academicRaw: 500, reportRaw: 250 });
      expect(r.academic).toBe(250);
      expect(r.report).toBe(250);
      expect(r.total).toBe(500);
    });

    it('学力360・内申200 → 学力180・内申200・合計380', () => {
      const r = computeTotalScore(hyogo, { academicRaw: 360, reportRaw: 200 });
      expect(r.academic).toBe(180);
      expect(r.report).toBe(200);
      expect(r.total).toBe(380);
    });
  });

  // --- 京都中期（固定・総合395） ---
  describe('京都（中期選抜）', () => {
    const kyoto = getTotalScoreSystem('kyoto')!;

    it('評定満点 → 報告書195点（5教科75 + 実技120）', () => {
      expect(computeReportRaw(kyoto.report, { coreSum: 75, practicalSum: 60 })).toBe(195);
    });

    it('満点（学力200・報告書195）→ 総合395', () => {
      const r = computeTotalScore(kyoto, { academicRaw: 200, reportRaw: 195 });
      expect(r.total).toBe(395);
      expect(r.totalMax).toBe(395);
    });
  });

  // --- 栃木（選択比率9:1〜5:5・総合500） ---
  describe('栃木', () => {
    const tochigi = getTotalScoreSystem('tochigi')!;

    it('5:5・満点 → 学力250・内申250・合計500', () => {
      const r = computeTotalScore(tochigi, { academicRaw: 500, reportRaw: 135, ratioOptionId: '5-5' });
      expect(r.academic).toBe(250);
      expect(r.report).toBe(250);
      expect(r.total).toBe(500);
    });

    it('9:1（内申重視）・満点 → 学力50・内申450・合計500', () => {
      const r = computeTotalScore(tochigi, { academicRaw: 500, reportRaw: 135, ratioOptionId: '9-1' });
      expect(r.academic).toBe(50);
      expect(r.report).toBe(450);
      expect(r.total).toBe(500);
    });

    it('7:3・学力400・内申108(80%) → 学力120・内申280・合計400', () => {
      const r = computeTotalScore(tochigi, { academicRaw: 400, reportRaw: 108, ratioOptionId: '7-3' });
      expect(r.academic).toBe(120);
      expect(r.report).toBe(280);
      expect(r.total).toBe(400);
    });

    it('比率未指定なら先頭（9-1）が既定', () => {
      const r = computeTotalScore(tochigi, { academicRaw: 500, reportRaw: 135 });
      expect(r.option.id).toBe('9-1');
    });
  });

  // --- scaleScore（任意満点→1000点換算） ---
  describe('scaleScore', () => {
    it('満点入力 → target満点', () => {
      expect(scaleScore(500, 500, 1000)).toBe(1000);
      expect(scaleScore(135, 135)).toBe(1000);
    });

    it('0点入力 → 0', () => {
      expect(scaleScore(0, 500, 1000)).toBe(0);
    });

    it('半分の得点 → target満点の半分', () => {
      expect(scaleScore(250, 500, 1000)).toBe(500);
    });

    it('targetMaxを省略すると1000が既定', () => {
      expect(scaleScore(50, 100)).toBe(500);
    });

    it('rawMaxが0以下なら0（ゼロ除算を起こさない）', () => {
      expect(scaleScore(10, 0)).toBe(0);
      expect(scaleScore(10, -5)).toBe(0);
    });

    it('満点を超える入力はclampされ、target満点を超えない', () => {
      expect(scaleScore(999, 500, 1000)).toBe(1000);
    });

    it('新潟の調査書135点満点をtargetMax=700(=1000×0.7)に換算 → 満点で700', () => {
      // registry.niigata の '7-3' 比率オプション（reportMax=700）と同じ換算構造の確認
      expect(scaleScore(135, 135, 700)).toBe(700);
      expect(scaleScore(0, 135, 700)).toBe(0);
    });
  });

  // --- requiredAcademicRaw（B-2：総合得点方式のreverseエンジン） ---
  describe('requiredAcademicRaw', () => {
    it('兵庫：満点内申(250)・目標500点 → 必要学力=500点(満点)', () => {
      const hyogo = getTotalScoreSystem('hyogo')!;
      const r = requiredAcademicRaw(hyogo, { targetTotal: 500, reportRaw: 250 });
      expect(r.requiredAcademicRaw).toBe(500);
    });

    it('兵庫：内申0・目標250点(内申換算満点相当) → 必要学力=学力素点500点満点中500点', () => {
      // 兵庫は内申換算250:学力換算250の1:1。内申換算0で目標250なら、学力換算側も250必要＝学力素点は満点(500)。
      const hyogo = getTotalScoreSystem('hyogo')!;
      const r = requiredAcademicRaw(hyogo, { targetTotal: 250, reportRaw: 0 });
      expect(r.requiredAcademicRaw).toBe(500);
    });

    it('目標が現在の内申点だけで届く場合、必要学力は0以下（既に到達）', () => {
      const hyogo = getTotalScoreSystem('hyogo')!;
      const r = requiredAcademicRaw(hyogo, { targetTotal: 100, reportRaw: 250 });
      expect(r.requiredAcademicRaw).toBeLessThanOrEqual(0);
    });

    it('学力満点でも届かない場合、必要学力は満点を超える', () => {
      const hyogo = getTotalScoreSystem('hyogo')!;
      const r = requiredAcademicRaw(hyogo, { targetTotal: 500, reportRaw: 0 });
      expect(r.requiredAcademicRaw).toBeGreaterThan(hyogo.academic.rawMax);
    });

    it('computeTotalScoreとの往復一致：requiredAcademicRawをそのまま入れると目標総合点に一致（丸め誤差を考慮）', () => {
      for (const [, system] of Object.entries(TOTAL_SCORE_SYSTEMS)) {
        const reportRaw = system.report.rawMax * 0.6;
        const targetTotal = Math.round((system.academic.rawMax + system.report.rawMax) * 0.5);
        const { requiredAcademicRaw: needed } = requiredAcademicRaw(system, { targetTotal, reportRaw });
        if (needed < 0 || needed > system.academic.rawMax) continue; // 範囲外は往復一致の対象外
        const r = computeTotalScore(system, { academicRaw: needed, reportRaw });
        expect(Math.abs(r.total - targetTotal)).toBeLessThanOrEqual(1);
      }
    });

    it('新潟（比率オプション指定）：7:3・内申満点(135) → 必要学力=学力満点換算(300)相当', () => {
      const niigata = getTotalScoreSystem('niigata')!;
      const r = requiredAcademicRaw(niigata, { targetTotal: 1000, reportRaw: 135, ratioOptionId: '7-3' });
      expect(r.requiredAcademicRaw).toBe(500); // reportConverted=700なので残り300 → 学力素点500点満点中500点
    });
  });

  // --- allowlist ---
  describe('allowlist', () => {
    it('検証済み県のみ true', () => {
      expect(isVerifiedTotalScore('hyogo')).toBe(true);
      expect(isVerifiedTotalScore('tochigi')).toBe(true);
      expect(isVerifiedTotalScore('miyagi')).toBe(false); // 第2層
      expect(isVerifiedTotalScore('oita')).toBe(false); // 二次情報・未確定
    });
  });
});
