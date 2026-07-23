// 47都道府県教育委員会の一次ソース確認履歴（X-14・∞継続型の変更履歴トラッキング基盤）。
//
// prefectures.ts が保持するのは「現在の」sourceUrl/sourceTitle/lastVerifiedのみで、
// 過去の変遷を追えない。本ファイルは「いつ・どの一次ソースを・どう確認したか」の
// 履歴を積み上げるための唯一の場所。
//
// 過去のスナップショットを創作することは捏造にあたるため、各都道府県の最初のエントリは
// prefectures.ts の既存 lastVerified フィールドから機械的に生成する（＝実際に確認済みの日付
// そのもの）。それ以降のエントリは、制度変更を確認する・再検証する等の実際の作業が発生した
// 都度、MANUAL_HISTORY に手動で追記していく（ここに架空の日付・架空の変更内容を追加しない）。
import { PREFECTURES } from './prefectures';

export interface SourceSnapshot {
  date: string;
  sourceUrl: string;
  sourceTitle: string;
  note: string;
}

// 実際に確認・変更を検知した際にのみ追記する（日付・内容の捏造禁止）。
const MANUAL_HISTORY: Record<string, SourceSnapshot[]> = {
  aichi: [
    {
      date: '2026-07-23',
      sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
      sourceTitle:
        '愛知県教育委員会・名古屋市教育委員会・豊橋市教育委員会「調査書情報の変更点」（令和8年4月発行）',
      note: '令和9(2027)年度入試から調査書の「性別」「行動の記録」「出欠の記録」を削除。内申点の算出に使う「学習の記録（評定）」欄・計算方法自体には変更なしと確認（/nyushi-seido-henkouにも掲載）',
    },
  ],
};

export function getSourceHistory(code: string): SourceSnapshot[] {
  const pref = PREFECTURES.find((p) => p.code === code);
  if (!pref?.sourceUrl || !pref.sourceTitle || !pref.lastVerified) return [];

  const baseline: SourceSnapshot = {
    date: pref.lastVerified,
    sourceUrl: pref.sourceUrl,
    sourceTitle: pref.sourceTitle,
    note: 'このアーカイブの起点となる最初の確認記録',
  };

  const manual = MANUAL_HISTORY[code] ?? [];
  return [baseline, ...manual].sort((a, b) => a.date.localeCompare(b.date));
}

export interface PrefectureSourceHistory {
  code: string;
  name: string;
  region: string;
  history: SourceSnapshot[];
}

export function getAllSourceHistories(): PrefectureSourceHistory[] {
  return PREFECTURES.map((p) => ({
    code: p.code,
    name: p.name,
    region: p.region,
    history: getSourceHistory(p.code),
  })).filter((entry) => entry.history.length > 0);
}
