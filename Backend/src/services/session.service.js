import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { toMs } from '../utils/duration.js';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';

// Store only a hash: a DB leak then gives attackers no usable tokens.
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const refreshExpiry = () =>
  new Date(Date.now() + toMs(env.REFRESH_TOKEN_EXPIRY));

export const createSession = async (user, req) => {
  const session = new Session({
    user: user._id, // _id exists before saving, so the token can embed it
    userAgent: req.get('user-agent') || 'unknown',
    ip: req.ip || 'unknown',
    expiresAt: refreshExpiry(),
  });

  const refreshToken = user.generateRefreshToken(session._id);
  session.tokenHash = hashToken(refreshToken);
  await session.save();

  return { accessToken: user.generateAccessToken(session._id), refreshToken };
};

export const rotateSession = async (incomingToken) => {
  let decoded;
  try {
    decoded = jwt.verify(incomingToken, env.REFRESH_TOKEN_SECRET, {
      algorithms: ['HS256'],
    });
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
  if (!decoded.sid) throw new ApiError(401, 'Invalid refresh token');

  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(401, 'Invalid refresh token');

  const newRefreshToken = user.generateRefreshToken(decoded.sid);

  // Atomic swap: only succeeds if the presented token IS the current one.
  const session = await Session.findOneAndUpdate(
    { _id: decoded.sid, user: user._id, tokenHash: hashToken(incomingToken) },
    {
      tokenHash: hashToken(newRefreshToken),
      lastUsedAt: new Date(),
      expiresAt: refreshExpiry(),
    },
    { new: true },
  );

  if (!session) {
    // Valid signature but not the current token => an old token is being
    // replayed (possible theft). Kill the whole session.
    await Session.deleteOne({ _id: decoded.sid, user: user._id });
    throw new ApiError(401, 'Session no longer valid. Please log in again');
  }

  return {
    accessToken: user.generateAccessToken(session._id),
    refreshToken: newRefreshToken,
  };
};
