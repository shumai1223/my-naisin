// T-JUKU1 Step6: 生成済みのフォーム用本文(drafts/generated/<id>.txt)から Cowork 指示書を作る。
// 使い方: node scripts/juku1-build-cowork.mjs <batch番号> <id,id,...>   (idは juku1-build-drafts.mjs --kind form で生成した行)
import fs from 'node:fs';
const D = 'ops/deliverables/juku1';
const batch = process.argv[2];
const ids = process.argv[3].split(',');
function parseCsv(t) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  return rows;
}
const rows = parseCsv(fs.readFileSync(`${D}/TARGETS.csv`, 'utf8').replace(/^\uFEFF/, ''));
const head = rows[0];
const byId = Object.fromEntries(rows.slice(1).filter((r) => r.length >= head.length).map((r) => [r[0], Object.fromEntries(head.map((h, i) => [h, r[i]]))]));
let out = `# Cowork指示書 T-JUKU1 第${batch}便: 塾の問い合わせフォーム${ids.length}件に、営業文面を入力してほしい(送信は👤)

## ⛔ してはいけないこと
- **最終の送信ボタンは絶対に押さないでください。** 確認画面が出るところまで進めて止まってください。送信は👤が内容を確認してから行います
- 会員登録・ログイン・LINE友だち追加が必要なページには入らない。電話番号・住所など下の共通入力値に無い項目が**必須**になっていたら、推測で埋めず**その塾は「未入力で止めた」と報告**して次へ
- フォームが「体験授業・資料請求・入塾のお申し込み専用」で、生徒の学年・志望校・お子様の名前などを入れる形式なら、**入力せず「用途違い」と報告**して次へ
- ページに「営業・広告・勧誘のお問い合わせはお断り」の記載を見つけたら、**入力せず「お断り記載あり」と報告**して次へ
- 証明書の警告が出るページは開かない(「証明書エラー」と報告して次へ)
- 本文は**下のものを一字も変えずに**貼る(勝手な言い換え・追記をしない)

## 共通の入力値
| 項目 | 値 |
|---|---|
| お名前 | My Naishin 運営 |
| ふりがな | まいないしん うんえい |
| 会社名・団体名・サイト名 | My Naishin(内申点・倍率計算サイト) |
| メールアドレス | naishin.dev@gmail.com |
| URL欄 | https://my-naishin.com |
| 件名・題名欄 | 各件の「件名」 |
| 問い合わせ種別(選択式) | 「広告・提携・その他」「法人・事業者」に近いもの。無ければ「その他」 |
| 電話番号・住所 | 未定義(必須なら止めて報告) |

## 各件
`;
ids.forEach((id, i) => {
  const t = byId[id];
  const body = fs.readFileSync(`${D}/drafts/generated/${id}.txt`, 'utf8');
  const subject = body.match(/^件名: (.*)$/m)[1];
  const text = body.replace(/^件名: .*\r?\n\r?\n/, '');
  out += `\n### ${i + 1}. ${t['塾名']}(${id})\n- 入口URL: ${t['宛先']}\n- 件名: ${subject}\n- 本文:\n\n\`\`\`\n${text.trim()}\n\`\`\`\n`;
});
out += `\n## 報告してほしいこと\n各件について「確認画面まで進めた／未入力で止めた(理由)／用途違い／お断り記載あり／証明書エラー」のどれかを、1行ずつ書いてください。\n`;
fs.writeFileSync(`ops/cowork/COWORK-TASK-juku1-forms-batch${batch}.md`, out, 'utf8');
console.log(`wrote ops/cowork/COWORK-TASK-juku1-forms-batch${batch}.md (${ids.length}件)`);
