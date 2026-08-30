import {
  buildDiscordMessage,
  buildHealthSection,
  injectHealthSection,
  judgeHealth,
  yesterdayJst,
  type EventHealthCounts,
  type TruthCounts,
  type ClickFraudCheck,
  type MobileRatioCheck,
} from '../daily-brief-health';

const GA4_OK: EventHealthCounts = { cta_view: 120, lead_submit: 3, line_friend_click: 8, affiliate_click: 45 };
/** 実測で頻発するパターン: 送信は成立しているのにGA4側だけ全部ゼロ（2026-07-27の実例）。 */
const GA4_ALL_ZERO: EventHealthCounts = { cta_view: 0, lead_submit: 0, line_friend_click: 0, affiliate_click: 0 };
const TRUTH_OK: TruthCounts = { statsSubmissions7d: 29, leads7d: 1, statsSubmissionsTotal: 179 };
const TRUTH_DRY: TruthCounts = { statsSubmissions7d: 0, leads7d: 0, statsSubmissionsTotal: 179 };
const CLICK_FRAUD_CLEAN: ClickFraudCheck = {
  date: '2026-08-19',
  total: 12,
  distinctIp: 12,
  distinctUa: 9,
  ipRatio: 1,
  flagged: false,
};
/** TH-13の実測(2026-08-14)相当のシグネチャ: 総クリック384件・distinct IP比率0.99・distinct UA8種類。 */
const CLICK_FRAUD_FLAGGED: ClickFraudCheck = {
  date: '2026-08-14',
  total: 384,
  distinctIp: 380,
  distinctUa: 8,
  ipRatio: 0.99,
  flagged: true,
};
const MOBILE_RATIO_CLEAN: MobileRatioCheck = { flaggedDays: [] };
/** T-M2 M2-4の例: デスクトップに偏った日(実測は74-80%がモバイル)。 */
const MOBILE_RATIO_FLAGGED: MobileRatioCheck = {
  flaggedDays: [{ date: '2026-08-27', total: 20, mobile: 6, mobileRatio: 0.3 }],
};

describe('judgeHealth', () => {
  it('D1が健全でGA4も正なら ok', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK })).toBe('ok');
  });

  it('★回帰防止: GA4が全ゼロでもD1が健全なら alert にしない（GA4の欠損を異常と誤認しない）', () => {
    // 2026-07-27の実例: D1に25件入っているのにGA4のstats_submit_okは0件だった。
    // 初版はこの状況で🔴を出し、6日間オオカミ少年になっていた。
    expect(judgeHealth({ ga4: GA4_ALL_ZERO, truth: TRUTH_OK })).not.toBe('alert');
  });

  it('D1の7日窓で投稿がゼロなら alert（本物の流入停止）', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_DRY })).toBe('alert');
  });

  it('D1が取得できない場合は caution 止まり（「分からない」を「異常」に丸めない）', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: null })).toBe('caution');
    expect(judgeHealth({ ga4: GA4_ALL_ZERO, truth: null })).toBe('caution');
  });

  it('D1が健全でも高頻度のcta_viewが前日ゼロなら caution', () => {
    expect(judgeHealth({ ga4: { ...GA4_OK, cta_view: 0 }, truth: TRUTH_OK })).toBe('caution');
  });

  it('TH-13: クリック不正が検知された日は他が健全でも caution', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK, clickFraud: CLICK_FRAUD_FLAGGED })).toBe('caution');
  });

  it('クリック不正の兆候が無ければ status に影響しない', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK, clickFraud: CLICK_FRAUD_CLEAN })).toBe('ok');
  });

  it('clickFraudが省略/nullでも既存の判定に影響しない（後方互換）', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK })).toBe('ok');
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK, clickFraud: null })).toBe('ok');
  });

  it('M2-4: モバイル比率が異常な日があれば他が健全でも caution', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK, mobileRatio: MOBILE_RATIO_FLAGGED })).toBe('caution');
  });

  it('M2-4: モバイル比率が正常なら status に影響しない', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK, mobileRatio: MOBILE_RATIO_CLEAN })).toBe('ok');
  });

  it('mobileRatioが省略/nullでも既存の判定に影響しない（後方互換）', () => {
    expect(judgeHealth({ ga4: GA4_OK, truth: TRUTH_OK, mobileRatio: null })).toBe('ok');
  });
});

