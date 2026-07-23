/**
 * @jest-environment node
 *
 * 塾SaaS MVP(ZZ-4a)のスキーマ層契約テスト。招待トークンの生成・ハッシュ化(純関数)と、
 * D1未バインド環境(jest)での全関数のno-op安全性(例外を投げない・入力バリデーションが先に効く)を固定する。
 */
import {
  generateInviteTokenPlaintext,
  hashInviteToken,
  createJukuAccount,
  verifyInviteToken,
  addJukuStudent,
  listJukuStudents,
  addScoreSnapshot,
  getStudentSnapshots,
} from '../juku-saas-db';

describe('generateInviteTokenPlaintext', () => {
  test('jinv_ プレフィックス+40桁16進を返す', () => {
    const token = generateInviteTokenPlaintext();
    expect(token).toMatch(/^jinv_[0-9a-f]{40}$/);
  });

  test('呼ぶたびに異なるトークンを返す(衝突しない)', () => {
    const a = generateInviteTokenPlaintext();
    const b = generateInviteTokenPlaintext();
    expect(a).not.toBe(b);
  });
});

describe('hashInviteToken', () => {
  test('SHA-256相当の64桁16進を返す', async () => {
    const hash = await hashInviteToken('jinv_test');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  test('同じ入力は同じハッシュ(決定論)', async () => {
    const a = await hashInviteToken('jinv_abc');
    const b = await hashInviteToken('jinv_abc');
    expect(a).toBe(b);
  });

  test('異なる入力は異なるハッシュ', async () => {
    const a = await hashInviteToken('jinv_abc');
    const b = await hashInviteToken('jinv_xyz');
    expect(a).not.toBe(b);
  });
});

describe('createJukuAccount（D1未バインド環境=jest）', () => {
  test('空文字・空白のみの塾名はD1に触れず即null', async () => {
    expect(await createJukuAccount('')).toBeNull();
    expect(await createJukuAccount('   ')).toBeNull();
  });

  test('正当な名前でもD1未バインドならnull(例外を投げない)', async () => {
    expect(await createJukuAccount('そら塾')).toBeNull();
  });
});

describe('verifyInviteToken（D1未バインド環境=jest）', () => {
  test('空文字はD1に触れず即null', async () => {
    expect(await verifyInviteToken('')).toBeNull();
  });

  test('D1未バインドならnull(例外を投げない)', async () => {
    expect(await verifyInviteToken('jinv_doesnotexist')).toBeNull();
  });
});

describe('addJukuStudent（D1未バインド環境=jest）', () => {
  test('表示名が空ならD1に触れず即false', async () => {
    expect(await addJukuStudent(1, '')).toBe(false);
  });

  test('juku_account_idが不正(NaN)ならfalse', async () => {
    expect(await addJukuStudent(NaN, '生徒A')).toBe(false);
  });

  test('正当な入力でもD1未バインドならfalse(例外を投げない)', async () => {
    expect(await addJukuStudent(1, '生徒A', 'tokyo')).toBe(false);
  });
});

describe('listJukuStudents（D1未バインド環境=jest）', () => {
  test('D1未バインドなら空配列', async () => {
    await expect(listJukuStudents(1)).resolves.toEqual([]);
  });
});

describe('addScoreSnapshot（D1未バインド環境=jest）', () => {
  test('studentIdが不正ならD1に触れず即false', async () => {
    expect(
      await addScoreSnapshot({ studentId: NaN, metric: 'naishin', value: 52, recordedAt: '2026-07-24' })
    ).toBe(false);
  });

  test('valueが不正ならfalse', async () => {
    expect(
      await addScoreSnapshot({ studentId: 1, metric: 'hensachi', value: NaN, recordedAt: '2026-07-24' })
    ).toBe(false);
  });

  test('正当な入力でもD1未バインドならfalse(例外を投げない)', async () => {
    expect(
      await addScoreSnapshot({ studentId: 1, metric: 'naishin', value: 52, maxValue: 65, recordedAt: '2026-07-24' })
    ).toBe(false);
  });
});

describe('getStudentSnapshots（D1未バインド環境=jest）', () => {
  test('D1未バインドなら空配列', async () => {
    await expect(getStudentSnapshots(1)).resolves.toEqual([]);
  });
});
