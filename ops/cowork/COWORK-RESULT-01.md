# Cowork 第1弾（30社）の実測結果 — 2026-08-14

**loop はこの結果を `data/outreach-queue.json` と `data/outreach-ledger.json` に反映すること。**
これは👤が実際にCoworkを走らせて得た一次データであり、推測ではない。

## 集計

| 結果 | 社数 |
|---|---|
| **送信済み** | **10** |
| 停止（必須項目が埋められず） | 9 |
| スキップ（目的不一致） | 11 |
| 合計 | 30 |

## 送信済み10社（→ ledger に `sent` として記録・返信監視の対象）

`moshi-wao-corporation`（ワオ・コーポレーション）／`moshi-shizuoka-moshi`（静岡模試出版会）／
`gakusan-bunri`（文理）／`gakusan-sanseido-books`（三省堂書店）／`edtech-chieru`（チエル）／
`edtech-lines`（ラインズ）／`gakusan-asutoro`（あすとろ出版）／`edtech-metamoji`（MetaMoJi）／
`edtech-sky`（Sky）／`gakusan-gakko-tosho`（学校図書）

⚠️ **これがフォーム経由の最初の実測母数（n=10）。** 返信率をここで測る。
Gmail経由の教委26社とは別セグメントとして分けて数えること。

## 停止9社（→ `candidate` のまま維持。第2弾で再挑戦済み）

主因は **住所が必須**（7社）:
`moshi-osaka-shinken` / `gakusan-obunsha` / `moshi-tierra-com` / `moshi-hokkoku-ishikawa` /
`moshi-chuoh-kyouiku` / `gakusan-mitsumura-tosho` / `edtech-gaia-education`

対応表に無い必須項目（2社）:
- `gakusan-kadokawa` … 「当社の商品・サービス名」が必須
- `gakusan-tokyo-shoseki` … 「都道府県・ソフト名/商品名」が必須

→ **第1弾プロンプトの欠陥だった。** 「住所は勝手に埋めるな」と書いたのは捏造防止のためだが、
   👤は住所を持っており（特商法表記でどのみち必要）、氏名・電話と同じ置換欄にすべきだった。
   第2弾（`COWORK-PROMPT-30-02.md`）で置換欄を追加し、先頭9社に再配置済み。

## スキップ11社（→ `status:'excluded'` + `excludeReason` を記録して閉じる）

| id | 会社 | 理由 |
|---|---|---|
| `moshi-kyoiku-kaihatsu-shuppan` | 教育開発出版 | 取引申請フォームのみ・事業提携窓口なし |
| `gakusan-gakken` | Gakken | 取材・映像化許諾のみ |
| `gakusan-suken-shuppan` | 数研出版 | 事業提携窓口なし |
| `gakusan-kumon-shuppan` | くもん出版 | 商品導入相談専用 |
| `gakusan-zkai-solutions` | Z会ソリューションズ | 全窓口が営業目的お断り／大学関係者限定 |
| `moshi-soshin-tosho` | 総進図書 | 塾専用フォームのみ |
| `gakusan-shoryudo` | 昇龍堂出版 | 教員・塾講師専用の見本請求窓口 |
| `edtech-learningbox` | learningBOX | 営業目的の問い合わせを明確に拒否 |
| `moshi-gifu-shinbun-jc` | 岐阜新聞情報センター | 塾専用・住所必須 |
| `moshi-hiroshima-juku-coop` | 広島県学習塾協同組合 | 保護者・生徒専用フォーム |
| `gakusan-kyoiku-shuppan` | 教育出版 | 「教科書・指導に関すること以外は受け付けない」と明記 |

---

## 🔴 この結果から出る構造的な発見（母数の下方修正）

### 教科書・学参出版社は、フォーム経由では構造的に届かない

スキップ11社のうち **6社が教育出版・学参レーン**（Gakken・数研出版・くもん出版・
Z会ソリューションズ・昇龍堂・教育出版）。理由が揃っている:

- **教科書会社の問い合わせ窓口は「教科書見本請求」「採択関係」に限定されている**
- 事業提携・データ利用の窓口が**そもそも存在しない**
- 一部は「営業目的お断り」を明記

→ **T-C1 が数えた「教育出版・学参50社」は、存在はするが到達可能な50社ではない。**
   フォームという経路が構造的に塞がっている。**母数を下方修正すること。**

→ ⚠️ ただし**「閉じた」と断定するのは早い**（`feedback` の教訓: 同じ主体・同じ型に複数回試して
   全滅した場合だけ閉じたと言える）。**閉じたのは「フォーム経由」という型だけ。**
   別の型（代表電話・書籍奥付の編集部宛・展示会・業界団体経由）はまだ1回も試していない。

→ **次に検証すべき仮説**: 出版社に届くのは「問い合わせフォーム」ではなく
   **「編集部・企画部への直接の郵送またはメール」**ではないか。
   検証コストが低いのは**業界団体（日本図書教材協会等）経由での紹介依頼**。

### スキップ率37%（11/30）は、事前に潰せる

第1弾のスキップ11社は、**フォームを開く前に判定できたものが多い**（採用専用・見本請求専用など、
URLやページタイトルで分かる）。**loop が candidate に積む段階で、フォームの種類を記録しておけば
Cowork の試行回数を37%節約できる。**

→ **やること**: `outreach-queue.json` の form エントリに `formPurpose` フィールドを追加し、
   本文を書く前に「この窓口は事業提携を受け付けるか」を判定して記録する。
   判定できないものは `formPurpose: 'unknown'` として Cowork に回す。
