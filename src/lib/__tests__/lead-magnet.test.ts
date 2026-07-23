import {
  buildLeadMagnet,
  buildPrefectureActionPlanStep,
  defaultMetricLabel,
  leadMagnetNextStep,
  type LeadMagnetContext,
} from '@/lib/lead-magnet';
import { decodeSharePayload } from '@/lib/share';

const naishinBase: LeadMagnetContext = {
  source: 'gap-target',
  prefectureCode: 'tokyo',
  prefectureName: '東京都',
  score: 38,
  max: 65,
  grade: 3,
};

describe('defaultMetricLabel', () => {
  it('source から指標ラベルを導く', () => {
    expect(defaultMetricLabel('gap-target')).toBe('内申点');
    expect(defaultMetricLabel('prefecture')).toBe('内申点');
    expect(defaultMetricLabel('hensachi')).toBe('偏差値');
    expect(defaultMetricLabel('hensachi-shiboukou')).toBe('偏差値');
    expect(defaultMetricLabel('hensachi-gyakusan')).toBe('偏差値');
    expect(defaultMetricLabel('hyotei-heikin')).toBe('評定平均');
  });
});

describe('leadMagnetNextStep', () => {
  it('内申系・未達（gap>0）はあと◯点の上げ方へ（gapを文言に含む）', () => {
    const step = leadMagnetNextStep({ ...naishinBase, target: 50, gap: 12 });
    expect(step.href).toBe('/naishin-age-kata');
    expect(step.label).toContain('12');
  });

  it('内申系・達成（gap<=0）は学費試算へ', () => {
    const step = leadMagnetNextStep({ ...naishinBase, target: 30, gap: -8 });
    expect(step.href).toBe('/koukou-hiyou');
  });

  it('内申系・目標未設定（gapなし）は内申点の上げ方へ', () => {
    const step = leadMagnetNextStep({ source: 'result', score: 30, max: 45 });
    expect(step.href).toBe('/naishin-age-kata');
  });

  it('偏差値系は偏差値の上げ方へ', () => {
    expect(leadMagnetNextStep({ source: 'hensachi' }).href).toBe('/hensachi/agekata');
    expect(leadMagnetNextStep({ source: 'hensachi-moshi' }).href).toBe('/hensachi/agekata');
    expect(leadMagnetNextStep({ source: 'hensachi-gyakusan' }).href).toBe('/hensachi/agekata');
  });

  it('評定平均は推薦基準へ', () => {
    expect(leadMagnetNextStep({ source: 'hyotei-heikin' }).href).toBe('/hyotei-heikin/suisen-kijun');
  });
});

describe('buildPrefectureActionPlanStep（ZZ-2b・リードマグネットv2）', () => {
  it('実技倍率が主要教科より高い県(東京都)は実技を訴求する', () => {
    const step = buildPrefectureActionPlanStep({ ...naishinBase, prefectureCode: 'tokyo', prefectureName: '東京都' });
    expect(step).not.toBeNull();
    expect(step!.href).toBe('/tokyo/naishin-omomi');
    expect(step!.description).toContain('実技');
    expect(step!.label).toContain('東京都');
  });

  it('中3のみ対象の県(山形県)は学年の話をする', () => {
    const step = buildPrefectureActionPlanStep({ source: 'result', prefectureCode: 'yamagata', prefectureName: '山形県' });
    expect(step).not.toBeNull();
    expect(step!.href).toBe('/yamagata/naishin-omomi');
    expect(step!.description).toContain('中3');
  });

  it('中3が中1・中2より重い県(北海道)は直近の成績の重要性を伝える', () => {
    const step = buildPrefectureActionPlanStep({ source: 'result', prefectureCode: 'hokkaido', prefectureName: '北海道' });
    expect(step).not.toBeNull();
    expect(step!.description).toContain('中3');
    expect(step!.description).toContain('直近');
  });

  it('倍率に偏りが無い県(群馬県)は満点の話に落ち着く', () => {
    const step = buildPrefectureActionPlanStep({ source: 'result', prefectureCode: 'gunma', prefectureName: '群馬県' });
    expect(step).not.toBeNull();
    expect(step!.description).toContain('135点満点');
  });

  it('偏差値/評定平均sourceはnull（既に専用next stepがあるため対象外）', () => {
    expect(buildPrefectureActionPlanStep({ source: 'hensachi', prefectureCode: 'tokyo' })).toBeNull();
    expect(buildPrefectureActionPlanStep({ source: 'hyotei-heikin', prefectureCode: 'tokyo' })).toBeNull();
  });

  it('prefectureCode未指定・不明コードはnull', () => {
    expect(buildPrefectureActionPlanStep({ source: 'result' })).toBeNull();
    expect(buildPrefectureActionPlanStep({ source: 'result', prefectureCode: 'not-a-real-pref' })).toBeNull();
  });
});

