import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createResource,
  getResources,
  updateResource,
  deleteResource,
} from '../controllers/resource.controller.js';

const router = Router();

// Apply verifyJWT middleware to all routes in this file (Secured)
router.use(verifyJWT);

// Base route: /api/v1/resources
router.route('/').post(createResource).get(getResources);

// Dynamic ID route: /api/v1/resources/:id
router.route('/:id').patch(updateResource).delete(deleteResource);

export default router;