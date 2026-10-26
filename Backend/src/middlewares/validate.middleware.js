import { ApiError } from '../utils/ApiError.js';

// zod says "expected string, received undefined" for a missing field.
// Turn that into "title is required".
const friendly = (issue) =>
  issue.code === 'invalid_type' && /received undefined/.test(issue.message)
    ? issue.path.join('.') + ' is required'
    : issue.message;

export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const errors = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: friendly(i),
      }));
      return next(new ApiError(400, errors[0].message, errors));
    }

    // zod strips unknown keys, so a client can't sneak in { user: "someoneElse" }
    if (source === 'query')
      req.validQuery = result.data; // req.query is read-only in Express 5
    else req[source] = result.data;
    next();
  };
