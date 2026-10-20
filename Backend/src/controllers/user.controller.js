// Why a controller at all? Without it, you’d write all the logic inside the route definition, and your routes file would become thousands of lines of mixed-up code. A controller is just a function that:

// Takes the request (req)
// Does the work (validate input, check whether the user exists, hash the password, save to the DB)
// Sends back a response (res)

import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req,res)=>{
    //    Get user details from frontend
    
})

export {registerUser}