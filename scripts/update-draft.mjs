import fs from 'node:fs';
import { gmail as gmailApi } from '@googleapis/gmail';
import { getAuthedClient } from './lib/gmail-client.mjs';

const DRAFT_ID = process.argv[2];
const BODY_PATH = process.argv[3];

const g = gmailApi({ version: 'v1', auth: getAuthedClient() });

const enc = (s) =>
  /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`;

const encAddr = (v) => {
  const m = String(v).match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (!m) return v;
  return m[1].trim() ? `${enc(m[1].trim())} <${m[2]}>` : m[2];
};

const { data: old } = await g.users.drafts.get({ userId: 'me', id: DRAFT_ID, format: 'full' });
const h = Object.fromEntries((old.message.payload.headers || []).map((x) => [x.name.toLowerCase(), x.value]));

// BOM を落とす（PowerShell の Out-File -Encoding utf8 は BOM を付ける）
const body = fs.readFileSync(BODY_PATH, 'utf8').replace(/^﻿/, '');

const lines = [
  `To: ${encAddr(h.to)}`,
  `Subject: ${enc(h.subject)}`,
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: base64',
];
if (h['in-reply-to']) lines.push(`In-Reply-To: ${h['in-reply-to']}`);
if (h['references']) lines.push(`References: ${h['references']}`);

const raw = Buffer.from(
  lines.join('\r\n') +
    '\r\n\r\n' +
    Buffer.from(body, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n'),
  'utf8'
)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

await g.users.drafts.update({
  userId: 'me',
  id: DRAFT_ID,
  requestBody: { message: { raw, threadId: old.message.threadId } },
});

console.log('下書きを更新しました');
console.log('  to      :', h.to);
console.log('  subject :', h.subject);
console.log('  本文    :', body.length, '文字');
