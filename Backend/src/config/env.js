import 'dotenv/config';
import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().default(8000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
    ACCESS_TOKEN_SECRET: z.string().min(32, 'must be at least 32 chars'),
    ACCESS_TOKEN_EXPIRY: z
      .string()
      .regex(/^\d+[smhd]$/, 'use e.g. 15m, 12h, 7d')
      .default('15m'),
    REFRESH_TOKEN_SECRET: z.string().min(32, 'must be at least 32 chars'),
    REFRESH_TOKEN_EXPIRY: z
      .string()
      .regex(/^\d+[smhd]$/, 'use e.g. 15m, 12h, 7d')
      .default('7d'),
  })
  .refine((e) => e.ACCESS_TOKEN_SECRET !== e.REFRESH_TOKEN_SECRET, {
    message: 'ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must differ',
    path: ['REFRESH_TOKEN_SECRET'],
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
