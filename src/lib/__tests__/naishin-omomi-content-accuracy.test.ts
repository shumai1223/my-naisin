import { NAISHIN_OMOMI_CONTENT } from '../naishin-omomi-content';
import { PREFECTURES, getPrefectureByCode } from '../prefectures';

// 2026-08-17: naishin-omomi-content.tsは既存テスト(naishin-omomi-content.test.ts)で
// 「テンプレ流用でないこと(scaled-content検出)」「県名が含まれること」は検証済みだったが、
// 文中の数値主張(満点・実技/主要倍率比)がprefectures.tsと実際に一致するかは検証されておらず、
// 本日発見したPrefectureFAQ.tsx等の数値ドリフト事故と同種のリスクが残っていた。maxScoreNoteは
// 「その県固有の...注記」と定義されており必ず自県の満点から書き始まる設計のため、最初に
// 出現する「○点満点」を自県の主張として抽出できる(47件全件で検証済み)。skewPositionの
// 実技/主要倍率比も「実技4教科の倍率が主要5教科のX倍」「X÷Y＝Z倍」「同じ倍率(傾斜なし)」の
// 3パターンで全47件をカバーできることを事前に確認した。

// maxScoreNoteの数値表記は「○点満点」(数字が先)と「満点は○点」(数字が後)の2形式が混在する
// (例: 香川県「本サイトの計算モデル上の満点は390点ですが、実際の選抜では220点満点に換算…」
// では"満点は390点"が自県の生maxScore、後半の"220点満点"は実選抜換算後の別の数字)。
// 文中で最初に出現する方を自県の主張として採用する(2026-08-17に実測で確認: 全47件で
// 最初の出現が生のmaxScoreと一致し、換算後の数字は必ず2番目以降に出現する)。
function extractClaimedMaxScore(text: string): number | null {
  const re = /満点は([\d,]+)点|([\d,]+)点満点/g;
  const m = re.exec(text);
  if (!m) return null;
  return Number((m[1] ?? m[2]).replace(/,/g, ''));
}

describe('NAISHIN_OMOMI_CONTENT: maxScoreNoteの満点記載がprefectures.tsのmaxScoreと一致', () => {
  for (const [code, entry] of Object.entries(NAISHIN_OMOMI_CONTENT)) {
    test(`${code}: maxScoreNote中の自県満点記載がpref.maxScoreと一致`, () => {
      const pref = getPrefectureByCode(code);
      expect(pref).toBeDefined();
      if (!pref) return;

      const claimed = extractClaimedMaxScore(entry.maxScoreNote);
      expect(claimed).not.toBeNull();
      expect(claimed).toBe(pref.maxScore);
    });
  }
});

describe('NAISHIN_OMOMI_CONTENT: skewPositionの実技/主要倍率比がprefectures.tsと一致', () => {
  for (const [code, entry] of Object.entries(NAISHIN_OMOMI_CONTENT)) {
    const text = entry.skewPosition;
    const ratioMatch = text.match(/実技4教科(?:（[^）]*）)?の倍率(?:は|が)主要5教科の([\d.]+)倍/);
    const divMatch = text.match(/([\d.]+)÷([\d.]+)＝([\d.]+)倍/);
    const noSkewMatch = /(同じ倍率|同倍率|傾斜はありません|実技による傾斜はありません)/.test(text);

    if (ratioMatch) {
      test(`${code}: 「実技は主要の${ratioMatch[1]}倍」という比率記載が一致`, () => {
        const pref = getPrefectureByCode(code);
        expect(pref).toBeDefined();
        if (!pref) return;
        expect(pref.practicalMultiplier / pref.coreMultiplier).toBeCloseTo(Number(ratioMatch[1]), 5);
      });
    } else if (divMatch) {
      test(`${code}: 除算表記「${divMatch[0]}」の分子(実技)・分母(主要)・商が一致`, () => {
        const pref = getPrefectureByCode(code);
        expect(pref).toBeDefined();
        if (!pref) return;
        expect(pref.practicalMultiplier).toBe(Number(divMatch[1]));
        expect(pref.coreMultiplier).toBe(Number(divMatch[2]));
        expect(pref.practicalMultiplier / pref.coreMultiplier).toBeCloseTo(Number(divMatch[3]), 5);
      });
    } else if (noSkewMatch) {
      test(`${code}: 「傾斜なし・同じ倍率」の記載どおりcoreMultiplier=practicalMultiplier`, () => {
        const pref = getPrefectureByCode(code);
        expect(pref).toBeDefined();
        if (!pref) return;
        expect(pref.practicalMultiplier).toBe(pref.coreMultiplier);
      });
    } else {
      // 2026-08-17時点で全47件がratio/div/noSkewのいずれかに一致することを確認済み。
      // 将来ここに落ちるエントリが増えたら、パターンを拡張するか手動確認が必要。
      test(`${code}: skewPositionの倍率記載パターンを検出できない(要目視確認)`, () => {
        expect(text).toMatch(/実技4教科(?:（[^）]*）)?の倍率(?:は|が)主要5教科の[\d.]+倍|[\d.]+÷[\d.]+＝[\d.]+倍|同じ倍率|同倍率|傾斜はありません|実技による傾斜はありません/);
      });
    }
  }
});

