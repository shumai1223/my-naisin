// 更新ログデータ
// E-E-A-T (Trust) 向上のため、変更履歴を記録

export interface ChangeLogEntry {
  date: string; // YYYY-MM-DD
  prefectureCode?: string; // 特定の都道府県に関する変更の場合
  type: 'add' | 'update' | 'fix' | 'remove';
  category: 'calculation' | 'data' | 'feature' | 'ui' | 'content' | 'seo';
  title: string;
  description: string;
  sourceUrl?: string;
  sourceName?: string;
}

export const CHANGELOG: ChangeLogEntry[] = [
  {
    date: '2026-04-29',
    type: 'update',
    category: 'content',
    title: 'ブログさらに＋21記事アップデート！最新の入試トレンドを反映',
    description: '「2026年度最新の内申点トレンド」「逆転合格の戦略」「保護者向けサポートガイド」「新学期チェックリスト」など、受験生と保護者に必要な10本以上の専門コラムを一挙に公開・更新しました。',
  },
  {
    date: '2026-04-29',
    type: 'add',
    category: 'content',
    title: '【東京都】2026年度入試完全ガイド記事の追加',
    description: '分割募集廃止や深沢高校の「10:0」選抜など、2026年度（令和8年度）の最新の都立高校入試制度に対応した詳細解説記事を公開しました。換算内申からESAT-Jまで、網羅的に解説しています。',
    sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/',
    sourceName: '東京都教育委員会',
  },
  {
    date: '2026-04-29',
    type: 'update',
    category: 'ui',
    title: 'エディトリアル・ブログデザインへの全面刷新',
    description: 'コンテンツの読みやすさと専門性を高めるため、ブログ記事のデザインを雑誌のような「エディトリアル」スタイルに刷新しました。タイポグラフィ、余白、視覚要素を最適化し、長文でも没入して読める環境を整えました。',
  },
  {
    date: '2026-04-22',
    type: 'update',
    category: 'data',
    title: '高校データの大幅改新および上位校情報の公開',
    description: '全国47都道府県の公立高校入試ボーダーラインデータを大幅に更新しました。各都道府県の上位10校を中心に、合格目安となる内申点や当日点の情報を最新の入試結果に基づき収集・公開。志望校選びの精度を向上させました。',
  },
  {
    date: '2026-04-08',
    type: 'update',
    category: 'seo',
    title: '全都道府県別ページの独自コンテンツ化と専門性強化',
    description: '47都道府県それぞれの入試制度に基づいた、より詳細で専門的な解説・FAQ・注意点を大幅拡充。各県固有の「内申点の落とし穴」や「2026年度最新傾向」を盛り込み、検索意図への合致度を極限まで高めました。',
  },
  {
    date: '2026-04-08',
    type: 'add',
    category: 'content',
    title: '2026年4月新学期対応コラムの大量追加とサイトマップ同期',
    description: '新学期からの内申点スタートダッシュを決めるための専門コラムを追加. 。すべての新規コンテンツが検索エンジンに正しくインデックスされるよう、XMLサイトマップおよび内部リンク構造を最適化しました。',
  },
  {
    date: '2026-04-08',
    type: 'update',
    category: 'ui',
    title: '視認性とアクセシビリティの大幅向上',
    description: '長文コンテンツでも読みやすいよう、タイポグラフィの調整、図解要素の追加、スマホでの操作性改善を実施。E-E-A-T向上のため、各記事の執筆根拠となる一次資料へのアクセスを容易にしました。',
  },
  {
    date: '2026-03-20',
    type: 'update',
    category: 'feature',
    title: 'Googlebot巡回最適化と内部リンク強化',
    description: 'トップページに重要ページへの内部リンクを追加し、新着記事セクションを設置。サイトマップとEEAT情報を更新し、検出-未登録ページのインデックス促進を図る。',
  },
  {
    date: '2026-03-20',
    type: 'update',
    category: 'seo',
    title: '構造化データとメタデータの最適化',
    description: 'すべての主要ページにパンくずリスト構造化データを追加。robotsメタタグとcanonical URLを設定し、SEO基盤を強化。',
  },
  {
    date: '2026-03-20',
    type: 'fix',
    category: 'feature',
    title: 'Next.jsビルドエラーを修正',
    description: 'useSearchParams()のSuspense境界の問題を解決し、安定したビルド環境を確保。',
  },
  {
    date: '2026-03-10',
    type: 'update',
    category: 'ui',
    title: 'ブログ全面リニューアル！高品質のデザインに刷新',
    description: '記事ページをプレミアムデザインに全面改修。ヒーローヘッダー・目次・FAQ・CTA・関連記事を追加。ブログ一覧ページもフィーチャード記事＋カテゴリ別表示に刷新。トップページのブログセクションも新記事対応のカード型レイアウトに変更。',
  },
  {
    date: '2026-03-10',
    type: 'update',
    category: 'content',
    title: '都道府県別ガイド記事を大幅加筆',
    description: '「対象学年まとめ」「副教科の倍率まとめ」の2記事を大幅に加筆。学年別対策チェックリスト、倍率シミュレーション表、失敗パターン集、副教科の評定アップのコツなどを追加。FAQスキーマも実装。',
  },
  {
    date: '2026-03-09',
    type: 'add',
    category: 'content',
    title: 'ブログ記事を10本一挙公開！内申点の基礎から受験戦略まで完全網羅',
    description: '「内申点とは？」「内申点の平均」「上げ方7選」「オール3で行ける高校」「内申点が足りない時の戦略」「中1からの対策」「定期テストと内申点」「提出物・授業態度テクニック」「不登校と高校受験」「入試方式別の仕組み」の10記事を追加。検索需要の高いキーワードを網羅し、SEO強化とユーザー価値の向上を実現。',
  },
  {
    date: '2026-03-09',
    type: 'update',
    category: 'feature',
    title: 'SEO最適化・サイト品質の改善',
    description: 'FAQスキーマ構造化データの追加、ブログ記事のメタデータ強化、内部リンク構造の最適化、サイトマップの改善を実施。検索エンジンでの上位表示を目指した包括的な最適化。',
  },
  {
    date: '2026-03-07',
    type: 'fix',
    category: 'content',
    title: 'プライバシーポリシー・お問い合わせページの改善',
    description: 'GA未導入の記述修正、セクション番号重複の修正、AdPlaceholderのテキスト削除、お問い合わせフォームのname属性追加、SNSリンクの修正を実施。',
  },
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
