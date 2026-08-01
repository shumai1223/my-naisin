import { generateDynamicTraps, getPrefectureTraps, PREFECTURE_TRAPS } from '../prefecture-traps';
import { PREFECTURES } from '../prefectures';

function pref(code: string) {
  const p = PREFECTURES.find((x) => x.code === code);
  if (!p) throw new Error(`prefecture not found: ${code}`);
  return p;
}

describe('generateDynamicTraps', () => {
  // 2026-08-01: 外部の教育系ブロガーからのフィードバックを受けて追加した鹿児島県固有の注意点。
  // 「実技教科×20倍」という配点上の傾斜だけを見て「実技を優先すればよい」と誤読させないための
  // 明示的な注記（実際の選抜運用は学力検査重視との指摘があることを併記する）。
  test('鹿児島県は配点上の実技傾斜と実選抜運用の乖離に関する注意点を含む', () => {
    const traps = generateDynamicTraps(pref('kagoshima'));
    const trap = traps.find((t) => t.title === '配点上の実技傾斜と実際の選抜運用は一致しないとの指摘がある');
    expect(trap).toBeDefined();
    expect(trap?.description).toContain('教育委員会の公式見解ではなく');
  });

  test('鹿児島県固有の注意点は他県には出ない（誤って全県共通化しない）', () => {
    for (const code of ['tokyo', 'kanagawa', 'osaka', 'ehime']) {
      const traps = generateDynamicTraps(pref(code));
      expect(traps.some((t) => t.title === '配点上の実技傾斜と実際の選抜運用は一致しないとの指摘がある')).toBe(false);
    }
  });

  test('実技教科の傾斜配点(practicalMultiplier>coreMultiplier)の県は「実技教科が傾斜配点」トラップを含む', () => {
    const traps = generateDynamicTraps(pref('tokyo'));
    expect(traps.some((t) => t.title === '実技教科が傾斜配点')).toBe(true);
  });

  test('全ての生成トラップはtitle/description/impact/solutionを持つ(空文字なし)', () => {
    for (const p of PREFECTURES) {
      const traps = generateDynamicTraps(p);
      for (const t of traps) {
        expect(t.title.length).toBeGreaterThan(0);
        expect(t.description.length).toBeGreaterThan(0);
        expect(t.solution.length).toBeGreaterThan(0);
        expect(['high', 'medium', 'low']).toContain(t.impact);
      }
    }
  });
});

