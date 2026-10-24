import { z } from 'zod';
import { paginationQuerySchema, atLeastOneField } from './common.validator.js';

const TYPES = ['Book', 'Article', 'YouTube','Documentory'];
const STATUSES = ['Plan to Do', 'In progress', 'Completed'];

export const createResourceSchema = z.object({
  title: z.string({ error: 'Title is required' }).trim().min(1, 'Title is required').max(200),
  type: z.enum(TYPES, { error: 'Type must be Book, Article or YouTube' }),
  // http(s) only: blocks javascript: links that would become XSS when rendered as href
  link: z
    .url('Invalid link')
    .refine((v) => /^https?:\/\//i.test(v), 'Link must start with http:// or https://')
    .optional(),
  author: z.string().trim().max(120).optional(),
  status: z.enum(STATUSES, { error: 'Invalid status' }).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export const updateResourceSchema = createResourceSchema
  .partial()
  .refine(atLeastOneField, 'Provide at least one field to update');

export const resourceQuerySchema = paginationQuerySchema.extend({
  type: z.enum(TYPES).optional(),
  status: z.enum(STATUSES).optional(),
});
