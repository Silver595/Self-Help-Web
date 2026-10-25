import { z } from 'zod';
import { paginationQuerySchema, atLeastOneField } from './common.validator.js';

const MOODS = ['Productive', 'Calm', 'Stressed', 'Motivated', 'Reflective'];

export const createJournalSchema = z.object({
  title: z.string().trim().min(1, 'Journal title is required').max(200),
  content: z.string().trim().min(1, 'Journal content is required').max(20000),
  mood: z.enum(MOODS).optional(),
});

export const updateJournalSchema = createJournalSchema
  .partial()
  .refine(atLeastOneField, 'Provide at least one field to update');

export const journalQuerySchema = paginationQuerySchema;
