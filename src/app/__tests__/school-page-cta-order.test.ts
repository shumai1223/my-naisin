/**
 * G7（保護者到達を押し下げない・ResultSection.tsx:295-298の規約）の学校ページ版回帰防止。
 *
 * 2026-08-13判明: `SchoolPageConvertCTA`（換金導線＝主食②-1、コンポーネント自身のコメントで
 * 「換金導線」と明記）が`SchoolPageParentBridge`より上に配置されており、`ops/tasks/T-B1-kake5-school-layer.md`
 * のG7「収益CTAは必ずSchoolPageParentBridgeより下に置く」に違反していた（別タスク由来の
 * 実装同士が組み合わさって規約違反を生んだケース）。ソースの文字位置で順序を固定する。
 */
import { readFileSync } from 'fs';
import { join } from 'path';

describe('学校ページのCTA順序（G7）', () => {
  it('SchoolPageParentBridgeはSchoolPageConvertCTAより先にレンダーされる', () => {
    const filePath = join(process.cwd(), 'src/app/pref/[code]/school/[schoolCode]/page.tsx');
    const content = readFileSync(filePath, 'utf8');

    const parentBridgeIndex = content.indexOf('<SchoolPageParentBridge');
    const convertCtaIndex = content.indexOf('<SchoolPageConvertCTA');

    expect(parentBridgeIndex).toBeGreaterThan(-1);
    expect(convertCtaIndex).toBeGreaterThan(-1);
    expect(parentBridgeIndex).toBeLessThan(convertCtaIndex);
  });

  /**
   * S3-2（PROPOSALS.md 2026-08-10・2026-08-23対応）: 学校ページに追加した収益CTA
   * （ParentLeadCTA）も同じG7規約の対象。SchoolPageParentBridgeより後に置く。
   */
  it('ParentLeadCTAはSchoolPageParentBridgeより後にレンダーされる', () => {
    const filePath = join(process.cwd(), 'src/app/pref/[code]/school/[schoolCode]/page.tsx');
    const content = readFileSync(filePath, 'utf8');

    const parentBridgeIndex = content.indexOf('<SchoolPageParentBridge');
    const leadCtaIndex = content.indexOf('<ParentLeadCTA');

    expect(parentBridgeIndex).toBeGreaterThan(-1);
    expect(leadCtaIndex).toBeGreaterThan(-1);
    expect(parentBridgeIndex).toBeLessThan(leadCtaIndex);
  });

  /**
   * T-M1-2（C10-1・2026-09-05投入）で学校ページにアフィリ1枠（個別指導キャンパス）を置いていたが、
   * 2026-09-25 👤裁定で「生徒向けページの有料塾アフィリは外し、一等地はAdSenseへ」に変更した
   * （3か月で実クリック47件・確定0件）。学校ページの訪問者は生徒が中心なので0枠にする。
   * 広告の位置と数は ad-placement.test.ts の「学校ページ: 広告は倍率データ・保護者CTA・リードフォームより下」で固定。
   */
  it('学校ページにはアフィリエイト広告を置かない（AdSenseのみ）', () => {
    const filePath = join(process.cwd(), 'src/app/pref/[code]/school/[schoolCode]/page.tsx');
    const content = readFileSync(filePath, 'utf8');

    expect(content.indexOf('今季の入試倍率')).toBeGreaterThan(-1);
    expect((content.match(/<AffiliateAd/g) || []).length).toBe(0);
    expect((content.match(/<AdUnit\b/g) || []).length).toBe(3);
  });
});
