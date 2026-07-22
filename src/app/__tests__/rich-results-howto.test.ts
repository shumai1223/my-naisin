/**
 * @jest-environment node
 *
 * リッチリザルト全面監査（TIER L-2）第三弾: HowToSchema網羅チェック。
 *
 * 全page.tsxがHowToSchemaを持つ、または理由付きの例外リストに登録されているかを
 * 機械的に検知する（rich-results-breadcrumb.test.tsと同じパターン）。
 *
 * ホームページの既存DatasetSchemaが専用コンポーネントでなく生<script>JSON-LDで
 * 実装されていた（＝コンポーネント名grepだけだと偽陰性になる）ため、判定には
 * countSchemaUsages（JSXコンポーネント + 生JSON-LDの`@type`両対応）を使う。
 *
 * 2026-07-08時点、実際に手順のある計算機/診断ツールなのにHowToSchemaが無い面が
 * 十数件見つかった（CANDIDATE_FOR_HOWTO_CONTENT）。schemaの追加は各ページの実際の
 * 入力フローを確認しながら1件ずつ正確に書く必要があるため、本テストでは全件を
 * 一括で埋めず、ホームページ（最重要・最もシンプルな1手順）のみ先行実装し、
 * 残りは次周以降の継続タスクとして候補リストに残す。
 */
import path from 'path';
import { walkPageFiles, routeFromFile, effectiveContent, countSchemaUsages } from '@/lib/rich-results-audit';

/**
 * HowToSchemaが無くても正当と判断済みの例外。
 * 追加する場合は「なぜ不要か」をコメントで残すこと（審査なしの抜け道にしない）。
 */