describe('buildHealthSection', () => {
  it('健全時は🟢と表示し、D1の確定値を載せる', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK }, '2026-07-28');
    expect(section).toContain('🟢 正常');
    expect(section).not.toContain('🔴');
    expect(section).toContain('**29件**');
    expect(section).toContain('**179件**');
  });

  it('GA4の件数は「以上」（下限値）として表示する', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK }, '2026-07-28');
    expect(section).toContain('`cta_view`: 120件以上');
    expect(section).toContain('下限値');
  });

  it('D1の投稿が7日ゼロなら🔴を出す', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_DRY }, '2026-07-28');
    expect(section).toContain('🔴 異常');
    expect(section).toContain('⚠️ゼロ');
  });

  it('D1が取得できない場合は🟡で保留と明示する', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: null }, '2026-07-28');
    expect(section).toContain('🟡 要確認');
    expect(section).toContain('D1から確定値を取得できなかった');
  });

  it('日付ラベルを見出しに埋め込む', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK }, '2026-08-01');
    expect(section).toContain('2026-08-01時点');
  });

  it('TH-13: クリック不正が検知されたら警告文とops/THREATS.mdへの参照を出す', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK, clickFraud: CLICK_FRAUD_FLAGGED }, '2026-08-15');
    expect(section).toContain('クリック不正の疑いあり');
    expect(section).toContain('ops/THREATS.md');
    expect(section).toContain('脅威13');
  });

  it('クリック不正の兆候が無ければ「兆候なし」と表示する', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK, clickFraud: CLICK_FRAUD_CLEAN }, '2026-08-19');
    expect(section).toContain('クリック不正の兆候なし');
  });

  it('clickFraudが省略された場合は未実施と明記する（後方互換）', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK }, '2026-07-28');
    expect(section).toContain('チェック未実施');
  });

  it('M2-4: モバイル比率が異常な日があれば日付・件数・比率を表示する', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK, mobileRatio: MOBILE_RATIO_FLAGGED }, '2026-08-28');
    expect(section).toContain('2026-08-27');
    expect(section).toContain('30.0%');
    expect(section).toContain('モバイル比率チェック');
  });

  it('M2-4: モバイル比率が正常なら「異常なし」と表示する', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK, mobileRatio: MOBILE_RATIO_CLEAN }, '2026-08-28');
    expect(section).toContain('異常なし（直近7日すべて50%以上）');
  });

  it('mobileRatioが省略された場合は未実施と明記する（後方互換）', () => {
    const section = buildHealthSection({ ga4: GA4_OK, truth: TRUTH_OK }, '2026-07-28');
    const mobileSection = section.split('モバイル比率チェック')[1];
    expect(mobileSection).toContain('チェック未実施');
  });
});

describe('buildDiscordMessage', () => {
  it('健全時は🟢を含む短いメッセージを返す', () => {
    const msg = buildDiscordMessage({ ga4: GA4_OK, truth: TRUTH_OK }, '2026-08-01');
    expect(msg).toContain('🟢 正常');
    expect(msg).toContain('2026-08-01時点');
    expect(msg).toContain('stats_submissions(7日)=29件');
  });

  it('★回帰防止: GA4が全ゼロでもD1が健全ならalertにしない（judgeHealthと同じ基準を再利用）', () => {
    // Λ-21のバックログ本文にある「GA4いずれかゼロで赤」という古い判定条件は
    // Λ-1が2026-07-31に誤検知と認定して撤回済み。ここで別の基準を再実装しない。
    const msg = buildDiscordMessage({ ga4: GA4_ALL_ZERO, truth: TRUTH_OK }, '2026-08-01');
    expect(msg).not.toContain('🔴');
  });

  it('D1の投稿が7日ゼロなら🔴を含む', () => {
    const msg = buildDiscordMessage({ ga4: GA4_OK, truth: TRUTH_DRY }, '2026-08-01');
    expect(msg).toContain('🔴 異常');
  });

  it('D1が取得できない場合はその旨を明記する', () => {
    const msg = buildDiscordMessage({ ga4: GA4_OK, truth: null }, '2026-08-01');
    expect(msg).toContain('D1から確定値を取得できず');
  });

  it('TH-13: クリック不正が検知された日はDiscordメッセージにも警告行を含める', () => {
    const msg = buildDiscordMessage({ ga4: GA4_OK, truth: TRUTH_OK, clickFraud: CLICK_FRAUD_FLAGGED }, '2026-08-15');
    expect(msg).toContain('クリック不正の疑い(TH-13)');
    expect(msg).toContain('2026-08-14');
  });

  it('クリック不正の兆候が無ければDiscordメッセージに警告行を含めない', () => {
    const msg = buildDiscordMessage({ ga4: GA4_OK, truth: TRUTH_OK, clickFraud: CLICK_FRAUD_CLEAN }, '2026-08-19');
    expect(msg).not.toContain('TH-13');
  });

  it('M2-4: モバイル比率が異常な日があればDiscordメッセージに警告行を含める', () => {
    const msg = buildDiscordMessage({ ga4: GA4_OK, truth: TRUTH_OK, mobileRatio: MOBILE_RATIO_FLAGGED }, '2026-08-28');
    expect(msg).toContain('モバイル比率低下(M2-4)');
    expect(msg).toContain('2026-08-27');
  });

  it('モバイル比率が正常ならDiscordメッセージに警告行を含めない', () => {
    const msg = buildDiscordMessage({ ga4: GA4_OK, truth: TRUTH_OK, mobileRatio: MOBILE_RATIO_CLEAN }, '2026-08-28');
    expect(msg).not.toContain('M2-4');
  });
});

