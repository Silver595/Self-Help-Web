
import webPush from 'web-push';

import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

let isConfigured = false;

function configureWebPush() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = env;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
    throw new ApiError(
      503,
      'Push notifications are not configured. Set all VAPID environment variables.',
    );
  }

  if (!isConfigured) {
    webPush.setVapidDetails(
      VAPID_SUBJECT,
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY,
    );

    isConfigured = true;
  }
}

export function getVapidPublicKey() {
  configureWebPush();
  return env.VAPID_PUBLIC_KEY;
}

export async function sendWebPush(subscription, payload) {
  configureWebPush();

  return webPush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    },
    JSON.stringify(payload),
    {
      TTL: 300,
      urgency: 'high',
    },
  );
}
