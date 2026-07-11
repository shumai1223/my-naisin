# 塾セルフサーブ掲載管理画面 構想設計（J-4）

**このドキュメントは設計提案であり、スキーマ適用・実装はまだ行っていない**（[[fable5-fullaccel-backlog-2026-07]]のJ-4「構想設計」を担当。R-1/R-2/R-3と同じ「監督付きレビュー後に段階実行」パターンを踏襲する）。

## 背景・課題

現状、塾・家庭教師サービスをサイトに掲載する経路は2つしかない。

1. **ASP経由**（もしも/A8等）— 案件を申請→承認されたら👤が`affiliates.ts`にリンクを手打ち追加。
2. **直接契約**（TIER D-1/D-2・営業メール送信済/送信予定）— 契約後、👤が同様に手打ち追加。

いずれも「新しい塾がサイトに載る」たびに👤がコードを直接編集する必要があり、掲載先を増やす（＝送客先の多様化・B2B収益源の拡大）の律速になっている。J-4は、塾側が自分で掲載申し込み・情報更新をできる「窓口」を設計することで、この律速を緩和する。

## 非目標（スコープ外）

- **公開ログイン付きセルフサーブポータルの実装**（フルの認証・課金・ダッシュボードUI）は本設計の対象外。個人開発1名運営の規模では、認証基盤の保守コスト・不正利用リスク（スパム申し込み・なりすまし）が掲載効率化のメリットを上回る可能性が高い。
- **申し込みの自動承認・自動公開**はしない。R-1（塾口コミ）と同じく「投稿はpending→👤が承認→公開」の1段階モデレーションを必須にする（検証可能な事実のみを掲載する信頼の堀を維持するため）。
- 実際の`affiliates.ts`/`lead-config.ts`への反映は、この設計の対象では自動化しない（後述のPhase 3で検討）。

## 想定フロー（MVP）

```
塾側                          サイト側                         👤
  |                              |                               |
  |--①申込フォーム送信---------->|                               |
  |                              |--②pending保存(D1)-------------|
  |                              |                               |--③/admin/juku-applicationsで確認
  |                              |                               |--④承認/却下を判断
  |                              |<--⑤ステータス更新--------------|
  |<--⑥承認/却下メール通知-------|                               |
  |                              |                               |--⑦(承認時)affiliates.ts等へ手動追加
```

R-1（塾口コミ）のモデレーションパイプライン（`isReviewableJuku`/`validateReviewSubmission`/`canTransitionReviewStatus`/`isPubliclyVisible`のパターン）をほぼそのまま再利用できる設計にする＝新規に学ぶコストを増やさない。

## データモデル案（migration適用は👤監督付き・R-1/R-3と同じ扱い）

```sql
CREATE TABLE juku_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  -- 対応形態（対面/オンライン/どちらも）・対面の場合の地盤地域（prefectures.tsのregion表記に合わせる）
  format TEXT NOT NULL CHECK (format IN ('online', 'in-person', 'both')),
  region TEXT,
  -- 対象学年（中学生のみ/高校生も等）・無料体験の有無（検証可能な事実のみを申告させる）
  target_grades TEXT,
  has_free_trial INTEGER NOT NULL DEFAULT 0,
  -- 塾側が申告する紹介文（掲載前に👤が確認・編集する前提。誇大表現はここで弾く）
  self_description TEXT,
  -- ASP提携済みか直接契約希望かの区分（D-1/D-2の営業フローとの接続点）
  contract_type TEXT NOT NULL CHECK (contract_type IN ('asp-existing', 'direct-contract-requested')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed_at TEXT,
  reviewer_note TEXT
);
```

PII（個人情報）は`contact_email`のみ（法人・事業者の問い合わせ先であり、生徒/保護者の個人情報とは性質が異なる＝`leads`テーブルほど厳格な扱いは不要だが、既存の安全設計（no-op fallback・レート制限）は踏襲する）。

## 実装ステップ案（②承認後の段階実行）

1. **Phase 1（このドキュメント）**: 設計レビュー。
2. **Phase 2（build-not-launch）**: migration作成（👤監督付き適用）+ 純関数（validateJukuApplication等・R-1のvalidateReviewSubmissionと同型）+ POST /api/juku-applications/submit（公開・レート制限）。どのページにもリンクしない状態でデプロイしても実害なし。
3. **Phase 3**: /admin/juku-applications（ADMIN_REPORT_TOKEN認証・R-1の/admin/juku-reviewsと同型のUI）で👤が承認/却下。
4. **Phase 4（👤の公開判断）**: /partner等から申込フォームへの導線を公開。**承認された申込みの`affiliates.ts`/`lead-config.ts`への反映は、当面は👤の手動作業のまま残す**（自動反映はトラッキングリンクの正当性検証・法務確認が伴うため、間違った自動化はリスクが実装コストを上回る）。

## 直接契約フローとの接続

`contract_type = 'direct-contract-requested'`の申込みは、TIER D-1/D-2（直接契約営業）の**受け皿**として機能する。現状D-1/D-2は👤からの一方的な営業メール送信のみだが、J-4が完成すれば「T-3で送った媒体資料・提案メールを見た塾側からの問い合わせ」を受け止める窓口ができ、営業を双方向化できる。

## 関連タスクとの重複整理

- J-2（塾口コミ/評価DB）は実質的にR-1（スキーマ・モデレーション・投稿UI）+R-2（法務ページドラフト）と同一スコープであり、R-1/R-2側で完結済み。
- J-3（高校ページDB）は実質的にR-3（高校ページDBの骨格）と同一スコープであり、R-3側で第1弾完了・継続中。
- J-4（本ドキュメント）は上記2つとは異なる新規スコープ（掲載事業者側の申込み窓口）であり、重複しない。
