/**
 * グラウンデッドAIアドバイザー（ZZ-3b）反ハルシネーション検証器の敵対的テスト50本。
 * 準拠必須仕様: docs/zz-specs/zz3-grounded-advisor-spec.md §6。
 *
 * mutation-testの発想（§6注記）: 各カテゴリで「壊れた入力がfailする」ケースと、
 * 「同じ入力を正しく直すとpassする」ミューテーション対を書く（検証器自体の実効性を証明する）。
 * カテゴリ内訳: 直接捏造10・丸めドリフト6・漢数字回避6・全角数字回避4・県混線8・
 * 単位すり替え4・エンジンエラー経路6・断定lint6 = 合計50本。
 */
import { verifyGrounding, REQUIRED_DISCLAIMER } from '../verify';
import type { GroundingLedger } from '../ledger';

const D = REQUIRED_DISCLAIMER;
const ledger = (value: string, source: GroundingLedger[number]['source'] = 'naishin-engine', context = 'tokyo'): GroundingLedger => [
  { value, source, context },
];

describe('直接捏造（10本）: 台帳外数値が地の文に混入するとfail', () => {
  it('1: ledger=[]で「約65点」→fail', () => {
    const r = verifyGrounding(`内申点は約65点です。${D}`, []);
    expect(r.ok).toBe(false);
  });
  it('2(1のミューテーション対): 65をledgerに登録するとpass', () => {
    const r = verifyGrounding(`内申点は約65点です。${D}`, ledger('65'));
    expect(r.ok).toBe(true);
  });
  it('3: ledgerに別の値(65)があっても本文の320はfail', () => {
    const r = verifyGrounding(`総合得点は320点です。${D}`, ledger('65'));
    expect(r.ok).toBe(false);
  });
  it('4(3のミューテーション対): 320をledgerに登録するとpass', () => {
    const r = verifyGrounding(`総合得点は320点です。${D}`, ledger('320'));
    expect(r.ok).toBe(true);
  });
  it('5: ledger=[]で偏差値58.3→fail', () => {
    const r = verifyGrounding(`偏差値は58.3です。${D}`, []);
    expect(r.ok).toBe(false);
  });
  it('6(5のミューテーション対): 58.3をledgerに登録するとpass', () => {
    const r = verifyGrounding(`偏差値は58.3です。${D}`, ledger('58.3', 'hensachi-engine', 'none'));
    expect(r.ok).toBe(true);
  });
  it('7: 2つの数値のうち1つだけ台帳にあってももう1つが未登録ならfail', () => {
    const r = verifyGrounding(`現在58.3で、あと12点必要です。${D}`, ledger('58.3', 'hensachi-engine', 'none'));
    expect(r.ok).toBe(false);
  });
  it('8(7のミューテーション対): 12も登録するとpass', () => {
    const twoEntries: GroundingLedger = [
      { value: '58.3', source: 'hensachi-engine', context: 'none' },
      { value: '12', source: 'naishin-engine', context: 'none' },
    ];
    const r = verifyGrounding(`現在58.3で、あと12点必要です。${D}`, twoEntries);
    expect(r.ok).toBe(true);
  });
  it('9: 実技倍率「3倍」が台帳に無ければfail', () => {
    const r = verifyGrounding(`実技倍率は3倍です。${D}`, []);
    expect(r.ok).toBe(false);
  });
  it('10(9のミューテーション対): 3をledgerに登録するとpass', () => {
    const r = verifyGrounding(`実技倍率は3倍です。${D}`, ledger('3', 'prefectures'));
    expect(r.ok).toBe(true);
  });
});

describe('丸めドリフト（6本）: 台帳の表示形と本文の丸めが1文字でも違えばfail', () => {
  it('1: ledger=3.7に対し本文3.67→fail', () => {
    const r = verifyGrounding(`偏差値は3.67です。${D}`, ledger('3.7', 'hensachi-engine', 'none'));
    expect(r.ok).toBe(false);
  });
  it('2(1のミューテーション対): 本文も3.7にすればpass', () => {
    const r = verifyGrounding(`偏差値は3.7です。${D}`, ledger('3.7', 'hensachi-engine', 'none'));
    expect(r.ok).toBe(true);
  });
  it('3: ledger=65に対し本文64.9→fail', () => {
    const r = verifyGrounding(`内申点は64.9点です。${D}`, ledger('65'));
    expect(r.ok).toBe(false);
  });
  it('4(3のミューテーション対): 本文も65にすればpass', () => {
    const r = verifyGrounding(`内申点は65点です。${D}`, ledger('65'));
    expect(r.ok).toBe(true);
  });
  it('5: ledger=450に対し本文451→fail', () => {
    const r = verifyGrounding(`満点は451点です。${D}`, ledger('450', 'prefectures'));
    expect(r.ok).toBe(false);
  });
  it('6(5のミューテーション対): 本文も450にすればpass', () => {
    const r = verifyGrounding(`満点は450点です。${D}`, ledger('450', 'prefectures'));
    expect(r.ok).toBe(true);
  });
});

