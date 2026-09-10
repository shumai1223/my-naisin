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
      { code: 'chiba', count: 188 },
      { code: 'gunma', count: 106 },
      { code: 'iwate', count: 113 },
      { code: 'saitama', count: 241 },
      { code: 'tochigi', count: 107 },
      { code: 'tottori', count: 43 },
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
