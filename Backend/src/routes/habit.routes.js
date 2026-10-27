import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.middleware.js';
import { weeklySummaryQuerySchema } from '../validators/habit.validator.js';
import {
  createHabitSchema,
  updateHabitSchema,
  logSchema,
  statsQuerySchema,
  listQuerySchema,
} from '../validators/habit.validator.js';
import {
  createHabit,
  getHabits,
  getTodayHabits,
  getHabit,
  updateHabit,
  archiveHabit,
  unarchiveHabit,
  deleteHabit,
  setHabitLog,
  deleteHabitLog,
  getHabitStats,
} from '../controllers/habit.controller.js';

const router = Router();

// Every habit route requires a logged-in user
router.use(verifyJWT);
router.param('id', validateObjectIdParam);

// Mounted in app.js as: app.use('/api/v1/habits', habitRouter)

// Collection
router
  .route('/')
  .post(validate(createHabitSchema), createHabit)
  .get(validate(listQuerySchema, 'query'), getHabits);

// Must come BEFORE '/:id', otherwise Express treats "today" as an id
router.route('/today').get(getTodayHabits);

// Single habit
router
  .route('/:id')
  .get(getHabit)
  .patch(validate(updateHabitSchema), updateHabit)
  .delete(deleteHabit);
router.route('/:id/archive').patch(archiveHabit);
router.route('/:id/unarchive').patch(unarchiveHabit);
router
  .route('/:id/stats')
  .get(validate(statsQuerySchema, 'query'), getHabitStats);

// History: PUT is idempotent, so sending it twice gives the same result
router
  .route('/:id/logs/:date')
  .put(validate(logSchema), setHabitLog)
  .delete(deleteHabitLog);

export default router;
