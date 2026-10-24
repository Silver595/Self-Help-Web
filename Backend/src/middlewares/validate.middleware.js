import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return next(new ApiError(400, errors[0].message, errors));
  }

  // zod strips unknown keys, so a client can't sneak in { user: "someoneElse" }
  if (source === 'query') req.validQuery = result.data; // req.query is read-only in Express 5
  else req[source] = result.data;
  next();
};
