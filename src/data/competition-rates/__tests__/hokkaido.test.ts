import { HOKKAIDO_COMPETITION_RATES } from '../hokkaido';

/**
 * Y-6 DoD検証（北海道・coverage='partial'・空知+石狩(全日制普通科)+札幌市(市立高校)
 * +後志(全日制普通科)+胆振(全日制普通科)+日高(全日制)+渡島(全日制)+檜山(全日制)）。
 *
 * 北海道は2026-08-06までΛ-4・Y-6いずれも恒久ブロック扱いだったが、教委公式ページの
 * 別シリーズ資料を発見し空知地区・石狩地区(普通科)・札幌市(市立)・後志地区(普通科)・
 * 胆振地区(普通科)・日高地区(全日制)・渡島地区(全日制)・檜山地区(全日制)分に着手した
 * （詳細はhokkaido.tsのコメント参照）。各行「finalApplicants ÷ quota ≒ finalRate」の
 * 内部整合性のみを検証する（公式グランドトータル行は原資料に印字されておらず突合対象が無いため）。
 */
describe('北海道 倍率パイプラインα（Y-6・空知29+石狩31+札幌市9+後志6+胆振11+日高7+渡島29+檜山4=126レコード・coverage=partial）', () => {
  const { records } = HOKKAIDO_COMPETITION_RATES;

  it('coverageがpartialを示している', () => {
    expect(HOKKAIDO_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('126レコードが収録されている', () => {
    expect(records.length).toBe(126);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値(applicants/quota)と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('空知地区の学校が含まれる(岩見沢東・滝川・岩見沢農業等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('岩見沢東')).toBe(true);
    expect(schools.has('滝川')).toBe(true);
    expect(schools.has('岩見沢農業')).toBe(true);
  });

  it('石狩地区の学校が含まれる(札幌東・札幌国際情報・恵庭北等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('札幌東')).toBe(true);
    expect(schools.has('札幌国際情報')).toBe(true);
    expect(schools.has('恵庭北')).toBe(true);
  });

  it('札幌市(市立高校)の学校が含まれる(市立札幌旭丘・市立札幌新川・市立札幌啓北商業等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('市立札幌旭丘')).toBe(true);
    expect(schools.has('市立札幌新川')).toBe(true);
    expect(schools.has('市立札幌啓北商業')).toBe(true);
  });

  it('後志地区の学校が含まれる(小樽潮陵・倶知安・岩内等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('小樽潮陵')).toBe(true);
    expect(schools.has('倶知安')).toBe(true);
    expect(schools.has('岩内')).toBe(true);
  });

  it('胆振地区の学校が含まれる(室蘭栄・苫小牧東・伊達開来等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('室蘭栄')).toBe(true);
    expect(schools.has('苫小牧東')).toBe(true);
    expect(schools.has('伊達開来')).toBe(true);
  });

  it('日高地区の学校が含まれる(静内・平取・えりも・浦河総合等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('静内')).toBe(true);
    expect(schools.has('平取')).toBe(true);
    expect(schools.has('えりも')).toBe(true);
    expect(schools.has('浦河総合')).toBe(true);
  });

  it('渡島地区の学校が含まれる(函館中部・市立函館・知内・函館工業・森等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('函館中部')).toBe(true);
    expect(schools.has('市立函館')).toBe(true);
    expect(schools.has('知内')).toBe(true);
    expect(schools.has('函館工業')).toBe(true);
    expect(schools.has('森')).toBe(true);
  });

  it('檜山地区の学校が含まれる(江差・上ノ国・奥尻・檜山北)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('江差')).toBe(true);
    expect(schools.has('上ノ国')).toBe(true);
    expect(schools.has('奥尻')).toBe(true);
    expect(schools.has('檜山北')).toBe(true);
  });
});
