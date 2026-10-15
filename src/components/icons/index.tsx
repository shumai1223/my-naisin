/**
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
import type { IconProps } from '@phosphor-icons/react';
import {
  AlarmIcon as PhAlarm,
  ArchiveIcon as PhArchive,
  ArrowCounterClockwiseIcon as PhArrowCounterClockwise,
  ArrowLeftIcon as PhArrowLeft,
  ArrowRightIcon as PhArrowRight,
  ArrowSquareOutIcon as PhArrowSquareOut,
  ArrowUUpLeftIcon as PhArrowUUpLeft,
  ArrowUpIcon as PhArrowUp,
  ArrowUpRightIcon as PhArrowUpRight,
  ArrowsClockwiseIcon as PhArrowsClockwise,
  ArrowsDownUpIcon as PhArrowsDownUp,
  ArrowsLeftRightIcon as PhArrowsLeftRight,
  BankIcon as PhBank,
  BarbellIcon as PhBarbell,
  BellIcon as PhBell,
  BellRingingIcon as PhBellRinging,
  BookBookmarkIcon as PhBookBookmark,
  BookOpenIcon as PhBookOpen,
  BookOpenTextIcon as PhBookOpenText,
  BookmarkSimpleIcon as PhBookmarkSimple,
  BrainIcon as PhBrain,
  BugIcon as PhBug,
  BuildingsIcon as PhBuildings,
  CalculatorIcon as PhCalculator,
  CalendarIcon as PhCalendar,
  CalendarBlankIcon as PhCalendarBlank,
  CalendarCheckIcon as PhCalendarCheck,
  CalendarDotsIcon as PhCalendarDots,
  CalendarPlusIcon as PhCalendarPlus,
  CalendarXIcon as PhCalendarX,
  CaretDownIcon as PhCaretDown,
  CaretLeftIcon as PhCaretLeft,
  CaretRightIcon as PhCaretRight,
  CaretUpIcon as PhCaretUp,
  ChartBarIcon as PhChartBar,
  ChartLineIcon as PhChartLine,
  ChatCircleIcon as PhChatCircle,
  ChatCircleDotsIcon as PhChatCircleDots,
  ChatTextIcon as PhChatText,
  CheckIcon as PhCheck,
  CheckCircleIcon as PhCheckCircle,
  CheckSquareIcon as PhCheckSquare,
  CircleNotchIcon as PhCircleNotch,
  ClipboardTextIcon as PhClipboardText,
  ClockIcon as PhClock,
  ClockCounterClockwiseIcon as PhClockCounterClockwise,
  CodeIcon as PhCode,
  CoffeeIcon as PhCoffee,
  ConfettiIcon as PhConfetti,
  CookieIcon as PhCookie,
  CopyIcon as PhCopy,
  CrosshairIcon as PhCrosshair,
  CrownIcon as PhCrown,
  DatabaseIcon as PhDatabase,
  DeviceMobileIcon as PhDeviceMobile,
  DevicesIcon as PhDevices,
  DiamondIcon as PhDiamond,
  DownloadSimpleIcon as PhDownloadSimple,
  EnvelopeIcon as PhEnvelope,
  EyeIcon as PhEye,
  FileTextIcon as PhFileText,
  FileXIcon as PhFileX,
  FileXlsIcon as PhFileXls,
  FireIcon as PhFire,
  FlaskIcon as PhFlask,
  FloppyDiskIcon as PhFloppyDisk,
  FunnelIcon as PhFunnel,
  GaugeIcon as PhGauge,
  GiftIcon as PhGift,
  GithubLogoIcon as PhGithubLogo,
  GlobeIcon as PhGlobe,
  GraduationCapIcon as PhGraduationCap,
  HammerIcon as PhHammer,
  HandCoinsIcon as PhHandCoins,
  HandHeartIcon as PhHandHeart,
  HandshakeIcon as PhHandshake,
  HeartIcon as PhHeart,
  HexagonIcon as PhHexagon,
  HouseIcon as PhHouse,
  ImageIcon as PhImage,
  InfoIcon as PhInfo,
  KeyIcon as PhKey,
  LaptopIcon as PhLaptop,
  LightbulbIcon as PhLightbulb,
  LightningIcon as PhLightning,
  LinkIcon as PhLink,
  ListIcon as PhList,
  ListChecksIcon as PhListChecks,
  ListNumbersIcon as PhListNumbers,
  LockIcon as PhLock,
  MagnifyingGlassIcon as PhMagnifyingGlass,
  MapPinIcon as PhMapPin,
  MapTrifoldIcon as PhMapTrifold,
  MedalIcon as PhMedal,
  MinusIcon as PhMinus,
  MonitorIcon as PhMonitor,
  MoonIcon as PhMoon,
  MusicNotesIcon as PhMusicNotes,
  NewspaperIcon as PhNewspaper,
  NotePencilIcon as PhNotePencil,
  PaletteIcon as PhPalette,
  PaperPlaneTiltIcon as PhPaperPlaneTilt,
  PathIcon as PhPath,
  PauseIcon as PhPause,
  PenNibIcon as PhPenNib,
  PencilLineIcon as PhPencilLine,
  PencilSimpleIcon as PhPencilSimple,
  PercentIcon as PhPercent,
  PiggyBankIcon as PhPiggyBank,
  PlantIcon as PhPlant,
  PlayIcon as PhPlay,
  PlusIcon as PhPlus,
  PrinterIcon as PhPrinter,
  PulseIcon as PhPulse,
  QrCodeIcon as PhQrCode,
  QuestionIcon as PhQuestion,
  QuotesIcon as PhQuotes,
  ReceiptIcon as PhReceipt,
  RobotIcon as PhRobot,
  RocketIcon as PhRocket,
  ScalesIcon as PhScales,
  ShareNetworkIcon as PhShareNetwork,
  ShieldIcon as PhShield,
  ShieldCheckIcon as PhShieldCheck,
  ShieldWarningIcon as PhShieldWarning,
  SigmaIcon as PhSigma,
  SlidersHorizontalIcon as PhSlidersHorizontal,
  SparkleIcon as PhSparkle,
  StackIcon as PhStack,
  StarIcon as PhStar,
  StudentIcon as PhStudent,
  SunIcon as PhSun,
  TableIcon as PhTable,
  TagIcon as PhTag,
  TargetIcon as PhTarget,
  TerminalIcon as PhTerminal,
  TimerIcon as PhTimer,
  TrashIcon as PhTrash,
  TrayIcon as PhTray,
  TrendDownIcon as PhTrendDown,
  TrendUpIcon as PhTrendUp,
  TrophyIcon as PhTrophy,
  UserIcon as PhUser,
  UsersIcon as PhUsers,
  WalletIcon as PhWallet,
  WarningIcon as PhWarning,
  WarningCircleIcon as PhWarningCircle,
  WrenchIcon as PhWrench,
  XIcon as PhX,
  XCircleIcon as PhXCircle,
} from '@phosphor-icons/react/dist/ssr';

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

export const Activity = wrap(PhPulse, 'Activity');
export const AlarmClockCheck = wrap(PhAlarm, 'AlarmClockCheck');
export const AlertCircle = wrap(PhWarningCircle, 'AlertCircle');
export const AlertTriangle = wrap(PhWarning, 'AlertTriangle');
export const Archive = wrap(PhArchive, 'Archive');
export const ArrowLeft = wrap(PhArrowLeft, 'ArrowLeft');
export const ArrowLeftRight = wrap(PhArrowsLeftRight, 'ArrowLeftRight');
export const ArrowRight = wrap(PhArrowRight, 'ArrowRight');
export const ArrowUp = wrap(PhArrowUp, 'ArrowUp');
export const ArrowUpDown = wrap(PhArrowsDownUp, 'ArrowUpDown');
export const ArrowUpRight = wrap(PhArrowUpRight, 'ArrowUpRight');
export const Award = wrap(PhMedal, 'Award');
export const BarChart3 = wrap(PhChartBar, 'BarChart3');
export const Beaker = wrap(PhFlask, 'Beaker');
export const Bell = wrap(PhBell, 'Bell');
export const BellRing = wrap(PhBellRinging, 'BellRing');
export const BookCheck = wrap(PhBookOpenText, 'BookCheck');
export const BookMarked = wrap(PhBookBookmark, 'BookMarked');
export const BookOpen = wrap(PhBookOpen, 'BookOpen');
export const BookOpenCheck = wrap(PhBookOpenText, 'BookOpenCheck');
export const Bookmark = wrap(PhBookmarkSimple, 'Bookmark');
export const Bot = wrap(PhRobot, 'Bot');
export const Brain = wrap(PhBrain, 'Brain');
export const Bug = wrap(PhBug, 'Bug');
export const Building2 = wrap(PhBuildings, 'Building2');
export const Calculator = wrap(PhCalculator, 'Calculator');
export const Calendar = wrap(PhCalendar, 'Calendar');
export const CalendarClock = wrap(PhCalendarCheck, 'CalendarClock');
export const CalendarDays = wrap(PhCalendarDots, 'CalendarDays');
export const CalendarPlus = wrap(PhCalendarPlus, 'CalendarPlus');
export const CalendarRange = wrap(PhCalendarBlank, 'CalendarRange');
export const CalendarX = wrap(PhCalendarX, 'CalendarX');
export const Check = wrap(PhCheck, 'Check');
export const CheckCircle = wrap(PhCheckCircle, 'CheckCircle');
export const CheckCircle2 = wrap(PhCheckCircle, 'CheckCircle2');
export const CheckSquare = wrap(PhCheckSquare, 'CheckSquare');
export const ChevronDown = wrap(PhCaretDown, 'ChevronDown');
export const ChevronLeft = wrap(PhCaretLeft, 'ChevronLeft');
export const ChevronRight = wrap(PhCaretRight, 'ChevronRight');
export const ChevronRightSquare = wrap(PhCaretRight, 'ChevronRightSquare');
export const ChevronUp = wrap(PhCaretUp, 'ChevronUp');
export const ClipboardCheck = wrap(PhClipboardText, 'ClipboardCheck');
export const ClipboardList = wrap(PhClipboardText, 'ClipboardList');
export const Clock = wrap(PhClock, 'Clock');
export const Code = wrap(PhCode, 'Code');
export const Code2 = wrap(PhCode, 'Code2');
export const Coffee = wrap(PhCoffee, 'Coffee');
export const Cookie = wrap(PhCookie, 'Cookie');
export const Copy = wrap(PhCopy, 'Copy');
export const Crosshair = wrap(PhCrosshair, 'Crosshair');
export const Crown = wrap(PhCrown, 'Crown');
export const Database = wrap(PhDatabase, 'Database');
export const Download = wrap(PhDownloadSimple, 'Download');
export const Dumbbell = wrap(PhBarbell, 'Dumbbell');
export const Edit3 = wrap(PhPencilSimple, 'Edit3');
export const ExternalLink = wrap(PhArrowSquareOut, 'ExternalLink');
export const Eye = wrap(PhEye, 'Eye');
export const FileCheck = wrap(PhFileText, 'FileCheck');
export const FileCheck2 = wrap(PhFileText, 'FileCheck2');
export const FileSpreadsheet = wrap(PhFileXls, 'FileSpreadsheet');
export const FileText = wrap(PhFileText, 'FileText');
export const FileWarning = wrap(PhFileX, 'FileWarning');
export const Filter = wrap(PhFunnel, 'Filter');
export const Flame = wrap(PhFire, 'Flame');
export const Gauge = wrap(PhGauge, 'Gauge');
export const Gem = wrap(PhDiamond, 'Gem');
export const Gift = wrap(PhGift, 'Gift');
export const Github = wrap(PhGithubLogo, 'Github');
export const Globe = wrap(PhGlobe, 'Globe');
export const GraduationCap = wrap(PhGraduationCap, 'GraduationCap');
export const Hammer = wrap(PhHammer, 'Hammer');
export const HandCoins = wrap(PhHandCoins, 'HandCoins');
export const HandHeart = wrap(PhHandHeart, 'HandHeart');
export const Handshake = wrap(PhHandshake, 'Handshake');
export const Heart = wrap(PhHeart, 'Heart');
export const HeartHandshake = wrap(PhHandHeart, 'HeartHandshake');
export const HelpCircle = wrap(PhQuestion, 'HelpCircle');
export const Hexagon = wrap(PhHexagon, 'Hexagon');
export const History = wrap(PhClockCounterClockwise, 'History');
export const Home = wrap(PhHouse, 'Home');
export const ImageIcon = wrap(PhImage, 'ImageIcon');
export const Inbox = wrap(PhTray, 'Inbox');
export const Info = wrap(PhInfo, 'Info');
export const KeyRound = wrap(PhKey, 'KeyRound');
export const Landmark = wrap(PhBank, 'Landmark');
export const Laptop = wrap(PhLaptop, 'Laptop');
export const Layers = wrap(PhStack, 'Layers');
export const Lightbulb = wrap(PhLightbulb, 'Lightbulb');
export const LineChart = wrap(PhChartLine, 'LineChart');
export const Link2 = wrap(PhLink, 'Link2');
export const List = wrap(PhList, 'List');
export const ListChecks = wrap(PhListChecks, 'ListChecks');
export const ListOrdered = wrap(PhListNumbers, 'ListOrdered');
export const ListTodo = wrap(PhListChecks, 'ListTodo');
export const Loader2 = wrap(PhCircleNotch, 'Loader2');
export const Lock = wrap(PhLock, 'Lock');
export const Mail = wrap(PhEnvelope, 'Mail');
export const Map = wrap(PhMapTrifold, 'Map');
export const MapPin = wrap(PhMapPin, 'MapPin');
export const Medal = wrap(PhMedal, 'Medal');
export const MessageCircle = wrap(PhChatCircle, 'MessageCircle');
export const MessageCircleHeart = wrap(PhChatCircleDots, 'MessageCircleHeart');
export const MessageCircleQuestion = wrap(PhChatCircleDots, 'MessageCircleQuestion');
export const MessageSquare = wrap(PhChatText, 'MessageSquare');
export const Minus = wrap(PhMinus, 'Minus');
export const Monitor = wrap(PhMonitor, 'Monitor');
export const MonitorSmartphone = wrap(PhDevices, 'MonitorSmartphone');
export const Moon = wrap(PhMoon, 'Moon');
export const Music = wrap(PhMusicNotes, 'Music');
export const Network = wrap(PhShareNetwork, 'Network');
export const Newspaper = wrap(PhNewspaper, 'Newspaper');
export const NotebookPen = wrap(PhNotePencil, 'NotebookPen');
export const Palette = wrap(PhPalette, 'Palette');
export const PartyPopper = wrap(PhConfetti, 'PartyPopper');
export const Pause = wrap(PhPause, 'Pause');
export const PenLine = wrap(PhPencilLine, 'PenLine');
export const PenTool = wrap(PhPenNib, 'PenTool');
export const Percent = wrap(PhPercent, 'Percent');
export const PiggyBank = wrap(PhPiggyBank, 'PiggyBank');
export const Play = wrap(PhPlay, 'Play');
export const Plus = wrap(PhPlus, 'Plus');
export const Printer = wrap(PhPrinter, 'Printer');
export const QrCode = wrap(PhQrCode, 'QrCode');
export const Quote = wrap(PhQuotes, 'Quote');
export const Receipt = wrap(PhReceipt, 'Receipt');
export const RefreshCw = wrap(PhArrowsClockwise, 'RefreshCw');
export const Rocket = wrap(PhRocket, 'Rocket');
export const RotateCcw = wrap(PhArrowCounterClockwise, 'RotateCcw');
export const Route = wrap(PhPath, 'Route');
export const Save = wrap(PhFloppyDisk, 'Save');
export const Scale = wrap(PhScales, 'Scale');
export const School = wrap(PhStudent, 'School');
export const Search = wrap(PhMagnifyingGlass, 'Search');
export const Send = wrap(PhPaperPlaneTilt, 'Send');
export const Settings2 = wrap(PhSlidersHorizontal, 'Settings2');
export const Share2 = wrap(PhShareNetwork, 'Share2');
export const Shield = wrap(PhShield, 'Shield');
export const ShieldAlert = wrap(PhShieldWarning, 'ShieldAlert');
export const ShieldCheck = wrap(PhShieldCheck, 'ShieldCheck');
export const Sigma = wrap(PhSigma, 'Sigma');
export const Smartphone = wrap(PhDeviceMobile, 'Smartphone');
export const Sparkles = wrap(PhSparkle, 'Sparkles');
export const Sprout = wrap(PhPlant, 'Sprout');
export const Star = wrap(PhStar, 'Star');
export const Sun = wrap(PhSun, 'Sun');
export const Table2 = wrap(PhTable, 'Table2');
export const TableProperties = wrap(PhTable, 'TableProperties');
export const Tag = wrap(PhTag, 'Tag');
export const Target = wrap(PhTarget, 'Target');
export const Terminal = wrap(PhTerminal, 'Terminal');
export const Timer = wrap(PhTimer, 'Timer');
export const Trash2 = wrap(PhTrash, 'Trash2');
export const TrendingDown = wrap(PhTrendDown, 'TrendingDown');
export const TrendingUp = wrap(PhTrendUp, 'TrendingUp');
export const Trophy = wrap(PhTrophy, 'Trophy');
export const Undo2 = wrap(PhArrowUUpLeft, 'Undo2');
export const User = wrap(PhUser, 'User');
export const Users = wrap(PhUsers, 'Users');
export const Wallet = wrap(PhWallet, 'Wallet');
export const Wrench = wrap(PhWrench, 'Wrench');
export const X = wrap(PhX, 'X');
export const XCircle = wrap(PhXCircle, 'XCircle');
export const Zap = wrap(PhLightning, 'Zap');