// 2026-08-18: 各エントリのskewPositionは自県の倍率だけでなく「全国31県が該当」「11県の2倍
// グループ」のような全国集計値を比較対象として繰り返し引用している。この集計値自体は
// prefectures.tsの実データから独立して再計算し突合していなかったため、ここで固定する。
describe('NAISHIN_OMOMI_CONTENT: 全国集計値(31県/11県)がprefectures.tsの実データと一致する', () => {
  test('「傾斜なし」(coreMultiplier===practicalMultiplier)の県数は31県', () => {
    const noSkewCount = PREFECTURES.filter((p) => p.coreMultiplier === p.practicalMultiplier).length;
    expect(noSkewCount).toBe(31);

    const allText = Object.values(NAISHIN_OMOMI_CONTENT)
      .map((e) => e.skewPosition)
      .join('');
    expect(allText).toContain(`全国31県`);
  });

  test('実技/主要倍率比がちょうど2倍の県数は11県', () => {
    const ratio2Count = PREFECTURES.filter(
      (p) => p.coreMultiplier > 0 && p.practicalMultiplier / p.coreMultiplier === 2
    ).length;
    expect(ratio2Count).toBe(11);

    const allText = Object.values(NAISHIN_OMOMI_CONTENT)
      .map((e) => e.skewPosition)
      .join('');
    expect(allText).toContain(`11県の2倍グループ`);
  });
});

describe('NAISHIN_OMOMI_CONTENT: 登録keyがprefectures.tsに実在する', () => {
  for (const code of Object.keys(NAISHIN_OMOMI_CONTENT)) {
    test(`${code}: prefectures.tsに存在する`, () => {
      expect(getPrefectureByCode(code)).toBeDefined();
    });
  }
});

// 2026-08-18: shiga entryのgradeComparison/faqsが「奈良県は中1除外」という2026年3月改定前(令和7年度
// 以前)の旧制度を現在値として書いていた事故を発見(奈良県自身のエントリ(471-483行)は改定後の正しい
// 記述だったため同一ファイル内で自己矛盾していた)。他県エントリの他項目(angle/gradeComparison/faqs)は
// maxScoreNote/skewPositionと異なりprefectures.tsの数値と機械的に突合できないため、せめて「奈良県は
// 中1を除外する」という改定前の言い回しが他のどのエントリにも残っていないことだけを機械的に検証する。
describe('NAISHIN_OMOMI_CONTENT: 奈良県の2026年3月改定(中1除外→中1・中2を態度評価で算入)が全エントリで反映されている', () => {
  const allText = Object.values(NAISHIN_OMOMI_CONTENT)
    .flatMap((e) => [e.angle, e.gradeComparison, e.maxScoreNote, ...e.faqs.map((f) => f.answer)])
    .join('\n');

  test('「奈良県...中1除外」という改定前(旧制度)の言い回しがどのエントリにも存在しない', () => {
    expect(allText).not.toMatch(/奈良県?[^\n。]{0,10}中1[^\n。]{0,5}除外/);
  });
});
