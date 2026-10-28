
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import {
  WebPushSubscription,
} from '../models/pushSubscription.model.js';

import {
  getVapidPublicKey,
  sendWebPush,
} from '../services/pushNotification.service.js';

export const getNotificationPublicKey = asyncHandler(
  async (_req, res) => {
    const publicKey = getVapidPublicKey();

    return res.status(200).json(
      new ApiResponse(
        200,
        { publicKey },
        'Push notification key fetched',
      ),
    );
  },
);

export const savePushSubscription = asyncHandler(
  async (req, res) => {
    const { endpoint, keys } = req.body;

    await WebPushSubscription.findOneAndUpdate(
      { endpoint },
      {
        $set: {
          user: req.user._id,
          endpoint,
          keys,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        { enabled: true },
        'Push subscription saved',
      ),
    );
  },
);

export const removePushSubscription = asyncHandler(
  async (req, res) => {
    const { endpoint } = req.body;

    await WebPushSubscription.deleteOne({
      user: req.user._id,
      endpoint,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { removed: true },
        'Push subscription removed',
      ),
    );
  },
);

export const sendTestNotification = asyncHandler(
  async (req, res) => {
    // Also verifies that VAPID is correctly configured.
    getVapidPublicKey();

    const subscriptions = await WebPushSubscription.find({
      user: req.user._id,
    });

    if (subscriptions.length === 0) {
      throw new ApiError(
        400,
        'Enable push reminders on this device first.',
      );
    }

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await sendWebPush(subscription, {
            title: 'Growth OS reminder test',
            body: 'Push notifications are working on this device.',
            url: '/habits',
            tag: 'growth-os-test',
          });
        } catch (error) {
          const statusCode = error?.statusCode ?? error?.status;

          // These endpoints are no longer valid.
          if (statusCode === 404 || statusCode === 410) {
            await WebPushSubscription.deleteOne({
              _id: subscription._id,
            });
          }

          throw error;
        }
      }),
    );

    const sent = results.filter(
      (result) => result.status === 'fulfilled',
    ).length;

    if (sent === 0) {
      throw new ApiError(
        502,
        'The test notification could not be delivered. Check the subscription and server logs.',
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { sent },
        'Test notification sent',
      ),
    );
  },
);
