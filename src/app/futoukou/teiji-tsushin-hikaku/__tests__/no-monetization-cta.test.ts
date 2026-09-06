/**
 * T-P1 第1期 DoD: 「収益化のCTAを1つも置かない」を機械的に固定するテスト。
 * `/[prefecture]/teiji-tsushin`の再発防止テストと同型（同クラスタの新規ページ全てに適用）。
 */
import fs from 'fs';
import path from 'path';

const TARGET_FILES = [path.join(__dirname, '..', 'page.tsx')];

const FORBIDDEN_PATTERNS = [
  /ParentLeadCTA/,
  /selectLeadOffer/,
  /affiliateId/,
  /StickyConvertBar/,
  /SaveResultCTA/,
  /FutoukouLeadCTA/,
];

describe('/futoukou/teiji-tsushin-hikaku: 収益化CTAが1つも無いことの確認', () => {
  it('対象ファイルが実在する', () => {
    for (const f of TARGET_FILES) {
      expect(fs.existsSync(f)).toBe(true);
    }
  });

  it.each(TARGET_FILES)('%sに収益化CTA関連の実装が含まれていない', (file) => {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });

  it('robots noindex・followがpage.tsxに設定されている（本番反映は👤ゲート・9/23以降）', () => {
    const content = fs.readFileSync(path.join(__dirname, '..', 'page.tsx'), 'utf8');
    expect(content).toMatch(/robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  });
});
