/**
 * T-C6 DoD: 「合否判定・ボーダーの推定を1つも出していないことをgrepで確認」を
 * 機械的に固定するテスト。/kakomon-jisaiten関連ファイルに合否・ボーダーを示唆する
 * 語が含まれていないかを走査する（Y-0憲法の永久禁止事項）。
 */
import fs from 'fs';
import path from 'path';

const TARGET_FILES = [
  path.join(__dirname, '..', 'kakomon-jisaiten', 'page.tsx'),
  path.join(__dirname, '..', '..', 'components', 'KakomonJisaiten', 'KakomonJisaitenCalculator.tsx'),
  path.join(__dirname, '..', '..', 'lib', 'kakomon-jisaiten-routing.ts'),
];

// 「合否ラインは公表されておらず」「合格ライン（ボーダー）は表示しません」のような
// "出さない" ことを説明する免責文言・FAQ設問（「合格できますか？」）は正当なプロースとして
// 許容し、**具体的な数値と結び付いた断定的な合否予測**のみを禁止パターンとして検知する。
const FORBIDDEN_PATTERNS = [
  /ボーダー(ライン)?[:：]\s*\d/, // 「ボーダー：380点」のような数値付き断定
  /合格ラインは\s*\d/, // 「合格ラインは380点」のような数値付き断定
  /偏差値\d+以上で合格/,
  /この(得点|点数|結果)なら合格/,
  /合格(圏内|確実|できます)/,
];

describe('/kakomon-jisaiten: 合否判定・ボーダー推定を出していないことの確認', () => {
  it('対象ファイルが実在する', () => {
    for (const f of TARGET_FILES) {
      expect(fs.existsSync(f)).toBe(true);
    }
  });

  it.each(TARGET_FILES)('%sに断定的な合否予測・ボーダー数値が含まれていない', (file) => {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });
});
