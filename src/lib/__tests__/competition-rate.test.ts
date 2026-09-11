import {
  sumRecords,
  checkAgainstSubtotal,
  resolveRecordSourceIndex,
  countUnresolvedSources,
  licensableRecords,
  resolveSourceLocator,
  countRecordsWithSourceLocator,
  type CompetitionRateRecord,
  type CompetitionRateSource,
  type OfficialSubtotal,
} from '../competition-rate';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

const RECORDS: CompetitionRateRecord[] = [
  { schoolName: '日比谷', area: '千代田', department: '普通科', quota: 253, finalApplicants: 520, finalRate: 2.06 },
  { schoolName: '三田', area: '港', department: '普通科', quota: 236, finalApplicants: 343, finalRate: 1.45 },
  { schoolName: '片倉', area: '八王子', department: '普通科', quota: 189, finalApplicants: 232, finalRate: 1.23 },
];

describe('sumRecords', () => {
  it('quota/finalApplicants/schoolCountを合計する', () => {
    expect(sumRecords(RECORDS)).toEqual({ quota: 253 + 236 + 189, finalApplicants: 520 + 343 + 232, schoolCount: 3 });
  });

  it('空配列は全て0', () => {
    expect(sumRecords([])).toEqual({ quota: 0, finalApplicants: 0, schoolCount: 0 });
  });
});

describe('checkAgainstSubtotal', () => {
  it('predicateで絞り込んだ合計が公式値と一致すればmatches=true', () => {
    const subtotal: OfficialSubtotal = { label: '区部計(2校のみ)', quota: 253 + 236, finalApplicants: 520 + 343 };
    const result = checkAgainstSubtotal(RECORDS, subtotal, (r) => r.area === '千代田' || r.area === '港');
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(489);
  });

  it('一致しなければmatches=false（データ欠落や転記ミスの検知）', () => {
    const subtotal: OfficialSubtotal = { label: '区部計(公式値)', quota: 99999, finalApplicants: 99999 };
    const result = checkAgainstSubtotal(RECORDS, subtotal, () => true);
    expect(result.matches).toBe(false);
  });
});

describe('resolveRecordSourceIndex（T-S13A A-0-3）', () => {
  function source(fiscalYear: string): CompetitionRateSource {
    return { url: `https://example.com/${fiscalYear}`, docTitle: 'テスト用', fiscalYear, fetchedAt: '2026-08-12' };
  }

  it('sourceIndexが明示されていればそれを優先する', () => {
    const sources = [source('令和8年度（2026年度）'), source('令和8年度（2026年度）')];
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, sourceIndex: 1 };
    expect(resolveRecordSourceIndex(record, sources)).toBe(1);
  });

  it('sourceIndexが範囲外ならnull（存在しない出典を指させない）', () => {
    const sources = [source('令和8年度（2026年度）')];
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, sourceIndex: 5 };
    expect(resolveRecordSourceIndex(record, sources)).toBeNull();
  });

  it('sourceIndex未指定でも、fiscalYearに一致するsourcesが1件だけなら自動解決する', () => {
    const sources = [source('令和8年度（2026年度）'), source('令和7年度（2025年度）')];
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, fiscalYear: '令和7年度（2025年度）' };
    expect(resolveRecordSourceIndex(record, sources)).toBe(1);
  });

  it('fiscalYear省略時はsources[0].fiscalYear(今季分)を対象年度とみなす', () => {
    const sources = [source('令和8年度（2026年度）')];
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1 };
    expect(resolveRecordSourceIndex(record, sources)).toBe(0);
  });

  it('同一年度に複数sourcesがありsourceIndexも無指定ならnull（一意に決まらない＝A-2の出典列付きCSVに載せられない）', () => {
    const sources = [source('令和8年度（2026年度）'), source('令和8年度（2026年度）')];
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1 };
    expect(resolveRecordSourceIndex(record, sources)).toBeNull();
  });

  it('該当年度のsourcesが0件ならnull', () => {
    const sources = [source('令和8年度（2026年度）')];
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, fiscalYear: '令和9年度（2027年度）' };
    expect(resolveRecordSourceIndex(record, sources)).toBeNull();
  });
});