describe('漢数字回避（6本）: 漢数字表記で台帳外数値を書いても抽出されfail', () => {
  it('1: 「三百点」(=300)が台帳に無ければfail', () => {
    const r = verifyGrounding(`総合得点は三百点です。${D}`, ledger('65'));
    expect(r.ok).toBe(false);
  });
  it('2(1のミューテーション対): 300をledgerに登録するとpass', () => {
    const r = verifyGrounding(`総合得点は三百点です。${D}`, ledger('300'));
    expect(r.ok).toBe(true);
  });
  it('3: 「三百五十点」(=350)が台帳に無ければfail', () => {
    const r = verifyGrounding(`目標まであと三百五十点です。${D}`, []);
    expect(r.ok).toBe(false);
  });
  it('4(3のミューテーション対): 350をledgerに登録するとpass', () => {
    const r = verifyGrounding(`目標まであと三百五十点です。${D}`, ledger('350'));
    expect(r.ok).toBe(true);
  });
  it('5: 「五十点」(=50)が台帳に無ければfail', () => {
    const r = verifyGrounding(`実技の配点は五十点です。${D}`, []);
    expect(r.ok).toBe(false);
  });
  it('6(5のミューテーション対): 50をledgerに登録するとpass', () => {
    const r = verifyGrounding(`実技の配点は五十点です。${D}`, ledger('50', 'prefectures'));
    expect(r.ok).toBe(true);
  });
});

describe('全角数字回避（4本）: 全角数字で台帳外数値を書いても正規化され抽出されfail', () => {
  it('1: 「３２０点」(全角)が台帳に無ければfail', () => {
    const r = verifyGrounding(`総合得点は３２０点です。${D}`, ledger('65'));
    expect(r.ok).toBe(false);
  });
  it('2(1のミューテーション対): 320をledgerに登録するとpass', () => {
    const r = verifyGrounding(`総合得点は３２０点です。${D}`, ledger('320'));
    expect(r.ok).toBe(true);
  });
  it('3: 「６５点」(全角)が台帳に無ければfail', () => {
    const r = verifyGrounding(`内申点は６５点です。${D}`, []);
    expect(r.ok).toBe(false);
  });
  it('4(3のミューテーション対): 65をledgerに登録するとpass', () => {
    const r = verifyGrounding(`内申点は６５点です。${D}`, ledger('65'));
    expect(r.ok).toBe(true);
  });
});

describe('県混線（8本）: prefContextでフィルタしたledgerに他県の数値が無ければfail', () => {
  const tokyoAndOsakaLedger: GroundingLedger = [
    { value: '65', source: 'naishin-engine', context: 'tokyo' },
    { value: '2', source: 'prefectures', context: 'tokyo' },
    { value: '450', source: 'naishin-engine', context: 'osaka' },
    { value: '1', source: 'prefectures', context: 'osaka' },
  ];

  it('1: 大阪ブロックに東京の値(65)が混入→prefContext=osakaでfail', () => {
    const r = verifyGrounding(`大阪府の内申点は65点です。${D}`, tokyoAndOsakaLedger, 'osaka');
    expect(r.ok).toBe(false);
  });
  it('2(1のミューテーション対): 大阪自身の値(450)を使えばpass', () => {
    const r = verifyGrounding(`大阪府の内申点は450点です。${D}`, tokyoAndOsakaLedger, 'osaka');
    expect(r.ok).toBe(true);
  });
  it('3: 東京ブロックに大阪の値(450)が混入→prefContext=tokyoでfail', () => {
    const r = verifyGrounding(`東京都の内申点は450点です。${D}`, tokyoAndOsakaLedger, 'tokyo');
    expect(r.ok).toBe(false);
  });
  it('4(3のミューテーション対): 東京自身の値(65)を使えばpass', () => {
    const r = verifyGrounding(`東京都の内申点は65点です。${D}`, tokyoAndOsakaLedger, 'tokyo');
    expect(r.ok).toBe(true);
  });
  it('5: 大阪ブロックに東京の実技倍率(2)が混入→prefContext=osakaでfail', () => {
    const r = verifyGrounding(`大阪府の実技倍率は2倍です。${D}`, tokyoAndOsakaLedger, 'osaka');
    expect(r.ok).toBe(false);
  });
  it('6(5のミューテーション対): 大阪自身の実技倍率(1)を使えばpass', () => {
    const r = verifyGrounding(`大阪府の実技倍率は1倍です。${D}`, tokyoAndOsakaLedger, 'osaka');
    expect(r.ok).toBe(true);
  });
  it('7: context="none"（構造定数由来・偏差値等の県非依存エンジン）のエントリはどの県ブロックでも参照可能', () => {
    const mixedLedger: GroundingLedger = [
      { value: '58.3', source: 'hensachi-engine', context: 'none' },
      { value: '450', source: 'naishin-engine', context: 'osaka' },
    ];
    const r = verifyGrounding(`大阪府の偏差値目安は58.3です。${D}`, mixedLedger, 'osaka');
    expect(r.ok).toBe(true);
  });
  it('8(7の対): 同じmixedLedgerでprefContext=tokyo(存在しない県)なら大阪の450は見つからずfail', () => {
    const mixedLedger: GroundingLedger = [
      { value: '58.3', source: 'hensachi-engine', context: 'none' },
      { value: '450', source: 'naishin-engine', context: 'osaka' },
    ];
    const r = verifyGrounding(`東京都の内申点は450点です。${D}`, mixedLedger, 'tokyo');
    expect(r.ok).toBe(false);
  });
});

