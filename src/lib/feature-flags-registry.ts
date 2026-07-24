/**
 * 機能フラグ（NEXT_PUBLIC_*_ENABLED）の単一登録簿（ZZ-9c・新資産のCIゲート追加）。
 *
 * なぜ：ZZ以降、build-not-launchの新機能ごとに「既定offの機能フラグ」（isAdvisorEnabled・
 * isJukuSaasEnabled等）が増えていくが、個々のflag.test.tsは各機能が独立して持つのみで、
 * 「サイト全体のどのフラグも、未設定なら安全側(off)に倒れる」という不変条件を横断で保証する
 * 単一のCIゲートが無かった。この登録簿＋src/lib/__tests__/feature-flags-registry.test.tsが
 * その役割を果たす：新しい旗を追加したら必ずここにも登録する（さもないと登録簿の完全性テストが
 * 検知する＝page-registry.ts / D1_BACKUP_TABLES と同じ「登録簿+完全性チェック」パターン）。
 */
import { isAdvisorEnabled } from '@/lib/advisor/flag';
import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { isPartnerDemoEnabled } from '@/lib/partner-demo/flag';
import { isAdSlotEnabled } from '@/components/AdSlot';

export interface FeatureFlagEntry {
  /** 登録簿内での識別名（表示用）。 */
  name: string;
  /** 対応する環境変数名（`NEXT_PUBLIC_*_ENABLED`）。 */
  envVar: string;
  /** env値だけを受け取り、有効/無効を返す薄いラッパー（isAdSlotEnabledはスロットID固定で吸収）。 */
  check: (envValue: string | undefined) => boolean;
}

export const FEATURE_FLAGS: FeatureFlagEntry[] = [
  { name: 'advisor（ZZ-3c）', envVar: 'NEXT_PUBLIC_ADVISOR_ENABLED', check: isAdvisorEnabled },
  { name: 'juku-saas（ZZ-4d/e）', envVar: 'NEXT_PUBLIC_JUKU_SAAS_ENABLED', check: isJukuSaasEnabled },
  { name: 'partner-demo（AA-2）', envVar: 'NEXT_PUBLIC_PARTNER_DEMO_ENABLED', check: isPartnerDemoEnabled },
  {
    name: 'adsense',
    envVar: 'NEXT_PUBLIC_ADSENSE_ENABLED',
    // AdSlot自体はスロットIDとの二重ガードだが、ここでは env 単体の判定を切り出すため
    // 実在しそうな固定の非プレースホルダIDを与える（スロットID側のガード自体は
    // src/components/__tests__/ad-slot.test.ts が別途カバー済み）。
    check: (envValue) => isAdSlotEnabled('1234567890', envValue),
  },
];
