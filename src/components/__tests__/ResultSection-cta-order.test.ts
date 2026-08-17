/**
 * TH-11（ops/THREATS.md 脅威11・収益導線の破壊）の回帰防止。
 *
 * ResultSection.tsx:295-298のコメントで「保護者共有導線（橋①GapToTarget・ParentCostBridge）
 * より必ず下に置くこと（収益の主導線を押し下げない）」と明記されている学校ページ導線Linkの
 * 配置規約を、ソースの文字位置で固定する。THREATS.mdは「この規約を保護する自動テストは
 * 現状存在しない」と指摘していた（school-page-cta-order.test.tsは同種だが別ファイル
 * `src/app/pref/[code]/school/[schoolCode]/page.tsx`のG7規約を守るテストで、
 * ResultSection.tsx自身の規約はカバーしていなかった）。
 */
import { readFileSync } from 'fs';
import { join } from 'path';

describe('ResultSection.tsxのCTA順序（TH-11: 保護者共有導線は学校ページ導線より必ず上）', () => {
  it('GapToTarget → ParentCostBridge → 学校ページ導線Linkの順でレンダーされる', () => {
    const filePath = join(process.cwd(), 'src/components/ResultSection.tsx');
    const content = readFileSync(filePath, 'utf8');

    const gapToTargetIndex = content.indexOf('<GapToTarget');
    const parentCostBridgeIndex = content.indexOf('<ParentCostBridge');
    // 学校ページ導線はonSchoolPageBridgeClickハンドラを持つLinkとして実装されている
    // (href={`/pref/${prefectureCode}`})。この文字列で一意に特定する。
    const schoolBridgeIndex = content.indexOf('onClick={onSchoolPageBridgeClick}');

    expect(gapToTargetIndex).toBeGreaterThan(-1);
    expect(parentCostBridgeIndex).toBeGreaterThan(-1);
    expect(schoolBridgeIndex).toBeGreaterThan(-1);

    expect(gapToTargetIndex).toBeLessThan(parentCostBridgeIndex);
    expect(parentCostBridgeIndex).toBeLessThan(schoolBridgeIndex);
  });
});
