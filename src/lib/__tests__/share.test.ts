/**
 * 橋②（生徒→保護者）共有URL/メッセージ/パースの純関数契約テスト。
 * 「決裁者を保護者ページへ文脈付きで運ぶ」「外部入力を必ずクランプする」が回帰しないことを保証する。
 */
import {
  buildParentSharePath,
  buildParentShareUrl,
  buildParentShareMessage,
  parseParentShare,
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