describe('countUnresolvedSources（実データ・A-0-3のスコープ計測）', () => {
  // ⚠️2026-08-12実測: A-0-3本文が「tokyo/fukuoka/aomori/gifuの2,173レコード」を一律に
  // 出典未解決としていたが、fiscalYear単位で見るとfukuoka/aomoriは一部の年度が単一sourceで
  // 自動解決できることが判明した。真に手動バックフィルが要るのは以下の件数のみ（tokyoは
  // 全年度が複数source制のため全件、fukuoka/aomoriは一部年度のみ）。このテストはA-0-3着手時の
  // スコープを固定するリグレッションガード（sources/recordsを編集した回はこの数値が動き得るので、
  // 動いたら意図した変化か確認してから期待値を更新すること）。
  // ✅2026-08-12: gifuは全409件をsourceIndexバックフィル済み（各年度の2sourcesが「変更後出願者数」
  // ＝学校別詳細と「変更後出願者数総括表」＝集計のみの明確なペアだったため、集計版には個別
  // 学校のレコードが存在し得ないと確定できた。詳細版=各年度の偶数番目indexへ機械的に割り当て）。
  // ✅2026-08-12: fukuokaも令和8年度分191件をsourceIndexバックフィル済み。各sourceのdocTitleに
  // 明記された「学科別内訳の一括引用元」の学校リスト（実業高校8校/筑後地区16校/筑豊地区9校/
  // 福岡地区15校＝筑紫丘〜糸島の実際の記載範囲を目視確認）に該当する学校はそのsourceへ、
  // 該当しない学校（「裏取りに使用」のみの北九州地区分を含む）は県公式PDF（県立分/市組合立分）
  // へ機械的に割り当てた。
  // ✅2026-08-12: aomoriも令和6年度分90件をsourceIndexバックフィル済み。sources[2]〜[7]が地域別
  // （東青/西北五/中弘南黒/上十三/下北むつ/三八）6分割の公式PDFで全て県教委原本（商用ソースなし）。
  // 学校名からファイル内の記載順（=地域の並び順）で機械的に割り当てた。
  // ✅2026-08-12: tokyoも全944件をsourceIndexバックフィル済み（残っていた最後の県・A-0-3完遂）。
  // 5年度×3グループ(普通科(コース・単位制以外)+島しょ／コース制・単位制・海外帰国生徒対象／
  // 専門学科・総合学科)の計15sourceに対し、docTitleに明記された学科区分・fiscalYearで一意に
  // 機械的に割り当てた（推測不要）。
  const KNOWN_UNRESOLVED_COUNTS: Record<string, number> = {};

  for (const [code, expected] of Object.entries(KNOWN_UNRESOLVED_COUNTS)) {
    it(`${code}: 出典未解決レコード数は${expected}件（sourceIndexバックフィル前の既知値）`, () => {
      const file = COMPETITION_RATE_BY_PREFECTURE[code];
      expect(file).toBeDefined();
      expect(countUnresolvedSources(file!)).toBe(expected);
    });
  }

  it('参考: 上記4県以外は出典未解決レコードが無い、または稀（同一年度に複数sourcesを持つ県が他に無いか横断確認）', () => {
    const unexpectedlyAmbiguous: Array<{ code: string; count: number }> = [];
    for (const [code, file] of Object.entries(COMPETITION_RATE_BY_PREFECTURE)) {
      if (code in KNOWN_UNRESOLVED_COUNTS || !file) continue;
      const count = countUnresolvedSources(file);
      if (count > 0) unexpectedlyAmbiguous.push({ code, count });
    }
    // 新たに複数source県が増えたらここで検知できる（A-0-1の対象県リストを黙って広げない）
    expect(unexpectedlyAmbiguous).toEqual([]);
  });
});

