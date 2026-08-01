import { getPrefectureGuide, VERIFIED_PITFALLS_PREFECTURE_CODES, PREFECTURES_WITH_GUIDE } from '../prefecture-guides';

// 2026-08-01: getPrefectureGuide()がPrefectureMinimumContent.tsxで一度も参照されない
// 死んだコードだった問題を修正した際に追加。pitfalls(物語調の解説)はUI表示前に事実確認が
// 必須(PREFECTURE_TRAPSのtopicタグ方式と同じ考え方)なため、VERIFIED_PITFALLS_PREFECTURE_CODESに
// 載っている県のみ表示してよい。
describe('VERIFIED_PITFALLS_PREFECTURE_CODES（事実確認済みの県のみ解禁）', () => {
  test('東京都は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('tokyo')).toBe(true);
  });

  test('神奈川県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('kanagawa')).toBe(true);
  });

  test('大阪府は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('osaka')).toBe(true);
  });

  test('埼玉県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('saitama')).toBe(true);
  });

  test('千葉県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('chiba')).toBe(true);
  });

  test('北海道は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('hokkaido')).toBe(true);
  });

  test('福岡県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('fukuoka')).toBe(true);
  });

  test('静岡県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('shizuoka')).toBe(true);
  });

  test('兵庫県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('hyogo')).toBe(true);
  });

  test('広島県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('hiroshima')).toBe(true);
  });

  test('愛知県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('aichi')).toBe(true);
  });

  test('青森県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('aomori')).toBe(true);
  });

  test('岩手県は事実確認済みで解禁されている', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('iwate')).toBe(true);
  });

  test('宮城県は事実確認済みで解禁されている(最後の1県・これでPREFECTURES_WITH_GUIDE全県が解禁される)', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has('miyagi')).toBe(true);
  });

  test('VERIFIED_PITFALLS_PREFECTURE_CODESはPREFECTURES_WITH_GUIDEと完全に一致する(全14県が検証済み)', () => {
    expect(VERIFIED_PITFALLS_PREFECTURE_CODES.size).toBe(PREFECTURES_WITH_GUIDE.size);
    for (const code of PREFECTURES_WITH_GUIDE) {
      expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has(code)).toBe(true);
    }
  });

  test('VERIFIED_PITFALLS_PREFECTURE_CODESは手書きguideデータが存在する県のみを含む(存在しない県を誤って解禁しない)', () => {
    for (const code of VERIFIED_PITFALLS_PREFECTURE_CODES) {
      expect(PREFECTURES_WITH_GUIDE.has(code)).toBe(true);
    }
  });
});

describe('東京都のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('5項目すべてがtitle/description相当の非空文字列を持つ', () => {
    const guide = getPrefectureGuide('tokyo');
    expect(guide.pitfalls.title.length).toBeGreaterThan(0);
    expect(guide.pitfalls.items).toHaveLength(5);
    for (const item of guide.pitfalls.items) {
      expect(item.length).toBeGreaterThan(0);
    }
  });

  test('ESAT-Jの点数(A=20点/D=8点)が一次情報と一致する記載になっている', () => {
    const guide = getPrefectureGuide('tokyo');
    const esatItem = guide.pitfalls.items.find((i) => i.includes('ESAT-J'));
    expect(esatItem).toContain('20点');
    expect(esatItem).toContain('8点');
  });

  test('自校作成問題の実施校に日比谷・西・国立が含まれる(2026年度の一次情報と一致)', () => {
    const guide = getPrefectureGuide('tokyo');
    const jikousakuseiItem = guide.pitfalls.items.find((i) => i.includes('自校作成問題'));
    expect(jikousakuseiItem).toContain('日比谷');
    expect(jikousakuseiItem).toContain('西');
    expect(jikousakuseiItem).toContain('国立');
  });

  test('裏取りできなかった「急増中」という傾向の断定は削除されている', () => {
    const guide = getPrefectureGuide('tokyo');
    const allText = guide.pitfalls.items.join('');
    expect(allText).not.toContain('急増中');
  });

  test('調査書点は定期テストの合計のみで決まるという言い切りは修正され、総合評価である旨が明記されている', () => {
    const guide = getPrefectureGuide('tokyo');
    const timingItem = guide.pitfalls.items.find((i) => i.includes('2学期'));
    expect(timingItem).toContain('総合評価');
  });
});

describe('神奈川県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('面接廃止は令和6(2024)年度からと正確に記載されている', () => {
    const guide = getPrefectureGuide('kanagawa');
    const item = guide.pitfalls.items.find((i) => i.includes('面接の廃止'));
    expect(item).toContain('令和6');
  });

  test('S値の比率は現行制度どおり2項目・合計10形式(旧「3項目」形式の事実誤りを修正)で記載されている', () => {
    const guide = getPrefectureGuide('kanagawa');
    const item = guide.pitfalls.items.find((i) => i.includes('S値の計算'));
    expect(item).toContain('3:7');
    expect(item).not.toContain('2:8:2');
  });

  test('裏取りできなかった頻度・傾向の断定(多発/極めて難しい)は削除されている', () => {
    const guide = getPrefectureGuide('kanagawa');
    const allText = guide.pitfalls.items.join('');
    expect(allText).not.toContain('多発');
    expect(allText).not.toContain('極めて難しい');
  });

  test('特色検査の実施校名(横浜翠嵐/柏陽/希望ケ丘)が一次情報と一致する', () => {
    const guide = getPrefectureGuide('kanagawa');
    const item = guide.pitfalls.items.find((i) => i.includes('特色検査の壁'));
    expect(item).toContain('横浜翠嵐');
    expect(item).toContain('柏陽');
    expect(item).toContain('希望ケ丘');
  });
});

