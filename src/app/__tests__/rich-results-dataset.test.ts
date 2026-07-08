/**
 * @jest-environment node
 *
 * リッチリザルト全面監査（TIER L-2）第四弾（最終）: DatasetSchema網羅チェック。
 *
 * 全page.tsxがDatasetSchemaを持つ、または理由付きの例外リストに登録されているかを
 * 機械的に検知する（rich-results-breadcrumb.test.tsと同じパターン）。
 *
 * DatasetSchemaは「検証済みの構造化データセットを提供している」ページにのみ意味を持つ
 * （home=/api/naishinで配布する47都道府県データセット、/hensachi=偏差値換算対応表）。
 * それ以外の大半のページ（解説・計算UI単体・ハブ・法務）には本来不要。
 * 2026-07-08時点、都道府県別total-scoreページ（aichi/chiba/fukuoka/hokkaido/kanagawa/
 * osaka/saitama/tokyo + 動的[prefecture]/total-score）は[[prefecture-exam-systems-verified]]で
 * 検証済みの計算方式データを保持しておりDatasetSchemaの正当な追加候補だが、
 * 各県で満点・変数名が異なり1件ずつ正確に書く必要があるため今回は見送り、
 * CANDIDATE_FOR_DATASET_CONTENTとして次周以降の継続タスクにする。
 */
import path from 'path';
import { walkPageFiles, routeFromFile, effectiveContent, countSchemaUsages } from '@/lib/rich-results-audit';

/**
 * DatasetSchemaが無くても正当と判断済みの例外。
 * 追加する場合は「なぜ不要か」をコメントで残すこと（審査なしの抜け道にしない）。
 */
const DATASET_EXEMPT_ROUTES: Record<string, string> = {
  '/about': '運営者情報ページ（データセットの提供なし）',
  '/about/editor-profile': '運営者プロフィールページ（データセットの提供なし）',
  '/admin/juku-reviews': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外・R-1第3弾）',
  '/admin/report': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/admin/worklog': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/ask': '決定論Q&Aツール（単発応答でありデータセットの提供ではない）',
  '/blog': '記事一覧ページ（データセットの提供なし）',
  '/blog/tag/[tag]': 'タグ別記事一覧ページ（データセットの提供なし）',
  '/blog/[slug]': '個別記事（データセットの提供なし。BlogPostingSchemaで対応）',
  '/chousasho': '調査書ハブページ（データセットの提供なし）',
  '/chousasho/hyoutei': '評定基準の解説ページ（データセットの提供なし）',
  '/chousasho/kakikata': '調査書の書き方解説ページ（データセットの提供なし）',
  '/chousasho/reibun': '記入例集ページ（データセットの提供なし）',
  '/comparison': '都道府県比較の一覧UI（既存47件データの再表示でありデータセット定義は/hensachi・home側が正）',
  '/contact': '問い合わせページ（リッチリザルト価値が低い定型ページ）',
  '/dashboard': '個人の成績推移トラッカー（利用者個別データでありデータセットではない）',
  '/disclaimer': '免責事項（リッチリザルト価値が低い定型ページ）',
  '/embed': '埋め込みウィジェット選択ページ（データセットの提供なし）',
  '/for-teachers': '先生・進路指導向けの活用案内ページ（データセットの提供なし）',
  '/futoukou': '不登校支援の解説ページ（データセットの提供なし）',
  '/futoukou/shussekiatsukai': '出席扱いの解説ページ（データセットの提供なし）',
  '/futoukou/tsugaku': '通学再開支援の解説ページ（データセットの提供なし）',
  '/glossary': '用語辞典（定義の一覧でありデータセットではない）',
  '/guide': '内申点 完全ガイド（読み物でありデータセットの提供なし）',
  '/heigan-yuugu': '併願優遇制度の解説ページ（データセットの提供なし）',
  '/hensachi/agekata': '偏差値の上げ方解説ページ（データセットの提供なし）',
  '/hensachi/gyakusan': '偏差値逆算計算機（単発計算UIでありデータセットの提供ではない）',
  '/hensachi/kyoka-betsu': '教科別ハブページ（データセットの提供なし）',
  '/hensachi/kyoka-betsu/[subject]': '教科別の上げ方解説ページ（データセットの提供なし）',
  '/hensachi/mantenkan': '満点変換計算機（単発計算UIでありデータセットの提供ではない）',
  '/hensachi/moshi': '模試ハブページ（データセットの提供なし）',
  '/hensachi/moshi/ichiran': '模試一覧・解説ページ（換算表非公表のため数値データセット自体を掲載していない）',
  '/hensachi/shindan': '偏差値診断クイズ（単発診断UIでありデータセットの提供ではない）',
  '/hiyou': '教育費シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/hogosha': '保護者向けランディングページ（データセットの提供なし）',
  '/hyotei-heikin': '評定平均計算UI（単発計算でありデータセット定義はhome/hensachi側が正）',
  '/hyotei-heikin/gyakusan': '評定平均逆算計算機（単発計算UIでありデータセットの提供ではない）',
  '/hyouka-kijun': '評価基準の解説ページ（データセットの提供なし）',
  '/jitsugika': '実技教科の解説ページ（データセットの提供なし）',
  '/juken-ryou': '受験料シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/juken-schedule': '受験スケジュール参照ページ（個別イベント情報でありデータセットではない）',
  '/juku-hiyou': '塾費用シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/juku-shindan': '塾診断クイズ（単発診断UIでありデータセットの提供ではない）',
  '/katei-kyoshi': '家庭教師比較ページ（データセットの提供なし）',
  '/koukou-bairitsu': '倍率計算機（単発計算UIでありデータセットの提供ではない）',
  '/koukou-hiyou': '高校費用シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/koukou-hiyou/kokoroze': '公私3年間実質負担シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/kyouiku-hi': '教育費シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/mendan': '面談準備パック（個別入力の要約でありデータセットではない）',
  '/naishin-age-kata': '学年別の上げ方ハブページ（データセットの提供なし）',
  '/naishin-age-kata/[grade]': '学年別の上げ方解説ページ（データセットの提供なし）',
  '/partner': '塾/パートナー向けLP（データセットの提供なし）',
  '/plan': 'プラン説明ページ（データセットの提供なし）',
  '/pref/[code]': '県別注意点ページ（箇条書きの注意点でありデータセットではない）',
  '/prefectures': '都道府県一覧ハブ（一覧UIでありデータセット定義はhome側が正）',
  '/privacy': 'プライバシーポリシー（リッチリザルト価値が低い定型ページ）',
  '/quality': '品質・E-E-A-T説明ページ（データセットの提供なし）',
  '/reverse': '志望校逆算計算機（単発計算UIでありデータセットの提供ではない）',
  '/shinro-hiyou': '進路別費用シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/shougakukin': '就学支援金シミュレーター（単発計算UIでありデータセットの提供ではない）',
  '/shutsugan-junbi': '出願準備チェックリストページ（データセットの提供なし）',
  '/shutsugan-junbi/shibou-riyuusho': '志望理由書の書き方ガイド（データセットの提供なし）',
  '/sougou-gata-senbatsu': '総合型選抜の解説ページ（データセットの提供なし）',
  '/suisen-nyuushi': '推薦入試の解説ページ（データセットの提供なし）',
  '/tarinai-taisaku': '内申・当日点不足の対策ハブ（データセットの提供なし）',
  '/terms': '利用規約（リッチリザルト価値が低い定型ページ）',
  '/tools': 'ツール一覧ハブ（データセットの提供なし）',
  '/total-score/mantenkan': '総合得点満点変換計算機（単発計算UIでありデータセットの提供ではない）',
  '/total-score': '総合得点計算機ハブ（データセットの提供なし・各県ページが本体）',
  '/[prefecture]/naishin': '県別内申点計算UI（単発計算でありデータセット定義はhome側が正）',
  '/[prefecture]': '県別内申点ガイドページ（データセットの提供なし）',
  '/[prefecture]/reverse': 'permanentRedirectのみのリダイレクトページ（実コンテンツ無し）',
  // 以下は都道府県教育委員会一次情報で検証済みの計算方式データ（満点・学年比率・実技倍率等）を
  // 保持しており正当なDatasetSchema追加候補だが、県ごとに変数名・満点が異なるため
  // 1件ずつ正確に書く必要があり今回は見送り、次周以降の継続タスクとする。
  '/aichi/total-score': '愛知県総合得点データ（評価方法Ⅰ〜Ⅴ・満点200-310）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/chiba/total-score': '千葉県総合得点データ（K値0.5-2）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/fukuoka/total-score': '福岡県総合得点データ（A群B群・学力300点）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/hokkaido/rank': '北海道ランクデータ（315点満点・ランクA〜M）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/kanagawa/s-value': '神奈川県S値データ（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/osaka/total-score': '大阪府総合得点データ（タイプ別）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/saitama/total-score': '埼玉県総合得点データ（学年比率）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/tokyo/total-score': '東京都総合得点データ（1020点満点）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
  '/[prefecture]/total-score': '総合得点データ（47県中13県が実計算機・条件分岐が必要）（未着手・CANDIDATE_FOR_DATASET_CONTENT）',
};

