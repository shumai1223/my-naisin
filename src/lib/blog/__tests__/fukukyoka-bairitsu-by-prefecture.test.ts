import { post } from '../posts/fukukyoka-bairitsu-by-prefecture';
import { getPrefectureByCode } from '../../prefectures';

// 2026-08-18: この記事は岩手県の「実選抜換算後の点数」を2箇所(実技3倍以上グループの表・全47都道府県
// 早見表)で言及しているが、2026-08-17のde8fa08(岩手県教委指摘対応)で修正された4ファイルに本記事は
// 含まれておらず、「実選抜換算440点」という令和6年度以前の旧基準が現在の値であるかのように残存して
// いた(prefectures.tsのiwate.actualMaxScoreは既に500へ修正済み)。同種のドリフトが再発しないよう、
// 岩手県のactualMaxScoreへの言及が旧基準(440)のまま現在値として書かれていないかを機械的に検証する。
describe('fukukyoka-bairitsu-by-prefecture.ts: 岩手県の実選抜換算点数がprefectures.tsのactualMaxScoreと一致', () => {
  const iwate = getPrefectureByCode('iwate');

  test('prefectures.tsのiwate.actualMaxScoreは500(前提の確認)', () => {
    expect(iwate?.actualMaxScore).toBe(500);
  });

  test('本文中に現在値(500点)への言及が存在する', () => {
    const matches = post.content.match(/実選抜換算500点/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  test('「実選抜換算440点」という旧基準を現在値として書いた箇所が存在しない(令和6年度以前と明記されない生の440点表記を禁止)', () => {
    expect(post.content).not.toMatch(/実選抜換算440点/);
  });

  test('440点に言及する場合は必ず「令和6年度以前」等の過去形の文脈を伴う', () => {
    const idxs: number[] = [];
    const re = /440点/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(post.content)) !== null) {
      idxs.push(m.index);
    }
    for (const idx of idxs) {
      const windowText = post.content.slice(Math.max(0, idx - 30), idx + 10);
      expect(windowText).toMatch(/令和6年度以前/);
    }
  });
});