describe('大阪府のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('選抜タイプは正しく「I〜V」の5段階と記載されている(旧「I〜III」表記の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('osaka');
    const item = guide.pitfalls.items.find((i) => i.includes('選抜タイプ'));
    expect(item).toContain('Ⅰ〜Ⅴ');
    expect(item).not.toContain('I〜III');
  });

  test('英検読み替え率(2級80%/準1級以上100%)が一次情報と一致する', () => {
    const guide = getPrefectureGuide('osaka');
    const item = guide.pitfalls.items.find((i) => i.includes('英語外部検定'));
    expect(item).toContain('80%');
    expect(item).toContain('100%');
  });

  test('チャレンジテストの評定平均範囲(目安±0.3)が一次情報と一致する', () => {
    const guide = getPrefectureGuide('osaka');
    const item = guide.pitfalls.items.find((i) => i.includes('チャレンジテスト'));
    expect(item).toContain('±0.3');
  });
});

describe('埼玉県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み・事実誤りなし)', () => {
  test('学校選択問題は数学・英語のみ対象・22校実施と一次情報と一致する', () => {
    const guide = getPrefectureGuide('saitama');
    const item = guide.pitfalls.items.find((i) => i.includes('学校選択問題'));
    expect(item).toContain('数学・英語');
    expect(item).toContain('22校');
  });

  test('5項目すべてが非空文字列を持つ', () => {
    const guide = getPrefectureGuide('saitama');
    expect(guide.pitfalls.items).toHaveLength(5);
    for (const item of guide.pitfalls.items) {
      expect(item.length).toBeGreaterThan(0);
    }
  });
});

describe('千葉県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('学校設定検査は面接・小論文・自己表現等7種類から1つ以上選ぶ制度と正確に記載されている(旧「自己表現が全校実施」の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('chiba');
    const item = guide.pitfalls.items.find((i) => i.includes('から1つ以上'));
    expect(item).toContain('面接');
    expect(item).toContain('小論文');
    expect(item).toContain('1つ以上');
  });

  test('2日間の入試日程の内訳(1日目英数国/2日目理社+学校設定検査)が一次情報と一致する', () => {
    const guide = getPrefectureGuide('chiba');
    const item = guide.pitfalls.items.find((i) => i.includes('2日間'));
    expect(item).toContain('1日目');
    expect(item).toContain('2日目');
  });
});

describe('北海道のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('学校裁量問題は2022年度に廃止済みと正確に記載されている(旧「裁量問題を出題する高校がある」の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('hokkaido');
    const item = guide.pitfalls.items.find((i) => i.includes('学校裁量問題'));
    expect(item).toContain('廃止');
    expect(item).toContain('共通問題');
  });

  test('学区制は道内19学区と一次情報と一致する', () => {
    const guide = getPrefectureGuide('hokkaido');
    const item = guide.pitfalls.items.find((i) => i.includes('学区制'));
    expect(item).toContain('19学区');
  });
});

describe('福岡県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み・事実誤りなし)', () => {
  test('特色化選抜は全員面接+一部学科で作文・実技と一次情報と一致する', () => {
    const guide = getPrefectureGuide('fukuoka');
    const item = guide.pitfalls.items.find((i) => i.includes('特色化選抜'));
    expect(item).toContain('全員に面接');
  });

  test('学区制は第1〜第13学区と一次情報と一致する', () => {
    const guide = getPrefectureGuide('fukuoka');
    const item = guide.pitfalls.items.find((i) => i.includes('学区制'));
    expect(item).toContain('第13学区');
  });
});

describe('静岡県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み・事実誤りなし)', () => {
  test('共通枠3段階審査の割合(75%/10%/15%)が一次情報と一致する', () => {
    const guide = getPrefectureGuide('shizuoka');
    const item = guide.pitfalls.items.find((i) => i.includes('共通枠'));
    expect(item).toContain('75%');
    expect(item).toContain('10%');
    expect(item).toContain('15%');
  });

  test('学校裁量枠は定員の50%以内と一次情報と一致する', () => {
    const guide = getPrefectureGuide('shizuoka');
    const item = guide.pitfalls.items.find((i) => i.includes('学校裁量枠'));
    expect(item).toContain('50%');
  });

  test('内申点の対象期間が第2学期末までと一次情報と一致する', () => {
    const guide = getPrefectureGuide('shizuoka');
    const item = guide.pitfalls.items.find((i) => i.includes('第2学期末'));
    expect(item).toBeDefined();
  });
});

