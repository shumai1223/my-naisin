import { post as comparisonPost } from '../posts/naishin-47-prefectures-comparison';
import { post as targetGradesPost } from '../posts/naishin-target-grades-by-prefecture';
import { PREFECTURES } from '@/lib/prefectures';

// 2026-08-17: この2本のブログ記事(47都道府県の満点/対象学年/倍率比較表)は「高リスクな
// 全県比較表」として口頭でprefectures.tsとの突合を実施し、当時はミスマッチ0件だった
// (docs/worklog/2026-08-17.md 18:52参照)。しかしこの確認はnode -eによる一度きりの
// 手作業で、jestに固定されていなかったため、以後prefectures.tsの数値が更新されても
// (例: 教委からの指摘で満点や倍率が修正された場合)この2本の記事は追随せず黙って
// ドリフトする構造だった。他の手書きプローズ(PrefectureFAQ.tsx等)で実際にこの種の
// ドリフトが繰り返し発生している([[feedback系]]参照)ため、突合を永続的なテストに固定する。

function findPrefByName(name: string) {
  const pref = PREFECTURES.find((p) => p.name === name);
  if (!pref) throw new Error(`prefectures.tsに「${name}」が見つからない`);
  return pref;
}

function parseTargetGrades(text: string): number[] {
  // naishin-47-prefectures-comparisonは「中1〜中3」形式、naishin-target-grades-by-prefectureは
  // 「中1・中2・中3」形式と、記事によって区切り文字が異なるため両方を許容する。
  if (text.includes('中1') && text.includes('中3') && !text.includes('中3のみ')) return [1, 2, 3];
  if (text.includes('中2') && text.includes('中3') && !text.includes('中3のみ')) return [2, 3];
  if (text.includes('中3のみ')) return [3];
  throw new Error(`未知の対象学年表記: ${text}`);
}

describe('naishin-47-prefectures-comparison.ts: 【全47都道府県】内申点ルール早見表', () => {
  const tableMatch = comparisonPost.content.match(
    /<h2 id="section-table">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/
  );
  if (!tableMatch) throw new Error('早見表のtbodyが見つからない(記事構造が変わった可能性)');

  const rowRe =
    /<tr><td>(.+?)<\/td><td>(\d+)点(?:<sup>.*?<\/sup>)?<\/td><td>([^<]+?)(?:<sup>.*?<\/sup>)?<\/td><td>([\d.]+)倍<\/td><td>([\d.]+)倍<\/td><\/tr>/g;
  const rows = [...tableMatch[1].matchAll(rowRe)];

  test('47都道府県すべての行を抽出できる(記事のHTML構造が壊れていない)', () => {
    expect(rows).toHaveLength(47);
  });

  test.each(rows.map((r) => [r[1], r[2], r[3], r[4], r[5]] as const))(
    '%s: 満点/対象学年/主要倍率/実技倍率がprefectures.tsと一致',
    (name, maxScoreText, targetGradesText, coreText, practicalText) => {
      const pref = findPrefByName(name);
      expect(pref.maxScore).toBe(Number(maxScoreText));
      expect(pref.targetGrades).toEqual(parseTargetGrades(targetGradesText));
      expect(pref.coreMultiplier).toBe(Number(coreText));
      expect(pref.practicalMultiplier).toBe(Number(practicalText));
    }
  );
});

describe('naishin-target-grades-by-prefecture.ts: 47都道府県の対象学年一覧表', () => {
  const tableMatch = targetGradesPost.content.match(
    /<h2 id="prefecture-table">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/
  );
  if (!tableMatch) throw new Error('対象学年一覧表のtbodyが見つからない(記事構造が変わった可能性)');

  const rowRe = /<strong>([^<]+?)<\/strong><\/td>\s*<td>([^<]+?)<\/td>/g;
  const rows = [...tableMatch[1].matchAll(rowRe)];

  test('47都道府県すべての行を抽出できる(記事のHTML構造が壊れていない)', () => {
    expect(rows).toHaveLength(47);
  });

  test.each(rows.map((r) => [r[1], r[2]] as const))(
    '%s: 対象学年の表記がprefectures.tsのtargetGradesと一致',
    (name, targetGradesText) => {
      const pref = findPrefByName(name);
      expect(pref.targetGrades).toEqual(parseTargetGrades(targetGradesText));
    }
  );
});
