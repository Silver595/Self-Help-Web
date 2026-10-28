
import { api } from '~/lib/api';

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PushPublicKeyResponse {
  publicKey: string;
}

interface PushActionResponse {
  enabled?: boolean;
  removed?: boolean;
  sent?: number;
}

export function getPushPublicKey() {
  return api<PushPublicKeyResponse>('/notifications/public-key');
}

export function savePushSubscription(
  subscription: PushSubscriptionPayload,
) {
  return api<PushActionResponse>('/notifications/subscribe', {
    method: 'POST',
    body: subscription,
  });
}

export function removePushSubscription(endpoint: string) {
  return api<PushActionResponse>('/notifications/subscription', {
    method: 'DELETE',
    body: { endpoint },
  });
}

export function sendTestPushNotification() {
  return api<PushActionResponse>('/notifications/test', {
    method: 'POST',
  });
}

function decodeVapidPublicKey(base64String: string): ArrayBuffer {
  const padding = '='.repeat(
    (4 - (base64String.length % 4)) % 4,
  );

  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const raw = window.atob(base64);
  const bytes = new Uint8Array(raw.length);

  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }

  return bytes.buffer;
}

function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function getCurrentPushSubscription() {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    return null;
  }

  const registration = await navigator.serviceWorker.getRegistration('/');

  if (!registration) return null;

  return registration.pushManager.getSubscription();
}

async function saveBrowserSubscription(
  subscription: PushSubscription,
) {
  const json = subscription.toJSON();

  if (
    !json.endpoint ||
    !json.keys?.p256dh ||
    !json.keys?.auth
  ) {
    throw new Error('The browser returned an incomplete push subscription.');
  }

  await savePushSubscription({
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  });
}

export async function syncExistingPushSubscription() {
  const subscription = await getCurrentPushSubscription();

  if (!subscription) return false;

  await saveBrowserSubscription(subscription);
  return true;
}

export async function enablePushNotifications() {
  if (!isPushSupported()) {
    throw new Error(
      'Push notifications require a supported browser and HTTPS (localhost is also supported).',
    );
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error(
      permission === 'denied'
        ? 'Notifications are blocked by your browser. Enable them in the site settings first.'
        : 'Notification permission was not granted.',
    );
  }

  const { publicKey } = await getPushPublicKey();

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const activeRegistration =
    (await navigator.serviceWorker.getRegistration('/')) ??
    registration;

  let subscription =
    await activeRegistration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await activeRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidPublicKey(publicKey),
    });
  }

  await saveBrowserSubscription(subscription);

  return subscription;
}

export async function disablePushNotifications() {
  const subscription = await getCurrentPushSubscription();

  if (!subscription) return;

  // Remove it from the backend first. If that fails, let the user retry.
  await removePushSubscription(subscription.endpoint);
  await subscription.unsubscribe();
}
