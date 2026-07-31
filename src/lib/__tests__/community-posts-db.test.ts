/**
 * @jest-environment node
 *
 * 保護者コミュニティ投稿(community_posts)のD1永続化層のスキーマ契約テスト。
 * D1未バインド環境(jest)での全関数のno-op安全性(例外を投げない・入力バリデーションが先に効く)を固定する。
 */
import {
  insertCommunityPost,
  getApprovedCommunityPosts,
  getCommunityPostsByStatus,
  moderateCommunityPost,
} from '../community-posts-db';

describe('insertCommunityPost（D1未バインド環境=jest）', () => {
  it('バリデーション不合格の入力はD1に触れず即null', async () => {
    expect(await insertCommunityPost({ category: 'chat', body: '1234567890' })).toBeNull();
    expect(await insertCommunityPost({ category: 'question', body: '短い' })).toBeNull();
  });

  it('妥当な入力でもD1未バインドならnull(例外を投げない)', async () => {
    expect(
      await insertCommunityPost({
        category: 'question',
        body: '内申点の計算方法について教えてください。実技教科の扱いがよくわかりません。',
      })
    ).toBeNull();
  });
});

describe('getApprovedCommunityPosts（D1未バインド環境=jest）', () => {
  it('D1未バインドなら空配列', async () => {
    await expect(getApprovedCommunityPosts()).resolves.toEqual([]);
  });
});

describe('getCommunityPostsByStatus（D1未バインド環境=jest）', () => {
  it('D1未バインドなら空配列', async () => {
    await expect(getCommunityPostsByStatus('pending')).resolves.toEqual([]);
    await expect(getCommunityPostsByStatus('flagged')).resolves.toEqual([]);
  });
});

describe('moderateCommunityPost（D1未バインド環境=jest）', () => {
  it('許可されない遷移はD1に触れず即false', async () => {
    expect(await moderateCommunityPost(1, 'approved', 'pending')).toBe(false);
  });

  it('許可される遷移でもD1未バインドならfalse(例外を投げない)', async () => {
    expect(await moderateCommunityPost(1, 'pending', 'approved')).toBe(false);
  });
});
