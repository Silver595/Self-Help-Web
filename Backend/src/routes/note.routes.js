import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.middleware.js';
import {
  createNoteSchema,
  noteQuerySchema,
  updateNoteSchema,
} from '../validators/note.validator.js';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from '../controllers/note.controller.js';

const router = Router();

router.use(verifyJWT);
router.param('id', validateObjectIdParam);

router
  .route('/')
  .post(validate(createNoteSchema), createNote)
  .get(validate(noteQuerySchema, 'query'), getNotes);

router
  .route('/:id')
  .patch(validate(updateNoteSchema), updateNote)
  .delete(deleteNote);

export default router;
