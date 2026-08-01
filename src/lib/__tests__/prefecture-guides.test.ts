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

  test('未検証の他11県(手書きguideデータがある県のうち東京都・神奈川県・大阪府以外)はまだ解禁されていない', () => {
    for (const code of PREFECTURES_WITH_GUIDE) {
      if (code === 'tokyo' || code === 'kanagawa' || code === 'osaka') continue;
      expect(VERIFIED_PITFALLS_PREFECTURE_CODES.has(code)).toBe(false);
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
