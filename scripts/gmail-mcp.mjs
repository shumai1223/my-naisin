#!/usr/bin/env node
// Gmail を Model Context Protocol (stdio) で公開するサーバー。
// scripts/gsc-mcp.mjs / ga4-mcp.mjs と同一パターン（自分のOAuth・node直接起動）。
//
// 権限境界（gmail-client.mjs のスコープ方針と対）:
//   読む（search/read/thread）＋ 下書きを作る（create_draft/create_reply_draft）まで。
//   送信ツールは存在しない。送信ボタンは常に人間が Gmail アプリから押す。
//
// 鉄則: stdio MCP は stdout に MCP プロトコル以外を書いてはいけない（ログは必ず stderr=console.error）。
// 依存メモ: フル `googleapis` はこの環境で import 約20秒 → スコープ版 `@googleapis/gmail` を使う。
import { gmail } from '@googleapis/gmail';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getAuthedClient } from './lib/gmail-client.mjs';

function client() {
  return gmail({ version: 'v1', auth: getAuthedClient() });
}

function ok(obj) {
  return { content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] };
}

// ---------- MIME ヘルパ ----------

function b64urlDecode(s) {
  return Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function b64urlEncode(s) {
  return Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// 日本語ヘッダは RFC 2047 の encoded-word にする（ASCII のみならそのまま）。
function encodeHeaderWord(s) {
  return /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`;
}

// アドレスヘッダ（To/Cc）用: 表示名部分だけ RFC 2047 エンコードする。
// 2026-07-14実測: 返信下書きで元メールの日本語表示名（"お問い合わせ受付担当" <...>）を
// 生のまま To に書いたら Gmail 上で文字化けした。アドレス部は素通し・表示名のみ変換。
function encodeAddressHeader(value) {
  const s = String(value);
  if (/^[\x20-\x7e]*$/.test(s)) return s; // ASCIIのみならそのまま
  const m = s.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (!m) return s;
  const name = m[1].trim();
  if (!name) return m[2];
  return `${encodeHeaderWord(name)} <${m[2]}>`;
}

function buildMime({ to, cc, subject, body, inReplyTo, references }) {
  const lines = [`To: ${encodeAddressHeader(to)}`];
  if (cc) lines.push(`Cc: ${encodeAddressHeader(cc)}`);
  lines.push(
    `Subject: ${encodeHeaderWord(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64'
  );
  if (inReplyTo) lines.push(`In-Reply-To: ${inReplyTo}`);
  if (references) lines.push(`References: ${references}`);
  const bodyB64 = Buffer.from(body, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n');
  return lines.join('\r\n') + '\r\n\r\n' + bodyB64;
}

function headerMap(payload) {
  const map = {};
  for (const h of payload?.headers || []) map[h.name.toLowerCase()] = h.value;
  return map;
}

// payload を再帰的に歩いて text/plain を優先取得（無ければ text/html を生のまま返す）。
function extractBody(payload) {
  if (!payload) return { mimeType: null, text: '' };
  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return { mimeType: 'text/plain', text: b64urlDecode(payload.body.data) };
  }
  if (Array.isArray(payload.parts)) {
    for (const p of payload.parts) {
      const r = extractBody(p);
      if (r.mimeType === 'text/plain' && r.text) return r;
    }
    for (const p of payload.parts) {
      const r = extractBody(p);
      if (r.text) return r;
    }
  }
  if (payload.mimeType === 'text/html' && payload.body?.data) {
    return { mimeType: 'text/html', text: b64urlDecode(payload.body.data) };
  }
  return { mimeType: payload.mimeType || null, text: '' };
}

function summarizeMessage(m, { withBody = false } = {}) {
  const h = headerMap(m.payload);
  const base = {
    id: m.id,
    threadId: m.threadId,
    date: h['date'],
    from: h['from'],
    to: h['to'],
    subject: h['subject'],
    snippet: m.snippet,
    labelIds: m.labelIds,
  };
  if (withBody) {
    const { mimeType, text } = extractBody(m.payload);
    base.bodyMimeType = mimeType;
    base.body = text;
  }
  return base;
}

// ---------- ツール定義 ----------

const TOOLS = [
  {
    name: 'gmail_profile',
    description: '接続確認。認証済みアカウントのメールアドレスと総メッセージ数を返す。',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'gmail_search',
    description:
      'Gmail検索構文でメッセージを検索し、メタデータ（差出人/件名/日時/snippet）の一覧を返す。例: "in:inbox newer_than:3d", "from:example.co.jp", "subject:(内申) is:unread"。B2B返信の検知は "in:inbox newer_than:2d -category:promotions" が起点。',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Gmail検索クエリ（Gmailの検索窓と同じ構文）。' },
        maxResults: { type: 'number', description: '最大件数（既定20・上限100）。' },
      },
      required: ['q'],
    },
  },
  {
    name: 'gmail_read',
    description: 'メッセージIDを指定して本文（text/plain優先）とヘッダを取得する。',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'gmail_search が返した message id。' } },
      required: ['id'],
    },
  },
  {
    name: 'gmail_thread',
    description: 'スレッドID内の全メッセージを本文付きで時系列に取得する。返信ドラフトを書く前の文脈把握に使う。',
    inputSchema: {
      type: 'object',
      properties: { threadId: { type: 'string', description: 'gmail_search が返した threadId。' } },
      required: ['threadId'],
    },
  },
  {
    name: 'gmail_create_draft',
    description:
      '新規メールの下書きを作成する（送信はしない・送信ボタンは人間がGmailから押す）。日本語の件名/本文に対応。',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: '宛先メールアドレス。' },
        cc: { type: 'string', description: 'Cc（任意）。' },
        subject: { type: 'string', description: '件名。' },
        body: { type: 'string', description: '本文（プレーンテキスト）。' },
      },
      required: ['to', 'subject', 'body'],
    },
  },
  {
    name: 'gmail_create_reply_draft',
    description:
      '既存メッセージへの返信下書きを同一スレッドに作成する（送信はしない）。In-Reply-To/References/件名Re:は元メッセージから自動設定。宛先は元メッセージのReply-To（無ければFrom）。',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: '返信対象の message id。' },
        body: { type: 'string', description: '返信本文（プレーンテキスト）。引用は付けない。' },
      },
      required: ['messageId', 'body'],
    },
  },
];

