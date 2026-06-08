import { DEFAULT_SCORES } from '@/lib/constants';
import { DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import type { SavedHistoryEntry, Scores, SubjectKey } from '@/lib/types';

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
  if (raw === null) {
    // デフォルトでtrueを返す（初回訪問時は自動的に保存ON）
    return true;
  }
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

function sanitizePrefectureCode(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return DEFAULT_PREFECTURE_CODE;
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

function buildSignature(prefectureCode: string, scores: Scores) {
  return `${prefectureCode}|${(Object.keys(scores) as SubjectKey[])
    .sort()
    .map((k) => `${k}:${scores[k]}`)
    .join(',')}`;
}

function sanitizeHistoryEntry(value: unknown): SavedHistoryEntry | null {
  if (!value || typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;

  const id = obj.id;
  if (typeof id !== 'string' || !id.trim()) return null;

  const savedAt = obj.savedAt;
  if (typeof savedAt !== 'string' || !savedAt.trim()) return null;
  const savedAtMs = Date.parse(savedAt);
  if (!Number.isFinite(savedAtMs)) return null;

  const scores = sanitizeScores(obj.scores);
  if (!scores) return null;

  const memo = sanitizeMemo(obj.memo);
  const prefectureCode = sanitizePrefectureCode(obj.prefectureCode);

  const entry: SavedHistoryEntry = {
    id,
    savedAt: new Date(savedAtMs).toISOString(),
    scores,
    prefectureCode
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

export function appendHistoryEntry(params: { scores: Scores; memo?: string; prefectureCode?: string; now?: Date }) {
  if (typeof window === 'undefined') return null;
  try {
    const now = params.now ?? new Date();
    const memo = sanitizeMemo(params.memo);
    const scores = sanitizeScores(params.scores) ?? { ...DEFAULT_SCORES };
    const prefectureCode = params.prefectureCode ?? DEFAULT_PREFECTURE_CODE;
    const history = readHistory();

    const signature = buildSignature(prefectureCode, scores);
    const latest = history[0];
    if (latest) {
      const latestSig = buildSignature(latest.prefectureCode ?? DEFAULT_PREFECTURE_CODE, latest.scores);
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
      scores,
      prefectureCode
    };
    if (memo) entry.memo = memo;

    const next = [entry, ...history].sort(sortBySavedAtDesc).slice(0, HISTORY_LIMIT);
    writeHistory(next);
    return entry;
  } catch {
    return null;
  }
}

/**
 * 保存した目標（堀A：再訪導線の燃料）。
 * 結果ページで「志望校までの差」を確定した瞬間に保存し、次回訪問時に
 * 「前回の続き＝◯◯まであと△点」を出して“使い捨て”を“再訪”に変える。
 */
export interface SavedGoal {
  prefectureCode: string;
  prefectureName?: string;
  /** 目標内申点 */
  target: number;
  /** 目標のラベル（例：「横浜翠嵐の目安」「あなたの目標」） */
  targetLabel?: string;
  /** 保存時点の内申点 */
  score: number;
  /** 目標までのギャップ（正＝不足、0以下＝到達） */
  gap: number;
  /** ISO日時 */
  savedAt: string;
}

const SAVED_GOAL_KEY = 'my-naishin:saved-goal';

export function readSavedGoal(): SavedGoal | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SAVED_GOAL_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const target = toFiniteNumber(obj.target);
    const score = toFiniteNumber(obj.score);
    const gap = toFiniteNumber(obj.gap);
    const prefectureCode = typeof obj.prefectureCode === 'string' ? obj.prefectureCode : null;
    const savedAt = typeof obj.savedAt === 'string' ? obj.savedAt : null;
    if (target == null || score == null || gap == null || !prefectureCode || !savedAt) return null;
    if (!Number.isFinite(Date.parse(savedAt))) return null;
    return {
      prefectureCode,
      prefectureName: typeof obj.prefectureName === 'string' ? obj.prefectureName : undefined,
      target: Math.round(target),
      targetLabel: typeof obj.targetLabel === 'string' ? obj.targetLabel : undefined,
      score: Math.round(score),
      gap: Math.round(gap),
      savedAt,
    };
  } catch {
    return null;
  }
}

export function writeSavedGoal(goal: Omit<SavedGoal, 'savedAt'> & { savedAt?: string }): SavedGoal | null {
  if (typeof window === 'undefined') return null;
  try {
    const entry: SavedGoal = { ...goal, savedAt: goal.savedAt ?? new Date().toISOString() };
    window.localStorage.setItem(SAVED_GOAL_KEY, JSON.stringify(entry));
    return entry;
  } catch {
    return null;
  }
}

export function clearSavedGoal() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SAVED_GOAL_KEY);
  } catch {
    // ignore
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

