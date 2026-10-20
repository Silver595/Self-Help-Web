// Routes answer the question: “Which URL + HTTP method triggers which controller?” They don’t contain logic.

import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router(

)



router.route("/register").post(registerUser)
// Will add to the register routes, htps://localhost:8000/users/login
export default router;