describe('buildLeadMagnet', () => {
  it('score+max が揃えばカードと保護者バトンを返す', () => {
    const m = buildLeadMagnet({ ...naishinBase, target: 50, gap: 12 });
    expect(m.cardPath).not.toBeNull();
    expect(m.cardPath).toMatch(/^\/api\/card\?d=/);
    expect(m.parentSharePath).not.toBeNull();
    expect(m.parentSharePath).toMatch(/^\/hogosha\?/);
    expect(m.nextStep.href).toBe('/naishin-age-kata');
  });

  it('カードURLのペイロードは score/max/目標/学年を保持して復元できる（信頼の堀）', () => {
    const m = buildLeadMagnet({ ...naishinBase, target: 50, gap: 12 });
    const d = m.cardPath!.split('d=')[1];
    const decoded = decodeSharePayload(d);
    expect(decoded).not.toBeNull();
    expect(decoded!.score).toBe(38);
    expect(decoded!.max).toBe(65);
    expect(decoded!.target).toBe(50);
    expect(decoded!.gap).toBe(12);
    expect(decoded!.grade).toBe(3);
    expect(decoded!.metricLabel).toBe('内申点');
  });

  it('percentile/percentileScope（ZZ-5a）はcardPathペイロードにそのまま転記される', () => {
    const m = buildLeadMagnet({ ...naishinBase, percentile: 82, percentileScope: 'prefecture' });
    const decoded = decodeSharePayload(m.cardPath!.split('d=')[1]);
    expect(decoded!.percentile).toBe(82);
    expect(decoded!.percentileScope).toBe('prefecture');
  });

  it('percentile未指定ならcardPathペイロードにも含まれない（見せかけ防止）', () => {
    const m = buildLeadMagnet({ ...naishinBase });
    const decoded = decodeSharePayload(m.cardPath!.split('d=')[1]);
    expect(decoded!.percentile).toBeUndefined();
  });

  it('偏差値ソースは metricLabel を偏差値として埋める', () => {
    const m = buildLeadMagnet({ source: 'hensachi', score: 58, max: 100 });
    const decoded = decodeSharePayload(m.cardPath!.split('d=')[1]);
    expect(decoded!.metricLabel).toBe('偏差値');
  });

  it('明示の metricLabel が既定より優先される', () => {
    const m = buildLeadMagnet({ source: 'prefecture', score: 700, max: 1020, metricLabel: '総合得点' });
    const decoded = decodeSharePayload(m.cardPath!.split('d=')[1]);
    expect(decoded!.metricLabel).toBe('総合得点');
  });

  it('score/max が無い情報ページでは card/share は null だが次の一手は必ず返る', () => {
    const m = buildLeadMagnet({ source: 'hensachi' });
    expect(m.cardPath).toBeNull();
    expect(m.parentSharePath).toBeNull();
    expect(m.nextStep.href).toBe('/hensachi/agekata');
    expect(m.headline).toBeTruthy();
  });

  it('max だけ欠けてもカードは作らない（NaN混入＝誤カードを防ぐ）', () => {
    const m = buildLeadMagnet({ source: 'gap-target', score: 38 });
    expect(m.cardPath).toBeNull();
    expect(m.parentSharePath).toBeNull();
  });

  it('セグメントラベルに県・学年・指標が入る', () => {
    const m = buildLeadMagnet({ ...naishinBase });
    expect(m.segmentLabel).toContain('東京都');
    expect(m.segmentLabel).toContain('中3');
    expect(m.segmentLabel).toContain('内申点');
  });

  it('未達のとき見出し/補足に「あと◯点」を出す', () => {
    const m = buildLeadMagnet({ ...naishinBase, target: 50, gap: 12 });
    expect(m.subline).toContain('12');
  });

  it('nextStepVariant未指定・controlはv1（source+gapベース）のnextStepを返す', () => {
    const m1 = buildLeadMagnet({ ...naishinBase, target: 50, gap: 12 });
    const m2 = buildLeadMagnet({ ...naishinBase, target: 50, gap: 12, nextStepVariant: 'control' });
    expect(m1.nextStep.href).toBe('/naishin-age-kata');
    expect(m2.nextStep.href).toBe('/naishin-age-kata');
  });

  it('nextStepVariant=action-plan-v2は県別アクションプランのnextStepを返す（ZZ-2b）', () => {
    const m = buildLeadMagnet({ ...naishinBase, target: 50, gap: 12, nextStepVariant: 'action-plan-v2' });
    expect(m.nextStep.href).toBe('/tokyo/naishin-omomi');
  });

  it('action-plan-v2でも偏差値sourceはv1にフォールバックする（対象外source）', () => {
    const m = buildLeadMagnet({ source: 'hensachi', score: 58, max: 100, prefectureCode: 'tokyo', nextStepVariant: 'action-plan-v2' });
    expect(m.nextStep.href).toBe('/hensachi/agekata');
  });
});
