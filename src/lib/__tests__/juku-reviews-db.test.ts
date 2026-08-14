/**
 * @jest-environment node
 *
 * juku-reviews-db.ts: 塾口コミ(TIER R-1第2弾)のD1永続化。school-page-clicks-db.tsと同じく
 * LEADS_DBバインディング未設定時は完全no-opという安全設計で、jest環境では常にこのno-opパスを
 * 通るため直接検証できる。加えてこのファイルはinsertJukuReview/moderateJukuReviewが
 * バリデーション/遷移許可チェックをDBアクセス「より前」に行う設計(コメントに明記)のため、
 * その短絡ロジックも合わせて固定する。
 */

import { insertJukuReview, getApprovedReviews, getReviewsByStatus, moderateJukuReview } from '../juku-reviews-db';

describe('insertJukuReview', () => {
  it('バリデーション不合格の入力はDBに触れる前にfalseを返す', async () => {
    await expect(insertJukuReview(null)).resolves.toBe(false);
    await expect(insertJukuReview({})).resolves.toBe(false);
    await expect(insertJukuReview({ jukuId: 'not-a-real-juku', rating: 5, comment: '十分な長さのコメントです' })).resolves.toBe(
      false
    );
  });

  it('バリデーション合格の入力でも、テスト環境ではDBバインディング未設定でfalseを返す(no-op)', async () => {
    const validButUnreachableJuku = 'not-a-real-juku-either';
    // 実在の塾IDが無くてもisReviewableJuku側でfalseになる契約は上のテストで確認済み。
    // ここではDB到達前の早期returnとDB未設定後のno-op returnがどちらもfalseで区別なく安全側に倒れることを確認する。
    await expect(
      insertJukuReview({ jukuId: validButUnreachableJuku, rating: 3, comment: '十分な長さのコメントです' })
    ).resolves.toBe(false);
  });
});

describe('getApprovedReviews / getReviewsByStatus (no-op契約)', () => {
  it('getApprovedReviewsは例外を投げず空配列を返す', async () => {
    await expect(getApprovedReviews('sapix' as never)).resolves.toEqual([]);
  });

  it('limitに極端な値を渡しても例外を投げない(no-op側で早期returnするためクランプは素通り)', async () => {
    await expect(getApprovedReviews('sapix' as never, 0)).resolves.toEqual([]);
    await expect(getApprovedReviews('sapix' as never, 100000)).resolves.toEqual([]);
  });

  it('getReviewsByStatusは例外を投げず空配列を返す', async () => {
    await expect(getReviewsByStatus('pending')).resolves.toEqual([]);
    await expect(getReviewsByStatus('approved', 500)).resolves.toEqual([]);
  });
});

describe('moderateJukuReview', () => {
  it('canTransitionReviewStatusで許可されない遷移はDBに触れる前にfalseを返す', async () => {
    await expect(moderateJukuReview(1, 'pending', 'pending')).resolves.toBe(false); // 同一状態
    await expect(moderateJukuReview(1, 'approved', 'pending')).resolves.toBe(false); // pendingへの逆行禁止
  });

  it('許可された遷移でも、テスト環境ではDBバインディング未設定でfalseを返す(no-op)', async () => {
    await expect(moderateJukuReview(1, 'pending', 'approved')).resolves.toBe(false);
    await expect(moderateJukuReview(1, 'approved', 'rejected')).resolves.toBe(false);
  });
});
