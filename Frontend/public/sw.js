
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Growth OS reminder',
    body: 'You have a habit scheduled.',
    url: '/habits',
  };

  if (event.data) {
    try {
      payload = {
        ...payload,
        ...event.data.json(),
      };
    } catch {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag || 'growth-os-reminder',
      data: {
        url: payload.url || '/habits',
      },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const requestedPath = event.notification.data?.url || '/habits';
      const target = new URL(requestedPath, self.location.origin);

      // Never navigate to an external origin from a notification.
      if (target.origin !== self.location.origin) {
        target.href = new URL('/habits', self.location.origin).href;
      }

      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of clients) {
        if ('focus' in client) {
          if ('navigate' in client) {
            await client.navigate(target.href);
          }

          await client.focus();
          return;
        }
      }

      await self.clients.openWindow(target.href);
    })(),
  );
});
