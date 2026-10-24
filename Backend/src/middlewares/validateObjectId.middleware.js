import { ApiError } from "../utils/ApiError.js";

export const validateObjectIdParam = (_req, _res, next, value) => {
  // Regex on purpose: mongoose's isValid() also accepts any 12-character string
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
      return next(new ApiError(400, 'Invalid ID format'));
    }
  next();
}
