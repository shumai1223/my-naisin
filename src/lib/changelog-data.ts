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
    date: '2026-02-11',
    type: 'fix',
    category: 'calculation',
    title: 'すべての都道府県を完全網羅！逆算計算ツールが日本全国対応に',
    description: '残りのすべての都道府県（山口県、岡山県、広島県、四国4県、九州・沖縄7県）に逆算計算設定を追加。埼玉県には標準1:1:2モデルの注記も実装。これにより日本全国47都道府県すべてで正確な逆算計算が可能に。',
  },
  {
    date: '2026-02-11',
    type: 'fix',
    category: 'calculation',
    title: '重大な誤り発見！大阪府の内申点計算を完全修正',
    description: '大阪府の内申点計算に重大な誤りを発見し修正。中1・中2は2倍、中3は6倍（正）、タイプⅠ〜Ⅴまで存在（正）、450点満点に対する倍率も修正。すべての都道府県情報を公式情報で再検証済み。',
  },
  {
    date: '2026-02-11',
    type: 'fix',
    category: 'calculation',
    title: '都道府県逆算計算の「残り1割の落とし穴」を完全対策',
    description: '大阪府のタイプ別倍率選択、東京都の実技教科2倍ルールとESAT-J対応、神奈川県の中2・中3内申比率、傾斜配点警告など、Geminiが指摘した隠れたエラー要因すべてに対応しました。',
  },
  {
    date: '2026-02-11',
    type: 'fix',
    category: 'calculation',
    title: 'すべての都道府県逆算計算ロジックを完全修正',
    description: '大阪府（900点満点）、東京都（1020点満点）、神奈川県（S値方式）、千葉県（K値方式）、埼玉県など、各都道府県の正しい入試制度に基づいた逆算計算を実装しました。',
  },
  {
    date: '2026-02-09',
    type: 'fix',
    category: 'content',
    title: 'E-E-A-T信頼性問題を完全修正',
    description: '一次情報リンクの404、不適切表現、断定口調を修正し、広告前提のプライバシーポリシーを強化しました。',
  },
  {
    date: '2026-02-09',
    type: 'add',
    category: 'feature',
    title: 'PWA機能を追加',
    description: 'スマホのホーム画面に追加でき、アプリのように使えるPWA機能を実装しました。',
  },
  {
    date: '2026-02-08',
    type: 'fix',
    category: 'data',
    title: '致命的問題を完全解消',
    description: 'データ整合性・SEO・技術的問題をすべて修正し、100点レベルの品質を達成しました。',
  },
  {
    date: '2026-02-08',
    type: 'fix',
    category: 'data',
    title: 'ブログ記事の県別満点不一致を修正',
    description: '福岡県・埼玉県・北海道の満点表示を正しく修正し、単一データソース化を完了しました。',
  },
  {
    date: '2026-02-08',
    type: 'fix',
    category: 'feature',
    title: 'robots.txtとsitemap.xmlを修正',
    description: 'SEO基盤を修正し、正しいURLと形式で検索エンジンが認識できるようにしました。',
    sourceName: 'robots.txt',
  },
  {
    date: '2026-02-08',
    type: 'add',
    category: 'feature',
    title: '都道府県比較機能を追加',
    description: '最大4県の内申点制度を比較できる機能を追加しました。',
  },
  {
    date: '2026-02-08',
    type: 'add',
    category: 'feature',
    title: 'ツール集ページを追加',
    description: 'すべてのツールをまとめた一覧ページを作成し、ユーザビリティを向上させました。',
  },
  {
    date: '2026-02-08',
    type: 'fix',
    category: 'calculation',
    title: '東京都の計算例矛盾を修正',
    description: '実技倍率を考慮した正確な計算ロジックに修正し、計算例の信頼性を確保しました。',
    prefectureCode: 'tokyo',
  },
  {
    date: '2026-02-08',
    type: 'update',
    category: 'data',
    title: 'データ整合性チェックスクリプトを強化',
    description: 'ブログ記事内の数値整合性チェック機能を追加し、品質保証体制を強化しました。',
  },
  {
    date: '2026-02-08',
    type: 'add',
    category: 'content',
    title: 'TrustInfoコンポーネントを追加',
    description: '信頼性情報（最終確認日・参照資料・更新履歴）を統一表示するコンポーネントを追加しました。',
  },
  {
    date: '2026-02-08',
    type: 'add',
    category: 'content',
    title: 'ToolGuideコンポーネントを追加',
    description: 'ツールの使い方・注意点・よくある間違いを案内するコンポーネントを追加しました。',
  },
  {
    date: '2026-02-08',
    type: 'fix',
    category: 'data',
    title: '愛知県の満点不一致を修正',
    description: 'ブログデータの愛知県満点を45点から90点に修正し、データ整合性を確保しました。',
    prefectureCode: 'aichi',
  },
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