describe('resolveSourceLocator / countRecordsWithSourceLocator（T-Y11F §5順序#8・出典ロケータ）', () => {
  function source(fiscalYear: string, pdfSha256?: string): CompetitionRateSource {
    return { url: `https://example.com/${fiscalYear}`, docTitle: 'テスト用', fiscalYear, fetchedAt: '2026-09-10', pdfSha256 };
  }

  it('page・rowIndexが両方あり、sourceIndexも解決でき、pdfSha256も設定済みなら3つ組を返す', () => {
    const sources = [source('令和8年度（2026年度）', 'abc123')];
    const record: CompetitionRateRecord = {
      schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, page: 2, rowIndex: 5,
    };
    expect(resolveSourceLocator(record, sources)).toEqual({ pdfSha256: 'abc123', page: 2, rowIndex: 5 });
  });

  it('pageまたはrowIndexが未設定ならnull（未バックフィルのレコード）', () => {
    const sources = [source('令和8年度（2026年度）', 'abc123')];
    const withoutPage: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, rowIndex: 5 };
    const withoutRowIndex: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, page: 2 };
    expect(resolveSourceLocator(withoutPage, sources)).toBeNull();
    expect(resolveSourceLocator(withoutRowIndex, sources)).toBeNull();
  });

  it('page・rowIndexはあってもsourceIndexが一意に解決できなければnull', () => {
    const sources = [source('令和8年度（2026年度）', 'abc123'), source('令和8年度（2026年度）', 'def456')];
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, page: 2, rowIndex: 5 };
    expect(resolveSourceLocator(record, sources)).toBeNull();
  });

  it('解決したsourceにpdfSha256が未計測ならnull（ハッシュ計測がまだのファイル）', () => {
    const sources = [source('令和8年度（2026年度）')]; // pdfSha256省略
    const record: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, page: 2, rowIndex: 5 };
    expect(resolveSourceLocator(record, sources)).toBeNull();
  });

  it('countRecordsWithSourceLocatorは解決できたレコードだけを数える', () => {
    const sources = [source('令和8年度（2026年度）', 'abc123')];
    const withLocator: CompetitionRateRecord = { schoolName: 'A', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1, page: 1, rowIndex: 0 };
    const withoutLocator: CompetitionRateRecord = { schoolName: 'B', department: '普通科', quota: 1, finalApplicants: 1, finalRate: 1 };
    const file = {
      prefectureCode: 'test', sources, coverage: { status: 'complete' as const, includedDepartments: [], pendingDepartments: [], note: '' },
      records: [withLocator, withoutLocator], officialSubtotals: [],
    };
    expect(countRecordsWithSourceLocator(file)).toBe(1);
  });

  it('参考: 出典ロケータのバックフィル進捗（2026-09-10時点はtottori R8の43件のみ・#8着手のパイロット）', () => {
    const nonZero: Array<{ code: string; count: number }> = [];
    for (const [code, file] of Object.entries(COMPETITION_RATE_BY_PREFECTURE)) {
      if (!file) continue;
      const count = countRecordsWithSourceLocator(file);
      if (count > 0) nonZero.push({ code, count });
    }
    // このテストは進捗のスナップショットを固定するリグレッションガード。#8のバックフィルを
    // 別の県で進めた回はこの配列に新しい要素が増えるはずなので、増えたら意図した進捗か確認
    // してから期待値を更新すること（既存県の件数が勝手に減っていたら書き換え事故を疑う）。
    expect(nonZero.sort((a, b) => a.code.localeCompare(b.code))).toEqual([
      { code: 'akita', count: 78 },
      { code: 'aomori', count: 89 },
      { code: 'chiba', count: 188 },
      { code: 'ehime', count: 99 },
      { code: 'fukui', count: 72 },
      { code: 'fukuoka', count: 66 },
      { code: 'fukushima', count: 99 },
      { code: 'gifu', count: 134 },
      { code: 'gunma', count: 106 },
      { code: 'hiroshima', count: 137 },
      { code: 'ibaraki', count: 149 },
      { code: 'ishikawa', count: 67 },
      { code: 'iwate', count: 113 },
      { code: 'kagawa', count: 68 },
      { code: 'kagoshima', count: 156 },
      { code: 'kochi', count: 75 },
      { code: 'kumamoto', count: 162 },
      { code: 'kyoto', count: 75 },
      { code: 'miyagi', count: 129 },
      { code: 'nagano', count: 85 },
      { code: 'nagasaki', count: 116 },
      { code: 'nara', count: 71 },
      { code: 'niigata', count: 93 },
      { code: 'oita', count: 81 },
      { code: 'okinawa', count: 156 },
      { code: 'saga', count: 67 },
      { code: 'saitama', count: 241 },
      { code: 'shiga', count: 56 },
      { code: 'shimane', count: 64 },
      { code: 'shizuoka', count: 162 },
      { code: 'tochigi', count: 107 },
      { code: 'tokushima', count: 69 },
      { code: 'tottori', count: 43 },
      { code: 'toyama', count: 75 },
      { code: 'wakayama', count: 57 },
      { code: 'yamagata', count: 90 },
      { code: 'yamaguchi', count: 98 },
      { code: 'yamanashi', count: 48 },
    ]);
  });

  describe('gunma R8（#8・2県目・共有関数assembleSimpleTableRows経由での実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['gunma']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の106件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('242bfa16ee0687ff90ab0c5dd7bb91e42030d2e24aacfd88fbd08a5b149b42d3');
        // 学校別詳細表は物理ページ1〜2（3頁目は詳細表対象外）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('chiba R8（#8・5県目・最大件数(188件)での実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['chiba']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の188件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('b504b38339b78802683aee22f3e6fd62f8ebc73c768f6ea95a4fd389315435ee');
        // 詳細表は物理ページ1〜5（概要ページ無し・オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(5);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('saitama R8（#8・6県目・伊奈学園総合の学科名override経由での実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['saitama']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の241件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('66bd7c1b4eb29a4e2c2e9981d1b5d7f7f5d3c1d42b7ca6cfbaf3c53835c08b1e');
        // 学校別詳細表は物理ページ1〜8（概要ページ無し・オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(8);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('miyagi R8（#8・8県目・概要ページ1頁分のオフセット(+2)を持つ2例目）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['miyagi']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の129件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('60f536fd7a49c27db5a0b8ba193bd7ec944002f80c4f42e6f07f22eac163a83');
        // 学校別詳細表は物理ページ2〜5（1頁目は総括表のためオフセット+2）
        expect(locator!.page).toBeGreaterThanOrEqual(2);
        expect(locator!.page).toBeLessThanOrEqual(5);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('yamanashi R8（#8・9県目・+2オフセットかつ最少件数(48件)での実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['yamanashi']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の48件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('f2b9e5a7dc3e6d80f2acba342d262f0b9d51aa592aae19c93d0028cf3fc413b3');
        // 学校別詳細表は物理ページ2〜3（1頁目は概要のためオフセット+2）
        expect(locator!.page).toBeGreaterThanOrEqual(2);
        expect(locator!.page).toBeLessThanOrEqual(3);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('nagasaki R8（#8・7県目・概要ページ分オフセット(+3)が必要だった初のassembleSimpleTableRows県）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['nagasaki']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の116件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('4fb198d97abb9d1e1653e63d54eeae170ec497c7c893b3c52bedff658109d249');
        // 学校別詳細表は物理ページ3〜6（1〜2頁は概要・7〜10頁は定時制等の別表のためオフセット+3）
        expect(locator!.page).toBeGreaterThanOrEqual(3);
        expect(locator!.page).toBeLessThanOrEqual(6);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('iwate R8（#8・4県目・末尾の学科名overrideを含む実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['iwate']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の113件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('be09f4b46aab9fe5dce6400680218cc6004d942fcde401a1df748c46ddcaab87');
        // 詳細表は物理ページ1〜3（概要ページ無し・オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(3);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('tochigi R8（#8・3県目・overrideを一切持たない最単純ケースでの実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['tochigi']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の107件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('1c6e7dec275fbd9ba813c4e3c318e35cd21f5d881169c3c76d203b9d374ff226');
        // 詳細表は全3ページとも対象（概要ページ無し・オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(3);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('tottori R8（#8パイロット・実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['tottori']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の43件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('5745310ec7e1a91c026d76d4ac4595a145b4a4ceb38016e439982469817466a0');
        // 学校別詳細表は物理ページ5〜7（1〜4頁は地区別概要・8頁は定時制で対象外）
        expect(locator!.page).toBeGreaterThanOrEqual(5);
        expect(locator!.page).toBeLessThanOrEqual(7);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('ehime R8（#8・10県目・1頁2段組(LEFT/RIGHT)で初めてrowIndex衝突回避オフセットが必要だった県）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['ehime']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の99件全件がresolveSourceLocatorで解決でき、page+rowIndexの組が重複しない', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('6f7604dfb266d5d846d334c0def4454ccd1e0ef7bb9c5d6723cd6775f75915f9');
        // 1頁2段組(LEFT/RIGHT)で全件が物理ページ1に集約される
        expect(locator!.page).toBe(1);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
        const key = `${locator!.page}|${locator!.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('kagawa R8（#8・11県目・assembleSimpleTableRows利用県が全件完了）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['kagawa']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の68件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('cfb4eb76f72ead3da00749b03af47ebf10eab21d9c1d3ecf690154a714bc9e10');
        // 学校別詳細表は物理ページ1に完結（オフセット無し）
        expect(locator!.page).toBe(1);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('ibaraki R8（#8・12県目・共有関数assembleCompetitionRateRows経由での初の実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['ibaraki']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の149件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('697895e40b4b249007095fb7d03eaf7ff3cc3f177ce584de8d9cac3a19e60568');
        // 学校別詳細表は物理ページ1〜3（オフセット無し・4〜5頁は定時制等の別表）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(3);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('ishikawa R8（#8・13県目・併願制度3校(合算レコード)は意図的にpage/rowIndex無しの初のケース）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['ishikawa']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);
    const COMBINED_SCHOOLS = new Set(['小松', '金沢泉丘', '七尾']);

    it('R8の70件中67件(併願合算3校を除く)がresolveSourceLocatorで解決できる', () => {
      const resolved = r8.filter((r) => !COMBINED_SCHOOLS.has(r.schoolName));
      expect(resolved.length).toBe(67);
      for (const r of resolved) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('89be2abdee93fb8442f8ffd8f15b6eace8ac8359126c79057a5ff6de1d0496f4');
        // 学校別詳細表は物理ページ2〜3（1頁目は総括表のためオフセット+2）
        expect(locator!.page).toBeGreaterThanOrEqual(2);
        expect(locator!.page).toBeLessThanOrEqual(3);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('併願制度3校(小松・金沢泉丘・七尾)は複数物理行の合算のため意図的にpage/rowIndex未設定=null', () => {
      const combined = r8.filter((r) => COMBINED_SCHOOLS.has(r.schoolName));
      expect(combined.length).toBe(3);
      for (const r of combined) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('shimane R8（#8・14県目・くくり募集override経由でのpage保持を確認）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['shimane']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の64件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('83562e6497151b0375505952a2b0d19a8ca95115ce1da3bcb49d380670a9c688');
        // 学校別詳細表は物理ページ1に完結（オフセット無し）
        expect(locator!.page).toBe(1);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('tokushima R8（#8・15県目・1頁2段組(LEFT/MIDDLE)でehimeと同型のrowIndex衝突回避が必要だった県）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['tokushima']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の69件全件がresolveSourceLocatorで解決でき、page+rowIndexの組が重複しない', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('2a88e9e2a295776d28369e185076659c605a01a5977887d14f49744378fce33b');
        // 1頁2段組(LEFT/MIDDLE)で全件が物理ページ1に集約される
        expect(locator!.page).toBe(1);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
        const key = `${locator!.page}|${locator!.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('wakayama R8（#8・16県目・assembleCompetitionRateRows利用の全5県が完了）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['wakayama']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の57件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('ecf8970f1867e6de03e789a17b7446c723f48df5ba375088999e29dc97ba904a');
        // 学校別詳細表は物理ページ1に完結（オフセット無し）
        expect(locator!.page).toBe(1);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('okinawa R8（#8・17県目・assembleSimpleTableRows利用県で当初の候補調査から見落としていた1県）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['okinawa']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の156件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('c0b86b67230623207d3f828f94c427fa3a2a411870b1942a1ba9892f093151ee');
        // 学校別詳細表は物理ページ1〜4（オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(4);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('akita R8（#8・18県目・共有関数assembleNumberedBlockRows経由での初の実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['akita']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の78件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('8bcfb596fd7dc1f0f760982c48c0e281118c11abf044524f396386f539f1aef0');
        // 学校別詳細表は物理ページ1〜2（オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('aomori R8（#8・19県目・共有関数を使わない個別実装(tottori型)への初の横展開）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['aomori']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の89件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('8c5f5f66326a91f8678f3fde2db0aefc52a98aee394797ee33d8918d130c77fb');
        // 学校別詳細表は物理ページ1〜2（オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('fukui R8（#8・20県目・鯖江くくり募集override経由でのpage保持を確認）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['fukui']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の72件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('4294e962790af770bb2a6a82962d7a1733f9972c7406456ec48df1d9090a0f79');
        // 学校別詳細表は物理ページ1〜2（オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('fukuoka R8（#8・21県目・レコードごとに出典が異なる(sourceIndex)初のケース・sourceIndex:0の66件のみ解決）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['fukuoka']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('sourceIndex:0の66件がresolveSourceLocatorで解決できる', () => {
      const primarySourced = r8.filter((r) => r.sourceIndex === 0 && r.page !== undefined);
      expect(primarySourced.length).toBe(66);
      for (const r of primarySourced) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('c320a4cefe82b62498b2c6852a9d9f3d2a19fef6a573f86a3fe50b2d0daccfef');
        // 県立分PDFの学校別詳細表は物理ページ1〜4（市組合立分は別ページ5・別出典のためスコープ外）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(4);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('sourceIndex!=0の125件(市組合立分・英進館裏取り分・玄界/新宮のブロックoverride・八幡の既知データ誤記1件)はpage/rowIndex未設定のためnull', () => {
      const otherSourced = r8.filter((r) => r.page === undefined);
      expect(otherSourced.length).toBe(125);
      for (const r of otherSourced) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('gifu R8（#8・22県目・sourceIndex統一県(全134件がsourceIndex:0)での実データ検証）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['gifu']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の134件全件がresolveSourceLocatorで解決できる', () => {
      for (const r of r8) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('83e99c3f7c7983875529b0c803d10b7fac5c83636af601294b34f3bfaf2bdfba');
        // 学校別詳細表は物理ページ1〜5（オフセット無し）
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(5);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('hiroshima R8（#8・23県目・座標抽出で検出不能な手動補完レコード(加計・芸北)は意図的にlocatorなし）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['hiroshima']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の138件中137件がresolveSourceLocatorで解決できる', () => {
      const resolved = r8.filter((r) => r.page !== undefined);
      expect(resolved.length).toBe(137);
      for (const r of resolved) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('a69738c53cd69aba217033d24a9c6a0d40594241b50889a4983ef27a2bbd682d');
        // 学校別詳細表は物理ページ2〜5（1頁目は総括表のためオフセット+2）
        expect(locator!.page).toBeGreaterThanOrEqual(2);
        expect(locator!.page).toBeLessThanOrEqual(5);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('座標抽出で検出できず手動補完した加計・芸北は意図的にpage/rowIndex未設定=null', () => {
      const kakeGeihoku = r8.find((r) => r.schoolName === '加計・芸北');
      expect(kakeGeihoku).toBeDefined();
      expect(resolveSourceLocator(kakeGeihoku!, file.sources)).toBeNull();
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('kagoshima R8（#8・24県目・LEFT/RIGHT2段組でのrowIndex衝突回避を確認）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['kagoshima']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の156件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(156);
      const resolved = r8.filter((r) => r.page !== undefined);
      expect(resolved.length).toBe(156);
      for (const r of resolved) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('aad68f5b4411843bc0f704096c2c9e5caf35ebc14b53cbd417e3eabe935b3d9a');
        // 学校別詳細表は物理ページ3〜6（1頁目=全体サマリー・2頁目=学区別クロス集計のためオフセット+3）
        expect(locator!.page).toBeGreaterThanOrEqual(3);
        expect(locator!.page).toBeLessThanOrEqual(6);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でLEFT/RIGHT間のrowIndex重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('kochi R8（#8・25県目・個別実装県・概要ページ無しでオフセット+1）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['kochi']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の75件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(75);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('69c015a0e9e7e53eb9750fcaa4a25237c75f3fe447aa61b5cadad25ab8eaae8b');
        // 生PDF全2頁と概要ページ無しでgeometry配列2頁が完全一致するためオフセット+1
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('kumamoto R8（#8・26県目・罫線ブロック型個別実装・ブロックは毎ページ末尾で強制flush）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['kumamoto']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の162件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(162);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('7e92851a76f85de3a845828fc47290ebc46c3885d4cb347b5fc585af16a80b11');
        // 生PDF全5頁と概要ページ無しでgeometry配列5頁が完全一致するためオフセット+1
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(5);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('kyoto R8（#8・27県目・ブロック単位個別実装・概要ページ/定時制ページを除いた物理ページ2〜3）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['kyoto']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の75件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(75);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('0a8aa3bd2adddc8e59d49b0723b75489122a20c4d4939c9d1d93fffb2d25714f');
        // 生PDF全4頁中、学校別詳細表は物理ページ2〜3のみ(1頁目=概要・4頁目=定時制別表)
        expect(locator!.page).toBeGreaterThanOrEqual(2);
        expect(locator!.page).toBeLessThanOrEqual(3);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('nagano R8（#8・28県目・BLOCK_OVERRIDE校16校44件は意図的にlocatorなし）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['nagano']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の129件中85件がresolveSourceLocatorで解決でき、BLOCK_OVERRIDE由来の44件は解決できない', () => {
      expect(r8.length).toBe(129);
      const resolved = r8.filter((r) => r.page !== undefined);
      expect(resolved.length).toBe(85);
      for (const r of resolved) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('2e9b97e0222a396382a0d16b170727f4b1e9e0aae6f2bc29853f06f6795438c6');
        // 学校別詳細表(北信/東信/南信/中信)は物理ページ3〜6(1〜2頁目は総括表のためオフセット+3)
        expect(locator!.page).toBeGreaterThanOrEqual(3);
        expect(locator!.page).toBeLessThanOrEqual(6);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
      const unresolved = r8.filter((r) => r.page === undefined);
      expect(unresolved.length).toBe(44);
      for (const r of unresolved) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8.filter((r) => r.page !== undefined)) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('nara R8（#8・29県目・ブロック単位個別実装・基底ラベル使い回し行も含め全件locator付与）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['nara']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の71件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(71);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('8a56a562abce73287d89e9d47aa2fda18ac5d94b39df57d99095ccd535de4bbf');
        // 生PDF全2頁と概要ページ無しでgeometry配列2頁が完全一致するためオフセット+1
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('niigata R8（#8・30県目・全日制/定時制の境界がページ境界と無関係に発生する個別実装）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['niigata']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の93件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(93);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('a8fd6f1d0b38b424501d12cd82adb56f9b358275f55894ae3d59d06ef2155021');
        // 学校別詳細表は物理ページ3〜6(1〜2頁目は概要・志願変更受付の説明のためオフセット+3)
        expect(locator!.page).toBeGreaterThanOrEqual(3);
        expect(locator!.page).toBeLessThanOrEqual(6);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('oita R8（#8・31県目・pendingキュー型個別実装・概要ページ無しでオフセット+1）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['oita']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の81件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(81);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('7b4946f78bee200555fd953e38a59dcb649bd7303aac66bc30f77cafb0ae50c6');
        // 生PDF全4頁と概要ページ無しでgeometry配列4頁が完全一致するためオフセット+1
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(4);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('saga R8（#8・32県目・位置ベース補完4件(INJECT_BEFORE_FIRST_DEPARTMENT3件+白石1件)は意図的にlocatorなし）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['saga']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の71件中67件がresolveSourceLocatorで解決でき、位置ベース補完4件は解決できない', () => {
      expect(r8.length).toBe(71);
      const resolved = r8.filter((r) => r.page !== undefined);
      expect(resolved.length).toBe(67);
      for (const r of resolved) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('4f8537257f150458c79e90edf49e46eca3c54fa290437b4180455d9e9a06b6f2');
        // 学校別詳細表は物理ページ1〜2(3頁目は定時制のためオフセット+1)
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
      const unresolved = r8.filter((r) => r.page === undefined);
      expect(unresolved.length).toBe(4);
      for (const r of unresolved) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8.filter((r) => r.page !== undefined)) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('shiga R8（#8・33県目・「両方の学科」合算レコード5件は意図的にlocatorなし）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['shiga']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の61件中56件がresolveSourceLocatorで解決でき、合算レコード5件は解決できない', () => {
      expect(r8.length).toBe(61);
      const resolved = r8.filter((r) => r.page !== undefined);
      expect(resolved.length).toBe(56);
      for (const r of resolved) {
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('37ff452d4c35b9ca7ec73e75ea65f29338a93d9618c5bbe8e93c3d147986eef9');
        // 生PDF全3頁と概要ページ無しでgeometry配列3頁が完全一致するためオフセット+1
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(3);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
      const unresolved = r8.filter((r) => r.page === undefined);
      expect(unresolved.length).toBe(5);
      for (const r of unresolved) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8.filter((r) => r.page !== undefined)) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('shizuoka R8（#8・34県目・tochigi型個別実装・全9頁分がすべてlocator解決可能）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['shizuoka']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の162件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(162);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('738a35b451cfd97123e1ccc83f5dd0dc822efd4f04e1b719476406b5eb55fc9f');
        // 生PDF全12頁中、学校別詳細表は物理ページ1〜9のみ(10〜12頁目は定時制等でスコープ外)
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(9);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('toyama R8（#8・35県目・kyoto/nara型ブロック単位個別実装・合成レコード無しで全件locator解決）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['toyama']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の75件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(75);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('c2e680eca94b8b40f9ac61c083ed83d930e872ef2a67c9fd0f0413395ceb3b4f');
        // 生PDF全3頁のうち学校別詳細表は物理ページ1〜2のみ(3頁目はスコープ外)
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('yamagata R8（#8・36県目・登録パーサ全県完了・表紙/定時制頁を除いた物理ページ2〜4）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['yamagata']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の90件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(90);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('f24256730874eae7df6aea054a6f12f9e20292dcb17186669efeff7eff40b58d');
        // 生PDF全5頁中、学校別詳細表は物理ページ2〜4のみ(1頁目=表紙・5頁目=定時制)
        expect(locator!.page).toBeGreaterThanOrEqual(2);
        expect(locator!.page).toBeLessThanOrEqual(4);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('fukushima R8（#8・ビジョン11県2県目・後期選抜のみ全日制50校99レコード）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['fukushima']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の99件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(99);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('d42c2ffc7d0881ebc46889e847a11d38369c9b926fc840ff779e7df7e775da0d');
        expect(locator!.page).toBeGreaterThanOrEqual(1);
        expect(locator!.page).toBeLessThanOrEqual(2);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });

  describe('yamaguchi R8（#8・ビジョン11県の初着手・パーサ非経由でPDF目視確認による位置的割当）', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['yamaguchi']!;
    const r8 = file.records.filter((r) => !r.fiscalYear);

    it('R8の98件全件がresolveSourceLocatorで解決できる', () => {
      expect(r8.length).toBe(98);
      for (const r of r8) {
        expect(r.page).toBeDefined();
        const locator = resolveSourceLocator(r, file.sources);
        expect(locator).not.toBeNull();
        expect(locator!.pdfSha256).toBe('ab94bcf1314ad51f83c379944bacff4b67f245a41ca8c92a25908067efebe81d');
        // 生PDF全4頁中、1頁目は訂正通知の表紙で学校別詳細表は物理ページ2〜4のみ
        expect(locator!.page).toBeGreaterThanOrEqual(2);
        expect(locator!.page).toBeLessThanOrEqual(4);
        expect(locator!.rowIndex).toBeGreaterThanOrEqual(0);
      }
    });

    it('同一page内でrowIndexの重複が無い', () => {
      const seen = new Set<string>();
      for (const r of r8) {
        const key = `${r.page}|${r.rowIndex}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    it('R7以前（fiscalYear明示済み）はまだpage/rowIndex未バックフィルのため全件null', () => {
      const pre8 = file.records.filter((r) => r.fiscalYear !== undefined);
      expect(pre8.length).toBeGreaterThan(0);
      for (const r of pre8) {
        expect(resolveSourceLocator(r, file.sources)).toBeNull();
      }
    });
  });
});

describe('licensableRecords（T-S13A A-0-5・商用第三者資料のみを唯一の情報源とするレコードの除外）', () => {
  it('fukuokaは令和6年度(育伸社が唯一の情報源)の191レコードのみが除外される', () => {
    const file = COMPETITION_RATE_BY_PREFECTURE['fukuoka'];
    expect(file).toBeDefined();
    const excluded = file!.records.filter((r) => r.commercialSourceOnly);
    expect(excluded.length).toBe(191);
    expect(excluded.every((r) => r.fiscalYear === '令和6年度（2024年度）')).toBe(true);

    const licensable = licensableRecords(file!);
    expect(licensable.length).toBe(file!.records.length - 191);
    expect(licensable.some((r) => r.fiscalYear === '令和6年度（2024年度）')).toBe(false);
    // R7/R8（教委公式PDFが主要典拠）はcommercialSourceOnlyを立てず配布対象のまま維持する
    expect(licensable.some((r) => r.fiscalYear === '令和7年度（2025年度）')).toBe(true);
    expect(licensable.some((r) => r.fiscalYear === undefined)).toBe(true);
  });

  it('参考: fukuoka以外の46都道府県はcommercialSourceOnlyレコードが存在しない（除外対象の意図しない拡大を検知）', () => {
    const unexpected: Array<{ code: string; count: number }> = [];
    for (const [code, file] of Object.entries(COMPETITION_RATE_BY_PREFECTURE)) {
      if (code === 'fukuoka' || !file) continue;
      const count = file.records.filter((r) => r.commercialSourceOnly).length;
      if (count > 0) unexpected.push({ code, count });
    }
    expect(unexpected).toEqual([]);
  });
});
