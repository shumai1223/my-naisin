import { DATA_LICENSE_LEDGER, redistributableOkPrefectures } from '../data-license-ledger';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

describe('DATA_LICENSE_LEDGER（T-S13A A-1・47県利用条件台帳）', () => {
  test('COMPETITION_RATE_BY_PREFECTUREにある全県が台帳に存在する（漏れなし）', () => {
    const dataCodes = Object.keys(COMPETITION_RATE_BY_PREFECTURE).sort();
    const ledgerCodes = Object.keys(DATA_LICENSE_LEDGER).sort();
    expect(ledgerCodes).toEqual(dataCodes);
  });

  test('台帳の各エントリのkeyとprefectureフィールドが一致する（コピペミス防止）', () => {
    for (const [key, entry] of Object.entries(DATA_LICENSE_LEDGER)) {
      expect(entry.prefecture).toBe(key);
    }
  });

  test('redistribution="ok"のエントリは必ずevidenceとverifiedAtを持つ（判断の根拠なきok禁止）', () => {
    for (const entry of Object.values(DATA_LICENSE_LEDGER)) {
      if (entry.redistribution !== 'ok') continue;
      expect(entry.evidence.length).toBeGreaterThan(0);
      expect(entry.verifiedAt).not.toBeNull();
    }
  });

  test('redistribution="unknown"のエントリはverifiedAtがnull（未確認を確認済みと偽らない）', () => {
    for (const entry of Object.values(DATA_LICENSE_LEDGER)) {
      if (entry.redistribution !== 'unknown') continue;
      expect(entry.verifiedAt).toBeNull();
    }
  });

  test('mie: 三重県教育委員会の回答により"ok"（出典明記のうえでの引用・紹介を許諾）', () => {
    expect(DATA_LICENSE_LEDGER.mie.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.mie.evidence).toContain('出典を明記のうえ紹介いただくことは差し支えございません');
  });

  test('gifu: 回答はリンク可否のみで再配布可否には未言及のため"unknown"のまま（誤ってokにしない）', () => {
    expect(DATA_LICENSE_LEDGER.gifu.redistribution).toBe('unknown');
  });

  test('fukuoka: 令和6年度分は商用第三者(育伸社)ソースであることが理由に明記されており"unknown"のまま', () => {
    expect(DATA_LICENSE_LEDGER.fukuoka.redistribution).toBe('unknown');
    expect(DATA_LICENSE_LEDGER.fukuoka.evidence).toContain('育伸社');
    expect(DATA_LICENSE_LEDGER.fukuoka.evidence).toContain('令和6年度分191件');
  });

  test('redistributableOkPrefectures()は現時点でmieのみを返す（kill_criteria: 10県未満のため商品化はまだ未達）', () => {
    // ⚠️このテストはA-1着手直後の状態を記録するリグレッションガード。次のセッションが県を
    // 追加調査してokが増えたら、この配列を実態に合わせて更新すること（減ることは無いはず）。
    expect(redistributableOkPrefectures()).toEqual(['mie']);
  });
});