const HOWTO_EXEMPT_ROUTES: Record<string, string> = {
  '/about': '運営者情報ページ（手順コンテンツなし）',
  '/about/editor-profile': '運営者プロフィールページ（手順コンテンツなし）',
  '/admin/juku-reviews': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外・R-1第3弾）',
  '/admin/report': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/admin/worklog': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/ask': '決定論Q&Aツール（手順でなく単発の質問応答）',
  '/blog': '記事一覧ページ（一覧のみで手順コンテンツなし）',
  '/blog/tag/[tag]': 'タグ別記事一覧ページ（一覧のみで手順コンテンツなし）',
  '/blog/[slug]': '個別記事（記事ごとに内容が異なり一律の手順定義は不可。BlogPostingSchemaで対応）',
  '/chousasho': '調査書ハブページ（下位ページへの導線のみ）',
  '/chousasho/hyoutei': '評定基準の解説ページ（手順でなく制度解説）',
  '/chousasho/reibun': '記入例集ページ（手順でなく例文一覧）',
  '/comparison': '都道府県比較表ページ（手順でなく一覧比較）',
  '/contact': '問い合わせページ（リッチリザルト価値が低い定型ページ）',
  '/dashboard': '個人の成績推移トラッカー（保存済みデータに依存し一律の手順定義が不適切）',
  '/developers': 'API仕様ページ（利用手順はcurl例で代替済み・HowTo化は過剰）',
  '/disclaimer': '免責事項（リッチリザルト価値が低い定型ページ）',
  '/for-teachers': '先生・進路指導向けの活用案内ページ（手順でなく用途別の紹介）',
  '/futoukou': '不登校支援の解説ページ（手順でなく制度・選択肢の解説）',
  '/futoukou/tsugaku': '通学再開支援の解説ページ（手順でなく制度解説）',
  '/glossary': '用語辞典（定義の一覧で手順ではない）',
  '/glossary/[term]': '用語個別ページ（定義・具体例の解説であり手順ではない）',
  '/guide': '内申点 完全ガイド（網羅的な読み物であり単一の手順列ではない）',
  '/heigan-yuugu': '併願優遇制度の解説ページ（手順でなく制度解説）',
  '/heigan-yuugu/tokyo': '東京都の併願優遇 公式基準まとめ（手順でなく学校ごとのデータ一覧。DatasetSchemaで対応）',
  '/hensachi/kyoka-betsu/[subject]': '教科別の上げ方解説ページ（手順でなく学習アドバイス）',
  '/hensachi/moshi': '模試ハブページ（下位ページへの導線のみ）',
  '/hensachi/moshi/ichiran': '模試一覧・解説ページ（手順でなく模試の紹介）',
  '/hensachi/moshi/nittei': '模試公式日程一覧ページ（手順でなくデータ一覧。DatasetSchemaで対応）',
  '/hensachi/shiboukou': '志望校の決め方解説ページ（手順でなく判断基準の解説）',
  '/hensachi/shindan/[grade]': '学年別偏差値診断ページ（診断手順のHowToSchemaは親ページ/hensachi/shindanが正・重複回避）',
  '/hensachi/shindan/mokuteki/[purpose]': '目的別偏差値診断ページ（診断手順のHowToSchemaは親ページ/hensachi/shindanが正・重複回避）',
  '/hogosha': '保護者向けランディングページ（手順コンテンツなし）',
  '/hyotei-heikin/suisen-kijun': '推薦基準の解説ページ（手順でなく制度解説）',
  '/hyouka-kijun': '評価基準の解説ページ（手順でなく制度解説）',
  '/jitsugika': '実技教科の解説ページ（手順でなく制度解説）',
  '/juken-schedule': '受験スケジュール参照ページ（カレンダーであり手順ではない）',
  '/katei-kyoshi': '家庭教師比較ページ（比較であり手順ではない）',
  '/mendan': '面談準備パック（面談で見せる資料の生成であり厳密な計算手順ではない。CANDIDATE_FOR_HOWTO_CONTENT参照）',
  '/naishin-age-kata': '学年別の上げ方ハブページ（下位ページへの導線のみ）',
  '/naishin-age-kata/[grade]': '学年別の上げ方解説ページ（手順でなく学習アドバイス）',
  '/naishin-kakusa': '都道府県別内申点格差の分析レポート（手順でなくデータ分析・比較記事。ArticleSchema+DatasetSchemaで対応）',
  '/naishin-map': '都道府県別内申点データの地図可視化（手順でなくデータ比較。ArticleSchema+DatasetSchemaで対応）',
  '/report/2026': '内申点白書2026（手順でなくデータ分析・引用資料。ArticleSchema+DatasetSchemaで対応）',
  '/report/2026/[prefecture]': '白書2026の県別ダイジェスト（手順でなく県別データ分析。ArticleSchemaで対応）',
  '/naishin-oru': 'オール3/4/5内申点ハブページ（下位ページへの導線のみ）',
  '/naishin-oru/[grade]': 'オール3/4/5内申点の計算例ページ（計算結果一覧であり手順ではない）',
  '/partner': '塾/パートナー向けLP（手順コンテンツなし）',
  '/pref/[code]': '県別注意点ページ（箇条書きの注意点であり手順ではない）',
  '/prefectures': '都道府県一覧ハブ（一覧のみで手順コンテンツなし）',
  '/privacy': 'プライバシーポリシー（リッチリザルト価値が低い定型ページ）',
  '/press': 'プレスキットページ（手順でなく取材向け資料紹介）',
  '/quality': '品質・E-E-A-T説明ページ（手順コンテンツなし）',
  '/sougou-gata-senbatsu': '総合型選抜の解説ページ（手順でなく制度解説）',
  '/stats': '全国統計データ表示ページ（集計値の一覧表示であり手順ではない。DatasetSchemaで対応）',
  '/suisen-nyuushi': '推薦入試の解説ページ（手順でなく制度解説）',
  '/tarinai-taisaku': '内申・当日点不足の対策ハブ（下位の計算機ページへの導線が本体）',
  '/terms': '利用規約（リッチリザルト価値が低い定型ページ）',
  '/tools': 'ツール一覧ハブ（下位の各計算機ページへの導線のみ）',
  '/total-score': '総合得点計算機ハブ（下位47県ページへの導線が本体）',
  '/[prefecture]': '県別内申点ガイドページ（手順でなく制度解説。CANDIDATE_FOR_HOWTO_CONTENT参照）',
  '/[prefecture]/reverse': 'permanentRedirectのみのリダイレクトページ（実コンテンツ無し）',
  '/[prefecture]/naishin-omomi': '県別内申の重み分析ページ（手順でなく近隣県比較の分析記事。ArticleSchemaで対応）',
  // 以下は実際に入力→計算の手順を持つ計算機/診断ツールだが、各ページの実フローを
  // 確認しながら正確なHowToStepを書く必要があるため今回は見送り、次周以降の継続タスクとする。
  '/hensachi/gyakusan': '偏差値逆算計算機（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/hensachi/gyakusan/hayamihyou': '偏差値早見表（入力不要の静的な参照表であり手順ではない）',
  '/hensachi/mantenkan': '満点変換計算機（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/total-score/mantenkan': '総合得点満点変換計算機（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/koukou-bairitsu': '倍率計算機（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/juken-ryou': '受験料シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/hiyou': '教育費シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/kyouiku-hi': '教育費シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/shinro-hiyou': '進路別費用シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/koukou-hiyou': '高校費用シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/koukou-hiyou/kokoroze': '公私3年間実質負担シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/juku-hiyou': '塾費用シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/shougakukin': '就学支援金シミュレーター（未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/juku-shindan': '塾診断クイズ（5問の手順を持つ・未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
  '/[prefecture]/total-score': '総合得点計算機（47県中13県のみ実計算機・残りは解説のみの条件分岐が必要・未着手・CANDIDATE_FOR_HOWTO_CONTENT）',
};

