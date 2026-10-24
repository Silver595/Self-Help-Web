import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  changeCurrentName,
  logoutAll,
  getSessions,
  revokeSession
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
// Unsecured Routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

router.route('/logout-all').post(verifyJWT, logoutAll);
router.route('/sessions').get(verifyJWT, getSessions);
router.route('/sessions/:id').delete(verifyJWT, revokeSession);

// Secured Routes (Requires JWT authentication)
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/update-account').patch(verifyJWT, changeCurrentName);

export default router;
