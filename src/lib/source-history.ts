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
  saitama: [
    {
      date: '2026-07-23',
      sourceUrl: 'https://www.pref.saitama.lg.jp/documents/258788/news2024092601.pdf',
      sourceTitle: '埼玉県教育委員会「令和9年度埼玉県公立高等学校入学者選抜実施基本方針」（令和6年9月26日）',
      note: '令和9(2027)年度入試から調査書の記載事項を「各教科の学習の記録（9教科5段階の評定）」を基本とする形に整理（特別活動等の記録・出欠の記録等を削除）。全受検生対象の面接・自己評価資料を新設。内申点の算出に使う評定（9教科5段階）・学年比率選択（1:1:1/1:1:2/1:1:3）の仕組み自体には変更なしと確認（/nyushi-seido-henkouにも掲載）',
    },
  ],
  osaka: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_kokosenbatsu.html',
      sourceTitle: '大阪府教育庁 入試情報（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。一般入学者選抜で中1・中2の評定を2倍(各90点満点)・中3の評定を6倍(270点満点)とし合計450点満点とする計算方式を、教育系情報サイト複数(進研ゼミ/塾ジャーナル系)で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(gradeMultipliers 1:2/2:2/3:6・maxScore 450)と完全一致',
    },
  ],
  chiba: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2024/koukou/r8kaizenten.html',
      sourceTitle: '千葉県教育委員会「千葉県公立高等学校入学者選抜の改善点について」',
      note: '令和9(2027)年度入試から、学力検査の国語「話すこと・聞くこと」領域の出題方法が変更（従来の放送による聞き取り検査→話し合いの場面等を設定した文章による出題）。調査書関連の改善（総合的な学習の時間の記録・出欠の記録・行動の記録(第3学年)・総合所見の4項目削除）は令和8(2026)年度入試から既に実施済みで、確認時点(2026-07-24)ではもう「予告」段階ではなく施行済み。K値・内申点の算出方法自体（K値による傾斜配点方式）には変更ありと明記された記述は見当たらず、確認できたのは上記の学力検査出題方法・調査書記載事項の変更のみ',
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
