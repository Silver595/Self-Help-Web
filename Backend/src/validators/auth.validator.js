import { z } from 'zod';

const fullnameSchema = z
  .string()
  .min(2, 'Name is too short')
  .regex(/^[A-Za-z ]+$/, 'Full name can only contain letters');
const emailSchema = z.email('Invalid email');

const passwordSchema = z
  .string({ error: 'password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password at most be 72 characters')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/\d/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character')
  .regex(/^\S*$/, 'Password must not contain whitespace'); //fdeeAD443@!

const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .regex(
    /^[a-zA-Z0-9_\.]+$/,
    'Username can only contain alphanumeric characters, underscores, and periods',
  );

const registerSchema = z.object({
  fullname: fullnameSchema,
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  //   Username can contain alphanumeric characters, underscores, and periods. It must be between 3 and 30 characters long.
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const updateFullNameSchema = z.object({
  fullname: fullnameSchema,
});

const updatePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export {
  registerSchema,
  loginSchema,
  updateFullNameSchema,
  updatePasswordSchema,
};
