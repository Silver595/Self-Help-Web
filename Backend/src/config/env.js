import 'dotenv/config';
import { z } from 'zod';

const fixTestSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
      PORT: z.coerce.number().default(8000),
      MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
      CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
      ACCESS_TOKEN_SECRET: z.string().min(32, 'must be at least 32 chars'),
      ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
      REFRESH_TOKEN_SECRET: z.string().min(32, 'must be at least 32 chars'),
      REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
})
  .refine((e) => e.ACCESS_TOKEN_SECRET !== e.REFRESH_TOKEN_SECRET, {
    message: 'ACCSES_TOKEN_SECRET and REFRESH_TOKEN_SECRET must differ',
    path: ['REFRESH_TOKEN_SECRET'],
  })
