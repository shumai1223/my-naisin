import { HOKKAIDO_COMPETITION_RATES } from '../hokkaido';

/**
 * Y-6 DoD検証（北海道・coverage='partial'・空知+石狩(全日制普通科)+札幌市(市立高校)
 * +後志(全日制普通科)+胆振(全日制普通科)+日高(全日制)+渡島(全日制)+檜山(全日制)+上川(全日制)
 * +留萌(全日制)+宗谷(全日制)+オホーツク(全日制)+十勝(全日制)+釧路(全日制)+根室(全日制)＝
 * 全14管内すべてに着手済み）。
 *
 * 北海道は2026-08-06までΛ-4・Y-6いずれも恒久ブロック扱いだったが、教委公式ページの
 * 別シリーズ資料(全14頁)を発見し空知地区・石狩地区(普通科)・札幌市(市立)・後志地区(普通科)・
 * 胆振地区(普通科)・日高地区(全日制)・渡島地区(全日制)・檜山地区(全日制)・上川地区(全日制)・
 * 留萌地区(全日制)・宗谷地区(全日制)・オホーツク地区(全日制)・十勝地区(全日制)・釧路地区(全日制)・
 * 根室地区(全日制)の全14管内に着手した（詳細はhokkaido.tsのコメント参照）。各行
 * 「finalApplicants ÷ quota ≒ finalRate」の内部整合性のみを検証する（公式グランドトータル行は
 * 原資料に印字されておらず突合対象が無いため）。
 */
describe('北海道 倍率パイプラインα（Y-6・R8=323レコード＋掛-1(空知+石狩+札幌市+後志+胆振+日高+渡島+檜山+上川+留萌+宗谷+オホーツク):R7=265レコード＝588レコード・coverage=partial・全14管内着手済み）', () => {
  const { records } = HOKKAIDO_COMPETITION_RATES;

  it('coverageがpartialを示している', () => {
    expect(HOKKAIDO_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('588レコードが収録されている(R8年度323+R7年度265)', () => {
    expect(records.length).toBe(588);
    expect(records.filter((r) => r.fiscalYear === '令和7年度（2025年度）').length).toBe(265);
    expect(records.filter((r) => !r.fiscalYear).length).toBe(323);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値(applicants/quota)と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名+年度(掛-1・省略時は既定年度扱い)の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? 'default'}`;
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

  it('石狩地区の専門教育学科の学校が含まれる(札幌工業・札幌琴似工業・札幌東商業・石狩翔陽)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('札幌工業')).toBe(true);
    expect(schools.has('札幌琴似工業')).toBe(true);
    expect(schools.has('札幌東商業')).toBe(true);
    expect(schools.has('石狩翔陽')).toBe(true);
  });

  it('千歳高校が普通科と2つの専門学科(国際教養・国際流通)を別レコードで持つ(結合セル誤読の再発防止)', () => {
    const chitose = records.filter((r) => r.schoolName === '千歳');
    const departments = [...new Set(chitose.map((r) => r.department))].sort();
    expect(departments).toEqual(['国際教養', '国際流通', '普通']);
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

  it('後志地区の専門教育学科の学校が含まれる(小樽未来創造・小樽水産・余市紅志・ニセコ国際)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('小樽未来創造')).toBe(true);
    expect(schools.has('小樽水産')).toBe(true);
    expect(schools.has('余市紅志')).toBe(true);
    expect(schools.has('ニセコ国際')).toBe(true);
  });

  it('胆振地区の学校が含まれる(室蘭栄・苫小牧東・伊達開来等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('室蘭栄')).toBe(true);
    expect(schools.has('苫小牧東')).toBe(true);
    expect(schools.has('伊達開来')).toBe(true);
  });

  it('胆振地区の専門教育学科の学校が含まれる(室蘭工業・苫小牧工業・苫小牧総合経済・室蘭東翔)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('室蘭工業')).toBe(true);
    expect(schools.has('苫小牧工業')).toBe(true);
    expect(schools.has('苫小牧総合経済')).toBe(true);
    expect(schools.has('室蘭東翔')).toBe(true);
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

  it('上川地区の学校が含まれる(旭川東・旭川農業・旭川商業・剣淵等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('旭川東')).toBe(true);
    expect(schools.has('旭川農業')).toBe(true);
    expect(schools.has('旭川商業')).toBe(true);
    expect(schools.has('剣淵')).toBe(true);
  });

  it('留萌地区の学校が含まれる(留萌・羽幌・遠別農業・苫前商業)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('留萌')).toBe(true);
    expect(schools.has('羽幌')).toBe(true);
    expect(schools.has('遠別農業')).toBe(true);
    expect(schools.has('苫前商業')).toBe(true);
  });

  it('宗谷地区の学校が含まれる(稚内・利尻・礼文・稚内商業)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('稚内')).toBe(true);
    expect(schools.has('利尻')).toBe(true);
    expect(schools.has('礼文')).toBe(true);
    expect(schools.has('稚内商業')).toBe(true);
  });

  it('オホーツク地区の学校が含まれる(北見北斗・網走南ケ丘・北見商業・大空等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('北見北斗')).toBe(true);
    expect(schools.has('網走南ケ丘')).toBe(true);
    expect(schools.has('北見商業')).toBe(true);
    expect(schools.has('大空')).toBe(true);
  });

  it('十勝地区の学校が含まれる(帯広柏葉・帯広農業・帯広工業・池田等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('帯広柏葉')).toBe(true);
    expect(schools.has('帯広農業')).toBe(true);
    expect(schools.has('帯広工業')).toBe(true);
    expect(schools.has('池田')).toBe(true);
  });

  it('釧路地区の学校が含まれる(釧路湖陵・釧路工業・釧路商業・標茶等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('釧路湖陵')).toBe(true);
    expect(schools.has('釧路工業')).toBe(true);
    expect(schools.has('釧路商業')).toBe(true);
    expect(schools.has('標茶')).toBe(true);
  });

  it('根室地区の学校が含まれる(根室・別海・中標津・羅臼)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('根室')).toBe(true);
    expect(schools.has('別海')).toBe(true);
    expect(schools.has('中標津')).toBe(true);
    expect(schools.has('羅臼')).toBe(true);
  });
});
