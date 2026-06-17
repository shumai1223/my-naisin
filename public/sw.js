/*
 * My Naishin Service Worker — Web Push（出願締切・通知表リマインド）。
 *
 * 役割は最小限：プッシュ受信の表示と、通知クリックでの遷移のみ。
 * （オフラインキャッシュ等は将来拡張。まずは「Google非依存の再訪チャネル」を点ける。）
 */

self.addEventListener('install', () => {
  // すぐ有効化（古いSWを待たない）。
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'My Naishin', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'My Naishin';
  const options = {
    body: data.body || '',
    icon: data.icon || '/favicon.svg',
    badge: data.badge || '/favicon.svg',
    // クリック時に開くURL（既定はトップ）。
    data: { url: data.url || '/' },
    tag: data.tag || 'my-naishin',
    renotify: Boolean(data.tag),
    requireInteraction: Boolean(data.requireInteraction),
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  const url = new URL(target, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 既存タブがあれば再利用。
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
      return undefined;
    })
  );
});
