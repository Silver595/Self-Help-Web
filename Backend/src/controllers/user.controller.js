import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import {
  registerSchema,
  loginSchema,
  updateFullNameSchema,
  updatePasswordSchema,
} from '../validators/auth.validator.js';

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
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0].message || 'Invalid request data',
    );
  }

  // result.data is clean validated data
  const { fullname, email, username, password } = result.data;


  // The difference between findOne and findById is that findOne allows you to search for a document based on any field or combination of fields, while findById specifically searches for a document by its unique identifier (_id). In this case, we are using findOne to check if a user with the provided email already exists in the database.
  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, 'User with email already exists');
  }

  // Create the user in the database
  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
  });

  // Select the user without the password and refreshToken fields to return in the response
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User Registered successfully!'));
});

const loginUser = asyncHandler(async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0].message || 'Invalid request data',
    );
  }

  // Destructure email and password from the request body
  const { email, password } = result.data;

 

  // Find the user using email field
  const user = await User.findOne({ email });

  // If user dont exist we throw an error
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  // We check if password provided is correct or not
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  // If not we throw an error
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid user credentials');
  }
  // generate access and refresh tokens for the user
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  // options are provided so that we dont modify cookies in frontend
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
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
  // Finding the user by ID and unSetting the user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    // New is used here to send the updated document
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'Logout successful'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // I was getting undefined for req.cookies.refreshToken, so I added a fallback to req.body.refreshToken. This way, if the refresh token is not found in the cookies, it will check the request body for the refresh token. This ensures that the refresh token can be retrieved from either source, allowing for more flexibility in how the client sends the refresh token.
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed',
        ),
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message ||
        'Something went wrong while refreshing the access token',
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const result = updatePasswordSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0].message || 'Invalid request data',
    );
  }

  const { oldPassword, newPassword } = result.data;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Old password and new password are required');
  }
  // If old password and new password are same then we throw an error
  if (oldPassword === newPassword) {
    throw new ApiError(400, 'New password cannot be same as old password');
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Incorrect old password');
  }

  // validateBeforeSave is set to false because we don't want to run the validation again, as we are only updating the password field. This is important because if we had other required fields in the user schema that are not being updated, the validation would fail and throw an error. By setting validateBeforeSave to false, we bypass the validation for those fields and only update the password.
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user fetched successfully'));
});

const changeCurrentName = asyncHandler(async (req, res) => {
  const result = updateFullNameSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0].message || 'Invalid request data',
    );
  }

  const { fullname } = result.data;

  if (!fullname) {
    throw new ApiError(400, 'Full name is required');
  }

  if (fullname === req.user?.fullname) {
    throw new ApiError(400, 'New full name cannot be same as old full name');
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
      },
    },
    { new: true },
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Account details updated successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  changeCurrentName,
};