describe('兵庫県のpitfalls/faq(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('実技4教科7.5倍・5教科4倍(250点満点)が一次情報と一致する', () => {
    const guide = getPrefectureGuide('hyogo');
    const item = guide.pitfalls.items.find((i) => i.includes('7.5倍'));
    expect(item).toContain('4倍');
  });

  test('複数志願選抜の加算点は学区により20〜30点と正確に記載されている(旧「25点」固定表記の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('hyogo');
    const faqItem = guide.faq.find((f) => f.question.includes('複数志願選抜'));
    expect(faqItem?.answer).toContain('20〜30点');
    expect(faqItem?.answer).toContain('第2志望の判定にはこの加算点は適用されません');
  });
});

describe('広島県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('令和5年度の制度改革で一次選抜に一本化(6:2:2)と正確に記載されている(旧「選抜Ⅰ/選抜Ⅱ」の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('hiroshima');
    const allText = guide.pitfalls.items.join('');
    expect(allText).toContain('6:2:2');
    expect(allText).not.toContain('選抜Ⅰ');
    expect(allText).not.toContain('選抜Ⅱ');
  });

  test('自己表現は面談方式で全校実施と一次情報と一致する', () => {
    const guide = getPrefectureGuide('hiroshima');
    const item = guide.pitfalls.items.find((i) => i.includes('自己表現'));
    expect(item).toContain('全校');
  });
});

describe('愛知県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('校内順位は5つの計算式Ⅰ〜Ⅴと正確に記載されている(旧「3タイプ(I型・II型・III型)」の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('aichi');
    const item = guide.pitfalls.items.find((i) => i.includes('校内順位'));
    expect(item).toContain('Ⅰ〜Ⅴ');
    expect(item).not.toContain('3タイプ（I型・II型・III型）');
  });

  test('全国唯一のA・Bグループ2校受験(複合選抜)が一次情報と一致する', () => {
    const guide = getPrefectureGuide('aichi');
    const item = guide.pitfalls.items.find((i) => i.includes('A・Bグループ'));
    expect(item).toContain('全国唯一');
  });
});

describe('青森県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('一般選抜は固定635点満点(500+135)と正確に記載されている(旧「学校ごとに比率選択」の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('aomori');
    const item = guide.pitfalls.items.find((i) => i.includes('635点満点'));
    expect(item).toBeDefined();
    expect(item).toContain('500点満点');
    expect(item).toContain('135点満点');
    const allText = guide.pitfalls.items.join('');
    expect(allText).not.toContain('7:3');
    expect(allText).not.toContain('5:5');
  });

  test('学年比率1:1:1均等が一次情報(prefectures.ts)と一致する', () => {
    const guide = getPrefectureGuide('aomori');
    const item = guide.pitfalls.items.find((i) => i.includes('1:1:1'));
    expect(item).toBeDefined();
  });
});

describe('岩手県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み)', () => {
  test('実技3倍・5教科2倍・学年比1:2:3・660→440換算がprefectures.tsと一致する', () => {
    const guide = getPrefectureGuide('iwate');
    const allText = guide.pitfalls.items.join('');
    expect(allText).toContain('評定×3倍');
    expect(allText).toContain('評定×2倍');
    expect(allText).toContain('1：2：3');
    expect(allText).toContain('440点満点');
  });

  test('A選考・B選考・C選考は一般選抜の学力:調査書比率タイプと正確に記載されている(旧「推薦入試の区分」という事実誤りを修正)', () => {
    const guide = getPrefectureGuide('iwate');
    const item = guide.pitfalls.items.find((i) => i.includes('A選考・B選考・C選考'));
    expect(item).toContain('5:5');
    expect(item).toContain('特色選抜');
    expect(item).not.toContain('通学区域内の生徒が対象のA選考');
  });
});

describe('宮城県のpitfalls(2026-08-01にWebSearchで個別に裏取り済み・最後の1県)', () => {
  test('共通選抜・特色選抜の募集割合は高校ごとに50〜90%/10〜50%の幅があると正確に記載されている(旧「70%/30%」固定表記の事実誤りを修正)', () => {
    const guide = getPrefectureGuide('miyagi');
    const item = guide.pitfalls.items.find((i) => i.includes('募集割合は高校ごとに違う'));
    expect(item).toContain('50〜90%');
    expect(item).toContain('10〜50%');
    const allText = guide.pitfalls.items.join('');
    expect(allText).not.toContain('共通選抜（70%）');
  });

  test('トップ校の学力検査比率は確定できない数値のため断定を避けて記載されている(情報源間で3:7/6:4の不一致があったため)', () => {
    const guide = getPrefectureGuide('miyagi');
    const item = guide.pitfalls.items.find((i) => i.includes('トップ校は当日点重視'));
    expect(item).not.toContain('3:7');
  });

  test('実技2倍・195点満点・学年均等がprefectures.tsと一致する', () => {
    const guide = getPrefectureGuide('miyagi');
    const allText = guide.pitfalls.items.join('');
    expect(allText).toContain('2倍');
    expect(allText).toContain('195点満点');
  });
});
