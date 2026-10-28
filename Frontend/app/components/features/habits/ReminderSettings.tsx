
import { useEffect, useState } from 'react';
import { Bell, BellOff, LoaderCircle, Send } from 'lucide-react';

import {
  disablePushNotifications,
  enablePushNotifications,
  sendTestPushNotification,
  syncExistingPushSubscription,
} from '~/lib/notifications';

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8d8d3] bg-white px-3 py-2.5 text-sm font-medium text-[#333] transition hover:bg-[#f6f6f3] disabled:cursor-not-allowed disabled:opacity-50';

const primaryClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#fa3600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92f00] disabled:cursor-not-allowed disabled:opacity-50';

export default function ReminderSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [working, setWorking] = useState<
    'enable' | 'disable' | 'test' | null
  >(null);

  const [permission, setPermission] =
    useState<NotificationPermission | 'unsupported'>('default');

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;

    async function checkSupport() {
      const supported =
        typeof window !== 'undefined' &&
        window.isSecureContext &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;

      if (!supported) {
        setIsSupported(false);
        setPermission('unsupported');
        setIsChecking(false);
        return;
      }

      setIsSupported(true);
      setPermission(Notification.permission);

      try {
        const enabled = await syncExistingPushSubscription();

        if (active) {
          setIsEnabled(enabled);
        }
      } catch (caught) {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Unable to check this device subscription.',
          );
        }
      } finally {
        if (active) setIsChecking(false);
      }
    }

    void checkSupport();

    return () => {
      active = false;
    };
  }, []);

  async function handleEnable() {
    setWorking('enable');
    setError('');
    setNotice('');

    try {
      await enablePushNotifications();

      setIsEnabled(true);
      setPermission(Notification.permission);
      setNotice(
        'Push reminders are enabled on this device. Set a reminder time on a habit to receive reminders.',
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to enable push reminders.',
      );
    } finally {
      setWorking(null);
    }
  }

  async function handleDisable() {
    setWorking('disable');
    setError('');
    setNotice('');

    try {
      await disablePushNotifications();
      setIsEnabled(false);
      setNotice('Push reminders disabled on this device.');
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to disable push reminders.',
      );
    } finally {
      setWorking(null);
    }
  }

  async function handleTest() {
    setWorking('test');
    setError('');
    setNotice('');

    try {
      const result = await sendTestPushNotification();

      setNotice(
        `Test notification sent to ${result.sent ?? 1} subscription(s).`,
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to send a test notification.',
      );
    } finally {
      setWorking(null);
    }
  }

  return (
    <section className="rounded-xl border border-[#e7e7e2] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff0eb] text-[#fa3600]">
            <Bell size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Push reminders</h2>

            <p className="mt-1 max-w-xl text-sm text-[#72726f]">
              Receive browser notifications for scheduled habits,
              including when the app tab is closed.
            </p>

            <p className="mt-2 text-xs text-[#72726f]">
              {!isSupported
                ? 'This browser or connection does not support push notifications.'
                : isChecking
                  ? 'Checking this device...'
                  : isEnabled
                    ? `Enabled on this device. Browser permission: ${permission}.`
                    : `Not enabled on this device. Browser permission: ${permission}.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:shrink-0">
          {isEnabled ? (
            <>
              <button
                type="button"
                disabled={Boolean(working) || isChecking}
                onClick={() => void handleTest()}
                className={buttonClass}
              >
                {working === 'test' ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Test
              </button>

              <button
                type="button"
                disabled={Boolean(working) || isChecking}
                onClick={() => void handleDisable()}
                className={buttonClass}
              >
                {working === 'disable' ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <BellOff size={16} />
                )}
                Disable
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={
                !isSupported ||
                isChecking ||
                Boolean(working)
              }
              onClick={() => void handleEnable()}
              className={primaryClass}
            >
              {working === 'enable' || isChecking ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Bell size={16} />
              )}
              Enable reminders
            </button>
          )}
        </div>
      </div>

      {(error || notice) && (
        <div
          className={`mt-4 rounded-lg border px-3 py-2.5 text-sm ${
            error
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
          role={error ? 'alert' : 'status'}
        >
          {error || notice}
        </div>
      )}
    </section>
  );
}