describe('yesterdayJst', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('毎朝7:30 JST実行時、JSTの前日日付を返す(UTC基準だと2日前になる回帰を防ぐ)', () => {
    // 2026-08-14 07:30 JST = 2026-08-13 22:30 UTC。実際にこの時刻のcron実行で
    // 2026-08-12(2日前)が表示される事故が2026-08-14に発生した([[fable5-loop-protocol]]記録)。
    jest.useFakeTimers().setSystemTime(new Date('2026-08-13T22:30:00Z'));
    expect(yesterdayJst()).toBe('2026-08-13');
  });

  it('日付境界をまたぐ深夜近く(23:59 JST)でも正しくJSTの前日を返す', () => {
    // 2026-08-14 23:59 JST = 2026-08-14 14:59 UTC
    jest.useFakeTimers().setSystemTime(new Date('2026-08-14T14:59:00Z'));
    expect(yesterdayJst()).toBe('2026-08-13');
  });

  it('月をまたぐ場合も正しく前日を返す', () => {
    // 2026-09-01 07:30 JST = 2026-08-31 22:30 UTC
    jest.useFakeTimers().setSystemTime(new Date('2026-08-31T22:30:00Z'));
    expect(yesterdayJst()).toBe('2026-08-31');
  });
});

describe('injectHealthSection', () => {
  const sectionBody = 'BODY_PLACEHOLDER';

  it('マーカーが無い場合、最初のH1見出しの直後に新規挿入する', () => {
    const original = '# 朝ブリーフィング\n\n本文1行目\n';
    const result = injectHealthSection(original, sectionBody);
    const lines = result.split('\n');
    expect(lines[0]).toBe('# 朝ブリーフィング');
    expect(result).toContain('<!-- LAMBDA1_HEALTH_START -->\nBODY_PLACEHOLDER<!-- LAMBDA1_HEALTH_END -->');
    expect(result.indexOf('LAMBDA1_HEALTH_START')).toBeLessThan(result.indexOf('本文1行目'));
  });

  it('既存マーカーがある場合、その区間だけを置換し前後の本文を保持する', () => {
    const original = [
      '# 朝ブリーフィング',
      '',
      '<!-- LAMBDA1_HEALTH_START -->',
      'OLD_BODY',
      '<!-- LAMBDA1_HEALTH_END -->',
      '',
      '## 他のセクション',
      '既存の内容は保持される',
    ].join('\n');
    const result = injectHealthSection(original, 'NEW_BODY');
    expect(result).toContain('NEW_BODY');
    expect(result).not.toContain('OLD_BODY');
    expect(result).toContain('## 他のセクション');
    expect(result).toContain('既存の内容は保持される');
  });

  it('見出しが全く無いファイルでも冒頭に挿入して壊れない', () => {
    const original = '本文のみでH1が無いファイル\n';
    const result = injectHealthSection(original, sectionBody);
    expect(result).toContain('BODY_PLACEHOLDER');
    expect(result).toContain('本文のみでH1が無いファイル');
  });

  it('2回連続で呼んでも冪等（3重挿入されない）', () => {
    const original = '# 朝ブリーフィング\n\n本文\n';
    const once = injectHealthSection(original, 'BODY_A');
    const twice = injectHealthSection(once, 'BODY_B');
    expect(twice.match(/LAMBDA1_HEALTH_START/g)).toHaveLength(1);
    expect(twice).toContain('BODY_B');
    expect(twice).not.toContain('BODY_A');
  });
});
