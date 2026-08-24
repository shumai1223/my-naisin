#!/usr/bin/env node
// 自分宛てになってしまった下書きの宛先を、元スレッドの本当の相手に直す。
//
// なぜ必要か（2026-08-14・08-23 の2回発生した再発事故）:
//   `gmail_create_reply_draft` は「そのメッセージの差出人」に返信する。
//   追撃メールを作るとき、loop は **自分が送った送信済みメール** に対してこれを使ってしまい、
//   差出人＝自分 → 宛先＝自分 の下書きが量産される。本文は正しいのに宛先だけが壊れる。
//   受信箱で気づきにくく（送信済みスレッドの中に埋もれる）、👤が目視で見つけるまで残り続けた。
//
// 直し方: 下書きは消さず drafts.update で **To ヘッダだけ** を差し替える。
//   本当の宛先は、同じスレッドの一番古い SENT メッセージの To ヘッダから取る
//   （＝最初に自分がその相手へ送ったときの宛先。これが唯一の正解）。
//
// 使い方:
//   node scripts/gmail-fix-self-drafts.mjs          # 確認のみ（何も書き換えない）
//   node scripts/gmail-fix-self-drafts.mjs --apply  # 実際に直す
//
// 権限: gmail.compose で drafts.update まで可能（送信は含まれない）。
import { gmail as gmailApi } from '@googleapis/gmail';
import { getAuthedClient } from './lib/gmail-client.mjs';

const APPLY = process.argv.includes('--apply');
const gmail = gmailApi({ version: 'v1', auth: getAuthedClient() });

const enc = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`);
const encAddr = (v) => {
  const s = String(v);
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  const m = s.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (!m) return s;
  return m[1].trim() ? `${enc(m[1].trim())} <${m[2]}>` : m[2];
};
const hmap = (p) => Object.fromEntries((p?.headers || []).map((h) => [h.name.toLowerCase(), h.value]));
const b64d = (s) => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
const addrOf = (v) => (String(v || '').match(/<([^>]+)>/)?.[1] || String(v || '')).trim().toLowerCase();

function extractBody(p) {
  if (!p) return '';
  if (p.mimeType === 'text/plain' && p.body?.data) return b64d(p.body.data);
  for (const c of p.parts || []) {
    const t = extractBody(c);
    if (t) return t;
  }
  return p.body?.data ? b64d(p.body.data) : '';
}

const { data: prof } = await gmail.users.getProfile({ userId: 'me' });
const SELF = prof.emailAddress.toLowerCase();

const { data: list } = await gmail.users.drafts.list({ userId: 'me', maxResults: 200 });
const drafts = list.drafts || [];
console.log(`下書き総数: ${drafts.length}（自分=${SELF}）\n`);

let broken = 0;
let fixed = 0;
const unresolved = [];

for (const d of drafts) {
  const { data: full } = await gmail.users.drafts.get({ userId: 'me', id: d.id, format: 'full' });
  const msg = full.message;
  const h = hmap(msg.payload);
  if (addrOf(h.to) !== SELF) continue; // 壊れていない
  broken++;

  // 同じスレッドの一番古い SENT メッセージの To ＝ 本当の相手
  let realTo = null;
  if (msg.threadId) {
    const { data: th } = await gmail.users.threads.get({ userId: 'me', id: msg.threadId, format: 'metadata' });
    const sent = (th.messages || [])
      .filter((m) => (m.labelIds || []).includes('SENT') && m.id !== msg.id)
      .sort((a, b) => Number(a.internalDate) - Number(b.internalDate));
    for (const m of sent) {
      const to = hmap(m.payload).to;
      if (to && addrOf(to) !== SELF) { realTo = to; break; }
    }
  }

  const subject = h.subject || '';
  if (!realTo) {
    unresolved.push({ id: d.id, subject });
    console.log(`  ✗ 復元不能  ${subject.slice(0, 50)}`);
    continue;
  }

  console.log(`  ${APPLY ? '→ 修正' : '（確認）'} ${addrOf(realTo).replace(/^(.{2}).*(@.*)$/, '$1***$2')}  ${subject.slice(0, 44)}`);
  if (!APPLY) continue;

  const lines = [
    `To: ${encAddr(realTo)}`,
    `Subject: ${enc(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
  ];
  if (h['in-reply-to']) lines.push(`In-Reply-To: ${h['in-reply-to']}`);
  if (h['references']) lines.push(`References: ${h['references']}`);
  const body = extractBody(msg.payload);
  const raw = Buffer.from(
    lines.join('\r\n') + '\r\n\r\n' + Buffer.from(body, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n'),
    'utf8'
  ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await gmail.users.drafts.update({
    userId: 'me',
    id: d.id,
    requestBody: { message: { raw, threadId: msg.threadId } },
  });
  fixed++;
}

console.log(`\n自分宛て: ${broken}件 / ${APPLY ? `修正: ${fixed}件` : '（--apply で修正）'} / 復元不能: ${unresolved.length}件`);
if (!APPLY && broken > 0) console.log('\n実行するには: node scripts/gmail-fix-self-drafts.mjs --apply');
process.exit(unresolved.length > 0 ? 1 : 0);
