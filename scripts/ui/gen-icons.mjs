#!/usr/bin/env node
/**
 * アイコンの再エクスポート（lucide の名前 → Phosphor regular）を生成する。
 *   node scripts/ui/gen-icons.mjs
 * 出力: src/components/icons/index.tsx（手で編集しない。対応の追加はこのファイルの MANUAL に書く）
 *
 * src/ 内の `from 'lucide-react'` および `from '@/components/icons'` で import されている名前を集め、
 * 対応が無い名前があればエラーにする。
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { ROOT, walk } from './_shared.mjs';

// lucide名 → Phosphor名（基底名。`XxxIcon` として import する）
const AUTO = {
  Home: 'House', HelpCircle: 'Question', AlertTriangle: 'Warning', AlertCircle: 'WarningCircle', Info: 'Info',
  ChevronRight: 'CaretRight', ChevronLeft: 'CaretLeft', ChevronDown: 'CaretDown', ChevronUp: 'CaretUp', ChevronRightSquare: 'CaretRight',
  ExternalLink: 'ArrowSquareOut', ArrowRight: 'ArrowRight', ArrowLeft: 'ArrowLeft', RotateCcw: 'ArrowCounterClockwise', Undo2: 'ArrowUUpLeft',
  RefreshCw: 'ArrowsClockwise', TrendingUp: 'TrendUp', TrendingDown: 'TrendDown', BarChart3: 'ChartBar', LineChart: 'ChartLine',
  Calculator: 'Calculator', BookOpen: 'BookOpen', Target: 'Target', Sparkles: 'Sparkle', ShieldCheck: 'ShieldCheck', GraduationCap: 'GraduationCap',
  MapPin: 'MapPin', Calendar: 'Calendar', FileText: 'FileText', Award: 'Medal', Check: 'Check', Wallet: 'Wallet', Search: 'MagnifyingGlass',
  Zap: 'Lightning', Users: 'Users', User: 'User', MessageCircle: 'ChatCircle', CheckCircle: 'CheckCircle', CheckCircle2: 'CheckCircle', Loader2: 'CircleNotch',
  Mail: 'Envelope', FileCheck: 'FileText', Clock: 'Clock', Star: 'Star', Lightbulb: 'Lightbulb', Send: 'PaperPlaneTilt', Scale: 'Scales', Shield: 'Shield',
  School: 'Student', Share2: 'ShareNetwork', CalendarClock: 'CalendarCheck', ClipboardCheck: 'ClipboardText', X: 'X', Trash2: 'Trash', Heart: 'Heart', Plus: 'Plus',
  Trophy: 'Trophy', Flame: 'Fire', MessageCircleQuestion: 'ChatCircleDots', ListChecks: 'ListChecks', Code2: 'Code', Database: 'Database',
};
const MANUAL = {
  BookCheck: 'BookOpenText', PenLine: 'PencilLine', NotebookPen: 'NotePencil', Building2: 'Buildings', ClipboardList: 'ClipboardText',
  ArrowLeftRight: 'ArrowsLeftRight', BookMarked: 'BookBookmark', MessageSquare: 'ChatText', HeartHandshake: 'HandHeart', CalendarDays: 'CalendarDots',
  Quote: 'Quotes', History: 'ClockCounterClockwise', BellRing: 'BellRinging', PartyPopper: 'Confetti', Github: 'GithubLogo', KeyRound: 'Key',
  Route: 'Path', Layers: 'Stack', Music: 'MusicNotes', Dumbbell: 'Barbell', FileSpreadsheet: 'FileXls', BookOpenCheck: 'BookOpenText',
  ListOrdered: 'ListNumbers', Edit3: 'PencilSimple', MessageCircleHeart: 'ChatCircleDots', ListTodo: 'ListChecks', ArrowUpDown: 'ArrowsDownUp',
  Bot: 'Robot', MonitorSmartphone: 'Devices', Table2: 'Table', Sprout: 'Plant', Map: 'MapTrifold', ImageIcon: 'Image', ShieldAlert: 'ShieldWarning',
  Activity: 'Pulse', FileCheck2: 'FileText', Landmark: 'Bank', AlarmClockCheck: 'Alarm', FileWarning: 'FileX', TableProperties: 'Table',
  Filter: 'Funnel', Link2: 'Link', Twitter: 'XLogo', Settings2: 'SlidersHorizontal', CalendarRange: 'CalendarBlank', Inbox: 'Tray', Beaker: 'Flask',
  PenTool: 'PenNib', Gem: 'Diamond', Save: 'FloppyDisk', Smartphone: 'DeviceMobile',
  // 名前が違うもの（同じ名前で存在するものは自動で採用する）
  Bookmark: 'BookmarkSimple', Download: 'DownloadSimple', Network: 'ShareNetwork', Medal: 'Medal',
};
const MAP0 = { ...AUTO, ...MANUAL };

// Phosphor 側の実在名（同名なら lucide名＝Phosphor名として採用する）
const ssrDir = path.join(ROOT, 'node_modules/@phosphor-icons/react/dist/ssr');
const have = fs.existsSync(ssrDir) ? new Set(fs.readdirSync(ssrDir).filter((f) => f.endsWith('.d.ts')).map((f) => f.replace('.d.ts', ''))) : null;
const MAP = new Proxy(MAP0, { get: (t, k) => (k in t ? t[k] : (have && have.has(String(k)) ? String(k) : undefined)) });

// 使われている名前を集める
const used = new Map();
for (const f of walk(path.join(ROOT, 'src'))) {
  const text = fs.readFileSync(f, 'utf8');
  if (!/lucide-react|@\/components\/icons/.test(text)) continue;
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  sf.statements.forEach((st) => {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) return;
    if (!['lucide-react', '@/components/icons'].includes(st.moduleSpecifier.text)) return;
    const nb = st.importClause?.namedBindings;
    if (nb && ts.isNamedImports(nb)) nb.elements.forEach((e) => {
      const n = (e.propertyName || e.name).text;
      if (n !== 'LucideIcon' && n !== 'AppIcon' && !/^type /.test(e.getText(sf))) used.set(n, (used.get(n) || 0) + 1);
    });
  });
}

// 既存の生成物から、すでに出している名前も残す（lucide-react を外した後に再生成しても落ちないように）
const outFile = path.join(ROOT, 'src/components/icons/index.tsx');
if (fs.existsSync(outFile)) {
  for (const m of fs.readFileSync(outFile, 'utf8').matchAll(/^export const (\w+) = wrap\(/gm)) if (!used.has(m[1])) used.set(m[1], 0);
}

const missing = [...used.keys()].filter((n) => !MAP[n]);
if (missing.length) { console.error('対応が無いアイコン名:', missing.join(', ')); process.exit(1); }

// Phosphor 側に実在するか確認
if (have) {
  const bad = [...used.keys()].filter((n) => !have.has(MAP[n]));
  if (bad.length) { console.error('Phosphorに存在しない名前:', bad.map((n) => `${n}→${MAP[n]}`).join(', ')); process.exit(1); }
}

const names = [...used.keys()].sort();
const bases = [...new Set(names.map((n) => MAP[n]))].sort();
const lines = [];
lines.push(`/**
 * アイコン（Phosphor・regular）。lucide-react と同じ名前で再エクスポートする。
 * 既存のコードは import 元を '@/components/icons' に変えるだけで使える。
 *
 * - 色は文字色（currentColor）。Tailwind の text-* で変える。
 * - 大きさは className の h-* w-* で指定する（指定が無ければ24px）。
 * - 塗りつぶしが要るときだけ weight="fill"。
 * - 装飾のアイコンは aria-hidden（aria-label を渡すと外れる）。
 *
 * 生成: node scripts/ui/gen-icons.mjs（手で編集しない。名前の対応は scripts/ui/gen-icons.mjs）
 */
