/**
 * 橋②（生徒→保護者）共有URL/メッセージ/パースの純関数契約テスト。
 * 「決裁者を保護者ページへ文脈付きで運ぶ」「外部入力を必ずクランプする」が回帰しないことを保証する。
 */
import {
  buildParentSharePath,
  buildParentShareUrl,
  buildParentShareMessage,
  parseParentShare,
  encodeSharePayload,
  decodeSharePayload,
} from '@/lib/share';

describe('buildParentSharePath / Url', () => {
  test('文脈を /hogosha?from=share に載せる', () => {
    const path = buildParentSharePath({
      prefectureCode: 'tokyo',
      prefectureName: '東京都',
      score: 58,
      max: 65,
      target: 62,
      gap: 4,
      label: '日比谷の目安',
    });
    expect(path.startsWith('/hogosha?')).toBe(true);
    const q = new URLSearchParams(path.split('?')[1]);
    expect(q.get('from')).toBe('share');
    expect(q.get('pref')).toBe('tokyo');
    expect(q.get('score')).toBe('58');
    expect(q.get('max')).toBe('65');
    expect(q.get('target')).toBe('62');
    expect(q.get('gap')).toBe('4');
    expect(q.get('label')).toBe('日比谷の目安');
  });

  test('目標未設定なら target/gap を載せない', () => {
    const path = buildParentSharePath({ prefectureCode: 'osaka', score: 30, max: 45, target: null, gap: null });
    const q = new URLSearchParams(path.split('?')[1]);
    expect(q.has('target')).toBe(false);
    expect(q.has('gap')).toBe(false);
    expect(q.get('score')).toBe('30');
  });

  test('絶対URLは origin の末尾スラッシュを正規化', () => {
    const url = buildParentShareUrl('https://my-naishin.com/', { score: 40, max: 45 });
    expect(url.startsWith('https://my-naishin.com/hogosha?')).toBe(true);
    expect(url).not.toContain('com//hogosha');
  });

  test('percentile/percentileScope（ZZ-5a）をpc/psクエリに載せる', () => {
    const path = buildParentSharePath({ score: 40, max: 65, percentile: 75, percentileScope: 'national' });
    const q = new URLSearchParams(path.split('?')[1]);
    expect(q.get('pc')).toBe('75');
    expect(q.get('ps')).toBe('n');
  });

  test('percentile未指定ならpc/psを載せない', () => {
    const path = buildParentSharePath({ score: 40, max: 65 });
    const q = new URLSearchParams(path.split('?')[1]);
    expect(q.has('pc')).toBe(false);
    expect(q.has('ps')).toBe(false);
  });
});

describe('buildParentShareMessage', () => {
  test('未達はラベル＋あと◯点で相談動機に寄せる', () => {
    const msg = buildParentShareMessage({ target: 62, gap: 4, label: '日比谷の目安' });
    expect(msg).toContain('日比谷の目安まであと4点');
    expect(msg).toContain('相談');
  });

  test('到達済みは前向きメッセージ', () => {
    const msg = buildParentShareMessage({ target: 60, gap: -2 });
    expect(msg).toContain('届いてた');
  });

  test('目標なしは汎用の相談メッセージ', () => {
    const msg = buildParentShareMessage({ target: null, gap: null });
    expect(msg).toContain('一緒に考えてほしくて');
  });
});

