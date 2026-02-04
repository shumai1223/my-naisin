// 更新ログデータ
// E-E-A-T (Trust) 向上のため、変更履歴を記録

export interface ChangeLogEntry {
  date: string; // YYYY-MM-DD
  prefectureCode?: string; // 特定の都道府県に関する変更の場合
  type: 'add' | 'update' | 'fix' | 'remove';
  category: 'calculation' | 'data' | 'feature' | 'ui' | 'content';
  title: string;
  description: string;
  sourceUrl?: string;
  sourceName?: string;
}

export const CHANGELOG: ChangeLogEntry[] = [
  {
    date: '2026-02-04',
    type: 'add',
    category: 'feature',
    title: '3導線ナビゲーションを追加',
    description: 'トップページに「計算」「逆算」「制度理解」の3つの目的別導線を追加しました。',
  },
  {
    date: '2026-02-04',
    type: 'add',
    category: 'feature',
    title: '志望校逆算機能を追加',
    description: '目標総合点から必要な当日点を逆算できる機能を追加しました。',
  },
  {
    date: '2026-02-04',
    type: 'update',
    category: 'ui',
    title: '数値入力機能を追加',
    description: 'スライダーに加えて直接数値入力ができるようになりました。',
  },
  {
    date: '2026-02-04',
    type: 'add',
    category: 'feature',
    title: '計算根拠の表示を追加',
    description: '計算結果の下に対象学年・倍率・満点・参照元を常時表示するようになりました。',
  },
  {
    date: '2026-01-30',
    prefectureCode: 'tokyo',
    type: 'update',
    category: 'data',
    title: '東京都の入試情報を更新',
    description: '令和8年度入学者選抜の情報に基づき、ESAT-J加点情報を更新しました。',
    sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/',
    sourceName: '東京都教育委員会',
  },
  {
    date: '2026-01-30',
    type: 'update',
    category: 'data',
    title: '全47都道府県の計算方式を確認',
    description: '各都道府県教育委員会の公式情報に基づき、計算方式を確認・更新しました。',
  },
  {
    date: '2026-01-28',
    type: 'add',
    category: 'content',
    title: '都道府県別解説ページを追加',
    description: '各都道府県の計算方法・注意点・公式情報リンクをまとめたページを追加しました。',
  },
  {
    date: '2026-01-25',
    type: 'add',
    category: 'feature',
    title: '成績推移グラフを追加',
    description: '過去の計算履歴をグラフで可視化できるようになりました。',
  },
  {
    date: '2026-01-20',
    type: 'add',
    category: 'feature',
    title: '履歴保存機能を追加',
    description: '計算結果を端末に保存し、後から振り返れるようになりました。',
  },
  {
    date: '2026-01-15',
    type: 'add',
    category: 'feature',
    title: 'サービス公開',
    description: 'My Naishin（内申点計算サービス）を公開しました。',
  },
];

export function getRecentChanges(limit: number = 5): ChangeLogEntry[] {
  return CHANGELOG.slice(0, limit);
}

export function getChangesByPrefecture(prefectureCode: string): ChangeLogEntry[] {
  return CHANGELOG.filter((entry) => entry.prefectureCode === prefectureCode);
}

export function getChangesByCategory(category: ChangeLogEntry['category']): ChangeLogEntry[] {
  return CHANGELOG.filter((entry) => entry.category === category);
}
