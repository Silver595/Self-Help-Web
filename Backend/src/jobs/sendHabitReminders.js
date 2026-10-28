
import mongoose from 'mongoose';

import connectDB from '../db/index.js';

import { Habit } from '../models/habit.model.js';
import { HabitLog } from '../models/habitLog.model.js';

import {
  WebPushSubscription,
} from '../models/pushSubscription.model.js';

import {
  HabitReminderDelivery,
} from '../models/habitReminderDelivery.model.js';

import {
  getVapidPublicKey,
  sendWebPush,
} from '../services/pushNotification.service.js';

function getLocalDateTime(now, timezone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

function minutesOfDay(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

const deliveryKey = (habitId, date) =>
  `${habitId.toString()}:${date}`;

async function sendDueHabitReminders() {
  // Fail fast if the required push configuration is missing.
  getVapidPublicKey();

  const now = new Date();

  const habits = await Habit.find({
    isArchived: false,
    'reminder.enabled': true,
    'reminder.time': { $type: 'string' },
  }).select(
    'user title timezone reminder target schedule startDate endDate',
  );

  const candidates = [];

  for (const habit of habits) {
    const reminderTime = habit.reminder?.time;

    if (!reminderTime) continue;

    const local = getLocalDateTime(now, habit.timezone);
    const minutesLate =
      minutesOfDay(local.time) - minutesOfDay(reminderTime);

    // A five-minute retry window recovers small scheduler delays.
    // The delivery model prevents duplicate successful sends.
    if (minutesLate < 0 || minutesLate > 4) continue;

    if (!habit.isScheduledOn(local.date)) continue;

    candidates.push({
      habit,
      date: local.date,
      reminderTime,
    });
  }

  if (candidates.length === 0) {
    console.log('Habit reminders: none due in this run.');
    return { sent: 0, failed: 0 };
  }

  const logs = await HabitLog.find({
    $or: candidates.map(({ habit, date }) => ({
      habit: habit._id,
      date,
    })),
  })
    .select('habit date value')
    .lean();

  const valueByHabitDate = new Map(
    logs.map((log) => [
      deliveryKey(log.habit, log.date),
      log.value,
    ]),
  );

  const activeCandidates = candidates.filter(({ habit, date }) => {
    const value =
      valueByHabitDate.get(deliveryKey(habit._id, date)) ?? 0;

    // Don't notify if the target has already been met today.
    return !habit.isComplete(value);
  });

  if (activeCandidates.length === 0) {
    console.log('Habit reminders: all due habits are already complete.');
    return { sent: 0, failed: 0 };
  }

  const userIds = [
    ...new Set(
      activeCandidates.map(({ habit }) => habit.user.toString()),
    ),
  ];

  const subscriptions = await WebPushSubscription.find({
    user: { $in: userIds },
  }).lean();

  const subscriptionsByUser = new Map();

  for (const subscription of subscriptions) {
    const userId = subscription.user.toString();
    const current = subscriptionsByUser.get(userId) ?? [];
    current.push(subscription);
    subscriptionsByUser.set(userId, current);
  }

  let sent = 0;
  let failed = 0;

  for (const candidate of activeCandidates) {
    const { habit, date, reminderTime } = candidate;

    const userSubscriptions =
      subscriptionsByUser.get(habit.user.toString()) ?? [];

    for (const subscription of userSubscriptions) {
      const criteria = {
        habit: habit._id,
        date,
        reminderTime,
        subscription: subscription._id,
      };

      const delivery = await HabitReminderDelivery.findOneAndUpdate(
        criteria,
        {
          $setOnInsert: {
            user: habit.user,
            status: 'pending',
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      if (delivery.status === 'sent') continue;

      try {
        await sendWebPush(subscription, {
          title: 'Growth OS habit reminder',
          body: `It's time for "${habit.title}". Your daily target is ${habit.target.count} ${habit.target.unit}.`,
          url: '/habits',
          tag: `habit-${habit._id}-${date}`,
        });

        await HabitReminderDelivery.updateOne(criteria, {
          $set: {
            status: 'sent',
            sentAt: new Date(),
          },
          $unset: {
            lastError: 1,
          },
          $inc: {
            attempts: 1,
          },
        });

        sent += 1;
      } catch (error) {
        const statusCode = error?.statusCode ?? error?.status;

        await HabitReminderDelivery.updateOne(criteria, {
          $set: {
            status: 'failed',
            lastError: String(error?.message ?? error).slice(0, 500),
          },
          $inc: {
            attempts: 1,
          },
        });

        if (statusCode === 404 || statusCode === 410) {
          await WebPushSubscription.deleteOne({
            _id: subscription._id,
          });
        }

        failed += 1;

        console.error(
          `Reminder delivery failed for habit ${habit._id}:`,
          error?.message ?? error,
        );
      }
    }
  }

  console.log(
    `Habit reminders finished. Sent: ${sent}; failed: ${failed}.`,
  );

  return { sent, failed };
}

try {
  await connectDB();
  await sendDueHabitReminders();
} catch (error) {
  console.error('Habit reminder job failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
