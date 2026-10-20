// Routes answer the question: “Which URL + HTTP method triggers which controller?” They don’t contain logic.

import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router(

)



router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
// Will add to the register routes, htps://localhost:8000/users/login

// Secured routes
router.route("/logout").post(verifyJWT,logoutUser)
export default router;