import * as React from 'react';
import type { IconProps } from '@phosphor-icons/react';`);
// 1つずつ深いパスから読む。バレル（dist/ssr）から読むと、開発サーバーが約1,500個のアイコンを全部コンパイルして遅い・重い。
for (const b of bases) lines.push(`import { ${b}Icon as Ph${b} } from '@phosphor-icons/react/dist/ssr/${b}';`);
lines.push(`
export type AppIconProps = Omit<IconProps, 'ref'> & {
  /** lucide との互換のために受け取るだけで使わない */
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
};
export type AppIcon = React.ForwardRefExoticComponent<AppIconProps & React.RefAttributes<SVGSVGElement>>;
/** lucide の型名との互換 */
export type LucideIcon = AppIcon;

type PhosphorComponent = React.ForwardRefExoticComponent<IconProps>;

function wrap(Base: PhosphorComponent, name: string): AppIcon {
  const Icon = React.forwardRef<SVGSVGElement, AppIconProps>(function AppIconInner(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { strokeWidth: _strokeWidth, absoluteStrokeWidth: _absoluteStrokeWidth, size = 24, weight = 'regular', ...rest },
    ref,
  ) {
    const labelled = Boolean(rest['aria-label'] || rest['aria-labelledby'] || rest.alt);
    return <Base ref={ref} size={size} weight={weight} aria-hidden={labelled ? undefined : true} {...rest} />;
  });
  Icon.displayName = name;
  return Icon;
}
`);
for (const n of names) lines.push(`export const ${n} = wrap(Ph${MAP[n]}, '${n}');`);
lines.push('');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
console.log(`generated ${names.length} icons (${bases.length} Phosphor icons) -> ${path.relative(ROOT, outFile)}`);