describe('encode/decodeSharePayload（?d= compact・UTF-8安全・壊れた入力は無視）', () => {
  test('日本語を含む文脈をroundtripできる', () => {
    const enc = encodeSharePayload({
      prefectureCode: 'osaka',
      prefectureName: '大阪府',
      score: 38,
      max: 45,
      target: 41,
      gap: 3,
      grade: 3,
      label: '北野の目安',
    });
    expect(enc).toMatch(/^[A-Za-z0-9_-]+$/); // base64url（+/=を含まない）
    const dec = decodeSharePayload(enc);
    expect(dec).toMatchObject({
      isShare: true,
      prefectureCode: 'osaka',
      prefectureName: '大阪府',
      score: 38,
      max: 45,
      target: 41,
      gap: 3,
      grade: 3,
      label: '北野の目安',
    });
  });

  test('壊れた/空の入力は null（例外を投げない）', () => {
    expect(decodeSharePayload(undefined)).toBeNull();
    expect(decodeSharePayload('!!!not-base64!!!')).toBeNull();
    expect(decodeSharePayload('')).toBeNull();
  });

  test('percentile/percentileScope（ZZ-5a）をroundtripできる', () => {
    const enc = encodeSharePayload({ score: 40, max: 65, percentile: 82, percentileScope: 'prefecture' });
    const dec = decodeSharePayload(enc);
    expect(dec?.percentile).toBe(82);
    expect(dec?.percentileScope).toBe('prefecture');
  });

  test('percentile未指定なら含まれない（見せかけ表示を防ぐ）', () => {
    const enc = encodeSharePayload({ score: 40, max: 65 });
    const dec = decodeSharePayload(enc);
    expect(dec?.percentile).toBeUndefined();
    expect(dec?.percentileScope).toBeUndefined();
  });

  test('parseParentShare は ?d= を復元し、個別クエリが上書きする', () => {
    const d = encodeSharePayload({ prefectureCode: 'hyogo', score: 30, max: 45, grade: 2 });
    const p = parseParentShare({ d });
    expect(p.isShare).toBe(true);
    expect(p.prefectureCode).toBe('hyogo');
    expect(p.grade).toBe(2);
    // 個別クエリが優先
    const p2 = parseParentShare({ d, score: '40' });
    expect(p2.score).toBe(40);
  });
});

describe('parseParentShare（受け手＝保護者ページ側・外部入力を必ずクランプ）', () => {
  test('from!=share は isShare:false', () => {
    expect(parseParentShare({}).isShare).toBe(false);
    expect(parseParentShare({ from: 'nav' }).isShare).toBe(false);
  });

  test('正常クエリを復元', () => {
    const p = parseParentShare({
      from: 'share',
      pref: 'tokyo',
      pn: '東京都',
      score: '58',
      max: '65',
      target: '62',
      gap: '4',
      label: '日比谷の目安',
    });
    expect(p).toMatchObject({
      isShare: true,
      prefectureCode: 'tokyo',
      prefectureName: '東京都',
      score: 58,
      max: 65,
      target: 62,
      gap: 4,
      label: '日比谷の目安',
    });
  });

  test('範囲外・非数値・配列はクランプ/無視（信頼の堀）', () => {
    const p = parseParentShare({
      from: ['share'],
      score: '99999',
      max: 'abc',
      gap: '-99999',
      label: 'x'.repeat(200),
    });
    expect(p.isShare).toBe(true);
    expect(p.score).toBe(2000); // 上限クランプ
    expect(p.max).toBeUndefined(); // 非数値は無視
    expect(p.gap).toBe(-2000); // 下限クランプ
    expect(p.label?.length).toBe(40); // 長さ抑制
  });
});

describe('metricLabel（総合得点など内申点以外の指標の共有）', () => {
  test('path / parse で metricLabel が往復する', () => {
    const path = buildParentSharePath({
      prefectureCode: 'hyogo',
      prefectureName: '兵庫県',
      score: 380,
      max: 500,
      metricLabel: '総合得点',
    });
    const p = parseParentShare(Object.fromEntries(new URLSearchParams(path.split('?')[1])));
    expect(p.metricLabel).toBe('総合得点');
    expect(p.score).toBe(380);
    expect(p.max).toBe(500);
  });

  test('compact payload(?d=) でも metricLabel が往復する', () => {
    const d = encodeSharePayload({ score: 380, max: 500, metricLabel: '総合得点' });
    expect(decodeSharePayload(d)?.metricLabel).toBe('総合得点');
  });

  test('metricLabel 未指定なら undefined（既定の内申点表示はバナー側でフォールバック）', () => {
    const p = parseParentShare({ from: 'share', score: '58', max: '65' });
    expect(p.metricLabel).toBeUndefined();
  });
});
