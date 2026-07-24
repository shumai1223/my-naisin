/**
 * @jest-environment node
 *
 * ZZ-10c: 全数値→1クリックで一次ソース到達監査。
 *
 * 発見の経緯: /total-score ハブ(hub.ts)の47県のうち、静的手書き8県
 * (tokyo/kanagawa/osaka/aichi/chiba/saitama/fukuoka/hokkaido)のページは
 * 出典リンクのhrefをprefectures.tsのsourceUrlとは独立にハードコード文字列で
 * 保持していた。X-14の週次再検証でprefectures.ts側のsourceUrlが更新されても
 * ページ側のハードコード文字列は追従せず、実際にaichi(末尾パス欠落)・
 * kanagawa(別パスdc4/nyusenを指す)・saitama(前年度r7のURLのまま)の
 * 3件で実害のあるドリフトを検出した。
 *
 * 対策: 8ページ全てをgetPrefectureByCode(code)?.sourceUrlからの動的取得に
 * 修正した。本テストはその設計が維持されていること(=hrefが再びハードコード
 * 文字列に戻っていないこと)を機械的に保証する回帰ゲート。
 *
 * registry 5県(TOTAL_SCORE_SYSTEMS)・explainer 34県は元から
 * [prefecture]/total-score/page.tsx 経由でsystem.source.url/e.source.urlを
 * 動的参照する設計のため対象外(ページ自体がprefectures.tsと独立したソースを持つ)。
 */
import fs from 'fs';
import path from 'path';

import { PREFECTURES } from '@/lib/prefectures';

const APP_ROOT = path.join(__dirname, '..');

/** 静的手書き8県: hub.tsのSTATIC_CALCULATORSと同じ内容(コード×ページ相対パス)。 */
const STATIC_CALCULATOR_PAGES: { code: string; relPath: string }[] = [
  { code: 'tokyo', relPath: 'tokyo/total-score/page.tsx' },
  { code: 'kanagawa', relPath: 'kanagawa/s-value/page.tsx' },
  { code: 'osaka', relPath: 'osaka/total-score/page.tsx' },
  { code: 'aichi', relPath: 'aichi/total-score/page.tsx' },
  { code: 'chiba', relPath: 'chiba/total-score/page.tsx' },
  { code: 'saitama', relPath: 'saitama/total-score/page.tsx' },
  { code: 'fukuoka', relPath: 'fukuoka/total-score/page.tsx' },
  { code: 'hokkaido', relPath: 'hokkaido/rank/page.tsx' },
];

describe('ZZ-10c: 静的手書き8県ページの出典リンクが動的参照であること(ドリフト再発防止)', () => {
  test.each(STATIC_CALCULATOR_PAGES.map((p) => [p.code, p] as const))(
    '%s: getPrefectureByCode経由でsourceUrlを参照している(ハードコードhrefに戻っていない)',
    (_code, { code, relPath }) => {
      const filePath = path.join(APP_ROOT, relPath);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain(`getPrefectureByCode('${code}')`);
      expect(content).toContain('?.sourceUrl');
    }
  );

  test('対象8県すべてprefectures.tsにsourceUrlが設定されている(フォールバックへの実質依存を検知)', () => {
    for (const { code } of STATIC_CALCULATOR_PAGES) {
      const pref = PREFECTURES.find((p) => p.code === code);
      expect(pref?.sourceUrl).toBeTruthy();
    }
  });
});