/** 次にHowToSchemaを書く価値が高い候補（実際に手順のある計算機/診断ツール）。 */
const CANDIDATE_FOR_HOWTO_CONTENT = [
  '/hensachi/gyakusan',
  '/hensachi/mantenkan',
  '/total-score/mantenkan',
  '/koukou-bairitsu',
  '/juken-ryou',
  '/hiyou',
  '/kyouiku-hi',
  '/shinro-hiyou',
  '/koukou-hiyou',
  '/koukou-hiyou/kokoroze',
  '/juku-hiyou',
  '/shougakukin',
  '/juku-shindan',
  '/[prefecture]/total-score',
];

describe('HowToSchema網羅チェック（L-2）', () => {
  const appDir = path.join(__dirname, '..');
  const pageFiles = walkPageFiles(appDir);

  test('page.tsxが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(pageFiles.length).toBeGreaterThan(0);
  });

  test.each(pageFiles.map((file) => [routeFromFile(appDir, file), file] as const))(
    '%s: HowToSchemaを重複なく持つ、または理由付きの例外リストに登録されている',
    (route, file) => {
      const count = countSchemaUsages('HowToSchema', 'HowTo', effectiveContent(file));

      if (count === 0) {
        const exemptReason = HOWTO_EXEMPT_ROUTES[route];
        expect(exemptReason).toBeDefined();
        return;
      }

      expect(count).toBe(1);
    },
  );

  test('例外リストの全エントリが実在するルートを指している（死んだ例外の放置防止）', () => {
    const routes = new Set(pageFiles.map((f) => routeFromFile(appDir, f)));
    for (const route of Object.keys(HOWTO_EXEMPT_ROUTES)) {
      expect(routes.has(route)).toBe(true);
    }
  });

  test('CANDIDATE_FOR_HOWTO_CONTENTの全エントリが例外リストにも存在する（整合性）', () => {
    for (const route of CANDIDATE_FOR_HOWTO_CONTENT) {
      expect(HOWTO_EXEMPT_ROUTES[route]).toBeDefined();
    }
  });
});