/** 次にDatasetSchemaを書く価値が高い候補（教委一次情報で検証済みの計算方式データを持つ面）。 */
const CANDIDATE_FOR_DATASET_CONTENT = [
  '/aichi/total-score',
  '/chiba/total-score',
  '/fukuoka/total-score',
  '/hokkaido/rank',
  '/kanagawa/s-value',
  '/osaka/total-score',
  '/saitama/total-score',
  '/tokyo/total-score',
  '/[prefecture]/total-score',
];

describe('DatasetSchema網羅チェック（L-2）', () => {
  const appDir = path.join(__dirname, '..');
  const pageFiles = walkPageFiles(appDir);

  test('page.tsxが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(pageFiles.length).toBeGreaterThan(0);
  });

  test.each(pageFiles.map((file) => [routeFromFile(appDir, file), file] as const))(
    '%s: DatasetSchemaを重複なく持つ、または理由付きの例外リストに登録されている',
    (route, file) => {
      const count = countSchemaUsages('DatasetSchema', 'Dataset', effectiveContent(file));

      if (count === 0) {
        const exemptReason = DATASET_EXEMPT_ROUTES[route];
        expect(exemptReason).toBeDefined();
        return;
      }

      expect(count).toBe(1);
    },
  );

  test('例外リストの全エントリが実在するルートを指している（死んだ例外の放置防止）', () => {
    const routes = new Set(pageFiles.map((f) => routeFromFile(appDir, f)));
    for (const route of Object.keys(DATASET_EXEMPT_ROUTES)) {
      expect(routes.has(route)).toBe(true);
    }
  });

  test('CANDIDATE_FOR_DATASET_CONTENTの全エントリが例外リストにも存在する（整合性）', () => {
    for (const route of CANDIDATE_FOR_DATASET_CONTENT) {
      expect(DATASET_EXEMPT_ROUTES[route]).toBeDefined();
    }
  });
});
