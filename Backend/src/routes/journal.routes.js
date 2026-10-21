import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} from '../controllers/journal.controller.js';

const router = Router();

// Apply auth middleware to all journal routes
router.use(verifyJWT);

// Base route: /api/v1/journals
router.route('/').post(createJournal).get(getJournals);

// Modify route: /api/v1/journals/:id
router.route('/:id').patch(updateJournal).delete(deleteJournal);

export default router;