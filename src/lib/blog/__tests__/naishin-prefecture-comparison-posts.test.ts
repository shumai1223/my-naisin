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

// 2026-08-18: 早見表(section-table)の行単位突合テストは2026-08-17に新設済みで47行とも
// prefectures.tsと一致することを確認していたが、記事冒頭の「事実」プロース部分が引用する
// 全国集計値(135点満点の県数・実技倍率が高い県数など)はこのテストの対象外だった。
// 実際にこの回で「135点満点で16県がこの方式」という記述が独立検証と食い違い(実際は14県)、
// 早見表自体は正しいのにプロースだけが古い数値のまま3箇所に残っていたことが発覚した
// (実技倍率が高い16県という別の集計値と混同したとみられる)。以後この種のドリフトを
// 検知できるよう、プロース中の全国集計値もprefectures.tsから独立に再計算し突合する。
describe('naishin-47-prefectures-comparison.ts: プロース中の全国集計値がprefectures.tsと一致する', () => {
  const content = comparisonPost.content;

  test('135点満点の県数は14県(プロース内3箇所すべてで言及)', () => {
    const count = PREFECTURES.filter((p) => p.maxScore === 135).length;
    expect(count).toBe(14);

    const matches = content.match(/135点満点で、(\d+)県がこの方式/g) ?? [];
    const summaryMatch = content.match(/最頻値は135点の(\d+)県/);
    const faqAnswer = comparisonPost.faqs[0].answer;
    const faqMatch = faqAnswer.match(/135点満点で、(\d+)県がこの方式/);

    expect(matches.length).toBeGreaterThan(0);
    for (const m of matches) {
      expect(m).toContain(`135点満点で、${count}県がこの方式`);
    }
    expect(summaryMatch?.[1]).toBe(String(count));
    expect(faqMatch?.[1]).toBe(String(count));
  });

  test('実技倍率が主要5教科より高い県数は16県(本文・FAQ双方)', () => {
    const count = PREFECTURES.filter((p) => p.practicalMultiplier > p.coreMultiplier).length;
    expect(count).toBe(16);
    expect(content).toContain(`より高い県：${count}県`);
    expect(content).toContain(`むしろ${count}県では実技のほうが倍率が高く`);
    expect(content).toContain(`むしろ${count}県は実技のほうが高倍率`);
    expect(comparisonPost.faqs[2].answer).toContain(`逆に${count}県では実技のほうが高倍率`);
  });

  test('実技/主要が同倍率の県数は31県・実技が主要より低い県は0県', () => {
    const same = PREFECTURES.filter((p) => p.practicalMultiplier === p.coreMultiplier).length;
    const lower = PREFECTURES.filter((p) => p.practicalMultiplier < p.coreMultiplier).length;
    expect(same).toBe(31);
    expect(lower).toBe(0);
    expect(content).toContain(`同じ倍率の県：${same}県`);
    expect(content).toContain(`より低い県：${lower}県`);
  });

  test('対象学年の内訳(中1〜中3=34県・中3のみ=11県・中2〜中3=2県)', () => {
    const all3 = PREFECTURES.filter((p) => p.targetGrades.length === 3).length;
    const grade3Only = PREFECTURES.filter(
      (p) => p.targetGrades.length === 1 && p.targetGrades[0] === 3
    ).length;
    const grade2to3 = PREFECTURES.filter(
      (p) => p.targetGrades.length === 2 && p.targetGrades[0] === 2 && p.targetGrades[1] === 3
    ).length;
    expect(all3).toBe(34);
    expect(grade3Only).toBe(11);
    expect(grade2to3).toBe(2);
    expect(content).toContain(`中1の成績から見る県が${all3}、中3だけの県が${grade3Only}`);
    expect(content).toContain(`約7割（${all3}県）は、中1の成績から`);
    expect(content).toContain(`約7割（${all3}県）が中1の成績から`);
  });

  test('満点の最小/最大がprefectures.tsと一致(45点6県/660点岩手県・比14.7倍)', () => {
    const sorted = [...PREFECTURES].sort((a, b) => a.maxScore - b.maxScore);
    const min = sorted[0].maxScore;
    const max = sorted[sorted.length - 1].maxScore;
    const minPrefs = sorted.filter((p) => p.maxScore === min).map((p) => p.name);
    const maxPrefs = sorted.filter((p) => p.maxScore === max).map((p) => p.name);
    expect(min).toBe(45);
    expect(max).toBe(660);
    expect(minPrefs).toEqual(['山形県', '福井県', '長野県', '静岡県', '三重県', '福岡県']);
    expect(maxPrefs).toEqual(['岩手県']);
    expect((max / min).toFixed(1)).toBe('14.7');
  });
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
