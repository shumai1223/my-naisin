import { getSourceHistory } from './source-history';
import { PREFECTURES } from './prefectures';

/**
 * T-C9: 「年次更新の実績」を見せるための実例集（/reliability・提案書向け）。
 *
 * `/terms`は「教育委員会が翌年度の入学者選抜実施要項を公表してから60日以内に反映する」と約束
 * しているが、公表日を記録するデータフィールドが現状無いため、経過日数の実測値を計算することは
 * できない（捏造ゼロ原則）。代わりに、実際に制度変更を検知し記録した具体的な事例を示すことで、
 * 「変更を見逃さず追い続けている」ことの実例的な証拠とする。
 *
 * 各エントリはsource-history.tsのMANUAL_HISTORYに実在する(prefecture, date)のペアを指す。
 * annual-update-examples.test.tsが該当日付の記録が実際に存在することを検証する
 * （日付やprefectureを書き換えてもテストが実在確認するため、架空の実績を追加できない設計）。
 */
export interface AnnualUpdateExample {
  prefecture: string;
  /** MANUAL_HISTORYの該当エントリのdate（実在確認の照合キー）。 */
  date: string;
  /** 公開向けの一言要約（内部の詳細調査メモではなく、変更内容のみを簡潔に）。 */
  summary: string;
}

export const ANNUAL_UPDATE_EXAMPLES: AnnualUpdateExample[] = [
  {
    prefecture: 'nara',
    date: '2026-08-10',
    summary:
      '令和8年度入試から、内申点の対象学年に中1を追加し135点満点から144点満点（標準パターン）へ拡大する制度改定を検知・記録。',
  },
  {
    prefecture: 'iwate',
    date: '2026-08-10',
    summary:
      '令和7年度入試から、内申点の圧縮後点数が440点満点から500点満点へ変更されたことを検知・記録（基礎計算式の660点満点自体は不変）。',
  },
];

export interface AnnualUpdateExampleView extends AnnualUpdateExample {
  prefectureName: string;
}

/** 実在確認込みで公開用ビューを返す。source-history.tsに該当日付の記録が無い場合は例外を投げる。 */
export function getAnnualUpdateExamples(): AnnualUpdateExampleView[] {
  return ANNUAL_UPDATE_EXAMPLES.map((ex) => {
    const history = getSourceHistory(ex.prefecture);
    const found = history.some((snap) => snap.date === ex.date);
    if (!found) {
      throw new Error(
        `ANNUAL_UPDATE_EXAMPLESの'${ex.prefecture}'(${ex.date})に対応する記録がsource-history.tsに見つかりません（実績の捏造防止ガード）。`,
      );
    }
    const pref = PREFECTURES.find((p) => p.code === ex.prefecture);
    return { ...ex, prefectureName: pref?.name ?? ex.prefecture };
  });
}
