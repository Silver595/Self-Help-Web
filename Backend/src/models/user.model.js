// Models define the shape of your data using Mongoose schemas, for example a User with a username, email, and password. A model is also your interface to the database: User.create(), User.findOne(), and so on. Controllers use models to read and write data, so controllers never need to know how the database works internally.

import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
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
    refershToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// This export User can directy contact with mongoose database
userSchema.pre("save",async function (next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {_id:this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullname
  },
  process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}

export const User = mongoose.model('User', userSchema);
