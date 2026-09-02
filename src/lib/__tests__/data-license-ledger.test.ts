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

  test('gifu: 岐阜県教育委員会の追加回答(2026-08-17)により"ok"（応募状況データの掲載を明示的に許諾）', () => {
    expect(DATA_LICENSE_LEDGER.gifu.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.gifu.evidence).toContain('出典等の表記については、ご提示いただいた');
  });

  test('fukuoka: 令和6年度分は商用第三者(育伸社)ソースであることが理由に明記されており"unknown"のまま', () => {
    expect(DATA_LICENSE_LEDGER.fukuoka.redistribution).toBe('unknown');
    expect(DATA_LICENSE_LEDGER.fukuoka.evidence).toContain('育伸社');
    expect(DATA_LICENSE_LEDGER.fukuoka.evidence).toContain('令和6年度分191件');
  });

  test('okinawa: 沖縄県教育委員会の回答(2026-08-24)により"ok"（転載・被リンクとも明示的に許諾した唯一の県）', () => {
    expect(DATA_LICENSE_LEDGER.okinawa.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.okinawa.evidence).toContain('差し支えございません');
    expect(DATA_LICENSE_LEDGER.okinawa.verifiedAt).toBe('2026-08-24');
  });

  test('ibaraki: 茨城県教育庁高校教育課の回答(2026-08-26)により"ok"（応募状況データの掲載を明示的に許諾）', () => {
    expect(DATA_LICENSE_LEDGER.ibaraki.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.ibaraki.evidence).toContain('掲載していただくことは差し支えありません');
    expect(DATA_LICENSE_LEDGER.ibaraki.verifiedAt).toBe('2026-08-26');
  });

  test('akita: 秋田県教育庁高校教育課の追撃回答(2026-08-26)により"ok"（応募状況データの掲載を明示的に許諾）', () => {
    expect(DATA_LICENSE_LEDGER.akita.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.akita.evidence).toContain('掲載につきましては差し支えございません');
    expect(DATA_LICENSE_LEDGER.akita.verifiedAt).toBe('2026-08-26');
  });

  test('ishikawa: 石川県教育委員会学校指導課の追撃回答(2026-08-31)により"ok"（応募状況データの掲載を明示的に許諾）', () => {
    expect(DATA_LICENSE_LEDGER.ishikawa.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.ishikawa.evidence).toContain('該当PDFのリンクを掲載する形でご対応ください');
    expect(DATA_LICENSE_LEDGER.ishikawa.verifiedAt).toBe('2026-08-31');
  });

  test('kagawa: 香川県教育委員会高校教育課の追撃回答(2026-09-01)により"ok"（応募状況データの掲載を明示的に許諾）', () => {
    expect(DATA_LICENSE_LEDGER.kagawa.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.kagawa.evidence).toContain('お使いいただくことには差し支えありません');
    expect(DATA_LICENSE_LEDGER.kagawa.verifiedAt).toBe('2026-09-01');
  });

  test('chiba: 千葉県教育庁学習指導課の回答(2026-09-02)により"ok"（応募状況データの掲載を明示的に許諾）', () => {
    expect(DATA_LICENSE_LEDGER.chiba.redistribution).toBe('ok');
    expect(DATA_LICENSE_LEDGER.chiba.evidence).toContain('貴サイトに掲載しても構いません');
    expect(DATA_LICENSE_LEDGER.chiba.verifiedAt).toBe('2026-09-02');
  });

  test('redistributableOkPrefectures()は現時点でakita/chiba/gifu/ibaraki/ishikawa/kagawa/mie/okinawaの8県を返す（kill_criteria: 10県未満のため商品化はまだ未達）', () => {
    // ⚠️このテストはA-1進捗を記録するリグレッションガード。次のセッションが県を
    // 追加調査してokが増えたら、この配列を実態に合わせて更新すること（減ることは無いはず）。
    expect(redistributableOkPrefectures().sort()).toEqual(['akita', 'chiba', 'gifu', 'ibaraki', 'ishikawa', 'kagawa', 'mie', 'okinawa']);
  });
});
