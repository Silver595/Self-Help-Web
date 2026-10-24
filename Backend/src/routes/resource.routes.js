import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.middleware.js';
import {
  createResourceSchema,
  resourceQuerySchema,
  updateResourceSchema,
} from '../validators/resource.validator.js';
import {
  createResource,
  getResources,
  updateResource,
  deleteResource,
} from '../controllers/resource.controller.js';

const router = Router();

router.use(verifyJWT);
router.param('id', validateObjectIdParam);

router
  .route('/')
  .post(validate(createResourceSchema), createResource)
  .get(validate(resourceQuerySchema, 'query'), getResources);

router
  .route('/:id')
  .patch(validate(updateResourceSchema), updateResource)
  .delete(deleteResource);

export default router;