// 2026-08-01: PrefectureMinimumContent.tsxが`const traps = dynamicTraps`で手動キュレーション
// (PREFECTURE_TRAPS)を完全に無視していた死んだコード問題を修正した際に追加。
// topicタグを持つ手動キュレーション分を優先し、同トピックの動的生成分と重複させない設計。
describe('getPrefectureTraps（手動キュレーション優先・動的生成で補完・重複除去）', () => {
  test('東京都はtopicタグ付きの手動キュレーション3件(ESAT-J/実技/学年)＋重複しない動的生成分を含む', () => {
    const traps = getPrefectureTraps(pref('tokyo'));
    const titles = traps.map((t) => t.title);
    expect(titles).toContain('ESAT-Jの影響');
    expect(titles).toContain('実技4教科は2倍計算');
    expect(titles).toContain('中3のみが対象');
    // 動的生成の同トピック版（generateDynamicTrapsの「中3のみが対象」「実技教科が傾斜配点」）は
    // 手動キュレーション側が優先されるため重複して出ない。
    expect(titles.filter((t) => t === '中3のみが対象')).toHaveLength(1);
    expect(titles.some((t) => t === '実技教科が傾斜配点')).toBe(false);
    // 手動キュレーションに無いトピック(multiplier)は動的生成で補完される
    // (東京はpracticalMultiplier=2>coreMultiplier=1のため「特殊な倍率設定」が該当)。
    expect(titles).toContain('特殊な倍率設定');
  });

  test('事実誤りと判明した旧エントリ(満点が比較的高い/特色検査の有無)はtopicタグが無く含まれない', () => {
    const traps = getPrefectureTraps(pref('tokyo'));
    const titles = traps.map((t) => t.title);
    expect(titles).not.toContain('満点が比較的高い');
    expect(titles).not.toContain('特色検査の有無');
  });

  test('topicタグ未設定(未検証)の県はgenerateDynamicTrapsの出力とそのまま一致する(回帰なし)', () => {
    for (const code of ['aichi', 'fukuoka', 'hokkaido', 'saitama', 'chiba', 'hyogo', 'yamagata', 'tottori', 'fukui']) {
      const p = pref(code);
      expect(getPrefectureTraps(p)).toEqual(generateDynamicTraps(p));
    }
  });

  // 2026-08-01: 神奈川県を2県目として再検証・topicタグ付与。
  // 神奈川はtargetGrades=[2,3]・practicalMultiplier=coreMultiplier=1・maxScore=135のため
  // generateDynamicTrapsが0件を返す県（＝手動キュレーションが無いと注意点が空になっていた）。
  test('神奈川県はdynamicTrapsが0件を返す県で、手動キュレーション5件がそのまま表示される', () => {
    expect(generateDynamicTraps(pref('kanagawa'))).toEqual([]);
    const traps = getPrefectureTraps(pref('kanagawa'));
    const titles = traps.map((t) => t.title);
    expect(titles).toEqual([
      'S値方式の複雑さ',
      '特色検査の影響',
      '換算内申の係数',
      '重点化の有無',
      '第2次選考の判定基準'
    ]);
  });

  test('神奈川県の事実誤りと判明した旧エントリ(2次選考=面接・作文/主体的態度の評価)は含まれない', () => {
    const traps = getPrefectureTraps(pref('kanagawa'));
    const titles = traps.map((t) => t.title);
    expect(titles).not.toContain('2次選考の存在');
    expect(titles).not.toContain('主体的態度の評価');
  });

  // 2026-08-01: 大阪府を3県目として再検証・topicタグ付与。
  // 大阪はtargetGrades=[1,2,3]・maxScore=450のためdynamicTrapsが「3年間が対象」
  // 「高得点戦略が必要」の2件を返す（大阪はこの2トピックには手動キュレーションが無いため
  // dynamic側がそのまま採用される）。
  test('大阪府はtopicタグ付きの手動キュレーション3件(タイプⅠ〜Ⅴ/実技傾斜なし/素点方式)＋重複しない動的生成分を含む', () => {
    expect(generateDynamicTraps(pref('osaka')).map((t) => t.title)).toEqual([
      '3年間が対象',
      '高得点戦略が必要'
    ]);
    const traps = getPrefectureTraps(pref('osaka'));
    const titles = traps.map((t) => t.title);
    expect(titles).toContain('学力:内申の比率「タイプⅠ〜Ⅴ」を学校ごとに選択');
    expect(titles).toContain('実技教科は主要5教科と同じ配点(傾斜なし)');
    expect(titles).toContain('素点方式で学年ごとに重みが異なる(中1:中2:中3=1:1:3)');
    // 手動キュレーションにtopicタグが無い「3年間が対象」「高得点戦略が必要」は動的生成で補完される。
    expect(titles).toContain('3年間が対象');
    expect(titles).toContain('高得点戦略が必要');
  });

  test('大阪府の事実誤りと判明した旧エントリ(A方式とB方式の選択)は含まれない', () => {
    const traps = getPrefectureTraps(pref('osaka'));
    expect(traps.map((t) => t.title)).not.toContain('A方式とB方式の選択');
  });

  test('topicタグを持つ手動キュレーションが1件も無い県(例: 愛媛)は動的生成のみになる', () => {
    const p = pref('ehime');
    expect(getPrefectureTraps(p)).toEqual(generateDynamicTraps(p));
  });

  test('どの県でも同一topicの手動+動的が同時に表示されることはない(重複防止の一般検証・uniqueは複数あってよい)', () => {
    for (const p of PREFECTURES) {
      const traps = getPrefectureTraps(p);
      const topics = traps.map((t) => t.topic).filter((t): t is NonNullable<typeof t> => Boolean(t) && t !== 'unique');
      expect(new Set(topics).size).toBe(topics.length);
    }
  });

  test('東京都の手動キュレーション件数は3件(事実誤り2件を削除済み)', () => {
    expect(PREFECTURE_TRAPS.tokyo).toHaveLength(3);
  });
});
