
import { Router } from 'express';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  pushSubscriptionSchema,
  removePushSubscriptionSchema,
} from '../validators/notification.validator.js';

import {
  getNotificationPublicKey,
  savePushSubscription,
  removePushSubscription,
  sendTestNotification,
} from '../controllers/notification.controller.js';

const router = Router();

router.use(verifyJWT);

router.get('/public-key', getNotificationPublicKey);

router.post(
  '/subscribe',
  validate(pushSubscriptionSchema),
  savePushSubscription,
);

router.delete(
  '/subscription',
  validate(removePushSubscriptionSchema),
  removePushSubscription,
);

router.post('/test', sendTestNotification);

export default router;
