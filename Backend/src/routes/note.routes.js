import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from '../controllers/note.controller.js';

const router = Router();

// Apply auth middleware to all note routes
router.use(verifyJWT);

// Base route: /api/v1/notes (GET supports query filters like ?resourceId=... or ?habitId=...)
router.route('/').post(createNote).get(getNotes);

// Modify route: /api/v1/notes/:id
router.route('/:id').patch(updateNote).delete(deleteNote);

export default router;