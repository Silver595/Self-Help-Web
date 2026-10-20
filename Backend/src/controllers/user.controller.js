// Why a controller at all? Without it, you’d write all the logic inside the route definition, and your routes file would become thousands of lines of mixed-up code. A controller is just a function that:

// Takes the request (req)
// Does the work (validate input, check whether the user exists, hash the password, save to the DB)
// Sends back a response (res)

import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // add validations - not empty
  // check if user already exists: Check using email or username
  // create user object - create entry in db
  // remove password & refresh token field from response
  // check for user creation
  // Return res

  const { email, username, password, fullname } = req.body;
  console.log(
    `Email: ${email} username:${username}, password:${password} fullname:${fullname}`,
  );
//   Using some method to check that even after trim are we still getting the empty result
  if (
    [fullname, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All is required');
  }

  const existedUser = User.findOne(email)
  
  console.log(existedUser)
  if(existedUser){
      throw new ApiError(409,'User with email already exists')
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }
    return res.status(201).json(new ApiResponse(200,createdUser,"User Registered successfully!"))
    

});

export { registerUser };