async function runTool(name, args = {}) {
  const c = client();
  switch (name) {
    case 'gmail_profile': {
      const res = await c.users.getProfile({ userId: 'me' });
      return ok({ emailAddress: res.data.emailAddress, messagesTotal: res.data.messagesTotal });
    }
    case 'gmail_search': {
      const maxResults = Math.min(100, Number(args.maxResults ?? 20));
      const list = await c.users.messages.list({ userId: 'me', q: String(args.q), maxResults });
      const ids = (list.data.messages || []).map((m) => m.id);
      const messages = [];
      for (const id of ids) {
        const res = await c.users.messages.get({ userId: 'me', id, format: 'metadata', metadataHeaders: ['Date', 'From', 'To', 'Subject'] });
        messages.push(summarizeMessage(res.data));
      }
      return ok({ q: args.q, count: messages.length, messages });
    }
    case 'gmail_read': {
      const res = await c.users.messages.get({ userId: 'me', id: String(args.id), format: 'full' });
      return ok(summarizeMessage(res.data, { withBody: true }));
    }
    case 'gmail_thread': {
      const res = await c.users.threads.get({ userId: 'me', id: String(args.threadId), format: 'full' });
      const messages = (res.data.messages || []).map((m) => summarizeMessage(m, { withBody: true }));
      return ok({ threadId: args.threadId, count: messages.length, messages });
    }
    case 'gmail_create_draft': {
      const raw = b64urlEncode(buildMime({ to: String(args.to), cc: args.cc ? String(args.cc) : undefined, subject: String(args.subject), body: String(args.body) }));
      const res = await c.users.drafts.create({ userId: 'me', requestBody: { message: { raw } } });
      return ok({ draftId: res.data.id, messageId: res.data.message?.id, note: '下書きを作成しました。送信はGmailアプリから人間が行ってください。' });
    }
    case 'gmail_create_reply_draft': {
      const orig = await c.users.messages.get({ userId: 'me', id: String(args.messageId), format: 'metadata', metadataHeaders: ['Message-ID', 'References', 'Subject', 'From', 'Reply-To'] });
      const h = headerMap(orig.data.payload);
      const subject = /^re:/i.test(h['subject'] || '') ? h['subject'] : `Re: ${h['subject'] || ''}`;
      const references = [h['references'], h['message-id']].filter(Boolean).join(' ');
      const raw = b64urlEncode(
        buildMime({
          to: h['reply-to'] || h['from'],
          subject,
          body: String(args.body),
          inReplyTo: h['message-id'],
          references: references || undefined,
        })
      );
      const res = await c.users.drafts.create({
        userId: 'me',
        requestBody: { message: { raw, threadId: orig.data.threadId } },
      });
      return ok({
        draftId: res.data.id,
        messageId: res.data.message?.id,
        threadId: orig.data.threadId,
        to: h['reply-to'] || h['from'],
        subject,
        note: '返信下書きをスレッドに作成しました。送信はGmailアプリから人間が行ってください。',
      });
    }
    default:
      throw new Error(`不明なツール: ${name}`);
  }
}

const server = new Server({ name: 'gmail-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try {
    return await runTool(req.params.name, req.params.arguments || {});
  } catch (e) {
    console.error('[gmail-mcp] tool error:', req.params.name, e?.message || e);
    return { content: [{ type: 'text', text: `エラー: ${e?.message || String(e)}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[gmail-mcp] started (stdio)');
