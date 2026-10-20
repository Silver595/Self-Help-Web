// Why a controller at all? Without it, you’d write all the logic inside the route definition, and your routes file would become thousands of lines of mixed-up code. A controller is just a function that:

// Takes the request (req)
// Does the work (validate input, check whether the user exists, hash the password, save to the DB)
// Sends back a response (res)

import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating tokens');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // add validations - not empty
  // check if user already exists: Check using email or username
  // create user object - create entry in db
  // remove password & refresh token field from response
  // check for user creation
  // Return res
  // console.log('Content-Type:', req.headers['content-type']);
  // console.log('Body:', req.body);
  const { email, username, password, fullname } = req.body;
  // console.log(
  //   `Email: ${email} username:${username}, password:${password} fullname:${fullname}`,
  // );
  //   Using some method to check that even after trim are we still getting the empty result
  if (
    [fullname, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All is required');
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  console.log(existedUser);
  if (existedUser) {
    throw new ApiError(409, 'User with email already exists');
  }

  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Registered successfully!'));
});

const loginUser = asyncHandler(async (req, res) => {
  // Check if request exists or not
  // Check if all the data that is give is valid or not, trim, etc
  // Check if account exist
  // check if the password that is sent is equal or not, for that decrypt the passwordas well then check it
  // If the account exists in db & matches the password, redirect to next page

  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  // Await cuz it take times to see in database
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid User credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully',
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'Logout successfull'));
});

export { registerUser, loginUser, logoutUser };
