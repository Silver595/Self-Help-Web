import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  changeCurrentName,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Unsecured Routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

// Secured Routes (Requires JWT authentication)
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/update-account').patch(verifyJWT, changeCurrentName);

export default router;