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
  tottori: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html',
      sourceTitle: '鳥取県教育委員会 入学者選抜（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3の評定のみを対象とし実技4教科を2倍にする基本65点満点の内申点計算方式(9教科×5段階+実技加重)を、教育系情報サイトでクロスチェックし、変更が無いことを確認した。志望校ごとに更に2〜4倍の追加倍率をかけ130/195/260点等へ換算する仕組み(既存noteフィールドに明記済み)も一致。学力検査:調査書の比率は2:8〜8:2の範囲で高校ごとに設定。数値は既存記載(practicalMultiplier 2・maxScore 65)と完全一致',
    },
  ],
  fukui: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08youkou.html',
      sourceTitle: '福井県教育委員会「令和8年度福井県立高等学校入学者選抜に関する実施要項」',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3の評定のみを対象(9教科×5段階=45点満点)とし学力検査点500点満点と合算する内申点計算方式を、教育系情報サイトでクロスチェックし、45点満点という配点自体に変更が無いことを確認した。数値は既存記載(targetGrades [3]・maxScore 45)と完全一致',
    },
  ],
  yamagata: [
    {
      date: '2026-07-24',
      sourceUrl:
        'https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf',
      sourceTitle: '山形県教育委員会「令和8年度山形県公立高等学校入学者選抜実施要項」',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3の評定のみを対象(9教科×5段階=45点満点)とする内申点計算方式(調査書と学力検査の比率は3:7〜7:3の中から高校が選択)を、教育系情報サイトで独立にクロスチェックし、変更が無いことを確認した。数値は既存記載(targetGrades [3]・maxScore 45)と完全一致',
    },
  ],
  aomori: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/nyuushi.html',
      sourceTitle: '青森県教育委員会 入学者選抜（令和8年度県立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。一般選抜では中1・中2・中3の評定合計(各45点満点)を均等(倍率無し)に合算する135点満点の内申点計算方式(学力検査は5教科500点満点)を、教育系情報サイトで独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(gradeMultipliers 1:1/2:1/3:1・maxScore 135)と完全一致',
    },
  ],
  hokkaido: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/kki/',
      sourceTitle: '北海道教育委員会 入学者選抜（令和8年度道立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中1・中2の評定合計(各45点満点)をそれぞれ2倍・中3の評定合計(45点満点)を3倍にして合算する内申点計算方式(90+90+135=315点満点)を、教育系情報サイトで独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(gradeMultipliers 1:2/2:2/3:3・maxScore 315)と完全一致',
    },
  ],
  kanagawa: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      sourceTitle: '神奈川県教育委員会 入試情報（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中2・中3の2学年のみが対象で、中2の評定合計(45点満点)をそのまま・中3の評定合計を2倍(90点満点)にして合算した135点満点の内申点計算方式(S値=内申点135満点+学力検査500満点をそれぞれ100点換算し志望校ごとの比率2:8〜8:2で合算)を、教育系情報サイト複数(ステップ/栄光ゼミナール/塾選ジャーナル/湘南ゼミナール)で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(targetGrades [2,3]・gradeMultipliers 2:1/3:2・maxScore 135)と完全一致',
    },
  ],
  tokyo: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html',
      sourceTitle: '東京都教育委員会「令和8年度入学者選抜実施要綱」',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3のみが対象で、5教科の評定合計をそのまま・実技4教科の評定合計を2倍にして合算した65点満点の換算内申(学力検査700点+調査書300点+ESAT-J20点=総合1020点満点のうち300点分に換算)という計算方式を、教育系情報サイト複数(栄光ゼミナール/進研ゼミ/都立高のトリセツ等)で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(coreMultiplier 1・practicalMultiplier 2・maxScore 65・reverseCalc.totalMaxScore 1020)と完全一致',
    },
  ],
  hyogo: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.hyogo-c.ed.jp/~koko-bo/',
      sourceTitle: '兵庫県教育委員会 入学者選抜（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3のみが対象で、主要5教科の評定合計(25点満点)を4倍・実技4教科の評定合計(20点満点)を7.5倍し、調査書点250点満点(学力検査250点満点と合わせ総合500点満点)とする計算方式を、教育系情報サイト複数で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(coreMultiplier 4・practicalMultiplier 7.5・maxScore 250)と完全一致',
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
