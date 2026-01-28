import { DEFAULT_SCORES } from '@/lib/constants';
import type { SavedHistoryEntry, ScoreMode, Scores, SubjectKey } from '@/lib/types';

const HISTORY_KEY = 'my-naishin:history';
const SAVE_CONSENT_COOKIE = 'my-naishin-save-consent';
const HISTORY_LIMIT = 30;
const MEMO_MAX_LENGTH = 60;
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCookie(name: string): string | null {
  try {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapeRegExp(name)}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  try {
    if (typeof document === 'undefined') return;

    const parts = [
      `${name}=${encodeURIComponent(value)}`,
      'path=/',
      'samesite=lax',
      `max-age=${Math.floor(maxAgeSeconds)}`
    ];

    if (typeof location !== 'undefined' && location.protocol === 'https:') {
      parts.push('secure');
    }

    document.cookie = parts.join('; ');
  } catch {
    // ignore
  }
}

export function getSaveConsent() {
  const raw = readCookie(SAVE_CONSENT_COOKIE);
  return raw === '1' || raw === 'true';
}

export function setSaveConsent(allowed: boolean) {
  writeCookie(SAVE_CONSENT_COOKIE, allowed ? '1' : '0', 60 * 60 * 24 * 365);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function sanitizeScore(value: unknown): number | null {
  const n = toFiniteNumber(value);
  if (n == null) return null;
  const rounded = Math.round(n);
  return Math.min(5, Math.max(1, rounded));
}

function sanitizeScores(value: unknown): Scores | null {
  if (!value || typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;
  const base: Scores = { ...DEFAULT_SCORES };

  (Object.keys(base) as SubjectKey[]).forEach((key) => {
    const safe = sanitizeScore(obj[key]);
    if (safe == null) return;
    base[key] = safe;
  });

  return base;
}

function isScoreMode(value: unknown): value is ScoreMode {
  return value === 'normal' || value === 'tokyo';
}

function sanitizeMemo(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > MEMO_MAX_LENGTH ? trimmed.slice(0, MEMO_MAX_LENGTH) : trimmed;
}

function generateId() {
  const w = typeof window !== 'undefined' ? window : undefined;
  if (w?.crypto && typeof w.crypto.randomUUID === 'function') {
    return w.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildSignature(mode: ScoreMode, scores: Scores) {
  return `${mode}|${(Object.keys(scores) as SubjectKey[])
    .sort()
    .map((k) => `${k}:${scores[k]}`)
    .join(',')}`;
}

function sanitizeHistoryEntry(value: unknown): SavedHistoryEntry | null {
  if (!value || typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;

  const id = obj.id;
  if (typeof id !== 'string' || !id.trim()) return null;

  const mode = obj.mode;
  if (!isScoreMode(mode)) return null;

  const savedAt = obj.savedAt;
  if (typeof savedAt !== 'string' || !savedAt.trim()) return null;
  const savedAtMs = Date.parse(savedAt);
  if (!Number.isFinite(savedAtMs)) return null;

  const scores = sanitizeScores(obj.scores);
  if (!scores) return null;

  const memo = sanitizeMemo(obj.memo);

  const entry: SavedHistoryEntry = {
    id,
    savedAt: new Date(savedAtMs).toISOString(),
    mode,
    scores
  };

  if (memo) entry.memo = memo;
  return entry;
}

function sortBySavedAtDesc(a: SavedHistoryEntry, b: SavedHistoryEntry) {
  return Date.parse(b.savedAt) - Date.parse(a.savedAt);
}

export function readHistory(): SavedHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((v) => sanitizeHistoryEntry(v))
      .filter((v): v is SavedHistoryEntry => Boolean(v))
      .sort(sortBySavedAtDesc)
      .slice(0, HISTORY_LIMIT);
  } catch {
    try {
      window.localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
    return [];
  }
}

export function writeHistory(entries: SavedHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = entries
      .map((v) => sanitizeHistoryEntry(v))
      .filter((v): v is SavedHistoryEntry => Boolean(v))
      .sort(sortBySavedAtDesc)
      .slice(0, HISTORY_LIMIT);

    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(sanitized));
  } catch {
    // ignore
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}

export function appendHistoryEntry(params: { mode: ScoreMode; scores: Scores; memo?: string; now?: Date }) {
  if (typeof window === 'undefined') return null;
  try {
    const now = params.now ?? new Date();
    const memo = sanitizeMemo(params.memo);
    const scores = sanitizeScores(params.scores) ?? { ...DEFAULT_SCORES };
    const history = readHistory();

    const signature = buildSignature(params.mode, scores);
    const latest = history[0];
    if (latest) {
      const latestSig = buildSignature(latest.mode, latest.scores);
      const deltaMs = now.getTime() - Date.parse(latest.savedAt);

      if (latestSig === signature && Number.isFinite(deltaMs) && deltaMs >= 0 && deltaMs < DEDUPE_WINDOW_MS) {
        if (memo && memo !== latest.memo) {
          const updated: SavedHistoryEntry = { ...latest, memo };
          const next = [updated, ...history.slice(1)];
          writeHistory(next);
          return updated;
        }
        return latest;
      }
    }

    const entry: SavedHistoryEntry = {
      id: generateId(),
      savedAt: now.toISOString(),
      mode: params.mode,
      scores
    };
    if (memo) entry.memo = memo;

    const next = [entry, ...history].sort(sortBySavedAtDesc).slice(0, HISTORY_LIMIT);
    writeHistory(next);
    return entry;
  } catch {
    return null;
  }
}

export function updateHistoryMemo(id: string, memo: string) {
  if (typeof window === 'undefined') return null;
  try {
    const history = readHistory();
    const index = history.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const next = [...history];
    const trimmed = sanitizeMemo(memo);
    const updated: SavedHistoryEntry = { ...next[index] };
    if (trimmed) updated.memo = trimmed;
    else delete updated.memo;
    next[index] = updated;

    writeHistory(next);
    return updated;
  } catch {
    return null;
  }
}

