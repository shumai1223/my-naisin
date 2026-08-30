#!/usr/bin/env node
// Google Trends の CLI（MCPを起動せずに同じ実装を叩くための動作確認・単発調査用）。
// scripts/ga4.mjs / scripts/gsc.mjs と同じ位置づけ。MCPが繋がらないときの切り分けにも使う。
//
// 使い方:
//   npm run trends -- health
//   npm run trends -- iot 内申点 偏差値 --timeframe "today 12-m"
//   npm run trends -- region 内申点
//   npm run trends -- related 内申点
//   npm run trends -- topics 内申点
//   npm run trends -- season 内申点
//   npm run trends -- trending --geo JP
//   npm run trends -- suggest 内申点
//   npm run trends -- clear-cache
import {
  clearCache,
  health,
  interestByRegion,
  interestOverTime,
  relatedQueries,
  relatedTopics,
  seasonality,
  suggestions,
  trendingNow,
} from './lib/trends-client.mjs';

const argv = process.argv.slice(2);
const cmd = argv[0];

// --key value 形式のフラグと、それ以外の位置引数に分ける
const flags = {};
const positional = [];
for (let i = 1; i < argv.length; i += 1) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) flags[key] = true;
    else {
      flags[key] = next;
      i += 1;
    }
  } else positional.push(a);
}

const out = (o) => console.log(JSON.stringify(o, null, 2));

const common = {
  ...(flags.geo !== undefined ? { geo: String(flags.geo) } : {}),
  ...(flags.timeframe ? { timeframe: String(flags.timeframe) } : {}),
  ...(flags.category ? { category: Number(flags.category) } : {}),
  ...(flags.property ? { property: String(flags.property) } : {}),
  ...(flags.fresh ? { noCache: true } : {}),
};

try {
  switch (cmd) {
    case 'health':
      out(await health({ probe: flags.noProbe ? false : true }));
      break;
    case 'iot':
      out(await interestOverTime({ keywords: positional, ...common }));
      break;
    case 'region':
      out(
        await interestByRegion({
          keywords: positional,
          ...common,
          ...(flags.resolution ? { resolution: String(flags.resolution) } : {}),
        }),
      );
      break;
    case 'related':
      out(await relatedQueries({ keywords: positional, ...common }));
      break;
    case 'topics':
      out(await relatedTopics({ keywords: positional, ...common }));
      break;
    case 'season':
      out(await seasonality({ keyword: positional[0], ...common }));
      break;
    case 'trending':
      out(await trendingNow({ ...common, ...(flags.limit ? { limit: Number(flags.limit) } : {}) }));
      break;
    case 'suggest':
      out(await suggestions({ keyword: positional[0], ...common }));
      break;
    case 'clear-cache':
      out(clearCache());
      break;
    default:
      console.error(
        [
          'usage: npm run trends -- <command> [args] [--flags]',
          '',
          '  health                        疎通・設定・キャッシュ診断（--noProbe で通信なし）',
          '  iot <kw...>                   時系列（最大5語まで比較）',
          '  region <kw...>                地域別（--resolution REGION|CITY|COUNTRY）',
          '  related <kw...>               関連クエリ（top/rising）',
          '  topics <kw...>                関連トピック（top/rising）',
          '  season <kw>                   月別平均・ピーク月・季節係数（既定 today 5-y）',
          '  trending                      急上昇（--geo JP --limit 20）',
          '  suggest <kw>                  トピック候補（オートコンプリート）',
          '  clear-cache                   キャッシュ全消去',
          '',
          'flags: --geo --timeframe --category --property --limit --resolution --fresh(キャッシュ無視)',
        ].join('\n'),
      );
      process.exit(cmd ? 1 : 0);
  }
} catch (e) {
  console.error('エラー:', e?.message || e);
  process.exit(1);
}
