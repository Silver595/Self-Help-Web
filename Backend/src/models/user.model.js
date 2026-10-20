// Models define the shape of your data using Mongoose schemas, for example a User with a username, email, and password. A model is also your interface to the database: User.create(), User.findOne(), and so on. Controllers use models to read and write data, so controllers never need to know how the database works internally.

import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is needed'],
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
