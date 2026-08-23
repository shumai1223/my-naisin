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
});
