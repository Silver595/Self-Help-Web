import { ApiError } from './ApiError.js';

/*
  A habit "day" is a calendar day, not a moment in time, so every date in the
  habit feature is a "YYYY-MM-DD" string. Math is done on UTC day numbers,
  which avoids local-time and DST bugs.
*/

export const DAY_MS = 24 * 60 * 60 * 1000;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const MAX_RANGE_DAYS = 366;

// Date.parse("YYYY-MM-DD") is always UTC midnight, so this is an exact integer
export const dayNumber = (dateStr) => Math.floor(Date.parse(dateStr) / DAY_MS);
export const fromDayNumber = (n) => new Date(n * DAY_MS).toISOString().slice(0, 10);
export const addDays = (dateStr, days) => fromDayNumber(dayNumber(dateStr) + days);
export const weekdayOf = (dateStr) => new Date(`${dateStr}T00:00:00Z`).getUTCDay(); // 0 = Sunday

// Rejects bad formats AND impossible dates such as 2026-02-30
export const isValidDateString = (value) => {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

export const isValidTimezone = (tz) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

// "Today" as a YYYY-MM-DD string in the given timezone (en-CA formats as YYYY-MM-DD)
export const todayInTimezone = (timezone = 'Asia/Kolkata') =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

// Throws a 400 if the value is not a real YYYY-MM-DD date
export const assertDate = (value, label = 'date') => {
  if (!isValidDateString(value)) {
    throw new ApiError(400, `${label} must be a valid date in YYYY-MM-DD format`);
  }
};

// Reusable Mongoose validator object for date-string fields
export const dateValidator = {
  validator: isValidDateString,
  message: (props) => `${props.path} must be a valid YYYY-MM-DD date`,
};