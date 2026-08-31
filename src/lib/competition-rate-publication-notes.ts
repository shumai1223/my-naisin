/**
 * T-Y11 A-1: `CompetitionRatePublicationBaselineEntry.unresolved`のうち
 * 「公表日（発表日そのもの）」を1県ずつ目視で埋めていく手作業台帳。
 *
 * `CompetitionRateSource`型に`publishedAt`フィールドが無いため、各県ファイルの
 * ヘッダコメントに既に自然文で書かれている公表日をここへ転記する（新しい調査ではなく、
 * 既存の記述を構造化するだけ＝Y-0憲法③「1データ点1出典」を保ったまま機械可読にする）。
 * 47県中この記述が既にある県から埋まっていく。無い県は無理に調べに行かず`unknown`のまま
 * （公表日を調べるための追加調査そのものは、A-1本体ではなくA-2の更新検知で自然に判明する）。
 */

export interface PublicationTimingNote {
  /** 判明している精度のまま書く（「頃」「〜」等の曖昧さを削らない）。 */
  publishedAt: string;
  /** どのファイルのどの記述から転記したか。 */
  evidence: string;
}

export const PUBLICATION_TIMING_NOTES: Partial<Record<string, PublicationTimingNote>> = {
  chiba: {
    publishedAt: '令和8年（2026年）2月13日',
    evidence: 'chiba.tsヘッダコメント既存記載（xlsx版は公開されておらずPDF版のみ）',
  },
  kanagawa: {
    publishedAt: '2026-02-09',
    evidence: 'kanagawa.tsヘッダコメント既存記載（sourceUrl直下に明記）',
  },
  osaka: {
    publishedAt: '令和8年3月7日',
    evidence: 'osaka.tsヘッダコメント既存記載（志願者数の締切は3月6日午後2時・公表は翌日）',
  },
  saitama: {
    publishedAt: '令和8年2月19〜20日頃',
    evidence: 'saitama.tsヘッダコメント既存記載（xlsx版は公開されておらずPDF版のみ）',
  },
  tokyo: {
    publishedAt: '2026-02-13',
    evidence: 'tokyo.tsヘッダコメント既存記載（令和8年度・最終応募状況）',
  },
};
