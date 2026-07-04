/**
 * 塾診断エンジン（Build 2）の不変条件テスト。
 * 決定論・全入力総当たりで「デッドリンク0／保護者面OK／地域整合」を機械検証する。
 */
import {
  matchJuku,
  recommendJuku,
  describeJuku,
  JUKU_OFFERS,
  type JukuFormat,
  type JukuSituation,
  type JukuMatchInput,
} from '../juku-match';
import { AFFILIATES, isLiveAffiliate, type AffiliateId } from '../affiliates';
import { isParentSafeOffer } from '../affiliate-economics';

const PREFS: (string | undefined)[] = [undefined, 'tokyo', 'osaka', 'hokkaido', 'aichi', 'fukuoka'];
const FORMATS: JukuFormat[] = ['online', 'in-person', 'any'];
const SITUATIONS: JukuSituation[] = ['normal', 'futoukou', 'top'];
const GRADES = [1, 2, 3];
const GAPS = [null, 3, 20];

function everyInput(fn: (input: JukuMatchInput) => void) {
  for (const prefectureCode of PREFS)
    for (const format of FORMATS)
      for (const situation of SITUATIONS)
        for (const grade of GRADES)
          for (const gap of GAPS) fn({ prefectureCode, format, situation, grade, gap });
}

/** 実リンクが確定している（pendingの '#' でない）か。 */
function hasRealLink(id: AffiliateId): boolean {
  const a = AFFILIATES[id];
  return !!a && a.href !== '#' && a.href.trim().length > 0;
}

describe('matchJuku（全入力総当たりの不変条件）', () => {
  it('どの入力でも 1〜3 件を返す（フォールバックの空振り無し）', () => {
    everyInput((input) => {
      const r = matchJuku(input);
      expect(r.length).toBeGreaterThanOrEqual(1);
      expect(r.length).toBeLessThanOrEqual(3);
      // 重複が無い
      expect(new Set(r).size).toBe(r.length);
    });
  });

  it('返る案件は必ず live・実リンク確定（デッドリンクを出さない）', () => {
    everyInput((input) => {
      for (const id of matchJuku(input)) {
        expect(isLiveAffiliate(id)).toBe(true);
        expect(hasRealLink(id)).toBe(true);
      }
    });
  });

  it('返る案件は必ず保護者面OK（有料成約paidを出さない）', () => {
    everyInput((input) => {
      for (const id of matchJuku(input)) {
        expect(isParentSafeOffer(id)).toBe(true);
      }
    });
  });

  it('地域整合：関西入力に森塾（関東）を出さない／関東入力に個別指導キャンパス（関西）を出さない', () => {
    for (const format of FORMATS) {
      for (const situation of SITUATIONS) {
        const kansai = matchJuku({ prefectureCode: 'osaka', format, situation });
        expect(kansai).not.toContain('morijuku-text');
        const kanto = matchJuku({ prefectureCode: 'tokyo', format, situation });
        expect(kanto).not.toContain('campus-text');
      }
    }
  });

  it('対面塾は地盤地域が一致する時だけ（地盤塾のない地域では対面塾を出さない）', () => {
    // 北海道・愛知・福岡は JUKU_OFFERS に対面塾の地盤が無い＝対面塾IDは出ない
    const noBaseRegions = ['hokkaido', 'aichi', 'fukuoka'];
    for (const prefectureCode of noBaseRegions) {
      const r = matchJuku({ prefectureCode, format: 'in-person' });
      expect(r).not.toContain('morijuku-text');
      expect(r).not.toContain('campus-text');
      expect(r.length).toBeGreaterThanOrEqual(1); // オンラインにフォールバックして必ず出る
    }
  });

  it('オンライン希望では対面塾を出さない', () => {
    for (const prefectureCode of ['tokyo', 'osaka']) {
      const r = matchJuku({ prefectureCode, format: 'online' });
      expect(r).not.toContain('morijuku-text');
      expect(r).not.toContain('campus-text');
    }
  });

  it('不登校の状況では不登校対応の在庫のみ（一般塾を出さない）', () => {
    const futoukouIds = JUKU_OFFERS.filter((o) => o.forFutoukou).map((o) => o.id);
    everyInput((input) => {
      if (input.situation !== 'futoukou') return;
      for (const id of matchJuku(input)) {
        expect(futoukouIds).toContain(id);
      }
    });
  });

  it('不登校でない状況では不登校専門枠を出さない（文脈違いを避ける）', () => {
    const futoukouIds = new Set(JUKU_OFFERS.filter((o) => o.forFutoukou).map((o) => o.id));
    everyInput((input) => {
      if (input.situation === 'futoukou') return;
      for (const id of matchJuku(input)) {
        expect(futoukouIds.has(id)).toBe(false);
      }
    });
  });

  it('難関志望では学習コーチング（studycoach）が推薦に含まれ最上位に来る', () => {
    const r = matchJuku({ prefectureCode: 'tokyo', situation: 'top', format: 'online', gap: 20 });
    expect(r).toContain('moshimo-studycoach');
    expect(r[0]).toBe('moshimo-studycoach');
  });

  it('対面希望×地盤地域では地盤塾が最上位に来る', () => {
    expect(matchJuku({ prefectureCode: 'osaka', format: 'in-person' })[0]).toBe('campus-text');
    expect(matchJuku({ prefectureCode: 'tokyo', format: 'in-person' })[0]).toBe('morijuku-text');
  });
});

describe('describeJuku / recommendJuku（表示用）', () => {
  it('describeJuku は塾ユニバース内の live 案件に事実つき説明を返す', () => {
    const d = describeJuku('sora-juku-text');
    expect(d).not.toBeNull();
    expect(d!.programName).toBeTruthy();
    expect(d!.formatLabel).toBeTruthy();
    expect(d!.fact).toBeTruthy();
  });

  it('describeJuku は塾ユニバース外のIDに null を返す（FP等は塾診断で出さない）', () => {
    expect(describeJuku('fp-soudan')).toBeNull();
    expect(describeJuku('zkai-text-request')).toBeNull();
  });

  it('recommendJuku は matchJuku と同じ件数の説明を返す（欠落なし）', () => {
    everyInput((input) => {
      const ids = matchJuku(input);
      const recs = recommendJuku(input);
      expect(recs.map((r) => r.id)).toEqual(ids);
    });
  });

  it('全ての塾ユニバース案件は事実に誇大表現・合否の断定を含まない', () => {
    for (const o of JUKU_OFFERS) {
      expect(o.fact).not.toMatch(/必ず|絶対|合格保証|確実に合格/);
    }
  });
});
