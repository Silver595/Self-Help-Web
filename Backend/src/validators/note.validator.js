import { z } from 'zod';
import { paginationQuerySchema, atLeastOneField, objectIdSchema } from './common.validator.js';

export const createNoteSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().trim().min(1, 'Note content is required').max(20000),
  resourceId: objectIdSchema.optional(),
  habitId: objectIdSchema.optional(),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().max(200).optional(),
    content: z.string().trim().min(1, 'Note content is required').max(20000).optional(),
    resourceId: objectIdSchema.optional(),
    habitId: objectIdSchema.optional(),
  })
  .refine(atLeastOneField, 'Provide at least one field to update');

export const noteQuerySchema = paginationQuerySchema.extend({
  resourceId: objectIdSchema.optional(),
  habitId: objectIdSchema.optional(),
});
