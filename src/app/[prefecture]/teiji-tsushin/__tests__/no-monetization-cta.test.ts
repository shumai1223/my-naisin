/**
 * T-P1 第1期 DoD: 「収益化のCTAを1つも置かない」（資料請求・体験申込・アフィリンク・
 * 比較表の申込ボタン、すべて禁止）を機械的に固定するテスト。
 *
 * 経緯: 2026-09-06、本ページに`ParentLeadCTA`（収益化の本命：資料請求送客）が
 * `selectLeadOffer()`経由で実装されていたことが発覚し削除した(T-P1 P1-0の裁定に違反)。
 * 同種の再発（他の面からのコピペ実装等）を防ぐため、対象ファイルを走査する。
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
];

describe('/[prefecture]/teiji-tsushin: 収益化CTAが1つも無いことの確認', () => {
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
});
