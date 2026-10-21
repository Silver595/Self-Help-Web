import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createHabit,
  getHabits,
  toggleHabit,
  deleteHabit,
} from '../controllers/habit.controller.js';

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// Base route: /api/v1/habits
router.route('/').post(createHabit).get(getHabits);

// Action routes
router.route('/:id/toggle').patch(toggleHabit);
router.route('/:id').delete(deleteHabit);

export default router;