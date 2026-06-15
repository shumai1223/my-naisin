// GA4 レポートのプリセット定義。CLI（ga4.mjs）と MCP サーバー（ga4-mcp.mjs）で共有する。
// dimensions/metrics はカンマ区切り文字列。orderBy はソート対象の dimension/metric 名。
export const PRESETS = {
  totals: { dimensions: '', metrics: 'screenPageViews,totalUsers,sessions,engagedSessions,averageSessionDuration' },
  'top-pages': { dimensions: 'pagePath', metrics: 'screenPageViews,totalUsers', orderBy: 'screenPageViews', limit: 30 },
  landing: { dimensions: 'landingPagePlusQueryString', metrics: 'sessions,totalUsers,bounceRate', orderBy: 'sessions', limit: 30 },
  channels: { dimensions: 'sessionDefaultChannelGroup', metrics: 'sessions,totalUsers,engagedSessions', orderBy: 'sessions', limit: 20 },
  sources: { dimensions: 'sessionSource,sessionMedium', metrics: 'sessions,totalUsers', orderBy: 'sessions', limit: 30 },
  daily: { dimensions: 'date', metrics: 'screenPageViews,totalUsers,sessions', orderBy: 'date', asc: true, limit: 90 },
  devices: { dimensions: 'deviceCategory', metrics: 'sessions,totalUsers', orderBy: 'sessions', limit: 10 },
  countries: { dimensions: 'country', metrics: 'sessions,totalUsers', orderBy: 'sessions', limit: 20 },
  events: { dimensions: 'eventName', metrics: 'eventCount,totalUsers', orderBy: 'eventCount', limit: 40 },
};
