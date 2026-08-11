import {
  sumRecords,
  checkAgainstSubtotal,
  resolveRecordSourceIndex,
  countUnresolvedSources,
  licensableRecords,
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
