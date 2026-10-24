import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.middleware.js';
import {
  createJournalSchema,
  journalQuerySchema,
  updateJournalSchema,
} from '../validators/journal.validator.js';
import {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} from '../controllers/journal.controller.js';

const router = Router();

router.use(verifyJWT);
router.param('id', validateObjectIdParam);

router
  .route('/')
  .post(validate(createJournalSchema), createJournal)
  .get(validate(journalQuerySchema, 'query'), getJournals);

router
  .route('/:id')
  .patch(validate(updateJournalSchema), updateJournal)
  .delete(deleteJournal);

export default router;