describe('単位すり替え（4本）: 桁・尺度の取り違え（例:5段階評価を10段階の数値で語る）はfail', () => {
  it('1: ledger="45"(5段階×9教科の満点)だが本文が「満点は50点」(10段階と取り違え)→fail', () => {
    const r = verifyGrounding(`満点は50点です。${D}`, ledger('45', 'prefectures'));
    expect(r.ok).toBe(false);
  });
  it('2(1のミューテーション対): 本文を台帳どおり45点にすればpass', () => {
    const r = verifyGrounding(`満点は45点です。${D}`, ledger('45', 'prefectures'));
    expect(r.ok).toBe(true);
  });
  it('3: ledger="450"(点)だが本文が「4.5倍」→fail(4.5という別トークンが未登録)', () => {
    const r = verifyGrounding(`実技倍率は4.5倍です。${D}`, ledger('450', 'prefectures'));
    expect(r.ok).toBe(false);
  });
  it('4(3のミューテーション対): 4.5をledgerに登録するとpass', () => {
    const r = verifyGrounding(`実技倍率は4.5倍です。${D}`, ledger('4.5', 'prefectures'));
    expect(r.ok).toBe(true);
  });
});

describe('エンジンエラー経路（6本）: 材料が無い場合は構造定数以外の数値ゼロ+安全定型文', () => {
  it('1: ledger=[]で数値を含まない安全文はpass', () => {
    const r = verifyGrounding(
      `この質問には、決定論エンジンで正確にお答えできる材料が揃っていません。内申点計算ツールで直接計算するか、担当の先生にご確認ください。\n\n${D}`,
      []
    );
    expect(r.ok).toBe(true);
  });
  it('2: 構造定数(9教科)のみを含む安全文はledger=[]でもpass', () => {
    const r = verifyGrounding(`9教科の評定が必要です。ツールで計算してください。${D}`, []);
    expect(r.ok).toBe(true);
  });
  it('3: エンジンエラー時に数値を作文するとfail(安全文の体裁を装っても検出される)', () => {
    const r = verifyGrounding(`材料が揃っていませんが、目安は65点です。${D}`, []);
    expect(r.ok).toBe(false);
  });
  it('4(3のミューテーション対): 65をledgerに登録すればpass(本来は作文せず安全文にすべきだが、検証器としては台帳一致のみを見る契約を確認)', () => {
    const r = verifyGrounding(`材料が揃っていませんが、目安は65点です。${D}`, ledger('65'));
    expect(r.ok).toBe(true);
  });
  it('5: 構造定数(47都道府県)を含む安全文はledger=[]でもpass', () => {
    const r = verifyGrounding(`47都道府県それぞれで計算方法が異なります。${D}`, []);
    expect(r.ok).toBe(true);
  });
  it('6: 複数の構造定数(5教科+4教科)を含む安全文もledger=[]でpass', () => {
    const r = verifyGrounding(`5教科と実技4教科の内訳は個別のツールでご確認ください。${D}`, []);
    expect(r.ok).toBe(true);
  });
});

describe('断定lint（6本）: 断定進路指導フレーズを検出してfail', () => {
  const forbidden = ['受かります', '合格できます', '合格です', '安全です', '大丈夫です', '絶対'];
  forbidden.forEach((phrase, i) => {
    it(`${i + 1}: 「${phrase}」を含む文はfail`, () => {
      const r = verifyGrounding(`この内申点なら${phrase}。${D}`, ledger('65'));
      expect(r.ok).toBe(false);
    });
  });
});

describe('欠落系（disclaimer/code-block）: 補助テスト（50本の外・回帰確認用）', () => {
  it('免責文言が無ければfail', () => {
    const r = verifyGrounding('内申点は65点です。', ledger('65'));
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.type === 'missing-disclaimer')).toBe(true);
  });
  it('コードブロックを含めばfail', () => {
    const r = verifyGrounding(`\`\`\`js\nconsole.log(1)\n\`\`\`\n${D}`, []);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.type === 'code-block')).toBe(true);
  });
  it('markdownリンクのhref内の数字は誤検出しない(/report/2026等)', () => {
    const r = verifyGrounding(`詳しくは[白書](/report/2026)をご覧ください。${D}`, []);
    expect(r.ok).toBe(true);
  });
});
