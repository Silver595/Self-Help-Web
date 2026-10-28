
import { z } from 'zod';

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url().max(2048),
  keys: z.object({
    p256dh: z.string().min(1).max(1024),
    auth: z.string().min(1).max(1024),
  }),
});

export const removePushSubscriptionSchema = z.object({
  endpoint: z.string().url().max(2048),
});
