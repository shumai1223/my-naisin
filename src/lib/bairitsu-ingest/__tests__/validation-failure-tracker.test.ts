import { recordValidationOutcome, type ValidationFailureLedger } from '../validation-failure-tracker';

describe('recordValidationOutcome', () => {
  it('starts a new prefecture entry at consecutiveFailures=1 on a first failure and does not escalate yet', () => {
    const { ledger, shouldEscalate } = recordValidationOutcome({}, 'yamanashi', false, '2026-09-06T00:00:00Z');
    expect(ledger.yamanashi).toEqual({ consecutiveFailures: 1, lastCheckedAt: '2026-09-06T00:00:00Z', lastOk: false });
    expect(shouldEscalate).toBe(false);
  });

  it('does not mutate the ledger passed in (pure function)', () => {
    const original: ValidationFailureLedger = { yamanashi: { consecutiveFailures: 1, lastCheckedAt: 't0', lastOk: false } };
    const frozenCopy = JSON.parse(JSON.stringify(original));
    recordValidationOutcome(original, 'yamanashi', false, 't1');
    expect(original).toEqual(frozenCopy);
  });

  it('resets consecutiveFailures to 0 on a success, regardless of prior failure streak', () => {
    let state = recordValidationOutcome({}, 'yamanashi', false, 't0').ledger;
    state = recordValidationOutcome(state, 'yamanashi', false, 't1').ledger;
    const { ledger, shouldEscalate } = recordValidationOutcome(state, 'yamanashi', true, 't2');
    expect(ledger.yamanashi).toEqual({ consecutiveFailures: 0, lastCheckedAt: 't2', lastOk: true });
    expect(shouldEscalate).toBe(false);
  });

  it('escalates exactly on the 3rd consecutive failure (structural-change suspicion threshold from the runbook)', () => {
    let state: ValidationFailureLedger = {};
    let result = recordValidationOutcome(state, 'yamanashi', false, 't0');
    expect(result.shouldEscalate).toBe(false);
    state = result.ledger;
    result = recordValidationOutcome(state, 'yamanashi', false, 't1');
    expect(result.shouldEscalate).toBe(false);
    state = result.ledger;
    result = recordValidationOutcome(state, 'yamanashi', false, 't2');
    expect(result.shouldEscalate).toBe(true);
    expect(result.ledger.yamanashi.consecutiveFailures).toBe(3);
  });

  it('does not re-escalate on the 4th+ consecutive failure (avoids spamming the same note every run)', () => {
    let state: ValidationFailureLedger = {};
    for (let i = 0; i < 3; i++) {
      state = recordValidationOutcome(state, 'yamanashi', false, `t${i}`).ledger;
    }
    const fourth = recordValidationOutcome(state, 'yamanashi', false, 't3');
    expect(fourth.shouldEscalate).toBe(false);
    expect(fourth.ledger.yamanashi.consecutiveFailures).toBe(4);
  });

  it('tracks each prefecture independently (one prefecture failing does not affect another\'s streak)', () => {
    let state: ValidationFailureLedger = {};
    state = recordValidationOutcome(state, 'yamanashi', false, 't0').ledger;
    state = recordValidationOutcome(state, 'chiba', true, 't0').ledger;
    expect(state.yamanashi.consecutiveFailures).toBe(1);
    expect(state.chiba.consecutiveFailures).toBe(0);
  });
});
